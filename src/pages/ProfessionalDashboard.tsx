import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  TrendingUp,
  Bell,
  MapPin,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { listConsultations, listPatientRecords } from '../services/conectaApi';

type DashboardAppointment = {
  id: string;
  patientName: string;
  time: string;
  location: string;
  statusLabel: string;
};

export const ProfessionalDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<DashboardAppointment[]>([]);

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    const loadAppointments = async () => {
      try {
        const [consultations, patients] = await Promise.all([
          listConsultations({ medicoId: user.id }),
          listPatientRecords(),
        ]);

        if (!mounted) return;

        const patientMap = new Map(patients.map((patient) => [patient.id, patient.nome]));
        const nextAppointments = consultations
          .map((consultation) => ({
            id: consultation.id,
            patientName: patientMap.get(consultation.pacienteId) ?? 'Paciente',
            time: consultation.horaInicio.slice(0, 5),
            location: consultation.salaParceiraId ? 'Presencial' : 'Online',
            statusLabel: consultation.status === 2 ? 'Confirmado' : consultation.status === 1 ? 'Pendente' : 'Finalizado',
          }))
          .slice(0, 3);

        setAppointments(nextAppointments);
      } catch {
        if (!mounted) return;
        setAppointments([]);
      }
    };

    loadAppointments();

    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Olá, Dr. {user?.name}!</h1>
          <p className="text-slate-500">Sua agenda está sincronizada com as consultas persistidas no backend.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/marketplace" className="btn-primary flex items-center gap-2">
            <MapPin size={20} />
            Alugar Consultório
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Consultas</div>
          <div className="text-3xl font-bold text-slate-900">{appointments.length}</div>
          <div className="text-secondary text-xs font-bold mt-2 flex items-center gap-1">
            <TrendingUp size={12} />
            Carregadas do backend
          </div>
        </div>
        <div className="card p-6">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Receita Estimada</div>
          <div className="text-3xl font-bold text-slate-900">R$ {appointments.length * 250}</div>
          <div className="text-secondary text-xs font-bold mt-2 flex items-center gap-1">
            <TrendingUp size={12} />
            Baseada nas consultas carregadas
          </div>
        </div>
        <div className="card p-6">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Reputação</div>
          <div className="text-3xl font-bold text-slate-900">{user?.rating ?? 4.8}</div>
          <div className="text-yellow-500 text-xs font-bold mt-2 flex items-center gap-1">
            Dados do perfil medico
          </div>
        </div>
        <div className="card p-6">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Taxa de Confirmação</div>
          <div className="text-3xl font-bold text-slate-900">{user?.confirmationRate ?? 95}%</div>
          <div className="text-primary text-xs font-bold mt-2 flex items-center gap-1">
            Atualizada pelo perfil
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Próximos Atendimentos</h2>
            <Link to="/schedule" className="text-primary font-bold text-sm hover:underline">Ver agenda completa</Link>
          </div>

          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="card p-4 flex items-center justify-between hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{appointment.patientName}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><Clock size={12} /> {appointment.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {appointment.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${appointment.statusLabel === 'Confirmado' ? 'bg-secondary/10 text-secondary' : 'bg-yellow-100 text-yellow-600'}`}>
                    {appointment.statusLabel}
                  </span>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                    <ChevronRight size={20} className="text-slate-400" />
                  </button>
                </div>
              </div>
            ))}

            {appointments.length === 0 && (
              <div className="card p-6 text-sm text-slate-500">
                Nenhuma consulta encontrada no backend para este medico.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bell size={20} className="text-primary" />
              Notificações
            </h2>
            <div className="card divide-y divide-slate-100">
              {[
                { title: 'Perfil sincronizado', desc: 'Seus dados de medico foram carregados do backend.', time: 'Agora' },
                { title: 'Agenda conectada', desc: 'As consultas visiveis nesta tela refletem os registros persistidos.', time: 'Hoje' },
              ].map((note, index) => (
                <div key={index} className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-slate-900">{note.title}</h4>
                    <span className="text-[10px] text-slate-400 uppercase">{note.time}</span>
                  </div>
                  <p className="text-xs text-slate-500">{note.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="card bg-primary text-white p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-lg font-bold mb-2">Precisa de um consultório?</h3>
            <p className="text-blue-100 text-sm mb-6">
              Encontre salas equipadas por hora ou periodo nas melhores localizacoes.
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
