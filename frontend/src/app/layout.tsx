import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.scss';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Track your expenses with ease',
};

/**
 * @brief Root layout component for the application
 * @description Provides the base HTML structure with font configuration and providers
 * @param {Object} props - Component props containing children
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} HTML document structure with configured fonts and providers
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
