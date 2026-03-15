import { User, Office, Appointment } from './types';

export const MOCK_DOCTORS: User[] = [
  {
    id: 'd1',
    name: 'Dr. Ricardo Mendes',
    email: 'ricardo@conecta.med',
    role: 'doctor',
    specialty: 'Cardiologista',
    crm: 'CRM/SP 123456',
    bio: 'Especialista em cardiologia intervencionista com mais de 15 anos de experiência.',
    photo: 'https://picsum.photos/seed/doc1/400/400',
    rating: 4.9,
    reviewCount: 128,
    price: 350,
    responseTime: '15 min',
    confirmationRate: 98,
    clinic: {
      id: 'c1',
      name: 'Clínica Saúde Total',
      address: 'Av. Rio Branco, 123 - Centro, Rio de Janeiro'
    }
  },
  {
    id: 'd2',
    name: 'Dra. Fernanda Lima',
    email: 'fernanda@conecta.med',
    role: 'doctor',
    specialty: 'Dermatologista',
    crm: 'CRM/RJ 654321',
    bio: 'Focada em dermatologia clínica e estética avançada.',
    photo: 'https://picsum.photos/seed/doc2/400/400',
    rating: 4.8,
    reviewCount: 95,
    price: 400,
    responseTime: '30 min',
    confirmationRate: 95,
    clinic: {
      id: 'c2',
      name: 'Centro Médico Barra',
      address: 'Av. das Américas, 500 - Barra, Rio de Janeiro'
    }
  },
  {
    id: 'd3',
    name: 'Dr. Carlos Eduardo',
    email: 'carlos@conecta.med',
    role: 'doctor',
    specialty: 'Clínico Geral',
    crm: 'CRM/MG 789012',
    bio: 'Atendimento humanizado focado em medicina preventiva.',
    photo: 'https://picsum.photos/seed/doc3/400/400',
    rating: 5.0,
    reviewCount: 210,
    price: 250,
    responseTime: '5 min',
    confirmationRate: 100,
    clinic: {
      id: 'c1',
      name: 'Clínica Saúde Total',
      address: 'Av. Rio Branco, 123 - Centro, Rio de Janeiro'
    }
  }
];

export const MOCK_OFFICES: Office[] = [
  {
    id: 'o1',
    clinicId: 'c1',
    clinicName: 'Clínica Saúde Total',
    name: 'Consultório 102 - Premium',
    location: 'Centro, Rio de Janeiro',
    address: 'Av. Rio Branco, 123 - Centro, Rio de Janeiro',
    pricePerHour: 80,
    infrastructure: ['Ar condicionado', 'Maca', 'Wi-Fi', 'Secretária'],
    availability: ['Segunda', 'Quarta', 'Sexta'],
    photos: ['https://picsum.photos/seed/office1/800/600']
  },
  {
    id: 'o2',
    clinicId: 'c2',
    clinicName: 'Centro Médico Barra',
    name: 'Sala 405 - Executiva',
    location: 'Barra da Tijuca, Rio de Janeiro',
    address: 'Av. das Américas, 500 - Barra, Rio de Janeiro',
    pricePerHour: 120,
    infrastructure: ['Ar condicionado', 'Estacionamento', 'Wi-Fi', 'Café'],
    availability: ['Terça', 'Quinta'],
    photos: ['https://picsum.photos/seed/office2/800/600']
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    patientName: 'João Silva',
    doctorId: 'd1',
    doctorName: 'Dr. Ricardo Mendes',
    date: '2026-03-20',
    time: '14:00',
    type: 'presencial',
    officeName: 'Consultório 102 - Premium',
    status: 'confirmed',
    price: 430,
    paymentStatus: 'escrow'
  }
];
