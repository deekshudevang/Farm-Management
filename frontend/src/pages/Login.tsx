import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Leaf, Mail, Lock, Eye, EyeOff, User, 
  ArrowRight, CheckCircle2, ShieldCheck, Zap 
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoginSchema, RegisterSchema, type LoginInput, type RegisterInput } from '../utils/schemas';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Register form
  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: '', password: '', name: '' },
  });

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

    const listener = (e: MouseEvent) => {
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
    };

    window.addEventListener('mousemove', listener);
    return () => window.removeEventListener('mousemove', listener);
  }, []);

  const onLoginSubmit: SubmitHandler<LoginInput> = async (data) => {
    setLoading(true);
    try {
      const r = await api.post('/auth/login', data);
      login(r.data.token, r.data.user);
      toast.success('Welcome back!');
      navigate('/');
    } catch {
      // Error is already handled by the API interceptor
    } finally {
      setLoading(false);
    }
  };

  const onRegisterSubmit: SubmitHandler<RegisterInput> = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/register', data);
      setIsLogin(true);
      loginForm.reset({ email: data.email });
      toast.success('Account created! Please sign in.');
    } catch {
      // Handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (toLogin: boolean) => {
    setIsLogin(toLogin);
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center login-page-bg p-6">
      <div className="bg-animated-mesh"></div>

      <div className="absolute top-20 left-20 w-64 h-64 bg-teal-500/10 blur-[120px] rounded-full floating-element"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 blur-[150px] rounded-full floating-element" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
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
            <p className="text-lg text-slate-300 max-w-md leading-relaxed font-medium">
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
                <span className="text-white font-black text-[13px] uppercase tracking-wide">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center stagger-2">
          <div 
            ref={cardRef}
            className="login-card-3d w-full max-w-[440px] p-8 sm:p-10"
          >
            <div className="flex p-1 bg-slate-100/50 rounded-2xl mb-8">
              <button 
                onClick={() => switchMode(true)}
                className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${isLogin ? 'bg-white text-teal-600 shadow-sm translate-z-10' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => switchMode(false)}
                className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${!isLogin ? 'bg-white text-teal-600 shadow-sm translate-z-10' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Join
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-black text-slate-900">{isLogin ? 'Welcome Back' : 'Start Growing'}</h3>
              <p className="text-slate-500 text-[13px] font-bold mt-1 uppercase tracking-widest">{isLogin ? 'Secure access portal' : 'Precision farming registration'}</p>
            </div>

            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                <div className="login-input-float">
                  <label className="label">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="email" 
                      className={`input-field pl-10 h-12 font-bold ${loginForm.formState.errors.email ? 'border-rose-400' : ''}`}
                      placeholder="name@farm.com" 
                      {...loginForm.register('email')}
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-[11px] font-bold text-rose-500 mt-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="login-input-float">
                  <div className="flex items-center justify-between">
                    <label className="label">Access Code</label>
                    <button type="button" className="text-[11px] font-black text-teal-600 hover:underline uppercase tracking-widest">Recovery</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className={`input-field pl-10 pr-10 h-12 font-bold ${loginForm.formState.errors.password ? 'border-rose-400' : ''}`}
                      placeholder="••••••••" 
                      {...loginForm.register('password')}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-[11px] font-bold text-rose-500 mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary w-full h-12 text-[15px] mt-4 shadow-xl shadow-teal-500/20">
                  {loading ? 'Authenticating...' : (
                    <>
                      Enter Command Center
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                <div className="login-input-float">
                  <label className="label">Full Identity</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      className={`input-field pl-10 h-12 font-bold ${registerForm.formState.errors.name ? 'border-rose-400' : ''}`}
                      placeholder="Your full name" 
                      {...registerForm.register('name')}
                    />
                  </div>
                  {registerForm.formState.errors.name && (
                    <p className="text-[11px] font-bold text-rose-500 mt-1">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="login-input-float">
                  <label className="label">Secure Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="email" 
                      className={`input-field pl-10 h-12 font-bold ${registerForm.formState.errors.email ? 'border-rose-400' : ''}`}
                      placeholder="name@farm.com" 
                      {...registerForm.register('email')}
                    />
                  </div>
                  {registerForm.formState.errors.email && (
                    <p className="text-[11px] font-bold text-rose-500 mt-1">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="login-input-float">
                  <label className="label">New Access Code</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className={`input-field pl-10 pr-10 h-12 font-bold ${registerForm.formState.errors.password ? 'border-rose-400' : ''}`}
                      placeholder="••••••••" 
                      {...registerForm.register('password')}
                    />
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-[11px] font-bold text-rose-500 mt-1">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary w-full h-12 text-[15px] mt-4 shadow-xl shadow-teal-500/20">
                  {loading ? 'Initializing...' : (
                    <>
                      Create Enterprise Identity
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
              <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Certified Enterprise Security</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-[11px] font-black tracking-[0.3em]">
        AGRISMART AI ENGINE v4.2.0 • CORE OPERATIONAL LAYER
      </div>
    </div>
  );
};
