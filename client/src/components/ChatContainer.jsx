import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Send, Plus, Mic, Square, Activity, Wifi, Sparkles, ChevronDown, X, File
} from 'lucide-react';
import MessageBubble from './MessageBubble';
import QuickActions from './QuickActions';
import { useChatHistory } from '../context/ChatContext';

const WELCOME_MESSAGE = {
  id: 'welcome',
  text: "Hello! I'm your SupportSense AI assistant. I'm ready to help you with any questions or issues. What can I assist you with today?",
  isBot: true,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const COMMON_SUGGESTIONS = [
  "Track my order",
  "Refund status",
  "Cancel my order",
  "Reset my password",
  "Talk to human",
  "Shipping time",
  "Business hours",
  "Return policy",
  "Damaged product",
  "Update delivery address",
  "Payment methods",
  "Invoice request",
  "Delete my account",
  "How to change my email?",
  "Are my payments safe?",
  "Bulk order discount",
  "Warranty information",
  "Speak to manager",
  "Product availability",
  "Change shipping method"
];

/* ─── Typing Indicator ──────────────────────────────────── */
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 12, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9, y: 8 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className="flex flex-col gap-1.5 mb-4 group"
  >
    <div className="flex items-center gap-2.5">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse"
        style={{
          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
          boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Bot className="w-5 h-5 text-white" strokeWidth={2.5} />
      </div>
      
      <div
        className="flex flex-col gap-1.5 px-5 py-4 rounded-2xl rounded-tl-sm relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.98))',
          border: '1px solid rgba(59,130,246,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Animated Scanning Bar */}
        <motion.div 
          animate={{ top: ['-100%', '200%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-1/2 opacity-20 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent, #3B82F6, transparent)',
            filter: 'blur(8px)',
          }}
        />

        <div className="flex items-center gap-2">
           <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity, 
                  delay: i * 0.15 
                }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#3B82F6' }}
              />
            ))}
          </div>
          <span className="text-[11px] font-bold tracking-tight uppercase" style={{ color: '#E2E8F0', letterSpacing: '0.05em' }}>
            Processing AI Insight...
          </span>
        </div>
        
        <p className="text-[10px] font-medium leading-tight max-w-[180px]" style={{ color: '#64748B' }}>
          Analyzing query context and cross-referencing knowledge base.
        </p>
      </div>
    </div>
  </motion.div>
);

/* ─── Main Component ────────────────────────────────────── */
const ChatContainer = () => {
  const {
    activeConversationId,
    createConversation,
    appendMessage,
    getConversationMessages,
    conversationsRef,
  } = useChatHistory();

  const [messages, setMessages]           = useState([WELCOME_MESSAGE]);
  const [input, setInput]                 = useState('');
  const [isTyping, setIsTyping]           = useState(false);
  const [newMsgId, setNewMsgId]           = useState(null);
  const [inputFocused, setInputFocused]   = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isListening, setIsListening]     = useState(false);
  const [selectedFile, setSelectedFile]   = useState(null);
  const [settings, setSettings]           = useState({ chatbotName: 'SupportSense Assistant', theme: 'dark' });
  const [suggestions, setSuggestions]     = useState([]);

  const bottomRef     = useRef(null);
  const containerRef  = useRef(null);
  const inputRef      = useRef(null);
  const fileInputRef  = useRef(null);
  const recognitionRef = useRef(null); 
  const loadedConvRef = useRef(null);

  // ── Settings from localStorage ────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('chatSettings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  // ── Auto-Suggestions Logic ──────────────────────────────
  useEffect(() => {
    if (input.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const filtered = COMMON_SUGGESTIONS.filter(s => 
      s.toLowerCase().includes(input.toLowerCase()) && 
      s.toLowerCase() !== input.toLowerCase().trim()
    ).slice(0, 4);
    setSuggestions(filtered);
  }, [input]);

  const handleSuggestionClick = (text) => {
    setInput(text);
    setSuggestions([]);
    setTimeout(() => send(text), 100);
  };
  // Deps: only activeConversationId. We intentionally exclude `conversations`
  // and `getConversationMessages` to prevent this effect from re-running every
  // time a message is appended (which updates conversations state).
  // The loadedConvRef guard keeps this idempotent per conversation.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([WELCOME_MESSAGE]);
      loadedConvRef.current = null;
      return;
    }
    if (loadedConvRef.current === activeConversationId) return;
    loadedConvRef.current = activeConversationId;

    // Try the in-memory cache first (available immediately after selection)
    const found = conversationsRef.current?.find(c => c._id === activeConversationId);
    if (found && found.messages && found.messages.length > 0) {
      setMessages(found.messages.map(m => ({
        id: m._id || m.timestamp,
        text: m.text,
        isBot: m.sender === 'bot',
        timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })));
    } else {
      // Fall back to fetching from backend
      getConversationMessages(activeConversationId).then(msgs => {
        // Guard: only update if we're still on the same conversation
        if (loadedConvRef.current !== activeConversationId) return;
        if (!msgs || msgs.length === 0) {
          setMessages([WELCOME_MESSAGE]);
        } else {
          setMessages(msgs.map(m => ({
            id: m._id || m.timestamp,
            text: m.text,
            isBot: m.sender === 'bot',
            timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          })));
        }
      });
    }
  }, [activeConversationId]); // eslint-disable-line

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 120);
  }, []);

  const handleVoiceInput = () => {
    // If already listening, stop it (Toggle behavior)
    if (isListening) {
      stopVoiceInput();
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.continuous = false;
    recognition.interimResults = true; // Set to true for live typing feedback
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log("[Voice] Microphone Listening...");
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      // Update the UI immediately so the user sees we are listening
      if (interimTranscript) {
        setInput(interimTranscript);
      }

      if (finalTranscript.trim()) {
        console.log("[Voice] Final Transcript Received:", finalTranscript);
        handleAutoSendVoice(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error("[Voice] Recognition Error:", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        alert("Microphone access is denied. Please enable mic access in your browser settings (top left address bar).");
      }
    };

    recognition.onend = () => {
      console.log("[Voice] Microphone Stopped.");
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("[Voice] Critical Exception:", err);
      setIsListening(false);
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Helper to handle the auto-send from voice
  const handleAutoSendVoice = async (text) => {
    // Set input so UI shows what was heard
    setInput(text);
    // Short delay to let the user see the text before it's "sent"
    setTimeout(() => {
      send(text);
    }, 400);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
    // Optional: reset file input value to allow selecting the same file again
    e.target.value = null;
  };

  const send = async (overrideInput = null) => {
    const textToSubmit = overrideInput !== null ? overrideInput : input;
    if (!textToSubmit.trim() && !selectedFile) return;
    
    const userMessage = textToSubmit.trim();
    const msgId = Date.now();
    const displayText = userMessage + (selectedFile ? ` 📎 ${selectedFile.name}` : '');

    // ── If no active conversation, create one first ─────────
    let convId = activeConversationId;
    if (!convId) {
      const newConv = await createConversation(userMessage.slice(0, 50) || 'New Conversation');
      convId = newConv?._id ?? null;
      // Mark as already loaded BEFORE React can run the useEffect that would
      // reset messages to [WELCOME_MESSAGE] for the newly-created empty conversation.
      if (convId) loadedConvRef.current = convId;
    }

    // Append to local UI immediately
    setMessages(p => [...p, {
      id: msgId,
      text: displayText,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setInput('');
    const fileToSend = selectedFile;
    setSelectedFile(null);
    setIsTyping(true);

    // Persist user message to history (fire-and-forget, don't await)
    if (convId) appendMessage(convId, 'user', displayText);

    try {
      // ── Build Context-Aware Body ──────────────────────────
      // Pass the last few messages to the backend for context
      const chatHistory = messages.slice(-5).map(m => ({ 
        sender: m.isBot ? 'bot' : 'user', 
        text: m.text 
      }));

      let bodyData;
      let headers = {};
      
      if (fileToSend) {
        const formData = new FormData();
        formData.append('message', userMessage);
        formData.append('file', fileToSend);
        formData.append('history', JSON.stringify(chatHistory));
        bodyData = formData;
      } else {
        bodyData = JSON.stringify({ 
          message: userMessage,
          history: chatHistory
        });
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers,
        body: bodyData,
      });
      const data = await response.json();
      setIsTyping(false);
      const botId = Date.now() + 1;
      setNewMsgId(botId);
      const botReply = data.reply;
      setMessages(p => [...p, {
        id: botId,
        text: botReply,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      // Persist bot message
      if (convId) appendMessage(convId, 'bot', botReply);
      setTimeout(() => setNewMsgId(null), 3000);
    } catch (error) {
      console.error('Chat API Error:', error);
      setIsTyping(false);
      const botId = Date.now() + 1;
      setNewMsgId(botId);
      const errReply = "I'm having trouble connecting to the server right now. Please try again in a moment.";
      setMessages(p => [...p, {
        id: botId,
        text: errReply,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      if (convId) appendMessage(convId, 'bot', errReply);
      setTimeout(() => setNewMsgId(null), 3000);
    }
  };

  return (
    <div
      className="flex flex-col flex-1 h-full rounded-2xl overflow-hidden relative"
      style={{ background: 'transparent' }}
    >
      {/* Ambient background orbs removed for clean SaaS look */}

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header
        className="px-6 py-4 flex items-center justify-between flex-shrink-0 relative bg-chat-header z-10"
      >
        {/* Left: Bot info */}
        <div className="flex items-center gap-3.5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: '#3B82F6',
              boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
            }}
          >
            <Bot className="text-white w-5 h-5" strokeWidth={2} />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
              style={{ background: '#10B981', borderColor: '#060B18' }}
            />
          </motion.div>

          <div>
            <h2 className="font-bold text-[13px] flex items-center gap-2 text-theme-primary">
              {settings.chatbotName || 'SupportSense Assistant'}
              <motion.span
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#3B82F6', willChange: 'transform, opacity' }}
              />
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Activity className="w-3 h-3" style={{ color: '#3B82F6' }} />
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
            style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.2)' }}
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
            className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-chat-date"
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
              background: '#3B82F6',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <ChevronDown className="w-4 h-4 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── INPUT ──────────────────────────────────────────── */}
      <footer
        className="px-5 pt-3 pb-3 flex-shrink-0 relative bg-chat-footer z-10"
      >
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 right-0 px-5 pb-3 flex flex-wrap gap-2 pointer-events-none"
            >
              {suggestions.map((s, idx) => (
                <motion.button
                  key={s}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleSuggestionClick(s)}
                  className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200"
                  style={{
                    background: 'rgba(30,41,59,0.85)',
                    borderColor: 'rgba(59,130,246,0.2)',
                    color: '#94A3B8',
                    backdropFilter: 'blur(12px)',
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    borderColor: 'rgba(59,130,246,0.6)', 
                    color: '#3B82F6',
                    background: 'rgba(30,41,59,1)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles size={12} className="text-blue-400" />
                  {s}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {selectedFile && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center justify-between mb-3 p-2 rounded-lg" 
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <div className="flex items-center gap-2 overflow-hidden px-2">
              <File className="w-4 h-4 flex-shrink-0" style={{ color: '#3B82F6' }} />
              <span className="text-sm font-medium truncate" style={{ color: '#E2E8F0' }}>{selectedFile.name}</span>
            </div>
            <button 
              onClick={() => setSelectedFile(null)} 
              className="text-[#94A3B8] hover:text-[#EF4444] transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        <motion.div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg mb-2 transition-colors bg-chat-input-wrapper ${inputFocused ? 'ring-1 ring-blue-500/60' : ''}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange} 
            accept="image/*,.pdf,.doc,.docx,.txt" 
          />
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.05, color: '#94A3B8' }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ color: '#475569' }}
          >
            <Plus className="w-5 h-5" />
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
            className="flex-1 bg-transparent text-[17px] font-medium py-2 focus:outline-none placeholder:text-[#475569]"
            style={{ color: '#F1F5F9' }}
          />

          <motion.button
            onClick={handleVoiceInput}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-9 h-9 flex items-center justify-center flex-shrink-0 transition-all duration-300 relative ${
              isListening ? 'animate-pulse' : ''
            }`}
            style={{ 
              color: isListening ? '#EF4444' : '#475569',
              background: isListening ? 'rgba(239, 68, 68, 0.12)' : 'transparent',
              borderRadius: '12px',
              border: isListening ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid transparent',
            }}
            title={isListening ? "Stop listening" : "Voice search"}
          >
            {isListening ? (
              <Square className="w-4 h-4 fill-current" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
            {isListening && (
               <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0F172A] animate-ping" />
            )}
          </motion.button>

          <motion.button
            onClick={send}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0 transition-colors"
            style={{
              background: (input.trim() || selectedFile) ? '#3B82F6' : 'transparent',
              color: (input.trim() || selectedFile) ? '#fff' : '#475569',
              cursor: (input.trim() || selectedFile) ? 'pointer' : 'default',
            }}
            disabled={!input.trim() && !selectedFile}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Removed 'Powered by' text to let the input touch the bottom better */}
      </footer>
    </div>
  );
};

export default ChatContainer;
