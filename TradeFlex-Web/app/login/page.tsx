'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Rocket, Mail, Lock, Loader2 } from 'lucide-react';

type Lang = 'en' | 'cn' | 'ja' | 'ko' | 'es' | 'fr';

const t: Record<Lang, Record<string, string>> = {
  en: {
    subtitle_register: "Join the Hall of Fame",
    subtitle_login: "Welcome back, legend",
    google: "Continue with Google",
    facebook: "Continue with Facebook",
    apple: "Continue with Apple",
    orEmail: "Or use email",
    email: "Email",
    password: "Password",
    signUp: "SIGN UP WITH EMAIL",
    logIn: "LOG IN WITH EMAIL",
    haveAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    loginLink: "Log in",
    signUpLink: "Sign up",
    checkEmail: "Check your email for a confirmation link!",
    banned: "Your account has been suspended. Contact support.",
  },
  cn: {
    subtitle_register: "加入名人堂",
    subtitle_login: "欢迎回来，传奇",
    google: "Google 登录",
    facebook: "Facebook 登录",
    apple: "Apple 登录",
    orEmail: "或使用邮箱",
    email: "邮箱",
    password: "密码",
    signUp: "邮箱注册",
    logIn: "邮箱登录",
    haveAccount: "已有账号？",
    noAccount: "还没有账号？",
    loginLink: "登录",
    signUpLink: "注册",
    checkEmail: "请查看邮箱中的确认链接！",
    banned: "您的账号已被封禁，请联系客服。",
  },
  ja: {
    subtitle_register: "殿堂入りしよう",
    subtitle_login: "おかえりなさい、レジェンド",
    google: "Google でログイン",
    facebook: "Facebook でログイン",
    apple: "Apple でログイン",
    orEmail: "またはメールで",
    email: "メールアドレス",
    password: "パスワード",
    signUp: "メールで登録",
    logIn: "メールでログイン",
    haveAccount: "アカウントをお持ちですか？",
    noAccount: "アカウントをお持ちでないですか？",
    loginLink: "ログイン",
    signUpLink: "登録",
    checkEmail: "確認リンクをメールで送信しました！",
    banned: "アカウントが停止されています。サポートにお問い合わせください。",
  },
  ko: {
    subtitle_register: "명예의 전당에 합류하세요",
    subtitle_login: "돌아오셨군요, 레전드",
    google: "Google로 계속",
    facebook: "Facebook으로 계속",
    apple: "Apple로 계속",
    orEmail: "또는 이메일로",
    email: "이메일",
    password: "비밀번호",
    signUp: "이메일로 가입",
    logIn: "이메일로 로그인",
    haveAccount: "이미 계정이 있으신가요?",
    noAccount: "계정이 없으신가요?",
    loginLink: "로그인",
    signUpLink: "가입",
    checkEmail: "이메일에서 확인 링크를 확인해주세요!",
    banned: "계정이 정지되었습니다. 지원팀에 문의하세요.",
  },
  es: {
    subtitle_register: "Únete al Salón de la Fama",
    subtitle_login: "Bienvenido de vuelta, leyenda",
    google: "Continuar con Google",
    facebook: "Continuar con Facebook",
    apple: "Continuar con Apple",
    orEmail: "O usar email",
    email: "Email",
    password: "Contraseña",
    signUp: "REGISTRARSE CON EMAIL",
    logIn: "ACCEDER CON EMAIL",
    haveAccount: "¿Ya tienes cuenta?",
    noAccount: "¿No tienes cuenta?",
    loginLink: "Acceder",
    signUpLink: "Registrarse",
    checkEmail: "¡Revisa tu email para el enlace de confirmación!",
    banned: "Tu cuenta ha sido suspendida. Contacta soporte.",
  },
  fr: {
    subtitle_register: "Rejoins le Panthéon",
    subtitle_login: "Content de te revoir, légende",
    google: "Continuer avec Google",
    facebook: "Continuer avec Facebook",
    apple: "Continuer avec Apple",
    orEmail: "Ou par email",
    email: "Email",
    password: "Mot de passe",
    signUp: "S'INSCRIRE PAR EMAIL",
    logIn: "SE CONNECTER PAR EMAIL",
    haveAccount: "Déjà un compte ?",
    noAccount: "Pas encore de compte ?",
    loginLink: "Se connecter",
    signUpLink: "S'inscrire",
    checkEmail: "Vérifie ton email pour le lien de confirmation !",
    banned: "Ton compte a été suspendu. Contacte le support.",
  },
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'signup') {
      setIsRegister(true);
    }
    const saved = localStorage.getItem('tradeflex-lang') as Lang;
    if (saved && t[saved]) setLang(saved);
  }, []);

  const text = t[lang];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const checkBanned = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data: profile } = await supabase
      .from('profiles')
      .select('banned')
      .eq('id', user.id)
      .single();
    if (profile?.banned) {
      await supabase.auth.signOut();
      setError(text.banned);
      setLoading(false);
      return true;
    }
    return false;
  };

  const handleOAuthLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setTimeout(() => setLoading(false), 5000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setError(text.checkEmail);
        setLoading(false);
        return;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      try {
        const banned = await checkBanned();
        if (banned) return;
      } catch {}
      router.push('/');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans p-4 flex items-center justify-center relative selection:bg-green-500/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 backdrop-blur-md relative z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <Rocket className="w-12 h-12 text-green-500 -rotate-45 mb-4 hover:scale-110 transition cursor-pointer" />
          </Link>
          <Link href="/" className="hover:opacity-80 transition">
            <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              TRADEFLEX
            </h1>
          </Link>
          <p className="text-zinc-500 mt-2 text-sm font-medium">
            {isRegister ? text.subtitle_register : text.subtitle_login}
          </p>
        </div>

        {error && (
          <div className={`${error === text.checkEmail ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'} border p-3 rounded-lg text-sm mb-6 text-center`}>
            {error}
          </div>
        )}

        {/* Social Login */}
        <div className="space-y-3 mb-6">
          <button 
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="w-full bg-zinc-800 text-white font-bold py-3 rounded-xl hover:bg-zinc-700 active:scale-[0.98] transition flex items-center justify-center gap-2 border border-zinc-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {text.google}
          </button>

          <button 
            onClick={() => handleOAuthLogin('facebook')}
            disabled={loading}
            className="w-full bg-[#1877F2] text-white font-bold py-3 rounded-xl hover:bg-[#166FE5] active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            {text.facebook}
          </button>

          <button 
            onClick={() => handleOAuthLogin('apple')}
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-100 active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            {text.apple}
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-3 text-zinc-600 font-bold">{text.orEmail}</span>
          </div>
        </div>

        {/* Email form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase">{text.email}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-zinc-600" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black border border-zinc-700 rounded-lg p-3 pl-10 font-bold focus:border-green-500 outline-none transition text-white placeholder-zinc-700"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase">{text.password}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-zinc-600" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black border border-zinc-700 rounded-lg p-3 pl-10 font-bold focus:border-green-500 outline-none transition text-white placeholder-zinc-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-800 text-white font-bold py-3 rounded-xl hover:bg-zinc-700 active:scale-[0.98] transition flex items-center justify-center gap-2 border border-zinc-700"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegister ? text.signUp : text.logIn)}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-zinc-500 text-sm">
            {isRegister ? text.haveAccount : text.noAccount}{' '}
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-green-500 font-bold hover:underline"
            >
              {isRegister ? text.loginLink : text.signUpLink}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
