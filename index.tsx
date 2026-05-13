import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Play, 
  Zap, 
  Shield, 
  Clock, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Globe,
  Cpu,
  Bookmark,
  Settings,
  Edit3,
  Sliders,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { auth, signInWithGoogle, logout } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const Youtube = YoutubeIcon;
const Github = Globe;
const Activity = Zap;

import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import './index.css';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-white/10 bg-[#050505] text-[#E5E5E5] relative overflow-hidden">
      <div className="noise-overlay" />
      <div className="fixed inset-0 dot-grid opacity-[0.15] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shadow-sm">
              <Youtube className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tighter text-white">TubeSummarizer</span>
          </div>
          
          <div className="flex items-center gap-8">
            <a href="#features" className="text-white/40 hover:text-white transition-colors hidden md:block text-xs font-bold tracking-[0.2em] uppercase">Features</a>
            <a href="#how-it-works" className="text-white/40 hover:text-white transition-colors hidden md:block text-xs font-bold tracking-[0.2em] uppercase">Process</a>
            
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <div className="text-[10px] font-black text-white tracking-widest uppercase truncate max-w-[100px]">{user.displayName}</div>
                  <button onClick={handleLogout} className="text-[8px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">Sign Out</button>
                </div>
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                   <img src={user.photoURL || ''} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="px-6 py-2 bg-white text-black font-bold rounded-lg text-xs tracking-wider uppercase hover:bg-slate-200 transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-24 px-6 relative overflow-hidden">
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
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={user ? undefined : handleLogin}
              className="px-8 py-4 bg-white text-black font-black text-xs tracking-widest uppercase hover:bg-slate-200 transition-all shadow-xl"
            >
              {user ? "Add to Chrome" : "Sign In to Get Started"}
            </button>
            <button className="px-8 py-4 border border-white/10 text-white/60 font-bold text-xs tracking-widest uppercase hover:bg-white/5 hover:text-white transition-all">
              Live Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 relative px-4 flex justify-center"
          >
             <div className="relative group max-w-5xl w-full aspect-video rounded-[3rem] overflow-hidden border border-white/10 bg-[#050505] shadow-2xl">
                <img 
                   src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" 
                   alt="Modern Workstation" 
                   className="w-full h-full object-cover opacity-60 mix-blend-screen"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/10" />
                
                {/* Simulated UI Overlay for "Play Button and Slip" */}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="flex flex-col md:flex-row items-center gap-12 translate-y-10 group-hover:translate-y-0 transition-all duration-1000 ease-out">
                      {/* Floating Play Button */}
                      <div className="w-36 h-36 bg-zinc-900 border border-white/10 flex items-center justify-center rounded-[2.5rem] shadow-2xl rotate-[-8deg] relative overflow-hidden group/btn">
                         <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                         <Youtube className="text-white w-20 h-20 relative z-10" />
                         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-black tracking-[.4em] text-white/20 whitespace-nowrap">SOURCE_REEL</div>
                      </div>

                      {/* Technical Summary Slip */}
                      <div className="w-52 h-72 bg-[#FAFAFA] px-10 py-10 shadow-2xl rotate-[6deg] flex flex-col gap-5 text-left">
                         <div className="space-y-4">
                            <div className="text-[10px] font-black tracking-widest text-[#050505] border-b border-black/10 pb-2">CORE_INSIGHTS.txt</div>
                            <div className="space-y-2">
                               <div className="flex gap-2">
                                  <div className="w-1 h-1 bg-black rounded-full mt-1.5 shrink-0" />
                                  <div className="text-[9px] font-medium text-black/60 leading-tight">Neural architectures explained.</div>
                                </div>
                                <div className="flex gap-2">
                                  <div className="w-1 h-1 bg-black rounded-full mt-1.5 shrink-0" />
                                  <div className="text-[9px] font-medium text-black/60 leading-tight">Efficiency metrics at scale.</div>
                                </div>
                            </div>
                         </div>

                         <div className="space-y-3 mt-2">
                            <div className="text-[10px] font-black tracking-widest text-[#050505] border-b border-black/10 pb-2">NEXT_STEPS</div>
                            <div className="space-y-1">
                               <div className="text-[8px] font-bold text-black/40">01 IMPLEMENT_V2_CORE</div>
                               <div className="text-[8px] font-bold text-black/40">02 AUDIT_LATENCY_LOGS</div>
                               <div className="text-[8px] font-bold text-black/40">03 OPTIMIZE_WASM</div>
                            </div>
                         </div>

                         <div className="mt-auto pt-4 border-t border-black/5 flex justify-between items-center">
                            <div className="text-[8px] font-black text-black tracking-[0.2em]">SIG_ID: 88241</div>
                            <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-[6px] text-white font-bold tracking-tighter">PDF</div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-white/5 bg-white/[0.01] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Intelligence Records', val: '1.2M+' },
              { label: 'Infrastructure Nodes', val: '128' },
              { label: 'Uptime SLA', val: '99.99%' },
              { label: 'Model Precision', val: '0.992' }
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="text-3xl md:text-4xl font-light text-white mb-2 tracking-tighter group-hover:text-white transition-colors uppercase">{stat.val}</div>
                <div className="text-white/20 text-[10px] font-bold tracking-[0.4em] uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Integration - New Section */}
      <section className="py-12 border-b border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
           {['GEMINI 2.0 FLASH', 'CHROME ENGINE', 'V8 RUNTIME', 'WASM CORE'].map((tech) => (
             <span key={tech} className="text-xs font-black tracking-[0.3em] uppercase">{tech}</span>
           ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-light mb-6 tracking-tighter text-white">Built for <span className="font-black">Precision</span></h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto font-light">
              Everything you need to digest content faster, without losing the important details.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Edit3}
              title="Custom Directives"
              description="Full control over the system prompt. Fine-tune exactly how AI perceives and distills your unique content."
              delay={0.1}
            />
            <FeatureCard 
              icon={Sliders}
              title="Granular Control"
              description="Adjust extraction density, tone, and output structure with professional-grade configuration sliders."
              delay={0.2}
            />
            <FeatureCard 
              icon={Zap}
              title="Instant Extraction"
              description="Generate architectural-grade summaries in less than 3 seconds using optimized Gemini 2.0 processing."
              delay={0.3}
            />
            <FeatureCard 
              icon={Clock}
              title="Timeline Markers"
              description="Summary points are linked to video timestamps so you can jump directly to the context."
              delay={0.4}
            />
            <FeatureCard 
              icon={Shield}
              title="Privacy Sovereign"
              description="Zero data retention. Your intelligence workflow remains local and encrypted."
              delay={0.5}
            />
            <FeatureCard 
              icon={CheckCircle2}
              title="High-Velocity Mastery"
              description="Track your learning velocity and knowledge retention over time with high-fidelity analytics."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Control Studio Section */}
      <section className="py-40 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div className="order-2 md:order-1">
              <div className="card p-0 overflow-hidden border-white/10 bg-black shadow-[0_0_50px_rgba(255,255,255,0.02)]">
                <div className="bg-white/[0.03] border-b border-white/5 p-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                  </div>
                  <span className="text-[10px] font-bold tracking-[.3em] text-white/30">PROMPT_ENGINE_V2</span>
                  <div className="w-4" />
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 tracking-wider">SYSTEM DIRECTIVE</label>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-lg font-mono text-xs text-white/60 leading-relaxed italic">
                      "You are a high-level researcher. Extract only the technical proofs and ignore all marketing filler. Format as a structural hierarchy..."
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-[80%] bg-white/40" />
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-[45%] bg-white/40" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                       <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                         <Settings className="w-3 h-3 text-white/40" />
                       </div>
                       <button className="bg-white text-black px-4 py-1 rounded text-[10px] font-black tracking-widest uppercase">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl md:text-7xl font-light mb-8 tracking-tighter text-white">Your Intelligence, <br /><span className="font-black italic">Your Way.</span></h2>
              <p className="text-white/40 text-xl font-light leading-relaxed mb-10">
                The public release introduces **Studio Mode**. Edit the underlying system prompt to match your personal research preference. Whether it's code extraction, philosophical analysis, or executive overviews—you define the lens.
              </p>
              <ul className="space-y-4">
                {['Custom System Directives', 'Variable Output Density', 'Tone & Persona Mapping'].map(item => (
                  <li key={item} className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-white/60">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-40 px-6 bg-[#050505] relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-7xl font-light text-center mb-24 tracking-tighter">System <span className="font-black">Architecture</span></h2>
          
          <div className="space-y-32">
             <div className="flex flex-col md:flex-row items-center gap-24">
                <div className="flex-1">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-8">01</div>
                  <h3 className="text-3xl font-bold mb-5 tracking-tight">Signal Capture</h3>
                  <p className="text-white/40 text-xl leading-relaxed font-light">
                    Direct integration with YouTube's payload allows for instantaneous signal capture without metadata loss.
                  </p>
                </div>
                <div className="flex-1 card p-10 bg-white/[0.02] border-white/5">
                   <div className="h-1 w-3/4 bg-white/10 rounded-full mb-6" />
                   <div className="h-1 w-full bg-white/10 rounded-full mb-6" />
                   <div className="h-1 w-1/2 bg-white/10 rounded-full" />
                </div>
             </div>

             <div className="flex flex-col md:flex-row-reverse items-center gap-24">
                <div className="flex-1 text-right">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-8 ml-auto">02</div>
                  <h3 className="text-3xl font-bold mb-5 tracking-tight">Neural Distillation</h3>
                  <p className="text-white/40 text-xl leading-relaxed font-light">
                    Gemini 2.0 processes the signal through high-density distillation layers to extract core insights.
                  </p>
                </div>
                <div className="flex-1 card p-10 bg-white/[0.02] border-white/5 flex flex-col items-center justify-center min-h-[200px]">
                   <button className="px-8 py-3 bg-white text-black font-black text-xs tracking-widest uppercase hover:scale-105 transition-transform">
                     Distill Signal
                   </button>
                </div>
             </div>

             <div className="flex flex-col md:flex-row items-center gap-24">
                <div className="flex-1">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-8">03</div>
                  <h3 className="text-3xl font-bold mb-5 tracking-tight">High-Fidelity Output</h3>
                  <p className="text-white/40 text-xl leading-relaxed font-light mb-8">
                    Receive structured, architectural notes that are ready for implementation or archival.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {['JSON', 'Markdown', 'Notion', 'Obsidian'].map(fmt => (
                      <span key={fmt} className="px-3 py-1 bg-white/5 border border-white/5 text-[10px] font-bold tracking-widest uppercase rounded-full">
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-1 card p-10 bg-white/[0.02] border-white/5">
                    <div className="space-y-4">
                      <div className="flex gap-4"><div className="w-5 h-5 border border-white/10" /><div className="h-1 w-full bg-white/10 self-center" /></div>
                      <div className="flex gap-4"><div className="w-5 h-5 border border-white/10" /><div className="h-1 w-3/4 bg-white/10 self-center" /></div>
                      <div className="flex gap-4"><div className="w-5 h-5 border border-white/10" /><div className="h-1 w-1/2 bg-white/10 self-center" /></div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-40 px-6 border-t border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-tighter text-white">Security <br /><span className="font-black">Architecture</span></h2>
              <p className="text-white/40 text-xl font-light leading-relaxed mb-12">
                Our system is built on zero-knowledge architecture. All processing occurs within the Secure Context of your browser environment, leveraging Gemini's localized API endpoints.
              </p>
              <div className="space-y-6">
                {[
                  { title: 'End-to-End Encryption', desc: 'Secure TLS 1.3 tunnels for all model communications.' },
                  { title: 'Zero Data Retention', desc: 'Your watch history never touches our persistent storage.' },
                  { title: 'OIDC Compliant', desc: 'Enterprise-grade identity management protocols.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <div className="w-px h-12 bg-white/10 group-hover:bg-white/40 transition-colors" />
                    <div>
                      <h4 className="text-sm font-bold tracking-widest uppercase mb-1">{item.title}</h4>
                      <p className="text-xs text-white/30 font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-white/5 blur-[120px] rounded-full" />
              <div className="relative card p-12 bg-black border-white/10">
                <div className="font-mono text-[10px] text-white/20 whitespace-pre overflow-hidden">
                  {`> INITIALIZING ENCRYPTION LAYER...
> RSA-4096 KEYGEN SUCCESS
> MOUNTING SECURE CONTEXT
> HANDSHAKE COMPLETED [2ms]
> STATUS: FULLY PROTECTED`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-40 px-6">
        <div className="max-w-6xl mx-auto rounded-3xl bg-white p-12 md:p-24 text-center relative overflow-hidden">
          <h2 className="text-5xl md:text-8xl font-black text-black mb-10 relative z-10 leading-[0.9] tracking-tighter">
            Elevate your <br className="hidden sm:block" /> learning velocity.
          </h2>
          <p className="text-black/60 text-xl md:text-2xl mb-14 max-w-2xl mx-auto relative z-10 font-medium">
            Join the most efficient learners on the web.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            {!user && (
              <button 
                onClick={handleLogin}
                className="bg-black text-white px-12 py-5 rounded-lg font-black text-sm tracking-widest uppercase hover:bg-zinc-800 transition-all"
              >
                Sign In Now
              </button>
            )}
            {user && (
              <p className="text-black/40 font-bold tracking-widest uppercase text-sm italic">
                Welcome back, {user.displayName?.split(' ')[0]}.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
          <div className="col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                <Youtube className="text-white w-7 h-7" />
              </div>
              <span className="font-black text-2xl tracking-tighter">TubeSummarizer</span>
            </div>
            <p className="text-white/30 max-w-sm leading-relaxed mb-10 text-lg font-light">
              High-fidelity intelligence extraction for the high-velocity researcher.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-8 text-xs tracking-widest uppercase">System</h4>
            <ul className="space-y-4 text-white/40 font-medium text-xs">
              <li><a href="#" className="hover:text-white transition-colors tracking-widest uppercase">Nodes</a></li>
              <li><a href="#" className="hover:text-white transition-colors tracking-widest uppercase">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors tracking-widest uppercase">Security</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-8 text-xs tracking-widest uppercase">Company</h4>
            <ul className="space-y-4 text-white/40 font-medium text-xs">
              <li><a href="#" className="hover:text-white transition-colors tracking-widest uppercase">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors tracking-widest uppercase">Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors tracking-widest uppercase">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/20 text-[10px] font-bold tracking-[0.2em] uppercase">
          <p>© 2026 TubeSummarizer. ALL RIGHTS RESERVED.</p>
          <p>Not affiliated with Google, YouTube, or Netflix.</p>
        </div>
      </footer>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
