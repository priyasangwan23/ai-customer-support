import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Smile, Shield, Layers, RefreshCw, TrendingUp,
  Frown, Meh, Activity, Zap, Brain, CheckCircle, AlertTriangle,
  Trash2
} from 'lucide-react';
import { useChatHistory } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';

/* ─── Animated Progress Bar ─────────────────────────────── */
const AnimatedBar = ({ value, color, delay = 0, height = 6 }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 400 + delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height, background: 'rgba(30,45,71,0.6)' }}
    >
      <motion.div
        animate={{ width: `${width}%` }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: delay / 1000 }}
        className="h-full rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 8px ${color}40`,
        }}
      />
    </div>
  );
};

/* ─── Live Metric ────────────────────────────────────────── */
const LiveMetric = ({ label, value: initialValue, unit, color, icon: Icon }) => {
  const [value, setValue] = useState(initialValue);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setValue(v => {
        const delta = (Math.random() - 0.5) * 2;
        return Math.min(100, Math.max(0, parseFloat((v + delta).toFixed(1))));
      });
    }, 2800);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
        <span className="text-xs" style={{ color: '#94A3B8' }}>{label}</span>
      </div>
      <motion.span
        key={value}
        initial={{ opacity: 0.6, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-xs font-black"
        style={{ color }}
      >
        {value}{unit}
      </motion.span>
    </div>
  );
};

/* ─── Section wrapper ────────────────────────────────────── */
const Section = ({ icon: Icon, label, children }) => (
  <section className="space-y-3">
    <div className="flex items-center gap-2">
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(96,165,250,0.2)' }}
      >
        <Icon className="w-3 h-3" style={{ color: '#60A5FA' }} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: '#475569' }}>
        {label}
      </span>
    </div>
    {children}
  </section>
);

/* ─── Sentiment Card ─────────────────────────────────────── */
const sentimentConfig = {
  Positive: { icon: Smile,  color: '#10B981', bgColor: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)', label: 'Satisfaction Detected' },
  Neutral:  { icon: Meh,    color: '#F59E0B', bgColor: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.2)', label: 'Neutral Tone' },
  Negative: { icon: Frown,  color: '#EF4444', bgColor: 'rgba(239,68,68,0.08)',  borderColor: 'rgba(239,68,68,0.2)',  label: 'Frustration Detected' },
};

const InsightPanel = ({ width = 320, collapsed = false, isDragging = false }) => {
  const { insights, setInsights, appendMessage, activeConversationId } = useChatHistory();
  const navigate = useNavigate();
  
  const sentiment = insights?.sentiment || 'Neutral';
  const confidence = parseFloat(insights?.confidence || 94.2);
  const intent = insights?.intent || 'General Query';
  const suggestedAction = insights?.suggestedAction || 'Assist user';


  const handleReset = () => {
    if (setInsights) {
      setInsights({
        sentiment: 'Neutral',
        intent: 'Scanning...',
        suggestedAction: 'Wait for user input',
        confidence: 94.2
      });
    }
  };

  const handleExecuteDirective = async () => {
    if (!suggestedAction || !activeConversationId) return;

    // ── 1. Update Chat History with protocol message
    if (appendMessage) {
      await appendMessage(activeConversationId, 'bot', `[PROTOCOL INITIATED]: Executing directive "${suggestedAction.toUpperCase()}". Please stand by for automated results.`);
    }

    // ── 2. Special Logic: Navigate to Marketplace if action is search/product related
    const actionLower = suggestedAction.toLowerCase();
    if (actionLower.includes('search') || actionLower.includes('product') || actionLower.includes('marketplace')) {
      navigate('/dashboard');
    }
  };

  const sConf = sentimentConfig[sentiment] || sentimentConfig.Positive;
  const SentIcon = sConf.icon;

  return (
    <motion.aside
      animate={{ width: collapsed ? 0 : width, opacity: collapsed ? 0 : 1 }}
      transition={{ duration: isDragging ? 0 : 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="h-full flex flex-col gap-5 flex-shrink-0 relative overflow-y-auto overflow-x-hidden bg-dashboard-sidebar"
      style={{
        borderLeft: '1px solid rgba(30,45,71,0.7)',
        padding: collapsed ? '0' : '24px 20px',
      }}
    >
      {/* Ambient orb */}
      <div
        className="absolute top-12 right-2 w-44 h-44 rounded-full pointer-events-none animate-float"
        style={{
          background: 'radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 70%)',
          willChange: 'transform',
          animationDelay: '1.2s',
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between pt-1 relative z-10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center glow-ring"
            style={{
              background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
              boxShadow: '0 0 16px rgba(37,99,235,0.4)',
            }}
          >
            <Brain className="text-white w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[13px] font-black gradient-text uppercase tracking-widest">AI Insights</h2>
            <p className="text-[9px] font-semibold" style={{ color: '#475569' }}>Real-time analysis</p>
          </div>
        </div>
        {/* Live indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-glow-pulse" style={{ background: '#10B981' }} />
          <span className="text-[9px] font-bold" style={{ color: '#10B981' }}>LIVE</span>
        </div>
      </div>



      {/* Response Confidence */}
      <Section icon={TrendingUp} label="Response Confidence">
        <div
          className="p-4 rounded-2xl space-y-3 glass-card relative z-10"
        >
          <LiveMetric
            label="Accuracy"
            value={confidence}
            unit="%"
            color="#60A5FA"
            icon={CheckCircle}
          />
          <AnimatedBar value={confidence} color="linear-gradient(90deg, #2563EB, #60A5FA)" delay={0} />
          <LiveMetric
            label="Latency"
            value={210}
            unit="ms"
            color="#60A5FA"
            icon={Zap}
          />
          <AnimatedBar value={68} color="linear-gradient(90deg, #3B82F6, #60A5FA)" delay={100} height={4} />
        </div>
      </Section>

      {/* Sentiment */}
      <Section icon={Smile} label="User Sentiment">
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          className="flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer glass-card relative z-10"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: sConf.bgColor, border: `1px solid ${sConf.borderColor}` }}
          >
            <SentIcon className="w-5 h-5" style={{ color: sConf.color }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: '#F1F5F9' }}>{sentiment}</p>
            <p className="text-[11px]" style={{ color: '#64748B' }}>{sConf.label}</p>
          </div>
          <div
            className="w-2 h-2 rounded-full flex-shrink-0 badge-glow"
            style={{ background: sConf.color }}
          />
        </motion.div>

        {/* Sentiment buttons */}
        <div className="flex gap-2 mt-2">
          {Object.entries(sentimentConfig).map(([key, cfg]) => {
            const Ic = cfg.icon;
            return (
              <motion.button
                key={key}
                onClick={() => setInsights?.({ ...insights, sentiment: key })}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="flex-1 py-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center gap-0.5 transition-all"
                style={{
                  background: sentiment === key ? cfg.bgColor : 'rgba(13,21,38,0.6)',
                  border: `1px solid ${sentiment === key ? cfg.borderColor : 'rgba(30,45,71,0.5)'}`,
                  color: sentiment === key ? cfg.color : '#475569',
                }}
              >
                <Ic className="w-3.5 h-3.5" />
                {key}
              </motion.button>
            );
          })}
        </div>
      </Section>

      {/* Escalation Risk */}
      <Section icon={Shield} label="Escalation Risk">
        <div className="p-4 rounded-2xl space-y-3.5 glass-card relative z-10">
          {[
            { label: 'Aggression', pct: 5,  color: 'linear-gradient(90deg, #EF4444, #F87171)', icon: AlertTriangle },
            { label: 'Frustration', pct: 12, color: 'linear-gradient(90deg, #F59E0B, #FCD34D)', icon: Frown },
            { label: 'Urgency',     pct: 28, color: 'linear-gradient(90deg, #2563EB, #60A5FA)', icon: Zap },
          ].map((s, i) => (
            <div key={s.label}>
              <div className="flex justify-between text-[11px] mb-1.5">
                <div className="flex items-center gap-1.5">
                  <s.icon className="w-3 h-3" style={{ color: '#64748B' }} />
                  <span style={{ color: '#94A3B8' }}>{s.label}</span>
                </div>
                <span className="font-black" style={{ color: '#F1F5F9' }}>
                  {(s.pct / 100).toFixed(2)} / 1.0
                </span>
              </div>
              <AnimatedBar value={s.pct} color={s.color} delay={i * 150} height={5} />
            </div>
          ))}
        </div>
      </Section>

      {/* Detected Intent */}
      <Section icon={Layers} label="Detected Intent">
        <div className="p-3.5 rounded-2xl glass-card relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold" style={{ color: '#F1F5F9' }}>{intent}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#64748B' }}>Primary detection · 92% match</p>
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase"
              style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(96,165,250,0.1))',
                color: '#60A5FA',
                border: '1px solid rgba(96,165,250,0.25)',
                boxShadow: '0 0 10px rgba(37,99,235,0.2)',
              }}
            >
              High
            </span>
          </div>
          <div className="mt-3 flex gap-2 flex-wrap">
            {['Shipping', 'Returns', 'Billing'].map(tag => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                style={{ background: 'rgba(30,45,71,0.6)', color: '#64748B', border: '1px solid rgba(30,45,71,0.8)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Suggested Trajectory */}
      <Section icon={Zap} label="AI Trajectory">
        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 relative overflow-hidden group z-10">
          <p className="text-[9px] font-black uppercase tracking-widest text-blue-300 mb-2 opacity-80">RECOMMENDED PROTOCOL</p>
          <h4 className="text-xs font-black tracking-tight text-white mb-4 uppercase">{suggestedAction}</h4>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExecuteDirective}
            className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all border border-blue-400/20"
          >
            Execute Directive
          </motion.button>
          <Sparkles className="absolute top-[-10px] right-[-10px] w-16 h-16 text-blue-500/10 -rotate-12 group-hover:scale-125 transition-transform" />
        </div>
      </Section>

      {/* Reset */}
      <div className="mt-auto pt-2 relative z-10 flex-shrink-0">
        <motion.button
          onClick={handleReset}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 350, damping: 18 }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest btn-ghost"
          style={{
            background: 'rgba(37,99,235,0.08)',
            border: '1px solid rgba(96,165,250,0.2)',
            color: '#60A5FA',
            willChange: 'transform',
          }}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Session
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default InsightPanel;
