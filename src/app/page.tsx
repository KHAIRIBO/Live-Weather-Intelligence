'use client';

import React, { useState, useEffect } from 'react';
import { LocationSearchResult, FullWeatherData, TemperatureUnit } from '@/types/weather';
import { fetchFullWeatherData, getReverseGeocoding } from '@/lib/weatherApi';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { WeatherHero } from '@/components/WeatherHero';
import { HourlyForecast } from '@/components/HourlyForecast';
import { DailyForecast } from '@/components/DailyForecast';
import { MetricsGrid } from '@/components/MetricsGrid';
import { CityMap } from '@/components/CityMap';
import { WeatherCanvas } from '@/components/WeatherCanvas';
import { MetricDetailModal, MetricType } from '@/components/MetricDetailModal';
import { CommentsSection } from '@/components/CommentsSection';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';

const DEFAULT_CITY: LocationSearchResult = {
  id: 1850147,
  name: 'Tokyo',
  latitude: 35.6762,
  longitude: 139.6503,
  country: 'Japan',
  country_code: 'JP',
  admin1: 'Tokyo',
  timezone: 'Asia/Tokyo',
};

export default function WeatherPage() {
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [currentCity, setCurrentCity] = useState<LocationSearchResult>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<FullWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Interactive Modal State
  const [activeMetricType, setActiveMetricType] = useState<MetricType>(null);
  const [activeMetricData, setActiveMetricData] = useState<any>(null);
  const [selectedHourTime, setSelectedHourTime] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const loadWeather = async (city: LocationSearchResult) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchFullWeatherData(city);
      setWeatherData(data);
      setSelectedHourTime(undefined);
      setSelectedDate(undefined);
    } catch (err: any) {
      console.error('Failed to load weather data:', err);
      setError(err?.message || 'Failed to connect to weather servers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(currentCity);
  }, [currentCity]);

  // Geolocation Handler
  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const loc = await getReverseGeocoding(latitude, longitude);
          setCurrentCity(loc);
        } catch (err) {
          console.error('Error reverse geocoding location:', err);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        alert('Could not retrieve your location. Please check location permissions.');
      },
      { timeout: 10000 }
    );
  };

  const handleSelectHour = (item: any) => {
    setSelectedHourTime(item.time);
    setActiveMetricType('hour');
    setActiveMetricData(item);
  };

  const handleSelectDay = (item: any) => {
    setSelectedDate(item.date);
    setActiveMetricType('day');
    setActiveMetricData(item);
  };

  const handleSelectMetric = (type: MetricType, data: any) => {
    setActiveMetricType(type);
    setActiveMetricData(data);
  };

  const theme = weatherData?.condition.theme || 'clear-day';

  return (
    <div
      className={`relative min-h-screen text-slate-100 font-sans selection:bg-sky-500 selection:text-white transition-colors duration-1000 bg-gradient-to-br ${
        weatherData?.condition.gradient || 'from-slate-950 via-slate-900 to-indigo-950'
      }`}
    >
      {/* Background Canvas Particles */}
      <WeatherCanvas theme={theme} />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Navbar
          unit={unit}
          onToggleUnit={setUnit}
          onSelectCity={setCurrentCity}
          onUseGeolocation={handleUseGeolocation}
          isLocating={isLocating}
        />

        {/* Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
          {/* Search Bar */}
          <SearchBar onSelectCity={setCurrentCity} />

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 my-8">
              <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
              <p className="text-sm font-medium text-slate-300 animate-pulse">
                Fetching live weather intelligence for {currentCity.name}...
              </p>
            </div>
          )}

          {/* Error Message */}
          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center py-12 px-6 bg-rose-950/40 border border-rose-500/30 backdrop-blur-2xl rounded-3xl text-center my-6 gap-4">
              <AlertCircle className="w-10 h-10 text-rose-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Weather Data Error</h3>
                <p className="text-sm text-rose-200 mt-1 max-w-md">{error}</p>
              </div>
              <button
                onClick={() => loadWeather(currentCity)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-semibold transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            </div>
          )}

          {/* Weather Content Dashboard */}
          {!isLoading && weatherData && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-500">
              {/* Hero Banner */}
              <WeatherHero data={weatherData} unit={unit} />

              {/* Forecast Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <HourlyForecast
                    hourly={weatherData.hourly}
                    unit={unit}
                    onSelectHour={handleSelectHour}
                    selectedHourTime={selectedHourTime}
                  />
                </div>
                <div className="lg:col-span-1">
                  <DailyForecast
                    daily={weatherData.daily}
                    unit={unit}
                    onSelectDay={handleSelectDay}
                    selectedDate={selectedDate}
                  />
                </div>
              </div>

              {/* Detailed Metrics Grid */}
              <MetricsGrid
                current={weatherData.current}
                airQuality={weatherData.airQuality}
                todayDaily={weatherData.daily[0]}
                unit={unit}
                onSelectMetric={handleSelectMetric}
              />

              {/* City Map Component */}
              <CityMap location={weatherData.location} />

              {/* Community Comments */}
              <CommentsSection
                currentCity={weatherData.location.name}
                currentCountry={weatherData.location.country || null}
              />
            </div>
          )}
        </main>

        {/* Modal for Click Details */}
        <MetricDetailModal
          type={activeMetricType}
          selectedItemData={activeMetricData}
          unit={unit}
          onClose={() => setActiveMetricType(null)}
        />

        {/* Footer */}
        <footer className="w-full border-t border-white/10 py-6 px-4 text-center text-xs text-slate-400 backdrop-blur-md bg-slate-950/40">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 font-medium text-slate-300">
              <span>LiveWeatherAI 🌤️</span>
              <span>•</span>
              <a
                href="https://khairibouzakher.studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-300 hover:text-sky-200 transition-colors font-bold hover:underline"
              >
                Created by Khairi Bouzakher
              </a>
            </p>
            <p className="text-slate-400">
              Powered by Open-Meteo Free Weather & Air Quality API.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
