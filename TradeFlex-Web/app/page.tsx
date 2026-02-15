//
//  app/page.tsx
//  TradeFlex - Web Homepage
//
//  Created by Kevin's AI on 2026-02-13.
//

'use client';

import { useState, useEffect } from 'react';
import { Share2, Download, Rocket, LogOut } from 'lucide-react';
import { toPng } from 'html-to-image';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';
import { isAdmin } from './lib/admin';
import NotificationBell from './components/NotificationBell';
import GlobalSearch from './components/GlobalSearch';

export default function Home() {
  const [ticker, setTicker] = useState('TSLA');
  const [entry, setEntry] = useState('');
  const [exit, setExit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('LONG');
  const [status, setStatus] = useState<'OPEN' | 'CLOSED'>('OPEN');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  
  // Option State
  const [instrument, setInstrument] = useState<'STOCK' | 'OPTION'>('STOCK');
  const [strike, setStrike] = useState('');
  const [expiry, setExpiry] = useState('');
  const [optionType, setOptionType] = useState<'CALL' | 'PUT'>('CALL');

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        // Check if banned
        const { data: profile } = await supabase
          .from('profiles')
          .select('banned')
          .eq('id', user.id)
          .single();
        if (profile?.banned) {
          await supabase.auth.signOut();
          setUser(null);
          return;
        }
        setUser(user);
        // Restore user's language preference
        const userLang = user.user_metadata?.lang as 'en' | 'cn' | undefined;
        if (userLang) {
          setLang(userLang);
          localStorage.setItem('tradeflex-lang', userLang);
        }
        const created = new Date(user.created_at).getTime();
        const lastSignIn = new Date(user.last_sign_in_at || '').getTime();
        const isNew = Math.abs(lastSignIn - created) < 10000;
        setIsNewUser(isNew);
        setShowWelcome(true);
        setTimeout(() => setShowWelcome(false), 3000);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user ?? null;
      if (event === 'SIGNED_IN' && newUser) {
        // Check if banned
        const { data: profile } = await supabase
          .from('profiles')
          .select('banned')
          .eq('id', newUser.id)
          .single();
        if (profile?.banned) {
          await supabase.auth.signOut();
          setUser(null);
          return;
        }
        setUser(newUser);
        // Restore user's language preference
        const userLang = newUser.user_metadata?.lang as 'en' | 'cn' | undefined;
        if (userLang) {
          setLang(userLang);
          localStorage.setItem('tradeflex-lang', userLang);
        }
        const created = new Date(newUser.created_at).getTime();
        const lastSignIn = new Date(newUser.last_sign_in_at || '').getTime();
        const isNew = Math.abs(lastSignIn - created) < 10000;
        setIsNewUser(isNew);
        setShowWelcome(true);
        setTimeout(() => setShowWelcome(false), 3000);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Lang State
  const [lang, setLang] = useState<'en' | 'cn'>('en');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Language Preference
  useEffect(() => {
    const savedLang = localStorage.getItem('tradeflex-lang') as 'en' | 'cn';
    if (savedLang) setLang(savedLang);
    setIsLoaded(true);
  }, []);

  const changeLang = (newLang: 'en' | 'cn') => {
    setLang(newLang);
    localStorage.setItem('tradeflex-lang', newLang);
    // Save to user profile if logged in
    if (user) {
      supabase.auth.updateUser({ data: { lang: newLang } });
    }
  };

  // Oracle State
  const [bullCount, setBullCount] = useState(69420);
  const [bearCount, setBearCount] = useState(31000);
  const [voted, setVoted] = useState<'bull' | 'bear' | null>(null);

  // Leaderboard State
  interface LeaderboardEntry {
    rank: number;
    user: string;
    ticker: string;
    pnl: string;
    icon: string;
    position: string;
  }

  const defaultMooners: LeaderboardEntry[] = [
    { rank: 1, user: 'DeepFuckingValue', ticker: 'GME', pnl: '+42069%', icon: '👑', position: 'LONG' },
    { rank: 2, user: 'NancyP', ticker: 'NVDA', pnl: '+500%', icon: '🧠', position: 'LONG' },
    { rank: 3, user: 'CryptoWhale', ticker: 'PEPE', pnl: '+69%', icon: '🐋', position: 'LONG' },
    { rank: 4, user: 'CathieWood', ticker: 'COIN', pnl: '+45%', icon: '🌲', position: 'LONG' },
    { rank: 5, user: 'ElonMusk', ticker: 'DOGE', pnl: '+42%', icon: '🐶', position: 'LONG' },
  ];

  const defaultRekt: LeaderboardEntry[] = [
    { rank: 1, user: 'FTX_User', ticker: 'FTT', pnl: '-100%', icon: '🔥', position: 'CALL' },
    { rank: 2, user: 'WSB_Degens', ticker: 'BBBY', pnl: '-99%', icon: '🦍', position: 'CALL' },
    { rank: 3, user: 'BillHwang', ticker: 'VIAC', pnl: '-90%', icon: '🐅', position: 'CALL' },
    { rank: 4, user: 'JimCramer', ticker: 'META', pnl: '-85%', icon: '📢', position: 'CALL' },
    { rank: 5, user: 'LoganPaul', ticker: 'ZOO', pnl: '-78%', icon: '🥊', position: 'CALL' },
  ];

  const [mooners, setMooners] = useState<LeaderboardEntry[]>(defaultMooners);
  const [rektList, setRektList] = useState<LeaderboardEntry[]>(defaultRekt);

  // Fetch real leaderboard data
  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data.mooners?.length > 0) {
          setMooners(data.mooners.map((item: any, i: number) => ({
            rank: i + 1,
            user: item.profiles?.display_name || 'Anonymous',
            ticker: item.ticker,
            pnl: `+${item.pnl_percent.toFixed(0)}%`,
            icon: ['👑', '🧠', '🐋', '🌲', '🐶'][i] || '🚀',
            position: item.position_type,
          })));
        }
        if (data.rekt?.length > 0) {
          setRektList(data.rekt.map((item: any, i: number) => ({
            rank: i + 1,
            user: item.profiles?.display_name || 'Anonymous',
            ticker: item.ticker,
            pnl: `${item.pnl_percent.toFixed(0)}%`,
            icon: ['🔥', '🦍', '🐅', '📢', '🥊'][i] || '💀',
            position: item.position_type,
          })));
        }
      })
      .catch(() => {});
  }, []);

  // --- CALCULATIONS ---
  const entryNum = parseFloat(entry) || 0;
  const exitNum = parseFloat(exit) || 0;
  const quantityNum = parseFloat(quantity) || 0;
  let pnlPercent = 0;
  let pnlAmount = 0;
  
  if (entryNum > 0 && exitNum > 0) {
    pnlPercent = type === 'LONG' 
      ? ((exitNum - entryNum) / entryNum) * 100
      : ((entryNum - exitNum) / entryNum) * 100;

    if (quantityNum > 0) {
      const multiplier = instrument === 'OPTION' ? 100 : 1;
      pnlAmount = type === 'LONG'
        ? (exitNum - entryNum) * quantityNum * multiplier
        : (entryNum - exitNum) * quantityNum * multiplier;
    }
  }

  const isProfit = pnlPercent >= 0;
  const textColor = '#ffffff'; 
  const gradientStyle = isProfit 
    ? { background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' } 
    : { background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' }; 

  // --- EFFECTS ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        setBullCount(prev => prev + Math.floor(Math.random() * 10));
      } else {
        setBearCount(prev => prev + Math.floor(Math.random() * 5));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const totalVotes = bullCount + bearCount;
  const bullPercent = Math.round((bullCount / totalVotes) * 100);
  const bearPercent = 100 - bullPercent;

  const handleVote = (side: 'bull' | 'bear') => {
    if (voted) return;
    setVoted(side);
    if (side === 'bull') setBullCount(prev => prev + 1);
    else setBearCount(prev => prev + 1);
    // Save vote to Supabase
    if (user) {
      supabase.from('oracle_votes').insert({
        user_id: user.id,
        vote: side,
      }).then(() => {});
    }
  };

  const handleGenerate = async () => {
    const preview = document.getElementById('preview-card');
    if (preview) {
      preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(async () => {
        try {
          const dataUrl = await toPng(preview, {
            pixelRatio: 2,
            filter: (node) => {
              return !(node instanceof HTMLElement && node.tagName === 'BUTTON');
            },
          });

          const fileName = `TradeFlex-${ticker}-${pnlPercent.toFixed(2)}%.png`;

          // Track flex in Supabase
          if (user) {
            supabase.from('flexes').insert({
              user_id: user.id,
              ticker,
              instrument,
              position_type: type,
              entry_price: entryNum || null,
              exit_price: exitNum || null,
              quantity: quantityNum || null,
              pnl_percent: pnlPercent,
              pnl_amount: pnlAmount || null,
              status: status,
            }).then(() => {});
          }

          // Direct download
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = fileName;
          link.click();
        } catch (err: any) {
          console.error("Failed to generate image:", err);
        }
      }, 500);
    }
  };

  // --- TRANSLATIONS ---
  const t = {
    en: {
      oracleTitle: "TODAY'S ORACLE 🔮",
      oracleSubtitle: "Vote before market open (9:30 AM ET) — predict today's move!",
      live: "LIVE VOTING",
      bullish: "BULLISH",
      bearish: "BEARISH",
      flexTitle: "FLEX YOUR",
      flexSubtitle: "Generate the ultimate trading flex. Share it. Become a legend.",
      gains: "GAINS 🚀",
      losses: "LOSSES 📉",
      ticker: "TICKER",
      position: "POSITION",
      long: "LONG",
      short: "SHORT",
      status: "STATUS",
      open: "OPEN",
      closed: "CLOSED",
      instrument: "INSTRUMENT",
      stock: "STOCK",
      option: "OPTION",
      strike: "STRIKE ($)",
      expiry: "EXPIRATION",
      call: "CALL",
      put: "PUT",
      entry: "AVG COST",
      exit: "PRICE",
      current: "PRICE",
      quantity: "QUANTITY",
      pnl: "P/L ($)",
      generate: "GENERATE IMAGE",
      verified: "VERIFIED BY TRADEFLEX",
      hallOfFame: "HALL OF FAME 🏆",
      mooners: "MOONERS 🚀",
      rekt: "REKT 💀",
      downloadApp: "Download App",
      unrealized: "UNREALIZED P/L",
      realized: "REALIZED P/L",
      emoji: "CUSTOM EMOTION"
    },
    cn: {
      oracleTitle: "今日预言机 🔮",
      oracleSubtitle: "在开盘前投票（美东 9:30 AM）— 预测今天大盘走势！",
      live: "实时投票",
      bullish: "看涨",
      bearish: "看跌",
      flexTitle: "晒出你的",
      flexSubtitle: "生成终极交易战报。分享它。成为传奇。",
      gains: "战绩 🚀",
      losses: "亏损 📉",
      ticker: "股票代码",
      position: "持仓方向",
      long: "做多",
      short: "做空",
      status: "当前状态",
      open: "持仓中",
      closed: "已平仓",
      instrument: "交易品种",
      stock: "正股",
      option: "期权",
      strike: "行权价 ($)",
      expiry: "到期日",
      call: "看涨期权 (CALL)",
      put: "看跌期权 (PUT)",
      entry: "平均成本",
      exit: "卖出价",
      current: "当前价格",
      quantity: "持仓数量",
      pnl: "盈亏金额",
      generate: "生成海报",
      verified: "TRADEFLEX 认证",
      hallOfFame: "名人堂 🏆",
      mooners: "赢家榜 🚀",
      rekt: "惨案榜 💀",
      downloadApp: "下载APP",
      unrealized: "浮动盈亏 (Unrealized)",
      realized: "已实现盈亏 (Realized)",
      emoji: "自定义表情"
    }
  };

  const text = t[lang];

  if (!isLoaded) return null; // Prevent flash of wrong language

  return (
    <main className="min-h-screen bg-black text-white font-sans p-4 md:p-8 relative selection:bg-green-500/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      {/* Welcome Toast */}
      {showWelcome && user && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-green-500 px-6 py-3 rounded-xl shadow-2xl shadow-green-500/30 flex items-center gap-3">
            <span className="text-2xl">{isNewUser ? '🎉' : '🚀'}</span>
            <span className="text-sm font-bold text-black">
              {isNewUser ? (
                lang === 'cn' 
                  ? <>欢迎加入 TradeFlex，<span className="text-black/80">{user.email?.split('@')[0]}</span>！一起创造历史 🏆</>
                  : <>Welcome to TradeFlex, <span className="text-black/80">{user.email?.split('@')[0]}</span>! Let&apos;s make history 🏆</>
              ) : (
                lang === 'cn'
                  ? <>欢迎回来，<span className="text-black/80">{user.email?.split('@')[0]}</span>！准备好晒战绩了吗？</>
                  : <>Welcome back, <span className="text-black/80">{user.email?.split('@')[0]}</span>! Ready to flex?</>
              )}
            </span>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      <header className="flex flex-col gap-8 mb-12 max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Rocket className="w-8 h-8 text-green-500 -rotate-45" />
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              TRADEFLEX
            </h1>
            <button 
              onClick={() => changeLang(lang === 'en' ? 'cn' : 'en')}
              className="ml-1 hover:scale-110 transition flex items-center justify-center w-6 h-4 overflow-hidden shadow-sm"
              title="Switch Language"
            >
              {lang === 'en' ? (
                <svg viewBox="0 0 900 600" className="w-full h-full">
                  <rect width="900" height="600" fill="#de2910"/>
                  <path fill="#ffde00" d="M250.4 180.3l37.2 27.2-14.3 43.8 37.3-27.1 37.3 27.1-14.3-43.8 37.2-27.2-46-0.1-14.2-43.9-14.2 43.9z"/>
                  <g transform="translate(400 130) rotate(-28)"><path fill="#ffde00" d="M0-28l9 27-23.7-17h29.4L-9-1z"/></g>
                  <g transform="translate(470 205) rotate(-8)"><path fill="#ffde00" d="M0-28l9 27-23.7-17h29.4L-9-1z"/></g>
                  <g transform="translate(470 300) rotate(16)"><path fill="#ffde00" d="M0-28l9 27-23.7-17h29.4L-9-1z"/></g>
                  <g transform="translate(400 375) rotate(37)"><path fill="#ffde00" d="M0-28l9 27-23.7-17h29.4L-9-1z"/></g>
                </svg>
              ) : (
                <svg viewBox="0 0 1235 650" className="w-full h-full">
                  <rect width="1235" height="650" fill="#b22234"/>
                  <path d="M0,0H1235V50H0M0,100H1235V150H0M0,200H1235V250H0M0,300H1235V350H0M0,400H1235V450H0M0,500H1235V550H0M0,600H1235V650H0" fill="#fff"/>
                  <rect width="494" height="350" fill="#3c3b6e"/>
                </svg>
              )}
            </button>
          </div>
          
          <nav className="hidden md:flex items-center gap-4 text-sm font-black text-zinc-400">
            <button onClick={() => document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition">LEADERBOARD</button>
            <button onClick={() => document.getElementById('generate-section')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition">CREATE</button>
            <a href="/community" className="hover:text-white transition">COMMUNITY</a>
            
            <div className="w-40">
              <GlobalSearch />
            </div>
            
            <div className="border-l border-zinc-800 pl-4 flex items-center gap-2">
              <NotificationBell user={user} />
              {user ? (
                <div className="flex items-center gap-2">
                  {isAdmin(user.email) && (
                    <a href="/admin" className="text-yellow-400 hover:text-yellow-300 transition" title="Admin Panel">⚙️</a>
                  )}
                  <a href={`/profile/${user.email?.split('@')[0]}`} className="text-green-400 font-bold hover:text-green-300 transition">{user.email?.split('@')[0]}</a>
                  <button onClick={handleLogout} className="hover:text-red-400 transition" title="Log out">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <a href="/login" className="hover:text-white transition">LOG IN</a>
                  <span>/</span>
                  <a href="/login?mode=signup" className="text-white hover:text-green-400 transition">JOIN</a>
                </>
              )}
            </div>
          </nav>
          
          {/* Mobile: auth only (top right) */}
          <div className="flex items-center gap-2 md:hidden">
              {user ? (
                <div className="flex items-center gap-2 text-xs font-black text-zinc-400">
                  {isAdmin(user.email) && (
                    <a href="/admin" className="text-yellow-400" title="Admin">⚙️</a>
                  )}
                  <span className="text-green-400 font-bold">{user.email?.split('@')[0]}</span>
                  <button onClick={handleLogout} className="hover:text-red-400 transition" title="Log out">
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-1 text-xs font-black text-zinc-400">
                  <a href="/login" className="hover:text-white transition">LOGIN</a>
                  <span>/</span>
                  <a href="/login?mode=signup" className="text-white hover:text-green-400 transition">JOIN</a>
                </div>
              )}
          </div>
        </div>

        {/* Mobile: nav links row below logo */}
        <div className="md:hidden flex gap-4 text-xs font-black tracking-wide text-zinc-400 -mt-4 mb-2 items-center">
          <button onClick={() => document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition">LEADERBOARD</button>
          <button onClick={() => document.getElementById('generate-section')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition">CREATE</button>
          <a href="/community" className="hover:text-white transition">COMMUNITY</a>
          <button className="bg-white text-black px-3 py-1 rounded-full font-bold text-[10px] hover:bg-gray-200 transition whitespace-nowrap ml-auto">
            {text.downloadApp}
          </button>
        </div>

        <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md transition-all duration-500">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-black text-zinc-400 text-sm tracking-widest">{text.oracleTitle}</h3>
            <span className="text-green-500 font-bold text-sm animate-pulse">● {text.live}</span>
          </div>
          <p className="text-zinc-500 text-xs mb-4">{text.oracleSubtitle}</p>
          
          <div className="flex gap-4">
            <button 
              onClick={() => handleVote('bull')}
              disabled={voted !== null}
              className={`flex-1 border py-4 rounded-xl transition group flex flex-col items-center gap-1 ${
                voted === 'bull' ? 'bg-green-900/50 border-green-500 ring-2 ring-green-500/50 scale-105' : 'hover:scale-[1.02]'
              }`}
              style={{ 
                backgroundColor: voted === 'bull' ? undefined : 'rgba(20, 83, 45, 0.3)', 
                borderColor: voted === 'bull' ? undefined : 'rgba(34, 197, 94, 0.3)',
                opacity: voted === 'bear' ? 0.5 : 1
              }}
            >
              <span className="text-2xl transition">🐂</span>
              <span className="font-black text-green-500">{text.bullish}</span>
              <span className="text-sm font-bold text-green-400 transition-all duration-500">{bullPercent}%</span>
            </button>
            <button 
              onClick={() => handleVote('bear')}
              disabled={voted !== null}
              className={`flex-1 border py-4 rounded-xl transition group flex flex-col items-center gap-1 ${
                voted === 'bear' ? 'bg-red-900/50 border-red-500 ring-2 ring-red-500/50 scale-105' : 'hover:scale-[1.02]'
              }`}
              style={{ 
                backgroundColor: voted === 'bear' ? undefined : 'rgba(127, 29, 29, 0.3)', 
                borderColor: voted === 'bear' ? undefined : 'rgba(239, 68, 68, 0.3)',
                opacity: voted === 'bull' ? 0.5 : 1
              }}
            >
              <span className="text-2xl transition">🐻</span>
              <span className="font-black text-red-500">{text.bearish}</span>
              <span className="text-sm font-bold text-red-400 transition-all duration-500">{bearPercent}%</span>
            </button>
          </div>
          
          <div className="w-full h-1 bg-zinc-800 mt-4 rounded-full overflow-hidden flex">
            <div className="h-full bg-green-500 transition-all duration-1000 ease-out" style={{ width: `${bullPercent}%` }}></div>
            <div className="h-full bg-red-500 transition-all duration-1000 ease-out" style={{ width: `${bearPercent}%` }}></div>
          </div>
        </div>
      </header>

      <div id="generate-section" className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start relative z-10">
        
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              {text.flexTitle} <br/>
              <span style={{ color: isProfit ? '#10b981' : '#f43f5e' }}>
                {isProfit ? text.gains : text.losses}
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              {text.flexSubtitle}
            </p>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-4 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">{text.instrument}</label>
                <select 
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value as 'STOCK' | 'OPTION')}
                  className="w-full bg-black border border-zinc-700 rounded-lg p-3 font-bold focus:border-green-500 outline-none transition appearance-none"
                >
                  <option value="STOCK">{text.stock}</option>
                  <option value="OPTION">{text.option}</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">{text.status}</label>
                <div className="flex bg-black border border-zinc-700 rounded-lg p-1">
                  <button
                    onClick={() => setStatus('OPEN')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition ${
                      status === 'OPEN' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {text.open}
                  </button>
                  <button
                    onClick={() => setStatus('CLOSED')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition ${
                      status === 'CLOSED' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {text.closed}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">{text.ticker}</label>
                <input 
                  type="text" 
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  className="w-full bg-black border border-zinc-700 rounded-lg p-3 font-bold focus:border-green-500 outline-none transition"
                  placeholder="BTC"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">{text.position}</label>
                <div className="flex bg-black border border-zinc-700 rounded-lg p-1">
                  <button
                    onClick={() => setType('LONG')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition ${
                      type === 'LONG' ? 'bg-green-900/30 text-green-400 shadow-sm border border-green-900' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {text.long}
                  </button>
                  <button
                    onClick={() => setType('SHORT')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition ${
                      type === 'SHORT' ? 'bg-red-900/30 text-red-400 shadow-sm border border-red-900' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {text.short}
                  </button>
                </div>
              </div>
            </div>

            {instrument === 'OPTION' && (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">{text.strike}</label>
                  <input 
                    type="number" 
                    value={strike}
                    onChange={(e) => setStrike(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-lg p-3 font-bold focus:border-green-500 outline-none transition"
                    placeholder="420"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Type</label>
                  <select 
                    value={optionType}
                    onChange={(e) => setOptionType(e.target.value as 'CALL' | 'PUT')}
                    className="w-full bg-black border border-zinc-700 rounded-lg p-3 font-bold focus:border-green-500 outline-none transition appearance-none"
                  >
                    <option value="CALL">CALL</option>
                    <option value="PUT">PUT</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">{text.expiry}</label>
                  <input 
                    type="text" 
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-lg p-3 font-bold focus:border-green-500 outline-none transition"
                    placeholder="02/21"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">{text.entry}</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-zinc-500">$</span>
                  <input 
                    type="number" 
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-lg p-3 pl-6 font-mono focus:border-green-500 outline-none transition"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">
                  {status === 'OPEN' ? text.current : text.exit}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-zinc-500">$</span>
                  <input 
                    type="number" 
                    value={exit}
                    onChange={(e) => setExit(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-lg p-3 pl-6 font-mono focus:border-green-500 outline-none transition"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase">{text.quantity}</label>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg p-3 font-mono focus:border-green-500 outline-none transition"
                placeholder={instrument === 'OPTION' ? "1 (Contracts)" : "100 (Shares)"}
              />
            </div>

            {/* Emoji Picker (Collapsible) */}
            <div className="space-y-2 relative">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                  {text.emoji} 
                  <span className={`text-xl transition hover:scale-125 cursor-pointer`}>
                    🐶
                  </span>
                </label>
                {selectedEmoji && (
                  <span className="text-xl animate-bounce">{selectedEmoji}</span>
                )}
              </div>
              
              {showEmojiPicker && (
                <div className="absolute left-0 right-0 z-50 bg-zinc-900 border border-zinc-700 p-3 rounded-xl shadow-xl flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300 mt-1">
                  {/* Default Mascot Button */}
                  <button 
                    onClick={() => setSelectedEmoji(null)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition ${selectedEmoji === null ? 'bg-white text-black ring-2 ring-green-500' : 'bg-black border border-zinc-700 hover:border-zinc-500'}`}
                  >
                    🐮
                  </button>
                  
                  {/* Smart Emoji List */}
                  {(isProfit 
                    ? ['🚀','💎','🐂','🤑','🌕','📈','💰','🏦','😎','🏎️'] 
                    : ['😭','🤡','🐻','💀','📉','🥀','💸','🚑','🚽','🛑']
                  ).map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition ${selectedEmoji === emoji ? 'bg-white text-black' : 'bg-black border border-zinc-700 hover:border-zinc-500'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                  
                  {/* Custom Input */}
                  <input 
                     type="text" 
                     placeholder="+"
                     maxLength={2}
                     className="w-10 h-10 rounded-lg bg-black border border-zinc-700 text-center text-xl focus:border-green-500 outline-none text-white"
                     onChange={(e) => setSelectedEmoji(e.target.value)}
                  />
                </div>
              )}
            </div>

            <button 
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-black font-black py-4 rounded-xl text-lg hover:scale-[1.02] active:scale-[0.98] transition shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              {text.generate}
            </button>
          </div>
        </div>

        <div id="preview-card" className="relative group perspective-1000 scroll-mt-24">
          <div 
            className="relative group perspective-1000 scroll-mt-24 aspect-[9/16] w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 border border-white/10 flex flex-col items-center justify-center text-center p-8 group-hover:rotate-y-2 group-hover:scale-105"
            style={gradientStyle}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
            
            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 pt-12">
              {/* Top: Status Tag - Moomoo Style */}
              <div className="flex justify-center mb-2">
                <div className="inline-block px-3 py-1 rounded-[4px] border border-white text-lg font-normal tracking-wide text-white shadow-sm w-fit whitespace-nowrap">
                    {status === 'OPEN' ? `% ${text.unrealized}` : `% ${text.realized}`}
                </div>
              </div>

              {/* Center: PnL & Mascot (Seamless Black OR Emoji) */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <span 
                  className="text-6xl md:text-7xl font-bold tracking-tight drop-shadow-md block"
                  style={{ color: textColor }}
                >
                  {pnlPercent > 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                </span>
                
                {quantityNum > 0 && (
                  <div className="mt-2 text-2xl font-bold tracking-wide text-white/90 drop-shadow-sm font-mono">
                    {pnlAmount > 0 ? '+' : ''}${pnlAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                )}
                
                <div className="flex items-center justify-center pt-4">
                  {selectedEmoji ? (
                    <span className="text-9xl animate-bounce drop-shadow-2xl filter">{selectedEmoji}</span>
                  ) : (
                    <span className="text-9xl animate-bounce drop-shadow-2xl filter">
                      {isProfit ? '🤑' : '😭'}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom: Details Grid (Moomoo Style) */}
              <div className="grid grid-cols-2 gap-4 text-left border-t border-white/10 pt-4 mt-4">
                {/* Left: Ticker Info */}
                <div className="flex flex-col justify-end">
                  <h3 className="text-4xl font-black tracking-tighter text-white drop-shadow-md leading-none mb-1">
                    {ticker || 'BTC'}
                  </h3>
                  {instrument === 'OPTION' && (
                    <div className="text-xs font-bold text-white/80 bg-white/10 px-2 py-1 rounded inline-block w-fit">
                      ${strike || '0'} {optionType} {expiry}
                    </div>
                  )}
                  {/* User Info (Fake) */}
                  <div className="mt-2 text-[10px] text-white/60 font-mono">
                    Alice • {new Date().toLocaleDateString()}
                  </div>
                </div>

                {/* Right: Price Info */}
                <div className="flex flex-col justify-end text-right space-y-2">
                  <div>
                    <div className="text-[10px] text-white/70 tracking-widest uppercase mb-0.5">{status === 'OPEN' ? text.current : text.exit}</div>
                    <div className="text-2xl font-bold text-white">${exitNum.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/70 tracking-widest uppercase mb-0.5">{text.entry}</div>
                    <div className="text-2xl font-bold text-white">${entryNum.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute top-6 left-6 flex items-center gap-2 opacity-90 text-white z-20">
              <Rocket className="w-5 h-5 -rotate-45" />
              <span className="text-xs font-bold tracking-widest">{text.verified}</span>
            </div>
          </div>

          <button className="md:hidden absolute -bottom-6 right-4 bg-white text-black p-4 rounded-full shadow-xl">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

      </div>

      <section id="leaderboard" className="max-w-6xl mx-auto mt-24 mb-12 relative z-10">
        <h2 className="text-3xl font-black italic tracking-tighter mb-8 text-center">
          {text.hallOfFame}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mooners Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-black text-green-500 flex items-center gap-2">MOONERS 🚀</h3>
            </div>
            {mooners.map((item) => (
              <div key={item.rank} className="flex items-center bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl hover:border-green-500/50 transition cursor-pointer group">
                <div className="w-8 font-black text-zinc-600 text-lg">#{item.rank}</div>
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-xl mr-4 group-hover:scale-110 transition">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    @{item.user}
                    <span className="text-[10px] bg-green-900/50 text-green-400 px-1.5 py-0.5 rounded border border-green-900">PRO</span>
                  </div>
                  <div className="text-xs text-zinc-500 font-mono">{item.ticker} {item.position || 'LONG'}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-xl text-green-500">{item.pnl}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Rekt Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-black text-red-500 flex items-center gap-2">REKT 💀</h3>
            </div>
            {rektList.map((item) => (
              <div key={item.rank} className="flex items-center bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl hover:border-red-500/50 transition cursor-pointer group">
                <div className="w-8 font-black text-zinc-600 text-lg">#{item.rank}</div>
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-xl mr-4 group-hover:scale-110 transition">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    @{item.user}
                    <span className="text-[10px] bg-red-900/50 text-red-400 px-1.5 py-0.5 rounded border border-red-900">YOLO</span>
                  </div>
                  <div className="text-xs text-zinc-500 font-mono">{item.ticker} {item.position || 'CALL'}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-xl text-red-500">{item.pnl}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="hidden md:block border-t border-zinc-800 mt-24 py-10 relative z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-500">
            <Rocket className="w-4 h-4 -rotate-45" />
            <span className="text-sm font-bold">TRADEFLEX</span>
            <span className="text-xs">© 2026</span>
          </div>
          <div className="flex items-center gap-6 text-xs font-bold text-zinc-500">
            <a href="/community" className="hover:text-white transition">COMMUNITY</a>
            <span className="text-zinc-700">|</span>
            <a href="#" className="hover:text-white transition">PRIVACY</a>
            <span className="text-zinc-700">|</span>
            <a href="#" className="hover:text-white transition">TERMS</a>
            <span className="text-zinc-700">|</span>
            <button className="bg-white text-black px-5 py-2 rounded-full font-bold text-xs hover:bg-gray-200 transition">
              {text.downloadApp}
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}