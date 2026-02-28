
import React, { useState } from 'react';

interface ChatBotOverlayProps {
  onClose: () => void;
}

export const ChatBotOverlay: React.FC<ChatBotOverlayProps> = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm Stremini AI. How can I help you?" }
  ]);
  const [inputValue, setInputValue] = useState('');

  const sendScriptedResponse = (text: string) => {
    const newUserMsg = { role: 'user', text };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "I'd be happy to help. What would you like to talk about or ask? I'll respond in a friendly and polite manner." 
      }]);
    }, 1000);
  };

  return (
    <div className="absolute inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-h-[80%] bg-[#121212] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm">⚡</div>
             <h3 className="font-bold text-sm">Stremini AI</h3>
          </div>
          <button onClick={onClose} className="text-white/40 text-lg">×</button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col no-scrollbar">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`max-w-[85%] p-3 rounded-2xl text-[12px] leading-relaxed ${
                msg.role === 'assistant' 
                  ? 'bg-[#1a1a1a] text-white/90 self-start rounded-tl-none' 
                  : 'bg-blue-600 text-white self-end rounded-tr-none'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Scripted Buttons */}
        <div className="p-3 flex gap-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => sendScriptedResponse("Reply politely")}
            className="whitespace-nowrap bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-full text-[11px] font-medium"
          >
            Reply politely
          </button>
          <button 
            onClick={() => sendScriptedResponse("What is Stremini?")}
            className="whitespace-nowrap bg-white/5 text-white/60 border border-white/10 px-3 py-1.5 rounded-full text-[11px]"
          >
            What is Stremini?
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/40 border-t border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">🎤</div>
          <div className="flex-1 bg-white/5 rounded-full px-4 py-2 text-white/30 text-xs">
            Ask anything...
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">➤</div>
        </div>
      </div>
    </div>
  );
};
