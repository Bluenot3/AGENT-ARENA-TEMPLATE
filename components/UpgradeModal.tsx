import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Zap, Crown, AlertTriangle, Minimize2, ChevronUp } from 'lucide-react';
import { CreditsService } from '../services/store';
import { CreditsBalance } from '../types';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onMinimize: () => void;
    isMinimized: boolean;
}

// Stripe Buy Button configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51PSMoCQQWKVFo9uLegvoSojQwyfX59jMYZzNi3Sx0ZXqkStli59oKBjCBLmGrY33YvyycFHeLDRuXlDqXggzPT02005b6mnBs3';
const STRIPE_BUY_BUTTON_ID = 'buy_btn_1Sq1QIQQWKVFo9uLL2JVKcPW';

export default function UpgradeModal({ isOpen, onClose, onMinimize, isMinimized }: UpgradeModalProps) {
    const [credits] = useState<CreditsBalance>(CreditsService.getBalance());
    const buyButtonRef = useRef<HTMLDivElement>(null);

    // Inject Stripe Buy Button when modal opens
    useEffect(() => {
        if (isOpen && !isMinimized && buyButtonRef.current) {
            // Clear any existing content
            buyButtonRef.current.innerHTML = '';

            // Create the stripe-buy-button element
            const stripeBuyButton = document.createElement('stripe-buy-button');
            stripeBuyButton.setAttribute('buy-button-id', STRIPE_BUY_BUTTON_ID);
            stripeBuyButton.setAttribute('publishable-key', STRIPE_PUBLISHABLE_KEY);

            buyButtonRef.current.appendChild(stripeBuyButton);
        }
    }, [isOpen, isMinimized]);

    // Listen for successful payment (you'll need to set up webhooks for production)
    useEffect(() => {
        const handlePaymentSuccess = () => {
            // Upgrade user after successful payment
            CreditsService.upgradeToPlus();
            onClose();
            window.location.reload();
        };

        // Check URL for success param (Stripe redirects here after payment)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('payment_success') === 'true') {
            handlePaymentSuccess();
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [onClose]);

    if (!isOpen) return null;

    // Minimized floating button
    if (isMinimized) {
        return (
            <button
                onClick={onMinimize}
                className="fixed bottom-6 right-6 z-[1000] p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.5)] text-white font-black text-sm flex items-center gap-3 hover:scale-105 transition-all animate-pulse"
            >
                <AlertTriangle size={20} />
                <span className="uppercase tracking-wider">Upgrade Required</span>
                <ChevronUp size={18} />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                onClick={onMinimize} // Allow minimizing by clicking backdrop
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-[2.5rem] border border-white/10 shadow-[0_0_100px_rgba(245,158,11,0.2)] overflow-hidden">
                {/* Header with warning gradient */}
                <div className="relative bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-red-600/20 p-8 border-b border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 animate-pulse" />

                    {/* Minimize button */}
                    <button
                        onClick={onMinimize}
                        className="absolute top-6 right-6 p-2 bg-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/20 transition-all"
                        title="Minimize"
                    >
                        <Minimize2 size={18} />
                    </button>

                    <div className="relative flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                            <AlertTriangle size={32} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                                Credits Exhausted
                            </h2>
                            <p className="text-amber-300/80 text-sm font-medium">
                                You've used all {credits.total} trial credits
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    <div className="text-center space-y-3">
                        <p className="text-slate-300 text-lg">
                            Unlock <span className="text-amber-400 font-bold">unlimited AI power</span> with ZEN Plus
                        </p>
                        <div className="flex items-center justify-center gap-8 py-4">
                            <div className="text-center">
                                <div className="text-4xl font-black text-white">500</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Credits/Month</div>
                            </div>
                            <div className="w-px h-12 bg-white/10" />
                            <div className="text-center">
                                <div className="text-4xl font-black text-emerald-400">$19</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Per Month</div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: Sparkles, text: '500 AI credits' },
                            { icon: Zap, text: 'Priority processing' },
                            { icon: Crown, text: 'Advanced tools' },
                            { icon: Sparkles, text: 'All AI models' },
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/5"
                            >
                                <feature.icon size={14} className="text-amber-400" />
                                <span className="text-sm text-slate-300">{feature.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Stripe Buy Button Container */}
                    <div className="flex justify-center pt-4">
                        <div ref={buyButtonRef} className="stripe-buy-button-container">
                            {/* Stripe Buy Button will be injected here */}
                        </div>
                    </div>

                    <p className="text-center text-[10px] text-slate-600 uppercase tracking-wider">
                        Secure payment via Stripe • Cancel anytime
                    </p>
                </div>

                {/* Bottom decoration */}
                <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
            </div>
        </div>
    );
}

// Hook to manage upgrade modal state
export function useUpgradeModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const showModal = () => {
        setIsOpen(true);
        setIsMinimized(false);
    };

    const closeModal = () => {
        setIsOpen(false);
        setIsMinimized(false);
    };

    const minimizeModal = () => {
        setIsMinimized(!isMinimized);
    };

    // Check credits and auto-show modal if depleted
    const checkCreditsAndPrompt = (): boolean => {
        const credits = CreditsService.getBalance();
        if (!CreditsService.hasCredits(1)) {
            showModal();
            return false; // No credits available
        }
        return true; // Credits available
    };

    return {
        isOpen,
        isMinimized,
        showModal,
        closeModal,
        minimizeModal,
        checkCreditsAndPrompt,
    };
}
