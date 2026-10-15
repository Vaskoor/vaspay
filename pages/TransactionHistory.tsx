/**
 * VasPay — Nepal's First Agentic AI Digital Wallet
 * Copyright (c) 2025 VasPay. MIT License.
 *
 * TransactionHistory page — search + category filter + status filter,
 * grouped-by-date transaction list (in/out icons, color-coded, status
 * badge), tap a tx → detail drawer. Shows an extended 15-item history.
 */
import React, { useMemo, useState } from 'react';
import { MOCK_TRANSACTIONS } from '../constants';
import { Transaction } from '../types';
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Search,
  X,
  XCircle,
  Filter,
  type LucideIcon,
} from 'lucide-react';

interface TransactionHistoryProps {
  onBack: () => void;
}

type Category = 'all' | 'food' | 'utilities' | 'entertainment' | 'shopping' | 'transport' | 'others';
type Status = 'all' | 'success' | 'pending' | 'failed';

const npr = new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 2 });

/** Derive a 15-entry history by extending MOCK_TRANSACTIONS with deterministic extra rows. */
function buildHistory(): Transaction[] {
  const base: Transaction[] = [...MOCK_TRANSACTIONS];
  const extra: Array<Partial<Transaction> & { recipient: string; amount: number; category: Transaction['category'] }> = [
    { recipient: 'Daraz', amount: 2200, category: 'shopping', description: 'Phone case', type: 'payment' },
    { recipient: 'Foodmandu', amount: 650, category: 'food', description: 'Lunch', type: 'payment' },
    { recipient: 'Khalti Bills', amount: 1800, category: 'utilities', description: 'TV recharge', type: 'bill_payment' },
    { recipient: 'Pathao Ride', amount: 280, category: 'transport', description: 'Ride home', type: 'payment' },
    { recipient: 'Bhatbhateni', amount: 3100, category: 'shopping', description: 'Groceries', type: 'payment' },
    { recipient: 'QFX Cinemas', amount: 600, category: 'entertainment', description: 'Movie ticket', type: 'payment' },
    { recipient: 'Worldlink', amount: 1300, category: 'utilities', description: 'Internet', type: 'bill_payment' },
    { recipient: 'Sita Sharma', amount: 2500, category: 'others', description: 'Birthday gift', type: 'payment' },
    { recipient: 'NEA', amount: 1100, category: 'utilities', description: 'Electricity', type: 'bill_payment' },
    { recipient: 'Burger House', amount: 980, category: 'food', description: 'Dinner', type: 'payment' },
  ];

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const txs: Transaction[] = [...base];
  extra.forEach((e, i) => {
    txs.push({
      id: `ext-${i + 1}`,
      type: (e.type as Transaction['type']) ?? 'payment',
      amount: e.amount,
      currency: 'NPR',
      date: new Date(now - (4 + i) * dayMs - (i % 3) * 3 * 60 * 60 * 1000).toISOString(),
      recipient: e.recipient,
      description: e.description ?? 'Transaction',
      category: e.category,
      status: i % 7 === 6 ? 'pending' : i % 9 === 8 ? 'failed' : 'success',
    });
  });
  return txs.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

const CATEGORY_OPTIONS: { id: Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'food', label: 'Food' },
  { id: 'utilities', label: 'Utilities' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'transport', label: 'Transport' },
  { id: 'entertainment', label: 'Fun' },
  { id: 'others', label: 'Others' },
];

const STATUS_ICON: Record<Transaction['status'], LucideIcon> = {
  success: CheckCircle2,
  pending: Clock,
  failed: XCircle,
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState<Category>('all');
  const [status, setStatus] = useState<Status>('all');
  const [selected, setSelected] = useState<Transaction | null>(null);

  const history = useMemo(() => buildHistory(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return history.filter((t) => {
      if (cat !== 'all' && t.category !== cat) return false;
      if (status !== 'all' && t.status !== status) return false;
      if (q) {
        const hay = `${t.recipient ?? ''} ${t.sender ?? ''} ${t.description} ${t.amount}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [history, search, cat, status]);

  // group by date label (Today / Yesterday / date)
  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    filtered.forEach((t) => {
      const key = dateLabel(t.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const totalIn = filtered.filter((t) => t.type === 'receive').reduce((s, t) => s + t.amount, 0);
  const totalOut = filtered
    .filter((t) => t.type !== 'receive')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-full bg-slate-50">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 transition" aria-label="Back">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Transactions</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
            <p className="text-xs text-emerald-700 font-medium">Money in</p>
            <p className="text-xl font-bold text-emerald-700">{npr.format(totalIn)}</p>
          </div>
          <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4">
            <p className="text-xs text-rose-700 font-medium">Money out</p>
            <p className="text-xl font-bold text-rose-700">{npr.format(totalOut)}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions, merchants, amounts…"
            className="w-full bg-white pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORY_OPTIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                cat === c.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {(['all', 'success', 'pending', 'failed'] as Status[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                status === s ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Grouped list */}
        {groups.length === 0 ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center">
            <p className="text-sm text-slate-400">No transactions match your filters.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {groups.map(([label, txs]) => (
              <div key={label}>
                <h3 className="px-1 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</h3>
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
                  {txs.map((tx) => {
                    const isIn = tx.type === 'receive';
                    const SIcon = STATUS_ICON[tx.status];
                    return (
                      <button
                        key={tx.id}
                        onClick={() => setSelected(tx)}
                        className="w-full p-3.5 flex items-center gap-3 hover:bg-slate-50 transition text-left"
                      >
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center ${
                            isIn ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {isIn ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {tx.recipient || tx.sender || 'Unknown'}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {tx.description} · <span className="capitalize">{tx.category}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${isIn ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {isIn ? '+' : '−'}
                            {npr.format(tx.amount)}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mt-0.5 ${
                              tx.status === 'success'
                                ? 'bg-emerald-50 text-emerald-600'
                                : tx.status === 'pending'
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            <SIcon className="w-2.5 h-2.5" />
                            {tx.status}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <DetailDrawer tx={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

/* ───────────────────────── helpers ───────────────────────── */

function dateLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' });
}

const DetailDrawer: React.FC<{ tx: Transaction; onClose: () => void }> = ({ tx, onClose }) => {
  const isIn = tx.type === 'receive';
  const SIcon = STATUS_ICON[tx.status];
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white shadow-2xl overflow-hidden animate-[popIn_0.2s_ease-out]">
        <div
          className={`p-6 text-center text-white ${
            isIn ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-indigo-600 to-violet-700'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
            {isIn ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
          </div>
          <p className="text-xs opacity-80">{isIn ? 'Money in' : 'Money out'}</p>
          <h3 className="text-3xl font-extrabold">
            {isIn ? '+' : '−'}
            {npr.format(tx.amount)}
          </h3>
          <p className="text-sm opacity-90 mt-1">{tx.recipient || tx.sender || '—'}</p>
        </div>
        <div className="p-5 space-y-3">
          <Row label="Status" value={tx.status} icon={<SIcon className="w-3 h-3" />} />
          <Row label="Description" value={tx.description} />
          <Row label="Category" value={tx.category} />
          <Row label="Type" value={tx.type} />
          <Row label="Date" value={new Date(tx.date).toLocaleString('en-NP')} />
          <Row label="Transaction ID" value={tx.id} />
        </div>
        <div className="p-5 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" /> Close
          </button>
        </div>
      </div>
      <style>{`@keyframes popIn { from { transform: scale(0.96); opacity: 0 } to { transform: scale(1); opacity: 1 } }`}</style>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex items-start justify-between gap-3 text-sm">
    <span className="text-slate-500 flex-shrink-0">{label}</span>
    <span className="font-medium text-slate-800 text-right capitalize flex items-center gap-1.5">
      {icon}
      {value}
    </span>
  </div>
);

export default TransactionHistory;
