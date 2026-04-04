import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import InsightPanel from '../components/InsightPanel';
import Analytics from './Analytics';
import Settings from './Settings';
import ControlCenter from './ControlCenter';

const Dashboard = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: '#060B18' }}>
      <Sidebar />
      <main className="flex-1 min-w-0 h-full overflow-hidden relative">
        <Routes>
          {/* Default Route: The Main Chat Interface */}
          <Route path="/" element={
            <div className="flex h-full w-full">
              <ChatContainer />
              <InsightPanel />
            </div>
          } />

          {/* AI Control Center View */}
          <Route path="/dashboard" element={<ControlCenter />} />

          <Route path="/analytics" element={<Analytics />} />

          <Route path="/settings" element={<Settings />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
