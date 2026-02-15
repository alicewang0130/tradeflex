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
import { Rocket, Users, BarChart3, ArrowLeft, Shield, TrendingUp, Clock } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'users'>('stats');
  const router = useRouter();

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
              className="text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-yellow-400" />
              <h1 className="text-2xl font-black tracking-tighter">ADMIN PANEL</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-yellow-400 font-bold">{user.email?.split('@')[0]}</span>
            <span className="text-[10px] bg-yellow-900/50 text-yellow-400 px-2 py-0.5 rounded border border-yellow-900">ADMIN</span>
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
            Statistics
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
            Users
          </button>
        </div>

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: '1', icon: Users, color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-900/50' },
                { label: 'Flexes Generated', value: '—', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-900/20 border-green-900/50' },
                { label: 'Active Today', value: '1', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-900/50' },
                { label: 'Oracle Votes', value: '100k+', icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-900/20 border-purple-900/50' },
              ].map((stat) => (
                <div key={stat.label} className={`${stat.bg} border rounded-xl p-4 md:p-6`}>
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                  <div className="text-2xl md:text-3xl font-black">{stat.value}</div>
                  <div className="text-xs text-zinc-500 font-bold uppercase tracking-wide mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Placeholder Chart Area */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="font-bold text-zinc-400 text-sm mb-4 uppercase tracking-widest">📊 User Growth</h3>
              <div className="h-48 flex items-center justify-center text-zinc-600 text-sm">
                Chart coming soon — connect to Supabase analytics
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-widest">
                    <th className="text-left p-4 font-bold">User</th>
                    <th className="text-left p-4 font-bold hidden md:table-cell">Email</th>
                    <th className="text-left p-4 font-bold hidden md:table-cell">Joined</th>
                    <th className="text-left p-4 font-bold">Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-900/50 rounded-full flex items-center justify-center text-sm">👑</div>
                        <span className="font-bold">{user.email?.split('@')[0]}</span>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-400 hidden md:table-cell">{user.email}</td>
                    <td className="p-4 text-zinc-400 hidden md:table-cell">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className="text-[10px] bg-yellow-900/50 text-yellow-400 px-2 py-0.5 rounded border border-yellow-900 font-bold">ADMIN</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-zinc-600 text-center">
              Full user list requires Supabase service role key — add it to enable user management
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
