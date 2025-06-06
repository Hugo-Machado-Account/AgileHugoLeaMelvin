// src/contexts/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { baseTheme } from "../theme/baseTheme";

// Create the context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Default color from baseTheme
  const defaultColor = baseTheme.palette.primary.main;

  // Get saved theme color from localStorage or use default
  const [primaryColor, setPrimaryColor] = useState(() => {
    const savedColor = localStorage.getItem("preferredColor");
    return savedColor || defaultColor;
  });

  // Update theme when primaryColor changes
  const theme = React.useMemo(() => {
    return createTheme({
      ...baseTheme,
      palette: {
        ...baseTheme.palette,
        primary: {
          main: primaryColor,
          light: baseTheme.palette.primary.light,
          dark: baseTheme.palette.primary.dark,
          contrastText: baseTheme.palette.primary.contrastText,
        },
      },
    });
  }, [primaryColor]);

  // Function to change the primary color
  const changeThemeColor = (newColor) => {
    setPrimaryColor(newColor);
    localStorage.setItem("preferredColor", newColor);
  };

  return (
    <ThemeContext.Provider value={{ primaryColor, changeThemeColor }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
