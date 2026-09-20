import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Calendar, Phone, Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { RegistrationFormState } from '../types';

interface RegistrationFormProps {
  onNavigateToSignIn: () => void;
  onRegisterSuccess: (data: RegistrationFormState) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onNavigateToSignIn,
  onRegisterSuccess,
}) => {
  const [formData, setFormData] = useState<RegistrationFormState>({
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    password: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (field: keyof RegistrationFormState, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format US phone number nicely: (123) 456-7890
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = raw;
    if (raw.length > 0) {
      if (raw.length <= 3) {
        formatted = `(${raw}`;
      } else if (raw.length <= 6) {
        formatted = `(${raw.slice(0, 3)}) ${raw.slice(3)}`;
      } else {
        formatted = `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6, 10)}`;
      }
    }
    handleChange('phoneNumber', formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!formData.dateOfBirth) {
      setErrorMessage('Please select your date of birth.');
      return;
    }
    if (!formData.phoneNumber || formData.phoneNumber.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please provide a valid 10-digit phone number.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailPattern.test(formData.email)) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!formData.password || formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess(formData);
    }, 1000);
  };

  // Quick prefill for demonstration convenience
  const handlePrefillDemo = () => {
    setFormData({
      fullName: 'Eleanor Vance',
      dateOfBirth: '1992-05-14',
      phoneNumber: '(555) 382-9104',
      email: 'eleanor.vance@example.com',
      password: 'HealthyFamily2026!',
      agreeTerms: true,
    });
    setErrorMessage(null);
  };

  return (
    <form
      id="patient-registration-form"
      onSubmit={handleSubmit}
      noValidate
      className="w-full flex flex-col space-y-3.5"
    >
      {/* Header bar with Back button and Quick Fill */}
      <div className="flex items-center justify-between pb-1">
        <button
          type="button"
          id="btn-back-to-signin"
          onClick={onNavigateToSignIn}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a5f7a] hover:text-[#134b61] hover:underline transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </button>

        <button
          type="button"
          id="btn-prefill-registration"
          onClick={handlePrefillDemo}
          className="text-[11px] font-semibold text-slate-500 hover:text-[#1a5f7a] underline underline-offset-2 transition-colors cursor-pointer"
        >
          Auto-fill Sample Data
        </button>
      </div>

      {/* Error alert if validation fails */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      {/* 1. Full Name */}
      <div className="flex flex-col space-y-1">
        <label
          htmlFor="reg-fullname"
          className="text-xs font-semibold text-slate-700"
        >
          Full Legal Name
        </label>
        <div className="relative rounded-xl shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#1a5f7a] focus-within:border-transparent">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <User className="w-4 h-4" />
          </div>
          <input
            id="reg-fullname"
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="e.g. Eleanor Vance"
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none"
          />
        </div>
      </div>

      {/* 2. Two-column row: Date of Birth & Phone Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Date of Birth */}
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="reg-dob"
            className="text-xs font-semibold text-slate-700"
          >
            Date of Birth
          </label>
          <div className="relative rounded-xl shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#1a5f7a] focus-within:border-transparent">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              id="reg-dob"
              name="dateOfBirth"
              type="date"
              required
              max={new Date().toISOString().split('T')[0]}
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="reg-phone"
            className="text-xs font-semibold text-slate-700"
          >
            Phone Number
          </label>
          <div className="relative rounded-xl shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#1a5f7a] focus-within:border-transparent">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              id="reg-phone"
              name="phoneNumber"
              type="tel"
              required
              value={formData.phoneNumber}
              onChange={handlePhoneInput}
              placeholder="(555) 000-0000"
              maxLength={14}
              className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Email Address */}
      <div className="flex flex-col space-y-1">
        <label
          htmlFor="reg-email"
          className="text-xs font-semibold text-slate-700"
        >
          Email Address
        </label>
        <div className="relative rounded-xl shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#1a5f7a] focus-within:border-transparent">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="reg-email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="patient@healthychoiceclinic.org"
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none"
          />
        </div>
      </div>

      {/* 4. Password with Eye Toggle */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <label
            htmlFor="reg-password"
            className="text-xs font-semibold text-slate-700"
          >
            Create Secure Password
          </label>
          <span className="text-[11px] text-slate-400 font-normal">Min. 8 characters</span>
        </div>
        <div className="relative rounded-xl shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#1a5f7a] focus-within:border-transparent">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="reg-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="••••••••••••"
            className="w-full pl-10 pr-11 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none font-sans"
          />
          <button
            type="button"
            id="btn-toggle-reg-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Consent & HIPAA Notice */}
      <div className="pt-1">
        <label className="flex items-start gap-2 cursor-pointer select-none text-left">
          <input
            type="checkbox"
            id="reg-consent-checkbox"
            checked={formData.agreeTerms}
            onChange={(e) => handleChange('agreeTerms', e.target.checked)}
            className="mt-0.5 w-4 h-4 text-[#1a5f7a] border-slate-300 rounded focus:ring-[#1a5f7a] accent-[#1a5f7a] cursor-pointer"
          />
          <span className="text-[11px] text-slate-500 leading-tight">
            I certify that the information provided is accurate and agree to ZARMA HOSPITAL’s{' '}
            <span className="text-[#1a5f7a] font-medium">HIPAA Privacy Notice</span> &{' '}
            <span className="text-[#1a5f7a] font-medium">Patient Terms of Care</span>.
          </span>
        </label>
      </div>

      {/* Primary CTA: Solid medical blue full-width button */}
      <div className="pt-2">
        <motion.button
          type="submit"
          id="btn-register-submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.01 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white shadow-md shadow-[#1a5f7a]/25 focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] focus:ring-offset-2 transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#1a5f7a' }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Creating Patient Profile...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-[#8bc34a]" />
              <span>Register Patient Account</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Link back to Sign In */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-600">
          Already registered?{' '}
          <button
            type="button"
            id="btn-switch-to-signin"
            onClick={onNavigateToSignIn}
            className="font-bold text-[#1a5f7a] hover:text-[#134b61] hover:underline focus:outline-none transition-colors cursor-pointer"
          >
            Sign in to your account
          </button>
        </p>
      </div>
    </form>
  );
};
