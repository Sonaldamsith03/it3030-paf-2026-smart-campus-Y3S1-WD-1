import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ArrowRight, ShieldCheck, Command, ChevronRight, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { authService } from '../services/authService';
import { cn } from '../../lib/utils';

export const SignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'USER';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: initialRole
  });

  useEffect(() => {
    const role = searchParams.get('role');
    if (role) {
      setFormData(prev => ({ ...prev, role }));
    }
  }, [searchParams]);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!formData.name || !formData.email || !formData.password) return 'All network parameters are required.';
    if (!formData.email.includes('@')) return 'Invalid terminal identity format.';
    if (formData.password.length < 6) return 'Access key security too weak (min 6 chars).';
    if (formData.password !== formData.confirmPassword) return 'Access keys do not match.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration sequence failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-8 lg:p-24 overflow-hidden selection:bg-accent/20">
      {/* Immersive Background Section */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80')] bg-cover bg-center transition-transform duration-1000 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/80 to-slate-900/60 backdrop-blur-[2px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-mesh-gradient opacity-30" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full"
        >
          {/* Branding Header */}
          <div className="flex flex-col items-center mb-10">
            <div 
              onClick={() => navigate('/login')}
              className="w-16 h-16 bg-accent rounded-[2rem] flex items-center justify-center text-slate-950 shadow-[0_0_50px_rgba(var(--accent-rgb),0.5)] mb-6 transition-transform hover:rotate-12 cursor-pointer"
            >
              <Command size={32} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Initialize Identity</h1>
            <p className="text-accent italic serif-italic text-lg lowercase opacity-80">establish your academic node</p>
          </div>


          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-8 p-6 premium-glass border-red-500/20 text-red-500 rounded-[2rem] text-[11px] font-bold uppercase tracking-wider flex items-center gap-4"
              >
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>


          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Legal Alias</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="premium-input w-full pl-16 py-4.5"
                  placeholder="Hedy Lamarr"
                />
              </div>
            </div>


            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Network Identity</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="premium-input w-full pl-16 py-4.5"
                  placeholder="hedy@hub.network"
                />
              </div>
            </div>


            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Node Class</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={20} />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="premium-input w-full pl-16 py-4.5 appearance-none cursor-pointer"
                >
                  <option value="USER">Student Node</option>
                  <option value="TECHNICIAN">Technician Node</option>
                  <option value="ADMIN">System Admin</option>
                </select>
                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 rotate-90 pointer-events-none" size={18} />
              </div>
            </div>


            <div className="md:col-span-1 space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Security Phrase</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="premium-input w-full pl-16 py-4.5"
                  placeholder="••••••••••••"
                />
              </div>
            </div>


            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Verify Security Phrase</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="premium-input w-full pl-16 py-4.5"
                  placeholder="••••••••••••"
                />
              </div>
            </div>


            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-accent text-slate-950 rounded-[2rem] font-black hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-[0_10px_40px_-5px_rgba(var(--accent-rgb),0.3)] disabled:opacity-50 flex items-center justify-center gap-4 text-[14px] uppercase tracking-[0.25em] group overflow-hidden relative"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <div className="w-5 h-5 border-3 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  ) : (
                    <>Initialize Registry <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>
          </form>

          <p className="mt-12 text-center text-white/30 text-[11px] font-black uppercase tracking-[0.2em]">
            Identity already exists?{' '}
            <Link to="/login" className="text-accent border-b border-accent/20 hover:border-accent pb-0.5 transition-all">Relink Node</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

