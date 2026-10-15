/**
 * VasPay — Nepal's First Agentic AI Digital Wallet
 * Copyright (c) 2025 VasPay. MIT License.
 *
 * LoadMoney page — payment-method cards (Mobile Banking, eBanking,
 * Connect IPS, Card), amount entry, confirm → success.
 */
import React, { useMemo, useState } from 'react';
import { MOCK_USER } from '../constants';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Loader2,
  Smartphone,
  Globe,
  Zap,
  type LucideIcon,
} from 'lucide-react';

interface LoadMoneyProps {
  onBack: () => void;
}

interface Method {
  id: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  tint: string;
}

const METHODS: Method[] = [
  { id: 'mobile', title: 'Mobile Banking', desc: 'NIC Asia MoMe, Nabil Smart, Global IME', icon: Smartphone, tint: 'bg-violet-50 text-violet-600' },
  { id: 'ebanking', title: 'eBanking', desc: 'Direct from your bank account', icon: Globe, tint: 'bg-blue-50 text-blue-600' },
  { id: 'connect_ips', title: 'Connect IPS', desc: 'Nepal Clearing House network', icon: Building2, tint: 'bg-teal-50 text-teal-600' },
  { id: 'card', title: 'Debit / Credit Card', desc: 'Visa, Mastercard, UnionPay', icon: CreditCard, tint: 'bg-rose-50 text-rose-600' },
];

const npr = new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 2 });

const LoadMoney: React.FC<LoadMoneyProps> = ({ onBack }) => {
  const [selected, setSelected] = useState<Method | null>(null);
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'choose' | 'enter' | 'processing' | 'success'>('choose');

  const numAmount = parseFloat(amount) || 0;
  const newBalance = useMemo(() => MOCK_USER.balance + numAmount, [numAmount]);

  const handleConfirm = () => {
    setStep('processing');
    setTimeout(() => setStep('success'), 1400);
  };

  // ───── success ───────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Wallet topped up!</h2>
        <p className="text-slate-500 mt-2">
          {npr.format(numAmount)} loaded via {selected?.title}.
        </p>
        <div className="mt-6 w-full rounded-2xl bg-white border border-slate-200 shadow-sm divide-y divide-slate-100">
          <Row label="Method" value={selected?.title ?? '—'} />
          <Row label="Amount" value={npr.format(numAmount)} strong />
          <Row label="New balance" value={npr.format(newBalance)} />
          <Row label="Time" value={new Date().toLocaleString('en-NP')} />
        </div>
        <button
          onClick={onBack}
          className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow active:scale-95 transition"
        >
          Back to wallet
        </button>
      </div>
    );
  }

  // ───── main ───────────────────────────────────────────────────
  return (
    <div className="min-h-full bg-slate-50">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 transition" aria-label="Back">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Load funds</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Current balance */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-lg shadow-emerald-200">
          <p className="text-xs text-emerald-50">Current balance</p>
          <h2 className="text-3xl font-extrabold">{npr.format(MOCK_USER.balance)}</h2>
          <p className="mt-2 text-xs text-emerald-100 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Funds typically arrive within seconds.
          </p>
        </div>

        {step === 'choose' && (
          <>
            <p className="text-sm text-slate-500">Choose a method to add money to your VasPay wallet.</p>
            <div className="space-y-3">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelected(m);
                    setStep('enter');
                  }}
                  className="w-full rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] transition-all text-left"
                >
                  <div className={`w-12 h-12 rounded-xl ${m.tint} flex items-center justify-center`}>
                    <m.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{m.title}</p>
                    <p className="text-xs text-slate-500">{m.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'enter' && selected && (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-5">
            {/* Selected method */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className={`w-10 h-10 rounded-lg ${selected.tint} flex items-center justify-center`}>
                <selected.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{selected.title}</p>
                <p className="text-xs text-slate-500">{selected.desc}</p>
              </div>
              <button
                onClick={() => setStep('choose')}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Change
              </button>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Amount (NPR)
              </label>
              <div className="rounded-xl border border-slate-200 px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                <div className="flex items-baseline gap-2">
                  <span className="text-slate-400 font-semibold">Rs.</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 bg-transparent text-2xl font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {[1000, 5000, 10000, 25000].map((q) => (
                  <button
                    key={q}
                    onClick={() => setAmount(String(q))}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-xs font-semibold text-slate-600 transition"
                  >
                    Rs. {q.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={numAmount <= 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow active:scale-95 transition flex items-center justify-center gap-2"
            >
              {step === 'processing' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing…
                </>
              ) : (
                <>Load {numAmount > 0 ? npr.format(numAmount) : 'funds'}</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string; strong?: boolean }> = ({ label, value, strong }) => (
  <div className="px-4 py-3 flex items-center justify-between">
    <span className="text-xs text-slate-500">{label}</span>
    <span className={`text-sm ${strong ? 'font-bold text-emerald-700' : 'font-medium text-slate-800'}`}>{value}</span>
  </div>
);

export default LoadMoney;
