import React from 'react';
import { ViewState } from '../../types';
import { Home, PieChart, Scan, Wallet, MessageSquare, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'analytics', icon: PieChart, label: 'Analytics' },
    { id: 'scan', icon: Scan, label: 'Scan', isPrimary: true },
    { id: 'chat', icon: MessageSquare, label: 'AI Chat' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-800">
      {/* Header - Hidden on Landing */}
      {activeView !== 'landing' && (
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              V
            </div>
            <span className="font-bold text-xl tracking-tight text-indigo-900">VasPay</span>
          </div>
          <button 
             onClick={() => onNavigate('profile')}
             className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
            <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover" />
          </button>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
        {children}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      {activeView !== 'landing' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-30 md:hidden pb-safe">
          <ul className="flex justify-between items-end">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              const Icon = item.icon;
              
              if (item.isPrimary) {
                return (
                  <li key={item.id} className="-mt-8">
                    <button
                      onClick={() => onNavigate(item.id as ViewState)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center"
                    >
                      <Icon size={28} />
                    </button>
                  </li>
                );
              }

              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id as ViewState)}
                    className={`flex flex-col items-center p-2 transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Icon size={24} />
                    <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Layout;
