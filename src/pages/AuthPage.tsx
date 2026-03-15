import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, ArrowRight, Stethoscope, UserCheck, MapPin } from 'lucide-react';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const { type } = useParams<{ type: 'login' | 'register' }>();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (type === 'register') {
        register(name, email, role);
      } else {
        // Mock login: detect role from email for demo
        let detectedRole: UserRole = 'patient';
        if (email.includes('doc')) detectedRole = 'doctor';
        if (email.includes('clinic')) detectedRole = 'clinic';
        login(email, detectedRole);
      }
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
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
            {type === 'register' ? 'Crie sua conta' : 'Bem-vindo de volta'}
          </h2>
          <p className="text-slate-500 mt-2">
            {type === 'register' 
              ? 'Junte-se a milhares de pessoas cuidando da saúde.' 
              : 'Acesse sua conta para continuar seu atendimento.'}
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {type === 'register' && (
              <>
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
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Eu sou um:</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('patient')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        role === 'patient' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-500'
                      }`}
                    >
                      <UserCheck size={20} />
                      <span className="text-xs font-bold">Paciente</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('doctor')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        role === 'doctor' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-500'
                      }`}
                    >
                      <Stethoscope size={20} />
                      <span className="text-xs font-bold">Médico</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('clinic')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        role === 'clinic' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-500'
                      }`}
                    >
                      <MapPin size={20} />
                      <span className="text-xs font-bold">Clínica</span>
                    </button>
                  </div>
                </div>
              </>
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {type === 'register' ? 'Criar conta' : 'Entrar'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500">
              {type === 'register' ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
              <Link 
                to={type === 'register' ? '/auth/login' : '/auth/register'} 
                className="text-primary font-bold ml-2 hover:underline"
              >
                {type === 'register' ? 'Faça login' : 'Cadastre-se'}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
