import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import SplashScreen from './components/SplashScreen';

function App() {
  const [ready, setReady] = useState(false);

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
