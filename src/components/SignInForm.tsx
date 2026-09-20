import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types';

interface SignInFormProps {
  activeRole: UserRole;
  onNavigateToRegister: () => void;
  onForgotPassword: () => void;
  onLoginSuccess: (email: string, role: UserRole) => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  activeRole,
  onNavigateToRegister,
  onForgotPassword,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Suggested demo credential helper based on selected role
  const getRolePlaceholder = () => {
    switch (activeRole) {
      case 'Doctor':
        return {
          email: 'dr.smith@healthychoiceclinic.org',
          note: 'Provider NPI / Clinical Portal Login',
        };
      case 'Admin':
        return {
          email: 'admin.operations@healthychoiceclinic.org',
          note: 'Clinical Administration & Management Access',
        };
      case 'Patient':
      default:
        return {
          email: 'patient.care@healthychoiceclinic.org',
          note: 'Patient Health Portal & Medical Records',
        };
    }
  };

  const roleInfo = getRolePlaceholder();

  const handleQuickDemoFill = () => {
    setEmail(roleInfo.email);
    setPassword('ClinicCare@2026!');
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic Validation
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMsg('Please enter a valid email address (e.g. name@example.com).');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    // Simulate smooth network authentication
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email, activeRole);
    }, 900);
  };

  return (
    <form
      id="login-form"
      onSubmit={handleSubmit}
      noValidate
      className="w-full flex flex-col space-y-4"
    >
      {/* Role specific notification banner */}
      <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs text-slate-600">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#8bc34a] inline-block" />
          {roleInfo.note}
        </span>
        <button
          type="button"
          id="btn-demo-credentials"
          onClick={handleQuickDemoFill}
          className="text-[#1a5f7a] hover:text-[#134b61] font-semibold text-[11px] underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          Auto-fill Demo
        </button>
      </div>

      {/* Error alert if validation fails */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {/* Email Input Field with envelope icon */}
      <div className="flex flex-col space-y-1.5">
        <label
          htmlFor="login-email-input"
          className="text-xs font-semibold text-slate-700 flex items-center justify-between"
        >
          <span>Email Address</span>
          <span className="text-slate-400 font-normal text-[11px]">Work or personal email</span>
        </label>
        <div className="relative rounded-xl shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#1a5f7a] focus-within:border-transparent">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id="login-email-input"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="e.g. name@healthychoiceclinic.org"
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none"
          />
        </div>
      </div>

      {/* Password Input Field with functional eye toggle */}
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="login-password-input"
            className="text-xs font-semibold text-slate-700"
          >
            Password
          </label>
          <button
            type="button"
            id="btn-forgot-password"
            onClick={onForgotPassword}
            className="text-xs font-medium text-[#1a5f7a] hover:text-[#134b61] hover:underline focus:outline-none transition-colors"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative rounded-xl shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#1a5f7a] focus-within:border-transparent">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id="login-password-input"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="••••••••••••"
            className="w-full pl-10 pr-11 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none font-sans"
          />
          {/* Functional Eye Toggle Icon Button */}
          <button
            type="button"
            id="btn-toggle-password-visibility"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Remember me checkbox */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            id="remember-me-checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-[#1a5f7a] border-slate-300 rounded focus:ring-[#1a5f7a] focus:ring-offset-0 cursor-pointer accent-[#1a5f7a]"
          />
          <span className="text-xs text-slate-600 font-medium">
            Remember this device for 30 days
          </span>
        </label>
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-[#8bc34a]" /> 256-bit SSL
        </span>
      </div>

      {/* Primary CTA: Full-width, smooth-animated button styled in solid medical blue labeled "Sign In" */}
      <div className="pt-2">
        <motion.button
          type="submit"
          id="btn-sign-in"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.01 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white shadow-md shadow-[#1a5f7a]/25 focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] focus:ring-offset-2 transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#1a5f7a' }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 text-white/90" />
            </>
          )}
        </motion.button>
      </div>

      {/* Secondary text link: "New patient? Create an account here" */}
      <div className="text-center pt-3 pb-1">
        <p className="text-xs text-slate-600">
          New patient?{' '}
          <button
            type="button"
            id="btn-switch-to-register"
            onClick={onNavigateToRegister}
            className="font-bold text-[#1a5f7a] hover:text-[#134b61] hover:underline focus:outline-none transition-colors cursor-pointer"
          >
            Create an account here
          </button>
        </p>
      </div>
    </form>
  );
};
