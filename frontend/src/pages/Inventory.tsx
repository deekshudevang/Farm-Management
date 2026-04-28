import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Plus, X, AlertTriangle, Search, 
  Edit3, Trash2, Box, Droplet, Cog, FilterX,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { InventorySchema, type InventoryInput, type InventoryItem } from '../utils/schemas';

const categories = ['SEED', 'FERTILIZER', 'EQUIPMENT'];
const catLabel: Record<string, string> = { SEED: 'Seeds', FERTILIZER: 'Fertilizers', EQUIPMENT: 'Equipment' };
const catIcon: Record<string, any> = { SEED: Box, FERTILIZER: Droplet, EQUIPMENT: Cog };
const catColor: Record<string, string> = { SEED: '#14b8a6', FERTILIZER: '#3b82f6', EQUIPMENT: '#8b5cf6' };

// ─── Memoized Inventory Item ─────────────────────────────────────

const AssetRow = React.memo(({ item, onEdit, onDelete }: { item: InventoryItem, onEdit: (i: InventoryItem) => void, onDelete: (id: string) => void }) => (
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
          <Package className="h-6 w-6" />
        </div>
        <div>
          <p className="text-[14px] font-black text-slate-900">{item.name}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SKU: {item.id.slice(0,8).toUpperCase()}</p>
        </div>
      </div>
    </td>
    <td>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full" style={{ background: catColor[item.category] }}></div>
        <span className="text-[12px] font-black text-slate-600">{catLabel[item.category]}</span>
      </div>
    </td>
    <td>
      <div className="flex items-center gap-4">
        <div className="progress-bar w-32 h-2">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${Math.min((item.quantity / 50) * 100, 100)}%`,
              background: item.quantity < 10 ? 'linear-gradient(90deg, #f43f5e, #e11d48)' : 'linear-gradient(90deg, #10b981, #0d9488)'
            }}
          ></div>
        </div>
        <span className="text-[13px] font-black text-slate-900">{item.quantity}</span>
      </div>
    </td>
    <td>
      {item.quantity < 10 ? (
        <span className="badge badge-red font-black text-[10px] uppercase tracking-wider py-1 px-3 bg-rose-500 text-white shadow-lg shadow-rose-500/20">Critical</span>
      ) : item.quantity < 25 ? (
        <span className="badge badge-yellow font-black text-[10px] uppercase tracking-wider py-1 px-3 bg-amber-500 text-white shadow-lg shadow-amber-500/20">Review</span>
      ) : (
        <span className="badge badge-green font-black text-[10px] uppercase tracking-wider py-1 px-3 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">Stable</span>
      )}
    </td>
    <td className="text-right px-8">
      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(item)}
          className="h-9 w-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-teal-600 hover:border-teal-200 transition-all"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button 
          onClick={() => onDelete(item.id)}
          className="h-9 w-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </td>
  </motion.tr>
));

export const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<InventoryInput>({
    resolver: zodResolver(InventorySchema),
    defaultValues: { name: '', category: 'SEED', quantity: '' },
  });

  const fetchItems = useCallback(async () => {
    try {
      const r = await api.get('/inventory');
      setItems(r.data);
    } catch {
      // Handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleOpenModal = useCallback((item: InventoryItem | null = null) => {
    if (item) {
      setEditingItem(item);
      setValue('name', item.name);
      setValue('category', item.category as InventoryInput['category']);
      setValue('quantity', item.quantity.toString());
    } else {
      setEditingItem(null);
      reset({ name: '', category: 'SEED', quantity: '' });
    }
    setShowModal(true);
  }, [reset, setValue]);

  const onSubmit = async (data: InventoryInput) => {
    try {
      if (editingItem) {
        await api.put(`/inventory/${editingItem.id}`, data);
        toast.success('Asset updated');
      } else {
        await api.post('/inventory', data);
        toast.success('Asset registered');
      }
      setShowModal(false);
      reset();
      fetchItems();
    } catch {
      // Handled by interceptor
    }
  };

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/inventory/${id}`);
        toast.success('Asset deleted');
        fetchItems();
      } catch {
        // Handled by interceptor
      }
    }
  }, [fetchItems]);

  const filtered = useMemo(() => items.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? i.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  }), [items, search, selectedCategory]);
  
  const lowStock = useMemo(() => items.filter(i => i.quantity < 10), [items]);

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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: '#0f172a' }}>
            Resource <span className="text-teal-600">Inventory</span>
          </h1>
          <p className="text-[14px] font-bold mt-1" style={{ color: '#64748b' }}>
            Managing <span className="text-teal-600">{items.length}</span> active stock items across your enterprise
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => handleOpenModal()} className="btn btn-primary px-6 shadow-xl shadow-teal-500/20">
            <Plus className="h-4 w-4" /> Add New Asset
          </button>
        </div>
      </div>

      {/* Critical Alerts Panel */}
      <AnimatePresence>
        {lowStock.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass border-rose-200/50 bg-rose-50/30 p-5 shadow-lg shadow-rose-500/5 flex items-center gap-6 group overflow-hidden"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20 flex-shrink-0 animate-pulse">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-black text-rose-900">Replenishment Required</p>
              <p className="text-[13px] font-bold text-rose-600/80 mt-0.5">
                Attention: <span className="text-rose-700">{lowStock.map(i => i.name).join(', ')}</span> are below safety thresholds.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = catIcon[cat];
          const count = items.filter(i => i.category === cat).length;
          const isActive = selectedCategory === cat;
          return (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(isActive ? null : cat)}
              className={`stat-card group relative overflow-hidden transition-all duration-500 ${isActive ? 'scale-[1.02] shadow-2xl' : 'hover:scale-[1.01]'}`}
              style={{
                background: isActive ? `linear-gradient(135deg, ${catColor[cat]}08, ${catColor[cat]}15)` : undefined,
                borderColor: isActive ? catColor[cat] : undefined
              }}
            >
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: isActive ? catColor[cat] : '#94a3b8' }}>{catLabel[cat]}</p>
                  <p className="text-3xl font-black mt-2 text-slate-900 tracking-tight">{count}</p>
                </div>
                <div className={`icon-float w-14 h-14 rounded-2xl transition-all duration-500 ${isActive ? 'rotate-12 scale-110' : 'group-hover:-rotate-12'}`} style={{
                  background: isActive ? `${catColor[cat]}20` : 'rgba(241, 245, 249, 0.7)',
                  color: isActive ? catColor[cat] : '#64748b'
                }}>
                  <Icon className="h-7 w-7" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            className="input-field pl-12 h-12 bg-white/50 focus:bg-white" 
            placeholder="Search by asset name or SKU..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        {selectedCategory && (
          <button 
            onClick={() => setSelectedCategory(null)} 
            className="btn bg-white border-slate-200 text-rose-500 font-black text-[12px] px-4 hover:bg-rose-50 hover:border-rose-200 transition-all"
          >
            <FilterX className="h-4 w-4 mr-2" /> Reset View
          </button>
        )}
      </div>

      {/* Data Visual Table */}
      {filtered.length === 0 ? (
        <div className="empty-state py-20 bg-white/30 backdrop-blur-md">
          <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
            <Package className="h-10 w-10 text-slate-300" />
          </div>
          <p className="text-xl font-black text-slate-800">No Assets Identified</p>
          <p className="text-slate-500 font-bold max-w-xs mt-2">
            We couldn't find any items matching your current search parameters.
          </p>
        </div>
      ) : (
        <div className="card-3d overflow-hidden bg-white/40 backdrop-blur-xl border-white/60">
          <table className="data-table">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-5">Item Definition</th>
                <th>Classification</th>
                <th>Supply Level</th>
                <th>Operational Status</th>
                <th className="text-right px-8">Management</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.map(item => (
                  <AssetRow 
                    key={item.id} 
                    item={item} 
                    onEdit={handleOpenModal} 
                    onDelete={handleDelete} 
                  />
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
            <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-black text-white">
                  {editingItem ? 'Update Asset' : 'Register Asset'}
                </h2>
                <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest mt-0.5">Asset Management System</p>
              </div>
              <button onClick={() => { setShowModal(false); reset(); }} className="h-10 w-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body space-y-6 p-8 bg-white">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Item Identification</label>
                    <div className="relative">
                       <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                       <input 
                        className={`input-field pl-12 h-14 text-[15px] font-bold ${errors.name ? 'border-rose-400' : ''}`}
                        placeholder="e.g., Premium Phosphate Fertilizer" 
                        {...register('name')}
                      />
                    </div>
                    {errors.name && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.name.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Classification</label>
                      <select 
                        className="input-field h-14 font-bold" 
                        {...register('category')}
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{catLabel[c]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Initial Quantity</label>
                      <input 
                        type="number" 
                        min="0" 
                        className={`input-field h-14 font-bold ${errors.quantity ? 'border-rose-400' : ''}`}
                        placeholder="00" 
                        {...register('quantity')}
                      />
                      {errors.quantity && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.quantity.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-8 py-6 bg-slate-50 flex items-center justify-between rounded-b-2xl">
                <button type="button" onClick={() => { setShowModal(false); reset(); }} className="text-[13px] font-black text-slate-500 hover:text-slate-900 transition-colors">
                  Discard Changes
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary h-12 px-8 shadow-xl shadow-teal-500/20">
                  {editingItem ? 'Confirm Update' : 'Initialize Asset'}
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
