import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, CheckCheck, Clock, ThumbsUp, Copy } from 'lucide-react';

const MessageBubble = ({ message }) => {
  const { text, isBot, timestamp } = message;
  const [liked,   setLiked]   = useState(false);
  const [copied,  setCopied]  = useState(false);
  const [hover,   setHover]   = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={`flex items-end gap-2 max-w-[65%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>

        {/* Avatar */}
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mb-1"
          style={isBot
            ? { background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.25)' }
            : { background: 'rgba(109,40,217,0.25)', border: '1px solid rgba(167,139,250,0.2)' }}
        >
          {isBot
            ? <Bot  className="w-3 h-3" style={{ color: '#A78BFA' }} />
            : <User className="w-3 h-3" style={{ color: '#A78BFA' }} />}
        </div>

        <div className={`flex flex-col gap-0.5 ${isBot ? 'items-start' : 'items-end'}`}>

          {/* Bubble */}
          <motion.div
            whileHover={{ scale: 1.012 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className={`relative px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed font-normal ${isBot ? 'glass' : 'glass-purple'}`}
            style={isBot
              ? { background: '#111827', border: '1px solid #1F2937', color: '#F9FAFB', borderBottomLeftRadius: '4px', willChange: 'transform' }
              : { background: 'linear-gradient(135deg, #6D28D9 0%, #A78BFA 100%)', color: '#fff', borderBottomRightRadius: '4px', willChange: 'transform' }}
          >
            <p className="whitespace-pre-wrap break-words">{text}</p>

            {/* Timestamp */}
            <div
              className={`flex items-center gap-1 mt-1.5 text-[10px] select-none ${isBot ? '' : 'justify-end'}`}
              style={{ color: isBot ? '#6B7280' : 'rgba(255,255,255,0.5)' }}
            >
              <Clock className="w-2.5 h-2.5" />
              <span>{timestamp}</span>
              {!isBot && <CheckCheck className="w-3 h-3 ml-0.5" style={{ color: 'rgba(255,255,255,0.65)' }} />}
            </div>

            {/* Like badge */}
            <AnimatePresence>
              {liked && (
                <motion.span
                  initial={{ scale: 0, opacity: 0, y: 4 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{   scale: 0, opacity: 0, y: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  className="absolute -bottom-3 right-2 text-xs px-1.5 py-0.5 rounded-full shadow"
                  style={{ background: '#111827', border: '1px solid #1F2937', willChange: 'transform, opacity' }}
                >
                  👍
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Action bar */}
          <AnimatePresence>
            {hover && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.90 }}
                animate={{ opacity: 1, y: 0,  scale: 1 }}
                exit={{   opacity: 0, y: -4,  scale: 0.90 }}
                transition={{ duration: 0.14, ease: 'easeOut' }}
                className={`flex items-center gap-1 ${isBot ? '' : 'flex-row-reverse'}`}
                style={{ willChange: 'transform, opacity' }}
              >
                <motion.button
                  onClick={() => setLiked(p => !p)}
                  whileHover={{ scale: 1.18 }} whileTap={{ scale: 0.88 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: liked ? 'rgba(167,139,250,0.2)' : '#111827', border: '1px solid #1F2937', color: liked ? '#A78BFA' : '#6B7280', willChange: 'transform' }}
                >
                  <ThumbsUp className="w-2.5 h-2.5" />
                </motion.button>

                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.18 }} whileTap={{ scale: 0.88 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: copied ? 'rgba(167,139,250,0.15)' : '#111827', border: '1px solid #1F2937', color: copied ? '#A78BFA' : '#6B7280', willChange: 'transform' }}
                >
                  <Copy className="w-2.5 h-2.5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
