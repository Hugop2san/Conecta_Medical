import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Calendar,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_OFFICES } from '../constants';

export const ClinicDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Olá, {user?.name}! 👋</h1>
          <p className="text-slate-500">Sua clínica está com 65% de ocupação hoje.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Novo Consultório
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Salas Ativas</div>
          <div className="text-3xl font-bold text-slate-900">8</div>
          <div className="text-secondary text-xs font-bold mt-2 flex items-center gap-1">
            <CheckCircle2 size={12} />
            Todas operacionais
          </div>
        </div>
        <div className="card p-6">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Reservas (Mês)</div>
          <div className="text-3xl font-bold text-slate-900">142</div>
          <div className="text-secondary text-xs font-bold mt-2 flex items-center gap-1">
            <TrendingUp size={12} />
            +8% vs mês anterior
          </div>
        </div>
        <div className="card p-6">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Receita Total</div>
          <div className="text-3xl font-bold text-slate-900">R$ 28.400</div>
          <div className="text-secondary text-xs font-bold mt-2 flex items-center gap-1">
            <TrendingUp size={12} />
            Meta: 92%
          </div>
        </div>
        <div className="card p-6">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Médicos Parceiros</div>
          <div className="text-3xl font-bold text-slate-900">24</div>
          <div className="text-primary text-xs font-bold mt-2 flex items-center gap-1">
            4 novos este mês
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Offices List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Meus Consultórios</h2>
            <Link to="/offices" className="text-primary font-bold text-sm hover:underline">Gerenciar todos</Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {MOCK_OFFICES.map((office) => (
              <div key={office.id} className="card overflow-hidden group">
                <img
                  src={office.photos[0]}
                  alt={office.name}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{office.name}</h3>
                    <span className="text-secondary font-bold">R$ {office.pricePerHour}/h</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-4 flex items-center gap-1">
                    <MapPin size={14} />
                    {office.address}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {office.infrastructure.slice(0, 3).map((item, i) => (
                      <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                  <button className="w-full py-2 rounded-lg border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all">
                    Editar Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Recent Bookings */}
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Reservas Recentes
            </h2>
            <div className="card divide-y divide-slate-100">
              {[
                { doctor: 'Dr. Ricardo Silva', office: 'Consultório 102', time: 'Hoje, 14:00 - 18:00' },
                { doctor: 'Dra. Ana Costa', office: 'Sala de Exames', time: 'Hoje, 09:00 - 12:00' },
                { doctor: 'Dr. Marcos Lima', office: 'Consultório 105', time: 'Amanhã, 13:00 - 17:00' }
              ].map((booking, i) => (
                <div key={i} className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-slate-900">{booking.doctor}</h4>
                    <span className="text-[10px] text-secondary font-bold uppercase">Confirmado</span>
                  </div>
                  <p className="text-xs text-slate-500">{booking.office}</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <Clock size={10} />
                    {booking.time}
                  </p>
                </div>
              ))}
            </div>
            <Link to="/bookings" className="block text-center mt-4 text-primary font-bold text-sm hover:underline">
              Ver todas as reservas
            </Link>
          </section>

          {/* Revenue Summary */}
          <div className="card p-6 bg-slate-900 text-white">
            <h3 className="text-lg font-bold mb-4">Resumo Financeiro</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Disponível</span>
                <span className="font-bold text-secondary">R$ 4.250,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Em Escrow</span>
                <span className="font-bold text-yellow-500">R$ 1.800,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Taxas Plataforma</span>
                <span className="font-bold text-red-400">- R$ 320,00</span>
              </div>
            </div>
            <button className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all">
              Solicitar Saque
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
