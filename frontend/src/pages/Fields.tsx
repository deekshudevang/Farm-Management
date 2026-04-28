import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, Plus, X, Edit3, Trash2, 
  Trees, Search, FilterX, MapPin, ArrowRight,
  Maximize2, Ruler, Thermometer
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { FieldSchema, type FieldInput, type Field } from '../utils/schemas';

const soilTypes = ['Loamy', 'Clay', 'Sandy', 'Silt', 'Black'];
const soilColor: Record<string, string> = {
  Loamy: '#14b8a6',
  Clay: '#f59e0b',
  Sandy: '#3b82f6',
  Silt: '#8b5cf6',
  Black: '#0f172a'
};

// ─── Memoized Sector Card ────────────────────────────────────────

const SectorCard = React.memo(({ field, onEdit, onDelete }: { field: Field, onEdit: (f: Field) => void, onDelete: (id: string) => void }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="group card-3d p-0 bg-white/40 backdrop-blur-xl border-white/60 hover:shadow-2xl transition-all overflow-hidden flex flex-col sm:flex-row"
  >
    <div className="w-full sm:w-48 bg-slate-100/50 flex flex-col items-center justify-center p-6 border-b sm:border-b-0 sm:border-r border-slate-100 relative group-hover:bg-teal-500/5 transition-colors">
       <div className="h-24 w-24 rounded-2xl bg-white shadow-xl flex items-center justify-center text-teal-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-grid-slate-900/[0.1] [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]"></div>
          <MapPin className="h-10 w-10 relative z-10" />
       </div>
       <div className="mt-4 text-center">
          <p className="text-[16px] font-black text-slate-900">{field.size} AC</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculated Area</p>
       </div>
    </div>

    <div className="flex-1 p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-600 transition-colors">{field.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-2 w-2 rounded-full" style={{ background: soilColor[field.soilType] }}></span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{field.soilType} Soil Profile</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={() => onEdit(field)} className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-teal-600 hover:border-teal-200 transition-all">
                <Edit3 className="h-4 w-4" />
             </button>
             <button onClick={() => onDelete(field.id)} className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                <Trash2 className="h-4 w-4" />
             </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <Trees className="h-4 w-4 text-emerald-500" />
                <span className="text-[12px] font-bold text-slate-700">{field.crops?.length || 0} Crops Active</span>
             </div>
             <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-amber-500" />
                <span className="text-[12px] font-bold text-slate-700">Optimal Stability</span>
             </div>
          </div>
          
          {field.crops && field.crops.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
               {field.crops.map((c) => (
                 <span key={c.id} className="badge badge-teal font-black text-[9px] uppercase">{c.name}</span>
               ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Ruler className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">ID: {field.id.slice(0,12).toUpperCase()}</span>
         </div>
      </div>
    </div>
  </motion.div>
));

export const Fields = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [search, setSearch] = useState('');
  const [selectedSoil, setSelectedSoil] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FieldInput>({
    resolver: zodResolver(FieldSchema),
    defaultValues: { name: '', size: '', soilType: 'Loamy' },
  });

  const fetchFields = useCallback(async () => {
    try {
      const r = await api.get('/fields');
      setFields(r.data);
    } catch {
      // Handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFields(); }, [fetchFields]);

  const handleOpenModal = useCallback((field: Field | null = null) => {
    if (field) {
      setEditingField(field);
      setValue('name', field.name);
      setValue('size', field.size.toString());
      setValue('soilType', field.soilType);
    } else {
      setEditingField(null);
      reset({ name: '', size: '', soilType: 'Loamy' });
    }
    setShowModal(true);
  }, [reset, setValue]);

  const onSubmit = async (data: FieldInput) => {
    try {
      if (editingField) {
        await api.put(`/fields/${editingField.id}`, data);
        toast.success('Sector updated');
      } else {
        await api.post('/fields', data);
        toast.success('Sector initialized');
      }
      setShowModal(false);
      reset();
      fetchFields();
    } catch {
      // Handled by interceptor
    }
  };

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sector? All assigned crops will be removed.')) {
      try {
        await api.delete(`/fields/${id}`);
        toast.success('Sector deleted');
        fetchFields();
      } catch {
        // Handled by interceptor
      }
    }
  }, [fetchFields]);

  const filtered = useMemo(() => fields.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesSoil = selectedSoil ? f.soilType === selectedSoil : true;
    return matchesSearch && matchesSoil;
  }), [fields, search, selectedSoil]);

  const totalAcres = useMemo(() => fields.reduce((s: number, f: Field) => s + f.size, 0), [fields]);
  const totalCrops = useMemo(() => fields.reduce((s: number, f: Field) => s + (f.crops?.length || 0), 0), [fields]);

  if (loading) return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="skeleton h-10 w-48"></div>
        <div className="skeleton h-10 w-32"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3].map(i => <div key={i} className="stat-card h-32 animate-pulse"></div>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: '#0f172a' }}>
            Land <span className="text-teal-600">Inventory</span>
          </h1>
          <p className="text-[14px] font-bold mt-1" style={{ color: '#64748b' }}>
            Total Managed Area: <span className="text-teal-600">{totalAcres.toFixed(1)} Acres</span> across {fields.length} sectors
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => handleOpenModal()} className="btn btn-primary px-6 shadow-xl shadow-teal-500/20">
            <Plus className="h-4 w-4" /> Define New Sector
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="stat-card group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Net Coverage</span>
            <div className="icon-float icon-float-teal transition-transform group-hover:scale-110">
              <Maximize2 className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{totalAcres.toFixed(1)}</span>
            <span className="text-[14px] font-bold text-slate-400 mb-1">Acres</span>
          </div>
        </div>

        <div className="stat-card group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Active Sectors</span>
            <div className="icon-float icon-float-blue transition-transform group-hover:scale-110">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 tracking-tight">{fields.length}</span>
        </div>

        <div className="stat-card group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Total Cultivations</span>
            <div className="icon-float icon-float-amber transition-transform group-hover:scale-110">
              <Trees className="h-5 w-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 tracking-tight">{totalCrops}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-white/40 p-4 rounded-2xl border border-white/60 backdrop-blur-md">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mr-2">Soil Classification:</span>
        {soilTypes.map(soil => {
          const count = fields.filter(f => f.soilType === soil).length;
          const isActive = selectedSoil === soil;
          return (
            <button
              key={soil}
              onClick={() => setSelectedSoil(isActive ? null : soil)}
              className={`group flex items-center gap-3 px-5 py-2.5 rounded-xl text-[12px] font-black transition-all duration-300 ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-xl scale-105' 
                  : 'bg-white text-slate-600 border border-slate-100 hover:border-teal-500'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: soilColor[soil] }}></span>
              {soil}
              <span className={`ml-1 text-[10px] ${isActive ? 'text-teal-400' : 'text-slate-400'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            className="input-field pl-12 h-12 bg-white/50 focus:bg-white" 
            placeholder="Search geospatial directory..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        {selectedSoil && (
          <button 
            onClick={() => setSelectedSoil(null)} 
            className="btn bg-white border-slate-200 text-rose-500 font-black text-[12px] px-4 hover:bg-rose-50 hover:border-rose-200 transition-all"
          >
            <FilterX className="h-4 w-4 mr-2" /> Reset View
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-2 empty-state py-20 bg-white/30 backdrop-blur-md"
            >
               <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
                <Map className="h-10 w-10 text-slate-300" />
              </div>
              <p className="text-xl font-black text-slate-800">No Geospatial Data</p>
            </motion.div>
          ) : (
            filtered.map(field => (
              <SectorCard 
                key={field.id} 
                field={field} 
                onEdit={handleOpenModal} 
                onDelete={handleDelete} 
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {showModal && (
        <div className="modal-overlay z-[60]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="modal-content overflow-hidden border-none shadow-[0_40px_120px_rgba(0,0,0,0.4)]"
          >
             <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-black text-white">Geospatial Setup</h2>
                <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest mt-0.5">Registering Land Sector</p>
              </div>
              <button onClick={() => { setShowModal(false); reset(); }} className="h-10 w-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body space-y-6 p-8 bg-white">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Sector Identifier</label>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                       <input 
                        className={`input-field pl-12 h-14 text-[15px] font-bold ${errors.name ? 'border-rose-400' : ''}`}
                        placeholder="e.g., North Sector, Plot A-12" 
                        {...register('name')}
                      />
                    </div>
                    {errors.name && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.name.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Net Acreage</label>
                      <div className="relative">
                        <Maximize2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                          type="number" 
                          step="0.1" 
                          className={`input-field pl-12 h-14 font-bold ${errors.size ? 'border-rose-400' : ''}`}
                          placeholder="00.0" 
                          {...register('size')}
                        />
                      </div>
                      {errors.size && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.size.message}</p>}
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Soil Composition</label>
                      <select 
                        className="input-field h-14 font-bold" 
                        {...register('soilType')}
                      >
                        {soilTypes.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-8 py-6 bg-slate-50 flex items-center justify-between rounded-b-2xl">
                <button type="button" onClick={() => { setShowModal(false); reset(); }} className="text-[13px] font-black text-slate-500 hover:text-slate-900 transition-colors">
                  Abort Registration
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary h-12 px-8 shadow-xl shadow-teal-500/20">
                  {editingField ? 'Update Sector Data' : 'Initialize Sector'}
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
