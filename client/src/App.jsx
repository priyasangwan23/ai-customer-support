import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-full">
        <Dashboard />
      </div>
    </BrowserRouter>
  );
}

export default App;
