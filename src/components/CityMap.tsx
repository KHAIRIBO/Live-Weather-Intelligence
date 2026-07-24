'use client';

import React, { useState } from 'react';
import { LocationSearchResult } from '@/types/weather';
import { MapPin, Map as MapIcon, Layers, ExternalLink, Compass } from 'lucide-react';

interface CityMapProps {
  location: LocationSearchResult;
}

export const CityMap: React.FC<CityMapProps> = ({ location }) => {
  const { name, latitude: lat, longitude: lon, country, admin1 } = location;
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

  // Compute bbox for OpenStreetMap embed
  const delta = 0.12;
  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;

  // Map embed URL
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${lat},${lon}`;

  const externalOsmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`;

  return (
    <div className="w-full rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/15 p-6 shadow-xl flex flex-col gap-4 overflow-hidden relative group">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold tracking-wider uppercase text-slate-200 flex items-center gap-2">
            <MapIcon className="w-4 h-4 text-sky-400" />
            <span>Interactive City Location Map</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-400" />
            <span>
              {name} {admin1 ? `, ${admin1}` : ''}, {country}
            </span>
          </p>
        </div>

        {/* Action badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/60 border border-white/10 text-xs font-semibold text-sky-300">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {lat.toFixed(2)}°N, {lon.toFixed(2)}°E
            </span>
          </div>

          <a
            href={externalOsmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-xs font-semibold text-sky-200 transition-all hover:scale-105"
          >
            <span>Open Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Map Frame Container */}
      <div className="relative w-full h-72 md:h-80 rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-slate-950">
        <iframe
          title={`Map of ${name}`}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={osmUrl}
          className="w-full h-full filter saturate-[1.2] contrast-[1.05] grayscale-[0.1]"
        />

        {/* Overlay Card Info */}
        <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 text-xs text-white shadow-xl flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold">{name} Weather Station</span>
        </div>
      </div>
    </div>
  );
};
