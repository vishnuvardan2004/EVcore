import { pilotService } from '../../../services/database';
import { PilotInductionData, Pilot } from '../../../types/pilot';

export interface DriverInductionResponse {
  success: boolean;
  pilotId?: string;
  message: string;
}

export const driverInductionService = {
  /**
   * Submit driver induction data and automatically save to master database
   */
  async submitInduction(inductionData: PilotInductionData): Promise<DriverInductionResponse> {
    try {
      // Validate required fields
      const validation = this.validateInductionData(inductionData);
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.message
        };
      }

      // Create pilot record in database with auto-generated EVZIP ID
      const pilotId = await pilotService.createPilot({
        personalInfo: inductionData.personalInfo,
        drivingInfo: inductionData.drivingInfo,
        identityDocs: inductionData.identityDocs,
        bankingDetails: inductionData.bankingDetails,
        addressDetails: inductionData.addressDetails,
        pvcInfo: inductionData.pvcInfo,
        familyEmergency: inductionData.familyEmergency,
        medicalInfo: inductionData.medicalInfo
      });

      return {
        success: true,
        pilotId,
        message: `Pilot inducted successfully with ID: ${pilotId}`
      };

    } catch (error) {
      console.error('Error submitting driver induction:', error);
      return {
        success: false,
        message: 'Failed to submit driver induction. Please try again.'
      };
    }
  },

  /**
   * Validate induction data
   */
  validateInductionData(data: PilotInductionData): { isValid: boolean; message: string } {
    // Personal Info validation
    if (!data.personalInfo.fullName.trim()) {
      return { isValid: false, message: 'Full name is required' };
    }
    if (!data.personalInfo.mobileNumber.trim()) {
      return { isValid: false, message: 'Mobile number is required' };
    }
    if (!data.personalInfo.emailId.trim()) {
      return { isValid: false, message: 'Email ID is required' };
    }

    // Driving Info validation
    if (!data.drivingInfo.licenceNumber.trim()) {
      return { isValid: false, message: 'License number is required' };
    }

    // Identity Documents validation
    if (!data.identityDocs.aadhaarNumber.trim()) {
      return { isValid: false, message: 'Aadhaar number is required' };
    }
    if (!data.identityDocs.panNumber.trim()) {
      return { isValid: false, message: 'PAN number is required' };
    }

    // Banking Details validation
    if (!data.bankingDetails.accountNumber.trim()) {
      return { isValid: false, message: 'Bank account number is required' };
    }
    if (!data.bankingDetails.ifscCode.trim()) {
      return { isValid: false, message: 'IFSC code is required' };
    }

    return { isValid: true, message: 'Validation successful' };
  },

  /**
   * Get all inducted pilots
   */
  async getAllPilots(): Promise<Pilot[]> {
    return await pilotService.getAllPilots();
  },

  /**
   * Get pilot by ID
   */
  async getPilotById(id: string): Promise<Pilot | undefined> {
    return await pilotService.getPilot(id);
  },

  /**
   * Update pilot status
   */
  async updatePilotStatus(id: string, status: 'active' | 'inactive' | 'pending'): Promise<boolean> {
    try {
      await pilotService.updatePilot(id, { status });
      return true;
    } catch (error) {
      console.error('Error updating pilot status:', error);
      return false;
    }
  }
};
