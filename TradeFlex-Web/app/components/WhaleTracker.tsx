'use client';

import { useState, useEffect } from 'react';
import { Ship, DollarSign, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Whale {
  name: string;
  party: string;
  role: string;
  ticker: string;
  action: string;
  amount: string;
  date: string;
  impact: string;
}

export default function WhaleTracker({ isPro }: { isPro: boolean }) {
  const [whales, setWhales] = useState<Whale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWhales() {
      try {
        const res = await fetch('/api/whales');
        const json = await res.json();
        setWhales(json.whales);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadWhales();
  }, []);

  if (loading) return <div className="h-40 bg-white/5 animate-pulse rounded-xl" />;

  return (
    <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Ship className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-white">Whale Watcher Radar 🐳</h3>
        </div>
        {!isPro && (
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded font-bold">PRO ONLY</span>
        )}
      </div>

      {/* List */}
      <div className="divide-y divide-white/5">
        {whales.map((whale, i) => (
          <div key={i} className={`px-5 py-3 flex items-center justify-between ${!isPro && i > 0 ? 'opacity-30 blur-sm pointer-events-none' : ''}`}>
            
            <div className="flex items-center gap-3">
              {/* Avatar Placeholder */}
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/50">
                {whale.name.split(' ').map(n => n[0]).join('')}
              </div>
              
              <div>
                <p className="font-bold text-sm text-white flex items-center gap-2">
                  {whale.name}
                  {whale.impact === 'HIGH 🔥' && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 rounded">🔥 HOT</span>}
                </p>
                <p className="text-xs text-white/40">{whale.role} • {whale.party}</p>
              </div>
            </div>

            <div className="text-right">
              <p className={`font-black text-sm flex items-center justify-end gap-1 ${whale.action.includes('BUY') ? 'text-green-400' : whale.action.includes('SELL') ? 'text-red-400' : 'text-yellow-400'}`}>
                {whale.action.includes('BUY') ? <TrendingUp size={14} /> : whale.action.includes('SELL') ? <TrendingDown size={14} /> : null}
                {whale.action.split(' ')[0]} ${whale.ticker}
              </p>
              <p className="text-xs text-white/40 font-mono">{whale.amount}</p>
            </div>
          </div>
        ))}
        
        {/* Pro Lock Overlay for non-Pro users */}
        {!isPro && (
          <div className="p-4 bg-white/5 text-center">
            <Link href="/pricing" className="inline-flex items-center gap-2 text-xs font-bold text-yellow-400 hover:text-yellow-300 transition">
              Upgrade to Unlock Full Radar <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
