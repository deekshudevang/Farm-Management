import React, { useEffect, useState } from 'react';
import { 
  CheckSquare, Plus, X, Search, Clock, 
  CheckCircle2, AlertCircle, Edit3, Trash2, FilterX,
  ArrowRight, ListTodo, Activity, Timer
} from 'lucide-react';
import api from '../services/api';

const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
const statusLabel: Record<string, string> = { 
  PENDING: 'Pending', 
  IN_PROGRESS: 'In Progress', 
  COMPLETED: 'Completed' 
};
const statusColor: Record<string, string> = {
  PENDING: '#f59e0b',
  IN_PROGRESS: '#3b82f6',
  COMPLETED: '#10b981'
};

export const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [form, setForm] = useState({ title: '', status: 'PENDING' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const fetchTasks = async () => {
    try {
      const r = await api.get('/tasks');
      setTasks(r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenModal = (task: any = null) => {
    if (task) {
      setEditingTask(task);
      setForm({ title: task.title, status: task.status });
    } else {
      setEditingTask(null);
      setForm({ title: '', status: 'PENDING' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, form);
      } else {
        await api.post('/tasks', form);
      }
      setShowModal(false);
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filtered = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

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
      {/* Background Decor */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 stagger-1">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: '#0f172a' }}>
            Operational <span className="text-amber-500">Pipeline</span>
          </h1>
          <p className="text-[14px] font-bold mt-1" style={{ color: '#64748b' }}>
            Current workload: <span className="text-amber-600">{tasks.length}</span> synchronized activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => handleOpenModal()} className="btn btn-primary px-6 shadow-xl shadow-amber-500/20 bg-amber-500 border-none hover:bg-amber-600">
            <Plus className="h-4 w-4" /> Schedule New Activity
          </button>
        </div>
      </div>

      {/* Status Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stagger-2">
        {[
          { id: 'PENDING', label: 'Backlog', icon: Clock, color: '#f59e0b', count: tasks.filter(t => t.status === 'PENDING').length },
          { id: 'IN_PROGRESS', label: 'In Execution', icon: Activity, color: '#3b82f6', count: tasks.filter(t => t.status === 'IN_PROGRESS').length },
          { id: 'COMPLETED', label: 'Archived', icon: CheckCircle2, color: '#10b981', count: tasks.filter(t => t.status === 'COMPLETED').length }
        ].map((s) => {
          const isActive = filter === s.id;
          return (
            <button 
              key={s.id} 
              onClick={() => setFilter(isActive ? 'ALL' : s.id)}
              className={`stat-card group relative transition-all duration-500 ${isActive ? 'scale-[1.02] shadow-2xl' : 'hover:scale-[1.01]'}`}
              style={{
                background: isActive ? `linear-gradient(135deg, ${s.color}08, ${s.color}15)` : undefined,
                borderColor: isActive ? s.color : undefined
              }}
            >
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: isActive ? s.color : '#94a3b8' }}>{s.label}</p>
                  <p className="text-3xl font-black mt-2 text-slate-900 tracking-tight">{s.count}</p>
                </div>
                <div className={`icon-float w-14 h-14 rounded-2xl transition-all duration-500 ${isActive ? 'rotate-12 scale-110' : 'group-hover:-rotate-12'}`} style={{
                  background: isActive ? `${s.color}20` : 'rgba(241, 245, 249, 0.7)',
                  color: s.color
                }}>
                  <s.icon className="h-7 w-7" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Work Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 stagger-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            className="input-field pl-12 h-12 bg-white/50 focus:bg-white" 
            placeholder="Search operational logs..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        {filter !== 'ALL' && (
          <button 
            onClick={() => setFilter('ALL')} 
            className="btn bg-white border-slate-200 text-rose-500 font-black text-[12px] px-4 hover:bg-rose-50 hover:border-rose-200 transition-all"
          >
            <FilterX className="h-4 w-4 mr-2" /> Show All Activities
          </button>
        )}
      </div>

      {/* Task Execution Feed */}
      {filtered.length === 0 ? (
        <div className="empty-state stagger-4 py-20 bg-white/30 backdrop-blur-md">
           <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
            <ListTodo className="h-10 w-10 text-slate-300" />
          </div>
          <p className="text-xl font-black text-slate-800">Clear Schedule</p>
          <p className="text-slate-500 font-bold max-w-xs mt-2 text-center">
            No active tasks identified in the current view.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 stagger-4">
          {filtered.map((task) => (
            <div 
              key={task.id} 
              className="group card-3d p-6 bg-white/40 backdrop-blur-xl border-white/60 hover:bg-white/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-6 flex-1">
                <button 
                  onClick={() => updateStatus(task.id, task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED')}
                  className={`h-10 w-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                    task.status === 'COMPLETED' 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                      : 'border-slate-200 bg-white hover:border-teal-400'
                  }`}
                >
                  {task.status === 'COMPLETED' ? <CheckCircle2 className="h-6 w-6" /> : <div className="h-2 w-2 rounded-full bg-slate-200 group-hover:bg-teal-400 transition-colors"></div>}
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-[15px] font-black transition-all ${
                    task.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-slate-900'
                  }`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                       <Timer className="h-3 w-3" />
                       Recorded {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Priority Index: Medium</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pl-14 sm:pl-0">
                <select
                  value={task.status}
                  onChange={e => updateStatus(task.id, e.target.value)}
                  className="h-10 rounded-xl bg-white border border-slate-200 px-4 text-[12px] font-black outline-none transition-all focus:border-teal-500 cursor-pointer"
                  style={{ color: statusColor[task.status] }}
                >
                  {statuses.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}
                </select>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleOpenModal(task)}
                    className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-teal-600 hover:border-teal-200 transition-all"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)}
                    className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Scheduler Modal */}
      {showModal && (
        <div className="modal-overlay z-50">
          <div className="modal-content overflow-hidden border-none shadow-[0_40px_120px_rgba(0,0,0,0.4)]">
             <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-black text-white">Activity Scheduler</h2>
                <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest mt-0.5">Define operational objective</p>
              </div>
              <button onClick={() => setShowModal(false)} className="h-10 w-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-6 p-8 bg-white">
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Objective Definition</label>
                  <div className="relative">
                     <CheckSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                     <textarea 
                      required 
                      className="input-field pl-12 pt-4 h-32 text-[15px] font-bold resize-none" 
                      placeholder="Define the task details here..." 
                      value={form.title} 
                      onChange={e => setForm({...form, title: e.target.value})} 
                    />
                  </div>
                </div>
                {editingTask && (
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Priority Status</label>
                    <select 
                      className="input-field h-14 font-bold" 
                      value={form.status} 
                      onChange={e => setForm({...form, status: e.target.value})}
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{statusLabel[s]}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="px-8 py-6 bg-slate-50 flex items-center justify-between">
                <button type="button" onClick={() => setShowModal(false)} className="text-[13px] font-black text-slate-500 hover:text-slate-900 transition-colors">
                  Abort Scheduling
                </button>
                <button type="submit" className="btn bg-amber-500 text-white h-12 px-8 shadow-xl shadow-amber-500/20 hover:bg-amber-600 border-none">
                  {editingTask ? 'Save Activity' : 'Deploy Task'}
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
