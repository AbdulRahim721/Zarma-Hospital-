/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LeftBrandingPane } from './components/LeftBrandingPane';
import { RoleSegmentedControl } from './components/RoleSegmentedControl';
import { SignInForm } from './components/SignInForm';
import { RegistrationForm } from './components/RegistrationForm';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { AuthSuccessCard } from './components/AuthSuccessCard';
import { ClinicLogo } from './components/ClinicLogo';
import { PatientDashboardView } from './components/PatientDashboardView';
import { BookingWizardView } from './components/BookingWizardView';
import { PatientPortalNavbar } from './components/PatientPortalNavbar';
import { DoctorPortalView } from './components/doctor/DoctorPortalView';
import { AdminPortalView } from './components/admin/AdminPortalView';
import {
  UserRole,
  AuthView,
  RegistrationFormState,
  AppMainView,
  PatientPortalView,
  Appointment,
  MedicalHistoryItem,
} from './types';
import { INITIAL_APPOINTMENTS, INITIAL_MEDICAL_HISTORY } from './data/mockData';
import { HeartPulse, LockKeyhole, HelpCircle, PhoneCall, LayoutDashboard, ArrowRight, Stethoscope, ShieldCheck } from 'lucide-react';

export default function App() {
  // Main Navigation View: 'admin-portal', 'doctor-portal', 'patient-portal', or 'auth'
  const [mainView, setMainView] = useState<AppMainView>('admin-portal');
  
  // Patient Portal Sub-view: 'dashboard' (View 1) or 'booking-wizard' (View 2)
  const [patientPortalView, setPatientPortalView] = useState<PatientPortalView>('dashboard');

  // Appointments & History State
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [medicalHistory] = useState<MedicalHistoryItem[]>(INITIAL_MEDICAL_HISTORY);
  const [justBooked, setJustBooked] = useState<boolean>(false);

  // Active Patient Profile
  const [patientProfile, setPatientProfile] = useState<{
    name: string;
    email: string;
  }>({
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
  });

  // Auth screen states
  const [activeRole, setActiveRole] = useState<UserRole>('Doctor');
  const [authView, setAuthView] = useState<AuthView>('signin');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  
  const [authenticatedUser, setAuthenticatedUser] = useState<{
    email: string;
    role: UserRole;
    isRegistered?: boolean;
  } | null>(null);

  const handleRoleChange = (newRole: UserRole) => {
    setActiveRole(newRole);
    if (authView === 'register' && newRole !== 'Patient') {
      setAuthView('signin');
    }
  };

  const handleNavigateToRegister = () => {
    setActiveRole('Patient');
    setAuthView('register');
  };

  const handleNavigateToSignIn = () => {
    setAuthView('signin');
  };

  const handleLoginSuccess = (email: string, role: UserRole) => {
    setAuthenticatedUser({ email, role, isRegistered: false });
    if (role === 'Patient') {
      setPatientProfile((prev) => ({ ...prev, email }));
      setMainView('patient-portal');
      setPatientPortalView('dashboard');
    } else if (role === 'Doctor') {
      setMainView('doctor-portal');
    } else if (role === 'Admin') {
      setMainView('admin-portal');
    }
  };

  const handleRegisterSuccess = (data: RegistrationFormState) => {
    setAuthenticatedUser({
      email: data.email,
      role: 'Patient',
      isRegistered: true,
    });
    setPatientProfile({
      name: data.fullName || 'Eleanor Vance',
      email: data.email,
    });
    setMainView('patient-portal');
    setPatientPortalView('dashboard');
  };

  const handleSignOut = () => {
    setAuthenticatedUser(null);
    setAuthView('signin');
    setMainView('auth');
  };

  // Appointment Actions
  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));
  };

  const handleRescheduleAppointment = (
    appointmentId: string,
    newDate: string,
    newDateIso: string,
    newTimeSlot: string,
    newScheduledTimeIso: string
  ) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? {
              ...apt,
              date: newDate,
              dateIso: newDateIso,
              timeSlot: newTimeSlot,
              scheduledTimeIso: newScheduledTimeIso,
            }
          : apt
      )
    );
  };

  const handleCompleteBooking = (newAppointment: Appointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);
    setJustBooked(true);
    setPatientPortalView('dashboard');
    // Clear the notification flag after a few seconds
    setTimeout(() => setJustBooked(false), 5000);
  };

  // If in Admin Portal mode (3-Page Enterprise Clinic Manager Dashboard)
  if (mainView === 'admin-portal') {
    return (
      <AdminPortalView
        onSwitchToPatientPortal={() => {
          setMainView('patient-portal');
          setPatientPortalView('dashboard');
        }}
        onSwitchToDoctorPortal={() => {
          setMainView('doctor-portal');
        }}
        onSignOut={handleSignOut}
        managerName="Kathryn Reed, MHA"
        managerRole="Clinic Operations Director"
      />
    );
  }

  // If in Doctor Portal mode (3-Page Comprehensive Doctor Portal)
  if (mainView === 'doctor-portal') {
    return (
      <DoctorPortalView
        onSwitchToPatientPortal={() => {
          setMainView('patient-portal');
          setPatientPortalView('dashboard');
        }}
        onSwitchToAdminPortal={() => {
          setMainView('admin-portal');
        }}
        onSignOut={handleSignOut}
        initialDoctorId="doc-2"
      />
    );
  }

  // If in Patient Portal mode (View 1 & View 2)
  if (mainView === 'patient-portal') {
    return (
      <div className="min-h-screen w-full flex flex-col bg-slate-50 font-sans antialiased text-slate-800">
        {/* Navigation Header for Patient Portal */}
        <PatientPortalNavbar
          patientName={patientProfile.name}
          onSignOut={handleSignOut}
          onSwitchToAuth={() => setMainView('auth')}
          onSwitchToDoctorPortal={() => setMainView('doctor-portal')}
          onSwitchToAdminPortal={() => setMainView('admin-portal')}
        />

        {/* View Switcher: View 1 (Dashboard) vs View 2 (3-Step Guided Booking Wizard) */}
        <main className="flex-1 pb-16">
          <AnimatePresence mode="wait">
            {patientPortalView === 'dashboard' ? (
              <motion.div
                key="patient-dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PatientDashboardView
                  patientName={patientProfile.name}
                  patientEmail={patientProfile.email}
                  appointments={appointments}
                  historyRecords={medicalHistory}
                  onOpenBookingWizard={() => setPatientPortalView('booking-wizard')}
                  onCancelAppointment={handleCancelAppointment}
                  onRescheduleAppointment={handleRescheduleAppointment}
                  recentBookingSuccess={justBooked}
                />
              </motion.div>
            ) : (
              <motion.div
                key="booking-wizard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <BookingWizardView
                  patientName={patientProfile.name}
                  patientEmail={patientProfile.email}
                  existingAppointments={appointments}
                  onCancelWizard={() => setPatientPortalView('dashboard')}
                  onCompleteBooking={handleCompleteBooking}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    );
  }

  // Authentication Page (Split Screen)
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 font-sans antialiased text-slate-800">
      {/* 1. LEFT SIDE (Desktop only): Calming medical blue (#1a5f7a) background */}
      <LeftBrandingPane />

      {/* 2. RIGHT SIDE: Clean white form container with a centered, minimalist design */}
      <main
        id="main-auth-container"
        className="flex-1 flex flex-col justify-between min-h-screen lg:min-h-0 py-8 px-4 sm:px-8 md:px-12 lg:px-10 xl:px-16 overflow-y-auto bg-slate-50"
      >
        {/* Top bar with quick assistance info & mobile-only branding header */}
        <header className="w-full max-w-xl mx-auto flex items-center justify-between pb-4">
          {/* Mobile Header: Visible only on smaller screens where Left pane is collapsed */}
          <div className="flex lg:hidden items-center gap-2.5">
            <div className="p-1 rounded-full bg-white shadow-xs border border-slate-200">
              <ClinicLogo size={42} variant="colored" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#1a5f7a] leading-tight">
                ZARMA HOSPITAL
              </h1>
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <HeartPulse className="w-3 h-3 text-[#8bc34a]" /> Nowshera, KPK
              </span>
            </div>
          </div>

          {/* Direct shortcut buttons to view Portals immediately */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              id="btn-goto-admin-portal-header"
              onClick={() => {
                setMainView('admin-portal');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-sky-200 hover:bg-slate-800 transition-colors cursor-pointer shadow-xs border border-sky-400/20"
              title="Open Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
              <span>Admin Ops</span>
            </button>

            <button
              type="button"
              id="btn-goto-doctor-portal-header"
              onClick={() => {
                setMainView('doctor-portal');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold bg-[#1a5f7a] text-white hover:bg-[#14495e] transition-colors cursor-pointer shadow-xs"
              title="Open Doctor Portal"
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#8bc34a]" />
              <span className="hidden sm:inline">Doctor Portal</span>
            </button>

            <button
              type="button"
              id="btn-goto-patient-portal-header"
              onClick={() => {
                setMainView('patient-portal');
                setPatientPortalView('dashboard');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold bg-[#8bc34a]/15 text-[#558b2f] hover:bg-[#8bc34a]/25 transition-colors cursor-pointer border border-[#8bc34a]/30"
              title="Open Patient Portal"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#558b2f]" />
              <span className="hidden sm:inline">Patient Portal</span>
            </button>
          </div>

          {/* Clinic Help / Phone link */}
          <div className="flex items-center gap-3 text-xs">
            <a
              href="#help"
              onClick={(e) => {
                e.preventDefault();
                setIsForgotPasswordOpen(true);
              }}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-[#1a5f7a] transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Help & Support</span>
            </a>
            <div className="h-3 w-px bg-slate-200 hidden sm:block" />
            <a
              href="tel:03295992635"
              className="inline-flex items-center gap-1 font-semibold text-[#1a5f7a] hover:underline"
            >
              <PhoneCall className="w-3 h-3" />
              <span className="hidden sm:inline">03295992635</span>
            </a>
          </div>
        </header>

        {/* Centered Minimalist Form Card */}
        <div className="w-full max-w-md mx-auto my-auto py-4">
          <div
            id="auth-card"
            className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 sm:p-8 md:p-9 transition-all"
          >
            {authenticatedUser ? (
              // Authenticated State Preview
              <AuthSuccessCard
                email={authenticatedUser.email}
                role={authenticatedUser.role}
                isRegistered={authenticatedUser.isRegistered}
                onSignOut={handleSignOut}
                onOpenPortal={() => {
                  if (authenticatedUser.role === 'Doctor') {
                    setMainView('doctor-portal');
                  } else if (authenticatedUser.role === 'Admin') {
                    setMainView('admin-portal');
                  } else {
                    setMainView('patient-portal');
                    setPatientPortalView('dashboard');
                  }
                }}
              />
            ) : (
              <>
                {/* 1. Prominent Segmented Control Tab Switch: Patient | Doctor | Admin */}
                <RoleSegmentedControl
                  activeRole={activeRole}
                  onChangeRole={handleRoleChange}
                />

                {/* Form Title & Contextual Header */}
                <div className="mb-5 text-left">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    {authView === 'signin'
                      ? activeRole === 'Patient'
                        ? 'Patient Sign In'
                        : activeRole === 'Doctor'
                        ? 'Provider Sign In'
                        : 'Administrator Sign In'
                      : 'Create Patient Account'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    {authView === 'signin'
                      ? activeRole === 'Patient'
                        ? 'Enter your credentials to access your family health records, lab results, and appointments.'
                        : activeRole === 'Doctor'
                        ? 'Access the clinical EHR charting suite and assigned patient schedule.'
                        : 'Sign in to access clinic management, staff directory, and compliance.'
                      : 'Complete the registration details below to create your secure clinical patient profile.'}
                  </p>
                </div>

                {/* Animated Transition between Sign In and Patient Registration Form */}
                <AnimatePresence mode="wait" initial={false}>
                  {authView === 'signin' ? (
                    <motion.div
                      key="signin-view"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                    >
                      <SignInForm
                        activeRole={activeRole}
                        onNavigateToRegister={handleNavigateToRegister}
                        onForgotPassword={() => setIsForgotPasswordOpen(true)}
                        onLoginSuccess={handleLoginSuccess}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="register-view"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                    >
                      <RegistrationForm
                        onNavigateToSignIn={handleNavigateToSignIn}
                        onRegisterSuccess={handleRegisterSuccess}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Trust and privacy footline */}
          <div className="mt-5 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <span>Protected by ZARMA HOSPITAL Encrypted Shield</span>
            <span>•</span>
            <a href="#privacy" className="hover:text-slate-600 underline">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-slate-600 underline">Terms of Service</a>
          </div>
        </div>

        {/* Minimalist Bottom Footer */}
        <footer className="w-full max-w-xl mx-auto pt-4 text-center text-[11px] text-slate-400">
          <p>
            ZARMA HOSPITAL • Nowshera, KPK • Phone: 03295992635 • Certified Hospital & Emergency Center
          </p>
        </footer>
      </main>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
}

