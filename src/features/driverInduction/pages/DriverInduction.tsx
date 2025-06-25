
import React, { useState } from 'react';
import { PageLayout } from '../../../shared/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { useToast } from '../../../shared/hooks/use-toast';
import { PersonalInformationSection } from '../components/PersonalInformationSection';
import { DrivingInformationSection } from '../components/DrivingInformationSection';
import { IdentityDocumentsSection } from '../components/IdentityDocumentsSection';
import { BankingDetailsSection } from '../components/BankingDetailsSection';
import { AddressDetailsSection } from '../components/AddressDetailsSection';
import { PVCInformationSection } from '../components/PVCInformationSection';
import { FamilyEmergencySection } from '../components/FamilyEmergencySection';
import { MedicalInductionSection } from '../components/MedicalInductionSection';
import { CheckCircle, Save } from 'lucide-react';

const DriverInduction = () => {
  const { toast } = useToast();
  
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    mobileNumber: '',
    emailId: '',
    dateOfBirth: undefined as Date | undefined,
    workingDays: '',
    salary: '',
    designation: '',
    yearsOfExperience: '',
    previousCompany: '',
  });

  const [drivingInfo, setDrivingInfo] = useState({
    licenceNumber: '',
    licencePic: null as File | null,
    drivingCertificate: null as File | null,
  });

  const [identityDocs, setIdentityDocs] = useState({
    aadhaarNumber: '',
    aadhaarPic: null as File | null,
    panNumber: '',
    panPic: null as File | null,
  });

  const [bankingDetails, setBankingDetails] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    bankBranch: '',
    bankProof: null as File | null,
  });

  const [addressDetails, setAddressDetails] = useState({
    presentAddress: '',
    presentAddressPhoto: null as File | null,
    permanentAddress: '',
    permanentAddressProof: null as File | null,
    electricityBill: null as File | null,
  });

  const [pvcInfo, setPvcInfo] = useState({
    acknowledgementDate: undefined as Date | undefined,
    issueDate: undefined as Date | undefined,
    expiryDate: undefined as Date | undefined,
    pvcPhoto: null as File | null,
  });

  const [familyEmergency, setFamilyEmergency] = useState({
    parentName: '',
    parentMobile: '',
    parentsPhoto: null as File | null,
    emergencyContactName: '',
    emergencyContactNumber: '',
  });

  const [medicalInduction, setMedicalInduction] = useState({
    medicalTestReport: null as File | null,
    medicalTestDate: undefined as Date | undefined,
    medicalTestExpiry: undefined as Date | undefined,
    inductionTeamMember: '',
    agreementCopy: null as File | null,
    agreementDate: undefined as Date | undefined,
  });

  const handleSubmit = () => {
    const allData = {
      personalInfo,
      drivingInfo,
      identityDocs,
      bankingDetails,
      addressDetails,
      pvcInfo,
      familyEmergency,
      medicalInduction,
    };

    console.log('Driver Induction Data:', allData);
    
    toast({
      title: "Driver Profile Submitted Successfully!",
      description: "The driver induction form has been submitted for review.",
    });
  };

  return (
    <PageLayout 
      title="📋 Driver Induction" 
      subtitle="Complete driver profile registration and documentation"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <CheckCircle className="w-5 h-5" />
              Driver Induction Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">
              Please complete all sections below. Fields marked with <span className="text-red-500">*</span> are required.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <PersonalInformationSection 
              data={personalInfo} 
              onChange={(data) => setPersonalInfo(prev => ({ ...prev, ...data }))} 
            />
            <DrivingInformationSection 
              data={drivingInfo} 
              onChange={(data) => setDrivingInfo(prev => ({ ...prev, ...data }))} 
            />
            <IdentityDocumentsSection 
              data={identityDocs} 
              onChange={(data) => setIdentityDocs(prev => ({ ...prev, ...data }))} 
            />
            <BankingDetailsSection 
              data={bankingDetails} 
              onChange={(data) => setBankingDetails(prev => ({ ...prev, ...data }))} 
            />
            <AddressDetailsSection 
              data={addressDetails} 
              onChange={(data) => setAddressDetails(prev => ({ ...prev, ...data }))} 
            />
            <PVCInformationSection 
              data={pvcInfo} 
              onChange={(data) => setPvcInfo(prev => ({ ...prev, ...data }))} 
            />
            <FamilyEmergencySection 
              data={familyEmergency} 
              onChange={(data) => setFamilyEmergency(prev => ({ ...prev, ...data }))} 
            />
            <MedicalInductionSection 
              data={medicalInduction} 
              onChange={(data) => setMedicalInduction(prev => ({ ...prev, ...data }))} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Button onClick={handleSubmit} className="w-full" size="lg">
              <Save className="w-4 h-4 mr-2" />
              Submit Driver Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default DriverInduction;
