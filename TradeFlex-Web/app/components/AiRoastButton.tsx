'use client';

import { useState } from 'react';
import { Flame, MessageCircle, Share2, Copy } from 'lucide-react';

interface TradeProps {
  ticker: string;
  position: 'LONG' | 'SHORT';
  price: number;
  pnl: number;
}

export default function AiRoastButton({ trade }: { trade: TradeProps }) {
  const [roast, setRoast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRoast() {
    setLoading(true);
    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trade),
      });
      const data = await res.json();
      setRoast(data.roast);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: 'My Trade Roasted',
        text: `The AI just roasted my ${trade.ticker} trade: "${roast}" #TradeFlex`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`The AI just roasted my ${trade.ticker} trade: "${roast}" #TradeFlex`);
      alert('Copied to clipboard!');
    }
  }

  return (
    <div className="mt-4">
      {!roast ? (
        <button
          onClick={handleRoast}
          disabled={loading}
          className="group relative flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-pulse">Loading insults...</span>
          ) : (
            <>
              <Flame className="w-5 h-5 animate-bounce group-hover:animate-ping" />
              <span>AI Roast My Trade! 🔥</span>
            </>
          )}
        </button>
      ) : (
        <div className="bg-[#1a1a1a] border border-orange-500/30 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-2 text-orange-400 font-bold text-sm uppercase tracking-wide">
            <Flame size={14} /> AI Roast
          </div>
          <p className="text-white text-lg font-medium leading-relaxed mb-4 italic">
            "{roast}"
          </p>
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition"
            >
              <Share2 size={14} /> Share to Twitter
            </button>
            <button 
              onClick={() => setRoast(null)}
              className="bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs font-bold px-3 rounded-lg transition"
            >
              Retry 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
