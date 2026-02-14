//
//  app/page.tsx
//  TradeFlex - Web Homepage
//
//  Created by Kevin's AI on 2026-02-13.
//

'use client';

import { useState } from 'react';
import { Share2, Download, TrendingUp, TrendingDown, Flame } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function Home() {
  const [ticker, setTicker] = useState('TSLA');
  const [entry, setEntry] = useState('');
  const [exit, setExit] = useState('');
  const [type, setType] = useState('LONG');

  const entryNum = parseFloat(entry) || 0;
  const exitNum = parseFloat(exit) || 0;
  let pnlPercent = 0;
  
  if (entryNum > 0 && exitNum > 0) {
    pnlPercent = type === 'LONG' 
      ? ((exitNum - entryNum) / entryNum) * 100
      : ((entryNum - exitNum) / entryNum) * 100;
  }

  const isProfit = pnlPercent >= 0;
  // Use explicit RGB colors for html2canvas compatibility (oklab not supported)
  const textColor = isProfit ? '#22c55e' : '#ef4444'; // green-500 : red-500
  const gradientStyle = isProfit 
    ? { background: 'linear-gradient(to bottom right, rgba(20, 83, 45, 0.4), black)' } // green-900/40 -> black
    : { background: 'linear-gradient(to bottom right, rgba(127, 29, 29, 0.4), black)' }; // red-900/40 -> black

  const handleGenerate = async () => {
    // Scroll to preview
    const preview = document.getElementById('preview-card');
    if (preview) {
      preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Wait for scroll & render
      setTimeout(async () => {
        try {
          const canvas = await html2canvas(preview, {
            backgroundColor: null,
            scale: 2, // High resolution
            logging: false,
            useCORS: true,
            allowTaint: true,
            ignoreElements: (element) => element.tagName === 'BUTTON' // Ignore buttons
          });
          
          const image = canvas.toDataURL("image/png");
          const link = document.createElement('a');
          link.href = image;
          link.download = `TradeFlex-${ticker}-${pnlPercent.toFixed(2)}%.png`;
          link.click();
        } catch (err) {
          console.error("Failed to generate image:", err);
          // alert("Failed to generate image. Please try again.");
        }
      }, 500);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans p-4 md:p-8">
      <header className="flex flex-col gap-8 mb-12 max-w-4xl mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              TRADEFLEX
            </h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-bold text-gray-400">
            <a href="#" className="hover:text-white transition">FEED</a>
            <a href="#" className="text-white">ORACLE</a>
            <a href="#" className="hover:text-white transition">CREATE</a>
          </nav>
          <button className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition">
            Download App
          </button>
        </div>

        {/* Oracle Widget */}
        <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-zinc-400 text-sm tracking-widest">TODAY'S ORACLE 🔮</h3>
            <span className="text-green-500 font-bold text-sm animate-pulse">● LIVE VOTING</span>
          </div>
          
          <div className="flex gap-4">
            <button 
              className="flex-1 border py-4 rounded-xl transition group flex flex-col items-center gap-1 hover:scale-[1.02]"
              style={{ backgroundColor: 'rgba(20, 83, 45, 0.3)', borderColor: 'rgba(34, 197, 94, 0.3)' }}
            >
              <span className="text-2xl transition">🐂</span>
              <span className="font-black text-green-500">BULLISH</span>
              <span className="text-xs text-green-500/60">69%</span>
            </button>
            <button 
              className="flex-1 border py-4 rounded-xl transition group flex flex-col items-center gap-1 hover:scale-[1.02]"
              style={{ backgroundColor: 'rgba(127, 29, 29, 0.3)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <span className="text-2xl transition">🐻</span>
              <span className="font-black text-red-500">BEARISH</span>
              <span className="text-xs text-red-500/60">31%</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        
        {/* Left: Input Form */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              FLEX YOUR <br/>
              <span style={{ color: textColor }}>
                {isProfit ? 'GAINS 🚀' : 'LOSSES 📉'}
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Generate the ultimate trading flex. Share it. Become a legend.
            </p>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-4 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Ticker</label>
                <input 
                  type="text" 
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  className="w-full bg-black border border-zinc-700 rounded-lg p-3 font-bold focus:border-green-500 outline-none transition"
                  placeholder="BTC"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Position</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-lg p-3 font-bold focus:border-green-500 outline-none transition appearance-none"
                >
                  <option value="LONG">LONG (BUY)</option>
                  <option value="SHORT">SHORT (SELL)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Entry Price</label>
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
                <label className="text-xs font-bold text-zinc-500 uppercase">Exit Price</label>
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

            <button 
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-black font-black py-4 rounded-xl text-lg hover:scale-[1.02] active:scale-[0.98] transition shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              GENERATE IMAGE
            </button>
          </div>
        </div>

        {/* Right: Preview Card */}
        <div id="preview-card" className="relative group perspective-1000 scroll-mt-24">
          <div 
            id="preview-card" 
            className="relative group perspective-1000 scroll-mt-24 aspect-[9/16] w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 border border-white/10 flex flex-col items-center justify-center text-center p-8 group-hover:rotate-y-2 group-hover:scale-105"
            style={gradientStyle}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
            
            {/* Content */}
            <div className="relative z-10 w-full space-y-8">
              <div className="absolute top-8 left-0 right-0 flex justify-center z-20">
                <div className="bg-black/20 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl shadow-xl">
                  <h3 className="text-5xl font-black tracking-widest text-white drop-shadow-lg">
                    {ticker || 'BTC'}
                  </h3>
                </div>
              </div>

              <div className="py-8 space-y-4 mt-24">
                <span 
                  className="text-5xl md:text-7xl font-black tracking-tighter drop-shadow-lg block"
                  style={{ color: textColor }}
                >
                  {pnlPercent > 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                </span>
                
                {/* Emoji Reaction */}
                <div className="text-8xl md:text-9xl animate-bounce pt-8">
                  {isProfit ? '🤑' : '😭'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 text-sm font-mono border-t border-white/10 pt-8">
                <div>
                  <div className="text-zinc-500 mb-1">ENTRY</div>
                  <div className="font-bold">${entryNum.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-zinc-500 mb-1">EXIT</div>
                  <div className="font-bold">${exitNum.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-2 opacity-50">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest">VERIFIED BY TRADEFLEX</span>
            </div>
          </div>

          {/* Floating Action Button (Mobile) */}
          <button className="md:hidden absolute -bottom-6 right-4 bg-white text-black p-4 rounded-full shadow-xl">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

      </div>
    </main>
  );
}
