import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';

import './globals.css';
import { ANDROID_PACKAGE } from '@/lib/app-download';
import { rootMetadata, SITE_URL } from '@/lib/seo';

/** Warm editorial serif (headlines) + geometric sans (UI/body) — mocha brand theme */
const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  adjustFontFallback: true,
  preload: true,
});

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  adjustFontFallback: true,
  preload: true,
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${manrope.variable} ${fraunces.variable} h-full`}>
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
