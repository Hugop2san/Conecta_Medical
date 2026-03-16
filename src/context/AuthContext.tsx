import React, { useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { createDoctor, createPatient, findDoctorByCredentials, findPatientByCredentials } from '../services/conectaApi';

type LoginPayload = {
  email: string;
  password: string;
  role: Extract<UserRole, 'patient' | 'doctor'>;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: Extract<UserRole, 'patient' | 'doctor'>;
  crm?: string;
  specialty?: string;
  price?: number;
};

interface AuthContextType {
  user: User | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  register: (payload: RegisterPayload) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

const STORAGE_KEY = 'conecta_medical_user';

const buildPlaceholderCpf = () => Date.now().toString().slice(-11).padStart(11, '0');

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const persistUser = (nextUser: User) => {
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  };

  const login = async ({ email, password, role }: LoginPayload) => {
    const nextUser = role === 'patient'
      ? await findPatientByCredentials(email, password)
      : await findDoctorByCredentials(email, password);

    if (!nextUser) {
      throw new Error('Credenciais invalidas para o perfil selecionado.');
    }

    persistUser(nextUser);
  };

  const register = async ({ name, email, password, role, crm, specialty, price }: RegisterPayload) => {
    if (role === 'patient') {
      const patient = await createPatient({
        nome: name,
        email,
        senha: password,
        cpf: buildPlaceholderCpf(),
        telefone: '',
        endereco: '',
        bairro: '',
        cidade: 'Sao Paulo',
      });

      persistUser(patient);
      return;
    }

    if (!crm || !specialty || !price) {
      throw new Error('Preencha CRM, especialidade e valor da consulta para cadastrar o medico.');
    }

    const doctor = await createDoctor({
      nome: name,
      email,
      senha: password,
      crm,
      especialidade: specialty,
      precoConsultaHora: price,
      atendimentosPorHora: 1,
      ativo: true,
    });

    persistUser(doctor);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
