import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Calendar, History, CheckCircle2, AlertCircle, Sparkles, ShieldCheck, Lock } from 'lucide-react';
import { Appointment, MedicalHistoryItem, DashboardTab } from '../types';
import { AppointmentCard } from './AppointmentCard';
import { PastMedicalHistoryList } from './PastMedicalHistoryList';
import { CancellationModal } from './CancellationModal';
import { RescheduleModal } from './RescheduleModal';

interface PatientDashboardViewProps {
  patientName: string;
  patientEmail: string;
  appointments: Appointment[];
  historyRecords: MedicalHistoryItem[];
  onOpenBookingWizard: () => void;
  onCancelAppointment: (appointmentId: string, reason?: string) => void;
  onRescheduleAppointment: (
    appointmentId: string,
    newDate: string,
    newDateIso: string,
    newTimeSlot: string,
    newScheduledTimeIso: string
  ) => void;
  recentBookingSuccess?: boolean;
}

export const PatientDashboardView: React.FC<PatientDashboardViewProps> = ({
  patientName,
  patientEmail,
  appointments,
  historyRecords,
  onOpenBookingWizard,
  onCancelAppointment,
  onRescheduleAppointment,
  recentBookingSuccess = false,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('upcoming');
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<Appointment | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(
    recentBookingSuccess ? 'Appointment request submitted successfully! Status: Pending Approval.' : null
  );

  // Strict HIPAA privacy filter: Patients CANNOT see other patients' appointments or notes
  const myAppointments = appointments.filter(
    (apt) => !apt.patientEmail || apt.patientEmail === patientEmail
  );
  const myHistoryRecords = historyRecords.filter(
    (rec) => !rec.patientEmail || rec.patientEmail === patientEmail
  );

  const handleOpenCancelModal = (appointment: Appointment) => {
    setAppointmentToCancel(appointment);
  };

  const handleOpenRescheduleModal = (appointment: Appointment) => {
    setAppointmentToReschedule(appointment);
  };

  const handleConfirmCancel = (appointmentId: string, reason?: string) => {
    onCancelAppointment(appointmentId, reason);
    setToastMessage('Your appointment has been successfully cancelled.');
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleConfirmReschedule = (
    appointmentId: string,
    newDate: string,
    newDateIso: string,
    newTimeSlot: string,
    newScheduledTimeIso: string
  ) => {
    onRescheduleAppointment(appointmentId, newDate, newDateIso, newTimeSlot, newScheduledTimeIso);
    setToastMessage(`Appointment successfully rescheduled to ${newDate} at ${newTimeSlot}!`);
    setTimeout(() => setToastMessage(null), 6000);
  };

  return (
    <div id="patient-dashboard-view" className="w-full max-w-5xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-md flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-[#8bc34a] shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-emerald-700 hover:text-emerald-950 text-xs font-bold px-2 py-1 cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP BAR: Welcoming header "Welcome back, [Patient Name]" alongside floating-style button "+ Book New Appointment" styled in vibrant green (#8bc34a) */}
      <div
        id="dashboard-top-bar"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200"
      >
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#1a5f7a] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#8bc34a] inline-block" />
            Patient Health Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Welcome back, {patientName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your upcoming clinical visits, consult records, and family health profile.
          </p>
          {/* Privacy & EHR Confidentiality Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-[#1a5f7a] border border-sky-200/80 mt-2.5">
            <Lock className="w-3 h-3 text-[#1a5f7a]" />
            <span>Private Health Records • Only visible to {patientName} ({patientEmail})</span>
          </div>
        </div>

        {/* High-visibility, floating-style action button labeled "+ Book New Appointment" styled in vibrant green (#8bc34a) */}
        <div>
          <motion.button
            id="btn-book-new-appointment"
            type="button"
            onClick={onOpenBookingWizard}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-slate-950 text-sm sm:text-base shadow-xl shadow-[#8bc34a]/35 hover:shadow-2xl hover:shadow-[#8bc34a]/45 transition-all duration-200 cursor-pointer select-none"
            style={{ backgroundColor: '#8bc34a' }}
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>+ Book New Appointment</span>
          </motion.button>
        </div>
      </div>

      {/* MAIN BODY: Two-tab container showing "Upcoming Visits" and "Past Medical History" */}
      <div className="w-full">
        {/* Tab Navigation Controls */}
        <div
          role="tablist"
          aria-label="Patient Portal Sections"
          className="flex items-center gap-2 border-b border-slate-200 pb-px mb-6"
        >
          <button
            type="button"
            id="tab-upcoming-visits"
            role="tab"
            aria-selected={activeTab === 'upcoming'}
            onClick={() => setActiveTab('upcoming')}
            className={`relative py-3 px-5 text-sm font-bold transition-colors select-none flex items-center gap-2 cursor-pointer ${
              activeTab === 'upcoming'
                ? 'text-[#1a5f7a]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Upcoming Visits</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                activeTab === 'upcoming'
                  ? 'bg-[#1a5f7a]/10 text-[#1a5f7a]'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {myAppointments.length}
            </span>

            {/* Active underline indicator */}
            {activeTab === 'upcoming' && (
              <motion.div
                layoutId="dashboardTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a5f7a]"
              />
            )}
          </button>

          <button
            type="button"
            id="tab-medical-history"
            role="tab"
            aria-selected={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
            className={`relative py-3 px-5 text-sm font-bold transition-colors select-none flex items-center gap-2 cursor-pointer ${
              activeTab === 'history'
                ? 'text-[#1a5f7a]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Past Medical History</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                activeTab === 'history'
                  ? 'bg-[#1a5f7a]/10 text-[#1a5f7a]'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {myHistoryRecords.length}
            </span>

            {/* Active underline indicator */}
            {activeTab === 'history' && (
              <motion.div
                layoutId="dashboardTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a5f7a]"
              />
            )}
          </button>
        </div>

        {/* Tab 1: Upcoming Visits UI */}
        {activeTab === 'upcoming' && (
          <motion.div
            key="tab-upcoming-content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {myAppointments.length === 0 ? (
              <div className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
                <Calendar className="w-14 h-14 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">No Upcoming Appointments</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
                  You do not currently have any scheduled visits. Book your routine checkup or consult with a clinic physician.
                </p>
                <button
                  type="button"
                  id="btn-empty-book-now"
                  onClick={onOpenBookingWizard}
                  className="inline-flex items-center gap-2 py-3 px-6 rounded-xl font-bold text-slate-950 text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  style={{ backgroundColor: '#8bc34a' }}
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Book New Appointment</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onCancelRequest={handleOpenCancelModal}
                    onRescheduleRequest={handleOpenRescheduleModal}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 2: Past Medical History UI */}
        {activeTab === 'history' && (
          <motion.div
            key="tab-history-content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <PastMedicalHistoryList records={myHistoryRecords} />
          </motion.div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      <CancellationModal
        isOpen={Boolean(appointmentToCancel)}
        appointment={appointmentToCancel}
        onClose={() => setAppointmentToCancel(null)}
        onConfirmCancel={handleConfirmCancel}
      />

      {/* Reschedule Interactive Modal */}
      <RescheduleModal
        isOpen={Boolean(appointmentToReschedule)}
        appointment={appointmentToReschedule}
        existingAppointments={appointments}
        patientEmail={patientEmail}
        onClose={() => setAppointmentToReschedule(null)}
        onConfirmReschedule={handleConfirmReschedule}
      />
    </div>
  );
};
