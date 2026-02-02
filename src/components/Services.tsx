import React, { useState, useEffect, useRef } from 'react';
import './Services.css';

export interface ServiceItem {
  id: number;
  imageSrc: string;
  title: string;
  description: string;
}

interface ServicesProps {
  services: ServiceItem[];
}

const Services: React.FC<ServicesProps> = ({ services }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Create extended array for infinite loop effect
  const extendedServices = [...services, ...services, ...services];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, 5000);

    return () => {
      resetTimeout();
    };
  }, [currentIndex]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    // Reset to middle section when reaching the end
    if (currentIndex >= services.length * 2) {
      setCurrentIndex(services.length);
    }
  };

  return (
    <section className="services">
      <div className="services-container">
        <h2 className="services-title">Services</h2>
        <div className="carousel-wrapper">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / 5)}%)`,
              transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedServices.map((service, index) => (
              <div key={`${service.id}-${index}`} className="service-card">
                <div className="service-image-container">
                  <img
                    src={service.imageSrc}
                    alt={service.title}
                    className="service-image"
                  />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="carousel-dots">
          {services.map((_, index) => (
            <button
              key={index}
              className={`dot ${currentIndex % services.length === index ? 'active' : ''}`}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(services.length + index);
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
