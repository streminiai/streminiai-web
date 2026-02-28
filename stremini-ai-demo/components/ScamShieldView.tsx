
import React from 'react';

interface ScamShieldViewProps {
  isDetected: boolean;
}

export const ScamShieldView: React.FC<ScamShieldViewProps> = ({ isDetected }) => {
  return (
    <div className="w-full h-full bg-[#121212] pt-12">
      {/* Search Bar */}
      <div className="px-4 py-2 border-b border-white/5">
        <div className="bg-[#1e1e1e] rounded-full h-10 flex items-center px-4 gap-3 text-white/40 text-sm">
          <span>🔍</span>
          <span>freemoney247.com</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {isDetected && (
          <div className="bg-[#2a1313] border border-red-900/50 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              ⚠️
            </div>
            <div className="flex-1">
              <h4 className="text-red-400 font-bold text-sm">Suspicious Link: Threat Detected</h4>
              <p className="text-red-300/60 text-[11px] mt-0.5">Scam Detection - Suspicious links may be dangerous</p>
            </div>
          </div>
        )}

        {/* Mock Search Results */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5 opacity-80">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-gray-700"></div>
              <span className="text-[10px] text-white/40">https://piratebay-proxy.xyz</span>
            </div>
            <h5 className="text-blue-400 font-medium mb-1">The Pirate Bay - Best Proxies 2024</h5>
            <p className="text-[11px] text-white/40 line-clamp-2">
              Download music, movies, games, software and much more. The Pirate Bay is the galaxy's most resilient BitTorrent site.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
