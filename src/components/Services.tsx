import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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
  const theme = useTheme();
  
  // Responsive items per view
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const itemsPerView = isMobile ? 1 : isTablet ? 2 : 3;

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
    timeoutRef.current = window.setTimeout(() => {
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
    } else if (currentIndex < services.length) {
      setCurrentIndex(services.length + currentIndex);
    }
  };

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 3 },
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h2"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 8 },
          }}
        >
          Services
        </Typography>
        
        {/* Carousel wrapper */}
        <Box
          sx={{
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
            py: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
              willChange: 'transform',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedServices.map((service, index) => (
              <Box
                key={`${service.id}-${index}`}
                sx={{
                  flex: `0 0 ${100 / itemsPerView}%`,
                  px: { xs: 0.5, sm: 1 },
                  boxSizing: 'border-box',
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={service.imageSrc}
                    alt={service.title}
                    sx={{
                      aspectRatio: '3/2',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                    <Typography
                      variant="h3"
                      component="h3"
                      sx={{
                        mb: 1,
                        color: 'primary.main',
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* Carousel dots */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mt: { xs: 4, md: 6 },
          }}
        >
          {services.map((_, index) => (
            <IconButton
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(services.length + index);
              }}
              aria-label={`Go to slide ${index + 1}`}
              sx={{
                width: 12,
                height: 12,
                p: 0,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: currentIndex % services.length === index ? 'primary.main' : 'divider',
                bgcolor: currentIndex % services.length === index ? 'primary.main' : 'transparent',
                transform: currentIndex % services.length === index ? 'scale(1.3)' : 'scale(1)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'scale(1.2)',
                },
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Services;
