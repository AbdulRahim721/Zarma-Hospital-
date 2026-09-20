import { Doctor, Appointment, MedicalHistoryItem } from '../types';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins, MD',
    specialty: 'Family Medicine & Pediatrics',
    title: 'Senior Attending Physician',
    experienceYears: 14,
    rating: 4.9,
    reviewsCount: 184,
    // Doctor leave dates in YYYY-MM-DD format
    leaveDates: [
      // Current month dates for easy testing
      '2026-09-22',
      '2026-09-23',
      '2026-09-28',
      '2026-10-05',
    ],
    workingDays: [1, 2, 3, 4, 5], // Monday - Friday
    workingHoursStart: '08:30 AM',
    workingHoursEnd: '05:00 PM',
    genderAvatar: 'female',
    bio: 'Specializing in comprehensive family healthcare, preventative screenings, pediatric wellness, and chronic symptom management.',
    location: 'Suite 402 - East Wing',
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Chen, MD',
    specialty: 'Internal Medicine & Cardiology',
    title: 'Lead Internist & Health Director',
    experienceYears: 18,
    rating: 4.95,
    reviewsCount: 230,
    leaveDates: [
      '2026-09-21',
      '2026-09-25',
      '2026-10-02',
      '2026-10-09',
    ],
    workingDays: [1, 2, 3, 4, 5, 6], // Monday - Saturday
    workingHoursStart: '09:00 AM',
    workingHoursEnd: '04:30 PM',
    genderAvatar: 'male',
    bio: 'Focuses on diagnostic internal medicine, cardiovascular wellness, hypertension management, and metabolic health.',
    location: 'Suite 408 - Diagnostic Center',
  },
  {
    id: 'doc-3',
    name: 'Dr. Elena Rostova, DO',
    specialty: "Women's Health & Primary Care",
    title: 'Family Care Physician',
    experienceYears: 10,
    rating: 4.88,
    reviewsCount: 142,
    leaveDates: [
      '2026-09-20',
      '2026-09-24',
      '2026-09-30',
    ],
    workingDays: [1, 2, 3, 4], // Monday - Thursday
    workingHoursStart: '08:30 AM',
    workingHoursEnd: '04:00 PM',
    genderAvatar: 'female',
    bio: 'Dedicated to whole-person osteopathic healthcare, annual women’s health checks, nutritional lifestyle medicine, and routine family checkups.',
    location: 'Suite 310 - Family Clinic',
  },
  {
    id: 'doc-4',
    name: 'Dr. David Patel, MD',
    specialty: 'Geriatrics & Chronic Disease Management',
    title: 'Consultant Geriatrician',
    experienceYears: 21,
    rating: 4.92,
    reviewsCount: 310,
    leaveDates: [
      '2026-09-22',
      '2026-09-26',
      '2026-10-07',
    ],
    workingDays: [2, 3, 4, 5, 6], // Tuesday - Saturday
    workingHoursStart: '09:30 AM',
    workingHoursEnd: '05:00 PM',
    genderAvatar: 'male',
    bio: 'Expertise in elderly patient care, polypharmacy review, mobility preservation, and coordinated multi-specialty care plans.',
    location: 'Suite 315 - Senior Health',
  },
];

// Helper to generate dynamic appointment timestamps
const now = new Date();

// 1. Imminent appointment: exactly 1 hour and 15 minutes away from current execution time!
// This guarantees that "less than 2 hours away" is always true regardless of when viewed.
const imminentDate = new Date(now.getTime() + 75 * 60 * 1000);
// 2. Future appointment: 3 days from now at 10:30 AM
const futureDate1 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
futureDate1.setHours(10, 30, 0, 0);
// 3. Future appointment: 6 days from now at 02:00 PM
const futureDate2 = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);
futureDate2.setHours(14, 0, 0, 0);

const formatSlotLabel = (dateObj: Date): string => {
  const startHour = dateObj.getHours();
  const startMinutes = dateObj.getMinutes();
  const endObj = new Date(dateObj.getTime() + 30 * 60 * 1000);
  const endHour = endObj.getHours();
  const endMinutes = endObj.getMinutes();

  const formatPart = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const displayMin = m < 10 ? `0${m}` : m;
    return `${displayHour}:${displayMin} ${period}`;
  };

  return `${formatPart(startHour, startMinutes)} - ${formatPart(endHour, endMinutes)}`;
};

const formatDateLabel = (dateObj: Date): string => {
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatDateIso = (dateObj: Date): string => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    doctorName: 'Dr. Sarah Jenkins, MD',
    specialty: 'Family Medicine & Pediatrics',
    doctorId: 'doc-1',
    patientName: 'Eleanor Vance',
    patientEmail: 'eleanor.vance@example.com',
    date: formatDateLabel(imminentDate),
    dateIso: formatDateIso(imminentDate),
    timeSlot: formatSlotLabel(imminentDate),
    status: 'Confirmed',
    reason: 'Urgent Routine Allergy & Skin Checkup',
    location: 'ZARMA HOSPITAL • Nowshera, KPK • Suite 402',
    scheduledTimeIso: imminentDate.toISOString(),
  },
  {
    id: 'apt-002',
    doctorName: 'Dr. Marcus Chen, MD',
    specialty: 'Internal Medicine & Cardiology',
    doctorId: 'doc-2',
    patientName: 'Eleanor Vance',
    patientEmail: 'eleanor.vance@example.com',
    date: formatDateLabel(futureDate1),
    dateIso: formatDateIso(futureDate1),
    timeSlot: '10:30 AM - 11:00 AM',
    status: 'Confirmed',
    reason: 'Annual Comprehensive Cardiovascular & Blood Panel Review',
    location: 'ZARMA HOSPITAL • Nowshera, KPK • Suite 408',
    scheduledTimeIso: futureDate1.toISOString(),
  },
  {
    id: 'apt-003',
    doctorName: 'Dr. Elena Rostova, DO',
    specialty: "Women's Health & Primary Care",
    doctorId: 'doc-3',
    patientName: 'Eleanor Vance',
    patientEmail: 'eleanor.vance@example.com',
    date: formatDateLabel(futureDate2),
    dateIso: formatDateIso(futureDate2),
    timeSlot: '02:00 PM - 02:30 PM',
    status: 'Pending Approval',
    reason: 'Follow-up Wellness Consultation & Vitamin D Guidance',
    location: 'ZARMA HOSPITAL • Nowshera, KPK • Suite 310',
    scheduledTimeIso: futureDate2.toISOString(),
  },
  {
    id: 'apt-099',
    doctorName: 'Dr. David Patel, MD',
    specialty: 'Geriatrics & Chronic Disease Management',
    doctorId: 'doc-4',
    patientName: 'Robert Vance',
    patientEmail: 'robert.vance@otherpatient.com',
    date: formatDateLabel(futureDate1),
    dateIso: formatDateIso(futureDate1),
    timeSlot: '02:30 PM - 03:00 PM',
    status: 'Confirmed',
    reason: 'Independent Patient Checkup - Confidential Chart',
    location: 'ZARMA HOSPITAL • Nowshera, KPK • Suite 315',
    scheduledTimeIso: futureDate1.toISOString(),
  },
];

export const INITIAL_MEDICAL_HISTORY: MedicalHistoryItem[] = [
  {
    id: 'hist-101',
    patientName: 'Eleanor Vance',
    patientEmail: 'eleanor.vance@example.com',
    doctorName: 'Dr. Sarah Jenkins, MD',
    specialty: 'Family Medicine & Pediatrics',
    date: 'August 14, 2026',
    diagnosis: 'Seasonal Allergic Rhinitis (Controlled)',
    prescriptions: ['Cetirizine 10mg Oral Tablets', 'Fluticasone Propionate Nasal Spray 50mcg'],
    notes: 'Patient presented with mild nasal congestion and watery eyes. Clear lungs, normal respiratory rate. Advised humidification and daily antihistamines.',
    vitalSummary: 'BP: 118/76 mmHg | Pulse: 72 bpm | Temp: 98.4°F | O2: 99%',
  },
  {
    id: 'hist-102',
    patientName: 'Eleanor Vance',
    patientEmail: 'eleanor.vance@example.com',
    doctorName: 'Dr. Marcus Chen, MD',
    specialty: 'Internal Medicine & Cardiology',
    date: 'May 02, 2026',
    diagnosis: 'Routine Annual Wellness Exam & Lipid Screening',
    prescriptions: ['Vitamin D3 2000 IU Daily Softgels'],
    notes: 'Comprehensive annual physical completed. Cardiovascular sounds normal without murmurs. EKG in normal sinus rhythm. Fasting glucose normal (88 mg/dL).',
    vitalSummary: 'BP: 120/78 mmHg | Pulse: 68 bpm | Temp: 98.6°F | BMI: 22.8',
  },
  {
    id: 'hist-103',
    patientName: 'Eleanor Vance',
    patientEmail: 'eleanor.vance@example.com',
    doctorName: 'Dr. David Patel, MD',
    specialty: 'Geriatrics & Chronic Disease Management',
    date: 'January 18, 2026',
    diagnosis: 'Mild Musculoskeletal Lower Back Strain',
    prescriptions: ['Ibuprofen 400mg As Needed', 'Referral: Outpatient Physical Therapy'],
    notes: 'Reported muscular stiffness following lifting boxes. Neurological exam intact. Recommended home stretching routine, core stabilization, and heat pack therapy.',
    vitalSummary: 'BP: 122/80 mmHg | Pulse: 74 bpm | Temp: 98.5°F',
  },
  {
    id: 'hist-199',
    patientName: 'Robert Vance',
    patientEmail: 'robert.vance@otherpatient.com',
    doctorName: 'Dr. Elena Rostova, DO',
    specialty: "Women's Health & Primary Care",
    date: 'March 11, 2026',
    diagnosis: 'Other Patient Diagnostic Panel (Strictly Confidential)',
    prescriptions: ['Confidential Rx 50mg'],
    notes: 'Other patient clinical notes must never be accessible to unauthorized patients under HIPAA privacy standards.',
    vitalSummary: 'Confidential Vitals',
  },
];

// Helper: Convert "08:30 AM" to total minutes from midnight
export const timeStringToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(' ');
  const timePart = parts[0];
  const period = parts[1]?.toUpperCase() || 'AM';
  const [hoursStr, minsStr] = timePart.split(':');
  let hours = parseInt(hoursStr, 10);
  const mins = parseInt(minsStr, 10) || 0;
  if (hours === 12) {
    hours = period === 'AM' ? 0 : 12;
  } else if (period === 'PM') {
    hours += 12;
  }
  return hours * 60 + mins;
};

// Helper: Check if slot is within doctor's working hours
export const isSlotWithinDoctorHours = (slot: string, doctor: Doctor): boolean => {
  const startHours = doctor.workingHoursStart || '08:30 AM';
  const endHours = doctor.workingHoursEnd || '05:00 PM';
  const slotMinutes = timeStringToMinutes(slot);
  const startMinutes = timeStringToMinutes(startHours);
  const endMinutes = timeStringToMinutes(endHours);
  // Slot must start on or after start time, and finish (slot + 30 mins) on or before end time
  return slotMinutes >= startMinutes && slotMinutes + 30 <= endMinutes;
};

// Helper: Check if a slot on a given date is in the past
export const isSlotInThePast = (dateIso: string, slot: string): boolean => {
  try {
    const today = new Date();
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    if (dateIso < todayIso) {
      return true; // Entire date is in the past
    }
    
    if (dateIso === todayIso) {
      // Check time
      const parts = slot.trim().split(' ');
      const [hStr, mStr] = parts[0].split(':');
      let h = parseInt(hStr, 10);
      const m = parseInt(mStr, 10) || 0;
      const period = parts[1]?.toUpperCase() || 'AM';
      if (h === 12) {
        h = period === 'AM' ? 0 : 12;
      } else if (period === 'PM') {
        h += 12;
      }
      const slotTime = new Date();
      slotTime.setHours(h, m, 0, 0);
      return slotTime.getTime() <= today.getTime();
    }
    
    return false;
  } catch {
    return false;
  }
};

export const ALL_30MIN_TIME_SLOTS: string[] = [
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
];
