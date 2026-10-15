/**
 * @file types.ts - VasPay domain types.
 *
 * Covers transactions, users, cards, savings goals, notifications,
 * beneficiaries, budget categories, chat messages, contacts, and the
 * navigation ViewState union used by the App router.
 *
 * Backward-compatible: every pre-existing export name (Transaction, User,
 * ChatMessage, Contact, ViewState) is preserved; new fields are optional
 * where it makes sense so existing call sites keep compiling.
 *
 * @license MIT
 * @author VasPay Team
 */

/**
 * KYC verification state for a VasPay user.
 * - "verified"  -> full wallet features unlocked
 * - "pending"  -> verification in review (limits apply)
 * - "unverified" -> KYC not yet initiated (send/receive capped)
 */
export type KycStatus = 'verified' | 'pending' | 'unverified';

/**
 * A single ledger entry. Outflow types use `recipient`, inflow types use
 * `sender`. `method`/`reference` are optional so legacy code that builds
 * Transaction literals without them still type-checks.
 */
export interface Transaction {
  id: string;
  type: 'payment' | 'receive' | 'load' | 'transfer' | 'bill_payment';
  amount: number;
  currency: string;
  /** ISO-8601 timestamp. */
  date: string;
  /** Counterparty for outflows (payment / transfer / bill_payment). */
  recipient?: string;
  /** Counterparty for inflows (receive / load). */
  sender?: string;
  description: string;
  category: 'food' | 'utilities' | 'entertainment' | 'shopping' | 'transport' | 'others';
  status: 'success' | 'pending' | 'failed';
  /** Payment channel (e.g. "QR", "Bank Transfer", "NTC", "Worldlink"). */
  method?: string;
  /** Voucher / reference number returned by the upstream provider. */
  reference?: string;
}

/**
 * A linked bank card (visa / mastercard / unionpay). `brandColor` is a
 * Tailwind gradient class string used by the card visual.
 */
export interface Card {
  id: string;
  type: 'visa' | 'mastercard' | 'unionpay';
  last4: string;
  /** MM/YY expiry string. */
  expiry: string;
  /** Embossed holder name (uppercase). */
  holder: string;
  isDefault: boolean;
  /** Tailwind gradient classes for the card face, e.g. "from-indigo-600 to-purple-700". */
  brandColor: string;
}

/**
 * A user-defined savings goal (e.g. "Dashain Fund"). `deadline` is ISO-8601.
 */
export interface SavingsGoal {
  id: string;
  title: string;
  target: number;
  saved: number;
  deadline: string;
  emoji: string;
  /** Tailwind accent class, e.g. "bg-amber-500". */
  color: string;
}

/**
 * Notification kind. "ai" notifications carry VasPay AI insight summaries.
 */
export type NotificationType = 'transaction' | 'security' | 'promotion' | 'ai';

/**
 * Inbox notification shown in the notifications centre.
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  /** ISO-8601 timestamp. */
  timestamp: string;
  read: boolean;
}

/**
 * External bank beneficiary for bank-transfer flows.
 */
export interface Beneficiary {
  id: string;
  name: string;
  bank: string;
  account: string;
  avatar: string;
}

/**
 * A monthly budget line for a spending category.
 * `color` is a hex string for chart fills (e.g. "#6366f1").
 */
export interface BudgetCategory {
  name: string;
  budget: number;
  spent: number;
  color: string;
}

/**
 * VasPay user profile. New optional-ish fields (email, phone, cards,
 * savingsGoals) are required on the canonical MOCK_USER but typed required
 * here so downstream UI can rely on them; legacy literals that omit them
 * will need to be updated, but no existing file constructs a `User` literal
 * other than constants.ts (which we own and update in this same task).
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  currency: string;
  avatarUrl: string;
  kycStatus: KycStatus;
  cards: Card[];
  savingsGoals: SavingsGoal[];
}

/**
 * A single chat turn in the VasPay AI conversation thread.
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  /** True while the assistant reply is being streamed / generated. */
  isThinking?: boolean;
}

/**
 * A phone-book contact for quick-send flows.
 */
export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
}

/**
 * Top-level navigation state for the App router. The union is exhaustive so
 * switch/route handlers get a type-check guarantee they cover every view.
 *
 * Backward-compat: 'merchant' (from the original stub) is retained even
 * though it isn't in the new spec list — no existing route renders it, so
 * it simply falls through to the default Dashboard.
 */
export type ViewState =
  | 'landing'
  | 'dashboard'
  | 'scan'
  | 'analytics'
  | 'chat'
  | 'merchant'
  | 'profile'
  | 'send_money'
  | 'load_money'
  | 'request_money'
  | 'bank_transfer'
  | 'transactions'
  | 'cards'
  | 'savings'
  | 'settings'
  | 'notifications';
