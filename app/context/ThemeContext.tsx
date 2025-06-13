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
  primary: '#1A73E8',
  secondary: '#6C757D',
  accent: '#34C759',
  neutral: '#6B7280',
  background: '#F8F9FA',
  text: '#212529',
  inputBg: '#FFFFFF',
  inputBorder: '#DEE2E6',
  inputText: '#212529',
  buttonBg: '#1A73E8',
  buttonText: '#FFFFFF',
  buttonHover: '#1565C0',
  buttonFocus: '#0D47A1',
};

const defaultDarkPalette: ColorPalette = {
  primary: '#42A5F5',
  secondary: '#ADB5BD',
  accent: '#66BB6A',
  neutral: '#9CA3AF',
  background: '#1E1E1E',
  text: '#F8F9FA',
  inputBg: '#2C2C2C',
  inputBorder: '#3A3A3C',
  inputText: '#E0E0E0',
  buttonBg: '#1A73E8',
  buttonText: '#FFFFFF',
  buttonHover: '#1565C0',
  buttonFocus: '#0D47A1',
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