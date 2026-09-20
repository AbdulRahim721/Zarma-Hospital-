import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, LogOut, Calendar, FileText, UserCheck, Stethoscope, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

interface AuthSuccessCardProps {
  email: string;
  role: UserRole;
  isRegistered?: boolean;
  onSignOut: () => void;
  onOpenPortal?: () => void;
}

export const AuthSuccessCard: React.FC<AuthSuccessCardProps> = ({
  email,
  role,
  isRegistered = false,
  onSignOut,
  onOpenPortal,
}) => {
  const getRoleBadge = () => {
    switch (role) {
      case 'Doctor':
        return {
          icon: Stethoscope,
          label: 'Clinical Physician Access',
          color: 'bg-teal-50 text-teal-700 border-teal-200',
        };
      case 'Admin':
        return {
          icon: ShieldCheck,
          label: 'Clinic Operations Administrator',
          color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'Patient':
      default:
        return {
          icon: UserCheck,
          label: 'Verified Patient Portal',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
    }
  };

  const badge = getRoleBadge();
  const Icon = badge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-200/90 shadow-lg"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#1a5f7a]/10 text-[#1a5f7a] flex items-center justify-center mb-4">
        <CheckCircle className="w-9 h-9 text-[#8bc34a]" />
      </div>

      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${badge.color}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {badge.label}
      </span>

      <h2 className="text-xl font-bold text-slate-900 mb-1">
        {isRegistered ? 'Patient Account Created!' : 'Authenticated Successfully'}
      </h2>

      <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
        {isRegistered
          ? `Welcome to ZARMA HOSPITAL. Your patient profile has been registered under ${email}.`
          : `Signed in as ${email}. Your session is active with role-specific clinical permissions.`}
      </p>

      {/* Quick shortcuts / features for the portal */}
      <div className="w-full grid grid-cols-2 gap-3 mb-6 text-left">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
          <Calendar className="w-4 h-4 text-[#1a5f7a] shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-slate-800">
              {role === 'Doctor' ? 'Schedule & Rounds' : 'Appointments'}
            </div>
            <div className="text-[11px] text-slate-500">
              {role === 'Doctor' ? '12 patients scheduled today' : 'Upcoming visits & history'}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
          <FileText className="w-4 h-4 text-[#8bc34a] shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-slate-800">
              {role === 'Admin' ? 'Audit Records' : 'Medical Records'}
            </div>
            <div className="text-[11px] text-slate-500">
              EHR & Consult Summaries
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action to Enter Portal */}
      {onOpenPortal && (
        <button
          type="button"
          id="btn-open-portal-card"
          onClick={onOpenPortal}
          className="w-full py-3 px-4 rounded-xl font-bold text-white text-xs sm:text-sm bg-[#1a5f7a] hover:bg-[#134b61] shadow-md shadow-[#1a5f7a]/25 mb-3 transition-all cursor-pointer"
        >
          {role === 'Doctor'
            ? "Open Doctor Portal (Today's Agenda & Clinical Notes)"
            : role === 'Admin'
            ? 'Open Admin Operations (Master Analytics & Scheduling)'
            : 'Open Patient Dashboard & Booking'}
        </button>
      )}

      {/* Return / Sign Out Action */}
      <button
        type="button"
        id="btn-sign-out"
        onClick={onSignOut}
        className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5 text-slate-400" />
        <span>Return to Login Screen</span>
      </button>
    </motion.div>
  );
};
