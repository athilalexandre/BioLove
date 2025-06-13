'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSession } from '@/lib/session'; // Import createSession
import { GithubIcon } from 'lucide-react'; // Import GithubIcon
import { useTheme } from '@/app/context/ThemeContext'; // Import useTheme

// Simple admin credentials (in a real app, these would be stored securely)
const ADMIN_EMAIL = 'athilalexandre@gmail.com';
const ADMIN_PASSWORD = 'aa123';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { colorPalette } = useTheme(); // Use the theme context

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create session on the server-side
      await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      router.push('/admin/create');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md flex flex-col justify-between h-[30rem]"> {/* Added flex-col, justify-between, and a fixed height for better layout */} 
        <h1 className="text-5xl font-limelight font-extrabold tracking-wide text-center mb-6 transition-colors duration-200" style={{ color: colorPalette.text }}>Memoriae</h1>
        <h2 className="text-xl font-bold text-center text-primary-800 pb-2 border-b border-gray-300 mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4 flex-grow">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-inputBorder rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-inputText bg-inputBg"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-inputBorder rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-inputText bg-inputBg"
              required
            />
          </div>
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Login
          </button>
        </form>
        <div className="flex flex-row items-center justify-center space-x-4 mt-6">
          <a
            href="https://github.com/athilalexandre"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center group text-primary-500 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-500 transition-colors duration-200"
            aria-label="GitHub - Athila Alexandre"
          >
            <GithubIcon size={20} className="transition-transform duration-200 group-hover:scale-110" style={{ color: colorPalette.text }}/>
            <span className="ml-1 text-sm font-brunson font-semibold typing-text-hidden max-w-full" style={{ color: colorPalette.text }}>Athila Alexandre</span>
          </a>
          <a
            href="https://github.com/Crawfordcorp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center group text-primary-500 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-500 transition-colors duration-200"
            aria-label="GitHub - David Aleixo"
          >
            <GithubIcon size={20} className="transition-transform duration-200 group-hover:scale-110" style={{ color: colorPalette.text }}/>
            <span className="ml-1 text-sm font-brunson font-semibold typing-text-hidden max-w-full" style={{ color: colorPalette.text }}>David Aleixo</span>
          </a>
        </div>
      </div>
    </div>
  );
} 