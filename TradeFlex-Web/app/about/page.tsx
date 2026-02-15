'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Rocket, Users, Target, Zap, Globe, Shield } from 'lucide-react';

export default function AboutPage() {
  const [lang, setLang] = useState<'en' | 'cn' | 'ja' | 'ko' | 'es' | 'fr'>('en');

  useEffect(() => {
    const saved = localStorage.getItem('tradeflex-lang') as typeof lang;
    if (saved) setLang(saved);
  }, []);

  const t = {
    en: {
      title: "About TradeFlex",
      subtitle: "Built by traders, for traders.",
      missionTitle: "Our Mission",
      mission: "TradeFlex was born from a simple idea: every trader deserves a platform to showcase their wins, learn from their losses, and connect with a community that gets it. We're not just another trading app — we're the social layer for the trading world.",
      storyTitle: "Our Story",
      story: "Started in 2026, TradeFlex grew out of the frustration of screenshotting P&L screens and posting them to Reddit. We thought: what if there was a beautiful, verified way to share your trades? What if you could predict the market with your community? What if trading could be... fun?",
      story2: "That's TradeFlex. A place where gains are celebrated, losses are respected, and every trader has a voice.",
      whatWeDoTitle: "What We Do",
      features: [
        { icon: "📊", title: "Trade Cards", desc: "Generate stunning, verified trade cards that show the world what you've got." },
        { icon: "🔮", title: "Daily Oracle", desc: "Predict the market every day before open. Track your accuracy. Build your reputation." },
        { icon: "🏆", title: "Leaderboard", desc: "The best traders rise to the top. Compete for the Hall of Fame." },
        { icon: "💬", title: "Community", desc: "Discuss plays, share DD, and connect with traders who speak your language." },
        { icon: "🌍", title: "Global", desc: "Available in 6 languages. Traders from around the world, one platform." },
        { icon: "🔒", title: "Verified", desc: "Every trade card is verified by TradeFlex. No fake screenshots. No cap." },
      ],
      teamTitle: "The Team",
      team: "We're a small, passionate team of traders and engineers who believe the best products come from people who actually use them. We trade. We build. We iterate.",
      contactTitle: "Get in Touch",
      contact: "Have questions, feedback, or want to partner with us?",
      contactEmail: "support@tradeflex.app",
      back: "Back to Home",
    },
    cn: {
      title: "关于 TradeFlex",
      subtitle: "交易员为交易员打造。",
      missionTitle: "我们的使命",
      mission: "TradeFlex 源于一个简单的想法：每个交易员都应该有一个展示战绩、总结教训、与志同道合的社区交流的平台。我们不仅仅是另一个交易应用 — 我们是交易世界的社交层。",
      storyTitle: "我们的故事",
      story: "TradeFlex 诞生于 2026 年，起因是我们厌倦了截图交易记录然后贴到 Reddit 的繁琐流程。我们想：如果有一种漂亮的、可验证的方式来分享交易呢？如果能和社区一起预测市场呢？如果交易可以很……有趣呢？",
      story2: "这就是 TradeFlex。一个庆祝盈利、尊重亏损、让每个交易员都有发言权的地方。",
      whatWeDoTitle: "我们做什么",
      features: [
        { icon: "📊", title: "交易卡片", desc: "生成精美的、经过验证的交易卡片，向世界展示你的实力。" },
        { icon: "🔮", title: "每日预言", desc: "每天开盘前预测市场走向。追踪准确率。建立声誉。" },
        { icon: "🏆", title: "排行榜", desc: "最强交易员脱颖而出。竞争荣誉殿堂。" },
        { icon: "💬", title: "社区", desc: "讨论交易策略，分享研究分析，与同语言的交易员交流。" },
        { icon: "🌍", title: "全球化", desc: "支持 6 种语言。全球交易员，一个平台。" },
        { icon: "🔒", title: "已验证", desc: "每张交易卡片经 TradeFlex 验证。没有假截图。" },
      ],
      teamTitle: "团队",
      team: "我们是一支由交易员和工程师组成的小而精的团队，坚信最好的产品来自真正使用它们的人。我们交易。我们开发。我们迭代。",
      contactTitle: "联系我们",
      contact: "有问题、反馈或合作意向？",
      contactEmail: "support@tradeflex.app",
      back: "返回首页",
    },
    ja: {
      title: "TradeFlex について",
      subtitle: "トレーダーによる、トレーダーのためのプラットフォーム。",
      missionTitle: "ミッション",
      mission: "TradeFlex はシンプルなアイデアから生まれました。すべてのトレーダーが勝利を披露し、損失から学び、共感できるコミュニティとつながる場所を持つべきです。",
      storyTitle: "ストーリー",
      story: "2026年、TradeFlex はRedditにP&Lのスクリーンショットを投稿する煩わしさから生まれました。美しく、検証された方法でトレードを共有できたら？コミュニティで市場を予測できたら？",
      story2: "それがTradeFlex。利益を祝い、損失を尊重し、すべてのトレーダーに声を与える場所。",
      whatWeDoTitle: "サービス内容",
      features: [
        { icon: "📊", title: "トレードカード", desc: "検証済みの美しいトレードカードを生成。" },
        { icon: "🔮", title: "デイリーオラクル", desc: "毎日開場前に市場を予測。精度を追跡。" },
        { icon: "🏆", title: "ランキング", desc: "最高のトレーダーがトップに。殿堂入りを目指せ。" },
        { icon: "💬", title: "コミュニティ", desc: "戦略を議論し、分析を共有。" },
        { icon: "🌍", title: "グローバル", desc: "6言語対応。世界中のトレーダーが集結。" },
        { icon: "🔒", title: "検証済み", desc: "すべてのカードはTradeFlex認証済み。" },
      ],
      teamTitle: "チーム",
      team: "私たちは実際に取引するトレーダーとエンジニアの少数精鋭チームです。",
      contactTitle: "お問い合わせ",
      contact: "ご質問、フィードバック、パートナーシップのご相談は？",
      contactEmail: "support@tradeflex.app",
      back: "ホームに戻る",
    },
    ko: {
      title: "TradeFlex 소개",
      subtitle: "트레이더가 만든, 트레이더를 위한 플랫폼.",
      missionTitle: "미션",
      mission: "TradeFlex는 간단한 아이디어에서 시작했습니다. 모든 트레이더가 성과를 보여주고, 손실에서 배우고, 공감하는 커뮤니티와 연결될 자격이 있습니다.",
      storyTitle: "스토리",
      story: "2026년, TradeFlex는 P&L 스크린샷을 Reddit에 올리는 번거로움에서 탄생했습니다. 아름답고 검증된 방식으로 거래를 공유할 수 있다면? 커뮤니티와 함께 시장을 예측할 수 있다면?",
      story2: "그것이 TradeFlex입니다. 수익을 축하하고, 손실을 존중하며, 모든 트레이더에게 목소리를 주는 곳.",
      whatWeDoTitle: "서비스",
      features: [
        { icon: "📊", title: "트레이드 카드", desc: "검증된 아름다운 트레이드 카드를 생성하세요." },
        { icon: "🔮", title: "데일리 오라클", desc: "매일 개장 전 시장을 예측. 정확도를 추적." },
        { icon: "🏆", title: "순위", desc: "최고의 트레이더가 정상에. 명예의 전당을 노려보세요." },
        { icon: "💬", title: "커뮤니티", desc: "전략을 토론하고 분석을 공유." },
        { icon: "🌍", title: "글로벌", desc: "6개 언어 지원. 전 세계 트레이더가 한곳에." },
        { icon: "🔒", title: "인증", desc: "모든 카드는 TradeFlex 인증 완료." },
      ],
      teamTitle: "팀",
      team: "실제로 거래하는 트레이더와 엔지니어로 구성된 소규모 팀입니다.",
      contactTitle: "문의",
      contact: "질문, 피드백 또는 파트너십 제안이 있으신가요?",
      contactEmail: "support@tradeflex.app",
      back: "홈으로 돌아가기",
    },
    es: {
      title: "Sobre TradeFlex",
      subtitle: "Hecho por traders, para traders.",
      missionTitle: "Nuestra Misión",
      mission: "TradeFlex nació de una idea simple: cada trader merece una plataforma para mostrar sus victorias, aprender de sus pérdidas y conectar con una comunidad que lo entiende.",
      storyTitle: "Nuestra Historia",
      story: "Fundado en 2026, TradeFlex surgió de la frustración de hacer capturas de pantalla de P&L y publicarlas en Reddit. Pensamos: ¿y si hubiera una forma bonita y verificada de compartir tus trades?",
      story2: "Eso es TradeFlex. Un lugar donde las ganancias se celebran, las pérdidas se respetan y cada trader tiene voz.",
      whatWeDoTitle: "Qué Hacemos",
      features: [
        { icon: "📊", title: "Tarjetas de Trading", desc: "Genera tarjetas de trading verificadas y espectaculares." },
        { icon: "🔮", title: "Oráculo Diario", desc: "Predice el mercado cada día antes de la apertura." },
        { icon: "🏆", title: "Ranking", desc: "Los mejores traders suben al top. Compite por el Salón de la Fama." },
        { icon: "💬", title: "Comunidad", desc: "Discute jugadas, comparte análisis y conecta con traders." },
        { icon: "🌍", title: "Global", desc: "Disponible en 6 idiomas. Traders de todo el mundo." },
        { icon: "🔒", title: "Verificado", desc: "Cada tarjeta es verificada por TradeFlex." },
      ],
      teamTitle: "El Equipo",
      team: "Somos un equipo pequeño y apasionado de traders e ingenieros que creen que los mejores productos vienen de quienes realmente los usan.",
      contactTitle: "Contacto",
      contact: "¿Preguntas, comentarios o quieres asociarte con nosotros?",
      contactEmail: "support@tradeflex.app",
      back: "Volver al inicio",
    },
    fr: {
      title: "À propos de TradeFlex",
      subtitle: "Fait par des traders, pour des traders.",
      missionTitle: "Notre Mission",
      mission: "TradeFlex est né d'une idée simple : chaque trader mérite une plateforme pour montrer ses victoires, apprendre de ses pertes et rejoindre une communauté qui comprend.",
      storyTitle: "Notre Histoire",
      story: "Fondé en 2026, TradeFlex est né de la frustration de capturer des écrans P&L et de les poster sur Reddit. On s'est dit : et s'il y avait un moyen beau et vérifié de partager ses trades ?",
      story2: "C'est TradeFlex. Un endroit où les gains sont célébrés, les pertes respectées et chaque trader a sa voix.",
      whatWeDoTitle: "Ce Que Nous Faisons",
      features: [
        { icon: "📊", title: "Cartes de Trading", desc: "Génère des cartes de trading vérifiées et magnifiques." },
        { icon: "🔮", title: "Oracle Quotidien", desc: "Prédis le marché chaque jour avant l'ouverture." },
        { icon: "🏆", title: "Classement", desc: "Les meilleurs traders montent au sommet. Vise le Panthéon." },
        { icon: "💬", title: "Communauté", desc: "Discute des stratégies, partage tes analyses." },
        { icon: "🌍", title: "Global", desc: "Disponible en 6 langues. Des traders du monde entier." },
        { icon: "🔒", title: "Vérifié", desc: "Chaque carte est vérifiée par TradeFlex." },
      ],
      teamTitle: "L'Équipe",
      team: "Nous sommes une petite équipe passionnée de traders et d'ingénieurs qui croient que les meilleurs produits viennent de ceux qui les utilisent vraiment.",
      contactTitle: "Contact",
      contact: "Des questions, commentaires ou envie de collaborer ?",
      contactEmail: "support@tradeflex.app",
      back: "Retour à l'accueil",
    },
  };

  const text = t[lang];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#111]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 hover:opacity-80 transition">
            <Rocket className="w-5 h-5 text-green-500 -rotate-45" />
            <span className="font-black text-sm bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent hidden sm:inline">TRADEFLEX</span>
          </Link>
          <span className="text-zinc-700">|</span>
          <h1 className="font-bold text-lg">{text.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            {text.title}
          </h1>
          <p className="text-xl text-zinc-400">{text.subtitle}</p>
        </div>

        {/* Mission */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-green-500" /> {text.missionTitle}
          </h2>
          <p className="text-zinc-400 leading-relaxed text-lg">{text.mission}</p>
        </div>

        {/* Story */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" /> {text.storyTitle}
          </h2>
          <p className="text-zinc-400 leading-relaxed mb-4">{text.story}</p>
          <p className="text-zinc-400 leading-relaxed">{text.story2}</p>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-500" /> {text.whatWeDoTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {text.features.map((f, i) => (
              <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-green-500/30 transition">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="font-bold mb-1">{f.title}</h3>
                <p className="text-sm text-zinc-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-500" /> {text.teamTitle}
          </h2>
          <p className="text-zinc-400 leading-relaxed">{text.team}</p>
        </div>

        {/* Contact */}
        <div className="mb-12 bg-[#111] border border-white/10 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3 flex items-center justify-center gap-2">
            <Shield className="w-6 h-6 text-green-500" /> {text.contactTitle}
          </h2>
          <p className="text-zinc-400 mb-4">{text.contact}</p>
          <a href={`mailto:${text.contactEmail}`} className="inline-block bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition">
            ✉️ {text.contactEmail}
          </a>
        </div>
      </div>
    </div>
  );
}
