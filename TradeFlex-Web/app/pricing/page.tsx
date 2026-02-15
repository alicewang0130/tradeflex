//
//  app/pricing/page.tsx
//  TradeFlex - Pricing Page
//

'use client';

import { useState } from 'react';
import { ArrowLeft, Check, Crown, Rocket, Sparkles, BarChart3, Bell, Palette, Shield } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');

  const monthlyPrice = 3.99;
  const yearlyPrice = 29.99;
  const yearlyMonthly = (yearlyPrice / 12).toFixed(2);
  const savings = Math.round((1 - yearlyPrice / (monthlyPrice * 12)) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#111]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-lg">Pricing</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-yellow-500/20">
            <Crown size={16} /> TradeFlex Pro
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Trade like a <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Pro</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Unlock premium features, stand out in the community, and level up your trading game.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-10">
          <div className="flex bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition ${billing === 'monthly' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition flex items-center gap-2 ${billing === 'yearly' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              Yearly <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Save {savings}%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          {/* Free */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-black mb-1">Free</h3>
            <p className="text-white/40 text-sm mb-6">Get started with the basics</p>
            <div className="mb-6">
              <span className="text-4xl font-black">$0</span>
              <span className="text-white/40 text-sm">/forever</span>
            </div>
            <Link href="/login?mode=signup" className="block w-full text-center bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition mb-8">
              Get Started
            </Link>
            <ul className="space-y-3">
              {[
                'Oracle voting',
                'Community browsing & posting',
                'Basic trade card (with watermark)',
                'View leaderboard',
                'Personal profile',
                'Follow traders',
              ].map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                  <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-b from-yellow-500/5 to-transparent border-2 border-yellow-500/30 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-black px-4 py-1 rounded-full">
              MOST POPULAR
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-black">Pro</h3>
              <Crown size={18} className="text-yellow-400" />
            </div>
            <p className="text-white/40 text-sm mb-6">Everything you need to dominate</p>
            <div className="mb-6">
              <span className="text-4xl font-black">${billing === 'yearly' ? yearlyMonthly : monthlyPrice.toFixed(2)}</span>
              <span className="text-white/40 text-sm">/month</span>
              {billing === 'yearly' && (
                <div className="text-xs text-white/30 mt-1">Billed ${yearlyPrice}/year</div>
              )}
            </div>
            <button className="block w-full text-center bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black py-3 rounded-xl transition mb-8">
              Upgrade to Pro ✨
            </button>
            <p className="text-xs text-white/30 mb-4">Everything in Free, plus:</p>
            <ul className="space-y-3">
              {[
                { icon: Palette, text: 'Premium trade card templates (no watermark)' },
                { icon: Palette, text: 'Custom card backgrounds' },
                { icon: BarChart3, text: 'Advanced trading analytics & PnL charts' },
                { icon: BarChart3, text: 'Trading calendar heatmap' },
                { icon: Crown, text: 'Pro badge on profile ✨' },
                { icon: Sparkles, text: 'Pin top 3 posts per month' },
                { icon: Bell, text: 'Real-time stock price alerts' },
                { icon: BarChart3, text: 'Oracle history & accuracy stats' },
                { icon: Palette, text: 'Custom avatar (upload photo)' },
                { icon: Palette, text: 'Profile theme customization' },
                { icon: Shield, text: 'Priority support' },
              ].map(f => (
                <li key={f.text} className="flex items-start gap-2 text-sm text-white/80">
                  <f.icon size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                  {f.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-black text-center mb-8">FAQ</h3>
          <div className="space-y-4">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes! Cancel with one click, no questions asked. You keep Pro access until the end of your billing period.' },
              { q: 'Is there a free trial?', a: 'We don\'t offer a free trial, but the free plan is fully functional. Pro just makes it better.' },
              { q: 'What payment methods do you accept?', a: 'Visa, Mastercard, American Express, Apple Pay, and Google Pay via Stripe.' },
              { q: 'Can I switch between monthly and yearly?', a: 'Yes! Switch anytime from your account settings. We\'ll prorate the difference.' },
              { q: 'Is this financial advice?', a: 'Absolutely not. TradeFlex is a social platform for sharing trades and opinions. Always do your own research. 🎰' },
            ].map(faq => (
              <details key={faq.q} className="bg-[#111] border border-white/5 rounded-xl group">
                <summary className="px-5 py-4 cursor-pointer font-bold text-sm text-white/80 hover:text-white transition list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-white/30 group-open:rotate-45 transition-transform text-lg">+</span>
                </summary>
                <p className="px-5 pb-4 text-sm text-white/50">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 mb-8">
          <p className="text-white/30 text-sm">Join 10,000+ traders already using TradeFlex</p>
          <div className="flex justify-center gap-1 mt-2 text-2xl">
            {'🦍💎🚀🐂👑'.split('').map((e, i) => <span key={i}>{e}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
