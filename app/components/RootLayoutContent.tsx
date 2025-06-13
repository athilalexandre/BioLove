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
    <div className={`min-h-screen h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`} style={{ backgroundColor: colorPalette.background }}>
      <main className="flex-grow flex flex-col justify-center items-center h-full" style={{ color: colorPalette.text }}>
        {children}
      </main>
    </div>
  );
} 