//
//  app/admin/page.tsx
//  TradeFlex - Admin Dashboard
//
//  Created on 2026-02-14.
//

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { isAdmin } from '../lib/admin';
import { useRouter } from 'next/navigation';
import { Users, BarChart3, ArrowLeft, Shield, TrendingUp, Clock, Ban, ShieldCheck, Loader2, Rocket } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  display_name: string;
  role: string;
  banned: boolean;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  totalFlexes: number;
  flexesToday: number;
  totalVotes: number;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'users'>('stats');
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalFlexes: 0, flexesToday: 0, totalVotes: 0 });
  const [users, setUsers] = useState<Profile[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [lang, setLang] = useState<'en' | 'cn'>('en');
  const router = useRouter();

  // Load language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('tradeflex-lang') as 'en' | 'cn' | null;
    if (savedLang) setLang(savedLang);
  }, []);

  const t = {
    en: {
      adminPanel: 'ADMIN PANEL',
      statistics: 'Statistics',
      users: 'Users',
      totalUsers: 'Total Users',
      flexesGenerated: 'Flexes Generated',
      flexesToday: 'Flexes Today',
      oracleVotes: 'Oracle Votes',
      user: 'User',
      email: 'Email',
      joined: 'Joined',
      role: 'Role',
      actions: 'Actions',
      ban: 'Ban',
      unban: 'Unban',
      noUsers: "No users found. Make sure you've run the schema.sql in Supabase.",
    },
    cn: {
      adminPanel: '管理后台',
      statistics: '数据统计',
      users: '用户管理',
      totalUsers: '总用户数',
      flexesGenerated: '已生成海报',
      flexesToday: '今日海报',
      oracleVotes: 'Oracle 投票',
      user: '用户',
      email: '邮箱',
      joined: '注册时间',
      role: '角色',
      actions: '操作',
      ban: '封禁',
      unban: '解封',
      noUsers: '暂无用户。请确认已在 Supabase 运行 schema.sql。',
    },
  };
  const text = t[lang];

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || !isAdmin(user.email)) {
        router.push('/');
        return;
      }
      setUser(user);
      setLoading(false);
    });
  }, [router]);

  // Fetch stats
  useEffect(() => {
    if (!user) return;
    setStatsLoading(true);
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStats(data);
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, [user]);

  // Fetch users when tab switches
  useEffect(() => {
    if (activeTab !== 'users' || !user) return;
    setUsersLoading(true);
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if (data.users) setUsers(data.users);
      })
      .catch(() => {})
      .finally(() => setUsersLoading(false));
  }, [activeTab, user]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  };

  const handleBanToggle = async (userId: string, banned: boolean) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ banned }),
    });
    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, banned } : u));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-500 animate-pulse text-xl font-bold">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin(user.email)) return null;

  return (
    <main className="min-h-screen bg-black text-white font-sans p-4 md:p-8 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 hover:opacity-80 transition"
            >
              <Rocket className="w-5 h-5 text-green-500 -rotate-45" />
              <span className="font-black text-sm bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent hidden sm:inline">TRADEFLEX</span>
            </button>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-yellow-400" />
              <h1 className="text-2xl font-black tracking-tighter">{text.adminPanel}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-yellow-400 font-bold">{user.email?.split('@')[0]}</span>
            <span className="text-[10px] bg-yellow-900/50 text-yellow-400 px-2 py-0.5 rounded border border-yellow-900">ADMIN</span>
            <button
              onClick={() => { const next = lang === 'en' ? 'cn' : 'en'; setLang(next); localStorage.setItem('tradeflex-lang', next); }}
              className="ml-2 text-lg hover:scale-110 transition"
            >
              {lang === 'en' ? '🇨🇳' : '🇺🇸'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${
              activeTab === 'stats'
                ? 'bg-green-500 text-black'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            {text.statistics}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${
              activeTab === 'users'
                ? 'bg-green-500 text-black'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Users className="w-4 h-4" />
            {text.users}
          </button>
        </div>

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: text.totalUsers, value: stats.totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-900/50' },
                { label: text.flexesGenerated, value: stats.totalFlexes, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-900/20 border-green-900/50' },
                { label: text.flexesToday, value: stats.flexesToday, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-900/50' },
                { label: text.oracleVotes, value: stats.totalVotes, icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-900/20 border-purple-900/50' },
              ].map((stat) => (
                <div key={stat.label} className={`${stat.bg} border rounded-xl p-4 md:p-6`}>
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                  <div className="text-2xl md:text-3xl font-black">
                    {statsLoading ? <Loader2 className="w-6 h-6 animate-spin text-zinc-600" /> : stat.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-zinc-500 font-bold uppercase tracking-wide mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {usersLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
              </div>
            ) : (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-widest">
                      <th className="text-left p-4 font-bold">{text.user}</th>
                      <th className="text-left p-4 font-bold hidden md:table-cell">{text.email}</th>
                      <th className="text-left p-4 font-bold hidden md:table-cell">{text.joined}</th>
                      <th className="text-left p-4 font-bold">{text.role}</th>
                      <th className="text-left p-4 font-bold">{text.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((profile) => (
                      <tr key={profile.id} className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition ${profile.banned ? 'opacity-50' : ''}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                              profile.role === 'admin' ? 'bg-yellow-900/50' : 'bg-zinc-800'
                            }`}>
                              {profile.role === 'admin' ? '👑' : '👤'}
                            </div>
                            <div>
                              <span className="font-bold">{profile.display_name || profile.email?.split('@')[0]}</span>
                              {profile.banned && (
                                <span className="ml-2 text-[10px] bg-red-900/50 text-red-400 px-1.5 py-0.5 rounded border border-red-900">BANNED</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-zinc-400 hidden md:table-cell">{profile.email}</td>
                        <td className="p-4 text-zinc-400 hidden md:table-cell">{new Date(profile.created_at).toLocaleDateString()}</td>
                        <td className="p-4">
                          <select
                            value={profile.role}
                            onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                            className="bg-black border border-zinc-700 rounded-lg px-2 py-1 text-xs font-bold focus:border-green-500 outline-none appearance-none"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleBanToggle(profile.id, !profile.banned)}
                            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition ${
                              profile.banned
                                ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50 border border-green-900'
                                : 'bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-900'
                            }`}
                          >
                            {profile.banned ? (
                              <><ShieldCheck className="w-3 h-3" /> {text.unban}</>
                            ) : (
                              <><Ban className="w-3 h-3" /> {text.ban}</>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-600">
                          {text.noUsers}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
