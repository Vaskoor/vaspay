import React, { useState, useEffect } from 'react';
import Layout from './components/ui/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import ScanPay from './pages/ScanPay';
import AIChat from './pages/AIChat';
import Landing from './pages/Landing';
import SendMoney from './pages/SendMoney';
import LoadMoney from './pages/LoadMoney';
import RequestMoney from './pages/RequestMoney';
import BankTransfer from './pages/BankTransfer';
import TransactionHistory from './pages/TransactionHistory';
import { ViewState } from './types';
import { MOCK_USER } from './constants';

const App: React.FC = () => {
  // Simple state-based routing
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  
  // Fake "Login" persistence check
  useEffect(() => {
    const hasVisited = localStorage.getItem('vaspay_visited');
    if (hasVisited) {
        setCurrentView('dashboard');
    }
  }, []);

  const handleStart = () => {
    localStorage.setItem('vaspay_visited', 'true');
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    switch (currentView) {
        case 'landing':
            return <Landing onStart={handleStart} />;
        case 'dashboard':
            return <Dashboard user={MOCK_USER} onNavigate={setCurrentView} />;
        case 'analytics':
            return <Analytics />;
        case 'scan':
            return <ScanPay onBack={() => setCurrentView('dashboard')} />;
        case 'chat':
            return <AIChat user={MOCK_USER} />;
        case 'send_money':
            return <SendMoney onBack={() => setCurrentView('dashboard')} />;
        case 'load_money':
            return <LoadMoney onBack={() => setCurrentView('dashboard')} />;
        case 'request_money':
            return <RequestMoney onBack={() => setCurrentView('dashboard')} />;
        case 'bank_transfer':
            return <BankTransfer onBack={() => setCurrentView('dashboard')} />;
        case 'transactions':
            return <TransactionHistory onBack={() => setCurrentView('dashboard')} />;
        case 'profile':
            return (
                <div className="p-8 text-center">
                    <img src={MOCK_USER.avatarUrl} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">{MOCK_USER.name}</h2>
                    <p className="text-gray-500 mb-6">ID: {MOCK_USER.id}</p>
                    <button 
                        onClick={() => { localStorage.clear(); setCurrentView('landing'); }}
                        className="text-red-600 font-semibold border border-red-200 px-6 py-2 rounded-full hover:bg-red-50"
                    >
                        Log Out
                    </button>
                </div>
            );
        default:
            return <Dashboard user={MOCK_USER} onNavigate={setCurrentView} />;
    }
  };

  // If scanning, we want to break out of the layout wrapper for full screen
  if (currentView === 'scan') {
      return <ScanPay onBack={() => setCurrentView('dashboard')} />;
  }
  
  // Landing also has no layout
  if (currentView === 'landing') {
      return <Landing onStart={handleStart} />;
  }

  return (
    <Layout activeView={currentView} onNavigate={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
