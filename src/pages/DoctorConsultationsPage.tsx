import React, { useState } from 'react';
import { Calendar, Video, MapPin, CheckCircle2, XCircle, Clock } from 'lucide-react';

const CONSULTATIONS = [
  { id: 1, patient: 'Maria Oliveira', date: '17/03/2026', time: '09:00', type: 'Presencial', status: 'confirmed', value: 350 },
  { id: 2, patient: 'João Santos', date: '17/03/2026', time: '14:00', type: 'Online', status: 'pending', value: 300 },
  { id: 3, patient: 'Ana Costa', date: '18/03/2026', time: '09:00', type: 'Presencial', status: 'confirmed', value: 350 },
  { id: 4, patient: 'Pedro Lima', date: '19/03/2026', time: '10:00', type: 'Online', status: 'confirmed', value: 300 },
  { id: 5, patient: 'Carla Souza', date: '14/03/2026', time: '14:30', type: 'Presencial', status: 'done', value: 350 },
];

export const DoctorConsultationsPage: React.FC = () => {
  const [filter, setFilter] = useState('todas');
  const [items, setItems] = useState(CONSULTATIONS);

  const filtered = items.filter(c => filter === 'todas' || c.status === filter);

  const confirm = (id: number) => setItems(prev => prev.map(c => c.id === id ? { ...c, status: 'confirmed' } : c));
  const cancel = (id: number) => setItems(prev => prev.filter(c => c.id !== id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Consultas</h1>
        <p className="text-slate-500">Gerencie seus atendimentos</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[['todas', 'Todas'], ['pending', 'Aguardando'], ['confirmed', 'Confirmadas'], ['done', 'Realizadas']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === val ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(c => (
          <div key={c.id} className="card p-5 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold text-sm">
                {c.patient[0]}
              </div>
              <div>
                <div className="font-bold text-slate-900">{c.patient}</div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1"><Calendar size={12} />{c.date} às {c.time}</span>
                  <span className="flex items-center gap-1">{c.type === 'Online' ? <Video size={12} /> : <MapPin size={12} />}{c.type}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900">R$ {c.value}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                c.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                c.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                'bg-slate-100 text-slate-500'
              }`}>
                {c.status === 'confirmed' ? 'Confirmada' : c.status === 'pending' ? 'Aguardando' : 'Realizada'}
              </span>
              {c.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => confirm(c.id)} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all">
                    <CheckCircle2 size={16} />
                  </button>
                  <button onClick={() => cancel(c.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                    <XCircle size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
