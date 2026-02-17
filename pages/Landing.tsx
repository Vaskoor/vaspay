import React from 'react';
import { Shield, Wallet, Brain, ChevronRight } from 'lucide-react';

interface LandingProps {
    onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-200 rotate-3">
                <span className="text-white font-bold text-4xl">V</span>
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">VasPay</h1>
            <p className="text-lg text-slate-500 mb-8 max-w-xs">Nepal's First Agentic AI Digital Wallet</p>

            <div className="grid grid-cols-1 gap-4 w-full max-w-sm mb-10">
                <FeatureCard 
                    icon={Brain} 
                    title="AI Financial Assistant" 
                    desc="Smart advice on spending & budgeting." 
                    color="text-indigo-600" bg="bg-indigo-50"
                />
                <FeatureCard 
                    icon={Shield} 
                    title="Fraud Protection" 
                    desc="Real-time AI risk monitoring." 
                    color="text-teal-600" bg="bg-teal-50"
                />
                <FeatureCard 
                    icon={Wallet} 
                    title="Seamless Payments" 
                    desc="QR, Bank Transfer & Bills." 
                    color="text-rose-600" bg="bg-rose-50"
                />
            </div>

            <button 
                onClick={onStart}
                className="w-full max-w-sm bg-slate-900 text-white font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
                Get Started
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="mt-6 text-xs text-gray-400">
                Secure • Reliable • Smart <br/>
                Licensed by Nepal Rastra Bank
            </p>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, color, bg }: any) => (
    <div className={`flex items-center gap-4 p-4 rounded-xl text-left border border-gray-100 ${bg}`}>
        <div className={`p-3 rounded-lg bg-white shadow-sm ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
            <p className="text-xs text-slate-500">{desc}</p>
        </div>
    </div>
);

export default Landing;
