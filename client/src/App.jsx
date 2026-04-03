import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import ChatContainer from './components/ChatContainer';
import InsightPanel from './components/InsightPanel';
import SplashScreen from './components/SplashScreen';

function App() {
  const [ready, setReady] = useState(false);

  return (
    <>
      {/* Splash — unmounts after animation */}
      <AnimatePresence>
        {!ready && <SplashScreen onComplete={() => setReady(true)} />}
      </AnimatePresence>

      {/* Main dashboard — fades in after splash exits */}
      <AnimatePresence>
        {ready && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex h-screen w-full overflow-hidden"
            style={{ background: '#0B1120', willChange: 'opacity' }}
          >
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0">
              <ChatContainer />
            </main>
            <InsightPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
