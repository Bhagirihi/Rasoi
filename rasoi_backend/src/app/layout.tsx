import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';

import './globals.css';
import { ANDROID_PACKAGE } from '@/lib/app-download';
import { rootMetadata, SITE_URL } from '@/lib/seo';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${dmSans.variable} ${cormorant.variable} h-full`}>
      <head>
        <link
          rel="alternate"
          href={`android-app://${ANDROID_PACKAGE}/${SITE_URL.replace(/^https:\/\//, '')}`}
        />
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
