import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ChatWidget } from './components/ChatWidget';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { ProfessionalDashboard } from './pages/ProfessionalDashboard';
import { ClinicDashboard } from './pages/ClinicDashboard';
import { TriagePage } from './pages/TriagePage';
import { SearchPage } from './pages/SearchPage';
import { WalletPage } from './pages/WalletPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { DoctorSchedulePage } from './pages/DoctorSchedulePage';
import { DoctorConsultationsPage } from './pages/DoctorConsultationsPage';
import { DoctorProfilePage } from './pages/DoctorProfilePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth/login" />;
  return <Layout>{children}</Layout>;
};

const DashboardRouter = () => {
  const { user } = useAuth();
  if (user?.role === 'doctor') return <ProfessionalDashboard />;
  if (user?.role === 'clinic') return <ClinicDashboard />;
  return <PatientDashboard />;
};

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>
    <p className="text-slate-500">Esta funcionalidade estará disponível em breve.</p>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/:type" element={<AuthPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
          <Route path="/triage" element={<ProtectedRoute><TriagePage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Doctor routes */}
          <Route path="/schedule" element={<ProtectedRoute><DoctorSchedulePage /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><DoctorConsultationsPage /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><PlaceholderPage title="Meus Pacientes" /></ProtectedRoute>} />
          <Route path="/marketplace" element={<ProtectedRoute><PlaceholderPage title="Marketplace de Salas" /></ProtectedRoute>} />
          <Route path="/revenue" element={<ProtectedRoute><PlaceholderPage title="Gestão Financeira" /></ProtectedRoute>} />

          {/* Clinic routes */}
          <Route path="/offices" element={<ProtectedRoute><PlaceholderPage title="Meus Consultórios" /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><PlaceholderPage title="Reservas" /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><PlaceholderPage title="Plano de Saúde Reverso" /></ProtectedRoute>} />
          <Route path="/doctor/:id" element={<ProtectedRoute><DoctorProfilePage /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ChatWidget />
      </Router>
    </AuthProvider>
  );
}
