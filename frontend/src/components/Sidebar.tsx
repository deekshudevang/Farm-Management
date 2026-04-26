import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Leaf, Map, CheckSquare, Package,
  LogOut, Settings, HelpCircle, BarChart2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  const location = useLocation();

  return (
    <aside className="flex h-screen w-[260px] flex-col z-30 relative" style={{ 
      background: 'rgba(15, 23, 42, 0.9)', 
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      {/* Decorative Gradient Glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-teal-500/10 blur-[60px] pointer-events-none"></div>

      {/* Logo Section */}
      <div className="flex h-[72px] items-center gap-3 px-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg shadow-teal-500/20" style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}>
          <Leaf className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-[16px] font-black tracking-tight text-white">AgriSmart</span>
          <span className="text-[10px] font-bold text-teal-400 tracking-[0.2em] uppercase">Enterprise</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-8">
        <p className="mb-4 px-3 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#64748b' }}>
          Main Menu
        </p>
        <div className="space-y-2">
          {mainNav.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-teal-500/20 to-blue-500/10 text-teal-400 shadow-sm' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
                style={{
                  border: isActive ? '1px solid rgba(20, 184, 166, 0.2)' : '1px solid transparent'
                }}
              >
                <item.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-teal-400'}`} />
                <span>{item.name}</span>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]"></div>
                )}
              </NavLink>
            );
          })}
        </div>

        <p className="mt-10 mb-4 px-3 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#64748b' }}>
          Support
        </p>
        <div className="space-y-2">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            <Settings className="h-5 w-5 text-slate-500" />
            <span>Settings</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            <HelpCircle className="h-5 w-5 text-slate-500" />
            <span>Help Center</span>
          </button>
        </div>
      </nav>

      {/* User Profile / Logout */}
      <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 mb-3">
          <div className="h-9 w-9 rounded-xl bg-teal-500/20 flex items-center justify-center font-bold text-teal-400 border border-teal-500/20">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-white truncate">{user?.name || 'User'}</span>
            <span className="text-[11px] text-slate-500 truncate">{user?.email}</span>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500/10 py-3 text-[13px] font-black text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 border border-rose-500/20"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout System</span>
        </button>
      </div>
    </aside>
  );
};
