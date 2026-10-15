/**
 * @fileoverview Layout.tsx — Top-level application shell for VasPay.
 *
 * Composes the sticky top header (brand lockup + notification bell + profile
 * avatar), a mobile bottom navigation bar with a raised primary "Scan" action,
 * and a desktop left rail that takes over the navigation role on `md+`
 * viewports. The main content area is responsive and clears the mobile bottom
 * nav via generous bottom padding.
 *
 * Path note: this file lives at `components/ui/Layout.tsx` — two directories
 * below the project root — so it imports shared types and constants via the
 * two-up relative specifier `../../types` and `../../constants`.
 *
 * @license MIT
 * @author VasPay Team
 */
import React from 'react';
import {
  BarChart3,
  Bell,
  Home,
  MessageSquare,
  Scan,
  User,
  Wallet,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import type { User as UserType, ViewState } from '../../types';
import { MOCK_USER } from '../../constants';

/** Icon component type accepted by nav items. */
type IconType = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

interface NavItem {
  /** View this item navigates to. */
  id: ViewState;
  /** Visible label for the item. */
  label: string;
  /** Lucide icon component. */
  icon: IconType;
  /** Whether this is the primary (raised) action in the mobile bar. */
  isPrimary?: boolean;
}

interface LayoutProps {
  /** Page content rendered inside the shell. */
  children: React.ReactNode;
  /** Currently active view, used to highlight the active nav item. */
  activeView: ViewState;
  /** Navigation callback invoked when a nav item is tapped. */
  onNavigate: (view: ViewState) => void;
  /** Optional unread-notification count rendered as a badge on the bell. */
  notificationCount?: number;
  /** Optional override for the user whose avatar appears in the header. */
  user?: UserType;
}

/**
 * The five primary navigation destinations. Scan is the central primary
 * action on mobile (raised indigo circle); on the desktop rail all five are
 * rendered as equal-weight list items.
 */
const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'scan', label: 'Scan', icon: Scan, isPrimary: true },
  { id: 'chat', label: 'AI Chat', icon: MessageSquare },
  { id: 'profile', label: 'Profile', icon: User },
];

/**
 * VasPay brand lockup: a gradient "V" tile + wordmark. Compact variant is
 * used inside the mobile header where horizontal space is at a premium.
 */
const Brand: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className="flex items-center gap-2.5 select-none">
    <div
      aria-hidden="true"
      className={`${
        compact ? 'w-8 h-8 text-lg' : 'w-9 h-9 text-xl'
      } rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-200/70 flex items-center justify-center text-white font-bold tracking-tight`}
    >
      V
    </div>
    <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
      VasPay
    </span>
  </div>
);

/**
 * Application shell. Renders the desktop left rail + mobile bottom nav + a
 * sticky top header. Caller (App.tsx) is responsible for not wrapping the
 * full-screen Landing and ScanPay views in this shell.
 */
const Layout: React.FC<LayoutProps> = ({
  children,
  activeView,
  onNavigate,
  notificationCount = 3,
  user = MOCK_USER,
}) => {
  /** Curried navigation handler — keeps JSX tidy and stops event bubbling. */
  const go = (id: ViewState) => (e?: React.MouseEvent) => {
    e?.preventDefault();
    onNavigate(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex">
      {/* ---------------------------------------------------------------- */}
      {/* Desktop left rail (hidden on mobile).                            */}
      {/* ---------------------------------------------------------------- */}
      <aside
        aria-label="Primary navigation"
        className="hidden md:flex md:flex-col md:fixed md:top-0 md:left-0 md:h-screen md:w-64 md:border-r md:border-slate-200 md:bg-white z-40"
      >
        <div className="px-5 h-14 flex items-center border-b border-slate-100">
          <Brand />
        </div>

        <nav className="flex-1 px-3 py-4" aria-label="Primary">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={go(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-1.5 rounded-full bg-indigo-600"
                      />
                    )}
                    <Icon
                      size={20}
                      className={isActive ? 'text-indigo-600' : 'text-slate-400'}
                    />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-slate-100">
          <button
            type="button"
            onClick={go('profile')}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
          >
            <img
              src={user.avatarUrl}
              alt={`${user.name}'s avatar`}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {user.name}
              </p>
              <p className="text-xs text-slate-400 truncate">
                ID&nbsp;·&nbsp;{user.id}
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------------------------- */}
      {/* Main column (offset on desktop to clear the left rail).           */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Sticky top header */}
        <header className="sticky top-0 z-30 h-14 glass border-b border-slate-200/70 px-4 md:px-6 flex items-center justify-between">
          {/* Brand on mobile only — the rail already owns it on desktop. */}
          <div className="md:hidden">
            <Brand compact />
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
            <Wallet size={16} className="text-indigo-500" aria-hidden="true" />
            <span className="font-medium">
              Nepal&rsquo;s First Agentic AI Digital Wallet
            </span>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={go('notifications')}
              aria-label={
                notificationCount > 0
                  ? `Notifications, ${notificationCount} unread`
                  : 'Notifications'
              }
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white"
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={go('profile')}
              aria-label="Open profile"
              className="ml-1 w-8 h-8 rounded-full overflow-hidden border-2 border-slate-200 hover:border-indigo-300 transition-colors"
            >
              <img
                src={user.avatarUrl}
                alt={`${user.name}'s avatar`}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto thin-scrollbar">
          <div className="max-w-3xl lg:max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-6 pb-28 md:pb-10">
            {children}
          </div>
        </main>

        {/* ---------------------------------------------------------------- */}
        {/* Mobile bottom nav (fixed, raised primary action).               */}
        {/* ---------------------------------------------------------------- */}
        <nav
          aria-label="Primary navigation"
          className="fixed bottom-0 left-0 right-0 z-30 glass border-t border-slate-200/70 px-3 pt-2 pb-safe md:hidden"
        >
          <ul className="flex justify-between items-end">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              if (item.isPrimary) {
                return (
                  <li key={item.id} className="-mt-7 flex-1 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={go(item.id)}
                      aria-label={item.label}
                      aria-current={isActive ? 'page' : undefined}
                      className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-300/50 active:scale-95 transition-transform ring-4 ring-white"
                    >
                      <Icon size={26} />
                    </button>
                    <span
                      className={`block text-[10px] mt-1 font-medium ${
                        isActive ? 'text-indigo-600' : 'text-slate-500'
                      }`}
                    >
                      {item.label}
                    </span>
                  </li>
                );
              }

              return (
                <li key={item.id} className="flex-1">
                  <button
                    type="button"
                    onClick={go(item.id)}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex flex-col items-center gap-1 py-1 transition-colors ${
                      isActive
                        ? 'text-indigo-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Icon size={22} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
