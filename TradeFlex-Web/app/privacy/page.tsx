'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Rocket } from 'lucide-react';

export default function PrivacyPage() {
  const [lang, setLang] = useState<'en' | 'cn' | 'ja' | 'ko' | 'es' | 'fr'>('en');

  useEffect(() => {
    const saved = localStorage.getItem('tradeflex-lang') as typeof lang;
    if (saved) setLang(saved);
  }, []);

  const t = {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: February 15, 2026",
      sections: [
        { heading: "1. Information We Collect", content: "We collect information you provide directly: email address, display name, profile picture, and trade data you submit. We also automatically collect usage data such as device type, browser, IP address, and pages visited." },
        { heading: "2. How We Use Your Information", content: "We use your information to: provide and maintain TradeFlex; generate trade cards and leaderboard rankings; display Oracle voting results; send important account notifications; improve our services and user experience." },
        { heading: "3. Information Sharing", content: "We do not sell your personal information. Trade cards you generate are public by default. Your email and account details are never shared with third parties except as required by law or with your explicit consent." },
        { heading: "4. Data Storage & Security", content: "Your data is stored securely via Supabase with encryption at rest and in transit. We use industry-standard security measures including SSL/TLS, secure authentication tokens, and Row Level Security policies." },
        { heading: "5. Cookies & Local Storage", content: "We use localStorage to save your language preference and session state. We use cookies for authentication. We do not use third-party tracking cookies." },
        { heading: "6. Your Rights", content: "You can: access, update, or delete your account data at any time; export your trade history; opt out of marketing emails; request a complete data deletion by contacting support." },
        { heading: "7. Third-Party Services", content: "We use the following third-party services: Supabase (authentication & database), Google OAuth (sign-in), and optional payment processors (Stripe/PayPal) for Pro subscriptions." },
        { heading: "8. Children's Privacy", content: "TradeFlex is not intended for users under 18. We do not knowingly collect information from minors. If you believe a minor has provided us data, please contact us immediately." },
        { heading: "9. Changes to This Policy", content: "We may update this privacy policy from time to time. We will notify users of significant changes via email or in-app notification. Continued use of TradeFlex after changes constitutes acceptance." },
        { heading: "10. Contact", content: "For privacy-related questions or data requests, contact us at: support@tradeflex.app" },
      ],
    },
    cn: {
      title: "隐私政策",
      lastUpdated: "最后更新：2026年2月15日",
      sections: [
        { heading: "1. 我们收集的信息", content: "我们收集您直接提供的信息：电子邮件地址、显示名称、头像和您提交的交易数据。我们还会自动收集使用数据，如设备类型、浏览器、IP 地址和访问的页面。" },
        { heading: "2. 信息用途", content: "我们使用您的信息来：提供和维护 TradeFlex；生成交易卡片和排行榜排名；显示 Oracle 投票结果；发送重要的账户通知；改善我们的服务和用户体验。" },
        { heading: "3. 信息共享", content: "我们不会出售您的个人信息。您生成的交易卡片默认是公开的。除法律要求或经您明确同意外，您的电子邮件和账户详情不会与第三方共享。" },
        { heading: "4. 数据存储与安全", content: "您的数据通过 Supabase 安全存储，静态和传输中均加密。我们采用行业标准安全措施，包括 SSL/TLS、安全认证令牌和行级安全策略。" },
        { heading: "5. Cookie 和本地存储", content: "我们使用 localStorage 保存您的语言偏好和会话状态。我们使用 cookie 进行身份验证。我们不使用第三方跟踪 cookie。" },
        { heading: "6. 您的权利", content: "您可以：随时访问、更新或删除您的账户数据；导出交易记录；退订营销邮件；联系客服请求完全删除数据。" },
        { heading: "7. 第三方服务", content: "我们使用以下第三方服务：Supabase（认证和数据库）、Google OAuth（登录）以及可选的支付处理器（Stripe/PayPal）用于 Pro 订阅。" },
        { heading: "8. 儿童隐私", content: "TradeFlex 不面向 18 岁以下用户。我们不会故意收集未成年人的信息。如果您认为未成年人向我们提供了数据，请立即联系我们。" },
        { heading: "9. 政策变更", content: "我们可能会不时更新本隐私政策。我们将通过电子邮件或应用内通知告知用户重大变更。变更后继续使用 TradeFlex 即表示接受。" },
        { heading: "10. 联系方式", content: "如有隐私相关问题或数据请求，请联系：support@tradeflex.app" },
      ],
    },
    ja: {
      title: "プライバシーポリシー",
      lastUpdated: "最終更新：2026年2月15日",
      sections: [
        { heading: "1. 収集する情報", content: "メールアドレス、表示名、プロフィール画像、取引データなど、お客様が直接提供する情報を収集します。また、デバイスタイプ、ブラウザ、IPアドレス、閲覧ページなどの使用データも自動的に収集します。" },
        { heading: "2. 情報の利用目的", content: "TradeFlex の提供・維持、トレードカードとランキングの生成、Oracle 投票結果の表示、アカウント通知の送信、サービスの改善に使用します。" },
        { heading: "3. 情報の共有", content: "個人情報を販売することはありません。生成されたトレードカードはデフォルトで公開されます。法的要求またはお客様の明示的な同意がない限り、メールやアカウント詳細を第三者と共有しません。" },
        { heading: "4. データの保存とセキュリティ", content: "データは Supabase を通じて安全に保存され、保存時および転送時に暗号化されています。SSL/TLS、セキュアな認証トークン、行レベルセキュリティポリシーを含む業界標準のセキュリティ対策を使用しています。" },
        { heading: "5. Cookie とローカルストレージ", content: "言語設定とセッション状態の保存に localStorage を使用しています。認証に Cookie を使用しています。サードパーティのトラッキング Cookie は使用しません。" },
        { heading: "6. お客様の権利", content: "アカウントデータのアクセス・更新・削除、取引履歴のエクスポート、マーケティングメールの配信停止、サポートへの完全なデータ削除の要求が可能です。" },
        { heading: "7. サードパーティサービス", content: "Supabase（認証・データベース）、Google OAuth（サインイン）、オプションの決済プロセッサ（Stripe/PayPal）を使用しています。" },
        { heading: "8. 未成年者のプライバシー", content: "TradeFlex は18歳未満のユーザーを対象としていません。未成年者の情報を故意に収集することはありません。" },
        { heading: "9. ポリシーの変更", content: "本ポリシーを随時更新する場合があります。重要な変更はメールまたはアプリ内通知でお知らせします。" },
        { heading: "10. お問い合わせ", content: "プライバシーに関するご質問やデータリクエストは support@tradeflex.app までご連絡ください。" },
      ],
    },
    ko: {
      title: "개인정보 처리방침",
      lastUpdated: "최종 업데이트: 2026년 2월 15일",
      sections: [
        { heading: "1. 수집하는 정보", content: "이메일 주소, 표시 이름, 프로필 사진, 제출하신 거래 데이터 등 직접 제공하시는 정보를 수집합니다. 또한 기기 유형, 브라우저, IP 주소, 방문 페이지 등의 사용 데이터를 자동으로 수집합니다." },
        { heading: "2. 정보 이용 목적", content: "TradeFlex 제공 및 유지, 트레이드 카드 및 순위 생성, Oracle 투표 결과 표시, 계정 알림 전송, 서비스 개선에 사용합니다." },
        { heading: "3. 정보 공유", content: "개인 정보를 판매하지 않습니다. 생성하신 트레이드 카드는 기본적으로 공개됩니다. 법적 요구 또는 명시적 동의 없이 이메일이나 계정 정보를 제3자와 공유하지 않습니다." },
        { heading: "4. 데이터 저장 및 보안", content: "데이터는 Supabase를 통해 안전하게 저장되며, 저장 시 및 전송 시 암호화됩니다. SSL/TLS, 보안 인증 토큰, 행 수준 보안 정책 등 업계 표준 보안 조치를 사용합니다." },
        { heading: "5. 쿠키 및 로컬 스토리지", content: "언어 설정과 세션 상태 저장에 localStorage를 사용합니다. 인증에 쿠키를 사용합니다. 제3자 추적 쿠키는 사용하지 않습니다." },
        { heading: "6. 사용자 권리", content: "계정 데이터 접근·수정·삭제, 거래 내역 내보내기, 마케팅 이메일 수신 거부, 지원팀에 완전한 데이터 삭제 요청이 가능합니다." },
        { heading: "7. 제3자 서비스", content: "Supabase(인증 및 데이터베이스), Google OAuth(로그인), 선택적 결제 프로세서(Stripe/PayPal)를 사용합니다." },
        { heading: "8. 아동 개인정보", content: "TradeFlex는 18세 미만 사용자를 대상으로 하지 않습니다. 미성년자의 정보를 의도적으로 수집하지 않습니다." },
        { heading: "9. 방침 변경", content: "본 방침을 수시로 업데이트할 수 있습니다. 중요한 변경 사항은 이메일 또는 앱 내 알림으로 안내합니다." },
        { heading: "10. 문의", content: "개인정보 관련 질문이나 데이터 요청은 support@tradeflex.app으로 연락해 주세요." },
      ],
    },
    es: {
      title: "Política de Privacidad",
      lastUpdated: "Última actualización: 15 de febrero de 2026",
      sections: [
        { heading: "1. Información que Recopilamos", content: "Recopilamos la información que proporcionas directamente: correo electrónico, nombre, foto de perfil y datos de operaciones. También recopilamos automáticamente datos de uso como tipo de dispositivo, navegador, dirección IP y páginas visitadas." },
        { heading: "2. Uso de la Información", content: "Utilizamos tu información para: proveer y mantener TradeFlex; generar tarjetas de trading y clasificaciones; mostrar resultados del Oráculo; enviar notificaciones importantes; mejorar nuestros servicios." },
        { heading: "3. Compartir Información", content: "No vendemos tu información personal. Las tarjetas de trading son públicas por defecto. Tu correo y datos de cuenta nunca se comparten con terceros excepto por requerimiento legal o con tu consentimiento explícito." },
        { heading: "4. Almacenamiento y Seguridad", content: "Tus datos se almacenan de forma segura a través de Supabase con cifrado en reposo y en tránsito. Utilizamos medidas de seguridad estándar de la industria incluyendo SSL/TLS." },
        { heading: "5. Cookies y Almacenamiento Local", content: "Usamos localStorage para guardar tu preferencia de idioma y estado de sesión. Usamos cookies para autenticación. No usamos cookies de rastreo de terceros." },
        { heading: "6. Tus Derechos", content: "Puedes: acceder, actualizar o eliminar tus datos en cualquier momento; exportar tu historial; cancelar suscripción a emails; solicitar eliminación completa de datos." },
        { heading: "7. Servicios de Terceros", content: "Utilizamos: Supabase (autenticación y base de datos), Google OAuth (inicio de sesión), y procesadores de pago opcionales (Stripe/PayPal)." },
        { heading: "8. Privacidad Infantil", content: "TradeFlex no está dirigido a menores de 18 años. No recopilamos intencionalmente información de menores." },
        { heading: "9. Cambios en esta Política", content: "Podemos actualizar esta política periódicamente. Notificaremos cambios significativos por correo o notificación en la app." },
        { heading: "10. Contacto", content: "Para consultas de privacidad o solicitudes de datos: support@tradeflex.app" },
      ],
    },
    fr: {
      title: "Politique de Confidentialité",
      lastUpdated: "Dernière mise à jour : 15 février 2026",
      sections: [
        { heading: "1. Informations Collectées", content: "Nous collectons les informations que vous fournissez : adresse e-mail, nom d'affichage, photo de profil et données de trading. Nous collectons aussi automatiquement des données d'utilisation comme le type d'appareil, le navigateur, l'adresse IP et les pages visitées." },
        { heading: "2. Utilisation des Informations", content: "Nous utilisons vos informations pour : fournir et maintenir TradeFlex ; générer des cartes de trading et des classements ; afficher les résultats de l'Oracle ; envoyer des notifications importantes ; améliorer nos services." },
        { heading: "3. Partage des Informations", content: "Nous ne vendons pas vos informations personnelles. Les cartes de trading sont publiques par défaut. Vos e-mails et détails de compte ne sont jamais partagés avec des tiers sauf obligation légale ou consentement explicite." },
        { heading: "4. Stockage et Sécurité", content: "Vos données sont stockées de manière sécurisée via Supabase avec chiffrement au repos et en transit. Nous utilisons des mesures de sécurité standard incluant SSL/TLS." },
        { heading: "5. Cookies et Stockage Local", content: "Nous utilisons localStorage pour sauvegarder vos préférences de langue et l'état de session. Nous utilisons des cookies pour l'authentification. Pas de cookies de suivi tiers." },
        { heading: "6. Vos Droits", content: "Vous pouvez : accéder, mettre à jour ou supprimer vos données à tout moment ; exporter votre historique ; vous désabonner des e-mails marketing ; demander la suppression complète de vos données." },
        { heading: "7. Services Tiers", content: "Nous utilisons : Supabase (authentification et base de données), Google OAuth (connexion), et des processeurs de paiement optionnels (Stripe/PayPal)." },
        { heading: "8. Vie Privée des Mineurs", content: "TradeFlex n'est pas destiné aux utilisateurs de moins de 18 ans. Nous ne collectons pas intentionnellement d'informations sur les mineurs." },
        { heading: "9. Modifications de cette Politique", content: "Nous pouvons mettre à jour cette politique. Les changements importants seront notifiés par e-mail ou notification dans l'app." },
        { heading: "10. Contact", content: "Pour toute question sur la confidentialité ou demande de données : support@tradeflex.app" },
      ],
    },
  };

  const text = t[lang];

  return (
    <div className="min-h-screen bg-black text-white">
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

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-black mb-2">{text.title}</h1>
        <p className="text-sm text-zinc-500 mb-10">{text.lastUpdated}</p>

        <div className="space-y-8">
          {text.sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-lg font-bold mb-2 text-white">{s.heading}</h2>
              <p className="text-zinc-400 leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
