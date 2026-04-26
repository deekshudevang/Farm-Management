import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, Mail, Lock, Eye, EyeOff, User, 
  ArrowRight, CheckCircle2, ShieldCheck, Zap 
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Card Tilt Effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    window.addEventListener('mousemove', (e) => {
      // Only tilt if mouse is somewhat near the card area for performance
      const rect = card.getBoundingClientRect();
      const buffer = 200;
      if (
        e.clientX > rect.left - buffer && 
        e.clientX < rect.right + buffer &&
        e.clientY > rect.top - buffer && 
        e.clientY < rect.bottom + buffer
      ) {
        handleMouseMove(e);
      } else {
        handleMouseLeave();
      }
    });

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const r = await api.post('/auth/login', { email: form.email, password: form.password });
        login(r.data.token, r.data.user);
        navigate('/');
      } else {
        await api.post('/auth/register', form);
        setIsLogin(true);
        setError('Account created! Please sign in.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center login-page-bg p-6">
      {/* Animated Mesh Overlay */}
      <div className="bg-animated-mesh"></div>

      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-teal-500/10 blur-[120px] rounded-full floating-element"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 blur-[150px] rounded-full floating-element" style={{ animationDelay: '2s' }}></div>

      {/* Main Content Grid */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Left Side: Branding & AI Visuals */}
        <div className="hidden lg:block space-y-8 stagger-1">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <Leaf className="h-7 w-7 text-teal-400" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">AgriSmart <span className="text-teal-400">Pro</span></h1>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-white leading-tight">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400">Precision Farming</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-md leading-relaxed">
              Experience the next generation of agricultural management with AI-driven insights, 3D visualizations, and real-time data sync.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { icon: Zap, text: 'Real-time Sync' },
              { icon: ShieldCheck, text: 'Enterprise Security' },
              { icon: CheckCircle2, text: 'AI Optimization' },
              { icon: User, text: 'Multi-user Ready' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <item.icon className="h-5 w-5 text-teal-400" />
                <span className="text-white font-semibold text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: The Interactive 3D Card */}
        <div className="flex justify-center stagger-2">
          <div 
            ref={cardRef}
            className="login-card-3d w-full max-w-[440px] p-8 sm:p-10"
          >
            {/* Header Tabs */}
            <div className="flex p-1 bg-slate-100/50 rounded-2xl mb-8">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${isLogin ? 'bg-white text-teal-600 shadow-sm translate-z-10' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${!isLogin ? 'bg-white text-teal-600 shadow-sm translate-z-10' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-black text-slate-900">{isLogin ? 'Welcome Back' : 'Start Growing'}</h3>
              <p className="text-slate-500 text-sm mt-1">{isLogin ? 'Access your farm dashboard securely' : 'Join the precision farming revolution'}</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3 animate-shake">
                <div className="h-5 w-5 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] flex-shrink-0 mt-0.5">!</div>
                <p className="text-xs font-bold text-rose-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="login-input-float">
                  <label className="label">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      required 
                      className="input-field pl-10 h-12" 
                      placeholder="Enter your name" 
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})} 
                    />
                  </div>
                </div>
              )}

              <div className="login-input-float">
                <label className="label">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    required 
                    type="email" 
                    className="input-field pl-10 h-12" 
                    placeholder="name@farm.com" 
                    value={form.email} 
                    onChange={e => setForm({...form, email: e.target.value})} 
                  />
                </div>
              </div>

              <div className="login-input-float">
                <div className="flex items-center justify-between">
                  <label className="label">Security Password</label>
                  {isLogin && <a href="#" className="text-[11px] font-bold text-teal-600 hover:underline">Forgot?</a>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    required 
                    type={showPassword ? 'text' : 'password'} 
                    className="input-field pl-10 pr-10 h-12" 
                    placeholder="••••••••" 
                    value={form.password} 
                    onChange={e => setForm({...form, password: e.target.value})} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary w-full h-12 text-[15px] mt-4"
              >
                {loading ? 'Authenticating...' : (
                  <>
                    {isLogin ? 'Sign In Now' : 'Create My Account'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-top border-slate-100 flex flex-col items-center gap-4">
              <p className="text-[11px] text-slate-400 font-medium">TRUSTED BY MODERN AGRI-ENTERPRISES WORLDWIDE</p>
              <div className="flex items-center gap-6 opacity-30 grayscale contrast-125">
                <div className="h-5 w-20 bg-slate-400 rounded"></div>
                <div className="h-5 w-20 bg-slate-400 rounded"></div>
                <div className="h-5 w-20 bg-slate-400 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-[11px] font-bold tracking-[0.2em]">
        POWERED BY AGRISMART AI ENGINE v4.2.0
      </div>
    </div>
  );
};
