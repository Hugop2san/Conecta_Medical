import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, Shield } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('(21) 99999-9999');
  const [city, setCity] = useState('Rio de Janeiro, RJ');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Meu Perfil</h1>
        <p className="text-slate-500">Gerencie suas informações pessoais</p>
      </div>

      {saved && (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl font-medium flex items-center gap-2">
          <Save size={18} /> Perfil atualizado com sucesso!
        </div>
      )}

      {/* Avatar */}
      <div className="card p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold shrink-0">
          {(user?.name || 'U')[0].toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
          <p className="text-slate-500 text-sm">{user?.email}</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
            {user?.role === 'doctor' ? 'Médico' : user?.role === 'clinic' ? 'Clínica' : 'Paciente'}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="card p-6 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-slate-900">Informações pessoais</h3>
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
          >
            {editing ? <><Save size={14} /> Salvar</> : <><Edit2 size={14} /> Editar</>}
          </button>
        </div>

        {[
          { icon: User, label: 'Nome completo', value: name, setter: setName },
          { icon: Mail, label: 'E-mail', value: user?.email || '', setter: () => {} },
          { icon: Phone, label: 'Telefone', value: phone, setter: setPhone },
          { icon: MapPin, label: 'Cidade', value: city, setter: setCity },
        ].map((field, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shrink-0">
              <field.icon size={16} />
            </div>
            <div className="flex-1">
              <div className="text-xs text-slate-400 font-medium">{field.label}</div>
              {editing && field.setter !== (() => {}) ? (
                <input
                  value={field.value}
                  onChange={e => field.setter(e.target.value)}
                  className="w-full text-sm font-medium text-slate-900 bg-transparent border-b border-primary outline-none"
                />
              ) : (
                <div className="text-sm font-medium text-slate-900">{field.value}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Security */}
      <div className="card p-6 space-y-3">
        <h3 className="font-bold text-slate-900 flex items-center gap-2"><Shield size={18} className="text-primary" /> Segurança</h3>
        <button className="w-full p-3 rounded-xl bg-slate-50 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all flex justify-between items-center">
          Alterar senha <span className="text-primary text-xs">Editar</span>
        </button>
        <button className="w-full p-3 rounded-xl bg-slate-50 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all flex justify-between items-center">
          Autenticação em dois fatores <span className="text-slate-400 text-xs">Desativado</span>
        </button>
      </div>
    </div>
  );
};
