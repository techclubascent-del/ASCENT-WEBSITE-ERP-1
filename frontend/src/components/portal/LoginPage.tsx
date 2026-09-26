import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  User,
} from 'lucide-react';
import { Panther2D } from './Panther2D/Panther2D';

interface LoginPageProps {
  onLoginClick: (identifier: string) => void;
  onNavigateToRegistration: () => void;
  onBackToHome?: () => void;
}

export function LoginPage({ onLoginClick, onNavigateToRegistration, onBackToHome }: LoginPageProps) {
  const [identifier, setIdentifier] = useState('1MS22CS042');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // When clicking Login, open exclusive Member Portal for this member
    onLoginClick(identifier.trim() || '1MS22CS042');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 my-auto flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 min-h-[85vh]">
      {/* LEFT SIDE: Member Login Card (Exact original layout & functionality) */}
      <div className="w-full max-w-md flex-shrink-0">
        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0C0D0E] hover:bg-gray-50 dark:bg-[#141517] text-gray-700 dark:text-[#D1D5DB] hover:text-gray-900 dark:text-white border border-gray-200 dark:border-[#26282A] text-xs font-subheading transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>← Back to Website</span>
          </button>
        )}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full"
        >
          {/* Member Login Card */}
          <div className="bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group hover:border-gray-300 dark:hover:border-[#3D4042] transition-colors">
            {/* Subtle top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A373] to-transparent opacity-80" />

            {/* Accent horizontal bar */}
            <div className="w-12 h-1 bg-[#D4A373] rounded-full mb-3 shadow-sm shadow-[#D4A373]/30" />

            <div className="mb-5">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Member Login
              </h2>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Identifier Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-identifier"
                  className="block text-xs font-subheading font-medium text-gray-700 dark:text-[#D1D5DB] uppercase tracking-wider"
                >
                  Member ID
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#545454] group-focus-within:text-[#D4A373] transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="login-identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your Member ID or USN"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] dark:bg-[#000000] border border-gray-200 dark:border-[#26282A] rounded-xl text-gray-900 dark:text-white text-sm placeholder-[#555A5E] focus:outline-none focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373] transition-all duration-200 font-subheading"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-subheading font-medium text-gray-700 dark:text-[#D1D5DB] uppercase tracking-wider"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="text-xs font-subheading text-gray-500 dark:text-[#8E9296] hover:text-[#D4A373] transition-colors focus:outline-none"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#545454] group-focus-within:text-[#D4A373] transition-colors">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#f8f9fa] dark:bg-[#000000] border border-gray-200 dark:border-[#26282A] rounded-xl text-gray-900 dark:text-white text-sm placeholder-[#555A5E] focus:outline-none focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373] transition-all duration-200 font-subheading"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#555A5E] hover:text-gray-900 dark:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-subheading text-[#A3A3A3] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-200 dark:border-[#26282A] bg-[#f8f9fa] dark:bg-[#000000] text-[#D4A373] focus:ring-[#D4A373] w-4 h-4 accent-[#D4A373]"
                  />
                  <span>Remember terminal session</span>
                </label>
              </div>

              {/* Prominent Login Button with Secondary #D4A373 */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  id="btn-login-submit"
                  className="w-full py-3 px-6 bg-[#D4A373] hover:bg-[#c49363] text-[#000000] font-heading font-bold text-base tracking-wide rounded-xl shadow-lg shadow-[#D4A373]/20 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 text-[#000000]" />
                </motion.button>
              </div>
            </form>

            {/* Direct Link to Member Registration */}
            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-[#26282A] text-center">
              <p className="text-xs font-subheading text-gray-500 dark:text-[#8E9296]">
                New applicant? Complete your candidate profile:
              </p>
              <button
                type="button"
                onClick={onNavigateToRegistration}
                className="mt-2 text-sm font-subheading font-medium text-[#D4A373] hover:text-[#e4b585] transition-colors underline-offset-4 hover:underline inline-flex items-center gap-1.5 focus:outline-none cursor-pointer"
              >
                Go to Member Registration Form
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: Interactive 2D Three.js Black Panther Scene */}
      <div className="w-full flex-1 max-w-xl flex items-center justify-center">
        <Panther2D />
      </div>
    </div>
  );
}
