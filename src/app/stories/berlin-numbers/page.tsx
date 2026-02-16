'use client';
import StoryNavigation from '@/components/StoryNavigation';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import ScrollySection from '@/components/story/ScrollySection';

// ─── Berlin Data ─────────────────────────────────────────────────────

const POPULATION_TIMELINE = [
  { year: 2000, population: 3.38, inflow: 131, outflow: 142 },
  { year: 2005, population: 3.39, inflow: 135, outflow: 138 },
  { year: 2010, population: 3.46, inflow: 148, outflow: 126 },
  { year: 2012, population: 3.52, inflow: 163, outflow: 128 },
  { year: 2015, population: 3.61, inflow: 190, outflow: 135 },
  { year: 2017, population: 3.71, inflow: 186, outflow: 143 },
  { year: 2019, population: 3.77, inflow: 170, outflow: 148 },
  { year: 2020, population: 3.66, inflow: 145, outflow: 155 },
  { year: 2022, population: 3.76, inflow: 175, outflow: 140 },
  { year: 2024, population: 3.87, inflow: 182, outflow: 139 },
  { year: 2025, population: 3.92, inflow: 178, outflow: 137 },
];

const RENT_DATA = [
  { year: 2010, rent: 5.8 },
  { year: 2012, rent: 6.5 },
  { year: 2014, rent: 7.4 },
  { year: 2016, rent: 8.6 },
  { year: 2018, rent: 10.2 },
  { year: 2019, rent: 11.1 },
  { year: 2020, rent: 11.8 },
  { year: 2021, rent: 12.3 },
  { year: 2022, rent: 13.1 },
  { year: 2023, rent: 14.2 },
  { year: 2024, rent: 15.5 },
  { year: 2025, rent: 16.3 },
];

const STARTUP_DATA = [
  { year: 2015, startups: 2100, vcMillions: 2800 },
  { year: 2016, startups: 2350, vcMillions: 3100 },
  { year: 2017, startups: 2580, vcMillions: 3600 },
  { year: 2018, startups: 2800, vcMillions: 4500 },
  { year: 2019, startups: 3100, vcMillions: 6200 },
  { year: 2020, startups: 2900, vcMillions: 5800 },
  { year: 2021, startups: 3400, vcMillions: 11700 },
  { year: 2022, startups: 3200, vcMillions: 8200 },
  { year: 2023, startups: 2800, vcMillions: 4900 },
  { year: 2024, startups: 3050, vcMillions: 6100 },
];

const DOOH_DATA = [
  { year: 2018, screens: 4200, digitalPct: 28 },
  { year: 2019, screens: 5100, digitalPct: 35 },
  { year: 2020, screens: 5400, digitalPct: 40 },
  { year: 2021, screens: 6200, digitalPct: 48 },
  { year: 2022, screens: 7500, digitalPct: 55 },
  { year: 2023, screens: 8800, digitalPct: 62 },
  { year: 2024, screens: 10200, digitalPct: 68 },
  { year: 2025, screens: 11500, digitalPct: 74 },
];

const TOURISM_DATA = [
  { year: 2015, overnight: 30.3 },
  { year: 2016, overnight: 31.1 },
  { year: 2017, overnight: 31.9 },
  { year: 2018, overnight: 33.0 },
  { year: 2019, overnight: 34.1 },
  { year: 2020, overnight: 12.4 },
  { year: 2021, overnight: 14.8 },
  { year: 2022, overnight: 26.5 },
  { year: 2023, overnight: 31.8 },
  { year: 2024, overnight: 35.2 },
];

// ─── Helper Components ───────────────────────────────────────────────

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
      <div className="text-sm font-mono tracking-[0.3em] uppercase text-amber-400 mb-4">{number}</div>
      <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-red-400 to-pink-500 bg-clip-text text-transparent">{title}</h2>
      <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
    </FadeInText>
  );
}

function StatCard({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <FadeInText delay={delay} className="glass-card rounded-2xl p-8 text-center">
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent mb-2">{value}</div>
      <div className="text-zinc-400 text-sm">{label}</div>
    </FadeInText>
  );
}

// ─── Chart Components ────────────────────────────────────────────────

function PopulationChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 640, h = 340, px = 55, py = 30;
  const cw = w - 2 * px, ch = h - 2 * py;
  const minPop = 3.3, maxPop = 4.0;

  const points = POPULATION_TIMELINE.map((d, i) => {
    const x = px + (i / (POPULATION_TIMELINE.length - 1)) * cw;
    const y = py + ch - ((d.population - minPop) / (maxPop - minPop)) * ch;
    return `${x},${y}`;
  });

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent mb-1">Bevölkerungsentwicklung Berlin</h3>
      <p className="text-sm text-zinc-500 mb-6">Einwohner in Millionen (2000–2025)</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {[3.4, 3.5, 3.6, 3.7, 3.8, 3.9].map(v => {
          const y = py + ch - ((v - minPop) / (maxPop - minPop)) * ch;
          return (
            <g key={v}>
              <line x1={px} x2={w - px} y1={y} y2={y} stroke="rgba(251,191,36,0.1)" strokeDasharray="4 4" />
              <text x={px - 8} y={y + 4} textAnchor="end" fill="#71717a" fontSize="11">{v.toFixed(1)}M</text>
            </g>
          );
        })}
        {POPULATION_TIMELINE.filter((_, i) => i % 2 === 0).map((d, i, arr) => (
          <text key={d.year} x={px + ((POPULATION_TIMELINE.indexOf(d)) / (POPULATION_TIMELINE.length - 1)) * cw} y={h - 6} textAnchor="middle" fill="#71717a" fontSize="10">{d.year}</text>
        ))}
        <motion.polyline
          points={points.join(' ')}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
        {POPULATION_TIMELINE.map((d, i) => {
          const x = px + (i / (POPULATION_TIMELINE.length - 1)) * cw;
          const y = py + ch - ((d.population - minPop) / (maxPop - minPop)) * ch;
          return (
            <motion.circle
              key={d.year}
              cx={x}
              cy={y}
              r="4"
              fill="#f59e0b"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
            />
          );
        })}
      </svg>
    </div>
  );
}

function MigrationBars() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  const data = POPULATION_TIMELINE.filter((_, i) => i % 2 === 0);
  const max = 200;

  return (
    <div ref={ref} className="exd-card exd-glow p-6">
      <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent mb-1">Zuzug vs. Wegzug</h3>
      <p className="text-sm text-zinc-500 mb-6">Tausend Personen/Jahr</p>
      <div className="space-y-3">
        {data.map((d, i) => (
          <div key={d.year} className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 w-10 text-right">{d.year}</span>
            <div className="flex-1 flex gap-1">
              <motion.div
                className="h-6 bg-emerald-500 rounded-l-md flex items-center justify-end pr-2"
                initial={{ width: 0 }}
                animate={isInView ? { width: `${(d.inflow / max) * 50}%` } : {}}
                transition={{ duration: 0.8, delay: i * 0.08 }}
              >
                <span className="text-[10px] font-bold text-white">{d.inflow}k</span>
              </motion.div>
              <motion.div
                className="h-6 bg-red-500 rounded-r-md flex items-center pl-2"
                initial={{ width: 0 }}
                animate={isInView ? { width: `${(d.outflow / max) * 50}%` } : {}}
                transition={{ duration: 0.8, delay: i * 0.08 + 0.1 }}
              >
                <span className="text-[10px] font-bold text-white">{d.outflow}k</span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-4 justify-center">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-xs text-zinc-400">Zuzug</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-xs text-zinc-400">Wegzug</span></div>
      </div>
    </div>
  );
}

function RentChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 640, h = 340, px = 55, py = 30;
  const cw = w - 2 * px, ch = h - 2 * py;
  const minR = 4, maxR = 18;

  const areaPoints = RENT_DATA.map((d, i) => {
    const x = px + (i / (RENT_DATA.length - 1)) * cw;
    const y = py + ch - ((d.rent - minR) / (maxR - minR)) * ch;
    return `${x},${y}`;
  });
  const areaPath = `M${px},${py + ch} ${areaPoints.join(' ')} L${px + cw},${py + ch} Z`;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent mb-1">Mietpreisentwicklung</h3>
      <p className="text-sm text-zinc-500 mb-6">Durchschnittliche Kaltmiete €/m² in Berlin</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {[6, 8, 10, 12, 14, 16].map(v => {
          const y = py + ch - ((v - minR) / (maxR - minR)) * ch;
          return (
            <g key={v}>
              <line x1={px} x2={w - px} y1={y} y2={y} stroke="rgba(239,68,68,0.1)" strokeDasharray="4 4" />
              <text x={px - 8} y={y + 4} textAnchor="end" fill="#71717a" fontSize="11">{v}€</text>
            </g>
          );
        })}
        {RENT_DATA.filter((_, i) => i % 2 === 0).map(d => (
          <text key={d.year} x={px + (RENT_DATA.indexOf(d) / (RENT_DATA.length - 1)) * cw} y={h - 6} textAnchor="middle" fill="#71717a" fontSize="10">{d.year}</text>
        ))}
        <motion.path
          d={areaPath}
          fill="url(#rentGradient)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.3 } : {}}
          transition={{ duration: 1.5 }}
        />
        <defs>
          <linearGradient id="rentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <motion.polyline
          points={areaPoints.join(' ')}
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
        {RENT_DATA.map((d, i) => {
          const x = px + (i / (RENT_DATA.length - 1)) * cw;
          const y = py + ch - ((d.rent - minR) / (maxR - minR)) * ch;
          return (
            <motion.circle key={d.year} cx={x} cy={y} r="4" fill="#ef4444"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
            />
          );
        })}
      </svg>
      <div className="mt-4 text-center">
        <span className="text-xs text-zinc-500">+181% Anstieg seit 2010</span>
      </div>
    </div>
  );
}

function StartupVCChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  const max = 12000;

  return (
    <div ref={ref} className="exd-card exd-glow p-6">
      <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent mb-1">VC-Investments Berlin</h3>
      <p className="text-sm text-zinc-500 mb-6">Millionen € pro Jahr</p>
      <div className="space-y-3">
        {STARTUP_DATA.map((d, i) => (
          <div key={d.year} className="flex items-center gap-3">
            <span className="text-sm text-zinc-400 w-12 shrink-0 text-right">{d.year}</span>
            <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden">
              <motion.div
                className="h-full rounded-lg flex items-center pl-3"
                style={{ background: d.year === 2021 ? '#a855f7' : '#8b5cf6' }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${(d.vcMillions / max) * 100}%` } : {}}
                transition={{ duration: 1, delay: i * 0.08, ease: 'easeOut' }}
              >
                <span className="text-xs font-bold text-white whitespace-nowrap">€{(d.vcMillions / 1000).toFixed(1)}B</span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StartupCountChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  const max = 3600;

  return (
    <div ref={ref} className="exd-card exd-glow p-6">
      <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent mb-1">Gründungen pro Jahr</h3>
      <p className="text-sm text-zinc-500 mb-6">Tech-Startups in Berlin</p>
      <div className="space-y-3">
        {STARTUP_DATA.map((d, i) => (
          <div key={d.year} className="flex items-center gap-3">
            <span className="text-sm text-zinc-400 w-12 shrink-0 text-right">{d.year}</span>
            <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden">
              <motion.div
                className="h-full rounded-lg flex items-center pl-3 bg-amber-500"
                initial={{ width: 0 }}
                animate={isInView ? { width: `${(d.startups / max) * 100}%` } : {}}
                transition={{ duration: 1, delay: i * 0.08, ease: 'easeOut' }}
              >
                <span className="text-xs font-bold text-white whitespace-nowrap">{d.startups.toLocaleString()}</span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DOOHChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 640, h = 340, px = 55, py = 30;
  const cw = w - 2 * px, ch = h - 2 * py;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent mb-1">DOOH-Displays & Digitalisierung</h3>
      <p className="text-sm text-zinc-500 mb-6">Screens (Balken) + Digitalisierungsgrad (Linie)</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* Bars for screens */}
        {DOOH_DATA.map((d, i) => {
          const barW = (cw / DOOH_DATA.length) * 0.6;
          const x = px + (i / (DOOH_DATA.length - 1)) * cw - barW / 2;
          const barH = (d.screens / 12000) * ch;
          const y = py + ch - barH;
          return (
            <g key={d.year}>
              <motion.rect
                x={x} y={y} width={barW} height={barH}
                rx="4"
                fill="#6366f1"
                opacity={0.6}
                initial={{ height: 0, y: py + ch }}
                animate={isInView ? { height: barH, y } : {}}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              />
              <text x={px + (i / (DOOH_DATA.length - 1)) * cw} y={h - 6} textAnchor="middle" fill="#71717a" fontSize="10">{d.year}</text>
            </g>
          );
        })}
        {/* Line for digital % */}
        {(() => {
          const pts = DOOH_DATA.map((d, i) => {
            const x = px + (i / (DOOH_DATA.length - 1)) * cw;
            const y = py + ch - (d.digitalPct / 100) * ch;
            return `${x},${y}`;
          });
          return (
            <motion.polyline
              points={pts.join(' ')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
            />
          );
        })()}
        {/* Right axis labels */}
        {[25, 50, 75].map(v => {
          const y = py + ch - (v / 100) * ch;
          return <text key={v} x={w - px + 8} y={y + 4} fill="#f59e0b" fontSize="10">{v}%</text>;
        })}
        {/* Left axis labels */}
        {[4000, 8000, 12000].map(v => {
          const y = py + ch - (v / 12000) * ch;
          return <text key={v} x={px - 8} y={y + 4} textAnchor="end" fill="#6366f1" fontSize="10">{(v / 1000).toFixed(0)}k</text>;
        })}
      </svg>
      <div className="flex gap-4 mt-4 justify-center">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-indigo-500 opacity-60" /><span className="text-xs text-zinc-400">Screens</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-xs text-zinc-400">Digital %</span></div>
      </div>
    </div>
  );
}

function TourismChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 640, h = 340, px = 55, py = 30;
  const cw = w - 2 * px, ch = h - 2 * py;
  const maxO = 38;

  const points = TOURISM_DATA.map((d, i) => {
    const x = px + (i / (TOURISM_DATA.length - 1)) * cw;
    const y = py + ch - (d.overnight / maxO) * ch;
    return `${x},${y}`;
  });

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent mb-1">Tourismus: Übernachtungen</h3>
      <p className="text-sm text-zinc-500 mb-6">Millionen Übernachtungen/Jahr</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {[10, 20, 30].map(v => {
          const y = py + ch - (v / maxO) * ch;
          return (
            <g key={v}>
              <line x1={px} x2={w - px} y1={y} y2={y} stroke="rgba(14,165,233,0.1)" strokeDasharray="4 4" />
              <text x={px - 8} y={y + 4} textAnchor="end" fill="#71717a" fontSize="11">{v}M</text>
            </g>
          );
        })}
        {TOURISM_DATA.map((d, i) => (
          <text key={d.year} x={px + (i / (TOURISM_DATA.length - 1)) * cw} y={h - 6} textAnchor="middle" fill="#71717a" fontSize="10">{d.year}</text>
        ))}
        {/* COVID annotation */}
        {(() => {
          const covidIdx = TOURISM_DATA.findIndex(d => d.year === 2020);
          const x = px + (covidIdx / (TOURISM_DATA.length - 1)) * cw;
          const y = py + ch - (TOURISM_DATA[covidIdx].overnight / maxO) * ch;
          return (
            <g>
              <line x1={x} y1={py} x2={x} y2={py + ch} stroke="#ef444444" strokeDasharray="4 4" />
              <text x={x + 6} y={py + 12} fill="#ef4444" fontSize="10" fontWeight="bold">COVID</text>
            </g>
          );
        })()}
        <motion.polyline
          points={points.join(' ')}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
        {TOURISM_DATA.map((d, i) => {
          const x = px + (i / (TOURISM_DATA.length - 1)) * cw;
          const y = py + ch - (d.overnight / maxO) * ch;
          return (
            <motion.circle key={d.year} cx={x} cy={y} r="4" fill={d.year === 2020 ? '#ef4444' : '#0ea5e9'}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
            />
          );
        })}
      </svg>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

export default function BerlinInNumbersPage() {
  const [popStep, setPopStep] = useState('pop-1');
  const [startupStep, setStartupStep] = useState('startup-1');

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
                background: i % 2 === 0 ? 'radial-gradient(circle, #f59e0b, transparent)' : 'radial-gradient(circle, #ef4444, transparent)',
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
            <span className="bg-gradient-to-r from-amber-400 via-red-400 to-pink-500 bg-clip-text text-transparent">Berlin</span>
            <br />
            <span className="text-white/90">in Numbers</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Die Hauptstadt als Datenstadt — Bevölkerung, Mieten, Startups, DOOH und Tourismus.
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
            Berlin wächst, verändert sich, erfindet sich neu.
            <span className="bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent font-semibold"> 3,9 Millionen Menschen, 30.000+ Startups, 35 Millionen Übernachtungen </span>
            — eine Stadt, die man in Daten lesen kann.
          </p>
        </FadeInText>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard value="3.92M" label="Einwohner (2025)" delay={0} />
          <StatCard value="16.30€" label="Durchschnittl. Miete/m²" delay={0.1} />
          <StatCard value="11.5k" label="DOOH-Screens" delay={0.2} />
          <StatCard value="35.2M" label="Übernachtungen (2024)" delay={0.3} />
        </div>
      </section>

      {/* ═══════ CHAPTER 1: BEVÖLKERUNG ═══════ */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Kapitel Eins"
            title="Die Menschen"
            subtitle="Berlin wächst — schneller als jede andere deutsche Großstadt. Wer kommt, wer geht?"
          />

          <ScrollySection
            activeStep={popStep}
            onStepChange={setPopStep}
            steps={[
              {
                id: 'pop-1',
                content: (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-amber-300">2000–2010: Die Stagnation</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      Nach der Wiedervereinigung stagniert Berlin. Die Stadt verliert sogar Einwohner.
                      Mehr Menschen ziehen weg als zu — Berlin ist günstig, aber perspektivarm.
                    </p>
                  </div>
                ),
              },
              {
                id: 'pop-2',
                content: (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-orange-300">2010–2019: Der Boom</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      Die Startup-Szene zieht an, internationale Zuwanderer strömen nach Berlin.
                      Über 190.000 Neuberliner allein 2015. Die Stadt wächst um fast 400.000 Menschen in einem Jahrzehnt.
                    </p>
                  </div>
                ),
              },
              {
                id: 'pop-3',
                content: (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-red-300">2020–2025: Neues Wachstum</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      COVID bremst kurz, aber Berlin erholt sich schnell. Bis 2025 fast 3,92 Millionen.
                      Der Zuzug dominiert wieder — Berlin bleibt Magnet für Kreative, Gründer und Fachkräfte.
                    </p>
                  </div>
                ),
              },
            ]}
            visualization={
              <div className="space-y-6">
                <PopulationChart />
                <MigrationBars />
              </div>
            }
          />
        </div>
      </section>

      {/* ═══════ CHAPTER 2: MIETEN ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Kapitel Zwei"
            title="Die Mieten"
            subtitle="Vom Schnäppchen zur Preisexplosion: Berlins Mietmarkt in 15 Jahren."
          />

          <div className="max-w-3xl mx-auto mb-16">
            <FadeInText>
              <p className="text-xl text-zinc-300 leading-relaxed mb-8">
                2010 zahlte man in Berlin durchschnittlich <span className="text-emerald-400 font-semibold">5,80€/m²</span>.
                Heute sind es über <span className="text-red-400 font-semibold">16€/m²</span>.
                Ein Anstieg von fast 181% — und ein Ende ist nicht in Sicht.
              </p>
            </FadeInText>
          </div>

          <ParallaxSection speed={0.15} className="max-w-4xl mx-auto mb-16">
            <RentChart />
          </ParallaxSection>

          <FadeInText delay={0.2} className="max-w-2xl mx-auto mb-20">
            <div className="exd-card exd-glow p-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent mb-6">Was die Zahlen bedeuten</h3>
              <ul className="space-y-4 text-zinc-400">
                {[
                  ['🏠', 'Eine 60m²-Wohnung kostet heute ~978€ kalt (2010: ~348€)'],
                  ['📊', 'Mietendeckel (2020-2021) bremste kurz, BVerfG kippte ihn'],
                  ['🔨', 'Neubau deckt nur 30% des Bedarfs'],
                  ['🌍', 'Trotzdem: günstiger als London, Paris, München'],
                  ['📈', 'Prognose: 18-20€/m² bis 2028'],
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

      {/* ═══════ CHAPTER 3: STARTUPS ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Kapitel Drei"
            title="Die Startups"
            subtitle="Europas Startup-Hauptstadt: Gründungen, Unicorns und Milliarden-Investments."
          />

          <ScrollySection
            activeStep={startupStep}
            onStepChange={setStartupStep}
            steps={[
              {
                id: 'startup-1',
                content: (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-amber-300">Das Ökosystem</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      Berlin beherbergt über 3.000 Tech-Startups — mehr als jede andere deutsche Stadt.
                      Von Delivery Hero bis N26, von Trade Republic bis Gorillas: hier entstehen Unicorns.
                    </p>
                  </div>
                ),
              },
              {
                id: 'startup-2',
                content: (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-purple-300">2021: Das Rekordjahr</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      €11,7 Milliarden flossen 2021 in Berliner Startups — ein Allzeithoch.
                      Der Hype um Quick-Commerce, FinTech und HealthTech trieb die Bewertungen in die Höhe.
                    </p>
                  </div>
                ),
              },
              {
                id: 'startup-3',
                content: (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-cyan-300">2023-2024: Die Normalisierung</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      Nach dem Funding-Winter erholt sich die Szene. €6,1B in 2024 zeigen: Berlin bleibt
                      Europas wichtigster Startup-Hub. AI und Climate-Tech treiben die neue Welle.
                    </p>
                  </div>
                ),
              },
            ]}
            visualization={
              <div className="space-y-6">
                <StartupVCChart />
                <StartupCountChart />
              </div>
            }
          />
        </div>
      </section>

      {/* ═══════ CHAPTER 4: DOOH ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Kapitel Vier"
            title="Die Screens"
            subtitle="DOOH-Werbung in Berlin: von analog zu digital, von statisch zu dynamisch."
          />

          <div className="max-w-3xl mx-auto mb-16">
            <FadeInText>
              <p className="text-xl text-zinc-300 leading-relaxed mb-8">
                Berlin ist Deutschlands DOOH-Hauptstadt. Über <span className="text-indigo-400 font-semibold">11.500 Screens</span> im Stadtgebiet,
                davon bereits <span className="text-amber-400 font-semibold">74% digital</span>.
                Tendenz: stark steigend.
              </p>
            </FadeInText>
          </div>

          <ParallaxSection speed={0.15} className="max-w-4xl mx-auto mb-16">
            <DOOHChart />
          </ParallaxSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
            {[
              { value: '11.5k', label: 'Screens gesamt', icon: '📺' },
              { value: '74%', label: 'Digitalisierungsgrad', icon: '💡' },
              { value: '+174%', label: 'Screen-Wachstum seit 2018', icon: '📈' },
            ].map((item, i) => (
              <FadeInText key={item.label} delay={i * 0.1}>
                <div className="exd-card exd-glow p-6 text-center">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent mb-1">{item.value}</div>
                  <div className="text-sm text-zinc-400">{item.label}</div>
                </div>
              </FadeInText>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CHAPTER 5: TOURISMUS ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Kapitel Fünf"
            title="Die Besucher"
            subtitle="35 Millionen Übernachtungen, ein COVID-Crash und ein starkes Comeback."
          />

          <div className="max-w-3xl mx-auto mb-16">
            <FadeInText>
              <p className="text-xl text-zinc-300 leading-relaxed mb-8">
                2019 war Berlin auf dem besten Weg, <span className="text-sky-400 font-semibold">35 Millionen Übernachtungen</span> zu knacken.
                Dann kam COVID — und ein Einbruch um <span className="text-red-400 font-semibold">64%</span>.
                Doch 2024 liegt Berlin erstmals über dem Vorkrisenniveau.
              </p>
            </FadeInText>
          </div>

          <ParallaxSection speed={0.15} className="max-w-4xl mx-auto mb-16">
            <TourismChart />
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
            <div className="text-sm font-mono tracking-[0.3em] uppercase text-amber-400 mb-6">Fazit</div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-amber-400 via-red-400 to-pink-500 bg-clip-text text-transparent">Berlin ist Daten</h2>
          </FadeInText>

          <FadeInText delay={0.2}>
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed mb-12 max-w-2xl mx-auto">
              Wachsende Bevölkerung, explodierende Mieten, ein lebendiges Startup-Ökosystem,
              Europas größter DOOH-Markt und Tourismus auf Rekordniveau —
              Berlin erzählt seine Geschichte am besten in Zahlen.
            </p>
          </FadeInText>

          <FadeInText delay={0.4}>
            <p className="text-lg text-zinc-500 leading-relaxed max-w-xl mx-auto mb-16">
              Und wir machen diese Zahlen <span className="text-white font-semibold">erlebbar</span>.
            </p>
          </FadeInText>

          <FadeInText delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/stories"
                className="px-8 py-4 bg-amber-600 hover:bg-amber-500 rounded-xl text-white font-semibold transition-colors shadow-lg shadow-amber-600/30"
              >
                Mehr Stories entdecken
              </a>
              <a
                href="/"
                className="px-8 py-4 border border-zinc-700 hover:border-zinc-500 rounded-xl text-zinc-300 hover:text-white font-semibold transition-colors"
              >
                Zurück zu EXD
              </a>
            </div>
          </FadeInText>
        </div>
      </section>

      <StoryNavigation currentSlug="berlin-numbers" />

      <footer className="border-t border-white/5 py-12 text-center text-zinc-600 text-sm">
        <p>Built with EXD — Data you don&apos;t just see. You feel.</p>
      </footer>
    </main>
  );
}
