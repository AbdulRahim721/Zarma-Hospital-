import React, { useState } from 'react';
import {
  Check,
  X,
  Clock,
  User,
  AlertCircle,
  Calendar,
  MapPin,
  FileText,
  Phone,
  CheckCircle2,
  XCircle,
  Clock3,
  Sparkles,
  ChevronRight,
  Filter,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { DoctorAppointment } from '../../types';

interface TodaysAgendaPageProps {
  appointments: DoctorAppointment[];
  onConfirmRequest: (appointmentId: string) => void;
  onRejectRequest: (appointmentId: string) => void;
  onMarkCompleted: (appointmentId: string) => void;
  onMarkNoShow: (appointmentId: string) => void;
  doctorName?: string;
  doctorId?: string;
}

// 30-minute intervals from 08:00 AM to 05:00 PM
const TIMELINE_SLOTS = [
  { label: '08:00 AM', hour: 8, minute: 0 },
  { label: '08:30 AM', hour: 8, minute: 30 },
  { label: '09:00 AM', hour: 9, minute: 0 },
  { label: '09:30 AM', hour: 9, minute: 30 },
  { label: '10:00 AM', hour: 10, minute: 0 },
  { label: '10:30 AM', hour: 10, minute: 30 },
  { label: '11:00 AM', hour: 11, minute: 0 },
  { label: '11:30 AM', hour: 11, minute: 30 },
  { label: '12:00 PM', hour: 12, minute: 0 },
  { label: '12:30 PM', hour: 12, minute: 30 }, // Lunch break
  { label: '01:00 PM', hour: 13, minute: 0 },
  { label: '01:30 PM', hour: 13, minute: 30 },
  { label: '02:00 PM', hour: 14, minute: 0 },
  { label: '02:30 PM', hour: 14, minute: 30 },
  { label: '03:00 PM', hour: 15, minute: 0 },
  { label: '03:30 PM', hour: 15, minute: 30 },
  { label: '04:00 PM', hour: 16, minute: 0 },
  { label: '04:30 PM', hour: 16, minute: 30 },
  { label: '05:00 PM', hour: 17, minute: 0 },
];

export function TodaysAgendaPage({
  appointments,
  onConfirmRequest,
  onRejectRequest,
  onMarkCompleted,
  onMarkNoShow,
  doctorName = 'Dr. Marcus Chen, MD',
  doctorId,
}: TodaysAgendaPageProps) {
  // Live or simulated clinic hour to allow testing at any time of day
  // Default simulated hour set to 11:45 AM so earlier slots (08:30, 09:30, 10:30) have passed,
  // and future slots (02:00 PM, 04:00 PM) are upcoming.
  const [currentSimulatedTime, setCurrentSimulatedTime] = useState<{
    hour: number;
    minute: number;
    isLive: boolean;
  }>({
    hour: 11,
    minute: 45,
    isLive: false,
  });

  const [feedbackToast, setFeedbackToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setFeedbackToast({ message, type });
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // Separate pending requests and confirmed/completed timeline appointments
  const pendingRequests = appointments.filter((apt) => apt.status === 'Pending Approval');
  const timelineAppointments = appointments.filter(
    (apt) => apt.status !== 'Pending Approval' && apt.status !== 'Rejected'
  );

  // Helper to determine if an appointment has been matched or passed by current clinic time
  const hasAppointmentTimePassed = (apt: DoctorAppointment): boolean => {
    let currentTotalMinutes: number;

    if (currentSimulatedTime.isLive) {
      const liveNow = new Date();
      currentTotalMinutes = liveNow.getHours() * 60 + liveNow.getMinutes();
    } else {
      currentTotalMinutes = currentSimulatedTime.hour * 60 + currentSimulatedTime.minute;
    }

    const aptTotalMinutes = apt.startHour * 60 + apt.startMinute;
    return currentTotalMinutes >= aptTotalMinutes;
  };

  const handleConfirm = (id: string, name: string) => {
    onConfirmRequest(id);
    showToast(`Appointment confirmed for ${name}. Added to daily timeline.`, 'success');
  };

  const handleReject = (id: string, name: string) => {
    onRejectRequest(id);
    showToast(`Appointment request for ${name} has been declined.`, 'error');
  };

  const handleComplete = (id: string, name: string) => {
    const apt = appointments.find((a) => a.id === id);
    if (apt && !hasAppointmentTimePassed(apt)) {
      showToast(
        `Action Blocked: Cannot mark ${name}'s visit Completed before it starts at ${apt.timeSlot}.`,
        'error'
      );
      return;
    }
    onMarkCompleted(id);
    showToast(`${name}'s consultation marked as Completed.`, 'success');
  };

  const handleNoShow = (id: string, name: string) => {
    const apt = appointments.find((a) => a.id === id);
    if (apt && !hasAppointmentTimePassed(apt)) {
      showToast(
        `Action Blocked: Cannot mark ${name} as No-Show before the visit starts at ${apt.timeSlot}.`,
        'error'
      );
      return;
    }
    onMarkNoShow(id);
    showToast(`${name} marked as No-Show. Notice logged in EHR.`, 'info');
  };

  // Find appointment matching a 30-minute interval
  const getAppointmentForSlot = (hour: number, minute: number) => {
    return timelineAppointments.find(
      (apt) => apt.startHour === hour && Math.abs(apt.startMinute - minute) < 15
    );
  };

  const formattedSimulatedTime = () => {
    const h = currentSimulatedTime.hour;
    const m = currentSimulatedTime.minute;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const displayM = m < 10 ? `0${m}` : m;
    return `${displayH}:${displayM} ${period}`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Feedback Notification */}
      {feedbackToast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-2.5 transition-all animate-in fade-in slide-in-from-top-4 ${
            feedbackToast.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : feedbackToast.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-300'
              : 'bg-blue-50 text-blue-900 border-blue-300'
          }`}
        >
          {feedbackToast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          {feedbackToast.type === 'error' && <XCircle className="w-5 h-5 text-rose-600" />}
          {feedbackToast.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-600" />}
          <span>{feedbackToast.message}</span>
        </div>
      )}

      {/* Page Header with Real-Time Clock & Test Clock Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#1a5f7a] tracking-tight">
              Today&apos;s Clinical Agenda
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1a5f7a]/10 text-[#1a5f7a]">
              Saturday, Sep 19, 2026
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Real-time appointment schedule, incoming requests, and in-person patient flow.
          </p>
        </div>

        {/* Time Simulator / Live Status Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl shadow-2xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-700">
            <Clock className="w-3.5 h-3.5 text-[#1a5f7a]" />
            <span>Clinic Clock:</span>
            <strong className="text-slate-900 font-bold">{formattedSimulatedTime()}</strong>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Test Hour:</span>
            <button
              type="button"
              id="test-time-0800"
              onClick={() => setCurrentSimulatedTime({ hour: 8, minute: 0, isLive: false })}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] font-semibold ${
                currentSimulatedTime.hour === 8
                  ? 'bg-[#1a5f7a] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="8:00 AM: Before appointments start - Completed/No-Show are locked"
            >
              08:00 AM (Early/Locked)
            </button>
            <button
              type="button"
              id="test-time-0915"
              onClick={() => setCurrentSimulatedTime({ hour: 9, minute: 15, isLive: false })}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] font-semibold ${
                currentSimulatedTime.hour === 9
                  ? 'bg-[#1a5f7a] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="09:15 AM: 08:30 AM appointment has started"
            >
              09:15 AM
            </button>
            <button
              type="button"
              id="test-time-1145"
              onClick={() => setCurrentSimulatedTime({ hour: 11, minute: 45, isLive: false })}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] font-semibold ${
                currentSimulatedTime.hour === 11
                  ? 'bg-[#1a5f7a] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="11:45 AM: Morning visits have started"
            >
              11:45 AM
            </button>
            <button
              type="button"
              id="test-time-1445"
              onClick={() => setCurrentSimulatedTime({ hour: 14, minute: 45, isLive: false })}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] font-semibold ${
                currentSimulatedTime.hour === 14
                  ? 'bg-[#1a5f7a] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="02:45 PM: Afternoon visits have started"
            >
              02:45 PM
            </button>
          </div>
        </div>
      </div>

      {/* Provider Scope & Privacy Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#1a5f7a] shrink-0" />
          <span>
            Provider Scope: Showing appointments only for <strong className="font-semibold text-slate-900">{doctorName || 'Assigned Physician'}</strong>. Other doctors&apos; appointments and schedules are strictly isolated.
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="px-2 py-0.5 rounded-md bg-white border border-sky-300 font-mono text-[10px] font-bold text-sky-800">
            Cannot View Other Doctors
          </span>
          <span className="px-2 py-0.5 rounded-md bg-white border border-sky-300 font-mono text-[10px] font-bold text-sky-800">
            Cannot Mark Before Start
          </span>
        </div>
      </div>

      {/* 1. TOP ALERT BANNER: Dedicated Highlighted Section labeled "Pending Appointment Requests" */}
      <section
        id="pending-appointment-requests-banner"
        className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-4 sm:p-5 shadow-sm transition-all"
        aria-labelledby="pending-requests-title"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 font-bold flex items-center justify-center shrink-0 shadow-2xs">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2
                id="pending-requests-title"
                className="text-base sm:text-lg font-bold text-amber-950 flex items-center gap-2"
              >
                <span>Pending Appointment Requests</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-200 text-amber-900 border border-amber-300">
                  {pendingRequests.length} {pendingRequests.length === 1 ? 'Request' : 'Requests'}
                </span>
              </h2>
              <p className="text-xs text-amber-800">
                Incoming patient booking submissions requiring clinical review and confirmation.
              </p>
            </div>
          </div>

          <div className="text-xs text-amber-900/80 font-medium">
            Standard 30-minute consultation slots
          </div>
        </div>

        {/* Rows of Incoming Requests */}
        <div className="mt-3 divide-y divide-amber-200/80">
          {pendingRequests.length === 0 ? (
            <div className="py-6 text-center text-amber-900">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 mb-1" />
              <p className="text-sm font-semibold">All appointment requests have been processed!</p>
              <p className="text-xs text-amber-800/80">
                New incoming patient submissions will appear here automatically.
              </p>
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                id={`request-row-${req.id}`}
                className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-amber-100/50 px-2 rounded-xl transition-colors"
              >
                {/* Patient Name, Requested Time, & Reason */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-white border border-amber-200 text-[#1a5f7a] font-bold flex items-center justify-center shrink-0 shadow-2xs text-sm">
                    {req.patientName.charAt(0)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        {req.patientName}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-white text-slate-700 border border-amber-300/80 shadow-2xs">
                        <Clock className="w-3 h-3 text-amber-600" />
                        {req.timeSlot}
                      </span>
                      <span className="text-xs text-slate-500 font-medium hidden md:inline">
                        {req.patientPhone}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 mt-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-500">Reason:</span>
                      <span className="text-slate-800 font-semibold truncate">{req.reason}</span>
                    </p>
                  </div>
                </div>

                {/* Two Prominent Accessible Action Buttons: Green Check (Confirm) and Red Cross (Reject) */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Green Check Icon Button (Confirm) */}
                  <button
                    type="button"
                    id={`btn-confirm-request-${req.id}`}
                    onClick={() => handleConfirm(req.id, req.patientName)}
                    aria-label={`Confirm appointment for ${req.patientName}`}
                    title="Confirm appointment"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#8bc34a] hover:bg-[#7cb342] text-slate-950 font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95 border border-[#7cb342]"
                  >
                    <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                    <span>Confirm</span>
                  </button>

                  {/* Red Cross Icon Button (Reject) */}
                  <button
                    type="button"
                    id={`btn-reject-request-${req.id}`}
                    onClick={() => handleReject(req.id, req.patientName)}
                    aria-label={`Reject appointment request for ${req.patientName}`}
                    title="Reject request"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs border border-rose-300 shadow-2xs hover:shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    <X className="w-4 h-4 text-rose-700 stroke-[3]" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 2. MAIN LAYOUT: Vertical Daily Schedule Timeline broken into 30-minute intervals */}
      <section
        id="timeline-daily-schedule"
        className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6"
        aria-labelledby="timeline-title"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-200">
          <div>
            <h2 id="timeline-title" className="text-lg font-bold text-[#1a5f7a] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#1a5f7a]" />
              <span>Daily Consultation Timeline (30-Minute Intervals)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Confirmed patient appointments mapped to 30-minute intervals. Time-passed slots show
              completion controls.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Completed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Upcoming</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>No-Show</span>
            </span>
          </div>
        </div>

        {/* The Vertical Timeline */}
        <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-20 space-y-4 py-2">
          {TIMELINE_SLOTS.map((slot, index) => {
            const appointment = getAppointmentForSlot(slot.hour, slot.minute);
            const isLunchTime = slot.hour === 12 && slot.minute === 30;

            return (
              <div
                key={`${slot.hour}-${slot.minute}`}
                id={`timeline-interval-${slot.hour}-${slot.minute}`}
                className="relative pl-6 sm:pl-8 group"
              >
                {/* Time Indicator on Left (Desktop) */}
                <div className="absolute -left-4 sm:-left-20 top-1 text-[11px] font-bold text-slate-500 sm:w-16 sm:text-right select-none">
                  {slot.label}
                </div>

                {/* Timeline node / dot */}
                <div
                  className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full border-2 bg-white transition-colors ${
                    appointment
                      ? appointment.status === 'Completed'
                        ? 'border-emerald-500 bg-emerald-500'
                        : appointment.status === 'No-Show'
                        ? 'border-rose-500 bg-rose-500'
                        : 'border-[#1a5f7a] bg-[#1a5f7a]'
                      : 'border-slate-300 group-hover:border-slate-400'
                  }`}
                />

                {/* Content: Appointment Card OR Free / Break Slot */}
                {appointment ? (
                  <TimelineAppointmentCard
                    appointment={appointment}
                    hasPassed={hasAppointmentTimePassed(appointment)}
                    onMarkCompleted={() => handleComplete(appointment.id, appointment.patientName)}
                    onMarkNoShow={() => handleNoShow(appointment.id, appointment.patientName)}
                  />
                ) : isLunchTime ? (
                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-amber-800 text-xs flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Clock3 className="w-3.5 h-3.5 text-amber-600" />
                      Clinic Lunch & Inter-Shift Buffer
                    </span>
                    <span className="text-[11px] text-amber-700">12:30 PM - 01:30 PM</span>
                  </div>
                ) : (
                  <div className="py-2 px-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 text-slate-400 text-xs flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Available Clinical Slot</span>
                    <span className="text-[11px] text-slate-400">Open for online booking</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// Subcomponent: Timeline Appointment Card
interface TimelineAppointmentCardProps {
  appointment: DoctorAppointment;
  hasPassed: boolean;
  onMarkCompleted: () => void;
  onMarkNoShow: () => void;
}

function TimelineAppointmentCard({
  appointment,
  hasPassed,
  onMarkCompleted,
  onMarkNoShow,
}: TimelineAppointmentCardProps) {
  const isCompleted = appointment.status === 'Completed';
  const isNoShow = appointment.status === 'No-Show';
  const isResolved = isCompleted || isNoShow;

  return (
    <div
      id={`timeline-card-${appointment.id}`}
      className={`rounded-xl border p-3.5 sm:p-4 transition-all shadow-xs ${
        isCompleted
          ? 'bg-emerald-50/50 border-emerald-200'
          : isNoShow
          ? 'bg-rose-50/50 border-rose-200'
          : hasPassed
          ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-300'
          : 'bg-white border-slate-200 hover:border-[#1a5f7a]/40 hover:shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Patient Details */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {appointment.patientName}
            </h3>

            {/* Status Pill */}
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Check className="w-3 h-3 text-emerald-700" />
                Completed
              </span>
            ) : isNoShow ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                <X className="w-3 h-3 text-rose-700" />
                No-Show
              </span>
            ) : hasPassed ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 animate-pulse">
                <Clock className="w-3 h-3 text-blue-700" />
                Current / Time Passed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                <Clock3 className="w-3 h-3 text-slate-600" />
                Upcoming Confirmed
              </span>
            )}

            <span className="text-xs text-slate-500 font-medium">
              {appointment.timeSlot}
            </span>
          </div>

          <p className="text-xs text-slate-700 flex items-center gap-1 mb-1.5">
            <span className="font-semibold text-slate-600">Chief Complaint:</span>
            <span className="text-slate-900">{appointment.reason}</span>
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
            {appointment.room && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {appointment.room}
              </span>
            )}
            {appointment.vitalSummary && (
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                {appointment.vitalSummary}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              {appointment.patientPhone}
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS: Once real-world time matches or passes an appointment slot, display:
            "Mark Completed" and "Mark No-Show" */}
        {hasPassed && !isResolved && (
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 w-full sm:w-auto">
            {/* Mark Completed Button */}
            <button
              type="button"
              id={`btn-mark-completed-${appointment.id}`}
              onClick={onMarkCompleted}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Mark Completed</span>
            </button>

            {/* Mark No-Show Button */}
            <button
              type="button"
              id={`btn-mark-noshow-${appointment.id}`}
              onClick={onMarkNoShow}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs border border-rose-300 shadow-2xs hover:shadow-sm transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5 stroke-[3]" />
              <span>Mark No-Show</span>
            </button>
          </div>
        )}

        {/* LOCKED BEFORE START: Cannot mark Completed or No-show before visit starts */}
        {!hasPassed && !isResolved && (
          <div className="flex flex-col sm:items-end gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
            <div
              id={`locked-actions-${appointment.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-xs font-semibold border border-slate-200 select-none cursor-not-allowed"
              title="Constraint: Cannot mark Completed or No-Show before appointment start time"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Locked: Starts at {appointment.timeSlot.split(' - ')[0]}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium italic">
              Completed / No-show unlock at start time
            </span>
          </div>
        )}

        {/* If already resolved */}
        {isResolved && (
          <div className="text-right text-xs font-semibold self-start sm:self-center">
            {isCompleted ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Consultation Completed
              </span>
            ) : (
              <span className="text-rose-700 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Recorded as No-Show
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
