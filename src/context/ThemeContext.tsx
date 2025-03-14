
import React, { createContext, useContext, useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

// Create a Zustand store with persistence
const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark', // Default to dark mode
      toggleMode: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
      setMode: (mode: ThemeMode) => set({ mode }),
    }),
    {
      name: 'haluna-theme',
    }
  )
);

// Create a React context for components that don't want to use Zustand directly
const ThemeContext = createContext<ThemeState | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useThemeStore();
  const [mounted, setMounted] = useState(false);
  
  // Only after the component is mounted, we can safely access localStorage
  // This prevents hydration issues with server rendering
  useEffect(() => {
    setMounted(true);
    
    // Check if user has a system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark && theme.mode === 'light') {
      theme.setMode('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme.mode);
    }
  }, [theme.mode, mounted]);

  if (!mounted) {
    // Return a skeleton or empty div during SSR or before hydration
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Fallback to direct store access if used outside provider
    return useThemeStore();
  }
  return context;
};
