import React from 'react';
import { motion } from 'framer-motion';
import { Truck, RotateCcw, User, HelpCircle } from 'lucide-react';

const actions = [
  { label: 'Track Order',  icon: Truck,      text: 'Where is my order?' },
  { label: 'Return Items', icon: RotateCcw,   text: 'I want to return an item.' },
  { label: 'Talk to Agent',icon: User,        text: 'Connect me to a human agent.' },
  { label: 'Help Center',  icon: HelpCircle,  text: 'Show me the help center.' },
];

const QuickActions = ({ onAction }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>
      Quick Actions
    </p>
    <div className="flex flex-wrap gap-2">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          onClick={() => onAction?.(action.text)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ y: -2, borderColor: '#A78BFA' }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
          style={{
            background: '#111827',
            border: '1px solid #1F2937',
            color: '#9CA3AF',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#A78BFA';
            e.currentTarget.style.borderColor = 'rgba(167,139,250,0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#9CA3AF';
            e.currentTarget.style.borderColor = '#1F2937';
          }}
        >
          <action.icon className="w-3.5 h-3.5 flex-shrink-0" />
          {action.label}
        </motion.button>
      ))}
    </div>
  </div>
);

export default QuickActions;
