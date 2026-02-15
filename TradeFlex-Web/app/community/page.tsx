//
//  app/community/page.tsx
//  TradeFlex - Community Discussion Page
//
//  Stock discussion forum where traders share ideas, DD, and market talk.
//

'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, TrendingUp, TrendingDown, ThumbsUp, Send, ArrowLeft, Flame, Clock, Search, Plus, X, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';

// Types
interface Post {
  id: string;
  user_id: string;
  username: string;
  avatar_emoji: string;
  ticker: string | null;
  title: string;
  content: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  likes: number;
  comment_count: number;
  created_at: string;
  liked_by_me?: boolean;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  username: string;
  avatar_emoji: string;
  content: string;
  likes: number;
  created_at: string;
  liked_by_me?: boolean;
}

// Sentiment badge component
function SentimentBadge({ sentiment }: { sentiment: string }) {
  const config = {
    bullish: { bg: 'bg-green-500/20', text: 'text-green-400', icon: TrendingUp, label: '🐂 Bullish' },
    bearish: { bg: 'bg-red-500/20', text: 'text-red-400', icon: TrendingDown, label: '🐻 Bearish' },
    neutral: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: MessageCircle, label: '🤷 Neutral' },
  }[sentiment] || { bg: 'bg-gray-500/20', text: 'text-gray-400', icon: MessageCircle, label: 'Discussion' };

  return (
    <span className={`${config.bg} ${config.text} px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1`}>
      {config.label}
    </span>
  );
}

// Time ago helper
function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'hot' | 'new'>('hot');
  const [searchTicker, setSearchTicker] = useState('');
  const [activeTicker, setActiveTicker] = useState<string | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // New post form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTicker, setNewTicker] = useState('');
  const [newSentiment, setNewSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('neutral');
  const [posting, setPosting] = useState(false);

  // New comment
  const [newComment, setNewComment] = useState('');
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Language
  const [lang, setLang] = useState<'en' | 'cn'>('en');
  useEffect(() => {
    const saved = localStorage.getItem('tradeflex-lang') as 'en' | 'cn' | null;
    if (saved) setLang(saved);
  }, []);

  const tr = {
    en: {
      community: '💬 Community',
      discussion: 'Discussion',
      newPost: 'New Post',
      signInToPost: 'Sign In to Post',
      hot: 'Hot',
      new: 'New',
      searchTicker: 'Search ticker...',
      newDiscussion: 'New Discussion',
      tickerPlaceholder: 'Ticker (optional)',
      titlePlaceholder: "Title — what's on your mind?",
      contentPlaceholder: 'Share your DD, thesis, or hot take...',
      posting: 'Posting...',
      postToCommunity: 'Post to Community 🚀',
      noDiscussions: 'No discussions yet',
      beFirst: 'Be the first to start a conversation! 🚀',
      comments: 'comments',
      signInToComment: 'Sign in',
      toComment: 'to comment',
      dropComment: 'Drop a comment... 💬',
      noComments: 'No comments yet. Be the first! 🚀',
    },
    cn: {
      community: '💬 社区',
      discussion: '讨论',
      newPost: '发帖',
      signInToPost: '登录后发帖',
      hot: '热门',
      new: '最新',
      searchTicker: '搜索股票代码...',
      newDiscussion: '新帖子',
      tickerPlaceholder: '股票代码（选填）',
      titlePlaceholder: '标题 — 你在想什么？',
      contentPlaceholder: '分享你的分析、观点或辣评...',
      posting: '发布中...',
      postToCommunity: '发布到社区 🚀',
      noDiscussions: '还没有讨论',
      beFirst: '成为第一个发帖的人！🚀',
      comments: '条评论',
      signInToComment: '登录',
      toComment: '后评论',
      dropComment: '写条评论... 💬',
      noComments: '还没有评论，来抢沙发！🚀',
    },
  };
  const text = tr[lang];

  // Auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load posts
  useEffect(() => {
    loadPosts();
  }, [sortBy, searchTicker, activeTicker]);

  async function loadPosts() {
    setLoading(true);
    try {
      let query = supabase
        .from('community_posts')
        .select('*');

      if (activeTicker) {
        query = query.eq('ticker', activeTicker);
      } else if (searchTicker) {
        query = query.ilike('ticker', `%${searchTicker}%`);
      }

      if (sortBy === 'hot') {
        query = query.order('likes', { ascending: false }).order('created_at', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      query = query.limit(50);

      const { data, error } = await query;
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
      // Use mock data if table doesn't exist yet
      let mockPosts = getMockPosts();
      if (activeTicker) {
        mockPosts = mockPosts.filter(p => p.ticker === activeTicker);
      } else if (searchTicker) {
        mockPosts = mockPosts.filter(p => p.ticker?.includes(searchTicker));
      }
      setPosts(mockPosts);
    }
    setLoading(false);
  }

  async function loadComments(postId: string) {
    setCommentsLoading(true);
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch {
      setComments(getMockComments(postId));
    }
    setCommentsLoading(false);
  }

  async function handleNewPost() {
    if (!user || !newTitle.trim() || !newContent.trim()) return;
    setPosting(true);
    try {
      const username = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anon';
      const { error } = await supabase.from('community_posts').insert({
        user_id: user.id,
        username,
        avatar_emoji: '🦍',
        ticker: newTicker.toUpperCase() || null,
        title: newTitle,
        content: newContent,
        sentiment: newSentiment,
        likes: 0,
        comment_count: 0,
      });
      if (error) throw error;
      setShowNewPost(false);
      setNewTitle('');
      setNewContent('');
      setNewTicker('');
      setNewSentiment('neutral');
      loadPosts();
    } catch (err) {
      console.error('Failed to create post:', err);
    }
    setPosting(false);
  }

  async function handleLikePost(postId: string) {
    if (!user) return;
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      const newLikes = (post.liked_by_me ? post.likes - 1 : post.likes + 1);
      await supabase.from('community_posts').update({ likes: newLikes }).eq('id', postId);
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: newLikes, liked_by_me: !p.liked_by_me } : p));
      if (selectedPost?.id === postId) {
        setSelectedPost({ ...selectedPost, likes: newLikes, liked_by_me: !selectedPost.liked_by_me });
      }
    } catch (err) {
      console.error('Failed to like:', err);
    }
  }

  async function handleNewComment() {
    if (!user || !newComment.trim() || !selectedPost) return;
    try {
      const username = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anon';
      const { error } = await supabase.from('community_comments').insert({
        post_id: selectedPost.id,
        user_id: user.id,
        username,
        avatar_emoji: '🦍',
        content: newComment,
        likes: 0,
      });
      if (error) throw error;

      // Update comment count
      await supabase.from('community_posts')
        .update({ comment_count: (selectedPost.comment_count || 0) + 1 })
        .eq('id', selectedPost.id);

      setNewComment('');
      loadComments(selectedPost.id);
      setSelectedPost({ ...selectedPost, comment_count: (selectedPost.comment_count || 0) + 1 });
    } catch (err) {
      console.error('Failed to comment:', err);
    }
  }

  function openPost(post: Post) {
    setSelectedPost(post);
    loadComments(post.id);
  }

  // ============ RENDER ============

  // Post detail view
  if (selectedPost) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Header */}
        <div className="border-b border-white/10 bg-[#111]/80 backdrop-blur-xl sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-white/10 rounded-lg transition">
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-bold text-lg">{text.discussion}</h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Post */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{selectedPost.avatar_emoji}</span>
              <span className="font-medium text-sm">{selectedPost.username}</span>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-white/40 text-xs">{timeAgo(selectedPost.created_at)}</span>
              {selectedPost.ticker && (
                <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs font-mono font-bold">
                  ${selectedPost.ticker}
                </span>
              )}
              <SentimentBadge sentiment={selectedPost.sentiment} />
            </div>
            <h2 className="text-xl font-bold mb-3">{selectedPost.title}</h2>
            <p className="text-white/70 whitespace-pre-wrap leading-relaxed">{selectedPost.content}</p>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => handleLikePost(selectedPost.id)}
                className={`flex items-center gap-1 text-sm transition ${selectedPost.liked_by_me ? 'text-green-400' : 'text-white/40 hover:text-white/70'}`}
              >
                <ThumbsUp size={16} /> {selectedPost.likes}
              </button>
              <span className="flex items-center gap-1 text-sm text-white/40">
                <MessageCircle size={16} /> {selectedPost.comment_count} {text.comments}
              </span>
            </div>
          </div>

          {/* Comment input */}
          {user ? (
            <div className="flex gap-3 mb-6">
              <input
                ref={commentInputRef}
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNewComment()}
                placeholder={text.dropComment}
                className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500/50 placeholder:text-white/30"
              />
              <button
                onClick={handleNewComment}
                disabled={!newComment.trim()}
                className="bg-green-500 hover:bg-green-600 disabled:opacity-30 disabled:hover:bg-green-500 px-4 rounded-xl transition"
              >
                <Send size={18} />
              </button>
            </div>
          ) : (
            <div className="text-center py-4 mb-6 text-white/40 text-sm">
              <Link href="/login" className="text-green-400 hover:underline">{text.signInToComment}</Link> {text.toComment}
            </div>
          )}

          {/* Comments */}
          {commentsLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-white/30" size={24} /></div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-white/30 text-sm">{text.noComments}</div>
          ) : (
            <div className="space-y-3">
              {comments.map(comment => (
                <div key={comment.id} className="bg-[#111] border border-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{comment.avatar_emoji}</span>
                    <span className="font-medium text-sm">{comment.username}</span>
                    <span className="text-white/30 text-xs">·</span>
                    <span className="text-white/40 text-xs">{timeAgo(comment.created_at)}</span>
                  </div>
                  <p className="text-white/70 text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============ MAIN LIST VIEW ============
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#111]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-xl font-black tracking-tight">
                {text.community}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {user ? (
                <button
                  onClick={() => setShowNewPost(true)}
                  className="bg-green-500 hover:bg-green-600 text-black font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-1 transition"
                >
                  <Plus size={16} /> {text.newPost}
                </button>
              ) : (
                <Link href="/login" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm transition">
                  {text.signInToPost}
                </Link>
              )}
            </div>
          </div>

          {/* Sort + Search */}
          <div className="flex items-center gap-2">
            <div className="flex bg-white/5 rounded-lg p-0.5">
              <button
                onClick={() => setSortBy('hot')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition ${sortBy === 'hot' ? 'bg-orange-500/20 text-orange-400' : 'text-white/50 hover:text-white/70'}`}
              >
                <Flame size={14} /> {text.hot}
              </button>
              <button
                onClick={() => setSortBy('new')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition ${sortBy === 'new' ? 'bg-blue-500/20 text-blue-400' : 'text-white/50 hover:text-white/70'}`}
              >
                <Clock size={14} /> {text.new}
              </button>
            </div>
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={searchTicker}
                onChange={e => { setSearchTicker(e.target.value.toUpperCase()); setActiveTicker(null); }}
                placeholder={text.searchTicker}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-green-500/50 placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Ticker Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => { setActiveTicker(null); setSearchTicker(''); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                !activeTicker ? 'bg-white/15 text-white' : 'bg-white/5 text-white/40 hover:text-white/70'
              }`}
            >
              🔥 ALL
            </button>
            {['TSLA', 'AAPL', 'NVDA', 'GME', 'SPY', 'AMZN', 'META', 'MSFT', 'AMD', 'COIN'].map(t => (
              <button
                key={t}
                onClick={() => { setActiveTicker(activeTicker === t ? null : t); setSearchTicker(''); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition ${
                  activeTicker === t ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30' : 'bg-white/5 text-white/40 hover:text-white/70'
                }`}
              >
                ${t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-white/30" size={32} /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/30 text-lg mb-2">{text.noDiscussions}</p>
            <p className="text-white/20 text-sm">{text.beFirst}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map(post => (
              <button
                key={post.id}
                onClick={() => openPost(post)}
                className="w-full text-left bg-[#111] border border-white/5 hover:border-white/15 rounded-xl p-4 transition group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{post.avatar_emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-sm">{post.username}</span>
                      <span className="text-white/30 text-xs">{timeAgo(post.created_at)}</span>
                      {post.ticker && (
                        <span className="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-xs font-mono font-bold">
                          ${post.ticker}
                        </span>
                      )}
                      <SentimentBadge sentiment={post.sentiment} />
                    </div>
                    <h3 className="font-bold text-sm group-hover:text-green-400 transition mb-1">{post.title}</h3>
                    <p className="text-white/40 text-xs line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs text-white/30">
                        <ThumbsUp size={12} /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-white/30">
                        <MessageCircle size={12} /> {post.comment_count}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{text.newDiscussion}</h2>
              <button onClick={() => setShowNewPost(false)} className="p-1 hover:bg-white/10 rounded-lg transition">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Ticker + Sentiment */}
              <div className="flex gap-2">
                <input
                  value={newTicker}
                  onChange={e => setNewTicker(e.target.value.toUpperCase())}
                  placeholder={text.tickerPlaceholder}
                  maxLength={10}
                  className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-green-500/50 placeholder:text-white/30"
                />
                <div className="flex bg-white/5 rounded-xl p-0.5">
                  {(['bullish', 'bearish', 'neutral'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setNewSentiment(s)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                        newSentiment === s
                          ? s === 'bullish' ? 'bg-green-500/20 text-green-400'
                            : s === 'bearish' ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                          : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      {s === 'bullish' ? '🐂' : s === 'bearish' ? '🐻' : '🤷'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder={text.titlePlaceholder}
                maxLength={200}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500/50 placeholder:text-white/30"
              />

              {/* Content */}
              <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder={text.contentPlaceholder}
                rows={5}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500/50 placeholder:text-white/30 resize-none"
              />

              {/* Submit */}
              <button
                onClick={handleNewPost}
                disabled={posting || !newTitle.trim() || !newContent.trim()}
                className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-30 disabled:hover:bg-green-500 text-black font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                {posting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                {posting ? text.posting : text.postToCommunity}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ MOCK DATA ============

function getMockPosts(): Post[] {
  return [
    {
      id: '1', user_id: '1', username: 'DeepFuckingValue', avatar_emoji: '🦍',
      ticker: 'GME', title: 'GME Short Squeeze DD — The Thesis Still Holds 💎🙌',
      content: 'Listen up apes. The short interest is still through the roof. Institutional ownership exceeds float. This thing is a coiled spring ready to pop. Not financial advice but I like the stock.',
      sentiment: 'bullish', likes: 420, comment_count: 69, created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2', user_id: '2', username: 'CathieWood', avatar_emoji: '🌲',
      ticker: 'TSLA', title: 'TSLA $2000 Price Target — Here\'s Why',
      content: 'Autonomous driving, robotaxi network, energy storage, AI compute. Tesla is not a car company, it\'s an AI company with a massive real-world data advantage. Our 5-year model shows...',
      sentiment: 'bullish', likes: 156, comment_count: 42, created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '3', user_id: '3', username: 'BigShortGuy', avatar_emoji: '🐻',
      ticker: 'NVDA', title: 'NVDA is overvalued at 40x forward P/E — change my mind',
      content: 'Everyone is euphoric about AI but the law of large numbers applies. Competition from AMD, custom chips from MSFT/GOOG/AMZN. Multiple compression incoming.',
      sentiment: 'bearish', likes: 89, comment_count: 127, created_at: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: '4', user_id: '4', username: 'OptionsYOLO', avatar_emoji: '🎰',
      ticker: 'SPY', title: 'What\'s everyone\'s play for FOMC next week?',
      content: 'Thinking about 0DTE strangles on SPY. Last FOMC gave us a 2% move. What\'s the play? Straddles? Iron condors? Or just YOLO calls?',
      sentiment: 'neutral', likes: 34, comment_count: 56, created_at: new Date(Date.now() - 28800000).toISOString(),
    },
    {
      id: '5', user_id: '5', username: 'DividendKing', avatar_emoji: '👑',
      ticker: null, title: 'Best dividend stocks for 2026 — my watchlist',
      content: 'Building a dividend portfolio for passive income. Looking at: O (Realty Income), SCHD, JNJ, PG, KO. Any other suggestions? Want >3% yield with growth.',
      sentiment: 'bullish', likes: 78, comment_count: 31, created_at: new Date(Date.now() - 43200000).toISOString(),
    },
  ];
}

function getMockComments(postId: string): Comment[] {
  if (postId === '1') {
    return [
      { id: 'c1', post_id: '1', user_id: '10', username: 'DiamondHands', avatar_emoji: '💎', content: 'HODL! 🚀🚀🚀 This is the way.', likes: 42, created_at: new Date(Date.now() - 1800000).toISOString() },
      { id: 'c2', post_id: '1', user_id: '11', username: 'SkepticalTrader', avatar_emoji: '🧐', content: 'What\'s your source for the short interest data? Last I checked it was down significantly from the peak.', likes: 15, created_at: new Date(Date.now() - 1200000).toISOString() },
      { id: 'c3', post_id: '1', user_id: '12', username: 'WallStBets', avatar_emoji: '🦧', content: 'Sir, this is a Wendy\'s. But also I\'m in for 100 shares.', likes: 89, created_at: new Date(Date.now() - 600000).toISOString() },
    ];
  }
  return [
    { id: 'c10', post_id: postId, user_id: '20', username: 'RandomApe', avatar_emoji: '🦍', content: 'Great analysis! Thanks for sharing.', likes: 5, created_at: new Date(Date.now() - 900000).toISOString() },
  ];
}
