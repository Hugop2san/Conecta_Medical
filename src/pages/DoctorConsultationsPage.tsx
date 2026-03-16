import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Video, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { listConsultations, listPatientRecords } from '../services/conectaApi';

type ConsultationItem = {
  id: string;
  patient: string;
  date: string;
  time: string;
  type: 'Online' | 'Presencial';
  status: 'pending' | 'confirmed' | 'done' | 'cancelled';
  value: number;
};

export const DoctorConsultationsPage: React.FC = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('todas');
  const [items, setItems] = useState<ConsultationItem[]>([]);

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    const loadItems = async () => {
      try {
        const [consultations, patients] = await Promise.all([
          listConsultations({ medicoId: user.id }),
          listPatientRecords(),
        ]);

        if (!mounted) return;

        const patientMap = new Map(patients.map((patient) => [patient.id, patient.nome]));
        const mapped = consultations.map((consultation) => ({
          id: consultation.id,
          patient: patientMap.get(consultation.pacienteId) ?? 'Paciente',
          date: consultation.data,
          time: consultation.horaInicio.slice(0, 5),
          type: consultation.salaParceiraId ? 'Presencial' : 'Online',
          status: consultation.status === 2 ? 'confirmed' : consultation.status === 4 ? 'done' : consultation.status === 3 ? 'cancelled' : 'pending',
          value: consultation.precoConsulta,
        }));

        setItems(mapped);
      } catch {
        if (!mounted) return;
        setItems([]);
      }
    };

    loadItems();

    return () => {
      mounted = false;
    };
  }, [user]);

  const filtered = useMemo(
    () => items.filter((item) => filter === 'todas' || item.status === filter),
    [filter, items],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Consultas</h1>
        <p className="text-slate-500">Gerencie seus atendimentos persistidos no backend</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[['todas', 'Todas'], ['pending', 'Aguardando'], ['confirmed', 'Confirmadas'], ['done', 'Realizadas']].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === value ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((consultation) => (
          <div key={consultation.id} className="card p-5 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold text-sm">
                {consultation.patient[0]}
              </div>
              <div>
                <div className="font-bold text-slate-900">{consultation.patient}</div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1"><Calendar size={12} />{consultation.date} às {consultation.time}</span>
                  <span className="flex items-center gap-1">{consultation.type === 'Online' ? <Video size={12} /> : <MapPin size={12} />}{consultation.type}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900">R$ {consultation.value}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                consultation.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                consultation.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                consultation.status === 'cancelled' ? 'bg-red-50 text-red-500' :
                'bg-slate-100 text-slate-500'
              }`}>
                {consultation.status === 'confirmed' ? 'Confirmada' : consultation.status === 'pending' ? 'Aguardando' : consultation.status === 'cancelled' ? 'Cancelada' : 'Realizada'}
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="card p-6 text-sm text-slate-500">
            Nenhuma consulta encontrada no backend para o filtro selecionado.
          </div>
        )}
      </div>
    </div>
  );
};
