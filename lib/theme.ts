// lib/theme.ts

export type ThemeType = 'light' | 'dark';

export interface Theme {
  type: ThemeType;
  colors: {
    background: string;
    canvas: string;
    grid: string;
    text: string;
    textSecondary: string;
    border: string;
    surface: string;
    surfaceHover: string;
    primary: string;
    primaryHover: string;
    selection: string;
    selectionBorder: string;
  };
}

export const themes: Record<ThemeType, Theme> = {
  light: {
    type: 'light',
    colors: {
      background: '#ffffff',
      canvas: '#ffffff',
      grid: '#e0e0e0',
      text: '#1e1e1e',
      textSecondary: '#6b7280',
      border: '#d1d5db',
      surface: '#ffffff',
      surfaceHover: '#f3f4f6',
      primary: '#0066ff',
      primaryHover: '#0052cc',
      selection: 'rgba(0, 102, 255, 0.1)',
      selectionBorder: '#0066ff',
    },
  },
  dark: {
    type: 'dark',
    colors: {
      background: '#121212',
      canvas: '#1e1e1e',
      grid: '#2a2a2a',
      text: '#e0e0e0',
      textSecondary: '#9ca3af',
      border: '#3a3a3a',
      surface: '#2a2a2a',
      surfaceHover: '#3a3a3a',
      primary: '#4a9eff',
      primaryHover: '#6bb0ff',
      selection: 'rgba(74, 158, 255, 0.2)',
      selectionBorder: '#4a9eff',
    },
  },
};

export function getTheme(type: ThemeType): Theme {
  return themes[type];
}