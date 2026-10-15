/**
 * VasPay — Nepal's First Agentic AI Digital Wallet
 * Copyright (c) 2025 VasPay. MIT License.
 *
 * Notifications page (NEW) — MOCK_NOTIFICATIONS list with per-type icons,
 * read/unread styling, timestamp, and a "Mark all read" button.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Notification } from '../types';
import { MOCK_NOTIFICATIONS } from '../constants';
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  Gift,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

interface NotificationsProps {
  onBack?: () => void;
}

type NotifType = 'transaction' | 'security' | 'ai' | 'promotion';

interface VasPayNotification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  timestamp: string | number;
  read: boolean;
}

const FALLBACK: VasPayNotification[] = [
  {
    id: 'n1',
    type: 'security',
    title: 'Unusual login detected',
    body: 'A login from a new device in Pokhara. Tap to review and secure your account.',
    timestamp: Date.now() - 1000 * 60 * 5,
    read: false,
  },
  {
    id: 'n2',
    type: 'transaction',
    title: 'Payment received',
    body: 'Sita Sharma sent you Rs. 2,500. Tap to view.',
    timestamp: Date.now() - 1000 * 60 * 35,
    read: false,
  },
  {
    id: 'n3',
    type: 'ai',
    title: 'Spending up 15% on food',
    body: 'VasPay AI noticed an increase in dining out this week. Set a food budget?',
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
    read: false,
  },
  {
    id: 'n4',
    type: 'transaction',
    title: 'Electricity bill paid',
    body: 'Rs. 1,500 paid to Nepal Electricity Authority. Transaction ID VX8F2A1.',
    timestamp: Date.now() - 1000 * 60 * 60 * 26,
    read: true,
  },
  {
    id: 'n5',
    type: 'promotion',
    title: 'Dashain cashback offer',
    body: 'Get 5% cashback on QR payments above Rs. 1,000 at Bhatbhateni this Dashain.',
    timestamp: Date.now() - 1000 * 60 * 60 * 50,
    read: true,
  },
  {
    id: 'n6',
    type: 'security',
    title: 'KYC verified',
    body: 'Your KYC documents are now verified. Enjoy higher transaction limits.',
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
    read: true,
  },
  {
    id: 'n7',
    type: 'security',
    title: 'Scheduled maintenance',
    body: 'VasPay will be unavailable 02:00–03:00 tonight for upgrades.',
    timestamp: Date.now() - 1000 * 60 * 60 * 96,
    read: true,
  },
];

const TYPE_META: Record<NotifType, { icon: LucideIcon; tint: string }> = {
  transaction: { icon: Wallet, tint: 'bg-indigo-50 text-indigo-600' },
  security: { icon: ShieldAlert, tint: 'bg-rose-50 text-rose-600' },
  ai: { icon: Sparkles, tint: 'bg-violet-50 text-violet-600' },
  promotion: { icon: Gift, tint: 'bg-amber-50 text-amber-600' },
};

/** Format a timestamp into "5m", "3h", "2d", or a date. */
function timeAgo(ts: string | number | Date): string {
  const t = +new Date(ts);
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(t).toLocaleDateString('en-NP', { day: 'numeric', month: 'short' });
}

const Notifications: React.FC<NotificationsProps> = ({ onBack }) => {
  // vp-A is expected to provide MOCK_NOTIFICATIONS with the same shape; cast
  // defensively so the page renders even if the constants bundle differs.
  const initial: VasPayNotification[] = ((MOCK_NOTIFICATIONS ?? []) as unknown as VasPayNotification[]);
  const [items, setItems] = useState<VasPayNotification[]>(() =>
    initial.length ? initial : FALLBACK,
  );

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const markAllRead = () =>
    setItems((arr) => arr.map((n) => ({ ...n, read: true })));

  const toggleRead = (id: string) =>
    setItems((arr) => arr.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

  return (
    <div className="min-h-full bg-slate-50">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 transition" aria-label="Back">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
          )}
          <h1 className="text-lg font-bold text-slate-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {unreadCount} new
            </span>
          )}
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline disabled:opacity-40 disabled:no-underline"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Filter chips (visual only) */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: `Unread ${unreadCount}` },
            { id: 'security', label: 'Security' },
            { id: 'transaction', label: 'Transactions' },
            { id: 'ai', label: 'AI insights' },
            { id: 'promotion', label: 'Offers' },
          ].map((c, i) => (
            <button
              key={c.id}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                i === 0
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400 mb-3">
              <Bell className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-slate-700">You're all caught up</p>
            <p className="text-xs text-slate-500 mt-1">New notifications will show up here.</p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {items.map((n) => {
              const meta = TYPE_META[n.type] ?? TYPE_META.security;
              const Icon = meta.icon;
              return (
                <li key={n.id}>
                  <button
                    onClick={() => toggleRead(n.id)}
                    className={`w-full text-left rounded-2xl p-4 border transition flex gap-3 ${
                      n.read
                        ? 'bg-white border-slate-200 hover:bg-slate-50'
                        : 'bg-indigo-50/40 border-indigo-100 hover:bg-indigo-50'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl ${meta.tint} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm ${n.read ? 'font-semibold' : 'font-bold'} text-slate-900 truncate`}>
                          {n.title}
                        </p>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {timeAgo(n.timestamp)}
                        </span>
                        {n.read && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                            <Check className="w-3 h-3" /> Read
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <p className="text-center text-xs text-slate-400 pt-2">
          VasPay never sells your data. Manage notification preferences in Profile → Settings.
        </p>
      </div>
    </div>
  );
};

export default Notifications;
