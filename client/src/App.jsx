import React from 'react';
import Sidebar from './components/Sidebar';
import ChatContainer from './components/ChatContainer';
import InsightPanel from './components/InsightPanel';

function App() {
  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans antialiased">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
        <ChatContainer />
      </main>

      {/* Right AI Insights Panel */}
      <InsightPanel />
    </div>
  );
}

export default App;
