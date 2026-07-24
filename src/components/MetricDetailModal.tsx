'use client';

import React from 'react';
import { TemperatureUnit } from '@/types/weather';
import { convertTemp } from '@/lib/weatherApi';
import { WeatherIcon } from './WeatherIcon';
import { X, Wind, Droplets, Sun, Activity, Gauge, Sunrise, Sunset, Eye, Info, CheckCircle2 } from 'lucide-react';

export type MetricType = 'wind' | 'humidity' | 'uv' | 'aqi' | 'pressure' | 'sun' | 'hour' | 'day' | null;

interface MetricDetailModalProps {
  type: MetricType;
  selectedItemData?: any;
  unit: TemperatureUnit;
  onClose: () => void;
}

export const MetricDetailModal: React.FC<MetricDetailModalProps> = ({
  type,
  selectedItemData,
  unit,
  onClose,
}) => {
  if (!type) return null;

  const renderContent = () => {
    switch (type) {
      case 'wind': {
        const { speed, gust, direction } = selectedItemData || {};
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20">
              <Wind className="w-8 h-8 text-sky-400" />
              <div>
                <h4 className="text-lg font-bold text-white">Wind & Gust Dynamics</h4>
                <p className="text-xs text-slate-300">Surface wind currents at 10m height</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs text-slate-400">Wind Speed</span>
                <p className="text-xl font-bold text-white mt-1">{speed} km/h</p>
                <p className="text-[11px] text-sky-300 mt-1">
                  {speed < 12 ? 'Light Breeze 🍃' : speed < 29 ? 'Moderate Wind 🌬️' : 'Strong Gale 💨'}
                </p>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs text-slate-400">Max Gust Speed</span>
                <p className="text-xl font-bold text-white mt-1">{gust} km/h</p>
                <p className="text-[11px] text-amber-300 mt-1">Peak momentum</p>
              </div>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 text-xs text-slate-300 space-y-2">
              <h5 className="font-semibold text-sky-300 flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Beaufort Wind Scale Insight
              </h5>
              <p>
                Wind direction is currently blowing at <strong>{direction}°</strong>. Moderate breezes provide refreshing air circulation and ideal outdoor ventilation.
              </p>
            </div>
          </div>
        );
      }

      case 'humidity': {
        const { humidity, dewPoint } = selectedItemData || {};
        const dp = convertTemp(dewPoint || 0, unit);
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
              <Droplets className="w-8 h-8 text-cyan-400" />
              <div>
                <h4 className="text-lg font-bold text-white">Relative Humidity & Dew Point</h4>
                <p className="text-xs text-slate-300">Atmospheric moisture content rating</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs text-slate-400">Relative Humidity</span>
                <p className="text-xl font-bold text-white mt-1">{humidity}%</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs text-slate-400">Dew Point</span>
                <p className="text-xl font-bold text-white mt-1">{dp}°{unit}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 text-xs text-slate-300 space-y-2">
              <h5 className="font-semibold text-cyan-300 flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Moisture Comfort Index
              </h5>
              <p>
                The dew point is the temperature to which air must be cooled to become saturated with water vapor. Dew point of <strong>{dp}°{unit}</strong> feels comfortable for most individuals.
              </p>
            </div>
          </div>
        );
      }

      case 'uv': {
        const { uvIndex } = selectedItemData || {};
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <Sun className="w-8 h-8 text-amber-400" />
              <div>
                <h4 className="text-lg font-bold text-white">Ultraviolet (UV) Radiation Scale</h4>
                <p className="text-xs text-slate-300">Solar protection advisory</p>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
              <span className="text-xs text-slate-400">Current UV Rating</span>
              <p className="text-4xl font-black text-amber-400 mt-1">{uvIndex} / 11+</p>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 text-xs text-slate-300 space-y-2">
              <h5 className="font-semibold text-amber-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Sun Protection Recommendations
              </h5>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Wear sunglasses on bright sunny days.</li>
                <li>If outside for extended periods, apply SPF 30+ broad-spectrum sunscreen.</li>
                <li>Stay hydrated during peak noon daylight hours.</li>
              </ul>
            </div>
          </div>
        );
      }

      case 'aqi': {
        const aq = selectedItemData;
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <Activity className="w-8 h-8 text-emerald-400" />
              <div>
                <h4 className="text-lg font-bold text-white">Air Quality & Pollutants</h4>
                <p className="text-xs text-slate-300">Real-time US Environmental AQI</p>
              </div>
            </div>

            {aq && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-slate-400">PM2.5 (Fine Particulate)</span>
                  <p className="text-base font-bold text-white mt-0.5">{aq.pm25} µg/m³</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-slate-400">PM10 (Coarse Particulate)</span>
                  <p className="text-base font-bold text-white mt-0.5">{aq.pm10} µg/m³</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-slate-400">NO2 (Nitrogen Dioxide)</span>
                  <p className="text-base font-bold text-white mt-0.5">{aq.no2} µg/m³</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-slate-400">O3 (Ground Ozone)</span>
                  <p className="text-base font-bold text-white mt-0.5">{aq.o3} µg/m³</p>
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'pressure': {
        const { pressure, visibility } = selectedItemData || {};
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <Gauge className="w-8 h-8 text-indigo-400" />
              <div>
                <h4 className="text-lg font-bold text-white">Barometric Pressure & Visibility</h4>
                <p className="text-xs text-slate-300">Atmospheric weight & horizon clarity</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs text-slate-400">Surface Pressure</span>
                <p className="text-xl font-bold text-white mt-1">{pressure} hPa</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs text-slate-400">Visibility Distance</span>
                <p className="text-xl font-bold text-white mt-1">{visibility} km</p>
              </div>
            </div>
          </div>
        );
      }

      case 'sun': {
        const { sunrise, sunset } = selectedItemData || {};
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <Sunrise className="w-8 h-8 text-amber-400" />
              <div>
                <h4 className="text-lg font-bold text-white">Solar Daylight Schedule</h4>
                <p className="text-xs text-slate-300">Astronomical sunrise & sunset tracking</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                <Sunrise className="w-6 h-6 text-amber-400" />
                <div>
                  <span className="text-xs text-slate-400">Sunrise</span>
                  <p className="text-base font-bold text-white">{sunrise || '06:15 AM'}</p>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                <Sunset className="w-6 h-6 text-indigo-400" />
                <div>
                  <span className="text-xs text-slate-400">Sunset</span>
                  <p className="text-base font-bold text-white">{sunset || '07:45 PM'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'hour': {
        const item = selectedItemData;
        if (!item) return null;
        const temp = convertTemp(item.temperature, unit);
        const apparent = convertTemp(item.apparentTemperature, unit);
        const dateObj = new Date(item.time);
        const timeFormatted = dateObj.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20">
              <div>
                <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Hourly Snapshot</span>
                <h4 className="text-xl font-bold text-white mt-0.5">{timeFormatted}</h4>
              </div>
              <WeatherIcon iconName={selectedItemData.iconName || 'Sun'} className="w-12 h-12" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs text-slate-400">Temperature</span>
                <p className="text-2xl font-black text-white mt-1">{temp}°{unit}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs text-slate-400">Feels Like</span>
                <p className="text-2xl font-black text-amber-300 mt-1">{apparent}°{unit}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-center">
                <span className="text-slate-400">Rain Chance</span>
                <p className="font-bold text-cyan-300 mt-1">{item.precipitationProbability}%</p>
              </div>
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-center">
                <span className="text-slate-400">Humidity</span>
                <p className="font-bold text-white mt-1">{item.humidity}%</p>
              </div>
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-center">
                <span className="text-slate-400">Wind Speed</span>
                <p className="font-bold text-sky-300 mt-1">{item.windSpeed} km/h</p>
              </div>
            </div>
          </div>
        );
      }

      case 'day': {
        const day = selectedItemData;
        if (!day) return null;
        const minTemp = convertTemp(day.tempMin, unit);
        const maxTemp = convertTemp(day.tempMax, unit);
        const dDate = new Date(day.date);
        const fullDateStr = dDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        });

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-sky-500/20 to-indigo-500/20 border border-white/15">
              <div>
                <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider">Day Outlook</span>
                <h4 className="text-xl font-bold text-white mt-0.5">{fullDateStr}</h4>
              </div>
              <WeatherIcon iconName={day.iconName || 'Sun'} className="w-12 h-12" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs text-slate-400">Max Temperature</span>
                <p className="text-2xl font-black text-rose-400 mt-1">{maxTemp}°{unit}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs text-slate-400">Min Temperature</span>
                <p className="text-2xl font-black text-sky-400 mt-1">{minTemp}°{unit}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400">Rain Probability</span>
                <p className="text-base font-bold text-cyan-300 mt-1">{day.precipitationProbabilityMax}%</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400">Peak UV Index</span>
                <p className="text-base font-bold text-amber-300 mt-1">{day.uvIndexMax} / 11</p>
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900/90 border border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {renderContent()}

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg transition-all active:scale-95"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
