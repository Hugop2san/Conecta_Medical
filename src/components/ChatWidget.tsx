import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const MOCK_RESPONSES = [
  { keywords: ['cabeça', 'cabeca', 'enxaqueca'], response: 'Baseado nos seus sintomas, recomendo um Neurologista. Temos especialistas disponíveis hoje!' },
  { keywords: ['garganta', 'tosse', 'gripe', 'febre'], response: 'Parece um caso para Clínico Geral. Posso te indicar médicos com consulta disponível hoje mesmo!' },
  { keywords: ['pele', 'alergia', 'coceira'], response: 'Seus sintomas indicam uma consulta com Dermatologista. Temos especialistas disponíveis esta semana!' },
  { keywords: ['coração', 'peito', 'pressão'], response: 'Para sintomas cardíacos recomendo um Cardiologista. Quer que eu localize um disponível agora?' },
  { keywords: ['barriga', 'estomago', 'nausea', 'vomito'], response: 'Parece um caso para Gastroenterologista. Posso encontrar um especialista perto de você!' },
];

const DEFAULT_RESPONSE = 'Entendi! Pode me contar mais detalhes dos sintomas para eu indicar o especialista ideal?';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Olá! Descreva seus sintomas e te indico o especialista ideal.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getResponse = (text: string) => {
    const lower = text.toLowerCase();
    for (const item of MOCK_RESPONSES) {
      if (item.keywords.some(k => lower.includes(k))) return item.response;
    }
    return DEFAULT_RESPONSE;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1200));
    setMessages(prev => [...prev, { role: 'ai', content: getResponse(userMsg) }]);
    setIsTyping(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{position:'fixed',bottom:'32px',right:'32px',zIndex:99999,width:'60px',height:'60px',borderRadius:'50%',backgroundColor:'#2563eb',color:'white',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 20px rgba(37,99,235,0.4)'}}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div style={{position:'fixed',bottom:'104px',right:'32px',zIndex:99999,width:'320px',backgroundColor:'white',borderRadius:'16px',boxShadow:'0 8px 40px rgba(0,0,0,0.15)',overflow:'hidden',border:'1px solid #f1f5f9'}}>
          <div style={{backgroundColor:'#2563eb',padding:'12px 16px',display:'flex',alignItems:'center',gap:'10px'}}>
            <Bot size={20} color="white" />
            <div>
              <div style={{color:'white',fontWeight:700,fontSize:'14px'}}>Triagem IA</div>
              <div style={{color:'rgba(255,255,255,0.7)',fontSize:'11px'}}>Online agora</div>
            </div>
          </div>

          <div style={{height:'280px',overflowY:'auto',padding:'16px',backgroundColor:'#f8fafc',display:'flex',flexDirection:'column',gap:'12px'}}>
            {messages.map((msg, i) => (
              <div key={i} style={{display:'flex',justifyContent:msg.role==='user'?'flex-end':'flex-start'}}>
                <div style={{maxWidth:'85%',padding:'10px 12px',borderRadius:msg.role==='user'?'12px 12px 0 12px':'12px 12px 12px 0',backgroundColor:msg.role==='user'?'#2563eb':'white',color:msg.role==='user'?'white':'#334155',fontSize:'13px',lineHeight:'1.5',boxShadow:'0 1px 3px rgba(0,0,0,0.08)'}}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{display:'flex',justifyContent:'flex-start'}}>
                <div style={{backgroundColor:'white',padding:'10px 14px',borderRadius:'12px',boxShadow:'0 1px 3px rgba(0,0,0,0.08)'}}>...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{padding:'12px',backgroundColor:'white',borderTop:'1px solid #f1f5f9',display:'flex',gap:'8px'}}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Descreva seus sintomas..."
              style={{flex:1,padding:'8px 12px',fontSize:'13px',border:'1px solid #e2e8f0',borderRadius:'10px',outline:'none'}}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              style={{width:'36px',height:'36px',backgroundColor:'#2563eb',color:'white',border:'none',borderRadius:'10px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',opacity:!input.trim()||isTyping?0.5:1}}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
