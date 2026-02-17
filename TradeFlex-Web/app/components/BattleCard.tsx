'use client';

import { useState } from 'react';
import { Swords, Trophy, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface Player {
  name: string;
  avatar: string;
  pnl: number;
}

export default function BattleCard() {
  // Mock data for demo
  const [player1, setPlayer1] = useState<Player>({ 
    name: 'You', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    pnl: 12.5 
  });
  
  const [player2, setPlayer2] = useState<Player>({ 
    name: 'Kevin', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin',
    pnl: -5.2 
  });

  const [winner, setWinner] = useState<string | null>(null);

  const determineWinner = () => {
    if (player1.pnl > player2.pnl) setWinner('Player 1 Wins! 🏆');
    else if (player2.pnl > player1.pnl) setWinner('Player 2 Wins! 🏆');
    else setWinner('Draw! 🤝');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-yellow-500/20 bg-[#0a0a0a] p-6 max-w-md mx-auto">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-500/10 blur-[50px] rounded-full" />

      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-8 relative z-10">
        <Swords className="text-yellow-500 w-5 h-5" />
        <h2 className="text-xl font-black italic tracking-tighter text-white">BATTLE MODE</h2>
      </div>

      {/* VS Section */}
      <div className="flex items-center justify-between gap-4 mb-8 relative z-10">
        
        {/* Player 1 (Left) */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-20 h-20 rounded-full border-4 border-green-500 p-1 mb-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <Image 
              src={player1.avatar} 
              alt={player1.name} 
              width={80} 
              height={80} 
              className="rounded-full bg-zinc-800"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
              +{player1.pnl}%
            </div>
          </div>
          <span className="font-bold text-white text-sm">{player1.name}</span>
        </div>

        {/* VS Badge */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl rotate-45 flex items-center justify-center shadow-lg transform scale-110">
            <span className="text-black font-black text-xl -rotate-45">VS</span>
          </div>
        </div>

        {/* Player 2 (Right) */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-20 h-20 rounded-full border-4 border-red-500 p-1 mb-2 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <Image 
              src={player2.avatar} 
              alt={player2.name} 
              width={80} 
              height={80} 
              className="rounded-full bg-zinc-800 grayscale contrast-125"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {player2.pnl}%
            </div>
          </div>
          <span className="font-bold text-white/50 text-sm">{player2.name}</span>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 mb-6 relative z-10">
        {/* P1 Bar */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-green-400">P1 Efficiency</span>
            <span className="text-white/40">85%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          </div>
        </div>
        
        {/* P2 Bar */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-red-400">P2 Efficiency</span>
            <span className="text-white/40">42%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[42%] bg-red-500" />
          </div>
        </div>
      </div>

      {/* Winner Overlay (Demo) */}
      <div className="text-center relative z-10">
        <button 
          onClick={determineWinner}
          className="w-full bg-white text-black font-black py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition shadow-lg flex items-center justify-center gap-2"
        >
          {winner || 'START BATTLE! ⚔️'}
        </button>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-[10px] text-white/20">
        Winner takes all (glory & XP)
      </div>
    </div>
  );
}
