import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Check, Crown, Sparkles, Zap, Shield,
  Infinity, Clock, Users, Code, Image, Bot,
  Star, ChevronRight, CreditCard, Gift, Rocket,
  AlertTriangle, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreditsService, AuthService } from '../services/store';
import { CreditsBalance } from '../types';

// ZEN Subscription Plans
const PLANS = {
  free: {
    id: 'free',
    name: 'Free Trial',
    price: 0,
    interval: 'forever',
    credits: 7,
    features: [
      { text: '7 AI credits total', included: true },
      { text: 'Access to all AI models', included: true },
      { text: 'Basic agent creation', included: true },
      { text: 'Community support', included: true },
      { text: 'Priority processing', included: false },
      { text: 'Advanced tools', included: false },
      { text: 'API access', included: false },
    ],
    color: 'from-slate-600 to-slate-700',
    popular: false,
    cta: 'Current Plan'
  },
  plus: {
    id: 'plus',
    name: 'ZEN Plus',
    price: 19,
    interval: '/month',
    credits: 500,
    features: [
      { text: '500 AI credits/month', included: true },
      { text: 'Access to all AI models', included: true },
      { text: 'Unlimited agent creation', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Priority processing', included: true },
      { text: 'Advanced tools & integrations', included: true },
      { text: 'API access', included: false },
    ],
    color: 'from-blue-600 to-cyan-500',
    popular: true,
    cta: 'Upgrade to Plus',
    // You'll need to create this price in your Stripe dashboard and replace this
    stripePriceId: 'price_zen_plus_monthly'
  },
  pro: {
    id: 'pro',
    name: 'ZEN Pro',
    price: 49,
    interval: '/month',
    credits: -1, // Unlimited
    features: [
      { text: 'Unlimited AI credits', included: true },
      { text: 'Access to all AI models', included: true },
      { text: 'Unlimited agent creation', included: true },
      { text: 'Priority 24/7 support', included: true },
      { text: 'Priority processing', included: true },
      { text: 'Advanced tools & integrations', included: true },
      { text: 'Full API access', included: true },
    ],
    color: 'from-purple-600 to-pink-500',
    popular: false,
    cta: 'Go Pro',
    // You'll need to create this price in your Stripe dashboard and replace this
    stripePriceId: 'price_zen_pro_monthly'
  }
};

// Note: Replace with your actual Stripe publishable key (pk_live_...)
// The secret key should NEVER be in client-side code
const STRIPE_PUBLISHABLE_KEY = 'pk_live_REPLACE_WITH_YOUR_PUBLISHABLE_KEY';

// Plan type definition  
interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  credits: number;
  features: { text: string; included: boolean }[];
  color: string;
  popular: boolean;
  cta: string;
  stripePriceId?: string;
}

function PlanCard({
  plan,
  currentPlan,
  onSelect
}: {
  plan: Plan;
  currentPlan: string;
  onSelect: (planId: string) => void;
}) {
  const isCurrentPlan = currentPlan === plan.id;
  const isUpgrade = (currentPlan === 'free' && (plan.id === 'plus' || plan.id === 'pro')) ||
    (currentPlan === 'plus' && plan.id === 'pro');

  return (
    <div className={`relative group rounded-[2.5rem] p-[2px] transition-all duration-700 ${plan.popular ? 'bg-gradient-to-br ' + plan.color : 'bg-white/10'
      } hover:shadow-[0_0_60px_rgba(59,130,246,0.2)]`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg z-10">
          Most Popular
        </div>
      )}

      <div className="h-full rounded-[2.4rem] bg-slate-900/95 backdrop-blur-xl p-8 flex flex-col">
        {/* Plan Header */}
        <div className="mb-8">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
            {plan.id === 'free' ? <Gift size={24} className="text-white" /> :
              plan.id === 'plus' ? <Zap size={24} className="text-white" /> :
                <Crown size={24} className="text-white" />}
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">{plan.name}</h3>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-4xl font-black text-white">${plan.price}</span>
            <span className="text-sm text-slate-500 font-bold">{plan.interval}</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-sm font-bold text-slate-400">
              {plan.credits === -1 ? 'Unlimited credits' : `${plan.credits} credits${plan.id !== 'free' ? '/mo' : ''}`}
            </span>
          </div>
        </div>

        {/* Features List */}
        <ul className="space-y-4 mb-8 flex-1">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${feature.included
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-white/5 text-slate-600'
                }`}>
                <Check size={12} />
              </div>
              <span className={`text-sm font-medium ${feature.included ? 'text-slate-300' : 'text-slate-600'}`}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          onClick={() => !isCurrentPlan && isUpgrade && onSelect(plan.id)}
          disabled={isCurrentPlan || !isUpgrade}
          className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${isCurrentPlan
            ? 'bg-white/5 text-slate-500 border border-white/10 cursor-default'
            : isUpgrade
              ? `bg-gradient-to-r ${plan.color} text-white hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] active:scale-95`
              : 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
            }`}
        >
          {isCurrentPlan ? (
            <span className="flex items-center justify-center gap-2">
              <Check size={16} /> Current Plan
            </span>
          ) : isUpgrade ? (
            <span className="flex items-center justify-center gap-2">
              {plan.cta} <ChevronRight size={16} />
            </span>
          ) : (
            'Included in Current'
          )}
        </button>
      </div>
    </div>
  );
}

export default function Subscription() {
  const navigate = useNavigate();
  const [credits, setCredits] = useState<CreditsBalance>(CreditsService.getBalance());
  const [loading, setLoading] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Refresh credits on mount and after any changes
  const refreshCredits = () => setCredits(CreditsService.getBalance());

  useEffect(() => {
    refreshCredits();

    // Check for payment success/cancel from Stripe redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      const plan = urlParams.get('plan');
      if (plan === 'plus') {
        CreditsService.upgradeToPlus();
      } else if (plan === 'pro') {
        CreditsService.upgradeToPro();
      }
      refreshCredits();
      setShowSuccess(true);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Handle plan selection - for demo we'll simulate, for production use Stripe Checkout
  const handleSelectPlan = async (planId: string) => {
    setLoading(planId);

    // DEMO MODE: Simulate upgrade for preview
    // In production, you would redirect to Stripe Checkout here
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (planId === 'plus') {
      CreditsService.upgradeToPlus();
    } else if (planId === 'pro') {
      CreditsService.upgradeToPro();
    }

    refreshCredits();
    setShowSuccess(true);
    setLoading(null);

    /* 
    // PRODUCTION: Use this for actual Stripe integration
    // Note: You need to set up a backend to create Checkout Sessions
    // The Stripe secret key should ONLY be used server-side
    
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        priceId: PLANS[planId as keyof typeof PLANS].stripePriceId,
        successUrl: window.location.href + '?success=true&plan=' + planId,
        cancelUrl: window.location.href + '?canceled=true'
      })
    });
    const { url } = await response.json();
    window.location.href = url;
    */
  };

  const currentPlan = credits.plan;

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn pb-20">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-wider">Back</span>
      </button>

      {/* Current Status */}
      <div className="p-8 rounded-[2rem] bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-white/10 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2 block">
              Current Status
            </span>
            <h1 className="text-4xl font-black text-white uppercase tracking-tight flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${PLANS[currentPlan as keyof typeof PLANS]?.color || PLANS.free.color} flex items-center justify-center shadow-lg`}>
                {currentPlan === 'pro' || currentPlan === 'enterprise' ? <Crown size={22} className="text-white" /> :
                  currentPlan === 'plus' ? <Zap size={22} className="text-white" /> :
                    <Gift size={22} className="text-white" />}
              </div>
              {PLANS[currentPlan as keyof typeof PLANS]?.name || 'Free Trial'}
            </h1>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Credits Remaining</div>
              <div className="text-3xl font-black text-white flex items-center gap-2">
                {credits.plan === 'pro' || credits.plan === 'enterprise' ? (
                  <>
                    <Infinity size={28} className="text-purple-400" />
                    <span className="text-purple-400">Unlimited</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={24} className="text-amber-400" />
                    {credits.remaining} / {credits.total}
                  </>
                )}
              </div>
            </div>

            {credits.reset_date && (
              <div className="text-right border-l border-white/10 pl-8">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Resets On</div>
                <div className="text-lg font-bold text-slate-300 flex items-center gap-2">
                  <Clock size={16} className="text-blue-400" />
                  {new Date(credits.reset_date).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Low Credits Warning */}
        {CreditsService.getLowCreditsWarning() && (
          <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-4">
            <AlertTriangle size={20} className="text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-300">Running low on credits!</p>
              <p className="text-[12px] text-amber-200/70">Upgrade to continue using AI features without interruption.</p>
            </div>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
          <Crown size={16} className="text-purple-400" />
          <span className="text-[10px] font-black text-purple-300 uppercase tracking-[0.3em]">Pricing Plans</span>
        </div>
        <h2 className="text-5xl font-black text-white uppercase tracking-tight">
          Unlock Full Power
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Get more credits, priority processing, and advanced features to supercharge your AI creations.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PlanCard plan={PLANS.free} currentPlan={currentPlan} onSelect={handleSelectPlan} />
        <PlanCard plan={PLANS.plus} currentPlan={currentPlan} onSelect={handleSelectPlan} />
        <PlanCard plan={PLANS.pro} currentPlan={currentPlan} onSelect={handleSelectPlan} />
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center animate-pulse">
              <CreditCard size={36} className="text-white" />
            </div>
            <div>
              <p className="text-xl font-black text-white uppercase tracking-wider">Processing Upgrade</p>
              <p className="text-slate-400 text-sm mt-2">Setting up your {loading === 'plus' ? 'ZEN Plus' : 'ZEN Pro'} subscription...</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-[2rem] p-10 text-center shadow-2xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center animate-bounce">
              <Check size={40} className="text-white" />
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4">
              Upgrade Successful!
            </h3>
            <p className="text-slate-400 mb-8">
              Your account has been upgraded. Enjoy your new AI superpowers!
            </p>
            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  navigate('/dashboard');
                }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl text-white font-black uppercase tracking-wider hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <Rocket size={18} /> Start Creating
                </span>
              </button>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 font-bold hover:text-white hover:bg-white/10 transition-all"
              >
                Stay on This Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ / Info Section */}
      <div className="mt-16 p-8 rounded-[2rem] bg-slate-900/50 border border-white/5">
        <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3">
          <Shield size={20} className="text-blue-400" />
          Secure Payments
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <CreditCard size={18} className="text-slate-500 mt-0.5 shrink-0" />
            <p className="text-slate-400">All payments are processed securely through Stripe. We never store your card details.</p>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={18} className="text-slate-500 mt-0.5 shrink-0" />
            <p className="text-slate-400">Cancel anytime. Your credits will remain active until the end of your billing period.</p>
          </div>
          <div className="flex items-start gap-3">
            <Star size={18} className="text-slate-500 mt-0.5 shrink-0" />
            <p className="text-slate-400">Upgrade or downgrade at any time. Changes take effect on your next billing cycle.</p>
          </div>
        </div>
      </div>

      {/* Demo mode notice */}
      <div className="text-center">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest">
          Demo Mode • Upgrades are simulated for preview
        </p>
      </div>
    </div>
  );
}