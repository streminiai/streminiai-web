"use client"


import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface FloatingActionBubbleProps {
  onOpenChat: () => void;
  onOpenKeyboard: () => void;
  onOpenScam: () => void;
  onOpenTasker: () => void;
}

// Orbital button data
const ORBITAL_BTNS = [
  {
    id: 'btn-1',
    icon: 'https://img.icons8.com/ios-filled/50/ffffff/speech-bubble.png',
    label: 'Chat',
    angle: 0,       // degrees: top
    action: 'chat',
  },
  {
    id: 'btn-2',
    icon: 'https://img.icons8.com/?size=100&id=60983&format=png&color=ffffff',
    label: 'Manager',
    angle: 45,
    action: 'tasker',
  },
  {
    id: 'btn-3',
    icon: 'https://img.icons8.com/ios-filled/50/ffffff/artificial-intelligence.png',
    label: 'AI',
    angle: 90,
    action: 'chat2',
  },
  {
    id: 'btn-4',
    icon: 'https://img.icons8.com/ios-filled/50/ffffff/keyboard.png',
    label: 'Keyboard',
    angle: 135,
    action: 'keyboard',
  },
  {
    id: 'btn-5',
    icon: 'https://img.icons8.com/ios-filled/50/ffffff/shield.png',
    label: 'Guard',
    angle: 180,
    action: 'scam',
  },
];

const ORBIT_RADIUS = 68; // px

export const FloatingActionBubble: React.FC<FloatingActionBubbleProps> = ({
  onOpenChat,
  onOpenKeyboard,
  onOpenScam,
  onOpenTasker,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeBtn, setActiveBtn] = useState<string | null>(null);
  // Position: distance from right edge and top edge of parent
  const [position, setPosition] = useState({ x: 28, y: 300 });
  const [isDragging, setIsDragging] = useState(false);
  const didDrag = useRef(false);
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const parent = containerRef.current?.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const newY = clientY - rect.top - dragStartOffset.current.y;
      const newX = rect.right - clientX - dragStartOffset.current.x;
      setPosition({
        x: Math.max(10, Math.min(rect.width - 60, newX)),
        y: Math.max(80, Math.min(rect.height - 120, newY)),
      });
      didDrag.current = true;
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
    const onUp = () => setIsDragging(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging]);

  const handleLogoStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    didDrag.current = false;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragStartOffset.current = {
      x: (rect.right + rect.left) / 2 - clientX,
      y: clientY - (rect.top + rect.bottom) / 2,
    };
    // Use right-edge offset
    const parent = containerRef.current?.parentElement;
    if (parent) {
      const pRect = parent.getBoundingClientRect();
      dragStartOffset.current = {
        x: pRect.right - clientX - position.x,
        y: clientY - pRect.top - position.y,
      };
    }
    setIsDragging(true);
  };

  const handleLogoClick = () => {
    if (didDrag.current) return;
    setIsOpen((prev) => !prev);
    setActiveBtn(null);
  };

  const handleBtnClick = (action: string, btnId: string) => {
    setActiveBtn(btnId);
    setIsOpen(false);
    switch (action) {
      case 'chat':
      case 'chat2':
        onOpenChat();
        break;
      case 'keyboard':
        onOpenKeyboard();
        break;
      case 'scam':
        onOpenScam();
        break;
      case 'tasker':
        onOpenTasker();
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        right: position.x,
        top: position.y,
        width: 56,
        height: 56,
        zIndex: 300,
        // No transition while dragging
        transition: isDragging ? 'none' : 'right 0.3s cubic-bezier(.18,.89,.32,1.28), top 0.3s cubic-bezier(.18,.89,.32,1.28)',
      }}
    >
      {/* Orbital Buttons */}
      {ORBITAL_BTNS.map((btn, idx) => {
        const rad = ((btn.angle - 90) * Math.PI) / 180;
        const tx = Math.cos(rad) * ORBIT_RADIUS;
        const ty = Math.sin(rad) * ORBIT_RADIUS;
        const isActive = activeBtn === btn.id;
        return (
          <button
            key={btn.id}
            onClick={() => handleBtnClick(btn.action, btn.id)}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: isActive ? '1.5px solid rgba(0,174,255,0.6)' : '1px solid transparent',
              background: isActive
                ? 'linear-gradient(135deg,#00b7ff,#007bff)'
                : '#1a1a1a',
              boxShadow: isActive
                ? '0 0 8px rgba(0,174,255,.6), 0 0 20px rgba(0,174,255,.4), inset 0 0 10px rgba(0,174,255,.3)'
                : '0 2px 8px rgba(0,0,0,.5)',
              cursor: 'pointer',
              zIndex: 1,
              opacity: isOpen ? 1 : 0,
              pointerEvents: isOpen ? 'auto' : 'none',
              transform: isOpen
                ? `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`
                : `translate(-50%, -50%)`,
              transition: isOpen
                ? `transform 0.35s cubic-bezier(.34,1.56,.64,1) ${idx * 60}ms, opacity 0.25s ease ${idx * 60}ms`
                : `transform 0.25s ease ${(4 - idx) * 40}ms, opacity 0.2s ease`,
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
            title={btn.label}
          >
            <Image
              src={btn.icon}
              alt={btn.label}
              width={20}
              height={20}
              style={{ pointerEvents: 'none' }}
              unoptimized // Allow external URLs easily without setup
            />
          </button>
        );
      })}

      {/* Center Logo */}
      <div
        onMouseDown={handleLogoStart}
        onTouchStart={handleLogoStart}
        onClick={handleLogoClick}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isOpen
            ? '0 0 22px rgba(0,170,255,0.85), 0 0 45px rgba(0,170,255,0.4)'
            : '0 0 15px rgba(0,170,255,0.6), 0 4px 16px rgba(0,0,0,0.6)',
          cursor: 'pointer',
          zIndex: 2,
          overflow: 'hidden',
          border: '2px solid rgba(0,170,255,0.35)',
          transition: 'box-shadow 0.3s ease, transform 0.2s ease',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <Image
          src="https://i.ibb.co/67d1xHQx/IMG-20250731-125211-109.jpg"
          alt="Stremini AI"
          draggable={false}
          fill
          sizes="56px"
          className="object-cover"
          style={{ pointerEvents: 'none', borderRadius: '50%' }}
          unoptimized
        />
        {/* Pulse ring */}
        <span
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            border: '2px solid rgba(0,170,255,0.35)',
            animation: 'streminiPulse 2s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      </div>

      <style>{`
        @keyframes streminiPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.18); opacity: 0.15; }
        }
      `}</style>
    </div>
  );
};

