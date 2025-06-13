  'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, GithubIcon } from 'lucide-react';

export default function RootLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, toggleTheme, colorPalette } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={`min-h-screen h-screen flex flex-col overflow-x-hidden ${theme === 'dark' ? 'dark' : ''}`} style={{ backgroundColor: colorPalette.background }}>
      <main className="flex-grow overflow-y-auto flex flex-col items-center" style={{ color: colorPalette.text }}>
        <div className="w-full flex justify-between items-start">
          <h1 className="text-xl font-bold font-serif" style={{ color: colorPalette.text }}>Memoriae</h1>
          <div className="flex flex-col items-end space-y-2">
            <a
              href="https://github.com/athilalexandre"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center group text-primary-500 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-500"
              aria-label="GitHub - Athila Alexandre"
            >
              <GithubIcon size={24} className="transition-transform duration-200 group-hover:scale-110" style={{ color: colorPalette.text }}/>
              <span className="ml-2 text-sm font-semibold typing-text-hidden group-hover:typing-animation-active group-hover:blinking-cursor" style={{ color: colorPalette.text }}>Athila Alexandre</span>
            </a>
            <a
              href="https://github.com/Crawfordcorp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center group text-primary-500 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-500"
              aria-label="GitHub - David Aleixo"
            >
              <GithubIcon size={24} className="transition-transform duration-200 group-hover:scale-110" style={{ color: colorPalette.text }}/>
              <span className="ml-2 text-sm font-semibold typing-text-hidden group-hover:typing-animation-active group-hover:blinking-cursor" style={{ color: colorPalette.text }}>David Aleixo</span>
            </a>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
} 