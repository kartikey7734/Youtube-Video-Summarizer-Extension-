import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Edit3, 
  Sliders 
} from 'lucide-react';
import { SEO } from '../components/seo/SEO';
import { auth, signInWithGoogle } from '../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: { icon: any, title: string, description: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="card group hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/5"
  >
    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all">
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{title}</h3>
    <p className="text-white/40 leading-relaxed text-sm md:text-base font-light">{description}</p>
  </motion.div>
);

export const LandingPage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleCTA = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      signInWithGoogle();
    }
  };

  return (
    <div className="pt-20">
      <SEO title="Neural Video Distillation" />
      
      {/* Hero Section */}
      <section className="pt-28 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[10px] font-bold mb-10 inline-flex items-center gap-3 tracking-[0.2em] uppercase">
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
              Intelligence Distilled via Gemini 2.0
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-7xl md:text-[10rem] font-light mb-10 text-white leading-[0.85] tracking-tighter"
          >
            Watch less. <br />
            <span className="font-black text-white">Learn more.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-2xl text-white/40 mb-14 max-w-2xl mx-auto leading-relaxed font-light"
          >
            The premium research companion for high-fidelity information extraction from any video source.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <button 
              onClick={handleCTA}
              className="px-12 py-5 bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-slate-200 transition-all shadow-xl rounded-xl"
            >
              {user ? "Go to Dashboard" : "Start Distilling Free"}
            </button>
            <button 
              onClick={() => {
                 const el = document.getElementById('demo-video');
                 if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-12 py-5 border border-white/10 text-white/60 font-bold text-xs tracking-widest uppercase hover:bg-white/5 hover:text-white transition-all rounded-xl"
            >
              Live Demo
            </button>
          </motion.div>

          <motion.div
            id="demo-video"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full max-w-4xl mx-auto rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-white/5 aspect-video relative z-20 group cursor-pointer"
          >
             <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/n7_rxA2qhQY?autoplay=0&rel=0" 
                title="TubeSummarizer Demo" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Edit3}
              title="Custom Directives"
              description="Full control over the system prompt. Fine-tune exactly how AI perceives and distills your unique content."
              delay={0.1}
            />
            <FeatureCard 
              icon={Zap}
              title="Neural Processing"
              description="Extract transcripts and generate summaries in less than 3 seconds using Gemini 2.0 specialized models."
              delay={0.2}
            />
            <FeatureCard 
              icon={Shield}
              title="Secure Context"
              description="Zero-knowledge architecture. Your research payload remains local and encrypted during processing."
              delay={0.3}
            />
          </div>
        </div>
      </section>
      
      {/* Social Proof / Stats */}
      <section className="py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Intelligence Records', val: '1.2M+' },
              { label: 'SLA Uptime', val: '99.99%' },
              { label: 'Latency Node', val: '< 200ms' },
              { label: 'Precision Rate', val: '0.999' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-light text-white mb-2 tracking-tighter uppercase">{stat.val}</div>
                <div className="text-white/20 text-[10px] font-bold tracking-[0.4em] uppercase">{stat.label}</div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};
