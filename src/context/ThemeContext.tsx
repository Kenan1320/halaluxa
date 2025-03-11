
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeType = 'light' | 'dark' | 'black';

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light', // Changed default to light
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('light'); // Changed default to light

  // Initialize theme on mount
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || savedTheme === 'light' || savedTheme === 'black') {
      setTheme(savedTheme as ThemeType);
    } else {
      // Default to light theme if no preference saved
      setTheme('light');
    }
  }, []);

  // Update DOM when theme changes
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Remove all theme classes first
    document.documentElement.classList.remove('dark', 'black');
    document.documentElement.removeAttribute('data-theme');
    
    // Add appropriate class based on theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'black') {
      document.documentElement.classList.add('black');
      document.documentElement.setAttribute('data-theme', 'black');
    }
    // Light theme doesn't need additional classes
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
