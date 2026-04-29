import React, { useState } from 'react';
import Navigation from './Components/Navigation';
import Hero from './Components/Hero';
import About from './Components/About';
import Footer from './Components/Footer';
import ChatBot from './Components/ChatBot';
import Features from './Components/Features';
import './App.css'; // Або './index.css', залежно від того, де твої глобальні стилі

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  return (
    <div className="app-wrapper">
      <Navigation onChatOpen={() => setIsChatOpen(true)} />
      
      <Hero />

      <Features />
      
      {/* Передаємо функцію відкриття чату в секцію "Про нас" */}
      <About onChatOpen={() => setIsChatOpen(true)} />
      
      
      <Footer />
      
      {/* Сам чат-бот, який приймає стан і функцію для його зміни */}
      <ChatBot isOpen={isChatOpen} onToggle={setIsChatOpen} />
    </div>
  );
};

export default App;