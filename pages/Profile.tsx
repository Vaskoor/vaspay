/**
 * VasPay — Nepal's First Agentic AI Digital Wallet
 * Copyright (c) 2025 VasPay. MIT License.
 *
 * Profile page (NEW) — avatar + name + email + phone, KYC status badge,
 * balance card, settings list (Security, Notifications, Linked Banks,
 * Language, Help, Logout), logout button (clears localStorage → landing).
 */
import React from 'react';
import { User, ViewState } from '../types';
import { MOCK_USER } from '../constants';
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Globe,
  HelpCircle,
  Landmark,
  Lock,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

interface ProfileProps {
  /** Navigate to another view (used for nav to settings sub-pages). */
  onNavigate: (view: ViewState) => void;
  /** Optional explicit logout handler. If absent, Profile clears localStorage
   *  and routes back to 'landing'. */
  onLogout?: () => void;
  /** Optional back button. */
  onBack?: () => void;
}

interface SettingRow {
  id: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  tint: string;
  view?: ViewState;
  action?: 'logout';
}

const SETTINGS: SettingRow[] = [
  { id: 'security', label: 'Security & Privacy', desc: 'PIN, biometric, devices', icon: Lock, tint: 'bg-indigo-50 text-indigo-600' },
  { id: 'notifications', label: 'Notifications', desc: 'Push, email, SMS', icon: Bell, tint: 'bg-amber-50 text-amber-600', view: 'transactions' },
  { id: 'banks', label: 'Linked banks & cards', desc: 'Manage funding sources', icon: Landmark, tint: 'bg-violet-50 text-violet-600', view: 'bank_transfer' },
  { id: 'language', label: 'Language', desc: 'English (Nepali coming soon)', icon: Globe, tint: 'bg-emerald-50 text-emerald-600' },
  { id: 'help', label: 'Help & Support', desc: 'FAQs, contact, disputes', icon: HelpCircle, tint: 'bg-rose-50 text-rose-600' },
];

const npr = new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 2 });

const Profile: React.FC<ProfileProps> = ({ onNavigate, onLogout, onBack }) => {
  // vp-A is expected to extend User with email/phone/cards; guard with fallback.
  const email = (MOCK_USER as any).email ?? 'aarav.sharma@vaspay.app';
  const phone = (MOCK_USER as any).phone ?? '+977 98XXXXXXXX';

  const handleLogout = () => {
    try {
      localStorage.removeItem('vaspay_visited');
    } catch {
      /* ignore */
    }
    if (onLogout) onLogout();
    else onNavigate('landing');
  };

  const kycStyle =
    MOCK_USER.kycStatus === 'verified'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : MOCK_USER.kycStatus === 'pending'
      ? 'bg-amber-50 text-amber-700 ring-amber-200'
      : 'bg-rose-50 text-rose-700 ring-rose-200';

  return (
    <div className="min-h-full bg-slate-50">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 transition" aria-label="Back">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
          )}
          <h1 className="text-lg font-bold text-slate-900">Profile</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Avatar + identity card */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 text-center">
          <div className="relative inline-block">
            <img
              src={MOCK_USER.avatarUrl}
              alt={`${MOCK_USER.name}'s avatar`}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-50"
            />
            <button
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow ring-2 ring-white hover:bg-indigo-700 transition"
              aria-label="Edit avatar"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
          <h2 className="mt-3 text-xl font-extrabold text-slate-900">{MOCK_USER.name}</h2>
          <p className="text-xs text-slate-500 mt-0.5">VasPay ID · {MOCK_USER.id}</p>
          <span
            className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold ring-1 ${kycStyle}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            KYC {MOCK_USER.kycStatus}
          </span>

          <div className="mt-5 grid grid-cols-2 gap-3 text-left">
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Mail className="w-3.5 h-3.5" /> Email
              </div>
              <p className="text-sm font-semibold text-slate-800 truncate">{email}</p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Phone className="w-3.5 h-3.5" /> Phone
              </div>
              <p className="text-sm font-semibold text-slate-800">{phone}</p>
            </div>
          </div>
        </div>

        {/* Balance card */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white shadow-xl shadow-indigo-200">
          <div className="flex items-center gap-2 text-indigo-100 text-xs font-semibold uppercase tracking-wider">
            <Wallet className="w-4 h-4" /> Wallet balance
          </div>
          <h3 className="text-3xl font-extrabold mt-1">{npr.format(MOCK_USER.balance)}</h3>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onNavigate('load_money')}
              className="flex-1 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-xl py-2 text-sm font-semibold active:scale-95 transition"
            >
              Add money
            </button>
            <button
              onClick={() => onNavigate('send_money')}
              className="flex-1 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl py-2 text-sm font-semibold shadow active:scale-95 transition"
            >
              Send
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <h3 className="px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Settings
          </h3>
          <ul className="divide-y divide-slate-100">
            {SETTINGS.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => s.view && onNavigate(s.view)}
                  className="w-full px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition text-left"
                >
                  <div className={`w-10 h-10 rounded-xl ${s.tint} flex items-center justify-center`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{s.label}</p>
                    <p className="text-xs text-slate-500 truncate">{s.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* VasPay AI promo */}
        <button
          onClick={() => onNavigate('chat')}
          className="w-full rounded-2xl bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-100 p-4 flex items-center gap-4 hover:shadow-md transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" fill="currentColor" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-900">Talk to VasPay AI</p>
            <p className="text-xs text-emerald-700">Ask anything about your money.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-500" />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 p-4 flex items-center justify-center gap-2 text-rose-600 font-semibold active:scale-95 transition"
        >
          <LogOut className="w-5 h-5" /> Log out
        </button>

        <p className="text-center text-xs text-slate-400 pt-2">
          VasPay v0.9.0 · MIT Licensed · Made in Kathmandu
        </p>
      </div>
    </div>
  );
};

export default Profile;
