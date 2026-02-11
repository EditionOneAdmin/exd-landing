'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// ─── Data (based on IEA / IRENA / Our World in Data) ─────────────────

const RENEWABLES_BY_COUNTRY = [
  {year:2000,China:16,USA:80,Germany:37,India:14,Brazil:62,UK:3},
  {year:2004,China:34,USA:88,Germany:62,India:19,Brazil:69,UK:7},
  {year:2008,China:73,USA:118,Germany:98,India:32,Brazil:80,UK:21},
  {year:2012,China:198,USA:186,Germany:152,India:62,Brazil:102,UK:47},
  {year:2016,China:480,USA:286,Germany:196,India:120,Brazil:135,UK:87},
  {year:2020,China:895,USA:420,Germany:248,India:230,Brazil:176,UK:134},
  {year:2024,China:1480,USA:570,Germany:290,India:420,Brazil:222,UK:172},
];

const FOSSIL_VS_RENEWABLES = [
  {year:2000,fossil:80.2,renewables:3.1,nuclear:6.7,hydro:2.2,other:7.8},
  {year:2004,fossil:79.8,renewables:1.6,nuclear:6.3,hydro:2.3,other:10.0},
  {year:2008,fossil:79.0,renewables:3.1,nuclear:5.6,hydro:2.3,other:10.0},
  {year:2012,fossil:77.2,renewables:6.0,nuclear:4.4,hydro:2.4,other:10.0},
  {year:2016,fossil:74.5,renewables:8.5,nuclear:4.5,hydro:2.5,other:10.0},
  {year:2020,fossil:70.5,renewables:12.6,nuclear:4.3,hydro:2.6,other:10.0},
  {year:2024,fossil:64.8,renewables:18.7,nuclear:3.9,hydro:2.6,other:10.0},
];

const COST_DECLINE = [
  {year:2010,solar:359,wind:86,battery:1183},
  {year:2012,solar:222,wind:78,battery:707},
  {year:2014,solar:142,wind:68,battery:540},
  {year:2016,solar:96,wind:60,battery:273},
  {year:2018,solar:68,wind:52,battery:176},
  {year:2020,solar:50,wind:46,battery:140},
  {year:2022,solar:49,wind:46,battery:139},
  {year:2024,solar:37,wind:42,battery:115},
];

const MILESTONES = [
  {year:2009,name:'Solar Crosses $1/W',desc:'Utility-scale solar drops below $1 per watt manufacturing cost',color:'#f59e0b'},
  {year:2012,name:'100 GW Solar Global',desc:'Worldwide installed solar capacity hits 100 GW',color:'#06b6d4'},
  {year:2015,name:'Paris Agreement',desc:'196 nations commit to limiting warming to 1.5°C',color:'#10b981'},
  {year:2017,name:'Solar Cheapest New',desc:'Solar becomes cheapest source of new electricity in most markets',color:'#f59e0b'},
  {year:2020,name:'EU Green Deal',desc:'Europe pledges climate neutrality by 2050 with €1T investment',color:'#6366f1'},
  {year:2022,name:'IRA Signed',desc:'US Inflation Reduction Act: $369B for clean energy',color:'#8b5cf6'},
  {year:2023,name:'Renewables > 30%',desc:'Global electricity from renewables exceeds 30% for the first time',color:'#06b6d4'},
  {year:2024,name:'China 1.5 TW Solar+Wind',desc:'China passes 1,500 GW combined solar and wind capacity',color:'#ec4899'},
];

const COUNTRIES = ['China','USA','Germany','India','Brazil','UK'] as const;
const COUNTRY_COLORS: Record<string, string> = {
  China:'#ec4899',USA:'#6366f1',Germany:'#f59e0b',India:'#10b981',Brazil:'#06b6d4',UK:'#8b5cf6'
};

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

function ChapterHeading({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <FadeInText className="text-center py-32 md:py-48">
      <div className="text-sm font-mono tracking-[0.3em] uppercase text-cyan-400 mb-4">{number}</div>
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

// ─── Chart 1: Renewable Capacity by Country (Line Chart) ─────────────

function RenewablesLineChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 700, h = 400, px = 65, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const maxVal = 1600;
  const minYear = 2000, maxYear = 2024;

  const toX = (year: number) => px + ((year - minYear) / (maxYear - minYear)) * cw;
  const toY = (val: number) => py + ch - (val / maxVal) * ch;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Renewable Energy Capacity by Country</h3>
      <p className="text-sm text-zinc-500 mb-6">Installed capacity in GW (solar + wind), 2000–2024</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          {COUNTRIES.map(c => (
            <linearGradient key={c} id={`grad-${c}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COUNTRY_COLORS[c]} stopOpacity="0.15" />
              <stop offset="100%" stopColor={COUNTRY_COLORS[c]} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {/* Grid */}
        {[0, 400, 800, 1200, 1600].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="rgba(6,182,212,0.1)" strokeDasharray="4 4" />
            <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="11">{v} GW</text>
          </g>
        ))}
        {[2000, 2004, 2008, 2012, 2016, 2020, 2024].map(yr => (
          <text key={yr} x={toX(yr)} y={h - 8} textAnchor="middle" fill="#52525b" fontSize="11">{yr}</text>
        ))}
        {/* Lines */}
        {COUNTRIES.map((country, ci) => {
          const path = RENEWABLES_BY_COUNTRY.map((d, i) =>
            `${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(d[country])}`
          ).join(' ');
          const lastPt = RENEWABLES_BY_COUNTRY[RENEWABLES_BY_COUNTRY.length - 1];
          return (
            <g key={country}>
              <motion.path
                d={path}
                fill="none"
                stroke={COUNTRY_COLORS[country]}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.5, delay: ci * 0.15, ease: 'easeOut' }}
              />
              <motion.text
                x={toX(lastPt.year) + 6}
                y={toY(lastPt[country]) + 4}
                fill={COUNTRY_COLORS[country]}
                fontSize="10"
                fontWeight="bold"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.5 + ci * 0.1 }}
              >
                {country}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Chart 2: Fossil vs Renewables (Stacked Area) ────────────────────

function EnergyMixChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 700, h = 400, px = 55, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const minYear = 2000, maxYear = 2024;

  const toX = (year: number) => px + ((year - minYear) / (maxYear - minYear)) * cw;
  const toY = (pct: number) => py + ch - (pct / 100) * ch;

  const layers = [
    { key: 'fossil', label: 'Fossil Fuels', color: '#71717a' },
    { key: 'nuclear', label: 'Nuclear', color: '#8b5cf6' },
    { key: 'hydro', label: 'Hydropower', color: '#06b6d4' },
    { key: 'renewables', label: 'Wind + Solar + Other RE', color: '#10b981' },
  ] as const;

  // Build stacked areas (bottom to top: renewables, hydro, nuclear, fossil)
  const stackOrder = ['renewables', 'hydro', 'nuclear', 'fossil'] as const;
  const stackedPaths: { key: string; label: string; color: string; path: string }[] = [];

  stackOrder.forEach((layerKey) => {
    const layer = layers.find(l => l.key === layerKey)!;
    const bottomLine: string[] = [];
    const topLine: string[] = [];

    FOSSIL_VS_RENEWABLES.forEach((d, i) => {
      let cumBottom = 0;
      for (const sk of stackOrder) {
        if (sk === layerKey) break;
        cumBottom += d[sk as keyof typeof d] as number;
      }
      const cumTop = cumBottom + (d[layerKey as keyof typeof d] as number);
      topLine.push(`${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(cumTop)}`);
      bottomLine.unshift(`L${toX(d.year)},${toY(cumBottom)}`);
    });

    stackedPaths.push({
      key: layer.key,
      label: layer.label,
      color: layer.color,
      path: topLine.join(' ') + ' ' + bottomLine.join(' ') + ' Z',
    });
  });

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Global Energy Mix</h3>
      <p className="text-sm text-zinc-500 mb-6">Share of primary energy by source (%), 2000–2024</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* Grid */}
        {[0, 25, 50, 75, 100].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="rgba(6,182,212,0.08)" strokeDasharray="4 4" />
            <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="11">{v}%</text>
          </g>
        ))}
        {[2000, 2004, 2008, 2012, 2016, 2020, 2024].map(yr => (
          <text key={yr} x={toX(yr)} y={h - 8} textAnchor="middle" fill="#52525b" fontSize="11">{yr}</text>
        ))}
        {/* Stacked areas */}
        {stackedPaths.map((sp, i) => (
          <motion.path
            key={sp.key}
            d={sp.path}
            fill={sp.color}
            fillOpacity={sp.key === 'fossil' ? 0.4 : 0.6}
            stroke={sp.color}
            strokeWidth="1"
            strokeOpacity={0.5}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: i * 0.2 }}
          />
        ))}
      </svg>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {stackedPaths.map(sp => (
          <div key={sp.key} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: sp.color }} />
            <span className="text-xs text-zinc-400">{sp.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chart 3: Cost Decline (Line Chart) ──────────────────────────────

function CostDeclineChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 700, h = 400, px = 60, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const maxVal = 1250;
  const minYear = 2010, maxYear = 2024;

  const toX = (year: number) => px + ((year - minYear) / (maxYear - minYear)) * cw;
  const toY = (val: number) => py + ch - (val / maxVal) * ch;

  const series = [
    { key: 'battery' as const, label: 'Lithium-ion Battery ($/kWh)', color: '#ec4899' },
    { key: 'solar' as const, label: 'Solar PV ($/MWh)', color: '#f59e0b' },
    { key: 'wind' as const, label: 'Onshore Wind ($/MWh)', color: '#06b6d4' },
  ];

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">The Great Cost Collapse</h3>
      <p className="text-sm text-zinc-500 mb-6">Levelized cost of energy & battery prices, 2010–2024</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          {series.map(s => (
            <linearGradient key={s.key} id={`cost-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {/* Grid */}
        {[0, 250, 500, 750, 1000, 1250].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="rgba(6,182,212,0.08)" strokeDasharray="4 4" />
            <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="10">${v}</text>
          </g>
        ))}
        {[2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024].map(yr => (
          <text key={yr} x={toX(yr)} y={h - 8} textAnchor="middle" fill="#52525b" fontSize="11">{yr}</text>
        ))}
        {/* Lines + areas */}
        {series.map((s, si) => {
          const linePath = COST_DECLINE.map((d, i) =>
            `${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(d[s.key])}`
          ).join(' ');
          const areaPath = linePath + ` L${toX(2024)},${py + ch} L${toX(2010)},${py + ch} Z`;
          const first = COST_DECLINE[0];
          const last = COST_DECLINE[COST_DECLINE.length - 1];
          const decline = Math.round((1 - last[s.key] / first[s.key]) * 100);

          return (
            <g key={s.key}>
              <motion.path
                d={areaPath}
                fill={`url(#cost-${s.key})`}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 1.5, delay: si * 0.2 }}
              />
              <motion.path
                d={linePath}
                fill="none"
                stroke={s.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.5, delay: si * 0.2, ease: 'easeOut' }}
              />
              {/* Start & end labels */}
              <motion.text
                x={toX(first.year) - 4} y={toY(first[s.key]) - 8}
                textAnchor="end" fill={s.color} fontSize="10" fontWeight="bold"
                initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.5 }}
              >
                ${first[s.key]}
              </motion.text>
              <motion.text
                x={toX(last.year) + 4} y={toY(last[s.key]) + 4}
                textAnchor="start" fill={s.color} fontSize="10" fontWeight="bold"
                initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.8 }}
              >
                ${last[s.key]} (−{decline}%)
              </motion.text>
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {series.map(s => (
          <div key={s.key} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-zinc-400">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Milestones Timeline ─────────────────────────────────────────────

function EnergyMilestonesTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <div ref={ref} className="relative max-w-3xl mx-auto">
      <motion.div
        className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-green-500/50 to-indigo-500/50"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        style={{ transformOrigin: 'top' }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />
      <div className="space-y-12">
        {MILESTONES.map((m, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={m.name}
              className={`relative flex items-center gap-4 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
              initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
            >
              <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'} ml-12 md:ml-0`}>
                <div className="glass-card rounded-xl p-4 inline-block">
                  <div className="text-xs font-mono text-zinc-500 mb-1">{m.year}</div>
                  <div className="text-lg font-bold text-white mb-1">{m.name}</div>
                  <div className="text-sm text-zinc-400">{m.desc}</div>
                </div>
              </div>
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  className="w-4 h-4 rounded-full border-2 border-[#050507]"
                  style={{ backgroundColor: m.color }}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.15, type: 'spring' }}
                />
              </div>
              <div className="flex-1 hidden md:block" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────

export default function EnergyTransitionStory() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <main className="bg-[#050507] text-white min-h-screen overflow-x-hidden">
      {/* ═══════ HERO ═══════ */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #06b6d4, #10b981 30%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Floating particles (energy) */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${(i * 41) % 100}%`,
                top: `${(i * 59) % 100}%`,
                backgroundColor: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#10b981' : '#f59e0b',
              }}
              animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 2, 1] }}
              transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: i * 0.25 }}
            />
          ))}
        </div>

        <motion.div className="relative z-10 text-center px-6" style={{ opacity: heroOpacity, scale: heroScale }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-sm font-mono tracking-[0.3em] uppercase text-cyan-400 mb-6"
          >
            EXD Data Story
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6"
          >
            <span className="gradient-text">The Energy</span>
            <br />
            <span className="text-white">Transition</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10"
          >
            Solar down 90%. Wind up 10×. The biggest transformation
            in energy since the industrial revolution — told in data.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-zinc-600 text-sm"
          >
            Scroll to explore ↓
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════ CHAPTER 1: THE SCALE ═══════ */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter One"
            title="The Scale"
            subtitle="From marginal to massive — renewable energy capacity has grown exponentially in just two decades."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-16">
            <StatCard value="90%" label="Solar cost decline since 2010" delay={0} />
            <StatCard value="3,800 GW" label="Global renewable capacity (2024)" delay={0.1} />
            <StatCard value="30%+" label="Electricity from renewables" delay={0.2} />
            <StatCard value="$1.8T" label="Clean energy investment (2024)" delay={0.3} />
          </div>

          <FadeInText className="max-w-5xl mx-auto mb-20">
            <RenewablesLineChart />
          </FadeInText>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              China alone installed more renewable capacity in 2024 than the entire world had in 2010.
              With <span className="text-cyan-300 font-semibold">1,480 GW</span> of solar and wind,
              it produces more clean energy than the USA, Germany, India, Brazil, and the UK
              <span className="text-indigo-300 font-semibold"> combined</span>.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 2: THE MIX ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Two"
            title="The Shift"
            subtitle="Fossil fuels still dominate — but their share is shrinking faster than anyone predicted."
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            <FadeInText delay={0.1}>
              <EnergyMixChart />
            </FadeInText>
            <FadeInText delay={0.2} className="flex flex-col justify-center">
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">The Tipping Point</h3>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  In 2000, fossil fuels provided over 80% of global primary energy.
                  By 2024, that share has fallen to under 65% — and the decline is accelerating.
                  Every percentage point shift represents billions of tons of CO₂ avoided.
                </p>
                <ul className="space-y-3 text-zinc-300">
                  {[
                    ['⬇️', 'Fossil fuels: 80% → 65% and falling'],
                    ['☀️', 'Solar: 0% → 6.4% in just 24 years'],
                    ['💨', 'Wind: 0.3% → 7.2%, steady growth'],
                    ['⚛️', 'Nuclear: declining share despite new builds'],
                    ['🌊', 'Hydro: stable at ~2.5%, geography-limited'],
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
        </div>
      </section>

      {/* ═══════ CHAPTER 3: THE COST ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Three"
            title="The Cost Collapse"
            subtitle="The most dramatic price decline in energy history — making clean energy the cheapest option almost everywhere."
          />

          <FadeInText className="max-w-5xl mx-auto mb-16">
            <CostDeclineChart />
          </FadeInText>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              Solar PV costs have plummeted <span className="text-amber-300 font-semibold">90%</span> since 2010 —
              from $359 to $37 per MWh. Lithium-ion batteries fell even faster:
              <span className="text-pink-300 font-semibold"> $1,183 to $115 per kWh</span>, a 90% decline
              that makes electric vehicles and grid storage economically inevitable.
              This isn&apos;t policy. It&apos;s physics and manufacturing scale.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 4: MILESTONES ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Four"
            title="The Milestones"
            subtitle="Key moments that shaped the global energy transition — policy, technology, and scale breakthroughs."
          />

          <div className="mb-32">
            <EnergyMilestonesTimeline />
          </div>
        </div>
      </section>

      {/* ═══════ CLOSING ═══════ */}
      <section className="relative py-40 md:py-56">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, #06b6d4, transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeInText>
            <div className="text-sm font-mono tracking-[0.3em] uppercase text-cyan-400 mb-6">The Horizon</div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 gradient-text">The Future Is Electric</h2>
          </FadeInText>

          <FadeInText delay={0.2}>
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              By 2030, renewables will generate over half the world&apos;s electricity.
              By 2050, the energy system will be unrecognizable. The transition
              isn&apos;t coming — it&apos;s already here.
            </p>
          </FadeInText>

          <FadeInText delay={0.3}>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-12">
              The question is no longer if, but how fast. And who leads.
            </p>
          </FadeInText>

          <FadeInText delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-semibold transition-colors shadow-lg shadow-cyan-600/30"
              >
                Explore More Stories
              </a>
              <a
                href="/stories/rise-of-ai/"
                className="px-8 py-4 border border-zinc-700 hover:border-zinc-500 rounded-xl text-zinc-300 hover:text-white font-semibold transition-colors"
              >
                Next: The Rise of AI
              </a>
            </div>
          </FadeInText>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-zinc-600 text-sm">
        <p>Built with EXD — Data you don&apos;t just see. You feel.</p>
      </footer>
    </main>
  );
}
