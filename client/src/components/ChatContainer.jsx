import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Plus, Activity, Wifi } from 'lucide-react';
import MessageBubble from './MessageBubble';
import QuickActions from './QuickActions';

const initialMessages = [
  { id: 1, text: "Hello! I'm your SupportSense AI assistant. How can I help you today?", isBot: true,  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  { id: 2, text: 'I need to track my latest order.',                                    isBot: false, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
];

const ChatContainer = () => {
  const [messages, setMessages]   = useState(initialMessages);
  const [input, setInput]         = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const [settings, setSettings]   = useState({ chatbotName: 'SupportSense Assistant', theme: 'dark' });
  const bottomRef                 = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('chatSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages(p => [...p, { id: Date.now(), text: userMessage, isBot: false, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
    setIsTyping(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();
      
      setIsTyping(false);
      setMessages(p => [...p, { id: Date.now() + 1, text: data.reply, isBot: true, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (error) {
      console.error("Chat API Error:", error);
      setIsTyping(false);
      setMessages(p => [...p, { id: Date.now() + 1, text: "Error: Could not reach the server.", isBot: true, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
  };

  const isLight = settings.theme === 'light';

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden" style={{ background: isLight ? '#F3F4F6' : '#0B1120', transition: 'background-color 0.3s' }}>
      
      {/* Ambient orbs — GPU-only via transform */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none animate-float"
        style={{ background: 'radial-gradient(circle, rgba(109,40,217,0.07) 0%, transparent 65%)', willChange: 'transform' }} />
      <div className="absolute bottom-24 left-0 w-72 h-72 pointer-events-none animate-float"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 65%)', animationDelay: '2.5s', willChange: 'transform' }} />

      {/* Header */}
      <header
        className="px-8 py-4 flex items-center justify-between flex-shrink-0 z-10 glass"
        style={{ background: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(11,17,32,0.9)', borderBottom: `1px solid ${isLight ? '#E5E7EB' : '#1F2937'}`, backdropFilter: 'blur(16px)' }}
      >
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 14 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg glow-ring"
            style={{ background: 'linear-gradient(135deg, #6D28D9, #A78BFA)', willChange: 'transform' }}
          >
            <Bot className="text-white w-5 h-5" strokeWidth={2} />
          </motion.div>
          <div>
            <h2 className="font-bold text-sm flex items-center gap-2" style={{ color: isLight ? '#111827' : '#F9FAFB' }}>
              {settings.chatbotName || 'SupportSense Assistant'}
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-2 h-2 rounded-full"
                style={{ background: '#A78BFA', willChange: 'transform, opacity' }}
              />
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Activity className="w-3 h-3" style={{ color: '#A78BFA' }} />
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Active · AI Processing</p>
            </div>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.04 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold glass"
          style={{ background: 'rgba(167,139,250,0.08)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.2)' }}
        >
          <Wifi className="w-3 h-3" /> Live
        </motion.div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-2 z-10">
        <AnimatePresence initial={false}>
          {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl w-fit"
              style={{ background: '#111827', border: '1px solid #1F2937' }}
            >
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: '#A78BFA', animation: `dotBounce 1s ease-in-out ${i * 0.18}s infinite` }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <QuickActions onAction={t => setInput(t)} />
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <footer
        className="px-6 py-4 flex-shrink-0 z-10"
        style={{ background: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(11,17,32,0.9)', borderTop: `1px solid ${isLight ? '#E5E7EB' : '#1F2937'}`, backdropFilter: 'blur(16px)' }}
      >
        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl glow-ring"
          style={{ background: isLight ? '#F9FAFB' : '#111827', border: `1px solid ${isLight ? '#E5E7EB' : '#1F2937'}` }}
        >
          <button className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors"
            style={{ color: '#9CA3AF' }}>
            <Plus className="w-4 h-4" />
          </button>
          <input
            type="text" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type your message..."
            className="flex-1 bg-transparent text-[13px] focus:outline-none"
            style={{ color: '#F9FAFB' }}
          />
          <motion.button
            onClick={send}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 btn-primary glass-purple"
            style={{ willChange: 'transform' }}
          >
            <Send className="w-3.5 h-3.5 ml-0.5" />
          </motion.button>
        </div>
        <p className="text-center text-[10px] mt-2" style={{ color: '#6B7280' }}>
          {settings.chatbotName || 'SupportSense AI'} · Responses may vary
        </p>
      </footer>
    </div>
  );
};

export default ChatContainer;
