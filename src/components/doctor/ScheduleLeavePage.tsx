import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Check,
  Plus,
  AlertTriangle,
  X,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Trash2,
} from 'lucide-react';
import { DoctorScheduleConfig, DoctorLeaveRange } from '../../types';

interface ScheduleLeavePageProps {
  scheduleConfig: DoctorScheduleConfig;
  onUpdateScheduleConfig: (newConfig: DoctorScheduleConfig) => void;
  leaveRanges: DoctorLeaveRange[];
  onAddLeaveRange: (range: DoctorLeaveRange) => void;
  onRemoveLeaveRange: (leaveId: string) => void;
  doctorName?: string;
  doctorSpecialty?: string;
  doctorId?: string;
}

const DAYS_OF_WEEK = [
  { day: 1, label: 'Mon', fullLabel: 'Monday' },
  { day: 2, label: 'Tue', fullLabel: 'Tuesday' },
  { day: 3, label: 'Wed', fullLabel: 'Wednesday' },
  { day: 4, label: 'Thu', fullLabel: 'Thursday' },
  { day: 5, label: 'Fri', fullLabel: 'Friday' },
  { day: 6, label: 'Sat', fullLabel: 'Saturday' },
  { day: 0, label: 'Sun', fullLabel: 'Sunday' },
];

const TIME_OPTIONS = [
  '07:30 AM',
  '08:00 AM',
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
];

export function ScheduleLeavePage({
  scheduleConfig,
  onUpdateScheduleConfig,
  leaveRanges,
  onAddLeaveRange,
  onRemoveLeaveRange,
  doctorName = 'Dr. Marcus Chen, MD',
  doctorSpecialty = 'Lead Internist & Health Director',
  doctorId,
}: ScheduleLeavePageProps) {
  // Local form state for weekly availability
  const [workingDays, setWorkingDays] = useState<number[]>(scheduleConfig.workingDays);
  const [startTime, setStartTime] = useState<string>(scheduleConfig.startTime);
  const [endTime, setEndTime] = useState<string>(scheduleConfig.endTime);
  const [lunchStart, setLunchStart] = useState<string>(scheduleConfig.lunchStart);
  const [lunchEnd, setLunchEnd] = useState<string>(scheduleConfig.lunchEnd);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Sync state whenever scheduleConfig updates (e.g. when switching active physician)
  React.useEffect(() => {
    setWorkingDays(scheduleConfig.workingDays);
    setStartTime(scheduleConfig.startTime);
    setEndTime(scheduleConfig.endTime);
    setLunchStart(scheduleConfig.lunchStart);
    setLunchEnd(scheduleConfig.lunchEnd);
  }, [scheduleConfig]);

  // Leave Modal State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveStartDate, setLeaveStartDate] = useState('2026-09-24');
  const [leaveEndDate, setLeaveEndDate] = useState('2026-09-26');
  const [leaveReason, setLeaveReason] = useState('Continuing Medical Education (CME) Conference');
  const [leaveError, setLeaveError] = useState<string | null>(null);

  // Calendar month state (September 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 0-indexed: 8 = September

  const toggleDay = (dayNum: number) => {
    if (workingDays.includes(dayNum)) {
      if (workingDays.length === 1) {
        return; // maintain at least one working day
      }
      setWorkingDays(workingDays.filter((d) => d !== dayNum));
    } else {
      setWorkingDays([...workingDays, dayNum].sort());
    }
  };

  const handleSaveWeeklySchedule = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateScheduleConfig({
      workingDays,
      startTime,
      endTime,
      lunchStart,
      lunchEnd,
      slotDurationMinutes: 30,
    });
    setSaveSuccessMsg('Weekly recurring clinical availability saved successfully!');
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Check if a specific ISO date string falls inside any leave range
  const isDateInLeaveRange = (dateIso: string): { onLeave: boolean; reason?: string } => {
    for (const range of leaveRanges) {
      if (dateIso >= range.startDateIso && dateIso <= range.endDateIso) {
        return { onLeave: true, reason: range.reason };
      }
    }
    return { onLeave: false };
  };

  const handleOpenLeaveModal = () => {
    setLeaveError(null);
    setIsLeaveModalOpen(true);
  };

  const handleConfirmLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveStartDate || !leaveEndDate) {
      setLeaveError('Please select both start and end dates.');
      return;
    }
    if (leaveStartDate > leaveEndDate) {
      setLeaveError('Start date cannot be after end date.');
      return;
    }

    const newRange: DoctorLeaveRange = {
      id: `leave-${Date.now()}`,
      startDateIso: leaveStartDate,
      endDateIso: leaveEndDate,
      reason: leaveReason,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddLeaveRange(newRange);
    setIsLeaveModalOpen(false);
    setSaveSuccessMsg(
      `Leave dates ${leaveStartDate} to ${leaveEndDate} marked. Any conflicting bookings cancelled.`
    );
    setTimeout(() => setSaveSuccessMsg(null), 5000);
  };

  // Generate calendar grid days for current month
  const getDaysInMonth = (year: number, month: number) => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDays = new Date(year, month + 1, 0).getDate();
    return { firstDayIndex, totalDays };
  };

  const { firstDayIndex, totalDays } = getDaysInMonth(currentYear, currentMonth);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Confirmation message */}
      {saveSuccessMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-lg text-sm font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#1a5f7a] tracking-tight">
              Schedule & Leave Planner
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1a5f7a]/10 text-[#1a5f7a]">
              {doctorName}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Configure your own recurring weekly clinic hours and schedule planned leaves with automatic conflict rejection.
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            Own Availability
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            Own Leave Days
          </span>
        </div>
      </div>

      {/* TWO PANEL GRID: Left Panel (Weekly Availability) & Right Panel (Monthly Calendar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT PANEL: Weekly Recurring Availability Configuration   */}
        {/* ========================================================= */}
        <div
          id="panel-weekly-availability"
          className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6"
        >
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-[#1a5f7a]/10 text-[#1a5f7a] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Weekly Recurring Hours</h2>
              <p className="text-xs text-slate-500">Set regular consultation days and daily shifts.</p>
            </div>
          </div>

          <form onSubmit={handleSaveWeeklySchedule} className="space-y-5">
            {/* Working Days Checkboxes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Clinical Days (Mon - Fri)
              </label>
              <div className="grid grid-cols-7 gap-1.5">
                {DAYS_OF_WEEK.map((item) => {
                  const isChecked = workingDays.includes(item.day);
                  return (
                    <button
                      key={item.day}
                      type="button"
                      id={`day-checkbox-${item.label.toLowerCase()}`}
                      onClick={() => toggleDay(item.day)}
                      title={item.fullLabel}
                      aria-pressed={isChecked}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isChecked
                          ? 'bg-[#1a5f7a] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isChecked ? 'bg-[#8bc34a]' : 'bg-transparent'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Active days: {workingDays.length} days / week. Patients can book appointments only on
                active days.
              </p>
            </div>

            {/* Time Dropdowns: Start Time & End Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="select-start-time"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Shift Start Time
                </label>
                <select
                  id="select-start-time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] shadow-2xs"
                >
                  {TIME_OPTIONS.slice(0, 6).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="select-end-time"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Shift End Time
                </label>
                <select
                  id="select-end-time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] shadow-2xs"
                >
                  {TIME_OPTIONS.slice(6).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Consultation Interval & Lunch Buffer */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-slate-500" /> Lunch & Break Window
                </span>
                <span className="text-slate-500">12:30 PM - 01:30 PM</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Appointment Slot Duration</span>
                <span className="font-bold text-[#1a5f7a] bg-white px-2 py-0.5 rounded border border-slate-200">
                  30 Minutes
                </span>
              </div>
            </div>

            {/* Save Recurring Availability Button */}
            <button
              type="submit"
              id="btn-save-recurring-availability"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1a5f7a] hover:bg-[#14495e] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Save Recurring Availability</span>
            </button>
          </form>
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANEL: Monthly Calendar Interface with + Mark Leave */}
        {/* ========================================================= */}
        <div
          id="panel-monthly-calendar"
          className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6"
        >
          {/* Calendar Header with prominent + Mark Leave Dates button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#1a5f7a]" />
                <span>
                  {monthNames[currentMonth]} {currentYear}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Monthly clinic view with planned leaves and doctor off-duty schedules.
              </p>
            </div>

            {/* Prominent Top Button: "+ Mark Leave Dates" */}
            <button
              type="button"
              id="btn-open-mark-leave-modal"
              onClick={handleOpenLeaveModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8bc34a] hover:bg-[#7cb342] text-slate-950 font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95 border border-[#7cb342]"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>+ Mark Leave Dates</span>
            </button>
          </div>

          {/* Month Switcher Controls */}
          <div className="flex items-center justify-between px-1 mb-3 text-xs text-slate-600">
            <button
              type="button"
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear((y) => y - 1);
                } else {
                  setCurrentMonth((m) => m - 1);
                }
              }}
              className="flex items-center gap-1 hover:text-[#1a5f7a] font-medium cursor-pointer p-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#1a5f7a]" />
                <span>Working Day</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                <span>Doctor Leave</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear((y) => y + 1);
                } else {
                  setCurrentMonth((m) => m + 1);
                }
              }}
              className="flex items-center gap-1 hover:text-[#1a5f7a] font-medium cursor-pointer p-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar Day-of-Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-[11px] font-bold text-slate-400 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid Days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-14 sm:h-16 rounded-xl bg-slate-50/50" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: totalDays }).map((_, i) => {
              const dayNumber = i + 1;
              const dateObj = new Date(currentYear, currentMonth, dayNumber);
              const dayOfWeek = dateObj.getDay();
              const isWorkingDay = workingDays.includes(dayOfWeek);

              const dateIso = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(
                dayNumber
              ).padStart(2, '0')}`;

              const leaveStatus = isDateInLeaveRange(dateIso);
              const isToday = dayNumber === 19 && currentMonth === 8 && currentYear === 2026;

              return (
                <div
                  key={dayNumber}
                  id={`cal-day-${dateIso}`}
                  className={`h-14 sm:h-16 p-1.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    leaveStatus.onLeave
                      ? 'bg-rose-50/90 border-rose-300 text-rose-900 shadow-2xs'
                      : isWorkingDay
                      ? 'bg-white border-slate-200/90 text-slate-800 hover:border-[#1a5f7a]'
                      : 'bg-slate-50/80 border-slate-200/50 text-slate-400'
                  } ${isToday ? 'ring-2 ring-[#8bc34a]' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold leading-none ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-[#1a5f7a] text-white flex items-center justify-center text-[10px]'
                          : ''
                      }`}
                    >
                      {dayNumber}
                    </span>
                    {leaveStatus.onLeave && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    )}
                  </div>

                  <div className="text-[10px] leading-tight truncate">
                    {leaveStatus.onLeave ? (
                      <span className="font-bold text-rose-700 bg-rose-100 px-1 py-0.5 rounded text-[9px]">
                        On Leave
                      </span>
                    ) : isWorkingDay ? (
                      <span className="text-[#1a5f7a] font-medium hidden sm:inline">Active</span>
                    ) : (
                      <span className="text-slate-400">Off</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Leave Ranges List */}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
              <CalendarRange className="w-3.5 h-3.5 text-[#1a5f7a]" />
              <span>Current Scheduled Leave Windows</span>
            </h3>

            {leaveRanges.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No upcoming leave scheduled.</p>
            ) : (
              <div className="space-y-2">
                {leaveRanges.map((range) => (
                  <div
                    key={range.id}
                    className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-rose-900">
                        {range.startDateIso} to {range.endDateIso}
                      </div>
                      <p className="text-rose-700 text-[11px]">{range.reason}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveLeaveRange(range.id)}
                      className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                      title="Remove leave"
                      aria-label="Remove leave"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: + Mark Leave Dates with Date-Range Picker & Notice */}
      {/* ========================================================= */}
      {isLeaveModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-leave-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#1a5f7a] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CalendarRange className="w-5 h-5 text-[#8bc34a]" />
                <h3 id="modal-leave-title" className="font-bold text-lg">
                  Mark Doctor Leave Dates
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLeaveModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmLeave} className="p-6 space-y-4">
              {/* MANDATORY WARNING NOTICE TEXT INSIDE THE MODAL */}
              <div
                id="leave-modal-warning-notice"
                className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs sm:text-sm flex items-start gap-3 shadow-2xs"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-bold block text-amber-900">
                    Appointment Conflict Warning:
                  </strong>
                  <p className="text-amber-900 leading-relaxed font-medium">
                    Saving leave dates will automatically cancel conflicting appointments and email
                    affected patients.
                  </p>
                </div>
              </div>

              {leaveError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{leaveError}</span>
                </div>
              )}

              {/* Date-Range Picker Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="input-leave-start"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    Start Date
                  </label>
                  <input
                    id="input-leave-start"
                    type="date"
                    value={leaveStartDate}
                    min="2026-09-19"
                    onChange={(e) => setLeaveStartDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a5f7a]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="input-leave-end"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    End Date
                  </label>
                  <input
                    id="input-leave-end"
                    type="date"
                    value={leaveEndDate}
                    min={leaveStartDate || '2026-09-19'}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a5f7a]"
                  />
                </div>
              </div>

              {/* Leave Reason Selector */}
              <div>
                <label
                  htmlFor="select-leave-reason"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Clinical Leave Reason
                </label>
                <select
                  id="select-leave-reason"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a5f7a]"
                >
                  <option value="Continuing Medical Education (CME) Conference">
                    Continuing Medical Education (CME) Conference
                  </option>
                  <option value="Annual Personal Vacation / Medical Rest">
                    Annual Personal Vacation / Medical Rest
                  </option>
                  <option value="American College of Physicians Scientific Session">
                    American College of Physicians Scientific Session
                  </option>
                  <option value="Family Medical Emergency">Family Medical Emergency</option>
                </select>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  id="btn-confirm-save-leave"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Apply Leave</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
