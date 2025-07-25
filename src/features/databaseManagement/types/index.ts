// Master Database Management System - Type Definitions

// Asset Database Types

export interface Vehicle {
  id: string;
  vin: string;
  engineNumber: string;
  registrationNumber: string;
  model: string;
  styleClass: 'SUV' | 'Sedan' | 'Hatchback' | 'Coupe' | 'Truck' | 'Van';
  brand: string;
  type: 'Electric' | 'Hybrid' | 'Petrol' | 'Diesel';
  batteryNumber: string;
  tyreNumbers: string[];
  chargerNumber: string;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Out of Service';
  purchaseDate: string;
  warrantyExpiry: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ChargingEquipment {
  id: string;
  equipmentNumber: string;
  model: string;
  brand: string;
  powerOutput: string; // kW
  connectorType: 'Type 1' | 'Type 2' | 'CCS' | 'CHAdeMO' | 'Tesla';
  location: string;
  status: 'Active' | 'Maintenance' | 'Out of Service';
  installationDate: string;
  warrantyExpiry: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ElectricalEquipment {
  id: string;
  equipmentNumber: string;
  type: 'Panel' | 'Cable' | 'Switch' | 'Transformer' | 'Generator' | 'UPS';
  brand: string;
  model: string;
  voltage: string;
  amperage: string;
  location: string;
  status: 'Active' | 'Maintenance' | 'Out of Service';
  installationDate: string;
  warrantyExpiry: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ITEquipment {
  id: string;
  equipmentNumber: string;
  type: 'Computer' | 'Laptop' | 'Tablet' | 'Server' | 'Network' | 'Printer' | 'Phone';
  brand: string;
  model: string;
  serialNumber: string;
  specifications: string;
  assignedTo?: string;
  location: string;
  status: 'Active' | 'Maintenance' | 'Out of Service' | 'Assigned' | 'Available';
  purchaseDate: string;
  warrantyExpiry: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface InfraFurniture {
  id: string;
  itemNumber: string;
  type: string;
  category: 'Infrastructure' | 'Furniture';
  brand: string;
  model: string;
  description: string;
  location: string;
  room: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Needs Replacement';
  purchaseDate: string;
  warrantyExpiry: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Resource Database Types

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  role: UserRole;
  supervisor?: string;
  hireDate: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'Terminated';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Pilot {
  id: string;
  pilotId: string;
  employeeId: string; // Reference to Employee
  licenseNumber: string;
  licenseType: string;
  licenseExpiry: string;
  medicalCertificate: string;
  medicalExpiry: string;
  flightHours: number;
  certifications: string[];
  vehicleTypes: string[]; // Types of vehicles certified to operate
  status: 'Active' | 'Inactive' | 'Suspended' | 'Training';
  lastTraining: string;
  nextTraining: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Role-Based Access Control Types

export type UserRole = 
  | 'super_admin'
  | 'admin'
  | 'leadership'
  | 'manager'
  | 'supervisor'
  | 'pilot'
  | 'lead'
  | 'security'
  | 'hr'
  | 'finance'
  | 'employee';

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'manage';
}

export interface RolePermission {
  role: UserRole;
  permissions: Permission[];
  hierarchy: number; // Lower number = higher authority
}

export interface User {
  id: string;
  username: string;
  email: string;
  employeeId: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

// Database Category Types
export type AssetCategory = 'vehicles' | 'charging_equipment' | 'electrical_equipment' | 'it_equipment' | 'infra_furniture';
export type ResourceCategory = 'employees' | 'pilots';

// Common interfaces
export interface DatabaseStats {
  vehicles: number;
  chargingEquipment: number;
  electricalEquipment: number;
  itEquipment: number;
  infraFurniture: number;
  employees: number;
  pilots: number;
  totalAssets: number;
  totalResources: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  module: string;
  recordId: string;
  changes: Record<string, any>;
  timestamp: string;
  ipAddress: string;
}
