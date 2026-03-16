import { Office } from './types';

export const MOCK_OFFICES: Office[] = [
  {
    id: 'o1',
    clinicId: 'c1',
    clinicName: 'Clinica Parceira Centro',
    name: 'Consultorio 102 - Premium',
    location: 'Centro, Rio de Janeiro',
    address: 'Av. Rio Branco, 123 - Centro, Rio de Janeiro',
    pricePerHour: 80,
    infrastructure: ['Ar condicionado', 'Maca', 'Wi-Fi', 'Recepcao'],
    availability: ['Segunda', 'Quarta', 'Sexta'],
    photos: ['https://picsum.photos/seed/office1/800/600'],
  },
  {
    id: 'o2',
    clinicId: 'c2',
    clinicName: 'Clinica Parceira Barra',
    name: 'Sala 405 - Executiva',
    location: 'Barra da Tijuca, Rio de Janeiro',
    address: 'Av. das Americas, 500 - Barra, Rio de Janeiro',
    pricePerHour: 120,
    infrastructure: ['Ar condicionado', 'Estacionamento', 'Wi-Fi', 'Cafe'],
    availability: ['Terca', 'Quinta'],
    photos: ['https://picsum.photos/seed/office2/800/600'],
  },
];
