import {
  DoctorAppointment,
  DoctorScheduleConfig,
  DoctorLeaveRange,
  PatientRecord,
} from '../types';

export const INITIAL_DOCTOR_APPOINTMENTS: DoctorAppointment[] = [
  // ==========================================
  // DR. MARCUS CHEN (doc-2) APPOINTMENTS
  // ==========================================
  // PENDING REQUESTS (Will show in the Top Alert Banner for Dr. Marcus Chen)
  {
    id: 'req-001',
    doctorId: 'doc-2',
    doctorName: 'Dr. Marcus Chen, MD',
    patientName: 'Liam O’Connor',
    patientEmail: 'liam.oconnor@example.com',
    patientPhone: '(555) 234-8901',
    date: 'Today, Sep 19, 2026',
    dateIso: '2026-09-19',
    timeSlot: '11:30 AM - 12:00 PM',
    startHour: 11,
    startMinute: 30,
    status: 'Pending Approval',
    reason: 'Follow-up on 24-hr Holter Monitor & Palpitations',
    room: 'Exam Room 3',
  },
  {
    id: 'req-002',
    doctorId: 'doc-2',
    doctorName: 'Dr. Marcus Chen, MD',
    patientName: 'Sophia Martinez',
    patientEmail: 'sophia.m@example.com',
    patientPhone: '(555) 789-0123',
    date: 'Today, Sep 19, 2026',
    dateIso: '2026-09-19',
    timeSlot: '01:00 PM - 01:30 PM',
    startHour: 13,
    startMinute: 0,
    status: 'Pending Approval',
    reason: 'Acute Migraine flare-up & Light Sensitivity Review',
    room: 'Consultation Suite 408',
  },
  {
    id: 'req-003',
    doctorId: 'doc-2',
    doctorName: 'Dr. Marcus Chen, MD',
    patientName: 'Lucas Vance',
    patientEmail: 'lucas.vance@example.com',
    patientPhone: '(555) 901-4433',
    date: 'Today, Sep 19, 2026',
    dateIso: '2026-09-19',
    timeSlot: '03:30 PM - 04:00 PM',
    startHour: 15,
    startMinute: 30,
    status: 'Pending Approval',
    reason: 'Fasting Lipid Panel & Statin Medication Adjustment',
    room: 'Exam Room 2',
  },

  // CONFIRMED APPOINTMENTS (Populates vertical timeline for Dr. Marcus Chen)
  {
    id: 'apt-doc-101',
    doctorId: 'doc-2',
    doctorName: 'Dr. Marcus Chen, MD',
    patientName: 'Eleanor Vance',
    patientEmail: 'eleanor.vance@example.com',
    patientPhone: '(555) 019-2834',
    date: 'Today, Sep 19, 2026',
    dateIso: '2026-09-19',
    timeSlot: '08:30 AM - 09:00 AM',
    startHour: 8,
    startMinute: 30,
    status: 'Confirmed',
    reason: 'Essential Hypertension & Lifestyle Counseling',
    room: 'Suite 408 - Exam Room 1',
    vitalSummary: 'BP: 128/82 mmHg | Pulse: 70 bpm | SpO2: 99%',
  },
  {
    id: 'apt-doc-102',
    doctorId: 'doc-2',
    doctorName: 'Dr. Marcus Chen, MD',
    patientName: 'Robert Sterling',
    patientEmail: 'robert.sterling@example.com',
    patientPhone: '(555) 832-1100',
    date: 'Today, Sep 19, 2026',
    dateIso: '2026-09-19',
    timeSlot: '09:30 AM - 10:00 AM',
    startHour: 9,
    startMinute: 30,
    status: 'Confirmed',
    reason: 'Pre-Operative Clearance & Cardiac Auscultation',
    room: 'Suite 408 - Exam Room 2',
    vitalSummary: 'BP: 122/78 mmHg | Pulse: 68 bpm | Temp: 98.6°F',
  },
  {
    id: 'apt-doc-103',
    doctorId: 'doc-2',
    doctorName: 'Dr. Marcus Chen, MD',
    patientName: 'Emily Watson',
    patientEmail: 'emily.w@example.com',
    patientPhone: '(555) 912-3456',
    date: 'Today, Sep 19, 2026',
    dateIso: '2026-09-19',
    timeSlot: '10:30 AM - 11:00 AM',
    startHour: 10,
    startMinute: 30,
    status: 'Confirmed',
    reason: 'Annual Comprehensive Physical & Thyroid Ultrasound Review',
    room: 'Suite 408 - Exam Room 1',
    vitalSummary: 'BP: 116/74 mmHg | Pulse: 66 bpm | SpO2: 100%',
  },
  {
    id: 'apt-doc-104',
    doctorId: 'doc-2',
    doctorName: 'Dr. Marcus Chen, MD',
    patientName: 'James Wilson',
    patientEmail: 'james.wilson@example.com',
    patientPhone: '(555) 345-6789',
    date: 'Today, Sep 19, 2026',
    dateIso: '2026-09-19',
    timeSlot: '02:00 PM - 02:30 PM',
    startHour: 14,
    startMinute: 0,
    status: 'Confirmed',
    reason: 'Post-Surgical Suture Evaluation & Mobility Check',
    room: 'Suite 408 - Exam Room 3',
    vitalSummary: 'BP: 130/84 mmHg | Pulse: 76 bpm',
  },
  {
    id: 'apt-doc-105',
    doctorId: 'doc-2',
    doctorName: 'Dr. Marcus Chen, MD',
    patientName: 'Michael Chang',
    patientEmail: 'michael.c@example.com',
    patientPhone: '(555) 678-9012',
    date: 'Today, Sep 19, 2026',
    dateIso: '2026-09-19',
    timeSlot: '04:00 PM - 04:30 PM',
    startHour: 16,
    startMinute: 0,
    status: 'Confirmed',
    reason: 'Seasonal Bronchospasm & Inhaler Technique Assessment',
    room: 'Suite 408 - Exam Room 2',
    vitalSummary: 'BP: 120/80 mmHg | Pulse: 78 bpm | SpO2: 97%',
  },

  // ==========================================
  // DR. SARAH JENKINS (doc-1) APPOINTMENTS
  // ==========================================
  {
    id: 'req-jenkins-01',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins, MD',
    patientName: 'Clara Barton',
    patientEmail: 'clara.b@example.com',
    patientPhone: '(555) 321-7654',
    date: 'Today, Sep 19, 2026',
    dateIso: '2026-09-19',
    timeSlot: '11:00 AM - 11:30 AM',
    startHour: 11,
    startMinute: 0,
    status: 'Pending Approval',
    reason: 'Pediatric Ear Infection & Otoscopy Check',
    room: 'Suite 402 - Exam Room A',
  },
  {
    id: 'apt-jenkins-01',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins, MD',
    patientName: 'Oliver Taylor',
    patientEmail: 'oliver.taylor@example.com',
    patientPhone: '(555) 777-8899',
    date: 'Today, Sep 19, 2026',
    dateIso: '2026-09-19',
    timeSlot: '09:00 AM - 09:30 AM',
    startHour: 9,
    startMinute: 0,
    status: 'Confirmed',
    reason: 'Annual Pediatric Well-Child Exam & Immunizations',
    room: 'Suite 402 - Exam Room B',
    vitalSummary: 'Weight: 28kg | Height: 128cm | Temp: 98.6°F',
  },

  // ==========================================
  // DR. ELENA ROSTOVA (doc-3) APPOINTMENTS
  // ==========================================
  {
    id: 'apt-rostova-01',
    doctorId: 'doc-3',
    doctorName: 'Dr. Elena Rostova, DO',
    patientName: 'Maya Lin',
    patientEmail: 'maya.lin@example.com',
    patientPhone: '(555) 998-1122',
    date: 'Today, Sep 19, 2026',
    dateIso: '2026-09-19',
    timeSlot: '10:00 AM - 10:30 AM',
    startHour: 10,
    startMinute: 0,
    status: 'Confirmed',
    reason: 'Routine Annual Wellness & Nutritional Counseling',
    room: 'Suite 310 - Consultation A',
    vitalSummary: 'BP: 112/70 mmHg | Pulse: 64 bpm',
  },

  // ==========================================
  // DR. DAVID PATEL (doc-4) APPOINTMENTS
  // ==========================================
  {
    id: 'apt-patel-01',
    doctorId: 'doc-4',
    doctorName: 'Dr. David Patel, MD',
    patientName: 'David Kim',
    patientEmail: 'david.kim@example.com',
    patientPhone: '(555) 456-7890',
    date: 'Today, Sep 19, 2026',
    dateIso: '2026-09-19',
    timeSlot: '09:30 AM - 10:00 AM',
    startHour: 9,
    startMinute: 30,
    status: 'Confirmed',
    reason: 'Geriatric Polypharmacy & Osteoarthritis Follow-up',
    room: 'Suite 315 - Exam Room 1',
    vitalSummary: 'BP: 126/80 mmHg | Pulse: 70 bpm',
  },
];

export const INITIAL_SCHEDULE_CONFIG: DoctorScheduleConfig = {
  workingDays: [1, 2, 3, 4, 5, 6], // Mon - Sat for Dr. Chen
  startTime: '09:00 AM',
  endTime: '04:30 PM',
  lunchStart: '12:30 PM',
  lunchEnd: '01:30 PM',
  slotDurationMinutes: 30,
};

export const INITIAL_DOCTOR_SCHEDULES: Record<string, DoctorScheduleConfig> = {
  'doc-1': {
    workingDays: [1, 2, 3, 4, 5],
    startTime: '08:30 AM',
    endTime: '05:00 PM',
    lunchStart: '12:00 PM',
    lunchEnd: '01:00 PM',
    slotDurationMinutes: 30,
  },
  'doc-2': {
    workingDays: [1, 2, 3, 4, 5, 6],
    startTime: '09:00 AM',
    endTime: '04:30 PM',
    lunchStart: '12:30 PM',
    lunchEnd: '01:30 PM',
    slotDurationMinutes: 30,
  },
  'doc-3': {
    workingDays: [1, 2, 3, 4],
    startTime: '08:30 AM',
    endTime: '04:00 PM',
    lunchStart: '12:00 PM',
    lunchEnd: '01:00 PM',
    slotDurationMinutes: 30,
  },
  'doc-4': {
    workingDays: [2, 3, 4, 5, 6],
    startTime: '09:30 AM',
    endTime: '05:00 PM',
    lunchStart: '01:00 PM',
    lunchEnd: '02:00 PM',
    slotDurationMinutes: 30,
  },
};

export const INITIAL_LEAVE_RANGES: DoctorLeaveRange[] = [
  {
    id: 'leave-001',
    startDateIso: '2026-09-25',
    endDateIso: '2026-09-27',
    reason: 'Annual Internal Medicine & Cardiology Symposium',
    createdAt: '2026-09-10',
  },
  {
    id: 'leave-002',
    startDateIso: '2026-10-08',
    endDateIso: '2026-10-10',
    reason: 'Continuing Medical Education (CME) Workshop',
    createdAt: '2026-09-15',
  },
];

export const INITIAL_DOCTOR_LEAVES: Record<string, DoctorLeaveRange[]> = {
  'doc-1': [
    {
      id: 'leave-j1',
      startDateIso: '2026-09-22',
      endDateIso: '2026-09-23',
      reason: 'Pediatric Infectious Disease Conference',
      createdAt: '2026-09-01',
    },
  ],
  'doc-2': [
    {
      id: 'leave-001',
      startDateIso: '2026-09-25',
      endDateIso: '2026-09-27',
      reason: 'Annual Internal Medicine & Cardiology Symposium',
      createdAt: '2026-09-10',
    },
  ],
  'doc-3': [
    {
      id: 'leave-r1',
      startDateIso: '2026-09-20',
      endDateIso: '2026-09-20',
      reason: 'Integrative Women’s Health Webinar',
      createdAt: '2026-09-05',
    },
  ],
  'doc-4': [
    {
      id: 'leave-p1',
      startDateIso: '2026-09-26',
      endDateIso: '2026-09-26',
      reason: 'Geriatric Care Advisory Board',
      createdAt: '2026-09-08',
    },
  ],
};

export const INITIAL_PATIENT_RECORDS: PatientRecord[] = [
  {
    id: 'pt-001',
    doctorId: 'doc-2',
    primaryPhysician: 'Dr. Marcus Chen, MD',
    name: 'Eleanor Vance',
    dob: '1984-06-14',
    age: 42,
    gender: 'Female',
    bloodType: 'A+',
    allergies: ['Penicillin (Hives/Urticaria)', 'Latex (Contact Dermatitis)'],
    phone: '(555) 019-2834',
    email: 'eleanor.vance@example.com',
    pastVisits: [
      {
        id: 'visit-101',
        attendingDoctorId: 'doc-2',
        date: 'Aug 14, 2026',
        visitType: 'Routine Hypertension & Lipid Follow-Up',
        status: 'Completed',
        attendingPhysician: 'Dr. Marcus Chen, MD',
        diagnosis: 'Stage 1 Essential Hypertension (Improving, Well-Tolerated)',
        vitals: 'BP: 128/82 mmHg | Pulse: 70 bpm | Temp: 98.4°F | BMI: 23.1',
        prescriptions: ['Amlodipine 5mg Oral Daily', 'CoQ10 100mg Dietary Supplement'],
        summary:
          'Patient adhering well to low-sodium dietary modifications. Ambulatory home blood pressure logs review shows average systolic reading of 126 mmHg. Cardiovascular examination normal with S1/S2 present, no audible gallop or murmur.',
      },
      {
        id: 'visit-102',
        attendingDoctorId: 'doc-2',
        date: 'May 02, 2026',
        visitType: 'Annual Comprehensive Cardiovascular Screening',
        status: 'Completed',
        attendingPhysician: 'Dr. Marcus Chen, MD',
        diagnosis: 'Mild Dyslipidemia & Borderline Elevated Blood Pressure',
        vitals: 'BP: 136/88 mmHg | Pulse: 74 bpm | Temp: 98.6°F | BMI: 23.4',
        prescriptions: ['Rosuvastatin 10mg Oral Bedtime'],
        summary:
          'Comprehensive annual wellness examination. Fasting total cholesterol 214 mg/dL with LDL 132 mg/dL. Resting 12-lead EKG verified normal sinus rhythm without ischemic changes. Initiated moderate-intensity statin and recommended aerobic exercise 150 min/week.',
      },
      {
        id: 'visit-103',
        attendingDoctorId: 'doc-1',
        date: 'Jan 12, 2026',
        visitType: 'Acute Upper Respiratory Symptom Consult',
        status: 'Discharged',
        attendingPhysician: 'Dr. Sarah Jenkins, MD',
        diagnosis: 'Viral Pharyngitis & Rhinorrhea',
        vitals: 'BP: 120/78 mmHg | Pulse: 72 bpm | Temp: 99.1°F | SpO2: 99%',
        prescriptions: ['Benzonatate 100mg TID', 'Saline Nasal Irrigation'],
        summary:
          'Negative rapid Strep antigen and negative COVID-19 PCR. Prescribed supportive symptomatic relief and hydration protocol.',
      },
    ],
    consultationNotes: `SUBJECTIVE:
Patient presents today for scheduled hypertension check and general wellness review. Reports compliant daily intake of Amlodipine 5mg each morning. No dizziness, orthostatic symptoms, palpitations, or peripheral edema noted in lower extremities. Maintains daily 30-minute brisk walking routine.

OBJECTIVE:
- General: Well-appearing female in no acute distress, alert and oriented x4.
- Vitals: BP 124/80 mmHg right arm sitting, Heart Rate 68 bpm regular rhythm, SpO2 99% ambient air.
- Cardiovascular: Normal S1/S2, regular rate and rhythm. No murmurs, rubs, or gallops. Peripheral pulses 2+ symmetric.
- Respiratory: Clear to auscultation bilaterally throughout all lung fields. No wheezing or rales.
- Extremities: Warm and well-perfused. No trace pretibial edema.

ASSESSMENT:
Stage 1 Essential Hypertension, currently well-controlled under current pharmacological regimen and lifestyle adjustments.

PLAN:
1. Continue Amlodipine 5mg oral daily.
2. Recheck comprehensive metabolic panel (CMP) and fasting lipid panel in 6 months.
3. Advise patient to maintain low-sodium DASH diet guidelines.
4. Follow-up consultation scheduled in 6 months or sooner if home BP exceeds 140/90 mmHg.`,
    isNotesLocked: false,
  },
  {
    id: 'pt-002',
    doctorId: 'doc-2',
    primaryPhysician: 'Dr. Marcus Chen, MD',
    name: 'James Wilson',
    dob: '1968-11-23',
    age: 58,
    gender: 'Male',
    bloodType: 'O+',
    allergies: ['Sulfa Antibiotics', 'Codeine'],
    phone: '(555) 345-6789',
    email: 'james.wilson@example.com',
    pastVisits: [
      {
        id: 'visit-201',
        attendingDoctorId: 'doc-2',
        date: 'Sep 05, 2026',
        visitType: 'Post-Op Knee Arthroscopy Wound Check',
        status: 'Completed',
        attendingPhysician: 'Dr. Marcus Chen, MD',
        diagnosis: 'Normal Healing Surgical Incision - Right Knee',
        vitals: 'BP: 130/84 mmHg | Pulse: 76 bpm | Temp: 98.5°F',
        prescriptions: ['Acetaminophen 500mg PRN', 'Physical Therapy Protocol Phase 2'],
        summary:
          'Surgical port incisions clean, intact without erythema, purulent drainage, or warmth. Active range of motion 0 to 110 degrees with minimal pain. Quadriceps activation intact.',
      },
      {
        id: 'visit-202',
        attendingDoctorId: 'doc-2',
        date: 'Feb 19, 2026',
        visitType: 'Metabolic Syndrome & HbA1c Monitoring',
        status: 'Follow-up Recommended',
        attendingPhysician: 'Dr. Marcus Chen, MD',
        diagnosis: 'Prediabetes (HbA1c 5.9%) & Moderate Hepatic Steatosis',
        vitals: 'BP: 134/86 mmHg | Pulse: 78 bpm | BMI: 27.8',
        prescriptions: ['Metformin 500mg Extended Release Daily'],
        summary:
          'Laboratory workup reviewed. Advised carbohydrate restriction and nutritional referral for Mediterranean meal structuring.',
      },
    ],
    consultationNotes: `SUBJECTIVE:
Follow-up on post-operative knee recovery. Patient reports walking without crutches and attending physical therapy twice weekly. Pain scores consistently below 2/10.

OBJECTIVE:
Right knee incisions fully epithelialized. No joint effusion. Negative anterior drawer sign. Normal gait demonstrated.

ASSESSMENT & PLAN:
Satisfactory post-operative progress. Approved for low-impact stationary cycling and continued strengthening exercises.`,
    isNotesLocked: true,
    lockedAt: 'Sep 05, 2026 14:45',
    lockedBy: 'Dr. Marcus Chen, MD',
  },
  {
    id: 'pt-003',
    doctorId: 'doc-2',
    primaryPhysician: 'Dr. Marcus Chen, MD',
    name: 'Sophia Martinez',
    dob: '1997-03-08',
    age: 29,
    gender: 'Female',
    bloodType: 'B+',
    allergies: ['No Known Drug Allergies (NKDA)'],
    phone: '(555) 789-0123',
    email: 'sophia.m@example.com',
    pastVisits: [
      {
        id: 'visit-301',
        attendingDoctorId: 'doc-2',
        date: 'Jun 18, 2026',
        visitType: 'Neurological Migraine Evaluation',
        status: 'Completed',
        attendingPhysician: 'Dr. Marcus Chen, MD',
        diagnosis: 'Migraine with Visual Aura (Unilateral Throbbing)',
        vitals: 'BP: 114/72 mmHg | Pulse: 64 bpm | Temp: 98.4°F',
        prescriptions: ['Sumatriptan 50mg PRN at onset', 'Magnesium Glycinate 400mg Daily'],
        summary:
          'Detailed neurological examination cranial nerves II-XII intact. Funduscopic exam normal without papilledema. Advised migraine trigger diary.',
      },
    ],
    consultationNotes: `SUBJECTIVE:
Follow-up for episodic migraine frequency. Patient reports reduction from 4 episodes per month down to 1 episode following magnesium supplementation.

OBJECTIVE:
Neurological status stable. Normal finger-to-nose and tandem gait.

PLAN:
Maintain current prophylactic regimen. Rescue medication refills verified.`,
    isNotesLocked: false,
  },
  {
    id: 'pt-004',
    doctorId: 'doc-4',
    primaryPhysician: 'Dr. David Patel, MD',
    name: 'David Kim',
    dob: '1961-09-30',
    age: 65,
    gender: 'Male',
    bloodType: 'AB+',
    allergies: ['Aspirin (Bronchospasm)', 'Ibuprofen'],
    phone: '(555) 456-7890',
    email: 'david.kim@example.com',
    pastVisits: [
      {
        id: 'visit-401',
        attendingDoctorId: 'doc-4',
        date: 'Jul 22, 2026',
        visitType: 'Geriatric Comprehensive Health & Polypharmacy Review',
        status: 'Completed',
        attendingPhysician: 'Dr. David Patel, MD',
        diagnosis: 'Osteoarthritis Knees Bilateral & Borderline BPH',
        vitals: 'BP: 126/80 mmHg | Pulse: 70 bpm | Temp: 98.2°F',
        prescriptions: ['Tamsulosin 0.4mg Daily', 'Topical Diclofenac 1% Gel'],
        summary:
          'Medication reconciliation completed. Mobility evaluation showed steady gait without assistive devices.',
      },
    ],
    consultationNotes: `SUBJECTIVE:
Routine health maintenance and blood work review.

OBJECTIVE:
Fasting glucose 92 mg/dL, Cr 0.9, eGFR > 60 mL/min.

PLAN:
Continue current medications and annual vaccination updates.`,
    isNotesLocked: false,
  },
  {
    id: 'pt-005',
    doctorId: 'doc-1',
    primaryPhysician: 'Dr. Sarah Jenkins, MD',
    name: 'Oliver Taylor',
    dob: '2017-04-12',
    age: 9,
    gender: 'Male',
    bloodType: 'O-',
    allergies: ['Peanuts (Anaphylaxis - EpiPen Carried)'],
    phone: '(555) 777-8899',
    email: 'oliver.taylor@example.com',
    pastVisits: [
      {
        id: 'visit-501',
        attendingDoctorId: 'doc-1',
        date: 'Aug 20, 2026',
        visitType: 'Pediatric Asthma & Allergy Action Plan',
        status: 'Completed',
        attendingPhysician: 'Dr. Sarah Jenkins, MD',
        diagnosis: 'Mild Intermittent Asthma & Seasonal Allergic Rhinitis',
        vitals: 'BP: 102/65 mmHg | Pulse: 88 bpm | Temp: 98.6°F | SpO2: 100%',
        prescriptions: ['Albuterol HFA Inhaler 2 puffs Q4-6H PRN', 'Cetirizine 5mg Daily'],
        summary:
          'Asthma control test score 23. Growth percentiles on 65th percentile. Clear lung fields.',
      },
    ],
    consultationNotes: `SUBJECTIVE:
Annual school clearance physical. No nighttime coughing episodes.

OBJECTIVE:
Height 134cm, weight 30kg. Normal heart sounds, clear lungs.

PLAN:
Sign school medication authorization forms. Provide updated EpiPen prescription.`,
    isNotesLocked: false,
  },
  {
    id: 'pt-006',
    doctorId: 'doc-3',
    primaryPhysician: 'Dr. Elena Rostova, DO',
    name: 'Maya Lin',
    dob: '1992-07-19',
    age: 34,
    gender: 'Female',
    bloodType: 'A-',
    allergies: ['No Known Drug Allergies (NKDA)'],
    phone: '(555) 998-1122',
    email: 'maya.lin@example.com',
    pastVisits: [
      {
        id: 'visit-601',
        attendingDoctorId: 'doc-3',
        date: 'Jun 10, 2026',
        visitType: 'Preconception Counseling & Annual Well-Woman',
        status: 'Completed',
        attendingPhysician: 'Dr. Elena Rostova, DO',
        diagnosis: 'Routine Well-Woman Examination',
        vitals: 'BP: 112/70 mmHg | Pulse: 64 bpm | Temp: 98.4°F',
        prescriptions: ['Prenatal Multivitamin with Methylfolate 800mcg Daily'],
        summary:
          'Normal cervical cytology on file. Pelvic exam normal. Immunization titers verified.',
      },
    ],
    consultationNotes: `SUBJECTIVE:
Preconception health review. Nutrition and exercise regimen optimization.

OBJECTIVE:
Normal thyroid palpation, cardiovascular within normal limits.

PLAN:
Start prenatal vitamin supplementation. Schedule initial baseline obstetric lab panel.`,
    isNotesLocked: false,
  },
];
