// Types
export interface Medicine {
  name: string;
  dosage: string; // e.g., "1-0-1"
  duration: string; // e.g., "5 days"
  instructions: string; // e.g., "After food"
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medicines: Medicine[];
  notes: string;
  signature: string;
}

export interface Message {
  sender: 'patient' | 'doctor';
  text: string;
  time: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  hospitalId: string;
  hospitalName: string;
  date: string;
  timeSlot: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'video' | 'in-person';
  reason: string;
  fee: number;
  chatHistory: Message[];
  prescriptionId?: string;
  reportId?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviewsCount: number;
  clinicName: string;
  locality: string;
  fee: number;
  bio: string;
  imageUrl: string;
  availability: {
    days: string[]; // e.g., ["Mon", "Wed", "Fri"]
    slots: string[]; // e.g., ["09:00 AM", "10:30 AM"]
  };
  hospitalId: string;
  hospitalName: string;
  status: 'active' | 'pending'; // For admin verification flow
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  rating: number;
  bedsTotal: number;
  bedsOccupied: number;
  departments: string[];
  revenue: number[]; // Last 6 months
  doctorsCount: number;
  imageUrl: string;
  status: 'approved' | 'pending';
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
  bloodType: string;
  medicalHistory: string[];
  allergies: string[];
}

export interface MedicalReport {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  title: string;
  category: string;
  result: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
}

export interface Notification {
  id: string;
  userId: string;
  role: 'patient' | 'doctor' | 'hospital' | 'admin';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// Generators
const SPECIALTIES = [
  'Cardiology', 'Dermatology', 'Paediatrics', 'Orthopaedics', 
  'Neurology', 'Gynecology', 'General Medicine', 'ENT', 
  'Psychiatry', 'Ophthalmology'
];

const LOCALITIES = [
  'Kakkanad', 'Edappally', 'Aluva', 'Thrippunithura', 'Kalamassery', 
  'Angamaly', 'Fort Kochi', 'Marine Drive', 'Kaloor', 'Vytila'
];

const DOCTOR_NAMES = [
  'Haridas Menon', 'Anjali Nair', 'Siddharth Kurian', 'Thomas Abraham', 'Faisal Rahman',
  'Rohan Varghese', 'Sneha Pillai', 'Amit Sen', 'Neha Joseph', 'Arjun Madhavan',
  'Meera Krishnan', 'Rahul Bose', 'Divya Iyer', 'Sanjay Dutt', 'Kriti Sanon',
  'Varun Dhawan', 'Shraddha Kapoor', 'Aditya Roy', 'Alia Bhatt', 'Ranbir Kapoor'
];

const HOSPITAL_NAMES = [
  'Aster Medcity', 'Rajagiri Hospital', 'Amrita Hospital', 'Renai Medicity', 
  'Lakeshore Hospital', 'VPS Lakeshore', 'Sunrise Hospital', 'Medical Trust Hospital',
  'Gautham Hospital', 'Silver Line Clinic', 'Saraf Hospital', 'PVS Memorial Hospital',
  'Cochin Hospital', 'City Clinic Kochi'
];

const DEPARTMENTS_LIST = [
  'Cardiology', 'Dermatology', 'Paediatrics', 'Orthopaedics', 'Neurology', 
  'Gynecology & Obstetrics', 'Oncology', 'Emergency Medicine', 'Ophthalmology', 
  'Outpatient Clinic', 'ICU', 'Radiology'
];

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Aavya', 'Diya', 'Ananya',
  'Ishaan', 'Shaurya', 'Aanya', 'Pihu', 'Prisha', 'Rohan', 'Kabir', 'Riya', 'Kavya', 'Myra',
  'Dev', 'Atharv', 'Kiara', 'Anya', 'Samaira', 'Siddharth', 'Varun', 'Gaurav', 'Tara', 'Anika'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Nair', 'Menon', 'Reddy', 'Patel', 'Kapoor', 'Mehta', 'Krishnan', 'Bose',
  'Iyer', 'Sen', 'Varghese', 'Kurian', 'Abraham', 'Nambiar', 'Pillai', 'Panicker', 'Shenoy', 'Gupta'
];

// Helper functions
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomRating = (): number => parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)); // 3.5 to 5.0

// Seed data generators
export function generateSeedData() {
  console.log("Generating realistic seed data...");
  
  // 1. Generate Hospitals
  const hospitals: Hospital[] = HOSPITAL_NAMES.map((name, index) => {
    const isApproved = index < 12 ? 'approved' : 'pending'; // pending hospitals for admin review
    const bedsTotal = getRandomInt(80, 300);
    const bedsOccupied = getRandomInt(30, bedsTotal - 10);
    const deptsCount = getRandomInt(5, 9);
    const depts = [...DEPARTMENTS_LIST].sort(() => 0.5 - Math.random()).slice(0, deptsCount);
    
    // Last 6 months revenue in INR (₹)
    const revenue = Array.from({ length: 6 }, () => getRandomInt(450000, 1200000));
    
    return {
      id: `hosp-${index + 1}`,
      name,
      address: `${getRandomInt(10, 299)}, ${getRandomItem(LOCALITIES)}, Kochi, Kerala`,
      rating: getRandomRating(),
      bedsTotal,
      bedsOccupied,
      departments: depts,
      revenue,
      doctorsCount: 0, // will increment later
      imageUrl: `https://images.unsplash.com/photo-${index % 2 === 0 ? '1587351021759-3e566b6af7cc' : '1519494026892-80bbd2d6fd0d'}?auto=format&fit=crop&q=80&w=400`,
      status: isApproved
    };
  });

  // 2. Generate Doctors
  const doctors: Doctor[] = [];
  
  for (let i = 0; i < 60; i++) {
    const isPending = i >= 56; // 4 pending doctors for admin verification flow
    const hosp = getRandomItem(hospitals.filter(h => h.status === 'approved'));
    hosp.doctorsCount += 1;
    
    const specialty = i < SPECIALTIES.length ? SPECIALTIES[i] : getRandomItem(SPECIALTIES);
    const name = i < DOCTOR_NAMES.length ? `Dr. ${DOCTOR_NAMES[i]}` : `Dr. ${getRandomItem(FIRST_NAMES)} ${getRandomItem(LAST_NAMES)}`;
    const rating = getRandomRating();
    const reviewsCount = getRandomInt(10, 240);
    const fee = getRandomItem([300, 400, 500, 700, 800, 1000]);
    const experience = getRandomInt(4, 28);
    
    const availabilityDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const daysCount = getRandomInt(3, 5);
    const days = [...availabilityDays].sort(() => 0.5 - Math.random()).slice(0, daysCount);
    const slots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
    
    doctors.push({
      id: `doc-${i + 1}`,
      name,
      specialty,
      experience,
      rating,
      reviewsCount,
      clinicName: hosp.name,
      locality: hosp.address.split(',')[1].trim(),
      fee,
      bio: `${name} is an experienced specialist in ${specialty} at ${hosp.name}. Specializing in modern medical practices and diagnostics with ${experience} years of clinical research. Dedicated to providing patient-centered, empathetic care in Kerala.`,
      imageUrl: `https://images.unsplash.com/photo-${i % 2 === 0 ? '1622253692010-333f2da6031d' : '1537368910025-700350fe46c7'}?auto=format&fit=crop&q=80&w=200`,
      availability: {
        days: days.sort((a,b) => availabilityDays.indexOf(a) - availabilityDays.indexOf(b)),
        slots: slots.sort()
      },
      hospitalId: hosp.id,
      hospitalName: hosp.name,
      status: isPending ? 'pending' : 'active'
    });
  }

  // 3. Generate Patients
  const patients: Patient[] = Array.from({ length: 100 }, (_, i) => {
    const fName = getRandomItem(FIRST_NAMES);
    const lName = getRandomItem(LAST_NAMES);
    const age = getRandomInt(18, 75);
    const gender = Math.random() > 0.5 ? 'Male' : 'Female';
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@example.com`;
    const phone = `${getRandomInt(700, 999)}${getRandomInt(100, 999)}${getRandomInt(1000, 9999)}`;
    const bloodType = getRandomItem(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
    
    const medHistoryPool = [
      'Hypertension (Managed)', 'Type 2 Diabetes', 'Seasonal Allergies', 
      'Mild Asthma', 'None', 'None', 'None', 'GERD', 'Hyperthyroidism', 
      'Vitamin D Deficiency', 'Chronic Migraines'
    ];
    
    const allergyPool = ['Penicillin', 'Dust', 'Peanuts', 'Pollen', 'Shellfish', 'Sulfa Drugs', 'None', 'None'];
    
    return {
      id: `pat-${i + 1}`,
      name: `${fName} ${lName}`,
      email,
      phone,
      gender,
      age,
      bloodType,
      medicalHistory: [getRandomItem(medHistoryPool)].filter(h => h !== 'None'),
      allergies: [getRandomItem(allergyPool)].filter(a => a !== 'None')
    };
  });

  // Pre-seed some Appointments for demonstration (around 20 past and 5 upcoming)
  const appointments: Appointment[] = [];
  const prescriptions: Prescription[] = [];
  const reports: MedicalReport[] = [];
  
  // Set the active patient as pat-active (Hari Krishnan)
  patients[0].id = 'pat-active';
  patients[0].name = 'Hari Krishnan';
  patients[0].email = 'patient@doctorsin.com';
  patients[0].phone = '9876543210';
  patients[0].age = 29;
  patients[0].gender = 'Male';
  patients[0].bloodType = 'O+';
  patients[0].medicalHistory = ['Mild Asthma'];
  patients[0].allergies = ['Penicillin'];

  const activeDocIds = doctors.filter(d => d.status === 'active').map(d => d.id);
  const getDoc = (id: string) => doctors.find(d => d.id === id)!;

  // Seeding active patient appointments
  const activeApptsData = [
    { id: 'appt-a1', date: '2026-06-15', slot: '10:00 AM', status: 'completed', type: 'video', reason: 'Routine checkup for asthma' },
    { id: 'appt-a2', date: '2026-06-22', slot: '11:00 AM', status: 'completed', type: 'in-person', reason: 'Skin rash inspection' },
    { id: 'appt-a3', date: '2026-06-29', slot: '02:00 PM', status: 'cancelled', type: 'video', reason: 'Fever consultation' },
    { id: 'appt-a4', date: '2026-07-02', slot: '10:00 AM', status: 'upcoming', type: 'video', reason: 'Follow-up for asthma treatment' },
    { id: 'appt-a5', date: '2026-07-05', slot: '03:00 PM', status: 'upcoming', type: 'in-person', reason: 'General fitness check' },
  ] as const;

  activeApptsData.forEach((a, index) => {
    const docId = activeDocIds[index % activeDocIds.length];
    const doc = getDoc(docId);
    
    const appt: Appointment = {
      id: a.id,
      patientId: 'pat-active',
      patientName: 'Hari Krishnan',
      doctorId: docId,
      doctorName: doc.name,
      doctorSpecialty: doc.specialty,
      hospitalId: doc.hospitalId,
      hospitalName: doc.hospitalName,
      date: a.date,
      timeSlot: a.slot,
      status: a.status,
      type: a.type,
      reason: a.reason,
      fee: doc.fee,
      chatHistory: [
        { sender: 'doctor', text: 'Hello Hari! Let me know if you are experiencing any symptoms.', time: '09:55 AM' },
        { sender: 'patient', text: 'Hi Doctor, yes, just some mild breathing tightness.', time: '09:57 AM' }
      ]
    };

    if (a.status === 'completed') {
      const rxId = `rx-${appt.id}`;
      appt.prescriptionId = rxId;
      
      prescriptions.push({
        id: rxId,
        appointmentId: appt.id,
        patientId: 'pat-active',
        patientName: 'Hari Krishnan',
        doctorId: docId,
        doctorName: doc.name,
        date: appt.date,
        medicines: [
          { name: 'Albuterol Inhaler', dosage: '1-0-1', duration: '30 days', instructions: 'As needed for tightness' },
          { name: 'Montelukast 10mg', dosage: '0-0-1', duration: '14 days', instructions: 'Take before sleeping' }
        ],
        notes: 'Avoid cold drinks and high-dust areas. Do cardiovascular exercises regularly.',
        signature: doc.name
      });

      const repId = `rep-${appt.id}`;
      appt.reportId = repId;
      reports.push({
        id: repId,
        patientId: 'pat-active',
        patientName: 'Hari Krishnan',
        date: appt.date,
        title: index === 0 ? 'Pulmonary Function Test (PFT)' : 'Complete Blood Count (CBC)',
        category: index === 0 ? 'Pulmonology' : 'Diagnostic Lab',
        result: index === 0 ? 'FEV1/FVC ratio is 78% (Within Normal limits, stable mild asthma)' : 'WBC, RBC, and Platelets are within physiological ranges.',
        status: 'Normal'
      });
    }
    appointments.push(appt);
  });

  // Seed 20 random appointments for other patients
  for (let i = 0; i < 20; i++) {
    const patient = getRandomItem(patients.filter(p => p.id !== 'pat-active'));
    const docId = getRandomItem(activeDocIds);
    const doc = getDoc(docId);
    const status = getRandomItem(['completed', 'completed', 'upcoming', 'cancelled']) as Appointment['status'];
    const type = getRandomItem(['video', 'in-person']) as Appointment['type'];
    
    const dayOffset = getRandomInt(-15, 10);
    const apptDate = new Date();
    apptDate.setDate(apptDate.getDate() + dayOffset);
    const dateStr = apptDate.toISOString().split('T')[0];

    const appt: Appointment = {
      id: `appt-seed-${i + 1}`,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: docId,
      doctorName: doc.name,
      doctorSpecialty: doc.specialty,
      hospitalId: doc.hospitalId,
      hospitalName: doc.hospitalName,
      date: dateStr,
      timeSlot: getRandomItem(["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]),
      status,
      type,
      reason: getRandomItem(['High blood pressure', 'Allergic reaction check', 'Severe headache', 'Joint pain', 'Routine wellness check', 'Child vaccination']),
      fee: doc.fee,
      chatHistory: []
    };

    if (status === 'completed') {
      const rxId = `rx-seed-${i + 1}`;
      appt.prescriptionId = rxId;
      prescriptions.push({
        id: rxId,
        appointmentId: appt.id,
        patientId: patient.id,
        patientName: patient.name,
        doctorId: docId,
        doctorName: doc.name,
        date: dateStr,
        medicines: [
          { name: getRandomItem(['Amoxicillin', 'Lisinopril', 'Paracetamol 650mg', 'Levocetirizine']), dosage: '1-0-1', duration: '5 days', instructions: 'Post meals' }
        ],
        notes: 'Rest well and consume plenty of fluids. Follow up if symptoms persist.',
        signature: doc.name
      });
    }
    appointments.push(appt);
  }

  // Create notifications pool
  const notifications: Notification[] = [
    { id: 'not-1', userId: 'pat-active', role: 'patient', title: 'Consultation Complete', message: 'Dr. Anjali Nair generated your prescription for the consultation on 2026-06-22.', time: '1 week ago', read: false },
    { id: 'not-2', userId: 'pat-active', role: 'patient', title: 'Upcoming Call Reminder', message: 'Your video call with Dr. Siddharth Kurian is scheduled tomorrow at 10:00 AM.', time: '1 hour ago', read: false },
    { id: 'not-3', userId: 'doc-1', role: 'doctor', title: 'New Appointment Booked', message: 'Hari Krishnan booked an appointment for 2026-07-02.', time: '2 hours ago', read: false }
  ];

  return {
    doctors,
    hospitals,
    patients,
    appointments,
    prescriptions,
    reports,
    notifications
  };
}
