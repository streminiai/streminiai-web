
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface AIKeyboardProps {
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
}

export const AIKeyboard: React.FC<AIKeyboardProps> = ({ value, onChange, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastStyle, setLastStyle] = useState<string | null>(null);

  // Load last used style from localStorage on mount
  useEffect(() => {
    const savedStyle = localStorage.getItem('stremini_last_ai_style');
    if (savedStyle) {
      setLastStyle(savedStyle);
    }
  }, []);

  const processAI = async (label: string, prompt: string) => {
    if (!value || isProcessing) return;
    
    setIsProcessing(true);
    // Persist the selection
    setLastStyle(label);
    localStorage.setItem('stremini_last_ai_style', label);
    localStorage.setItem('stremini_last_ai_prompt', prompt);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${prompt}: "${value}"`,
        config: { maxOutputTokens: 200 }
      });
      if (response.text) {
        onChange(response.text.replace(/["']/g, ''));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRepeatLast = () => {
    const savedPrompt = localStorage.getItem('stremini_last_ai_prompt');
    const savedLabel = localStorage.getItem('stremini_last_ai_style');
    if (savedPrompt && savedLabel) {
      processAI(savedLabel, savedPrompt);
    }
  };

  const keys = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['shift','z','x','c','v','b','n','m','back'],
    ['?123',',','mic','space','.','return']
  ];

  return (
    <div className="absolute inset-x-0 bottom-0 z-[120] animate-in slide-in-from-bottom-full duration-300">
      {/* Input Overlay with Close */}
      <div className="bg-[#0a0a0a]/95 border-t border-white/10 p-4 pb-0">
         <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-400 font-medium">Stremini AI Keyboard</span>
              {lastStyle && (
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                  Last: {lastStyle}
                </span>
              )}
            </div>
            <button onClick={onClose} className="text-white/40 text-sm">Done</button>
         </div>
         <textarea 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type anything to AI process..."
            className="w-full h-24 bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500/50 resize-none"
         />
      </div>

      {/* AI Toolbelt */}
      <div className="bg-[#0a0a0a]/95 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-b border-white/5">
        {lastStyle && (
          <button 
            onClick={handleRepeatLast}
            disabled={isProcessing || !value}
            className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-lg shadow-blue-900/20"
          >
            🔄 Repeat {lastStyle.split(' ')[1]}
          </button>
        )}
        <ToolButton 
          label="✨ Improve" 
          isActive={lastStyle === "✨ Improve"}
          onClick={() => processAI("✨ Improve", "Rewrite this to be more professional and clear")}
          disabled={isProcessing}
        />
        <ToolButton 
          label="⚡ Complete" 
          isActive={lastStyle === "⚡ Complete"}
          onClick={() => processAI("⚡ Complete", "Complete this sentence naturally")}
          disabled={isProcessing}
        />
        <ToolButton 
          label="🎭 Tone" 
          isActive={lastStyle === "🎭 Tone"}
          onClick={() => processAI("🎭 Tone", "Rewrite this in a friendly, enthusiastic tone")}
          disabled={isProcessing}
        />
      </div>

      {/* Physical Keys Simulation */}
      <div className="bg-[#0a0a0a] p-1.5 pb-8 space-y-1.5">
        {keys.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1.5 h-11">
            {row.map((key) => (
              <div 
                key={key} 
                className={`
                  flex items-center justify-center rounded-md font-medium text-lg shadow-sm
                  ${key === 'space' ? 'flex-[4] bg-[#333]' : 
                    key === 'return' ? 'flex-[2] bg-blue-600 text-white text-sm' : 
                    key === 'shift' || key === 'back' || key === '?123' ? 'flex-[1.5] bg-[#222]' : 
                    'flex-1 bg-[#333] text-white'}
                `}
              >
                {key === 'back' ? '⌫' : key === 'shift' ? '⇧' : key}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {isProcessing && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
           <div className="bg-blue-600 px-4 py-2 rounded-full text-xs font-bold animate-pulse text-white">
              AI THINKING...
           </div>
        </div>
      )}
    </div>
  );
};

const ToolButton: React.FC<{ label: string; onClick: () => void; disabled?: boolean; isActive?: boolean }> = ({ label, onClick, disabled, isActive }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-all border ${
      isActive 
        ? 'bg-blue-500/20 border-blue-500/50 text-blue-100' 
        : 'bg-[#222] hover:bg-[#333] border-white/10 text-white/90'
    }`}
  >
    {label}
  </button>
);
