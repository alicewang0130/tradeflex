//
//  app/lib/usePro.ts
//  TradeFlex - Pro membership hook
//

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import type { User } from '@supabase/supabase-js';

export interface ProStatus {
  isPro: boolean;
  plan: 'free' | 'monthly' | 'yearly';
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
      try {
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user!.id)
          .eq('status', 'active')
          .maybeSingle();

        if (data && new Date(data.expires_at) > new Date()) {
          setStatus({
            isPro: true,
            plan: data.plan,
            expiresAt: data.expires_at,
            loading: false,
          });
        } else {
          setStatus({ isPro: false, plan: 'free', expiresAt: null, loading: false });
        }
      } catch {
        // Table might not exist yet — default to free
        setStatus({ isPro: false, plan: 'free', expiresAt: null, loading: false });
      }
    }

    checkPro();
  }, [user]);

  return status;
}
