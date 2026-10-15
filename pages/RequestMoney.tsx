/**
 * VasPay — Nepal's First Agentic AI Digital Wallet
 * Copyright (c) 2025 VasPay. MIT License.
 *
 * RequestMoney page — your VasPay QR (rendered as a deterministic faux QR
 * grid), VasPay ID, request-from-friend contact picker + amount, and a
 * share-link button.
 */
import React, { useMemo, useState } from 'react';
import { MOCK_CONTACTS, MOCK_USER } from '../constants';
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Download,
  Link2,
  Search,
  Share2,
  User as UserIcon,
  X,
} from 'lucide-react';

interface RequestMoneyProps {
  onBack: () => void;
}

const npr = new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 2 });

/** Deterministic pseudo-random generator (mulberry32) so the faux QR is stable. */
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Render a faux QR code as a CSS grid. Looks like a QR, isn't a real one. */
const FauxQR: React.FC<{ size?: number; payload: string }> = ({ size = 200, payload }) => {
  const dim = 21;
  const cells = useMemo(() => {
    const rng = makeRng(payload.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
    const grid: boolean[][] = Array.from({ length: dim }, () => Array(dim).fill(false));
    for (let y = 0; y < dim; y++) for (let x = 0; x < dim; x++) grid[y][x] = rng() > 0.55;

    // Finder squares
    const stamp = (ox: number, oy: number) => {
      for (let y = 0; y < 7; y++)
        for (let x = 0; x < 7; x++) {
          const onBorder = x === 0 || x === 6 || y === 0 || y === 6;
          const onCenter = x >= 2 && x <= 4 && y >= 2 && y <= 4;
          grid[oy + y][ox + x] = onBorder || onCenter;
        }
    };
    stamp(0, 0);
    stamp(dim - 7, 0);
    stamp(0, dim - 7);
    // quiet zones around finders
    for (let y = 0; y < dim; y++) for (let x = 0; x < dim; x++) {
      const inFinder = (x < 8 && y < 8) || (x > dim - 9 && y < 8) || (x < 8 && y > dim - 9);
      if (inFinder && !((x < 7 && y < 7) || (x > dim - 8 && y < 7) || (x < 7 && y > dim - 8))) grid[y][x] = false;
    }
    return grid;
  }, [payload]);

  return (
    <div
      className="rounded-xl bg-white p-3 shadow-inner ring-1 ring-slate-200"
      style={{ width: size, height: size }}
      aria-label="Your VasPay QR code"
      role="img"
    >
      <div
        className="grid gap-0 w-full h-full"
        style={{ gridTemplateColumns: `repeat(${dim}, 1fr)` }}
      >
        {cells.flat().map((on, i) => (
          <div key={i} className={on ? 'bg-slate-900' : 'bg-transparent'} />
        ))}
      </div>
    </div>
  );
};

const RequestMoney: React.FC<RequestMoneyProps> = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [picked, setPicked] = useState<typeof MOCK_CONTACTS[number] | null>(null);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const vasPayId = `vaspay@${MOCK_USER.id}`;
  const shareLink = `https://vaspay.app/pay/${MOCK_USER.id}`;
  const numAmount = parseFloat(amount) || 0;

  const filtered = MOCK_CONTACTS.filter((c) =>
    search.length === 0 ? true : c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search),
  );

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
    } catch {
      /* clipboard may be blocked in sandbox */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const sendRequest = () => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setAmount('');
      setNote('');
      setPicked(null);
    }, 2500);
  };

  return (
    <div className="min-h-full bg-slate-50">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 transition" aria-label="Back">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Request money</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* My QR card */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center">
          <div className="relative">
            <FauxQR payload={vasPayId} size={210} />
            {/* Center logo chip */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white ring-1 ring-slate-200 shadow flex items-center justify-center">
              <span className="text-indigo-600 font-black text-xl">V</span>
            </div>
          </div>
          <h3 className="mt-5 font-bold text-slate-900">{MOCK_USER.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">VasPay ID · {vasPayId}</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 active:scale-95 transition"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Link copied' : 'Copy link'}
            </button>
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 active:scale-95 transition"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 active:scale-95 transition"
            >
              <Download className="w-4 h-4" /> Save QR
            </button>
          </div>
        </div>

        {/* Request from friend */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserIcon className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-900">Request from a friend</h3>
          </div>

          {/* Contact picker trigger */}
          <button
            onClick={() => setPickerOpen(true)}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-left"
          >
            {picked ? (
              <>
                <img src={picked.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{picked.name}</p>
                  <p className="text-xs text-slate-500">{picked.phone}</p>
                </div>
                <X
                  className="w-4 h-4 text-slate-400 hover:text-rose-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPicked(null);
                  }}
                />
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <UserIcon className="w-5 h-5" />
                </div>
                <span className="text-sm text-slate-500">Choose a contact to request from…</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Amount</label>
              <div className="rounded-xl border border-slate-200 px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-slate-400 font-semibold">Rs.</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="flex-1 bg-transparent text-lg font-bold text-slate-900 outline-none w-full"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Note</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Dinner split…"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={sendRequest}
            disabled={!picked || numAmount <= 0 || sent}
            className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow active:scale-95 transition flex items-center justify-center gap-2"
          >
            {sent ? (
              <>
                <CheckCircle2 className="w-5 h-5" /> Request sent!
              </>
            ) : (
              <>
                <Link2 className="w-5 h-5" /> Send request{npr.format(numAmount).replace('NPR', '').trim() && ` for ${npr.format(numAmount)}`}
              </>
            )}
          </button>
        </div>

        {/* Shareable link preview */}
        <div className="rounded-2xl bg-slate-900 text-white p-5">
          <div className="flex items-center gap-2 text-slate-300 text-xs uppercase tracking-wider mb-2">
            <Link2 className="w-3.5 h-3.5" /> Your shareable link
          </div>
          <p className="text-sm font-mono break-all text-slate-200">{shareLink}</p>
        </div>
      </div>

      {/* Contact picker modal */}
      {pickerOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search contacts…"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>
              <button onClick={() => setPickerOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ul className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {filtered.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setPicked(c);
                      setPickerOpen(false);
                      setSearch('');
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 text-left"
                  >
                    <img src={c.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.phone}</p>
                    </div>
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-4 py-10 text-center text-sm text-slate-400">No contacts found.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestMoney;
