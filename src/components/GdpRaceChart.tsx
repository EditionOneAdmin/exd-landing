'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

const COUNTRIES = [
  { id: 'US', name: 'United States', color: '#6366f1' },
  { id: 'CN', name: 'China', color: '#06b6d4' },
  { id: 'JP', name: 'Japan', color: '#8b5cf6' },
  { id: 'DE', name: 'Germany', color: '#818cf8' },
  { id: 'GB', name: 'United Kingdom', color: '#22d3ee' },
  { id: 'IN', name: 'India', color: '#a78bfa' },
  { id: 'FR', name: 'France', color: '#67e8f9' },
  { id: 'IT', name: 'Italy', color: '#c4b5fd' },
  { id: 'BR', name: 'Brazil', color: '#7dd3fc' },
  { id: 'CA', name: 'Canada', color: '#a5b4fc' },
];

// GDP in trillions USD (approximate)
const GDP_DATA: Record<string, Record<number, number>> = {
  US: { 2000:10.25,2001:10.58,2002:10.93,2003:11.51,2004:12.27,2005:13.04,2006:13.81,2007:14.45,2008:14.71,2009:14.45,2010:14.99,2011:15.54,2012:16.16,2013:16.69,2014:17.52,2015:18.22,2016:18.71,2017:19.52,2018:20.53,2019:21.37,2020:21.06,2021:23.32,2022:25.46,2023:27.36 },
  CN: { 2000:1.21,2001:1.34,2002:1.47,2003:1.66,2004:1.96,2005:2.29,2006:2.75,2007:3.55,2008:4.59,2009:5.10,2010:6.09,2011:7.55,2012:8.56,2013:9.61,2014:10.48,2015:11.06,2016:11.23,2017:12.31,2018:13.89,2019:14.28,2020:14.69,2021:17.73,2022:17.96,2023:17.79 },
  JP: { 2000:4.89,2001:4.30,2002:4.12,2003:4.39,2004:4.66,2005:4.57,2006:4.53,2007:4.52,2008:5.04,2009:5.23,2010:5.70,2011:6.16,2012:6.20,2013:5.16,2014:4.90,2015:4.44,2016:5.00,2017:4.93,2018:5.04,2019:5.12,2020:5.04,2021:5.01,2022:4.23,2023:4.21 },
  DE: { 2000:1.95,2001:1.95,2002:2.08,2003:2.51,2004:2.82,2005:2.86,2006:3.00,2007:3.44,2008:3.75,2009:3.42,2010:3.42,2011:3.76,2012:3.54,2013:3.75,2014:3.89,2015:3.36,2016:3.47,2017:3.68,2018:3.97,2019:3.89,2020:3.89,2021:4.26,2022:4.07,2023:4.46 },
  GB: { 2000:1.66,2001:1.64,2002:1.78,2003:2.05,2004:2.42,2005:2.54,2006:2.71,2007:3.10,2008:2.93,2009:2.41,2010:2.48,2011:2.62,2012:2.70,2013:2.79,2014:3.06,2015:2.93,2016:2.69,2017:2.67,2018:2.83,2019:2.83,2020:2.70,2021:3.12,2022:3.07,2023:3.33 },
  IN: { 2000:0.47,2001:0.49,2002:0.52,2003:0.61,2004:0.72,2005:0.83,2006:0.94,2007:1.24,2008:1.22,2009:1.34,2010:1.68,2011:1.82,2012:1.83,2013:1.86,2014:2.04,2015:2.10,2016:2.29,2017:2.65,2018:2.70,2019:2.83,2020:2.67,2021:3.18,2022:3.39,2023:3.57 },
  FR: { 2000:1.37,2001:1.38,2002:1.50,2003:1.84,2004:2.12,2005:2.20,2006:2.32,2007:2.66,2008:2.92,2009:2.69,2010:2.64,2011:2.86,2012:2.68,2013:2.81,2014:2.85,2015:2.44,2016:2.47,2017:2.59,2018:2.79,2019:2.73,2020:2.63,2021:2.96,2022:2.78,2023:3.03 },
  IT: { 2000:1.14,2001:1.16,2002:1.27,2003:1.57,2004:1.80,2005:1.85,2006:1.94,2007:2.21,2008:2.39,2009:2.19,2010:2.13,2011:2.28,2012:2.09,2013:2.14,2014:2.16,2015:1.84,2016:1.88,2017:1.96,2018:2.09,2019:2.00,2020:1.89,2021:2.11,2022:2.01,2023:2.19 },
  BR: { 2000:0.65,2001:0.56,2002:0.51,2003:0.56,2004:0.67,2005:0.89,2006:1.11,2007:1.40,2008:1.70,2009:1.67,2010:2.21,2011:2.62,2012:2.47,2013:2.47,2014:2.46,2015:1.80,2016:1.80,2017:2.06,2018:1.92,2019:1.87,2020:1.45,2021:1.65,2022:1.92,2023:2.17 },
  CA: { 2000:0.74,2001:0.74,2002:0.76,2003:0.89,2004:1.02,2005:1.17,2006:1.32,2007:1.47,2008:1.55,2009:1.37,2010:1.61,2011:1.79,2012:1.83,2013:1.85,2014:1.80,2015:1.56,2016:1.53,2017:1.65,2018:1.72,2019:1.74,2020:1.64,2021:2.00,2022:2.14,2023:2.12 },
};

const YEARS = Array.from({ length: 24 }, (_, i) => 2000 + i);
const BAR_COUNT = 10;

function interpolate(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getFrame(progress: number) {
  const yearIdx = Math.min(progress * (YEARS.length - 1), YEARS.length - 1);
  const lo = Math.floor(yearIdx);
  const hi = Math.min(lo + 1, YEARS.length - 1);
  const t = yearIdx - lo;
  const yearLo = YEARS[lo];
  const yearHi = YEARS[hi];
  const displayYear = Math.round(interpolate(yearLo, yearHi, t));

  const entries = COUNTRIES.map((c) => ({
    ...c,
    value: interpolate(GDP_DATA[c.id][yearLo], GDP_DATA[c.id][yearHi], t),
  }));

  entries.sort((a, b) => b.value - a.value);
  return { entries: entries.slice(0, BAR_COUNT), year: displayYear, maxValue: entries[0].value };
}

export default function GdpRaceChart() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const DURATION = 2000 * (YEARS.length - 1); // ~2s per year

  const animate = useCallback((ts: number) => {
    if (!startRef.current) startRef.current = ts;
    const elapsed = ts - startRef.current;
    const p = Math.min(elapsed / DURATION, 1);
    setProgress(p);
    if (p < 1) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      // Loop
      setTimeout(() => {
        startRef.current = null;
        setProgress(0);
        rafRef.current = requestAnimationFrame(animate);
      }, 2000);
    }
  }, [DURATION]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  const frame = getFrame(progress);

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 mb-8">
      {/* Year display */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs uppercase tracking-widest text-gray-500">GDP by Country</span>
        <span className="text-3xl sm:text-4xl font-bold tabular-nums gradient-text">{frame.year}</span>
      </div>

      {/* Bars */}
      <div className="space-y-1.5">
        {frame.entries.map((entry, i) => {
          const pct = (entry.value / frame.maxValue) * 100;
          return (
            <div key={entry.id} className="flex items-center gap-2 h-7 sm:h-8">
              <span className="w-8 text-right text-[11px] sm:text-xs text-gray-500 font-medium shrink-0">
                {entry.id}
              </span>
              <div className="flex-1 relative h-full">
                <div
                  className="h-full rounded-r-md transition-none"
                  style={{
                    width: `${Math.max(pct, 2)}%`,
                    background: `linear-gradient(90deg, ${entry.color}cc, ${entry.color})`,
                    boxShadow: i === 0 ? `0 0 12px ${entry.color}66` : undefined,
                  }}
                />
              </div>
              <span className="w-14 text-right text-[11px] sm:text-xs text-gray-400 tabular-nums font-medium shrink-0">
                ${entry.value.toFixed(1)}T
              </span>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-6 text-center">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
        >
          Try it live <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
