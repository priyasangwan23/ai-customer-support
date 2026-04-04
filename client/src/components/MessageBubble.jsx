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
          style={{ background: '#3B82F6', verticalAlign: 'text-bottom' }}
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
                  background: '#3B82F6',
                  boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                  border: '1.5px solid rgba(59,130,246,0.5)',
                }
              : {
                  background: '#1E293B',
                  border: '1.5px solid rgba(51,65,85,0.8)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
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
                  background: 'rgba(59,130,246,0.03)',
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
                <CheckCheck className="w-3 h-3 ml-0.5" style={{ color: 'rgba(255,255,255,0.6)' }} />
              )}
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
