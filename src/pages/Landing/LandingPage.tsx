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
  const featuredDoctors = activeDocs.slice(0, 4);

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 selection:bg-blue-500 selection:text-white relative overflow-hidden">
      
      {/* Floating Particles background animation */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[
          { x: '10%', y: '20%', size: 100, delay: 0 },
          { x: '80%', y: '15%', size: 150, delay: 2 },
          { x: '75%', y: '80%', size: 120, delay: 4 },
          { x: '15%', y: '75%', size: 90, delay: 1 }
        ].map((pt, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -25, 0],
              x: [0, 15, 0]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: pt.delay,
              ease: 'easeInOut'
            }}
            className="absolute rounded-full bg-blue-550/5 dark:bg-blue-500/5 blur-2xl"
            style={{ left: pt.x, top: pt.y, width: pt.size, height: pt.size }}
          />
        ))}
      </div>

      {/* Navigation */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <span className="font-extrabold text-xl">D+</span>
            </div>
            <div>
              <span className="font-bold text-slate-905 dark:text-white text-lg tracking-tight">DOCTORS</span>
              <span className="font-extrabold text-blue-600 text-lg tracking-tight">IN</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-655 dark:text-slate-300">
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#specialists" className="hover:text-blue-600 transition-colors">Specialists</a>
            <a href="#testimonials" className="hover:text-blue-600 transition-colors">Testimonials</a>
            <a href="#faqs" className="hover:text-blue-600 transition-colors">FAQs</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-650 px-4 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button 
              onClick={() => { changeRole('patient'); navigate('/patient/find-doctor'); }}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/10 cursor-pointer"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 text-left space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 text-xs font-semibold"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>Next-Gen Enterprise Medical Platform</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Instant Clinician Care, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">
                Anytime & Anywhere
              </span>
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
              Connect with top certified medical specialists, track hospital resource availability, compile prescription records, and monitor global platforms.
            </p>

            {/* Interactive Search Panel */}
            <div className="bg-white dark:bg-slate-900/80 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800 p-4 max-w-2xl backdrop-blur-md">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2">
                  <Search size={18} className="text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search doctor, hospital, or specialty..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full dark:text-white"
                  />
                </div>
                <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2">
                  <select 
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm text-slate-600 dark:text-slate-400 font-semibold w-full"
                  >
                    {specialties.map(spec => (
                      <option key={spec} value={spec}>{spec === 'All' ? 'All Specialties' : spec}</option>
                    ))}
                  </select>
                </div>
                <button 
                  type="submit"
                  className="bg-blue-600 text-white font-semibold text-sm rounded-xl px-6 py-3 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Search Directory</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* 3D Hospital Graphic Card Mock */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div 
              whileHover={{ rotateY: 5, rotateX: 5 }}
              className="relative w-80 sm:w-96 aspect-square rounded-[2rem] bg-gradient-to-tr from-blue-700 to-sky-500 p-8 text-white shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 right-0 h-40 w-40 bg-white/10 rounded-full blur-2xl" />
              
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <Activity size={24} className="text-white" />
                  <span className="font-extrabold tracking-wider">DOCTORSIN</span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full border border-white/20">Telehealth Lobby</span>
              </div>

              {/* Heartbeat pulse graphic mock */}
              <div className="h-16 w-full flex items-center justify-center opacity-30 my-4">
                <svg viewBox="0 0 100 30" className="w-full h-full stroke-white fill-none stroke-2">
                  <path d="M0,15 L30,15 L35,5 L40,25 L45,15 L100,15" strokeDasharray="3 3" />
                </svg>
              </div>

              <div className="space-y-4 z-10 text-left">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <p className="text-xs text-blue-105 font-bold uppercase tracking-wider">Active Telehealth Call</p>
                  <h4 className="font-bold text-sm mt-0.5">Dr. Haridas Nair</h4>
                  <p className="text-[11px] text-blue-100 mt-1">Lobby connection stable</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Search Results */}
      <AnimatePresence>
        {searched && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-12 px-6 shadow-inner z-10 relative"
          >
            <div className="max-w-7xl mx-auto text-left">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Search Results {selectedSpecialty !== 'All' && `for ${selectedSpecialty}`}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">We found {searchResults.length} matching specialists.</p>
                </div>
                <button 
                  onClick={() => { setSearched(false); setSearchQuery(''); }}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-605 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100/50 px-3.5 py-1.5 rounded-lg"
                >
                  Clear Search
                </button>
              </div>

              {isSearching ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((doc) => (
                    <div key={doc.id} className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg transition-all bg-slate-50 dark:bg-slate-850 flex flex-col justify-between">
                      <div className="flex gap-4">
                        <img src={doc.imageUrl} alt={doc.name} className="h-16 w-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800" />
                        <div className="text-left">
                          <span className="text-[10px] font-bold text-blue-650 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full uppercase">
                            {doc.specialty}
                          </span>
                          <h4 className="font-bold text-slate-800 dark:text-white text-base mt-1">{doc.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{doc.clinicName}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Star size={12} className="text-amber-500 fill-amber-500" />
                            <span className="text-xs text-amber-550 font-bold">{doc.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-base font-extrabold text-slate-800 dark:text-white">${doc.fee}</span>
                        <button 
                          onClick={() => handleBookNow(doc.id)}
                          className="bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
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

      {/* Trusted Hospitals Logo Section */}
      <section className="py-12 bg-white/40 dark:bg-slate-900/25 border-y border-slate-200/50 dark:border-slate-800/40 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <span className="text-[10px] text-slate-450 uppercase tracking-widest font-bold">Trusted by Affiliated National Networks</span>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50 dark:opacity-40">
            {['Apollo 24/7', 'Aster Medcity', 'Amrita Hospital', 'Fortis Healthcare', 'Manipal Specialist'].map((hosp) => (
              <span key={hosp} className="font-black tracking-wider text-base sm:text-lg text-slate-600 dark:text-slate-300">
                {hosp}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Our Core Services</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Elevating patient and clinician dashboards with integrated digital EHR systems.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Video Telehealth Room', desc: 'Secure, high-definition video consultations with certified specialists right from your dashboard layout.', icon: Video, color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' },
            { title: 'Ward Bed Management', desc: 'Real-time bed availability allocation widgets displaying ICU, Ward A, and cleaning statuses.', icon: Calendar, color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' },
            { title: 'Prescription Records Vault', desc: 'Get digital, verified prescription records complete with dosage parameters and printable formats.', icon: ShoppingBag, color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400' }
          ].map((serv, index) => {
            const Icon = serv.icon;
            return (
              <div key={index} className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left flex flex-col justify-between group backdrop-blur-md">
                <div className="space-y-4">
                  <div className={`h-12 w-12 rounded-2xl ${serv.color} flex items-center justify-center shadow-inner`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-605 transition-colors">
                    {serv.title}
                  </h3>
                  <p className="text-slate-655 dark:text-slate-405 text-sm leading-relaxed">
                    {serv.desc}
                  </p>
                </div>
                <div className="pt-6">
                  <button 
                    onClick={() => { changeRole('patient'); navigate('/patient/find-doctor'); }}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Get Started</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Specialists */}
      <section id="specialists" className="py-20 bg-white dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/40 z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4">
            <div className="text-left max-w-xl space-y-3">
              <h2 className="text-3xl font-black text-slate-905 dark:text-white tracking-tight">Featured Medical Specialists</h2>
              <p className="text-slate-550 dark:text-slate-400 text-sm font-medium">Consult top-rated professionals from licensed clinical facilities certified by the DOCTORSIN admin panel.</p>
            </div>
            <button 
              onClick={() => { changeRole('patient'); navigate('/patient/find-doctor'); }}
              className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-705 flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>View All Specialists</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDoctors.map((doc) => (
              <div key={doc.id} className="border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-lg transition-all flex flex-col justify-between bg-slate-50 dark:bg-slate-900/40 backdrop-blur-md">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <img src={doc.imageUrl} alt={doc.name} className="h-24 w-24 rounded-2xl object-cover mx-auto shadow-md border border-white dark:border-slate-800" />
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-lg border-2 border-slate-50 dark:border-slate-900">
                      <Award size={12} />
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-[10px] font-bold text-blue-605 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {doc.specialty}
                    </span>
                    <h4 className="font-bold text-slate-800 dark:text-white text-base mt-2">{doc.name}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{doc.clinicName}</p>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-amber-500 font-bold">
                    <Star size={13} fill="currentColor" />
                    <span>{doc.rating}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-black text-slate-800 dark:text-white">${doc.fee}</span>
                  <button 
                    onClick={() => handleBookNow(doc.id)}
                    className="bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faqs" className="py-20 px-6 max-w-4xl mx-auto z-10 relative">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl font-black text-slate-905 dark:text-white tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Everything you need to know about scheduling telehealth sessions.</p>
        </div>

        <div className="space-y-4">
          {[
            { q: "How do I join a video telehealth consultation?", a: "Simply navigate to the Patient Portal layout after booking. Under the Video Consult menu, click Join Call to connect with your active doctor using a high-fidelity Meet-style interface." },
            { q: "Are prescriptions generated instantly?", a: "Yes. Once the doctor signs the EHR prescription form, details sync immediately to your Medical Records folder where you can view or print them." },
            { q: "How are hospital bed counts updated?", a: "Hospital admins manage general/ICU allocations in real time. Discharged units trigger simulated disinfection countdowns before returning to service." }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-white cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-100 dark:border-slate-850 p-5 text-xs text-slate-500 dark:text-slate-405 leading-relaxed bg-slate-50 dark:bg-slate-950/40"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <span className="font-bold text-sm">D+</span>
            </div>
            <span className="font-bold text-white text-base">DOCTORSIN</span>
          </div>

          <p className="text-xs">
            © {new Date().getFullYear()} DOCTORSIN Platform. Built as a high-fidelity interactive SaaS prototype.
          </p>

          <div className="flex gap-6 text-xs font-semibold">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
