import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, Calendar, Clock, User, ShieldAlert } from 'lucide-react';
import { Appointment } from '../types';

interface CancellationModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onConfirmCancel: (appointmentId: string, reason?: string) => void;
}

export const CancellationModal: React.FC<CancellationModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onConfirmCancel,
}) => {
  const [selectedReason, setSelectedReason] = useState('Schedule Conflict');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !appointment) return null;

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmCancel(appointment.id, selectedReason);
      onClose();
    }, 500);
  };

  return (
    <AnimatePresence>
      <div
        id="cancellation-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Top Banner Alert */}
          <div className="bg-amber-50 border-b border-amber-100 p-4 flex items-start justify-between">
            <div className="flex items-center gap-2.5 text-amber-800">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Cancel Appointment</h3>
                <p className="text-xs text-amber-800">
                  Are you sure you want to release this reserved clinical time slot?
                </p>
              </div>
            </div>
            <button
              id="btn-close-cancel-modal"
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-white/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Appointment Details Summary Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <User className="w-4 h-4 text-[#1a5f7a]" />
                <span>{appointment.doctorName}</span>
                <span className="text-xs font-normal text-slate-500">
                  ({appointment.specialty})
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#1a5f7a]" />
                  {appointment.date}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#8bc34a]" />
                  {appointment.timeSlot}
                </span>
              </div>
              {appointment.location && (
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  Location: {appointment.location}
                </div>
              )}
            </div>

            {/* Cancellation Reason Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Please indicate the reason for cancellation (optional):
              </label>
              <select
                id="cancel-reason-select"
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a5f7a]"
              >
                <option value="Schedule Conflict">Schedule Conflict</option>
                <option value="Symptoms Resolved / Feeling Better">Symptoms Resolved / Feeling Better</option>
                <option value="Need to Reschedule with Different Provider">Need to Reschedule with Different Provider</option>
                <option value="Transportation / Travel Issues">Transportation / Travel Issues</option>
                <option value="Other Personal Reasons">Other Personal Reasons</option>
              </select>
            </div>

            {/* Clinic Policy Warning */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Cancellations made more than 2 hours in advance incur no penalty. If you require urgent care today, please call hospital triage directly at <strong>03295992635</strong>.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                id="btn-abort-cancel"
                onClick={onClose}
                className="py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                id="btn-confirm-cancel"
                disabled={isProcessing}
                onClick={handleConfirm}
                className="py-2.5 px-5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
