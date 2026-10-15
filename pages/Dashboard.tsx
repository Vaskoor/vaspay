/**
 * VasPay — Nepal's First Agentic AI Digital Wallet
 * Copyright (c) 2025 VasPay. MIT License.
 *
 * Dashboard page — greeting, balance card with show/hide, 6 quick actions,
 * spending-vs-budget mini card, recent transactions, savings-goal strip,
 * and a notification badge.
 */
import React, { useMemo, useState } from 'react';
import { User, ViewState, Transaction, SavingsGoal } from '../types';
import { MOCK_TRANSACTIONS, MOCK_USER } from '../constants';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  Eye,
  EyeOff,
  History,
  ScanLine,
  Send,
  Download,
  Users,
  Landmark,
  Plus,
  Sparkles,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onNavigate: (view: ViewState) => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  view: ViewState;
  tint: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'send', label: 'Send', icon: Send, view: 'send_money', tint: 'bg-indigo-50 text-indigo-600' },
  { id: 'load', label: 'Load', icon: Download, view: 'load_money', tint: 'bg-emerald-50 text-emerald-600' },
  { id: 'request', label: 'Request', icon: Users, view: 'request_money', tint: 'bg-violet-50 text-violet-600' },
  { id: 'bank', label: 'Bank', icon: Landmark, view: 'bank_transfer', tint: 'bg-amber-50 text-amber-600' },
  { id: 'scan', label: 'Scan & Pay', icon: ScanLine, view: 'scan', tint: 'bg-rose-50 text-rose-600' },
  { id: 'history', label: 'History', icon: History, view: 'transactions', tint: 'bg-slate-100 text-slate-600' },
];

const MONTHLY_BUDGET = 30000;

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [showBalance, setShowBalance] = useState(true);

  const npr = useMemo(
    () => new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 2 }),
    [],
  );

  // Spend this month from outgoing transactions
  const monthSpent = useMemo(
    () =>
      MOCK_TRANSACTIONS.filter(
        (t) => (t.type === 'payment' || t.type === 'bill_payment') && t.status === 'success',
      ).reduce((sum, t) => sum + t.amount, 0),
    [],
  );
  const budgetPct = Math.min(100, Math.round((monthSpent / MONTHLY_BUDGET) * 100));

  const recentTxs: Transaction[] = useMemo(
    () => [...MOCK_TRANSACTIONS].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 5),
    [],
  );

  const savingsGoals: SavingsGoal[] = ((MOCK_USER as any).savingsGoals as SavingsGoal[] | undefined) ?? [];

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="min-h-full bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Greeting row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{greeting},</p>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{user.name.split(' ')[0]} 👋</h1>
          </div>
          <button
            onClick={() => onNavigate('transactions' as ViewState)}
            className="relative p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-700" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
        </div>

        {/* Balance card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 p-6 text-white shadow-xl shadow-indigo-200">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <div className="absolute -bottom-16 -left-10 w-40 h-40 rounded-full bg-violet-400/30 blur-2xl" aria-hidden />

          <div className="relative">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                {user.kycStatus === 'verified' ? 'Verified' : 'Pending KYC'}
              </div>
              <button
                onClick={() => setShowBalance((s) => !s)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
                aria-label={showBalance ? 'Hide balance' : 'Show balance'}
              >
                {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>

            <p className="mt-4 text-xs uppercase tracking-wider text-indigo-200">Total Balance</p>
            <h2 className="text-4xl font-extrabold tracking-tight">
              {showBalance ? npr.format(user.balance) : 'NPR •••••••'}
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('load_money')}
                className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-xl py-2.5 px-4 text-sm font-semibold active:scale-95 transition"
              >
                <ArrowDownLeft className="w-4 h-4" /> Load
              </button>
              <button
                onClick={() => onNavigate('send_money')}
                className="flex items-center justify-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl py-2.5 px-4 text-sm font-semibold shadow active:scale-95 transition"
              >
                <ArrowUpRight className="w-4 h-4" /> Send
              </button>
            </div>
          </div>
        </div>

        {/* Quick actions — 6 grid */}
        <div className="grid grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.id}
              onClick={() => onNavigate(a.view)}
              className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${a.tint} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <a.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-700">{a.label}</span>
            </button>
          ))}
        </div>

        {/* Spending this month mini card */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Spent this month</p>
                <p className="text-sm font-bold text-slate-900">
                  {npr.format(monthSpent)}{' '}
                  <span className="text-xs font-normal text-slate-400">/ {npr.format(MONTHLY_BUDGET)}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              View analytics
            </button>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                budgetPct < 70 ? 'bg-emerald-500' : budgetPct < 95 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {budgetPct >= 100
              ? `Over budget by ${npr.format(monthSpent - MONTHLY_BUDGET)}`
              : `${100 - budgetPct}% of budget remaining`}
          </p>
        </div>

        {/* AI insight teaser */}
        <button
          onClick={() => onNavigate('chat')}
          className="w-full text-left rounded-2xl bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-100 p-4 flex items-center gap-4 hover:shadow-md active:scale-[0.99] transition-all"
        >
          <div className="w-11 h-11 rounded-xl bg-white shadow-sm text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" fill="currentColor" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-emerald-900">VasPay AI insight</h4>
            <p className="text-xs text-emerald-700 mt-0.5">
              You spent 20% less on utilities this month. Tap to ask VasPay AI why.
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-500" />
        </button>

        {/* Savings goals strip */}
        {savingsGoals.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900">Savings goals</h3>
              <button
                onClick={() => onNavigate('transactions' as ViewState)}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                See all
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
              {savingsGoals.slice(0, 3).map((g) => {
                const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
                return (
                  <div key={g.id} className="flex-shrink-0 w-44 rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{g.emoji}</span>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 leading-tight">{g.title}</p>
                        <p className="text-[10px] text-slate-500">{pct}% saved</p>
                      </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden mb-2">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {npr.format(g.saved)} / {npr.format(g.target)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900">Recent transactions</h3>
            <button
              onClick={() => onNavigate('transactions')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              View all
            </button>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {recentTxs.map((tx) => {
              const isIn = tx.type === 'receive';
              return (
                <div key={tx.id} className="p-3.5 flex items-center gap-3 hover:bg-slate-50/70 transition-colors">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isIn ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {isIn ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {tx.recipient || tx.sender || 'Unknown'}
                    </p>
                    <p className="text-[11px] text-slate-500 capitalize">
                      {tx.category} · {new Date(tx.date).toLocaleDateString('en-NP', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${isIn ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {isIn ? '+' : '−'}
                      {npr.format(tx.amount)}
                    </p>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        tx.status === 'success'
                          ? 'bg-emerald-50 text-emerald-600'
                          : tx.status === 'pending'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add money CTA */}
        <button
          onClick={() => onNavigate('load_money')}
          className="w-full rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 p-4 flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-700 font-semibold text-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add money to wallet
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
