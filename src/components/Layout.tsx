import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Stethoscope, History, User as UserIcon,
  LogOut, Menu, X, Bell, Calendar, Users, Brain, Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import logoAzul from '../assets/logo.png';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const patientMenu = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Buscar Médicos', path: '/search', icon: Stethoscope },
    { name: 'Triagem IA', path: '/triage', icon: Brain },
    { name: 'Carteira', path: '/wallet', icon: Wallet },
    { name: 'Histórico', path: '/history', icon: History },
    { name: 'Perfil', path: '/profile', icon: UserIcon },
  ];

  const doctorMenu = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Agenda', path: '/schedule', icon: Calendar },
    { name: 'Consultas', path: '/appointments', icon: Bell },
    { name: 'Pacientes', path: '/patients', icon: Users },
    { name: 'Marketplace Salas', path: '/marketplace', icon: Stethoscope },
    { name: 'Receita', path: '/revenue', icon: History },
    { name: 'Perfil', path: '/profile', icon: UserIcon },
  ];

  const clinicMenu = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Consultórios', path: '/offices', icon: Users },
    { name: 'Reservas', path: '/bookings', icon: Calendar },
    { name: 'Receita', path: '/revenue', icon: History },
    { name: 'Perfil', path: '/profile', icon: UserIcon },
  ];

  const getMenu = () => {
    if (user?.role === 'doctor') return doctorMenu;
    if (user?.role === 'clinic') return clinicMenu;
    return patientMenu;
  };

  const menuItems = getMenu();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-surface border-b border-slate-100 p-4 flex justify-between items-center sticky top-0 z-50">
        <img src={logoAzul} alt="Conecta Medical" className="h-8 w-auto" />
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-slate-100 h-screen sticky top-0">
        <div className="p-6">
          <img src={logoAzul} alt="Conecta Medical" className="h-9 w-auto" />
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-primary/10 text-primary font-medium' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-40 bg-surface md:hidden pt-20">
            <nav className="px-6 space-y-4">
              {menuItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 text-lg py-4 border-b border-slate-50 ${location.pathname === item.path ? 'text-primary font-bold' : 'text-slate-600'}`}>
                  <item.icon size={24} />
                  {item.name}
                </Link>
              ))}
              <button onClick={handleLogout} className="flex items-center gap-4 text-lg py-4 text-red-600 w-full">
                <LogOut size={24} />
                Sair
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
