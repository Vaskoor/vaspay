import React from 'react';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Search, Filter } from 'lucide-react';
import { MOCK_TRANSACTIONS } from '../../constants';

interface TransactionHistoryProps {
    onBack: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ onBack }) => {
    return (
        <div className="p-4 max-w-2xl mx-auto h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6 flex-shrink-0">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Transactions</h1>
            </div>

            <div className="flex gap-2 mb-6 flex-shrink-0">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search transactions..." 
                        className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                </div>
                <button className="bg-white p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">
                    <Filter size={20} />
                </button>
            </div>

            <div className="space-y-3 overflow-y-auto pb-4">
                {MOCK_TRANSACTIONS.map((tx) => (
                    <div key={tx.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'receive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {tx.type === 'receive' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">{tx.recipient || tx.sender}</p>
                                <p className="text-xs text-gray-500 mt-1 capitalize">{tx.description} • {new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <span className={`font-bold block ${tx.type === 'receive' ? 'text-green-600' : 'text-gray-900'}`}>
                                {tx.type === 'receive' ? '+' : '-'} Rs. {tx.amount.toLocaleString()}
                            </span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${tx.status === 'success' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                {tx.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionHistory;
