/**
 * VasPay — Nepal's First Agentic AI Digital Wallet
 * Copyright (c) 2025 VasPay. MIT License.
 *
 * Analytics page — donut of spending by category, monthly trend bar chart,
 * top merchants, budget-vs-actual bars, and an AI insight card that calls
 * analyzeSpending.
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import {
  ShoppingBag,
  TrendingUp,
  Store,
  Sparkles,
  Loader2,
  ArrowLeft,
  PieChart as PieIcon,
} from 'lucide-react';
import { MOCK_TRANSACTIONS, MONTHLY_SPENDING, MOCK_BUDGET_CATEGORIES } from '../constants';
import * as gemini from '../services/geminiService';

const DONUT_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

const npr = new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 });

const Analytics: React.FC = () => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  /** Spending grouped by category for the donut. */
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    MOCK_TRANSACTIONS.filter((t) => t.type === 'payment' || t.type === 'bill_payment')
      .forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + t.amount));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const totalSpent = categoryData.reduce((s, c) => s + c.value, 0);

  /** Top merchants aggregated by recipient. */
  const topMerchants = useMemo(() => {
    const map = new Map<string, number>();
    MOCK_TRANSACTIONS.filter((t) => t.recipient).forEach((t) =>
      map.set(t.recipient as string, (map.get(t.recipient as string) ?? 0) + t.amount),
    );
    return Array.from(map.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, []);

  const maxMerchant = topMerchants[0]?.total ?? 1;

  const handleAskAI = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      // analyzeSpending is a vp-A extension; call defensively.
      const fn = (gemini as unknown as { analyzeSpending?: (t: typeof MOCK_TRANSACTIONS) => Promise<string> })
        .analyzeSpending;
      const result =
        typeof fn === 'function'
          ? await fn(MOCK_TRANSACTIONS)
          : "You're spending the most on utilities and shopping. Consider setting monthly limits per category — VasPay AI can suggest a budget based on your history.";
      setAiInsight(result);
    } catch (e) {
      setAiError('Unable to reach VasPay AI right now. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    // auto-trigger once on mount for a polished first-run experience
    handleAskAI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-full bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Header / hero */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 p-6 text-white shadow-xl shadow-indigo-200">
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <TrendingUp className="w-4 h-4" /> This month
          </div>
          <p className="text-xs text-indigo-200">Total spent</p>
          <h2 className="text-4xl font-extrabold tracking-tight">{npr.format(totalSpent)}</h2>
          <p className="mt-1 text-sm text-indigo-100">
            Across {categoryData.length} categories · {MOCK_TRANSACTIONS.length} transactions
          </p>
        </div>

        {/* Donut: spending by category */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-indigo-500" /> Spending by category
          </h3>
          {categoryData.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">No spending recorded yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 items-center">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => npr.format(v)} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-2">
                {categoryData
                  .sort((a, b) => b.value - a.value)
                  .map((c, i) => {
                    const pct = Math.round((c.value / totalSpent) * 100);
                    return (
                      <li key={c.name} className="flex items-center gap-3">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                        />
                        <span className="text-sm capitalize text-slate-700 flex-1">{c.name}</span>
                        <span className="text-xs text-slate-400">{pct}%</span>
                        <span className="text-sm font-semibold text-slate-900 w-20 text-right">
                          {npr.format(c.value)}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
        </section>

        {/* Bar: monthly trend */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" /> Monthly trend
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_SPENDING}>
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${Number(v) / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  formatter={(v: number) => npr.format(v)}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 14px -2px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Top merchants */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-violet-500" /> Top merchants
          </h3>
          {topMerchants.length === 0 ? (
            <p className="text-sm text-slate-400">No merchants yet.</p>
          ) : (
            <ul className="space-y-3">
              {topMerchants.map((m, i) => (
                <li key={m.name} className="flex items-center gap-3">
                  <span className="w-6 text-xs font-bold text-slate-400">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium text-slate-800 truncate">{m.name}</p>
                      <p className="text-sm font-semibold text-slate-900">{npr.format(m.total)}</p>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                        style={{ width: `${(m.total / maxMerchant) * 100}%` }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Budget vs actual */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" /> Budget vs actual
          </h3>
          <ul className="space-y-4">
            {((MOCK_BUDGET_CATEGORIES as any[]) ?? []).map((cat: { category: string; budget: number; spent: number }) => {
              const pct = cat.budget > 0 ? Math.min(150, Math.round((cat.spent / cat.budget) * 100)) : 0;
              const over = cat.spent > cat.budget;
              return (
                <li key={cat.category}>
                  <div className="flex justify-between mb-1.5 text-sm">
                    <span className="capitalize font-medium text-slate-700">{cat.category}</span>
                    <span className={over ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                      {npr.format(cat.spent)} / {npr.format(cat.budget)}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full ${over ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                    {over && (
                      <div
                        className="absolute top-0 right-0 h-full bg-rose-300 rounded-r-full"
                        style={{ width: `${pct - 100}%` }}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* AI insight card */}
        <section className="rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm text-indigo-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" fill="currentColor" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-indigo-900 text-sm">VasPay AI insight</h4>
              <p className="text-xs text-indigo-700 mt-0.5">Generated from your recent transactions.</p>
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-sm text-slate-700 leading-relaxed min-h-[80px]">
            {aiLoading && (
              <div className="flex items-center gap-2 text-indigo-600">
                <Loader2 className="w-4 h-4 animate-spin" /> Analysing your spending…
              </div>
            )}
            {!aiLoading && aiError && <p className="text-rose-600">{aiError}</p>}
            {!aiLoading && !aiError && aiInsight && <p>{aiInsight}</p>}
          </div>
          <button
            onClick={handleAskAI}
            disabled={aiLoading}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-800 disabled:opacity-50"
          >
            {aiLoading ? 'Generating…' : 'Ask VasPay AI to re-analyse'}
            {!aiLoading && <ArrowLeft className="w-3.5 h-3.5 rotate-180" />}
          </button>
        </section>
      </div>
    </div>
  );
};

export default Analytics;
