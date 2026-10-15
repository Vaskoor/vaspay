/**
 * VasPay — Nepal's First Agentic AI Digital Wallet
 * Copyright (c) 2025 VasPay. MIT License.
 *
 * BankTransfer page — bank search (filter NEPALI_BANKS), account number,
 * amount, confirm → success.
 */
import React, { useMemo, useState } from 'react';
import { NEPALI_BANKS, MOCK_USER } from '../constants';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Landmark,
  Loader2,
  Search,
  User as UserIcon,
} from 'lucide-react';

interface BankTransferProps {
  onBack: () => void;
}

interface NepaliBank {
  id: string;
  name: string;
  short: string;
  color?: string;
}

const npr = new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 2 });

const BankTransfer: React.FC<BankTransferProps> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [bank, setBank] = useState<NepaliBank | null>(null);
  const [account, setAccount] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [step, setStep] = useState<'select' | 'enter' | 'processing' | 'success'>('select');

  const filtered = useMemo(() => {
    // vp-A is expected to provide NEPALI_BANKS; cast defensively.
    const list = ((NEPALI_BANKS ?? []) as unknown as NepaliBank[]);
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter(
      (b) => b.name.toLowerCase().includes(q) || (b.short ?? '').toLowerCase().includes(q),
    );
  }, [query]);

  const numAmount = parseFloat(amount) || 0;
  const canConfirm = bank && account.length >= 6 && name.trim().length > 0 && numAmount > 0;

  const handleConfirm = () => {
    setStep('processing');
    setTimeout(() => setStep('success'), 1500);
  };

  // ───── success ───────────────────────────────────────────────
  if (step === 'success' && bank) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Transfer successful!</h2>
        <p className="text-slate-500 mt-2">
          {npr.format(numAmount)} sent to {name}.
        </p>
        <div className="mt-6 w-full rounded-2xl bg-white border border-slate-200 shadow-sm divide-y divide-slate-100">
          <Row label="Bank" value={bank.name} />
          <Row label="Account no." value={account} />
          <Row label="Beneficiary" value={name} />
          <Row label="Amount" value={npr.format(numAmount)} strong />
          <Row label="Remarks" value={remarks || '—'} />
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

  // ───── main ──────────────────────────────────────────────────
  return (
    <div className="min-h-full bg-slate-50">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 transition" aria-label="Back">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Bank transfer</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Account summary */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-5 text-white shadow-lg shadow-amber-200">
          <p className="text-xs text-amber-50">From VasPay wallet</p>
          <h2 className="text-3xl font-extrabold">{npr.format(MOCK_USER.balance)}</h2>
          <p className="mt-2 text-xs text-amber-100">Available to transfer</p>
        </div>

        {step === 'select' && (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Nepali banks…"
                className="w-full bg-white pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <h3 className="px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                {query ? 'Matching banks' : 'Popular banks'}
              </h3>
              <ul className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
                {filtered.map((b) => (
                  <li key={b.id}>
                    <button
                      onClick={() => {
                        setBank(b);
                        setStep('enter');
                      }}
                      className="w-full px-5 py-4 flex items-center gap-4 hover:bg-indigo-50 transition-colors text-left group"
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                        style={{ background: b.color ?? '#4f46e5' }}
                      >
                        {(b.short ?? b.name).slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{b.name}</p>
                        {b.short && <p className="text-xs text-slate-500">{b.short}</p>}
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </button>
                  </li>
                ))}
                {filtered.length === 0 && (
                  <li className="px-5 py-12 text-center text-sm text-slate-400">No banks found.</li>
                )}
              </ul>
            </div>
          </>
        )}

        {step === 'enter' && bank && (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-5">
            {/* Selected bank chip */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                style={{ background: bank.color ?? '#4f46e5' }}
              >
                {(bank.short ?? bank.name).slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{bank.name}</p>
                <p className="text-xs text-slate-500">{bank.short ?? 'Nepal'}</p>
              </div>
              <button
                onClick={() => setStep('select')}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Change
              </button>
            </div>

            {/* Beneficiary name */}
            <Field label="Beneficiary name" icon={UserIcon}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Account holder's full name"
                className="w-full bg-transparent px-4 py-3.5 text-sm outline-none"
              />
            </Field>

            {/* Account number */}
            <Field label="Account number" icon={Building2}>
              <input
                type="text"
                inputMode="numeric"
                value={account}
                onChange={(e) => setAccount(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0001234567890"
                className="w-full bg-transparent px-4 py-3.5 text-sm font-mono outline-none"
              />
            </Field>

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
            </div>

            {/* Remarks */}
            <Field label="Remarks (optional)">
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Family, rent, school…"
                className="w-full bg-transparent px-4 py-3.5 text-sm outline-none"
              />
            </Field>

            <button
              onClick={handleConfirm}
              disabled={!canConfirm || step === 'processing'}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow active:scale-95 transition flex items-center justify-center gap-2"
            >
              {step === 'processing' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing…
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" /> Confirm transfer
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────── helpers ─────────────────────── */

const Row: React.FC<{ label: string; value: string; strong?: boolean }> = ({ label, value, strong }) => (
  <div className="px-4 py-3 flex items-center justify-between gap-3">
    <span className="text-xs text-slate-500 flex-shrink-0">{label}</span>
    <span className={`text-sm ${strong ? 'font-bold text-indigo-700' : 'font-medium text-slate-800'} text-right break-all`}>
      {value}
    </span>
  </div>
);

const Field: React.FC<{ label: string; icon?: React.ElementType; children: React.ReactNode }> = ({
  label,
  icon: Icon,
  children,
}) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
    <div className="rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 flex items-center">
      {Icon && <Icon className="w-5 h-5 text-slate-400 ml-3.5" />}
      {children}
    </div>
  </div>
);

export default BankTransfer;
