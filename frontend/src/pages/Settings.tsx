import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User, Lock, Bell, Palette, Trash2, Save, Check, X, 
  Shield, Mail, Smartphone, AlertTriangle, Activity, type LucideIcon 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { z } from 'zod';

const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

const PasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type Tab = 'profile' | 'security' | 'notifications' | 'appearance';

export const Settings = () => {
  const { user, login, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(false);
  const [profileStats, setProfileStats] = useState({ fields: 0, tasks: 0, inventory: 0 });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { register: regProfile, handleSubmit: handleProfile, reset: resetProfile, formState: { errors: errorsProfile } } = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  });

  const { register: regPass, handleSubmit: handlePass, reset: resetPass, formState: { errors: errorsPass } } = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get('/settings/profile');
      resetProfile({ name: res.data.name, email: res.data.email });
      setProfileStats({
        fields: res.data._count?.fields || 0,
        tasks: res.data._count?.tasks || 0,
        inventory: res.data._count?.inventory || 0,
      });
    } catch {
      // Fallback handled by interceptor or context
    }
  }, [resetProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onProfileSubmit = async (data: z.infer<typeof ProfileSchema>) => {
    setLoading(true);
    try {
      const res = await api.put('/settings/profile', data);
      if (token) login(token, res.data);
      toast.success('Enterprise profile synchronised');
    } catch {
      // Handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data: z.infer<typeof PasswordSchema>) => {
    setLoading(true);
    try {
      await api.put('/settings/password', { 
        currentPassword: data.currentPassword, 
        newPassword: data.newPassword 
      });
      toast.success('Security protocols updated');
      resetPass();
    } catch {
      // Handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await api.delete('/settings/account');
      toast.success('Purging enterprise data...');
      setTimeout(() => logout(), 1500);
    } catch {
      // Handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: Tab; label: string; icon: LucideIcon }[] = [
    { key: 'profile', label: 'Identity', icon: User },
    { key: 'security', label: 'Security', icon: Lock },
    { key: 'notifications', label: 'Alerts', icon: Bell },
    { key: 'appearance', label: 'Interface', icon: Palette },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 page-enter relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="stagger-1">
        <h1 className="text-3xl font-black tracking-tight" style={{ color: '#0f172a' }}>
          System <span className="text-teal-600">Preferences</span>
        </h1>
        <p className="text-[14px] font-bold mt-1" style={{ color: '#64748b' }}>
          Configuring <span className="text-teal-600">{user?.name}'s</span> operational environment
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 space-y-2 stagger-2">
          {tabs.map((tab) => {
             const Icon = tab.icon;
             return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-[13px] font-black transition-all duration-300 ${
                  activeTab === tab.key 
                    ? 'bg-slate-900 text-white shadow-xl translate-x-2' 
                    : 'bg-white text-slate-500 border border-slate-100 hover:border-teal-500 hover:text-teal-600'
                }`}
              >
                <Icon className={`h-4 w-4 ${activeTab === tab.key ? 'text-teal-400' : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 stagger-3">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="card-3d p-8 bg-white/40 backdrop-blur-xl">
                <div className="flex items-center gap-6 mb-8">
                  <div className="h-20 w-20 rounded-3xl bg-teal-500 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-teal-500/20">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{user?.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="badge badge-teal font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                        <Shield className="h-3 w-3" /> {user?.role} ACCESS
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">UID: {user?.id.slice(0,8).toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Fields', value: profileStats.fields, color: 'text-teal-600' },
                    { label: 'Tasks', value: profileStats.tasks, color: 'text-blue-600' },
                    { label: 'Inventory', value: profileStats.inventory, color: 'text-amber-600' },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/60 p-5 rounded-2xl border border-white text-center shadow-sm">
                      <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Enterprise Name</label>
                      <input 
                        className={`input-field h-14 font-bold ${errorsProfile.name ? 'border-rose-400' : ''}`}
                        {...regProfile('name')}
                      />
                      {errorsProfile.name && <p className="text-[11px] font-bold text-rose-500 mt-1">{errorsProfile.name.message}</p>}
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Secure Email</label>
                      <input 
                        className={`input-field h-14 font-bold ${errorsProfile.email ? 'border-rose-400' : ''}`}
                        {...regProfile('email')}
                      />
                      {errorsProfile.email && <p className="text-[11px] font-bold text-rose-500 mt-1">{errorsProfile.email.message}</p>}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="btn btn-primary px-8 h-12 shadow-xl shadow-teal-500/20">
                      <Save className="h-4 w-4 mr-2" /> 
                      {loading ? 'Synchronising...' : 'Update Identity'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="card-3d p-8 bg-white/40 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Security Credentials</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Maintain protocol integrity</p>
                  </div>
                </div>

                <form onSubmit={handlePass(onPasswordSubmit)} className="space-y-6">
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Current Access Code</label>
                    <input 
                      type="password"
                      className={`input-field h-14 font-bold ${errorsPass.currentPassword ? 'border-rose-400' : ''}`}
                      placeholder="••••••••"
                      {...regPass('currentPassword')}
                    />
                    {errorsPass.currentPassword && <p className="text-[11px] font-bold text-rose-500 mt-1">{errorsPass.currentPassword.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">New Access Code</label>
                      <input 
                        type="password"
                        className={`input-field h-14 font-bold ${errorsPass.newPassword ? 'border-rose-400' : ''}`}
                        placeholder="••••••••"
                        {...regPass('newPassword')}
                      />
                      {errorsPass.newPassword && <p className="text-[11px] font-bold text-rose-500 mt-1">{errorsPass.newPassword.message}</p>}
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Confirm Access Code</label>
                      <input 
                        type="password"
                        className={`input-field h-14 font-bold ${errorsPass.confirmPassword ? 'border-rose-400' : ''}`}
                        placeholder="••••••••"
                        {...regPass('confirmPassword')}
                      />
                      {errorsPass.confirmPassword && <p className="text-[11px] font-bold text-rose-500 mt-1">{errorsPass.confirmPassword.message}</p>}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="btn btn-primary px-8 h-12 shadow-xl shadow-teal-500/20 bg-blue-600 hover:bg-blue-700">
                      <Check className="h-4 w-4 mr-2" /> 
                      {loading ? 'Validating...' : 'Rotate Security Code'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="card-3d p-8 bg-rose-50/30 border-rose-200/50 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-rose-900">Decommission Account</h3>
                    <p className="text-[12px] font-bold text-rose-600/70">Permanently purge all data from the system</p>
                  </div>
                  {!showDeleteConfirm ? (
                    <button onClick={() => setShowDeleteConfirm(true)} className="btn bg-rose-500 text-white border-none px-6 h-10 hover:bg-rose-600 transition-all">
                      <Trash2 className="h-4 w-4 mr-2" /> Purge Data
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button onClick={handleDeleteAccount} disabled={loading} className="btn bg-rose-700 text-white border-none px-6 h-10 hover:bg-rose-800 transition-all">
                        <AlertTriangle className="h-4 w-4 mr-2" /> Confirm Purge
                      </button>
                      <button onClick={() => setShowDeleteConfirm(false)} className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card-3d p-8 bg-white/40 backdrop-blur-xl">
              <div className="mb-8">
                <h3 className="text-lg font-black text-slate-900">Alert Configuration</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Control operational intelligence feeds</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'System Dispatch', desc: 'Critical infrastructure status updates', icon: Mail, checked: true },
                  { label: 'Phase Alerts', desc: 'Real-time crop stage progression notices', icon: Bell, checked: true },
                  { label: 'Activity Reminders', desc: 'Scheduled operational task prompts', icon: Smartphone, checked: false },
                  { label: 'Bi-Weekly Intelligence', desc: 'Condensed enterprise performance metrics', icon: Activity, checked: true },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/60 border border-white hover:bg-white transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-teal-600 transition-colors">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[13px] font-black text-slate-900">{item.label}</p>
                          <p className="text-[11px] font-bold text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                      <div className={`h-6 w-11 rounded-full p-1 cursor-pointer transition-all duration-300 ${item.checked ? 'bg-teal-500' : 'bg-slate-200'}`}>
                        <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ${item.checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="card-3d p-8 bg-white/40 backdrop-blur-xl">
              <div className="mb-8">
                <h3 className="text-lg font-black text-slate-900">Interface Optimisation</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Customise your command center</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white border-2 border-teal-500 shadow-xl shadow-teal-500/5 relative">
                   <div className="absolute top-4 right-4">
                      <Check className="h-5 w-5 text-teal-500" />
                   </div>
                   <div className="h-12 w-12 rounded-2xl bg-slate-100 mb-4 flex items-center justify-center text-slate-400">
                      <Smartphone className="h-6 w-6" />
                   </div>
                   <h4 className="text-[14px] font-black text-slate-900">Light Mode</h4>
                   <p className="text-[11px] font-bold text-slate-400 mt-1">High-clarity interface</p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-900/5 border-2 border-transparent hover:border-slate-200 transition-all group">
                   <div className="h-12 w-12 rounded-2xl bg-slate-800/10 mb-4 flex items-center justify-center text-slate-400 group-hover:text-slate-600">
                      <Lock className="h-6 w-6" />
                   </div>
                   <h4 className="text-[14px] font-black text-slate-900">Dark Mode</h4>
                   <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">In Development</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
