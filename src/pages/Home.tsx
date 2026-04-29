import React from 'react';
import Hero from '../Components/Hero';
import About from '../Components/About';
import Footer from '../Components/Footer';
import Features from '../Components/Features';

interface HomeProps {
  onChatOpen: () => void;
}

const Home: React.FC<HomeProps> = ({ onChatOpen }) => {
  return (
    <div className="app-wrapper">
      <Hero />
      <Features />
      <About onChatOpen={onChatOpen} />
      <Footer />
    </div>
  );
};

export default Home;
