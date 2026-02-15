//
//  app/supabase.ts
//  TradeFlex - Supabase Client
//
//  Created on 2026-02-14.
//

import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
