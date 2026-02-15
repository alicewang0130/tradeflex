'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Rocket } from 'lucide-react';

export default function TermsPage() {
  const [lang, setLang] = useState<'en' | 'cn' | 'ja' | 'ko' | 'es' | 'fr'>('en');

  useEffect(() => {
    const saved = localStorage.getItem('tradeflex-lang') as typeof lang;
    if (saved) setLang(saved);
  }, []);

  const t = {
    en: {
      title: "Terms of Service",
      lastUpdated: "Last Updated: February 15, 2026",
      sections: [
        { heading: "1. Acceptance of Terms", content: "By accessing or using TradeFlex, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our service." },
        { heading: "2. Description of Service", content: "TradeFlex is a social trading platform that allows users to generate trade cards, participate in daily market predictions (Oracle), compete on leaderboards, and engage with a community of traders. TradeFlex does NOT provide financial advice, investment recommendations, or brokerage services." },
        { heading: "3. User Accounts", content: "You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. You must be at least 18 years old to use TradeFlex. One person, one account — multi-accounting may result in a ban." },
        { heading: "4. User Content", content: "You retain ownership of trade data and content you submit. By posting on TradeFlex, you grant us a non-exclusive, worldwide license to display your content on the platform. You are solely responsible for the accuracy of your trade data. Intentionally posting fake or misleading trades may result in account suspension." },
        { heading: "5. Acceptable Use", content: "You agree NOT to: manipulate leaderboard rankings or Oracle votes; harass, bully, or threaten other users; post spam, illegal content, or financial advice without proper disclaimers; attempt to exploit or hack the platform; impersonate other traders or public figures." },
        { heading: "6. Pro Subscription", content: "TradeFlex Pro is a paid subscription offering premium features. Prices are as listed on our Pricing page ($3.99/month or $29.99/year). Subscriptions auto-renew unless cancelled. Refunds are handled on a case-by-case basis — contact support." },
        { heading: "7. Disclaimers", content: "TradeFlex is NOT a financial advisor, broker, or investment platform. All trade data shown is user-submitted and may not be verified against actual brokerage records. Past performance does not guarantee future results. Oracle predictions are for entertainment only — do NOT make investment decisions based on Oracle results. USE TRADEFLEX AT YOUR OWN RISK." },
        { heading: "8. Limitation of Liability", content: "TradeFlex shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service. We do not guarantee uninterrupted access or that the platform will be error-free." },
        { heading: "9. Termination", content: "We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time. Upon termination, your public trade cards may remain visible but will be anonymized." },
        { heading: "10. Changes to Terms", content: "We may update these terms from time to time. Continued use after changes constitutes acceptance. We will notify users of significant changes via email or in-app notification." },
        { heading: "11. Governing Law", content: "These terms are governed by the laws of the United States. Any disputes shall be resolved in the courts of California." },
        { heading: "12. Contact", content: "Questions about these terms? Contact us at: support@tradeflex.app" },
      ],
    },
    cn: {
      title: "服务条款",
      lastUpdated: "最后更新：2026年2月15日",
      sections: [
        { heading: "1. 条款接受", content: "访问或使用 TradeFlex 即表示您同意受这些服务条款的约束。如果您不同意这些条款，请不要使用我们的服务。" },
        { heading: "2. 服务描述", content: "TradeFlex 是一个社交交易平台，允许用户生成交易卡片、参与每日市场预测（Oracle）、在排行榜上竞争，并与交易社区互动。TradeFlex 不提供财务建议、投资推荐或经纪服务。" },
        { heading: "3. 用户账户", content: "创建账户时必须提供准确信息。您有责任维护账户凭证的安全。您必须年满 18 岁才能使用 TradeFlex。一人一号——多账户可能导致封禁。" },
        { heading: "4. 用户内容", content: "您保留提交的交易数据和内容的所有权。在 TradeFlex 发布内容，即授予我们在平台上展示内容的非排他性、全球性许可。您对交易数据的准确性负全部责任。故意发布虚假或误导性交易可能导致账户暂停。" },
        { heading: "5. 可接受使用", content: "您同意不会：操纵排行榜排名或 Oracle 投票；骚扰、欺凌或威胁其他用户；发布垃圾信息、非法内容或未经适当免责声明的投资建议；试图利用或攻击平台；冒充其他交易员或公众人物。" },
        { heading: "6. Pro 订阅", content: "TradeFlex Pro 是提供高级功能的付费订阅。价格见定价页面（$3.99/月或 $29.99/年）。除非取消，否则订阅自动续费。退款视具体情况处理——请联系客服。" },
        { heading: "7. 免责声明", content: "TradeFlex 不是财务顾问、经纪人或投资平台。所有显示的交易数据均由用户提交，可能未经实际经纪记录验证。过去的表现不保证未来的结果。Oracle 预测仅供娱乐——不要根据 Oracle 结果做投资决策。使用 TradeFlex 风险自负。" },
        { heading: "8. 责任限制", content: "TradeFlex 不对因使用服务而产生的任何间接、附带或后果性损害承担责任。我们不保证持续访问或平台无错误。" },
        { heading: "9. 终止", content: "我们保留暂停或终止违反条款账户的权利。您可以随时删除账户。终止后，您的公开交易卡片可能仍然可见，但将被匿名化。" },
        { heading: "10. 条款变更", content: "我们可能会不时更新这些条款。变更后继续使用即表示接受。重大变更将通过电子邮件或应用内通知告知用户。" },
        { heading: "11. 管辖法律", content: "这些条款受美国法律管辖。任何争议应在加利福尼亚州法院解决。" },
        { heading: "12. 联系方式", content: "对这些条款有疑问？请联系：support@tradeflex.app" },
      ],
    },
    ja: {
      title: "利用規約",
      lastUpdated: "最終更新：2026年2月15日",
      sections: [
        { heading: "1. 規約の同意", content: "TradeFlex にアクセスまたは使用することにより、この利用規約に拘束されることに同意します。" },
        { heading: "2. サービスの説明", content: "TradeFlex はトレードカードの生成、毎日の市場予測（Oracle）への参加、ランキングでの競争、トレーダーコミュニティへの参加を可能にするソーシャルトレーディングプラットフォームです。TradeFlex は投資助言、推奨、仲介サービスを提供しません。" },
        { heading: "3. ユーザーアカウント", content: "アカウント作成時に正確な情報を提供する必要があります。アカウント認証情報のセキュリティ維持はお客様の責任です。18歳以上である必要があります。" },
        { heading: "4. ユーザーコンテンツ", content: "提出したトレードデータとコンテンツの所有権は保持されます。TradeFlex に投稿することで、プラットフォーム上でコンテンツを表示する非独占的なライセンスを付与します。" },
        { heading: "5. 許容される使用", content: "ランキングやOracle投票の操作、他のユーザーへの嫌がらせ、スパムや違法コンテンツの投稿、プラットフォームの悪用、なりすましを行わないことに同意します。" },
        { heading: "6. Pro サブスクリプション", content: "TradeFlex Pro はプレミアム機能を提供する有料サブスクリプションです。価格は料金ページをご覧ください。キャンセルしない限り自動更新されます。" },
        { heading: "7. 免責事項", content: "TradeFlex は投資アドバイザー、ブローカー、投資プラットフォームではありません。表示される取引データはユーザー提出のもので、実際の証券口座記録と照合されていない場合があります。Oracle の予測はエンターテイメント目的のみです。自己責任でご利用ください。" },
        { heading: "8. 責任の制限", content: "TradeFlex はサービスの使用から生じる間接的、付随的、結果的損害について責任を負いません。" },
        { heading: "9. 終了", content: "規約に違反するアカウントの一時停止または終了の権利を留保します。いつでもアカウントを削除できます。" },
        { heading: "10. 規約の変更", content: "これらの規約を随時更新する場合があります。変更後の継続使用は同意を意味します。" },
        { heading: "11. 準拠法", content: "これらの規約は米国法に準拠します。紛争はカリフォルニア州の裁判所で解決されます。" },
        { heading: "12. お問い合わせ", content: "これらの規約についてのご質問は support@tradeflex.app までご連絡ください。" },
      ],
    },
    ko: {
      title: "이용약관",
      lastUpdated: "최종 업데이트: 2026년 2월 15일",
      sections: [
        { heading: "1. 약관 동의", content: "TradeFlex에 접근하거나 사용함으로써 본 이용약관에 동의하는 것으로 간주됩니다." },
        { heading: "2. 서비스 설명", content: "TradeFlex는 트레이드 카드 생성, 일일 시장 예측(Oracle) 참여, 순위 경쟁, 트레이더 커뮤니티 참여가 가능한 소셜 트레이딩 플랫폼입니다. TradeFlex는 투자 조언, 추천 또는 중개 서비스를 제공하지 않습니다." },
        { heading: "3. 사용자 계정", content: "계정 생성 시 정확한 정보를 제공해야 합니다. 계정 보안은 사용자의 책임입니다. 18세 이상이어야 합니다." },
        { heading: "4. 사용자 콘텐츠", content: "제출한 거래 데이터와 콘텐츠의 소유권은 유지됩니다. TradeFlex에 게시함으로써 플랫폼에 콘텐츠를 표시할 비독점적 라이선스를 부여합니다." },
        { heading: "5. 허용되는 사용", content: "순위 조작, Oracle 투표 조작, 다른 사용자 괴롭힘, 스팸이나 불법 콘텐츠 게시, 플랫폼 악용, 사칭을 하지 않을 것에 동의합니다." },
        { heading: "6. Pro 구독", content: "TradeFlex Pro는 프리미엄 기능을 제공하는 유료 구독입니다. 가격은 가격 페이지를 참조하세요. 취소하지 않으면 자동 갱신됩니다." },
        { heading: "7. 면책 조항", content: "TradeFlex는 투자 자문사, 브로커 또는 투자 플랫폼이 아닙니다. 표시된 거래 데이터는 사용자가 제출한 것이며 실제 증권 기록과 검증되지 않았을 수 있습니다. Oracle 예측은 오락 목적으로만 사용됩니다. 자기 책임하에 사용하세요." },
        { heading: "8. 책임 제한", content: "TradeFlex는 서비스 사용으로 인한 간접적, 부수적 또는 결과적 손해에 대해 책임을 지지 않습니다." },
        { heading: "9. 종료", content: "약관을 위반하는 계정을 일시 중지하거나 종료할 권리가 있습니다. 언제든지 계정을 삭제할 수 있습니다." },
        { heading: "10. 약관 변경", content: "이 약관을 수시로 업데이트할 수 있습니다. 변경 후 계속 사용하면 동의한 것으로 간주됩니다." },
        { heading: "11. 준거법", content: "이 약관은 미국 법률의 적용을 받습니다. 분쟁은 캘리포니아주 법원에서 해결됩니다." },
        { heading: "12. 문의", content: "이 약관에 대한 질문은 support@tradeflex.app으로 연락해 주세요." },
      ],
    },
    es: {
      title: "Términos de Servicio",
      lastUpdated: "Última actualización: 15 de febrero de 2026",
      sections: [
        { heading: "1. Aceptación de Términos", content: "Al acceder o usar TradeFlex, aceptas quedar vinculado por estos Términos de Servicio." },
        { heading: "2. Descripción del Servicio", content: "TradeFlex es una plataforma de trading social que permite generar tarjetas de trading, participar en predicciones diarias del mercado (Oráculo), competir en rankings y conectar con una comunidad de traders. TradeFlex NO proporciona asesoramiento financiero ni servicios de corretaje." },
        { heading: "3. Cuentas de Usuario", content: "Debes proporcionar información precisa al crear una cuenta. Eres responsable de mantener la seguridad de tus credenciales. Debes tener al menos 18 años." },
        { heading: "4. Contenido del Usuario", content: "Conservas la propiedad de los datos de trading que envías. Al publicar en TradeFlex, nos otorgas una licencia no exclusiva para mostrar tu contenido en la plataforma." },
        { heading: "5. Uso Aceptable", content: "Te comprometes a NO: manipular rankings o votos del Oráculo; acosar a otros usuarios; publicar spam o contenido ilegal; explotar la plataforma; hacerse pasar por otros traders." },
        { heading: "6. Suscripción Pro", content: "TradeFlex Pro es una suscripción de pago. Los precios están en nuestra página de Precios ($3.99/mes o $29.99/año). Se renueva automáticamente a menos que se cancele." },
        { heading: "7. Descargos", content: "TradeFlex NO es un asesor financiero, broker o plataforma de inversión. Los datos mostrados son enviados por usuarios. Las predicciones del Oráculo son solo para entretenimiento. USA TRADEFLEX BAJO TU PROPIO RIESGO." },
        { heading: "8. Limitación de Responsabilidad", content: "TradeFlex no será responsable por daños indirectos, incidentales o consecuentes derivados del uso del servicio." },
        { heading: "9. Terminación", content: "Nos reservamos el derecho de suspender o terminar cuentas que violen estos términos. Puedes eliminar tu cuenta en cualquier momento." },
        { heading: "10. Cambios en los Términos", content: "Podemos actualizar estos términos periódicamente. El uso continuado después de cambios constituye aceptación." },
        { heading: "11. Ley Aplicable", content: "Estos términos se rigen por las leyes de Estados Unidos. Las disputas se resolverán en los tribunales de California." },
        { heading: "12. Contacto", content: "¿Preguntas sobre estos términos? Contáctanos en: support@tradeflex.app" },
      ],
    },
    fr: {
      title: "Conditions d'Utilisation",
      lastUpdated: "Dernière mise à jour : 15 février 2026",
      sections: [
        { heading: "1. Acceptation des Conditions", content: "En accédant ou en utilisant TradeFlex, vous acceptez d'être lié par ces Conditions d'Utilisation." },
        { heading: "2. Description du Service", content: "TradeFlex est une plateforme de trading social permettant de générer des cartes de trading, participer aux prédictions quotidiennes (Oracle), rivaliser dans les classements et interagir avec une communauté de traders. TradeFlex NE fournit PAS de conseils financiers ni de services de courtage." },
        { heading: "3. Comptes Utilisateurs", content: "Vous devez fournir des informations exactes lors de la création d'un compte. Vous êtes responsable de la sécurité de vos identifiants. Vous devez avoir au moins 18 ans." },
        { heading: "4. Contenu Utilisateur", content: "Vous conservez la propriété des données de trading soumises. En publiant sur TradeFlex, vous nous accordez une licence non exclusive pour afficher votre contenu sur la plateforme." },
        { heading: "5. Utilisation Acceptable", content: "Vous acceptez de NE PAS : manipuler les classements ou votes de l'Oracle ; harceler d'autres utilisateurs ; publier du spam ou contenu illégal ; exploiter la plateforme ; usurper l'identité d'autres traders." },
        { heading: "6. Abonnement Pro", content: "TradeFlex Pro est un abonnement payant. Les prix sont sur notre page Tarifs (3,99$/mois ou 29,99$/an). Renouvellement automatique sauf annulation." },
        { heading: "7. Avertissements", content: "TradeFlex N'EST PAS un conseiller financier, courtier ou plateforme d'investissement. Les données affichées sont soumises par les utilisateurs. Les prédictions de l'Oracle sont à titre de divertissement uniquement. UTILISEZ TRADEFLEX À VOS PROPRES RISQUES." },
        { heading: "8. Limitation de Responsabilité", content: "TradeFlex ne saurait être tenu responsable des dommages indirects, accessoires ou consécutifs découlant de l'utilisation du service." },
        { heading: "9. Résiliation", content: "Nous nous réservons le droit de suspendre ou résilier les comptes en violation de ces conditions. Vous pouvez supprimer votre compte à tout moment." },
        { heading: "10. Modifications des Conditions", content: "Nous pouvons mettre à jour ces conditions. L'utilisation continue après les modifications constitue une acceptation." },
        { heading: "11. Droit Applicable", content: "Ces conditions sont régies par les lois des États-Unis. Les litiges seront résolus devant les tribunaux de Californie." },
        { heading: "12. Contact", content: "Des questions sur ces conditions ? Contactez-nous à : support@tradeflex.app" },
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
