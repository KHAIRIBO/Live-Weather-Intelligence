'use client';

import React from 'react';
import { FullWeatherData, TemperatureUnit } from '@/types/weather';
import { convertTemp } from '@/lib/weatherApi';
import { WeatherIcon } from './WeatherIcon';
import { MapPin, Calendar, Thermometer, ArrowUp, ArrowDown, Droplets } from 'lucide-react';

interface WeatherHeroProps {
  data: FullWeatherData;
  unit: TemperatureUnit;
}

export const WeatherHero: React.FC<WeatherHeroProps> = ({ data, unit }) => {
  const { location, current, daily, condition } = data;
  const temp = convertTemp(current.temperature, unit);
  const apparentTemp = convertTemp(current.apparentTemperature, unit);
  const todayDaily = daily[0];
  const maxTemp = todayDaily ? convertTemp(todayDaily.tempMax, unit) : temp;
  const minTemp = todayDaily ? convertTemp(todayDaily.tempMin, unit) : temp;

  // Format date
  const now = new Date();
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="relative w-full rounded-3xl overflow-hidden backdrop-blur-2xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 p-6 md:p-8 shadow-2xl transition-all duration-500 hover:border-white/30">
      {/* Background ambient lighting glow */}
      <div className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none bg-gradient-to-br ${condition.gradient}`} />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Column: Location & Date */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-sky-200 backdrop-blur-md mb-3">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold">{location.country}</span>
            {location.admin1 && <span className="text-slate-300">• {location.admin1}</span>}
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            {location.name}
          </h2>

          <div className="flex items-center gap-2 text-slate-300 text-xs md:text-sm mt-2 font-medium">
            <Calendar className="w-4 h-4 text-sky-400" />
            <span>{dateString}</span>
            <span className="text-slate-400">•</span>
            <span className="text-sky-300 font-semibold">{condition.label}</span>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs text-slate-200">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span>Feels like <strong>{apparentTemp}°{unit}</strong></span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs text-slate-200">
              <span className="flex items-center text-rose-400 font-semibold">
                <ArrowUp className="w-3 h-3" /> {maxTemp}°
              </span>
              <span className="text-slate-500">/</span>
              <span className="flex items-center text-sky-400 font-semibold">
                <ArrowDown className="w-3 h-3" /> {minTemp}°
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Giant Temperature & Icon */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center p-4">
            <WeatherIcon iconName={condition.iconName} className="w-24 h-24 md:w-32 md:h-32" />
          </div>

          <div className="flex items-start gap-1 mt-2">
            <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300 tracking-tighter drop-shadow-2xl">
              {temp}
            </span>
            <span className="text-2xl md:text-3xl font-bold text-sky-400 pt-2">
              °{unit}
            </span>
          </div>

          {current.precipitation > 0 && (
            <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-sky-300 text-xs font-semibold">
              <Droplets className="w-3.5 h-3.5 animate-bounce" />
              <span>Precipitation: {current.precipitation} mm</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
