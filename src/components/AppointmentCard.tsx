import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Stethoscope, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { Appointment } from '../types';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancelRequest: (appointment: Appointment) => void;
  onRescheduleRequest: (appointment: Appointment) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancelRequest,
  onRescheduleRequest,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Determine if the appointment is less than 2 hours away
  const calculateIsLessThanTwoHours = (isoTime: string): { isLessThan2Hrs: boolean; diffMinutes: number } => {
    try {
      const scheduledTime = new Date(isoTime).getTime();
      const now = Date.now();
      const diffMs = scheduledTime - now;
      const diffMinutes = Math.round(diffMs / (1000 * 60));
      // If diff is less than 120 minutes (2 hours)
      return {
        isLessThan2Hrs: diffMinutes <= 120,
        diffMinutes,
      };
    } catch {
      return { isLessThan2Hrs: false, diffMinutes: 999 };
    }
  };

  const { isLessThan2Hrs, diffMinutes } = calculateIsLessThanTwoHours(appointment.scheduledTimeIso);

  // Status Badge Styling:
  // Yellow/Amber pill for "Pending Approval" and solid Green pill for "Confirmed"
  const isConfirmed = appointment.status === 'Confirmed';

  return (
    <div
      id={`appointment-card-${appointment.id}`}
      className="relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex flex-col justify-between"
    >
      {/* Card Header: Doctor info & Status Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#1a5f7a]/10 text-[#1a5f7a] flex items-center justify-center shrink-0 border border-[#1a5f7a]/15">
              <Stethoscope className="w-5 h-5 text-[#1a5f7a]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {appointment.doctorName}
              </h3>
              <p className="text-xs font-semibold text-[#1a5f7a]">
                {appointment.specialty}
              </p>
            </div>
          </div>

          {/* Color-coded Status Badge */}
          <div>
            {isConfirmed ? (
              <span
                id={`status-badge-${appointment.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: '#2e7d32' }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmed</span>
              </span>
            ) : (
              <span
                id={`status-badge-${appointment.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Pending Approval</span>
              </span>
            )}
          </div>
        </div>

        {/* Date & 30-Minute Time Slot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-3 px-3.5 rounded-xl bg-slate-50/90 border border-slate-100 mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <Calendar className="w-4 h-4 text-[#1a5f7a] shrink-0" />
            <span className="font-semibold text-slate-900">{appointment.date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <Clock className="w-4 h-4 text-[#8bc34a] shrink-0" />
            <span className="font-semibold text-slate-900">{appointment.timeSlot}</span>
          </div>
        </div>

        {/* Reason / Department */}
        {appointment.reason && (
          <div className="text-xs text-slate-500 mb-2 flex items-start gap-1.5">
            <span className="font-medium text-slate-700 shrink-0">Purpose:</span>
            <span className="italic">{appointment.reason}</span>
          </div>
        )}

        {appointment.location && (
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-4">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{appointment.location}</span>
          </div>
        )}
      </div>

      {/* Card Footer: UX Cancellation & Reschedule Rules */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Urgent/Upcoming notice indicator if within 2 hours */}
        {isLessThan2Hrs && (
          <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/80 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
            <span>
              {diffMinutes > 0 ? `Starts in ~${diffMinutes} mins` : 'Imminent appointment'}
            </span>
          </span>
        )}

        <div className="ml-auto flex items-center gap-3">
          {isLessThan2Hrs ? (
            // Disabled State with Tooltip for both Reschedule & Cancel
            <div
              className="relative inline-flex items-center gap-2"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
            >
              <button
                type="button"
                id={`btn-reschedule-disabled-${appointment.id}`}
                disabled
                aria-disabled="true"
                className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg cursor-not-allowed opacity-70 select-none"
              >
                Reschedule
              </button>

              <button
                type="button"
                id={`btn-cancel-disabled-${appointment.id}`}
                disabled
                aria-disabled="true"
                aria-describedby={`tooltip-cancel-${appointment.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg cursor-not-allowed opacity-70 select-none"
              >
                <span>Cancel</span>
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Tooltip */}
              {showTooltip && (
                <div
                  id={`tooltip-cancel-${appointment.id}`}
                  role="tooltip"
                  className="absolute bottom-full right-0 mb-2 w-64 p-2.5 bg-slate-900 text-white text-xs rounded-xl shadow-xl z-30 pointer-events-none transition-opacity duration-150 leading-snug"
                >
                  <div className="font-semibold text-amber-400 flex items-center gap-1 mb-0.5">
                    <AlertCircle className="w-3 h-3 text-amber-400" /> Policy Restriction
                  </div>
                  Cancellations and rescheduling must be made at least 2 hours before the appointment start.
                  <div className="absolute top-full right-6 -mt-1 border-4 border-transparent border-t-slate-900" />
                </div>
              )}
            </div>
          ) : (
            // Active States: Reschedule and Cancel buttons
            <div className="flex items-center gap-2">
              <button
                type="button"
                id={`btn-reschedule-active-${appointment.id}`}
                onClick={() => onRescheduleRequest(appointment)}
                className="text-xs font-bold text-[#1a5f7a] hover:bg-[#1a5f7a]/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-[#1a5f7a]/20"
              >
                Reschedule
              </button>
              <button
                type="button"
                id={`btn-cancel-active-${appointment.id}`}
                onClick={() => onCancelRequest(appointment)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline px-2 py-1 rounded transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
