import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  Map, Leaf, CheckSquare, DollarSign,
  ArrowUpRight, ArrowDownRight, Plus, CloudSun, Droplets, Wind,
  TrendingUp, Calendar, Activity, Zap, Clock
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setData(res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const crops = data?.kpis?.totalCrops > 0 ? [
    { name: 'Active', value: 75 },
    { name: 'Planned', value: 25 },
  ] : [];

  const tasksList = data?.tasks || [];
  const pieColors = ['#14b8a6', '#3b82f6', '#f59e0b', '#8b5cf6'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="stat-card h-32 animate-pulse"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card-3d h-80 lg:col-span-2 animate-pulse"></div>
          <div className="card-3d h-80 animate-pulse"></div>
        </div>
      </div>
    );
  }

  const kpis = [
    { label: 'Registered Fields', value: data?.kpis?.totalFields || 0, change: '+2', up: true, icon: Map, color: '#14b8a6', iconClass: 'icon-float-teal' },
    { label: 'Active Crops', value: data?.kpis?.totalCrops || 0, change: '+5', up: true, icon: Leaf, color: '#3b82f6', iconClass: 'icon-float-blue' },
    { label: 'Pending Tasks', value: data?.kpis?.activeTasks || 0, change: '-3', up: false, icon: CheckSquare, color: '#f59e0b', iconClass: 'icon-float-amber' },
    { label: 'Estimated Revenue', value: `₹${(data?.kpis?.profit || 0).toLocaleString()}`, change: '+12%', up: true, icon: DollarSign, color: '#8b5cf6', iconClass: 'icon-float-purple' },
  ];

  return (
    <div className="space-y-8 page-enter relative">
      {/* Background Orbs for Depth */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-teal-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Hero Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 stagger-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight" style={{ color: '#0f172a' }}>
            System <span className="text-teal-600">Overview</span>
          </h1>
          <p className="text-[14px] font-bold" style={{ color: '#64748b' }}>
            Hello, {user?.name} • <span className="text-teal-600/80">Operations are running optimally today</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <div className="h-8 w-8 rounded-full border-2 border-white bg-teal-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              +4
            </div>
          </div>
          <button className="btn btn-primary px-6 shadow-xl shadow-teal-500/20">
            <Plus className="h-4 w-4" /> New Field Report
          </button>
        </div>
      </div>

      {/* KPI Cards — Glassmorphic & Colorful */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => (
          <div key={kpi.label} className={`stat-card group stagger-${idx + 2}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black uppercase tracking-[0.15em]" style={{ color: '#94a3b8' }}>{kpi.label}</span>
              <div className={`icon-float ${kpi.iconClass} transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{kpi.value}</span>
              <div className={`flex items-center gap-1 text-[12px] font-black mb-1.5 ${kpi.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                {kpi.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {kpi.change}
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: '70%', background: kpi.color, opacity: 0.3 }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 stagger-5">
        {/* Growth Analytics */}
        <div className="card-3d p-8 lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 border border-teal-500/10">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-[16px] font-black text-slate-900">Yield Analytics</h2>
                <p className="text-[11px] font-bold text-slate-400">PROJECTED VS ACTUAL PERFORMANCE</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-100/50 p-1 rounded-xl">
              <button className="px-3 py-1.5 bg-white text-[11px] font-bold text-slate-900 rounded-lg shadow-sm border border-slate-200">Revenue</button>
              <button className="px-3 py-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-900">Volume</button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.chartData || []} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.5)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} fontWeight={700} tick={{ fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} fontSize={11} fontWeight={700} tick={{ fill: '#94a3b8' }} />
                <Tooltip
                  cursor={{ fill: 'rgba(20,184,166,0.02)' }}
                  contentStyle={{ borderRadius: 16, border: 'none', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 700 }}
                />
                <Bar dataKey="revenue" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resources Distribution */}
        <div className="card-3d p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 border border-blue-500/10">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[16px] font-black text-slate-900">Crop Allocation</h2>
              <p className="text-[11px] font-bold text-slate-400">TOTAL FARM DISTRIBUTION</p>
            </div>
          </div>
          <div className="h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={crops} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={6} dataKey="value" strokeWidth={0}>
                  {crops.map((_, idx) => (
                    <Cell key={idx} fill={pieColors[idx]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900">{crops.length > 0 ? '75%' : '0%'}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{crops.length > 0 ? 'Active' : 'Ready'}</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {crops.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full" style={{ background: pieColors[idx] }}></div>
                  <span className="text-[12px] font-bold text-slate-600">{item.name}</span>
                </div>
                <span className="text-[12px] font-black text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 stagger-6">
        {/* Climate Insights */}
        <div className="lg:col-span-2 glass overflow-hidden border border-white/40 shadow-xl shadow-teal-500/5 relative group">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-500/5 to-transparent"></div>
          <div className="p-8 relative">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-amber-500 group-hover:rotate-12 transition-transform">
                    <CloudSun className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">28.4°C</h3>
                    <p className="text-[11px] font-black text-slate-400 uppercase">Partly Cloudy • Sunny</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[12px] font-bold text-teal-600">Perfect Conditions</p>
                   <p className="text-[10px] font-bold text-slate-400">92% GROWTH POTENTIAL</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white">
                   <div className="flex items-center gap-2 mb-1">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="text-[10px] font-black text-slate-400 uppercase">Humidity</span>
                   </div>
                   <p className="text-lg font-black text-slate-900">65.2%</p>
                </div>
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white">
                   <div className="flex items-center gap-2 mb-1">
                      <Wind className="h-4 w-4 text-teal-500" />
                      <span className="text-[10px] font-black text-slate-400 uppercase">Wind Spd</span>
                   </div>
                   <p className="text-lg font-black text-slate-900">12 km/h</p>
                </div>
             </div>
          </div>
        </div>

        {/* Real-time Logistics */}
        <div className="lg:col-span-3 card-3d overflow-hidden p-0">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Calendar className="h-5 w-5" />
               </div>
               <h2 className="text-[16px] font-black text-slate-900">Production Schedule</h2>
            </div>
            <button className="text-[12px] font-black text-teal-600 hover:underline">View Roadmap</button>
          </div>
          <div className="divide-y divide-slate-50">
            {tasksList.length > 0 ? tasksList.map((task: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between px-8 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`h-2.5 w-2.5 rounded-full ${task.priority === 'high' ? 'pulse-dot bg-rose-500' : 'bg-amber-400'}`}></div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{task.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Critical Priority • {task.priority}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-[11px] font-black text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            )) : (
              <div className="p-12 text-center">
                <p className="text-slate-400 font-bold text-sm">No scheduled tasks found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
