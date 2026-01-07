
import React, { useEffect, useState } from 'react';
import { SafetyStatus } from '../types';

interface AlarmProps {
  status: SafetyStatus;
}

const AlarmSystem: React.FC<AlarmProps> = ({ status }) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let interval: any = null;

    if (!isMuted && status === SafetyStatus.CRITICAL) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playBeep = () => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.4);
        g.gain.setValueAtTime(0.05, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.connect(g);
        g.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      };

      playBeep();
      interval = setInterval(playBeep, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (audioCtx) audioCtx.close();
    };
  }, [status, isMuted]);

  const getStatusLabel = () => {
    switch (status) {
      case SafetyStatus.CRITICAL: return 'خطر حرج للغاية';
      case SafetyStatus.WARNING: return 'تحذير النظام';
      default: return 'نظام مستقر';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100 flex items-center justify-between no-print" dir="rtl">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`p-4 rounded-2xl transition-all ${isMuted ? 'bg-slate-100 text-slate-400' : 'bg-[#0f172a] text-white shadow-xl'}`}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">نظام إنذار الصافرة</span>
          <p className={`text-3xl font-black ${status === SafetyStatus.CRITICAL ? 'text-red-600' : 'text-slate-900'}`}>
            {getStatusLabel()}
          </p>
        </div>
        <div className={`p-4 rounded-2xl ${status === SafetyStatus.CRITICAL ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-emerald-100 text-emerald-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AlarmSystem;
