
import React, { useState } from 'react';
import { PageLayout } from '../../../components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { PersonalInformationSection } from '../components/PersonalInformationSection';
import { DrivingInformationSection } from '../components/DrivingInformationSection';
import { IdentityDocumentsSection } from '../components/IdentityDocumentsSection';
import { BankingDetailsSection } from '../components/BankingDetailsSection';
import { AddressDetailsSection } from '../components/AddressDetailsSection';
import { PVCInformationSection } from '../components/PVCInformationSection';
import { FamilyEmergencySection } from '../components/FamilyEmergencySection';
import { MedicalInductionSection } from '../components/MedicalInductionSection';
import { useToast } from '../../../hooks/use-toast';

export interface DriverInductionData {
  personalInfo: {
    fullName: string;
    mobileNumber: string;
    emailId: string;
    dateOfBirth: Date | undefined;
    workingDays: string;
    salary: string;
    designation: string;
    yearsOfExperience: string;
    previousCompany: string;
  };
  drivingInfo: {
    licenceNumber: string;
    licencePic: File | null;
    drivingCertificate: File | null;
  };
  identityDocs: {
    aadhaarNumber: string;
    aadhaarPic: File | null;
    panNumber: string;
    panPic: File | null;
  };
  bankingDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    bankBranch: string;
    bankProof: File | null;
  };
  addressDetails: {
    presentAddress: string;
    presentAddressPhoto: File | null;
    permanentAddress: string;
    permanentAddressProof: File | null;
    electricityBill: File | null;
  };
  pvcInfo: {
    acknowledgementDate: Date | undefined;
    issueDate: Date | undefined;
    expiryDate: Date | undefined;
    pvcPhoto: File | null;
  };
  familyEmergency: {
    parentName: string;
    parentMobile: string;
    parentsPhoto: File | null;
    emergencyContactName: string;
    emergencyContactNumber: string;
  };
  medicalInduction: {
    medicalTestReport: File | null;
    medicalTestDate: Date | undefined;
    medicalTestExpiry: Date | undefined;
    inductionTeamMember: string;
    agreementCopy: File | null;
    agreementDate: Date | undefined;
  };
}

const initialData: DriverInductionData = {
  personalInfo: {
    fullName: '',
    mobileNumber: '',
    emailId: '',
    dateOfBirth: undefined,
    workingDays: '',
    salary: '',
    designation: '',
    yearsOfExperience: '',
    previousCompany: '',
  },
  drivingInfo: {
    licenceNumber: '',
    licencePic: null,
    drivingCertificate: null,
  },
  identityDocs: {
    aadhaarNumber: '',
    aadhaarPic: null,
    panNumber: '',
    panPic: null,
  },
  bankingDetails: {
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    bankBranch: '',
    bankProof: null,
  },
  addressDetails: {
    presentAddress: '',
    presentAddressPhoto: null,
    permanentAddress: '',
    permanentAddressProof: null,
    electricityBill: null,
  },
  pvcInfo: {
    acknowledgementDate: undefined,
    issueDate: undefined,
    expiryDate: undefined,
    pvcPhoto: null,
  },
  familyEmergency: {
    parentName: '',
    parentMobile: '',
    parentsPhoto: null,
    emergencyContactName: '',
    emergencyContactNumber: '',
  },
  medicalInduction: {
    medicalTestReport: null,
    medicalTestDate: undefined,
    medicalTestExpiry: undefined,
    inductionTeamMember: '',
    agreementCopy: null,
    agreementDate: undefined,
  },
};

const DriverInduction = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<DriverInductionData>(initialData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateFormData = (section: keyof DriverInductionData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const handleSubmit = () => {
    // Here you would normally validate the form and submit to backend
    console.log('Driver Induction Data:', formData);
    
    setIsSubmitted(true);
    toast({
      title: "Success!",
      description: "Driver induction form submitted successfully. Data will be synced to the pilots database.",
    });

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData(initialData);
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <PageLayout 
        title="📋 Driver Induction" 
        subtitle="Enter and manage full driver profiles"
      >
        <div className="max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-12 pb-12">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Driver Induction Completed!
              </h2>
              <p className="text-gray-600 mb-6">
                All driver information has been successfully recorded and will be synced to the pilots database.
              </p>
              <Button onClick={() => setIsSubmitted(false)} className="mr-4">
                Add Another Driver
              </Button>
              <Button onClick={() => navigate('/')} variant="outline">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="📋 Driver Induction" 
      subtitle="Enter and manage full driver profiles"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div className="text-sm text-gray-600">
            <span className="text-red-500">*</span> indicates required fields
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Driver Induction Form</CardTitle>
            <CardDescription>
              Complete onboarding information for new drivers/pilots
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <PersonalInformationSection 
              data={formData.personalInfo}
              onChange={(data) => updateFormData('personalInfo', data)}
            />
            
            <DrivingInformationSection 
              data={formData.drivingInfo}
              onChange={(data) => updateFormData('drivingInfo', data)}
            />
            
            <IdentityDocumentsSection 
              data={formData.identityDocs}
              onChange={(data) => updateFormData('identityDocs', data)}
            />
            
            <BankingDetailsSection 
              data={formData.bankingDetails}
              onChange={(data) => updateFormData('bankingDetails', data)}
            />
            
            <AddressDetailsSection 
              data={formData.addressDetails}
              onChange={(data) => updateFormData('addressDetails', data)}
            />
            
            <PVCInformationSection 
              data={formData.pvcInfo}
              onChange={(data) => updateFormData('pvcInfo', data)}
            />
            
            <FamilyEmergencySection 
              data={formData.familyEmergency}
              onChange={(data) => updateFormData('familyEmergency', data)}
            />
            
            <MedicalInductionSection 
              data={formData.medicalInduction}
              onChange={(data) => updateFormData('medicalInduction', data)}
            />

            <div className="flex justify-center pt-6 border-t">
              <Button onClick={handleSubmit} className="gap-2 bg-green-600 hover:bg-green-700 px-8 py-3 text-lg">
                <Save className="w-5 h-5" />
                Save / Submit Driver Information
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default DriverInduction;
