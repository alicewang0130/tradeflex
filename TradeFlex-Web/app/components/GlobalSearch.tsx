//
//  app/components/GlobalSearch.tsx
//  TradeFlex - Global Search (users, posts, tickers)
//

'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, User, MessageCircle, TrendingUp } from 'lucide-react';
import { supabase } from '../supabase';
import Link from 'next/link';

interface SearchResult {
  type: 'user' | 'post' | 'ticker';
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  link: string;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Keyboard shortcut: Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  function handleInput(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }

    // Debounce search
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  }

  async function doSearch(q: string) {
    setLoading(true);
    const searchResults: SearchResult[] = [];

    try {
      // Search users
      const { data: users } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_emoji')
        .ilike('display_name', `%${q}%`)
        .limit(5);

      if (users) {
        users.forEach(u => {
          searchResults.push({
            type: 'user',
            id: u.id,
            title: `@${u.display_name}`,
            subtitle: 'Trader',
            emoji: u.avatar_emoji || '🦍',
            link: `/profile/${u.display_name}`,
          });
        });
      }

      // Search posts
      const { data: posts } = await supabase
        .from('community_posts')
        .select('id, title, ticker, username')
        .or(`title.ilike.%${q}%,ticker.ilike.%${q}%`)
        .limit(5);

      if (posts) {
        posts.forEach(p => {
          searchResults.push({
            type: 'post',
            id: p.id,
            title: p.title,
            subtitle: p.ticker ? `$${p.ticker} · by ${p.username}` : `by ${p.username}`,
            emoji: '💬',
            link: '/community',
          });
        });
      }

      // Check if it looks like a ticker
      if (/^[A-Z]{1,5}$/i.test(q.trim())) {
        searchResults.unshift({
          type: 'ticker',
          id: q.toUpperCase(),
          title: `$${q.toUpperCase()}`,
          subtitle: 'View all discussions',
          emoji: '📈',
          link: `/community?ticker=${q.toUpperCase()}`,
        });
      }
    } catch {
      // Mock results
      if (/^[A-Z]{1,5}$/i.test(q.trim())) {
        searchResults.push({
          type: 'ticker',
          id: q.toUpperCase(),
          title: `$${q.toUpperCase()}`,
          subtitle: 'View all discussions',
          emoji: '📈',
          link: `/community?ticker=${q.toUpperCase()}`,
        });
      }
    }

    setResults(searchResults);
    setLoading(false);
  }

  const typeIcons = {
    user: User,
    post: MessageCircle,
    ticker: TrendingUp,
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search... ⌘K"
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-8 py-1.5 text-xs focus:outline-none focus:border-green-500/50 placeholder:text-white/30"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); }} className="absolute right-2 top-1/2 -translate-y-1/2">
            <X size={12} className="text-white/30 hover:text-white/60" />
          </button>
        )}
      </div>

      {isOpen && (query || results.length > 0) && (
        <div className="absolute left-0 right-0 top-9 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full" />
            </div>
          ) : results.length === 0 && query ? (
            <div className="py-4 text-center text-white/30 text-xs">No results for &quot;{query}&quot;</div>
          ) : (
            results.map(r => {
              const Icon = typeIcons[r.type];
              return (
                <Link
                  key={`${r.type}-${r.id}`}
                  href={r.link}
                  onClick={() => { setIsOpen(false); setQuery(''); }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition"
                >
                  <span className="text-base">{r.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{r.title}</div>
                    <div className="text-[10px] text-white/30">{r.subtitle}</div>
                  </div>
                  <Icon size={14} className="text-white/20 shrink-0" />
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
