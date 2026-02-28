
import React, { useState } from 'react';
import { PhoneFrame } from './components/PhoneFrame';
import { FloatingActionBubble } from './components/FloatingActionBubble';
import { HomeScreen } from './components/HomeScreen';
import { WhatsAppScreen } from './components/WhatsAppScreen';
import { ScamShieldView } from './components/ScamShieldView';
import { AIKeyboard } from './components/AIKeyboard';
import { ChatBotOverlay } from './components/ChatBotOverlay';
import { AutoTaskerModal } from './components/AutoTaskerModal';

export enum AppScreen {
  HOME = 'home',
  WHATSAPP = 'whatsapp',
  SCAM_DETECTION = 'scam_detection'
}

const App: React.FC = () => {
  const [isAppStarted, setIsAppStarted] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.HOME);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTaskerOpen, setIsTaskerOpen] = useState(false);
  const [isScamDetected, setIsScamDetected] = useState(false);
  const [keyboardText, setKeyboardText] = useState('');

  const triggerOpenWhatsApp = () => {
    setIsTaskerOpen(true);
    setTimeout(() => {
      setIsTaskerOpen(false);
      setCurrentScreen(AppScreen.WHATSAPP);
    }, 3000);
  };

  const resetAll = () => {
    setIsKeyboardOpen(false);
    setIsChatOpen(false);
    setIsTaskerOpen(false);
    setIsScamDetected(false);
    setCurrentScreen(AppScreen.HOME);
  };

  if (!isAppStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] p-6 text-center relative">
        {/* Made by lunar watermark */}
        <div className="fixed bottom-4 right-4 flex items-center gap-1.5 select-none pointer-events-none z-50">
          <span className="text-[10px] text-white/20 tracking-widest font-medium uppercase">Made by</span>
          <span className="text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">lunar</span>
        </div>
        <div className="mb-12 animate-in fade-in zoom-in duration-1000">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 mx-auto mb-6 border border-white/10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-12 h-12 text-white">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">STREMINI AI</h1>
          <p className="text-gray-400 max-w-md mx-auto text-lg leading-relaxed">
            Experience the future of mobile intelligence with our floating AI ecosystem.
          </p>
        </div>

        <button
          onClick={() => setIsAppStarted(true)}
          className="group relative px-8 py-4 bg-white text-black font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          TEST ON WEBSITE
        </button>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl text-left opacity-60">
          <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
            <span className="text-blue-400 font-bold block mb-1">Floating UI</span>
            <p className="text-xs text-gray-400">Draggable bubble that stays with you across apps.</p>
          </div>
          <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
            <span className="text-indigo-400 font-bold block mb-1">AI Keyboard</span>
            <p className="text-xs text-gray-400">Contextual writing assistance powered by Gemini.</p>
          </div>
          <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
            <span className="text-purple-400 font-bold block mb-1">Safety Guard</span>
            <p className="text-xs text-gray-400">Real-time scam detection and automated safety checks.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] p-4 md:p-10 animate-in fade-in duration-500 relative">
      {/* Made by lunar watermark */}
      <div className="fixed bottom-4 right-4 flex items-center gap-1.5 select-none pointer-events-none z-50">
        <span className="text-[10px] text-white/20 tracking-widest font-medium uppercase">Made by</span>
        <span className="text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">lunar</span>
      </div>
      <div className="text-center mb-6 hidden md:block">
        <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-1">Live Simulation</h2>
        <p className="text-white/40 text-xs">Stremini AI System V1.0</p>
      </div>

      <PhoneFrame>
        {/* Actual Content based on current screen */}
        {currentScreen === AppScreen.HOME && <HomeScreen />}
        {currentScreen === AppScreen.WHATSAPP && <WhatsAppScreen onBack={() => setCurrentScreen(AppScreen.HOME)} />}
        {currentScreen === AppScreen.SCAM_DETECTION && <ScamShieldView isDetected={isScamDetected} />}

        {/* Overlays */}
        {isChatOpen && <ChatBotOverlay onClose={() => setIsChatOpen(false)} />}

        {isKeyboardOpen && (
          <AIKeyboard
            value={keyboardText}
            onChange={setKeyboardText}
            onClose={() => setIsKeyboardOpen(false)}
          />
        )}

        {isTaskerOpen && <AutoTaskerModal />}

        {/* Floating Bubble UI (Always on top within PhoneFrame) */}
        <FloatingActionBubble
          onOpenChat={() => { setIsChatOpen(true); setIsKeyboardOpen(false); setIsScamDetected(false); }}
          onOpenKeyboard={() => { setIsKeyboardOpen(true); setIsChatOpen(false); setIsScamDetected(false); }}
          onOpenScam={() => {
            setCurrentScreen(AppScreen.SCAM_DETECTION);
            setIsScamDetected(true);
            setIsChatOpen(false);
            setIsKeyboardOpen(false);
          }}
          onOpenTasker={triggerOpenWhatsApp}
          onReset={resetAll}
        />
      </PhoneFrame>

      <button
        onClick={() => setIsAppStarted(false)}
        className="mt-8 text-white/30 text-[10px] uppercase tracking-widest hover:text-white transition-colors"
      >
        ← Back to Landing Page
      </button>
    </div>
  );
};

export default App;
