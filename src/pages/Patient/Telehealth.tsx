import React, { useState, useEffect, useRef } from 'react';
import { useDemo } from '../../context/DemoContext';
import { 
  Video, VideoOff, Mic, MicOff, ScreenShare, PhoneOff, 
  Send, AlertCircle, FileText, MessageSquare, Bot, Sparkles, Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MedicalAvatar } from '../../components/MedicalAvatar';

export const Telehealth: React.FC = () => {
  const { appointments, sendMessage } = useDemo();
  const [activeApptId, setActiveApptId] = useState<string | null>(null);
  
  // Call status
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCallConnected, setIsCallConnected] = useState(true);
  
  // Call Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Chat input
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Find active appointment
  useEffect(() => {
    const id = localStorage.getItem('demo_active_telehealth_appt_id');
    if (id) {
      setActiveApptId(id);
    } else {
      const upcomingVideo = appointments.find(a => a.status === 'upcoming' && a.type === 'video');
      if (upcomingVideo) {
        setActiveApptId(upcomingVideo.id);
      }
    }
  }, [appointments]);

  const activeAppt = appointments.find(a => a.id === activeApptId);

  // Call timer effect
  useEffect(() => {
    if (!isCallConnected) return;
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCallConnected]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeAppt?.chatHistory]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeApptId) return;

    sendMessage(activeApptId, 'patient', chatInput);
    const sentText = chatInput;
    setChatInput('');

    setTimeout(() => {
      let replyText = "Understood. Let me note this down in your medical file.";
      if (sentText.toLowerCase().includes('hello') || sentText.toLowerCase().includes('hi')) {
        replyText = "Hello Alexander! How have your asthma symptoms been since our last review?";
      } else if (sentText.toLowerCase().includes('asthma') || sentText.toLowerCase().includes('breath')) {
        replyText = "I see. Are you using your Albuterol inhaler more than twice a week?";
      } else if (sentText.toLowerCase().includes('yes') || sentText.toLowerCase().includes('inhaler')) {
        replyText = "Okay. I will prescribe a daily preventer inhaler (Montelukast) to control the inflammation. Make sure to take it daily.";
      } else if (sentText.toLowerCase().includes('prescription') || sentText.toLowerCase().includes('medicine')) {
        replyText = "Yes, I am writing down the prescription now. It will appear on your portal immediately after we end the call.";
      }
      sendMessage(activeApptId, 'doctor', replyText);
    }, 1500);
  };

  const handleEndCall = () => {
    setIsCallConnected(false);
    localStorage.removeItem('demo_active_telehealth_appt_id');
  };

  if (!activeAppt) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500 max-w-xl mx-auto space-y-4 my-10 text-left shadow-sm">
        <AlertCircle size={40} className="mx-auto text-slate-400" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Active Telehealth Call</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          There are no active video appointments scheduled for today. Book an appointment with video mode enabled to access this room.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col lg:flex-row gap-6 text-left">
      {/* Left Column: Video Room Stream */}
      <div className="flex-1 bg-slate-900 dark:bg-slate-950 rounded-3xl overflow-hidden relative flex flex-col justify-between p-6 text-white min-h-[350px]">
        {/* Top Header Indicators */}
        <div className="flex items-center justify-between z-10">
          <span className="bg-red-500/80 border border-red-500/20 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span>LIVE Call</span>
          </span>
          
          <div className="flex items-center gap-2">
            <span className="bg-slate-850/60 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5">
              <Clock size={12} className="text-blue-400" />
              {formatTimer(secondsElapsed)}
            </span>
            <span className="bg-slate-850/60 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-semibold">
              {activeAppt.doctorName}
            </span>
          </div>
        </div>

        {/* Video Streams Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isCallConnected ? (
            isVideoOn ? (
              <div className="relative w-full h-full bg-slate-800 flex flex-col items-center justify-center gap-3">
                <MedicalAvatar name={activeAppt.doctorName} type="doctor" size={20} />
                <span className="text-xs text-slate-400 font-semibold animate-pulse">Connecting...</span>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/40 pointer-events-none" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-500">
                <VideoOff size={48} />
                <span className="text-xs font-semibold">Doctor camera off</span>
              </div>
            )
          ) : (
            <div className="text-center space-y-4">
              <PhoneOff size={48} className="text-rose-500 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold">Call Terminated</h4>
              <p className="text-xs text-slate-450">The consultation session has ended.</p>
            </div>
          )}

          {/* Self video thumbnail */}
          {isCallConnected && (
            <div className="absolute bottom-20 right-4 h-28 sm:h-36 aspect-video bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl z-20 flex items-center justify-center">
              <MedicalAvatar name="You" type="patient" size={12} />
            </div>
          )}
        </div>

        {/* Call Action Controls */}
        {isCallConnected && (
          <div className="flex justify-center items-center gap-4 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-2xl w-fit mx-auto border border-slate-800 z-10 shadow-2xl">
            <button 
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-650 text-white'
              }`}
            >
              {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            <button 
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                isVideoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-655 text-white'
              }`}
            >
              {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
            </button>
            <button 
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                isScreenSharing ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              <ScreenShare size={18} />
            </button>
            <button 
              onClick={handleEndCall}
              className="p-3 bg-rose-650 hover:bg-rose-700 text-white rounded-xl transition-all cursor-pointer shadow-lg shadow-rose-650/20"
            >
              <PhoneOff size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Right Column: Chat Panel */}
      <div className="w-full lg:w-96 bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-3xl flex flex-col justify-between overflow-hidden shadow-sm shrink-0 h-full">
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-blue-600" />
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">Consultation Chat</h4>
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
            Signaling pipeline
          </span>
        </div>

        {/* Messaging Box */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeAppt.chatHistory.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No chat logs yet. Introduce yourself to the doctor!
            </div>
          ) : (
            activeAppt.chatHistory.map((msg, index) => {
              const isSelf = msg.sender === 'patient';
              return (
                <div key={index} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[80%] text-xs leading-normal font-semibold ${
                    isSelf 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-405 mt-1 block px-1">{msg.time}</span>
                </div>
              );
            })
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex gap-2 shrink-0">
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={!isCallConnected}
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500 dark:text-white disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!chatInput.trim() || !isCallConnected}
            className="p-2.5 bg-blue-650 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-blue-500/10 shrink-0"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
