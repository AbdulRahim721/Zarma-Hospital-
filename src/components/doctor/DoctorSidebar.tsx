import React, { useState } from 'react';
import {
  CalendarDays,
  CalendarRange,
  ClipboardList,
  UserCheck,
  LogOut,
  ArrowLeftRight,
  Menu,
  X,
  Stethoscope,
  ShieldCheck,
  Clock,
  ChevronRight,
  Lock,
  AlertTriangle,
  UserCog,
  Check,
} from 'lucide-react';
import { ClinicLogo } from '../ClinicLogo';
import { DoctorPortalTab } from '../../types';

interface DoctorSidebarProps {
  activeTab: DoctorPortalTab;
  onTabChange: (tab: DoctorPortalTab) => void;
  pendingRequestsCount: number;
  onSwitchToPatientPortal: () => void;
  onSwitchToAdminPortal?: () => void;
  onSignOut: () => void;
  doctorName?: string;
  doctorSpecialty?: string;
  activeDoctorId?: string;
  onSelectDoctorId?: (id: string) => void;
  availableDoctors?: Array<{ id: string; name: string; specialty: string; room?: string }>;
}

export function DoctorSidebar({
  activeTab,
  onTabChange,
  pendingRequestsCount,
  onSwitchToPatientPortal,
  onSwitchToAdminPortal,
  onSignOut,
  doctorName = 'Dr. Marcus Chen, MD',
  doctorSpecialty = 'Lead Internist & Health Director',
  activeDoctorId = 'doc-2',
  onSelectDoctorId,
  availableDoctors = [],
}: DoctorSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showManageAccountsModal, setShowManageAccountsModal] = useState(false);

  const navItems = [
    {
      id: 'todays-agenda' as DoctorPortalTab,
      label: "Today's Agenda",
      description: 'Pending requests & timeline',
      icon: CalendarDays,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
      badgeColor: 'bg-amber-400 text-slate-900',
    },
    {
      id: 'schedule-leave' as DoctorPortalTab,
      label: 'Schedule & Leave',
      description: 'Weekly hours & leave planner',
      icon: CalendarRange,
    },
    {
      id: 'patient-history' as DoctorPortalTab,
      label: 'My Patient History',
      description: 'Visit records & secure notes',
      icon: ClipboardList,
    },
  ];

  const handleSelectTab = (tab: DoctorPortalTab) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col justify-between bg-[#1a5f7a] text-white">
      {/* Top Clinic Branding & Doctor Identity */}
      <div>
        {/* Clinic Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="p-1 rounded-full bg-white shadow-xs shrink-0">
            <ClinicLogo size={40} variant="colored" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight text-white leading-tight truncate">
              ZARMA HOSPITAL
            </h1>
            <p className="text-xs text-white/70 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8bc34a] animate-pulse" />
              Nowshera • Doctor Portal
            </p>
          </div>
        </div>

        {/* Doctor Profile Card in Sidebar */}
        <div className="m-3 p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8bc34a] text-slate-900 font-bold flex items-center justify-center shrink-0 shadow-xs border-2 border-white/20">
              <Stethoscope className="w-5 h-5 text-slate-900" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white truncate">{doctorName}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#8bc34a] shrink-0" />
              </div>
              <p className="text-[11px] text-white/75 truncate">{doctorSpecialty}</p>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>On Duty • Clinical Suite</span>
              </div>
            </div>
          </div>

          {/* Active Physician Switcher (for testing multi-doctor isolation) */}
          {availableDoctors.length > 1 && onSelectDoctorId && (
            <div className="mt-3 pt-2.5 border-t border-white/10">
              <label htmlFor="select-active-physician" className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">
                Active Physician Scope
              </label>
              <select
                id="select-active-physician"
                value={activeDoctorId}
                onChange={(e) => onSelectDoctorId(e.target.value)}
                className="w-full bg-[#14495e] text-white text-xs rounded-lg px-2.5 py-1.5 border border-white/20 focus:outline-none focus:ring-1 focus:ring-[#8bc34a] cursor-pointer"
              >
                {availableDoctors.map((doc) => (
                  <option key={doc.id} value={doc.id} className="bg-slate-800 text-white">
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Primary Navigation Links */}
        <div className="px-3 pt-2">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-white/50 mb-2">
            Clinical Navigation
          </p>
          <nav className="space-y-1.5" aria-label="Doctor portal primary navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`doctor-nav-${item.id}`}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-white text-[#1a5f7a] shadow-md shadow-black/10 font-bold'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                        isActive ? 'text-[#1a5f7a]' : 'text-white/80'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="truncate leading-tight">{item.label}</div>
                      <div
                        className={`text-[11px] truncate font-normal ${
                          isActive ? 'text-[#1a5f7a]/75' : 'text-white/60'
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 ml-2 shrink-0">
                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-black tracking-wide ${item.badgeColor} shadow-xs animate-pulse`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isActive
                          ? 'text-[#1a5f7a] translate-x-0.5'
                          : 'text-white/40 group-hover:text-white/80 group-hover:translate-x-0.5'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Doctor Role & Scope Card */}
        <div className="mx-3 mt-3 p-3 rounded-xl bg-white/5 border border-white/10 text-[11px]">
          <div className="flex items-center justify-between text-white/80 pb-1.5 border-b border-white/10">
            <span className="font-bold text-white">Doctor Role Scope</span>
            <span className="px-1.5 py-0.5 rounded bg-[#8bc34a]/20 text-[#8bc34a] font-mono text-[10px] font-bold">
              Attending
            </span>
          </div>
          <div className="space-y-1 pt-1.5 text-[10px] text-white/70">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <Check className="w-3 h-3 shrink-0" />
              <span>Set own availability & leave</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <Check className="w-3 h-3 shrink-0" />
              <span>Confirm/reject appointments</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-300">
              <Lock className="w-3 h-3 shrink-0" />
              <span>Other doctors' records: Hidden</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-300">
              <Lock className="w-3 h-3 shrink-0" />
              <span>Manage doctor accounts: Restricted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Switcher & Sign Out */}
      <div className="p-3 border-t border-white/10 space-y-2 bg-[#14495e]/60">
        <div className="grid grid-cols-2 gap-1.5">
          {/* Switch to Patient Portal button */}
          <button
            type="button"
            id="btn-switch-to-patient-portal"
            onClick={onSwitchToPatientPortal}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-[#8bc34a] text-slate-900 text-[11px] font-bold hover:bg-[#9ccc65] transition-colors cursor-pointer shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-900" />
            <span className="truncate">Patient Portal</span>
          </button>

          {/* Manage Doctor Accounts (Explicitly Restricted for Doctor Role) */}
          <button
            type="button"
            id="btn-restricted-manage-doctor-accounts"
            onClick={() => setShowManageAccountsModal(true)}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-[11px] font-bold transition-colors cursor-pointer border border-white/15 shadow-xs"
            title="Doctor Account Management (Restricted)"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span className="truncate">Doctor Accts</span>
          </button>
        </div>

        {/* Sign Out link */}
        <button
          type="button"
          id="btn-doctor-sign-out"
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 text-xs font-medium transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit / Sign Out</span>
        </button>

        <div className="px-2 pt-1 text-center text-[10px] text-white/40">
          ZARMA HOSPITAL EHR v2.6 • HIPAA Compliant
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header Bar with Hamburger */}
      <header className="lg:hidden sticky top-0 z-40 w-full bg-[#1a5f7a] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-full bg-white">
            <ClinicLogo size={32} variant="colored" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">ZARMA HOSPITAL</h1>
            <p className="text-[10px] text-white/70">Nowshera • Doctor Portal • {doctorName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pendingRequestsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-xs font-bold">
              {pendingRequestsCount} new
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-out Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Fixed Left-side Navigation Sidebar */}
      <aside
        id="doctor-fixed-sidebar"
        className="hidden lg:block fixed inset-y-0 left-0 w-64 xl:w-72 z-30 shadow-xl"
      >
        <SidebarContent />
      </aside>

      {/* Doctor Account Management Restriction Modal */}
      {showManageAccountsModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="restriction-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative text-slate-800 animate-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowManageAccountsModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <h2 id="restriction-dialog-title" className="text-lg font-bold text-slate-900 mb-2">
              Doctor Account Management Restricted
            </h2>

            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Under clinic role separation rules, attending doctors <strong>cannot manage doctor accounts</strong>, staff credentials, or physician rosters.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 mb-5">
              <div className="font-semibold text-slate-700">Doctor Role Permissions:</div>
              <ul className="space-y-1 text-slate-600">
                <li className="flex items-center gap-1.5 text-emerald-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Can set own availability and clinical leave</span>
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Can confirm or reject own appointment requests</span>
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Can mark visits Completed or No-show</span>
                </li>
                <li className="flex items-center gap-1.5 text-rose-700">
                  <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Cannot manage doctor accounts (Admin only)</span>
                </li>
                <li className="flex items-center gap-1.5 text-rose-700">
                  <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Cannot see other doctors' appointments or patients</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setShowManageAccountsModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#1a5f7a] hover:bg-[#14495e] text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
}
