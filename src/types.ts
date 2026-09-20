export type UserRole = 'Patient' | 'Doctor' | 'Admin';

export type AuthView = 'signin' | 'register';

export type AppMainView = 'auth' | 'patient-portal' | 'doctor-portal' | 'admin-portal';

export type PatientPortalView = 'dashboard' | 'booking-wizard';

export type DoctorPortalTab = 'todays-agenda' | 'schedule-leave' | 'patient-history';

export type AdminPortalTab =
  | 'master-analytics'
  | 'all-appointments'
  | 'patients-directory'
  | 'operational-schedule'
  | 'user-directory-settings';

export interface StaffDoctorStat {
  id: string;
  name: string;
  specialty: string;
  room: string;
  licenseNumber: string;
  status: 'On-Duty' | 'On-Leave' | 'Off-Shift' | 'Deactivated';
  pendingCount: number;
  confirmedCount: number;
  completedCount: number;
  noShowCount: number;
  cancelledCount: number;
  phone?: string;
  email?: string;
}

export interface OperationalDoctorColumn {
  id: string;
  name: string;
  specialty: string;
  room: string;
  isOnLeaveToday: boolean;
  leaveReason?: string;
  isDeactivated?: boolean;
}

export type SlotState = 'free' | 'pending' | 'confirmed' | 'leave';

export interface GridSlotCell {
  doctorId: string;
  timeSlot: string; // "08:30 AM"
  state: SlotState;
  bookingRef?: string;
  durationMinutes: number;
  room?: string;
}

export interface SystemHoliday {
  id: string;
  name: string;
  dateIso: string;
  isObservedClinicClosure: boolean;
}

export interface AdminSystemConfig {
  defaultSlotDurationMinutes: number; // 15, 30, 45, 60
  operatingHoursStart: string; // "08:00 AM"
  operatingHoursEnd: string; // "05:30 PM"
  holidays: SystemHoliday[];
  emergencyBannerActive: boolean;
  emergencyBannerText: string;
  allowOverbookingBuffer: boolean;
  hipaaAuditLogRetentionDays: number;
}

export interface ClinicUserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  specialty?: string;
  licenseNumber?: string;
  room?: string;
  phone: string;
  status: 'Active' | 'Deactivated' | 'Suspended' | 'Pending Verification';
  joinedDate: string;
}

export type DashboardTab = 'upcoming' | 'history';

export type AppointmentStatus =
  | 'Pending Approval'
  | 'Confirmed'
  | 'Rejected'
  | 'Completed'
  | 'No-Show';

export interface DoctorAppointment {
  id: string;
  doctorId?: string;
  doctorName?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string; // e.g. "Sep 19, 2026"
  dateIso: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:30 AM - 10:00 AM"
  startHour: number; // 24-hr format (e.g. 9)
  startMinute: number; // e.g. 30
  status: AppointmentStatus;
  reason: string;
  room?: string;
  vitalSummary?: string;
  notes?: string;
}

export interface DoctorScheduleConfig {
  workingDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  startTime: string; // e.g. "08:30 AM"
  endTime: string; // e.g. "05:00 PM"
  lunchStart: string; // e.g. "12:30 PM"
  lunchEnd: string; // e.g. "01:30 PM"
  slotDurationMinutes: number;
}

export interface DoctorLeaveRange {
  id: string;
  startDateIso: string;
  endDateIso: string;
  reason: string;
  createdAt: string;
}

export interface PatientVisitHistoryItem {
  id: string;
  attendingDoctorId?: string;
  date: string;
  visitType: string;
  status: 'Completed' | 'Follow-up Recommended' | 'Discharged';
  attendingPhysician: string;
  diagnosis: string;
  vitals: string;
  prescriptions: string[];
  summary: string;
}

export interface PatientRecord {
  id: string;
  doctorId?: string;
  primaryPhysician?: string;
  name: string;
  dob: string;
  age: number;
  gender: string;
  bloodType: string;
  allergies: string[];
  phone: string;
  email: string;
  pastVisits: PatientVisitHistoryItem[];
  consultationNotes: string;
  isNotesLocked: boolean;
  lockedAt?: string;
  lockedBy?: string;
}

export interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegistrationFormState {
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword?: string;
  agreeTerms?: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  title: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  leaveDates: string[]; // YYYY-MM-DD strings where doctor is on leave
  workingDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  workingHoursStart?: string; // e.g. "08:30 AM"
  workingHoursEnd?: string; // e.g. "05:00 PM"
  genderAvatar: 'female' | 'male';
  bio: string;
  location: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  doctorId: string;
  patientName?: string;
  patientEmail?: string;
  date: string; // formatted e.g. "Sep 19, 2026"
  dateIso: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:30 AM - 10:00 AM" or "09:30 AM"
  status: 'Pending Approval' | 'Confirmed';
  reason?: string;
  location?: string;
  scheduledTimeIso: string; // ISO string for accurate 2-hour calculation
}

export interface MedicalHistoryItem {
  id: string;
  patientName?: string;
  patientEmail?: string;
  doctorName: string;
  specialty: string;
  date: string;
  diagnosis: string;
  prescriptions: string[];
  notes: string;
  vitalSummary?: string;
}

