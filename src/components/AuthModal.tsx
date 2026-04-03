import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, AtSign, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal = ({ onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = mode === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (authError) {
      setError(authError.message);
    } else {
      onClose();
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-card w-full max-w-sm p-8 relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-candy-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-candy-primary/30">
              <Lock className="w-8 h-8 text-candy-primary" />
           </div>
           <h2 className="text-2xl font-black italic italic tracking-tighter">
             {mode === 'login' ? 'WELCOME BACK' : 'JOIN THE CLUB'}
           </h2>
           <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
             Your progression starts here
           </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
           {error && (
             <div className="bg-red-500/20 border border-red-500 p-3 rounded-xl text-[10px] text-red-200 font-bold uppercase tracking-tighter text-center">
                {error}
             </div>
           )}

           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Email Address</label>
              <div className="relative">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-3.5 focus:outline-none focus:border-candy-primary transition-all"
                  placeholder="name@example.com"
                />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-3.5 focus:outline-none focus:border-candy-primary transition-all"
                  placeholder="••••••••"
                />
              </div>
           </div>

           <button
             type="submit"
             disabled={loading}
             className="glass-button w-full shadow-lg shadow-candy-primary/20 mt-4 flex items-center justify-center gap-2 group h-14"
           >
             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
               <>
                 <span>{mode === 'login' ? 'SIGN IN' : 'SIGN UP'}</span>
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </>
             )}
           </button>
        </form>

        <div className="text-center mt-6">
           <button 
             onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
             className="text-[10px] font-black text-gray-500 hover:text-candy-primary uppercase tracking-widest transition-colors"
           >
             {mode === 'login' ? "Don't have an account? Create one" : "Already have an account? Sign In"}
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
