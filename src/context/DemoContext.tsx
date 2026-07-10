import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Doctor, Hospital, Patient, Appointment, Prescription, 
  MedicalReport, Notification, generateSeedData, Medicine, Message 
} from '../data/mockData';

export type UserRole = 'patient' | 'doctor' | 'hospital' | 'admin';

export interface Bed {
  id: number;
  label: string;
  type: 'ICU' | 'General' | 'Recovery';
  status: 'available' | 'occupied' | 'cleaning';
  patientName?: string;
  admitDate?: string;
}

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
  
  // Persisted Bed Management State
  bedsGrid: Bed[];
  updateBedStatus: (bedId: number, status: Bed['status'], patientName?: string, admitDate?: string) => void;
  
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

export interface SessionData {
  doctors: Doctor[];
  hospitals: Hospital[];
  patients: Patient[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  reports: MedicalReport[];
  notifications: Notification[];
  bedsGrid: Bed[];
}

// Helper function to synchronously initialize state from localStorage or seeds
const loadSeededState = (): SessionData => {
  const cached = localStorage.getItem('doctorsin_data_seeded');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      // Strict property checks to avoid crashing on corrupted object shapes
      if (
        parsed &&
        Array.isArray(parsed.doctors) &&
        Array.isArray(parsed.hospitals) &&
        Array.isArray(parsed.patients) &&
        Array.isArray(parsed.appointments) &&
        Array.isArray(parsed.prescriptions) &&
        Array.isArray(parsed.reports) &&
        Array.isArray(parsed.notifications)
      ) {
        // Handle bedGrid backwards compatibility
        if (!Array.isArray(parsed.bedsGrid)) {
          parsed.bedsGrid = generateInitialBeds();
        }
        return parsed as SessionData;
      }
    } catch (e) {
      console.error("Critical error parsing localStorage cache, falling back to seeds.", e);
    }
  }

  // Generate new seeds
  const seeds = generateSeedData();
  const initialData: SessionData = {
    ...seeds,
    bedsGrid: generateInitialBeds()
  };
  localStorage.setItem('doctorsin_data_seeded', JSON.stringify(initialData));
  return initialData;
};

// Generates initial clinical bed status array
const generateInitialBeds = (): Bed[] => {
  return Array.from({ length: 24 }, (_, i) => {
    const id = i + 1;
    let type: Bed['type'] = 'General';
    if (id <= 6) type = 'ICU';
    else if (id >= 19) type = 'Recovery';

    let status: Bed['status'] = 'available';
    let patientName = undefined;
    let admitDate = undefined;

    if (id === 1 || id === 3 || id === 7 || id === 10 || id === 15 || id === 20) {
      status = 'occupied';
      patientName = ['John Smith', 'Sarah Connor', 'Peter Parker', 'Bruce Wayne', 'Clark Kent', 'Diana Prince'][id % 6];
      admitDate = '2026-06-28';
    } else if (id === 5 || id === 12) {
      status = 'cleaning';
    }

    return {
      id,
      label: `${type.charAt(0)}-${id.toString().padStart(3, '0')}`,
      type,
      status,
      patientName,
      admitDate
    };
  });
};

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous state initialization to avoid mount race conditions and data loss
  const [sessionData, setSessionData] = useState<SessionData>(() => loadSeededState());

  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('demo_role') as UserRole) || 'patient';
  });

  const [commissionRate, setCommissionRate] = useState(15); 
  const [telehealthFee, setTelehealthFee] = useState(10); 

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
      const timestamp = 'Just now';
      
      if (randType === 0) {
        newNotif = {
          id: `not-bg-${Date.now()}`,
          userId: 'pat-active',
          role: 'patient',
          title: 'Aster Medcity Lab Report',
          message: 'Your laboratory lipid profile test report has been signed by Dr. Haridas Menon.',
          time: timestamp,
          read: false
        };
      } else if (randType === 1) {
        newNotif = {
          id: `not-bg-${Date.now()}`,
          userId: 'doc-1',
          role: 'doctor',
          title: 'Queue Check-In',
          message: 'Patient Rahul Varghese has checked in via active QR check-in.',
          time: timestamp,
          read: false
        };
      } else if (randType === 2) {
        newNotif = {
          id: `not-bg-${Date.now()}`,
          userId: 'hosp-1',
          role: 'hospital',
          title: 'Emergency Red Alert',
          message: 'Ambulance AMB-402 dispatched from Kakkanad bypass with a critical patient.',
          time: timestamp,
          read: false
        };
      } else {
        newNotif = {
          id: `not-bg-${Date.now()}`,
          userId: 'admin-1',
          role: 'admin',
          title: 'Razorpay Split Credited',
          message: 'Commission margin slice of ₹120 settled for transaction TXN-90234.',
          time: timestamp,
          read: false
        };
      }

      setSessionData(prev => {
        const nextNotifs = newNotif ? [newNotif, ...prev.notifications] : prev.notifications;
        const nextHospitals = prev.hospitals.map(h => {
          if (h.id === 'hosp-1') {
            const change = Math.random() > 0.5 ? 1 : -1;
            const nextOccupied = Math.max(20, Math.min(h.bedsTotal - 5, h.bedsOccupied + change));
            const nextRevenue = [...h.revenue];
            if (nextRevenue.length > 0) {
              const added = [300, 400, 500, 800][Math.floor(Math.random() * 4)];
              nextRevenue[nextRevenue.length - 1] += added;
            }
            return { ...h, bedsOccupied: nextOccupied, revenue: nextRevenue };
          }
          return h;
        });

        return {
          ...prev,
          notifications: nextNotifs,
          hospitals: nextHospitals
        };
      });

    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Save changes to localStorage on any state modification
  useEffect(() => {
    localStorage.setItem('doctorsin_data_seeded', JSON.stringify(sessionData));
  }, [sessionData]);

  // Extract variables defensively from unified state object
  const doctors = sessionData.doctors || [];
  const hospitals = sessionData.hospitals || [];
  const patients = sessionData.patients || [];
  const appointments = sessionData.appointments || [];
  const prescriptions = sessionData.prescriptions || [];
  const reports = sessionData.reports || [];
  const notifications = sessionData.notifications || [];
  const bedsGrid = sessionData.bedsGrid || [];

  // Active placeholders for dashboards (with robust fallbacks)
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
    imageUrl: '',
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
    imageUrl: '',
    status: 'approved' as const
  };

  // Switch roles helper
  const changeRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('demo_role', newRole);
  };

  // 1. Book Appointment (Strict validation checks)
  const bookAppointment = (
    doctorId: string, 
    date: string, 
    timeSlot: string, 
    reason: string, 
    type: 'video' | 'in-person'
  ): Promise<Appointment> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Defensive check: validate inputs
        if (!doctorId || !date || !timeSlot || !reason) {
          return reject(new Error("Missing parameter requirements for appointment booking."));
        }

        const doc = doctors.find(d => d.id === doctorId);
        if (!doc) {
          return reject(new Error(`Physician with ID '${doctorId}' was not found in the directory.`));
        }

        // Prevent double booking logic conflict
        const isDoubleBooked = appointments.some(
          a => a.doctorId === doctorId && a.date === date && a.timeSlot === timeSlot && a.status === 'upcoming'
        );
        if (isDoubleBooked) {
          return reject(new Error("The selected time slot is no longer available. Please choose another."));
        }

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
          reason: reason.substring(0, 500), // Enforce input character limit
          fee: doc.fee,
          chatHistory: [
            { sender: 'doctor', text: `Hi ${activePatient.name}, thank you for booking. We will connect on ${date} at ${timeSlot}.`, time: 'Just now' }
          ]
        };

        const newNotification: Notification = {
          id: `not-${Date.now()}`,
          userId: doc.id,
          role: 'doctor',
          title: 'New Booking Request',
          message: `${activePatient.name} booked a ${type} consultation on ${date} at ${timeSlot}.`,
          time: 'Just now',
          read: false
        };

        setSessionData(prev => ({
          ...prev,
          appointments: [newAppt, ...prev.appointments],
          notifications: [newNotification, ...prev.notifications]
        }));

        resolve(newAppt);
      }, 1000);
    });
  };

  // 2. Cancel Appointment (validation check)
  const cancelAppointment = (apptId: string) => {
    setSessionData(prev => {
      const target = prev.appointments.find(a => a.id === apptId);
      if (!target) return prev;
      
      // Prevent cancellation of finished consultations
      if (target.status !== 'upcoming') return prev;

      const newNotification: Notification = {
        id: `not-${Date.now()}`,
        userId: target.doctorId,
        role: 'doctor',
        title: 'Consultation Cancelled',
        message: `The consultation booked by ${activePatient.name} for ${target.date} has been cancelled.`,
        time: 'Just now',
        read: false
      };

      const nextAppointments = prev.appointments.map(a => 
        a.id === apptId ? { ...a, status: 'cancelled' as const } : a
      );

      return {
        ...prev,
        appointments: nextAppointments,
        notifications: [newNotification, ...prev.notifications]
      };
    });
  };

  // 3. Add Prescription & Complete Consultation
  const addPrescription = (apptId: string, medicines: Medicine[], notes: string) => {
    setSessionData(prev => {
      const appt = prev.appointments.find(a => a.id === apptId);
      if (!appt) return prev;

      const rxId = `rx-${apptId}`;
      const newPrescription: Prescription = {
        id: rxId,
        appointmentId: apptId,
        patientId: appt.patientId,
        patientName: appt.patientName,
        doctorId: appt.doctorId,
        doctorName: appt.doctorName,
        date: new Date().toISOString().split('T')[0],
        medicines: medicines.filter(m => m.name.trim() !== ''),
        notes: notes.substring(0, 1000),
        signature: appt.doctorName
      };

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

      const newNotification: Notification = {
        id: `not-${Date.now()}`,
        userId: appt.patientId,
        role: 'patient',
        title: 'Prescription Uploaded',
        message: `${appt.doctorName} uploaded your prescription and medical summary.`,
        time: 'Just now',
        read: false
      };

      const nextAppointments = prev.appointments.map(a => 
        a.id === apptId ? { ...a, status: 'completed' as const, prescriptionId: rxId } : a
      );

      return {
        ...prev,
        appointments: nextAppointments,
        prescriptions: [newPrescription, ...prev.prescriptions],
        reports: [newReport, ...prev.reports],
        notifications: [newNotification, ...prev.notifications]
      };
    });
  };

  // 4. Send Message in live consultation chat
  const sendMessage = (apptId: string, sender: 'patient' | 'doctor', text: string) => {
    if (!text.trim()) return;
    setSessionData(prev => {
      const nextAppointments = prev.appointments.map(a => {
        if (a.id === apptId) {
          const chatHistory = a.chatHistory || [];
          return {
            ...a,
            chatHistory: [
              ...chatHistory,
              { sender, text: text.substring(0, 1000), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            ]
          };
        }
        return a;
      });

      return {
        ...prev,
        appointments: nextAppointments
      };
    });
  };

  // 5. Approve Pending Hospital
  const approveHospital = (hospId: string) => {
    setSessionData(prev => ({
      ...prev,
      hospitals: prev.hospitals.map(h => h.id === hospId ? { ...h, status: 'approved' as const } : h)
    }));
  };

  // 6. Verify Pending Doctor
  const verifyDoctor = (docId: string) => {
    setSessionData(prev => ({
      ...prev,
      doctors: prev.doctors.map(d => d.id === docId ? { ...d, status: 'active' as const } : d)
    }));
  };

  // 7. Persisted Bed Grid Actions
  const updateBedStatus = (bedId: number, status: Bed['status'], patientName?: string, admitDate?: string) => {
    setSessionData(prev => {
      const nextBeds = prev.bedsGrid.map(b => {
        if (b.id === bedId) {
          return {
            ...b,
            status,
            patientName: status === 'occupied' ? patientName : undefined,
            admitDate: status === 'occupied' ? admitDate : undefined
          };
        }
        return b;
      });

      return {
        ...prev,
        bedsGrid: nextBeds
      };
    });
  };

  const allocateBed = (hospId: string, count: number) => {
    setSessionData(prev => ({
      ...prev,
      hospitals: prev.hospitals.map(h => {
        if (h.id === hospId) {
          const nextOccupied = Math.min(h.bedsTotal, h.bedsOccupied + count);
          return { ...h, bedsOccupied: nextOccupied };
        }
        return h;
      })
    }));
  };

  const dischargeBed = (hospId: string, count: number) => {
    setSessionData(prev => ({
      ...prev,
      hospitals: prev.hospitals.map(h => {
        if (h.id === hospId) {
          const nextOccupied = Math.max(0, h.bedsOccupied - count);
          return { ...h, bedsOccupied: nextOccupied };
        }
        return h;
      })
    }));
  };

  // 8. Update global settings
  const updateSettings = (rate: number, fee: number) => {
    setCommissionRate(rate);
    setTelehealthFee(fee);
  };

  // 9. Notifications helper
  const markNotificationsRead = (userId: string) => {
    setSessionData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.userId === userId ? { ...n, read: true } : n)
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
      bedsGrid,
      updateBedStatus,
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
