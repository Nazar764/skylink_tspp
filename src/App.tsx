import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './Components/Navigation';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Tickets from './pages/Tickets';
import Luggage from './pages/Luggage';
import Support from './pages/Support';
import ChatBot from './Components/ChatBot';
import './App.css'; // Або './index.css', залежно від того, де твої глобальні стилі

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  return (
    <BrowserRouter>
      <Navigation onChatOpen={() => setIsChatOpen(true)} />
      <Routes>
        <Route path="/" element={<Home onChatOpen={() => setIsChatOpen(true)} />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/luggage" element={<Luggage />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
      <ChatBot isOpen={isChatOpen} onToggle={setIsChatOpen} />
    </BrowserRouter>
  );
};

export default App;