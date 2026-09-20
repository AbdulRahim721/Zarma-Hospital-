import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Filter,
  Shield,
  Stethoscope,
  Building,
  Calendar,
  Clock,
  Save,
  CheckCircle2,
  Trash2,
  Plus,
  X,
  Lock,
  KeyRound,
  AlertTriangle,
  FileCheck,
  Check,
  ChevronDown,
  UserX,
  UserCheck,
} from 'lucide-react';
import { ClinicUserAccount, AdminSystemConfig, UserRole, SystemHoliday } from '../../types';

interface UserDirectorySettingsPageProps {
  users: ClinicUserAccount[];
  systemConfig: AdminSystemConfig;
  onAddDoctorAccount: (newDoctor: {
    name: string;
    specialty: string;
    licenseNumber: string;
    room: string;
    email: string;
    phone: string;
    temporaryPassword: string;
  }) => void;
  onToggleDoctorActive?: (userId: string, newStatus: 'Active' | 'Deactivated') => void;
  onUpdateSystemConfig: (updatedConfig: AdminSystemConfig) => void;
}

export function UserDirectorySettingsPage({
  users,
  systemConfig,
  onAddDoctorAccount,
  onToggleDoctorActive,
  onUpdateSystemConfig,
}: UserDirectorySettingsPageProps) {
  // Directory Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | UserRole>('All');

  // Slide-out Drawer State
  const [isAddDoctorDrawerOpen, setIsAddDoctorDrawerOpen] = useState(false);

  // New Doctor Form Fields
  const [newDoctorName, setNewDoctorName] = useState('');
  const [newDoctorSpecialty, setNewDoctorSpecialty] = useState('Family Medicine & Pediatrics');
  const [newDoctorLicense, setNewDoctorLicense] = useState('');
  const [newDoctorRoom, setNewDoctorRoom] = useState('Suite 305 - Specialty');
  const [newDoctorEmail, setNewDoctorEmail] = useState('');
  const [newDoctorPhone, setNewDoctorPhone] = useState('(555) 234-5610');
  const [tempPassword, setTempPassword] = useState('WelcomeClinic2026!');
  const [requireReset, setRequireReset] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // System Configuration Local Form State
  const [slotDuration, setSlotDuration] = useState(systemConfig.defaultSlotDurationMinutes);
  const [startTime, setStartTime] = useState(systemConfig.operatingHoursStart);
  const [endTime, setEndTime] = useState(systemConfig.operatingHoursEnd);
  const [emergencyActive, setEmergencyActive] = useState(systemConfig.emergencyBannerActive);
  const [emergencyText, setEmergencyText] = useState(systemConfig.emergencyBannerText);
  const [holidays, setHolidays] = useState<SystemHoliday[]>(systemConfig.holidays);

  // Add Holiday inputs
  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('');

  // Feedback Notification
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Filtered accounts
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.specialty && u.specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.licenseNumber && u.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'All' ? true : u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Handle slide-out submission
  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctorName.trim()) {
      setFormError('Doctor full name is required.');
      return;
    }
    if (!newDoctorLicense.trim()) {
      setFormError('Valid medical board license or NPI is required.');
      return;
    }
    if (!newDoctorEmail.trim()) {
      setFormError('Clinical provider email is required.');
      return;
    }

    onAddDoctorAccount({
      name: newDoctorName.startsWith('Dr.') ? newDoctorName : `Dr. ${newDoctorName}`,
      specialty: newDoctorSpecialty,
      licenseNumber: newDoctorLicense,
      room: newDoctorRoom,
      email: newDoctorEmail,
      phone: newDoctorPhone,
      temporaryPassword: tempPassword,
    });

    // Reset & close
    setIsAddDoctorDrawerOpen(false);
    setNewDoctorName('');
    setNewDoctorLicense('');
    setNewDoctorEmail('');
    setFormError(null);
    showNotice('New doctor account provisioned successfully.');
  };

  // Add holiday handler
  const handleAddHoliday = () => {
    if (!newHolidayName.trim() || !newHolidayDate) return;
    const newHol: SystemHoliday = {
      id: `hol-${Date.now()}`,
      name: newHolidayName,
      dateIso: newHolidayDate,
      isObservedClinicClosure: true,
    };
    setHolidays((prev) => [...prev, newHol]);
    setNewHolidayName('');
    setNewHolidayDate('');
  };

  const handleRemoveHoliday = (holidayId: string) => {
    setHolidays((prev) => prev.filter((h) => h.id !== holidayId));
  };

  // Save full system config
  const handleSaveConfig = () => {
    onUpdateSystemConfig({
      ...systemConfig,
      defaultSlotDurationMinutes: slotDuration,
      operatingHoursStart: startTime,
      operatingHoursEnd: endTime,
      emergencyBannerActive: emergencyActive,
      emergencyBannerText: emergencyText,
      holidays,
    });
    showNotice('Global clinic configuration and parameters saved successfully.');
  };

  const showNotice = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => setSaveSuccessNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Save Toast Notification */}
      {saveSuccessNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-md animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{saveSuccessNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Enterprise Header with Slide-out Drawer Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              User Directory & System Configuration
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#1a5f7a]/10 text-[#1a5f7a] border border-[#1a5f7a]/20">
              Admin Ops
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Manage provider credentials, administrator permissions, and global clinic scheduling
            parameters.
          </p>
        </div>

        {/* Primary Action Button: + Add New Doctor Account */}
        <button
          type="button"
          id="btn-add-new-doctor-account"
          onClick={() => setIsAddDoctorDrawerOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a5f7a] hover:bg-[#134b61] text-white text-xs font-bold shadow-md shadow-[#1a5f7a]/20 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <UserPlus className="w-4 h-4 text-sky-200" />
          <span>+ Add New Doctor Account</span>
        </button>
      </div>

      {/* USER DIRECTORY TABLE SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Top Search Filter Bar to lookup accounts by name or role */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Clinic Accounts Directory</h2>
            <p className="text-xs text-slate-500">
              Listing verified clinical practitioners, clinic managers, and registered portal users.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Filter Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="input-search-user-directory"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search account name, license or email..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#1a5f7a] w-56 sm:w-64"
              />
            </div>

            {/* Role Filter Selector */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
              {(['All', 'Doctor', 'Admin', 'Patient'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setRoleFilter(role)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer text-[11px] ${
                    roleFilter === role
                      ? 'bg-[#1a5f7a] text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Account Holder</th>
                <th className="py-3 px-4">System Role</th>
                <th className="py-3 px-4">Specialty & License</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Enrolled Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No accounts found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isDoctor = user.role === 'Doctor';
                  const isAdmin = user.role === 'Admin';
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/75 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                              isDoctor
                                ? 'bg-sky-100 text-[#1a5f7a] border border-sky-200'
                                : isAdmin
                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{user.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* System Role */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isDoctor
                              ? 'bg-sky-50 text-[#1a5f7a] border border-sky-200'
                              : isAdmin
                              ? 'bg-purple-50 text-purple-800 border border-purple-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {isDoctor && <Stethoscope className="w-3 h-3 text-[#1a5f7a]" />}
                          {isAdmin && <Shield className="w-3 h-3 text-purple-600" />}
                          <span>{user.role}</span>
                        </span>
                      </td>

                      {/* Specialty & License */}
                      <td className="py-3 px-4">
                        {user.specialty ? (
                          <div>
                            <div className="text-slate-900 font-semibold">{user.specialty}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Lic: {user.licenseNumber || 'Verified NPI'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">
                            Standard User Account
                          </span>
                        )}
                      </td>

                      {/* Contact Info */}
                      <td className="py-3 px-4">
                        <div className="text-slate-700">{user.phone}</div>
                        {user.room && (
                          <div className="text-[10px] text-slate-400">{user.room}</div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            user.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : user.status === 'Deactivated'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      {/* Enrolled Date */}
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {user.joinedDate}
                      </td>

                      {/* Actions: Deactivate / Reactivate */}
                      <td className="py-3 px-4 text-right">
                        {isDoctor ? (
                          user.status === 'Active' ? (
                            <button
                              type="button"
                              onClick={() => {
                                onToggleDoctorActive?.(user.id, 'Deactivated');
                                showNotice(`${user.name} has been deactivated.`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                              title="Deactivate doctor account"
                            >
                              <UserX className="w-3 h-3" />
                              <span>Deactivate</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                onToggleDoctorActive?.(user.id, 'Active');
                                showNotice(`${user.name} has been reactivated.`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                              title="Reactivate doctor account"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>Reactivate</span>
                            </button>
                          )
                        ) : (
                          <span className="text-[10px] text-slate-400">System user</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* GLOBAL SYSTEM SETTINGS CARDS BELOW TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Core Clinic Booking Parameters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-[#1a5f7a]/10 text-[#1a5f7a] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Core Clinic Booking Parameters
              </h3>
              <p className="text-xs text-slate-500">
                Configure patient slot durations and standard operating hours.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Default Booking Slot Duration Dropdown */}
            <div>
              <label
                htmlFor="select-slot-duration"
                className="block font-bold text-slate-700 mb-1.5"
              >
                Default Booking Slot Duration
              </label>
              <select
                id="select-slot-duration"
                value={slotDuration}
                onChange={(e) => setSlotDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#1a5f7a]"
              >
                <option value={15}>15 Minutes (Express / Vaccine / Quick Follow-up)</option>
                <option value={20}>20 Minutes (Standard Nurse / Vitals)</option>
                <option value={30}>30 Minutes (Standard Clinical Consultation - Recommended)</option>
                <option value={45}>45 Minutes (Comprehensive Annual Physical Exam)</option>
                <option value={60}>60 Minutes (New Patient Intake / Complex Diagnostic)</option>
              </select>
              <p className="mt-1 text-[11px] text-slate-500">
                Governs the default increment displayed in the patient booking wizard timeline.
              </p>
            </div>

            {/* Operating Hours Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinic Opening Time</label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="08:00 AM"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinic Closing Time</label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="05:30 PM"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs"
                />
              </div>
            </div>

            {/* Emergency Clinic Broadcast Banner Toggle */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span className="font-bold text-amber-900">Clinic Emergency Notice</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emergencyActive}
                    onChange={(e) => setEmergencyActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>
              <input
                type="text"
                value={emergencyText}
                onChange={(e) => setEmergencyText(e.target.value)}
                placeholder="Enter clinic emergency or weather banner notice..."
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-amber-300 text-amber-900 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Default Clinic Holiday Calendar Picker */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-[#8bc34a]/20 text-[#558b2f] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Clinic Holiday Calendar Picker</h3>
              <p className="text-xs text-slate-500">
                Scheduled facility closures where booking calendars automatically lock.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Add Holiday Form Inputs */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 text-[11px] block">
                Add Observed Clinic Closure
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newHolidayName}
                  onChange={(e) => setNewHolidayName(e.target.value)}
                  placeholder="Holiday name (e.g. Labor Day)"
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs focus:ring-1 focus:ring-[#1a5f7a]"
                />
                <input
                  type="date"
                  value={newHolidayDate}
                  onChange={(e) => setNewHolidayDate(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs focus:ring-1 focus:ring-[#1a5f7a]"
                />
              </div>
              <button
                type="button"
                onClick={handleAddHoliday}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a5f7a] text-white text-xs font-bold hover:bg-[#134b61] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Observed Holiday</span>
              </button>
            </div>

            {/* List of Configured Holidays */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {holidays.map((hol) => (
                <div
                  key={hol.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Calendar className="w-3.5 h-3.5 text-[#1a5f7a] shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{hol.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{hol.dateIso}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-800">
                      Clinic Closed
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHoliday(hol.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Remove holiday closure"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Global Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          id="btn-save-admin-system-config"
          onClick={handleSaveConfig}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a5f7a] hover:bg-[#134b61] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#1a5f7a]/25 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4 text-sky-200" />
          <span>Save System Configuration</span>
        </button>
      </div>

      {/* SLIDE-OUT DRAWER FORM: + Add New Doctor Account */}
      {isAddDoctorDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAddDoctorDrawerOpen(false)}
          />

          {/* Slide-out Panel */}
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl z-10 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#1a5f7a] text-white flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add New Doctor Account</h3>
                  <p className="text-[11px] text-slate-500">
                    Provision provider credentials & room allocation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddDoctorDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Form Body */}
            <form onSubmit={handleCreateDoctor} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                  {formError}
                </div>
              )}

              {/* Field 1: Doctor Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  value={newDoctorName}
                  onChange={(e) => setNewDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Jordan Cole, MD"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#1a5f7a]"
                />
              </div>

              {/* Field 2: Specialty */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Medical Specialty *</label>
                <select
                  value={newDoctorSpecialty}
                  onChange={(e) => setNewDoctorSpecialty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#1a5f7a]"
                >
                  <option value="Family Medicine & Pediatrics">Family Medicine & Pediatrics</option>
                  <option value="Internal Medicine & Cardiology">Internal Medicine & Cardiology</option>
                  <option value="Women's Health & Primary Care">Women's Health & Primary Care</option>
                  <option value="Geriatrics & Chronic Disease">Geriatrics & Chronic Disease</option>
                  <option value="Endocrinology & Metabolism">Endocrinology & Metabolism</option>
                  <option value="Dermatology & Skin Care">Dermatology & Skin Care</option>
                </select>
              </div>

              {/* Field 3: License Number */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  License Number / State Medical Board NPI *
                </label>
                <input
                  type="text"
                  required
                  value={newDoctorLicense}
                  onChange={(e) => setNewDoctorLicense(e.target.value)}
                  placeholder="e.g. MD-78291-CA"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1a5f7a]"
                />
              </div>

              {/* Field 4: Suite Allocation */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Assigned Consultation Suite / Room
                </label>
                <input
                  type="text"
                  value={newDoctorRoom}
                  onChange={(e) => setNewDoctorRoom(e.target.value)}
                  placeholder="Suite 305 - Specialty Wing"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1a5f7a]"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Provider Email *</label>
                  <input
                    type="email"
                    required
                    value={newDoctorEmail}
                    onChange={(e) => setNewDoctorEmail(e.target.value)}
                    placeholder="j.cole@healthychoiceclinic.org"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Clinic Extension</label>
                  <input
                    type="text"
                    value={newDoctorPhone}
                    onChange={(e) => setNewDoctorPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                  />
                </div>
              </div>

              {/* Initial Credential Setup */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                  <KeyRound className="w-3.5 h-3.5 text-[#1a5f7a]" />
                  <span>Initial Credential Setup</span>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Temporary Password</label>
                  <input
                    type="text"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-xs"
                  />
                </div>
                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireReset}
                    onChange={(e) => setRequireReset(e.target.checked)}
                    className="rounded text-[#1a5f7a] focus:ring-[#1a5f7a]"
                  />
                  <span className="text-[11px] text-slate-600">
                    Require password reset at first sign-in
                  </span>
                </label>
              </div>

              {/* Submit / Cancel in Drawer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDoctorDrawerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-submit-new-doctor-account"
                  className="px-4 py-2 rounded-xl bg-[#1a5f7a] hover:bg-[#134b61] text-white text-xs font-bold shadow-md shadow-[#1a5f7a]/25 transition-all cursor-pointer"
                >
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
