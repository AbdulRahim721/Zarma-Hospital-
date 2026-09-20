import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DoctorSidebar } from './DoctorSidebar';
import { TodaysAgendaPage } from './TodaysAgendaPage';
import { ScheduleLeavePage } from './ScheduleLeavePage';
import { PatientHistoryNotesPage } from './PatientHistoryNotesPage';
import {
  DoctorPortalTab,
  DoctorAppointment,
  DoctorScheduleConfig,
  DoctorLeaveRange,
  PatientRecord,
} from '../../types';
import {
  INITIAL_DOCTOR_APPOINTMENTS,
  INITIAL_SCHEDULE_CONFIG,
  INITIAL_LEAVE_RANGES,
  INITIAL_PATIENT_RECORDS,
} from '../../data/doctorMockData';
import { ShieldCheck, UserCheck, Calendar, Users } from 'lucide-react';

interface ClinicPhysician {
  id: string;
  name: string;
  specialty: string;
  room: string;
}

const CLINIC_PHYSICIANS: ClinicPhysician[] = [
  {
    id: 'doc-2',
    name: 'Dr. Marcus Chen, MD',
    specialty: 'Lead Internist & Health Director',
    room: 'Suite 408',
  },
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins, MD',
    specialty: 'Family Medicine & Pediatrics',
    room: 'Suite 402',
  },
  {
    id: 'doc-3',
    name: 'Dr. Elena Rostova, DO',
    specialty: "Women's Health & Primary Care",
    room: 'Suite 310',
  },
  {
    id: 'doc-4',
    name: 'Dr. David Patel, MD',
    specialty: 'Geriatrics & Chronic Disease',
    room: 'Suite 315',
  },
];

const INITIAL_SCHEDULE_CONFIGS: Record<string, DoctorScheduleConfig> = {
  'doc-2': INITIAL_SCHEDULE_CONFIG,
  'doc-1': {
    workingDays: [1, 2, 3, 4, 5],
    startTime: '08:30 AM',
    endTime: '04:30 PM',
    lunchStart: '12:30 PM',
    lunchEnd: '01:30 PM',
    slotDurationMinutes: 30,
  },
  'doc-3': {
    workingDays: [1, 2, 4, 5],
    startTime: '09:00 AM',
    endTime: '05:30 PM',
    lunchStart: '01:00 PM',
    lunchEnd: '02:00 PM',
    slotDurationMinutes: 30,
  },
  'doc-4': {
    workingDays: [2, 3, 4, 6],
    startTime: '08:00 AM',
    endTime: '04:00 PM',
    lunchStart: '12:00 PM',
    lunchEnd: '01:00 PM',
    slotDurationMinutes: 30,
  },
};

const INITIAL_DOCTOR_LEAVES: Record<string, DoctorLeaveRange[]> = {
  'doc-2': INITIAL_LEAVE_RANGES,
  'doc-1': [
    {
      id: 'leave-doc1-1',
      startDateIso: '2026-10-05',
      endDateIso: '2026-10-09',
      reason: 'Pediatric Care Annual Summit',
      createdAt: '2026-09-12',
    },
  ],
  'doc-3': [
    {
      id: 'leave-doc3-1',
      startDateIso: '2026-10-18',
      endDateIso: '2026-10-22',
      reason: 'Regional Public Health Outreach',
      createdAt: '2026-09-14',
    },
  ],
  'doc-4': [
    {
      id: 'leave-doc4-1',
      startDateIso: '2026-09-28',
      endDateIso: '2026-09-30',
      reason: 'Geriatric Medicine Board Certification',
      createdAt: '2026-09-10',
    },
  ],
};

interface DoctorPortalViewProps {
  onSwitchToPatientPortal: () => void;
  onSwitchToAdminPortal?: () => void;
  onSignOut: () => void;
  initialDoctorId?: string;
  onUpdateDoctorSchedule?: (doctorId: string, newConfig: DoctorScheduleConfig) => void;
}

export function DoctorPortalView({
  onSwitchToPatientPortal,
  onSwitchToAdminPortal,
  onSignOut,
  initialDoctorId = 'doc-2',
  onUpdateDoctorSchedule,
}: DoctorPortalViewProps) {
  // Active Doctor Identity
  const [activeDoctorId, setActiveDoctorId] = useState<string>(initialDoctorId);
  const activeDoctor =
    CLINIC_PHYSICIANS.find((d) => d.id === activeDoctorId) || CLINIC_PHYSICIANS[0];

  // Primary 3-page navigation tab
  const [activeTab, setActiveTab] = useState<DoctorPortalTab>('todays-agenda');

  // Shared Clinical States
  const [appointments, setAppointments] = useState<DoctorAppointment[]>(
    INITIAL_DOCTOR_APPOINTMENTS
  );
  const [scheduleConfigs, setScheduleConfigs] =
    useState<Record<string, DoctorScheduleConfig>>(INITIAL_SCHEDULE_CONFIGS);
  const [leaveRangesMap, setLeaveRangesMap] =
    useState<Record<string, DoctorLeaveRange[]>>(INITIAL_DOCTOR_LEAVES);
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>(INITIAL_PATIENT_RECORDS);

  // Filter appointments strictly to the active doctor (HIPAA isolation)
  const currentDoctorAppointments = appointments.filter((apt) => apt.doctorId === activeDoctorId);

  // Filter patient records strictly to the active doctor (HIPAA isolation)
  const currentDoctorPatientRecords = patientRecords.filter((pt) => pt.doctorId === activeDoctorId);

  // Active doctor's schedule and leave
  const currentDoctorSchedule = scheduleConfigs[activeDoctorId] || INITIAL_SCHEDULE_CONFIG;
  const currentDoctorLeaves = leaveRangesMap[activeDoctorId] || [];

  // Agenda Actions (Scoped to active doctor's appointment list)
  const handleConfirmRequest = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId && apt.doctorId === activeDoctorId
          ? { ...apt, status: 'Confirmed' }
          : apt
      )
    );
  };

  const handleRejectRequest = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId && apt.doctorId === activeDoctorId
          ? { ...apt, status: 'Rejected' }
          : apt
      )
    );
  };

  const handleMarkCompleted = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId && apt.doctorId === activeDoctorId
          ? { ...apt, status: 'Completed' }
          : apt
      )
    );
  };

  const handleMarkNoShow = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId && apt.doctorId === activeDoctorId
          ? { ...apt, status: 'No-Show' }
          : apt
      )
    );
  };

  // Schedule & Leave Actions
  const handleUpdateScheduleConfig = (newConfig: DoctorScheduleConfig) => {
    setScheduleConfigs((prev) => ({
      ...prev,
      [activeDoctorId]: newConfig,
    }));
    if (onUpdateDoctorSchedule) {
      onUpdateDoctorSchedule(activeDoctorId, newConfig);
    }
  };

  const handleAddLeaveRange = (newRange: DoctorLeaveRange) => {
    setLeaveRangesMap((prev) => ({
      ...prev,
      [activeDoctorId]: [newRange, ...(prev[activeDoctorId] || [])],
    }));

    // Automatically cancel conflicting appointments in that window for THIS doctor
    setAppointments((prev) =>
      prev.map((apt) => {
        if (
          apt.doctorId === activeDoctorId &&
          apt.dateIso >= newRange.startDateIso &&
          apt.dateIso <= newRange.endDateIso
        ) {
          return {
            ...apt,
            status: 'Rejected',
            reason: `Doctor on scheduled clinical leave: ${newRange.reason}`,
          };
        }
        return apt;
      })
    );
  };

  const handleRemoveLeaveRange = (leaveId: string) => {
    setLeaveRangesMap((prev) => ({
      ...prev,
      [activeDoctorId]: (prev[activeDoctorId] || []).filter((r) => r.id !== leaveId),
    }));
  };

  // Clinical Notes Actions (Scoped to active doctor's patient charts)
  const handleSavePatientNotes = (patientId: string, notes: string, lock: boolean) => {
    setPatientRecords((prev) =>
      prev.map((pt) =>
        pt.id === patientId && pt.doctorId === activeDoctorId
          ? {
              ...pt,
              consultationNotes: notes,
              isNotesLocked: lock,
              lockedAt: lock ? new Date().toLocaleString() : undefined,
              lockedBy: lock ? activeDoctor.name : undefined,
            }
          : pt
      )
    );
  };

  const pendingCount = currentDoctorAppointments.filter(
    (a) => a.status === 'Pending Approval'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 flex flex-col">
      {/* 1. FIXED LEFT-SIDE NAVIGATION SIDEBAR */}
      <DoctorSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingRequestsCount={pendingCount}
        onSwitchToPatientPortal={onSwitchToPatientPortal}
        onSwitchToAdminPortal={onSwitchToAdminPortal}
        onSignOut={onSignOut}
        doctorName={activeDoctor.name}
        doctorSpecialty={activeDoctor.specialty}
        activeDoctorId={activeDoctorId}
        onSelectDoctorId={setActiveDoctorId}
        availableDoctors={CLINIC_PHYSICIANS}
      />

      {/* 2. MAIN CONTENT AREA (Padded left for fixed sidebar on lg screens) */}
      <main className="flex-1 lg:pl-64 xl:pl-72 min-w-0 transition-all">
        {/* TOP SCOPE & SWITCHER BANNER */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shadow-2xs">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1a5f7a]/10 text-[#1a5f7a] flex items-center justify-center font-bold shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#1a5f7a]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 truncate">
                    {activeDoctor.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8bc34a]/20 text-[#2e5606] border border-[#8bc34a]/40 shrink-0">
                    {activeDoctor.room}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">{activeDoctor.specialty}</p>
              </div>
            </div>

            {/* Switch Active Physician Tabs (Demonstrates Isolation Rule: Cannot see other doctors' appointments/patients) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Doctor Scope:
              </span>
              {CLINIC_PHYSICIANS.map((doc) => {
                const isCurrent = doc.id === activeDoctorId;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setActiveDoctorId(doc.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#1a5f7a] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {doc.name.replace('Dr. ', '')}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'todays-agenda' && (
              <motion.div
                key={`tab-agenda-${activeDoctorId}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <TodaysAgendaPage
                  appointments={currentDoctorAppointments}
                  onConfirmRequest={handleConfirmRequest}
                  onRejectRequest={handleRejectRequest}
                  onMarkCompleted={handleMarkCompleted}
                  onMarkNoShow={handleMarkNoShow}
                  doctorName={activeDoctor.name}
                  doctorId={activeDoctorId}
                />
              </motion.div>
            )}

            {activeTab === 'schedule-leave' && (
              <motion.div
                key={`tab-schedule-${activeDoctorId}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ScheduleLeavePage
                  scheduleConfig={currentDoctorSchedule}
                  onUpdateScheduleConfig={handleUpdateScheduleConfig}
                  leaveRanges={currentDoctorLeaves}
                  onAddLeaveRange={handleAddLeaveRange}
                  onRemoveLeaveRange={handleRemoveLeaveRange}
                  doctorName={activeDoctor.name}
                  doctorSpecialty={activeDoctor.specialty}
                  doctorId={activeDoctorId}
                />
              </motion.div>
            )}

            {activeTab === 'patient-history' && (
              <motion.div
                key={`tab-history-${activeDoctorId}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <PatientHistoryNotesPage
                  patientRecords={currentDoctorPatientRecords}
                  onSavePatientNotes={handleSavePatientNotes}
                  doctorName={activeDoctor.name}
                  doctorId={activeDoctorId}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
