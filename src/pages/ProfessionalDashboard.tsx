import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  History, 
  TrendingUp, 
  Bell, 
  MapPin, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfessionalDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Olá, Dr. {user?.name}!</h1>
          <p className="text-slate-500">Sua agenda para hoje está 80% ocupada.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/marketplace" className="btn-primary flex items-center gap-2">
            <MapPin size={20} />
            Alugar Consultório
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Consultas Hoje</div>
          <div className="text-3xl font-bold text-slate-900">12</div>
          <div className="text-secondary text-xs font-bold mt-2 flex items-center gap-1">
            <TrendingUp size={12} />
            +15% vs ontem
          </div>
        </div>
        <div className="card p-6">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Receita (Mês)</div>
          <div className="text-3xl font-bold text-slate-900">R$ 14.250</div>
          <div className="text-secondary text-xs font-bold mt-2 flex items-center gap-1">
            <TrendingUp size={12} />
            Meta: 80%
          </div>
        </div>
        <div className="card p-6">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Reputação</div>
          <div className="text-3xl font-bold text-slate-900">4.9</div>
          <div className="text-yellow-500 text-xs font-bold mt-2 flex items-center gap-1">
            128 avaliações
          </div>
        </div>
        <div className="card p-6">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Taxa de Confirmação</div>
          <div className="text-3xl font-bold text-slate-900">96%</div>
          <div className="text-primary text-xs font-bold mt-2 flex items-center gap-1">
            Excelente
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Próximos Atendimentos</h2>
            <Link to="/schedule" className="text-primary font-bold text-sm hover:underline">Ver agenda completa</Link>
          </div>
          
          <div className="space-y-4">
            {[
              { patient: 'Maria Oliveira', time: '14:30', type: 'Presencial', location: 'Barra da Tijuca', status: 'Confirmado' },
              { patient: 'João Santos', time: '15:15', type: 'Online', location: 'Telemedicina', status: 'Aguardando' },
              { patient: 'Ana Costa', time: '16:00', type: 'Presencial', location: 'Centro', status: 'Confirmado' }
            ].map((apt, i) => (
              <div key={i} className="card p-4 flex items-center justify-between hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{apt.patient}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><Clock size={12} /> {apt.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {apt.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    apt.status === 'Confirmado' ? 'bg-secondary/10 text-secondary' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {apt.status}
                  </span>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                    <ChevronRight size={20} className="text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Notifications */}
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bell size={20} className="text-primary" />
              Notificações
            </h2>
            <div className="card divide-y divide-slate-100">
              {[
                { title: 'Novo Agendamento', desc: 'Maria Oliveira solicitou consulta para amanhã.', time: 'Há 5 min' },
                { title: 'Pagamento Recebido', desc: 'R$ 250,00 liberados da consulta de ontem.', time: 'Há 1 hora' },
                { title: 'Avaliação 5 Estrelas', desc: 'João Silva deixou um comentário positivo.', time: 'Há 3 horas' }
              ].map((note, i) => (
                <div key={i} className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-slate-900">{note.title}</h4>
                    <span className="text-[10px] text-slate-400 uppercase">{note.time}</span>
                  </div>
                  <p className="text-xs text-slate-500">{note.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Marketplace Promo */}
          <div className="card bg-primary text-white p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-lg font-bold mb-2">Precisa de um consultório?</h3>
            <p className="text-blue-100 text-sm mb-6">
              Encontre salas equipadas por hora ou período nas melhores localizações.
            </p>
            <Link to="/marketplace" className="w-full py-3 bg-white text-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all">
              Ver Salas Disponíveis
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
