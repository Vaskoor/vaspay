import React, { useState } from 'react';
import { User, Transaction, ViewState } from '../../types';
import { MOCK_TRANSACTIONS, QUICK_ACTIONS, MOCK_CONTACTS } from '../../constants';
import { Eye, EyeOff, Bell, ArrowUpRight, ArrowDownLeft, Wallet, ShieldCheck, Zap } from 'lucide-react';

interface DashboardProps {
  user: User;
  onNavigate: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR' }).format(amount);
  };

  const handleQuickAction = (actionId: string) => {
     switch(actionId) {
         case 'send': onNavigate('send_money'); break;
         case 'load': onNavigate('load_money'); break;
         case 'request': onNavigate('request_money'); break;
         case 'bank': onNavigate('bank_transfer'); break;
         default: break;
     }
  };

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      
      {/* Balance Card */}
      <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-purple-400 opacity-20 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                    <ShieldCheck size={14} className="text-green-300" />
                    <span>Verified Account</span>
                </div>
                <button onClick={() => setShowBalance(!showBalance)} className="text-white/80 hover:text-white">
                    {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
            </div>
            
            <p className="text-indigo-100 text-sm mb-1">Total Balance</p>
            <h2 className="text-3xl font-bold tracking-tight mb-6">
                {showBalance ? formatCurrency(user.balance) : 'Rs. •••••••'}
            </h2>

            <div className="flex justify-between gap-4">
                <button 
                    onClick={() => onNavigate('load_money')}
                    className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl py-2 px-4 flex items-center justify-center gap-2 transition-all"
                >
                    <ArrowDownLeft size={18} />
                    <span className="text-sm font-semibold">Load</span>
                </button>
                <button 
                    onClick={() => onNavigate('send_money')}
                    className="flex-1 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl py-2 px-4 flex items-center justify-center gap-2 transition-all font-semibold shadow-sm"
                >
                    <ArrowUpRight size={18} />
                    <span>Send</span>
                </button>
            </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        {QUICK_ACTIONS.map((action) => {
            const icons: Record<string, any> = { Send: ArrowUpRight, Download: ArrowDownLeft, Users: Zap, Landmark: Wallet };
            const Icon = icons[action.icon] || Wallet;
            return (
                <button 
                    key={action.id} 
                    onClick={() => handleQuickAction(action.id)}
                    className="flex flex-col items-center gap-2 group"
                >
                    <div className={`w-14 h-14 ${action.color} text-white rounded-2xl flex items-center justify-center shadow-md group-active:scale-95 transition-all`}>
                        <Icon size={24} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{action.label}</span>
                </button>
            )
        })}
      </div>

      {/* AI Insight Teaser */}
      <div 
        onClick={() => onNavigate('chat')}
        className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
      >
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Zap size={20} fill="currentColor" />
        </div>
        <div className="flex-1">
            <h4 className="text-sm font-bold text-emerald-900">VasPay AI Insights</h4>
            <p className="text-xs text-emerald-700 mt-1">You spent 20% less on utilities this month!</p>
        </div>
        <div className="text-emerald-500">
            <ArrowUpRight size={16} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">Recent Transactions</h3>
            <button 
                onClick={() => onNavigate('transactions')}
                className="text-indigo-600 text-sm font-medium hover:underline"
            >
                View All
            </button>
        </div>
        <div className="space-y-3">
            {MOCK_TRANSACTIONS.slice(0, 4).map((tx) => (
                <div key={tx.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'receive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {tx.type === 'receive' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 text-sm">{tx.recipient || tx.sender}</p>
                            <p className="text-xs text-gray-500 capitalize">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <span className={`font-bold text-sm ${tx.type === 'receive' ? 'text-green-600' : 'text-gray-900'}`}>
                        {tx.type === 'receive' ? '+' : '-'} {formatCurrency(tx.amount)}
                    </span>
                </div>
            ))}
        </div>
      </div>

      {/* Quick Send (Contacts) */}
      <div>
         <h3 className="font-bold text-lg text-gray-800 mb-4">Send Money</h3>
         <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            <button 
                onClick={() => onNavigate('send_money')}
                className="flex-shrink-0 flex flex-col items-center gap-2"
            >
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                    <ArrowUpRight size={24} />
                </div>
                <span className="text-xs font-medium text-gray-600">New</span>
            </button>
            {MOCK_CONTACTS.map(contact => (
                <button 
                    key={contact.id} 
                    onClick={() => onNavigate('send_money')}
                    className="flex-shrink-0 flex flex-col items-center gap-2"
                >
                    <img src={contact.avatar} alt={contact.name} className="w-14 h-14 rounded-full object-cover border border-gray-100" />
                    <span className="text-xs font-medium text-gray-600">{contact.name}</span>
                </button>
            ))}
         </div>
      </div>

    </div>
  );
};

export default Dashboard;
