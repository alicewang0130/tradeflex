//
//  app/api/leaderboard/route.ts
//  TradeFlex - Leaderboard API
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

export async function GET() {
  const supabase = await getSupabase();

  // Top gains (mooners)
  const { data: mooners } = await supabase
    .from('flexes')
    .select('*, profiles(display_name)')
    .gt('pnl_percent', 0)
    .order('pnl_percent', { ascending: false })
    .limit(5);

  // Top losses (rekt)
  const { data: rekt } = await supabase
    .from('flexes')
    .select('*, profiles(display_name)')
    .lt('pnl_percent', 0)
    .order('pnl_percent', { ascending: true })
    .limit(5);

  return NextResponse.json({
    mooners: mooners || [],
    rekt: rekt || [],
  });
}
