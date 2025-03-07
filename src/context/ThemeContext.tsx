
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  systemTheme: Theme | null;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
  systemTheme: null,
};

const ThemeContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "haluna-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [systemTheme, setSystemTheme] = useState<Theme | null>(null);

  // Handle theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem(storageKey, theme);

    // Apply theme-specific CSS variables if needed
    if (theme === "dark") {
      document.body.classList.add("dark-theme-active");
    } else {
      document.body.classList.remove("dark-theme-active");
    }
  }, [theme, storageKey]);

  // Detect system preference on initial load
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const newTheme = mediaQuery.matches ? "dark" : "light";
      setSystemTheme(newTheme);
    };

    // Initial check
    handleChange();

    // Listen for changes
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Set the theme based on user preference on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemTheme) {
      setTheme(systemTheme);
    }
  }, [systemTheme, storageKey]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    // Show toast when theme changes
    toast(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`, {
      description: `You've switched to ${newTheme} mode.`,
      position: "bottom-center",
      duration: 2000,
    });
  };

  const value = {
    theme,
    setTheme: (theme: Theme) => setTheme(theme),
    toggleTheme,
    systemTheme,
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
