import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Video, Building2, ChevronLeft, Calendar, CheckCircle2, Award } from 'lucide-react';
import { getDoctorById } from '../services/conectaApi';
import { User } from '../types';

const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
const DAYS = ['Seg 17/03', 'Ter 18/03', 'Qua 19/03', 'Qui 20/03', 'Sex 21/03'];

export const DoctorProfilePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<User | null>(null);
  const [loadError, setLoadError] = useState('');
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState('');
  const [modality, setModality] = useState<'presencial' | 'online'>('presencial');

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const loadDoctor = async () => {
      try {
        const data = await getDoctorById(id);
        if (!mounted) return;
        if (!data) {
          setLoadError('Medico nao encontrado no backend.');
          return;
        }
        setDoctor(data);
      } catch {
        if (!mounted) return;
        setLoadError('Nao foi possivel carregar os dados mais recentes deste medico.');
      }
    };

    loadDoctor();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSchedule = () => {
    if (selectedTime && doctor) {
      navigate('/checkout', { state: { doctor, day: DAYS[selectedDay], time: selectedTime, modality } });
    }
  };

  if (!doctor) {
    return (
      <div className="space-y-6 max-w-5xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary transition-all text-sm font-medium">
          <ChevronLeft size={18} /> Voltar
        </button>
        <div className="card p-6 text-sm text-slate-500">
          {loadError || 'Carregando medico...'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary transition-all text-sm font-medium">
        <ChevronLeft size={18} /> Voltar
      </button>

      {loadError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {loadError}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <div className="card p-6 text-center">
            <img src={doctor.photo} alt={doctor.name} className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4" referrerPolicy="no-referrer" />
            <h1 className="text-xl font-bold text-slate-900">{doctor.name}</h1>
            <p className="text-primary font-semibold text-sm mb-1">{doctor.specialty}</p>
            <p className="text-slate-500 text-xs mb-4">{doctor.crm}</p>
            <div className="flex justify-center items-center gap-1 mb-4">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-slate-900">{doctor.rating}</span>
              <span className="text-slate-500 text-sm">({doctor.reviewCount} avaliações)</span>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">R$ {doctor.price}</div>
            <div className="text-xs text-slate-500">por consulta</div>
          </div>

          <div className="card p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <MapPin size={16} className="text-primary shrink-0" />
              {doctor.clinic?.address}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Clock size={16} className="text-primary shrink-0" />
              Responde em {doctor.responseTime}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <CheckCircle2 size={16} className="text-green-500 shrink-0" />
              {doctor.confirmationRate}% de confirmação
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Video size={16} className="text-primary shrink-0" />
              Atende online e presencial
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Award size={16} className="text-primary" /> Sobre
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">{doctor.bio}</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-primary" /> Agendar consulta
            </h2>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setModality('presencial')}
                className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm flex items-center justify-center gap-2 transition-all ${modality === 'presencial' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500'}`}
              >
                <Building2 size={16} /> Presencial
              </button>
              <button
                onClick={() => setModality('online')}
                className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm flex items-center justify-center gap-2 transition-all ${modality === 'online' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500'}`}
              >
                <Video size={16} /> Online
              </button>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium text-slate-700 mb-2">Selecione o dia</div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {DAYS.map((day, index) => (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDay(index);
                      setSelectedTime('');
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${selectedDay === index ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm font-medium text-slate-700 mb-2">Horários disponíveis</div>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 rounded-xl text-sm font-medium transition-all ${selectedTime === time ? 'bg-primary text-white' : 'bg-slate-50 text-slate-700 hover:bg-primary/10 hover:text-primary'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {selectedTime && (
              <div className="p-4 bg-primary/5 rounded-xl mb-4 text-sm text-slate-700">
                <strong>Resumo:</strong> {doctor.name} - {DAYS[selectedDay]} às {selectedTime} - {modality === 'online' ? 'Online' : 'Presencial'} - R$ {doctor.price}
              </div>
            )}

            <button
              onClick={handleSchedule}
              disabled={!selectedTime}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedTime ? 'Confirmar agendamento' : 'Selecione um horário'}
            </button>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-4">Avaliações recentes</h3>
            <div className="text-sm text-slate-500">
              As avaliações serão exibidas assim que houver consultas concluídas no backend.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
