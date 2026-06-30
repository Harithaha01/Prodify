import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldAlert, 
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock
} from 'lucide-react';

interface AuthPageProps {
  darkMode: boolean;
  onAuthSuccess: (user: { email: string; name: string }) => void;
}

export default function AuthPage({ darkMode, onAuthSuccess }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to read/write registered users in localStorage
  const getRegisteredUsers = (): any[] => {
    const data = localStorage.getItem('saver_registered_users');
    return data ? JSON.parse(data) : [];
  };

  const saveRegisteredUser = (user: any) => {
    const users = getRegisteredUsers();
    users.push(user);
    localStorage.setItem('saver_registered_users', JSON.stringify(users));
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please specify a valid email address.');
      return;
    }

    if (password.length < 5) {
      setError('Password must contain at least 5 characters.');
      return;
    }

    setIsLoading(true);

    // Simulate database lookup delay for ultimate high-fidelity feedback
    setTimeout(() => {
      const users = getRegisteredUsers();

      if (isSignUp) {
        // Sign Up Mode
        const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (userExists) {
          setError('An account with this email already exists.');
          setIsLoading(false);
          return;
        }

        const newUser = { name, email: email.toLowerCase(), password };
        saveRegisteredUser(newUser);
        setSuccess('Registration successful! Launching secure container...');
        
        setTimeout(() => {
          onAuthSuccess({ name, email: email.toLowerCase() });
          setIsLoading(false);
        }, 1200);

      } else {
        // Sign In Mode
        // Default master demo credentials
        const isDemo = email.toLowerCase() === 'demo@example.com' && password === 'password123';
        const foundUser = users.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (isDemo) {
          setSuccess('Access approved! Syncing database cache...');
          setTimeout(() => {
            onAuthSuccess({ name: 'Demo Warrior', email: 'demo@example.com' });
            setIsLoading(false);
          }, 1200);
        } else if (foundUser) {
          setSuccess(`Welcome back, ${foundUser.name}! Access approved.`);
          setTimeout(() => {
            onAuthSuccess({ name: foundUser.name, email: foundUser.email });
            setIsLoading(false);
          }, 1200);
        } else {
          setError('Invalid email or password combination. Try demo@example.com with password123!');
          setIsLoading(false);
        }
      }
    }, 1000);
  };

  const handleQuickDemo = () => {
    setIsLoading(true);
    setSuccess('Quick accessing with safe credentials...');
    setTimeout(() => {
      onAuthSuccess({ name: 'Tactical Analyst', email: 'tactical.guest@lastminute.io' });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden px-4 ${
      darkMode ? 'bg-[#050508] text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Immersive background glows */}
      {darkMode && (
        <>
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[130px] -z-10 pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[110px] -z-10 pointer-events-none"></div>
        </>
      )}

      {/* Center Layout Box */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 py-12">
        
        {/* Left Side: Brand & Product Pitch */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-xl shadow-indigo-500/20">
              <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className={`font-sans font-black text-2xl leading-none tracking-tight ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Prod<span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent font-black">ify</span>
              </h1>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-display font-extrabold tracking-tight leading-tight">
              Defend deadlines. <br />
              <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                Accelerate your execution.
              </span>
            </h2>
            <p className="text-sm opacity-75 leading-relaxed font-sans max-w-sm">
              An intelligent, high-intensity Kanban and calendar companion designed to rescue academic milestones and start-up deliverables before disaster strikes.
            </p>
          </div>

          {/* Interactive Feature Mini Indicators */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/15 border border-indigo-500/10 text-indigo-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-sans font-bold">Failure Point Predictor</h4>
                <p className="text-[10px] font-mono opacity-50">Predict overload limits dynamically</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/15 border border-purple-500/10 text-purple-400">
                <Flame className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-sans font-bold">Active AI Rescue Mode</h4>
                <p className="text-[10px] font-mono opacity-50">Auto-align active time-blocks in one click</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication card */}
        <div className="lg:col-span-7 flex justify-center w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`w-full max-w-md p-8 rounded-3xl border transition-all duration-300 relative ${
              darkMode 
                ? 'bg-black/45 border-white/10 backdrop-blur-2xl shadow-2xl shadow-indigo-500/[0.03]' 
                : 'bg-white border-slate-200/80 shadow-xl shadow-slate-200/50'
            }`}
          >
            {/* Header Form Selector */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-display font-extrabold tracking-tight">
                  {isSignUp ? 'Establish Account' : 'Welcome back'}
                </h3>
                <p className="text-[11px] font-mono opacity-50 mt-1">
                  {isSignUp ? 'Deploy custom work profile' : 'Sign in to access control center'}
                </p>
              </div>

              {/* Segment Toggle */}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setSuccess(null);
                }}
                className="text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer border-b border-indigo-400/25"
              >
                {isSignUp ? 'Use Existing Account' : 'Register New'}
              </button>
            </div>

            {/* Error & Success Notification Box */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-sans font-medium flex items-start gap-2.5"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-sans font-medium flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-60">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 opacity-40" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-sans border transition-all ${
                        darkMode 
                          ? 'bg-white/5 border-white/5 text-white focus:bg-white/10 focus:border-indigo-500/40 focus:outline-none' 
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none'
                      }`}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-60">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 opacity-40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isSignUp ? 'you@domain.com' : 'demo@example.com'}
                    required
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-sans border transition-all ${
                      darkMode 
                        ? 'bg-white/5 border-white/5 text-white focus:bg-white/10 focus:border-indigo-500/40 focus:outline-none' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-60">Secure Password</label>
                  {!isSignUp && (
                    <span className="text-[9px] font-mono opacity-45">Hint: password123</span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 opacity-40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-sans border transition-all ${
                      darkMode 
                        ? 'bg-white/5 border-white/5 text-white focus:bg-white/10 focus:border-indigo-500/40 focus:outline-none' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 mt-2 py-3 rounded-xl text-xs font-bold font-sans uppercase tracking-wider bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 cursor-pointer transition-all disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying Credentials...' : isSignUp ? 'Submit Registration' : 'Authenticate Session'}</span>
                {!isLoading && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-slate-800/10 dark:border-white/5"></div>
              <span className="flex-shrink mx-4 text-[9px] font-mono uppercase tracking-widest opacity-40">OR SKIP SECURELY</span>
              <div className="flex-grow border-t border-slate-800/10 dark:border-white/5"></div>
            </div>

            {/* Quick Guest Entry / Demo Card */}
            <button
              onClick={handleQuickDemo}
              disabled={isLoading}
              className={`w-full py-2.5 rounded-xl text-xs font-sans font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                darkMode 
                  ? 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300 hover:text-white' 
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200/50 text-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Guest Quick Access (No Registration Needed)</span>
            </button>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
