import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminSidebar } from './AdminSidebar';
import { MasterAnalyticsPage } from './MasterAnalyticsPage';
import { OperationalSchedulingPage } from './OperationalSchedulingPage';
import { UserDirectorySettingsPage } from './UserDirectorySettingsPage';
import {
  AdminPortalTab,
  StaffDoctorStat,
  OperationalDoctorColumn,
  GridSlotCell,
  ClinicUserAccount,
  AdminSystemConfig,
  SlotState,
} from '../../types';
import {
  INITIAL_STAFF_DOCTORS,
  OPERATIONAL_DOCTORS,
  INITIAL_OPERATIONAL_SLOTS,
  INITIAL_USER_ACCOUNTS,
  INITIAL_ADMIN_CONFIG,
  TIME_SLOTS_30MIN,
} from '../../data/adminMockData';

interface AdminPortalViewProps {
  onSwitchToPatientPortal: () => void;
  onSwitchToDoctorPortal: () => void;
  onSignOut: () => void;
  managerName?: string;
  managerRole?: string;
}

export function AdminPortalView({
  onSwitchToPatientPortal,
  onSwitchToDoctorPortal,
  onSignOut,
  managerName = 'Kathryn Reed, MHA',
  managerRole = 'Clinic Operations Director',
}: AdminPortalViewProps) {
  // Primary 3-page tab state
  const [activeTab, setActiveTab] = useState<AdminPortalTab>('master-analytics');

  // Operational States
  const [doctorStats, setDoctorStats] = useState<StaffDoctorStat[]>(INITIAL_STAFF_DOCTORS);
  const [operationalDoctors, setOperationalDoctors] =
    useState<OperationalDoctorColumn[]>(OPERATIONAL_DOCTORS);
  const [slots, setSlots] = useState<GridSlotCell[]>(INITIAL_OPERATIONAL_SLOTS);
  const [users, setUsers] = useState<ClinicUserAccount[]>(INITIAL_USER_ACCOUNTS);
  const [systemConfig, setSystemConfig] = useState<AdminSystemConfig>(INITIAL_ADMIN_CONFIG);

  // 1. Doctor status toggle (On-Duty vs On-Leave)
  const handleUpdateDoctorStatus = (
    doctorId: string,
    status: 'On-Duty' | 'On-Leave' | 'Off-Shift'
  ) => {
    setDoctorStats((prev) =>
      prev.map((d) => (d.id === doctorId ? { ...d, status } : d))
    );

    // Sync with Gantt operational scheduling columns
    setOperationalDoctors((prev) =>
      prev.map((d) =>
        d.id === doctorId
          ? {
              ...d,
              isOnLeaveToday: status === 'On-Leave',
              leaveReason: status === 'On-Leave' ? 'Approved Administrative Leave' : undefined,
            }
          : d
      )
    );
  };

  // 2. Override/Toggle slot state on the Gantt grid
  const handleToggleSlotState = (doctorId: string, timeSlot: string, nextState: SlotState) => {
    setSlots((prev) => {
      const existing = prev.find((s) => s.doctorId === doctorId && s.timeSlot === timeSlot);
      if (existing) {
        return prev.map((s) =>
          s.doctorId === doctorId && s.timeSlot === timeSlot
            ? { ...s, state: nextState, bookingRef: nextState === 'confirmed' ? 'HC-ADMIN-RES' : undefined }
            : s
        );
      }
      return [
        ...prev,
        {
          doctorId,
          timeSlot,
          state: nextState,
          durationMinutes: 30,
          bookingRef: nextState === 'confirmed' ? 'HC-ADMIN-RES' : undefined,
        },
      ];
    });
  };

  // 3. Add new doctor account (From Slide-out Drawer)
  const handleAddDoctorAccount = (newDoctor: {
    name: string;
    specialty: string;
    licenseNumber: string;
    room: string;
    email: string;
    phone: string;
    temporaryPassword: string;
  }) => {
    const newDocId = `doc-${Date.now()}`;

    // Add to Users Directory
    const newUserAccount: ClinicUserAccount = {
      id: `usr-${Date.now()}`,
      name: newDoctor.name,
      email: newDoctor.email,
      role: 'Doctor',
      specialty: newDoctor.specialty,
      licenseNumber: newDoctor.licenseNumber,
      room: newDoctor.room,
      phone: newDoctor.phone,
      status: 'Active',
      joinedDate: 'Sep 19, 2026',
    };
    setUsers((prev) => [newUserAccount, ...prev]);

    // Add to Medical Staff Matrix
    const newStaffDoctor: StaffDoctorStat = {
      id: newDocId,
      name: newDoctor.name,
      specialty: newDoctor.specialty,
      room: newDoctor.room,
      licenseNumber: newDoctor.licenseNumber,
      status: 'On-Duty',
      pendingCount: 0,
      confirmedCount: 0,
      completedCount: 0,
      noShowCount: 0,
      cancelledCount: 0,
      email: newDoctor.email,
      phone: newDoctor.phone,
    };
    setDoctorStats((prev) => [...prev, newStaffDoctor]);

    // Add to Gantt Operational Doctors
    const newOpDoc: OperationalDoctorColumn = {
      id: newDocId,
      name: newDoctor.name,
      specialty: newDoctor.specialty.split(' & ')[0],
      room: newDoctor.room.split(' - ')[0],
      isOnLeaveToday: false,
    };
    setOperationalDoctors((prev) => [...prev, newOpDoc]);

    // Initialize free space slots for this doctor
    const newDocSlots: GridSlotCell[] = TIME_SLOTS_30MIN.map((timeSlot) => ({
      doctorId: newDocId,
      timeSlot,
      state: 'free' as const,
      durationMinutes: 30,
      room: newDoctor.room,
    }));
    setSlots((prev) => [...prev, ...newDocSlots]);
  };

  const handleUpdateSystemConfig = (updatedConfig: AdminSystemConfig) => {
    setSystemConfig(updatedConfig);
  };

  const totalPendingApprovals = doctorStats.reduce((acc, doc) => acc + doc.pendingCount, 0);

  return (
    <div className="min-h-screen bg-slate-100/80 font-sans antialiased text-slate-800 flex flex-col">
      {/* 1. DARK SIDEBAR NAV (Fixed left-side navigation) */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingApprovalsCount={totalPendingApprovals}
        onSwitchToPatientPortal={onSwitchToPatientPortal}
        onSwitchToDoctorPortal={onSwitchToDoctorPortal}
        onSignOut={onSignOut}
        managerName={managerName}
        managerRole={managerRole}
      />

      {/* 2. LIGHT BODY LAYOUT (Padded left for fixed sidebar on lg screens) */}
      <main className="flex-1 lg:pl-64 xl:pl-72 min-w-0 transition-all">
        {/* Optional Clinic Emergency Announcement Banner */}
        {systemConfig.emergencyBannerActive && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between border-b border-amber-600 shadow-xs">
            <div className="flex items-center gap-2 max-w-5xl mx-auto">
              <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                Clinic Advisory
              </span>
              <span>{systemConfig.emergencyBannerText}</span>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'master-analytics' && (
              <motion.div
                key="tab-analytics"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <MasterAnalyticsPage
                  doctorStats={doctorStats}
                  onUpdateDoctorStatus={handleUpdateDoctorStatus}
                />
              </motion.div>
            )}

            {activeTab === 'operational-schedule' && (
              <motion.div
                key="tab-schedule"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <OperationalSchedulingPage
                  doctors={operationalDoctors}
                  slots={slots}
                  onToggleSlotState={handleToggleSlotState}
                />
              </motion.div>
            )}

            {activeTab === 'user-directory-settings' && (
              <motion.div
                key="tab-directory"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <UserDirectorySettingsPage
                  users={users}
                  systemConfig={systemConfig}
                  onAddDoctorAccount={handleAddDoctorAccount}
                  onUpdateSystemConfig={handleUpdateSystemConfig}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
