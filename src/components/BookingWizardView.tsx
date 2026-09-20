import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Stethoscope,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Check,
  Star,
  MapPin,
  AlertCircle,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Doctor, Appointment } from '../types';
import {
  INITIAL_DOCTORS,
  ALL_30MIN_TIME_SLOTS,
  isSlotWithinDoctorHours,
  isSlotInThePast,
} from '../data/mockData';

interface BookingWizardViewProps {
  patientName: string;
  patientEmail: string;
  existingAppointments: Appointment[];
  onCancelWizard: () => void;
  onCompleteBooking: (newAppointment: Appointment) => void;
}

export const BookingWizardView: React.FC<BookingWizardViewProps> = ({
  patientName,
  patientEmail,
  existingAppointments,
  onCancelWizard,
  onCompleteBooking,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(INITIAL_DOCTORS[0]);
  
  // Calendar month state (Default: September 2026)
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [calendarMonth, setCalendarMonth] = useState<number>(8); // 8 = September (0-indexed)
  
  // Selected Date and Time
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [selectedDateIso, setSelectedDateIso] = useState<string>('2026-09-24'); // default pickable date
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM');
  
  // Visit reason
  const [visitReason, setVisitReason] = useState<string>('General Health Checkup & Consultation');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Step Tracker Labels
  const steps = [
    { num: 1, label: 'Select Doctor' },
    { num: 2, label: 'Select Time' },
    { num: 3, label: 'Review & Confirm' },
  ];

  // Format the selected date for human display
  const getFormattedSelectedDate = (isoStr: string): string => {
    if (!isoStr) return '';
    const [y, m, d] = isoStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Check if a given date string is doctor leave
  const isDoctorOnLeave = (dateIso: string): boolean => {
    if (!selectedDoctor) return false;
    return selectedDoctor.leaveDates.includes(dateIso);
  };

  // Check if a given day of week is outside working days
  const isWorkingDay = (year: number, month: number, day: number): boolean => {
    if (!selectedDoctor) return true;
    const dayOfWeek = new Date(year, month, day).getDay();
    return selectedDoctor.workingDays.includes(dayOfWeek);
  };

  // Check if a date is in the past
  const isDateInThePast = (dateIso: string): boolean => {
    return dateIso < todayIso;
  };

  // Calculate 30-minute end time for display
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

  // Determine booked/blocked slots for the selected date & doctor
  const getBookedSlotsForDate = (dateIso: string, doctorId: string): string[] => {
    // 1. Existing booked appointments in system
    const systemBooked = existingAppointments
      .filter((apt) => apt.doctorId === doctorId && apt.dateIso === dateIso)
      .map((apt) => apt.timeSlot.split(' - ')[0].trim());

    // 2. Mock booked slots for realism
    const mockBookedPerDate: Record<string, string[]> = {
      '2026-09-24': ['09:00 AM', '11:00 AM', '02:30 PM'],
      '2026-09-25': ['09:30 AM', '10:30 AM', '03:00 PM'],
      '2026-09-26': ['08:30 AM', '10:00 AM'],
      '2026-09-29': ['09:00 AM', '01:30 PM', '04:00 PM'],
    };

    const extra = mockBookedPerDate[dateIso] || ['09:00 AM', '02:00 PM'];
    return Array.from(new Set([...systemBooked, ...extra]));
  };

  // Detailed slot availability evaluation enforcing all constraints
  const getSlotAvailability = (slot: string) => {
    if (!selectedDoctor) return { available: false, reason: 'No doctor selected' };

    const fullSlot = getFullSlotString(slot);

    // Rule 1: Cannot book outside doctor's hours
    if (!isSlotWithinDoctorHours(slot, selectedDoctor)) {
      return {
        available: false,
        reason: `Outside Doctor's Working Hours (${selectedDoctor.workingHoursStart || '08:30 AM'} - ${selectedDoctor.workingHoursEnd || '05:00 PM'})`,
        type: 'outside_hours',
      };
    }

    // Rule 2: Cannot book a slot that is in the past
    if (isDateInThePast(selectedDateIso) || isSlotInThePast(selectedDateIso, slot)) {
      return {
        available: false,
        reason: 'Slot has passed (in the past)',
        type: 'past',
      };
    }

    // Rule 3: Cannot book doctor on leave
    if (isDoctorOnLeave(selectedDateIso)) {
      return {
        available: false,
        reason: 'Doctor is on Leave',
        type: 'on_leave',
      };
    }

    // Rule 4: Cannot book a slot that is taken
    const booked = getBookedSlotsForDate(selectedDateIso, selectedDoctor.id);
    if (booked.includes(slot)) {
      return {
        available: false,
        reason: 'Slot already reserved by another patient',
        type: 'taken',
      };
    }

    // Rule 5: Cannot have two appointments at the same time (patient double booking)
    const patientConflict = existingAppointments.find(
      (apt) =>
        (apt.patientEmail === patientEmail || !apt.patientEmail) &&
        apt.dateIso === selectedDateIso &&
        (apt.timeSlot.includes(slot) || apt.timeSlot === fullSlot)
    );
    if (patientConflict) {
      return {
        available: false,
        reason: `Schedule Conflict: You already have an appointment with ${patientConflict.doctorName} at this time`,
        type: 'double_booking',
      };
    }

    return { available: true, reason: 'Available Free Slot', type: 'free' };
  };

  // Generate calendar days for current month
  const renderCalendarDays = () => {
    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const prevMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();

    const days = [];

    // Previous month padding cells
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push(
        <div
          key={`prev-${i}`}
          className="h-10 flex items-center justify-center text-xs text-slate-300 pointer-events-none select-none"
        >
          {prevMonthDays - i}
        </div>
      );
    }

    // Current month cells
    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(calendarMonth + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateIso = `${calendarYear}-${monthStr}-${dayStr}`;

      const onLeave = isDoctorOnLeave(dateIso);
      const working = isWorkingDay(calendarYear, calendarMonth, day);
      const past = isDateInThePast(dateIso);
      const isSelected = selectedDateIso === dateIso;

      // Disable conditions: On Leave OR outside working days OR past date
      const isDisabled = onLeave || !working || past;

      days.push(
        <button
          key={`current-${day}`}
          type="button"
          disabled={isDisabled}
          onClick={() => {
            if (!isDisabled) {
              setSelectedDateIso(dateIso);
              // Pick first valid slot
              const openSlot = ALL_30MIN_TIME_SLOTS.find(
                (s) =>
                  isSlotWithinDoctorHours(s, selectedDoctor!) &&
                  !isSlotInThePast(dateIso, s) &&
                  !getBookedSlotsForDate(dateIso, selectedDoctor!.id).includes(s)
              );
              if (openSlot) setSelectedTimeSlot(openSlot);
            }
          }}
          className={`relative h-10 w-full rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all select-none ${
            isSelected
              ? 'bg-[#1a5f7a] text-white shadow-md shadow-[#1a5f7a]/30 font-bold scale-105 z-10'
              : past
              ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
              : onLeave
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-dashed border-slate-300 opacity-65'
              : !working
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-800 hover:bg-[#1a5f7a]/10 hover:text-[#1a5f7a] cursor-pointer'
          }`}
          title={
            past
              ? 'Past date (Booking in the past is not allowed)'
              : onLeave
              ? `${selectedDoctor?.name || 'Doctor'} is on Leave`
              : !working
              ? 'Clinic closed / Doctor off-duty'
              : `Available: ${dateIso}`
          }
        >
          <span>{day}</span>
          {/* Visual tag for Doctor Leave or Past */}
          {onLeave && (
            <span className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter leading-none mt-0.5">
              Leave
            </span>
          )}
          {past && (
            <span className="text-[8px] text-slate-400 font-normal leading-none mt-0.5">
              Past
            </span>
          )}
          {isSelected && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#8bc34a] mt-0.5" />
          )}
        </button>
      );
    }

    return days;
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const currentMonthName = new Date(calendarYear, calendarMonth).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  // Submit Final Booking
  const handleFinalSubmit = () => {
    if (!selectedDoctor) return;

    const fullSlot = getFullSlotString(selectedTimeSlot);
    const [y, m, d] = selectedDateIso.split('-').map(Number);
    
    // Parse time to construct accurate ISO string for 2-hour cancellation rule
    const [t, period] = selectedTimeSlot.split(' ');
    let [hour, minute] = t.split(':').map(Number);
    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    const scheduledDateTime = new Date(y, m - 1, d, hour, minute);

    const newAppointment: Appointment = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      patientName: patientName,
      patientEmail: patientEmail,
      date: getFormattedSelectedDate(selectedDateIso),
      dateIso: selectedDateIso,
      timeSlot: fullSlot,
      status: 'Pending Approval', // Initially pending as requested
      reason: visitReason,
      location: `ZARMA HOSPITAL • Nowshera, KPK • ${selectedDoctor.location}`,
      scheduledTimeIso: scheduledDateTime.toISOString(),
    };

    onCompleteBooking(newAppointment);
  };

  return (
    <div id="booking-wizard-container" className="w-full max-w-4xl mx-auto py-4 sm:py-8 px-2 sm:px-4">
      {/* Top Header & Cancel Wizard button */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8bc34a]">
            Appointment Scheduling
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Book New Clinical Visit
          </h2>
        </div>
        <button
          type="button"
          id="btn-abort-wizard"
          onClick={onCancelWizard}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
        >
          Cancel & Return
        </button>
      </div>

      {/* Sleek Horizontal Progress Bar Tracker */}
      <div className="mb-8" id="booking-progress-tracker">
        <div className="flex items-center justify-between relative max-w-2xl mx-auto">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-[#1a5f7a] -translate-y-1/2 z-0 transition-all duration-300"
            style={{
              width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
            }}
          />

          {steps.map((step) => {
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <div
                key={step.num}
                className="relative z-10 flex flex-col items-center cursor-pointer select-none"
                onClick={() => {
                  if (step.num < currentStep) setCurrentStep(step.num as 1 | 2 | 3);
                }}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-[#1a5f7a] text-white'
                      : isCurrent
                      ? 'bg-[#8bc34a] text-white ring-4 ring-[#8bc34a]/30'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : step.num}
                </div>
                <span
                  className={`mt-2 text-[11px] sm:text-xs font-semibold whitespace-nowrap ${
                    isCurrent
                      ? 'text-[#1a5f7a] font-bold'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Select Doctor */}
      {currentStep === 1 && (
        <motion.div
          key="step-1"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="space-y-6"
        >
          <div className="text-left">
            <h3 className="text-lg font-bold text-slate-900">Step 1: Choose Your Physician</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Select a certified family medicine doctor or internal medicine specialist from our clinic roster.
            </p>
          </div>

          {/* Grid of Doctor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_DOCTORS.map((doc) => {
              const isSelected = selectedDoctor?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  id={`doctor-card-${doc.id}`}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`relative p-5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#1a5f7a] ring-2 ring-[#1a5f7a] shadow-lg shadow-[#1a5f7a]/10'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#1a5f7a] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Profile Placeholder Avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-[#1a5f7a] border border-slate-200 flex items-center justify-center shrink-0 font-bold text-lg shadow-inner">
                      {doc.genderAvatar === 'female' ? (
                        <span className="text-xl">👩‍⚕️</span>
                      ) : (
                        <span className="text-xl">👨‍⚕️</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold mb-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{doc.rating}</span>
                        <span className="text-slate-400 font-normal">({doc.reviewsCount} reviews)</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 leading-tight">
                        {doc.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#1a5f7a] mt-0.5">
                        {doc.specialty}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {doc.experienceYears} Years Experience • {doc.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 my-3 line-clamp-2 leading-relaxed">
                    {doc.bio}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Standard Visit: <strong className="text-slate-800">30 Mins</strong>
                    </span>
                    <button
                      type="button"
                      id={`btn-select-doc-${doc.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDoctor(doc);
                        setCurrentStep(2);
                      }}
                      className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1a5f7a] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select Doctor'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Button */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              id="btn-step1-continue"
              disabled={!selectedDoctor}
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-[#1a5f7a] text-white font-semibold text-xs sm:text-sm hover:bg-[#134b61] shadow-md shadow-[#1a5f7a]/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>Continue to Schedule Time</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: Select Date & Time */}
      {currentStep === 2 && selectedDoctor && (
        <motion.div
          key="step-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="space-y-6"
        >
          {/* Selected Doctor Reminder Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5">
              <Stethoscope className="w-4 h-4 text-[#1a5f7a]" />
              <span className="text-xs text-slate-600">
                Scheduling consultation with:{' '}
                <strong className="text-slate-900 font-bold">{selectedDoctor.name}</strong>{' '}
                ({selectedDoctor.specialty})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs font-semibold text-[#1a5f7a] hover:underline cursor-pointer"
            >
              Change Doctor
            </button>
          </div>

          {/* Two Column Layout: Calendar on Left, 30-min Slot Chips on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Interactive Calendar Layout */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#1a5f7a]" />
                  <span>Select Visit Date</span>
                </h4>
                {/* Month Navigator */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">{currentMonthName}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                      aria-label="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                      aria-label="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[11px] font-bold text-slate-400 uppercase">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1" id="calendar-days-grid">
                {renderCalendarDays()}
              </div>

              {/* Legend for Doctor Leave & Availability */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#1a5f7a]" />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-slate-100 border border-dashed border-slate-300" />
                  <span className="text-rose-500 font-medium">Doctor Leave (Greyed out)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8bc34a]" />
                  <span>Available Day</span>
                </div>
              </div>
            </div>

            {/* Right: Responsive Grid of 30-Minute Time Slot Chips */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#8bc34a]" />
                  <span>Available 30-Minute Slots</span>
                </h4>
                <span className="text-xs font-semibold text-[#1a5f7a] bg-[#1a5f7a]/10 px-2.5 py-1 rounded-full">
                  {getFormattedSelectedDate(selectedDateIso)}
                </span>
              </div>

              {/* Check if Doctor is on Leave for the selected date */}
              {isDoctorOnLeave(selectedDateIso) ? (
                <div className="p-6 text-center bg-rose-50 rounded-xl border border-rose-100 text-rose-800">
                  <AlertCircle className="w-8 h-8 mx-auto text-rose-500 mb-2" />
                  <h5 className="font-bold text-sm">Doctor on Approved Leave</h5>
                  <p className="text-xs mt-1">
                    {selectedDoctor.name} is unavailable on this date. Please pick another day on the calendar.
                  </p>
                </div>
              ) : isDateInThePast(selectedDateIso) ? (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                  <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <h5 className="font-bold text-sm">Past Date Selected</h5>
                  <p className="text-xs mt-1">
                    Appointments cannot be booked for past dates. Please select today or a future date.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span>Available clinical slots (Doctor hours: {selectedDoctor.workingHoursStart || '08:30 AM'} - {selectedDoctor.workingHoursEnd || '05:00 PM'}):</span>
                  </div>

                  {/* Render 30-minute time slots with constraint checking */}
                  {(() => {
                    return (
                      <div
                        id="time-slot-chips-grid"
                        className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1"
                      >
                        {ALL_30MIN_TIME_SLOTS.map((slot) => {
                          const status = getSlotAvailability(slot);
                          const isSelected = selectedTimeSlot === slot;
                          const isAvailable = status.available;

                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={!isAvailable}
                              id={`slot-chip-${slot.replace(/\s+/g, '-').toLowerCase()}`}
                              onClick={() => {
                                if (isAvailable) setSelectedTimeSlot(slot);
                              }}
                              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-between select-none ${
                                isSelected
                                  ? 'bg-[#1a5f7a] text-white shadow-md shadow-[#1a5f7a]/25 ring-2 ring-[#1a5f7a]'
                                  : isAvailable
                                  ? 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-[#1a5f7a]/10 hover:border-[#1a5f7a] hover:text-[#1a5f7a] cursor-pointer'
                                  : 'bg-slate-100/80 text-slate-400 border border-dashed border-slate-200 cursor-not-allowed opacity-60'
                              }`}
                              title={status.reason}
                            >
                              <span className="flex items-center gap-1.5">
                                <Clock className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#8bc34a]' : isAvailable ? 'text-slate-400' : 'text-slate-300'}`} />
                                <span>{slot}</span>
                              </span>
                              {isSelected ? (
                                <span className="w-2 h-2 rounded-full bg-[#8bc34a]" />
                              ) : !isAvailable ? (
                                <span className="text-[9px] font-normal text-slate-400 truncate max-w-[50px]">
                                  {status.type === 'taken'
                                    ? 'Taken'
                                    : status.type === 'past'
                                    ? 'Past'
                                    : status.type === 'double_booking'
                                    ? 'Conflict'
                                    : 'Closed'}
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Selected Slot Feedback */}
                  {selectedTimeSlot && getSlotAvailability(selectedTimeSlot).available ? (
                    <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                      <span className="font-semibold">Selected Time:</span>
                      <strong className="font-bold text-[#1a5f7a]">
                        {getFullSlotString(selectedTimeSlot)}
                      </strong>
                    </div>
                  ) : (
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      Please select an available open slot from the options above.
                    </div>
                  )}

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8bc34a] shrink-0 mt-0.5" />
                    <span>
                      <strong>Booking Rules Enforced:</strong> Unavailable slots (taken, in past, outside doctor hours, or conflicting with another appointment you have) are automatically blocked.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              id="btn-step2-back"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Doctor Selection</span>
            </button>

            <button
              type="button"
              id="btn-step2-continue"
              disabled={
                isDoctorOnLeave(selectedDateIso) ||
                isDateInThePast(selectedDateIso) ||
                !selectedTimeSlot ||
                !getSlotAvailability(selectedTimeSlot).available
              }
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-[#1a5f7a] text-white font-semibold text-xs sm:text-sm hover:bg-[#134b61] shadow-md shadow-[#1a5f7a]/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continue to Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: Review & Confirm (Receipt-style voucher card) */}
      {currentStep === 3 && selectedDoctor && (
        <motion.div
          key="step-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="space-y-6"
        >
          <div className="text-left">
            <h3 className="text-lg font-bold text-slate-900">Step 3: Review Your Booking</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Verify your appointment voucher details and confirm your request.
            </p>
          </div>

          {/* Clean Receipt-Style Voucher Card */}
          <div
            id="receipt-voucher-card"
            className="w-full max-w-xl mx-auto bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden text-left relative"
          >
            {/* Top decorative clinical receipt header */}
            <div className="bg-[#1a5f7a] text-white p-5 sm:p-6 relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-[#8bc34a] uppercase">
                    ZARMA HOSPITAL • Nowshera, KPK
                  </span>
                  <h4 className="text-lg sm:text-xl font-extrabold tracking-tight text-white mt-0.5">
                    Appointment Booking Voucher
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <FileCheck className="w-5 h-5 text-[#8bc34a]" />
                </div>
              </div>
            </div>

            {/* Receipt Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Doctor and Specialty */}
              <div className="flex items-start gap-4 pb-4 border-b border-dashed border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-[#1a5f7a]/10 text-[#1a5f7a] flex items-center justify-center font-bold text-xl shrink-0">
                  🩺
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Attending Physician
                  </span>
                  <h5 className="text-base font-bold text-slate-900">{selectedDoctor.name}</h5>
                  <p className="text-xs font-semibold text-[#1a5f7a]">{selectedDoctor.specialty}</p>
                  <p className="text-[11px] text-slate-500">{selectedDoctor.location}</p>
                </div>
              </div>

              {/* Date & 30-Minute Time Slot Block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-dashed border-slate-200">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#1a5f7a]" /> Date
                  </span>
                  <p className="text-sm font-bold text-slate-900">
                    {getFormattedSelectedDate(selectedDateIso)}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                    <Clock className="w-3.5 h-3.5 text-[#8bc34a]" /> 30-Minute Slot
                  </span>
                  <p className="text-sm font-bold text-slate-900">
                    {getFullSlotString(selectedTimeSlot)}
                  </p>
                </div>
              </div>

              {/* Patient Details */}
              <div className="pb-4 border-b border-dashed border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Patient Information
                </span>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Patient Name:</span>
                  <strong className="text-slate-800 font-semibold">{patientName}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Contact Email:</span>
                  <strong className="text-slate-800 font-semibold">{patientEmail}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Initial Status:</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                    Pending Approval
                  </span>
                </div>
              </div>

              {/* Reason for Visit Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Primary Reason for Visit
                </label>
                <select
                  value={visitReason}
                  onChange={(e) => setVisitReason(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#1a5f7a] focus:outline-none font-medium"
                >
                  <option value="General Health Checkup & Consultation">General Health Checkup & Consultation</option>
                  <option value="Routine Blood Pressure & Cardiovascular Review">Routine Blood Pressure & Cardiovascular Review</option>
                  <option value="Prescription Refill & Medication Assessment">Prescription Refill & Medication Assessment</option>
                  <option value="Acute Symptom Evaluation (Fever, Cough, Pain)">Acute Symptom Evaluation (Fever, Cough, Pain)</option>
                  <option value="Specialist Follow-up & Lab Results">Specialist Follow-up & Lab Results</option>
                </select>
              </div>

              {/* Cancellation Policy Reminder */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8bc34a] shrink-0 mt-0.5" />
                <span>
                  <strong>Clinic Cancellation Policy:</strong> You may cancel or reschedule at no charge up to 2 hours prior to the scheduled slot via your patient dashboard.
                </span>
              </div>

              {/* Large Primary CTA Button: "Confirm and Request Appointment" */}
              <div className="pt-2">
                <button
                  type="button"
                  id="btn-confirm-booking"
                  onClick={handleFinalSubmit}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#1a5f7a] hover:bg-[#134b61] text-white font-bold text-sm shadow-lg shadow-[#1a5f7a]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#8bc34a]" />
                  <span>Confirm and Request Appointment</span>
                </button>
              </div>

              {/* Back button */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                >
                  Change Date or Time
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
