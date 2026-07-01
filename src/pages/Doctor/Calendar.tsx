import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const Calendar: React.FC = () => {
  const { appointments, activeDoctor } = useDemo();
  const [selectedDay, setSelectedDay] = useState('Mon');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const slotsConfig = [
    { time: '09:00 AM', status: 'available' },
    { time: '10:00 AM', status: 'booked', patient: 'Alexander Fleming', reason: 'Asthma review' },
    { time: '11:00 AM', status: 'booked', patient: 'Sarah Jenkins', reason: 'High fever inspect' },
    { time: '12:00 PM', status: 'available' },
    { time: '02:00 PM', status: 'available' },
    { time: '03:00 PM', status: 'off' },
    { time: '04:00 PM', status: 'booked', patient: 'Michael Chang', reason: 'Cardio prescription follow-up' },
    { time: '05:00 PM', status: 'available' }
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Roster & Duty Calendar</h2>
        <p className="text-xs text-slate-500 mt-1">Configure your weekly consulting slots, vacation days, or physical clinic timing.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Days Checklist */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-105">
            <h3 className="font-bold text-slate-850 text-sm">Select Roster Day</h3>
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
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left font-semibold text-xs ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                      : 'border-slate-150 text-slate-655 hover:bg-slate-50'
                  }`}
                >
                  <span>{day === 'Mon' ? 'Monday' : day === 'Tue' ? 'Tuesday' : day === 'Wed' ? 'Wednesday' : day === 'Thu' ? 'Thursday' : day === 'Fri' ? 'Friday' : day === 'Sat' ? 'Saturday' : 'Sunday'}</span>
                  {isWorkingDay ? (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-emerald-55 text-emerald-600'
                    }`}>
                      Duty Active
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-400">Off-duty</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Slots Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-850 text-base">Schedule Roster</h3>
            <span className="text-xs text-slate-400 font-semibold">Timezone: Asia/Kolkata (GMT+5:30)</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {slotsConfig.map((slot, index) => (
              <div 
                key={index}
                className={`p-5 rounded-2xl border flex flex-col justify-between h-36 transition-all ${
                  slot.status === 'booked'
                    ? 'bg-blue-50 border-blue-200/60 shadow-sm'
                    : slot.status === 'off'
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Clock size={14} className="text-slate-400" />
                    <span>{slot.time}</span>
                  </div>
                  
                  <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                    slot.status === 'booked'
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : slot.status === 'off'
                      ? 'bg-slate-200 text-slate-600'
                      : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {slot.status}
                  </span>
                </div>

                {slot.status === 'booked' ? (
                  <div className="space-y-1 mt-auto">
                    <span className="text-[10px] text-slate-450 block uppercase tracking-wider font-semibold">Patient Check-in</span>
                    <span className="font-extrabold text-slate-850 text-sm block flex items-center gap-1">
                      <User size={13} className="text-slate-400" />
                      {slot.patient}
                    </span>
                    <span className="text-[10px] text-slate-500 italic block truncate">"{slot.reason}"</span>
                  </div>
                ) : slot.status === 'off' ? (
                  <span className="text-xs text-slate-400 font-semibold block mt-auto italic">Blocked slot</span>
                ) : (
                  <span className="text-xs text-slate-500 font-medium block mt-auto">Open for online booking</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
