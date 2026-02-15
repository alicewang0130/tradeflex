//
//  app/components/ReferralBanner.tsx
//  TradeFlex - Referral / Invite Friends Banner (Bilingual)
//

'use client';

import { useState, useEffect } from 'react';
import { Gift, Copy, Check, X } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export default function ReferralBanner({ user }: { user: User | null }) {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [lang, setLang] = useState<'en' | 'cn'>('en');

  useEffect(() => {
    const saved = localStorage.getItem('tradeflex-lang') as 'en' | 'cn' | null;
    if (saved) setLang(saved);
  }, []);

  if (!user || dismissed) return null;

  const refCode = user.id.slice(0, 8);
  const refLink = `https://tradeflex.app?ref=${refCode}`;

  const t = {
    en: {
      title: 'Invite Friends, Get Pro Free 🎁',
      desc: 'Invite 3 friends and get 1 month of Pro for free! They get 7 days of Pro too.',
      copy: 'Copy',
      copied: 'Copied!',
    },
    cn: {
      title: '邀请好友，免费获得 Pro 🎁',
      desc: '邀请 3 位好友注册，免费获得 1 个月 Pro！好友也能获得 7 天 Pro 体验。',
      copy: '复制',
      copied: '已复制！',
    },
  };
  const text = t[lang];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-4 md:p-5">
      <button 
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-white/30 hover:text-white/60 transition"
      >
        <X size={16} />
      </button>
      <div className="flex items-start gap-3">
        <div className="bg-yellow-500/20 p-2 rounded-xl shrink-0">
          <Gift size={20} className="text-yellow-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-white mb-1">{text.title}</h4>
          <p className="text-xs text-white/50 mb-3">
            {text.desc}
          </p>
          <div className="flex gap-2">
            <div className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/60 truncate font-mono">
              {refLink}
            </div>
            <button
              onClick={handleCopy}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
            >
              {copied ? <><Check size={14} /> {text.copied}</> : <><Copy size={14} /> {text.copy}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
