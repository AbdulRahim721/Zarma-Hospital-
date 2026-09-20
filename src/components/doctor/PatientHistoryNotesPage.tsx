import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Calendar,
  FileText,
  Activity,
  Pill,
  User,
  CheckCircle2,
  AlertTriangle,
  Bold,
  Italic,
  List,
  Sparkles,
  History,
  Phone,
  Mail,
  Save,
  Check,
} from 'lucide-react';
import { PatientRecord, PatientVisitHistoryItem } from '../../types';

interface PatientHistoryNotesPageProps {
  patientRecords: PatientRecord[];
  onSavePatientNotes: (patientId: string, notes: string, lock: boolean) => void;
  doctorName?: string;
  doctorId?: string;
}

export function PatientHistoryNotesPage({
  patientRecords,
  onSavePatientNotes,
  doctorName = 'Dr. Marcus Chen, MD',
  doctorId,
}: PatientHistoryNotesPageProps) {
  // Selected Patient
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patientRecords[0]?.id || ''
  );

  const selectedPatient =
    patientRecords.find((p) => p.id === selectedPatientId) || patientRecords[0];

  // Clinical notepad local state
  const [consultationNotes, setConsultationNotes] = useState<string>(
    selectedPatient?.consultationNotes || ''
  );
  const [isLocked, setIsLocked] = useState<boolean>(selectedPatient?.isNotesLocked || false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Sync state when patientRecords updates (e.g. when changing doctor)
  React.useEffect(() => {
    if (patientRecords.length > 0) {
      const match = patientRecords.find((p) => p.id === selectedPatientId) || patientRecords[0];
      setSelectedPatientId(match.id);
      setConsultationNotes(match.consultationNotes);
      setIsLocked(match.isNotesLocked);
    } else {
      setSelectedPatientId('');
      setConsultationNotes('');
      setIsLocked(false);
    }
  }, [patientRecords]);

  // Sync state when selected patient changes
  const handleSelectPatient = (patient: PatientRecord) => {
    setSelectedPatientId(patient.id);
    setConsultationNotes(patient.consultationNotes);
    setIsLocked(patient.isNotesLocked);
  };

  const handleSaveAndLock = () => {
    if (!selectedPatient) return;
    setIsLocked(true);
    onSavePatientNotes(selectedPatient.id, consultationNotes, true);
    setSaveToast('Clinical consultation notes securely encrypted and locked.');
    setTimeout(() => setSaveToast(null), 4000);
  };

  const handleUnlockForEdit = () => {
    if (!selectedPatient) return;
    setIsLocked(false);
    onSavePatientNotes(selectedPatient.id, consultationNotes, false);
    setSaveToast('Clinical notes unlocked for amendment.');
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Quick insertion helpers for doctor notepad
  const insertText = (textToInsert: string) => {
    if (isLocked) return;
    setConsultationNotes((prev) => prev + (prev.length > 0 ? '\n\n' : '') + textToInsert);
  };

  const insertSoapTemplate = () => {
    insertText(`SUBJECTIVE:
Patient reports...

OBJECTIVE:
- General: Alert and oriented x4.
- Vitals: BP 120/80 mmHg, HR 72 bpm regular, SpO2 99%.
- Exam: Cardiovascular and respiratory within normal limits.

ASSESSMENT:
Primary diagnosis:

PLAN:
1. Therapeutic intervention:
2. Follow-up consultation:`);
  };

  if (patientRecords.length === 0 || !selectedPatient) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1a5f7a] shrink-0" />
            <span>
              Provider Scope: Showing records assigned exclusively to <strong className="font-semibold text-slate-900">{doctorName}</strong>.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-white border border-sky-300 font-mono text-[10px] font-bold text-sky-800 shrink-0">
            Cannot View Other Patients
          </span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <ShieldCheck className="w-12 h-12 text-[#1a5f7a] mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">No Patient Records Assigned</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mt-2">
            No patient charts are currently assigned to {doctorName}. Under clinical privacy governance, you cannot view patient charts assigned to other physicians.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast confirmation */}
      {saveToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-lg text-sm font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="pb-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#1a5f7a] tracking-tight">
              Patient Visit History & Secure Clinical Notes
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1a5f7a]/10 text-[#1a5f7a]">
              {doctorName}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Review immutable longitudinal EHR visits and draft encrypted, confidential doctor notes.
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 text-xs font-semibold border border-sky-200">
            {patientRecords.length} Assigned Patient{patientRecords.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* HIPAA Isolation Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#1a5f7a] shrink-0" />
          <span>
            Provider Scope: Showing EHR records assigned exclusively to <strong className="font-semibold text-slate-900">{doctorName}</strong>. Patient records of other physicians are strictly confidential and isolated.
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-white border border-sky-300 font-mono text-[10px] font-bold text-sky-800 shrink-0">
          Cannot View Other Patients
        </span>
      </div>

      {/* Patient Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Select Clinical Patient File
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {patientRecords.map((patient) => {
            const isSelected = patient.id === selectedPatient.id;
            return (
              <button
                key={patient.id}
                type="button"
                id={`patient-tab-${patient.id}`}
                onClick={() => handleSelectPatient(patient)}
                className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#1a5f7a] text-white border-[#1a5f7a] shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm truncate">{patient.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {patient.bloodType}
                  </span>
                </div>
                <div
                  className={`text-[11px] truncate ${
                    isSelected ? 'text-white/80' : 'text-slate-500'
                  }`}
                >
                  Age {patient.age} • {patient.gender}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Patient Banner with Allergies & Demographics */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-slate-600">
              DOB: <strong className="text-slate-900">{selectedPatient.dob}</strong>
            </span>
            <span className="text-slate-600">
              Phone: <strong className="text-slate-900">{selectedPatient.phone}</strong>
            </span>
            <span className="text-slate-600">
              Email: <strong className="text-slate-900">{selectedPatient.email}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-rose-700 text-[11px] flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Allergies:
            </span>
            {selectedPatient.allergies.map((allergy) => (
              <span
                key={allergy}
                className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200"
              >
                {allergy}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SPLIT-PANE LAYOUT (50/50 vertical split)                  */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* ========================================================= */}
        {/* LEFT PANE (Historical Timeline): Read-only list card stack*/}
        {/* ========================================================= */}
        <section
          id="pane-historical-timeline"
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col h-full"
          aria-labelledby="history-pane-title"
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#1a5f7a]" />
              <h2 id="history-pane-title" className="text-base sm:text-lg font-bold text-slate-900">
                Historical Timeline (Read-Only)
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {selectedPatient.pastVisits.length} Recorded Visits
            </span>
          </div>

          {/* Uneditable read-only list card stack showing past visit dates, visit types, status */}
          <div className="space-y-4 overflow-y-auto max-h-[640px] pr-1">
            {selectedPatient.pastVisits.map((visit) => (
              <article
                key={visit.id}
                id={`history-card-${visit.id}`}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
              >
                {/* Header: Date, Visit Type, Status */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-[#1a5f7a] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {visit.date}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-0.5">{visit.visitType}</h3>
                    <p className="text-[11px] text-slate-500">
                      Attending: {visit.attendingPhysician}
                    </p>
                  </div>

                  {/* Historical Status */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      visit.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : visit.status === 'Follow-up Recommended'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-slate-100 text-slate-800 border-slate-300'
                    }`}
                  >
                    {visit.status}
                  </span>
                </div>

                {/* Diagnosis */}
                <div className="p-2 rounded-lg bg-white border border-slate-200/80 text-xs">
                  <span className="font-semibold text-slate-600 block mb-0.5">Diagnosis:</span>
                  <p className="text-slate-900 font-medium">{visit.diagnosis}</p>
                </div>

                {/* Vitals Strip */}
                {visit.vitals && (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/70">
                    <Activity className="w-3.5 h-3.5 text-[#1a5f7a] shrink-0" />
                    <span>{visit.vitals}</span>
                  </div>
                )}

                {/* Prescriptions */}
                {visit.prescriptions.length > 0 && (
                  <div className="text-xs">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1 flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5 text-emerald-600" /> Prescribed Rx:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {visit.prescriptions.map((rx, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-200"
                        >
                          {rx}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Notes */}
                <p className="text-xs text-slate-600 leading-relaxed italic border-t border-slate-200/60 pt-2">
                  &ldquo;{visit.summary}&rdquo;
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* RIGHT PANE (Secure Electronic Notepad): Confidential Notes*/}
        {/* ========================================================= */}
        <section
          id="pane-secure-clinical-notepad"
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col h-full"
          aria-labelledby="notes-pane-title"
        >
          {/* 1. DISTINCT SECURITY NOTICE BANNER AT TOP OF THIS PANE WITH A LOCK ICON:
              "End-to-End Secure: These clinical notes are encrypted. Admin roles do not have permission to view this data." */}
          <div
            id="clinical-notes-security-banner"
            className="mb-4 p-3.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm flex items-start gap-3 shadow-sm border border-slate-800"
          >
            <div className="w-7 h-7 rounded-lg bg-[#8bc34a] text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-[#8bc34a] block tracking-wide text-xs uppercase">
                End-to-End Secure
              </span>
              <p className="text-white/90 text-xs font-medium leading-relaxed">
                These clinical notes are encrypted. Admin roles do not have permission to view this
                data.
              </p>
            </div>
          </div>

          {/* Title: Confidential Consultation Notes */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
            <div>
              <h2 id="notes-pane-title" className="text-base sm:text-lg font-bold text-[#1a5f7a]">
                Confidential Consultation Notes
              </h2>
              <p className="text-xs text-slate-500">
                Patient: <strong className="text-slate-800">{selectedPatient.name}</strong> • EHR
                Medical Record #{selectedPatient.id}
              </p>
            </div>

            {isLocked ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                Locked & Encrypted
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <Unlock className="w-3.5 h-3.5 text-emerald-700" />
                Draft Mode
              </span>
            )}
          </div>

          {/* Rich-Text Helpers / SOAP Quick Templates */}
          {!isLocked && (
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-1 text-slate-600">
                <span className="font-semibold text-[11px] text-slate-500 mr-1">Templates:</span>
                <button
                  type="button"
                  onClick={insertSoapTemplate}
                  className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium transition-colors cursor-pointer text-[11px]"
                >
                  + SOAP Structure
                </button>
                <button
                  type="button"
                  onClick={() =>
                    insertText(
                      '- Cardiovascular Exam: Regular rate and rhythm, no murmurs. Lungs clear to auscultation bilaterally.'
                    )
                  }
                  className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium transition-colors cursor-pointer text-[11px]"
                >
                  + Normal Findings
                </button>
              </div>

              <div className="text-[11px] text-slate-400">Markdown compatible</div>
            </div>
          )}

          {/* Clean Modern Textarea Interface */}
          <div className="flex-1 flex flex-col min-h-[320px]">
            <label htmlFor="textarea-clinical-notes" className="sr-only">
              Confidential Consultation Notes Content
            </label>
            <textarea
              id="textarea-clinical-notes"
              value={consultationNotes}
              onChange={(e) => setConsultationNotes(e.target.value)}
              disabled={isLocked}
              rows={16}
              placeholder="Enter comprehensive clinical consultation findings, observations, differential diagnosis, and medical directives..."
              className={`w-full flex-1 p-4 rounded-xl text-xs sm:text-sm font-mono leading-relaxed border transition-all focus:outline-none focus:ring-2 ${
                isLocked
                  ? 'bg-slate-50/80 border-slate-300 text-slate-700 cursor-not-allowed select-text'
                  : 'bg-white border-slate-300 text-slate-900 focus:ring-[#1a5f7a] focus:border-transparent'
              }`}
            />
          </div>

          {/* Locked Status Stamp or Action Footer */}
          {isLocked ? (
            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/50 p-3 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Digitally Signed & Sealed by Dr. Marcus Chen, MD</span>
              </div>

              <button
                type="button"
                id="btn-unlock-notes"
                onClick={handleUnlockForEdit}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer shadow-2xs"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Unlock to Amend</span>
              </button>
            </div>
          ) : (
            /* Prominent "Save & Lock Notes" button at the bottom */
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-500">
                Locking applies cryptographic hashing to comply with HIPAA audit guidelines.
              </p>

              <button
                type="button"
                id="btn-save-lock-notes"
                onClick={handleSaveAndLock}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a5f7a] hover:bg-[#14495e] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Lock className="w-4 h-4 stroke-[2.5]" />
                <span>Save &amp; Lock Notes</span>
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
