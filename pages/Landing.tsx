/**
 * VasPay — Nepal's First Agentic AI Digital Wallet
 * Copyright (c) 2025 VasPay. MIT License.
 *
 * Landing page — gradient hero, feature cards, trust badges,
 * primary/secondary CTAs, and a footer. Animated entrance.
 */
import React, { useEffect, useState } from 'react';
import {
  Brain,
  ShieldCheck,
  Zap,
  ChevronRight,
  ArrowRight,
  Lock,
  Landmark,
  Wallet,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

interface LandingProps {
  /** Called when the user taps the primary "Get Started" CTA. */
  onStart: () => void;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
  tint: string;
  ring: string;
}

const FEATURES: Feature[] = [
  {
    icon: Brain,
    title: 'Agentic AI Assistant',
    desc: 'VasPay AI analyses your spending, flags fraud, and suggests budgets tailored to Nepali life.',
    tint: 'bg-indigo-50 text-indigo-600',
    ring: 'ring-indigo-100',
  },
  {
    icon: ShieldCheck,
    title: 'Real-time Fraud Protection',
    desc: 'Every transfer is screened by an on-device risk model before a single rupee moves.',
    tint: 'bg-emerald-50 text-emerald-600',
    ring: 'ring-emerald-100',
  },
  {
    icon: Zap,
    title: 'Instant Transfers',
    desc: 'QR pay, bank transfers, and P2P send — cleared in seconds, 24×7.',
    tint: 'bg-violet-50 text-violet-600',
    ring: 'ring-violet-100',
  },
];

const TRUST = [
  { icon: Landmark, label: 'NRB Compliant' },
  { icon: Lock, label: '256-bit Encryption' },
  { icon: Wallet, label: 'PCI-DSS Ready' },
];

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* ───── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* gradient backdrop */}
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-700 via-violet-700 to-indigo-900"
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 opacity-30" aria-hidden>
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute top-40 -left-24 w-72 h-72 rounded-full bg-violet-400/30 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
          {/* Brand row */}
          <div
            className={`flex items-center gap-3 mb-12 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
            }`}
          >
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/30 flex items-center justify-center font-black text-white text-xl shadow-lg">
              V
            </div>
            <span className="text-white font-bold text-xl tracking-tight">VasPay</span>
            <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-white/80 bg-white/10 px-3 py-1.5 rounded-full ring-1 ring-white/20">
              <Sparkles className="w-3.5 h-3.5" /> Powered by Gemini
            </span>
          </div>

          <div className="max-w-3xl">
            <span
              className={`inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-indigo-100 bg-white/10 ring-1 ring-white/20 px-3 py-1.5 rounded-full mb-6 transition-all delay-75 duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Nepal's First Agentic AI Wallet
            </span>

            <h1
              className={`text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.05] mb-6 transition-all delay-150 duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Money that thinks.
              <br />
              <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Built for Nepal.
              </span>
            </h1>

            <p
              className={`text-lg text-indigo-100/90 max-w-xl mb-10 leading-relaxed transition-all delay-300 duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Send, load, scan, and save in NPR with an AI co-pilot that watches every
              transaction. Smarter budgets, safer transfers, instant settlements — all in
              one beautifully simple wallet.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-3 transition-all delay-500 duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <button
                onClick={onStart}
                className="group inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold text-base px-6 py-3.5 rounded-xl shadow-xl shadow-indigo-900/20 hover:shadow-2xl hover:shadow-indigo-900/30 active:scale-95 transition-all"
              >
                Get Started
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold text-base px-6 py-3.5 rounded-xl ring-1 ring-white/30 backdrop-blur-md hover:bg-white/15 active:scale-95 transition-all"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* trust badges */}
            <div
              className={`mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 transition-all delay-700 duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {TRUST.map((t) => (
                <div key={t.label} className="flex items-center gap-2 text-indigo-100/90 text-sm font-medium">
                  <t.icon className="w-4 h-4 text-emerald-300" />
                  {t.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* bottom fade into the page */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-slate-50" aria-hidden />
      </section>

      {/* ───── Features ───────────────────────────────────────── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            A wallet with a brain.
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Three pillars that make VasPay the most intelligent way to move money in Nepal.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <article
              key={f.title}
              className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div
                className={`w-12 h-12 rounded-xl ${f.tint} ring-4 ${f.ring} flex items-center justify-center mb-5`}
              >
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:gap-2 transition-all">
                Explore <ArrowRight className="w-4 h-4" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ───── Stats strip ────────────────────────────────────── */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { k: '< 2s', v: 'Avg. transfer time' },
            { k: '₹0', v: 'Hidden fees' },
            { k: '24×7', v: 'AI fraud watch' },
            { k: '15+', v: 'Banks supported' },
          ].map((s) => (
            <div key={s.v}>
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                {s.k}
              </div>
              <div className="mt-1 text-sm text-slate-400">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── CTA ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-10 sm:p-14 text-center shadow-2xl shadow-indigo-200">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl" aria-hidden />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Open your VasPay wallet in seconds.
            </h2>
            <p className="text-indigo-100 max-w-xl mx-auto mb-8">
              No paperwork. No fees. Just smarter money — ready when you are.
            </p>
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold text-base px-8 py-3.5 rounded-xl shadow-lg hover:shadow-2xl active:scale-95 transition-all"
            >
              Get Started <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ───── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black">
                V
              </div>
              <span className="font-bold text-slate-900">VasPay</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nepal's first agentic AI digital wallet. Smart, secure, instant.
            </p>
          </div>
          {[
            { h: 'Product', items: ['Send', 'Load', 'Scan & Pay', 'Cards'] },
            { h: 'Company', items: ['About', 'Careers', 'Press', 'Contact'] },
            { h: 'Legal', items: ['Privacy', 'Terms', 'Licenses', 'Security'] },
          ].map((col) => (
            <div key={col.h}>
              <h4 className="text-sm font-bold text-slate-900 mb-3">{col.h}</h4>
              <ul className="space-y-2">
                {col.items.map((it) => (
                  <li key={it}>
                    <a href="#" className="text-xs text-slate-500 hover:text-indigo-600 transition-colors">
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 py-5 text-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} VasPay. Licensed by Nepal Rastra Bank. Made in Kathmandu.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
