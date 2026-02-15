//
//  app/pricing/page.tsx
//  TradeFlex - Pricing Page (Bilingual)
//

'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Crown, Sparkles, BarChart3, Bell, Palette, Shield } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const [lang, setLang] = useState<'en' | 'cn'>('en');

  useEffect(() => {
    const saved = localStorage.getItem('tradeflex-lang') as 'en' | 'cn' | null;
    if (saved) setLang(saved);
  }, []);

  const monthlyPrice = 3.99;
  const yearlyPrice = 29.99;
  const yearlyMonthly = (yearlyPrice / 12).toFixed(2);
  const savings = Math.round((1 - yearlyPrice / (monthlyPrice * 12)) * 100);

  const t = {
    en: {
      pricing: 'Pricing',
      heroTitle1: 'Trade like a ',
      heroTitle2: 'Pro',
      heroDesc: 'Unlock premium features, stand out in the community, and level up your trading game.',
      monthly: 'Monthly',
      yearly: 'Yearly',
      save: `Save ${savings}%`,
      free: 'Free',
      freeDesc: 'Get started with the basics',
      forever: '/forever',
      month: '/month',
      billedYearly: `Billed $${yearlyPrice}/year`,
      getStarted: 'Get Started',
      upgradeToPro: 'Upgrade to Pro ✨',
      mostPopular: 'MOST POPULAR',
      proDesc: 'Everything you need to dominate',
      everythingInFree: 'Everything in Free, plus:',
      freeFeatures: [
        'Oracle voting',
        'Community browsing & posting',
        'Basic trade card (with watermark)',
        'View leaderboard',
        'Personal profile',
        'Follow traders',
      ],
      proFeatures: [
        'Premium trade card templates (no watermark)',
        'Custom card backgrounds',
        'Advanced trading analytics & PnL charts',
        'Trading calendar heatmap',
        'Pro badge on profile ✨',
        'Pin top 3 posts per month',
        'Real-time stock price alerts',
        'Oracle history & accuracy stats',
        'Custom avatar (upload photo)',
        'Profile theme customization',
        'Priority support',
      ],
      faqTitle: 'FAQ',
      faqs: [
        { q: 'Can I cancel anytime?', a: 'Yes! Cancel with one click, no questions asked. You keep Pro access until the end of your billing period.' },
        { q: 'Is there a free trial?', a: "We don't offer a free trial, but the free plan is fully functional. Pro just makes it better." },
        { q: 'What payment methods do you accept?', a: 'Visa, Mastercard, American Express, Apple Pay, and Google Pay via Stripe.' },
        { q: 'Can I switch between monthly and yearly?', a: "Yes! Switch anytime from your account settings. We'll prorate the difference." },
        { q: 'Is this financial advice?', a: 'Absolutely not. TradeFlex is a social platform for sharing trades and opinions. Always do your own research. 🎰' },
      ],
      bottomCta: 'Join 10,000+ traders already using TradeFlex',
    },
    cn: {
      pricing: '价格',
      heroTitle1: '像 ',
      heroTitle2: 'Pro',
      heroDesc: '解锁高级功能，在社区中脱颖而出，提升你的交易体验。',
      monthly: '月付',
      yearly: '年付',
      save: `省 ${savings}%`,
      free: '免费版',
      freeDesc: '基础功能，免费使用',
      forever: '/永久',
      month: '/月',
      billedYearly: `年付 $${yearlyPrice}/年`,
      getStarted: '立即开始',
      upgradeToPro: '升级到 Pro ✨',
      mostPopular: '最受欢迎',
      proDesc: '称霸交易圈的全部功能',
      everythingInFree: '包含免费版所有功能，另外还有：',
      freeFeatures: [
        'Oracle 投票',
        '社区浏览和发帖',
        '基础交易卡片（带水印）',
        '查看排行榜',
        '个人主页',
        '关注其他交易者',
      ],
      proFeatures: [
        '高级交易卡片模板（无水印）',
        '自定义卡片背景',
        '高级交易分析 & 盈亏图表',
        '交易日历热力图',
        '个人主页 Pro 徽章 ✨',
        '每月 3 次帖子置顶',
        '实时股价提醒',
        'Oracle 历史记录 & 准确率统计',
        '自定义头像（上传照片）',
        '个人主页主题定制',
        '优先客服支持',
      ],
      faqTitle: '常见问题',
      faqs: [
        { q: '可以随时取消吗？', a: '可以！一键取消，不问任何问题。取消后 Pro 权限保留到当期结束。' },
        { q: '有免费试用吗？', a: '没有免费试用，但免费版功能已经很完整。Pro 只是让体验更好。' },
        { q: '支持哪些付款方式？', a: '支持 Visa、Mastercard、American Express、Apple Pay 和 Google Pay（通过 Stripe）。' },
        { q: '可以在月付和年付之间切换吗？', a: '可以！随时在账户设置中切换，差价会按比例计算。' },
        { q: '这是投资建议吗？', a: '绝对不是。TradeFlex 是一个分享交易和观点的社交平台。请务必自行研究。🎰' },
      ],
      bottomCta: '加入 10,000+ 已在使用 TradeFlex 的交易者',
    },
  };
  const text = t[lang];

  const proIcons = [Palette, Palette, BarChart3, BarChart3, Crown, Sparkles, Bell, BarChart3, Palette, Palette, Shield];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#111]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-lg">{text.pricing}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-yellow-500/20">
            <Crown size={16} /> TradeFlex Pro
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            {text.heroTitle1}<span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">{text.heroTitle2}</span>{lang === 'cn' ? ' 一样交易' : ''}
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            {text.heroDesc}
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-10">
          <div className="flex bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition ${billing === 'monthly' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              {text.monthly}
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition flex items-center gap-2 ${billing === 'yearly' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              {text.yearly} <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">{text.save}</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          {/* Free */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-black mb-1">{text.free}</h3>
            <p className="text-white/40 text-sm mb-6">{text.freeDesc}</p>
            <div className="mb-6">
              <span className="text-4xl font-black">$0</span>
              <span className="text-white/40 text-sm">{text.forever}</span>
            </div>
            <Link href="/login?mode=signup" className="block w-full text-center bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition mb-8">
              {text.getStarted}
            </Link>
            <ul className="space-y-3">
              {text.freeFeatures.map(f => (
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
              {text.mostPopular}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-black">Pro</h3>
              <Crown size={18} className="text-yellow-400" />
            </div>
            <p className="text-white/40 text-sm mb-6">{text.proDesc}</p>
            <div className="mb-6">
              <span className="text-4xl font-black">${billing === 'yearly' ? yearlyMonthly : monthlyPrice.toFixed(2)}</span>
              <span className="text-white/40 text-sm">{text.month}</span>
              {billing === 'yearly' && (
                <div className="text-xs text-white/30 mt-1">{text.billedYearly}</div>
              )}
            </div>
            <button className="block w-full text-center bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black py-3 rounded-xl transition mb-8">
              {text.upgradeToPro}
            </button>
            <p className="text-xs text-white/30 mb-4">{text.everythingInFree}</p>
            <ul className="space-y-3">
              {text.proFeatures.map((f, i) => {
                const Icon = proIcons[i] || Shield;
                return (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                    <Icon size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-black text-center mb-8">{text.faqTitle}</h3>
          <div className="space-y-4">
            {text.faqs.map(faq => (
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
          <p className="text-white/30 text-sm">{text.bottomCta}</p>
          <div className="flex justify-center gap-1 mt-2 text-2xl">
            {'🦍💎🚀🐂👑'.split('').map((e, i) => <span key={i}>{e}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
