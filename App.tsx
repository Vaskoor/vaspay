/**
 * @fileoverview App.tsx — VasPay application root + state-based router.
 *
 * VasPay uses lightweight in-memory state-based routing instead of a URL
 * router. The currently active view is held in `useState`, persisted to
 * `localStorage` so that returning users skip the landing screen. The router
 * switches over the full {@link ViewState} union (15 values, of which
 * `settings` aliases `Profile` — giving 14 distinct page components).
 *
 * Two views (`landing`, `scan`) are intentionally full-screen and are *not*
 * wrapped in the {@link Layout} shell — they render directly.
 *
 * @license MIT
 * @author VasPay Team
 */
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/ui/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import ScanPay from './pages/ScanPay';
import AIChat from './pages/AIChat';
import SendMoney from './pages/SendMoney';
import LoadMoney from './pages/LoadMoney';
import RequestMoney from './pages/RequestMoney';
import BankTransfer from './pages/BankTransfer';
import TransactionHistory from './pages/TransactionHistory';
import Profile from './pages/Profile';
import Cards from './pages/Cards';
import Savings from './pages/Savings';
import Notifications from './pages/Notifications';
import { MOCK_USER } from './constants';
import type { ViewState } from './types';

/** localStorage key used to remember that the user has onboarded. */
const VISITED_KEY = 'vaspay_visited';

/**
 * Root component for the VasPay wallet. Owns the in-memory routing state,
 * persistence, and view composition.
 */
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');

  // Restore session: returning users skip the landing page.
  useEffect(() => {
    try {
      if (localStorage.getItem(VISITED_KEY) === 'true') {
        setCurrentView('dashboard');
      }
    } catch {
      // localStorage may be unavailable (private mode / disabled). Fall
      // back gracefully — the in-memory default ('landing') remains.
    }
  }, []);

  /** Called from the Landing screen's CTA. Persists onboarding + advances. */
  const handleStart = (): void => {
    try {
      localStorage.setItem(VISITED_KEY, 'true');
    } catch {
      // Ignore storage errors — in-memory state still transitions.
    }
    setCurrentView('dashboard');
  };

  /** Convenience back-handler that always returns to the dashboard. */
  const goDashboard = (): void => setCurrentView('dashboard');

  /**
   * Renders the page component for the currently active view. The two
   * full-screen views (`landing`, `scan`) are included in the switch for
   * completeness but are surfaced outside the {@link Layout} wrapper by the
   * early-return below.
   */
  const renderContent = (): React.ReactNode => {
    switch (currentView) {
      case 'landing':
        return <Landing onStart={handleStart} />;
      case 'dashboard':
        return <Dashboard user={MOCK_USER} onNavigate={setCurrentView} />;
      case 'analytics':
        return <Analytics />;
      case 'scan':
        return <ScanPay onBack={goDashboard} />;
      case 'chat':
        return <AIChat user={MOCK_USER} />;
      case 'send_money':
        return <SendMoney onBack={goDashboard} />;
      case 'load_money':
        return <LoadMoney onBack={goDashboard} />;
      case 'request_money':
        return <RequestMoney onBack={goDashboard} />;
      case 'bank_transfer':
        return <BankTransfer onBack={goDashboard} />;
      case 'transactions':
        return <TransactionHistory onBack={goDashboard} />;
      case 'profile':
      case 'settings': // 'settings' aliases 'profile' for the v1 MVP.
        return (
          <Profile
            user={MOCK_USER}
            onNavigate={setCurrentView}
            onBack={goDashboard}
          />
        );
      case 'cards':
        return <Cards user={MOCK_USER} onBack={goDashboard} />;
      case 'savings':
        return <Savings user={MOCK_USER} onBack={goDashboard} />;
      case 'notifications':
        return <Notifications onBack={goDashboard} />;
      default:
        // Defensive: any unexpected value falls back to the dashboard.
        return <Dashboard user={MOCK_USER} onNavigate={setCurrentView} />;
    }
  };

  // Compute once per render — cheap, and avoids double-rendering.
  const content = renderContent();
  const isFullScreen = currentView === 'landing' || currentView === 'scan';

  // Full-screen views bypass the shell entirely.
  if (isFullScreen) {
    return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
  }

  return (
    <Layout
      activeView={currentView}
      onNavigate={setCurrentView}
      user={MOCK_USER}
    >
      <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
    </Layout>
  );
};

export default App;
