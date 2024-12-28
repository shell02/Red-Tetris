import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Create from '../pages/Create';
import Join from '../pages/Join';
import { SocketProvider } from './SocketContext';
import Socket from '../components/socket';

// Basic React component
function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route element={<Socket />}>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/join" element={<Join />} />
          </Route>
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
