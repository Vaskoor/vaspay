/**
 * VasPay — Nepal's First Agentic AI Digital Wallet
 * Copyright (c) 2025 VasPay. MIT License.
 *
 * Savings page (NEW) — MOCK_USER.savingsGoals as progress cards (saved /
 * target, deadline, emoji), "Create goal" button, and a compound-interest
 * mini-illustration.
 */
import React, { useMemo, useState } from 'react';
import { SavingsGoal } from '../types';
import { MOCK_USER } from '../constants';
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronRight,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

interface SavingsProps {
  onBack?: () => void;
}

interface VasPayGoal extends SavingsGoal {
  emoji: string;
  title: string;
  target: number;
  saved: number;
  deadline: string;
}

const FALLBACK_GOALS: VasPayGoal[] = [
  { id: 'g1', emoji: '🏔️', title: 'Dashain Trip', target: 75000, saved: 52400, deadline: '2025-09-30', color: 'from-indigo-500 to-violet-600' },
  { id: 'g2', emoji: '💻', title: 'New Laptop', target: 120000, saved: 38000, deadline: '2025-12-15', color: 'from-emerald-500 to-teal-600' },
  { id: 'g3', emoji: '💍', title: 'Emergency Fund', target: 200000, saved: 142000, deadline: '2026-06-01', color: 'from-rose-500 to-pink-600' },
  { id: 'g4', emoji: '🎓', title: 'Tuition Fees', target: 90000, saved: 12000, deadline: '2026-02-01', color: 'from-amber-500 to-orange-600' },
];

const npr = new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 });

const Savings: React.FC<SavingsProps> = ({ onBack }) => {
  const goals: VasPayGoal[] = ((MOCK_USER as any).savingsGoals as VasPayGoal[] | undefined) ?? FALLBACK_GOALS;
  const [showCreate, setShowCreate] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', emoji: '🎯' });

  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="min-h-full bg-slate-50">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 transition" aria-label="Back">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
          )}
          <h1 className="text-lg font-bold text-slate-900">Savings</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Hero summary */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 p-6 text-white shadow-xl shadow-emerald-200">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/15 blur-2xl" aria-hidden />
          <div className="relative">
            <div className="flex items-center gap-2 text-emerald-50 text-xs uppercase tracking-wider font-semibold">
              <Wallet className="w-4 h-4" /> Total saved
            </div>
            <h2 className="text-4xl font-extrabold mt-1">{npr.format(totalSaved)}</h2>
            <p className="text-sm text-emerald-100 mt-1">
              of {npr.format(totalTarget)} target · {overallPct}% there
            </p>
            <div className="mt-4 h-2 w-full rounded-full bg-white/20 overflow-hidden">
              <div className="h-full rounded-full bg-white" style={{ width: `${overallPct}%` }} />
            </div>
          </div>
        </div>

        {/* Compound interest illustration */}
        <CompoundInterest principal={50000} rate={6} years={5} />

        {/* Goals list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900">Your goals</h3>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> New goal
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {goals.map((g) => (
              <GoalCard key={g.id} goal={g} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => setShowCreate(true)}
          className="w-full rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 p-5 flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-700 font-semibold text-sm transition-all"
        >
          <Plus className="w-5 h-5" /> Create a new savings goal
        </button>

        {/* AI hint */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 p-5 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" fill="currentColor" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-900">VasPay AI savings tip</h4>
            <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
              Saving just Rs. 100/day adds up to Rs. 36,500/year — and at 6% APY, that's Rs. 41,820 after one year. Round up every payment to reach your goals faster.
            </p>
          </div>
        </div>
      </div>

      {/* Create goal modal */}
      {showCreate && (
        <CreateGoalModal
          onClose={() => setShowCreate(false)}
          onCreate={() => {
            setShowCreate(false);
            setNewGoal({ title: '', target: '', emoji: '🎯' });
          }}
          state={newGoal}
          setState={setNewGoal}
        />
      )}
    </div>
  );
};

/* ─────────────────────── Goal card ─────────────────────── */

const GoalCard: React.FC<{ goal: VasPayGoal }> = ({ goal }) => {
  const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
  const remaining = Math.max(0, goal.target - goal.saved);
  const daysLeft = Math.ceil((+new Date(goal.deadline) - Date.now()) / (1000 * 60 * 60 * 24));
  const done = pct >= 100;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl">
          {goal.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 truncate">{goal.title}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(goal.deadline).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' })}
            {daysLeft > 0 ? ` · ${daysLeft}d left` : ' · overdue'}
          </p>
        </div>
        {done && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase">
            <Check className="w-3 h-3" /> Done
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-bold text-slate-900">{npr.format(goal.saved)}</span>
        <span className="text-xs text-slate-500">of {npr.format(goal.target)}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden mb-2">
        <div
          className={`h-full rounded-full ${done ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">{pct}% saved</span>
        <span className="text-slate-700 font-medium">{npr.format(remaining)} to go</span>
      </div>

      <button className="mt-4 w-full py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 active:scale-95 transition">
        Add to this goal
      </button>
    </div>
  );
};

/* ─────────────────────── Compound interest illustration ─────────────────────── */

const CompoundInterest: React.FC<{ principal: number; rate: number; years: number }> = ({
  principal,
  rate,
  years,
}) => {
  const data = useMemo(() => {
    const arr: { year: number; value: number }[] = [];
    let v = principal;
    for (let y = 0; y <= years; y++) {
      arr.push({ year: y, value: Math.round(v) });
      v = v * (1 + rate / 100);
    }
    return arr;
  }, [principal, rate, years]);

  const maxV = data[data.length - 1].value;
  const final = data[data.length - 1].value;
  const gain = final - principal;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="w-5 h-5 text-emerald-500" />
        <h3 className="font-bold text-slate-900">Compound interest in action</h3>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        {npr.format(principal)} saved today at {rate}% APY for {years} years.
      </p>

      <div className="flex items-end gap-2 h-32 mb-3">
        {data.map((d) => {
          const h = Math.max(8, (d.value / maxV) * 100);
          const interest = d.value - principal;
          const principalHeight = (principal / d.value) * h;
          return (
            <div key={d.year} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full relative flex flex-col justify-end" style={{ height: '100%' }}>
                <div
                  className="w-full rounded-t-md bg-emerald-400"
                  style={{ height: `${h - (principalHeight / h) * h}%` }}
                  title={`Interest: ${npr.format(interest)}`}
                />
                <div
                  className="w-full bg-indigo-500"
                  style={{ height: `${(principalHeight / h) * h}%`, borderRadius: d.year === 0 ? '6px 6px 0 0' : '0 0 0 0' }}
                  title={`Principal: ${npr.format(principal)}`}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Y{d.year}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-indigo-500" />
          <span className="text-slate-500">Principal · {npr.format(principal)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-400" />
          <span className="text-slate-500">Interest · {npr.format(gain)}</span>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-800">
        In {years} years you'll have <span className="font-bold">{npr.format(final)}</span> — that's <span className="font-bold">{npr.format(gain)}</span> of pure interest.
      </div>
    </div>
  );
};

/* ─────────────────────── Create goal modal ─────────────────────── */

const CreateGoalModal: React.FC<{
  onClose: () => void;
  onCreate: () => void;
  state: { title: string; target: string; emoji: string };
  setState: React.Dispatch<React.SetStateAction<{ title: string; target: string; emoji: string }>>;
}> = ({ onClose, onCreate, state, setState }) => {
  const EMOJIS = ['🎯', '🏔️', '💻', '🎓', '💍', '🏠', '🚗', '✈️', '👶', '🎁'];
  return (
    <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Create savings goal</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700" aria-label="Close">
            ✕
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Goal name</label>
            <input
              type="text"
              value={state.title}
              onChange={(e) => setState((s) => ({ ...s, title: e.target.value }))}
              placeholder="e.g. Dashain trip"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Target (NPR)</label>
            <input
              type="number"
              value={state.target}
              onChange={(e) => setState((s) => ({ ...s, target: e.target.value }))}
              placeholder="50000"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setState((s) => ({ ...s, emoji: e }))}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition ${
                    state.emoji === e ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-slate-100">
          <button
            onClick={onCreate}
            disabled={!state.title || !state.target}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4" /> Create goal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Savings;
