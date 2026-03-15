Conecta Medical 🏥

O primeiro marketplace transacional de saúde do Brasil — conectando pacientes, médicos e clínicas em uma única plataforma.

Sobre o Projeto
O Conecta Medical é uma plataforma healthtech que democratiza o acesso à saúde privada através de tecnologia. Funciona como um Airbnb de consultas médicas, onde pacientes encontram médicos com triagem por IA, preço transparente e pagamento protegido por escrow.

Funcionalidades
Para Pacientes

Triagem inteligente por IA com sugestão de especialidade
Busca de médicos com filtros por especialidade, preço e modalidade
Agendamento de consultas presenciais ou online
Pagamento seguro via escrow (liberado só após a consulta)
Carteira digital com extrato e histórico
Histórico completo de consultas
Plano de saúde reverso (Free e Conecta Plus)

Para Médicos

Dashboard com agenda semanal
Gestão de consultas com confirmação/cancelamento
Controle de receita e reputação
Acesso ao marketplace de salas/consultórios

Para Clínicas

Dashboard de ocupação e receita
Gestão de consultórios e reservas
Visualização de médicos parceiros


Stack Tecnológica
TecnologiaUsoReact 19Biblioteca de UITypeScriptLinguagem principalVite 6Bundler e servidor de desenvolvimentoTailwind CSS v4EstilizaçãoReact Router v7Navegação entre páginasFramer MotionAnimaçõesLucide ReactÍcones

Estrutura do Projeto
src/
├── assets/          # Logo e imagens
├── components/      # Componentes reutilizáveis
│   ├── Layout.tsx   # Sidebar + estrutura das páginas internas
│   └── ChatWidget.tsx # Chat flutuante de triagem IA
├── context/
│   └── AuthContext.tsx # Autenticação e sessão do usuário
├── pages/
│   ├── LandingPage.tsx
│   ├── AuthPage.tsx
│   ├── PatientDashboard.tsx
│   ├── ProfessionalDashboard.tsx
│   ├── ClinicDashboard.tsx
│   ├── TriagePage.tsx
│   ├── SearchPage.tsx
│   ├── WalletPage.tsx
│   ├── HistoryPage.tsx
│   ├── ProfilePage.tsx
│   ├── DoctorProfilePage.tsx
│   ├── DoctorSchedulePage.tsx
│   └── DoctorConsultationsPage.tsx
├── constants.ts     # Dados mockados
└── types.ts         # Tipos TypeScript
