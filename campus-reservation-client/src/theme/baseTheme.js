// src/theme/baseTheme.js
export const baseTheme = {
  palette: {
    primary: {
      main: "#1A237E", // Default indigo color
      light: "#534bae",
      dark: "#000051",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FF6F00", // Amber for warm contrast
      light: "#ffa040",
      dark: "#c43e00",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5", // Light grey for clean background
      paper: "#ffffff",
    },
    text: {
      primary: "#212121", // Dark text for good readability
      secondary: "#757575",
    },
    success: {
      main: "#388E3C",
      light: "#66BB6A",
      dark: "#2E7D32",
    },
    error: {
      main: "#D32F2F",
      light: "#FF6659",
      dark: "#9A0007",
    },
    warning: {
      main: "#F57C00",
      light: "#FFB74D",
      dark: "#EF6C00",
    },
    info: {
      main: "#1976D2",
      light: "#63A4FF",
      dark: "#004BA0",
    },
    divider: "rgba(0, 0, 0, 0.12)",
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      letterSpacing: "0.5px",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.2rem",
      letterSpacing: "0.5px",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.8rem",
      letterSpacing: "0.4px",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      letterSpacing: "0.3px",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.2rem",
      letterSpacing: "0.2px",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      letterSpacing: "0.1px",
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
      fontSize: "0.875rem",
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8, // Slightly rounded corners for modern look
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "10px 20px",
          boxShadow: "none",
          borderRadius: "8px",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            transform: "translateY(-2px)",
          },
        },
        outlinedPrimary: {
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: "8px",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
          },
          overflow: "hidden",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "20px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        },
        elevation2: {
          boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderRadius: "8px",
              transition: "border-color 0.3s ease",
            },
            "&:hover fieldset": {
              borderColor: "#1A237E",
            },
            "&.Mui-focused fieldset": {
              borderWidth: "2px",
            },
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          boxShadow: "0 0 0 2px #fff",
        },
      },
    },
  },
};
