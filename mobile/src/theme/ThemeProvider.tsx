import React, { createContext, useContext, useEffect, useState } from 'react';
import { colors as baseColors, fonts, radius, springs } from './index';

export type AppTheme = 'noir' | 'wedding' | 'y2k';

export interface ThemeColors {
  void: string;
  charcoal: string;
  graphite: string;
  smoke: string;
  ash: string;
  parchment: string;
  cream: string;
  amber: string;
  sage: string;
  coral: string;
  filmGrain: string;
}

const THEMES: Record<AppTheme, ThemeColors> = {
  noir: baseColors,
  wedding: {
    void: '#FFFFFF',
    charcoal: '#F5F5F0',
    graphite: '#EAEAE5',
    smoke: '#D0D0CA',
    ash: '#8B8B88',
    parchment: '#5A5A58',
    cream: '#1A1A1A',
    amber: '#C5A880', // Gold
    sage: '#7C8C7C',
    coral: '#D48C8C',
    filmGrain: 'transparent', // Cleaner look
  },
  y2k: {
    void: '#FF00FF', // Magenta
    charcoal: '#00FFFF', // Cyan
    graphite: '#FFFF00', // Yellow
    smoke: '#000000',
    ash: '#555555',
    parchment: '#111111',
    cream: '#FFFFFF',
    amber: '#FF00FF',
    sage: '#00FF00',
    coral: '#FF0000',
    filmGrain: 'transparent',
  }
};

interface ThemeContextType {
  themeName: AppTheme;
  colors: ThemeColors;
  setThemeName: (name: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeName: 'noir',
  colors: THEMES.noir,
  setThemeName: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<AppTheme>('noir');

  return (
    <ThemeContext.Provider value={{ themeName, colors: THEMES[themeName], setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
