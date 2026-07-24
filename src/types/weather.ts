export interface LocationSearchResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string; // State / Province
  timezone?: string;
}

export interface CurrentWeatherData {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  isDay: boolean;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  dewPoint: number;
  precipitation: number;
  time: string;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentMax: number;
  apparentMin: number;
  precipitationProbabilityMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface AirQualityData {
  aqi: number; // US AQI 0-500
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  label: string;
  colorClass: string;
}

export type WeatherTheme = 'clear-day' | 'clear-night' | 'cloudy' | 'rainy' | 'snowy' | 'thunderstorm' | 'fog';

export interface WeatherConditionInfo {
  label: string;
  iconName: string;
  theme: WeatherTheme;
  gradient: string;
}

export interface FullWeatherData {
  location: LocationSearchResult;
  current: CurrentWeatherData;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality: AirQualityData | null;
  condition: WeatherConditionInfo;
}

export type TemperatureUnit = 'C' | 'F';
