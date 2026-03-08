import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

interface AboutProps {
  profileImageSrc: string;
  logoImageSrc: string;
  linkedInUrl: string;
  bioText: string;
}

const About: React.FC<AboutProps> = ({
  profileImageSrc,
  logoImageSrc,
  linkedInUrl,
  bioText,
}) => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 3 },
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="md">
        {/* Profile header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: { xs: 6, md: 8 },
          }}
        >
          <Avatar
            src={profileImageSrc}
            alt="Profile"
            sx={{
              width: { xs: 150, md: 200 },
              height: { xs: 150, md: 200 },
              border: '3px solid',
              borderColor: 'divider',
              boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 12px 48px rgba(255, 255, 255, 0.15)',
              },
            }}
          />
        </Box>
        
        {/* Content */}
        <Box sx={{ textAlign: 'center' }}>
          {/* Title with LinkedIn link */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              mb: 3,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="h2" component="h2">
              About Me
            </Typography>
            <IconButton
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              sx={{
                width: 48,
                height: 48,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'primary.main',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </IconButton>
          </Box>
          
          {/* Bio */}
          <Typography
            variant="body1"
            sx={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'text.secondary',
              lineHeight: 1.8,
              maxWidth: '800px',
              mx: 'auto',
              whiteSpace: 'pre-line',
            }}
          >
            {bioText}
          </Typography>
        </Box>
        
        {/* Logo */}
        <Box
          sx={{
            maxWidth: { xs: '400px', md: '600px' },
            width: '100%',
            mt: { xs: 6, md: 8 },
            mx: 'auto',
            opacity: 0.9,
            transition: 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            justifyContent: 'center',
            '&:hover': {
              opacity: 1,
            },
          }}
        >
          <Box
            component="img"
            src={logoImageSrc}
            alt="Logo"
            sx={{
              width: '100%',
              height: 'auto',
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default About;
