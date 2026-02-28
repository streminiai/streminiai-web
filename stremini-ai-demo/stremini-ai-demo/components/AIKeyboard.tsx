
import React, { useState, useRef, useEffect } from 'react';

interface AIKeyboardProps {
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
}

// ----- Simulated AI transformation engine -----

const SAMPLE_TEXT = 'i want to meet tomorrow can you come';

type Action = 'improve' | 'professional' | 'grammar' | 'friendly' | 'shorten';

const PRESETS: Record<string, Record<Action, string>> = {
  'i want to meet tomorrow can you come': {
    improve: 'I would like to meet tomorrow. Are you available?',
    professional:
      'I would like to schedule a meeting for tomorrow. Please let me know your availability.',
    grammar: 'I want to meet tomorrow. Can you come?',
    friendly: "Hey! Want to meet tomorrow? 😊",
    shorten: 'Meet tomorrow?',
  },
};

/** Generic fallback transforms when text isn't in the preset table */
function genericTransform(text: string, action: Action): string {
  const trimmed = text.trim();
  const capped = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  const withDot = capped.endsWith('.') || capped.endsWith('?') || capped.endsWith('!') ? capped : capped + '.';
  switch (action) {
    case 'improve':
      return withDot;
    case 'professional':
      return `Please be advised: ${withDot}`;
    case 'grammar':
      return withDot;
    case 'friendly':
      return `Hey! ${withDot} 😊`;
    case 'shorten': {
      const words = withDot.split(' ');
      return words.length > 6 ? words.slice(0, 5).join(' ') + '…' : withDot;
    }
  }
}

function transform(text: string, action: Action): string {
  const key = text.trim().toLowerCase();
  if (PRESETS[key]) return PRESETS[key][action];
  return genericTransform(text, action);
}

// ----- Component -----

const ACTION_BUTTONS: { label: string; emoji: string; action: Action; color: string; glow: string }[] = [
  { label: 'Improve Tone', emoji: '✨', action: 'improve', color: 'from-blue-600 to-indigo-600', glow: 'rgba(99,102,241,.5)' },
  { label: 'Make Professional', emoji: '💼', action: 'professional', color: 'from-slate-600 to-gray-700', glow: 'rgba(100,116,139,.5)' },
  { label: 'Fix Grammar', emoji: '📝', action: 'grammar', color: 'from-emerald-600 to-teal-600', glow: 'rgba(16,185,129,.5)' },
  { label: 'Make Friendly', emoji: '😊', action: 'friendly', color: 'from-pink-500 to-rose-500', glow: 'rgba(236,72,153,.5)' },
  { label: 'Shorten Text', emoji: '✂️', action: 'shorten', color: 'from-amber-500 to-orange-500', glow: 'rgba(245,158,11,.5)' },
];

const keys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'back'],
  ['?123', ',', 'mic', 'space', '.', 'return'],
];

export const AIKeyboard: React.FC<AIKeyboardProps> = ({ value, onChange, onClose }) => {
  // Use sample text if value is empty on first open
  const [localText, setLocalText] = useState(value || SAMPLE_TEXT);
  const [activeAction, setActiveAction] = useState<Action | null>(null);
  const [animating, setAnimating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keep parent in sync
  useEffect(() => {
    onChange(localText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localText]);

  const handleAction = (action: Action) => {
    if (animating) return;
    const result = transform(localText, action);
    setActiveAction(action);

    // Animate: fade out → update → fade in
    setAnimating(true);
    if (textareaRef.current) {
      textareaRef.current.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
      textareaRef.current.style.opacity = '0';
      textareaRef.current.style.transform = 'translateY(6px)';
    }
    setTimeout(() => {
      setLocalText(result);
      if (textareaRef.current) {
        textareaRef.current.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
        textareaRef.current.style.opacity = '1';
        textareaRef.current.style.transform = 'translateY(0)';
      }
      setAnimating(false);
    }, 200);
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: '0 0 0 0',
        bottom: 0,
        top: 'auto',
        zIndex: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        animation: 'slideUpKeyboard 0.32s cubic-bezier(.16,1,.3,1) both',
      }}
    >
      <style>{`
        @keyframes slideUpKeyboard {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .ai-key-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header + Textarea */}
      <div style={{ background: 'rgba(10,10,10,0.97)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 14px 10px' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#60a5fa', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              ⌨️ Stremini AI Keyboard
            </span>
            {activeAction && (
              <span style={{
                fontSize: 10, background: 'rgba(99,102,241,0.2)', color: '#818cf8',
                border: '1px solid rgba(99,102,241,0.35)', borderRadius: 20, padding: '2px 8px',
              }}>
                {ACTION_BUTTONS.find(b => b.action === activeAction)?.label}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Done
          </button>
        </div>

        {/* Editable textarea */}
        <textarea
          ref={textareaRef}
          value={localText}
          onChange={e => setLocalText(e.target.value)}
          placeholder="Type your message here..."
          rows={3}
          style={{
            width: '100%',
            background: '#141414',
            border: '1.5px solid rgba(99,102,241,0.35)',
            borderRadius: 14,
            padding: '10px 13px',
            fontSize: 13,
            color: '#fff',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            opacity: 1,
            transform: 'translateY(0)',
            lineHeight: 1.55,
            boxShadow: '0 0 16px rgba(99,102,241,0.12)',
          }}
        />
      </div>

      {/* AI Action Buttons */}
      <div
        className="ai-key-scroll"
        style={{
          background: 'rgba(10,10,10,0.97)',
          padding: '8px 12px 10px',
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {ACTION_BUTTONS.map(btn => {
          const isActive = activeAction === btn.action;
          return (
            <button
              key={btn.action}
              onClick={() => handleAction(btn.action)}
              disabled={animating}
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '7px 14px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                cursor: animating ? 'not-allowed' : 'pointer',
                border: isActive ? `1.5px solid ${btn.glow}` : '1.5px solid rgba(255,255,255,0.08)',
                background: isActive
                  ? `linear-gradient(135deg, ${btn.color.replace('from-', '').replace(' to-', ', ')})`  // fallback
                  : 'rgba(255,255,255,0.06)',
                backgroundImage: isActive
                  ? `linear-gradient(135deg, var(--tw-gradient-from,#4f46e5), var(--tw-gradient-to,#6366f1))`
                  : 'none',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.85)',
                boxShadow: isActive ? `0 0 12px ${btn.glow}` : 'none',
                transition: 'all 0.2s ease',
                opacity: animating ? 0.6 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              <span>{btn.emoji}</span>
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Physical keyboard rows */}
      <div style={{ background: '#0a0a0a', padding: '8px 6px 28px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {keys.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', justifyContent: 'center', gap: 5, height: 42 }}>
            {row.map(key => (
              <div
                key={key}
                style={{
                  flex: key === 'space' ? 4 : key === 'return' ? 2 : (key === 'shift' || key === 'back' || key === '?123' || key === 'mic') ? 1.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  fontSize: key === 'return' ? 11 : 15,
                  fontWeight: 500,
                  color: '#fff',
                  background:
                    key === 'return'
                      ? 'linear-gradient(135deg,#4f46e5,#6366f1)'
                      : key === 'space'
                        ? '#2a2a2a'
                        : key === 'shift' || key === 'back' || key === '?123' || key === 'mic'
                          ? '#1a1a1a'
                          : '#2a2a2a',
                  boxShadow: '0 2px 0 rgba(0,0,0,0.4)',
                  userSelect: 'none',
                  cursor: 'default',
                }}
              >
                {key === 'back' ? '⌫' : key === 'shift' ? '⇧' : key === 'mic' ? '🎤' : key === 'return' ? 'return' : key}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
