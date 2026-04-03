import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Smile, Shield, Layers, RefreshCw, TrendingUp } from 'lucide-react';

const Section = ({ icon: Icon, label, children }) => (
  <section>
    <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
      <Icon className="w-3.5 h-3.5" style={{ color: '#14B8A6' }} />
      <span>{label}</span>
    </div>
    {children}
  </section>
);

const InsightPanel = () => (
  <aside
    className="w-80 h-full flex flex-col p-6 gap-7 flex-shrink-0 relative overflow-hidden"
    style={{ background: '#0B1120', borderLeft: '1px solid #1F2937' }}
  >
    {/* Floating orb */}
    <div
      className="absolute top-10 right-4 w-40 h-40 rounded-full pointer-events-none animate-float"
      style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)', willChange: 'transform', animationDelay: '1s' }}
    />

    {/* Title */}
    <div className="flex items-center gap-3 pt-1 relative z-10">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shimmer-parent glow-ring" style={{ background: 'linear-gradient(135deg, #0F766E, #14B8A6)' }}>
        <Sparkles className="text-white w-4 h-4 relative z-10" />
      </div>
      <h2 className="text-sm font-black uppercase tracking-widest gradient-text">AI Insights</h2>
    </div>

    {/* Confidence */}
    <Section icon={TrendingUp} label="Response Confidence">
      <div className="flex justify-between text-xs mb-2">
        <span style={{ color: '#9CA3AF' }}>Accuracy</span>
        <span className="font-bold" style={{ color: '#14B8A6' }}>94.8%</span>
      </div>
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: '#1F2937' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '94.8%' }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full rounded-full shimmer-parent"
          style={{ background: 'linear-gradient(90deg, #0F766E, #14B8A6)', willChange: 'width' }}
        />
      </div>
    </Section>

    {/* Sentiment */}
    <Section icon={Smile} label="User Sentiment">
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer shimmer-parent"
        style={{ background: '#111827', border: '1px solid #1F2937', willChange: 'transform' }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)' }}>
          <Smile className="w-5 h-5" style={{ color: '#14B8A6' }} />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: '#F9FAFB' }}>Positive</p>
          <p className="text-[11px]" style={{ color: '#9CA3AF' }}>Satisfaction Detected</p>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full flex-shrink-0 badge-glow" style={{ background: '#22C55E' }} />
      </motion.div>
    </Section>

    {/* Risk */}
    <Section icon={Shield} label="Escalation Risk">
      <div className="p-3.5 rounded-xl space-y-3.5" style={{ background: '#111827', border: '1px solid #1F2937' }}>
        {[{ label: 'Aggression', pct: '5%', val: '0.05' }, { label: 'Frustration', pct: '12%', val: '0.12' }].map(s => (
          <div key={s.label}>
            <div className="flex justify-between text-[11px] mb-1.5">
              <span style={{ color: '#9CA3AF' }}>{s.label}</span>
              <span className="font-bold" style={{ color: '#F9FAFB' }}>{s.val} / 1.0</span>
            </div>
            <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: '#1F2937' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: s.pct }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #0F766E, #14B8A6)' }}
              />
            </div>
          </div>
        ))}
      </div>
    </Section>

    {/* Intent */}
    <Section icon={Layers} label="Detected Intent">
      <div className="flex items-center justify-between p-3 rounded-xl text-xs font-semibold shimmer-parent" style={{ background: '#111827', border: '1px solid #1F2937', color: '#F9FAFB' }}>
        <span>Order Tracking</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase" style={{ background: 'rgba(20,184,166,0.12)', color: '#14B8A6' }}>High</span>
      </div>
    </Section>

    {/* Reset */}
    <div className="mt-auto">
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 350, damping: 18 }}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shimmer-parent"
        style={{ background: 'rgba(15,118,110,0.1)', border: '1px solid rgba(20,184,166,0.2)', color: '#14B8A6', willChange: 'transform' }}
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Reset Session
      </motion.button>
    </div>
  </aside>
);

export default InsightPanel;
