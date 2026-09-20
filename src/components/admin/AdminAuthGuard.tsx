import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Building2,
  Stethoscope,
  User,
  CheckCircle2,
} from 'lucide-react';
import { ClinicLogo } from '../ClinicLogo';

interface AdminAuthGuardProps {
  onSignInSuccess: (email: string) => void;
  onSwitchToPatientPortal: () => void;
  onSwitchToDoctorPortal: () => void;
}

export function AdminAuthGuard({
  onSignInSuccess,
  onSwitchToPatientPortal,
  onSwitchToDoctorPortal,
}: AdminAuthGuardProps) {
  const [email, setEmail] = useState('admin.operations@healthychoiceclinic.org');
  const [password, setPassword] = useState('ClinicCare@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your administrator email.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignInSuccess(email);
    }, 600);
  };

  const handleQuickFill = () => {
    setEmail('admin.operations@healthychoiceclinic.org');
    setPassword('ClinicCare@2026!');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 antialiased">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="max-w-md w-full bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-8"
      >
        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-2.5 rounded-2xl bg-white shadow-md mb-3">
            <ClinicLogo size={44} variant="colored" />
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <h1 className="text-lg font-bold text-white tracking-tight">ZARMA HOSPITAL</h1>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase tracking-wider bg-[#1a5f7a] text-sky-200">
              Admin Portal
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Clinic Operations, Staff Management & Analytics
          </p>
        </div>

        {/* Security Alert: Cannot use admin pages without signing in */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs mb-6 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-amber-200 font-semibold mb-0.5">
              Authentication Required
            </strong>
            Under clinic security policy, you <strong>cannot use admin pages without signing in</strong>. Please authenticate with administrator credentials to proceed.
          </div>
        </div>

        {/* Quick Demo Pre-fill Banner */}
        <div className="mb-5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8bc34a]" />
            <span className="text-[11px]">Kathryn Reed, MHA (Ops Director)</span>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="px-2 py-1 rounded-md bg-[#1a5f7a] hover:bg-[#14495e] text-white text-[10px] font-bold cursor-pointer transition-colors"
          >
            Fill Demo
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin.operations@healthychoiceclinic.org"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] text-xs transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Administrative Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] text-xs transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-[#1a5f7a] hover:bg-[#14495e] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Alternative Portals */}
        <div className="mt-6 pt-5 border-t border-slate-900 text-center text-xs text-slate-500 space-y-2">
          <span className="block text-[11px]">Not an Administrator?</span>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={onSwitchToDoctorPortal}
              className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor Portal</span>
            </button>
            <span className="text-slate-700">•</span>
            <button
              type="button"
              onClick={onSwitchToPatientPortal}
              className="text-[#8bc34a] hover:text-[#7cb342] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient Portal</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
