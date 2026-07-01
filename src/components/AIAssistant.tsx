import React, { useState } from 'react';
import { useDemo } from '../context/DemoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, Star } from 'lucide-react';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  options?: string[];
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: "Hello! I am your DOCTORSIN AI Health Navigator. How can I help you today?",
      options: ['Check Vitals Symptoms', 'Find Cardiological Specialist', 'Hospital Bed Availability']
    }
  ]);
  const [textVal, setTextVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleOptionClick = (opt: string) => {
    // User message
    const userMsg: ChatMessage = { sender: 'user', text: opt };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let aiText = "I can definitely search that for you. Let me check the directory.";
      let options: string[] = ['Check Symptoms', 'Exit Chat'];
      
      if (opt.includes('Symptoms')) {
        aiText = "Please note: This is an AI checklist, not a diagnosis. Are you experiencing chest discomfort, breathlessness, or persistent fever?";
        options = ['Chest Tightness', 'Seasonal Cough', 'Fever Checkup'];
      } else if (opt.includes('Cardiological')) {
        aiText = "We have 18 verified Cardiologists affiliated. Dr. Haridas is highly rated (4.8★) with next availability tomorrow at 10:00 AM. Would you like to schedule?";
        options = ['Go to Booking', 'Check other doctors'];
      } else if (opt.includes('Bed')) {
        aiText = "Apollo Premium Clinic has 78 beds available. General Ward has 42% occupancy, while ICU ventilators are at 85%.";
        options = ['View Bed Management', 'Platform Stats'];
      } else if (opt.includes('Chest Tightness')) {
        aiText = "Chest discomfort warrants careful checking. I recommend consulting Dr. Haridas (Cardiologist) or visiting the Apollo Emergency Department.";
        options = ['Book Dr. Haridas', 'View emergency contacts'];
      }
      
      setMessages(prev => [...prev, { sender: 'ai', text: aiText, options }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textVal.trim()) return;

    const query = textVal;
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setTextVal('');
    setIsTyping(true);

    setTimeout(() => {
      let aiText = `Understood. I've noted down your query: "${query}". Let me lookup the medical directory database.`;
      
      if (query.toLowerCase().includes('heart') || query.toLowerCase().includes('chest')) {
        aiText = "For cardiovascular concerns, I suggest booking a checkup with Dr. Haridas. You can click 'Go to Booking' to schedule.";
      } else if (query.toLowerCase().includes('asthma') || query.toLowerCase().includes('breath')) {
        aiText = "For asthma management, we recommend scheduling a virtual telehealth review with our pulmonologists.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiText, options: ['Check Symptoms', 'Find Cardiologist'] }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[400px] text-left"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-sky-500 text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Bot size={20} className="text-white" />
                <div>
                  <h4 className="font-extrabold text-sm leading-tight">AI Health Navigator</h4>
                  <span className="text-[10px] text-blue-100 font-semibold flex items-center gap-1">
                    <Sparkles size={10} /> Powered by DOCTORSIN AI
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed font-semibold ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-205 rounded-tl-none border border-slate-200/50 dark:border-slate-800'
                  }`}>
                    {msg.text}
                  </div>
                  
                  {/* Interactive options bubbles */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mt-2 max-w-[90%]">
                      {msg.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleOptionClick(opt)}
                          className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-blue-100/50 dark:hover:bg-blue-900/80 transition-colors text-left"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium p-1">
                  <Bot size={14} className="animate-spin" />
                  <span>AI assistant is typing...</span>
                </div>
              )}
            </div>

            {/* TextInput */}
            <form onSubmit={handleSendText} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex gap-2 shrink-0">
              <input 
                type="text" 
                placeholder="Ask symptoms, recommend doctors..." 
                value={textVal}
                onChange={(e) => setTextVal(e.target.value)}
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500 text-slate-800 dark:text-white"
              />
              <button 
                type="submit"
                disabled={!textVal.trim()}
                className="p-2 bg-blue-600 text-white rounded-xl disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button Toggle */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-12 w-12 bg-gradient-to-tr from-blue-600 to-sky-500 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl border border-blue-500/20"
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </motion.button>
    </div>
  );
};
