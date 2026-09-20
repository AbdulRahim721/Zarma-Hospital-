import React from 'react';
import { ClinicLogo } from './ClinicLogo';
import { HeartPulse, LogOut, ShieldCheck, User, PhoneCall, ArrowLeftRight } from 'lucide-react';

interface PatientPortalNavbarProps {
  patientName: string;
  onSignOut: () => void;
  onSwitchToAuth: () => void;
  onSwitchToDoctorPortal?: () => void;
  onSwitchToAdminPortal?: () => void;
}

export const PatientPortalNavbar: React.FC<PatientPortalNavbarProps> = ({
  patientName,
  onSignOut,
  onSwitchToAuth,
  onSwitchToDoctorPortal,
  onSwitchToAdminPortal,
}) => {
  return (
    <header className="w-full bg-[#1a5f7a] text-white shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-full bg-white shadow-xs">
            <ClinicLogo size={36} variant="colored" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-white leading-tight">
              ZARMA HOSPITAL
            </h1>
            <div className="flex items-center gap-1.5 text-[11px] text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8bc34a]" />
              <span>Nowshera, KPK • Patient Portal</span>
            </div>
          </div>
        </div>

        {/* Right: User Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct shortcut to Doctor Portal */}
          {onSwitchToDoctorPortal && (
            <button
              type="button"
              id="btn-goto-doctor-portal-from-patient"
              onClick={onSwitchToDoctorPortal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#8bc34a] text-slate-900 text-xs font-bold hover:bg-[#9ccc65] transition-colors cursor-pointer shadow-xs"
              title="Open Doctor Portal"
            >
              <HeartPulse className="w-3.5 h-3.5 text-slate-900" />
              <span className="hidden sm:inline">Doctor Portal</span>
            </button>
          )}

          {/* Direct shortcut to Admin Portal */}
          {onSwitchToAdminPortal && (
            <button
              type="button"
              id="btn-goto-admin-portal-from-patient"
              onClick={onSwitchToAdminPortal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 text-sky-200 text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer border border-sky-400/30 shadow-xs"
              title="Open Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden sm:inline">Admin Ops</span>
            </button>
          )}

          {/* User Profile Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white">
            <div className="w-6 h-6 rounded-full bg-[#8bc34a] text-slate-900 flex items-center justify-center font-bold text-xs">
              {patientName.charAt(0)}
            </div>
            <span className="font-semibold">{patientName}</span>
          </div>

          {/* Quick toggle to Auth Screen for testing / demonstration */}
          <button
            type="button"
            id="btn-switch-auth-screen"
            onClick={onSwitchToAuth}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer border border-white/10"
            title="Return to Login / Sign In split screen"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#8bc34a]" />
            <span className="hidden md:inline">Auth Screen</span>
          </button>

          {/* Sign Out Button */}
          <button
            type="button"
            id="btn-portal-signout"
            onClick={onSignOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/80 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
