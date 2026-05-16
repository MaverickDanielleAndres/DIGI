import React, { createContext, useContext, useMemo } from 'react';
import { useEventStore } from '@/store/event.store';
import { colors } from '@/theme';

type ThemePalette = Record<keyof typeof colors, string>;

const themes: Record<string, Partial<ThemePalette>> = {
  y2k: {
    void: '#ff00ff', // hot pink
    cream: '#00ffff', // cyan
    charcoal: '#000080', // navy
    amber: '#ffff00', // yellow
    parchment: '#ffffff',
  },
  retro: {
    void: '#2d251d',
    cream: '#f4ecd8',
    charcoal: '#4a3f35',
    amber: '#e69023',
    parchment: '#d4c4b7',
  },
  light: {
    void: '#ffffff',
    cream: '#1a1a1a',
    charcoal: '#f0f0f0',
    amber: '#ff6b6b',
    parchment: '#666666',
  }
};

const ThemeContext = createContext<ThemePalette>(colors);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const currentSettings = useEventStore(s => s.currentSettings);
  
  const activeTheme = useMemo(() => {
    const themeId = currentSettings?.event_theme_id;
    if (themeId && themes[themeId]) {
      return { ...colors, ...themes[themeId] };
    }
    return colors; // default dark theme
  }, [currentSettings?.event_theme_id]);

  return (
    <ThemeContext.Provider value={activeTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
