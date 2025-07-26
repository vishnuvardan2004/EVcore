// Pilot data types for the master database integration

export interface PilotPersonalInfo {
  fullName: string;
  mobileNumber: string;
  emailId: string;
  dateOfBirth: Date | undefined;
  workingDays: string;
  salary: string;
  designation: string;
  yearsOfExperience: string;
  previousCompany: string;
}

export interface PilotDrivingInfo {
  licenceNumber: string;
  licencePic: File | null;
  drivingCertificate: File | null;
}

export interface PilotIdentityDocs {
  aadhaarNumber: string;
  aadhaarPic: File | null;
  panNumber: string;
  panPic: File | null;
}

export interface PilotBankingDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  bankBranch: string;
  bankProof: File | null;
}

export interface PilotAddressDetails {
  presentAddress: string;
  presentAddressPhoto: File | null;
  permanentAddress: string;
  permanentAddressPhoto: File | null;
}

export interface PilotPVCInfo {
  pvcDetails: string;
  pvcPhoto: File | null;
}

export interface PilotFamilyEmergency {
  fatherName: string;
  motherName: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyRelation: string;
}

export interface PilotMedicalInfo {
  medicalCertificate: File | null;
  bloodGroup: string;
  allergies: string;
  medications: string;
}

export interface Pilot {
  id: string; // Auto-generated EVZIP-{number}
  personalInfo: PilotPersonalInfo;
  drivingInfo: PilotDrivingInfo;
  identityDocs: PilotIdentityDocs;
  bankingDetails: PilotBankingDetails;
  addressDetails: PilotAddressDetails;
  pvcInfo: PilotPVCInfo;
  familyEmergency: PilotFamilyEmergency;
  medicalInfo: PilotMedicalInfo;
  inductionDate: Date;
  status: 'active' | 'inactive' | 'pending';
  profilePicture?: File | null;
}

export interface PilotInductionData {
  personalInfo: PilotPersonalInfo;
  drivingInfo: PilotDrivingInfo;
  identityDocs: PilotIdentityDocs;
  bankingDetails: PilotBankingDetails;
  addressDetails: PilotAddressDetails;
  pvcInfo: PilotPVCInfo;
  familyEmergency: PilotFamilyEmergency;
  medicalInfo: PilotMedicalInfo;
}
