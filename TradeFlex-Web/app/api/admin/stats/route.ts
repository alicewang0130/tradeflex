//
//  app/api/admin/stats/route.ts
//  TradeFlex - Admin Statistics API
//

import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { isAdmin } from '../../../lib/admin';

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
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // Total flexes
  const { count: totalFlexes } = await supabase
    .from('flexes')
    .select('*', { count: 'exact', head: true });

  // Flexes today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: flexesToday } = await supabase
    .from('flexes')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());

  // Total oracle votes
  const { count: totalVotes } = await supabase
    .from('oracle_votes')
    .select('*', { count: 'exact', head: true });

  return NextResponse.json({
    totalUsers: totalUsers || 0,
    totalFlexes: totalFlexes || 0,
    flexesToday: flexesToday || 0,
    totalVotes: totalVotes || 0,
  });
}
