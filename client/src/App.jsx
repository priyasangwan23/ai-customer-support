import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import SplashScreen from './components/SplashScreen';

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const applyTheme = () => {
      const saved = localStorage.getItem('chatSettings');
      if (saved) {
         try {
           const { theme } = JSON.parse(saved);
           if (theme === 'light') {
             document.documentElement.classList.add('theme-light');
           } else {
             document.documentElement.classList.remove('theme-light');
           }
         } catch(e) {}
      } else {
        document.documentElement.classList.remove('theme-light');
      }
    };
    
    applyTheme();
    window.addEventListener('settingsUpdated', applyTheme);
    return () => window.removeEventListener('settingsUpdated', applyTheme);
  }, []);

  return (
    <>
      <AnimatePresence>
        {!ready && <SplashScreen onComplete={() => setReady(true)} />}
      </AnimatePresence>

      {ready && (
        <motion.div
          key="main-app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full h-full"
        >
          <BrowserRouter>
            <Dashboard />
          </BrowserRouter>
        </motion.div>
      )}
    </>
  );
}

export default App;
