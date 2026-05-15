import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Cpu } from 'lucide-react';
import { SEO } from '../components/seo/SEO';
import { auth } from '../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const PricingCard = ({ 
  plan, 
  price, 
  features, 
  isPopular = false,
  onSelect 
}: { 
  plan: string, 
  price: string, 
  features: string[], 
  isPopular?: boolean,
  onSelect: () => void 
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={cn(
      "card p-10 flex flex-col h-full relative",
      isPopular ? "border-white/20 bg-white/[0.03]" : "border-white/5"
    )}
  >
    {isPopular && (
      <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
        Most Recommended
      </span>
    )}
    <div className="mb-8">
      <h3 className="text-sm font-bold tracking-[0.3em] uppercase text-white/40 mb-2">{plan}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-black text-white">{price}</span>
        {price !== "Custom" && <span className="text-white/20 text-xs font-bold">/mo</span>}
      </div>
    </div>
    
    <ul className="space-y-4 mb-10 flex-1">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3 text-sm text-white/60 font-light">
          <Check className="w-4 h-4 text-white" />
          {f}
        </li>
      ))}
    </ul>

    <button 
      onClick={onSelect}
      className={cn(
        "w-full py-4 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all",
        isPopular ? "bg-white text-black hover:bg-slate-200" : "bg-white/5 text-white hover:bg-white/10"
      )}
    >
      {plan === "Enterprise" ? "Contact Architecture" : "Upgrade Plan"}
    </button>
  </motion.div>
);

import { cn } from '../lib/utils';

export const PricingPage = () => {
  const [user] = useAuthState(auth);

  const handlePayment = async (plan: string, amount: number) => {
    if (!user) {
      alert("Please sign in first");
      return;
    }

    try {
      // Create Razorpay Order via our Express backend
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'INR' })
      });
      
      const order = await response.json();

      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // Usually injected via env or fetched
        amount: order.amount,
        currency: order.currency,
        name: "TubeSummarizer Pro",
        description: `Upgrade to ${plan} Plan`,
        order_id: order.id,
        handler: function (response: any) {
          console.log("Payment successful:", response);
          // Redirect to dashboard or success page
          window.location.href = '/dashboard?success=true';
        },
        prefill: {
          email: user.email,
          name: user.displayName
        },
        theme: {
          color: "#000000"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <div className="pt-40 pb-32 px-6">
      <SEO title="Precision Pricing" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-8xl font-light mb-8 tracking-tighter text-white">Scale your <br /><span className="font-black italic">Intelligence.</span></h2>
          <p className="text-white/40 text-xl font-light max-w-2xl mx-auto">
            Choose the throughput that matches your research velocity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard 
            plan="Researcher"
            price="Free"
            features={[
              '5 Neural Summaries / mo',
              'Standard Gemini 1.5 Flash',
              'Web Dashboard Access',
              'Basic Markdown Export'
            ]}
            onSelect={() => {}}
          />
          <PricingCard 
            plan="Intelligence Pro"
            price="₹499"
            isPopular
            features={[
              'Unlimited Neural Summaries',
              'Advanced Gemini 2.0 Engine',
              'Custom System Directives',
              'Obsidian & Notion Integration',
              'High-priority WASM Core'
            ]}
            onSelect={() => handlePayment('Pro', 499)}
          />
          <PricingCard 
            plan="Enterprise"
            price="Custom"
            features={[
              'Shared Organization Tokens',
              'Custom Prompt Engineering',
              'Dedicated Infrastructure',
              'Audit Logs & User Analytics',
              'White-labeled Output'
            ]}
            onSelect={() => {}}
          />
        </div>

        {/* Security / Quality Seals */}
        <div className="mt-40 flex flex-wrap justify-center gap-24 opacity-30">
          {[
            { icon: Shield, label: 'Encrypted Payments' },
            { icon: Cpu, label: 'Gemini 2.0 Core' },
            { icon: Zap, label: 'SLA Guaranteed' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <item.icon className="w-5 h-5 text-white" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
