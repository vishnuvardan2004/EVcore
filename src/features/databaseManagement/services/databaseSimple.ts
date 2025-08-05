// Master Database Service - IndexedDB Implementation (Read-Only)

import Dexie, { Table } from 'dexie';
import {
  Vehicle,
  ChargingEquipment,
  ElectricalEquipment,
  ITEquipment,
  InfraFurniture,
  Employee,
  Pilot,
  DatabaseStats
} from '../types';

export class MasterDatabase extends Dexie {
  // Asset Tables
  vehicles!: Table<Vehicle>;
  chargingEquipment!: Table<ChargingEquipment>;
  electricalEquipment!: Table<ElectricalEquipment>;
  itEquipment!: Table<ITEquipment>;
  infraFurniture!: Table<InfraFurniture>;
  
  // Resource Tables
  employees!: Table<Employee>;
  pilots!: Table<Pilot>;

  constructor() {
    super('MasterDatabase');
    
    this.version(1).stores({
      // Asset tables
      vehicles: 'id, vin, registrationNumber, model, brand, type, status, location',
      chargingEquipment: 'id, equipmentNumber, model, brand, location, status',
      electricalEquipment: 'id, equipmentNumber, type, brand, location, status',
      itEquipment: 'id, equipmentNumber, type, brand, assignedTo, location, status',
      infraFurniture: 'id, itemNumber, type, category, location, room',
      
      // Resource tables
      employees: 'id, employeeId, email, role, department, status',
      pilots: 'id, pilotId, employeeId, licenseNumber, status'
    });

    // Populate with sample data on first load
    this.on('ready', () => this.initializeSampleData());
  }

  private async initializeSampleData() {
    // Only initialize if database is empty
    const vehicleCount = await this.vehicles.count();
    if (vehicleCount === 0) {
      await this.populateSampleData();
    }
  }

  private async populateSampleData() {
    // Simple sample data to provide basic counts
    try {
      // Sample Vehicles - updated to match Vehicle interface
      await this.vehicles.bulkAdd([
        {
          id: '1',
          vehicleId: 'VEH001',
          vinNumber: 'EV001234567890123',
          engineNumber: 'ENG001',
          registrationNumber: 'KA01AB1234',
          registrationDate: '2023-01-15',
          brand: 'Tata',
          model: 'Nexon EV',
          vehicleClass: 'SUV',
          vehicleType: 'E4W',
          fuelType: 'Electric',
          batterySerialNumber: 'BAT001',
          noOfTyres: 4,
          tyreSerialNumbers: '["TYR001", "TYR002", "TYR003", "TYR004"]',
          chargerSerialNumber: 'CHG001',
          chargerType: 'Fast',
          batteryCapacityKWh: 30.2,
          chargingPortType: 'CCS2',
          insuranceProvider: 'ICICI Lombard',
          insurancePolicyNo: 'POL001234',
          insuranceExpiryDate: '2025-01-15',
          permitNumber: 'PRM001',
          permitExpiryDate: '2025-12-31',
          policeCertificateStatus: 'Verified',
          rcFile: 'RC001.pdf',
          pucStatus: 'Valid',
          vehicleCondition: 'Good',
          odometerReading: 5000,
          locationAssigned: 'Bangalore Hub',
          assignedPilotId: 'PIL001',
          maintenanceDueDate: '2024-06-15',
          lastServiceDate: '2024-01-15',
          status: 'Active',
          createdAt: '2024-01-15T09:00:00Z',
          updatedAt: '2024-01-15T09:00:00Z',
          createdBy: 'system'
        }
      ]);

      // Sample Employees - minimal data
      await this.employees.bulkAdd([
        {
          id: '1',
          employeeId: 'EMP001',
          fullName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          gender: 'Male',
          dateOfBirth: '1990-01-15',
          contactNumber: '+91-9876543210',
          emailId: 'john.doe@company.com',
          aadharNumber: '****-****-1234',
          panNumber: 'ABCDE1234F',
          address: '123 Main Street, Koramangala, Bangalore',
          city: 'Bangalore',
          emergencyContact: 'Jane Doe - +91-9876543211',
          maritalStatus: 'Married',
          dateOfJoining: '2023-01-15',
          employmentType: 'Full-Time',
          designation: 'Operations Manager',
          department: 'Operations',
          shiftType: 'Morning',
          workLocation: 'Bangalore Hub',
          employeeStatus: 'Active',
          salaryMode: 'Bank',
          monthlySalary: 50000,
          pfEligible: true,
          backgroundCheckStatus: 'Cleared',
          email: 'john.doe@company.com',
          phone: '+91-9876543210',
          position: 'Operations Manager',
          role: 'admin',
          hireDate: '2023-01-15',
          status: 'Active',
          createdAt: '2024-01-15T09:00:00Z',
          updatedAt: '2024-01-15T09:00:00Z',
          createdBy: 'system'
        }
      ]);

      // Sample Pilots - minimal data
      await this.pilots.bulkAdd([
        {
          id: '1',
          pilotId: 'PIL001',
          employeeId: 'EMP001',
          licenseNumber: 'DL1234567890',
          licenseType: 'Commercial',
          licenseExpiry: '2025-12-31',
          medicalCertificate: 'MED001',
          medicalExpiry: '2025-06-30',
          flightHours: 1000,
          certifications: ['Commercial Vehicle License'],
          vehicleTypes: ['Electric Vehicle'],
          status: 'Active',
          lastTraining: '2024-01-01',
          nextTraining: '2024-07-01',
          createdAt: '2024-01-15T09:00:00Z',
          updatedAt: '2024-01-15T09:00:00Z',
          createdBy: 'system'
        }
      ]);
    } catch (error) {
      console.error('Error populating sample data:', error);
    }
  }
}

// Database Service Class
export class DatabaseService {
  // Read operations
  async getAll<T>(table: Table<T>): Promise<T[]> {
    return await table.toArray();
  }

  async getById<T>(table: Table<T>, id: string): Promise<T | undefined> {
    return await table.get(id);
  }

  // Write operations
  async createVehicle(vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>, createdBy: string): Promise<Vehicle> {
    const now = new Date().toISOString();
    const vehicle: Vehicle = {
      ...vehicleData,
      id: `vehicle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
      createdBy
    };
    
    await masterDb.vehicles.add(vehicle);
    return vehicle;
  }

  async getDatabaseStats(): Promise<DatabaseStats> {
    const [
      vehicles,
      chargingEquipment,
      electricalEquipment,
      itEquipment,
      infraFurniture,
      employees,
      pilots
    ] = await Promise.all([
      masterDb.vehicles.count(),
      masterDb.chargingEquipment.count(),
      masterDb.electricalEquipment.count(),
      masterDb.itEquipment.count(),
      masterDb.infraFurniture.count(),
      masterDb.employees.count(),
      masterDb.pilots.count()
    ]);

    return {
      vehicles,
      chargingEquipment,
      electricalEquipment,
      itEquipment,
      infraFurniture,
      employees,
      pilots,
      totalAssets: vehicles + chargingEquipment + electricalEquipment + itEquipment + infraFurniture,
      totalResources: employees + pilots
    };
  }

  // Asset getters
  async getVehicles(): Promise<Vehicle[]> {
    return this.getAll(masterDb.vehicles);
  }

  async getChargingEquipment(): Promise<ChargingEquipment[]> {
    return this.getAll(masterDb.chargingEquipment);
  }

  async getElectricalEquipment(): Promise<ElectricalEquipment[]> {
    return this.getAll(masterDb.electricalEquipment);
  }

  async getITEquipment(): Promise<ITEquipment[]> {
    return this.getAll(masterDb.itEquipment);
  }

  async getInfraFurniture(): Promise<InfraFurniture[]> {
    return this.getAll(masterDb.infraFurniture);
  }

  // Resource getters
  async getEmployees(): Promise<Employee[]> {
    return this.getAll(masterDb.employees);
  }

  async getPilots(): Promise<Pilot[]> {
    return this.getAll(masterDb.pilots);
  }
}

// Database instances
export const masterDb = new MasterDatabase();
export const databaseService = new DatabaseService();

// Initialize database
masterDb.open().catch(err => {
  console.error('Failed to open database:', err);
});

export default databaseService;
