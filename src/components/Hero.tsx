import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { keyframes } from '@mui/material/styles';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface HeroProps {
  imageSrc: string;
  title: string;
  subtitle: string;
}

const Hero: React.FC<HeroProps> = ({ imageSrc, title, subtitle }) => {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        height: '100vh',
        minHeight: { xs: '500px', md: '600px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        scrollMarginTop: '80px',
      }}
    >
      {/* Background image container */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        <Box
          component="img"
          src={imageSrc}
          alt="Hero"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(5, 5, 5, 0.3) 0%, rgba(5, 5, 5, 0.6) 50%, rgba(5, 5, 5, 0.9) 100%)',
            zIndex: 1,
          }}
        />
      </Box>

      {/* Content */}
      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h1"
          component="h2"
          sx={{
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            fontWeight: 900,
            mb: 2,
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            animation: `${fadeInUp} 0.8s ease-out`,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h2"
          component="p"
          sx={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            fontWeight: 300,
            color: 'text.secondary',
            maxWidth: '700px',
            mx: 'auto',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
            lineHeight: 1.6,
            animation: `${fadeInUp} 0.8s ease-out 0.2s both`,
          }}
        >
          {subtitle}
        </Typography>
      </Container>
    </Box>
  );
};

export default Hero;
