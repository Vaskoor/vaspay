import React from 'react';
import { ArrowLeft, User, QrCode } from 'lucide-react';

interface RequestMoneyProps {
    onBack: () => void;
}

const RequestMoney: React.FC<RequestMoneyProps> = ({ onBack }) => {
    return (
        <div className="p-4 max-w-xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Request Money</h1>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center mb-6">
                 <div className="bg-indigo-50 p-4 rounded-xl mb-4">
                    <QrCode size={120} className="text-indigo-900" />
                 </div>
                 <h3 className="font-bold text-lg text-gray-900">Aarav Sharma</h3>
                 <p className="text-gray-500 text-sm mb-6">VasPay ID: 9841XXXXXX</p>
                 <button className="text-indigo-600 font-semibold text-sm hover:underline">Download QR Code</button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Request from Friend</h3>
                <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payer Mobile Number</label>
                        <input type="text" placeholder="98XXXXXXXX" className="block w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Amount</label>
                        <input type="number" placeholder="0.00" className="block w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                     </div>
                     <button onClick={() => alert('Request sent!')} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg mt-2">
                        Send Request
                     </button>
                </div>
            </div>
        </div>
    );
};

export default RequestMoney;
