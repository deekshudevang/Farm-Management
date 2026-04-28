import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { useUIStore } from '../store/uiStore';
import { Bell, Search, Globe, ChevronDown, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export const Layout = () => {
  const { user } = useAuth();
  const { toggleSidebar } = useUIStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Background Decorative Mesh */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>

        {/* Top Bar - Premium Glass */}
        <header
          className="flex h-[80px] items-center justify-between px-6 sm:px-10 z-20"
          style={{ 
            background: 'rgba(255, 255, 255, 0.7)', 
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(241, 245, 249, 0.8)' 
          }}
        >
          <div className="flex items-center gap-6">
            {/* Mobile Toggle */}
            <button 
              onClick={toggleSidebar}
              className="lg:hidden h-11 w-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-teal-600 shadow-sm transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search Section */}
            <div className="relative hidden md:flex items-center group">
              <Search className="absolute left-4 h-4 w-4 transition-colors group-focus-within:text-teal-500" style={{ color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Operational protocol search..."
                className="h-12 w-80 rounded-2xl pl-12 pr-4 text-[13px] font-bold outline-none transition-all duration-500 border border-transparent hover:bg-slate-100/50 focus:bg-white focus:border-teal-500/20 focus:shadow-2xl focus:shadow-teal-500/5"
                style={{ background: 'rgba(241, 245, 249, 0.6)' }}
              />
            </div>
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="hidden sm:flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all uppercase tracking-widest">
                <Globe className="h-4 w-4 text-teal-500" />
                <span>Global Ops</span>
              </button>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-teal-600 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-500">
                <Bell className="h-5 w-5" />
                <span className="absolute right-3.5 top-3.5 h-2 w-2 rounded-full bg-rose-500 ring-4 ring-white animate-pulse"></span>
              </button>
              
              <div className="h-10 w-px bg-slate-200/60 hidden sm:block"></div>
              
              <button className="flex items-center gap-4 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl font-black text-white shadow-xl shadow-teal-500/20 group-hover:rotate-12 transition-all duration-500" style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-[14px] font-black text-slate-900 leading-tight group-hover:text-teal-600 transition-colors tracking-tight">{user?.name || 'User'}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black text-teal-600 uppercase tracking-[0.2em]">{user?.role || 'FARMER'}</span>
                    <ChevronDown className="h-3 w-3 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto relative p-6 sm:p-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-[1600px] mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};
