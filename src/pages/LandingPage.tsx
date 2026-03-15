import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, UserCheck, ShieldCheck, Clock, ChevronRight,
  CheckCircle2, Star, Stethoscope, Lock, FileText,
  CreditCard, TrendingUp, Users, Building2, ArrowRight,
} from 'lucide-react';
import logoAzul from '../assets/logo.png';

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">

      {/* Navbar */}
      <nav style={{boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}} className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-50">
        <img src={logoAzul} alt="Conecta Medical" className="h-10 w-auto" />
        <div className="hidden md:flex gap-8 items-center">
          <a href="#como-funciona" className="text-slate-700 hover:text-primary font-medium text-sm">Como funciona</a>
          <a href="#pacientes" className="text-slate-700 hover:text-primary font-medium text-sm">Para Pacientes</a>
          <a href="#medicos" className="text-slate-700 hover:text-primary font-medium text-sm">Para Médicos</a>
          <a href="#planos" className="text-slate-700 hover:text-primary font-medium text-sm">Planos</a>
        </div>
        <div className="flex gap-3 items-center">
          <Link to="/auth/login" className="px-4 py-2 text-slate-700 font-semibold hover:text-primary transition-all text-sm">Login</Link>
          <Link to="/auth/register" className="btn-primary py-2 px-5 text-sm">Começar agora</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
            O primeiro marketplace transacional de saúde do Brasil
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Encontre o médico certo <span className="text-primary">em minutos.</span>
          </h1>
          <p className="text-lg text-slate-700 mb-8 max-w-lg leading-relaxed">
            Triagem por IA, preço transparente e consulta garantida. O Airbnb da saúde que conecta pacientes, médicos e clínicas.
          </p>
          <div className="flex flex-wrap gap-6 mb-10">
            {[
              { icon: Stethoscope, value: '+1.200', label: 'médicos cadastrados' },
              { icon: CheckCircle2, value: '+30 mil', label: 'consultas realizadas', green: true },
              { icon: Star, value: '4.8', label: 'avaliação média', yellow: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${item.green ? 'bg-green-100' : item.yellow ? 'bg-yellow-50' : 'bg-primary/10'}`}>
                  <item.icon size={17} className={item.green ? 'text-green-600' : item.yellow ? 'text-yellow-500' : 'text-primary'} />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900">{item.value}</div>
                  <div className="text-xs text-slate-600">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/auth/register" className="btn-primary flex items-center gap-2 text-base">
              Sou Paciente <ChevronRight size={18} />
            </Link>
            <Link to="/auth/register" className="px-6 py-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all text-center">
              Sou Paciente
            </Link>
            <Link to="/auth/register" className="px-6 py-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all text-center">
              Sou Médico
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
          <div className="absolute -inset-4 bg-primary/5 rounded-full blur-3xl"></div>
          <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80" alt="Healthcare" className="relative rounded-3xl shadow-2xl border border-slate-200 w-full" />
          <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-slate-200">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Consulta confirmada!</div>
              <div className="text-xs text-slate-600">Dr. Ricardo · hoje 14h</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Problema / Solução */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">O problema que resolvemos</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-base">O sistema de saúde privada é ineficiente para todos os lados.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="bg-white/5 rounded-2xl p-8 space-y-4">
              <h3 className="text-lg font-bold text-red-400 mb-2">Sem Conecta Medical</h3>
              {['Filas longas e espera de semanas por consultas','Consultórios ociosos desperdiçando infraestrutura','Consultas caras sem transparência de preço','Sem direcionamento sobre qual especialista procurar'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-200 text-sm">
                  <div className="w-2 h-2 rounded-full bg-red-400 shrink-0"></div>{item}
                </div>
              ))}
            </div>
            <div className="bg-white/5 rounded-2xl p-8 space-y-4">
              <h3 className="text-lg font-bold text-green-400 mb-2">Com Conecta Medical</h3>
              {['Match inteligente com médico certo em minutos','Infraestrutura compartilhada reduz custos em até 40%','Preço transparente antes de agendar','IA faz triagem e indica a especialidade ideal'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-200 text-sm">
                  <CheckCircle2 size={15} className="text-green-400 shrink-0" />{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900">Como funciona?</h2>
          <p className="text-slate-600 mb-16 max-w-xl mx-auto">4 passos simples para você ter acesso à saúde de qualidade.</p>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Stethoscope, title: '1. Descreva sintomas', desc: 'Nossa IA realiza triagem baseada no seu relato.' },
              { icon: Brain, title: '2. IA sugere especialista', desc: 'Recomendamos o médico ideal para seu caso.' },
              { icon: ShieldCheck, title: '3. Agende e pague', desc: 'Pagamento seguro via escrow protegido.' },
              { icon: UserCheck, title: '4. Consulta garantida', desc: 'Atendimento presencial ou online com nota fiscal.' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center relative">
                {i < 3 && <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-slate-300 z-0"></div>}
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-primary mb-6 relative z-10 border border-slate-100">
                  <step.icon size={30} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para Pacientes */}
      <section id="pacientes" className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">Para Pacientes</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Cuide da sua saúde com <span className="text-primary">preço justo.</span></h2>
            <div className="space-y-3 mb-8">
              {[
                { icon: Brain, text: 'Triagem por IA que indica o especialista certo' },
                { icon: Clock, text: 'Consulta em até 24h, sem filas' },
                { icon: CreditCard, text: 'Parcele em até 12x sem juros' },
                { icon: ShieldCheck, text: 'Pagamento em escrow — só paga se a consulta acontecer' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-primary/5 transition-all border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary border border-slate-100">
                    <item.icon size={20} />
                  </div>
                  <span className="text-slate-800 font-medium text-sm">{item.text}</span>
                </div>
              ))}
            </div>
            <Link to="/auth/register" className="btn-primary inline-flex items-center gap-2">
              Começar como paciente <ArrowRight size={18} />
            </Link>
          </div>
          <div className="card p-8 space-y-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Brain size={22} />
              </div>
              <div>
                <div className="font-bold text-slate-900">Triagem Inteligente</div>
                <div className="text-xs text-slate-600">IA Conecta Medical</div>
              </div>
            </div>
            <div className="bg-slate-100 rounded-xl p-4 text-sm text-slate-700">
              Descreva seus sintomas e eu indico o especialista ideal para você.
            </div>
            <div className="bg-primary/10 rounded-xl p-4 text-sm text-primary font-medium text-right border border-primary/20">
              Estou com dor de cabeça forte há 2 dias...
            </div>
            <div className="bg-slate-100 rounded-xl p-4 text-sm text-slate-700">
              Baseado nos seus sintomas, recomendo um <strong>Neurologista</strong>. Encontrei 3 especialistas disponíveis hoje perto de você!
            </div>
            <Link to="/triage" className="btn-primary w-full flex items-center justify-center gap-2">
              Fazer triagem agora <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Para Médicos */}
      <section id="medicos" className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '+R$4.200', desc: 'média mensal adicional', icon: TrendingUp, color: 'text-green-600 bg-green-100' },
                { value: '+38', desc: 'novos pacientes/mês', icon: Users, color: 'text-primary bg-primary/10' },
                { value: '98%', desc: 'consultas confirmadas', icon: CheckCircle2, color: 'text-green-600 bg-green-100' },
                { value: '200+', desc: 'salas disponíveis', icon: Building2, color: 'text-primary bg-primary/10' },
              ].map((stat, i) => (
                <div key={i} className="card p-6 border border-slate-200">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-600 mt-1">{stat.desc}</div>
                </div>
              ))}
            </div>
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-6">Para Médicos</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Mais pacientes, <span className="text-primary">mais renda.</span></h2>
              <p className="text-slate-700 mb-8">Preencha horários vagos, acesse consultórios equipados e construa sua reputação digital.</p>
              <div className="space-y-3 mb-8">
                {['Agenda inteligente com confirmação automática','Acesso a 200+ consultórios parceiros','Pagamento garantido via escrow','Perfil verificado com avaliações reais'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-800">
                    <CheckCircle2 size={16} className="text-green-600 shrink-0" />{item}
                  </div>
                ))}
              </div>
              <Link to="/auth/register" className="btn-primary inline-flex items-center gap-2">
                Cadastrar como médico <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900">O que dizem sobre nós</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: 'Consegui consulta em 20 minutos pagando metade do preço. A IA me indicou exatamente o especialista certo!', name: 'Maria Silva', role: 'Paciente, RJ', stars: 5 },
              { text: 'Uso a plataforma para preencher horários vagos no consultório. Triplicou minha agenda sem custo fixo adicional.', name: 'Dr. Rafael Mendes', role: 'Cardiologista', stars: 5 },
              { text: 'Nossa clínica reduziu a ociosidade em 60% alugando salas para médicos parceiros. Receita nova sem investimento.', name: 'Clínica São Lucas', role: 'Clínica Parceira, RJ', stars: 5 },
            ].map((t, i) => (
              <div key={i} className="card p-8 border border-slate-200">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, j) => <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed italic text-sm">"{t.text}"</p>
                <div>
                  <div className="font-bold text-slate-900">{t.name}</div>
                  <div className="text-sm text-slate-600">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Segurança */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900">Segurança e Confiança</h2>
            <p className="text-slate-600">Healthtech que leva a sério a proteção dos seus dados e do seu dinheiro.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Lock, title: 'Dados protegidos', desc: 'Conformidade total com a LGPD', color: 'bg-blue-100 text-blue-700' },
              { icon: UserCheck, title: 'Médicos verificados', desc: 'CRM validado e avaliações reais', color: 'bg-green-100 text-green-700' },
              { icon: CreditCard, title: 'Pagamento seguro', desc: 'Escrow — só libera após a consulta', color: 'bg-purple-100 text-purple-700' },
              { icon: FileText, title: 'Nota fiscal automática', desc: 'Emitida automaticamente após consulta', color: 'bg-orange-100 text-orange-700' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4`}>
                  <item.icon size={28} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="bg-slate-900 py-24 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-white text-sm font-bold mb-4">Planos de Assinatura</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Simples, transparente e acessível.</h2>
            <p className="text-slate-300">O plano se paga na primeira consulta.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Plano Free */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="text-slate-300 text-sm font-bold uppercase tracking-wider mb-2">Plano Free</div>
              <div className="text-5xl font-bold mb-1">R$ 0</div>
              <div className="text-slate-400 text-sm mb-8">para sempre</div>
              <div className="space-y-3 mb-8">
                {['Triagem por IA','Busca de médicos','Pagamento seguro','Histórico básico'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={14} className="text-green-400" />{f}
                  </div>
                ))}
              </div>
              <Link to="/auth/register" className="block w-full py-3 rounded-xl font-bold text-center border border-white/20 text-white hover:bg-white/10 transition-all">
                Usar gratuitamente
              </Link>
            </div>

            {/* Plano Plus */}
            <div className="bg-primary rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">MAIS POPULAR</div>
              <div className="text-white/80 text-sm font-bold uppercase tracking-wider mb-2">Conecta Plus</div>
              <div className="text-5xl font-bold mb-1">R$ 34,90</div>
              <div className="text-white/70 text-sm mb-6">/mês · cancele quando quiser</div>

              {/* Economia visual */}
              <div className="bg-white/15 rounded-xl p-4 mb-6 border border-white/20">
                <div className="text-xs text-white/70 font-medium mb-2">Exemplo de economia:</div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/80">Consulta normal</span>
                  <span className="line-through text-white/50">R$ 132</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white font-medium">Consulta com Plus</span>
                  <span className="text-white font-bold">R$ 112</span>
                </div>
                <div className="border-t border-white/20 pt-2 mt-2 flex justify-between text-sm">
                  <span className="text-yellow-300 font-bold">Você economiza</span>
                  <span className="text-yellow-300 font-bold">R$ 19,80</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {['15% de desconto em todas as consultas','Prioridade de agenda','20% desconto em retorno com mesmo médico','Histórico completo de saúde','Lembretes de check-up','Nota fiscal garantida','Cancelamento livre'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white">
                    <CheckCircle2 size={14} className="text-white shrink-0" />{f}
                  </div>
                ))}
              </div>
              <Link to="/auth/register" className="block w-full py-3 rounded-xl font-bold text-center bg-white text-primary hover:bg-slate-100 transition-all">
                Ativar Plus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-5 gap-12 mb-12">
          <div className="col-span-2">
            <img src={logoAzul} alt="Conecta Medical" className="h-10 w-auto mb-6" />
            <p className="text-slate-600 max-w-sm mb-4 text-sm">Democratizando o acesso à saúde privada através de tecnologia e otimização de infraestrutura médica.</p>
            <div className="text-xs text-slate-500">CNPJ: 00.000.000/0001-00 · Rio de Janeiro, RJ</div>
          </div>
          {[
            { title: 'Produto', links: ['Como funciona','Para Pacientes','Para Médicos','Planos'] },
            { title: 'Empresa', links: ['Sobre nós','Contato','LinkedIn','Instagram'] },
            { title: 'Legal', links: ['Privacidade','Termos de Uso','LGPD','Central de Ajuda'] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="font-bold mb-4 text-sm text-slate-900">{col.title}</h4>
              <ul className="space-y-3 text-slate-600 text-sm">
                {col.links.map((link, j) => <li key={j}><a href="#" className="hover:text-primary transition-all">{link}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
          © 2026 Conecta Medical. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};
