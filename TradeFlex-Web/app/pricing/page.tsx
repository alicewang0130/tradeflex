//
//  app/pricing/page.tsx
//  TradeFlex - Pricing Page (Bilingual)
//

'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Crown, Sparkles, BarChart3, Bell, Palette, Shield, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const [lang, setLang] = useState<'en' | 'cn' | 'ja' | 'ko' | 'es' | 'fr'>('en');

  useEffect(() => {
    const saved = localStorage.getItem('tradeflex-lang') as 'en' | 'cn' | 'ja' | 'ko' | 'es' | 'fr' | null;
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
    ja: {
      pricing: '料金プラン',
      heroTitle1: '',
      heroTitle2: 'Pro',
      heroDesc: 'プレミアム機能をアンロックして、コミュニティで目立とう。トレードをレベルアップしよう。',
      monthly: '月額',
      yearly: '年額',
      save: `${savings}%お得`,
      free: 'フリー',
      freeDesc: '基本機能で始めよう',
      forever: '/永久',
      month: '/月',
      billedYearly: `年額 $${yearlyPrice}/年`,
      getStarted: '始める',
      upgradeToPro: 'Pro にアップグレード ✨',
      mostPopular: '一番人気',
      proDesc: 'トレードを制覇するための全機能',
      everythingInFree: 'フリープランの全機能に加えて：',
      freeFeatures: [
        'Oracle 投票',
        'コミュニティの閲覧＆投稿',
        'ベーシック・トレードカード（透かし付き）',
        'リーダーボード閲覧',
        'パーソナルプロフィール',
        'トレーダーをフォロー',
      ],
      proFeatures: [
        'プレミアム・トレードカードテンプレート（透かしなし）',
        'カスタム・カード背景',
        '高度なトレード分析 & 損益チャート',
        'トレードカレンダー・ヒートマップ',
        'プロフィールに Pro バッジ ✨',
        '月3回の投稿ピン留め',
        'リアルタイム株価アラート',
        'Oracle 履歴 & 的中率',
        'カスタムアバター（写真アップロード）',
        'プロフィールテーマのカスタマイズ',
        '優先サポート',
      ],
      faqTitle: 'よくある質問',
      faqs: [
        { q: 'いつでもキャンセルできますか？', a: 'はい！ワンクリックでキャンセルできます。請求期間の終わりまで Pro アクセスは継続します。' },
        { q: '無料トライアルはありますか？', a: '無料トライアルはありませんが、フリープランは十分に使えます。Pro はさらに良い体験を提供します。' },
        { q: 'どの支払い方法に対応していますか？', a: 'Visa、Mastercard、American Express、Apple Pay、Google Pay（Stripe 経由）に対応しています。' },
        { q: '月額と年額を切り替えられますか？', a: 'はい！アカウント設定からいつでも切り替えられます。差額は日割り計算されます。' },
        { q: 'これは投資アドバイスですか？', a: '絶対に違います。TradeFlex はトレードや意見を共有するソーシャルプラットフォームです。必ずご自身で調査してください。🎰' },
      ],
      bottomCta: 'すでに 10,000人以上 のトレーダーが TradeFlex を利用中',
    },
    ko: {
      pricing: '가격',
      heroTitle1: '',
      heroTitle2: 'Pro',
      heroDesc: '프리미엄 기능을 잠금 해제하고, 커뮤니티에서 돋보이세요. 트레이딩 레벨 업!',
      monthly: '월간',
      yearly: '연간',
      save: `${savings}% 절약`,
      free: '무료',
      freeDesc: '기본 기능으로 시작하기',
      forever: '/영구',
      month: '/월',
      billedYearly: `연간 $${yearlyPrice}/년`,
      getStarted: '시작하기',
      upgradeToPro: 'Pro로 업그레이드 ✨',
      mostPopular: '가장 인기',
      proDesc: '트레이딩을 지배하는 데 필요한 모든 것',
      everythingInFree: '무료 플랜의 모든 기능 + 추가:',
      freeFeatures: [
        'Oracle 투표',
        '커뮤니티 탐색 & 게시',
        '기본 트레이드 카드 (워터마크 있음)',
        '리더보드 보기',
        '개인 프로필',
        '트레이더 팔로우',
      ],
      proFeatures: [
        '프리미엄 트레이드 카드 템플릿 (워터마크 없음)',
        '카드 배경 커스터마이징',
        '고급 트레이딩 분석 & 손익 차트',
        '트레이딩 캘린더 히트맵',
        '프로필 Pro 뱃지 ✨',
        '월 3회 게시물 고정',
        '실시간 주가 알림',
        'Oracle 기록 & 적중률 통계',
        '커스텀 아바타 (사진 업로드)',
        '프로필 테마 커스터마이징',
        '우선 지원',
      ],
      faqTitle: '자주 묻는 질문',
      faqs: [
        { q: '언제든 취소할 수 있나요?', a: '네! 클릭 한 번으로 취소 가능합니다. 결제 기간이 끝날 때까지 Pro 이용이 유지됩니다.' },
        { q: '무료 체험이 있나요?', a: '무료 체험은 없지만, 무료 플랜도 충분히 사용 가능합니다. Pro는 더 좋은 경험을 제공합니다.' },
        { q: '어떤 결제 수단을 지원하나요?', a: 'Visa, Mastercard, American Express, Apple Pay, Google Pay (Stripe 경유) 지원.' },
        { q: '월간과 연간 요금제를 전환할 수 있나요?', a: '네! 계정 설정에서 언제든 전환 가능하며, 차액은 일할 계산됩니다.' },
        { q: '이것은 투자 조언인가요?', a: '절대 아닙니다. TradeFlex는 트레이딩과 의견을 공유하는 소셜 플랫폼입니다. 반드시 본인의 판단으로 투자하세요. 🎰' },
      ],
      bottomCta: '이미 10,000명 이상의 트레이더가 TradeFlex를 사용 중',
    },
    es: {
      pricing: 'Precios',
      heroTitle1: 'Tradea como un ',
      heroTitle2: 'Pro',
      heroDesc: 'Desbloquea funciones premium, destaca en la comunidad y lleva tu trading al siguiente nivel.',
      monthly: 'Mensual',
      yearly: 'Anual',
      save: `Ahorra ${savings}%`,
      free: 'Gratis',
      freeDesc: 'Empieza con lo básico',
      forever: '/para siempre',
      month: '/mes',
      billedYearly: `Cobro anual $${yearlyPrice}/año`,
      getStarted: 'Empezar',
      upgradeToPro: 'Upgrade a Pro ✨',
      mostPopular: 'MÁS POPULAR',
      proDesc: 'Todo lo que necesitas para dominar',
      everythingInFree: 'Todo lo del plan Gratis, más:',
      freeFeatures: [
        'Votación Oracle',
        'Navegar y postear en la comunidad',
        'Trade card básica (con marca de agua)',
        'Ver leaderboard',
        'Perfil personal',
        'Seguir traders',
      ],
      proFeatures: [
        'Plantillas premium de trade cards (sin marca de agua)',
        'Fondos personalizados para cards',
        'Análisis avanzado de trading y gráficos de PnL',
        'Calendario de trading con heatmap',
        'Badge Pro en tu perfil ✨',
        'Fijar 3 posts al mes',
        'Alertas de precio en tiempo real',
        'Historial de Oracle y estadísticas de acierto',
        'Avatar personalizado (subir foto)',
        'Personalización del tema del perfil',
        'Soporte prioritario',
      ],
      faqTitle: 'Preguntas Frecuentes',
      faqs: [
        { q: '¿Puedo cancelar en cualquier momento?', a: '¡Sí! Cancela con un clic, sin preguntas. Mantienes acceso Pro hasta el final del periodo de facturación.' },
        { q: '¿Hay prueba gratuita?', a: 'No ofrecemos prueba gratuita, pero el plan gratis es completamente funcional. Pro solo lo hace mejor.' },
        { q: '¿Qué métodos de pago aceptan?', a: 'Visa, Mastercard, American Express, Apple Pay y Google Pay vía Stripe.' },
        { q: '¿Puedo cambiar entre mensual y anual?', a: '¡Sí! Cambia cuando quieras desde la configuración de tu cuenta. Prorrateamos la diferencia.' },
        { q: '¿Esto es asesoría financiera?', a: 'Para nada. TradeFlex es una plataforma social para compartir trades y opiniones. Siempre haz tu propia investigación. 🎰' },
      ],
      bottomCta: 'Únete a más de 10,000 traders que ya usan TradeFlex',
    },
    fr: {
      pricing: 'Tarifs',
      heroTitle1: 'Trade comme un ',
      heroTitle2: 'Pro',
      heroDesc: 'Débloque les fonctionnalités premium, démarque-toi dans la communauté et passe au niveau supérieur.',
      monthly: 'Mensuel',
      yearly: 'Annuel',
      save: `Économise ${savings}%`,
      free: 'Gratuit',
      freeDesc: 'Commence avec les bases',
      forever: '/pour toujours',
      month: '/mois',
      billedYearly: `Facturé $${yearlyPrice}/an`,
      getStarted: 'Commencer',
      upgradeToPro: 'Passer à Pro ✨',
      mostPopular: 'LE PLUS POPULAIRE',
      proDesc: 'Tout ce qu\'il faut pour dominer',
      everythingInFree: 'Tout le plan Gratuit, en plus :',
      freeFeatures: [
        'Vote Oracle',
        'Navigation et publication dans la communauté',
        'Trade card basique (avec filigrane)',
        'Voir le classement',
        'Profil personnel',
        'Suivre des traders',
      ],
      proFeatures: [
        'Templates premium de trade cards (sans filigrane)',
        'Fonds de card personnalisés',
        'Analyse de trading avancée & graphiques PnL',
        'Calendrier de trading heatmap',
        'Badge Pro sur le profil ✨',
        'Épingler 3 posts par mois',
        'Alertes de prix en temps réel',
        'Historique Oracle & stats de précision',
        'Avatar personnalisé (upload photo)',
        'Personnalisation du thème du profil',
        'Support prioritaire',
      ],
      faqTitle: 'Questions Fréquentes',
      faqs: [
        { q: 'Je peux annuler à tout moment ?', a: 'Oui ! Annulation en un clic, sans questions. Tu gardes l\'accès Pro jusqu\'à la fin de ta période de facturation.' },
        { q: 'Y a-t-il un essai gratuit ?', a: 'Pas d\'essai gratuit, mais le plan gratuit est entièrement fonctionnel. Pro rend juste l\'expérience encore meilleure.' },
        { q: 'Quels moyens de paiement acceptez-vous ?', a: 'Visa, Mastercard, American Express, Apple Pay et Google Pay via Stripe.' },
        { q: 'Je peux passer du mensuel à l\'annuel ?', a: 'Oui ! Change quand tu veux depuis les paramètres de ton compte. On calcule le prorata.' },
        { q: 'C\'est un conseil financier ?', a: 'Absolument pas. TradeFlex est une plateforme sociale pour partager des trades et des opinions. Fais toujours tes propres recherches. 🎰' },
      ],
      bottomCta: 'Rejoins plus de 10 000 traders qui utilisent déjà TradeFlex',
    },
  };
  const text = t[lang];

  const proIcons = [Palette, Palette, BarChart3, BarChart3, Crown, Sparkles, Bell, BarChart3, Palette, Palette, Shield];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#111]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 hover:opacity-80 transition">
            <Rocket className="w-5 h-5 text-green-500 -rotate-45" />
            <span className="font-black text-sm bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent hidden sm:inline">TRADEFLEX</span>
          </Link>
          <span className="text-zinc-700">|</span>
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
            {text.heroTitle1}<span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">{text.heroTitle2}</span>{lang === 'cn' ? ' 一样交易' : lang === 'ja' ? ' のようにトレードしよう' : lang === 'ko' ? ' 처럼 트레이딩하자' : ''}
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
