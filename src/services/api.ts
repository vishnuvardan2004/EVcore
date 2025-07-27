import { config } from '../config/environment';

export interface APIResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface APIError {
  message: string;
  code?: string;
  status?: number;
}

class APIService {
  private baseURL: string;
  
  constructor() {
    this.baseURL = config.API_BASE_URL;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || `HTTP Error: ${response.status}`,
          status: response.status,
          code: errorData.code,
        } as APIError;
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        throw {
          message: 'Network error. Please check your connection.',
          status: 0,
        } as APIError;
      }
      throw error;
    }
  }

  // Authentication endpoints
  auth = {
    login: (credentials: { email: string; password: string }) =>
      this.request<{ token: string; user: any }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    
    logout: () =>
      this.request('/api/auth/logout', {
        method: 'POST',
      }),
    
    refreshToken: () =>
      this.request<{ token: string }>('/api/auth/refresh', {
        method: 'POST',
      }),
    
    verifyToken: () =>
      this.request<{ user: any }>('/api/auth/verify', {
        method: 'GET',
      }),
  };

  // Vehicle management endpoints
  vehicles = {
    getAll: (params?: { 
      search?: string; 
      status?: string; 
      type?: string;
      page?: number;
      limit?: number;
    }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const query = queryParams.toString();
      return this.request<any[]>(`/api/vehicles${query ? `?${query}` : ''}`);
    },
    
    getById: (id: string) =>
      this.request<any>(`/api/vehicles/${id}`),
    
    create: (data: any) =>
      this.request<any>('/api/vehicles', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: any) =>
      this.request<any>(`/api/vehicles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      this.request(`/api/vehicles/${id}`, {
        method: 'DELETE',
      }),
  };

  // Booking management endpoints
  bookings = {
    getAll: (params?: { 
      status?: string; 
      type?: string;
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
    }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const query = queryParams.toString();
      return this.request<any[]>(`/api/bookings${query ? `?${query}` : ''}`);
    },
    
    create: (data: any) =>
      this.request<any>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: any) =>
      this.request<any>(`/api/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    cancel: (id: string, reason?: string) =>
      this.request(`/api/bookings/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }),
  };

  // User management endpoints
  users = {
    getAll: (params?: { role?: string; page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const query = queryParams.toString();
      return this.request<any[]>(`/api/users${query ? `?${query}` : ''}`);
    },
    
    create: (data: any) =>
      this.request<any>('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: any) =>
      this.request<any>(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  };

  // File upload endpoint
  upload = {
    single: (file: File, type: 'document' | 'image' = 'document') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      return this.request<{ url: string; filename: string }>('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          // Remove Content-Type to let browser set boundary for FormData
        },
      });
    },
  };

  // Dashboard/Analytics endpoints
  dashboard = {
    getStats: () =>
      this.request<any>('/api/dashboard/stats'),
    
    getRecentActivity: (limit = 10) =>
      this.request<any[]>(`/api/dashboard/activity?limit=${limit}`),
  };
}

export const apiService = new APIService();
export default apiService;
