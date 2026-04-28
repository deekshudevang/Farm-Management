import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Leaf, Map, CheckSquare, Package,
  LogOut, Settings, HelpCircle, BarChart2, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUIStore } from '../store/uiStore';
import { useEffect, useState } from 'react';

const mainNav = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Fields', to: '/fields', icon: Map },
  { name: 'Crops', to: '/crops', icon: Leaf },
  { name: 'Tasks', to: '/tasks', icon: CheckSquare },
  { name: 'Inventory', to: '/inventory', icon: Package },
  { name: 'Reports', to: '/reports', icon: BarChart2 },
];

export const Sidebar = () => {
  const { logout, user } = useAuth();
  const { isSidebarOpen, closeSidebar } = useUIStore();
  const location = useLocation();
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
    closed: { x: '-100%', opacity: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && !isLargeScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={isLargeScreen ? false : "closed"}
        animate={isLargeScreen ? { x: 0, opacity: 1 } : (isSidebarOpen ? 'open' : 'closed')}
        variants={sidebarVariants}
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col lg:static lg:translate-x-0 lg:opacity-100 shadow-2xl lg:shadow-none`}
        style={{ 
          background: 'rgba(15, 23, 42, 0.95)', 
          backdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Decorative Glow */}
        <div className="absolute top-0 left-0 w-full h-40 bg-teal-500/10 blur-[80px] pointer-events-none"></div>

        {/* Logo Section */}
        <div className="flex h-[80px] items-center justify-between px-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg shadow-teal-500/20" style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}>
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-black tracking-tight text-white">AgriSmart</span>
              <span className="text-[10px] font-black text-teal-400 tracking-[0.25em] uppercase">Enterprise</span>
            </div>
          </div>
          <button onClick={closeSidebar} className="lg:hidden text-slate-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar">
          <p className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
            Systems Management
          </p>
          <div className="space-y-1.5">
            {mainNav.map((item) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={() => !isLargeScreen && closeSidebar()}
                  className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[13px] font-black transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-teal-500/15 to-transparent text-white shadow-sm' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-all duration-300 ${isActive ? 'text-teal-400 scale-110' : 'text-slate-500 group-hover:text-teal-400'}`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute left-0 h-8 w-1 bg-teal-500 rounded-r-full"
                    />
                  )}
                </NavLink>
              );
            })}
          </div>

          <p className="mt-12 mb-4 px-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
            Enterprise Identity
          </p>
          <div className="space-y-1.5">
            <NavLink
              to="/settings"
              onClick={() => !isLargeScreen && closeSidebar()}
              className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[13px] font-black transition-all duration-300 ${
                location.pathname === '/settings'
                  ? 'bg-gradient-to-r from-teal-500/15 to-transparent text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <Settings className={`h-5 w-5 transition-all duration-300 ${location.pathname === '/settings' ? 'text-teal-400 scale-110' : 'text-slate-500 group-hover:text-teal-400'}`} />
              <span>Settings</span>
              {location.pathname === '/settings' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 h-8 w-1 bg-teal-500 rounded-r-full"
                />
              )}
            </NavLink>
            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-[13px] font-black text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all">
              <HelpCircle className="h-5 w-5 text-slate-500" />
              <span>Operational Support</span>
            </button>
          </div>
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 bg-slate-900/50" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 mb-4">
            <div className="h-10 w-10 rounded-xl bg-teal-500 flex items-center justify-center font-black text-white shadow-lg shadow-teal-500/20">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-black text-white truncate leading-tight">{user?.name || 'User'}</span>
              <span className="text-[10px] font-black text-teal-400/80 tracking-widest uppercase truncate">{user?.role} ACCESS</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500/10 py-4 text-[13px] font-black text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-500 border border-rose-500/10 group"
          >
            <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Terminate Session</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};
