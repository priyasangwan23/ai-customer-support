import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Send, Paperclip, Mic, Activity, Wifi, Sparkles, ChevronDown
} from 'lucide-react';
import MessageBubble from './MessageBubble';
import QuickActions from './QuickActions';

const initialMessages = [
  {
    id: 1,
    text: "Hello! I'm your SupportSense AI assistant. I'm ready to help you with any questions or issues. What can I assist you with today?",
    isBot: true,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: 2,
    text: 'I need to track my latest order.',
    isBot: false,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

/* ─── Typing Indicator ──────────────────────────────────── */
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.92 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9, y: 6 }}
    transition={{ duration: 0.22 }}
    className="flex items-center gap-2.5 mb-1"
  >
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        background: 'linear-gradient(135deg, #7C3AED, #9B4DFF)',
        boxShadow: '0 0 14px rgba(124,58,237,0.5)',
        border: '1.5px solid rgba(167,139,250,0.3)',
      }}
    >
      <Bot className="w-4 h-4 text-white" strokeWidth={2} />
    </div>
    <div
      className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm"
      style={{
        background: 'linear-gradient(135deg, rgba(13,21,38,0.95), rgba(17,27,48,0.9))',
        border: '1px solid rgba(30,45,71,0.8)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      }}
    >
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full typing-dot"
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
            animationDelay: `${i * 0.2}s`,
            boxShadow: '0 0 6px rgba(167,139,250,0.5)',
          }}
        />
      ))}
    </div>
    <span className="text-[10px] font-medium" style={{ color: '#475569' }}>
      AI is thinking…
    </span>
  </motion.div>
);

/* ─── Main Component ────────────────────────────────────── */
const ChatContainer = () => {
  const [messages, setMessages]           = useState(initialMessages);
  const [input, setInput]                 = useState('');
  const [isTyping, setIsTyping]           = useState(false);
  const [newMsgId, setNewMsgId]           = useState(null);
  const [inputFocused, setInputFocused]   = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [settings, setSettings]           = useState({ chatbotName: 'SupportSense Assistant', theme: 'dark' });

  const bottomRef    = useRef(null);
  const containerRef = useRef(null);
  const inputRef     = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('chatSettings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 120);
  }, []);

  const send = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    const msgId = Date.now();

    setMessages(p => [...p, {
      id: msgId,
      text: userMessage,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      setIsTyping(false);
      const botId = Date.now() + 1;
      setNewMsgId(botId);
      setMessages(p => [...p, {
        id: botId,
        text: data.reply,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      setTimeout(() => setNewMsgId(null), 3000);
    } catch (error) {
      console.error('Chat API Error:', error);
      setIsTyping(false);
      const botId = Date.now() + 1;
      setNewMsgId(botId);
      setMessages(p => [...p, {
        id: botId,
        text: "I'm having trouble connecting to the server right now. Please try again in a moment.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      setTimeout(() => setNewMsgId(null), 3000);
    }
  };

  return (
    <div
      className="flex flex-col flex-1 h-full rounded-2xl overflow-hidden relative"
      style={{ background: 'transparent' }}
    >
      {/* Ambient background orbs */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none animate-float"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 65%)', willChange: 'transform' }}
      />
      <div
        className="absolute -bottom-20 left-10 w-96 h-96 pointer-events-none animate-float"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 65%)', animationDelay: '2.5s', willChange: 'transform' }}
      />

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header
        className="px-6 py-4 flex items-center justify-between flex-shrink-0 relative"
        style={{
          background: 'rgba(6,11,24,0.95)',
          borderBottom: '1px solid rgba(30,45,71,0.7)',
          backdropFilter: 'blur(24px)',
          zIndex: 10,
        }}
      >
        {/* Left: Bot info */}
        <div className="flex items-center gap-3.5">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 320, damping: 14 }}
            className="relative w-10 h-10 rounded-2xl flex items-center justify-center glow-ring"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #9B4DFF)',
              boxShadow: '0 0 20px rgba(124,58,237,0.5)',
              willChange: 'transform',
            }}
          >
            <Bot className="text-white w-5 h-5" strokeWidth={2} />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
              style={{ background: '#10B981', borderColor: '#060B18', boxShadow: '0 0 6px rgba(16,185,129,0.6)' }}
            />
          </motion.div>

          <div>
            <h2 className="font-bold text-[13px] flex items-center gap-2" style={{ color: '#F1F5F9' }}>
              {settings.chatbotName || 'SupportSense Assistant'}
              <motion.span
                animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#A78BFA', boxShadow: '0 0 6px rgba(167,139,250,0.8)', willChange: 'transform, opacity' }}
              />
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Activity className="w-3 h-3" style={{ color: '#A78BFA' }} />
              <p className="text-[10px] font-semibold tracking-wide" style={{ color: '#64748B' }}>
                Active · AI Processing
              </p>
            </div>
          </div>
        </div>

        {/* Right: Badges + Fullscreen */}
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer"
            style={{ background: 'rgba(124,58,237,0.1)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.2)' }}
          >
            <Wifi className="w-3 h-3" /> Live
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer"
            style={{ background: 'rgba(16,185,129,0.08)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            <Sparkles className="w-3 h-3" /> GPT-4o
          </motion.div>
        </div>
      </header>

      {/* ── MESSAGES ───────────────────────────────────────── */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 pt-5 pb-2 space-y-2"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Date divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px" style={{ background: 'rgba(30,45,71,0.5)' }} />
          <span
            className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: 'rgba(13,21,38,0.7)', color: '#475569', border: '1px solid rgba(30,45,71,0.5)' }}
          >
            Today
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(30,45,71,0.5)' }} />
        </div>

        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} isNew={msg.id === newMsgId} />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>

        <QuickActions onAction={t => { setInput(t); inputRef.current?.focus(); }} />
        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="absolute bottom-24 right-6 w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              zIndex: 20,
              background: 'linear-gradient(135deg, #7C3AED, #9B4DFF)',
              boxShadow: '0 4px 16px rgba(124,58,237,0.5)',
              border: '1px solid rgba(167,139,250,0.3)',
            }}
          >
            <ChevronDown className="w-4 h-4 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── INPUT ──────────────────────────────────────────── */}
      <footer
        className="px-5 py-3 flex-shrink-0 relative"
        style={{
          background: 'rgba(6,11,24,0.95)',
          borderTop: '1px solid rgba(30,45,71,0.6)',
          backdropFilter: 'blur(24px)',
          zIndex: 10,
        }}
      >
        <motion.div
          animate={{
            boxShadow: inputFocused
              ? '0 0 0 1.5px rgba(167,139,250,0.5), 0 0 30px rgba(124,58,237,0.25)'
              : '0 0 0 1px rgba(30,45,71,0.6)',
            borderColor: inputFocused ? 'rgba(167,139,250,0.4)' : 'rgba(30,45,71,0.6)',
          }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl"
          style={{ background: 'rgba(13,21,38,0.9)', border: '1px solid rgba(30,45,71,0.6)' }}
        >
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0 transition-colors duration-200"
            style={{ color: '#475569' }}
          >
            <Paperclip className="w-4 h-4" />
          </motion.button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Ask SupportSense AI anything…"
            className="flex-1 bg-transparent text-[15px] focus:outline-none placeholder:text-[#64748B]"
            style={{ color: '#E2E8F0' }}
          />

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0 transition-colors duration-200"
            style={{ color: '#475569' }}
          >
            <Mic className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={send}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              background: input.trim()
                ? 'linear-gradient(135deg, #7C3AED, #9B4DFF)'
                : 'rgba(30,45,71,0.5)',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              willChange: 'transform',
              boxShadow: input.trim() ? '0 4px 16px rgba(124,58,237,0.4)' : 'none',
              border: '1px solid rgba(167,139,250,0.2)',
              cursor: input.trim() ? 'pointer' : 'default',
            }}
          >
            <Send className="w-3.5 h-3.5 text-white ml-0.5" />
          </motion.button>
        </motion.div>

        <p className="text-center text-[10px] mt-2.5" style={{ color: '#1E3A5F' }}>
          {settings.chatbotName || 'SupportSense AI'} · Powered by GPT-4o · Responses may vary
        </p>
      </footer>
    </div>
  );
};

export default ChatContainer;
