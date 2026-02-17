import React from 'react';
import { ArrowLeft, Smartphone, Globe, CreditCard, Building2, ChevronRight } from 'lucide-react';

interface LoadMoneyProps {
    onBack: () => void;
}

const LoadMoney: React.FC<LoadMoneyProps> = ({ onBack }) => {
    const methods = [
        { id: 'mobile_banking', title: 'Mobile Banking', icon: Smartphone, color: 'bg-purple-100 text-purple-600' },
        { id: 'ebanking', title: 'eBanking', icon: Globe, color: 'bg-blue-100 text-blue-600' },
        { id: 'connect_ips', title: 'Connect IPS', icon: Building2, color: 'bg-teal-100 text-teal-600' },
        { id: 'card', title: 'Debit/Credit Card', icon: CreditCard, color: 'bg-rose-100 text-rose-600' },
    ];

    return (
        <div className="p-4 max-w-xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Load Funds</h1>
            </div>

            <p className="text-gray-500 mb-6 text-sm">Choose a method to add money to your VasPay wallet.</p>

            <div className="space-y-4">
                {methods.map((method) => {
                    const Icon = method.icon;
                    return (
                        <button 
                            key={method.id}
                            className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all active:scale-[0.98]"
                            onClick={() => alert('Integration coming soon in Demo!')}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${method.color}`}>
                                    <Icon size={24} />
                                </div>
                                <span className="font-semibold text-gray-800">{method.title}</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export default LoadMoney;
