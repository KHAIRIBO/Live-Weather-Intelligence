import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SkyPulse Weather 🌤️ | Created by Khairi Bouzakher',
  description:
    'Real-time weather application created by Khairi Bouzakher. Displays current temperature, 24-hour hourly forecast, 7-day outlook, air quality index (AQI), wind compass, humidity, UV index, and interactive particle weather effects.',
  keywords: [
    'weather app',
    'live temperature',
    'city weather search',
    'open-meteo api',
    'air quality index',
    'hourly forecast',
    '7-day weather outlook',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark h-full antialiased ${outfit.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans tracking-normal">
        {children}
      </body>
    </html>
  );
}
