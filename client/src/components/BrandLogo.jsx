import React from 'react';
import { motion } from 'framer-motion';

const BrandLogo = ({ className = "w-6 h-6" }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_0_12px_rgba(167,139,250,0.8)] drop-shadow-[0_0_4px_rgba(109,40,217,0.6)]"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DDD6FE" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
          
          <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feFlood floodColor="#A78BFA" floodOpacity="0.8" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* Outer Hexagon frame */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d="M50 5 L92 27 L92 73 L50 95 L8 73 L8 27 Z"
          stroke="url(#logo-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="rgba(109, 40, 217, 0.1)"
        />

        {/* Inner Shield / Hexagon Shadow */}
        <path
          d="M50 15 L82 32 L82 68 L50 85 L18 68 L18 32 Z"
          fill="rgba(0,0,0,0.2)"
        />

        {/* Central Symbols */}
        <g stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'url(#logo-glow)' }}>
          
          {/* Network dots & lines (Top part) */}
          <circle cx="42" cy="35" r="2" fill="white" stroke="none" />
          <circle cx="58" cy="32" r="2" fill="white" stroke="none" />
          <circle cx="50" cy="42" r="2.5" fill="white" stroke="none" />
          <path d="M42 35 L50 42 L58 32" strokeOpacity="0.6" strokeWidth="1.5" />

          {/* Pulse Line (Middle) */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            d="M25 55 L38 55 L42 45 L50 65 L58 35 L62 55 L75 55"
            stroke="url(#logo-grad)"
            strokeWidth="3"
          />

          {/* Lightning Bolt (Right side / bottom overlay) */}
          <motion.path
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            d="M65 50 L58 65 L68 65 L62 80"
            stroke="#F59E0B"
            strokeWidth="3.5"
            filter="drop-shadow(0 0 8px #F59E0B) drop-shadow(0 0 12px #F59E0B)"
          />
        </g>

        {/* Dynamic scan line effect */}
        <motion.rect
          x="10"
          width="80"
          height="1"
          fill="rgba(255,255,255,0.2)"
          animate={{
            y: [20, 80, 20],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </svg>
    </div>
  );
};

export default BrandLogo;
