import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, Plus, X, Search, Sprout, Sun, Wheat, FilterX,
  ArrowRight, MapPin, MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { CropSchema, type CropInput, type Crop, type Field } from '../utils/schemas';

const stages = ['Seedling', 'Growing', 'Ready', 'Harvested'];
const stagePercent: Record<string, number> = { Seedling: 25, Growing: 55, Ready: 85, Harvested: 100 };
const stageIcon: Record<string, any> = { Seedling: Sprout, Growing: Sun, Ready: Wheat, Harvested: Leaf };
const stageColor: Record<string, string> = { Seedling: '#3b82f6', Growing: '#f59e0b', Ready: '#10b981', Harvested: '#8b5cf6' };

// ─── Memoized Table Row ──────────────────────────────────────────

const CropRow = React.memo(({ crop, onUpdateStage }: { crop: Crop, onUpdateStage: (id: string, stage: string) => void }) => (
  <motion.tr 
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="group hover:bg-white/60 transition-all border-b border-slate-100 last:border-0"
  >
    <td className="py-5 px-8">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-teal-600 border border-slate-100 group-hover:scale-110 transition-transform">
          <Leaf className="h-6 w-6" />
        </div>
        <div>
          <p className="text-[14px] font-black text-slate-900">{crop.name}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID: {crop.id.slice(0,8).toUpperCase()}</p>
        </div>
      </div>
    </td>
    <td>
      <div className="flex items-center gap-2">
        <MapPin className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-[12px] font-black text-slate-600">{crop.field?.name || 'Unassigned'}</span>
      </div>
    </td>
    <td>
      <span className={`badge font-black text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg text-white shadow-lg`} style={{
         background: stageColor[crop.stage],
         boxShadow: `0 8px 16px ${stageColor[crop.stage]}20`
      }}>
        {crop.stage}
      </span>
    </td>
    <td>
      <div className="flex items-center gap-4">
        <div className="progress-bar w-32 h-2">
          <div className="progress-fill" style={{ 
            width: `${stagePercent[crop.stage] || 0}%`,
            background: stageColor[crop.stage] 
          }}></div>
        </div>
        <span className="text-[13px] font-black text-slate-900">{stagePercent[crop.stage]}%</span>
      </div>
    </td>
    <td>
      <div className="flex flex-col">
         <span className="text-[12px] font-bold text-slate-700">{new Date(crop.plantedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
         <span className="text-[10px] font-bold text-slate-400 uppercase">Planted</span>
      </div>
    </td>
    <td className="text-right px-8">
      <div className="flex items-center justify-end gap-3">
        <select
          value={crop.stage}
          onChange={e => onUpdateStage(crop.id, e.target.value)}
          className="h-10 rounded-xl bg-white border border-slate-200 px-4 text-[12px] font-black outline-none transition-all focus:border-teal-500 cursor-pointer"
          style={{ color: '#0f172a' }}
        >
          {stages.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-white hover:text-teal-600 hover:shadow-md transition-all">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </td>
  </motion.tr>
));

export const Crops = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CropInput>({
    resolver: zodResolver(CropSchema),
    defaultValues: { name: '', stage: 'Seedling', fieldId: '' },
  });

  const fetchData = useCallback(async () => {
    try {
      const [c, f] = await Promise.all([api.get('/crops'), api.get('/fields')]);
      setCrops(c.data); setFields(f.data);
    } catch {
      // Handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onSubmit = async (data: CropInput) => {
    try {
      await api.post('/crops', data);
      toast.success('Crop initialized successfully');
      setShowModal(false);
      reset();
      fetchData();
    } catch {
      // Handled by interceptor
    }
  };

  const updateStage = useCallback(async (id: string, stage: string) => {
    try {
      await api.put(`/crops/${id}`, { stage });
      toast.success('Stage updated');
      fetchData();
    } catch {
      // Handled by interceptor
    }
  }, [fetchData]);

  const filtered = useMemo(() => crops.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStage = selectedStage ? c.stage === selectedStage : true;
    return matchesSearch && matchesStage;
  }), [crops, search, selectedStage]);

  if (loading) return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="skeleton h-10 w-48"></div>
        <div className="skeleton h-10 w-32"></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="stat-card h-32 animate-pulse"></div>)}
      </div>
    </div>
  );

  const stageCounts = stages.map(s => ({ stage: s, count: crops.filter(c => c.stage === s).length }));

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: '#0f172a' }}>
            Cultivation <span className="text-teal-600">Lifecycle</span>
          </h1>
          <p className="text-[14px] font-bold mt-1" style={{ color: '#64748b' }}>
            Tracking <span className="text-teal-600">{crops.length}</span> active crops across <span className="text-teal-600">{fields.length}</span> soil sectors
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowModal(true)} className="btn btn-primary px-6 shadow-xl shadow-teal-500/20">
            <Plus className="h-4 w-4" /> Initialize New Cultivation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stageCounts.map((s) => {
          const Icon = stageIcon[s.stage];
          const isActive = selectedStage === s.stage;
          return (
            <button 
              key={s.stage} 
              onClick={() => setSelectedStage(isActive ? null : s.stage)}
              className={`stat-card group transition-all duration-500 ${isActive ? 'scale-[1.02] shadow-2xl' : 'hover:scale-[1.01]'}`}
              style={{
                background: isActive ? `linear-gradient(135deg, ${stageColor[s.stage]}08, ${stageColor[s.stage]}15)` : undefined,
                borderColor: isActive ? stageColor[s.stage] : undefined
              }}
            >
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: isActive ? stageColor[s.stage] : '#94a3b8' }}>{s.stage}</p>
                  <p className="text-3xl font-black mt-2 text-slate-900 tracking-tight">{s.count}</p>
                </div>
                <div className={`icon-float w-14 h-14 rounded-2xl transition-all duration-500 ${isActive ? 'rotate-12 scale-110' : 'group-hover:-rotate-12'}`} style={{
                  background: isActive ? `${stageColor[s.stage]}20` : 'rgba(241, 245, 249, 0.7)',
                  color: stageColor[s.stage]
                }}>
                  <Icon className="h-7 w-7" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            className="input-field pl-12 h-12 bg-white/50 focus:bg-white" 
            placeholder="Search active crop variants..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        {selectedStage && (
          <button 
            onClick={() => setSelectedStage(null)} 
            className="btn bg-white border-slate-200 text-rose-500 font-black text-[12px] px-4 hover:bg-rose-50 hover:border-rose-200 transition-all"
          >
            <FilterX className="h-4 w-4 mr-2" /> Reset Stages
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state py-20 bg-white/30 backdrop-blur-md">
           <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
            <Sprout className="h-10 w-10 text-slate-300" />
          </div>
          <p className="text-xl font-black text-slate-800">No Cultivations Found</p>
          <p className="text-slate-500 font-bold max-w-xs mt-2 text-center">
            {selectedStage ? `No crops currently in the ${selectedStage} phase.` : 'Start your first cultivation by clicking the button above.'}
          </p>
        </div>
      ) : (
        <div className="card-3d overflow-hidden bg-white/40 backdrop-blur-xl">
          <table className="data-table">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-5 px-8">Crop Identity</th>
                <th>Assigned Sector</th>
                <th>Phase Status</th>
                <th>Yield Potential</th>
                <th>Timeline</th>
                <th className="text-right px-8">Phase Control</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.map(crop => (
                  <CropRow key={crop.id} crop={crop} onUpdateStage={updateStage} />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay z-[60]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="modal-content overflow-hidden border-none shadow-[0_40px_120px_rgba(0,0,0,0.4)]"
          >
             <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-black text-white">Cultivation Protocol</h2>
                <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest mt-0.5">Initialize New growth cycle</p>
              </div>
              <button onClick={() => { setShowModal(false); reset(); }} className="h-10 w-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body space-y-6 p-8 bg-white">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Crop Variant</label>
                    <div className="relative">
                       <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                       <input 
                        className={`input-field pl-12 h-14 text-[15px] font-bold ${errors.name ? 'border-rose-400' : ''}`}
                        placeholder="e.g., Winter Wheat v2.4" 
                        {...register('name')}
                      />
                    </div>
                    {errors.name && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.name.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Assign Sector</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <select 
                          className={`input-field pl-12 h-14 font-bold ${errors.fieldId ? 'border-rose-400' : ''}`}
                          {...register('fieldId')}
                        >
                          <option value="">Select Sector</option>
                          {fields.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                      </div>
                      {errors.fieldId && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.fieldId.message}</p>}
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Initial Phase</label>
                      <select 
                        className="input-field h-14 font-bold" 
                        {...register('stage')}
                      >
                        {stages.slice(0,3).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-8 py-6 bg-slate-50 flex items-center justify-between">
                <button type="button" onClick={() => { setShowModal(false); reset(); }} className="text-[13px] font-black text-slate-500 hover:text-slate-900 transition-colors">
                  Abort Setup
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary h-12 px-8 shadow-xl shadow-teal-500/20">
                  {isSubmitting ? 'Initializing...' : 'Initialize Cultivation'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
