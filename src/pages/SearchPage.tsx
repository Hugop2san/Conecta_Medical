import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Filter, Video, Building2, ChevronRight } from 'lucide-react';
import { MOCK_DOCTORS } from '../constants';

const SPECIALTIES = ['Todas', 'Cardiologista', 'Dermatologista', 'Clínico Geral', 'Neurologista', 'Ortopedista'];

export const SearchPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('Todas');
  const [modality, setModality] = useState('Todos');
  const [maxPrice, setMaxPrice] = useState(1000);

  const filtered = MOCK_DOCTORS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = specialty === 'Todas' || d.specialty === specialty;
    const matchPrice = d.price <= maxPrice;
    return matchSearch && matchSpecialty && matchPrice;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Buscar Médicos</h1>
        <p className="text-slate-500">Encontre o especialista ideal para você</p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nome ou especialidade..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-12 py-4 text-base"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Specialty filter */}
        <div className="flex gap-2 flex-wrap">
          {SPECIALTIES.map(s => (
            <button
              key={s}
              onClick={() => setSpecialty(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${specialty === s ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Modality filter */}
        <div className="flex gap-2 ml-auto">
          {['Todos', 'Online', 'Presencial'].map(m => (
            <button
              key={m}
              onClick={() => setModality(m)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${modality === m ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="flex items-center gap-4 p-4 card">
        <Filter size={18} className="text-slate-400" />
        <span className="text-sm text-slate-600 font-medium">Preço máximo:</span>
        <input type="range" min={100} max={1000} step={50} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="flex-1" />
        <span className="text-sm font-bold text-primary w-20">R$ {maxPrice}</span>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <p className="text-sm text-slate-500">{filtered.length} médico(s) encontrado(s)</p>
        {filtered.map(doc => (
          <div key={doc.id} className="card p-6 hover:shadow-md transition-all">
            <div className="flex gap-4 items-start">
              <img src={doc.photo} alt={doc.name} className="w-16 h-16 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{doc.name}</h3>
                    <p className="text-primary font-semibold text-sm">{doc.specialty}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">R$ {doc.price}</div>
                    <div className="text-xs text-slate-500">por consulta</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400 fill-yellow-400" />{doc.rating} ({doc.reviewCount} avaliações)</span>
                  <span className="flex items-center gap-1"><MapPin size={14} />{doc.clinic?.address}</span>
                  <span className="flex items-center gap-1"><Video size={14} />Online disponível</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <Link to={`/doctor/${doc.id}`} className="btn-primary py-2 px-4 text-sm flex items-center gap-1">
                    Ver perfil <ChevronRight size={16} />
                  </Link>
                  <button className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-all">
                    Agendar consulta
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
