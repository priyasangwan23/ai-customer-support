import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import InsightPanel from '../components/InsightPanel';
import Analytics from './Analytics';
import Settings from './Settings';
import ControlCenter from './ControlCenter';
import { ChatProvider } from '../context/ChatContext';

const ResizableDivider = ({ onMouseDown, collapsed, onToggle, isLeft }) => (
  <div 
    className="w-1.5 hover:w-2 transition-all cursor-col-resize relative z-50 group flex items-center bg-transparent hover:bg-brand-accent/20"
    onMouseDown={onMouseDown}
  >
    <button 
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={`absolute top-1/2 -translate-y-1/2 w-4 h-8 bg-[#0D1526] rounded border border-brand-accent/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white shadow-lg ${isLeft ? '-left-2' : '-right-2'}`}
      style={{ zIndex: 60 }}
    >
      {collapsed ? 
        (isLeft ? <ChevronRight size={12} /> : <ChevronLeft size={12} />) : 
        (isLeft ? <ChevronLeft size={12} /> : <ChevronRight size={12} />)
      }
    </button>
  </div>
);

const Dashboard = () => {
  const [sidebarW, setSidebarW] = useState(288);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [insightW, setInsightW] = useState(320);
  const [insightCollapsed, setInsightCollapsed] = useState(false);
  const [dragging, setDragging] = useState(null);

  const handleMouseMove = useCallback((e) => {
    if (dragging === 'left') {
      const newW = Math.max(72, Math.min(e.clientX, 600));
      if (newW < 140) setSidebarCollapsed(true);
      else { setSidebarCollapsed(false); setSidebarW(newW); }
    } else if (dragging === 'right') {
      const newW = Math.max(0, Math.min(window.innerWidth - e.clientX, 600));
      if (newW < 200) setInsightCollapsed(true);
      else { setInsightCollapsed(false); setInsightW(newW); }
    }
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      document.body.style.cursor = 'col-resize';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  return (
    <ChatProvider>
      <div className={`flex h-screen w-full overflow-hidden ${dragging ? 'select-none' : ''} bg-dashboard-main`}>
        
        <Sidebar 
          width={sidebarW} 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed} 
          isDragging={dragging === 'left'}
        />

        <ResizableDivider 
          onMouseDown={() => setDragging('left')} 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          isLeft={true} 
        />

        <main className="flex-1 min-w-0 h-full overflow-hidden relative">
          <Routes>
            <Route path="/" element={
              <div className="flex h-full w-full bg-dashboard-main">
                {/* Chat Centered Focus Container */}
                <div className="flex-1 flex justify-center pt-5 pb-0 px-4 overflow-hidden h-full">
                  <div 
                    className="w-full max-w-4xl h-full rounded-t-2xl shadow-2xl relative overflow-hidden flex flex-col transition-all duration-300 bg-dashboard-chat"
                    style={{
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      borderBottom: 'none',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                    }}
                  >
                    <ChatContainer />
                  </div>
                </div>

                <ResizableDivider 
                  onMouseDown={() => setDragging('right')} 
                  collapsed={insightCollapsed} 
                  onToggle={() => setInsightCollapsed(!insightCollapsed)} 
                  isLeft={false} 
                />
                
                <InsightPanel 
                  width={insightW} 
                  collapsed={insightCollapsed} 
                  isDragging={dragging === 'right'}
                />
              </div>
            } />

            <Route path="/dashboard" element={<ControlCenter />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </ChatProvider>
  );
};

export default Dashboard;
