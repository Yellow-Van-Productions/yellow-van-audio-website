import React from 'react';
import './Hero.css';

interface HeroProps {
  imageSrc: string;
  title: string;
  subtitle: string;
}

const Hero: React.FC<HeroProps> = ({ imageSrc, title, subtitle }) => {
  return (
    <section className="hero">
      <div className="hero-image-container">
        <img src={imageSrc} alt="Hero" className="hero-image" />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <h2 className="hero-title animate-fade-in-up">{title}</h2>
        <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default Hero;
