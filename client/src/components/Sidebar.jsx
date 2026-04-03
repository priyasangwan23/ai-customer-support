import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, MessageSquare, BarChart2, Settings, ShieldCheck, Zap } from 'lucide-react';

const menuItems = [
  { name: 'Main Dashboard', icon: LayoutDashboard },
  { name: 'All Chats',      icon: MessageSquare, active: true },
  { name: 'Analytics',      icon: BarChart2 },
  { name: 'Settings',       icon: Settings },
];

const Sidebar = () => (
  <aside
    className="w-72 h-full flex flex-col p-6 flex-shrink-0 relative overflow-hidden"
    style={{ background: '#0B1120', borderRight: '1px solid #1F2937' }}
  >
    {/* Background floating orb — transform only, GPU */}
    <div
      className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none animate-float"
      style={{
        background: 'radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)',
        willChange: 'transform',
      }}
    />

    {/* Brand */}
    <div className="flex items-center gap-3 mb-10 px-2 pt-2 relative z-10">
      {/* Logo with shimmer */}
      <motion.div
        whileHover={{ scale: 1.08, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shimmer-parent glow-ring flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, #6D28D9, #A78BFA)',
          willChange: 'transform',
        }}
      >
        <ShieldCheck className="text-white w-5 h-5 relative z-10" strokeWidth={2.5} />
      </motion.div>
      <div>
        <h1 className="text-base font-extrabold tracking-tight leading-none" style={{ color: '#F9FAFB' }}>
          SupportSense <span className="gradient-text">AI</span>
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#9CA3AF' }}>
          Enterprise Suite
        </p>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 space-y-1 relative z-10">
      <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-3" style={{ color: '#9CA3AF' }}>
        Main Menu
      </p>
      {menuItems.map((item, i) => (
        <motion.a
          key={item.name}
          href="#"
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 20 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200 group relative overflow-hidden ${item.active ? 'shimmer-parent' : ''}`}
          style={
            item.active
              ? { background: 'rgba(167,139,250,0.1)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.15)' }
              : { color: '#9CA3AF' }
          }
        >
          <item.icon className="w-4 h-4 flex-shrink-0 transition-colors duration-200" />
          <span>{item.name}</span>
          {item.active && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full badge-glow flex-shrink-0" style={{ background: '#A78BFA' }} />
          )}
        </motion.a>
      ))}
    </nav>

    {/* Footer */}
    <div
      className="p-4 rounded-xl flex items-center gap-3 mt-4 relative z-10 shimmer-parent"
      style={{ background: '#111827', border: '1px solid #1F2937' }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(109,40,217,0.2)' }}>
        <Zap className="w-4 h-4" style={{ color: '#A78BFA' }} />
      </div>
      <div>
        <p className="text-xs font-bold" style={{ color: '#F9FAFB' }}>Support v1.2</p>
        <p className="text-[10px]" style={{ color: '#9CA3AF' }}>System Online</p>
      </div>
      <div className="ml-auto w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: '#A78BFA' }} />
    </div>
  </aside>
);

export default Sidebar;
