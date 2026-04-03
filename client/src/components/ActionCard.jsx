import React from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, Headphones } from 'lucide-react';

const icons = { Package, DollarSign, Headphones };

const ActionCard = ({ label, icon, color }) => {
  const Icon = icons[icon] || Package;

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className="p-5 rounded-2xl glass-purple flex flex-col items-center gap-4 cursor-pointer text-center group w-full"
      style={{ border: '1px solid rgba(167, 139, 250, 0.2)', background: 'rgba(109, 40, 217, 0.05)' }}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden" 
        style={{ background: 'rgba(109, 40, 217, 0.1)', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
        <Icon className="w-6 h-6 text-white group-hover:scale-125 transition-transform" />
        <div className="absolute inset-0 opacity-20" 
          style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }} />
      </div>
      
      <div>
        <h4 className="text-xs font-black uppercase tracking-widest leading-tight" style={{ color: '#F9FAFB' }}>{label}</h4>
        <span className="text-[10px] uppercase font-bold" style={{ color: '#A78BFA' }}>QUICK ACTION</span>
      </div>
    </motion.button>
  );
};

export default ActionCard;
