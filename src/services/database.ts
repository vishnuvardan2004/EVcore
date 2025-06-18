
import Dexie, { Table } from 'dexie';
import { Vehicle, Deployment } from '../types/vehicle';

export class VehicleDatabase extends Dexie {
  vehicles!: Table<Vehicle>;
  deployments!: Table<Deployment>;

  constructor() {
    super('VehicleDatabase');
    this.version(1).stores({
      vehicles: 'id, vehicleNumber, status',
      deployments: 'id, vehicleNumber, direction, outTimestamp, inTimestamp'
    });
  }
}

export const db = new VehicleDatabase();

export const vehicleService = {
  async getVehicle(vehicleNumber: string): Promise<Vehicle | undefined> {
    return await db.vehicles.where('vehicleNumber').equals(vehicleNumber).first();
  },

  async createOrUpdateVehicle(vehicle: Vehicle): Promise<void> {
    await db.vehicles.put(vehicle);
  },

  async createDeployment(deployment: Deployment): Promise<void> {
    await db.deployments.add(deployment);
    
    // Update vehicle status and current deployment
    const vehicle = await this.getVehicle(deployment.vehicleNumber);
    if (vehicle) {
      vehicle.status = deployment.direction;
      if (deployment.direction === 'OUT') {
        vehicle.currentDeployment = deployment;
      } else {
        vehicle.currentDeployment = undefined;
      }
      vehicle.deploymentHistory.push(deployment);
      await this.createOrUpdateVehicle(vehicle);
    } else {
      // Create new vehicle if it doesn't exist
      const newVehicle: Vehicle = {
        id: deployment.vehicleNumber,
        vehicleNumber: deployment.vehicleNumber,
        status: deployment.direction,
        currentDeployment: deployment.direction === 'OUT' ? deployment : undefined,
        deploymentHistory: [deployment]
      };
      await this.createOrUpdateVehicle(newVehicle);
    }
  },

  async updateDeployment(deploymentId: string, updates: Partial<Deployment>): Promise<void> {
    await db.deployments.update(deploymentId, updates);
    
    if (updates.inData) {
      // Update vehicle status when IN is completed
      const deployment = await db.deployments.get(deploymentId);
      if (deployment) {
        const vehicle = await this.getVehicle(deployment.vehicleNumber);
        if (vehicle) {
          vehicle.status = 'IN';
          vehicle.currentDeployment = undefined;
          await this.createOrUpdateVehicle(vehicle);
        }
      }
    }
  },

  async getAllVehicles(): Promise<Vehicle[]> {
    return await db.vehicles.toArray();
  },

  async getDeploymentHistory(vehicleNumber?: string): Promise<Deployment[]> {
    if (vehicleNumber) {
      return await db.deployments.where('vehicleNumber').equals(vehicleNumber).toArray();
    }
    return await db.deployments.toArray();
  }
};
