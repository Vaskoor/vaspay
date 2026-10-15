/**
 * VasPay — Nepal's First Agentic AI Digital Wallet
 * Copyright (c) 2025 VasPay. MIT License.
 *
 * ScanPay page — full-screen faux camera viewfinder with corner brackets,
 * scanning animation, detected-merchant card, amount, "Pay NPR X" →
 * processing → success. No real camera required.
 */
import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';

interface ScanPayProps {
  onBack: () => void;
}

type Stage = 'scanning' | 'detected' | 'paying' | 'success';

const MERCHANT = {
  name: 'Bhatbhateni Supermarket',
  branch: 'Koteshwor Branch',
  emoji: 'B',
  accent: 'from-orange-500 to-amber-500',
  amount: 1250,
};

const npr = new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 2 });

const ScanPay: React.FC<ScanPayProps> = ({ onBack }) => {
  const [stage, setStage] = useState<Stage>('scanning');
  const [amount, setAmount] = useState(String(MERCHANT.amount));

  // Auto-detect after 2.5s
  useEffect(() => {
    if (stage !== 'scanning') return;
    const t = setTimeout(() => setStage('detected'), 2500);
    return () => clearTimeout(t);
  }, [stage]);

  const pay = () => {
    setStage('paying');
    setTimeout(() => setStage('success'), 1500);
  };

  // ───── success ────────────────────────────────────────────────
  if (stage === 'success') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-extrabold">Payment successful</h2>
        <p className="text-slate-300 mt-2">
          {npr.format(parseFloat(amount) || 0)} paid to
        </p>
        <p className="text-white font-semibold mt-0.5">{MERCHANT.name}</p>
        <p className="mt-1 text-xs text-slate-400">Transaction ID · VX{Date.now().toString().slice(-8)}</p>
        <button
          onClick={onBack}
          className="mt-8 bg-white text-slate-900 font-bold px-8 py-3.5 rounded-xl shadow hover:shadow-lg active:scale-95 transition"
        >
          Done
        </button>
      </div>
    );
  }

  // ───── scanning / detected ──────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col">
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-20 p-5 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center hover:bg-white/25 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-lg">Scan & Pay</h2>
        <div className="w-10 h-10" />
      </div>

      {/* Viewfinder */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* faux camera backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.18), transparent 60%), radial-gradient(circle at 70% 70%, rgba(139,92,246,0.18), transparent 55%)',
          }}
          aria-hidden
        />

        {stage === 'scanning' && (
          <div className="relative flex flex-col items-center">
            {/* Frame with corner brackets */}
            <div className="relative w-72 h-72 rounded-3xl">
              <Corner className="-top-1 -left-1 border-t-4 border-l-4 rounded-tl-3xl" />
              <Corner className="-top-1 -right-1 border-t-4 border-r-4 rounded-tr-3xl" />
              <Corner className="-bottom-1 -left-1 border-b-4 border-l-4 rounded-bl-3xl" />
              <Corner className="-bottom-1 -right-1 border-b-4 border-r-4 rounded-br-3xl" />

              <div className="absolute inset-4 rounded-2xl border border-white/10 overflow-hidden">
                <div className="scan-line" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/70 text-sm animate-pulse flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Locating QR…
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-8 text-center text-slate-300 text-sm px-8 max-w-xs">
              Align the merchant QR code inside the frame to pay instantly.
            </p>
          </div>
        )}

        {stage === 'detected' && (
          <div className="w-80 max-w-[90vw] rounded-3xl bg-white text-slate-900 p-6 shadow-2xl animate-[popIn_0.25s_ease-out]">
            <div className="flex flex-col items-center mb-5">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${MERCHANT.accent} flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-3`}>
                {MERCHANT.emoji}
              </div>
              <h3 className="font-bold text-lg text-slate-900 text-center">{MERCHANT.name}</h3>
              <p className="text-xs text-slate-500">{MERCHANT.branch}</p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Amount (NPR)</label>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-slate-400 font-semibold">Rs.</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 bg-transparent text-2xl font-bold text-slate-900 outline-none"
                  aria-label="Payment amount"
                />
              </div>
            </div>

            <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-100 p-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" fill="currentColor" />
              <p className="text-xs text-emerald-700">
                VasPay AI: merchant verified, low fraud risk.
              </p>
            </div>

            <button
              onClick={pay}
              disabled={stage === 'paying'}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow active:scale-95 transition flex items-center justify-center gap-2"
            >
              {stage === 'paying' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing…
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" /> Pay {npr.format(parseFloat(amount) || 0)}
                </>
              )}
            </button>

            <button
              onClick={onBack}
              className="mt-2 w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Trust footer */}
        {stage === 'scanning' && (
          <div className="absolute bottom-6 inset-x-0 px-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Secured by 256-bit encryption · VasPay AI screening
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .scan-line {
          position: absolute;
          left: 0; right: 0; top: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgb(129,140,248), rgb(167,139,250), transparent);
          box-shadow: 0 0 16px rgba(129,140,248,0.9);
          animation: scan 2.2s ease-in-out infinite;
        }
        @keyframes popIn {
          from { transform: scale(0.94); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const Corner: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`absolute w-8 h-8 border-indigo-400 ${className ?? ''}`} />
);

export default ScanPay;
