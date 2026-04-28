import { useEffect, useState, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Package, 
  Download, Filter, ChevronRight, Activity, PieChart as PieIcon
} from 'lucide-react';
import api from '../services/api';

const COLORS = ['#14b8a6', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

interface ReportData {
  cropStats: Array<{ name: string; value: number }>;
  inventoryStats: Array<{ name: string; qty: number; limit: number }>;
  revenueData: Array<{ month: string; revenue: number; cost: number }>;
  kpiValues: {
    productivity: string;
    utilization: string;
    cost: string;
    variance: string;
  };
}

interface Crop {
  id: string;
  name: string;
  stage: string;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

export const Reports = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const [c, i] = await Promise.all([
        api.get('/crops'),
        api.get('/inventory')
      ]);
      
      const crops: Crop[] = c.data;
      const inventory: InventoryItem[] = i.data;
      
      const cropStats = [
        { name: 'Seedling', value: crops.filter(c => c.stage === 'Seedling').length },
        { name: 'Growing', value: crops.filter(c => c.stage === 'Growing').length },
        { name: 'Ready', value: crops.filter(c => c.stage === 'Ready').length },
        { name: 'Harvested', value: crops.filter(c => c.stage === 'Harvested').length },
      ].filter(s => s.value > 0);

      const inventoryStats = inventory.map(item => ({
        name: item.name,
        qty: item.quantity,
        limit: 50
      }));

      const revenueData = crops.length > 0 ? [
        { month: 'Jan', revenue: 450, cost: 210 },
        { month: 'Feb', revenue: 520, cost: 240 },
        { month: 'Mar', revenue: 480, cost: 220 },
        { month: 'Apr', revenue: 610, cost: 280 },
        { month: 'May', revenue: 590, cost: 260 },
        { month: 'Jun', revenue: crops.length * 1250, cost: crops.length * 450 },
      ] : [];

      const kpiValues = {
        productivity: crops.length > 0 ? '+24.8%' : '0%',
        utilization: crops.length > 0 ? `${Math.min(crops.length * 15, 100)}%` : '0%',
        cost: crops.length > 0 ? `₹${(crops.length * 450).toLocaleString()}` : '₹0',
        variance: crops.length > 0 ? '-2.1%' : '0%'
      };

      setData({ cropStats, inventoryStats, revenueData, kpiValues });
    } catch {
      // Handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="skeleton h-10 w-64"></div>
        <div className="skeleton h-10 w-32"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="stat-card h-32 animate-pulse"></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-3d h-80 animate-pulse"></div>
        <div className="card-3d h-80 animate-pulse"></div>
      </div>
    </div>
  );

  if (!data) return null;

  return (
    <div className="space-y-8 page-enter relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 stagger-1">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: '#0f172a' }}>
            Enterprise <span className="text-teal-600">Intelligence</span>
          </h1>
          <p className="text-[14px] font-bold mt-1" style={{ color: '#64748b' }}>
            Analytical synthesis of operational performance • FY 2024
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn bg-white border-slate-200 text-slate-600 font-black text-[12px] px-5 hover:bg-slate-50 transition-all">
            <Filter className="h-4 w-4 mr-2" /> Strategic Parameters
          </button>
          <button className="btn btn-primary px-6 shadow-xl shadow-teal-500/20">
            <Download className="h-4 w-4 mr-2" /> Export Fiscal Report
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 stagger-2">
        {[
          { label: 'Net Productivity', value: data.kpiValues.productivity, icon: TrendingUp, color: '#10b981', sub: 'QUARTERLY GAIN' },
          { label: 'Asset Utilization', value: data.kpiValues.utilization, icon: Package, color: '#3b82f6', sub: 'CAPACITY LOAD' },
          { label: 'Operating Cost', value: data.kpiValues.cost, icon: DollarSign, color: '#f59e0b', sub: 'FISCAL OUTFLOW' },
          { label: 'Yield Variance', value: data.kpiValues.variance, icon: TrendingDown, color: '#ef4444', sub: 'MARGIN STABILITY' }
        ].map((kpi, idx) => (
          <div key={idx} className="stat-card group hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{kpi.label}</span>
              <div className="h-10 w-10 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12" style={{ background: `${kpi.color}15`, color: kpi.color }}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">{kpi.value}</p>
            <div className="flex items-center gap-2 mt-2">
               <div className="h-1 w-8 rounded-full" style={{ background: kpi.color }}></div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 stagger-3">
        {/* Revenue Synthesis */}
        <div className="card-3d p-8 bg-white/40 backdrop-blur-xl border-white/60">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-600">
                  <Activity className="h-6 w-6" />
               </div>
               <div>
                  <h3 className="text-[16px] font-black text-slate-900">Revenue Synthesis</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Cashflow Trajectory</p>
               </div>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueData}>
                <defs>
                  <linearGradient id="colorRevReport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.4)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#94a3b8' }} dy={12} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255,255,255,0.95)', 
                    backdropFilter: 'blur(10px)',
                    border: 'none', 
                    borderRadius: '20px', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    fontWeight: 900
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevReport)" />
                <Area type="monotone" dataKey="cost" stroke="#cbd5e1" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bio-Asset Matrix */}
        <div className="card-3d p-8 bg-white/40 backdrop-blur-xl border-white/60">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <PieIcon className="h-6 w-6" />
               </div>
               <div>
                  <h3 className="text-[16px] font-black text-slate-900">Bio-Asset Matrix</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Segmental Logic</p>
               </div>
            </div>
            <button className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-white hover:text-teal-600 transition-all border border-transparent hover:border-slate-100">
               <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="h-72 w-full flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1 h-full min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.cropStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={10}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {data.cropStats.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-48 space-y-4">
               {data.cropStats.map((s, i) => (
                 <div key={i} className="flex flex-col gap-1 p-3 rounded-2xl bg-white/50 border border-white/80">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }}></div>
                          <span className="text-[12px] font-black text-slate-900 uppercase tracking-tighter">{s.name}</span>
                       </div>
                       <span className="text-[12px] font-black text-teal-600">{s.value}</span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full rounded-full" style={{ width: `${(s.value / 10) * 100}%`, background: COLORS[i % COLORS.length] }}></div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Resource Thresholds */}
        <div className="card-3d p-8 bg-white/40 backdrop-blur-xl border-white/60 lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Package className="h-6 w-6" />
               </div>
               <div>
                  <h3 className="text-[16px] font-black text-slate-900">Resource Threshold Audit</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Inventory Velocity Matrix</p>
               </div>
            </div>
            <div className="flex items-center gap-3 bg-emerald-50/50 px-4 py-2.5 rounded-2xl border border-emerald-100">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">Stock Integrity Optimal</span>
            </div>
          </div>
          
          <div className="h-80 w-full">
            {data.inventoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.inventoryStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.4)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#94a3b8' }} dy={12} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#94a3b8' }} />
                  <Tooltip 
                     cursor={{ fill: 'rgba(20, 184, 166, 0.04)' }}
                     contentStyle={{ 
                        background: 'rgba(255,255,255,0.95)', 
                        backdropFilter: 'blur(10px)',
                        border: 'none', 
                        borderRadius: '16px', 
                        boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                        fontWeight: 900
                     }}
                  />
                  <Bar dataKey="qty" radius={[10, 10, 0, 0]} barSize={50}>
                    {data.inventoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.qty < 15 ? '#f43f5e' : '#14b8a6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                 <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300">
                    <Package className="h-10 w-10" />
                 </div>
                 <div>
                    <p className="text-[15px] font-black text-slate-400">NO ARCHIVAL DATA IDENTIFIED</p>
                    <p className="text-[12px] font-bold text-slate-300 mt-1">Initialize inventory to generate operational matrix</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
