export interface Patient {
  _id?: string;
  name: string;
  age: string;
  gender: string;
  contactInfo: {
    phone: string;
    emergencyContact: string;
  };
  roomDetails: {
    roomNumber: string;
    bedNumber: string;
    floorNumber: string;
  };
  medicalDetails: {
    diseases: string;
    allergies: string;
  };
  otherDetails: {
    dietaryRestrictions: string;
  };
}
