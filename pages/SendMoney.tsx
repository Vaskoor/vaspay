import React, { useState } from 'react';
import { ArrowLeft, User, ShieldAlert, CheckCircle, Loader2 } from 'lucide-react';
import { detectFraudRisk } from '../services/geminiService';
import { Transaction } from '../types';

interface SendMoneyProps {
    onBack: () => void;
}

const SendMoney: React.FC<SendMoneyProps> = ({ onBack }) => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [remarks, setRemarks] = useState('');
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'confirming' | 'success'>('idle');
    const [risk, setRisk] = useState<{ risk: string; reason: string } | null>(null);

    const handleAnalyze = async () => {
        if (!recipient || !amount) return;
        
        setStatus('analyzing');
        
        // Mock transaction object for AI analysis
        const tx: any = {
            amount: parseFloat(amount),
            recipient: recipient,
            description: remarks || 'Transfer',
            type: 'payment',
            currency: 'NPR',
            date: new Date().toISOString()
        };

        const result = await detectFraudRisk(tx);
        setRisk(result);
        setStatus('confirming');
    };

    const handleConfirm = () => {
        // Simulate API call
        setStatus('success');
        setTimeout(() => {
            onBack();
        }, 2000);
    };

    if (status === 'success') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Transfer Successful!</h2>
                <p className="text-gray-500 mt-2">Rs. {amount} has been sent to {recipient}.</p>
                <button onClick={onBack} className="mt-8 text-indigo-600 font-semibold hover:underline">
                    Back to Wallet
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Send Money</h1>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                
                {status === 'confirming' && risk ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                         <div className={`p-4 rounded-xl mb-6 border ${risk.risk === 'high' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                            <div className="flex items-start gap-3">
                                <ShieldAlert size={24} className={risk.risk === 'high' ? 'text-red-600' : 'text-blue-600'} />
                                <div>
                                    <h3 className={`font-bold text-sm ${risk.risk === 'high' ? 'text-red-800' : 'text-blue-800'}`}>
                                        AI Security Check: {risk.risk.toUpperCase()} Risk
                                    </h3>
                                    <p className={`text-xs mt-1 ${risk.risk === 'high' ? 'text-red-700' : 'text-blue-700'}`}>
                                        {risk.reason}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Recipient</span>
                                <span className="font-semibold text-gray-900">{recipient}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Amount</span>
                                <span className="font-bold text-gray-900 text-lg">Rs. {parseFloat(amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Remarks</span>
                                <span className="text-gray-900">{remarks || '-'}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button 
                                onClick={() => setStatus('idle')}
                                className="flex-1 py-3.5 border border-gray-300 text-gray-700 font-semibold rounded-xl"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={handleConfirm}
                                className={`flex-1 py-3.5 text-white font-semibold rounded-xl shadow-md ${risk.risk === 'high' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            >
                                Confirm Transfer
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recipient</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    placeholder="Mobile Number or VasPay ID"
                                    className="block w-full pl-10 pr-3 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Amount (NPR)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="block w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-xl font-semibold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Remarks</label>
                            <input
                                type="text"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Bill payment, Lunch, etc."
                                className="block w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={!amount || !recipient || status === 'analyzing'}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {status === 'analyzing' ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Analyzing Risk...
                                </>
                            ) : (
                                'Proceed'
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SendMoney;
