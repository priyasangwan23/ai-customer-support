import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import InsightPanel from '../components/InsightPanel';

const Dashboard = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: '#0B1120' }}>
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 relative">
        <Routes>
          {/* Default Route: The Main Chat Interface */}
          <Route path="/" element={
            <div className="flex h-full w-full">
              <ChatContainer />
              <InsightPanel />
            </div>
          } />

          {/* Placeholders for other routes */}
          <Route path="/dashboard" element={
            <div className="flex-1 flex items-center justify-center">
              <h1 className="text-3xl font-bold text-white uppercase tracking-widest">Main Dashboard View</h1>
            </div>
          } />
          
          <Route path="/analytics" element={
            <div className="flex-1 flex items-center justify-center">
              <h1 className="text-3xl font-bold text-white uppercase tracking-widest">Analytics View</h1>
            </div>
          } />
          
          <Route path="/settings" element={
            <div className="flex-1 flex items-center justify-center">
              <h1 className="text-3xl font-bold text-white uppercase tracking-widest">Settings View</h1>
            </div>
          } />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
