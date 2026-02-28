
import React, { useState, useRef, useEffect } from 'react';

interface FloatingActionBubbleProps {
  onOpenChat: () => void;
  onOpenKeyboard: () => void;
  onOpenScam: () => void;
  onOpenTasker: () => void;
  onReset: () => void;
}

export const FloatingActionBubble: React.FC<FloatingActionBubbleProps> = ({ 
  onOpenChat, onOpenKeyboard, onOpenScam, onOpenTasker, onReset 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 320 }); // From right and top
  const [isDragging, setIsDragging] = useState(false);
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX, e.clientY);
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleGlobalUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchmove', handleGlobalTouchMove);
    window.addEventListener('touchend', handleGlobalUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, [isDragging]);

  const updatePosition = (clientX: number, clientY: number) => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    
    // Calculate new position relative to parent edges
    // We store 'x' as distance from right edge and 'y' as distance from top
    const newY = clientY - rect.top - dragStartOffset.current.y;
    const newX = rect.right - clientX - dragStartOffset.current.x;

    // Constrain within phone screen bounds
    const boundedX = Math.max(10, Math.min(rect.width - 60, newX));
    const boundedY = Math.max(80, Math.min(rect.height - 120, newY));

    setPosition({ x: boundedX, y: boundedY });
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    
    // Offset from the center of the bubble
    dragStartOffset.current = {
      x: rect.right - clientX,
      y: clientY - rect.top
    };
    
    setIsDragging(true);
    setIsOpen(false); // Close menu when dragging starts
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDragging) return;
    setIsOpen(!isOpen);
  };

  return (
    <div 
      ref={containerRef}
      style={{ 
        right: position.x, 
        top: position.y,
        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
      }}
      className="absolute z-[300] flex flex-col items-end gap-3 select-none"
    >
      {/* Menu Options */}
      {isOpen && (
        <div className="flex flex-col gap-3 mb-2 animate-in slide-in-from-bottom-2 fade-in duration-300 pointer-events-auto">
          <MenuButton onClick={() => { onOpenChat(); setIsOpen(false); }} icon="🧠" label="AI Chat" color="bg-blue-600" />
          <MenuButton onClick={() => { onOpenKeyboard(); setIsOpen(false); }} icon="⌨️" label="Keyboard" color="bg-indigo-600" />
          <MenuButton onClick={() => { onOpenScam(); setIsOpen(false); }} icon="🛡️" label="Scam Shield" color="bg-red-600" />
          <MenuButton onClick={() => { onOpenTasker(); setIsOpen(false); }} icon="🤖" label="Automate" color="bg-purple-600" />
          <MenuButton onClick={() => { onReset(); setIsOpen(false); }} icon="🏠" label="Home" color="bg-gray-700" />
        </div>
      )}

      {/* Main Bubble */}
      <div 
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onClick={toggleMenu}
        className={`w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 shadow-[0_8px_20px_rgba(0,0,0,0.4),0_0_15px_rgba(37,99,235,0.4)] border-2 border-white/20 transition-all active:scale-90 stremini-bubble-pulse cursor-pointer group ${isOpen ? 'rotate-45' : ''}`}
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-7 h-7 text-white drop-shadow-md"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
    </div>
  );
};

const MenuButton: React.FC<{ onClick: () => void; icon: string; label: string; color: string }> = ({ onClick, icon, label, color }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className="group flex items-center gap-3 cursor-pointer outline-none"
  >
    <span className="opacity-0 group-hover:opacity-100 bg-black/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all duration-200 shadow-xl border border-white/10 translate-x-2 group-hover:translate-x-0">
      {label}
    </span>
    <div className={`w-11 h-11 rounded-2xl ${color} border border-white/20 flex items-center justify-center text-xl hover:scale-110 active:scale-90 transition-all shadow-lg`}>
      {icon}
    </div>
  </button>
);
