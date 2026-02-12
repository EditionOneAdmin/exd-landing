'use client';
import StoryNavigation from '@/components/StoryNavigation';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// ─── Data ────────────────────────────────────────────────────────────

const HOUSING_PRICE_INDEX = {
  years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
  countries: [
    { name: 'Germany', code: 'DE', color: '#f59e0b', values: [100, 103, 106, 109, 112, 117, 124, 132, 140, 148, 158, 172, 185, 178, 175] },
    { name: 'United States', code: 'US', color: '#6366f1', values: [100, 97, 99, 107, 113, 119, 125, 132, 139, 144, 153, 178, 198, 203, 210] },
    { name: 'United Kingdom', code: 'UK', color: '#ec4899', values: [100, 99, 100, 103, 112, 119, 126, 132, 136, 138, 141, 155, 168, 163, 160] },
    { name: 'Japan', code: 'JP', color: '#14b8a6', values: [100, 99, 99, 100, 101, 102, 103, 105, 107, 108, 109, 113, 120, 126, 132] },
    { name: 'Australia', code: 'AU', color: '#8b5cf6', values: [100, 99, 101, 109, 117, 126, 134, 147, 152, 148, 154, 178, 186, 181, 188] },
  ],
};

const URBANIZATION_VS_PRICE = [
  { city: 'Tokyo', urbanRate: 92, priceIndex: 132, pop: 37, color: '#14b8a6' },
  { city: 'New York', urbanRate: 87, priceIndex: 225, pop: 20, color: '#6366f1' },
  { city: 'London', urbanRate: 84, priceIndex: 195, pop: 14, color: '#ec4899' },
  { city: 'Berlin', urbanRate: 78, priceIndex: 175, pop: 6, color: '#f59e0b' },
  { city: 'Sydney', urbanRate: 86, priceIndex: 210, pop: 5, color: '#8b5cf6' },
  { city: 'Singapore', urbanRate: 100, priceIndex: 240, pop: 6, color: '#06b6d4' },
  { city: 'Mumbai', urbanRate: 50, priceIndex: 95, pop: 21, color: '#f97316' },
  { city: 'Paris', urbanRate: 81, priceIndex: 205, pop: 11, color: '#e11d48' },
  { city: 'Seoul', urbanRate: 82, priceIndex: 180, pop: 10, color: '#22d3ee' },
  { city: 'Dubai', urbanRate: 98, priceIndex: 160, pop: 3, color: '#a3e635' },
  { city: 'São Paulo', urbanRate: 87, priceIndex: 75, pop: 22, color: '#fb923c' },
  { city: 'Lagos', urbanRate: 62, priceIndex: 45, pop: 16, color: '#34d399' },
];

const BERLIN_DISTRICTS = [
  { name: 'Mitte', footfall: 95, doohScore: 92, avgRent: 18.5, color: '#6366f1' },
  { name: 'Friedrichshain-Kreuzberg', footfall: 88, doohScore: 85, avgRent: 16.2, color: '#818cf8' },
  { name: 'Charlottenburg-Wilmersdorf', footfall: 82, doohScore: 88, avgRent: 15.8, color: '#a78bfa' },
  { name: 'Prenzlauer Berg', footfall: 78, doohScore: 76, avgRent: 15.1, color: '#c4b5fd' },
  { name: 'Neukölln', footfall: 72, doohScore: 68, avgRent: 12.8, color: '#14b8a6' },
  { name: 'Tempelhof-Schöneberg', footfall: 68, doohScore: 72, avgRent: 13.5, color: '#2dd4bf' },
  { name: 'Steglitz-Zehlendorf', footfall: 45, doohScore: 42, avgRent: 12.2, color: '#5eead4' },
  { name: 'Pankow', footfall: 55, doohScore: 52, avgRent: 12.0, color: '#99f6e4' },
  { name: 'Spandau', footfall: 38, doohScore: 35, avgRent: 10.5, color: '#f59e0b' },
  { name: 'Reinickendorf', footfall: 35, doohScore: 32, avgRent: 10.2, color: '#fbbf24' },
  { name: 'Lichtenberg', footfall: 42, doohScore: 45, avgRent: 11.0, color: '#fcd34d' },
  { name: 'Treptow-Köpenick', footfall: 32, doohScore: 30, avgRent: 11.5, color: '#fde68a' },
];

const DOOH_SCORE_FACTORS = [
  { factor: 'Daily Footfall', weight: 30, icon: '👣' },
  { factor: 'Transit Proximity', weight: 20, icon: '🚇' },
  { factor: 'Demographic Match', weight: 18, icon: '🎯' },
  { factor: 'Dwell Time', weight: 15, icon: '⏱️' },
  { factor: 'Competitor Density', weight: 10, icon: '📊' },
  { factor: 'Visibility Score', weight: 7, icon: '👁️' },
];

// ─── Helpers ─────────────────────────────────────────────────────────

function FadeInText({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ParallaxSection({ children, speed = 0.3, className = '' }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

function ChapterHeading({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <FadeInText className="text-center py-32 md:py-48">
      <div className="text-sm font-mono tracking-[0.3em] uppercase text-indigo-400 mb-4">{number}</div>
      <h2 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">{title}</h2>
      <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
    </FadeInText>
  );
}

function StatCard({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <FadeInText delay={delay} className="glass-card rounded-2xl p-8 text-center">
      <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{value}</div>
      <div className="text-zinc-400 text-sm">{label}</div>
    </FadeInText>
  );
}

// ─── Visualizations ──────────────────────────────────────────────────

function HousingPriceChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  const [activeCountry, setActiveCountry] = useState<string | null>(null);

  const w = 700, h = 380, px = 60, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const years = HOUSING_PRICE_INDEX.years;
  const minYear = years[0], maxYear = years[years.length - 1];
  const maxVal = 240;

  const toX = (year: number) => px + ((year - minYear) / (maxYear - minYear)) * cw;
  const toY = (val: number) => py + ch - (val / maxVal) * ch;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Housing Price Index (2010 = 100)</h3>
      <p className="text-sm text-zinc-500 mb-4">Real residential property prices, OECD-aligned data</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          {HOUSING_PRICE_INDEX.countries.map(c => (
            <linearGradient key={c.code} id={`hpi-grad-${c.code}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={c.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {/* Grid */}
        {[100, 140, 180, 220].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="rgba(99,102,241,0.1)" strokeDasharray="4 4" />
            <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="11">{v}</text>
          </g>
        ))}
        {[2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024].map(yr => (
          <text key={yr} x={toX(yr)} y={h - 8} textAnchor="middle" fill="#52525b" fontSize="11">{yr}</text>
        ))}
        {/* Baseline */}
        <line x1={px} x2={w - px} y1={toY(100)} y2={toY(100)} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {/* Lines */}
        {HOUSING_PRICE_INDEX.countries.map((country, ci) => {
          const path = country.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(years[i])},${toY(v)}`).join(' ');
          const isActive = activeCountry === null || activeCountry === country.code;
          return (
            <g key={country.code}>
              <motion.path
                d={path}
                fill="none"
                stroke={country.color}
                strokeWidth={activeCountry === country.code ? 3.5 : 2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={isActive ? 1 : 0.15}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: isActive ? 1 : 0.15 } : {}}
                transition={{ duration: 1.5, delay: ci * 0.15, ease: 'easeOut' }}
              />
              {/* End label */}
              <motion.text
                x={toX(maxYear) + 6}
                y={toY(country.values[country.values.length - 1]) + 4}
                fill={country.color}
                fontSize="11"
                fontWeight="bold"
                opacity={isActive ? 1 : 0.15}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: isActive ? 1 : 0.15 } : {}}
                transition={{ delay: 1.5 + ci * 0.15 }}
              >
                {country.code}
              </motion.text>
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {HOUSING_PRICE_INDEX.countries.map(c => (
          <button
            key={c.code}
            onClick={() => setActiveCountry(prev => prev === c.code ? null : c.code)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
              activeCountry === c.code ? 'bg-white/10 ring-1 ring-white/20' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
            <span className="text-zinc-300">{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function UrbanizationScatter() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const w = 700, h = 420, px = 60, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const minUrb = 40, maxUrb = 105, minPrice = 30, maxPrice = 260;

  const toX = (urb: number) => px + ((urb - minUrb) / (maxUrb - minUrb)) * cw;
  const toY = (price: number) => py + ch - ((price - minPrice) / (maxPrice - minPrice)) * ch;
  const toR = (pop: number) => 4 + (pop / 40) * 16;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Urbanization vs Property Prices</h3>
      <p className="text-sm text-zinc-500 mb-4">Bubble size = metro population (millions)</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* Grid */}
        {[50, 60, 70, 80, 90, 100].map(v => (
          <g key={v}>
            <line x1={toX(v)} x2={toX(v)} y1={py} y2={py + ch} stroke="rgba(99,102,241,0.07)" strokeDasharray="4 4" />
            <text x={toX(v)} y={py + ch + 16} textAnchor="middle" fill="#52525b" fontSize="10">{v}%</text>
          </g>
        ))}
        {[50, 100, 150, 200, 250].map(v => (
          <g key={v}>
            <line x1={px} x2={px + cw} y1={toY(v)} y2={toY(v)} stroke="rgba(99,102,241,0.07)" strokeDasharray="4 4" />
            <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="10">{v}</text>
          </g>
        ))}
        {/* Axis labels */}
        <text x={w / 2} y={h - 2} textAnchor="middle" fill="#71717a" fontSize="11">Urbanization Rate (%)</text>
        <text x={14} y={h / 2} textAnchor="middle" fill="#71717a" fontSize="11" transform={`rotate(-90 14 ${h / 2})`}>Price Index</text>
        {/* Trend line (approximate) */}
        <motion.line
          x1={toX(45)} y1={toY(40)} x2={toX(102)} y2={toY(245)}
          stroke="rgba(99,102,241,0.2)" strokeWidth="1.5" strokeDasharray="6 4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
        />
        {/* Bubbles */}
        {URBANIZATION_VS_PRICE.map((d, i) => (
          <g key={d.city}
            onMouseEnter={() => setHoveredCity(d.city)}
            onMouseLeave={() => setHoveredCity(null)}
            style={{ cursor: 'pointer' }}
          >
            <motion.circle
              cx={toX(d.urbanRate)} cy={toY(d.priceIndex)} r={toR(d.pop)}
              fill={d.color} fillOpacity={hoveredCity === d.city ? 0.8 : 0.5}
              stroke={d.color} strokeWidth={hoveredCity === d.city ? 2 : 1}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.5, type: 'spring' }}
            />
            <motion.text
              x={toX(d.urbanRate)} y={toY(d.priceIndex) - toR(d.pop) - 4}
              textAnchor="middle" fill={hoveredCity === d.city ? 'white' : '#a1a1aa'}
              fontSize={hoveredCity === d.city ? '12' : '10'} fontWeight={hoveredCity === d.city ? 'bold' : 'normal'}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 + i * 0.08 }}
            >
              {d.city}
            </motion.text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function BerlinFootfallChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  const [metric, setMetric] = useState<'footfall' | 'doohScore' | 'avgRent'>('footfall');

  const sorted = [...BERLIN_DISTRICTS].sort((a, b) => b[metric] - a[metric]);
  const maxVal = Math.max(...sorted.map(d => d[metric]));
  const labels = { footfall: 'Footfall Index', doohScore: 'DOOH Score', avgRent: 'Avg Rent (€/m²)' };

  return (
    <div ref={ref} className="exd-card exd-glow p-6">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Berlin District Intelligence</h3>
      <p className="text-sm text-zinc-500 mb-4">Simulated location data across 12 districts</p>
      {/* Metric toggle */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['footfall', 'doohScore', 'avgRent'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
              metric === m ? 'bg-indigo-600 text-white' : 'bg-white/5 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {labels[m]}
          </button>
        ))}
      </div>
      <div className="space-y-2.5">
        {sorted.map((d, i) => (
          <div key={d.name} className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 w-48 shrink-0 text-right truncate">{d.name}</span>
            <div className="flex-1 h-7 bg-white/5 rounded-lg overflow-hidden">
              <motion.div
                className="h-full rounded-lg flex items-center pl-3"
                style={{ background: `linear-gradient(90deg, ${d.color}, ${d.color}88)` }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${(d[metric] / maxVal) * 100}%` } : {}}
                transition={{ duration: 0.8, delay: i * 0.06, ease: 'easeOut' }}
              >
                <span className="text-xs font-bold text-white whitespace-nowrap">
                  {metric === 'avgRent' ? `€${d[metric]}` : d[metric]}
                </span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DOOHLocationScoreViz() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const totalWeight = DOOH_SCORE_FACTORS.reduce((s, f) => s + f.weight, 0);

  // Example location scores
  const locations = [
    { name: 'Alexanderplatz', score: 94, factors: [98, 95, 88, 92, 85, 96] },
    { name: 'Kurfürstendamm', score: 91, factors: [92, 88, 95, 90, 82, 94] },
    { name: 'Potsdamer Platz', score: 87, factors: [85, 92, 82, 95, 78, 90] },
    { name: 'Friedrichstraße', score: 85, factors: [88, 90, 80, 82, 88, 86] },
  ];

  return (
    <div ref={ref} className="exd-card exd-glow p-6">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">DOOH Location Value Score</h3>
      <p className="text-sm text-zinc-500 mb-6">How EXD evaluates locations for advertising value</p>

      {/* Factor weights */}
      <div className="mb-8">
        <p className="text-xs text-zinc-500 mb-3 font-mono uppercase tracking-wider">Score Composition</p>
        <div className="flex rounded-xl overflow-hidden h-8">
          {DOOH_SCORE_FACTORS.map((f, i) => (
            <motion.div
              key={f.factor}
              className="h-full flex items-center justify-center relative group"
              style={{
                background: `hsl(${240 + i * 20}, 70%, ${45 + i * 5}%)`,
              }}
              initial={{ width: 0 }}
              animate={isInView ? { width: `${(f.weight / totalWeight) * 100}%` } : {}}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              title={`${f.factor}: ${f.weight}%`}
            >
              <span className="text-[10px] text-white/80 font-mono">{f.weight}%</span>
            </motion.div>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          {DOOH_SCORE_FACTORS.map((f, i) => (
            <span key={f.factor} className="text-[11px] text-zinc-500">
              {f.icon} {f.factor} ({f.weight}%)
            </span>
          ))}
        </div>
      </div>

      {/* Location scores */}
      <div className="space-y-4">
        {locations.map((loc, li) => (
          <motion.div
            key={loc.name}
            className="bg-white/[0.03] rounded-xl p-4 border border-white/5"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5 + li * 0.15 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-zinc-200">{loc.name}</span>
              <span className={`text-2xl font-bold ${
                loc.score >= 90 ? 'text-emerald-400' : loc.score >= 85 ? 'text-indigo-400' : 'text-amber-400'
              }`}>
                {loc.score}
              </span>
            </div>
            <div className="flex gap-0.5 h-2 rounded-full overflow-hidden">
              {loc.factors.map((f, fi) => (
                <motion.div
                  key={fi}
                  className="h-full"
                  style={{
                    background: `hsl(${240 + fi * 20}, 70%, ${45 + fi * 5}%)`,
                    opacity: f / 100,
                  }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${DOOH_SCORE_FACTORS[fi].weight}%` } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + li * 0.15 + fi * 0.05 }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

export default function RealEstateStoryPage() {
  return (
    <main className="bg-[#050507] text-white min-h-screen overflow-x-hidden">
      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl opacity-20"
              style={{
                width: 300 + i * 100,
                height: 300 + i * 100,
                background: i % 3 === 0
                  ? 'radial-gradient(circle, #f59e0b, transparent)'
                  : i % 3 === 1
                  ? 'radial-gradient(circle, #6366f1, transparent)'
                  : 'radial-gradient(circle, #14b8a6, transparent)',
                left: `${10 + i * 18}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{
                x: [0, 30 * (i % 2 === 0 ? 1 : -1), 0],
                y: [0, -20 * (i % 2 === 0 ? -1 : 1), 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-sm font-mono tracking-[0.4em] uppercase text-amber-400 mb-8"
          >
            A Data Story by EXD
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] mb-8"
          >
            <span className="gradient-text">Real Estate &</span>
            <br />
            <span className="text-white/90">Location Intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Where data meets place.
            <br />
            How location intelligence is transforming property, urban planning, and DOOH.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col items-center gap-2 text-zinc-500"
          >
            <span className="text-sm">Scroll to begin</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-zinc-600 flex items-start justify-center pt-2"
            >
              <div className="w-1.5 h-2.5 rounded-full bg-zinc-500" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ CONTEXT ═══════ */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-40">
        <FadeInText className="max-w-3xl mx-auto text-center mb-20">
          <p className="text-2xl md:text-3xl text-zinc-300 leading-relaxed">
            Real estate has always been about <span className="text-amber-400 font-semibold">location, location, location</span>.
            But now, data is redefining what &ldquo;location&rdquo; actually means — from housing markets to
            <span className="gradient-text font-semibold"> DOOH advertising placement</span>.
          </p>
        </FadeInText>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard value="+110%" label="US Home Prices Since 2010" delay={0} />
          <StatCard value="56%" label="World Population in Cities" delay={0.1} />
          <StatCard value="€18.50" label="Berlin Mitte Avg Rent/m²" delay={0.2} />
          <StatCard value="94/100" label="Top DOOH Location Score" delay={0.3} />
        </div>
      </section>

      {/* ═══════ CHAPTER 1: HOUSING PRICES ═══════ */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter One"
            title="The Price of Place"
            subtitle="Housing prices have diverged dramatically across the world's largest economies. The same money buys very different realities."
          />

          <div className="max-w-4xl mx-auto mb-16">
            <FadeInText>
              <p className="text-xl text-zinc-300 leading-relaxed mb-8">
                Since 2010, the US has seen property prices more than <span className="text-indigo-400 font-semibold">double</span>.
                Germany experienced a historic boom until 2022, then its first correction in decades.
                Japan, long the outlier, is finally seeing prices rise after <span className="text-teal-400 font-semibold">30 years of stagnation</span>.
              </p>
            </FadeInText>
          </div>

          <ParallaxSection speed={0.15} className="max-w-4xl mx-auto mb-20">
            <HousingPriceChart />
          </ParallaxSection>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              These price movements aren&apos;t just about bricks and mortar — they reflect
              <span className="text-amber-300"> monetary policy</span>,
              <span className="text-indigo-300"> urbanization patterns</span>, and
              <span className="text-teal-300"> demographic shifts</span>.
              Understanding them is essential for anyone making location-based decisions.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 2: URBANIZATION ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Two"
            title="The Urban Premium"
            subtitle="More urban means more expensive — but the relationship isn't as simple as it seems."
          />

          <div className="max-w-3xl mx-auto mb-16">
            <FadeInText>
              <p className="text-xl text-zinc-300 leading-relaxed mb-8">
                Cities like <span className="text-cyan-400 font-semibold">Singapore</span> (100% urban) and
                <span className="text-indigo-400 font-semibold"> New York</span> command extreme price premiums.
                But <span className="text-teal-400 font-semibold">Tokyo</span> — the world&apos;s largest metro — keeps prices surprisingly moderate
                through aggressive housing supply policies.
              </p>
            </FadeInText>
          </div>

          <ParallaxSection speed={0.15} className="max-w-4xl mx-auto mb-20">
            <UrbanizationScatter />
          </ParallaxSection>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              The correlation between urbanization and prices tells only part of the story.
              <span className="text-white font-semibold"> Policy, supply, and culture</span> determine whether
              a city becomes affordable or exclusive. This same logic applies to DOOH —
              high density doesn&apos;t automatically mean high value.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 3: BERLIN FOOTFALL ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Three"
            title="Berlin by the Numbers"
            subtitle="A district-level view of footfall, rents, and advertising potential across Germany's capital."
          />

          <div className="max-w-3xl mx-auto mb-16">
            <FadeInText>
              <p className="text-xl text-zinc-300 leading-relaxed mb-8">
                <span className="text-indigo-400 font-semibold">Mitte</span> dominates across every metric — highest footfall,
                highest rents, highest DOOH scores. But <span className="text-amber-400 font-semibold">Charlottenburg-Wilmersdorf</span> punches
                above its weight in advertising value thanks to its affluent demographics and tourist traffic.
              </p>
            </FadeInText>
          </div>

          <ParallaxSection speed={0.15} className="max-w-4xl mx-auto mb-20">
            <BerlinFootfallChart />
          </ParallaxSection>
        </div>
      </section>

      {/* ═══════ CHAPTER 4: DOOH LOCATION SCORE ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Four"
            title="The Score"
            subtitle="How EXD turns raw location data into actionable advertising intelligence."
          />

          <div className="max-w-3xl mx-auto mb-16">
            <FadeInText>
              <p className="text-xl text-zinc-300 leading-relaxed mb-8">
                Not all locations are created equal. EXD&apos;s Location Value Score combines
                <span className="text-indigo-400 font-semibold"> six weighted factors</span> — from daily footfall to
                demographic match — into a single actionable number. A score of <span className="text-emerald-400 font-semibold">90+</span> means
                premium placement potential.
              </p>
            </FadeInText>
          </div>

          <ParallaxSection speed={0.15} className="max-w-3xl mx-auto mb-20">
            <DOOHLocationScoreViz />
          </ParallaxSection>
        </div>
      </section>

      {/* ═══════ CONCLUSION ═══════ */}
      <section className="relative py-40 md:py-56">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, #f59e0b, transparent 70%)',
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeInText>
            <div className="text-sm font-mono tracking-[0.3em] uppercase text-amber-400 mb-6">Conclusion</div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 gradient-text">Data Is the New Location</h2>
          </FadeInText>

          <FadeInText delay={0.2}>
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              The convergence of real estate data, mobility analytics, and DOOH technology
              is creating a new kind of location intelligence.
            </p>
          </FadeInText>

          <FadeInText delay={0.3}>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-12">
              Whether you&apos;re pricing a property, planning a city, or placing an ad —
              the answer increasingly lies in the same dataset.
              <span className="text-white font-semibold"> Location isn&apos;t just a point on a map anymore.
              It&apos;s a living, breathing data stream.</span>
            </p>
          </FadeInText>

          <FadeInText delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-semibold transition-colors shadow-lg shadow-indigo-600/30"
              >
                Explore More Stories
              </a>
              <a
                href="/stories/dooh-revolution/"
                className="px-8 py-4 border border-zinc-700 hover:border-zinc-500 rounded-xl text-zinc-300 hover:text-white font-semibold transition-colors"
              >
                Next: The Rise of DOOH →
              </a>
            </div>
          </FadeInText>
        </div>
      </section>

      <StoryNavigation currentSlug="real-estate" />

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-zinc-600 text-sm">
        <p>Built with EXD — Data you don&apos;t just see. You feel.</p>
      </footer>
    </main>
  );
}
