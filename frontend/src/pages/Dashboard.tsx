import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  Map, Leaf, CheckSquare, DollarSign,
  ArrowUpRight, ArrowDownRight, Plus, CloudSun, Droplets, Wind,
  TrendingUp, Zap, Clock, Activity
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { type Task } from '../utils/schemas';

interface DashboardData {
  kpis: {
    totalFields: number;
    totalCrops: number;
    activeTasks: number;
    revenue: number;
    expenses: number;
    profit: number;
  };
  chartData: Array<{ name: string; revenue: number; expenses: number }>;
  cropsDistribution: Array<{ name: string; value: number }>;
  tasks: Task[];
}

// ─── Memoized Sub-Components ──────────────────────────────────────

const KPICard = React.memo(({ label, value, change, up, icon: Icon, iconClass }: any) => (
  <div className="stat-card group">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: '#94a3b8' }}>{label}</span>
      <div className={`icon-float ${iconClass} transition-transform group-hover:scale-110 group-hover:rotate-6`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <div className="flex items-end gap-3">
      <span className="text-3xl font-black text-slate-900 tracking-tight">{value}</span>
      <div className={`flex items-center gap-1 text-[12px] font-black mb-1.5 ${up ? 'text-emerald-500' : 'text-rose-500'}`}>
        {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
        {change}
      </div>
    </div>
  </div>
));

const YieldChart = React.memo(({ data }: { data: any[] }) => (
  <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barGap={12}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.4)" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          fontSize={11} 
          fontWeight={900} 
          tick={{ fill: '#94a3b8' }} 
          dy={12} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          fontSize={11} 
          fontWeight={900} 
          tick={{ fill: '#94a3b8' }} 
        />
        <Tooltip
          cursor={{ fill: 'rgba(20,184,166,0.03)' }}
          contentStyle={{ 
            borderRadius: 20, 
            border: 'none', 
            background: 'rgba(255,255,255,0.95)', 
            backdropFilter: 'blur(10px)', 
            boxShadow: '0 25px 50px rgba(0,0,0,0.1)', 
            fontWeight: 900,
            fontSize: '12px'
          }}
        />
        <Bar dataKey="revenue" fill="#14b8a6" radius={[8, 8, 0, 0]} />
        <Bar dataKey="expenses" fill="#3b82f6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
));

const AssetDistribution = React.memo(({ crops, colors }: { crops: any[], colors: string[] }) => (
  <div className="h-56 relative flex items-center justify-center">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie 
          data={crops} 
          cx="50%" 
          cy="50%" 
          innerRadius={65} 
          outerRadius={85} 
          paddingAngle={8} 
          dataKey="value" 
          strokeWidth={0}
        >
          {crops.map((_, idx) => (
            <Cell key={idx} fill={colors[idx % colors.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            borderRadius: 16, 
            border: 'none', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            fontWeight: 900
          }} 
        />
      </PieChart>
    </ResponsiveContainer>
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span className="text-3xl font-black text-slate-900">{crops.length}</span>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stages</span>
    </div>
  </div>
));

// ─── Weather Card Component ───────────────────────────────────────

const WeatherCard = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    try {
      // Default to Bangalore, India (Lat: 12.97, Lon: 77.59)
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,surface_pressure&daily=uv_index_max&timezone=auto');
      const data = await res.json();
      setWeather({
        temp: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        wind: data.current.wind_speed_10m,
        code: data.current.weather_code,
        pressure: data.current.surface_pressure,
        uv: data.daily.uv_index_max[0]
      });
    } catch (error) {
      console.error('Weather fetch failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Update every 5 mins
    return () => clearInterval(interval);
  }, []);

  const getWeatherDesc = (code: number) => {
    if (code === 0) return 'Clear Sky';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Drizzle/Rain';
    if (code <= 77) return 'Snowy';
    if (code <= 99) return 'Thunderstorm';
    return 'Optimised';
  };

  if (loading) return <div className="lg:col-span-2 weather-card animate-pulse bg-white/20"></div>;

  return (
    <div className="lg:col-span-2 weather-card group">
       <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-5">
            <div className="weather-icon-box group-hover:rotate-12 transition-transform duration-500">
              <CloudSun className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{weather?.temp || '28.4'}°C</h3>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">
                {getWeatherDesc(weather?.code)} • <span className="text-teal-600">Real-time</span>
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</p>
             <p className="text-[12px] font-black text-emerald-500">OPTIMISED</p>
          </div>
       </div>

       {/* Middle Section - Environmental Intelligence */}
       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="weather-stat-box p-4">
             <div className="flex items-center gap-2 mb-2">
                <Droplets className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Humidity</span>
             </div>
             <p className="text-[18px] font-black text-slate-900">{weather?.humidity}%</p>
          </div>
          <div className="weather-stat-box p-4">
             <div className="flex items-center gap-2 mb-2">
                <Wind className="h-3.5 w-3.5 text-teal-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Wind</span>
             </div>
             <p className="text-[18px] font-black text-slate-900">{weather?.wind} <span className="text-[10px]">km/h</span></p>
          </div>
          <div className="weather-stat-box p-4">
             <div className="flex items-center gap-2 mb-2">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">UV Index</span>
             </div>
             <p className="text-[18px] font-black text-slate-900">{weather?.uv}</p>
          </div>
          <div className="weather-stat-box p-4">
             <div className="flex items-center gap-2 mb-2">
                <Activity className="h-3.5 w-3.5 text-rose-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pressure</span>
             </div>
             <p className="text-[18px] font-black text-slate-900">{Math.round(weather?.pressure)} <span className="text-[10px]">hPa</span></p>
          </div>
       </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────

export const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setData(res.data);
    } catch {
      // Handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const pieColors = useMemo(() => ['#14b8a6', '#3b82f6', '#f59e0b', '#8b5cf6'], []);

  const kpis = useMemo(() => [
    { label: 'Registered Sectors', value: data?.kpis?.totalFields || 0, change: '+2', up: true, icon: Map, color: '#14b8a6', iconClass: 'icon-float-teal' },
    { label: 'Active Cultivations', value: data?.kpis?.totalCrops || 0, change: '+5', up: true, icon: Leaf, color: '#3b82f6', iconClass: 'icon-float-blue' },
    { label: 'Pending Activities', value: data?.kpis?.activeTasks || 0, change: '-3', up: false, icon: CheckSquare, color: '#f59e0b', iconClass: 'icon-float-amber' },
    { label: 'Projected Net Yield', value: `\u20b9${(data?.kpis?.profit || 0).toLocaleString()}`, change: '+12%', up: true, icon: DollarSign, color: '#8b5cf6', iconClass: 'icon-float-purple' },
  ], [data]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="skeleton h-10 w-64"></div>
          <div className="skeleton h-10 w-32"></div>
        </div>
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

  return (
    <div className="space-y-8 relative">
      {/* Hero Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight" style={{ color: '#0f172a' }}>
            System <span className="text-teal-600">Intelligence</span>
          </h1>
          <p className="text-[14px] font-bold" style={{ color: '#64748b' }}>
            Operations Command • <span className="text-teal-600/80">Welcome back, {user?.name || 'User'}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-primary px-6 shadow-xl shadow-teal-500/20">
            <Plus className="h-4 w-4" /> Global Task Update
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card-3d p-8 lg:col-span-2 bg-white/40 backdrop-blur-xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-600 border border-teal-500/10">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-[16px] font-black text-slate-900">Yield Analytics</h2>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Performance Protocol v4.0</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button className="px-4 py-2 bg-white text-[11px] font-black text-slate-900 rounded-lg shadow-sm">Monthly</button>
              <button className="px-4 py-2 text-[11px] font-black text-slate-500 hover:text-slate-900">Yearly</button>
            </div>
          </div>
          <YieldChart data={data?.chartData || []} />
        </div>

        <div className="card-3d p-8 bg-white/40 backdrop-blur-xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 border border-blue-500/10">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-[16px] font-black text-slate-900">Bio-Assets</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Phase Distribution</p>
            </div>
          </div>
          <AssetDistribution crops={data?.cropsDistribution || []} colors={pieColors} />
          <div className="mt-8 space-y-2">
            {(data?.cropsDistribution || []).map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-white/50 hover:bg-white transition-all border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full" style={{ background: pieColors[idx % pieColors.length] }}></div>
                  <span className="text-[12px] font-black text-slate-600">{item.name}</span>
                </div>
                <span className="text-[12px] font-black text-slate-900">{item.value} Units</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <WeatherCard />

        <div className="lg:col-span-3 card-3d p-0 bg-white/40 backdrop-blur-xl">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h2 className="text-[16px] font-black text-slate-900">Production Timeline</h2>
            <button className="text-[11px] font-black text-teal-600 uppercase tracking-widest hover:underline">Full Roadmap</button>
          </div>
          <div className="divide-y divide-slate-100">
            {(data?.tasks || []).map((task, idx) => (
              <div key={idx} className="flex items-center justify-between px-8 py-5 hover:bg-white transition-all cursor-pointer group">
                <div className="flex items-center gap-5">
                  <div className={`h-3 w-3 rounded-full ${task.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                  <div>
                    <p className="text-[14px] font-black text-slate-900 group-hover:text-teal-600 transition-colors">{task.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Objective Code: TSK-{idx+102}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-100/80 text-[11px] font-black text-slate-600">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'ASAP'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

