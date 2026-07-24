'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LocationSearchResult } from '@/types/weather';
import { searchLocations } from '@/lib/weatherApi';
import { Search, MapPin, X, History, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSelectCity: (city: LocationSearchResult) => void;
}

const HISTORY_KEY = 'liveweatherai_search_history';

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectCity }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<LocationSearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load search history', e);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      const results = await searchLocations(query);
      setSuggestions(results);
      setIsLoading(false);
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: LocationSearchResult) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);

    // Save to history (max 5 items, unique by name & country)
    setHistory((prev) => {
      const filtered = prev.filter(
        (item) => !(item.name === city.name && item.country === city.country)
      );
      const updated = [city, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {}
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto z-30">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search city, region, or country (e.g., Tokyo, Paris, Cairo)..."
          className="w-full pl-12 pr-10 py-3.5 bg-slate-900/60 backdrop-blur-xl border border-white/15 rounded-2xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-400/80 shadow-2xl transition-all"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="absolute right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden divide-y divide-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoading && (
            <div className="flex items-center justify-center p-4 text-slate-400 text-sm gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              <span>Searching location database...</span>
            </div>
          )}

          {!isLoading && query.trim().length >= 2 && suggestions.length === 0 && (
            <div className="p-4 text-center text-slate-400 text-sm">
              No matching locations found. Try checking the spelling.
            </div>
          )}

          {!isLoading && suggestions.length > 0 && (
            <div className="max-h-64 overflow-y-auto py-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-sky-400/80">
                Matching Cities
              </div>
              {suggestions.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleSelect(loc)}
                  className="w-full text-left px-4 py-2.5 hover:bg-sky-500/15 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-sm font-medium text-white group-hover:text-sky-200">
                        {loc.name}
                      </span>
                      {loc.admin1 && (
                        <span className="text-xs text-slate-400 ml-1.5">({loc.admin1})</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300">
                    {loc.country}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Search History */}
          {!query && history.length > 0 && (
            <div className="p-3">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 flex items-center gap-1">
                  <History className="w-3 h-3 text-sky-400" /> Recent Searches
                </span>
                <button
                  onClick={clearHistory}
                  className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Clear History
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {history.map((h, i) => (
                  <button
                    key={`${h.name}-${i}`}
                    onClick={() => handleSelect(h)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-xs text-slate-200 hover:text-white border border-white/10 transition-all hover:scale-105"
                  >
                    <MapPin className="w-3 h-3 text-sky-400" />
                    <span>{h.name}</span>
                    <span className="text-[10px] text-slate-400">({h.country})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
