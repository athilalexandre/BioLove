'use client';

import { ThemeProvider } from '../context/ThemeContext';
import RootLayoutContent from './RootLayoutContent';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <RootLayoutContent>{children}</RootLayoutContent>
    </ThemeProvider>
  );
} 