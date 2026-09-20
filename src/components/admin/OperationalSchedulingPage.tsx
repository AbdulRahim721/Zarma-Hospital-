import React, { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Building,
  Info,
  X,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Layers,
  Sparkles,
} from 'lucide-react';
import { OperationalDoctorColumn, GridSlotCell, SlotState } from '../../types';
import { TIME_SLOTS_30MIN } from '../../data/adminMockData';

interface OperationalSchedulingPageProps {
  doctors: OperationalDoctorColumn[];
  slots: GridSlotCell[];
  onToggleSlotState?: (doctorId: string, timeSlot: string, nextState: SlotState) => void;
}

export function OperationalSchedulingPage({
  doctors,
  slots,
  onToggleSlotState,
}: OperationalSchedulingPageProps) {
  const [selectedDate, setSelectedDate] = useState('Saturday, Sep 19, 2026');
  const [inspectedSlot, setInspectedSlot] = useState<{
    doctor: OperationalDoctorColumn;
    timeSlot: string;
    slotData?: GridSlotCell;
  } | null>(null);

  // Helper to find slot cell
  const getSlot = (doctorId: string, timeSlot: string): GridSlotCell => {
    const found = slots.find((s) => s.doctorId === doctorId && s.timeSlot === timeSlot);
    if (found) return found;
    return {
      doctorId,
      timeSlot,
      state: 'free',
      durationMinutes: 30,
    };
  };

  // Compute daily metrics across all doctors and slots
  const totalCells = doctors.length * TIME_SLOTS_30MIN.length;
  let confirmedCount = 0;
  let pendingCount = 0;
  let leaveCount = 0;
  let freeCount = 0;

  doctors.forEach((doc) => {
    TIME_SLOTS_30MIN.forEach((time) => {
      const s = getSlot(doc.id, time);
      if (doc.isOnLeaveToday || s.state === 'leave') {
        leaveCount++;
      } else if (s.state === 'confirmed') {
        confirmedCount++;
      } else if (s.state === 'pending') {
        pendingCount++;
      } else {
        freeCount++;
      }
    });
  });

  const activeCapacityRatio = Math.round(
    ((confirmedCount + pendingCount) / (totalCells - leaveCount)) * 100
  );

  return (
    <div className="space-y-6">
      {/* Enterprise Operational Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Global Operational Scheduling Overview
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#1a5f7a]/10 text-[#1a5f7a] border border-[#1a5f7a]/20">
              Gantt View
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Master clinic capacity grid across all provider suites. Inspect real-time booking loads
            and slot availability at 30-minute intervals.
          </p>
        </div>

        {/* Date Selector Controls */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
            <Calendar className="w-4 h-4 text-[#1a5f7a]" />
            <span>{selectedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSelectedDate('Friday, Sep 18, 2026')}
              className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate('Saturday, Sep 19, 2026')}
              className="px-2.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate('Sunday, Sep 20, 2026')}
              className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* COLOR CODE LEGEND & CAPACITY SUMMARY BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Global Color Codes Required by User */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
            Slot Status Legend:
          </span>

          {/* 1. Free Space (White) */}
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-sm bg-white border-2 border-slate-300 shadow-2xs" />
            <span className="text-slate-600 font-medium">
              Free Space <span className="text-slate-400">({freeCount})</span>
            </span>
          </div>

          {/* 2. Pending Requests (Hatched Yellow) */}
          <div className="flex items-center gap-1.5">
            <span
              className="w-5 h-5 rounded-sm border border-amber-400 shadow-2xs"
              style={{
                background:
                  'repeating-linear-gradient(45deg, #fef08a, #fef08a 4px, #fde047 4px, #fde047 8px)',
              }}
            />
            <span className="text-amber-900 font-bold">
              Pending Requests <span className="text-amber-700">({pendingCount})</span>
            </span>
          </div>

          {/* 3. Confirmed Bookings (Solid Blue) */}
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-sm bg-[#1a5f7a] border border-[#134b61] shadow-2xs" />
            <span className="text-[#1a5f7a] font-bold">
              Confirmed Bookings <span className="text-slate-500">({confirmedCount})</span>
            </span>
          </div>

          {/* 4. Leave Days (Greyed Out Diagonal Pattern) */}
          <div className="flex items-center gap-1.5">
            <span
              className="w-5 h-5 rounded-sm border border-slate-400 shadow-2xs"
              style={{
                background:
                  'repeating-linear-gradient(45deg, #e2e8f0, #e2e8f0 4px, #cbd5e1 4px, #cbd5e1 8px)',
              }}
            />
            <span className="text-slate-600 font-medium">
              Leave Days <span className="text-slate-400">({leaveCount})</span>
            </span>
          </div>
        </div>

        {/* Aggregate Clinic Utilization Progress */}
        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-800">
              {activeCapacityRatio}% Booked Capacity
            </div>
            <div className="text-[10px] text-slate-500">
              {confirmedCount + pendingCount} active / {totalCells - leaveCount} operable slots
            </div>
          </div>
          <div className="w-20 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
            <div
              className="bg-[#1a5f7a] h-full rounded-full transition-all"
              style={{ width: `${Math.min(activeCapacityRatio, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* MASTER GRID / GANTT TIMELINE LAYOUT */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs table-fixed min-w-[780px]">
            {/* Top Horizontal Header Axis: Active Doctors Side-by-Side */}
            <thead>
              <tr className="bg-slate-900 text-white border-b border-slate-800">
                {/* Left Top Blank/Time Header Axis */}
                <th className="w-28 py-3.5 px-3 text-left font-bold text-[11px] text-slate-400 uppercase tracking-wider bg-slate-950 border-r border-slate-800">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>Time Block</span>
                  </div>
                </th>

                {/* Doctor Column Headers */}
                {doctors.map((doc) => (
                  <th
                    key={doc.id}
                    className="py-3 px-3 text-center border-r border-slate-800 last:border-r-0"
                  >
                    <div className="font-bold text-white text-xs truncate">{doc.name}</div>
                    <div className="text-[10px] text-sky-300/80 truncate font-normal">
                      {doc.specialty}
                    </div>
                    <div className="mt-1 flex items-center justify-center gap-1.5 text-[9px]">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {doc.room}
                      </span>
                      {doc.isOnLeaveToday ? (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                          On Leave
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                          Active
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Vertical Time Blocks (30-Minute Increments) */}
            <tbody className="divide-y divide-slate-200">
              {TIME_SLOTS_30MIN.map((timeSlot, timeIdx) => {
                const isLunchBreak = timeSlot === '12:30 PM';
                return (
                  <tr
                    key={timeSlot}
                    className={`transition-colors ${
                      isLunchBreak ? 'bg-slate-50/75' : 'hover:bg-slate-50/30'
                    }`}
                  >
                    {/* Left Vertical Axis: 30-Minute Increment Label */}
                    <td className="py-2 px-3 font-mono font-bold text-slate-700 text-[11px] bg-slate-50 border-r border-slate-200 whitespace-nowrap">
                      <div className="flex items-center justify-between">
                        <span>{timeSlot}</span>
                        {isLunchBreak && (
                          <span className="text-[9px] px-1 rounded bg-slate-200 text-slate-600 font-sans font-medium">
                            Lunch
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Matrix Cells per Doctor */}
                    {doctors.map((doc) => {
                      const slot = getSlot(doc.id, timeSlot);
                      const isLeave = doc.isOnLeaveToday || slot.state === 'leave';
                      const isPending = !isLeave && slot.state === 'pending';
                      const isConfirmed = !isLeave && slot.state === 'confirmed';
                      const isFree = !isLeave && !isPending && !isConfirmed;

                      return (
                        <td
                          key={`${doc.id}-${timeSlot}`}
                          onClick={() =>
                            setInspectedSlot({
                              doctor: doc,
                              timeSlot,
                              slotData: slot,
                            })
                          }
                          className="p-1 border-r border-slate-200 last:border-r-0 cursor-pointer h-12 align-middle transition-transform hover:scale-[1.01]"
                        >
                          {/* 1. Leave Day Cell (Greyed Out Diagonal Pattern) */}
                          {isLeave && (
                            <div
                              className="w-full h-10 rounded-md flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-300 p-1 shadow-2xs select-none"
                              style={{
                                background:
                                  'repeating-linear-gradient(45deg, #f1f5f9, #f1f5f9 6px, #cbd5e1 6px, #cbd5e1 12px)',
                              }}
                              title="Provider is on approved clinical leave"
                            >
                              <span className="bg-white/85 px-1.5 py-0.5 rounded text-[9px] text-slate-700 shadow-2xs font-semibold">
                                Approved Leave
                              </span>
                            </div>
                          )}

                          {/* 2. Pending Request Cell (Hatched Yellow Pattern) */}
                          {isPending && (
                            <div
                              className="w-full h-10 rounded-md flex flex-col justify-center px-2 text-[10px] font-bold text-amber-950 border border-amber-400 shadow-2xs"
                              style={{
                                background:
                                  'repeating-linear-gradient(45deg, #fef9c3, #fef9c3 6px, #fde047 6px, #fde047 12px)',
                              }}
                              title="Pending patient request awaiting physician confirmation"
                            >
                              <div className="flex items-center justify-between">
                                <span className="bg-amber-900 text-white text-[9px] px-1 py-0.2 rounded font-black tracking-wide">
                                  PENDING
                                </span>
                                <span className="text-[9px] text-amber-900 font-mono">
                                  {slot.bookingRef || 'REQ-400'}
                                </span>
                              </div>
                              <span className="text-[9px] text-amber-900/90 truncate mt-0.5">
                                Awaiting approval
                              </span>
                            </div>
                          )}

                          {/* 3. Confirmed Booking Cell (Solid Blue) */}
                          {isConfirmed && (
                            <div
                              className="w-full h-10 rounded-md bg-[#1a5f7a] text-white flex flex-col justify-center px-2 text-[10px] font-bold border border-[#134b61] shadow-2xs hover:bg-[#154e64] transition-colors"
                              title="Confirmed Patient Consultation"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sky-200 text-[9px] font-mono tracking-wide">
                                  {slot.bookingRef || 'HC-CONF'}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              </div>
                              <div className="flex items-center justify-between text-[9px] text-white/90">
                                <span>Booked (30m)</span>
                                <span className="text-sky-300 font-mono">{doc.room.split(' - ')[0]}</span>
                              </div>
                            </div>
                          )}

                          {/* 4. Free Space Cell (White) */}
                          {isFree && (
                            <div
                              className="w-full h-10 rounded-md bg-white hover:bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 group hover:border-slate-400 transition-colors"
                              title="Available clinical slot - Click to inspect or reserve"
                            >
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-slate-500">
                                + Available
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* OPERATIONAL SLOT INSPECTOR MODAL (Strictly managerial metadata — Zero PHI) */}
      {inspectedSlot && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1a5f7a]/10 text-[#1a5f7a] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Operational Slot Inspector</h3>
                  <p className="text-[11px] text-slate-500">
                    Suite allocation & capacity management
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectedSlot(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Managerial Data Cards */}
            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Physician</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {inspectedSlot.doctor.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {inspectedSlot.doctor.specialty}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Time Interval
                  </span>
                  <div className="font-bold text-slate-900 mt-0.5 font-mono">
                    {inspectedSlot.timeSlot}
                  </div>
                  <div className="text-[11px] text-slate-500">30-Minute Standard Block</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Suite / Location
                  </span>
                  <div className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" />
                    <span>{inspectedSlot.doctor.room}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Current Status
                  </span>
                  <div className="mt-0.5">
                    {inspectedSlot.doctor.isOnLeaveToday ||
                    inspectedSlot.slotData?.state === 'leave' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                        Leave Day
                      </span>
                    ) : inspectedSlot.slotData?.state === 'confirmed' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-[#1a5f7a]">
                        Confirmed Booking
                      </span>
                    ) : inspectedSlot.slotData?.state === 'pending' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                        Pending Request
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Free Space
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Strict HIPAA Warning in Inspector */}
              <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 text-[11px] text-[#1a5f7a] flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Managerial Scope:</strong> Individual patient names, symptoms, and chart
                  records are restricted to clinical practitioners. Reference ID:{' '}
                  <code className="font-mono bg-white px-1 py-0.5 rounded border border-sky-200">
                    {inspectedSlot.slotData?.bookingRef || 'HC-SLOT-GEN'}
                  </code>
                </span>
              </div>
            </div>

            {/* Quick State Toggle Actions */}
            {onToggleSlotState && !inspectedSlot.doctor.isOnLeaveToday && (
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500">Quick Slot Override:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleSlotState(
                        inspectedSlot.doctor.id,
                        inspectedSlot.timeSlot,
                        'free'
                      );
                      setInspectedSlot(null);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    Set Free
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onToggleSlotState(
                        inspectedSlot.doctor.id,
                        inspectedSlot.timeSlot,
                        'confirmed'
                      );
                      setInspectedSlot(null);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#1a5f7a] hover:bg-[#14495e] text-white transition-colors cursor-pointer"
                  >
                    Confirm Slot
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
