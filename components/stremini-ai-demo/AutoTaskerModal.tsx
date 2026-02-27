"use client"


import React, { useState, useEffect } from 'react';

export const AutoTaskerModal: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="absolute inset-0 z-[200] bg-black/40 backdrop-blur-md flex items-center justify-center p-6">
      <div className="w-full bg-[#121212] rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-90 duration-300">
        <div className="p-5">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white/90">Auto Tasker</h3>
              <div className="w-6 h-6 rounded-full bg-red-900/40 text-red-500 flex items-center justify-center text-xs">×</div>
           </div>

           <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-white/50">Understood:</p>
                <p className="text-sm font-semibold text-blue-400">open WhatsApp</p>
              </div>

              <div className="bg-black/60 rounded-2xl p-4 border border-white/5 min-h-[120px]">
                 <div className="flex flex-col gap-2">
                    <p className="text-xs text-white/70">You said: <span className="text-white">open WhatsApp</span></p>
                    
                    {step >= 1 && (
                      <div className="flex items-center gap-2 text-xs text-blue-400 animate-in fade-in duration-500">
                        <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        Planning actions...
                      </div>
                    )}

                    {step >= 2 && (
                      <div className="text-xs text-green-400 animate-in slide-in-from-left-2 duration-500 mt-2">
                        ✓ Launching WhatsApp Application
                      </div>
                    )}
                 </div>
              </div>

              {/* Fake Pulse Circle */}
              <div className="flex justify-center py-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.6)] animate-pulse">
                  <span className="text-2xl">🎙️</span>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

