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
  title: 'LiveWeatherAI 🌤️ | Created by Khairi Bouzakher',
  description:
    'LiveWeatherAI — Real-time weather intelligence created by Khairi Bouzakher. Displays current temperature, 24-hour hourly forecast, 7-day outlook, air quality index (AQI), wind compass, humidity, UV index, interactive maps, community comments, and ambient weather particle effects.',
  keywords: [
    'weather app',
    'live weather',
    'live temperature',
    'city weather search',
    'open-meteo api',
    'air quality index',
    'hourly forecast',
    '7-day weather outlook',
    'AI weather',
    'LiveWeatherAI',
    'Khairi Bouzakher',
  ],
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
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
