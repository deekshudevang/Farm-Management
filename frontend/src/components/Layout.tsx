import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, Globe, ChevronDown } from 'lucide-react';

export const Layout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f1f5f9]">
      {/* Sidebar with glass effect is already configured in Sidebar.tsx */}
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Background Decorative Mesh for Main Area */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>

        {/* Top Bar - Glassmorphic */}
        <header
          className="flex h-[72px] items-center justify-between px-8 z-20"
          style={{ 
            background: 'rgba(255, 255, 255, 0.6)', 
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.4)' 
          }}
        >
          {/* Search Section */}
          <div className="relative flex items-center group">
            <Search className="absolute left-4 h-4 w-4 transition-colors group-focus-within:text-teal-500" style={{ color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Global platform search..."
              className="h-11 w-80 rounded-xl pl-11 pr-4 text-[13px] font-medium outline-none transition-all duration-300 border border-transparent hover:bg-white/50 focus:bg-white focus:border-teal-500/30 focus:shadow-xl focus:shadow-teal-500/5"
              style={{ background: 'rgba(241, 245, 249, 0.7)' }}
            />
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-bold text-slate-500 hover:bg-slate-100 transition-all">
                <Globe className="h-4 w-4" />
                <span>EN</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/50 border border-white/80 text-slate-500 hover:bg-white hover:text-teal-600 hover:shadow-lg transition-all duration-300">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              </button>
              
              <div className="h-8 w-px bg-slate-200 mx-2"></div>
              
              <button className="flex items-center gap-3 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl font-black text-white shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-[14px] font-black text-slate-900 leading-tight group-hover:text-teal-600 transition-colors">{user.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user.role}</span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
