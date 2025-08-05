// Master Database Management System - Type Definitions

// Asset Database Types

export interface Vehicle {
  id: string;
  vehicleId: string; // Internal vehicle ID
  vinNumber: string; // Chassis ID
  engineNumber: string; // Engine serial number
  registrationNumber: string; // Number plate
  registrationDate: string; // RTO registration date
  brand: string; // Manufacturer
  model: string; // Vehicle model name
  vehicleClass: 'Hatchback' | 'Sedan' | 'Scooter' | 'SUV' | 'Truck' | 'Van'; // [Hatchback, Sedan, Scooter, etc.]
  vehicleType: 'E4W' | 'E2W' | 'Shuttle'; // [E4W, E2W, Shuttle]
  fuelType: 'Electric' | 'Hybrid' | 'NA'; // [Electric, Hybrid, NA]
  batterySerialNumber: string; // Unique battery ID
  noOfTyres: number; // e.g., 4 or 2
  tyreSerialNumbers: string; // Optional for tracking (JSON format)
  chargerSerialNumber: string; // Portable charger info
  chargerType: 'Slow' | 'Fast'; // [Slow, Fast]
  batteryCapacityKWh: number; // Capacity in kWh
  chargingPortType: string; // e.g., CCS2
  insuranceProvider: string; // Name of insurer
  insurancePolicyNo: string; // Policy reference
  insuranceExpiryDate: string; // Expiry date
  permitNumber: string; // Govt. permit
  permitExpiryDate: string; // Expiry date
  policeCertificateStatus: 'Pending' | 'Verified'; // [Pending, Verified]
  rcFile: string; // Registration Certificate file
  pucStatus: 'NA' | 'Valid' | 'Expired'; // [NA, Valid, Expired]
  vehicleCondition: 'New' | 'Good' | 'Retired'; // [New, Good, Retired]
  odometerReading: number; // Current km reading
  locationAssigned: string; // Hub/depot location
  assignedPilotId: string; // Driver ID
  maintenanceDueDate: string; // Next service due
  lastServiceDate: string; // Last maintenance
  status: 'Active' | 'In Maintenance' | 'Idle'; // [Active, In Maintenance, Idle]
  
  // Legacy fields for compatibility
  vin?: string;
  styleClass?: 'SUV' | 'Sedan' | 'Hatchback' | 'Coupe' | 'Truck' | 'Van';
  type?: 'Electric' | 'Hybrid' | 'Petrol' | 'Diesel';
  batteryNumber?: string;
  tyreNumbers?: string[];
  chargerNumber?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  location?: string;
  
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
  employeeId: string; // Unique identifier
  fullName: string; // Full legal name
  firstName?: string; // For legacy compatibility
  lastName?: string; // For legacy compatibility
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string; // For age records
  contactNumber: string; // Mobile number
  emailId: string; // Official/personal email
  aadharNumber: string; // Masked/encrypted
  panNumber: string; // Tax compliance
  address: string; // Residential address
  city: string; // For location mapping
  emergencyContact: string; // Person and contact number
  maritalStatus: 'Single' | 'Married' | 'Divorced';
  dateOfJoining: string; // Joining date
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';
  designation: string; // Job title
  department: 'Operations' | 'Marketing' | 'Tech' | 'HR' | 'Finance' | 'Other';
  reportingManagerId?: string; // Supervisor/lead ID
  shiftType: 'Morning' | 'Evening' | 'Rotational';
  workLocation: string; // Office or hub location
  employeeStatus: 'Active' | 'On Leave' | 'Terminated';
  salaryMode: 'Bank' | 'UPI' | 'Cash';
  monthlySalary: number; // Gross amount
  bankAccountNumber?: string; // For salary credit
  ifscCode?: string; // For bank transfers
  uanNumber?: string; // For EPF
  esicNumber?: string; // For insurance
  pfEligible: boolean; // Yes/No
  photoUrl?: string; // Profile photo path
  dlCopyUrl?: string; // DL document path
  backgroundCheckStatus: 'Pending' | 'Cleared' | 'Rejected';
  
  // Legacy fields for compatibility
  email?: string;
  phone?: string;
  position?: string;
  role?: UserRole;
  supervisor?: string;
  hireDate?: string;
  status?: 'Active' | 'Inactive' | 'On Leave' | 'Terminated';
  
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
