import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Brain,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  Star,
  MapPin,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { listDoctors } from '../services/conectaApi';
import { User } from '../types';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [recommendedDoctors, setRecommendedDoctors] = useState<User[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadDoctors = async () => {
      try {
        const data = await listDoctors();
        if (!mounted) return;
        setRecommendedDoctors(data.slice(0, 2));
      } catch {
        if (!mounted) return;
        setRecommendedDoctors([]);
      }
    };

    loadDoctors();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Olá, {user?.name}!</h1>
          <p className="text-slate-500">Como podemos cuidar da sua saúde hoje?</p>
        </div>
        <div className="flex gap-3">
          <Link to="/triage" className="btn-primary flex items-center gap-2">
            <Brain size={20} />
            Nova Triagem IA
          </Link>
          <Link to="/search" className="px-4 py-2 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
            <Search size={20} />
            Buscar Médico
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 border-l-4 border-l-primary">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Próxima Consulta</span>
          </div>
          <h3 className="text-lg font-bold mb-1">Aguardando agendamento</h3>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            <Clock size={14} />
            Seus horários aparecerão após a primeira consulta
          </p>
        </div>
        <div className="card p-6 border-l-4 border-l-secondary">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Escrow</span>
          </div>
          <h3 className="text-lg font-bold mb-1">Pagamento Protegido</h3>
          <p className="text-slate-500 text-sm">R$ 250,00 retidos com segurança</p>
        </div>
        <div className="card p-6 border-l-4 border-l-yellow-400">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 text-yellow-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Economia Acumulada</span>
          </div>
          <h3 className="text-lg font-bold mb-1">R$ 420,00</h3>
          <p className="text-slate-500 text-sm">Com o Plano de Saúde Reverso</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Médicos Recomendados</h2>
              <Link to="/search" className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                Ver todos <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {recommendedDoctors.map((doctor) => (
                <div key={doctor.id} className="card p-6 hover:shadow-lg transition-all group">
                  <div className="flex gap-4 mb-4">
                    <img
                      src={doctor.photo}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-2xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{doctor.name}</h3>
                      <p className="text-primary text-sm font-medium">{doctor.specialty}</p>
                      <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                        <Star size={14} fill="currentColor" />
                        <span className="font-bold">{doctor.rating}</span>
                        <span className="text-slate-400">({doctor.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                    <MapPin size={14} />
                    {doctor.clinic?.address || 'Atendimento online'}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-lg font-bold text-slate-900">R$ {doctor.price}</div>
                    <Link to={`/doctor/${doctor.id}`} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm hover:bg-primary hover:text-white transition-all">
                      Ver Perfil
                    </Link>
                  </div>
                </div>
              ))}

              {recommendedDoctors.length === 0 && (
                <div className="card p-6 text-sm text-slate-500 sm:col-span-2">
                  Nenhum médico encontrado no backend para recomendação no momento.
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-6">Atividade Recente</h2>
            <div className="card divide-y divide-slate-100">
              {[
                { title: 'Triagem Realizada', desc: 'Sintomas: dor de cabeça e febre', time: 'Há 2 horas', icon: Brain, color: 'text-primary' },
                { title: 'Consulta Confirmada', desc: 'Seu agendamento será exibido aqui quando houver registro no backend', time: 'Há 5 horas', icon: Calendar, color: 'text-secondary' },
                { title: 'Pagamento Escrow', desc: 'Pagamentos protegidos aparecem aqui após a criação das consultas', time: 'Ontem', icon: ShieldCheck, color: 'text-yellow-600' },
              ].map((item, index) => (
                <div key={index} className="p-4 flex gap-4 items-start">
                  <div className={`mt-1 ${item.color}`}>
                    <item.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <span className="text-xs text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="card bg-slate-900 text-white p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <Brain className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Dúvida sobre sintomas?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Use nossa Inteligência Artificial para uma triagem rápida e direcionamento preciso.
            </p>
            <Link to="/triage" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              Iniciar Triagem
              <ChevronRight size={18} />
            </Link>
          </div>

          <div className="card p-6 border-2 border-primary/20 bg-primary/5">
            <h3 className="text-lg font-bold mb-2">Plano de Saúde Reverso</h3>
            <p className="text-slate-600 text-sm mb-4">
              Economize até 50% em consultas e tenha telemedicina ilimitada.
            </p>
            <div className="flex items-center justify-between mb-6">
              <div className="text-2xl font-bold text-primary">
                R$ 49,90<span className="text-xs text-slate-400">/mês</span>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl bg-white border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">
              Assinar agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
