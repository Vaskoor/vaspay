/**
 * @file constants.ts - VasPay mock data and app-wide constants.
 *
 * All amounts are in NPR. Transaction timestamps are relative to
 * `Date.now()` so the demo always shows recent activity; data values
 * themselves (merchant names, categories, amounts, statuses) are stable
 * and deterministic — no Math.random is used anywhere in this module.
 *
 * Backward-compatible exports preserved exactly:
 *   MOCK_USER, MOCK_CONTACTS, MOCK_TRANSACTIONS, QUICK_ACTIONS.
 * New exports added in this revision:
 *   MOCK_NOTIFICATIONS, MOCK_BUDGET_CATEGORIES, MONTHLY_SPENDING,
 *   NEPALI_BANKS, CATEGORY_COLORS.
 *
 * @license MIT
 * @author VasPay Team
 */

import {
  Transaction,
  User,
  Contact,
  Card,
  SavingsGoal,
  Notification,
  BudgetCategory,
} from './types';

// ---------------------------------------------------------------------------
// Time helpers (file-local, not exported)
// ---------------------------------------------------------------------------

/** ISO timestamp for `h` hours ago. */
const HOURS_AGO = (h: number): string =>
  new Date(Date.now() - h * 3_600_000).toISOString();

/** ISO timestamp for `d` days ago. */
const DAYS_AGO = (d: number): string =>
  new Date(Date.now() - d * 86_400_000).toISOString();

// ---------------------------------------------------------------------------
// MOCK_USER — full profile (2 cards, 3 savings goals)
// ---------------------------------------------------------------------------

const MOCK_CARDS: Card[] = [
  {
    id: 'card-1',
    type: 'visa',
    last4: '4242',
    expiry: '08/27',
    holder: 'AARAV SHARMA',
    isDefault: true,
    brandColor: 'from-indigo-700 via-indigo-600 to-purple-700',
  },
  {
    id: 'card-2',
    type: 'mastercard',
    last4: '5311',
    expiry: '02/26',
    holder: 'AARAV SHARMA',
    isDefault: false,
    brandColor: 'from-orange-600 via-red-600 to-rose-700',
  },
];

const MOCK_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'sg-1',
    title: 'Dashain Fund',
    target: 25000,
    saved: 18500,
    deadline: '2025-10-02T00:00:00.000Z',
    emoji: '🎉',
    color: 'bg-amber-500',
  },
  {
    id: 'sg-2',
    title: 'New Laptop',
    target: 120000,
    saved: 45000,
    deadline: '2025-12-31T00:00:00.000Z',
    emoji: '💻',
    color: 'bg-blue-500',
  },
  {
    id: 'sg-3',
    title: 'Emergency Fund',
    target: 100000,
    saved: 62000,
    deadline: '2026-06-30T00:00:00.000Z',
    emoji: '🛟',
    color: 'bg-emerald-500',
  },
];

/**
 * Canonical VasPay demo user. Email + phone are present so the Profile /
 * Settings pages can render without further wiring; cards + savingsGoals
 * back the Dashboard wallet-carousel and Savings views respectively.
 */
export const MOCK_USER: User = {
  id: 'u123',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@vaspay.com.np',
  phone: '+977-9801234567',
  balance: 45250.75,
  currency: 'NPR',
  avatarUrl: 'https://picsum.photos/seed/vaspay-aarav/200/200',
  kycStatus: 'verified',
  cards: MOCK_CARDS,
  savingsGoals: MOCK_SAVINGS_GOALS,
};

// ---------------------------------------------------------------------------
// MOCK_CONTACTS — 8 Nepali contacts
// ---------------------------------------------------------------------------

/**
 * Eight Nepali contacts for quick-send. Avatars are stable picsum images
 * (seeded URLs so the same avatar always loads for the same contact).
 */
export const MOCK_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Aarav Thapa',  phone: '+977-9841000001', avatar: 'https://picsum.photos/seed/vaspay-aarav-t/100/100' },
  { id: 'c2', name: 'Sita Sharma',  phone: '+977-9851000002', avatar: 'https://picsum.photos/seed/vaspay-sita/100/100' },
  { id: 'c3', name: 'Ram Karki',    phone: '+977-9801000003', avatar: 'https://picsum.photos/seed/vaspay-ram/100/100' },
  { id: 'c4', name: 'Gita Gurung',  phone: '+977-9741000004', avatar: 'https://picsum.photos/seed/vaspay-gita/100/100' },
  { id: 'c5', name: 'Hari Thapa',   phone: '+977-9851000005', avatar: 'https://picsum.photos/seed/vaspay-hari/100/100' },
  { id: 'c6', name: 'Maya Rai',     phone: '+977-9861000006', avatar: 'https://picsum.photos/seed/vaspay-maya/100/100' },
  { id: 'c7', name: 'Kiran Maharjan', phone: '+977-9801000007', avatar: 'https://picsum.photos/seed/vaspay-kiran/100/100' },
  { id: 'c8', name: 'Bishnu Shrestha', phone: '+977-9841000008', avatar: 'https://picsum.photos/seed/vaspay-bishnu/100/100' },
];

// ---------------------------------------------------------------------------
// MOCK_TRANSACTIONS — 15 entries across the last ~30 days
// ---------------------------------------------------------------------------

/**
 * Fifteen transactions covering the last ~18 days (a dense recent window),
 * with merchants and categories realistic to the Nepali market:
 * Bhat-Bhateni, Pathao, Worldlink, NTC, Kantipur, Foodmandu, Daraz, eSewa,
 * Khalti, NEA, Nepal Water, IME Pay, plus Nabil Bank payroll top-up.
 *
 * Mix: 1 pending (transfer), 1 failed (entertainment), 13 success.
 * Amount range: NPR 50 – NPR 15,000.
 */
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    type: 'payment',
    amount: 8750,
    currency: 'NPR',
    date: HOURS_AGO(2),
    recipient: 'Bhat-Bhateni Supermarket',
    description: 'Dashain grocery haul',
    category: 'shopping',
    status: 'success',
    method: 'QR',
    reference: 'VSP-QR-001',
  },
  {
    id: 'tx-002',
    type: 'bill_payment',
    amount: 1520,
    currency: 'NPR',
    date: HOURS_AGO(5),
    recipient: 'Nepal Electricity Authority',
    description: 'Electricity bill - SC#4521',
    category: 'utilities',
    status: 'success',
    method: 'NEA',
    reference: 'NEA-4521',
  },
  {
    id: 'tx-003',
    type: 'payment',
    amount: 685,
    currency: 'NPR',
    date: HOURS_AGO(26),
    recipient: 'Foodmandu',
    description: 'Dinner - Burger House',
    category: 'food',
    status: 'success',
    method: 'Foodmandu',
    reference: 'FM-90342',
  },
  {
    id: 'tx-004',
    type: 'payment',
    amount: 285,
    currency: 'NPR',
    date: DAYS_AGO(2),
    recipient: 'Pathao',
    description: 'Ride to office',
    category: 'transport',
    status: 'success',
    method: 'Pathao',
    reference: 'PH-RIDE-2231',
  },
  {
    id: 'tx-005',
    type: 'bill_payment',
    amount: 340,
    currency: 'NPR',
    date: DAYS_AGO(2),
    recipient: 'Nepal Water Supply Corporation',
    description: 'Water bill - Bhadra',
    category: 'utilities',
    status: 'success',
    method: 'NWC',
    reference: 'NWC-882',
  },
  {
    id: 'tx-006',
    type: 'load',
    amount: 15000,
    currency: 'NPR',
    date: DAYS_AGO(3),
    sender: 'Nabil Bank',
    description: 'Payroll top-up',
    category: 'others',
    status: 'success',
    method: 'Bank Transfer',
    reference: 'NAB-PAYROLL-77',
  },
  {
    id: 'tx-007',
    type: 'payment',
    amount: 3499,
    currency: 'NPR',
    date: DAYS_AGO(4),
    recipient: 'Daraz Nepal',
    description: 'Bluetooth headphones',
    category: 'shopping',
    status: 'success',
    method: 'Daraz',
    reference: 'DZ-ORD-55321',
  },
  {
    id: 'tx-008',
    type: 'bill_payment',
    amount: 299,
    currency: 'NPR',
    date: DAYS_AGO(5),
    recipient: 'Nepal Telecom (NTC)',
    description: 'Mobile recharge - 985XXXXXXXX',
    category: 'utilities',
    status: 'success',
    method: 'NTC',
    reference: 'NTC-RC-5512',
  },
  {
    id: 'tx-009',
    type: 'receive',
    amount: 7500,
    currency: 'NPR',
    date: DAYS_AGO(5),
    sender: 'Sita Sharma',
    description: 'Freelance project payment',
    category: 'others',
    status: 'success',
    method: 'VasPay',
    reference: 'VSP-RECV-3344',
  },
  {
    id: 'tx-010',
    type: 'bill_payment',
    amount: 1595,
    currency: 'NPR',
    date: DAYS_AGO(6),
    recipient: 'Worldlink Communications',
    description: 'Internet - 60Mbps monthly',
    category: 'utilities',
    status: 'success',
    method: 'Worldlink',
    reference: 'WLINK-0912',
  },
  {
    id: 'tx-011',
    type: 'bill_payment',
    amount: 600,
    currency: 'NPR',
    date: DAYS_AGO(8),
    recipient: 'Kantipur TV Network',
    description: 'Cable TV subscription',
    category: 'entertainment',
    status: 'success',
    method: 'TV',
    reference: 'KTV-0922',
  },
  {
    id: 'tx-012',
    type: 'payment',
    amount: 50,
    currency: 'NPR',
    date: DAYS_AGO(9),
    recipient: 'eSewa Merchant (Street Vendor)',
    description: 'QR payment - chiya + samosa',
    category: 'food',
    status: 'success',
    method: 'QR',
    reference: 'VSP-QR-099',
  },
  {
    id: 'tx-013',
    type: 'transfer',
    amount: 5000,
    currency: 'NPR',
    date: DAYS_AGO(11),
    recipient: 'Hari Thapa',
    description: 'Loan repayment - installment 2/6',
    category: 'others',
    status: 'pending',
    method: 'VasPay',
    reference: 'VSP-XFER-7711',
  },
  {
    id: 'tx-014',
    type: 'payment',
    amount: 700,
    currency: 'NPR',
    date: DAYS_AGO(14),
    recipient: 'IME Pay Merchant (QFX Cinemas)',
    description: 'Movie tickets - Friday show',
    category: 'entertainment',
    status: 'failed',
    method: 'IME Pay',
    reference: 'IME-QFX-4410',
  },
  {
    id: 'tx-015',
    type: 'payment',
    amount: 845,
    currency: 'NPR',
    date: DAYS_AGO(18),
    recipient: 'Khalti Merchant (Sajha Petrol Pump)',
    description: 'Petrol - 5L',
    category: 'transport',
    status: 'success',
    method: 'Khalti',
    reference: 'KLT-FUEL-2207',
  },
];

// ---------------------------------------------------------------------------
// QUICK_ACTIONS — 6 actions (icon name + Tailwind bg class)
// ---------------------------------------------------------------------------

/**
 * Six quick actions for the Dashboard grid. `icon` is a lucide-react icon
 * name; consuming components should map the string to the actual icon
 * component (the Dashboard currently maps { Send, Download, Users, Landmark }
 * and falls back to Wallet for the two new icons QrCode / Receipt — those
 * should be added to the icon map by the UI agent).
 */
export const QUICK_ACTIONS: Array<{
  id: string;
  label: string;
  icon: string;
  color: string;
}> = [
  { id: 'send',    label: 'Send',    icon: 'Send',     color: 'bg-blue-500' },
  { id: 'request', label: 'Request', icon: 'Users',    color: 'bg-purple-500' },
  { id: 'load',    label: 'Load',    icon: 'Download',  color: 'bg-green-500' },
  { id: 'bank',    label: 'Bank',    icon: 'Landmark',  color: 'bg-orange-500' },
  { id: 'scan',    label: 'Scan',    icon: 'QrCode',    color: 'bg-teal-500' },
  { id: 'bills',   label: 'Bills',   icon: 'Receipt',   color: 'bg-rose-500' },
];

// ---------------------------------------------------------------------------
// MOCK_NOTIFICATIONS — 5 (transaction / security / ai / promotion / bill-reminder)
// ---------------------------------------------------------------------------

/**
 * Five inbox notifications: a received-payment confirmation, a new-device
 * security alert, an AI spending insight, a Dashain promotion, and an
 * upcoming NEA bill reminder.
 */
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'transaction',
    title: 'Payment Received',
    body: 'You received NPR 7,500 from Sita Sharma (Freelance project payment).',
    timestamp: HOURS_AGO(115),
    read: false,
  },
  {
    id: 'n2',
    type: 'security',
    title: 'New device login',
    body: 'Login from iPhone 15 in Kathmandu at 09:42. If this wasn\'t you, secure your account immediately.',
    timestamp: HOURS_AGO(20),
    read: false,
  },
  {
    id: 'n3',
    type: 'ai',
    title: 'VasPay AI Insight',
    body: 'You\'re on track to overshoot your Shopping budget by NPR 249 this month. Tap to see tips.',
    timestamp: HOURS_AGO(8),
    read: false,
  },
  {
    id: 'n4',
    type: 'promotion',
    title: 'Dashain Cashback',
    body: 'Get up to NPR 500 cashback on Bhat-Bhateni QR payments this Dashain. Valid till Oct 02.',
    timestamp: DAYS_AGO(1),
    read: true,
  },
  {
    id: 'n5',
    type: 'transaction',
    title: 'NEA Bill Due',
    body: 'Your NPR 1,520 electricity bill is due in 2 days. Pay now to avoid late fees.',
    timestamp: DAYS_AGO(2),
    read: true,
  },
];

// ---------------------------------------------------------------------------
// MOCK_BUDGET_CATEGORIES — 6 categories (budget vs spent, hex color)
// ---------------------------------------------------------------------------

/**
 * Monthly budget lines. `spent` values are derived from the
 * MOCK_TRANSACTIONS outflows (payment / bill_payment / transfer, excluding
 * failed) so the Analytics + Budget pages stay internally consistent.
 *
 *   Food          50 + 685                 =   735  (budget 8,000)
 *   Utilities   1520 + 340 + 299 + 1595    = 3,754  (budget 5,000)
 *   Shopping   8750 + 3499                 =12,249  (budget 12,000 — OVER)
 *   Transport   285 + 845                  = 1,130  (budget 3,000)
 *   Entertainment 600                      =   600  (budget 2,000)
 *   Others     5000 (pending transfer)     = 5,000  (budget 5,000 — AT LIMIT)
 */
export const MOCK_BUDGET_CATEGORIES: BudgetCategory[] = [
  { name: 'Food',          budget: 8000,  spent: 735,   color: '#ef4444' },
  { name: 'Utilities',     budget: 5000,  spent: 3754,  color: '#10b981' },
  { name: 'Shopping',      budget: 12000, spent: 12249, color: '#6366f1' },
  { name: 'Transport',     budget: 3000,  spent: 1130,  color: '#f59e0b' },
  { name: 'Entertainment', budget: 2000,  spent: 600,   color: '#8b5cf6' },
  { name: 'Others',        budget: 5000,  spent: 5000,  color: '#ec4899' },
];

// ---------------------------------------------------------------------------
// MONTHLY_SPENDING — 6 months (Apr–Sep) for charts
// ---------------------------------------------------------------------------

/**
 * Monthly spending + income rollup for the Analytics trend chart. `amount`
 * is total outflow; `income` is total inflow for the same month. Sep is
 * the partial current month (spent so far = NPR 23,468, matching the budget
 * totals above for cross-view consistency).
 */
export const MONTHLY_SPENDING: Array<{
  month: string;
  amount: number;
  income: number;
}> = [
  { month: 'Apr', amount: 28500, income: 65000 },
  { month: 'May', amount: 32100, income: 65000 },
  { month: 'Jun', amount: 26800, income: 58000 },
  { month: 'Jul', amount: 35200, income: 65000 },
  { month: 'Aug', amount: 41500, income: 75000 },
  { month: 'Sep', amount: 23468, income: 65000 },
];

// ---------------------------------------------------------------------------
// NEPALI_BANKS — 10 BFIs for bank-transfer picklist
// ---------------------------------------------------------------------------

/**
 * Ten Nepali commercial banks, in alphabetical-by-common-name order, used
 * to populate the BankTransfer beneficiary-form select.
 */
export const NEPALI_BANKS: string[] = [
  'Nabil Bank',
  'Global IME Bank',
  'NIC Asia Bank',
  'Siddhartha Bank',
  'Himalayan Bank',
  'Everest Bank',
  'NMB Bank',
  'Prabhu Bank',
  'Citizen Bank',
  'Mega Bank',
];

// ---------------------------------------------------------------------------
// CATEGORY_COLORS — shared hex palette per spending category
// ---------------------------------------------------------------------------

/**
 * Single source of truth for category -> hex color, so charts, badges and
 * legends stay consistent across the app.
 */
export const CATEGORY_COLORS: Record<
  'food' | 'utilities' | 'entertainment' | 'shopping' | 'transport' | 'others',
  string
> = {
  food: '#ef4444',
  utilities: '#10b981',
  entertainment: '#8b5cf6',
  shopping: '#6366f1',
  transport: '#f59e0b',
  others: '#ec4899',
};
