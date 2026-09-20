import React from 'react';
import { Calendar, User, FileText, Pill, Activity, CheckCircle, Download } from 'lucide-react';
import { MedicalHistoryItem } from '../types';

interface PastMedicalHistoryListProps {
  records: MedicalHistoryItem[];
}

export const PastMedicalHistoryList: React.FC<PastMedicalHistoryListProps> = ({ records }) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h4 className="text-base font-bold text-slate-800">No Past Consultations</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          When you complete clinical visits with ZARMA HOSPITAL physicians, your visit summaries, prescriptions, and diagnostic notes will automatically appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="past-medical-history-container">
      {records.map((record) => (
        <div
          key={record.id}
          id={`history-record-${record.id}`}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow p-5 sm:p-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8bc34a]/15 text-[#689f38] flex items-center justify-center font-bold">
                <CheckCircle className="w-5 h-5 text-[#689f38]" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  {record.diagnosis}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-[#1a5f7a]">{record.doctorName}</span>
                  <span>•</span>
                  <span>{record.specialty}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-[#1a5f7a]" />
                {record.date}
              </span>
              <button
                type="button"
                onClick={() => alert(`Downloading official clinical record for visit on ${record.date}`)}
                className="hidden sm:inline-flex items-center gap-1 text-[#1a5f7a] hover:underline font-semibold text-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF Summary</span>
              </button>
            </div>
          </div>

          {/* Vitals Summary */}
          {record.vitalSummary && (
            <div className="mb-3 px-3 py-2 rounded-lg bg-teal-50/70 border border-teal-100/80 flex items-center gap-2 text-xs text-teal-800">
              <Activity className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="font-medium">Recorded Vitals:</span>
              <span className="font-mono text-teal-900">{record.vitalSummary}</span>
            </div>
          )}

          {/* Clinical Doctor Notes */}
          <div className="mb-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-700 block mb-1">Clinical Notes & Assessment:</span>
            {record.notes}
          </div>

          {/* Prescriptions */}
          {record.prescriptions && record.prescriptions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mr-1">
                <Pill className="w-3.5 h-3.5 text-[#8bc34a]" />
                Prescribed Medications:
              </span>
              {record.prescriptions.map((rx, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {rx}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
