import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './Components/Allused_0/Navigation';
import AuthModal from './Components/Allused_0/AuthModal';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Tickets from './pages/Tickets';
import Luggage from './pages/Luggage';
import Support from './pages/Support';
import ChatBot from './Components/Home_1/ChatBot';
import { supabase } from './utils/supabase';
import type { User } from '@supabase/supabase-js';
import './App.css'; // Або './index.css', залежно від того, де твої глобальні стилі

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'signIn' | 'signUp' | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAuthMode(null);
  };

  return (
    <BrowserRouter>
      <Navigation
        user={user}
        onLoginClick={() => setAuthMode('signIn')}
        onRegisterClick={() => setAuthMode('signUp')}
        onSignOut={handleSignOut}
        onChatOpen={() => setIsChatOpen(true)}
      />
      <Routes>
        <Route path="/" element={<Home onChatOpen={() => setIsChatOpen(true)} />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/luggage" element={<Luggage />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
      <ChatBot isOpen={isChatOpen} onToggle={setIsChatOpen} />
      <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />
    </BrowserRouter>
  );
};

export default App;