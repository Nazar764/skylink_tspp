import React from 'react';
import Hero from '../Components/Home_1/Hero';
import About from '../Components/Home_1/About';
import Footer from '../Components/Allused_0/Footer';
import Features from '../Components/Home_1/Features';

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
