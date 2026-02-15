//
//  app/components/ReferralBanner.tsx
//  TradeFlex - Referral / Invite Friends Banner
//

'use client';

import { useState } from 'react';
import { Gift, Copy, Check, X } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export default function ReferralBanner({ user }: { user: User | null }) {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!user || dismissed) return null;

  // Generate referral link from user id (first 8 chars)
  const refCode = user.id.slice(0, 8);
  const refLink = `https://tradeflex.app?ref=${refCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-4 md:p-5">
      <button 
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-white/30 hover:text-white/60 transition"
      >
        <X size={16} />
      </button>
      <div className="flex items-start gap-3">
        <div className="bg-purple-500/20 p-2 rounded-xl shrink-0">
          <Gift size={20} className="text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-white mb-1">Invite Friends, Get Pro Free 🎁</h4>
          <p className="text-xs text-white/50 mb-3">
            Invite 3 friends and get 1 month of Pro for free! They get 7 days of Pro too.
          </p>
          <div className="flex gap-2">
            <div className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/60 truncate font-mono">
              {refLink}
            </div>
            <button
              onClick={handleCopy}
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
            >
              {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
