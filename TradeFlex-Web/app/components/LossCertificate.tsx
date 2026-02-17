'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Award, Share2 } from 'lucide-react';

interface LossCertificateProps {
  symbol: string;
  lossPercentage: number; // e.g. 45.5 for -45.5%
  username: string;
  entryPrice: number;
  exitPrice: number;
  daysHeld?: number;
}

export default function LossCertificate({
  symbol,
  lossPercentage,
  username,
  entryPrice,
  exitPrice,
  daysHeld = 0,
}: LossCertificateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // 只有亏损超过 30% 才显示入口
  if (Math.abs(lossPercentage) < 30) return null;

  const downloadCertificate = async () => {
    if (ref.current === null) return;
    setIsGenerating(true);

    try {
      const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `tradeflex-certificate-${symbol}-${username}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate certificate', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareCertificate = async () => {
    if (ref.current === null) return;
    setIsGenerating(true);
    
    try {
        const blob = await toPng(ref.current, { cacheBust: true, pixelRatio: 2, type: 'image/png' })
            .then(dataUrl => fetch(dataUrl))
            .then(res => res.blob());
            
        if (navigator.canShare && navigator.canShare({ files: [new File([blob], 'cert.png', { type: 'image/png' })] })) {
            await navigator.share({
                files: [new File([blob], 'cert.png', { type: 'image/png' })],
                title: 'Certified Bagholder',
                text: `I just earned my Bagholder Certificate on $${symbol}! 📉 #TradeFlex`
            });
        } else {
            // Fallback for desktop
            downloadCertificate();
        }
    } catch (err) {
        console.error('Share failed', err);
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center">
      {/* 入口按钮 */}
      <button
        onClick={downloadCertificate}
        disabled={isGenerating}
        className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 font-bold text-white transition-all duration-200 bg-gradient-to-r from-red-600 to-red-800 rounded-full hover:from-red-500 hover:to-red-700 focus:outline-none ring-offset-2 focus:ring-2 ring-red-400 shadow-lg hover:shadow-red-500/50 hover:-translate-y-0.5 active:translate-y-0"
      >
        <Award className="w-5 h-5 text-yellow-300 animate-pulse" />
        <span>
          {isGenerating ? 'Generating...' : 'Claim Official Bagholder Certificate'}
        </span>
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-900 text-xs font-black px-2 py-0.5 rounded-full border border-red-900 transform rotate-12 shadow-sm">
          EARNED!
        </div>
      </button>

      {/* 证书渲染区域 (Hidden off-screen usually, but here we render it to capture) */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        <div
          ref={ref}
          className="w-[800px] h-[600px] bg-[#fffaf0] relative border-[20px] border-double border-[#b8860b] p-10 font-serif text-center text-[#2c3e50]"
          style={{ 
            backgroundImage: 'radial-gradient(circle, #fffaf0 0%, #f3e5ab 100%)',
            fontFamily: '"Times New Roman", Times, serif'
          }}
        >
          {/* Watermark Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <span className="text-[150px] font-black transform -rotate-12 select-none">
              REGARD
            </span>
          </div>

          {/* Header */}
          <div className="mb-2">
            <div className="text-xl uppercase tracking-[0.2em] text-[#b8860b] font-bold mb-2">TradeFlex Academy of Risk</div>
            <h1 className="text-6xl font-black mb-4 text-black uppercase tracking-wide" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
              Certificate of Loss
            </h1>
            <div className="w-32 h-1 bg-[#b8860b] mx-auto mb-6"></div>
          </div>

          {/* Body */}
          <div className="text-2xl leading-relaxed mb-8">
            <p className="mb-4">This certifies that</p>
            <p className="text-5xl font-bold text-[#c0392b] mb-4 font-script italic underline decoration-2 decoration-[#b8860b] underline-offset-8">
              {username}
            </p>
            <p className="mb-2">
              has successfully achieved the status of
            </p>
            <p className="text-3xl font-black uppercase text-[#2c3e50] mb-6">
              Certified Diamond Hands Bagholder 💎🙌
            </p>
            <p className="px-12 text-xl text-gray-600">
              For displaying exceptional courage by holding <strong>{symbol}</strong> from an entry of 
              <span className="font-mono text-black"> ${entryPrice}</span> all the way down to 
              <span className="font-mono text-black"> ${exitPrice}</span>, realizing a legendary loss of:
            </p>
          </div>

          {/* The Loss Number */}
          <div className="text-7xl font-black text-red-600 mb-12 transform -rotate-2 inline-block border-4 border-red-600 px-6 py-2 rounded-lg mask-grunge shadow-xl bg-white">
            -{Math.abs(lossPercentage).toFixed(2)}%
          </div>

          {/* Footer / Signatures */}
          <div className="flex justify-between items-end mt-auto px-12 pb-4">
            <div className="flex flex-col items-center">
              <div className="border-b-2 border-black w-48 mb-2"></div>
              <p className="font-bold text-sm uppercase tracking-widest">Date of Rekt</p>
              <p className="text-lg font-mono">{new Date().toLocaleDateString()}</p>
            </div>

            {/* Seal */}
            <div className="relative">
                <div className="w-32 h-32 bg-red-800 rounded-full flex items-center justify-center text-white font-bold border-4 border-red-900 shadow-2xl">
                    <div className="border-2 border-red-400 rounded-full w-28 h-28 flex flex-col items-center justify-center text-center p-2 transform rotate-[-15deg]">
                        <span className="text-[10px] uppercase tracking-widest mb-1">Official Seal</span>
                        <span className="text-2xl font-black leading-none">BUY<br/>HIGH<br/>SELL<br/>LOW</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="font-script text-3xl mb-1 transform -rotate-6 text-blue-800">The Market Gods</div>
              <div className="border-b-2 border-black w-48 mb-2"></div>
              <p className="font-bold text-sm uppercase tracking-widest">Authorized Signature</p>
            </div>
          </div>
          
          <div className="absolute bottom-2 right-4 text-[10px] text-gray-400">
            Verified by TradeFlex Protocol • No Refunds
          </div>
        </div>
      </div>
    </div>
  );
}
