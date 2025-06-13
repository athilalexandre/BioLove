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
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`} style={{ backgroundColor: colorPalette.background }}>
      <main className="flex-grow overflow-auto custom-scrollbar" style={{ color: colorPalette.text }}>
        {children}
      </main>
      <footer
        className="w-full py-1 px-2 bg-gradient-to-r from-primary-700 to-primary-900 text-primary-50 dark:from-neutral-800 dark:to-neutral-900 dark:text-neutral-300 transition-colors duration-300 relative overflow-hidden"
        style={{
          background: `linear-gradient(to right, ${colorPalette.primary}, ${colorPalette.primary} 70%, ${colorPalette.accent})`,
          color: colorPalette.buttonText,
        }}
      >
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-0 w-12 h-12 bg-primary-300 dark:bg-neutral-600 rounded-full opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary-400 dark:bg-neutral-700 rounded-full opacity-10"></div>

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center space-y-1 md:space-y-0 text-xs">
          {/* Branding & Copyright */}
          <div>
            <p className="text-base font-serif font-bold mb-0.5">Mamoriae</p>
            <p className="text-xs tracking-wide leading-relaxed">Construído com ❤️ para preservar suas memórias.</p>
            <p className="text-xs mt-0.5 text-primary-100 dark:text-neutral-400">&copy; {new Date().getFullYear()} Todos os direitos reservados.</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Vertical Separator (only for md and up) */}
            <div className="hidden md:block w-px bg-primary-200 dark:bg-neutral-500 h-8"></div>

            {/* Social Icons */}
            <div className="flex flex-col space-y-1 items-center">
              <a
                href="https://github.com/athilalexandre"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-primary-50 hover:text-primary-200 dark:hover:text-neutral-100 transition-colors duration-200 group"
                aria-label="GitHub - Athila Alexandre"
              >
                <GithubIcon size={12} className="text-white group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs font-semibold">Athila Alexandre</span>
              </a>
              <a
                href="https://github.com/Crawfordcorp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-primary-50 hover:text-primary-200 dark:hover:text-neutral-100 transition-colors duration-200 group"
                aria-label="GitHub - David Aleixo"
              >
                <GithubIcon size={12} className="text-white group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs font-semibold">David Aleixo</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 