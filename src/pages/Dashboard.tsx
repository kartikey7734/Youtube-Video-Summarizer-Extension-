import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Settings, 
  History, 
  CreditCard, 
  FileText,
  Star,
  Zap
} from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';
import { SEO } from '../components/seo/SEO';

export const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 2000); // Demo simulation
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12">
      <SEO title="User Workspace" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Workspace</h1>
            <p className="text-white/40 text-sm font-light">Managing intelligence for <span className="text-white/60 font-bold">{user?.email}</span></p>
          </div>
          <div className="flex gap-4">
             <div className="card p-4 flex items-center gap-4 bg-white/[0.03]">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white/40" />
                </div>
                <div>
                  <div className="text-[8px] font-black text-white/30 tracking-widest uppercase">Available Credits</div>
                  <div className="text-xl font-bold text-white tracking-tight">5 / 5</div>
                </div>
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Input Module */}
            <div className="card bg-white/[0.02] p-8 border-white/10 group focus-within:border-white/20 transition-all">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Play className="w-4 h-4 fill-current" />
                 </div>
                 <h2 className="text-lg font-bold text-white tracking-tight">New Distillation</h2>
              </div>
              <div className="flex gap-4">
                <input 
                   type="text" 
                   value={url}
                   onChange={(e) => setUrl(e.target.value)}
                   placeholder="Enter YouTube URL (e.g., https://youtube.com/watch?v=...)"
                   className="flex-1 bg-black border border-white/5 rounded-xl px-6 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all"
                />
                <button 
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="bg-white text-black px-8 py-4 rounded-xl font-black text-xs tracking-widest uppercase hover:bg-slate-200 transition-all disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Distill'}
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-white/40 tracking-[0.3em] uppercase px-4">Recent Neural Records</h3>
              <div className="space-y-4">
                {[
                  { title: 'Designing for SaaS: 2026 Trends', date: '2 hours ago', status: 'Completed' },
                  { title: 'The Physics of Quantum Computing', date: '昨天', status: 'Completed' }
                ].map((item, i) => (
                  <div key={i} className="card p-6 flex items-center justify-between hover:bg-white/[0.03] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/20 group-hover:text-white transition-colors">
                          <FileText className="w-6 h-6" />
                       </div>
                       <div>
                         <h4 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{item.title}</h4>
                         <div className="text-[10px] text-white/20 font-bold tracking-widest uppercase">{item.date}</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <span className="text-[8px] font-black tracking-widest uppercase text-green-500/60 bg-green-500/5 px-3 py-1 rounded-full">{item.status}</span>
                       <Zap className="w-4 h-4 text-white/10 group-hover:text-yellow-500 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Modules */}
          <div className="space-y-8">
             <div className="card bg-gradient-to-br from-blue-600/10 to-transparent p-8 border-blue-500/20">
                <Star className="w-10 h-10 text-blue-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Go Unlimited</h3>
                <p className="text-white/40 text-sm font-light leading-relaxed mb-8">
                  Remove processing caps and unlock high-density export modes for Obsidian and Notion.
                </p>
                <button className="w-full py-4 bg-white text-black font-black text-[10px] tracking-widest uppercase rounded-xl hover:bg-blue-50 transition-all">
                  Upgrade to Pro
                </button>
             </div>

             <div className="card p-8 border-white/5 space-y-6">
                <h4 className="text-[10px] font-black text-white/30 tracking-widest uppercase">System Settings</h4>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">Neural Engine</span>
                      <span className="text-[10px] font-black text-white tracking-widest bg-white/5 px-2 py-0.5 rounded uppercase">Gemini 2.0</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">Output Format</span>
                      <span className="text-[10px] font-black text-white tracking-widest bg-white/5 px-2 py-0.5 rounded uppercase">Markdown</span>
                   </div>
                   <button className="w-full flex items-center justify-center gap-2 py-3 border border-white/5 text-white/40 hover:text-white transition-colors rounded-xl text-[10px] font-black tracking-widest uppercase mt-4">
                      <Settings className="w-3 h-3" />
                      Configure Directives
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
