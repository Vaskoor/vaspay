import React, { useState, useEffect } from 'react';
import { Camera, QrCode, X, Zap } from 'lucide-react';

interface ScanPayProps {
    onBack: () => void;
}

const ScanPay: React.FC<ScanPayProps> = ({ onBack }) => {
    const [scanned, setScanned] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Simulate scanning delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setScanned(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handlePay = () => {
        setProcessing(true);
        setTimeout(() => {
            alert("Payment simulated successfully! (Demo Mode)");
            setProcessing(false);
            onBack();
        }, 1500);
    }

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col text-white">
            {/* Header */}
            <div className="p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10">
                <button onClick={onBack} className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                    <X size={24} />
                </button>
                <h2 className="font-semibold text-lg">Scan & Pay</h2>
                <button className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                    <QrCode size={24} />
                </button>
            </div>

            {/* Camera Viewport Simulation */}
            <div className="flex-1 relative flex flex-col items-center justify-center bg-gray-900">
                {!scanned ? (
                    <>
                        {/* Scanning Animation */}
                        <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative overflow-hidden">
                             <div className="absolute inset-0 border-4 border-indigo-500 rounded-3xl opacity-50"></div>
                             <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                             <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-white/70 text-sm animate-pulse">Locating QR Code...</p>
                             </div>
                        </div>
                        <p className="mt-8 text-center text-gray-400 text-sm px-8">Align the QR code within the frame to pay instantly.</p>
                    </>
                ) : (
                    <div className="bg-white text-gray-900 p-6 rounded-3xl w-80 shadow-2xl animate-[popIn_0.3s_ease-out]">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                                <span className="text-2xl font-bold text-orange-600">B</span>
                            </div>
                            <h3 className="font-bold text-xl">Bhatbhateni Supermarket</h3>
                            <p className="text-sm text-gray-500">Koteshwor Branch</p>
                        </div>
                        
                        <div className="space-y-4">
                             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Amount (NPR)</label>
                                <input type="number" defaultValue={1250} className="w-full bg-transparent text-2xl font-bold text-gray-800 outline-none mt-1" />
                             </div>
                             
                             <div className="bg-indigo-50 p-3 rounded-lg flex items-center gap-3">
                                <Zap size={18} className="text-indigo-600" />
                                <p className="text-xs text-indigo-800">VasPay AI: This merchant is verified and safe.</p>
                             </div>

                             <button 
                                onClick={handlePay}
                                disabled={processing}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {processing ? <span className="animate-spin">⌛</span> : 'Confirm Payment'}
                             </button>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Bottom Controls */}
            {!scanned && (
                <div className="p-8 pb-12 bg-black flex justify-center items-center gap-8">
                    <button className="flex flex-col items-center gap-2 opacity-70 hover:opacity-100">
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                            <span className="text-xs">Img</span>
                        </div>
                        <span className="text-xs">Upload</span>
                    </button>
                    <button className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        <Camera size={32} className="text-gray-900" />
                    </button>
                    <button className="flex flex-col items-center gap-2 opacity-70 hover:opacity-100">
                         <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                            <span className="text-xs">⚡</span>
                        </div>
                        <span className="text-xs">Flash</span>
                    </button>
                </div>
            )}
            
            <style>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes popIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export default ScanPay;
