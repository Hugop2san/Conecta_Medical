import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, ArrowRight, Stethoscope, UserCheck, BadgeInfo, Wallet } from 'lucide-react';
import { UserRole } from '../types';

type SupportedRole = Extract<UserRole, 'patient' | 'doctor'>;

const SPECIALTIES = ['Clinica Geral', 'Cardiologia', 'Dermatologia', 'Neurologia', 'Ortopedia'];

export const AuthPage: React.FC = () => {
  const { type } = useParams<{ type: 'login' | 'register' }>();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<SupportedRole>('patient');
  const [crm, setCrm] = useState('');
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [price, setPrice] = useState('250');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isRegister = type === 'register';
  const isDoctor = role === 'doctor';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isRegister) {
        await register({
          name,
          email,
          password,
          role,
          crm: isDoctor ? crm : undefined,
          specialty: isDoctor ? specialty : undefined,
          price: isDoctor ? Number(price) : undefined,
        });
      } else {
        await login({ email, password, role });
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel concluir a autenticacao.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <Link to="/" className="text-primary font-bold text-3xl tracking-tight mb-4 inline-block">Conecta Medical</Link>
          <h2 className="text-2xl font-bold text-slate-900">
            {isRegister ? 'Crie sua conta' : 'Bem-vindo de volta'}
          </h2>
          <p className="text-slate-500 mt-2">
            {isRegister
              ? 'Cadastre-se como paciente ou medico usando os dados reais do sistema.'
              : 'Acesse seu perfil persistido no backend.'}
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Perfil</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${role === 'patient' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-500'}`}
                >
                  <UserCheck size={20} />
                  <span className="text-xs font-bold">Paciente</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${role === 'doctor' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-500'}`}
                >
                  <Stethoscope size={20} />
                  <span className="text-xs font-bold">Medico</span>
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    required
                    className="input-field pl-12"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  className="input-field pl-12"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  required
                  className="input-field pl-12"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>

            {isRegister && isDoctor && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">CRM</label>
                  <div className="relative">
                    <BadgeInfo className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      required
                      className="input-field pl-12"
                      placeholder="123456-SP"
                      value={crm}
                      onChange={(event) => setCrm(event.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Especialidade</label>
                  <select
                    className="input-field"
                    value={specialty}
                    onChange={(event) => setSpecialty(event.target.value)}
                  >
                    {SPECIALTIES.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Valor da consulta</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="number"
                      min={1}
                      required
                      className="input-field pl-12"
                      placeholder="250"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isRegister ? 'Criar conta' : 'Entrar'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500">
              {isRegister ? 'Ja tem uma conta?' : 'Ainda nao tem conta?'}
              <Link
                to={isRegister ? '/auth/login' : '/auth/register'}
                className="text-primary font-bold ml-2 hover:underline"
              >
                {isRegister ? 'Faca login' : 'Cadastre-se'}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
