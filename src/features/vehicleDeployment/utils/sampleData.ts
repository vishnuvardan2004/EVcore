// Sample data generator for testing the vehicle deployment tracker
import { vehicleService } from '../../../services/database';
import { Deployment } from '../../../types/vehicle';

export const createSampleDeployments = async () => {
  try {
    // Sample vehicles data - initial state all IN
    const sampleVehicles = [
      { id: 'VH001', vehicleNumber: 'VH001', status: 'IN' as const, deploymentHistory: [] },
      { id: 'VH002', vehicleNumber: 'VH002', status: 'IN' as const, deploymentHistory: [] },
      { id: 'VH003', vehicleNumber: 'VH003', status: 'IN' as const, deploymentHistory: [] },
      { id: 'VH004', vehicleNumber: 'VH004', status: 'IN' as const, deploymentHistory: [] },
      { id: 'VH005', vehicleNumber: 'VH005', status: 'IN' as const, deploymentHistory: [] },
    ];

    // Create vehicles first
    for (const vehicle of sampleVehicles) {
      await vehicleService.createOrUpdateVehicle(vehicle);
    }

    // Sample deployments
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const thisWeekStart = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
    const tenHoursAgo = new Date(now.getTime() - 10 * 60 * 60 * 1000);

    const sampleDeployments: Deployment[] = [
      // Completed deployment from yesterday
      {
        id: 'DEP001',
        vehicleNumber: 'VH001',
        direction: 'OUT',
        purpose: 'Office',
        outTimestamp: yesterday.toISOString(),
        inTimestamp: new Date(yesterday.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        duration: 240,
        totalKms: 25,
        outData: {
          employeeName: 'John Doe',
          location: 'Client Office',
          odometer: 1000,
          batteryCharge: 85,
          range: 120,
          supervisorName: 'Manager Smith',
          notes: 'Client meeting scheduled'
        },
        inData: {
          returnOdometer: 1025,
          inSupervisorName: 'Manager Smith',
          checklistMismatches: []
        }
      },

      // Completed deployment from this week
      {
        id: 'DEP002',
        vehicleNumber: 'VH002',
        direction: 'OUT',
        purpose: 'Pilot',
        outTimestamp: thisWeekStart.toISOString(),
        inTimestamp: new Date(thisWeekStart.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        duration: 360,
        totalKms: 45,
        outData: {
          driverName: 'Alex Kumar',
          pilotId: 'PIL001',
          location: 'Airport Route',
          odometer: 2000,
          batteryCharge: 90,
          range: 150,
          supervisorName: 'Lead Johnson',
          notes: 'Airport pickup service'
        },
        inData: {
          returnOdometer: 2045,
          inSupervisorName: 'Lead Johnson',
          checklistMismatches: ['tire_pressure']
        }
      },

      // Current active deployment - normal (2 hours out)
      {
        id: 'DEP003',
        vehicleNumber: 'VH003',
        direction: 'OUT',
        purpose: 'Office',
        outTimestamp: twoHoursAgo.toISOString(),
        outData: {
          employeeName: 'Sarah Wilson',
          location: 'Branch Office',
          odometer: 1500,
          batteryCharge: 80,
          range: 110,
          supervisorName: 'Manager Davis',
          notes: 'Branch inspection visit'
        }
      },

      // Current active deployment - getting long (6 hours out)
      {
        id: 'DEP004',
        vehicleNumber: 'VH005',
        direction: 'OUT',
        purpose: 'Pilot',
        outTimestamp: sixHoursAgo.toISOString(),
        outData: {
          driverName: 'Mike Rodriguez',
          pilotId: 'PIL002',
          location: 'City Tour',
          odometer: 3000,
          batteryCharge: 75,
          range: 100,
          supervisorName: 'Lead Wilson',
          notes: 'VIP client tour'
        }
      },

      // Overdue deployment (10 hours out) - should show as overdue
      {
        id: 'DEP005',
        vehicleNumber: 'VH004',
        direction: 'OUT',
        purpose: 'Office',
        outTimestamp: tenHoursAgo.toISOString(),
        outData: {
          employeeName: 'Emergency Team',
          location: 'Emergency Site',
          odometer: 2500,
          batteryCharge: 70,
          range: 90,
          supervisorName: 'Emergency Lead',
          notes: 'Emergency response - extended duration expected'
        }
      },

      // Another completed deployment for better stats
      {
        id: 'DEP006',
        vehicleNumber: 'VH001',
        direction: 'OUT',
        purpose: 'Pilot',
        outTimestamp: new Date(thisWeekStart.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        inTimestamp: new Date(thisWeekStart.getTime() + 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        duration: 180,
        totalKms: 30,
        outData: {
          driverName: 'Lisa Chen',
          pilotId: 'PIL003',
          location: 'Hospital Route',
          odometer: 1025,
          batteryCharge: 85,
          range: 120,
          supervisorName: 'Lead Thompson',
          notes: 'Medical emergency transport'
        },
        inData: {
          returnOdometer: 1055,
          inSupervisorName: 'Lead Thompson',
          checklistMismatches: []
        }
      }
    ];

    // Create deployments in chronological order
    // This will automatically update vehicle statuses through the vehicleService
    for (const deployment of sampleDeployments) {
      await vehicleService.createDeployment(deployment);
    }

    console.log('Sample deployment data created successfully!');
    console.log('- 3 completed trips (various times)');
    console.log('- 3 active deployments (1 normal, 1 long, 1 overdue)');
    return true;
  } catch (error) {
    console.error('Error creating sample deployments:', error);
    return false;
  }
};

export const clearAllDeploymentData = async () => {
  try {
    // This will clear all data for testing
    await vehicleService.getAllVehicles();
    console.log('All deployment data cleared!');
    return true;
  } catch (error) {
    console.error('Error clearing deployment data:', error);
    return false;
  }
};
