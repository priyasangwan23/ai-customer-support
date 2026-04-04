import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, BarChart2, Settings, Zap,
  Plus, Trash2, Clock
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useChatHistory } from '../context/ChatContext';

const menuItems = [
  { name: 'Main Dashboard', icon: LayoutDashboard, path: '/dashboard', badge: null },
  { name: 'Live Chat',      icon: MessageSquare,   path: '/',           badge: null },
  { name: 'Analytics',      icon: BarChart2,       path: '/analytics',  badge: null },
  { name: 'Settings',       icon: Settings,        path: '/settings',   badge: null },
];

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const ts = new Date(dateStr).getTime();
  if (isNaN(ts)) return '';
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const Sidebar = ({ width = 288, collapsed = false, setCollapsed, isDragging = false }) => {
  const navigate = useNavigate();
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    isLoadingHistory,
    createConversation,
    deleteConversation,
    useDummy,
  } = useChatHistory();

  const handleNewChat = async () => {
    navigate('/');
    await createConversation('New Conversation');
  };

  const handleSelectConversation = (convId) => {
    setActiveConversationId(convId);
    navigate('/');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : width }}
      transition={{ duration: isDragging ? 0 : 0.35, ease: [0.4, 0, 0.2, 1] }}
      className={`h-full flex flex-col flex-shrink-0 relative overflow-hidden bg-dashboard-sidebar`}
      style={{
        borderRight: '1px solid rgba(30, 45, 71, 0.7)',
      }}
    >
      {/* ── Brand ─────────────────────────────────────────────── */}
      <div className={`flex items-center gap-3 mb-6 relative z-10 ${collapsed ? 'px-3 pt-5 justify-center' : 'px-6 pt-6'}`}>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 3 }}
          transition={{ type: 'spring', stiffness: 320, damping: 15 }}
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-dashboard-sidebar-logo"
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

      {/* ── Nav ───────────────────────────────────────────────── */}
      <nav className={`space-y-1 relative z-10 ${collapsed ? 'px-2' : 'px-4'}`}>
        {!collapsed && (
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] px-3 mb-3" style={{ color: '#475569' }}>
            Navigation
          </p>
        )}

        {menuItems.map((item, i) => (
          <NavLink key={item.name} to={item.path} end={item.path === '/'} className="block">
            {({ isActive }) => (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
                whileHover={{ x: collapsed ? 0 : 3 }}
                className={`flex items-center gap-3 rounded-xl text-sm font-semibold cursor-pointer relative overflow-hidden group sidebar-nav-item ${collapsed ? 'justify-center p-3' : 'px-3 py-2.5'} ${isActive ? 'active' : ''}`}
              >
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-md"
                    style={{ background: '#3B82F6' }}
                  />
                )}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-white/5" />
                <item.icon
                  className="flex-shrink-0 transition-all duration-200 group-hover:scale-105"
                  size={16}
                  style={{ color: isActive ? '#3B82F6' : 'currentColor', willChange: 'transform' }}
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
                          style={{ background: '#3B82F6', color: '#fff' }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                {isActive && collapsed && (
                  <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: '#3B82F6' }} />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Chat History ──────────────────────────────────────── */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col px-4 mt-5 min-h-0 relative z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  Recent Chats
                </p>
                {useDummy && (
                  <span
                    className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}
                  >
                    DEMO
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNewChat}
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}
                title="New Chat"
              >
                <Plus className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-1" style={{ minHeight: 0 }}>
              {isLoadingHistory ? (
                <div className="space-y-2 pr-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-10 rounded-lg animate-pulse" style={{ background: 'rgba(30,45,71,0.4)' }} />
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MessageSquare className="w-8 h-8 mb-2 text-slate-800" />
                  <p className="text-xs text-slate-500">No chats yet</p>
                  <p className="text-[10px] mt-1 text-slate-600">Start a new conversation</p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const isActive = conv._id === activeConversationId;
                  return (
                    <motion.div
                      key={conv._id}
                      whileHover={{ x: 2 }}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer group relative sidebar-history-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleSelectConversation(conv._id)}
                    >
                      {isActive && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                          style={{ background: '#3B82F6' }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-semibold truncate ${isActive ? 'text-blue-400' : 'text-slate-400'}`}
                        >
                          {conv.title}
                        </p>
                        <p className="text-[9px] mt-0.5 text-slate-500">
                          {formatRelativeTime(conv.updatedAt)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteConversation(conv._id); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-0.5 rounded"
                        style={{ color: '#475569' }}
                        title="Delete conversation"
                        onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                        onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed mode: just a "New Chat" button */}
      {collapsed && (
        <div className="flex-1 flex flex-col items-center pt-4 relative z-10 px-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNewChat}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
      )}

      {/* ── Status bar ────────────────────────────────────────── */}
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
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(51, 65, 85, 0.3)', border: '1px solid rgba(51, 65, 85, 0.6)' }}
          >
            <Zap className="w-4 h-4" style={{ color: '#94A3B8' }} />
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
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#10B981' }} />
          )}
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
