'use client';

import { useState } from 'react';
import { Sparkles, Share2 } from 'lucide-react';

interface TarotData {
  card: string;
  emoji: string;
  fortune: string;
  date: string;
}

export default function DailyTarotCard() {
  const [data, setData] = useState<TarotData | null>(null);
  const [loading, setLoading] = useState(false);
  const [flipped, setFlipped] = useState(false);

  async function drawCard() {
    setLoading(true);
    try {
      const res = await fetch('/api/daily-tarot');
      const json = await res.json();
      
      // Delay slightly for dramatic effect
      setTimeout(() => {
        setData(json);
        setLoading(false);
        setFlipped(true);
      }, 800);
      
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  function handleShare() {
    if (!data) return;
    const text = `I drew ${data.card} ${data.emoji} today on TradeFlex! "${data.fortune}" #TradeTarot`;
    if (navigator.share) {
      navigator.share({ title: 'Daily Trading Tarot', text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied fortune to clipboard!');
    }
  }

  return (
    <div className="relative w-full max-w-sm mx-auto perspective-1000 h-64 group cursor-pointer" onClick={!flipped && !loading ? drawCard : undefined}>
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
        
        {/* FRONT (Hidden until flipped) */}
        <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl border-2 border-indigo-500/30 flex flex-col items-center justify-center p-6 text-center shadow-xl rotate-y-180">
          {data && (
            <>
              <div className="text-6xl mb-4 animate-bounce">{data.emoji}</div>
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200 mb-2 uppercase tracking-wide">
                {data.card}
              </h3>
              <p className="text-indigo-200/70 text-sm font-medium italic mb-4">
                "{data.fortune}"
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); handleShare(); }}
                className="mt-auto flex items-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-4 py-2 rounded-full text-xs font-bold transition"
              >
                <Share2 size={12} /> Share Fortune
              </button>
            </>
          )}
        </div>

        {/* BACK (Visible initially) */}
        <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 border-slate-700 flex flex-col items-center justify-center shadow-2xl hover:scale-[1.02] transition-transform">
          <div className="w-24 h-32 border-2 border-slate-600 rounded-lg flex items-center justify-center bg-slate-800/50 mb-4 pattern-grid-lg opacity-50">
            <Sparkles className={`w-8 h-8 text-yellow-500 ${loading ? 'animate-spin' : 'animate-pulse'}`} />
          </div>
          <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest">
            {loading ? 'Reading the stars...' : 'Tap to Draw'}
          </h3>
          <p className="text-slate-600 text-xs mt-2">Daily Market Tarot</p>
        </div>

      </div>

      {/* CSS for 3D Flip (Injected inline for simplicity, usually in globals.css) */}
      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
