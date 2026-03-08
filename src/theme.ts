import { createTheme } from '@mui/material/styles';

// Create a custom theme matching the professional white-on-black design
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF',
      contrastText: '#000000',
    },
    secondary: {
      main: '#E0E0E0',
      contrastText: '#1A1A1A',
    },
    background: {
      default: '#000000',
      paper: '#0D0D0D',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
    divider: '#333333',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: 'clamp(1.75rem, 4vw, 3rem)',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 600,
      fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
      lineHeight: 1.2,
    },
    body1: {
      fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
      lineHeight: 1.6,
      fontWeight: 300,
    },
  },
  spacing: 8, // MUI default spacing unit (8px)
  shape: {
    borderRadius: 0, // Sharp corners as in the original design
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::-webkit-scrollbar': {
          width: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: '#0D0D0D',
        },
        '::-webkit-scrollbar-thumb': {
          background: '#333333',
          borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: '#666666',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          borderBottom: '1px solid #333333',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#0D0D0D',
          border: '1px solid #333333',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 40px rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
