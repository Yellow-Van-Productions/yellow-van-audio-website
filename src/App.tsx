import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services, { ServiceItem } from './components/Services';
import About from './components/About';
import Footer from './components/Footer';
import './App.css';

const App: React.FC = () => {
  // TODO: Replace these with your actual content
  const services: ServiceItem[] = [
    {
      id: 1,
      imageSrc: 'public/images/VRAudio.png',
      title: 'Game and VR Audio Development',
      description: 'End-to-end audio systems for games and immersive VR, from engine integration to shipped titles. Deep experience with Wwise, custom Wwise plug-ins, and bespoke pipelines for performance-critical environments. Battle-tested on AAA productions and cutting-edge XR hardware.',
    },
    {
      id: 2,
      imageSrc: 'public/images/AudioAppsAbstract.png',
      title: 'JUCE App Development',
      description: 'Design and development of polished JUCE applications and audio plug-ins. From DSP architecture to UI, cross-platform builds, testing, and deployment. Production-ready codebases built for longevity and maintainability.',
    },
    {
      id: 3,
      imageSrc: 'public/images/AbstractWaves2.png',
      title: 'Microphone and Speaker Enhancement',
      description: 'Advanced signal processing to improve capture and playback quality on real hardware. Noise reduction, spatial processing, loudness, clarity, and device-level optimisation. Proven experience across consumer, professional, and embedded audio systems.',
    },
    {
      id: 4,
      imageSrc: 'public/images/AbstractWaves1.png',
      title: 'Custom Cross-Platform DSP',
      description: 'High-performance DSP tailored to your product, platform, and constraints. Implemented in C++, C#, or Python, targeting desktop, mobile, embedded, or cloud. Clean, portable designs with a focus on real-time reliability and scalability.',
    },
    {
      id: 5,
      imageSrc: 'public/images/JellyfishScreenshot.png',
      title: 'Audio SaaS Products in the Cloud',
      description: 'Scalable audio-driven SaaS platforms built end-to-end in the cloud. AWS-based back-ends with modern front-ends in React or Angular. From real-time processing pipelines to robust APIs, deployment, and monitoring.',
    },
  ];

  return (
    <div className="app">
      <Header title="Yellow Van Audio" />
      
      <Hero
      imageSrc="public/images/MixingConsole.png"
        title="Bespoke Audio Software Development"
        subtitle="High-performance audio systems for games, XR, hardware, and cloud platforms — from DSP to full-stack delivery."
      />
      
      <Services services={services} />
      
      <About
        profileImageSrc="public/images/ProfileImage.png"
        logoImageSrc="public/images/YellowVanLogo.webp"
        linkedInUrl="https://www.linkedin.com/in/jelle-van-mourik-phd-b7069868/"
        bioText={`I am an audio software developer with a PhD in computational acoustics, specialising in real-time sound and music systems across games, XR, hardware, and cloud platforms. My work sits at the intersection of DSP, systems programming, and full-stack development, with a strong focus on reliability and performance. 
          
          I have contributed to AAA games, commercial XR headsets, and large-scale audio SaaS products, working across Windows, PlayStation, XBox, Mobile, Linux, and embedded environments. I value clean architecture, long-term maintainability, and close collaboration with both technical and creative teams.`}
      />
      
      <Footer copyrightText={`© ${new Date().getFullYear()} Yellow Van Productions S.L.`} />
    </div>
  );
};

export default App;
