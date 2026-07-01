import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, AlertCircle, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  options?: string[];
  action?: { label: string; onClick: () => void };
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Namaskaram! I am your DOCTORSIN AI Assistant. Select an option below or describe your symptoms to find top specialists in Kochi.',
      options: ['🌡️ Check Symptoms', '🏥 Nearest Hospitals', '💼 Health Packages', '🚨 SOS Emergency']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const navigate = useNavigate();
  const { changeRole } = useDemo();

  const handleOptionClick = (option: string) => {
    // Add user message
    const userMsg: ChatMessage = { sender: 'user', text: option };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let aiResponse: ChatMessage = { sender: 'ai', text: '' };

      if (option.includes('Check Symptoms')) {
        aiResponse = {
          sender: 'ai',
          text: 'Please select your primary symptom category for clinical department mapping:',
          options: ['Fever & Cold', 'Chest Tightness', 'Skin Allergy']
        };
      } else if (option.includes('Fever & Cold')) {
        aiResponse = {
          sender: 'ai',
          text: 'A combination of fever and cold is best evaluated by General Medicine. We recommend consulting Dr. Haridas Menon at Aster Medcity, Edappally.',
          action: {
            label: 'Book Consultation (₹800)',
            onClick: () => {
              setIsOpen(false);
              changeRole('patient');
              navigate('/patient/find-doctor');
            }
          }
        };
      } else if (option.includes('Chest Tightness')) {
        aiResponse = {
          sender: 'ai',
          text: 'Warning: Chest tightness can be a sign of a cardiac event. If acute, trigger our SOS panel. For routine checks, book Dr. Haridas Menon (Cardiology).',
          action: {
            label: 'Consult Cardiologist (₹800)',
            onClick: () => {
              setIsOpen(false);
              changeRole('patient');
              navigate('/patient/find-doctor');
            }
          }
        };
      } else if (option.includes('Skin Allergy')) {
        aiResponse = {
          sender: 'ai',
          text: 'Skin rashes or itching are best evaluated by Dermatology. Dr. Anjali Nair is available for video consults today.',
          action: {
            label: 'Book Dermatologist (₹600)',
            onClick: () => {
              setIsOpen(false);
              changeRole('patient');
              navigate('/patient/find-doctor');
            }
          }
        };
      } else if (option.includes('Nearest Hospitals')) {
        aiResponse = {
          sender: 'ai',
          text: 'Top multi-specialty complexes in Kochi with active ICU bed pools:\n\n1. **Aster Medcity** (Cheranallur, Kakkanad bypass)\n2. **Rajagiri Hospital** (Aluva)\n3. **Amrita Hospital** (Edappally)\n4. **Sunrise Hospital** (Kakkanad)',
          options: ['🌡️ Check Symptoms', '💼 Health Packages']
        };
      } else if (option.includes('Health Packages')) {
        aiResponse = {
          sender: 'ai',
          text: 'We offer specialized wellness packages in Ernakulam district starting at ₹1,999. Includes full pathology, CBC, cholesterol, and physician consultation.',
          options: ['🌡️ Check Symptoms', '🏥 Nearest Hospitals']
        };
      } else if (option.includes('SOS Emergency')) {
        aiResponse = {
          sender: 'ai',
          text: 'CRITICAL: Live coordinates dispatched. Our priority emergency ambulance pool has been notified. Ambulance AMB-402 is routing now.',
          options: ['🌡️ Check Symptoms', '🏥 Nearest Hospitals']
        };
      } else {
        aiResponse = {
          sender: 'ai',
          text: 'I apologize, I did not catch that. Please select one of our quick action options.',
          options: ['🌡️ Check Symptoms', '🏥 Nearest Hospitals', '💼 Health Packages']
        };
      }

      setMessages(prev => [...prev, aiResponse]);
    }, 600);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let aiResponse: ChatMessage = { sender: 'ai', text: '' };

      if (lower.includes('fever') || lower.includes('cough') || lower.includes('headache')) {
        aiResponse = {
          sender: 'ai',
          text: 'Fever or headaches should be evaluated by a General Physician. Dr. Haridas Menon is available at Aster Medcity.',
          action: {
            label: 'Book Consultation (₹800)',
            onClick: () => {
              setIsOpen(false);
              changeRole('patient');
              navigate('/patient/find-doctor');
            }
          }
        };
      } else if (lower.includes('heart') || lower.includes('chest') || lower.includes('cardio')) {
        aiResponse = {
          sender: 'ai',
          text: 'We recommend immediate evaluation by Cardiology department. You can book an appointment with our specialists in Kochi.',
          action: {
            label: 'View Cardiologists',
            onClick: () => {
              setIsOpen(false);
              changeRole('patient');
              navigate('/patient/find-doctor');
            }
          }
        };
      } else if (lower.includes('hospital') || lower.includes('clinic')) {
        aiResponse = {
          sender: 'ai',
          text: 'Here are the nearest verified clinics in Kochi: Aster Medcity, Amrita Hospital, Sunrise Hospital, and Renai Medicity.',
          options: ['🌡️ Check Symptoms', '💼 Health Packages']
        };
      } else {
        aiResponse = {
          sender: 'ai',
          text: 'Understood. Would you like to check diagnostic health packages or find certified medical specialists near Ernakulam?',
          options: ['🌡️ Check Symptoms', '🏥 Nearest Hospitals', '💼 Health Packages']
        };
      }

      setMessages(prev => [...prev, aiResponse]);
    }, 650);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xl border border-blue-500/20 cursor-pointer select-none"
        >
          {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
        </motion.button>
      </div>

      {/* Chat Window Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[380px] h-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col select-none text-left"
          >
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs">DOCTORSIN AI Assistant</h4>
                  <span className="text-[9px] text-blue-100 font-medium">Kerala eHealth Care Roster</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/15 rounded-lg text-white/80 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {msg.sender === 'user' ? <User size={12} /> : 'AI'}
                  </div>
                  
                  <div className="space-y-2">
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 text-slate-800 dark:text-slate-250 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>

                    {/* Action button redirects */}
                    {msg.action && (
                      <button
                        onClick={msg.action.onClick}
                        className="bg-emerald-650 hover:bg-emerald-700 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{msg.action.label}</span>
                        <ArrowRight size={12} />
                      </button>
                    )}

                    {/* Quick-reply chip selectors */}
                    {msg.options && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleOptionClick(opt)}
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-150 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 shrink-0 flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Ask about symptoms, hospitals, etc..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500 dark:text-white"
              />
              <button 
                type="submit"
                className="p-2.5 bg-blue-650 text-white rounded-xl hover:bg-blue-755 transition-colors cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
