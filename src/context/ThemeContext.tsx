import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
  setIsDarkMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  isDarkMode: externalIsDark,
  setIsDarkMode: externalSetIsDark,
}) => {
  const [internalIsDark, setInternalIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('euler_theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return false;
  });

  const isDarkMode = externalIsDark !== undefined ? externalIsDark : internalIsDark;
  const setIsDarkMode = externalSetIsDark !== undefined ? externalSetIsDark : setInternalIsDark;

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('euler_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;

    const applyTheme = () => {
      const root = document.documentElement;
      if (nextMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      setIsDarkMode(nextMode);
      try {
        localStorage.setItem('euler_theme', nextMode ? 'dark' : 'light');
      } catch {
        // Ignorar si el almacenamiento local está restringido
      }
    };

    // Si el navegador soporta View Transitions (Chrome 111+, Edge, Safari 18+),
    // la GPU interpola el lienzo completo a 60/120 fps sin forzar reflows ni repaints de tarjetas
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        applyTheme();
      });
    } else {
      applyTheme();
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: isDarkMode ? 'dark' : 'light',
        toggleTheme,
        isDark: isDarkMode,
        isDarkMode,
        setIsDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

