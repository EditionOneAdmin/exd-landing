'use client';
import StoryNavigation from '@/components/StoryNavigation';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// ─── Data ────────────────────────────────────────────────────────────

const MARKET_GROWTH = [
  { year: 2018, value: 6.7 },
  { year: 2019, value: 8.3 },
  { year: 2020, value: 5.9 },
  { year: 2021, value: 9.8 },
  { year: 2022, value: 14.7 },
  { year: 2023, value: 18.7 },
  { year: 2024, value: 21.0 },
  { year: 2025, value: 23.5 },
  { year: 2026, value: 25.8 },
  { year: 2027, value: 28.2 },
  { year: 2028, value: 30.5 },
  { year: 2029, value: 33.0 },
  { year: 2030, value: 35.5 },
];

const TOP_MARKETS = [
  { country: 'United States', value: 5.8, color: '#6366f1' },
  { country: 'China', value: 4.2, color: '#ec4899' },
  { country: 'United Kingdom', value: 2.1, color: '#14b8a6' },
  { country: 'Germany', value: 1.8, color: '#f59e0b' },
  { country: 'Japan', value: 1.6, color: '#8b5cf6' },
];

const PROGRAMMATIC_SPLIT = [
  { year: 2019, programmatic: 10, traditional: 90 },
  { year: 2021, programmatic: 20, traditional: 80 },
  { year: 2023, programmatic: 35, traditional: 65 },
  { year: 2025, programmatic: 50, traditional: 50 },
  { year: 2027, programmatic: 65, traditional: 35 },
  { year: 2030, programmatic: 80, traditional: 20 },
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

function MarketGrowthChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 700, h = 360, px = 60, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const maxVal = 40;
  const minYear = 2018, maxYear = 2030;

  const toX = (year: number) => px + ((year - minYear) / (maxYear - minYear)) * cw;
  const toY = (val: number) => py + ch - (val / maxVal) * ch;

  const linePath = MARKET_GROWTH.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(d.value)}`).join(' ');
  const areaPath = linePath + ` L${toX(2030)},${py + ch} L${toX(2018)},${py + ch} Z`;

  // Split at 2023 for projected
  const projectedIdx = MARKET_GROWTH.findIndex(d => d.year === 2024);
  const solidPath = MARKET_GROWTH.slice(0, projectedIdx + 1).map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(d.value)}`).join(' ');
  const dashedPath = MARKET_GROWTH.slice(projectedIdx).map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(d.value)}`).join(' ');

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Global DOOH Market Size</h3>
      <p className="text-sm text-zinc-500 mb-6">Billions USD (2024+ projected)</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid */}
        {[0, 10, 20, 30, 40].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="rgba(99,102,241,0.1)" strokeDasharray="4 4" />
            <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="11">${v}B</text>
          </g>
        ))}
        {/* Year labels */}
        {[2018, 2020, 2022, 2024, 2026, 2028, 2030].map(yr => (
          <text key={yr} x={toX(yr)} y={h - 8} textAnchor="middle" fill="#52525b" fontSize="11">{yr}</text>
        ))}
        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill="url(#areaGrad)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5 }}
        />
        {/* Solid line (actual) */}
        <motion.path
          d={solidPath}
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        {/* Dashed line (projected) */}
        <motion.path
          d={dashedPath}
          fill="none"
          stroke="#818cf8"
          strokeWidth="3"
          strokeDasharray="8 4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.8 } : {}}
          transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
        />
        {/* Key data points */}
        {[
          MARKET_GROWTH.find(d => d.year === 2023)!,
          MARKET_GROWTH.find(d => d.year === 2030)!,
        ].map(d => (
          <g key={d.year}>
            <motion.circle
              cx={toX(d.year)} cy={toY(d.value)} r="5"
              fill={d.year <= 2023 ? '#6366f1' : '#818cf8'}
              stroke="#050507" strokeWidth="2"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: d.year <= 2023 ? 1 : 2, duration: 0.3 }}
            />
            <motion.text
              x={toX(d.year)} y={toY(d.value) - 12}
              textAnchor="middle" fill="white" fontSize="12" fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: d.year <= 2023 ? 1.2 : 2.2 }}
            >
              ${d.value}B
            </motion.text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ProgrammaticDonutChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  const [activeIdx, setActiveIdx] = useState(2); // 2023

  const data = PROGRAMMATIC_SPLIT[activeIdx];
  const r = 80, cx = 150, cy = 120, strokeW = 24;
  const circumference = 2 * Math.PI * r;
  const progLen = (data.programmatic / 100) * circumference;
  const tradLen = circumference - progLen;

  return (
    <div ref={ref} className="exd-card exd-glow p-6">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Programmatic vs Traditional</h3>
      <p className="text-sm text-zinc-500 mb-4">Share of DOOH ad spend</p>
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 300 240" className="w-full max-w-[300px]">
          {/* Traditional (background) */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={strokeW} />
          {/* Programmatic */}
          <motion.circle
            cx={cx} cy={cy} r={r} fill="none"
            stroke="#6366f1" strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={`${progLen} ${tradLen}`}
            strokeDashoffset={circumference / 4}
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={isInView ? { strokeDasharray: `${progLen} ${tradLen}` } : {}}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
          {/* Center text */}
          <text x={cx} y={cy - 8} textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">
            {data.programmatic}%
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill="#a1a1aa" fontSize="11">
            Programmatic
          </text>
        </svg>
        {/* Timeline slider */}
        <div className="flex gap-2 mt-4 flex-wrap justify-center">
          {PROGRAMMATIC_SPLIT.map((d, i) => (
            <button
              key={d.year}
              onClick={() => setActiveIdx(i)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                i === activeIdx ? 'bg-indigo-600 text-white' : 'bg-white/5 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {d.year}{d.year > 2023 ? '*' : ''}
            </button>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className="text-xs text-zinc-400">Programmatic ({data.programmatic}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <span className="text-xs text-zinc-400">Traditional ({data.traditional}%)</span>
        </div>
      </div>
    </div>
  );
}

function TopMarketsChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  const max = Math.max(...TOP_MARKETS.map(d => d.value));

  return (
    <div ref={ref} className="exd-card exd-glow p-6">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Top 5 DOOH Markets (2023)</h3>
      <p className="text-sm text-zinc-500 mb-6">Billions USD</p>
      <div className="space-y-3">
        {TOP_MARKETS.map((d, i) => (
          <div key={d.country} className="flex items-center gap-3">
            <span className="text-sm text-zinc-400 w-28 shrink-0 text-right">{d.country}</span>
            <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden">
              <motion.div
                className="h-full rounded-lg flex items-center pl-3"
                style={{ background: d.color }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${(d.value / max) * 100}%` } : {}}
                transition={{ duration: 1, delay: i * 0.12, ease: 'easeOut' }}
              >
                <span className="text-xs font-bold text-white whitespace-nowrap">${d.value}B</span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttentionComparisonChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const channels = [
    { name: 'DOOH', attention: 2.5, cpm: '$5-15', color: '#6366f1' },
    { name: 'Mobile Display', attention: 1.0, cpm: '$2-10', color: '#64748b' },
    { name: 'Social Media', attention: 1.3, cpm: '$5-25', color: '#64748b' },
    { name: 'Online Video', attention: 1.8, cpm: '$10-30', color: '#64748b' },
  ];
  const maxAtt = 3;

  return (
    <div ref={ref} className="exd-card exd-glow p-6">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Attention Index by Channel</h3>
      <p className="text-sm text-zinc-500 mb-6">Relative attention score (mobile display = 1.0x)</p>
      <div className="space-y-4">
        {channels.map((ch, i) => (
          <div key={ch.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className={ch.name === 'DOOH' ? 'text-indigo-300 font-semibold' : 'text-zinc-400'}>{ch.name}</span>
              <span className="text-zinc-500 font-mono text-xs">CPM: {ch.cpm}</span>
            </div>
            <div className="h-6 bg-white/5 rounded-lg overflow-hidden">
              <motion.div
                className="h-full rounded-lg"
                style={{ background: ch.color }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${(ch.attention / maxAtt) * 100}%` } : {}}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            </div>
            <div className="text-right text-xs text-zinc-500 mt-0.5">{ch.attention}x</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

export default function DOOHRevolutionPage() {
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
                  ? 'radial-gradient(circle, #6366f1, transparent)'
                  : i % 3 === 1
                  ? 'radial-gradient(circle, #06b6d4, transparent)'
                  : 'radial-gradient(circle, #a855f7, transparent)',
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
            className="text-sm font-mono tracking-[0.4em] uppercase text-indigo-400 mb-8"
          >
            A Data Story by EXD
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] mb-8"
          >
            <span className="gradient-text">The Rise of</span>
            <br />
            <span className="text-white/90">Digital Out-of-Home</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            From static billboards to intelligent screens.
            <br />
            How a $18.7B industry is reshaping the future of advertising.
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
            Out-of-Home advertising is the world&apos;s oldest medium — and now its fastest-evolving.
            <span className="gradient-text font-semibold"> Screens are getting smarter. Buying is going programmatic. And the data is finally catching up.</span>
          </p>
        </FadeInText>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard value="$18.7B" label="Global DOOH Market (2023)" delay={0} />
          <StatCard value="30%+" label="Programmatic YoY Growth" delay={0.1} />
          <StatCard value="2.5×" label="Attention vs Mobile Ads" delay={0.2} />
          <StatCard value="~40%" label="DOOH Share of Total OOH" delay={0.3} />
        </div>
      </section>

      {/* ═══════ CHAPTER 1: MARKET SIZE ═══════ */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter One"
            title="The Market"
            subtitle="From $6.7 billion to $35 billion in just over a decade — DOOH is the fastest-growing segment in out-of-home."
          />

          <div className="max-w-4xl mx-auto mb-16">
            <FadeInText>
              <p className="text-xl text-zinc-300 leading-relaxed mb-8">
                The pandemic briefly stalled outdoor advertising, but DOOH bounced back harder than anyone expected.
                By 2023, the global market hit <span className="text-indigo-400 font-semibold">$18.7 billion</span> — and it&apos;s
                projected to nearly double to <span className="text-cyan-400 font-semibold">$35+ billion by 2030</span>.
              </p>
            </FadeInText>
          </div>

          <ParallaxSection speed={0.15} className="max-w-4xl mx-auto mb-20">
            <MarketGrowthChart />
          </ParallaxSection>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              What&apos;s driving this growth? Three forces converge:
              <span className="text-indigo-300"> smarter screens</span>,
              <span className="text-purple-300"> programmatic buying</span>, and
              <span className="text-cyan-300"> better measurement</span>.
              Advertisers can now buy DOOH the same way they buy digital — with data, targeting, and real-time optimization.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 2: PROGRAMMATIC ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Two"
            title="The Shift"
            subtitle="Programmatic is eating traditional. The way outdoor ads are bought is changing forever."
          />

          <div className="max-w-3xl mx-auto mb-16">
            <FadeInText>
              <p className="text-xl text-zinc-300 leading-relaxed mb-8">
                In 2019, only <span className="text-zinc-500">10%</span> of DOOH was bought programmatically.
                By 2023, that figure hit <span className="text-indigo-400 font-semibold">35%</span> — growing at 30%+ year-over-year.
                By 2030, programmatic is expected to dominate with <span className="text-purple-400 font-semibold">80%</span> market share.
              </p>
            </FadeInText>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            <FadeInText delay={0.1}>
              <ProgrammaticDonutChart />
            </FadeInText>
            <FadeInText delay={0.2}>
              <div className="exd-card exd-glow p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-6 gradient-text">Why Programmatic Wins</h3>
                <ul className="space-y-4 text-zinc-400">
                  {[
                    ['⚡', 'Real-time bidding — buy impressions in milliseconds'],
                    ['🎯', 'Audience targeting with mobile & location data'],
                    ['📊', 'Measurable ROI with attribution modeling'],
                    ['🔄', 'Dynamic creative — weather, time, event triggers'],
                    ['💰', 'Lower barriers — no minimum spend, self-serve platforms'],
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

      {/* ═══════ CHAPTER 3: GLOBAL LANDSCAPE ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Three"
            title="The Map"
            subtitle="Five markets dominate — but the fastest growth is happening in unexpected places."
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            <FadeInText delay={0.1}>
              <TopMarketsChart />
            </FadeInText>
            <FadeInText delay={0.2}>
              <AttentionComparisonChart />
            </FadeInText>
          </div>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              DOOH delivers <span className="text-indigo-300 font-semibold">2.5× the attention</span> of mobile display ads,
              at a competitive CPM of <span className="text-cyan-300 font-semibold">$5–15</span>.
              It&apos;s one of the few channels where reach, attention, and cost-efficiency all align.
              For brands, it&apos;s becoming impossible to ignore.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 4: THE FUTURE ═══════ */}
      <section className="relative py-40 md:py-56">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, #6366f1, transparent 70%)',
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeInText>
            <div className="text-sm font-mono tracking-[0.3em] uppercase text-indigo-400 mb-6">Chapter Four</div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 gradient-text">The Future Is Screens</h2>
          </FadeInText>

          <FadeInText delay={0.2}>
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              Every surface is becoming a screen. Every screen is becoming addressable.
              And every impression is becoming measurable.
            </p>
          </FadeInText>

          <FadeInText delay={0.3}>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-12">
              As AI, computer vision, and real-time data converge with digital signage, DOOH is evolving from
              a broadcast medium into an <span className="text-white font-semibold">intelligent, responsive channel</span> that
              understands its audience in real time.
            </p>
          </FadeInText>

          <FadeInText delay={0.4}>
            <p className="text-lg text-zinc-500 leading-relaxed max-w-xl mx-auto mb-16">
              The billboard isn&apos;t dead. It just got a <span className="text-white font-semibold">brain</span>.
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
                href="/stories/world-in-50-years/"
                className="px-8 py-4 border border-zinc-700 hover:border-zinc-500 rounded-xl text-zinc-300 hover:text-white font-semibold transition-colors"
              >
                Next Story: The World in 50 Years
              </a>
            </div>
          </FadeInText>
        </div>
      </section>

      <StoryNavigation currentSlug="dooh-revolution" />

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-zinc-600 text-sm">
        <p>Built with EXD — Data you don&apos;t just see. You feel.</p>
      </footer>
    </main>
  );
}
