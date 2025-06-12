import '@/styles/globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Memoriae',
  description: 'Personalized Digital Experiences',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        {children}
        <footer className="w-full bg-gray-800 text-white text-center p-2 text-xs mt-8 md:p-4 md:text-sm">
          <p>© {new Date().getFullYear()} Memoriae. Todos os direitos reservados. Projetado por 
            <a href="https://github.com/athilalexandre" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mx-1">Athila Alexandre</a> e 
            <a href="https://github.com/Crawfordcorp" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mx-1">David Aleixo</a>.
          </p>
        </footer>
      </body>
    </html>
  );
} 