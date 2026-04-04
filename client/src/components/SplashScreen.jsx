import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Typewriter hook ─────────────────────────────── */
const useTypewriter = (text, speed, startDelay) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(''); setDone(false);
    let i = 0;
    const t = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(id); setDone(true); }
      }, speed);
      return () => clearInterval(id);
    }, startDelay);
    return () => clearTimeout(t);
  }, [text, speed, startDelay]);
  return { displayed, done };
};

/* ── Blinking cursor ─────────────────────────────── */
const Cursor = () => (
  <motion.span
    animate={{ opacity: [1, 0, 1] }}
    transition={{ duration: 0.75, repeat: Infinity }}
    className="inline-block w-[2px] h-[0.85em] align-middle ml-[2px] rounded-full"
    style={{ background: '#60A5FA', willChange: 'opacity' }}
  />
);

/* ── Dual-ring spinner ───────────────────────────── */
const Spinner = () => (
  <div className="relative flex items-center justify-center w-12 h-12">
    <motion.svg
      className="absolute inset-0 w-full h-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
      style={{ willChange: 'transform' }}
      viewBox="0 0 48 48"
    >
      <defs>
        <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#2563EB" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="none" stroke="url(#sg)"
        strokeWidth="3" strokeLinecap="round" strokeDasharray="82 44" />
    </motion.svg>
    <motion.svg
      className="absolute w-6 h-6"
      animate={{ rotate: -360 }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
      style={{ willChange: 'transform' }}
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="8" fill="none" stroke="#60A5FA"
        strokeWidth="2" strokeLinecap="round" strokeDasharray="18 32" strokeOpacity="0.35" />
    </motion.svg>
    <motion.div
      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.4, repeat: Infinity }}
      className="w-1.5 h-1.5 rounded-full"
      style={{ background: '#60A5FA', willChange: 'transform, opacity' }}
    />
  </div>
);

/* ── Floating particle ───────────────────────────── */
const Particle = ({ x, y, size, delay, dur }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: '#60A5FA', willChange: 'transform, opacity', filter: 'blur(1px)' }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 0], y: [0, -60, -120] }}
    transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeOut' }}
  />
);

const PARTICLES = [
  { x: 10, y: 80, size: 4, delay: 0,    dur: 3.5 },
  { x: 25, y: 70, size: 3, delay: 0.5,  dur: 4 },
  { x: 50, y: 90, size: 5, delay: 0.2,  dur: 3 },
  { x: 70, y: 75, size: 3, delay: 0.8,  dur: 4.2 },
  { x: 85, y: 85, size: 4, delay: 0.3,  dur: 3.8 },
  { x: 40, y: 60, size: 2, delay: 1.1,  dur: 3.2 },
  { x: 90, y: 50, size: 3, delay: 0.6,  dur: 4.5 },
  { x: 15, y: 40, size: 2, delay: 1.4,  dur: 3.6 },
  { x: 50, y: 50, size: 6, delay: 0.1,  dur: 2.8 },
  { x: 60, y: 80, size: 3, delay: 0.9,  dur: 3.9 },
];

/* ── Main splash ─────────────────────────────────── */
const SplashScreen = ({ onComplete }) => {
  const [exiting,     setExiting]     = useState(false);
  const [showLine,    setShowLine]    = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  /* Timing constants */
  const WORD1_DELAY = 100;   // "SUPPORTSENSE" bang
  const WORD2_DELAY = 500;   // "AI" bang
  const LINE_DELAY  = 1100;  // underline draws
  const TAG_DELAY   = 1600;  // tagline starts typing
  const TAGLINE     = 'YOUR INTELLIGENT COMPANION';
  const TAG_SPEED   = 35;
  const SPIN_DELAY  = TAG_DELAY + TAGLINE.length * TAG_SPEED + 400;
  const EXIT_DELAY  = SPIN_DELAY + 2200;

  const tagline = useTypewriter(TAGLINE, TAG_SPEED, TAG_DELAY);

  useEffect(() => {
    const t1 = setTimeout(() => setShowLine(true),    LINE_DELAY);
    const t2 = setTimeout(() => setShowSpinner(true), SPIN_DELAY);
    const t3 = setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 650);
    }, EXIT_DELAY);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  /* Netflix style impact + slow zoom variants */
  const cinematicVariant = (delay) => ({
    initial: { scale: 2.5, opacity: 0, filter: 'blur(20px)' },
    animate: { 
      scale: [2.5, 1, 1.15], 
      opacity: [0, 1, 1], 
      filter: ['blur(20px)', 'blur(0px)', 'blur(0px)'] 
    },
    transition: { 
      duration: 6, 
      delay: delay / 1000, 
      times: [0, 0.08, 1], // Quick impact, then very slow continuous zoom
      ease: ['easeOut', 'linear']
    },
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none" style={{ background: '#000000' }}>

      {/* Particles */}
      {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

      {/* Central ambient cinematic glow */}
      <motion.div className="absolute pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{
          width: 800, height: 800,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 60%)',
          willChange: 'transform',
        }}
      />

      <AnimatePresence>
        {!exiting && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center h-full gap-8 relative z-10"
          >
            {/* Cinematic Brand name */}
            <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-6 mt-10">
              <motion.span
                {...cinematicVariant(WORD1_DELAY)}
                className="text-6xl md:text-7xl lg:text-8xl tracking-tighter font-black uppercase text-center"
                style={{
                  background: 'linear-gradient(180deg, #DBEAFE 0%, #60A5FA 45%, #2563EB 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'block',
                  textShadow: '0 10px 40px rgba(37,99,235,0.7)',
                  willChange: 'transform, opacity, filter',
                }}
              >
                SUPPORTSENSE
              </motion.span>
              <motion.span
                {...cinematicVariant(WORD2_DELAY)}
                className="text-6xl md:text-7xl lg:text-8xl tracking-tighter font-black uppercase"
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #93C5FD 45%, #60A5FA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'block',
                  textShadow: '0 10px 40px rgba(59,130,246,0.8)',
                  willChange: 'transform, opacity, filter',
                }}
              >
                AI
              </motion.span>
            </div>

            {/* Glowing underline draw */}
            <AnimatePresence>
              {showLine && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="h-[3px] w-3/4 max-w-lg rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #2563EB, #BFDBFE, #2563EB, transparent)',
                    transformOrigin: 'center',
                    boxShadow: '0 0 20px rgba(96,165,250,0.8), 0 0 40px rgba(37,99,235,0.5)',
                    willChange: 'transform, opacity',
                  }}
                />
              )}
            </AnimatePresence>

            {/* Typewriter cinematic tagline */}
            <div className="h-8 flex items-center mt-2">
              <span
                className="text-base md:text-lg font-bold tracking-[0.3em] uppercase"
                style={{ 
                  color: '#93C5FD', 
                  textShadow: '0 0 10px rgba(96,165,250,0.5)'
                }}
              >
                {tagline.displayed}
                {!tagline.done && tagline.displayed.length > 0 && <Cursor />}
              </span>
            </div>

            {/* Spinner */}
            <AnimatePresence>
              {showSpinner && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.8 }}
                  animate={{ opacity: 1,  y: 0,  scale: 1 }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 150, damping: 15 }}
                  className="flex flex-col items-center gap-4 mt-6 absolute bottom-20"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <Spinner />
                  <motion.p
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="text-xs font-bold uppercase tracking-[0.3em]"
                    style={{ color: '#60A5FA' }}
                  >
                    Initializing
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit: Cinematic fade to black/purple wipe */}
      <AnimatePresence>
        {exiting && (
          <motion.div
            key="exit"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 z-50 pointer-events-none"
            style={{
              background: '#0B1120', // Transitions beautifully into the dashboard background
              willChange: 'opacity, transform',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SplashScreen;
