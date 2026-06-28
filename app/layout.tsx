import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { ToastContainer } from '@/components/shared/Toast';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'SogAfrika - Electronic Security & Technology Solutions',
    template: '%s | SogAfrika',
  },
  description: 'Premium electronic security and technology devices. CCTV cameras, fire alarms, networking equipment, biometric access systems, and surveillance solutions.',
  keywords: ['security cameras', 'CCTV', 'fire alarm', 'surveillance', 'biometric', 'networking', 'SogAfrika', 'electronic security'],
  authors: [{ name: 'SogAfrika' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'SogAfrika',
    title: 'SogAfrika - Electronic Security & Technology Solutions',
    description: 'Premium electronic security and technology devices for homes and businesses.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-dark-950 dark:bg-dark-950 antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
