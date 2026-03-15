import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Video, User } from 'lucide-react';

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
const DATES = ['17/03', '18/03', '19/03', '20/03', '21/03'];

const SLOTS = [
  { day: 0, time: '09:00', patient: 'Maria Oliveira', type: 'Presencial', status: 'confirmed' },
  { day: 0, time: '10:30', patient: null, type: null, status: 'free' },
  { day: 0, time: '14:00', patient: 'João Santos', type: 'Online', status: 'pending' },
  { day: 1, time: '09:00', patient: 'Ana Costa', type: 'Presencial', status: 'confirmed' },
  { day: 1, time: '11:00', patient: null, type: null, status: 'free' },
  { day: 2, time: '10:00', patient: 'Pedro Lima', type: 'Online', status: 'confirmed' },
  { day: 3, time: '14:30', patient: 'Carla Souza', type: 'Presencial', status: 'confirmed' },
  { day: 4, time: '09:00', patient: null, type: null, status: 'free' },
];

export const DoctorSchedulePage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const daySlots = SLOTS.filter(s => s.day === selectedDay);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Minha Agenda</h1>
          <p className="text-slate-500">Semana de 17 a 21 de março</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Adicionar horário
        </button>
      </div>

      {/* Week selector */}
      <div className="card p-2 flex gap-1">
        {DAYS.map((day, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i)}
            className={`flex-1 py-3 rounded-xl text-center transition-all ${selectedDay === i ? 'bg-primary text-white' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            <div className="text-xs font-medium opacity-70">{day}</div>
            <div className="font-bold text-sm">{DATES[i]}</div>
            <div className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 ${SLOTS.filter(s => s.day === i && s.patient).length > 0 ? (selectedDay === i ? 'bg-white' : 'bg-primary') : 'bg-transparent'}`}></div>
          </button>
        ))}
      </div>

      {/* Slots */}
      <div className="space-y-3">
        <p className="text-sm text-slate-500 font-medium">{daySlots.length} horários • {daySlots.filter(s => s.patient).length} consultas</p>
        {daySlots.map((slot, i) => (
          <div key={i} className={`card p-4 flex items-center gap-4 ${slot.status === 'free' ? 'border-dashed border-slate-200 bg-slate-50/50' : ''}`}>
            <div className="w-16 text-center">
              <div className="font-bold text-slate-900">{slot.time}</div>
            </div>
            {slot.patient ? (
              <>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <User size={18} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{slot.patient}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    {slot.type === 'Online' ? <Video size={12} /> : <MapPin size={12} />}
                    {slot.type}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${slot.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                  {slot.status === 'confirmed' ? 'Confirmado' : 'Aguardando'}
                </span>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                  <Clock size={18} />
                </div>
                <div className="flex-1 text-slate-400 text-sm">Horário disponível</div>
                <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all">
                  Bloquear
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
