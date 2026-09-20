import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Lock,
  X,
  Eye,
  Trash2,
  Ban,
  ChevronDown,
} from 'lucide-react';
import { DoctorAppointment, StaffDoctorStat, AppointmentStatus } from '../../types';

interface AppointmentsManagerPageProps {
  appointments: DoctorAppointment[];
  onCancelAppointment: (appointmentId: string, cancelReason?: string) => void;
  doctors: StaffDoctorStat[];
}

export function AppointmentsManagerPage({
  appointments,
  onCancelAppointment,
  doctors,
}: AppointmentsManagerPageProps) {
  // Filtering & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState<'All' | 'Today' | 'Upcoming' | 'Past'>('All');

  // Cancel Modal State
  const [appointmentToCancel, setAppointmentToCancel] = useState<DoctorAppointment | null>(null);
  const [cancelReason, setCancelReason] = useState('Patient requested cancellation');
  const [customReasonText, setCustomReasonText] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Inspect Modal State
  const [inspectAppointment, setInspectAppointment] = useState<DoctorAppointment | null>(null);

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Appointment totals computation
  const totalAppointments = appointments.length;
  const totalConfirmed = appointments.filter((a) => a.status === 'Confirmed').length;
  const totalPending = appointments.filter((a) => a.status === 'Pending Approval').length;
  const totalCompleted = appointments.filter((a) => a.status === 'Completed').length;
  const totalCancelled = appointments.filter((a) => a.status === 'Rejected').length;
  const totalNoShow = appointments.filter((a) => a.status === 'No-Show').length;

  // Filter logic
  const filteredAppointments = appointments.filter((apt) => {
    // Search query
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchLower) ||
      apt.patientEmail.toLowerCase().includes(searchLower) ||
      apt.id.toLowerCase().includes(searchLower) ||
      apt.reason.toLowerCase().includes(searchLower) ||
      (apt.doctorName && apt.doctorName.toLowerCase().includes(searchLower));

    // Doctor filter
    const matchesDoctor =
      selectedDoctorId === 'All' ? true : apt.doctorId === selectedDoctorId;

    // Status filter
    const matchesStatus =
      selectedStatus === 'All' ? true : apt.status === selectedStatus;

    // Date filter
    let matchesDate = true;
    const todayIso = '2026-09-19';
    if (selectedDateFilter === 'Today') {
      matchesDate = apt.dateIso === todayIso;
    } else if (selectedDateFilter === 'Upcoming') {
      matchesDate = apt.dateIso >= todayIso;
    } else if (selectedDateFilter === 'Past') {
      matchesDate = apt.dateIso < todayIso;
    }

    return matchesSearch && matchesDoctor && matchesStatus && matchesDate;
  });

  const handleOpenCancelModal = (apt: DoctorAppointment) => {
    setAppointmentToCancel(apt);
    setCancelReason('Patient requested cancellation');
    setCustomReasonText('');
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (!appointmentToCancel) return;
    const finalReason =
      cancelReason === 'Other'
        ? customReasonText || 'Administrative cancellation'
        : cancelReason;

    onCancelAppointment(appointmentToCancel.id, finalReason);
    setShowCancelModal(false);
    showToast(`Appointment ${appointmentToCancel.id} for ${appointmentToCancel.patientName} was cancelled.`);
    setAppointmentToCancel(null);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Confirmed
          </span>
        );
      case 'Pending Approval':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending Approval
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
            <CheckCircle2 className="w-3 h-3 text-sky-600" />
            Completed
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Cancelled
          </span>
        );
      case 'No-Show':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <AlertTriangle className="w-3 h-3 text-slate-500" />
            No-Show
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-sm animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              All Clinic Appointments Manager
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1a5f7a]/10 text-[#1a5f7a] border border-[#1a5f7a]/20">
              Admin Scope
            </span>
          </div>
          <p className="text-xs text-slate-500">
            View, filter, and cancel any scheduled appointment across all clinic physicians and suites.
          </p>
        </div>

        {/* Manager Privacy Notice */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 shrink-0">
          <Lock className="w-3.5 h-3.5 text-[#1a5f7a]" />
          <span>Clinical visit notes protected from admin view</span>
        </div>
      </div>

      {/* Appointments Totals Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Bookings</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalAppointments}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Across all doctors</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 border-l-4 border-l-emerald-500 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Confirmed</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{totalConfirmed}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Active on schedule</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 border-l-4 border-l-amber-500 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Pending Review</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{totalPending}</div>
          <div className="text-[10px] text-amber-600 mt-0.5">Awaiting provider</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 border-l-4 border-l-sky-500 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-sky-700">Completed</div>
          <div className="text-2xl font-extrabold text-sky-700 mt-1">{totalCompleted}</div>
          <div className="text-[10px] text-sky-600 mt-0.5">Conducted today</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 border-l-4 border-l-rose-500 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Cancelled</div>
          <div className="text-2xl font-extrabold text-rose-700 mt-1">{totalCancelled}</div>
          <div className="text-[10px] text-rose-600 mt-0.5">By patient/admin</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 border-l-4 border-l-slate-400 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">No-Shows</div>
          <div className="text-2xl font-extrabold text-slate-700 mt-1">{totalNoShow}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Patient absent</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="admin-search-appointments"
              placeholder="Search by patient, doctor, ID, or medical reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] focus:bg-white transition-all"
            />
          </div>

          {/* Doctor Filter */}
          <div>
            <select
              id="admin-filter-doctor"
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] cursor-pointer"
            >
              <option value="All">All Attending Physicians</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty.split('&')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              id="admin-filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Cancelled</option>
              <option value="No-Show">No-Show</option>
            </select>
          </div>
        </div>

        {/* Date Scope Pills & Result Count */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium mr-1 text-[11px]">Date Filter:</span>
            {(['All', 'Today', 'Upcoming', 'Past'] as const).map((df) => (
              <button
                key={df}
                type="button"
                onClick={() => setSelectedDateFilter(df)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  selectedDateFilter === df
                    ? 'bg-[#1a5f7a] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {df === 'Today' ? 'Today (Sep 19)' : df}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredAppointments.length}</strong> of{' '}
            {appointments.length} appointments
          </div>
        </div>
      </div>

      {/* Appointments Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Ref & Time</th>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Attending Doctor</th>
                <th className="py-3.5 px-4">Reason / Complaint</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No appointments found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try clearing filters or search terms.</p>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => {
                  const canCancel =
                    apt.status === 'Confirmed' || apt.status === 'Pending Approval';

                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/75 transition-colors">
                      {/* Ref & Time */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 font-mono text-xs">{apt.id}</div>
                        <div className="text-[11px] text-[#1a5f7a] font-semibold flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-[#1a5f7a]" />
                          <span>{apt.timeSlot}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{apt.date}</div>
                      </td>

                      {/* Patient Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-xs">{apt.patientName}</div>
                        <div className="text-[10px] text-slate-500">{apt.patientPhone}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                          {apt.patientEmail}
                        </div>
                      </td>

                      {/* Attending Doctor */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                          <Stethoscope className="w-3.5 h-3.5 text-[#1a5f7a]" />
                          <span>{apt.doctorName || 'Dr. Marcus Chen, MD'}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{apt.room || 'Clinic Suite'}</div>
                      </td>

                      {/* Reason */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="text-slate-800 text-xs line-clamp-2 leading-relaxed">
                          {apt.reason}
                        </div>
                        {apt.vitalSummary && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {apt.vitalSummary}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">{getStatusBadge(apt.status)}</td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            type="button"
                            onClick={() => setInspectAppointment(apt)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Inspect administrative details"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Details</span>
                          </button>

                          {/* Cancel button */}
                          {canCancel ? (
                            <button
                              type="button"
                              onClick={() => handleOpenCancelModal(apt)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Cancel this appointment"
                            >
                              <Ban className="w-3 h-3" />
                              <span>Cancel</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic px-2">Archived</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CANCEL APPOINTMENT MODAL */}
      {showCancelModal && appointmentToCancel && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150 text-slate-800">
            <button
              type="button"
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Cancel Appointment
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              As Clinic Manager, you have managerial authority to cancel this booking.
            </p>

            {/* Target appointment summary */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-800">{appointmentToCancel.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Physician:</span>
                <span className="font-semibold text-slate-800">{appointmentToCancel.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-mono text-slate-800">{appointmentToCancel.date} • {appointmentToCancel.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reason:</span>
                <span className="text-slate-700 truncate max-w-[200px]">{appointmentToCancel.reason}</span>
              </div>
            </div>

            {/* Reason selector */}
            <div className="mb-4">
              <label htmlFor="cancel-reason-select" className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Administrative Cancellation:
              </label>
              <select
                id="cancel-reason-select"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs rounded-xl bg-white border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
              >
                <option value="Patient requested cancellation">Patient requested cancellation</option>
                <option value="Physician on emergency / administrative leave">Physician on emergency / administrative leave</option>
                <option value="Clinic scheduling conflict">Clinic scheduling conflict</option>
                <option value="Patient duplicate booking">Patient duplicate booking</option>
                <option value="Billing / Insurance eligibility issue">Billing / Insurance eligibility issue</option>
                <option value="Other">Other administrative reason</option>
              </select>

              {cancelReason === 'Other' && (
                <input
                  type="text"
                  placeholder="Specify cancellation reason..."
                  value={customReasonText}
                  onChange={(e) => setCustomReasonText(e.target.value)}
                  className="mt-2 w-full text-xs rounded-xl bg-slate-50 border border-slate-300 p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT APPOINTMENT DETAILS MODAL */}
      {inspectAppointment && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150 text-slate-800">
            <button
              type="button"
              onClick={() => setInspectAppointment(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-[#1a5f7a]/10 text-[#1a5f7a]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Appointment Record: {inspectAppointment.id}
                </h2>
                <div className="text-xs text-slate-500">{inspectAppointment.date} • {inspectAppointment.timeSlot}</div>
              </div>
            </div>

            {/* Logistics info */}
            <div className="space-y-3 text-xs mb-5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <div className="text-slate-400 font-semibold text-[10px]">PATIENT</div>
                  <div className="font-bold text-slate-800 mt-0.5">{inspectAppointment.patientName}</div>
                  <div className="text-slate-500">{inspectAppointment.patientPhone}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold text-[10px]">ATTENDING PHYSICIAN</div>
                  <div className="font-bold text-slate-800 mt-0.5">{inspectAppointment.doctorName}</div>
                  <div className="text-slate-500">{inspectAppointment.room}</div>
                </div>
              </div>

              <div>
                <div className="text-slate-500 font-semibold text-[11px] mb-1">Chief Complaint / Booking Reason:</div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed">
                  {inspectAppointment.reason}
                </div>
              </div>

              {/* STRICT CLINICAL PRIVACY NOTICE: Admin Cannot Read Visit Notes */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900">
                <div className="flex items-center gap-2 font-bold text-xs mb-1">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Clinical Visit Notes: Access Restricted</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed mb-2">
                  Under clinic privacy policies (HIPAA § 164.512), administrative staff are strictly prohibited from reading clinical consultation notes, psychiatric evaluations, and physician diagnostic remarks.
                </p>
                <div className="p-2 rounded-lg bg-amber-100/70 border border-amber-300/60 font-mono text-[11px] text-amber-900 text-center select-none">
                  🔒 [Protected Clinical Charting — Admin Cannot Read]
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setInspectAppointment(null)}
              className="w-full py-2 rounded-xl bg-[#1a5f7a] text-white font-bold text-xs shadow-xs hover:bg-[#14495e] transition-colors cursor-pointer"
            >
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
