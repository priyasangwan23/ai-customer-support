import React from 'react';
import { motion } from 'framer-motion';
import { Truck, RotateCcw, User, HelpCircle, Package, CreditCard } from 'lucide-react';

const actions = [
  { label: 'Track Order',   icon: Truck,       text: 'Where is my order?',          color: '#A78BFA' },
  { label: 'Return Items',  icon: RotateCcw,   text: 'I want to return an item.',   color: '#60A5FA' },
  { label: 'Talk to Agent', icon: User,        text: 'Connect me to a human agent.', color: '#10B981' },
  { label: 'Help Center',   icon: HelpCircle,  text: 'Show me the help center.',    color: '#F59E0B' },
  { label: 'Check Billing', icon: CreditCard,  text: 'I have a billing question.',  color: '#F472B6' },
  { label: 'Order Status',  icon: Package,     text: 'What is my order status?',    color: '#34D399' },
];

const QuickActions = ({ onAction }) => (
  <div className="my-4">
    <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: '#374151' }}>
      Quick Actions
    </p>
    <div className="flex flex-wrap gap-2">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          onClick={() => onAction?.(action.text)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -3, scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold relative overflow-hidden group"
          style={{
            background: 'rgba(13,21,38,0.8)',
            border: '1px solid rgba(30,45,71,0.8)',
            color: '#64748B',
            transition: 'border-color 0.2s ease, color 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = action.color;
            e.currentTarget.style.borderColor = `${action.color}40`;
            e.currentTarget.style.background = `${action.color}08`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#64748B';
            e.currentTarget.style.borderColor = 'rgba(30,45,71,0.8)';
            e.currentTarget.style.background = 'rgba(13,21,38,0.8)';
          }}
        >
          <action.icon className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
          {action.label}
        </motion.button>
      ))}
    </div>
  </div>
);

export default QuickActions;
