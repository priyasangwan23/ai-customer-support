import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, CheckCheck, Clock } from 'lucide-react';

/* Streaming text renderer */
const StreamingText = ({ text, isStreaming }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!isStreaming) {
      setDisplayed(text);
      return;
    }
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [text, isStreaming]);

  return (
    <span className="whitespace-pre-wrap break-words">
      {displayed}
      {isStreaming && displayed.length < text.length && (
        <span
          className="inline-block w-0.5 h-[1em] ml-0.5 align-middle animate-glow-pulse"
          style={{ background: '#A78BFA', verticalAlign: 'text-bottom' }}
        />
      )}
    </span>
  );
};

const MessageBubble = ({ message, isNew = false }) => {
  const { text, isBot, timestamp } = message;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} mb-1`}
    >
      <div className={`flex items-end gap-2.5 max-w-[72%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>

        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 avatar-pulse"
          style={isBot
            ? {
                background: 'linear-gradient(135deg, #7C3AED, #9B4DFF)',
                boxShadow: '0 0 14px rgba(124,58,237,0.5)',
                border: '1.5px solid rgba(167,139,250,0.3)',
              }
            : {
                background: 'linear-gradient(135deg, #1E2D47, #283D5E)',
                border: '1.5px solid rgba(167,139,250,0.2)',
                boxShadow: '0 0 8px rgba(0,0,0,0.3)',
              }
          }
        >
          {isBot
            ? <Bot  className="w-4 h-4 text-white" strokeWidth={2} />
            : <User className="w-4 h-4" style={{ color: '#94A3B8' }} />
          }
        </motion.div>

        <div className={`flex flex-col gap-1 ${isBot ? 'items-start' : 'items-end'}`}>

          {/* Sender label */}
          <span className="text-[9px] font-bold uppercase tracking-widest px-1" style={{ color: '#475569' }}>
            {isBot ? 'SupportSense AI' : 'You'}
          </span>

          {/* Bubble */}
          <div
            className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              isBot
                ? `bubble-ai rounded-tl-sm`
                : `bubble-user rounded-tr-sm`
            }`}
            style={{
              color: isBot ? '#E2E8F0' : '#fff',
            }}
          >
            {/* Shimmer for AI bubbles */}
            {isBot && (
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.04) 0%, transparent 60%)',
                }}
              />
            )}

            <StreamingText text={text} isStreaming={isNew && isBot} />

            {/* Timestamp + status */}
            <div
              className={`flex items-center gap-1.5 mt-2 text-[10px] select-none ${isBot ? '' : 'justify-end'}`}
              style={{ color: isBot ? '#475569' : 'rgba(255,255,255,0.45)' }}
            >
              <Clock className="w-2.5 h-2.5" />
              <span>{timestamp}</span>
              {!isBot && (
                <CheckCheck className="w-3 h-3 ml-0.5" style={{ color: 'rgba(196,181,253,0.7)' }} />
              )}
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
