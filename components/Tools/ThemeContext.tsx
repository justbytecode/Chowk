'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ThemeType, getTheme } from '@/lib/theme';

interface ThemeContextType {
  theme: Theme;
  themeType: ThemeType;
  setTheme: (type: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeType, setThemeType] = useState<ThemeType>('light');
  const [theme, setThemeState] = useState<Theme>(getTheme('light'));
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage only after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
    
    // Safely access localStorage only in the browser
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('excalidraw-theme') as ThemeType;
      if (saved === 'light' || saved === 'dark') {
        setThemeType(saved);
        setThemeState(getTheme(saved));
      }
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;
    
    document.documentElement.setAttribute('data-theme', themeType);
    document.body.style.backgroundColor = theme.colors.background;
  }, [themeType, theme, mounted]);

  const setTheme = (type: ThemeType) => {
    setThemeType(type);
    setThemeState(getTheme(type));
    
    // Safely save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('excalidraw-theme', type);
    }
  };

  const toggleTheme = () => {
    const newType = themeType === 'light' ? 'dark' : 'light';
    setTheme(newType);
  };

  // Prevent flash of unstyled content during SSR
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, themeType, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}