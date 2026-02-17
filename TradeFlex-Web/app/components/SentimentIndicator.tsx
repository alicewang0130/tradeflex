'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Lock, AlertTriangle, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface SentimentData {
  ticker: string;
  total_trades: number;
  bullish_pct: number;
  bearish_pct: number;
  signal: string;
}

export default function SentimentIndicator({ ticker, isPro }: { ticker: string, isPro: boolean }) {
  const [data, setData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchSentiment() {
      if (!ticker) return;
      
      try {
        const { data, error } = await supabase.rpc('get_ticker_sentiment', { ticker_symbol: ticker });
        if (data) setData(data as SentimentData);
      } catch (e) {
        console.error('Failed to load sentiment', e);
      } finally {
        setLoading(false);
      }
    }

    fetchSentiment();
  }, [ticker]);

  if (loading) return <div className="h-24 bg-white/5 animate-pulse rounded-xl" />;

  // PRO GATED VIEW 🔒
  if (!isPro) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#111] p-4 group">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-4">
          <Lock className="w-6 h-6 text-yellow-500 mb-2" />
          <p className="text-sm font-bold text-white mb-1">Pro Only</p>
          <p className="text-xs text-white/50 mb-3">Unlock Retail Sentiment Data</p>
          <Link href="/pricing" className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-full font-bold hover:bg-yellow-500/30 transition">
            Upgrade
          </Link>
        </div>
        {/* Fake blurred background content */}
        <div className="opacity-30 blur-sm pointer-events-none select-none">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">Retail Sentiment</span>
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">EXTREME GREED</span>
          </div>
          <div className="h-4 bg-white/10 rounded-full overflow-hidden flex mb-2">
            <div className="w-[85%] bg-green-500" />
            <div className="w-[15%] bg-red-500" />
          </div>
          <div className="flex justify-between text-xs text-white/40">
            <span>85% Bullish</span>
            <span>15% Bearish</span>
          </div>
        </div>
      </div>
    );
  }

  // PRO VIEW (REAL DATA) ✨
  const isExtreme = data?.bullish_pct! > 80 || data?.bullish_pct! < 20;
  
  return (
    <div className="rounded-xl border border-white/10 bg-[#111] p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-white/80">Retail Sentiment</h3>
          <span className="text-xs bg-white/5 text-white/40 px-1.5 py-0.5 rounded border border-white/5">
            ${ticker}
          </span>
        </div>
        
        {/* Signal Badge */}
        {data?.signal.includes('EXTREME') ? (
          <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded-lg animate-pulse">
            <AlertTriangle size={12} />
            {data.signal.split('(')[0]}
          </div>
        ) : (
          <div className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">
            {data?.signal}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-6 bg-white/5 rounded-full overflow-hidden flex mb-2">
        {/* Bullish Segment */}
        <div 
          className="h-full bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-start px-2 transition-all duration-1000"
          style={{ width: `${data?.bullish_pct}%` }}
        >
          {data?.bullish_pct! > 15 && <span className="text-[10px] font-bold text-black">{data?.bullish_pct}% 🐂</span>}
        </div>
        
        {/* Bearish Segment */}
        <div 
          className="h-full bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-end px-2 transition-all duration-1000"
          style={{ width: `${data?.bearish_pct}%` }}
        >
          {data?.bearish_pct! > 15 && <span className="text-[10px] font-bold text-black">🐻 {data?.bearish_pct}%</span>}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center text-xs text-white/40">
        <div className="flex items-center gap-1">
          {data?.total_trades === 0 ? (
            <span>No data yet</span>
          ) : (
            <span>Based on {data?.total_trades} verified trades</span>
          )}
        </div>
        
        {isExtreme && (
          <div className="flex items-center gap-1 text-yellow-500/80">
            <HelpCircle size={12} />
            <span>Contrarian Signal Active</span>
          </div>
        )}
      </div>
    </div>
  );
}
