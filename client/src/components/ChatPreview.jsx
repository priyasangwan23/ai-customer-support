import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight } from 'lucide-react';

const ChatPreview = ({ name, lastMessage, sentiment, time }) => {
  const getSentimentStyles = (s) => {
    switch (s) {
      case 'positive': return { iconColor: '#A78BFA', bgColor: 'rgba(167, 139, 250, 0.1)', text: '95% Confident' };
      case 'negative': return { iconColor: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)',   text: 'Escalation' };
      case 'neutral':  return { iconColor: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)',  text: 'Active' };
      default: return { iconColor: '#9CA3AF', bgColor: 'rgba(156, 163, 175, 0.1)', text: 'Inactive' };
    }
  };

  const styles = getSentimentStyles(sentiment);

  return (
    <motion.div
      whileHover={{ scale: 1.015, x: 5 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      className="p-4 rounded-xl flex items-center gap-4 cursor-pointer group glass"
      style={{ border: '1px solid #1F2937', background: 'rgba(17, 24, 39, 0.4)' }}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" 
        style={{ background: 'rgba(109, 40, 217, 0.15)', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
        <MessageSquare className="w-5 h-5" style={{ color: '#A78BFA' }} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <h4 className="text-sm font-bold truncate" style={{ color: '#F9FAFB' }}>{name}</h4>
          <span className="text-[10px]" style={{ color: '#9CA3AF' }}>{time}</span>
        </div>
        <p className="text-xs truncate italic" style={{ color: '#9CA3AF' }}>"{lastMessage}"</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest" 
          style={{ background: styles.bgColor, color: styles.iconColor }}>
          {sentiment}
        </div>
        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#A78BFA' }} />
      </div>
    </motion.div>
  );
};

export default ChatPreview;
