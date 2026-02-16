//
//  app/lib/usePro.ts
//  TradeFlex - Pro membership hook
//

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import type { User } from '@supabase/supabase-js';
import { isAdmin } from './admin';

export interface ProStatus {
  isPro: boolean;
  plan: 'free' | 'monthly' | 'yearly' | 'referral';
  expiresAt: string | null;
  loading: boolean;
}

export function usePro(user: User | null): ProStatus {
  const [status, setStatus] = useState<ProStatus>({
    isPro: false,
    plan: 'free',
    expiresAt: null,
    loading: true,
  });

  useEffect(() => {
    if (!user) {
      setStatus({ isPro: false, plan: 'free', expiresAt: null, loading: false });
      return;
    }

    async function checkPro() {
      // 1. Admin check
      if (isAdmin(user!.email)) {
        setStatus({ isPro: true, plan: 'yearly', expiresAt: null, loading: false });
        return;
      }

      try {
        // 2. Subscription check
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user!.id)
          .eq('status', 'active')
          .maybeSingle();

        if (sub && new Date(sub.current_period_end) > new Date()) {
          setStatus({
            isPro: true,
            plan: sub.plan as any,
            expiresAt: sub.current_period_end,
            loading: false,
          });
          return;
        }

        // 3. Referral check (Invite 3 people = Free Pro)
        const { count } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true })
          .eq('referrer_id', user!.id);

        if (count && count >= 3) {
          setStatus({ isPro: true, plan: 'referral', expiresAt: null, loading: false });
          return;
        }

        // Default: Free
        setStatus({ isPro: false, plan: 'free', expiresAt: null, loading: false });

      } catch (err) {
        console.error('Pro check failed', err);
        setStatus({ isPro: false, plan: 'free', expiresAt: null, loading: false });
      }
    }

    checkPro();
  }, [user]);

  return status;
}
