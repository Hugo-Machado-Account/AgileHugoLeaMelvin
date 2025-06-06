// src/theme/customTheme.js
import { createTheme } from "@mui/material/styles";
import { baseTheme } from "./baseTheme";

// Default theme configuration - this will be extended by ThemeContext
const customTheme = createTheme({
  ...baseTheme,
  components: {
    ...baseTheme.components,
    MuiButton: {
      ...baseTheme.components.MuiButton,
      styleOverrides: {
        ...baseTheme.components.MuiButton.styleOverrides,
        containedPrimary: {
          background: (props) =>
            `linear-gradient(45deg, ${props.theme.palette.primary.main} 0%, ${props.theme.palette.primary.light} 100%)`,
        },
        containedSecondary: {
          background: "linear-gradient(45deg, #FF6F00 0%, #FFA000 100%)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: (props) =>
            `linear-gradient(45deg, ${props.theme.palette.primary.main} 0%, ${props.theme.palette.primary.light} 100%)`,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          ...baseTheme.components.MuiChip?.styleOverrides?.root,
          "&.MuiChip-colorPrimary": {
            background: (props) =>
              `linear-gradient(45deg, ${props.theme.palette.primary.main} 0%, ${props.theme.palette.primary.light} 100%)`,
          },
          "&.MuiChip-colorSecondary": {
            background: "linear-gradient(45deg, #FF6F00 0%, #FFA000 100%)",
          },
        },
      },
    },
  },
});

export default customTheme;
