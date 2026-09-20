import React, { useState } from 'react';
import {
  Users,
  Clock,
  UserCheck,
  AlertOctagon,
  ShieldCheck,
  Lock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowUpRight,
  TrendingDown,
  Building,
} from 'lucide-react';
import { StaffDoctorStat } from '../../types';

interface MasterAnalyticsPageProps {
  doctorStats: StaffDoctorStat[];
  onUpdateDoctorStatus?: (doctorId: string, status: 'On-Duty' | 'On-Leave' | 'Off-Shift') => void;
  onIncrementCounter?: (doctorId: string, counterKey: 'confirmedCount' | 'completedCount') => void;
}

export function MasterAnalyticsPage({
  doctorStats,
  onUpdateDoctorStatus,
}: MasterAnalyticsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'On-Duty' | 'On-Leave'>('All');

  // Compute clinic-wide aggregate operational metrics
  const totalVisitsToday = doctorStats.reduce(
    (acc, doc) => acc + doc.confirmedCount + doc.completedCount,
    0
  );
  const totalPendingApprovals = doctorStats.reduce((acc, doc) => acc + doc.pendingCount, 0);
  const activeOnDutyDoctors = doctorStats.filter((doc) => doc.status === 'On-Duty').length;
  const totalDoctors = doctorStats.length;

  const totalCompleted = doctorStats.reduce((acc, doc) => acc + doc.completedCount, 0);
  const totalNoShows = doctorStats.reduce((acc, doc) => acc + doc.noShowCount, 0);
  const totalBooked = doctorStats.reduce(
    (acc, doc) => acc + doc.confirmedCount + doc.completedCount + doc.noShowCount,
    0
  );

  const noShowRate =
    totalBooked > 0 ? ((totalNoShows / totalBooked) * 100).toFixed(1) : '0.0';

  // Filtered doctors list
  const filteredDoctors = doctorStats.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Totals for table footer
  const sumPending = filteredDoctors.reduce((a, b) => a + b.pendingCount, 0);
  const sumConfirmed = filteredDoctors.reduce((a, b) => a + b.confirmedCount, 0);
  const sumCompleted = filteredDoctors.reduce((a, b) => a + b.completedCount, 0);
  const sumNoShow = filteredDoctors.reduce((a, b) => a + b.noShowCount, 0);
  const sumCancelled = filteredDoctors.reduce((a, b) => a + b.cancelledCount, 0);

  return (
    <div className="space-y-6">
      {/* Enterprise Page Header & Managerial Scope */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Master Analytics Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#1a5f7a]/10 text-[#1a5f7a] border border-[#1a5f7a]/20">
              Real-time Ops
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Clinic-wide throughput, operational volume metrics, and provider schedule status for{' '}
            <strong className="text-slate-700">Saturday, September 19, 2026</strong>.
          </p>
        </div>

        {/* Managerial HIPAA Privacy Badge */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-800 text-[11px] leading-tight">
              HIPAA Safe View
            </div>
            <div className="text-[10px] text-slate-400">Zero Patient PHI Displayed</div>
          </div>
        </div>
      </div>

      {/* TOP ROW METRICS: 4 Summary Statistical Cards with Top Borders Matching Clinic Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Total Visits (Top border clinic navy #1a5f7a) */}
        <div
          id="stat-card-total-visits"
          className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 border-t-4 border-t-[#1a5f7a] transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Today's Total Visits
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#1a5f7a]/10 text-[#1a5f7a] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalVisitsToday}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +8.4%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{totalCompleted} Completed</span>
            <span className="text-slate-300">•</span>
            <span>{doctorStats.reduce((a, b) => a + b.confirmedCount, 0)} Scheduled</span>
          </div>
        </div>

        {/* Card 2: Pending Approvals (Top border amber-500) */}
        <div
          id="stat-card-pending-approvals"
          className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 border-t-4 border-t-amber-500 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Approvals
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 tracking-tight">
              {totalPendingApprovals}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              Action Req
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Avg Response: 18 min</span>
            <span className="text-slate-300">•</span>
            <span className="text-amber-700 font-medium">Provider review</span>
          </div>
        </div>

        {/* Card 3: Active On-Duty Doctors (Top border clinic lime #8bc34a) */}
        <div
          id="stat-card-active-doctors"
          className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 border-t-4 border-t-[#8bc34a] transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active On-Duty Doctors
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#8bc34a]/20 text-[#558b2f] flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeOnDutyDoctors}
              <span className="text-lg font-normal text-slate-400">/{totalDoctors}</span>
            </span>
            <span className="text-xs font-semibold text-[#558b2f]">
              {Math.round((activeOnDutyDoctors / totalDoctors) * 100)}% Available
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>1 On Approved Leave</span>
            <span className="text-slate-300">•</span>
            <span>4 Operating Suites</span>
          </div>
        </div>

        {/* Card 4: No-Show Rate (%) (Top border sky-600 / clinical accent) */}
        <div
          id="stat-card-noshow-rate"
          className="bg-white rounded-xl p-5 shadow-xs border border-slate-200 border-t-4 border-t-sky-600 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              No-Show Rate (%)
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {noShowRate}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingDown className="w-3.5 h-3.5" />
              -1.2%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{totalNoShows} total missed</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-medium">Target &lt; 7.0%</span>
          </div>
        </div>
      </div>

      {/* Managerial Guardrail Callout */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#1a5f7a] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600">
          <span className="font-bold text-slate-800">Operational Privacy Guarantee: </span>
          In strict compliance with clinic policy and federal health privacy regulations, this
          matrix is designed exclusively for managerial capacity monitoring. Attending physician
          clinical notes, diagnoses, and medical records are completely isolated and can only be
          accessed through authorized licensed doctor sessions.
        </div>
      </div>

      {/* MAIN MATRIX TABLE: Medical Staff Operational Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Controls / Filter Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Medical Staff Capacity Matrix</h2>
            <p className="text-xs text-slate-500">
              Live booking counts, shift status, and consultation throughput per physician.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter physician or room..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#1a5f7a] w-48 sm:w-56"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
              {(['All', 'On-Duty', 'On-Leave'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer text-[11px] ${
                    statusFilter === status
                      ? 'bg-[#1a5f7a] text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Doctor Name</th>
                <th className="py-3.5 px-4">Specialty & Suite</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center bg-amber-50/50 text-amber-900">Pending</th>
                <th className="py-3.5 px-4 text-center bg-sky-50/50 text-sky-900">Confirmed</th>
                <th className="py-3.5 px-4 text-center bg-emerald-50/50 text-emerald-900">Completed</th>
                <th className="py-3.5 px-4 text-center bg-rose-50/50 text-rose-900">No-Show</th>
                <th className="py-3.5 px-4 text-center bg-slate-50 text-slate-800">Cancelled</th>
                <th className="py-3.5 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No physicians match your filter query.
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => {
                  const isDuty = doc.status === 'On-Duty';
                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Doctor Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1a5f7a]/10 text-[#1a5f7a] font-bold flex items-center justify-center shrink-0 border border-[#1a5f7a]/20">
                            {doc.name.replace('Dr. ', '').charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{doc.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Lic: {doc.licenseNumber}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Specialty & Room */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{doc.specialty}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span>{doc.room}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isDuty
                              ? 'bg-emerald-100 text-emerald-800'
                              : doc.status === 'On-Leave'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isDuty ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {doc.status}
                        </span>
                      </td>

                      {/* Pending Counter */}
                      <td className="py-3.5 px-4 text-center bg-amber-50/20">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                            doc.pendingCount > 0
                              ? 'bg-amber-100 text-amber-900 font-extrabold'
                              : 'text-slate-400'
                          }`}
                        >
                          {doc.pendingCount}
                        </span>
                      </td>

                      {/* Confirmed Counter */}
                      <td className="py-3.5 px-4 text-center bg-sky-50/20">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-100 text-[#1a5f7a]">
                          {doc.confirmedCount}
                        </span>
                      </td>

                      {/* Completed Counter */}
                      <td className="py-3.5 px-4 text-center bg-emerald-50/20">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
                          {doc.completedCount}
                        </span>
                      </td>

                      {/* No-Show Counter */}
                      <td className="py-3.5 px-4 text-center bg-rose-50/20">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                            doc.noShowCount > 0
                              ? 'bg-rose-100 text-rose-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {doc.noShowCount}
                        </span>
                      </td>

                      {/* Cancelled Counter */}
                      <td className="py-3.5 px-4 text-center bg-slate-50/40">
                        <span className="text-slate-500 font-semibold">{doc.cancelledCount}</span>
                      </td>

                      {/* Quick Action */}
                      <td className="py-3.5 px-4 text-right">
                        {onUpdateDoctorStatus && (
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateDoctorStatus(
                                doc.id,
                                isDuty ? 'On-Leave' : 'On-Duty'
                              )
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                              isDuty
                                ? 'bg-white hover:bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                            }`}
                          >
                            {isDuty ? 'Mark Leave' : 'Set On-Duty'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Totals Summary Row */}
            <tfoot className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td className="py-3.5 px-4" colSpan={2}>
                  <div className="flex items-center gap-1.5">
                    <span>Clinic-wide Aggregates ({filteredDoctors.length} Providers)</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center text-slate-500">
                  {filteredDoctors.filter((d) => d.status === 'On-Duty').length} Active
                </td>
                <td className="py-3.5 px-4 text-center text-amber-800 bg-amber-100/60 font-extrabold text-sm">
                  {sumPending}
                </td>
                <td className="py-3.5 px-4 text-center text-[#1a5f7a] bg-sky-100/60 font-extrabold text-sm">
                  {sumConfirmed}
                </td>
                <td className="py-3.5 px-4 text-center text-emerald-800 bg-emerald-100/60 font-extrabold text-sm">
                  {sumCompleted}
                </td>
                <td className="py-3.5 px-4 text-center text-rose-800 bg-rose-100/60 font-extrabold text-sm">
                  {sumNoShow}
                </td>
                <td className="py-3.5 px-4 text-center text-slate-700 bg-slate-200/60 font-extrabold text-sm">
                  {sumCancelled}
                </td>
                <td className="py-3.5 px-4 text-right text-[11px] text-slate-500">
                  Total Booked: {sumConfirmed + sumCompleted + sumNoShow}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
