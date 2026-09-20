import React, { useState } from 'react';
import {
  BarChart3,
  CalendarRange,
  Users,
  ShieldCheck,
  LogOut,
  ArrowLeftRight,
  Menu,
  X,
  Lock,
  ChevronRight,
  Building2,
  Stethoscope,
  Activity,
} from 'lucide-react';
import { ClinicLogo } from '../ClinicLogo';
import { AdminPortalTab } from '../../types';

interface AdminSidebarProps {
  activeTab: AdminPortalTab;
  onTabChange: (tab: AdminPortalTab) => void;
  pendingApprovalsCount: number;
  onSwitchToPatientPortal: () => void;
  onSwitchToDoctorPortal: () => void;
  onSignOut: () => void;
  managerName?: string;
  managerRole?: string;
}

export function AdminSidebar({
  activeTab,
  onTabChange,
  pendingApprovalsCount,
  onSwitchToPatientPortal,
  onSwitchToDoctorPortal,
  onSignOut,
  managerName = 'Kathryn Reed, MHA',
  managerRole = 'Clinic Operations Director',
}: AdminSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'master-analytics' as AdminPortalTab,
      label: 'Master Analytics',
      description: 'Volume stats & staff matrix',
      icon: BarChart3,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} req` : undefined,
      badgeColor: 'bg-amber-400 text-slate-900',
    },
    {
      id: 'operational-schedule' as AdminPortalTab,
      label: 'Operational Schedule',
      description: 'Gantt timeline & doctor capacity',
      icon: CalendarRange,
    },
    {
      id: 'user-directory-settings' as AdminPortalTab,
      label: 'Directory & System Config',
      description: 'Staff accounts & clinic parameters',
      icon: Users,
    },
  ];

  const handleSelectTab = (tab: AdminPortalTab) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col justify-between bg-slate-950 text-slate-100 border-r border-slate-800">
      {/* Top Clinic Branding & Manager Identity */}
      <div>
        {/* Clinic Brand Header with Enterprise Managerial Badge */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-900/60">
          <div className="p-1 rounded-xl bg-white shadow-xs shrink-0">
            <ClinicLogo size={38} variant="colored" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight truncate">
                ZARMA HOSPITAL
              </h1>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase tracking-wider bg-[#1a5f7a] text-sky-200">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Nowshera, KPK • Ops Hub</span>
            </p>
          </div>
        </div>

        {/* Manager Profile Card in Sidebar */}
        <div className="m-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a5f7a] to-slate-800 text-white font-bold flex items-center justify-center shrink-0 border border-slate-700 shadow-xs">
              <Building2 className="w-4 h-4 text-sky-300" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white truncate">{managerName}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#8bc34a] shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">{managerRole}</p>
              <div className="mt-1 flex items-center gap-1 text-[9px] text-sky-400 font-semibold uppercase tracking-wider">
                <Activity className="w-2.5 h-2.5" />
                <span>Level 3 Admin Access</span>
              </div>
            </div>
          </div>

          {/* Privacy Guardrail Tag */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] text-slate-400">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">HIPAA Protected: No Private PHI</span>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <div className="px-3 pt-2">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Operations & Management
          </p>
          <nav className="space-y-1" aria-label="Admin portal navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-[#1a5f7a] text-white shadow-md shadow-sky-950/40 font-bold border border-sky-400/20'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="truncate leading-tight text-xs">{item.label}</div>
                      <div
                        className={`text-[10px] truncate font-normal ${
                          isActive ? 'text-sky-100/80' : 'text-slate-400'
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 ml-2 shrink-0">
                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide ${item.badgeColor} shadow-xs animate-pulse`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isActive
                          ? 'text-white translate-x-0.5'
                          : 'text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Switchers & Sign Out */}
      <div className="p-3 border-t border-slate-800/90 space-y-1.5 bg-slate-950/90">
        <div className="grid grid-cols-2 gap-1.5">
          {/* Switch to Doctor Portal button */}
          <button
            type="button"
            id="btn-admin-switch-to-doctor"
            onClick={onSwitchToDoctorPortal}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-[11px] font-bold transition-colors cursor-pointer"
            title="Open Doctor Portal"
          >
            <Stethoscope className="w-3.5 h-3.5 text-sky-400" />
            <span className="truncate">Doctor View</span>
          </button>

          {/* Switch to Patient Portal button */}
          <button
            type="button"
            id="btn-admin-switch-to-patient"
            onClick={onSwitchToPatientPortal}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-[#8bc34a]/15 hover:bg-[#8bc34a]/25 border border-[#8bc34a]/30 text-[#8bc34a] text-[11px] font-bold transition-colors cursor-pointer"
            title="Open Patient Portal"
          >
            <ArrowLeftRight className="w-3 h-3" />
            <span className="truncate">Patient View</span>
          </button>
        </div>

        {/* Sign Out link */}
        <button
          type="button"
          id="btn-admin-sign-out"
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 text-[11px] font-medium transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Admin Portal</span>
        </button>

        <div className="px-2 pt-1 text-center text-[9px] text-slate-400 font-mono">
          ZARMA HOSPITAL Manager v3.1 • SafeOps
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header Bar with Hamburger */}
      <header className="lg:hidden sticky top-0 z-40 w-full bg-slate-950 text-white px-4 py-3 flex items-center justify-between shadow-md border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-xl bg-white">
            <ClinicLogo size={28} variant="colored" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs font-bold leading-tight">ZARMA HOSPITAL</h1>
              <span className="px-1 py-0.2 rounded text-[9px] font-black uppercase bg-[#1a5f7a] text-white">
                Admin
              </span>
            </div>
            <p className="text-[10px] text-slate-400">{managerRole}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pendingApprovalsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[11px] font-bold">
              {pendingApprovalsCount} req
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white cursor-pointer border border-slate-800"
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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Fixed Left-side Dark Sidebar */}
      <aside
        id="admin-fixed-sidebar"
        className="hidden lg:block fixed inset-y-0 left-0 w-64 xl:w-72 z-30 shadow-2xl"
      >
        <SidebarContent />
      </aside>
    </>
  );
}
