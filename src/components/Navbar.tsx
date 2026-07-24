'use client';

import React from 'react';
import { TemperatureUnit, LocationSearchResult } from '@/types/weather';
import { CloudSun, Navigation, Sparkles, User } from 'lucide-react';

interface NavbarProps {
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  onSelectCity: (city: LocationSearchResult) => void;
  onUseGeolocation: () => void;
  isLocating: boolean;
}

const POPULAR_CITIES: LocationSearchResult[] = [
  { id: 1850147, name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan', country_code: 'JP' },
  { id: 5128581, name: 'New York', latitude: 40.7143, longitude: -74.006, country: 'United States', country_code: 'US' },
  { id: 2643743, name: 'London', latitude: 51.5085, longitude: -0.1257, country: 'United Kingdom', country_code: 'GB' },
  { id: 2988507, name: 'Paris', latitude: 48.8534, longitude: 2.3488, country: 'France', country_code: 'FR' },
  { id: 2147714, name: 'Sydney', latitude: -33.8678, longitude: 151.2073, country: 'Australia', country_code: 'AU' },
];

export const Navbar: React.FC<NavbarProps> = ({
  unit,
  onToggleUnit,
  onSelectCity,
  onUseGeolocation,
  isLocating,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/40 border-b border-white/10 px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Author */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-sky-500 shadow-lg shadow-sky-500/20 text-white animate-pulse">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              SkyPulse <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-medium">v2.0</span>
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>Live Weather Intelligence</span>
              <span className="text-slate-600">•</span>
              <a
                href="https://khairibouzakher.studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-300 hover:text-sky-200 transition-colors font-semibold flex items-center gap-1 hover:underline"
              >
                <User className="w-3 h-3 text-amber-400" /> By Khairi Bouzakher
              </a>
            </p>
          </div>
        </div>

        {/* Popular Cities Quick Select & Geolocation */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={onUseGeolocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-sky-200 hover:text-white text-xs font-medium border border-white/15 backdrop-blur-md transition-all active:scale-95 disabled:opacity-50"
            title="Use current device location"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Near Me'}</span>
          </button>

          <div className="h-4 w-px bg-white/15 hidden sm:block" />

          <div className="flex items-center gap-1.5 flex-wrap">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city.id}
                onClick={() => onSelectCity(city)}
                className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-all hover:scale-105"
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* Temperature Unit Switcher */}
        <div className="flex items-center bg-slate-900/60 p-1 rounded-xl border border-white/10 backdrop-blur-md shadow-inner">
          <button
            onClick={() => onToggleUnit('C')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              unit === 'C'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => onToggleUnit('F')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              unit === 'F'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
};
