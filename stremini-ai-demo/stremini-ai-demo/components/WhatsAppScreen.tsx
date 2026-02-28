
import React from 'react';

interface WhatsAppScreenProps {
  onBack: () => void;
}

export const WhatsAppScreen: React.FC<WhatsAppScreenProps> = ({ onBack }) => {
  return (
    <div className="w-full h-full bg-[#0b141a] flex flex-col">
      {/* Header */}
      <div className="bg-[#1f2c34] px-4 pt-12 pb-3 flex items-center gap-3">
        <button onClick={onBack} className="text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden">
          <img src="https://picsum.photos/100/100" alt="avatar" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium leading-tight">Lunar Dev</h3>
          <p className="text-white/60 text-xs">typing...</p>
        </div>
        <div className="flex gap-4 text-white/80">
          <span className="text-xl">📞</span>
          <span className="text-xl">⋮</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
        <div className="self-center bg-[#182229] px-3 py-1 rounded text-[10px] text-white/50 uppercase tracking-wider mb-2">Today</div>
        
        <div className="self-start max-w-[80%] bg-[#1f2c34] text-white p-2.5 rounded-lg rounded-tl-none shadow-sm relative">
          <p className="text-sm">Acha</p>
          <p className="text-sm">Hum aisa b toh kr skty link dalo bta dy scam k nai?</p>
          <span className="text-[10px] text-white/40 block text-right mt-1">8:15 PM</span>
        </div>

        <div className="self-end max-w-[80%] bg-[#005c4b] text-white p-2.5 rounded-lg rounded-tr-none shadow-sm">
          <p className="text-sm">Nahi kar sakte hai but hume ye dikhana hai stremini app kaise work karta hai</p>
          <div className="flex justify-end items-center gap-1 mt-1">
            <span className="text-[10px] text-white/60">8:15 PM</span>
            <span className="text-blue-400">✓✓</span>
          </div>
        </div>

        <div className="self-end max-w-[80%] bg-[#005c4b] text-white p-2.5 rounded-lg rounded-tr-none shadow-sm">
          <p className="text-sm">Same ui</p>
          <div className="flex justify-end items-center gap-1 mt-1">
            <span className="text-[10px] text-white/60">8:15 PM</span>
            <span className="text-blue-400">✓✓</span>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="p-3 bg-[#1f2c34] flex items-center gap-2">
        <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 text-white/40 text-sm">
          Message
        </div>
        <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white">
          🎙️
        </div>
      </div>
    </div>
  );
};
