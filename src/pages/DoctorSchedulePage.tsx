import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
const DATES = ['17/03', '18/03', '19/03', '20/03', '21/03'];

const SLOTS = [
  { day: 0, time: '09:00', status: 'free' },
  { day: 0, time: '10:30', status: 'free' },
  { day: 0, time: '14:00', status: 'free' },
  { day: 1, time: '09:00', status: 'free' },
  { day: 1, time: '11:00', status: 'free' },
  { day: 2, time: '10:00', status: 'free' },
  { day: 3, time: '14:30', status: 'free' },
  { day: 4, time: '09:00', status: 'free' },
];

export const DoctorSchedulePage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const daySlots = SLOTS.filter((slot) => slot.day === selectedDay);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Minha Agenda</h1>
          <p className="text-slate-500">Horarios mockados para operacao local de agenda</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Adicionar horario
        </button>
      </div>

      <div className="card p-2 flex gap-1">
        {DAYS.map((day, index) => (
          <button
            key={day}
            onClick={() => setSelectedDay(index)}
            className={`flex-1 py-3 rounded-xl text-center transition-all ${selectedDay === index ? 'bg-primary text-white' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            <div className="text-xs font-medium opacity-70">{day}</div>
            <div className="font-bold text-sm">{DATES[index]}</div>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm text-slate-500 font-medium">{daySlots.length} horários disponíveis</p>
        {daySlots.map((slot) => (
          <div key={`${slot.day}-${slot.time}`} className="card p-4 flex items-center gap-4 border-dashed border-slate-200 bg-slate-50/50">
            <div className="w-16 text-center">
              <div className="font-bold text-slate-900">{slot.time}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
              <Clock size={18} />
            </div>
            <div className="flex-1 text-slate-400 text-sm">Horario disponivel</div>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all">
              Bloquear
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
