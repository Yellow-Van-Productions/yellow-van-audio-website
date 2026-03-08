import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { keyframes } from '@mui/material/styles';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters
          sx={{
            py: { xs: 1, sm: 2 },
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 600,
              letterSpacing: '0.01em',
              animation: `${fadeIn} 0.8s ease-in`,
            }}
          >
            {title}
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
