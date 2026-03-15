import React, { useState } from 'react';
import { Calendar, MapPin, Video, Star, ChevronRight, FileText } from 'lucide-react';

const APPOINTMENTS = [
  { id: 1, doctor: 'Dr. Ricardo Mendes', specialty: 'Cardiologista', date: '14/03/2026', time: '14:30', type: 'Presencial', location: 'Av. Rio Branco, 123', status: 'realizada', price: 350, rating: 5 },
  { id: 2, doctor: 'Dra. Fernanda Lima', specialty: 'Dermatologista', date: '05/03/2026', time: '10:00', type: 'Online', location: 'Telemedicina', status: 'realizada', price: 400, rating: 4 },
  { id: 3, doctor: 'Dr. Carlos Eduardo', specialty: 'Clínico Geral', date: '20/03/2026', time: '09:00', type: 'Presencial', location: 'Rua das Flores, 45', status: 'agendada', price: 250, rating: null },
];

export const HistoryPage: React.FC = () => {
  const [filter, setFilter] = useState('todas');

  const filtered = APPOINTMENTS.filter(a => filter === 'todas' || a.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Histórico de Consultas</h1>
        <p className="text-slate-500">Acompanhe todas as suas consultas</p>
      </div>

      <div className="flex gap-2">
        {[['todas', 'Todas'], ['agendada', 'Agendadas'], ['realizada', 'Realizadas']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === val ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(a => (
          <div key={a.id} className="card p-6">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {a.type === 'Online' ? <Video size={22} /> : <MapPin size={22} />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{a.doctor}</h3>
                  <p className="text-primary text-sm font-medium">{a.specialty}</p>
                  <div className="flex gap-3 mt-2 text-sm text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1"><Calendar size={13} />{a.date} às {a.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={13} />{a.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${a.status === 'realizada' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                  {a.status === 'realizada' ? 'Realizada' : 'Agendada'}
                </span>
                <div className="text-lg font-bold text-slate-900 mt-2">R$ {a.price}</div>
              </div>
            </div>

            {a.status === 'realizada' && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={16} className={s <= (a.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'} />
                  ))}
                  <span className="text-sm text-slate-500 ml-1">Sua avaliação</span>
                </div>
                <button className="flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                  <FileText size={14} /> Ver nota fiscal
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
