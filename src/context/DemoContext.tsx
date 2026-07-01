import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Doctor, Hospital, Patient, Appointment, Prescription, 
  MedicalReport, Notification, generateSeedData, Medicine, Message 
} from '../data/mockData';

export type UserRole = 'patient' | 'doctor' | 'hospital' | 'admin';

interface DemoContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activePatient: Patient;
  activeDoctor: Doctor;
  activeHospital: Hospital;
  doctors: Doctor[];
  hospitals: Hospital[];
  patients: Patient[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  reports: MedicalReport[];
  notifications: Notification[];
  commissionRate: number;
  telehealthFee: number;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Actions
  changeRole: (newRole: UserRole) => void;
  bookAppointment: (doctorId: string, date: string, timeSlot: string, reason: string, type: 'video' | 'in-person') => Promise<Appointment>;
  cancelAppointment: (apptId: string) => void;
  addPrescription: (apptId: string, medicines: Medicine[], notes: string) => void;
  sendMessage: (apptId: string, sender: 'patient' | 'doctor', text: string) => void;
  approveHospital: (hospId: string) => void;
  verifyDoctor: (docId: string) => void;
  allocateBed: (hospId: string, count: number) => void;
  dischargeBed: (hospId: string, count: number) => void;
  updateSettings: (rate: number, fee: number) => void;
  markNotificationsRead: (userId: string) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage, otherwise generate seeds
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('demo_role') as UserRole) || 'patient';
  });

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [commissionRate, setCommissionRate] = useState(15); // %
  const [telehealthFee, setTelehealthFee] = useState(10); // $

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('demo_theme') as 'light' | 'dark') || 'light';
  });

  // Toggle theme utility
  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('demo_theme', next);
      return next;
    });
  };

  // Sync theme to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Fake background live updates timer
  useEffect(() => {
    const interval = setInterval(() => {
      const randType = Math.floor(Math.random() * 4);
      let newNotif: Notification | null = null;
      
      if (randType === 0) {
        newNotif = {
          id: `not-bg-${Date.now()}`,
          userId: 'pat-active',
          role: 'patient',
          title: 'Lab Report Released',
          message: 'Your laboratory respiratory function test report has been signed.',
          time: 'Just now',
          read: false
        };
      } else if (randType === 1) {
        newNotif = {
          id: `not-bg-${Date.now()}`,
          userId: 'doc-1',
          role: 'doctor',
          title: 'Queue Update',
          message: 'Patient Sarah Connor is checked in at active reception.',
          time: 'Just now',
          read: false
        };
      } else if (randType === 2) {
        newNotif = {
          id: `not-bg-${Date.now()}`,
          userId: 'hosp-1',
          role: 'hospital',
          title: 'Emergency Checked In',
          message: 'Ambulance AMB-402 has arrived with a critical patient.',
          time: 'Just now',
          read: false
        };
      } else {
        newNotif = {
          id: `not-bg-${Date.now()}`,
          userId: 'admin-1',
          role: 'admin',
          title: 'Licensing Registration',
          message: 'A new doctor application is queued for verification.',
          time: 'Just now',
          read: false
        };
      }

      if (newNotif) {
        setNotifications(prev => [newNotif!, ...prev]);
      }

      // Randomly adjust bed occupancy levels
      setHospitals(prev => prev.map(h => {
        if (h.id === 'hosp-1') {
          const change = Math.random() > 0.5 ? 1 : -1;
          const nextOccupied = Math.max(20, Math.min(h.bedsTotal - 5, h.bedsOccupied + change));
          return { ...h, bedsOccupied: nextOccupied };
        }
        return h;
      }));

    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Initialize and load
  useEffect(() => {
    const cachedData = localStorage.getItem('doctorsin_data_seeded');
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setDoctors(parsed.doctors);
        setHospitals(parsed.hospitals);
        setPatients(parsed.patients);
        setAppointments(parsed.appointments);
        setPrescriptions(parsed.prescriptions);
        setReports(parsed.reports);
        setNotifications(parsed.notifications);
      } catch (e) {
        console.error("Error parsing seeded storage, re-seeding", e);
        initializeSeeds();
      }
    } else {
      initializeSeeds();
    }
  }, []);

  const initializeSeeds = () => {
    const data = generateSeedData();
    setDoctors(data.doctors);
    setHospitals(data.hospitals);
    setPatients(data.patients);
    setAppointments(data.appointments);
    setPrescriptions(data.prescriptions);
    setReports(data.reports);
    setNotifications(data.notifications);
    saveToStorage(data);
  };

  const saveToStorage = (currentData: {
    doctors: Doctor[];
    hospitals: Hospital[];
    patients: Patient[];
    appointments: Appointment[];
    prescriptions: Prescription[];
    reports: MedicalReport[];
    notifications: Notification[];
  }) => {
    localStorage.setItem('doctorsin_data_seeded', JSON.stringify(currentData));
  };

  // Sync to storage on state updates
  useEffect(() => {
    if (doctors.length > 0) {
      saveToStorage({
        doctors,
        hospitals,
        patients,
        appointments,
        prescriptions,
        reports,
        notifications
      });
    }
  }, [doctors, hospitals, patients, appointments, prescriptions, reports, notifications]);

  // Active placeholders for dashboards
  const activePatient = patients.find(p => p.id === 'pat-active') || {
    id: 'pat-active',
    name: 'Hari Krishnan',
    email: 'patient@doctorsin.com',
    phone: '9876543210',
    gender: 'Male',
    age: 29,
    bloodType: 'O+',
    medicalHistory: ['Mild Asthma'],
    allergies: ['Penicillin']
  };

  const activeDoctor = doctors.find(d => d.id === 'doc-1') || {
    id: 'doc-1',
    name: 'Dr. Haridas Menon',
    specialty: 'Cardiology',
    experience: 18,
    rating: 4.8,
    reviewsCount: 128,
    clinicName: 'Aster Medcity',
    locality: 'Edappally',
    fee: 800,
    bio: 'Experienced Cardiologist',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    availability: { days: ['Mon', 'Wed'], slots: ['09:00 AM', '10:00 AM'] },
    hospitalId: 'hosp-1',
    hospitalName: 'Aster Medcity',
    status: 'active' as const
  };

  const activeHospital = hospitals.find(h => h.id === 'hosp-1') || {
    id: 'hosp-1',
    name: 'Aster Medcity',
    address: 'Edappally, Kochi',
    rating: 4.7,
    bedsTotal: 150,
    bedsOccupied: 72,
    departments: ['Cardiology', 'Dermatology'],
    revenue: [80000, 92000, 85000, 95000, 110000, 105000],
    doctorsCount: 12,
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=400',
    status: 'approved' as const
  };

  // Switch roles helper
  const changeRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('demo_role', newRole);
  };

  // 1. Book Appointment
  const bookAppointment = (
    doctorId: string, 
    date: string, 
    timeSlot: string, 
    reason: string, 
    type: 'video' | 'in-person'
  ): Promise<Appointment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const doc = doctors.find(d => d.id === doctorId)!;
        const newAppt: Appointment = {
          id: `appt-${Date.now()}`,
          patientId: 'pat-active',
          patientName: activePatient.name,
          doctorId: doc.id,
          doctorName: doc.name,
          doctorSpecialty: doc.specialty,
          hospitalId: doc.hospitalId,
          hospitalName: doc.hospitalName,
          date,
          timeSlot,
          status: 'upcoming',
          type,
          reason,
          fee: doc.fee,
          chatHistory: [
            { sender: 'doctor', text: `Hi ${activePatient.name}, thank you for booking. We will connect on ${date} at ${timeSlot}.`, time: 'Just now' }
          ]
        };

        setAppointments(prev => [newAppt, ...prev]);

        const newNotification: Notification = {
          id: `not-${Date.now()}`,
          userId: doc.id,
          role: 'doctor',
          title: 'New Booking Request',
          message: `${activePatient.name} booked a ${type} consultation on ${date} at ${timeSlot}.`,
          time: 'Just now',
          read: false
        };
        setNotifications(prev => [newNotification, ...prev]);

        resolve(newAppt);
      }, 1200);
    });
  };

  // 2. Cancel Appointment
  const cancelAppointment = (apptId: string) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === apptId) {
        const newNotification: Notification = {
          id: `not-${Date.now()}`,
          userId: a.doctorId,
          role: 'doctor',
          title: 'Consultation Cancelled',
          message: `The consultation booked by ${activePatient.name} for ${a.date} has been cancelled.`,
          time: 'Just now',
          read: false
        };
        setNotifications(prevNotif => [newNotification, ...prevNotif]);
        return { ...a, status: 'cancelled' as const };
      }
      return a;
    }));
  };

  // 3. Add Prescription & Complete Consultation
  const addPrescription = (apptId: string, medicines: Medicine[], notes: string) => {
    const appt = appointments.find(a => a.id === apptId);
    if (!appt) return;

    const rxId = `rx-${apptId}`;
    const newPrescription: Prescription = {
      id: rxId,
      appointmentId: apptId,
      patientId: appt.patientId,
      patientName: appt.patientName,
      doctorId: appt.doctorId,
      doctorName: appt.doctorName,
      date: new Date().toISOString().split('T')[0],
      medicines,
      notes,
      signature: appt.doctorName
    };

    setAppointments(prev => prev.map(a => {
      if (a.id === apptId) {
        return { 
          ...a, 
          status: 'completed' as const,
          prescriptionId: rxId 
        };
      }
      return a;
    }));

    setPrescriptions(prev => [newPrescription, ...prev]);

    const newReport: MedicalReport = {
      id: `rep-${apptId}`,
      patientId: appt.patientId,
      patientName: appt.patientName,
      date: new Date().toISOString().split('T')[0],
      title: `${appt.doctorSpecialty} Summary Report`,
      category: appt.doctorSpecialty,
      result: `Patient consult for ${appt.reason}. Recommended treatment plan: ${medicines.map(m => m.name).join(', ')}. ${notes}`,
      status: 'Normal'
    };
    setReports(prev => [newReport, ...prev]);

    const newNotification: Notification = {
      id: `not-${Date.now()}`,
      userId: appt.patientId,
      role: 'patient',
      title: 'Prescription Uploaded',
      message: `${appt.doctorName} uploaded your prescription and medical summary.`,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // 4. Send Message in live consultation chat
  const sendMessage = (apptId: string, sender: 'patient' | 'doctor', text: string) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === apptId) {
        return {
          ...a,
          chatHistory: [
            ...a.chatHistory,
            { sender, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          ]
        };
      }
      return a;
    }));
  };

  // 5. Approve Pending Hospital
  const approveHospital = (hospId: string) => {
    setHospitals(prev => prev.map(h => {
      if (h.id === hospId) {
        return { ...h, status: 'approved' as const };
      }
      return h;
    }));
  };

  // 6. Verify Pending Doctor
  const verifyDoctor = (docId: string) => {
    setDoctors(prev => prev.map(d => {
      if (d.id === docId) {
        return { ...d, status: 'active' as const };
      }
      return d;
    }));
  };

  // 7. Manage Beds
  const allocateBed = (hospId: string, count: number) => {
    setHospitals(prev => prev.map(h => {
      if (h.id === hospId) {
        const nextOccupied = Math.min(h.bedsTotal, h.bedsOccupied + count);
        return { ...h, bedsOccupied: nextOccupied };
      }
      return h;
    }));
  };

  const dischargeBed = (hospId: string, count: number) => {
    setHospitals(prev => prev.map(h => {
      if (h.id === hospId) {
        const nextOccupied = Math.max(0, h.bedsOccupied - count);
        return { ...h, bedsOccupied: nextOccupied };
      }
      return h;
    }));
  };

  // 8. Update global settings
  const updateSettings = (rate: number, fee: number) => {
    setCommissionRate(rate);
    setTelehealthFee(fee);
  };

  // 9. Notifications helper
  const markNotificationsRead = (userId: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.userId === userId) {
        return { ...n, read: true };
      }
      return n;
    }));
  };

  return (
    <DemoContext.Provider value={{
      role,
      setRole: changeRole,
      activePatient,
      activeDoctor,
      activeHospital,
      doctors,
      hospitals,
      patients,
      appointments,
      prescriptions,
      reports,
      notifications,
      commissionRate,
      telehealthFee,
      theme,
      toggleTheme,
      changeRole,
      bookAppointment,
      cancelAppointment,
      addPrescription,
      sendMessage,
      approveHospital,
      verifyDoctor,
      allocateBed,
      dischargeBed,
      updateSettings,
      markNotificationsRead
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
