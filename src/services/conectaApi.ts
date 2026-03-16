import { Office, User } from '../types';

const DEFAULT_API_BASE_URL = 'https://conecta-medical.onrender.com';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/+$/, '');

export type BackendPaciente = {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  senha: string;
  endereco: string;
  bairro: string;
  cidade: string;
};

export type BackendMedico = {
  id: string;
  nome: string;
  email: string;
  senha: string;
  crm: string;
  especialidade: string;
  precoConsultaHora: number;
  atendimentosPorHora: number;
  ativo: boolean;
};

export type BackendSala = {
  id: string;
  nomeSala: string;
  endereco: string;
  bairro: string;
  cidade: string;
  precoAluguelHora: number;
  ativa: boolean;
};

export type BackendConsulta = {
  id: string;
  pacienteId: string;
  medicoId: string;
  salaParceiraId?: string | null;
  data: string;
  horaInicio: string;
  horaFim: string;
  status: number;
  codigoConfirmacao: string;
  precoConsulta: number;
  motivoCancelamento?: string | null;
  expiraEmUtc: string;
};

type CreatePacientePayload = {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
  endereco: string;
  bairro: string;
  cidade: string;
};

type CreateMedicoPayload = {
  nome: string;
  email: string;
  senha: string;
  crm: string;
  especialidade: string;
  precoConsultaHora: number;
  atendimentosPorHora: number;
  ativo: boolean;
};

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const buildRequestHeaders = (headers?: HeadersInit) => {
  const nextHeaders = new Headers(headers);
  if (!nextHeaders.has('Content-Type')) {
    nextHeaders.set('Content-Type', 'application/json');
  }
  return nextHeaders;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: buildRequestHeaders(init?.headers),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new ApiError(message || 'Nao foi possivel concluir a requisicao.', response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

const buildDoctorBio = (specialty: string) => `Profissional cadastrado na rede Conecta Medical para atendimentos em ${specialty.toLowerCase()}.`;

const buildAddressLabel = (endereco?: string, bairro?: string, cidade?: string) =>
  [endereco, bairro, cidade].filter(Boolean).join(' - ');

export const mapPacienteToUser = (paciente: BackendPaciente): User => ({
  id: paciente.id,
  name: paciente.nome,
  email: paciente.email,
  role: 'patient',
  address: buildAddressLabel(paciente.endereco, paciente.bairro, paciente.cidade),
  photo: `https://picsum.photos/seed/${encodeURIComponent(paciente.email)}/200/200`,
});

export const mapMedicoToUser = (medico: BackendMedico): User => ({
  id: medico.id,
  name: medico.nome,
  email: medico.email,
  role: 'doctor',
  specialty: medico.especialidade,
  crm: `CRM ${medico.crm}`,
  bio: buildDoctorBio(medico.especialidade),
  photo: `https://picsum.photos/seed/${encodeURIComponent(medico.crm || medico.email)}/400/400`,
  rating: 4.8,
  reviewCount: 0,
  price: Number(medico.precoConsultaHora),
  responseTime: '30 min',
  confirmationRate: 95,
  clinic: {
    id: 'rede-conecta',
    name: 'Rede parceira Conecta Medical',
    address: 'Local presencial confirmado no agendamento',
  },
});

export const mapSalaToOffice = (sala: BackendSala): Office => ({
  id: sala.id,
  clinicId: 'rede-conecta',
  clinicName: 'Rede parceira Conecta Medical',
  name: sala.nomeSala,
  location: `${sala.bairro}, ${sala.cidade}`,
  address: buildAddressLabel(sala.endereco, sala.bairro, sala.cidade),
  pricePerHour: Number(sala.precoAluguelHora),
  infrastructure: ['Wi-Fi', 'Ar condicionado', 'Recepcao'],
  availability: ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta'],
  photos: [`https://picsum.photos/seed/${encodeURIComponent(sala.id)}/800/600`],
});

export async function listDoctorRecords(): Promise<BackendMedico[]> {
  return request<BackendMedico[]>('/medicos');
}

export async function listPatientRecords(): Promise<BackendPaciente[]> {
  return request<BackendPaciente[]>('/pacientes');
}

export async function listDoctors(): Promise<User[]> {
  const medicos = await listDoctorRecords();
  return medicos.filter((medico) => medico.ativo).map(mapMedicoToUser);
}

export async function getDoctorById(id: string): Promise<User | null> {
  try {
    const medico = await request<BackendMedico>(`/medicos/${id}`);
    return mapMedicoToUser(medico);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function listOffices(): Promise<Office[]> {
  const salas = await request<BackendSala[]>('/salas');
  return salas.filter((sala) => sala.ativa).map(mapSalaToOffice);
}

export async function listConsultations(params?: { medicoId?: string; pacienteId?: string }): Promise<BackendConsulta[]> {
  const search = new URLSearchParams();
  if (params?.medicoId) search.set('medicoId', params.medicoId);
  if (params?.pacienteId) search.set('pacienteId', params.pacienteId);
  const suffix = search.toString() ? `?${search.toString()}` : '';
  return request<BackendConsulta[]>(`/consultas${suffix}`);
}

export async function findPatientByCredentials(email: string, password: string): Promise<User | null> {
  const pacientes = await listPatientRecords();
  const paciente = pacientes.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.senha === password);
  return paciente ? mapPacienteToUser(paciente) : null;
}

export async function findDoctorByCredentials(email: string, password: string): Promise<User | null> {
  const medicos = await listDoctorRecords();
  const medico = medicos.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.senha === password && item.ativo);
  return medico ? mapMedicoToUser(medico) : null;
}

export async function createPatient(payload: CreatePacientePayload): Promise<User> {
  const paciente = await request<BackendPaciente>('/pacientes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return mapPacienteToUser(paciente);
}

export async function createDoctor(payload: CreateMedicoPayload): Promise<User> {
  const medico = await request<BackendMedico>('/medicos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return mapMedicoToUser(medico);
}
