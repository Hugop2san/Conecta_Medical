import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Send,
  User,
  Bot,
  ChevronRight,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_DOCTORS } from '../constants';

const MOCK_TRIAGE_RESPONSES = [
  {
    summary: "Possível cefaleia tensional ou enxaqueca",
    severity: "media",
    specialty: "Neurologista",
    advice: "Recomendo repouso, hidratação e evitar telas por algumas horas. Se a dor persistir por mais de 48h, consulte um médico.",
    urgency: "Procure atendimento em até 24h caso a dor seja intensa ou acompanhada de febre."
  },
  {
    summary: "Possível infecção respiratória",
    severity: "media",
    specialty: "Clínico Geral",
    advice: "Mantenha-se hidratado, descanse e monitore a temperatura. Evite automedicação.",
    urgency: "Se apresentar febre acima de 39°C ou dificuldade para respirar, busque atendimento imediato."
  },
  {
    summary: "Possível problema gastrointestinal",
    severity: "baixa",
    specialty: "Gastroenterologista",
    advice: "Adote uma dieta leve, evite alimentos gordurosos e mantenha-se hidratado.",
    urgency: "Se os sintomas persistirem por mais de 3 dias ou houver sangramento, consulte um médico."
  }
];

export const TriagePage: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Olá! Sou seu assistente de triagem Conecta Medical. Por favor, descreva seus sintomas em detalhes para que eu possa te ajudar.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [triageResult, setTriageResult] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    // Simula delay da IA
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = MOCK_TRIAGE_RESPONSES[Math.floor(Math.random() * MOCK_TRIAGE_RESPONSES.length)];
    setTriageResult(result);
    setMessages(prev => [...prev, {
      role: 'ai',
      content: `Entendi. Baseado no seu relato, parece ser um caso de ${result.specialty}. ${result.advice}`
    }]);
    setIsTyping(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-all">
          <ArrowLeft size={20} className="text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Triagem Inteligente</h1>
          <p className="text-slate-500 text-sm">IA treinada para direcionar seu atendimento</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Chat Area */}
        <div className="md:col-span-2 flex flex-col h-[600px] card overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-primary text-white' : 'bg-slate-100 text-primary'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Descreva o que está sentindo..."
                className="input-field pr-12 py-4"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Results / Recommendations */}
        <div className="space-y-6">
          <AnimatePresence>
            {triageResult ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="card p-6 border-l-4 border-l-secondary">
                  <div className="flex items-center gap-2 text-secondary font-bold mb-4">
                    <CheckCircle2 size={20} />
                    Resultado da Triagem
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Gravidade</div>
                      <div className={`text-sm font-bold mt-1 ${
                        triageResult.severity === 'alta' ? 'text-red-500' :
                        triageResult.severity === 'media' ? 'text-yellow-500' : 'text-secondary'
                      }`}>
                        {triageResult.severity.toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Especialidade</div>
                      <div className="text-sm font-bold text-slate-900 mt-1">{triageResult.specialty}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed italic">
                      "{triageResult.urgency}"
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Stethoscope size={18} className="text-primary" />
                    Médicos Recomendados
                  </h3>
                  {MOCK_DOCTORS.slice(0, 2).map((doc) => (
                    <div key={doc.id} className="card p-4 hover:border-primary/30 transition-all cursor-pointer">
                      <div className="flex gap-3 items-center">
                        <img src={doc.photo} alt={doc.name} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                        <div className="flex-1">
                          <h4 className="text-sm font-bold">{doc.name}</h4>
                          <p className="text-[10px] text-primary font-bold uppercase">{doc.specialty}</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300" />
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <Search size={16} />
                    Ver todos os especialistas
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="card p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto">
                  <Brain size={32} />
                </div>
                <p className="text-slate-500 text-sm">
                  Aguardando sua descrição para gerar recomendações personalizadas.
                </p>
              </div>
            )}
          </AnimatePresence>

          <div className="card p-4 bg-yellow-50 border-yellow-100 flex gap-3">
            <AlertTriangle className="text-yellow-600 shrink-0" size={20} />
            <p className="text-[10px] text-yellow-800 leading-relaxed">
              <strong>Atenção:</strong> Esta triagem é realizada por uma Inteligência Artificial e não substitui uma consulta médica presencial. Em caso de emergência, procure o hospital mais próximo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
