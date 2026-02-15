//
//  app/components/ProBadge.tsx
//  TradeFlex - Pro Badge & Feature Gate
//

'use client';

import { Crown } from 'lucide-react';
import Link from 'next/link';

// Pro badge shown next to username
export function ProBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const styles = {
    sm: 'text-[9px] px-1.5 py-0.5 gap-0.5',
    md: 'text-[11px] px-2 py-0.5 gap-1',
  };

  return (
    <span className={`inline-flex items-center bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 rounded-full font-black border border-yellow-500/30 ${styles[size]}`}>
      <Crown size={size === 'sm' ? 10 : 12} />
      PRO
    </span>
  );
}

// Feature lock overlay — wraps a Pro-only feature
export function ProGate({ 
  isPro, 
  children, 
  feature = 'This feature',
}: { 
  isPro: boolean; 
  children: React.ReactNode;
  feature?: string;
}) {
  if (isPro) return <>{children}</>;

  return (
    <div className="relative">
      <div className="pointer-events-none opacity-30 blur-[2px] select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl">
        <Crown size={24} className="text-yellow-400 mb-2" />
        <p className="text-sm font-bold text-white mb-1">{feature}</p>
        <p className="text-xs text-white/50 mb-3">Unlock with TradeFlex Pro</p>
        <Link
          href="/pricing"
          className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold px-4 py-2 rounded-xl text-xs hover:from-yellow-400 hover:to-amber-400 transition"
        >
          Upgrade to Pro ✨
        </Link>
      </div>
    </div>
  );
}

// Small inline lock icon for menu items
export function ProLock() {
  return (
    <span className="inline-flex items-center text-yellow-400/60 ml-1" title="Pro feature">
      <Crown size={10} />
    </span>
  );
}
