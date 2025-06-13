'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, GithubIcon, LinkedinIcon, MailIcon } from 'lucide-react';

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
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <header className="w-full py-4 px-6 flex justify-between items-center bg-background border-b border-neutral-200 dark:border-neutral-700 transition-colors duration-300">
        <Link href="/" className="text-2xl font-serif font-bold text-primary-600 dark:text-primary-400">
          Mamoriae
        </Link>
        {isMounted && (
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-300"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <SunIcon size={20} className="text-yellow-500" />
            ) : (
              <MoonIcon size={20} className="text-blue-700" />
            )}
          </button>
        )}
      </header>
      <main className="flex-grow overflow-auto custom-scrollbar" style={{ backgroundColor: colorPalette.background, color: colorPalette.text }}>
        {children}
      </main>
      <footer 
        className="w-full py-8 px-6 bg-gradient-to-r from-primary-700 to-primary-900 text-primary-50 dark:from-neutral-800 dark:to-neutral-900 dark:text-neutral-300 transition-colors duration-300"
        style={{
          background: `linear-gradient(to right, ${colorPalette.primary}, ${colorPalette.primary} 70%, ${colorPalette.accent})`,
          color: colorPalette.buttonText,
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} Mamoriae. Todos os direitos reservados.</p>
            <p className="text-sm mt-1">Construído com ❤️ para preservar suas memórias.</p>
          </div>
          <div className="flex space-x-6">
            <a 
              href="https://github.com/your-github"
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary-200 dark:hover:text-neutral-100 transition-colors duration-200"
              aria-label="GitHub"
            >
              <GithubIcon size={24} />
            </a>
            <a 
              href="https://linkedin.com/in/your-linkedin"
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary-200 dark:hover:text-neutral-100 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={24} />
            </a>
            <a 
              href="mailto:your-email@example.com"
              className="hover:text-primary-200 dark:hover:text-neutral-100 transition-colors duration-200"
              aria-label="Email"
            >
              <MailIcon size={24} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
} 