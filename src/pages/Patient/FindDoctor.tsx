import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Star, Shield, Calendar, Clock, DollarSign, 
  MapPin, CheckCircle, ChevronRight, X, Loader2, CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FindDoctor: React.FC = () => {
  const { doctors, bookAppointment } = useDemo();
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedFee, setSelectedFee] = useState(1500); 
  const [selectedRating, setSelectedRating] = useState(0); 
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);

  // Booking Modal State
  const [bookingDoc, setBookingDoc] = useState<any | null>(null);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1); 
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [apptReason, setApptReason] = useState('');
  const [consultType, setConsultType] = useState<'video' | 'in-person'>('video');
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  // Pre-selected doctor check (from landing page quick book or auto-booking tour)
  useEffect(() => {
    const preselectedDocId = localStorage.getItem('demo_preselected_doctor');
    if (preselectedDocId) {
      const doc = doctors.find(d => d.id === preselectedDocId);
      if (doc) {
        setBookingDoc(doc);
      }
      localStorage.removeItem('demo_preselected_doctor');
    }
  }, [doctors]);

  const specialties = ['All', ...Array.from(new Set(doctors.map(d => d.specialty)))];

  // Filtering Logic
  useEffect(() => {
    const activeDocs = doctors.filter(d => d.status === 'active');
    const filtered = activeDocs.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doc.clinicName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
      const matchesFee = doc.fee <= selectedFee;
      const matchesRating = doc.rating >= selectedRating;
      
      return matchesSearch && matchesSpecialty && matchesFee && matchesRating;
    });
    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialty, selectedFee, selectedRating, doctors]);

  // Available dates (next 5 days)
  const getNextDays = () => {
    const days = [];
    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (let i = 1; i <= 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        dayName: weekday[d.getDay()],
        dateNum: d.getDate(),
        month: months[d.getMonth()],
        fullDate: d.toISOString().split('T')[0]
      });
    }
    return days;
  };
  const bookingDates = getNextDays();

  // Booking Submit handler
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot || !apptReason) return;
    
    setIsBookingSubmitting(true);
    try {
      await bookAppointment(bookingDoc.id, selectedDate, selectedSlot, apptReason, consultType);
      
      // Fire confetti blast!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      
      setBookingStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  const closeBookingModal = () => {
    setBookingDoc(null);
    setBookingStep(1);
    setSelectedDate('');
    setSelectedSlot('');
    setApptReason('');
    setConsultType('video');
  };

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Find & Book Specialists</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Filter through 100+ verified medical doctors and book immediate sessions.</p>
      </div>

      {/* Filter Sidebar + Grid */}
      <div className="grid lg:grid-cols-4 gap-8 items-start">
        {/* Filter Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-6 lg:sticky lg:top-24 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider">Search Filters</h3>
          
          {/* Name Search */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">Doctor/Clinic Name</label>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full dark:text-white"
              />
            </div>
          </div>

          {/* Specialty Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">Specialty</label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold outline-none text-slate-655 dark:text-slate-400"
            >
              {specialties.map(spec => (
                <option key={spec} value={spec}>{spec === 'All' ? 'All Specialties' : spec}</option>
              ))}
            </select>
          </div>

          {/* Fee Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-500">Max Consultation Fee</label>
              <span className="font-bold text-blue-650 dark:text-blue-400">${selectedFee}</span>
            </div>
            <input 
              type="range" 
              min="300" 
              max="1500" 
              step="100" 
              value={selectedFee}
              onChange={(e) => setSelectedFee(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Rating filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">Minimum Rating</label>
            <div className="flex items-center gap-2">
              {[0, 4.0, 4.5, 4.8].map((rat) => (
                <button
                  key={rat}
                  onClick={() => setSelectedRating(rat)}
                  className={`flex-1 text-center py-2 text-xs font-bold rounded-xl border transition-all ${
                    selectedRating === rat
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-405 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  {rat === 0 ? 'All' : `${rat}★`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="lg:col-span-3 space-y-6">
          <p className="text-xs text-slate-500 font-semibold">Showing {filteredDoctors.length} results</p>
          
          {filteredDoctors.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl py-16 text-center text-slate-500 dark:text-slate-400 text-sm font-semibold">
              No specialists match your criteria. Try adjusting the filter settings.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredDoctors.map((doc) => (
                <div 
                  key={doc.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-4">
                      <img 
                        src={doc.imageUrl} 
                        alt={doc.name} 
                        className="h-16 w-16 rounded-2xl object-cover border border-slate-100 dark:border-slate-800"
                      />
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {doc.specialty}
                        </span>
                        <h4 className="font-bold text-slate-800 dark:text-white text-base mt-1.5">{doc.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1 text-slate-500 dark:text-slate-400 text-xs">
                          <Star size={13} className="text-amber-500 fill-amber-500" />
                          <span className="font-bold text-slate-700 dark:text-slate-305">{doc.rating}</span>
                          <span>• {doc.experience} Years Exp</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-550 dark:text-slate-400 mt-4 leading-relaxed line-clamp-2">
                      {doc.bio}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400 shrink-0" />
                        <span className="truncate">{doc.clinicName} • {doc.locality}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400 shrink-0" />
                        <span>Available: {doc.availability.days.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Cons. Fee</span>
                      <span className="text-lg font-black text-slate-850 dark:text-white">${doc.fee}</span>
                    </div>
                    <button
                      onClick={() => setBookingDoc(doc)}
                      className="bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Overlay Modal */}
      <AnimatePresence>
        {bookingDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={closeBookingModal}
              className="absolute inset-0 bg-slate-900"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 shrink-0">
                <div className="flex items-center gap-3 text-left">
                  <img 
                    src={bookingDoc.imageUrl} 
                    alt={bookingDoc.name} 
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm leading-tight">{bookingDoc.name}</h4>
                    <span className="text-[10px] font-semibold text-blue-605 dark:text-blue-400 uppercase tracking-wider">{bookingDoc.specialty}</span>
                  </div>
                </div>
                <button 
                  onClick={closeBookingModal}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Steps Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* STEP 1: DATE & SLOT SELECTION */}
                {bookingStep === 1 && (
                  <div className="space-y-6 text-left">
                    <div className="space-y-3">
                      <h5 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider">1. Select Consultation Date</h5>
                      <div className="grid grid-cols-5 gap-2">
                        {bookingDates.map((date) => (
                          <button
                            key={date.fullDate}
                            onClick={() => setSelectedDate(date.fullDate)}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                              selectedDate === date.fullDate
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/25'
                                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                            }`}
                          >
                            <span className="text-[10px] font-semibold opacity-80">{date.dayName}</span>
                            <span className="text-lg font-black mt-0.5">{date.dateNum}</span>
                            <span className="text-[9px] uppercase tracking-wider font-bold opacity-80 mt-0.5">{date.month}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider">2. Select Time Slot</h5>
                      <div className="grid grid-cols-3 gap-2">
                        {bookingDoc.availability.slots.map((slot: string) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                              selectedSlot === slot
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/25'
                                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setBookingStep(2)}
                      disabled={!selectedDate || !selectedSlot}
                      className="w-full bg-blue-650 text-white hover:bg-blue-700 font-bold py-3.5 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Proceed to Payment</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}

                {/* STEP 2: BOOKING DETAILS & PAYMENT */}
                {bookingStep === 2 && (
                  <form onSubmit={handleBookingSubmit} className="space-y-6 text-left">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500">Reason for Consultation</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="e.g., Asthma follow-up..."
                        value={apptReason}
                        onChange={(e) => setApptReason(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-blue-500 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500">Consultation Mode</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setConsultType('video')}
                          className={`p-3 rounded-2xl border text-center text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                            consultType === 'video'
                              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-650'
                              : 'border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                          }`}
                        >
                          <Clock size={16} />
                          <span>Video Consultation</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setConsultType('in-person')}
                          className={`p-3 rounded-2xl border text-center text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                            consultType === 'in-person'
                              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-650'
                              : 'border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                          }`}
                        >
                          <MapPin size={16} />
                          <span>In-Person Visit</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl space-y-3">
                      <h6 className="font-bold text-slate-850 dark:text-white text-xs">Booking Invoice</h6>
                      <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex justify-between">
                          <span>Consultation Fee</span>
                          <span>${bookingDoc.fee}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200/50 dark:border-slate-800 pt-2 font-bold text-slate-800 dark:text-white">
                          <span>Total to Pay</span>
                          <span>${bookingDoc.fee}</span>
                        </div>
                      </div>
                    </div>

                    {/* Mock Payment */}
                    <div className="space-y-3">
                      <h6 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <CreditCard size={14} className="text-slate-400" />
                        <span>Secure Credit Card Payment</span>
                      </h6>
                      <div className="grid grid-cols-3 gap-2">
                        <input 
                          type="text" 
                          required
                          placeholder="Card Number" 
                          defaultValue="4242 4242 4242 4242"
                          className="col-span-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-blue-500 font-mono dark:text-white"
                        />
                        <input 
                          type="text" 
                          required
                          placeholder="MM/YY" 
                          defaultValue="12/28"
                          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-blue-500 font-mono dark:text-white"
                        />
                        <input 
                          type="password" 
                          required
                          placeholder="CVV" 
                          defaultValue="123"
                          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-blue-500 font-mono dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setBookingStep(1)}
                        className="flex-1 py-3.5 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-850 font-bold text-xs text-slate-600 dark:text-slate-400"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isBookingSubmitting}
                        className="flex-[2] bg-emerald-650 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isBookingSubmitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Processing Secure Pay...</span>
                          </>
                        ) : (
                          <>
                            <Shield size={16} />
                            <span>Pay & Confirm Booking</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: SUCCESS BLOCK (PREMIUM RECEIPT TICKET WITH QR CODE) */}
                {bookingStep === 3 && (
                  <div className="text-center py-4 space-y-6">
                    <div className="h-14 w-14 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100 dark:border-emerald-900/50 shadow-inner pulse-glow-blue">
                      <CheckCircle size={28} />
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-black text-slate-850 dark:text-white">Booking Confirmed!</h4>
                      <p className="text-xs text-slate-405 mt-0.5">Your receipt has been signed and compiled.</p>
                    </div>

                    {/* Premium Apple style ticket */}
                    <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-950/40 overflow-hidden text-xs text-slate-600 dark:text-slate-400 shadow-sm">
                      <div className="p-4 bg-blue-650 text-white flex justify-between items-center text-left">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider block font-bold opacity-80">Consultation Ticket</span>
                          <span className="font-extrabold text-sm block mt-0.5">{bookingDoc.name}</span>
                        </div>
                        <span className="text-[10px] bg-white/20 border border-white/20 px-2 py-0.5 rounded-full font-bold uppercase">
                          {consultType} mode
                        </span>
                      </div>

                      <div className="p-4 space-y-2.5 text-left">
                        <div className="flex justify-between">
                          <span className="text-slate-450 dark:text-slate-500">Invoice ID</span>
                          <span className="font-mono font-bold text-slate-800 dark:text-white">INV-{Date.now().toString().slice(-6)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-450 dark:text-slate-500">Date / Slot</span>
                          <span className="font-semibold text-slate-800 dark:text-white">{selectedDate} / {selectedSlot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-450 dark:text-slate-500">Payment Status</span>
                          <span className="font-bold text-emerald-600">Settled (${bookingDoc.fee})</span>
                        </div>
                      </div>

                      {/* Mock QR Code grid layout */}
                      <div className="bg-white dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2">
                        <div className="h-28 w-28 border border-slate-200 dark:border-slate-800 rounded-xl p-2 flex flex-col gap-1 justify-between select-none">
                          {/* QR Code mock columns */}
                          <div className="flex justify-between h-4">
                            <div className="w-4 h-4 bg-slate-900 dark:bg-white rounded" />
                            <div className="w-12 h-1 bg-slate-900 dark:bg-white self-center rounded" />
                            <div className="w-4 h-4 bg-slate-900 dark:bg-white rounded" />
                          </div>
                          <div className="flex justify-between h-12">
                            <div className="w-2 h-12 bg-slate-900 dark:bg-white rounded" />
                            <div className="w-12 h-6 bg-slate-900 dark:bg-white self-center rounded" />
                            <div className="w-4 h-12 bg-slate-900 dark:bg-white rounded" />
                          </div>
                          <div className="flex justify-between h-4">
                            <div className="w-4 h-4 bg-slate-900 dark:bg-white rounded" />
                            <div className="w-12 h-1 bg-slate-900 dark:bg-white self-center rounded" />
                            <div className="w-4 h-4 bg-slate-900 dark:bg-white rounded" />
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Scan receipt check-in</span>
                      </div>
                    </div>

                    <button
                      onClick={closeBookingModal}
                      className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Return to Portal
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
