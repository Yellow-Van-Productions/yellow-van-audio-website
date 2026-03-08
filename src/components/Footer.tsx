import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

interface FooterProps {
  copyrightText: string;
}

const Footer: React.FC<FooterProps> = ({ copyrightText }) => {
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 3, md: 4 },
        px: { xs: 2, md: 3 },
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            fontSize: { xs: '0.8rem', md: '0.875rem' },
            color: 'text.secondary',
            fontWeight: 300,
            letterSpacing: '0.02em',
          }}
        >
          {copyrightText}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
