import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, X, CheckCircle2, ArrowRight, Loader2, KeyRound } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleModalClose = () => {
    setIsSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="forgot-password-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            {/* Close Button */}
            <button
              id="btn-close-forgot-modal"
              type="button"
              onClick={handleModalClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1a5f7a]/10 flex items-center justify-center mb-4 text-[#1a5f7a]">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  Reset Portal Password
                </h3>
                <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                  Enter your registered clinic email address and we'll transmit a secure, time-sensitive verification link to reset your credentials.
                </p>

                <form onSubmit={handleResetSubmit} className="space-y-4">
                  {error && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Registered Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@healthychoiceclinic.org"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1a5f7a] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a5f7a] text-white text-xs font-semibold shadow-sm hover:bg-[#134b61] transition-colors disabled:opacity-70 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Sending Link...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Reset Link</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8 text-[#8bc34a]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Reset Instructions Dispatched
                </h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed max-w-xs mx-auto">
                  If an account exists for <strong className="text-slate-800">{email}</strong>, a secure reset instruction email has been sent. Please check your inbox and spam folders.
                </p>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1a5f7a] text-white text-xs font-semibold hover:bg-[#134b61] transition-colors cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
