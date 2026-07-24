'use client';

import React from 'react';
import { CurrentWeatherData, AirQualityData, DailyForecastItem, TemperatureUnit } from '@/types/weather';
import { convertTemp } from '@/lib/weatherApi';
import { MetricType } from './MetricDetailModal';
import {
  Wind,
  Droplets,
  Sun,
  Activity,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  Navigation,
  ChevronRight,
} from 'lucide-react';

interface MetricsGridProps {
  current: CurrentWeatherData;
  airQuality: AirQualityData | null;
  todayDaily?: DailyForecastItem;
  unit: TemperatureUnit;
  onSelectMetric: (type: MetricType, data: any) => void;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  current,
  airQuality,
  todayDaily,
  unit,
  onSelectMetric,
}) => {
  const dewPointTemp = convertTemp(current.dewPoint, unit);

  const getUvInfo = (uv: number) => {
    if (uv <= 2) return { label: 'Low 🟢', color: 'text-emerald-400', pct: (uv / 11) * 100 };
    if (uv <= 5) return { label: 'Moderate 🟡', color: 'text-yellow-400', pct: (uv / 11) * 100 };
    if (uv <= 7) return { label: 'High 🟠', color: 'text-orange-400', pct: (uv / 11) * 100 };
    if (uv <= 10) return { label: 'Very High 🔴', color: 'text-rose-400', pct: (uv / 11) * 100 };
    return { label: 'Extreme 🟣', color: 'text-purple-400', pct: 100 };
  };

  const uvInfo = getUvInfo(current.uvIndex);

  const formatSunTime = (timeStr?: string) => {
    if (!timeStr) return '--:--';
    const d = new Date(timeStr);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {/* 1. Wind & Gust Compass Widget */}
      <div
        onClick={() =>
          onSelectMetric('wind', {
            speed: current.windSpeed,
            gust: current.windGusts,
            direction: current.windDirection,
          })
        }
        className="rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/15 p-5 shadow-xl flex flex-col justify-between hover:bg-white/15 hover:border-sky-400/40 hover:scale-[1.02] cursor-pointer transition-all duration-300 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider uppercase text-slate-300 flex items-center gap-1.5 group-hover:text-sky-300">
            <Wind className="w-4 h-4 text-sky-400" /> Wind & Gusts
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 group-hover:text-sky-300">
            Details <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="flex items-center justify-between my-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">{current.windSpeed}</span>
              <span className="text-xs font-semibold text-sky-300">km/h</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Gusts up to <span className="text-slate-200 font-semibold">{current.windGusts} km/h</span>
            </p>
          </div>

          <div className="relative w-16 h-16 rounded-full border-2 border-white/15 flex items-center justify-center bg-slate-900/50 shadow-inner group-hover:border-sky-400/50">
            <span className="absolute top-1 text-[9px] font-bold text-slate-400">N</span>
            <span className="absolute bottom-1 text-[9px] font-bold text-slate-400">S</span>
            <span className="absolute left-1 text-[9px] font-bold text-slate-400">W</span>
            <span className="absolute right-1 text-[9px] font-bold text-slate-400">E</span>
            <Navigation
              className="w-6 h-6 text-sky-400 fill-sky-400/30 transition-transform duration-700"
              style={{ transform: `rotate(${current.windDirection}deg)` }}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-400 bg-white/5 p-2 rounded-xl border border-white/5 flex items-center justify-between">
          <span>Direction: <strong className="text-white">{current.windDirection}°</strong></span>
          <span className="text-[10px] text-sky-400 font-semibold">Click for scale</span>
        </div>
      </div>

      {/* 2. Humidity & Dew Point Widget */}
      <div
        onClick={() =>
          onSelectMetric('humidity', {
            humidity: current.humidity,
            dewPoint: current.dewPoint,
          })
        }
        className="rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/15 p-5 shadow-xl flex flex-col justify-between hover:bg-white/15 hover:border-cyan-400/40 hover:scale-[1.02] cursor-pointer transition-all duration-300 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider uppercase text-slate-300 flex items-center gap-1.5 group-hover:text-cyan-300">
            <Droplets className="w-4 h-4 text-cyan-400" /> Relative Humidity
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 group-hover:text-cyan-300">
            Details <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="my-4">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-black text-white">{current.humidity}%</span>
            <span className="text-xs font-semibold text-cyan-300">
              {current.humidity < 30 ? 'Dry Air' : current.humidity > 70 ? 'High Humidity' : 'Comfortable'}
            </span>
          </div>

          <div className="w-full h-3 bg-slate-900/60 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 transition-all duration-700"
              style={{ width: `${current.humidity}%` }}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-400 bg-white/5 p-2 rounded-xl border border-white/5 flex items-center justify-between">
          <span>Dew Point: <strong className="text-white">{dewPointTemp}°{unit}</strong></span>
          <span className="text-[10px] text-cyan-400 font-semibold">Click for insights</span>
        </div>
      </div>

      {/* 3. UV Index Scale Widget */}
      <div
        onClick={() =>
          onSelectMetric('uv', {
            uvIndex: current.uvIndex,
          })
        }
        className="rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/15 p-5 shadow-xl flex flex-col justify-between hover:bg-white/15 hover:border-amber-400/40 hover:scale-[1.02] cursor-pointer transition-all duration-300 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider uppercase text-slate-300 flex items-center gap-1.5 group-hover:text-amber-300">
            <Sun className="w-4 h-4 text-amber-400" /> UV Index
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 group-hover:text-amber-300">
            Details <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="my-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-white">{current.uvIndex}</span>
            <span className={`text-xs font-bold ${uvInfo.color}`}>{uvInfo.label}</span>
          </div>

          <div className="w-full h-3 bg-slate-900/60 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 via-rose-500 to-purple-600 transition-all duration-700"
              style={{ width: `${uvInfo.pct}%` }}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-400 bg-white/5 p-2 rounded-xl border border-white/5 flex items-center justify-between">
          <span>{current.uvIndex >= 6 ? 'SPF 30+ recommended' : 'Low solar hazard'}</span>
          <span className="text-[10px] text-amber-400 font-semibold">Click for tips</span>
        </div>
      </div>

      {/* 4. Air Quality Index (AQI) Widget */}
      <div
        onClick={() => onSelectMetric('aqi', airQuality)}
        className="rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/15 p-5 shadow-xl flex flex-col justify-between hover:bg-white/15 hover:border-emerald-400/40 hover:scale-[1.02] cursor-pointer transition-all duration-300 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider uppercase text-slate-300 flex items-center gap-1.5 group-hover:text-emerald-300">
            <Activity className="w-4 h-4 text-emerald-400" /> Air Quality (AQI)
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 group-hover:text-emerald-300">
            Details <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {airQuality ? (
          <>
            <div className="my-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-white">{airQuality.aqi}</span>
                <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${airQuality.colorClass}`}>
                  {airQuality.label}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="bg-white/5 p-2 rounded-xl">
                PM2.5: <strong className="text-white">{airQuality.pm25} µg/m³</strong>
              </div>
              <div className="bg-white/5 p-2 rounded-xl">
                PM10: <strong className="text-white">{airQuality.pm10} µg/m³</strong>
              </div>
            </div>
          </>
        ) : (
          <div className="py-6 text-xs text-slate-400 text-center">
            Air quality metrics loading...
          </div>
        )}
      </div>

      {/* 5. Pressure & Visibility Widget */}
      <div
        onClick={() =>
          onSelectMetric('pressure', {
            pressure: current.pressure,
            visibility: current.visibility,
          })
        }
        className="rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/15 p-5 shadow-xl flex flex-col justify-between hover:bg-white/15 hover:border-indigo-400/40 hover:scale-[1.02] cursor-pointer transition-all duration-300 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider uppercase text-slate-300 flex items-center gap-1.5 group-hover:text-indigo-300">
            <Gauge className="w-4 h-4 text-indigo-400" /> Pressure & Vision
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 group-hover:text-indigo-300">
            Details <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 my-3">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-indigo-400" /> Pressure
            </span>
            <div className="text-xl font-bold text-white mt-1">{current.pressure}</div>
            <span className="text-[10px] text-slate-400">hPa</span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
              <Eye className="w-3 h-3 text-teal-400" /> Visibility
            </span>
            <div className="text-xl font-bold text-white mt-1">{current.visibility}</div>
            <span className="text-[10px] text-slate-400">km</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 bg-white/5 p-2 rounded-xl border border-white/5 flex items-center justify-between">
          <span>Stable front</span>
          <span className="text-[10px] text-indigo-400 font-semibold">Click for stats</span>
        </div>
      </div>

      {/* 6. Sunrise & Sunset Widget */}
      <div
        onClick={() =>
          onSelectMetric('sun', {
            sunrise: todayDaily?.sunrise,
            sunset: todayDaily?.sunset,
          })
        }
        className="rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/15 p-5 shadow-xl flex flex-col justify-between hover:bg-white/15 hover:border-amber-400/40 hover:scale-[1.02] cursor-pointer transition-all duration-300 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider uppercase text-slate-300 flex items-center gap-1.5 group-hover:text-amber-300">
            <Sunrise className="w-4 h-4 text-amber-400" /> Sun Schedule
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 group-hover:text-amber-300">
            Details <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 my-3">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Sunrise className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Sunrise</span>
              <p className="text-sm font-bold text-white">{formatSunTime(todayDaily?.sunrise)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
              <Sunset className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Sunset</span>
              <p className="text-sm font-bold text-white">{formatSunTime(todayDaily?.sunset)}</p>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 bg-white/5 p-2 rounded-xl border border-white/5 flex items-center justify-between">
          <span>Daylight arc tracking</span>
          <span className="text-[10px] text-amber-400 font-semibold">Click for schedule</span>
        </div>
      </div>
    </div>
  );
};
