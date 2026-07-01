import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Shield, Star, Award, Users, Activity, Sparkles, 
  ArrowRight, Video, Calendar, ShoppingBag, ChevronRight, CheckCircle2, ChevronDown 
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { doctors, changeRole } = useDemo();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const specialties = ['All', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Orthopedic Surgeon', 'Neurologist', 'General Physician'];
  const activeDocs = doctors.filter(d => d.status === 'active');
  const featuredDoctors = activeDocs.slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery && selectedSpecialty === 'All') return;
    
    setIsSearching(true);
    setSearched(true);
    
    setTimeout(() => {
      const results = activeDocs.filter(doc => {
        const matchesQuery = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             doc.clinicName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
        return matchesQuery && matchesSpecialty;
      });
      setSearchResults(results.slice(0, 6));
      setIsSearching(false);
    }, 650);
  };

  const handleBookNow = (docId: string) => {
    changeRole('patient');
    localStorage.setItem('demo_preselected_doctor', docId);
    navigate('/patient/find-doctor');
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden select-none pb-20">
      
      {/* Floating Particles background animation */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[
          { x: '10%', y: '20%', size: 100, delay: 0 },
          { x: '80%', y: '15%', size: 150, delay: 2 },
          { x: '75%', y: '80%', size: 120, delay: 4 }
        ].map((pt, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -25, 0],
              x: [0, 15, 0]
            }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, delay: pt.delay, ease: 'easeInOut' }}
            className="absolute rounded-full bg-blue-500/5 blur-2xl"
            style={{ left: pt.x, top: pt.y, width: pt.size, height: pt.size }}
          />
        ))}
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow shadow-blue-500/15">
              D+
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">DOCTORS</span>
              <span className="font-extrabold text-blue-600 text-sm tracking-tight">IN</span>
            </div>
          </Link>
          <button 
            onClick={() => navigate('/login')}
            className="text-xs font-bold text-slate-700 dark:text-slate-350 hover:text-blue-600 px-3.5 py-2 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-8 pb-12 px-4 max-w-7xl mx-auto relative z-10 text-left space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/50 text-[10px] font-bold">
          <Sparkles size={12} className="animate-pulse" />
          <span>Next-Gen Enterprise Medical Platform</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-slate-905 dark:text-white leading-tight tracking-tight">
          Instant Clinician Care, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-650 to-sky-400">
            Anytime & Anywhere
          </span>
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
          Connect with top certified medical specialists, track hospital resource availability, and manage files.
        </p>

        {/* Search Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-805 p-3.5 max-w-2xl">
          <form onSubmit={handleSearch} className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2.5">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search doctor, hospital, or specialty..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full dark:text-white"
              />
            </div>
            <div className="flex items-center bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5">
              <select 
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-slate-600 dark:text-slate-400 font-bold w-full"
              >
                {specialties.map(spec => (
                  <option key={spec} value={spec}>{spec === 'All' ? 'All Specialties' : spec}</option>
                ))}
              </select>
            </div>
            <button 
              type="submit"
              className="bg-blue-600 text-white font-bold text-xs rounded-xl py-3 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Search Directory</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </section>

      {/* Interactive Search Results */}
      <AnimatePresence>
        {searched && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-8 px-4 shadow-inner z-10 relative"
          >
            <div className="max-w-7xl mx-auto text-left">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Search Results {selectedSpecialty !== 'All' && `for ${selectedSpecialty}`}
                  </h3>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">We found {searchResults.length} matching specialists.</p>
                </div>
                <button 
                  onClick={() => { setSearched(false); setSearchQuery(''); }}
                  className="text-[10px] font-bold text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100/50 px-3 py-1.5 rounded-lg"
                >
                  Clear
                </button>
              </div>

              {isSearching ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="animate-pulse border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-2 flex-1">
                          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((doc) => (
                    <div key={doc.id} className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 hover:shadow-lg transition-all bg-slate-50 dark:bg-slate-850 flex flex-col justify-between">
                      <div className="flex gap-3">
                        <img src={doc.imageUrl} alt={doc.name} className="h-14 w-14 rounded-xl object-cover border border-slate-200 dark:border-slate-800" />
                        <div className="text-left">
                          <span className="text-[9px] font-bold text-blue-650 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full uppercase">
                            {doc.specialty}
                          </span>
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm mt-1">{doc.name}</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{doc.clinicName}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Star size={10} className="text-amber-500 fill-amber-500" />
                            <span className="text-[10px] text-amber-600 font-bold">{doc.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-sm font-black text-slate-800 dark:text-white">₹{doc.fee}</span>
                        <button 
                          onClick={() => handleBookNow(doc.id)}
                          className="bg-blue-600 text-white hover:bg-blue-700 text-[10px] font-bold px-3.5 py-1.5 rounded-xl cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipeable Featured Specialists Carousel */}
      <section className="py-10 px-4 max-w-7xl mx-auto z-10 relative">
        <div className="flex justify-between items-end mb-6">
          <div className="text-left space-y-1">
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Featured Specialists</h2>
            <p className="text-[11px] text-slate-450 dark:text-slate-500">Consult top-rated certified professionals</p>
          </div>
          <button 
            onClick={() => { changeRole('patient'); navigate('/patient/find-doctor'); }}
            className="text-xs font-bold text-blue-650 dark:text-blue-400 flex items-center gap-0.5 cursor-pointer"
          >
            <span>See All</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Swipe container: Horizontally scrollable snaps */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-none scroll-smooth -mx-4 px-4">
          {featuredDoctors.map((doc) => (
            <div 
              key={doc.id} 
              className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 snap-center shadow-sm flex flex-col justify-between"
            >
              <div className="text-center space-y-3">
                <div className="relative inline-block">
                  <img src={doc.imageUrl} alt={doc.name} className="h-20 w-20 rounded-2xl object-cover mx-auto shadow border border-white dark:border-slate-800" />
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-lg border-2 border-slate-50 dark:border-slate-900">
                    <Award size={10} />
                  </div>
                </div>
                
                <div>
                  <span className="text-[8px] font-bold text-blue-650 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {doc.specialty}
                  </span>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm mt-1.5">{doc.name}</h4>
                  <p className="text-[10px] text-slate-450 dark:text-slate-550 mt-0.5">{doc.clinicName}</p>
                </div>

                <div className="flex items-center justify-center gap-1 text-[11px] text-amber-550 font-bold">
                  <Star size={11} fill="currentColor" />
                  <span>{doc.rating}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 dark:text-white">₹{doc.fee}</span>
                <button 
                  onClick={() => handleBookNow(doc.id)}
                  className="bg-blue-600 text-white hover:bg-blue-700 text-[10px] font-bold px-3.5 py-1.5 rounded-xl cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Swipeable Testimonials */}
      <section className="py-8 bg-white dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/40 px-4 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-left">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">User Testimonials</span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">What Our Patients Say</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-none -mx-4 px-4">
            {[
              { name: 'Sarah M.', text: 'The video call option connects instantly, and I had my preventer inhaler recipe signed and verified within 10 minutes.', stars: 5 },
              { name: 'Arthur D.', text: 'EHR records vault lets me print or inspect prescriptions whenever needed. Transparent bed counters are amazing.', stars: 5 },
              { name: 'Michael C.', text: 'Connecting with cardiologists via mobile was flawless. Secure billing processes settled instantly.', stars: 5 }
            ].map((test, index) => (
              <div 
                key={index}
                className="w-72 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 p-5 rounded-3xl snap-center text-left space-y-3"
              >
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: test.stars }).map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-655 dark:text-slate-400 leading-relaxed italic">
                  "{test.text}"
                </p>
                <span className="text-[10px] text-slate-400 font-bold block">— {test.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-10 px-4 max-w-4xl mx-auto z-10 relative">
        <div className="text-left mb-6 space-y-1">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">General FAQs</h2>
          <p className="text-[10px] text-slate-500">Frequently queried parameters</p>
        </div>

        <div className="space-y-3">
          {[
            { q: "How do I join a video consultation?", a: "Simply navigate to the Patient Portal layout after booking. Under the Video Consult menu, click Join Call to connect with your active doctor." },
            { q: "Are prescriptions generated instantly?", a: "Yes. Once the doctor signs the EHR prescription form, details sync immediately to your Medical Records folder where you can view or print them." }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden text-left">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-100 dark:border-slate-850 p-4 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950/40"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky Bottom Call-to-action button */}
      <div className="fixed bottom-24 inset-x-4 z-30 lg:hidden pointer-events-none">
        <button
          onClick={() => { changeRole('patient'); navigate('/patient/find-doctor'); }}
          className="w-full pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-2xl shadow-xl shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-1.5 transition-transform"
        >
          <Calendar size={14} />
          <span>Book Quick Appointment</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-8 px-4 text-left space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-blue-605 flex items-center justify-center text-white text-xs font-bold">
            D+
          </div>
          <span className="font-extrabold text-white text-sm">DOCTORSIN</span>
        </div>
        <p className="text-[10px]">
          © {new Date().getFullYear()} DOCTORSIN Platform. Built as a high-fidelity interactive SaaS prototype.
        </p>
      </footer>
    </div>
  );
};
