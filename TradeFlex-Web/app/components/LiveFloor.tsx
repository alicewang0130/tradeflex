'use client';

import { Mic, Users, Headphones, Volume2 } from 'lucide-react';
import { useState } from 'react';

export default function LiveFloor() {
  const [active, setActive] = useState(false);
  const [users, setUsers] = useState(128); // Mock online count

  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-purple-500/30 group cursor-pointer hover:border-purple-500/50 transition-all">
      {/* Live Badge */}
      <div className="bg-purple-600/20 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-purple-300 font-bold text-xs uppercase tracking-wider">Live Trading Floor</span>
        </div>
        <div className="flex items-center gap-1.5 text-purple-200/50 text-xs">
          <Users size={14} />
          <span>{users} online</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Mic size={64} />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition">
          Pre-Market Hype Session 🚀
        </h3>
        <p className="text-white/40 text-sm mb-6">
          Talking NVDA earnings, SPY calls, and crypto. Join the conversation!
        </p>

        {/* Join Button */}
        <button 
          onClick={() => alert('Opening Discord Voice Channel... (Mock)')}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <Headphones size={18} />
          Join Voice Room
        </button>

        {/* Speaker Avatars */}
        <div className="mt-4 flex -space-x-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-zinc-700 flex items-center justify-center text-[10px] text-white/50">
              User{i}
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-zinc-800 flex items-center justify-center text-[10px] text-white/40">
            +120
          </div>
        </div>
      </div>
    </div>
  );
}
