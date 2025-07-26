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
      // Sample Vehicles - minimal data
      await this.vehicles.bulkAdd([
        {
          id: '1',
          vin: 'EV001234567890123',
          engineNumber: 'ENG001',
          registrationNumber: 'KA01AB1234',
          model: 'Nexon EV',
          styleClass: 'SUV',
          brand: 'Tata',
          type: 'Electric',
          batteryNumber: 'BAT001',
          tyreNumbers: ['TYR001', 'TYR002', 'TYR003', 'TYR004'],
          chargerNumber: 'CHG001',
          status: 'Available',
          purchaseDate: '2023-01-15',
          warrantyExpiry: '2026-01-15',
          location: 'Bangalore Hub',
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
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@company.com',
          phone: '+91-9876543210',
          position: 'Operations Manager',
          department: 'Operations',
          role: 'admin',
          hireDate: '2023-01-15',
          status: 'Active',
          address: {
            street: '123 Main St',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560001',
            country: 'India'
          },
          emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '+91-9876543211'
          },
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

// Database Service Class (Read-Only)
export class DatabaseService {
  // Read operations only
  async getAll<T>(table: Table<T>): Promise<T[]> {
    return await table.toArray();
  }

  async getById<T>(table: Table<T>, id: string): Promise<T | undefined> {
    return await table.get(id);
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
