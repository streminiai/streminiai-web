
import React from 'react';

export const HomeScreen: React.FC = () => {
  const apps = [
    { name: 'Photos', icon: '🖼️', color: 'bg-white' },
    { name: 'Safari', icon: '🧭', color: 'bg-white' },
    { name: 'WhatsApp', icon: '💬', color: 'bg-green-500' },
    { name: 'YouTube', icon: '📹', color: 'bg-red-500' },
    { name: 'Settings', icon: '⚙️', color: 'bg-gray-400' },
    { name: 'Mail', icon: '✉️', color: 'bg-blue-400' },
    { name: 'Calendar', icon: '📅', color: 'bg-white' },
    { name: 'Maps', icon: '🗺️', color: 'bg-white' },
  ];

  return (
    <div className="w-full h-full pt-16 px-6 relative bg-gradient-to-b from-[#1c2e42] to-[#0a0a0a]">
      {/* Background patterns as seen in screenshots */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      
      <div className="grid grid-cols-4 gap-y-8 gap-x-4">
        {apps.map((app, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 cursor-pointer">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${app.color}`}>
              {app.icon}
            </div>
            <span className="text-[10px] font-medium text-white/80">{app.name}</span>
          </div>
        ))}
      </div>

      {/* Dock */}
      <div className="absolute bottom-8 left-4 right-4 h-20 glass rounded-[2.5rem] flex items-center justify-around px-4">
        <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center text-2xl shadow-lg">📞</div>
        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-lg">✉️</div>
        <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-2xl shadow-lg">💬</div>
        <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-2xl shadow-lg">🎵</div>
      </div>
    </div>
  );
};
