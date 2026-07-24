import {
  LocationSearchResult,
  CurrentWeatherData,
  HourlyForecastItem,
  DailyForecastItem,
  AirQualityData,
  WeatherConditionInfo,
  FullWeatherData,
  WeatherTheme,
} from '@/types/weather';

// WMO Weather Interpretation Codes (WW)
export function getWeatherCondition(code: number, isDay: boolean = true): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        iconName: isDay ? 'Sun' : 'Moon',
        theme: isDay ? 'clear-day' : 'clear-night',
        gradient: isDay
          ? 'from-amber-500/20 via-orange-500/10 to-sky-900/40'
          : 'from-indigo-950 via-purple-950/80 to-slate-950',
      };
    case 1:
      return {
        label: isDay ? 'Mainly Clear' : 'Mostly Clear',
        iconName: isDay ? 'SunMedium' : 'MoonStar',
        theme: isDay ? 'clear-day' : 'clear-night',
        gradient: isDay
          ? 'from-sky-400/20 via-blue-500/10 to-slate-900/40'
          : 'from-slate-950 via-indigo-950/90 to-slate-900',
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        theme: isDay ? 'cloudy' : 'clear-night',
        gradient: isDay
          ? 'from-blue-500/20 via-slate-500/10 to-slate-900/50'
          : 'from-slate-950 via-slate-900 to-indigo-950',
      };
    case 3:
      return {
        label: 'Overcast',
        iconName: 'Cloud',
        theme: 'cloudy',
        gradient: 'from-slate-600/30 via-zinc-700/20 to-slate-950',
      };
    case 45:
    case 48:
      return {
        label: 'Foggy & Misty',
        iconName: 'CloudFog',
        theme: 'fog',
        gradient: 'from-zinc-500/30 via-slate-600/20 to-zinc-950',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Light Drizzle',
        iconName: 'CloudDrizzle',
        theme: 'rainy',
        gradient: 'from-cyan-600/30 via-blue-700/20 to-slate-950',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        iconName: 'CloudHail',
        theme: 'snowy',
        gradient: 'from-teal-600/30 via-slate-700/20 to-slate-950',
      };
    case 61:
    case 63:
      return {
        label: 'Moderate Rain',
        iconName: 'CloudRain',
        theme: 'rainy',
        gradient: 'from-blue-600/30 via-indigo-800/20 to-slate-950',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        iconName: 'CloudRainWind',
        theme: 'rainy',
        gradient: 'from-blue-700/40 via-sky-900/30 to-slate-950',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        iconName: 'CloudHail',
        theme: 'snowy',
        gradient: 'from-cyan-700/30 via-blue-900/30 to-slate-950',
      };
    case 71:
    case 73:
      return {
        label: 'Light Snow',
        iconName: 'CloudSnow',
        theme: 'snowy',
        gradient: 'from-indigo-400/20 via-blue-300/10 to-slate-950',
      };
    case 75:
    case 77:
      return {
        label: 'Heavy Snow',
        iconName: 'Snowflake',
        theme: 'snowy',
        gradient: 'from-cyan-300/30 via-slate-400/20 to-slate-950',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        iconName: 'CloudRain',
        theme: 'rainy',
        gradient: 'from-sky-600/30 via-blue-800/20 to-slate-950',
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        iconName: 'CloudSnow',
        theme: 'snowy',
        gradient: 'from-indigo-500/30 via-slate-700/20 to-slate-950',
      };
    case 95:
      return {
        label: 'Thunderstorm',
        iconName: 'CloudLightning',
        theme: 'thunderstorm',
        gradient: 'from-purple-900/40 via-indigo-950 to-slate-950',
      };
    case 96:
    case 99:
      return {
        label: 'Thunderstorm with Hail',
        iconName: 'CloudLightning',
        theme: 'thunderstorm',
        gradient: 'from-amber-900/40 via-purple-950 to-slate-950',
      };
    default:
      return {
        label: 'Partly Cloudy',
        iconName: 'Cloud',
        theme: 'cloudy',
        gradient: 'from-blue-500/20 via-slate-600/10 to-slate-950',
      };
  }
}

export async function searchLocations(query: string): Promise<LocationSearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=8&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch location suggestions');

    const data = await res.json();
    if (!data.results) return [];

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      country_code: item.country_code || '',
      admin1: item.admin1 || '',
      timezone: item.timezone || 'UTC',
    }));
  } catch (err) {
    console.error('Search locations error:', err);
    return [];
  }
}

export async function getReverseGeocoding(lat: number, lon: number): Promise<LocationSearchResult> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(
      2
    )}&count=1&language=en&format=json`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const item = data.results[0];
        return {
          id: item.id,
          name: item.name,
          latitude: lat,
          longitude: lon,
          country: item.country || '',
          country_code: item.country_code || '',
          admin1: item.admin1 || '',
          timezone: item.timezone || 'UTC',
        };
      }
    }
  } catch (err) {
    console.warn('Reverse geocoding failed, using coordinates fallback:', err);
  }

  return {
    id: Date.now(),
    name: 'Current Location',
    latitude: lat,
    longitude: lon,
    country: 'Your Area',
    country_code: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  };
}

export function parseAirQualityLabel(aqi: number): { label: string; colorClass: string } {
  if (aqi <= 50) return { label: 'Good 🍃', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  if (aqi <= 100) return { label: 'Moderate 🟡', colorClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups 🟠', colorClass: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };
  if (aqi <= 200) return { label: 'Unhealthy 🔴', colorClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  if (aqi <= 300) return { label: 'Very Unhealthy 🟣', colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
  return { label: 'Hazardous ⚠️', colorClass: 'text-rose-600 bg-rose-950/60 border-rose-600/50' };
}

export async function fetchFullWeatherData(location: LocationSearchResult): Promise<FullWeatherData> {
  const { latitude: lat, longitude: lon } = location;

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;

  const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone`;

  const [weatherRes, aqRes] = await Promise.allSettled([fetch(weatherUrl), fetch(aqUrl)]);

  if (weatherRes.status === 'rejected' || !weatherRes.value.ok) {
    throw new Error('Could not retrieve weather data from Open-Meteo API');
  }

  const wData = await weatherRes.value.json();

  let airQuality: AirQualityData | null = null;
  if (aqRes.status === 'fulfilled' && aqRes.value.ok) {
    try {
      const aqJson = await aqRes.value.json();
      if (aqJson.current) {
        const usAqi = Math.round(aqJson.current.us_aqi || 25);
        const { label, colorClass } = parseAirQualityLabel(usAqi);
        airQuality = {
          aqi: usAqi,
          pm25: Math.round((aqJson.current.pm2_5 || 0) * 10) / 10,
          pm10: Math.round((aqJson.current.pm10 || 0) * 10) / 10,
          no2: Math.round((aqJson.current.nitrogen_dioxide || 0) * 10) / 10,
          o3: Math.round((aqJson.current.ozone || 0) * 10) / 10,
          label,
          colorClass,
        };
      }
    } catch (e) {
      console.warn('Could not parse Air Quality data:', e);
    }
  }

  const currentRaw = wData.current || {};
  const isDayBool = Boolean(currentRaw.is_day ?? 1);
  const wCode = currentRaw.weather_code ?? 0;
  const condition = getWeatherCondition(wCode, isDayBool);

  // Hourly mapping (next 24 hours)
  const hourlyRaw = wData.hourly || {};
  const hourlyTimes: string[] = hourlyRaw.time || [];
  const currentIndex = Math.max(
    0,
    hourlyTimes.findIndex((t) => new Date(t).getTime() >= Date.now() - 3600000)
  );
  
  const hourlyItems: HourlyForecastItem[] = [];
  const limit = Math.min(hourlyTimes.length, currentIndex + 24);

  for (let i = currentIndex; i < limit; i++) {
    hourlyItems.push({
      time: hourlyTimes[i],
      temperature: Math.round(hourlyRaw.temperature_2m?.[i] ?? 0),
      apparentTemperature: Math.round(hourlyRaw.apparent_temperature?.[i] ?? 0),
      precipitationProbability: Math.round(hourlyRaw.precipitation_probability?.[i] ?? 0),
      weatherCode: hourlyRaw.weather_code?.[i] ?? 0,
      humidity: Math.round(hourlyRaw.relative_humidity_2m?.[i] ?? 0),
      windSpeed: Math.round(hourlyRaw.wind_speed_10m?.[i] ?? 0),
      isDay: Boolean(hourlyRaw.is_day?.[i] ?? 1),
    });
  }

  // Daily mapping (next 7 days)
  const dailyRaw = wData.daily || {};
  const dailyDates: string[] = dailyRaw.time || [];
  const dailyItems: DailyForecastItem[] = [];

  for (let i = 0; i < Math.min(7, dailyDates.length); i++) {
    dailyItems.push({
      date: dailyDates[i],
      weatherCode: dailyRaw.weather_code?.[i] ?? 0,
      tempMax: Math.round(dailyRaw.temperature_2m_max?.[i] ?? 0),
      tempMin: Math.round(dailyRaw.temperature_2m_min?.[i] ?? 0),
      apparentMax: Math.round(dailyRaw.apparent_temperature_max?.[i] ?? 0),
      apparentMin: Math.round(dailyRaw.apparent_temperature_min?.[i] ?? 0),
      precipitationProbabilityMax: Math.round(dailyRaw.precipitation_probability_max?.[i] ?? 0),
      uvIndexMax: Math.round((dailyRaw.uv_index_max?.[i] ?? 0) * 10) / 10,
      sunrise: dailyRaw.sunrise?.[i] || '',
      sunset: dailyRaw.sunset?.[i] || '',
    });
  }

  // Current weather
  const current: CurrentWeatherData = {
    temperature: Math.round(currentRaw.temperature_2m ?? 0),
    apparentTemperature: Math.round(currentRaw.apparent_temperature ?? 0),
    weatherCode: wCode,
    isDay: isDayBool,
    humidity: Math.round(currentRaw.relative_humidity_2m ?? 0),
    windSpeed: Math.round(currentRaw.wind_speed_10m ?? 0),
    windDirection: Math.round(currentRaw.wind_direction_10m ?? 0),
    windGusts: Math.round(currentRaw.wind_gusts_10m ?? 0),
    pressure: Math.round(currentRaw.surface_pressure ?? 1013),
    uvIndex: dailyItems[0]?.uvIndexMax || 3,
    visibility: 10, // default km
    dewPoint: Math.round(hourlyRaw.dew_point_2m?.[currentIndex] ?? 0),
    precipitation: currentRaw.precipitation ?? 0,
    time: currentRaw.time || new Date().toISOString(),
  };

  return {
    location,
    current,
    hourly: hourlyItems,
    daily: dailyItems,
    airQuality,
    condition,
  };
}

// Utility conversion for temperature unit °C <-> °F
export function convertTemp(celsius: number, unit: 'C' | 'F'): number {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return celsius;
}
