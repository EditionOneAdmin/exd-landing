'use client';
import StoryNavigation from '@/components/StoryNavigation';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import ScrollySection from '@/components/story/ScrollySection';

// ─── UN Urbanization Data (realistic, based on UN World Urbanization Prospects) ─

const URBAN_SHARE_TIMELINE = [
  { year: 1950, urban: 30, rural: 70 },
  { year: 1960, urban: 34, rural: 66 },
  { year: 1970, urban: 37, rural: 63 },
  { year: 1980, urban: 39, rural: 61 },
  { year: 1990, urban: 43, rural: 57 },
  { year: 2000, urban: 47, rural: 53 },
  { year: 2010, urban: 52, rural: 48 },
  { year: 2020, urban: 56, rural: 44 },
  { year: 2030, urban: 60, rural: 40 },
  { year: 2040, urban: 64, rural: 36 },
  { year: 2050, urban: 68, rural: 32 },
];

const MEGACITY_DATA = [
  { year: 1990, count: 10, cities: ['Tokyo', 'New York', 'São Paulo', 'Mexico City', 'Mumbai', 'Osaka', 'Kolkata', 'Los Angeles', 'Seoul', 'Cairo'] },
  { year: 2000, count: 16 },
  { year: 2010, count: 23 },
  { year: 2020, count: 34 },
  { year: 2030, count: 43, cities: ['Tokyo', 'Delhi', 'Shanghai', 'São Paulo', 'Mumbai', 'Beijing', 'Cairo', 'Dhaka', 'Mexico City', 'Lagos', 'Osaka', 'Kolkata', 'Kinshasa', 'Lima', 'Istanbul'] },
];

const TOP_CITIES_2025 = [
  { name: 'Tokyo', pop: 37.1, country: 'Japan', growth: -0.2 },
  { name: 'Delhi', pop: 33.8, country: 'India', growth: 2.8 },
  { name: 'Shanghai', pop: 29.2, country: 'China', growth: 1.1 },
  { name: 'São Paulo', pop: 22.8, country: 'Brazil', growth: 0.7 },
  { name: 'Mumbai', pop: 22.1, country: 'India', growth: 1.5 },
  { name: 'Beijing', pop: 21.8, country: 'China', growth: 1.0 },
  { name: 'Cairo', pop: 21.3, country: 'Egypt', growth: 1.8 },
  { name: 'Dhaka', pop: 20.3, country: 'Bangladesh', growth: 3.2 },
  { name: 'Mexico City', pop: 20.1, country: 'Mexico', growth: 0.5 },
  { name: 'Lagos', pop: 16.6, country: 'Nigeria', growth: 3.5 },
];

const REGION_URBANIZATION = [
  { region: 'North America', y1950: 64, y2000: 79, y2050: 89, color: '#6366f1' },
  { region: 'Latin America', y1950: 41, y2000: 75, y2050: 87, color: '#ec4899' },
  { region: 'Europe', y1950: 52, y2000: 71, y2050: 84, color: '#14b8a6' },
  { region: 'Asia', y1950: 17, y2000: 37, y2050: 66, color: '#f59e0b' },
  { region: 'Africa', y1950: 14, y2000: 35, y2050: 59, color: '#22c55e' },
  { region: 'Oceania', y1950: 62, y2000: 68, y2050: 73, color: '#8b5cf6' },
];

const URBAN_CHALLENGES = [
  { label: 'Housing Deficit', value: 1.6, unit: 'B', desc: 'People in inadequate housing globally', color: '#ef4444' },
  { label: 'Slum Population', value: 1.1, unit: 'B', desc: 'Living in informal settlements', color: '#f59e0b' },
  { label: 'Urban CO₂ Share', value: 70, unit: '%', desc: 'Of global emissions from cities', color: '#6366f1' },
  { label: 'Urban Land by 2050', value: 3, unit: '×', desc: 'Expected tripling of urban land area', color: '#14b8a6' },
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

// ─── Viz 1: Urban vs Rural Area Chart ────────────────────────────────

function UrbanRuralChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 700, h = 360, px = 60, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const minYear = 1950, maxYear = 2050;

  const toX = (year: number) => px + ((year - minYear) / (maxYear - minYear)) * cw;
  const toY = (val: number) => py + ch - (val / 100) * ch;

  // Urban area path (bottom to urban line)
  const urbanLine = URBAN_SHARE_TIMELINE.map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(d.urban)}`
  ).join(' ');
  const urbanArea = urbanLine + ` L${toX(2050)},${toY(0)} L${toX(1950)},${toY(0)} Z`;

  // Projected boundary
  const projIdx = URBAN_SHARE_TIMELINE.findIndex(d => d.year === 2020);
  const solidLine = URBAN_SHARE_TIMELINE.slice(0, projIdx + 1).map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(d.urban)}`
  ).join(' ');
  const dashedLine = URBAN_SHARE_TIMELINE.slice(projIdx).map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(d.urban)}`
  ).join(' ');

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Urban vs Rural Population</h3>
      <p className="text-sm text-zinc-500 mb-6">Share of world population (%, 2020+ projected)</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          <linearGradient id="urbanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="ruralGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Grid */}
        {[0, 25, 50, 75, 100].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="rgba(99,102,241,0.1)" strokeDasharray="4 4" />
            <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="11">{v}%</text>
          </g>
        ))}
        {/* Year labels */}
        {[1950, 1970, 1990, 2010, 2030, 2050].map(yr => (
          <text key={yr} x={toX(yr)} y={h - 8} textAnchor="middle" fill="#52525b" fontSize="11">{yr}</text>
        ))}
        {/* 50% crossing line */}
        <line x1={px} x2={w - px} y1={toY(50)} y2={toY(50)} stroke="#f59e0b44" strokeWidth="2" strokeDasharray="8 4" />
        <text x={w - px + 4} y={toY(50) + 4} fill="#f59e0b" fontSize="10">50%</text>
        {/* Urban area */}
        <motion.path d={urbanArea} fill="url(#urbanGrad)" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 1.5 }} />
        {/* Rural area (top) */}
        <motion.rect x={px} y={py} width={cw} height={ch} fill="url(#ruralGrad)" initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.3 } : {}} transition={{ duration: 1.5 }} />
        {/* Solid line */}
        <motion.path d={solidLine} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }} animate={isInView ? { pathLength: 1, opacity: 1 } : {}} transition={{ duration: 1.5, ease: 'easeOut' }} />
        {/* Dashed (projected) */}
        <motion.path d={dashedLine} fill="none" stroke="#818cf8" strokeWidth="3" strokeDasharray="8 4" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }} animate={isInView ? { pathLength: 1, opacity: 0.8 } : {}} transition={{ duration: 1.5, delay: 0.8 }} />
        {/* Crossing point ~2007 */}
        <motion.circle cx={toX(2007)} cy={toY(50)} r="6" fill="#f59e0b" stroke="#050507" strokeWidth="2"
          initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}} transition={{ delay: 1.2, duration: 0.3 }} />
        <motion.text x={toX(2007)} y={toY(50) - 14} textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1.4 }}>
          2007: The Tipping Point
        </motion.text>
        {/* Labels */}
        <text x={toX(1960)} y={toY(20)} textAnchor="middle" fill="#6366f180" fontSize="14" fontWeight="bold">URBAN</text>
        <text x={toX(1960)} y={toY(80)} textAnchor="middle" fill="#22c55e60" fontSize="14" fontWeight="bold">RURAL</text>
        {/* End value */}
        <motion.text x={toX(2050) + 4} y={toY(68)} fill="#818cf8" fontSize="11" fontWeight="bold"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2 }}>
          68%
        </motion.text>
      </svg>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500" /><span className="text-xs text-zinc-400">Urban</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500/50" /><span className="text-xs text-zinc-400">Rural</span></div>
      </div>
    </div>
  );
}

// ─── Viz 2: Megacity Bubble Chart ─────────────────────────────────────

function MegacityBubbleChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const maxPop = 40;
  const bubbleScale = (pop: number) => Math.sqrt(pop / maxPop) * 50;

  // Lay out bubbles in a force-like grid
  const positions = TOP_CITIES_2025.map((_, i) => {
    const cols = 5;
    const row = Math.floor(i / cols);
    const col = i % cols;
    return { x: 70 + col * 120, y: 80 + row * 140 };
  });

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">World&apos;s Largest Cities (2025)</h3>
      <p className="text-sm text-zinc-500 mb-4">Population in millions — bubble size = population</p>
      <svg viewBox="0 0 670 340" className="w-full">
        {TOP_CITIES_2025.map((city, i) => {
          const r = bubbleScale(city.pop);
          const pos = positions[i];
          const growthColor = city.growth > 2 ? '#22c55e' : city.growth > 1 ? '#f59e0b' : city.growth < 0 ? '#ef4444' : '#6366f1';
          return (
            <g key={city.name}>
              <motion.circle
                cx={pos.x} cy={pos.y} r={r}
                fill={growthColor}
                fillOpacity={0.2}
                stroke={growthColor}
                strokeWidth="2"
                initial={{ r: 0, opacity: 0 }}
                animate={isInView ? { r, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
              />
              <motion.text
                x={pos.x} y={pos.y - 6}
                textAnchor="middle" fill="white" fontSize="11" fontWeight="bold"
                initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.08 }}
              >
                {city.name}
              </motion.text>
              <motion.text
                x={pos.x} y={pos.y + 10}
                textAnchor="middle" fill="#a1a1aa" fontSize="10"
                initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.08 }}
              >
                {city.pop}M
              </motion.text>
              <motion.text
                x={pos.x} y={pos.y + 22}
                textAnchor="middle" fill={growthColor} fontSize="9" fontWeight="bold"
                initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.7 + i * 0.08 }}
              >
                {city.growth > 0 ? '+' : ''}{city.growth}%/yr
              </motion.text>
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-xs text-zinc-400">Fast growth (&gt;2%)</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-xs text-zinc-400">Moderate (1-2%)</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500" /><span className="text-xs text-zinc-400">Slow (&lt;1%)</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-xs text-zinc-400">Shrinking</span></div>
      </div>
    </div>
  );
}

// ─── Viz 3: Regional Urbanization Grouped Bar Chart ──────────────────

function RegionalUrbanizationChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 700, h = 380, px = 100, py = 40;
  const cw = w - px - 40, ch = h - 2 * py;
  const barH = 14;
  const groupH = (barH + 4) * 3 + 20;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Urbanization by Region</h3>
      <p className="text-sm text-zinc-500 mb-4">% urban population: 1950 → 2000 → 2050</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* Grid */}
        {[0, 25, 50, 75, 100].map(v => (
          <g key={v}>
            <line x1={px} x2={w - 40} y1={py} y2={py} stroke="transparent" />
            <line x1={px + (v / 100) * cw} x2={px + (v / 100) * cw} y1={py} y2={h - py} stroke="rgba(99,102,241,0.08)" strokeDasharray="4 4" />
            <text x={px + (v / 100) * cw} y={h - py + 16} textAnchor="middle" fill="#52525b" fontSize="10">{v}%</text>
          </g>
        ))}
        {REGION_URBANIZATION.map((r, ri) => {
          const gy = py + ri * groupH / REGION_URBANIZATION.length * REGION_URBANIZATION.length * 0.92;
          const vals = [
            { val: r.y1950, color: '#64748b', label: '1950' },
            { val: r.y2000, color: r.color + 'aa', label: '2000' },
            { val: r.y2050, color: r.color, label: '2050' },
          ];
          return (
            <g key={r.region}>
              <text x={px - 8} y={gy + barH * 2 + 2} textAnchor="end" fill="#a1a1aa" fontSize="11">{r.region}</text>
              {vals.map((v, vi) => (
                <g key={v.label}>
                  <motion.rect
                    x={px} y={gy + vi * (barH + 3)}
                    width={(v.val / 100) * cw} height={barH}
                    rx={4} fill={v.color}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: (v.val / 100) * cw } : {}}
                    transition={{ duration: 1, delay: ri * 0.08 + vi * 0.15, ease: 'easeOut' }}
                  />
                  <motion.text
                    x={px + (v.val / 100) * cw + 6} y={gy + vi * (barH + 3) + barH - 2}
                    fill="#a1a1aa" fontSize="9"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.8 + ri * 0.08 + vi * 0.15 }}
                  >
                    {v.val}%
                  </motion.text>
                </g>
              ))}
            </g>
          );
        })}
      </svg>
      <div className="flex justify-center gap-6 mt-2">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-500" /><span className="text-xs text-zinc-400">1950</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-400/70" /><span className="text-xs text-zinc-400">2000</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500" /><span className="text-xs text-zinc-400">2050 (projected)</span></div>
      </div>
    </div>
  );
}

// ─── Viz 4: Megacity Counter Timeline ────────────────────────────────

function MegacityTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <div ref={ref} className="exd-card exd-glow p-6">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Rise of Megacities</h3>
      <p className="text-sm text-zinc-500 mb-6">Cities with 10M+ inhabitants</p>
      <div className="space-y-4">
        {MEGACITY_DATA.map((d, i) => {
          const maxCount = 43;
          return (
            <div key={d.year} className="flex items-center gap-4">
              <span className="text-sm font-mono text-zinc-400 w-12 shrink-0">{d.year}</span>
              <div className="flex-1 h-10 bg-white/5 rounded-lg overflow-hidden relative">
                <motion.div
                  className="h-full rounded-lg flex items-center pl-3"
                  style={{ background: `linear-gradient(90deg, #6366f1, #a855f7)` }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${(d.count / maxCount) * 100}%` } : {}}
                  transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
                >
                  <span className="text-sm font-bold text-white whitespace-nowrap">{d.count} cities</span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-zinc-600 mt-4 text-center">Source: UN World Urbanization Prospects 2024</p>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

export default function GlobalUrbanizationPage() {
  const [growthStep, setGrowthStep] = useState('growth-1');

  return (
    <main className="bg-[#050507] text-white min-h-screen overflow-x-hidden">
      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {/* City grid animation */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl opacity-15"
              style={{
                width: 250 + i * 80,
                height: 250 + i * 80,
                background: i % 3 === 0
                  ? 'radial-gradient(circle, #f59e0b, transparent)'
                  : i % 3 === 1
                  ? 'radial-gradient(circle, #6366f1, transparent)'
                  : 'radial-gradient(circle, #ec4899, transparent)',
                left: `${5 + i * 16}%`,
                top: `${15 + (i % 3) * 25}%`,
              }}
              animate={{
                x: [0, 25 * (i % 2 === 0 ? 1 : -1), 0],
                y: [0, -15 * (i % 2 === 0 ? -1 : 1), 0],
                scale: [1, 1.08, 1],
              }}
              transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
          {/* Tiny dots simulating city lights */}
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={`dot-${i}`}
              className="absolute w-1 h-1 rounded-full bg-amber-400/30"
              style={{ left: `${5 + Math.random() * 90}%`, top: `${10 + Math.random() * 80}%` }}
              animate={{ opacity: [0.1, 0.6, 0.1] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
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
            <span className="gradient-text">Cities Are</span>
            <br />
            <span className="text-white/90">Eating the World</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            By 2050, two-thirds of humanity will live in cities.
            <br />
            The greatest migration in history is already underway.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col items-center gap-2 text-zinc-500"
          >
            <span className="text-sm">Scroll to explore</span>
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
            In 1950, just <span className="text-amber-400 font-semibold">30%</span> of people lived in cities.
            In 2007, we crossed the 50% line. By 2050, it&apos;ll be
            <span className="gradient-text font-semibold"> 68% — nearly 7 billion urban dwellers</span>.
          </p>
        </FadeInText>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard value="4.4B" label="Urban Population Today" delay={0} />
          <StatCard value="6.7B" label="Urban Population by 2050" delay={0.1} />
          <StatCard value="43" label="Megacities by 2030" delay={0.2} />
          <StatCard value="68%" label="Of Humanity in Cities by 2050" delay={0.3} />
        </div>
      </section>

      {/* ═══════ CHAPTER 1: THE TIPPING POINT ═══════ */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter One"
            title="The Tipping Point"
            subtitle="In 2007, for the first time in history, more people lived in cities than in the countryside. There's no going back."
          />

          <div className="max-w-3xl mx-auto mb-16">
            <FadeInText>
              <p className="text-xl text-zinc-300 leading-relaxed mb-8">
                Urbanization is the defining megatrend of our century. Every week,
                <span className="text-amber-400 font-semibold"> 1.5 million people</span> move to cities — that&apos;s a new Barcelona
                every three days. The trajectory is clear and accelerating.
              </p>
            </FadeInText>
          </div>

          <ParallaxSection speed={0.15} className="max-w-4xl mx-auto mb-20">
            <UrbanRuralChart />
          </ParallaxSection>
        </div>
      </section>

      {/* ═══════ CHAPTER 2: THE MEGACITIES ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Two"
            title="Rise of the Megacity"
            subtitle="In 1990, there were 10 megacities. By 2030, there will be 43. The urban giants are reshaping our world."
          />

          <ScrollySection
            activeStep={growthStep}
            onStepChange={setGrowthStep}
            steps={[
              {
                id: 'growth-1',
                content: (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-amber-300">The Asian Surge</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      Delhi adds <strong className="text-white">500,000 people per year</strong>. Dhaka grows at 3.2% annually.
                      Asia holds 6 of the world&apos;s 10 largest cities — and the gap is widening.
                    </p>
                  </div>
                ),
              },
              {
                id: 'growth-2',
                content: (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-pink-300">Africa&apos;s Urban Future</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      Lagos is growing at <strong className="text-white">3.5% per year</strong> — the fastest of any megacity.
                      By 2100, Africa could have 13 of the world&apos;s 20 largest cities. Kinshasa will rival Tokyo.
                    </p>
                  </div>
                ),
              },
              {
                id: 'growth-3',
                content: (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-cyan-300">The Shrinking Giants</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      Not every city grows. Tokyo is <strong className="text-white">losing 0.2% annually</strong>.
                      Seoul, Osaka, and European cities face the same fate. The future belongs to the Global South.
                    </p>
                  </div>
                ),
              },
            ]}
            visualization={<MegacityBubbleChart />}
          />
        </div>
      </section>

      {/* ═══════ CHAPTER 3: THE REGIONAL DIVIDE ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Three"
            title="A Tale of Two Worlds"
            subtitle="North America and Europe urbanized decades ago. Asia and Africa are doing it now — at unprecedented scale."
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            <FadeInText delay={0.1}>
              <RegionalUrbanizationChart />
            </FadeInText>
            <FadeInText delay={0.2}>
              <MegacityTimeline />
            </FadeInText>
          </div>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              Africa&apos;s urban population will <span className="text-amber-300 font-semibold">triple by 2050</span> — from 600 million
              to 1.5 billion. Asia will add another <span className="text-indigo-300 font-semibold">1.2 billion urban dwellers</span>.
              The infrastructure needed is staggering: more cities, roads, and buildings in 30 years than humanity built in the last 300.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 4: THE CHALLENGES ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Four"
            title="The Urban Paradox"
            subtitle="Cities drive 80% of global GDP — but also 70% of CO₂ emissions. Growth without planning is a recipe for crisis."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto mb-16">
            {URBAN_CHALLENGES.map((ch, i) => (
              <FadeInText key={ch.label} delay={i * 0.1}>
                <div className="exd-card exd-glow p-6 text-center h-full">
                  <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: ch.color }}>
                    {ch.value}{ch.unit}
                  </div>
                  <div className="text-sm font-semibold text-zinc-300 mb-2">{ch.label}</div>
                  <div className="text-xs text-zinc-500">{ch.desc}</div>
                </div>
              </FadeInText>
            ))}
          </div>

          <FadeInText className="max-w-3xl mx-auto mb-20">
            <div className="exd-card exd-glow p-8">
              <h3 className="text-2xl font-bold mb-6 gradient-text text-center">The Stakes</h3>
              <ul className="space-y-4 text-zinc-400">
                {[
                  ['🏗️', 'By 2050, 2.5 billion more people will need urban housing, transport, and services'],
                  ['🌡️', 'Urban heat islands make cities 5-10°C hotter than surrounding areas'],
                  ['💧', 'Half of the world\'s cities already face water scarcity'],
                  ['🚗', 'Average commuter in Lagos spends 4+ hours daily in traffic'],
                  ['🌍', 'How we build the next generation of cities determines the climate trajectory'],
                ].map(([icon, text]) => (
                  <li key={text as string} className="flex items-start gap-3">
                    <span className="text-2xl">{icon}</span>
                    <span className="leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CONCLUSION ═══════ */}
      <section className="relative py-40 md:py-56">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, #f59e0b, transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeInText>
            <div className="text-sm font-mono tracking-[0.3em] uppercase text-amber-400 mb-6">The Takeaway</div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 gradient-text">The Century of the City</h2>
          </FadeInText>

          <FadeInText delay={0.2}>
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              We are building the urban future <em>right now</em>. Every road, every building, every transit line
              locks in patterns for decades to come.
            </p>
          </FadeInText>

          <FadeInText delay={0.4}>
            <p className="text-lg text-zinc-500 leading-relaxed max-w-xl mx-auto mb-16">
              The data is clear. The question is whether we&apos;ll use it to build cities that work for
              <span className="text-white font-semibold"> everyone</span>.
            </p>
          </FadeInText>

          <FadeInText delay={0.6}>
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
                Next: The DOOH Revolution
              </a>
            </div>
          </FadeInText>
        </div>
      </section>

      <StoryNavigation currentSlug="global-urbanization" />

      <footer className="border-t border-white/5 py-12 text-center text-zinc-600 text-sm">
        <p>Built with EXD — Data you don&apos;t just see. You feel.</p>
      </footer>
    </main>
  );
}
