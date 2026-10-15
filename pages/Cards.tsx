/**
 * VasPay — Nepal's First Agentic AI Digital Wallet
 * Copyright (c) 2025 VasPay. MIT License.
 *
 * Cards page (NEW) — list MOCK_USER.cards as styled card-fronts (gradient,
 * chip, last4, brand), "Add card" button, and per-card details (limit,
 * expiry). Includes a faux EMV chip and brand mark.
 */
import React, { useState } from 'react';
import { MOCK_USER } from '../constants';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Plus,
  Snowflake,
  Trash2,
  Wifi,
  type LucideIcon,
} from 'lucide-react';

interface CardsProps {
  onBack?: () => void;
}

interface VasPayCard {
  id: string;
  brand: 'visa' | 'mastercard' | 'unionpay' | 'amex';
  last4: string;
  expiry: string;
  limit: number;
  spent?: number;
  frozen?: boolean;
  gradient: string;
}

const FALLBACK_CARDS: VasPayCard[] = [
  { id: 'c1', brand: 'visa', last4: '4321', expiry: '08/27', limit: 150000, spent: 28400, gradient: 'from-indigo-600 via-violet-600 to-indigo-800' },
  { id: 'c2', brand: 'mastercard', last4: '9876', expiry: '02/26', limit: 80000, spent: 4200, gradient: 'from-slate-800 via-slate-900 to-black' },
  { id: 'c3', brand: 'unionpay', last4: '0152', expiry: '11/28', limit: 50000, spent: 0, frozen: true, gradient: 'from-rose-600 via-rose-700 to-rose-900' },
];

const BRAND_LABEL: Record<VasPayCard['brand'], string> = {
  visa: 'VISA',
  mastercard: 'Mastercard',
  unionpay: 'UnionPay',
  amex: 'AMEX',
};

const npr = new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 });

/** Faux EMV chip — small 3×4 gold grid. */
const Chip: React.FC = () => (
  <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-400 p-1 shadow-inner">
    <div className="grid grid-cols-3 grid-rows-3 gap-0.5 h-full">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="rounded-[2px] bg-amber-500/30" />
      ))}
    </div>
  </div>
);

const Cards: React.FC<CardsProps> = ({ onBack }) => {
  const cards: VasPayCard[] = (MOCK_USER as any).cards ?? FALLBACK_CARDS;
  const [activeIdx, setActiveIdx] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [frozen, setFrozen] = useState<Record<string, boolean>>(
    Object.fromEntries(cards.map((c) => [c.id, !!c.frozen])),
  );

  const active = cards[activeIdx] ?? cards[0];

  const go = (dir: number) => {
    setActiveIdx((i) => (i + dir + cards.length) % cards.length);
    setReveal(false);
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 transition" aria-label="Back">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
          )}
          <h1 className="text-lg font-bold text-slate-900">My cards</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Card carousel */}
        <div className="relative">
          <div
            className={`relative aspect-[1.6] rounded-3xl bg-gradient-to-br ${active.gradient} text-white shadow-2xl shadow-indigo-300/40 p-6 overflow-hidden`}
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl" aria-hidden />
            <div className="absolute -bottom-16 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" aria-hidden />

            <div className="relative flex flex-col h-full justify-between">
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-80">VasPay</p>
                  <p className="text-sm font-bold">Digital Debit</p>
                </div>
                <Wifi className="w-6 h-6 rotate-90 opacity-90" />
              </div>

              {/* Chip + brand */}
              <div className="flex items-center justify-between">
                <Chip />
                <span className="text-lg font-black tracking-tight italic">{BRAND_LABEL[active.brand]}</span>
              </div>

              {/* Number */}
              <div>
                <div className="flex items-center gap-2 font-mono text-lg tracking-wider">
                  <span>••••</span>
                  <span>••••</span>
                  <span>••••</span>
                  <button
                    onClick={() => setReveal((r) => !r)}
                    className="ml-1 text-white/70 hover:text-white"
                    aria-label={reveal ? 'Hide number' : 'Reveal number'}
                  >
                    {reveal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <span className="font-bold">{reveal ? `1234 ${active.last4}` : active.last4}</span>
                </div>
              </div>

              {/* Bottom row */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-70">Card holder</p>
                  <p className="text-sm font-semibold">{MOCK_USER.name.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-70">Expires</p>
                  <p className="text-sm font-semibold font-mono">{active.expiry}</p>
                </div>
              </div>

              {frozen[active.id] && (
                <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ring-1 ring-white/30">
                  <Snowflake className="w-3 h-3" /> Frozen
                </div>
              )}
            </div>
          </div>

          {/* Carousel controls */}
          {cards.length > 1 && (
            <>
              <button
                onClick={() => go(-1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md shadow flex items-center justify-center hover:bg-white"
                aria-label="Previous card"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>
              <button
                onClick={() => go(1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md shadow flex items-center justify-center hover:bg-white"
                aria-label="Next card"
              >
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>
              <div className="mt-3 flex justify-center gap-1.5">
                {cards.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveIdx(i);
                      setReveal(false);
                    }}
                    className={`h-1.5 rounded-full transition-all ${i === activeIdx ? 'w-6 bg-indigo-600' : 'w-1.5 bg-slate-300'}`}
                    aria-label={`Card ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Card details */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-500" /> Card details
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <Stat label="Credit limit" value={npr.format(active.limit)} />
            <Stat label="Spent this cycle" value={npr.format(active.spent ?? 0)} />
            <Stat label="Available" value={npr.format(active.limit - (active.spent ?? 0))} accent="text-emerald-600" />
            <Stat label="Expires" value={active.expiry} />
          </div>

          {/* Utilisation bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Utilisation</span>
              <span>{Math.round(((active.spent ?? 0) / active.limit) * 100)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                style={{ width: `${Math.min(100, ((active.spent ?? 0) / active.limit) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card actions */}
        <div className="grid grid-cols-3 gap-3">
          <ActionButton
            icon={frozen[active.id] ? Snowflake : Lock}
            label={frozen[active.id] ? 'Unfreeze' : 'Freeze'}
            onClick={() => setFrozen((f) => ({ ...f, [active.id]: !f[active.id] }))}
            active={frozen[active.id]}
          />
          <ActionButton icon={Eye} label="Reveal" onClick={() => setReveal((r) => !r)} active={reveal} />
          <ActionButton icon={Trash2} label="Remove" danger />
        </div>

        {/* Add card */}
        <button className="w-full rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 p-5 flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-700 font-semibold text-sm transition-all">
          <Plus className="w-5 h-5" /> Add new card
        </button>

        {/* Security note */}
        <div className="rounded-2xl bg-slate-900 text-slate-200 p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 mb-2">
            <Lock className="w-3.5 h-3.5" /> PCI-DSS secured
          </div>
          <p className="text-sm leading-relaxed">
            Your card details are tokenised and never stored on VasPay servers. Every transaction is screened by VasPay AI in real time.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────── helpers ─────────────────────────── */

const Stat: React.FC<{ label: string; value: string; accent?: string }> = ({ label, value, accent }) => (
  <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</p>
    <p className={`text-sm font-bold ${accent ?? 'text-slate-900'}`}>{value}</p>
  </div>
);

const ActionButton: React.FC<{
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  active?: boolean;
  danger?: boolean;
}> = ({ icon: Icon, label, onClick, active, danger }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition active:scale-95 ${
      danger
        ? 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
        : active
        ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="text-xs font-semibold">{label}</span>
  </button>
);

export default Cards;
