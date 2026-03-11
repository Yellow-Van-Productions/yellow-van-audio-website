import { createTheme } from '@mui/material/styles';

// Custom theme for AudioPlayerComponent with dark, vibrant colors
const audioPlayerTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5945D0',      // Medium blue-purple
      light: '#73B7F2',     // Light blue
      dark: '#442495',      // Dark blue-purple
      contrastText: '#E3DEE9', // Light lavender text
    },
    secondary: {
      main: '#AF249E',      // Bright magenta
      light: '#CC73CD',     // Light purple/pink
      dark: '#6F1E63',      // Dark magenta
      contrastText: '#E3DEE9',
    },
    background: {
      default: '#060412',   // Almost black
      paper: '#0C062E',     // Very dark blue-black
    },
    text: {
      primary: '#E3DEE9',   // Light lavender (primary text)
      secondary: '#73B7F2', // Light blue (secondary text)
    },
    error: {
      main: '#B54348',      // Red
      contrastText: '#E3DEE9',
    },
    info: {
      main: '#73B7F2',      // Light blue
      dark: '#3C5270',      // Blue-gray
      contrastText: '#E3DEE9',
    },
    // Custom colors for specific uses
    custom: {
      darkPurple: '#29146E',
      deepPurple: '#3F1049',
      darkBlue: '#180D53',
      navyBlue: '#223053',
      blueGray: '#3C5270',
    },
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
    h2: {
      fontWeight: 700,
      fontSize: 'clamp(1.75rem, 4vw, 3rem)',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      color: '#E3DEE9',
    },
    h3: {
      fontWeight: 600,
      fontSize: 'clamp(1.3rem, 3vw, 2rem)',
      lineHeight: 1.3,
      color: '#E3DEE9',
    },
    body1: {
      fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
      lineHeight: 1.6,
      fontWeight: 300,
      color: '#E3DEE9',
    },
    body2: {
      fontSize: 'clamp(0.85rem, 1.3vw, 1rem)',
      lineHeight: 1.5,
      color: '#73B7F2',
    },
  },
  shape: {
    borderRadius: 8, // Rounded corners for modern feel
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '8px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          boxShadow: '0 4px 12px rgba(89, 69, 208, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(89, 69, 208, 0.5)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
});

// Define modern gradients for use in components
export const audioPlayerGradients = {
  purpleBlue: 'linear-gradient(135deg, #5945D0 0%, #73B7F2 100%)',
  deepPurple: 'linear-gradient(135deg, #442495 0%, #AF249E 100%)',
  darkMystic: 'linear-gradient(135deg, #060412 0%, #29146E 50%, #180D53 100%)',
  magentaPink: 'linear-gradient(135deg, #AF249E 0%, #CC73CD 100%)',
  nightSky: 'linear-gradient(180deg, #0C062E 0%, #223053 100%)',
  cosmicPurple: 'linear-gradient(135deg, #3F1049 0%, #6F1E63 50%, #AF249E 100%)',
  electricBlue: 'linear-gradient(135deg, #180D53 0%, #5945D0 50%, #73B7F2 100%)',
  vibrantAction: 'linear-gradient(135deg, #B54348 0%, #AF249E 100%)',
  softGlow: 'linear-gradient(135deg, #29146E 0%, #5945D0 100%)',
  deepSpace: 'linear-gradient(135deg, #060412 0%, #0C062E 50%, #3F1049 100%)',
  whiteSubtle: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 100%)',
};

// Extend the Theme type to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      darkPurple: string;
      deepPurple: string;
      darkBlue: string;
      navyBlue: string;
      blueGray: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      darkPurple?: string;
      deepPurple?: string;
      darkBlue?: string;
      navyBlue?: string;
      blueGray?: string;
    };
  }
}

export default audioPlayerTheme;
