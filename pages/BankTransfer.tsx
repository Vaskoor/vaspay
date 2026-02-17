import React from 'react';
import { ArrowLeft, Landmark, Search } from 'lucide-react';

interface BankTransferProps {
    onBack: () => void;
}

const BankTransfer: React.FC<BankTransferProps> = ({ onBack }) => {
    const banks = ['Nabil Bank', 'Global IME Bank', 'NIC Asia Bank', 'Siddhartha Bank', 'Himalayan Bank', 'Everest Bank'];

    return (
        <div className="p-4 max-w-xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Bank Transfer</h1>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search for a bank..." 
                    className="w-full bg-white pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <h3 className="bg-gray-50 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Popular Banks</h3>
                <div className="divide-y divide-gray-100">
                    {banks.map((bank) => (
                        <button 
                            key={bank}
                            className="w-full px-6 py-4 flex items-center gap-4 hover:bg-indigo-50 transition-colors text-left group"
                            onClick={() => alert(`Selected ${bank}`)}
                        >
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                                <Landmark size={20} />
                            </div>
                            <span className="font-medium text-gray-800">{bank}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BankTransfer;
