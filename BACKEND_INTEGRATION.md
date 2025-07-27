# EVCORE - Backend Integration Guide

## 🚀 Frontend is Backend-Ready!

Your EVCORE frontend application has been prepared for seamless backend integration. All necessary service layers, error handling, and API abstractions are in place.

## 📁 New Files Added

### Core Services
- `src/services/api.ts` - Comprehensive API service layer
- `src/config/environment.ts` - Environment configuration management
- `src/types/api.ts` - Complete TypeScript type definitions

### React Hooks
- `src/hooks/useAPI.ts` - Data fetching and mutation hooks
- `src/hooks/useErrorHandler.ts` - Global error handling
- `src/hooks/useWebSocket.ts` - Real-time communication

### Configuration
- `.env.example` - Environment variables template
- Updated `package.json` with backend development scripts

## 🔧 Quick Start for Backend Integration

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit with your backend URL
REACT_APP_API_URL=http://localhost:3001
```

### 2. Install Additional Dependencies (if needed)
```bash
npm install concurrently  # For running frontend + backend together
```

### 3. API Endpoints Ready
Your backend should implement these endpoints:

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/verify` - Token verification

#### Vehicles
- `GET /api/vehicles` - List vehicles (with filters)
- `POST /api/vehicles` - Create vehicle
- `GET /api/vehicles/:id` - Get vehicle by ID
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

#### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `POST /api/bookings/:id/cancel` - Cancel booking

#### Users
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user

#### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/activity` - Recent activity

#### File Upload
- `POST /api/upload` - File upload endpoint

### 4. Database Schema Suggestions

Based on your frontend types, here's a suggested database schema:

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  avatar_url TEXT,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Vehicles Table
```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number VARCHAR(20) UNIQUE NOT NULL,
  style_class VARCHAR(20) NOT NULL,
  brand VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  vin VARCHAR(17) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Available',
  location VARCHAR(100),
  purchase_date DATE NOT NULL,
  warranty_expiry DATE NOT NULL,
  mileage INTEGER DEFAULT 0,
  battery_capacity INTEGER,
  charging_type VARCHAR(50),
  insurance_expiry DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);
```

#### Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  customer_id UUID REFERENCES customers(id),
  vehicle_id UUID REFERENCES vehicles(id),
  driver_id UUID REFERENCES users(id),
  pickup_location TEXT NOT NULL,
  drop_location TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  actual_start_time TIMESTAMP,
  actual_end_time TIMESTAMP,
  distance INTEGER,
  fare DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  notes TEXT,
  cancellation_reason TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id)
);
```

### 5. Development Workflow

#### Frontend Development
```bash
npm run dev              # Start frontend dev server
npm run type-check       # Check TypeScript types
npm run lint            # Run ESLint
```

#### Full-Stack Development
```bash
npm run full-stack:dev   # Run frontend + backend together
```

## 🔥 Features Ready for Backend

### ✅ Authentication System
- JWT token management
- Role-based access control (10 roles)
- Automatic token refresh
- Secure logout

### ✅ Vehicle Management
- CRUD operations with API integration
- Advanced filtering and search
- Real-time updates ready
- File upload support

### ✅ Booking System
- Complete booking lifecycle
- Multiple booking types (airport, rental, subscription)
- Status tracking and management
- Customer management

### ✅ Real-time Features
- WebSocket connection management
- Automatic reconnection
- Event handling system
- Live updates for dashboard

### ✅ File Management
- Secure file upload
- Multiple file type support
- Progress tracking
- Error handling

### ✅ Error Handling
- Global error management
- User-friendly error messages
- Network error handling
- Retry mechanisms

## 🛠 Backend Technology Recommendations

### Node.js + Express + TypeScript
```bash
# Recommended stack
- Express.js with TypeScript
- PostgreSQL database
- JWT authentication
- Multer for file uploads
- Socket.io for real-time features
- Winston for logging
```

### Database
```bash
# Recommended: PostgreSQL
- ACID compliance
- JSON support for metadata
- Full-text search capabilities
- Excellent TypeScript support
```

### Deployment
```bash
# Recommended platforms
- Backend: Railway, Render, or AWS
- Database: Supabase, Neon, or AWS RDS
- File Storage: AWS S3 or Cloudinary
```

## 📞 API Response Format

Your backend should follow this response format:

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "meta": {  // For paginated responses
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

## 🚀 Next Steps

1. **Set up your backend project** using your preferred Node.js framework
2. **Implement authentication endpoints** first
3. **Create database migrations** based on the schema suggestions
4. **Start with vehicle CRUD operations** to test integration
5. **Add real-time features** using WebSocket
6. **Implement file upload** functionality
7. **Add comprehensive testing**

Your frontend is production-ready and will seamlessly integrate with any well-structured backend API following RESTful conventions!

## 🔗 Integration Testing

Use these mock API responses to test your frontend:

```bash
# Test authentication
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Test vehicles endpoint
curl -X GET http://localhost:3001/api/vehicles \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Ready to build an amazing full-stack EV management platform! 🚗⚡
