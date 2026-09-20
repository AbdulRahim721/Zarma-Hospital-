import React, { useState } from 'react';
import {
  Search,
  User,
  Stethoscope,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Shield,
  Lock,
  X,
  Eye,
  FileText,
  HeartPulse,
  Activity,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { PatientRecord, StaffDoctorStat } from '../../types';

interface PatientsDirectoryPageProps {
  patients: PatientRecord[];
  doctors: StaffDoctorStat[];
}

export function PatientsDirectoryPage({ patients, doctors }: PatientsDirectoryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>('All');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<string>('All');
  const [activePatient, setActivePatient] = useState<PatientRecord | null>(null);

  // Search & filter
  const filteredPatients = patients.filter((p) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchLower) ||
      p.email.toLowerCase().includes(searchLower) ||
      p.phone.includes(searchTerm) ||
      p.id.toLowerCase().includes(searchLower) ||
      (p.primaryPhysician && p.primaryPhysician.toLowerCase().includes(searchLower));

    const matchesDoctor =
      selectedDoctorFilter === 'All'
        ? true
        : p.primaryPhysician?.includes(selectedDoctorFilter) || p.doctorId === selectedDoctorFilter;

    const matchesGender =
      selectedGenderFilter === 'All' ? true : p.gender === selectedGenderFilter;

    return matchesSearch && matchesDoctor && matchesGender;
  });

  const totalPatients = patients.length;
  const totalVisitsCount = patients.reduce(
    (acc, p) => acc + (p.pastVisits ? p.pastVisits.length : 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Patient Master Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1a5f7a]/10 text-[#1a5f7a] border border-[#1a5f7a]/20">
              Demographic View
            </span>
          </div>
          <p className="text-xs text-slate-500">
            View, search, and verify patient demographic profiles, emergency contacts, and attending doctor assignments.
          </p>
        </div>

        {/* HIPAA Compliance Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 shrink-0 font-medium">
          <Lock className="w-3.5 h-3.5 text-amber-700" />
          <span>Clinical visit notes strictly redacted from admin role</span>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Enrolled Patients
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalPatients}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Active registered records</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#1a5f7a]/10 text-[#1a5f7a] flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Logged Visits
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalVisitsCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Historical clinic consultations</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Clinical Privacy Guard
            </span>
            <div className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>HIPAA § 164 Active</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Admin notes view locked</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="admin-search-patients"
              placeholder="Search by patient name, ID, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] focus:bg-white transition-all"
            />
          </div>

          {/* Primary Doctor Filter */}
          <div>
            <select
              id="admin-filter-patient-doctor"
              value={selectedDoctorFilter}
              onChange={(e) => setSelectedDoctorFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] cursor-pointer"
            >
              <option value="All">All Primary Physicians</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <select
              id="admin-filter-patient-gender"
              value={selectedGenderFilter}
              onChange={(e) => setSelectedGenderFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] cursor-pointer"
            >
              <option value="All">All Genders</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
          <span>
            Found <strong className="text-slate-900">{filteredPatients.length}</strong> matching patients
          </span>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-[#1a5f7a] hover:underline font-semibold cursor-pointer"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Patient Name & ID</th>
                <th className="py-3.5 px-4">Demographics</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Primary Physician</th>
                <th className="py-3.5 px-4">Allergies & Blood</th>
                <th className="py-3.5 px-4 text-center">Visits</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No patients found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try searching with a different name or ID.</p>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/75 transition-colors">
                    {/* Name & ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#1a5f7a]/10 text-[#1a5f7a] font-bold text-xs flex items-center justify-center shrink-0">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">MRN: {p.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Demographics */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800">
                        {p.age} yrs • {p.gender}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">DOB: {p.dob}</div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{p.phone}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{p.email}</div>
                    </td>

                    {/* Primary Physician */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Stethoscope className="w-3.5 h-3.5 text-[#1a5f7a]" />
                        <span>{p.primaryPhysician || 'Unassigned'}</span>
                      </div>
                    </td>

                    {/* Allergies & Blood */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                          {p.bloodType}
                        </span>
                        {p.allergies && p.allergies.length > 0 ? (
                          <span className="text-rose-600 text-[10px] truncate max-w-[140px]" title={p.allergies.join(', ')}>
                            {p.allergies[0]}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">NKDA</span>
                        )}
                      </div>
                    </td>

                    {/* Visits */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        {p.pastVisits ? p.pastVisits.length : 0}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setActivePatient(p)}
                        className="px-3 py-1.5 rounded-lg bg-[#1a5f7a] hover:bg-[#14495e] text-white text-xs font-bold inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Demographics</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PATIENT DETAIL MODAL (WITH EXPLICIT VISIT NOTE LOCKOUT) */}
      {activePatient && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 text-slate-800">
            <button
              type="button"
              onClick={() => setActivePatient(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Patient Header */}
            <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a5f7a] to-slate-800 text-white font-bold text-base flex items-center justify-center shadow-xs">
                {activePatient.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{activePatient.name}</h2>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 text-slate-700 font-bold">
                    MRN: {activePatient.id}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {activePatient.age} years old • {activePatient.gender} • DOB: {activePatient.dob}
                </div>
              </div>
            </div>

            {/* Demographics & Contact Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-5">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Contact Information
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-[#1a5f7a]" />
                  <span>{activePatient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-[#1a5f7a]" />
                  <span>{activePatient.email}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Care Team & Vitals Summary
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Stethoscope className="w-3.5 h-3.5 text-[#1a5f7a]" />
                  <span className="font-bold">{activePatient.primaryPhysician || 'Unassigned'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                  <span>Blood Type: <strong>{activePatient.bloodType}</strong></span>
                </div>
              </div>
            </div>

            {/* Known Allergies */}
            <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Recorded Patient Allergies:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activePatient.allergies && activePatient.allergies.length > 0 ? (
                  activePatient.allergies.map((allergy, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200"
                    >
                      {allergy}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic">No known drug allergies reported.</span>
                )}
              </div>
            </div>

            {/* Historical Visit Log (Timestamps & Attending Physicians) */}
            <div className="mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Past Clinic Visits ({activePatient.pastVisits?.length || 0})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {activePatient.pastVisits && activePatient.pastVisits.length > 0 ? (
                  activePatient.pastVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-800">{visit.visitType}</div>
                        <div className="text-[11px] text-slate-500">
                          {visit.date} • {visit.attendingPhysician}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                        {visit.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic">No past visits recorded.</div>
                )}
              </div>
            </div>

            {/* MANDATORY HIPAA / CLINICAL PRIVACY RESTRICTION CARD */}
            {/* The user specifically mandated: "Cannot Read visit notes" */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 mb-4">
              <div className="flex items-center gap-2 font-bold text-xs mb-1 text-amber-900">
                <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Doctor Consultation & Visit Notes: STRICTLY RESTRICTED</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed mb-2.5">
                Under HIPAA clinical privacy standards and clinic data policy, <strong>Administrative personnel are legally barred from reading physician consultation notes, diagnostic impressions, and psychiatric records</strong>. This information is confidential between doctor and patient.
              </p>
              <div className="p-3 rounded-lg bg-amber-100/80 border border-amber-300/70 text-center select-none">
                <span className="font-mono text-xs text-amber-900 font-semibold tracking-wider">
                  🔒 [PROTECTED CLINICAL RECORD — ADMIN CANNOT READ VISIT NOTES]
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActivePatient(null)}
              className="w-full py-2.5 rounded-xl bg-[#1a5f7a] text-white font-bold text-xs shadow-xs hover:bg-[#14495e] transition-colors cursor-pointer"
            >
              Close Demographic Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
