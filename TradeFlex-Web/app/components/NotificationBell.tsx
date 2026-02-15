//
//  app/components/NotificationBell.tsx
//  TradeFlex - Notification Bell Component
//

'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, X, UserPlus, MessageCircle, ThumbsUp, Check } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface Notification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'mention';
  message: string;
  from_username: string;
  from_emoji: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

const typeIcons = {
  follow: UserPlus,
  like: ThumbsUp,
  comment: MessageCircle,
  mention: MessageCircle,
};

export default function NotificationBell({ user }: { user: User | null }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [user]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function fetchUnreadCount() {
    try {
      const res = await fetch('/api/notifications?unread=true');
      const data = await res.json();
      setUnreadCount(data.unread_count || 0);
    } catch {
      // Use mock
      setUnreadCount(3);
    }
  }

  async function fetchAll() {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch {
      setNotifications(getMockNotifications());
    }
    setLoading(false);
  }

  async function markAllRead() {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mark_all: true }),
      });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  }

  function toggleDropdown() {
    if (!isOpen) fetchAll();
    setIsOpen(!isOpen);
  }

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-1.5 hover:bg-white/10 rounded-lg transition"
      >
        <Bell size={18} className="text-zinc-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 w-80 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="font-bold text-sm">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1">
                  <Check size={12} /> Read all
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
                <X size={14} className="text-white/40" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-white/30 text-sm">No notifications yet</div>
            ) : (
              notifications.map(n => {
                const Icon = typeIcons[n.type] || Bell;
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition cursor-pointer ${!n.read ? 'bg-green-500/5' : ''}`}
                  >
                    <div className="mt-0.5 text-lg">{n.from_emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/70">
                        <span className="font-bold text-white">{n.from_username}</span>{' '}
                        {n.message}
                      </p>
                      <span className="text-[10px] text-white/30">{timeAgo(n.created_at)}</span>
                    </div>
                    {!n.read && <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getMockNotifications(): Notification[] {
  return [
    { id: '1', type: 'follow', message: 'started following you', from_username: 'DeepFuckingValue', from_emoji: '🦍', link: null, read: false, created_at: new Date(Date.now() - 600000).toISOString() },
    { id: '2', type: 'like', message: 'liked your post "TSLA to the moon"', from_username: 'CathieWood', from_emoji: '🌲', link: null, read: false, created_at: new Date(Date.now() - 1800000).toISOString() },
    { id: '3', type: 'comment', message: 'commented on your NVDA trade', from_username: 'OptionsYOLO', from_emoji: '🎰', link: null, read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: '4', type: 'like', message: 'liked your GME DD post', from_username: 'DiamondHands', from_emoji: '💎', link: null, read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
  ];
}
