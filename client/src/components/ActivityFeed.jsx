import React from 'react';
import { motion } from 'framer-motion';
import { Info, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const icons = { info: Info, success: CheckCircle, pending: Clock, warning: AlertTriangle };

const ActivityFeed = ({ event, time, status }) => {
  const Icon = icons[status] || Info;
  const colors = {
    info: '#3B82F6',
    success: '#10B981',
    pending: '#F59E0B',
    warning: '#EF4444',
  };

  return (
    <motion.div
      whileHover={{ x: 5, background: 'rgba(11, 17, 32, 0.4)' }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      className="p-4 rounded-xl flex items-center gap-4 cursor-pointer group glass"
      style={{ border: '1px solid #1F2937', background: 'rgba(17, 24, 39, 0.2)' }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" 
        style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
        <Icon className="w-5 h-5" style={{ color: colors[status] || '#60A5FA' }} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold truncate tracking-tight" style={{ color: '#F9FAFB' }}>{event}</h4>
        <div className="flex items-center gap-1.5 mt-0.5 opacity-60">
          <Clock className="w-3 h-3" style={{ color: '#9CA3AF' }} />
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>{time}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" 
          style={{ background: colors[status] || '#60A5FA', boxShadow: `0 0 8px ${colors[status] || '#60A5FA'}` }} />
      </div>
    </motion.div>
  );
};

export default ActivityFeed;
