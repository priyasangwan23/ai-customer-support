import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ label, value, trend, color }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    className="p-5 rounded-2xl glass-purple relative overflow-hidden"
    style={{ border: '1px solid rgba(167, 139, 250, 0.15)', background: 'rgba(11, 17, 32, 0.6)' }}
  >
    <div className="flex flex-col gap-2 relative z-10">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#9CA3AF' }}>{label}</span>
        <div className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full" 
          style={{ background: 'rgba(167, 139, 250, 0.1)', color: '#A78BFA' }}>
          <TrendingUp className="w-3 h-3" />
          {trend}
        </div>
      </div>
      <h3 className="text-2xl font-black gradient-text">{value}</h3>
    </div>
    
    {/* Subtle accent glow */}
    <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10" 
      style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }} />
  </motion.div>
);

export default StatCard;
