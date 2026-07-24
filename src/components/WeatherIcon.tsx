'use client';

import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudHail,
  CloudLightning,
  Snowflake,
  SunMedium,
  MoonStar,
} from 'lucide-react';

interface WeatherIconProps {
  iconName: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ iconName, className = 'w-12 h-12' }) => {
  switch (iconName) {
    case 'Sun':
      return <Sun className={`${className} text-amber-400 animate-spin-slow drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]`} />;
    case 'SunMedium':
      return <SunMedium className={`${className} text-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.4)]`} />;
    case 'Moon':
      return <Moon className={`${className} text-indigo-200 drop-shadow-[0_0_15px_rgba(199,210,254,0.4)]`} />;
    case 'MoonStar':
      return <MoonStar className={`${className} text-indigo-300 drop-shadow-[0_0_12px_rgba(165,180,252,0.4)]`} />;
    case 'CloudSun':
      return <CloudSun className={`${className} text-amber-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.3)]`} />;
    case 'CloudMoon':
      return <CloudMoon className={`${className} text-indigo-300 drop-shadow-[0_0_12px_rgba(165,180,252,0.3)]`} />;
    case 'Cloud':
      return <Cloud className={`${className} text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.2)]`} />;
    case 'CloudFog':
      return <CloudFog className={`${className} text-zinc-300 drop-shadow-[0_0_10px_rgba(228,228,231,0.3)]`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`${className} text-cyan-300 animate-pulse drop-shadow-[0_0_12px_rgba(103,232,249,0.4)]`} />;
    case 'CloudRain':
      return <CloudRain className={`${className} text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]`} />;
    case 'CloudRainWind':
      return <CloudRainWind className={`${className} text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]`} />;
    case 'CloudSnow':
      return <CloudSnow className={`${className} text-sky-200 drop-shadow-[0_0_15px_rgba(186,230,253,0.6)]`} />;
    case 'CloudHail':
      return <CloudHail className={`${className} text-teal-300 drop-shadow-[0_0_12px_rgba(94,234,212,0.5)]`} />;
    case 'CloudLightning':
      return <CloudLightning className={`${className} text-purple-400 animate-bounce drop-shadow-[0_0_20px_rgba(192,132,252,0.7)]`} />;
    case 'Snowflake':
      return <Snowflake className={`${className} text-cyan-200 animate-spin-slow drop-shadow-[0_0_15px_rgba(165,243,252,0.6)]`} />;
    default:
      return <Cloud className={`${className} text-slate-300`} />;
  }
};
