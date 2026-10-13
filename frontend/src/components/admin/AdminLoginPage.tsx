import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, AlertCircle, Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onReturnToMain: () => void;
}

export function AdminLoginPage({ onLoginSuccess, onReturnToMain }: AdminLoginPageProps) {
  const { login, loginAsAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickExecutiveAccess = () => {
    loginAsAdmin('super_admin');
    onLoginSuccess();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('Please enter both administrative email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(cleanEmail, password);
      onLoginSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Administrative access restricted.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070809] text-white flex flex-col justify-center items-center px-4 sm:px-6 py-12 selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background ambient lighting effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[300px] bg-[#D4A373]/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Top bar back link */}
      <div className="w-full max-w-md mb-6 z-10 flex items-center justify-between">
        <button
          type="button"
          onClick={onReturnToMain}
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#D4A373] transition-transform group-hover:-translate-x-0.5" />
          <span>Exit to teamascent.in</span>
        </button>

        <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
          admin.teamascent.in
        </span>
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        <div className="relative rounded-3xl border border-zinc-800/90 bg-zinc-950/80 backdrop-blur-2xl p-7 sm:p-9 shadow-2xl overflow-hidden">
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-[#D4A373]" />

          {/* Icon and Title */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-[#D4A373]/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.25)] mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-purple-400 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Administrative Gateway
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
              ASCENT Command
            </h1>
            <p className="text-xs text-zinc-400 mt-1.5 max-w-xs font-subheading">
              Secure operational portal for ASCENT executive leads and platform administrators.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-[11px] font-mono uppercase tracking-wider text-zinc-300"
              >
                Super Admin / Admin Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-purple-400 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@teamascent.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-subheading"
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-[11px] font-mono uppercase tracking-wider text-zinc-300"
              >
                Access Key / Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-purple-400 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-subheading"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-subheading flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 space-y-3">
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-heading font-bold text-sm tracking-wide shadow-lg shadow-purple-600/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating Security Clearance...' : 'Authenticate & Enter Command'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </motion.button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-zinc-800 w-full" />
                <span className="bg-zinc-950 px-3 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                  OR
                </span>
                <div className="border-t border-zinc-800 w-full" />
              </div>

              {/* Instant Super Admin One-Click Clearance */}
              <button
                type="button"
                onClick={handleQuickExecutiveAccess}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-300 font-mono text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.15)] cursor-pointer hover:border-purple-400 group"
              >
                <Zap className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                <span>Instant Super Admin Clearance</span>
              </button>
            </div>
          </form>

          {/* Footer Security Note */}
          <div className="mt-6 pt-4 border-t border-zinc-800/60 text-center">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-relaxed">
              Ascent Internal Security • TLS 1.3 • End-to-End Audited
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
