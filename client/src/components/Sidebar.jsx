import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, BarChart2, Settings, Zap,
  ChevronLeft, ChevronRight, Activity, Bell, Users
} from 'lucide-react';
import BrandLogo from './BrandLogo';

const menuItems = [
  { name: 'Main Dashboard', icon: LayoutDashboard, path: '/dashboard', badge: null },
  { name: 'Live Chat',      icon: MessageSquare,   path: '/',           badge: '3' },
  { name: 'Analytics',      icon: BarChart2,       path: '/analytics',  badge: null },
  { name: 'Settings',       icon: Settings,        path: '/settings',   badge: null },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 288 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="h-full flex flex-col flex-shrink-0 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #060E1E 0%, #080F1E 60%, #060B18 100%)',
        borderRight: '1px solid rgba(30, 45, 71, 0.7)',
      }}
    >
      {/* Ambient gradient orb */}
      <div
        className="absolute -bottom-24 -left-12 w-72 h-72 rounded-full pointer-events-none animate-float"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute top-20 -right-16 w-48 h-48 rounded-full pointer-events-none animate-float"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
          animationDelay: '3s',
          willChange: 'transform',
        }}
      />

      {/* Collapse toggle */}
      <motion.button
        onClick={() => setCollapsed(p => !p)}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="absolute -right-3.5 top-16 z-20 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #7C3AED, #9B4DFF)',
          border: '1.5px solid rgba(167,139,250,0.4)',
          boxShadow: '0 0 14px rgba(124,58,237,0.5)',
        }}
      >
        {collapsed
          ? <ChevronRight className="w-3.5 h-3.5 text-white" />
          : <ChevronLeft  className="w-3.5 h-3.5 text-white" />}
      </motion.button>

      {/* Brand */}
      <div className={`flex items-center gap-3 mb-8 relative z-10 ${collapsed ? 'px-3 pt-5 justify-center' : 'px-6 pt-6'}`}>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 3 }}
          transition={{ type: 'spring', stiffness: 320, damping: 15 }}
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 glow-ring"
          style={{
            background: 'rgba(10, 15, 28, 0.8)',
            border: '1.5px solid rgba(167,139,250,0.35)',
            boxShadow: '0 0 20px rgba(124,58,237,0.35)',
            willChange: 'transform',
          }}
        >
          <BrandLogo className="w-9 h-9" />
        </motion.div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-[15px] font-black tracking-tight leading-none" style={{ color: '#F1F5F9' }}>
                SupportSense <span className="gradient-text">AI</span>
              </h1>
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] mt-1" style={{ color: '#64748B' }}>
                Enterprise Suite
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className={`flex-1 space-y-1 relative z-10 ${collapsed ? 'px-2' : 'px-4'}`}>
        {!collapsed && (
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] px-3 mb-3" style={{ color: '#475569' }}>
            Navigation
          </p>
        )}

        {menuItems.map((item, i) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className="block"
          >
            {({ isActive }) => (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
                whileHover={{ x: collapsed ? 0 : 3 }}
                className={`flex items-center gap-3 rounded-xl text-sm font-semibold cursor-pointer relative overflow-hidden group
                  ${collapsed ? 'justify-center p-3' : 'px-3 py-2.5'}
                `}
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(167,139,250,0.08) 100%)',
                        border: '1px solid rgba(167,139,250,0.25)',
                        color: '#C4B5FD',
                        boxShadow: '0 0 20px rgba(124,58,237,0.15), inset 0 1px 0 rgba(167,139,250,0.1)',
                      }
                    : {
                        background: 'transparent',
                        border: '1px solid transparent',
                        color: '#64748B',
                      }
                }
              >
                {/* Active left bar */}
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
                    style={{ background: 'linear-gradient(180deg, #A78BFA, #7C3AED)' }}
                  />
                )}

                {/* Hover shimmer */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, transparent 100%)',
                  }}
                />

                <item.icon
                  className="flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                  size={16}
                  style={{ color: isActive ? '#A78BFA' : 'currentColor', willChange: 'transform' }}
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2 flex-1 min-w-0"
                    >
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span
                          className="ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                            color: '#fff',
                            boxShadow: '0 0 8px rgba(124,58,237,0.5)',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Active dot for collapsed */}
                {isActive && collapsed && (
                  <span
                    className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full badge-glow"
                    style={{ background: '#A78BFA' }}
                  />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Status bar */}
      <div className={`relative z-10 mt-4 ${collapsed ? 'px-2 pb-5' : 'px-4 pb-5'}`}>
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          className={`rounded-2xl flex items-center gap-3 glass-dark cursor-pointer ${collapsed ? 'p-2.5 justify-center' : 'p-3.5'}`}
          style={{
            background: 'linear-gradient(135deg, rgba(13,21,38,0.9) 0%, rgba(9,15,30,0.95) 100%)',
            border: '1px solid rgba(30,45,71,0.7)',
          }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(167,139,250,0.1))',
              border: '1px solid rgba(167,139,250,0.2)',
            }}
          >
            <Zap className="w-4 h-4" style={{ color: '#A78BFA' }} />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-bold truncate" style={{ color: '#F1F5F9' }}>v1.2 · Online</p>
                <p className="text-[10px] truncate" style={{ color: '#475569' }}>All systems nominal</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!collapsed && (
            <div
              className="w-2 h-2 rounded-full flex-shrink-0 neon-glow"
              style={{ background: '#10B981' }}
            />
          )}
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
