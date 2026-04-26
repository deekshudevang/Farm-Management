import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Package, 
  Leaf, Calendar, Download, Filter, ChevronRight
} from 'lucide-react';
import api from '../services/api';

const COLORS = ['#14b8a6', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

export const Reports = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [c, i, f] = await Promise.all([
          api.get('/crops'),
          api.get('/inventory'),
          api.get('/fields')
        ]);
        
        // Mocking some time-series data based on real counts
        const crops = c.data;
        const inventory = i.data;
        
        const cropStats = [
          { name: 'Seedling', value: crops.filter((c:any) => c.stage === 'Seedling').length },
          { name: 'Growing', value: crops.filter((c:any) => c.stage === 'Growing').length },
          { name: 'Ready', value: crops.filter((c:any) => c.stage === 'Ready').length },
          { name: 'Harvested', value: crops.filter((c:any) => c.stage === 'Harvested').length },
        ];

        const inventoryStats = inventory.map((item:any) => ({
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
          cost: crops.length > 0 ? `$${(crops.length * 450).toLocaleString()}` : '$0',
          variance: crops.length > 0 ? '-2.1%' : '0%'
        };

        setData({ cropStats, inventoryStats, revenueData, kpiValues });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8"><div className="skeleton h-10 w-48 mb-8"></div><div className="grid grid-cols-2 gap-8"><div className="skeleton h-64 w-full"></div><div className="skeleton h-64 w-full"></div></div></div>;

  return (
    <div className="space-y-8 page-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 stagger-1">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: '#0f172a' }}>
            Enterprise <span className="text-teal-600">Intelligence</span>
          </h1>
          <p className="text-[14px] font-bold mt-1" style={{ color: '#64748b' }}>
            Aggregated analytical insights for fiscal year 2024
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn bg-white border-slate-200 text-slate-600 font-black text-[12px] px-5 hover:bg-slate-50 transition-all">
            <Filter className="h-4 w-4 mr-2" /> Adjust Parameters
          </button>
          <button className="btn btn-primary px-6 shadow-xl shadow-teal-500/20">
            <Download className="h-4 w-4 mr-2" /> Generate PDF Report
          </button>
        </div>
      </div>

      {/* KPI Overlays */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 stagger-2">
        {[
          { label: 'Net Productivity', value: data.kpiValues.productivity, icon: TrendingUp, color: '#10b981', sub: 'vs previous quarter' },
          { label: 'Asset Utilization', value: data.kpiValues.utilization, icon: Package, color: '#3b82f6', sub: 'Across 12 sectors' },
          { label: 'Operating Cost', value: data.kpiValues.cost, icon: DollarSign, color: '#f59e0b', sub: 'Fixed/Variable mix' },
          { label: 'Yield Variance', value: data.kpiValues.variance, icon: TrendingDown, color: '#ef4444', sub: 'Market adjustment' }
        ].map((kpi, idx) => (
          <div key={idx} className="stat-card group hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{kpi.label}</span>
              <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}15`, color: kpi.color }}>
                <kpi.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 stagger-3">
        {/* Financial Performance */}
        <div className="card-3d p-8 bg-white/40 backdrop-blur-xl border-white/60">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[16px] font-black text-slate-900">Revenue Synthesis</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cashflow trajectory analysis</p>
            </div>
            <div className="flex items-center gap-2">
               <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-teal-500"></div><span className="text-[10px] font-black text-slate-500 uppercase">REV</span></div>
               <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-slate-300"></div><span className="text-[10px] font-black text-slate-500 uppercase">COST</span></div>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ background: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 900 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="cost" stroke="#cbd5e1" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Distribution */}
        <div className="card-3d p-8 bg-white/40 backdrop-blur-xl border-white/60">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[16px] font-black text-slate-900">Bio-Asset Distribution</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Lifecycle stage segmentation</p>
            </div>
            <button className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-white hover:text-teal-600 transition-all">
               <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="h-72 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.cropStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {data.cropStats.map((entry:any, index:number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-40 space-y-3">
               {data.cropStats.map((s:any, i:number) => (
                 <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }}></div>
                       <span className="text-[11px] font-bold text-slate-500">{s.name}</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-900">{s.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Inventory Velocity */}
        <div className="card-3d p-8 bg-white/40 backdrop-blur-xl border-white/60 lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[16px] font-black text-slate-900">Resource Stockpile Auditing</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time inventory level matrix</p>
            </div>
             <div className="flex gap-4">
                <div className={`px-4 py-2 rounded-xl border ${data.inventoryStats.length > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                   <p className={`text-[9px] font-black uppercase tracking-widest ${data.inventoryStats.length > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>Safety Status</p>
                   <p className={`text-[13px] font-black ${data.inventoryStats.length > 0 ? 'text-emerald-700' : 'text-slate-500'}`}>{data.inventoryStats.length > 0 ? 'All Nodes Optimal' : 'No Data'}</p>
                </div>
             </div>
          </div>
          <div className="h-80 w-full">
            {data.inventoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.inventoryStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip 
                     cursor={{ fill: 'rgba(20, 184, 166, 0.05)' }}
                     contentStyle={{ background: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="qty" radius={[6, 6, 0, 0]} barSize={40}>
                    {data.inventoryStats.map((entry:any, index:number) => (
                      <Cell key={`cell-${index}`} fill={entry.qty < 15 ? '#ef4444' : '#14b8a6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                 <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                    <Package className="h-8 w-8" />
                 </div>
                 <p className="text-[13px] font-bold text-slate-400">No resources registered in the system stockpile.</p>
                 <button className="text-[11px] font-black text-teal-600 hover:underline">Register New Resource</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
