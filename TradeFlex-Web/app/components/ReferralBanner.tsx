//
//  app/components/ReferralBanner.tsx
//  TradeFlex - Referral / Invite Friends Banner (Bilingual)
//

'use client';

import { useState, useEffect } from 'react';
import { Gift, Copy, Check, X, Users } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabase';

export default function ReferralBanner({ user }: { user: User | null }) {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [lang, setLang] = useState<'en' | 'cn' | 'ja' | 'ko' | 'es' | 'fr'>('en');
  const [inviteCount, setInviteCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('tradeflex-lang') as any;
    if (saved) setLang(saved);

    if (user) {
      supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', user.id)
        .then(({ count }) => {
          if (count !== null) setInviteCount(count);
        });
    }
  }, [user]);

  if (!user || dismissed) return null;

  // Use full ID for reliability
  const refLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://tradeflex.app'}?ref=${user.id}`;
  
  const target = 3;
  const progress = Math.min((inviteCount / target) * 100, 100);

  const t = {
    en: {
      title: 'Invite Friends, Get Pro Free 🎁',
      desc: `Invite ${target} friends and get 1 month of Pro for free!`,
      progress: `${inviteCount} / ${target} invited`,
      copy: 'Copy',
      copied: 'Copied!',
    },
    cn: {
      title: '邀请好友，免费获得 Pro 🎁',
      desc: `邀请 ${target} 位好友注册，免费获得 1 个月 Pro！`,
      progress: `已邀请 ${inviteCount} / ${target}`,
      copy: '复制',
      copied: '已复制！',
    },
    // Adding fallbacks for other languages
    ja: {
      title: '友達招待でProを無料でゲット 🎁',
      desc: `友達${target}人を招待して、Pro1ヶ月分を無料で手に入れよう！`,
      progress: `${inviteCount} / ${target} 招待済み`,
      copy: 'コピー',
      copied: '完了！',
    },
    ko: {
      title: '친구 초대하고 Pro 무료로 받기 🎁',
      desc: `친구 ${target}명을 초대하면 Pro 1개월 무료!`,
      progress: `${inviteCount} / ${target} 초대됨`,
      copy: '복사',
      copied: '복사됨!',
    },
    es: {
      title: 'Invita amigos, obtén Pro gratis 🎁',
      desc: `¡Invita a ${target} amigos y obtén 1 mes de Pro gratis!`,
      progress: `${inviteCount} / ${target} invitados`,
      copy: 'Copiar',
      copied: '¡Copiado!',
    },
    fr: {
      title: 'Invite des amis, obtiens Pro gratuit 🎁',
      desc: `Invite ${target} amis et obtiens 1 mois de Pro gratuit !`,
      progress: `${inviteCount} / ${target} invités`,
      copy: 'Copier',
      copied: 'Copié !',
    }
  };
  const text = t[lang] || t.en;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-4 md:p-5 mb-6">
      <button 
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-white/30 hover:text-white/60 transition"
      >
        <X size={16} />
      </button>
      <div className="flex items-start gap-4">
        <div className="bg-yellow-500/20 p-3 rounded-xl shrink-0 hidden sm:block">
          <Gift size={24} className="text-yellow-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
            <Gift size={16} className="text-yellow-400 sm:hidden" />
            {text.title}
          </h4>
          <p className="text-xs text-white/50 mb-3">
            {text.desc}
          </p>
          
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-[10px] uppercase font-bold text-white/40 mb-1">
              <span>{text.progress}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/60 truncate font-mono select-all">
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
