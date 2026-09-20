import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar as CalendarIcon,
  Clock,
  X,
  User,
  AlertCircle,
  CheckCircle2,
  CalendarDays,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { Appointment, Doctor } from '../types';
import {
  ALL_30MIN_TIME_SLOTS,
  INITIAL_DOCTORS,
  isSlotWithinDoctorHours,
  isSlotInThePast,
} from '../data/mockData';

interface RescheduleModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  doctors?: Doctor[];
  existingAppointments: Appointment[];
  patientEmail: string;
  onClose: () => void;
  onConfirmReschedule: (
    appointmentId: string,
    newDate: string,
    newDateIso: string,
    newTimeSlot: string,
    newScheduledTimeIso: string
  ) => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  appointment,
  doctors = INITIAL_DOCTORS,
  existingAppointments,
  patientEmail,
  onClose,
  onConfirmReschedule,
}) => {
  const today = useMemo(() => new Date(), []);
  const todayIso = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [today]);

  // Initial next day or current appointment date
  const [selectedDateIso, setSelectedDateIso] = useState<string>(() => {
    return appointment?.dateIso || todayIso;
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [calendarMonth, setCalendarMonth] = useState<number>(today.getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(today.getFullYear());
  const [isProcessing, setIsProcessing] = useState(false);

  // Synchronize when appointment opens
  React.useEffect(() => {
    if (appointment) {
      setSelectedDateIso(appointment.dateIso);
      setSelectedTimeSlot('');
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  // Check 2-hour policy restriction: Cannot reschedule less than 2 hours before start
  const appointmentStartTime = new Date(appointment.scheduledTimeIso).getTime();
  const diffMinutes = Math.round((appointmentStartTime - Date.now()) / (1000 * 60));
  const isLessThan2Hours = diffMinutes <= 120;

  const currentDoctor =
    doctors.find((d) => d.id === appointment.doctorId) ||
    ({
      id: appointment.doctorId,
      name: appointment.doctorName,
      specialty: appointment.specialty,
      title: 'Physician',
      experienceYears: 10,
      rating: 4.9,
      reviewsCount: 100,
      location: appointment.location,
      genderAvatar: 'male',
      bio: 'Attending physician at ZARMA HOSPITAL.',
      avatarBg: 'bg-teal-50 text-teal-700',
      workingDays: [1, 2, 3, 4, 5],
      leaveDates: [],
      workingHoursStart: '08:30 AM',
      workingHoursEnd: '05:00 PM',
    } as unknown as Doctor);

  const isDoctorOnLeave = (dateIso: string) => {
    return currentDoctor.leaveDates?.includes(dateIso) || false;
  };

  const isWorkingDay = (year: number, month: number, day: number) => {
    const dayOfWeek = new Date(year, month, day).getDay();
    return currentDoctor.workingDays?.includes(dayOfWeek) ?? true;
  };

  // Check if date is strictly in the past
  const isDateInThePast = (dateIso: string) => {
    return dateIso < todayIso;
  };

  // Formatted date label
  const getFormattedSelectedDate = (isoStr: string) => {
    if (!isoStr) return '';
    const [y, m, d] = isoStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // 30-minute end time
  const getFullSlotString = (startSlot: string): string => {
    const [time, period] = startSlot.split(' ');
    const [h, m] = time.split(':').map(Number);
    let endH = h;
    let endM = m + 30;
    let endPeriod = period;

    if (endM >= 60) {
      endM = 0;
      endH = h + 1;
      if (endH === 12 && period === 'AM') {
        endPeriod = 'PM';
      } else if (endH > 12) {
        endH = 1;
      }
    }
    const endStr = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')} ${endPeriod}`;
    return `${startSlot} - ${endStr}`;
  };

  // Determine slot statuses for selectedDateIso:
  // 1. Taken by another patient with this doctor
  // 2. In the past
  // 3. Outside doctor's hours
  // 4. Conflicts with this patient's other appointments
  const getSlotAvailability = (slot: string) => {
    const fullSlot = getFullSlotString(slot);

    // Rule A: Outside doctor's hours
    const withinHours = isSlotWithinDoctorHours(slot, currentDoctor);
    if (!withinHours) {
      return { available: false, reason: 'Outside Doctor Working Hours' };
    }

    // Rule B: In the past
    if (isDateInThePast(selectedDateIso) || isSlotInThePast(selectedDateIso, slot)) {
      return { available: false, reason: 'Slot has passed (in the past)' };
    }

    // Rule C: Doctor on leave or day closed
    if (isDoctorOnLeave(selectedDateIso)) {
      return { available: false, reason: 'Doctor on leave' };
    }

    // Rule D: Taken by another patient for this doctor
    const isTakenByDoctor = existingAppointments.some(
      (apt) =>
        apt.id !== appointment.id &&
        apt.doctorId === appointment.doctorId &&
        apt.dateIso === selectedDateIso &&
        (apt.timeSlot.includes(slot) || apt.timeSlot === fullSlot)
    );
    if (isTakenByDoctor) {
      return { available: false, reason: 'Slot already reserved (Taken)' };
    }

    // Rule E: Patient already has another appointment at this same time slot!
    const hasPatientConflict = existingAppointments.some(
      (apt) =>
        apt.id !== appointment.id &&
        (apt.patientEmail === patientEmail || !apt.patientEmail) &&
        apt.dateIso === selectedDateIso &&
        (apt.timeSlot.includes(slot) || apt.timeSlot === fullSlot)
    );
    if (hasPatientConflict) {
      return {
        available: false,
        reason: 'Patient Conflict: You already have another appointment at this time',
      };
    }

    return { available: true, reason: 'Open free slot' };
  };

  // Calendar controls
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const renderCalendarDays = () => {
    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const prevMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();
    const days = [];

    // Padding previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push(
        <div
          key={`pad-${i}`}
          className="h-9 flex items-center justify-center text-xs text-slate-300 pointer-events-none"
        >
          {prevMonthDays - i}
        </div>
      );
    }

    // Active month days
    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(calendarMonth + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateIso = `${calendarYear}-${monthStr}-${dayStr}`;

      const past = isDateInThePast(dateIso);
      const onLeave = isDoctorOnLeave(dateIso);
      const working = isWorkingDay(calendarYear, calendarMonth, day);
      const isSelected = selectedDateIso === dateIso;
      const isDisabled = past || onLeave || !working;

      days.push(
        <button
          key={`day-${day}`}
          type="button"
          disabled={isDisabled}
          onClick={() => {
            if (!isDisabled) {
              setSelectedDateIso(dateIso);
              setSelectedTimeSlot('');
            }
          }}
          className={`h-9 w-full rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all select-none ${
            isSelected
              ? 'bg-[#1a5f7a] text-white shadow-sm font-bold scale-105'
              : isDisabled
              ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
              : 'text-slate-800 hover:bg-[#1a5f7a]/10 hover:text-[#1a5f7a] cursor-pointer'
          }`}
          title={
            past
              ? 'Date has passed'
              : onLeave
              ? 'Doctor on Leave'
              : !working
              ? 'Doctor Off-Shift'
              : `Select ${dateIso}`
          }
        >
          <span>{day}</span>
          {onLeave && (
            <span className="text-[8px] font-bold text-rose-500 uppercase leading-none">
              Off
            </span>
          )}
        </button>
      );
    }

    return days;
  };

  const handleConfirm = () => {
    if (!selectedTimeSlot || isLessThan2Hours) return;

    setIsProcessing(true);
    const fullSlot = getFullSlotString(selectedTimeSlot);

    // Calculate new scheduled ISO
    const [y, m, d] = selectedDateIso.split('-').map(Number);
    const [time, period] = selectedTimeSlot.split(' ');
    const [h, min] = time.split(':').map(Number);
    let hour24 = h;
    if (period === 'PM' && h < 12) hour24 += 12;
    if (period === 'AM' && h === 12) hour24 = 0;

    const newDateTime = new Date(y, m - 1, d, hour24, min, 0);

    setTimeout(() => {
      setIsProcessing(false);
      onConfirmReschedule(
        appointment.id,
        getFormattedSelectedDate(selectedDateIso),
        selectedDateIso,
        fullSlot,
        newDateTime.toISOString()
      );
      onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      <div
        id="reschedule-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="bg-[#1a5f7a] text-white p-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <CalendarDays className="w-5 h-5 text-[#8bc34a]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold">Reschedule Appointment</h3>
                <p className="text-xs text-white/80">
                  Select a new available free clinical slot for {appointment.doctorName}
                </p>
              </div>
            </div>
            <button
              id="btn-close-reschedule-modal"
              type="button"
              onClick={onClose}
              className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            {/* If within 2 hours: hard block policy notice */}
            {isLessThan2Hours ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Rescheduling Policy Restriction
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed">
                    Under hospital regulations, appointments scheduled to begin in less than 2 hours
                    cannot be rescheduled or cancelled online. Please call triage directly at{' '}
                    <strong>03295992635</strong> if you need immediate assistance.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Current appointment details */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#1a5f7a]" />
                    <span className="font-bold text-slate-900">{appointment.doctorName}</span>
                    <span className="text-slate-500">• {appointment.specialty}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="font-medium">Current:</span>
                    <span className="font-bold text-slate-800">
                      {appointment.date} @ {appointment.timeSlot}
                    </span>
                  </div>
                </div>

                {/* Date & Slot selection grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Left: Mini Calendar */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-white">
                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-800">
                        {new Date(calendarYear, calendarMonth).toLocaleString('default', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-1">
                      <span>Su</span>
                      <span>Mo</span>
                      <span>Tu</span>
                      <span>We</span>
                      <span>Th</span>
                      <span>Fr</span>
                      <span>Sa</span>
                    </div>

                    {/* Calendar cells */}
                    <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Selected Date:</span>
                      <strong className="text-[#1a5f7a]">
                        {getFormattedSelectedDate(selectedDateIso)}
                      </strong>
                    </div>
                  </div>

                  {/* Right: Available 30-min time slots */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-white flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#8bc34a]" /> Free 30-Minute Slots
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {currentDoctor.workingHoursStart || '08:30 AM'} -{' '}
                          {currentDoctor.workingHoursEnd || '05:00 PM'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 mb-3">
                        Slots that are taken, in the past, outside working hours, or conflicting
                        with your other appointments are disabled:
                      </p>

                      <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                        {ALL_30MIN_TIME_SLOTS.map((slot) => {
                          const status = getSlotAvailability(slot);
                          const isSelected = selectedTimeSlot === slot;

                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={!status.available}
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-between cursor-pointer select-none ${
                                isSelected
                                  ? 'bg-[#1a5f7a] text-white shadow-sm ring-2 ring-[#1a5f7a]'
                                  : status.available
                                  ? 'bg-slate-50 text-slate-800 border border-slate-200 hover:bg-[#1a5f7a]/10 hover:border-[#1a5f7a]'
                                  : 'bg-slate-100 text-slate-400 border border-dashed border-slate-200 cursor-not-allowed opacity-60'
                              }`}
                              title={status.reason}
                            >
                              <span>{slot}</span>
                              {isSelected ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#8bc34a]" />
                              ) : !status.available ? (
                                <span className="text-[9px] font-normal text-slate-400">
                                  Blocked
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {selectedTimeSlot ? (
                      <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                        <span className="font-medium">Rescheduling to:</span>
                        <strong className="font-bold">
                          {getFullSlotString(selectedTimeSlot)}
                        </strong>
                      </div>
                    ) : (
                      <div className="mt-3 text-center text-[11px] text-slate-400 italic">
                        Please select a free 30-minute slot above
                      </div>
                    )}
                  </div>
                </div>

                {/* Policy reminder */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8bc34a] shrink-0 mt-0.5" />
                  <span>
                    <strong>Reschedule Rules:</strong> Free slots only • Outside hours & past times
                    prohibited • No concurrent appointments permitted for the same patient.
                  </span>
                </div>
              </>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                id="btn-cancel-reschedule-modal"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close
              </button>

              {!isLessThan2Hours && (
                <button
                  type="button"
                  id="btn-confirm-reschedule-action"
                  disabled={!selectedTimeSlot || isProcessing}
                  onClick={handleConfirm}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1a5f7a] hover:bg-[#14495e] transition-colors shadow-md shadow-[#1a5f7a]/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {isProcessing ? 'Updating Schedule...' : 'Confirm Reschedule'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
