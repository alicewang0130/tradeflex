//
//  app/profile/[username]/page.tsx
//  TradeFlex - User Profile Page
//

'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Trophy, Target, Flame, UserPlus, UserMinus, Share2, Calendar } from 'lucide-react';
import { supabase } from '../../supabase';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ProfileData {
  id: string;
  display_name: string;
  avatar_emoji: string;
  bio: string | null;
  created_at: string;
  trade_count: number;
  win_rate: number;
  total_pnl: number;
  best_trade_pnl: number;
  best_trade_ticker: string;
  followers_count: number;
  following_count: number;
  is_following?: boolean;
}

interface Trade {
  id: string;
  ticker: string;
  position_type: string;
  entry_price: number;
  exit_price: number | null;
  quantity: number;
  pnl_percent: number;
  pnl_amount: number;
  status: 'OPEN' | 'CLOSED';
  instrument: 'STOCK' | 'OPTION';
  created_at: string;
}

interface Post {
  id: string;
  title: string;
  ticker: string | null;
  sentiment: string;
  likes: number;
  comment_count: number;
  created_at: string;
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'trades' | 'posts'>('trades');
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
    });
  }, []);

  useEffect(() => {
    loadProfile();
  }, [username]);

  async function loadProfile() {
    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('display_name', username)
        .single();

      if (profileData) {
        // Fetch trades
        const { data: tradesData } = await supabase
          .from('flexes')
          .select('*')
          .eq('user_id', profileData.id)
          .order('created_at', { ascending: false })
          .limit(20);

        // Fetch posts
        const { data: postsData } = await supabase
          .from('community_posts')
          .select('*')
          .eq('user_id', profileData.id)
          .order('created_at', { ascending: false })
          .limit(20);

        // Calculate stats
        const allTrades = tradesData || [];
        const closedTrades = allTrades.filter(t => t.status === 'CLOSED' || t.exit_price);
        const wins = closedTrades.filter(t => t.pnl_percent > 0);
        const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl_amount || 0), 0);
        const bestTrade = closedTrades.sort((a, b) => (b.pnl_percent || 0) - (a.pnl_percent || 0))[0];

        // Check follow status
        let isFollowing = false;
        if (user) {
          const { data: followData } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', profileData.id)
            .maybeSingle();
          isFollowing = !!followData;
        }

        // Get follower/following counts
        const { count: followersCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', profileData.id);

        const { count: followingCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', profileData.id);

        setProfile({
          ...profileData,
          trade_count: allTrades.length,
          win_rate: closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0,
          total_pnl: totalPnl,
          best_trade_pnl: bestTrade?.pnl_percent || 0,
          best_trade_ticker: bestTrade?.ticker || '-',
          followers_count: followersCount || 0,
          following_count: followingCount || 0,
          is_following: isFollowing,
        });
        setTrades(allTrades);
        setPosts(postsData || []);
      }
    } catch {
      // Use mock data
      setProfile(getMockProfile(username));
      setTrades(getMockTrades());
      setPosts(getMockPosts());
    }
    setLoading(false);
  }

  async function handleFollow() {
    if (!user || !profile) return;
    setFollowLoading(true);
    try {
      if (profile.is_following) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profile.id);
        setProfile({ ...profile, is_following: false, followers_count: profile.followers_count - 1 });
      } else {
        await supabase
          .from('follows')
          .insert({ follower_id: user.id, following_id: profile.id });
        setProfile({ ...profile, is_following: true, followers_count: profile.followers_count + 1 });
      }
    } catch (err) {
      console.error('Follow error:', err);
    }
    setFollowLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center gap-4">
        <p className="text-white/40 text-lg">User not found</p>
        <Link href="/" className="text-green-400 hover:underline">← Back to home</Link>
      </div>
    );
  }

  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#111]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-lg">@{profile.display_name}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center text-3xl border-2 border-white/10">
                {profile.avatar_emoji || '🦍'}
              </div>
              <div>
                <h2 className="text-xl font-bold">@{profile.display_name}</h2>
                {profile.bio && <p className="text-white/50 text-sm mt-1">{profile.bio}</p>}
                <div className="flex items-center gap-1 text-white/30 text-xs mt-1">
                  <Calendar size={12} />
                  Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
            
            {!isOwnProfile && user && (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition ${
                  profile.is_following
                    ? 'bg-white/10 text-white hover:bg-red-500/20 hover:text-red-400'
                    : 'bg-green-500 text-black hover:bg-green-600'
                }`}
              >
                {profile.is_following ? <><UserMinus size={16} /> Unfollow</> : <><UserPlus size={16} /> Follow</>}
              </button>
            )}
          </div>

          {/* Social stats */}
          <div className="flex gap-6 mb-5 text-sm">
            <span><strong className="text-white">{profile.followers_count}</strong> <span className="text-white/40">followers</span></span>
            <span><strong className="text-white">{profile.following_count}</strong> <span className="text-white/40">following</span></span>
            <span><strong className="text-white">{profile.trade_count}</strong> <span className="text-white/40">trades</span></span>
          </div>

          {/* Trading Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#1a1a1a] rounded-xl p-3 text-center">
              <div className="text-white/40 text-xs mb-1 flex items-center justify-center gap-1"><Target size={12} /> Win Rate</div>
              <div className={`text-lg font-black ${profile.win_rate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                {profile.win_rate.toFixed(0)}%
              </div>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-3 text-center">
              <div className="text-white/40 text-xs mb-1 flex items-center justify-center gap-1"><TrendingUp size={12} /> Total PnL</div>
              <div className={`text-lg font-black ${profile.total_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {profile.total_pnl >= 0 ? '+' : ''}{profile.total_pnl >= 1000 ? `$${(profile.total_pnl/1000).toFixed(1)}k` : `$${profile.total_pnl.toFixed(0)}`}
              </div>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-3 text-center">
              <div className="text-white/40 text-xs mb-1 flex items-center justify-center gap-1"><Trophy size={12} /> Best Trade</div>
              <div className="text-lg font-black text-green-400">+{profile.best_trade_pnl.toFixed(0)}%</div>
              <div className="text-[10px] text-white/30 font-mono">{profile.best_trade_ticker}</div>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-3 text-center">
              <div className="text-white/40 text-xs mb-1 flex items-center justify-center gap-1"><Flame size={12} /> Trades</div>
              <div className="text-lg font-black text-white">{profile.trade_count}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-lg p-0.5 mb-4">
          <button
            onClick={() => setActiveTab('trades')}
            className={`flex-1 py-2 rounded-md text-sm font-bold transition ${activeTab === 'trades' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
          >
            Trades ({trades.length})
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2 rounded-md text-sm font-bold transition ${activeTab === 'posts' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
          >
            Posts ({posts.length})
          </button>
        </div>

        {/* Trade History */}
        {activeTab === 'trades' && (
          <div className="space-y-2">
            {trades.length === 0 ? (
              <div className="text-center py-8 text-white/30 text-sm">No trades yet</div>
            ) : trades.map(trade => (
              <div key={trade.id} className="bg-[#111] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black ${
                    trade.pnl_percent >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {trade.pnl_percent >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono">${trade.ticker}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        trade.position_type === 'LONG' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                      }`}>{trade.position_type}</span>
                      {trade.instrument === 'OPTION' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/50 text-purple-400 font-bold">OPT</span>
                      )}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        trade.status === 'OPEN' ? 'bg-blue-900/50 text-blue-400' : 'bg-zinc-800 text-zinc-400'
                      }`}>{trade.status}</span>
                    </div>
                    <div className="text-xs text-white/30 mt-0.5">
                      ${trade.entry_price.toFixed(2)} → {trade.exit_price ? `$${trade.exit_price.toFixed(2)}` : '...'}
                      <span className="ml-2">{timeAgo(trade.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-black text-lg ${trade.pnl_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.pnl_percent >= 0 ? '+' : ''}{trade.pnl_percent.toFixed(1)}%
                  </div>
                  {trade.pnl_amount !== 0 && (
                    <div className={`text-xs ${trade.pnl_amount >= 0 ? 'text-green-400/60' : 'text-red-400/60'}`}>
                      {trade.pnl_amount >= 0 ? '+' : ''}${trade.pnl_amount.toFixed(0)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Posts */}
        {activeTab === 'posts' && (
          <div className="space-y-2">
            {posts.length === 0 ? (
              <div className="text-center py-8 text-white/30 text-sm">No posts yet</div>
            ) : posts.map(post => (
              <Link key={post.id} href={`/community`} className="block bg-[#111] border border-white/5 hover:border-white/15 rounded-xl p-4 transition">
                <div className="flex items-center gap-2 mb-1">
                  {post.ticker && (
                    <span className="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-xs font-mono font-bold">${post.ticker}</span>
                  )}
                  <span className="text-white/30 text-xs">{timeAgo(post.created_at)}</span>
                </div>
                <h3 className="font-bold text-sm mb-1">{post.title}</h3>
                <div className="flex gap-4 text-xs text-white/30">
                  <span>👍 {post.likes}</span>
                  <span>💬 {post.comment_count}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ MOCK DATA ============

function getMockProfile(username: string): ProfileData {
  return {
    id: 'mock-1',
    display_name: username,
    avatar_emoji: '🦍',
    bio: 'Diamond hands. YOLO trader. Not financial advice. 💎🙌',
    created_at: '2025-06-15T00:00:00Z',
    trade_count: 42,
    win_rate: 68,
    total_pnl: 15420,
    best_trade_pnl: 420,
    best_trade_ticker: 'GME',
    followers_count: 1337,
    following_count: 69,
    is_following: false,
  };
}

function getMockTrades(): Trade[] {
  return [
    { id: '1', ticker: 'TSLA', position_type: 'LONG', entry_price: 180.50, exit_price: 248.90, quantity: 100, pnl_percent: 37.9, pnl_amount: 6840, status: 'CLOSED', instrument: 'STOCK', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '2', ticker: 'NVDA', position_type: 'LONG', entry_price: 650, exit_price: 820, quantity: 20, pnl_percent: 26.2, pnl_amount: 3400, status: 'CLOSED', instrument: 'STOCK', created_at: new Date(Date.now() - 172800000).toISOString() },
    { id: '3', ticker: 'SPY', position_type: 'LONG', entry_price: 4.20, exit_price: 12.50, quantity: 50, pnl_percent: 197.6, pnl_amount: 41500, status: 'CLOSED', instrument: 'OPTION', created_at: new Date(Date.now() - 259200000).toISOString() },
    { id: '4', ticker: 'AAPL', position_type: 'SHORT', entry_price: 195, exit_price: 189, quantity: 50, pnl_percent: 3.1, pnl_amount: 300, status: 'CLOSED', instrument: 'STOCK', created_at: new Date(Date.now() - 345600000).toISOString() },
    { id: '5', ticker: 'AMD', position_type: 'LONG', entry_price: 155, exit_price: null, quantity: 30, pnl_percent: -2.5, pnl_amount: -116, status: 'OPEN', instrument: 'STOCK', created_at: new Date(Date.now() - 43200000).toISOString() },
  ];
}

function getMockPosts(): Post[] {
  return [
    { id: '1', title: 'TSLA to the moon — my DD on why $300 is coming', ticker: 'TSLA', sentiment: 'bullish', likes: 42, comment_count: 15, created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', title: 'Just closed my NVDA position, +26% LFG 🚀', ticker: 'NVDA', sentiment: 'bullish', likes: 28, comment_count: 8, created_at: new Date(Date.now() - 86400000).toISOString() },
  ];
}
