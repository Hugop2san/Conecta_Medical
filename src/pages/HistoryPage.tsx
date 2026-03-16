import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, MapPin, Video, Star, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { listConsultations, listDoctorRecords } from '../services/conectaApi';

type AppointmentItem = {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: 'Online' | 'Presencial';
  location: string;
  status: 'realizada' | 'agendada' | 'cancelada';
  price: number;
  rating: number | null;
};

export const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('todas');
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    const loadAppointments = async () => {
      try {
        const [consultations, doctors] = await Promise.all([
          listConsultations({ pacienteId: user.id }),
          listDoctorRecords(),
        ]);

        if (!mounted) return;

        const doctorMap = new Map(doctors.map((doctor) => [doctor.id, doctor]));
        const mapped = consultations.map((consultation) => {
          const doctor = doctorMap.get(consultation.medicoId);
          return {
            id: consultation.id,
            doctor: doctor?.nome ?? 'Medico',
            specialty: doctor?.especialidade ?? 'Clinica Geral',
            date: consultation.data,
            time: consultation.horaInicio.slice(0, 5),
            type: consultation.salaParceiraId ? 'Presencial' : 'Online',
            location: consultation.salaParceiraId ? 'Sala parceira' : 'Telemedicina',
            status: consultation.status === 4 ? 'realizada' : consultation.status === 3 ? 'cancelada' : 'agendada',
            price: consultation.precoConsulta,
            rating: consultation.status === 4 ? 5 : null,
          };
        });

        setAppointments(mapped);
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

  const filtered = useMemo(
    () => appointments.filter((appointment) => filter === 'todas' || appointment.status === filter),
    [appointments, filter],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Historico de Consultas</h1>
        <p className="text-slate-500">Acompanhe todas as suas consultas</p>
      </div>

      <div className="flex gap-2">
        {[['todas', 'Todas'], ['agendada', 'Agendadas'], ['realizada', 'Realizadas']].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === value ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((appointment) => (
          <div key={appointment.id} className="card p-6">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {appointment.type === 'Online' ? <Video size={22} /> : <MapPin size={22} />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{appointment.doctor}</h3>
                  <p className="text-primary text-sm font-medium">{appointment.specialty}</p>
                  <div className="flex gap-3 mt-2 text-sm text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1"><Calendar size={13} />{appointment.date} às {appointment.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={13} />{appointment.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  appointment.status === 'realizada' ? 'bg-green-50 text-green-600' :
                  appointment.status === 'cancelada' ? 'bg-red-50 text-red-500' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {appointment.status === 'realizada' ? 'Realizada' : appointment.status === 'cancelada' ? 'Cancelada' : 'Agendada'}
                </span>
                <div className="text-lg font-bold text-slate-900 mt-2">R$ {appointment.price}</div>
              </div>
            </div>

            {appointment.status === 'realizada' && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className={star <= (appointment.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'} />
                  ))}
                  <span className="text-sm text-slate-500 ml-1">Sua avaliacao</span>
                </div>
                <button className="flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                  <FileText size={14} /> Ver nota fiscal
                </button>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="card p-6 text-sm text-slate-500">
            Nenhuma consulta encontrada no backend para este historico.
          </div>
        )}
      </div>
    </div>
  );
};
