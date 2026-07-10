import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const Calendar: React.FC = () => {
  const { appointments, activeDoctor } = useDemo();
  const [selectedDay, setSelectedDay] = useState('Mon');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const weekdayToDayNum = (day: string) => {
    const idx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day);
    return idx === -1 ? 1 : idx;
  };

  const getSlotsForDay = () => {
    const isWorkingDay = activeDoctor.availability.days.includes(selectedDay);
    const masterSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
    
    return masterSlots.map(time => {
      if (!isWorkingDay) {
        return { time, status: 'off' as const };
      }
      
      if (!activeDoctor.availability.slots.includes(time)) {
        return { time, status: 'off' as const };
      }
      
      const targetDayNum = weekdayToDayNum(selectedDay);
      const appt = appointments.find(a => {
        if (a.doctorId !== activeDoctor.id || a.timeSlot !== time || a.status === 'cancelled') {
          return false;
        }
        const d = new Date(a.date);
        return d.getDay() === targetDayNum;
      });
      
      if (appt) {
        return { 
          time, 
          status: 'booked' as const, 
          patient: appt.patientName, 
          reason: appt.reason 
        };
      }
      
      return { time, status: 'available' as const };
    });
  };

  const slotsConfig = getSlotsForDay();

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Roster & Duty Calendar</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure your weekly consulting slots, vacation days, or physical clinic timing.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Days Checklist */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Select Roster Day</h3>
            <CalendarIcon size={16} className="text-slate-400" />
          </div>

          <div className="space-y-2">
            {daysOfWeek.map((day) => {
              const isWorkingDay = activeDoctor.availability.days.includes(day);
              const isSelected = selectedDay === day;
              
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left font-semibold text-xs cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <span>{day === 'Mon' ? 'Monday' : day === 'Tue' ? 'Tuesday' : day === 'Wed' ? 'Wednesday' : day === 'Thu' ? 'Thursday' : day === 'Fri' ? 'Friday' : day === 'Sat' ? 'Saturday' : 'Sunday'}</span>
                  {isWorkingDay ? (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      Duty Active
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-400 dark:text-slate-500">Off-duty</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Slots Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Schedule Roster</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Timezone: Asia/Kolkata (GMT+5:30)</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {slotsConfig.map((slot, index) => (
              <div 
                key={index}
                className={`p-5 rounded-2xl border flex flex-col justify-between h-36 transition-all ${
                  slot.status === 'booked'
                    ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-900/40 shadow-sm'
                    : slot.status === 'off'
                    ? 'bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
                    <Clock size={14} className="text-slate-400" />
                    <span>{slot.time}</span>
                  </div>
                  
                  <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                    slot.status === 'booked'
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : slot.status === 'off'
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-655 dark:text-slate-300'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {slot.status}
                  </span>
                </div>

                {slot.status === 'booked' ? (
                  <div className="space-y-1 mt-auto">
                    <span className="text-[10px] text-slate-450 block uppercase tracking-wider font-semibold">Patient Check-in</span>
                    <span className="font-extrabold text-slate-850 dark:text-white text-sm block flex items-center gap-1">
                      <User size={13} className="text-slate-400" />
                      {slot.patient}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 italic block truncate text-left">"{slot.reason}"</span>
                  </div>
                ) : slot.status === 'off' ? (
                  <span className="text-xs text-slate-400 font-semibold block mt-auto italic text-left">Blocked slot</span>
                ) : (
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mt-auto text-left">Open for online booking</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
