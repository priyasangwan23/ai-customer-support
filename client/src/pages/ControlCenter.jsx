import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Bot, ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react';
import StatCard from '../components/StatCard';
import ChatPreview from '../components/ChatPreview';
import ActionCard from '../components/ActionCard';
import ActivityFeed from '../components/ActivityFeed';
import { stats, recentChats, aiInsights, quickActions, activityFeed } from '../data/dashboardData';

const ControlCenter = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 relative scrollbar-hide">
      
      {/* Background ambient orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none animate-float opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)', willChange: 'transform' }} />
      <div className="absolute bottom-[-100px] left-0 w-[500px] h-[500px] pointer-events-none animate-float opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(109,40,217,0.1) 0%, transparent 70%)', animationDelay: '3s', willChange: 'transform' }} />

      {/* Header Area */}
      <header className="flex justify-between items-end mb-10 relative z-10">
        <div>
          <h1 className="text-4xl font-black gradient-text tracking-tighter uppercase mb-1">AI Control Center</h1>
          <div className="flex items-center gap-2 opacity-70">
            <ShieldCheck className="w-4 h-4 text-brand-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary">System Operational · Core AI v4.2.0</span>
          </div>
        </div>
        <div className="p-1 px-3 rounded-full glass border border-border flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
          <span className="text-[10px] font-black uppercase text-text-primary tracking-widest">Real-time Syncing</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
        
        {/* Left & Center column (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          
          {/* Top Section: Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, idx) => (
              <StatCard key={idx} {...s} />
            ))}
          </div>

          {/* Quick Actions (Card-style buttons) */}
          <section>
            <div className="flex items-center gap-3 mb-4 text-[10px] font-black uppercase tracking-[0.3em] opacity-80" style={{ color: '#9CA3AF' }}>
              <Zap className="w-4 h-4" style={{ color: '#A78BFA' }} />
              <span>Priority Directives</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {quickActions.map((a, idx) => (
                <ActionCard key={idx} {...a} />
              ))}
            </div>
          </section>

          {/* Center Section: Recent Conversations Preview */}
          <section className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] opacity-80" style={{ color: '#9CA3AF' }}>
                <Activity className="w-4 h-4" style={{ color: '#A78BFA' }} />
                <span>Live Intelligence Streams</span>
              </div>
              <button className="text-[10px] font-black uppercase text-brand-accent hover:opacity-100 transition-opacity flex items-center gap-1 opacity-70">
                View All Intelligence <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {recentChats.map((c) => (
                <ChatPreview key={c.id} {...c} />
              ))}
            </div>
          </section>

        </div>

        {/* Right column (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          
          {/* Right Panel: AI Insights Preview */}
          <section className="p-6 rounded-3xl glass-purple relative overflow-hidden" 
            style={{ border: '1px solid rgba(167,139,250,0.2)', background: 'rgba(11, 17, 32, 0.7)' }}>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center glass-purple border border-brand-accent/20">
                <Sparkles className="w-5 h-5 text-brand-accent" />
              </div>
              <h2 className="text-sm font-black gradient-text uppercase tracking-widest leading-none">Intelligence Engine</h2>
            </div>

            <div className="space-y-6 relative z-10">
              {/* Sentiment Card */}
              <div className="p-4 rounded-2xl border border-border/50 bg-black/30">
                <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-3 opacity-60">GLOBAL CONTEXT SENTIMENT</p>
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold uppercase" style={{ color: '#A78BFA' }}>{aiInsights.sentiment}</h4>
                  <div className="px-2 py-0.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-[9px] font-bold text-brand-accent">0.96 SCORE</div>
                </div>
              </div>

              {/* Intent Card */}
              <div className="p-4 rounded-2xl border border-border/50 bg-black/30">
                <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-3 opacity-60">DETECTED CORE INTENT</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-1 rounded-full bg-brand-accent/30 overflow-hidden">
                    <div className="h-full bg-brand-accent w-3/4 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-tight text-white">{aiInsights.intent}</h4>
                </div>
              </div>

              {/* Action Card */}
              <div className="p-4 rounded-2xl bg-brand-primary/10 border border-brand-accent/30 relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#C4B5FD] mb-3 opacity-80">SUGGESTED AI TRAJECTORY</p>
                  <h4 className="text-sm font-black tracking-tight text-white mb-4 uppercase">{aiInsights.suggestedAction}</h4>
                  <motion.button 
                    whileHover={{ x: 5 }} 
                    className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest btn-primary shadow-lg border border-white/10"
                  >
                    Execute Protocol
                  </motion.button>
                </div>
                <Zap className="absolute top-[-10px] right-[-10px] w-20 h-20 text-brand-accent/5 -rotate-12 group-hover:scale-125 transition-transform" />
              </div>

            </div>

            {/* AI Network Status */}
            <div className="mt-8 flex items-center justify-between px-2 opacity-60">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-brand-accent" />
                <span className="text-[9px] font-black uppercase tracking-widest text-text-primary">NEURAL PATHWAY ACTIVE</span>
              </div>
              <div className="flex gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-1 h-3 rounded-full bg-brand-accent/40" style={{ height: `${Math.random() * 12 + 4}px` }} />
                ))}
              </div>
            </div>

          </section>

          {/* Activity Feed (Bottom Section) */}
          <section>
            <div className="flex items-center gap-3 mb-4 text-[10px] font-black uppercase tracking-[0.3em] opacity-80" style={{ color: '#9CA3AF' }}>
              <TrendingUp className="w-4 h-4" style={{ color: '#A78BFA' }} />
              <span>Real-time System Logs</span>
            </div>
            <div className="space-y-3">
              {activityFeed.map((f) => (
                <ActivityFeed key={f.id} {...f} />
              ))}
            </div>
          </section>

        </div>

      </div>

    </div>
  );
};

export default ControlCenter;
