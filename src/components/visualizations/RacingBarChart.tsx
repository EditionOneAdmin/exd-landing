'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface CountryData {
  code: string;
  name: string;
  value: number;
}

interface YearData {
  year: number;
  countries: CountryData[];
}

interface RacingBarChartProps {
  data?: YearData[];
  title?: string;
  subtitle?: string;
}

const COUNTRY_COLORS: Record<string, string> = {
  USA: '#6366f1',
  CHN: '#ef4444',
  JPN: '#f97316',
  DEU: '#fbbf24',
  GBR: '#22c55e',
  IND: '#14b8a6',
  FRA: '#3b82f6',
  ITA: '#8b5cf6',
  BRA: '#10b981',
  CAN: '#f43f5e',
  RUS: '#ec4899',
  KOR: '#06b6d4',
  AUS: '#a855f7',
  ESP: '#eab308',
  MEX: '#84cc16',
  IDN: '#f59e0b',
  NLD: '#6366f1',
  SAU: '#22d3ee',
  TUR: '#fb923c',
  CHE: '#c084fc',
};

const COUNTRY_FLAGS: Record<string, string> = {
  USA: '🇺🇸', CHN: '🇨🇳', JPN: '🇯🇵', DEU: '🇩🇪', GBR: '🇬🇧',
  IND: '🇮🇳', FRA: '🇫🇷', ITA: '🇮🇹', BRA: '🇧🇷', CAN: '🇨🇦',
  RUS: '🇷🇺', KOR: '🇰🇷', AUS: '🇦🇺', ESP: '🇪🇸', MEX: '🇲🇽',
  IDN: '🇮🇩', NLD: '🇳🇱', SAU: '🇸🇦', TUR: '🇹🇷', CHE: '🇨🇭',
};

export default function RacingBarChart({ 
  data,
  title = "GDP Growth: The Race of Nations",
  subtitle = "Watch economies rise and fall over 60+ years"
}: RacingBarChartProps) {
  const [yearIndex, setYearIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chartData, setChartData] = useState<YearData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load data
  useEffect(() => {
    if (data) {
      setChartData(data);
    } else {
      fetch('/exd-landing/data/gdp-racing.json')
        .then(res => res.json())
        .then(setChartData)
        .catch(console.error);
    }
  }, [data]);

  const currentYear = chartData[yearIndex];
  const maxValue = currentYear?.countries[0]?.value || 0;

  // Animation loop
  useEffect(() => {
    if (isPlaying && chartData.length > 0) {
      intervalRef.current = setInterval(() => {
        setYearIndex(prev => {
          if (prev >= chartData.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, chartData.length]);

  const handlePlayPause = useCallback(() => {
    if (yearIndex >= chartData.length - 1) {
      setYearIndex(0);
    }
    setIsPlaying(prev => !prev);
  }, [yearIndex, chartData.length]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setYearIndex(0);
  }, []);

  const handleStep = useCallback((direction: 1 | -1) => {
    setIsPlaying(false);
    setYearIndex(prev => Math.max(0, Math.min(chartData.length - 1, prev + direction)));
  }, [chartData.length]);

  const formatValue = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(0)}B`;
    return `$${(value / 1e6).toFixed(0)}M`;
  };

  if (chartData.length === 0) {
    return (
      <div className="exd-card p-8 flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--exd-accent-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--exd-text-secondary)]">Loading economic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exd-card exd-glow overflow-hidden" ref={containerRef}>
      {/* Header */}
      <div className="p-6 pb-4 border-b border-white/5">
        <h2 className="text-2xl font-bold exd-gradient-text">{title}</h2>
        <p className="text-[var(--exd-text-secondary)] mt-1">{subtitle}</p>
      </div>

      {/* Year Display */}
      <div className="px-6 pt-6">
        <motion.div 
          key={currentYear?.year}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-8xl font-bold text-center exd-gradient-text tracking-tight"
        >
          {currentYear?.year}
        </motion.div>
      </div>

      {/* Chart */}
      <div className="p-6 space-y-3">
        <AnimatePresence mode="popLayout">
          {currentYear?.countries.slice(0, 10).map((country, index) => {
            const width = (country.value / maxValue) * 100;
            const color = COUNTRY_COLORS[country.code] || '#6366f1';
            const flag = COUNTRY_FLAGS[country.code] || '🏳️';

            return (
              <motion.div
                key={country.code}
                layout
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ 
                  layout: { type: "spring", stiffness: 100, damping: 20 },
                  duration: 0.4 
                }}
                className="flex items-center gap-4"
              >
                {/* Rank */}
                <div className="w-8 text-2xl font-bold text-[var(--exd-text-muted)]">
                  {index + 1}
                </div>

                {/* Flag & Name */}
                <div className="w-36 flex items-center gap-2 shrink-0">
                  <span className="text-2xl">{flag}</span>
                  <span className="text-sm font-medium truncate">{country.name}</span>
                </div>

                {/* Bar */}
                <div className="flex-1 h-10 bg-[var(--exd-bg-tertiary)] rounded-lg overflow-hidden relative">
                  <motion.div
                    className="h-full rounded-lg relative overflow-hidden"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                  >
                    {/* Shimmer effect */}
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
                        animation: isPlaying ? 'shimmer 2s infinite' : 'none'
                      }}
                    />
                  </motion.div>
                  
                  {/* Value label */}
                  <motion.div 
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {formatValue(country.value)}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="p-6 pt-2 border-t border-white/5">
        {/* Timeline slider */}
        <div className="mb-4">
          <input
            type="range"
            min={0}
            max={chartData.length - 1}
            value={yearIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setYearIndex(parseInt(e.target.value));
            }}
            className="w-full h-2 bg-[var(--exd-bg-tertiary)] rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--exd-accent-primary)]
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:shadow-[var(--exd-accent-primary)]/30"
          />
          <div className="flex justify-between mt-2 text-xs text-[var(--exd-text-muted)]">
            <span>{chartData[0]?.year}</span>
            <span>{chartData[chartData.length - 1]?.year}</span>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleReset}
            className="p-3 rounded-full bg-[var(--exd-bg-tertiary)] hover:bg-[var(--exd-accent-primary)]/20 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleStep(-1)}
            className="p-3 rounded-full bg-[var(--exd-bg-tertiary)] hover:bg-[var(--exd-accent-primary)]/20 transition-colors"
            disabled={yearIndex === 0}
            title="Previous year"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handlePlayPause}
            className="p-4 rounded-full bg-[var(--exd-accent-primary)] hover:bg-[var(--exd-accent-secondary)] transition-colors shadow-lg shadow-[var(--exd-accent-primary)]/30"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
          <button
            onClick={() => handleStep(1)}
            className="p-3 rounded-full bg-[var(--exd-bg-tertiary)] hover:bg-[var(--exd-accent-primary)]/20 transition-colors"
            disabled={yearIndex === chartData.length - 1}
            title="Next year"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
