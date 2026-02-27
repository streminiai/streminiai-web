"use client"


import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="relative w-full max-w-[375px] max-h-[812px] h-[90vh] aspect-[9/19.5] bg-[#000] rounded-[3rem] border-[8px] border-[#1a1a1a] overflow-hidden phone-shadow ring-4 ring-[#111] flex flex-col">
      {/* Top Notch / Dynamic Island area */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30%] h-7 bg-black rounded-b-2xl z-50 flex items-center justify-center">
        <div className="w-[40%] h-3 bg-gray-900 rounded-full"></div>
      </div>

      {/* Screen Content */}
      <div className="relative flex-1 bg-[#0a0a0a] overflow-hidden">
        {children}
      </div>

      {/* Bottom Home Indicator Area */}
      <div className="h-6 w-full bg-[#0a0a0a] relative flex justify-center items-center">
         <div className="w-32 h-1 bg-white/30 rounded-full pointer-events-none"></div>
      </div>
    </div>
  );
};

