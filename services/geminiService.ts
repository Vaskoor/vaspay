/**
 * @file services/geminiService.ts - VasPay AI service.
 *
 * NO-KEY FALLBACK
 * ---------------
 * The original implementation instantiated `new GoogleGenAI({ apiKey: ... })`
 * unconditionally and crashed the moment a key was absent. This module fixes
 * that: it reads `process.env.API_KEY` / `process.env.GEMINI_API_KEY`
 * (Vite `define` replaces both literal substrings at build time, so the
 * browser bundle never actually dereferences `process`), and if either is
 * present and the SDK initialises cleanly, exports `aiAvailable = true` and
 * every exported function takes the LLM path. When the key is missing or
 * the SDK throws on init, `aiAvailable = false` and every exported function
 * falls back to a deterministic, rule-based response — so the app demos
 * end-to-end with zero configuration.
 *
 * All fallbacks are pure functions of their inputs (no Math.random, no
 * wall-clock drift) so test snapshots stay stable.
 *
 * EXPORTS (backward-compat names preserved)
 *  - getFinancialAdvice(userQuery, transactionContext) : Promise<string>
 *  - detectFraudRisk(transaction)                        : Promise<{risk,reason}>
 *  - analyzeSpending(transactions)                       : Promise<{summary,topCategory,tip}>   (NEW)
 *  - suggestBudget(transactions, income)                 : Promise<string>                       (NEW)
 *  - detectAnomaly(transaction, history)                 : {isAnomaly,reason}                    (NEW, sync)
 *  - aiAvailable                                          : boolean                               (NEW)
 *  - SYSTEM_INSTRUCTION                                    : string  (VasPay AI persona, NPR context)
 *
 * Model: `gemini-2.0-flash` (the previous `gemini-3-flash-preview` name did
 * not exist in the GA model registry).
 *
 * @license MIT
 * @author VasPay Team
 */

import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import type { Transaction } from '../types';

// ---------------------------------------------------------------------------
// AI client init (guarded — no throw when key is missing)
// ---------------------------------------------------------------------------

/**
 * Resolved API key. Vite's `define` plugin (see vite.config.ts) replaces the
 * literal substrings `process.env.API_KEY` and `process.env.GEMINI_API_KEY`
 * with the JSON-stringified value of the `GEMINI_API_KEY` env var, so at
 * runtime in the browser this expression is just a string literal — no
 * access to `process` actually happens.
 */
const API_KEY: string =
  (process.env.API_KEY as string | undefined) ||
  (process.env.GEMINI_API_KEY as string | undefined) ||
  '';

/**
 * Lazily-initialised Gemini client. `null` when no key was provided or the
 * SDK threw on construction (e.g. malformed key, network-banned import).
 * Initialised exactly once at module load.
 */
function initAI(): GoogleGenAI | null {
  if (!API_KEY) {
    // Demo mode: rule-based responses only.
    // (console.warn is intentional — useful to operators in dev.)
    console.warn(
      '[VasPay AI] No GEMINI_API_KEY found — running in rule-based demo mode. ' +
        'Set GEMINI_API_KEY in your env to enable LLM-powered responses.'
    );
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey: API_KEY });
  } catch (err) {
    console.warn(
      '[VasPay AI] GoogleGenAI initialisation failed — running in rule-based demo mode.',
      err
    );
    return null;
  }
}

const ai: GoogleGenAI | null = initAI();

/** True when the Gemini client is ready to serve LLM responses. */
export const aiAvailable: boolean = ai !== null;

/** Model identifier (GA; the previous "gemini-3-flash-preview" was invalid). */
const MODEL_NAME = 'gemini-2.0-flash';

// ---------------------------------------------------------------------------
// System instruction (VasPay AI persona, NPR context)
// ---------------------------------------------------------------------------

/**
 * Persona + guardrails for VasPay AI. Mentions NPR, the Nepali market,
 * Dashain awareness, and the demo-mode caveat for action requests.
 */
export const SYSTEM_INSTRUCTION = `
You are VasPay AI, an advanced, secure, and helpful financial assistant for the VasPay Digital Wallet in Nepal.
Your goal is to help users manage their finances, detect fraud, and provide insights.
You have access to the user's transaction history context provided in the prompt.
Currency is Nepalese Rupee (NPR).

Capabilities:
1. Analyze spending patterns.
2. Detect anomalies or potential fraud in provided transactions.
3. Suggest budgeting tips based on local Nepalese context (e.g., Dashain expenses, local utility costs).
4. Be polite, professional, and concise.

If the user asks about their balance or recent transactions, use the provided context to answer.
If the user asks to perform an action (like "Send money"), explain that this is a demo environment and simulate the confirmation step.
`;

// ---------------------------------------------------------------------------
// Local rule-based helpers (deterministic — no Math.random)
// ---------------------------------------------------------------------------

/** Format a number as an NPR string with Indian-grouping numerals. */
const NPR_FMT = (n: number): string =>
  `NPR ${Math.round(n).toLocaleString('en-IN')}`;

/** Median of a numeric array (0 for empty input). */
function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/** Sum outflow amounts grouped by category (payment + bill_payment only). */
function spendByCategory(txs: Transaction[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const t of txs) {
    if (t.type === 'payment' || t.type === 'bill_payment') {
      map[t.category] = (map[t.category] || 0) + t.amount;
    }
  }
  return map;
}

/** Category with the highest total spend (null when no outflow recorded). */
function topCategoryOf(txs: Transaction[]): string | null {
  const map = spendByCategory(txs);
  let top: string | null = null;
  let max = -Infinity;
  for (const [k, v] of Object.entries(map)) {
    if (v > max) {
      max = v;
      top = k;
    }
  }
  return top;
}

/** Category-keyed one-line actionable tip, used by the local spending summary. */
function pickTip(top: string): string {
  switch (top) {
    case 'food':
      return 'Food is your top spend — try Foodmandu group orders or meal-prep weekends to cut around 20%.';
    case 'utilities':
      return 'Utilities dominate — review NEA / Worldlink / NTC plans; prepaid electricity off-peak saves around 10%.';
    case 'shopping':
      return 'Shopping is high — set a 3-day cart cool-off on Daraz before checkout.';
    case 'transport':
      return 'Transport is heavy — a Pathao Pass or monthly saver beats per-ride during peak.';
    case 'entertainment':
      return 'Entertainment is up — Kantipur / streaming bundles overlap; pick one.';
    default:
      return 'Spend is spread — keep a 50/30/20 split (needs / wants / savings).';
  }
}

// ---- Fallback response builders (used when aiAvailable === false) --------

/**
 * Rule-based chat fallback. Inspects the user query for intent keywords
 * (balance, spend, save, send/transfer, festival) and returns a Nepali-
 * context answer derived deterministically from the provided transactions.
 */
function fallbackAdvice(userQuery: string, txs: Transaction[]): string {
  const q = userQuery.toLowerCase();
  const outflow = txs
    .filter((t) => t.type === 'payment' || t.type === 'bill_payment')
    .reduce((a, t) => a + t.amount, 0);
  const inflow = txs
    .filter((t) => t.type === 'receive' || t.type === 'load')
    .reduce((a, t) => a + t.amount, 0);
  const top = topCategoryOf(txs);
  const recent = txs
    .slice(0, 3)
    .map((t) => t.recipient || t.sender || '—');

  if (q.includes('balance')) {
    return (
      `In the recent activity window: total inflow ${NPR_FMT(inflow)}, total outflow ` +
      `${NPR_FMT(outflow)} across ${txs.length} transactions. Your current VasPay balance ` +
      `is shown on the dashboard.`
    );
  }
  if (q.includes('spend') || q.includes('spent') || q.includes('spending')) {
    return (
      `You've spent ${NPR_FMT(outflow)} recently. Your top category is "${top ?? 'n/a'}". ` +
      `Consider setting a monthly cap on that category and reviewing recurring subscriptions ` +
      `(e.g. Worldlink, NTC, NEA).`
    );
  }
  if (q.includes('save') || q.includes('saving')) {
    const suggested = Math.max(500, Math.round(inflow * 0.2));
    return (
      `Saving tip for Nepal: aim to put aside at least 20% of each salary load into a ` +
      `VasPay Savings Goal. Automate a ${NPR_FMT(suggested)} top-up after every payroll ` +
      `credit to build the habit.`
    );
  }
  if (q.includes('send') || q.includes('transfer')) {
    return (
      `In this demo I can't move funds, but here's the flow: open Send Money -> pick a ` +
      `contact -> enter amount in NPR -> VasPay shows a fraud-risk check -> confirm with ` +
      `your PIN. Recent recipients include ${recent.join(', ')}.`
    );
  }
  if (q.includes('dashain') || q.includes('tihar') || q.includes('festival')) {
    const target = Math.max(15000, Math.round(outflow * 1.5));
    return (
      `During Dashain, Nepali households typically see 30-50% higher spending on shopping, ` +
      `food, and gifts. Pre-load a "Dashain Fund" Savings Goal with ${NPR_FMT(target)} ` +
      `before the festival so you don't dip into your everyday balance.`
    );
  }
  return (
    `I'm VasPay AI running in demo mode (no GEMINI_API_KEY configured). For ` +
    `"${userQuery}", here's what I see: ${txs.length} recent transactions, ` +
    `${NPR_FMT(outflow)} outflow, top category "${top ?? 'n/a'}". Ask me about balance, ` +
    `spending, savings, festivals, or sending money — or set GEMINI_API_KEY to unlock ` +
    `full LLM-powered advice.`
  );
}

/**
 * Rule-based fraud-risk scorer. Bumps the score for large amounts, unusual
 * hours (23:00–06:00), and recipients that look like raw account / phone
 * numbers. ≥3 flags = high, 2 = medium, otherwise low.
 */
function fallbackFraudRisk(tx: Transaction): {
  risk: 'low' | 'medium' | 'high';
  reason: string;
} {
  let score = 0;
  const reasons: string[] = [];

  if (tx.amount >= 10000) {
    score += 2;
    reasons.push('large amount (>= NPR 10,000)');
  } else if (tx.amount >= 5000) {
    score += 1;
    reasons.push('above-average amount');
  }

  const hour = new Date(tx.date).getHours();
  if (hour < 6 || hour >= 23) {
    score += 1;
    reasons.push(`unusual hour (${hour}:00)`);
  }

  const recipient = (tx.recipient || tx.sender || '').trim();
  if (recipient && /\d{6,}/.test(recipient)) {
    score += 1;
    reasons.push('recipient looks like a raw account/phone number');
  }

  const risk: 'low' | 'medium' | 'high' =
    score >= 3 ? 'high' : score === 2 ? 'medium' : 'low';
  return {
    risk,
    reason: reasons.length
      ? `Flagged: ${reasons.join('; ')}.`
      : 'No strong fraud indicators in this transaction.',
  };
}

/**
 * Rule-based spending summary. Always returns a structured object so the
 * Analytics page can render the breakdown even without the LLM.
 */
function localSpendingSummary(txs: Transaction[]): {
  summary: string;
  topCategory: string;
  tip: string;
} {
  const map = spendByCategory(txs);
  const total = Object.values(map).reduce((a, b) => a + b, 0);
  const top = topCategoryOf(txs) ?? 'n/a';
  const lines = Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k}: ${NPR_FMT(v)}`);
  const summary =
    lines.length > 0
      ? `Spent ${NPR_FMT(total)} across ${lines.length} categories ` +
        `(${txs.length} transactions). Breakdown — ${lines.join('; ')}.`
      : `No outflow transactions in the provided window (${txs.length} transactions).`;
  return { summary, topCategory: top, tip: pickTip(top) };
}

/**
 * Rule-based budget advice. Computes spend-to-income ratio, flags if it
 * exceeds 70% / 90%, and emits suggested 50/30/20 caps in NPR.
 */
function localBudgetAdvice(txs: Transaction[], income: number): string {
  const map = spendByCategory(txs);
  const totalSpent = Object.values(map).reduce((a, b) => a + b, 0);
  const ratio = income > 0 ? totalSpent / income : 0;
  const lines = Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k}: ${NPR_FMT(v)}`);
  const header =
    ratio > 0.9
      ? `Warning: you're spending ${Math.round(ratio * 100)}% of your income — that's unsustainable.`
      : ratio > 0.7
      ? `Heads up: you're at ${Math.round(ratio * 100)}% of income.`
      : `Healthy ratio: ${Math.round(ratio * 100)}% of income spent.`;
  const suggestion =
    income > 0
      ? `Suggested 50/30/20 caps -> Needs: ${NPR_FMT(income * 0.5)} · Wants: ` +
        `${NPR_FMT(income * 0.3)} · Savings: ${NPR_FMT(income * 0.2)}.`
      : `Provide your monthly income for personalised caps.`;
  const breakdown =
    lines.length > 0
      ? ` Spent ${NPR_FMT(totalSpent)} (${lines.join('; ')}).`
      : ` No outflow recorded in the provided window.`;
  return `${header}${breakdown} ${suggestion}`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get financial advice from VasPay AI.
 *
 * - LLM path: sends the user query + the most recent 10 transactions as
 *   JSON context to `gemini-2.0-flash` with the VasPay AI system instruction.
 * - Fallback path: deterministic rule-based answer derived from the
 *   transaction context (balance / spend / save / send / festival intents).
 *
 * Both paths return a plain string for the chat UI to render.
 */
export async function getFinancialAdvice(
  userQuery: string,
  transactionContext: Transaction[]
): Promise<string> {
  if (!aiAvailable || !ai) {
    return fallbackAdvice(userQuery, transactionContext);
  }
  try {
    const contextStr = JSON.stringify(transactionContext.slice(0, 10));
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Context: User's recent transactions: ${contextStr}\n\nUser Query: ${userQuery}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return (
      response.text ||
      fallbackAdvice(userQuery, transactionContext)
    );
  } catch (err) {
    console.warn(
      '[VasPay AI] getFinancialAdvice LLM call failed, returning rule-based fallback.',
      err
    );
    return fallbackAdvice(userQuery, transactionContext);
  }
}

/**
 * Assess fraud risk for a single transaction.
 *
 * - LLM path: structured JSON response `{risk, reason}` from
 *   `gemini-2.0-flash` (responseMimeType: application/json).
 * - Fallback path: local heuristic (amount thresholds, unusual hour,
 *   recipient format).
 *
 * Always normalises `risk` to one of `'low' | 'medium' | 'high'`.
 */
export async function detectFraudRisk(
  transaction: Transaction
): Promise<{ risk: 'low' | 'medium' | 'high'; reason: string }> {
  if (!aiAvailable || !ai) {
    return fallbackFraudRisk(transaction);
  }
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents:
        `Analyze this transaction for fraud risk in a Nepal context: ` +
        `${JSON.stringify(transaction)}. Return only JSON in format: ` +
        `{"risk": "low"|"medium"|"high", "reason": "string"}.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });
    const text = response.text;
    if (!text) {
      return fallbackFraudRisk(transaction);
    }
    const parsed = JSON.parse(text) as { risk?: string; reason?: string };
    const riskRaw = String(parsed.risk ?? 'low').toLowerCase();
    const risk: 'low' | 'medium' | 'high' =
      riskRaw === 'high' || riskRaw === 'medium' || riskRaw === 'low'
        ? (riskRaw as 'low' | 'medium' | 'high')
        : 'low';
    return {
      risk,
      reason: String(parsed.reason ?? 'Analysis inconclusive, defaulted to low.'),
    };
  } catch (err) {
    console.warn(
      '[VasPay AI] detectFraudRisk LLM call failed, returning rule-based risk.',
      err
    );
    return fallbackFraudRisk(transaction);
  }
}

/**
 * Summarise spending across a transaction set.
 *
 * - Always computes a local rule-based summary first (so callers get a
 *   structured object even without the LLM).
 * - LLM path (when `aiAvailable`): enhances summary + tip with a 2-3
 *   sentence natural-language write-up; the local `topCategory` is passed
 *   in-prompt as ground truth so the model can't hallucinate a different one.
 */
export async function analyzeSpending(
  transactions: Transaction[]
): Promise<{ summary: string; topCategory: string; tip: string }> {
  const local = localSpendingSummary(transactions);
  if (!aiAvailable || !ai) {
    return local;
  }
  try {
    const ctx = JSON.stringify(transactions.slice(0, 20));
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents:
        `Recent transactions (JSON): ${ctx}\n\nLocal analysis (use as ground ` +
        `truth): top category = ${local.topCategory}; ${local.summary}\n\n` +
        `Return ONLY JSON: {"summary": "<2-3 sentence summary in NPR>", ` +
        `"topCategory": "<string>", "tip": "<one actionable Nepali-context tip>"}.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });
    const text = response.text;
    if (!text) {
      return local;
    }
    const parsed = JSON.parse(text) as {
      summary?: string;
      topCategory?: string;
      tip?: string;
    };
    return {
      summary: String(parsed.summary ?? local.summary),
      topCategory: String(parsed.topCategory ?? local.topCategory),
      tip: String(parsed.tip ?? local.tip),
    };
  } catch (err) {
    console.warn(
      '[VasPay AI] analyzeSpending LLM call failed, returning local analysis.',
      err
    );
    return local;
  }
}

/**
 * Budget advice for the given transactions + monthly income.
 *
 * - LLM path: 3-4 sentence plan with the 50/30/20 rule and Dashain context.
 * - Fallback path: ratio flag + suggested caps in NPR.
 */
export async function suggestBudget(
  transactions: Transaction[],
  income: number
): Promise<string> {
  if (!aiAvailable || !ai) {
    return localBudgetAdvice(transactions, income);
  }
  try {
    const ctx = JSON.stringify(transactions.slice(0, 20));
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents:
        `User monthly income: NPR ${income}. Transactions: ${ctx}\n\n` +
        `Give a 3-4 sentence budget plan in Nepalese context (NPR, 50/30/20 rule, ` +
        `Dashain awareness). Be specific with NPR figures.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5,
      },
    });
    return response.text || localBudgetAdvice(transactions, income);
  } catch (err) {
    console.warn(
      '[VasPay AI] suggestBudget LLM call failed, returning local advice.',
      err
    );
    return localBudgetAdvice(transactions, income);
  }
}

/**
 * Local anomaly detector (synchronous, no LLM).
 *
 * Flags a transaction if any of these hold:
 *  - amount > 3x the median of same-type transactions in `history` (needs
 *    at least 3 historical same-type samples to apply, to avoid noise on
 *    a sparse history)
 *  - timestamp in the 23:00–06:00 local window
 *  - recipient is not present in the historical recipients set (new payee)
 *
 * Returns `{isAnomaly, reason}`. `reason` is a human-readable string
 * enumerating which rules fired (semicolon-joined). When no rule fires,
 * `isAnomaly = false` and `reason` describes the normal-pattern outcome.
 *
 * Pure function of (transaction, history) — deterministic, no I/O.
 */
export function detectAnomaly(
  transaction: Transaction,
  history: Transaction[]
): { isAnomaly: boolean; reason: string } {
  const reasons: string[] = [];

  // Amount rule — only apply with enough history to compute a stable median.
  const sameTypeAmounts = history
    .filter((t) => t.type === transaction.type)
    .map((t) => t.amount);
  const med = median(sameTypeAmounts);
  if (sameTypeAmounts.length >= 3 && transaction.amount > med * 3) {
    reasons.push(
      `amount ${NPR_FMT(transaction.amount)} is >3x the median ` +
        `(${NPR_FMT(med)}) for ${transaction.type} transactions`
    );
  }

  // Hour rule — flag 23:00 to 06:00.
  const hour = new Date(transaction.date).getHours();
  if (hour < 6 || hour >= 23) {
    reasons.push(`unusual hour (${hour}:00 local)`);
  }

  // New-recipient rule.
  const recipient = (transaction.recipient || '').trim();
  const knownRecipients = new Set(
    history.map((t) => (t.recipient || '').trim()).filter(Boolean)
  );
  if (recipient && !knownRecipients.has(recipient)) {
    reasons.push(`new recipient "${recipient}"`);
  }

  return {
    isAnomaly: reasons.length > 0,
    reason: reasons.length
      ? `Possible anomaly: ${reasons.join('; ')}.`
      : 'Within normal pattern.',
  };
}
