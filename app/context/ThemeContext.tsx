'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  background: string;
  text: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  buttonBg: string;
  buttonText: string;
  buttonHover: string;
  buttonFocus: string;
}

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colorPalette: ColorPalette;
  updateColorPalette: (newColors: Partial<ColorPalette>) => void;
}

const defaultLightPalette: ColorPalette = {
  primary: '#6B46C1',
  secondary: '#F0EEF5',
  accent: '#8A2BE2',
  neutral: '#D8D3E0',
  background: '#F8F9FA',
  text: '#2D3748',
  inputBg: '#F7FAFC',
  inputBorder: '#E2E8F0',
  inputText: '#2D3748',
  buttonBg: '#6B46C1',
  buttonText: '#FFFFFF',
  buttonHover: '#553C9A',
  buttonFocus: '#44337A',
};

const defaultDarkPalette: ColorPalette = {
  primary: '#9F7AEA',
  secondary: '#2D3748',
  accent: '#BF00FF',
  neutral: '#4A5568',
  background: '#1A202C',
  text: '#E2E8F0',
  inputBg: '#2D3748',
  inputBorder: '#4A5568',
  inputText: '#E2E8F0',
  buttonBg: '#9F7AEA',
  buttonText: '#1A202C',
  buttonHover: '#805AD5',
  buttonFocus: '#6B46C1',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [colorPalette, setColorPalette] = useState<ColorPalette>(defaultLightPalette);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    const savedPalette = localStorage.getItem('colorPalette');
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');

    if (savedPalette) {
      setColorPalette(JSON.parse(savedPalette));
    } else {
      setColorPalette(savedTheme === 'dark' ? defaultDarkPalette : defaultLightPalette);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Apply CSS variables
    for (const key in colorPalette) {
      if (colorPalette.hasOwnProperty(key)) {
        document.documentElement.style.setProperty(`--color-${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`, colorPalette[key as keyof ColorPalette]);
      }
    }

  }, [theme, colorPalette]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    setColorPalette((prevPalette) => 
      prevPalette === defaultLightPalette ? defaultDarkPalette : defaultLightPalette
    );
  }, [defaultLightPalette, defaultDarkPalette]);

  const updateColorPalette = useCallback((newColors: Partial<ColorPalette>) => {
    setColorPalette((prevPalette) => {
      const updatedPalette = { ...prevPalette, ...newColors };
      localStorage.setItem('colorPalette', JSON.stringify(updatedPalette));
      return updatedPalette;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colorPalette, updateColorPalette }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 