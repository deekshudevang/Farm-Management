import React, { useEffect, useState } from 'react';
import { 
  Package, Plus, X, AlertTriangle, Search, 
  Edit3, Trash2, Box, Droplet, Cog, FilterX,
  ArrowRight, Download
} from 'lucide-react';
import api from '../services/api';

const categories = ['SEED', 'FERTILIZER', 'EQUIPMENT'];
const catLabel: Record<string, string> = { SEED: 'Seeds', FERTILIZER: 'Fertilizers', EQUIPMENT: 'Equipment' };
const catIcon: Record<string, any> = { SEED: Box, FERTILIZER: Droplet, EQUIPMENT: Cog };
const catColor: Record<string, string> = { SEED: '#14b8a6', FERTILIZER: '#3b82f6', EQUIPMENT: '#8b5cf6' };

export const Inventory = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form, setForm] = useState({ name: '', category: 'SEED', quantity: '' });
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const r = await api.get('/inventory');
      setItems(r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setForm({ name: item.name, category: item.category, quantity: item.quantity.toString() });
    } else {
      setEditingItem(null);
      setForm({ name: '', category: 'SEED', quantity: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/inventory/${editingItem.id}`, form);
      } else {
        await api.post('/inventory', form);
      }
      setShowModal(false);
      fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/inventory/${id}`);
        fetchItems();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filtered = items.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? i.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  
  const lowStock = items.filter(i => i.quantity < 10);

  if (loading) return (
    <div className="space-y-8 p-4">
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
    <div className="space-y-8 page-enter relative">
      {/* Decorative Orbs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-teal-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 stagger-1">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: '#0f172a' }}>
            Resource <span className="text-teal-600">Inventory</span>
          </h1>
          <p className="text-[14px] font-bold mt-1" style={{ color: '#64748b' }}>
            Managing <span className="text-teal-600">{items.length}</span> active stock items across your enterprise
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary px-5 font-black text-[12px] uppercase tracking-wider">
            <Download className="h-4 w-4 mr-1" /> Export Report
          </button>
          <button onClick={() => handleOpenModal()} className="btn btn-primary px-6 shadow-xl shadow-teal-500/20">
            <Plus className="h-4 w-4" /> Add New Asset
          </button>
        </div>
      </div>

      {/* Critical Alerts Panel */}
      {lowStock.length > 0 && (
        <div className="stagger-2 glass border-rose-200/50 bg-rose-50/30 p-5 shadow-lg shadow-rose-500/5 flex items-center gap-6 group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-full bg-rose-500/5 -skew-x-12 translate-x-16"></div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20 flex-shrink-0 animate-pulse">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-black text-rose-900">Replenishment Required</p>
            <p className="text-[13px] font-bold text-rose-600/80 mt-0.5">
              Attention: <span className="text-rose-700">{lowStock.map(i => i.name).join(', ')}</span> are below safety thresholds.
            </p>
          </div>
          <button className="hidden sm:flex btn btn-sm bg-rose-500 text-white hover:bg-rose-600 border-none px-4">
            Order Now
          </button>
        </div>
      )}

      {/* Category Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stagger-3">
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
              {isActive && (
                 <div className="absolute top-0 right-0 p-2">
                    <div className="h-2 w-2 rounded-full" style={{ background: catColor[cat], boxShadow: `0 0 10px ${catColor[cat]}` }}></div>
                 </div>
              )}
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: isActive ? catColor[cat] : '#94a3b8' }}>{catLabel[cat]}</p>
                  <p className="text-3xl font-black mt-2 text-slate-900 tracking-tight">{count}</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-1">Total SKU Items</p>
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
      <div className="flex flex-col sm:flex-row items-center gap-4 stagger-4">
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
        <div className="ml-auto hidden lg:flex items-center gap-2">
           <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Active Filters:</span>
           <span className="badge badge-teal font-black">{selectedCategory || 'All Categories'}</span>
        </div>
      </div>

      {/* Data Visual Table */}
      {filtered.length === 0 ? (
        <div className="empty-state stagger-5 py-20 bg-white/30 backdrop-blur-md">
          <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
            <Package className="h-10 w-10 text-slate-300" />
          </div>
          <p className="text-xl font-black text-slate-800">No Assets Identified</p>
          <p className="text-slate-500 font-bold max-w-xs mt-2">
            We couldn't find any items matching your current search parameters.
          </p>
          <button onClick={() => {setSearch(''); setSelectedCategory(null)}} className="btn btn-secondary mt-6 border-slate-200">
            Clear Search Queries
          </button>
        </div>
      ) : (
        <div className="card-3d overflow-hidden stagger-5 bg-white/40 backdrop-blur-xl border-white/60">
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
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="group hover:bg-white/60 transition-all">
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
                        onClick={() => handleOpenModal(item)}
                        className="h-9 w-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-teal-600 hover:border-teal-200 transition-all"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="h-9 w-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal - Upgraded Glass */}
      {showModal && (
        <div className="modal-overlay z-50">
          <div className="modal-content overflow-hidden border-none shadow-[0_40px_120px_rgba(0,0,0,0.4)]">
            <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-black text-white">
                  {editingItem ? 'Update Asset' : 'Register Asset'}
                </h2>
                <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest mt-0.5">Asset Management System</p>
              </div>
              <button onClick={() => setShowModal(false)} className="h-10 w-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-6 p-8 bg-white">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Item Identification</label>
                    <div className="relative">
                       <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                       <input 
                        required 
                        className="input-field pl-12 h-14 text-[15px] font-bold" 
                        placeholder="e.g., Premium Phosphate Fertilizer" 
                        value={form.name} 
                        onChange={e => setForm({...form, name: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Classification</label>
                      <select 
                        className="input-field h-14 font-bold" 
                        value={form.category} 
                        onChange={e => setForm({...form, category: e.target.value})}
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{catLabel[c]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Initial Quantity</label>
                      <input 
                        required 
                        type="number" 
                        min="0" 
                        className="input-field h-14 font-bold" 
                        placeholder="00" 
                        value={form.quantity} 
                        onChange={e => setForm({...form, quantity: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-8 py-6 bg-slate-50 flex items-center justify-between rounded-b-2xl">
                <button type="button" onClick={() => setShowModal(false)} className="text-[13px] font-black text-slate-500 hover:text-slate-900 transition-colors">
                  Discard Changes
                </button>
                <button type="submit" className="btn btn-primary h-12 px-8 shadow-xl shadow-teal-500/20">
                  {editingItem ? 'Confirm Update' : 'Initialize Asset'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
