import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Filter, Video, ChevronRight } from 'lucide-react';
import { listDoctors } from '../services/conectaApi';
import { User } from '../types';

const SPECIALTIES = ['Todas', 'Cardiologista', 'Dermatologista', 'Clínico Geral', 'Neurologista', 'Ortopedista'];

export const SearchPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('Todas');
  const [modality, setModality] = useState('Todos');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadDoctors = async () => {
      try {
        const data = await listDoctors();
        if (!mounted) return;
        setDoctors(data);
      } catch {
        if (!mounted) return;
        setLoadError('Nao foi possivel carregar a lista de medicos do backend.');
      }
    };

    loadDoctors();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = doctors.filter((doctor) => {
    const doctorName = doctor.name.toLowerCase();
    const doctorSpecialty = (doctor.specialty ?? '').toLowerCase();
    const doctorPrice = doctor.price ?? 0;
    const matchSearch = doctorName.includes(search.toLowerCase()) || doctorSpecialty.includes(search.toLowerCase());
    const matchSpecialty = specialty === 'Todas' || doctor.specialty === specialty;
    const matchPrice = doctorPrice <= maxPrice;
    return matchSearch && matchSpecialty && matchPrice;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Buscar Médicos</h1>
        <p className="text-slate-500">Encontre o especialista ideal para você</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nome ou especialidade..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="input-field pl-12 py-4 text-base"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {SPECIALTIES.map((item) => (
            <button
              key={item}
              onClick={() => setSpecialty(item)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${specialty === item ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex gap-2 ml-auto">
          {['Todos', 'Online', 'Presencial'].map((item) => (
            <button
              key={item}
              onClick={() => setModality(item)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${modality === item ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 card">
        <Filter size={18} className="text-slate-400" />
        <span className="text-sm text-slate-600 font-medium">Preço máximo:</span>
        <input
          type="range"
          min={100}
          max={1000}
          step={50}
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className="flex-1"
        />
        <span className="text-sm font-bold text-primary w-20">R$ {maxPrice}</span>
      </div>

      <div className="space-y-4">
        {loadError && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {loadError}
          </div>
        )}

        <p className="text-sm text-slate-500">{filtered.length} médico(s) encontrado(s)</p>

        {filtered.map((doctor) => (
          <div key={doctor.id} className="card p-6 hover:shadow-md transition-all">
            <div className="flex gap-4 items-start">
              <img
                src={doctor.photo}
                alt={doctor.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{doctor.name}</h3>
                    <p className="text-primary font-semibold text-sm">{doctor.specialty}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">R$ {doctor.price}</div>
                    <div className="text-xs text-slate-500">por consulta</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    {doctor.rating} ({doctor.reviewCount} avaliações)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {doctor.clinic?.address}
                  </span>
                  <span className="flex items-center gap-1">
                    <Video size={14} />
                    Online disponível
                  </span>
                </div>
                <div className="flex gap-3 mt-4">
                  <Link to={`/doctor/${doctor.id}`} className="btn-primary py-2 px-4 text-sm flex items-center gap-1">
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

        {!loadError && filtered.length === 0 && (
          <div className="card p-6 text-sm text-slate-500">
            Nenhum medico encontrado com os filtros atuais.
          </div>
        )}
      </div>
    </div>
  );
};
