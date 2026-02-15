//
//  app/api/subscription/route.ts
//  TradeFlex - Subscription status API
//

import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

// Get current subscription status
export async function GET() {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ isPro: false, plan: 'free' });
  }

  try {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (data && new Date(data.expires_at) > new Date()) {
      return NextResponse.json({
        isPro: true,
        plan: data.plan,
        expiresAt: data.expires_at,
        stripeCustomerId: data.stripe_customer_id,
      });
    }
  } catch {
    // Table might not exist
  }

  return NextResponse.json({ isPro: false, plan: 'free' });
}
