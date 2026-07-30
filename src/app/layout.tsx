import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { HistoryProvider } from '@/contexts/HistoryContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Pause, Check, Share | ឈប់ ពិនិត្យ ចែករំលែក',
  description: 'An AI-powered verification companion helping Cambodians identify misinformation, scams, and fake news before sharing online.',
  keywords: ['misinformation', 'fake news', 'Cambodia', 'scam checker', 'fact check', 'Khmer'],
  authors: [{ name: 'Pause Check Share Team' }],
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Pause, Check, Share' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1E88E5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="km" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} antialiased bg-app min-h-screen`}>
        <SettingsProvider>
          <HistoryProvider>
            {children}
          </HistoryProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
