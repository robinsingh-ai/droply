import React, { createContext, useState, useEffect } from 'react';

export const themes = {
  light: {
    name: 'light',
    colors: {
      // Background colors
      background: '#f7f9fc',
      cardBackground: '#ffffff',
      secondaryBackground: '#f0f5f2',
      
      // Text colors
      text: '#1a202c',
      secondaryText: '#4a5568',
      mutedText: '#718096',
      
      // UI elements
      border: '#e2e8f0',
      divider: '#edf2f7',
      
      // Brand colors - blue theme
      primary: '#3A97D6',
      primaryLight: 'rgba(58,151,214,0.2)',
      primaryDark: '#2C7AB0',
      accent: '#0EA5E9',
      
      // Gradients
      primaryGradient: 'linear-gradient(to right, #3A97D6, #5AAFEA)',
      accentGradient: 'linear-gradient(to right, #3A97D6, #68B6ED)',
      darkGradient: 'linear-gradient(45deg, #f0f5f2, #ffffff)',
    }
  },
  dark: {
    name: 'dark',
    colors: {
      // Background colors
      background: '#111827',
      cardBackground: '#1F2937',
      secondaryBackground: '#141e1a',
      
      // Text colors
      text: '#f3f4f6',
      secondaryText: '#e5e7eb',
      mutedText: '#9CA3AF',
      
      // UI elements
      border: '#374151',
      divider: '#374151',
      
      // Brand colors - blue theme
      primary: '#3A97D6',
      primaryLight: 'rgba(58,151,214,0.15)',
      primaryDark: '#2C7AB0',
      accent: '#3B82F6',
      
      // Gradients
      primaryGradient: 'linear-gradient(to right, #3A97D6, #5AAFEA)',
      accentGradient: 'linear-gradient(to right, #3A97D6, #68B6ED)',
      darkGradient: 'linear-gradient(45deg, #111827, #1F2937)',
    }
  }
};

export const ThemeContext = createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.dark);
  
  // Check if user has a saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme === 'light' ? themes.light : themes.dark);
    } else {
      // Check if user prefers light mode
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDarkMode ? themes.dark : themes.light);
    }
  }, []);
  
  // Apply theme to body
  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.background;
    document.body.style.color = theme.colors.text;
    
    // Save theme preference
    localStorage.setItem('theme', theme.name);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(theme.name === 'light' ? themes.dark : themes.light);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext); 