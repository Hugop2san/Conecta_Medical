import React from 'react';
import { Star, Clock, ChevronRight } from 'lucide-react';
import { User } from '../types';

interface ProfessionalCardProps {
  professional: User;
  onSelect: (p: User) => void;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional, onSelect }) => {
  return (
    <div className="card hover:border-primary/30 transition-all group">
      <div className="flex items-start gap-4">
        <img 
          src={professional.photo} 
          alt={professional.name} 
          className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-50"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-900">{professional.name}</h3>
          <p className="text-primary font-medium text-sm mb-2">{professional.specialty}</p>
          
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-accent fill-accent" />
              <span className="font-bold text-slate-700">{professional.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{professional.responseTime}</span>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => onSelect(professional)}
        className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 text-slate-700 font-medium group-hover:bg-primary group-hover:text-white transition-all"
      >
        Solicitar Consulta
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
