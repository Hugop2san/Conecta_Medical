export type UserRole = 'patient' | 'doctor' | 'clinic';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photo?: string;
  // Doctor specific
  specialty?: string;
  crm?: string;
  bio?: string;
  rating?: number;
  reviewCount?: number;
  price?: number;
  responseTime?: string;
  confirmationRate?: number;
  clinic?: {
    id: string;
    name: string;
    address: string;
  };
  // Clinic specific
  address?: string;
  offices?: Office[];
}

export interface Office {
  id: string;
  clinicId: string;
  clinicName: string;
  name: string;
  location: string;
  address: string;
  pricePerHour: number;
  infrastructure: string[];
  availability: string[];
  photos: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  officeId?: string;
  officeName?: string;
  date: string;
  time: string;
  type: 'online' | 'presencial';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  symptoms?: string;
  triageResult?: string;
  paymentStatus: 'escrow' | 'released' | 'refunded';
}

export interface TriageResult {
  specialty: string;
  urgency: 'low' | 'medium' | 'high';
  explanation: string;
}
