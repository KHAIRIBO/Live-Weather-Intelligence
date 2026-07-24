'use client';

import React from 'react';
import { HourlyForecastItem, TemperatureUnit } from '@/types/weather';
import { convertTemp, getWeatherCondition } from '@/lib/weatherApi';
import { WeatherIcon } from './WeatherIcon';
import { Clock, Umbrella, Sparkles } from 'lucide-react';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  unit: TemperatureUnit;
  onSelectHour: (item: HourlyForecastItem & { iconName: string }) => void;
  selectedHourTime?: string;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  unit,
  onSelectHour,
  selectedHourTime,
}) => {
  return (
    <div className="w-full rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/15 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold tracking-wider uppercase text-slate-200 flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <span>24-Hour Forecast</span>
          <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-medium border border-sky-500/30">
            Click any hour for details
          </span>
        </h3>
        <span className="text-xs text-slate-400">Scroll →</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-sky-500/20 scrollbar-track-transparent">
        {hourly.map((item, index) => {
          const condition = getWeatherCondition(item.weatherCode, item.isDay);
          const temp = convertTemp(item.temperature, unit);
          const dateObj = new Date(item.time);
          const hourString =
            index === 0
              ? 'Now'
              : dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

          const isSelected = selectedHourTime === item.time;

          return (
            <button
              key={`${item.time}-${index}`}
              onClick={() => onSelectHour({ ...item, iconName: condition.iconName })}
              className={`flex-shrink-0 flex flex-col items-center justify-between w-20 py-3.5 px-2 rounded-2xl border transition-all duration-300 cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-sky-500/30 border-sky-400 ring-2 ring-sky-400/50 shadow-lg shadow-sky-500/20 scale-105'
                  : index === 0
                  ? 'bg-sky-500/20 border-sky-400/40 shadow-lg shadow-sky-500/10 hover:scale-105'
                  : 'bg-white/5 border-white/10 hover:bg-white/15 hover:border-white/25 hover:scale-105'
              }`}
            >
              <span className={`text-xs font-semibold ${isSelected || index === 0 ? 'text-sky-300 font-bold' : 'text-slate-300'}`}>
                {hourString}
              </span>

              <div className="my-3">
                <WeatherIcon iconName={condition.iconName} className="w-8 h-8" />
              </div>

              <span className="text-base font-bold text-white">
                {temp}°
              </span>

              {item.precipitationProbability > 0 ? (
                <div className="flex items-center gap-0.5 text-[10px] font-semibold text-cyan-300 mt-1">
                  <Umbrella className="w-3 h-3" />
                  <span>{item.precipitationProbability}%</span>
                </div>
              ) : (
                <div className="h-4 text-[10px] text-slate-500 hover:text-sky-300">view</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
