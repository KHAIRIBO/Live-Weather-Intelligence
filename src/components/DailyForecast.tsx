'use client';

import React from 'react';
import { DailyForecastItem, TemperatureUnit } from '@/types/weather';
import { convertTemp, getWeatherCondition } from '@/lib/weatherApi';
import { WeatherIcon } from './WeatherIcon';
import { CalendarDays, Umbrella, ChevronRight } from 'lucide-react';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  unit: TemperatureUnit;
  onSelectDay: (item: DailyForecastItem & { iconName: string }) => void;
  selectedDate?: string;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  daily,
  unit,
  onSelectDay,
  selectedDate,
}) => {
  const weekMin = Math.min(...daily.map((d) => d.tempMin));
  const weekMax = Math.max(...daily.map((d) => d.tempMax));
  const rangeSpan = Math.max(1, weekMax - weekMin);

  return (
    <div className="w-full rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/15 p-6 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold tracking-wider uppercase text-slate-200 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-sky-400" />
          <span>7-Day Outlook</span>
          <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-medium border border-sky-500/30">
            Click day
          </span>
        </h3>
        <span className="text-xs text-slate-400">Weekly</span>
      </div>

      <div className="divide-y divide-white/10">
        {daily.map((item, index) => {
          const condition = getWeatherCondition(item.weatherCode, true);
          const minTemp = convertTemp(item.tempMin, unit);
          const maxTemp = convertTemp(item.tempMax, unit);

          const dDate = new Date(item.date);
          const dayName =
            index === 0
              ? 'Today'
              : dDate.toLocaleDateString('en-US', { weekday: 'short' });

          const leftPercent = Math.max(0, Math.min(100, ((item.tempMin - weekMin) / rangeSpan) * 100));
          const widthPercent = Math.max(10, Math.min(100 - leftPercent, ((item.tempMax - item.tempMin) / rangeSpan) * 100));

          const isSelected = selectedDate === item.date;

          return (
            <button
              key={item.date}
              onClick={() => onSelectDay({ ...item, iconName: condition.iconName })}
              className={`w-full py-3 flex items-center justify-between gap-3 text-sm px-2.5 rounded-xl transition-all cursor-pointer active:scale-98 ${
                isSelected
                  ? 'bg-sky-500/20 border border-sky-400/50 shadow-md'
                  : 'hover:bg-white/10 hover:border hover:border-white/15'
              }`}
            >
              {/* Day & Icon */}
              <div className="flex items-center gap-3 w-32 text-left">
                <span className={`font-semibold ${index === 0 ? 'text-sky-300 font-bold' : 'text-slate-200'}`}>
                  {dayName}
                </span>
                <WeatherIcon iconName={condition.iconName} className="w-6 h-6 flex-shrink-0" />
              </div>

              {/* Condition Label */}
              <span className="hidden sm:block text-xs text-slate-300 truncate w-28 text-left">
                {condition.label}
              </span>

              {/* Rain Chance */}
              <div className="flex items-center gap-1 w-12 text-xs font-medium text-cyan-300">
                {item.precipitationProbabilityMax > 0 && (
                  <>
                    <Umbrella className="w-3 h-3 text-cyan-400" />
                    <span>{item.precipitationProbabilityMax}%</span>
                  </>
                )}
              </div>

              {/* Temp Min / Spectrum / Max */}
              <div className="flex items-center gap-2 flex-1 max-w-[200px] justify-end">
                <span className="text-xs font-semibold text-slate-300 w-8 text-right">
                  {minTemp}°
                </span>

                <div className="relative flex-1 h-2 bg-slate-900/60 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-white w-8">
                  {maxTemp}°
                </span>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
