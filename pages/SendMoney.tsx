/**
 * VasPay — Nepal's First Agentic AI Digital Wallet
 * Copyright (c) 2025 VasPay. MIT License.
 *
 * SendMoney page — multi-step flow:
 *   enter (recipient + amount + remarks)
 *   → risk-check (detectFraudRisk + detectAnomaly)
 *   → confirm
 *   → success (checkmark + tx id).
 * Includes contact autocomplete from MOCK_CONTACTS.
 */
import React, { useMemo, useState } from 'react';
import * as gemini from '../services/geminiService';
import { MOCK_CONTACTS, MOCK_USER } from '../constants';
import { Transaction } from '../types';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  User as UserIcon,
  X,
} from 'lucide-react';

interface SendMoneyProps {
  onBack: () => void;
}

type Step = 'enter' | 'analyzing' | 'risk' | 'processing' | 'success';
type Risk = 'low' | 'medium' | 'high';

interface RiskResult {
  risk: Risk;
  reason: string;
  anomaly?: string;
}

const npr = new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 2 });

const RISK_STYLES: Record<Risk, { ring: string; bg: string; text: string; chip: string }> = {
  low: { ring: 'ring-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-700', chip: 'bg-emerald-500' },
  medium: { ring: 'ring-amber-200', bg: 'bg-amber-50', text: 'text-amber-700', chip: 'bg-amber-500' },
  high: { ring: 'ring-rose-200', bg: 'bg-rose-50', text: 'text-rose-700', chip: 'bg-rose-500' },
};

const SendMoney: React.FC<SendMoneyProps> = ({ onBack }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [step, setStep] = useState<Step>('enter');
  const [risk, setRisk] = useState<RiskResult | null>(null);
  const [txId, setTxId] = useState<string>('');

  const filtered = useMemo(
    () =>
      MOCK_CONTACTS.filter(
        (c) =>
          recipient.length > 0 &&
          (c.name.toLowerCase().includes(recipient.toLowerCase()) || c.phone.includes(recipient)),
      ),
    [recipient],
  );

  const numAmount = parseFloat(amount) || 0;
  const canAnalyze = recipient.trim().length >= 3 && numAmount > 0;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setStep('analyzing');
    setRisk(null);

    const draft: Transaction = {
      id: `draft-${Date.now()}`,
      type: 'payment',
      amount: numAmount,
      currency: 'NPR',
      date: new Date().toISOString(),
      recipient,
      description: remarks || 'P2P transfer',
      category: 'others',
      status: 'pending',
    };

    try {
      // detectFraudRisk is guaranteed by the service bundle; detectAnomaly is
      // an optional vp-A extension — call defensively so the page never breaks.
      const fraud = await gemini.detectFraudRisk(draft).catch(() => ({
        risk: 'low' as Risk,
        reason: 'Risk service unavailable.',
      }));

      const anomalyFn = (gemini as unknown as { detectAnomaly?: (t: Transaction) => Promise<string> })
        .detectAnomaly;
      const anomalyRes =
        typeof anomalyFn === 'function'
          ? await anomalyFn(draft).catch(() => undefined)
          : undefined;

      const r: RiskResult = {
        risk: (fraud.risk as Risk) ?? 'low',
        reason: fraud.reason || 'No anomalies detected.',
        anomaly: typeof anomalyRes === 'string' ? anomalyRes : undefined,
      };
      setRisk(r);
      setStep('risk');
    } catch (e) {
      setRisk({ risk: 'low', reason: 'Risk service unavailable. Proceed with caution.' });
      setStep('risk');
    }
  };

  const handleConfirm = () => {
    setStep('processing');
    setTimeout(() => {
      setTxId(`VX${Math.random().toString(36).slice(2, 8).toUpperCase()}${Date.now().toString().slice(-4)}`);
      setStep('success');
    }, 1400);
  };

  // ───── success state ─────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Transfer successful!</h2>
        <p className="text-slate-500 mt-2">
          {npr.format(numAmount)} sent to <span className="font-semibold text-slate-700">{recipient}</span>.
        </p>
        <div className="mt-6 w-full rounded-2xl bg-white border border-slate-200 shadow-sm divide-y divide-slate-100">
          <Row label="Transaction ID" value={txId} />
          <Row label="From" value={MOCK_USER.name} />
          <Row label="To" value={recipient} />
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

  // ───── main flow ─────────────────────────────────────────────
  return (
    <div className="min-h-full bg-slate-50">
      {/* Stepper header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 transition" aria-label="Back">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Send money</h1>
          <StepPills step={step} className="ml-auto" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {step === 'risk' && risk ? (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
            <div className={`rounded-xl p-4 ring-1 ${RISK_STYLES[risk.risk].ring} ${RISK_STYLES[risk.risk].bg} mb-5`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${RISK_STYLES[risk.risk].text}`}>
                  {risk.risk === 'low' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold ${RISK_STYLES[risk.risk].text}`}>
                      VasPay AI security: {risk.risk.toUpperCase()} risk
                    </h3>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full text-white ${RISK_STYLES[risk.risk].chip}`}>
                      {risk.risk}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${RISK_STYLES[risk.risk].text}`}>{risk.reason}</p>
                  {risk.anomaly && (
                    <p className={`text-xs mt-2 ${RISK_STYLES[risk.risk].text}`}>
                      <span className="font-semibold">Anomaly:</span> {risk.anomaly}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Summary recipient={recipient} amount={numAmount} remarks={remarks} />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setStep('enter');
                  setRisk(null);
                }}
                className="flex-1 py-3.5 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-95 transition"
              >
                Edit
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 py-3.5 text-white font-semibold rounded-xl shadow active:scale-95 transition ${
                  risk.risk === 'high' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {risk.risk === 'high' ? 'Confirm anyway' : 'Confirm & send'}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-5">
            {/* Recipient */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Recipient
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="VasPay ID or mobile number"
                  className="w-full pl-10 pr-10 py-3.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {recipient && (
                  <button
                    onClick={() => {
                      setRecipient('');
                      setShowSuggestions(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label="Clear"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Autocomplete suggestions */}
              {showSuggestions && filtered.length > 0 && (
                <div className="mt-2 rounded-xl bg-white border border-slate-200 shadow-lg divide-y divide-slate-100 overflow-hidden">
                  {filtered.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setRecipient(c.name);
                        setShowSuggestions(false);
                      }}
                      className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-slate-50 text-left"
                    >
                      <img src={c.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.phone}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Amount keypad-feel */}
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
              <div className="mt-2 flex gap-2">
                {[500, 1000, 5000].map((q) => (
                  <button
                    key={q}
                    onClick={() => setAmount(String(q))}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-xs font-semibold text-slate-600 transition"
                  >
                    +{npr.format(q).replace('NPR', 'Rs.')}
                  </button>
                ))}
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Remarks
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Lunch, rent, gift…"
                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze || step === 'analyzing'}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow active:scale-95 transition flex items-center justify-center gap-2"
            >
              {step === 'analyzing' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Analysing risk…
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" /> Analyze risk & continue
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> VasPay AI screens every transfer before it leaves your wallet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────── helpers ─────────────────────────── */

const Row: React.FC<{ label: string; value: string; strong?: boolean }> = ({ label, value, strong }) => (
  <div className="px-4 py-3 flex items-center justify-between">
    <span className="text-xs text-slate-500">{label}</span>
    <span className={`text-sm ${strong ? 'font-bold text-indigo-700' : 'font-medium text-slate-800'}`}>{value}</span>
  </div>
);

const Summary: React.FC<{ recipient: string; amount: number; remarks: string }> = ({ recipient, amount, remarks }) => (
  <div className="space-y-2.5 py-1">
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">Recipient</span>
      <span className="font-semibold text-slate-900">{recipient}</span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">Amount</span>
      <span className="font-bold text-slate-900 text-lg">{npr.format(amount)}</span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">Remarks</span>
      <span className="text-slate-800">{remarks || '—'}</span>
    </div>
  </div>
);

const StepPills: React.FC<{ step: Step; className?: string }> = ({ step, className }) => {
  const order: Step[] = ['enter', 'analyzing', 'risk', 'processing', 'success'];
  const idx = order.indexOf(step);
  return (
    <div className={`flex items-center gap-1.5 ${className ?? ''}`}>
      {['Enter', 'Check', 'Confirm'].map((label, i) => {
        const done = i < idx || step === 'success';
        const active = i === idx && step !== 'success';
        return (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                done
                  ? 'bg-emerald-500 text-white'
                  : active
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {done ? <Check className="w-3 h-3" /> : i + 1}
            </div>
            <span className={`text-[10px] font-semibold hidden sm:inline ${done || active ? 'text-slate-800' : 'text-slate-400'}`}>
              {label}
            </span>
            {i < 2 && <div className="w-3 h-px bg-slate-300" />}
          </div>
        );
      })}
    </div>
  );
};

export default SendMoney;
