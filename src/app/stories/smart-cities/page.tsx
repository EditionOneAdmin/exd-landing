'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// ─── Data ────────────────────────────────────────────────────────────

const SMART_CITY_SPENDING = [
  { city: 'Singapore', spend: 2.8, color: '#818cf8' },
  { city: 'Seoul', spend: 2.5, color: '#6366f1' },
  { city: 'Barcelona', spend: 2.1, color: '#a78bfa' },
  { city: 'Dubai', spend: 2.0, color: '#c084fc' },
  { city: 'London', spend: 1.9, color: '#06b6d4' },
  { city: 'NYC', spend: 1.7, color: '#22d3ee' },
  { city: 'Shanghai', spend: 1.6, color: '#818cf8' },
  { city: 'Tokyo', spend: 1.5, color: '#6366f1' },
  { city: 'Berlin', spend: 1.2, color: '#a78bfa' },
  { city: 'Amsterdam', spend: 1.1, color: '#c084fc' },
];

const DOOH_GROWTH = [
  { year: 2020, value: 18 },
  { year: 2021, value: 20 },
  { year: 2022, value: 23 },
  { year: 2023, value: 26 },
  { year: 2024, value: 29 },
  { year: 2025, value: 32 },
  { year: 2026, value: 35 },
  { year: 2027, value: 38 },
  { year: 2028, value: 40 },
  { year: 2029, value: 43 },
  { year: 2030, value: 45 },
];

const SENSOR_DENSITY = [
  { city: 'Singapore', sensors: 1200, size: 80, x: 65, y: 25, color: '#818cf8' },
  { city: 'Seoul', sensors: 980, size: 70, x: 50, y: 35, color: '#6366f1' },
  { city: 'London', sensors: 850, size: 64, x: 25, y: 30, color: '#06b6d4' },
  { city: 'Barcelona', sensors: 720, size: 58, x: 30, y: 55, color: '#a78bfa' },
  { city: 'NYC', sensors: 680, size: 55, x: 15, y: 45, color: '#22d3ee' },
  { city: 'Tokyo', sensors: 640, size: 52, x: 75, y: 45, color: '#c084fc' },
  { city: 'Dubai', sensors: 580, size: 48, x: 45, y: 60, color: '#818cf8' },
  { city: 'Shanghai', sensors: 520, size: 45, x: 70, y: 55, color: '#6366f1' },
  { city: 'Berlin', sensors: 420, size: 40, x: 35, y: 40, color: '#a78bfa' },
  { city: 'Amsterdam', sensors: 380, size: 37, x: 28, y: 20, color: '#22d3ee' },
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

// ─── Chart 1: Smart City Spending (Bar Chart) ────────────────────────

function SmartCitySpendingChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  const maxSpend = 3;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Smart City Infrastructure Investment</h3>
      <p className="text-sm text-zinc-500 mb-6">Estimated annual digital infrastructure spending (Billion USD)</p>
      <div className="space-y-3">
        {SMART_CITY_SPENDING.map((d, i) => (
          <div key={d.city} className="flex items-center gap-3">
            <div className="w-24 text-right text-sm text-zinc-400 shrink-0">{d.city}</div>
            <div className="flex-1 relative h-8 bg-white/5 rounded-lg overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-lg"
                style={{ backgroundColor: d.color }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${(d.spend / maxSpend) * 100}%` } : {}}
                transition={{ duration: 1, delay: i * 0.08, ease: 'easeOut' }}
              />
              <motion.span
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 + i * 0.08 }}
              >
                ${d.spend}B
              </motion.span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chart 2: DOOH Growth (Line Chart) ───────────────────────────────

function DOOHGrowthChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 700, h = 400, px = 60, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const minYear = 2020, maxYear = 2030;
  const maxVal = 50;

  const toX = (year: number) => px + ((year - minYear) / (maxYear - minYear)) * cw;
  const toY = (val: number) => py + ch - (val / maxVal) * ch;

  const linePath = DOOH_GROWTH.map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(d.value)}`
  ).join(' ');

  const areaPath = linePath + ` L${toX(2030)},${py + ch} L${toX(2020)},${py + ch} Z`;

  // Divider between actual (2024) and projected
  const dividerX = toX(2024);

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Digital Out-of-Home Advertising</h3>
      <p className="text-sm text-zinc-500 mb-6">Global DOOH market size (Billion USD), 2020–2030</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          <linearGradient id="dooh-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid */}
        {[0, 10, 20, 30, 40, 50].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="rgba(99,102,241,0.1)" strokeDasharray="4 4" />
            <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="11">${v}B</text>
          </g>
        ))}
        {[2020, 2022, 2024, 2026, 2028, 2030].map(yr => (
          <text key={yr} x={toX(yr)} y={h - 8} textAnchor="middle" fill="#52525b" fontSize="11">{yr}</text>
        ))}
        {/* Projected zone */}
        <rect x={dividerX} y={py} width={toX(2030) - dividerX} height={ch} fill="rgba(99,102,241,0.03)" />
        <line x1={dividerX} x2={dividerX} y1={py} y2={py + ch} stroke="rgba(99,102,241,0.3)" strokeDasharray="6 4" />
        <text x={dividerX + 8} y={py + 14} fill="#6366f1" fontSize="10" opacity="0.6">Projected →</text>
        {/* Area */}
        <motion.path
          d={areaPath}
          fill="url(#dooh-gradient)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5 }}
        />
        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
        {/* Data points */}
        {DOOH_GROWTH.map((d, i) => (
          <motion.circle
            key={d.year}
            cx={toX(d.year)}
            cy={toY(d.value)}
            r="4"
            fill="#6366f1"
            stroke="#050507"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 1.5 + i * 0.05 }}
          />
        ))}
        {/* Start & end labels */}
        <motion.text
          x={toX(2020)} y={toY(18) - 12}
          textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 2 }}
        >
          $18B
        </motion.text>
        <motion.text
          x={toX(2030)} y={toY(45) - 12}
          textAnchor="middle" fill="#c084fc" fontSize="12" fontWeight="bold"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 2.2 }}
        >
          $45B
        </motion.text>
      </svg>
    </div>
  );
}

// ─── Chart 3: Sensor Density (Bubble Chart) ──────────────────────────

function SensorDensityChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 700, h = 500;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">IoT Sensor Density</h3>
      <p className="text-sm text-zinc-500 mb-6">Connected sensors per square kilometer by city</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {SENSOR_DENSITY.map((d, i) => {
          const cx = (d.x / 100) * w;
          const cy = (d.y / 100) * h;
          return (
            <g key={d.city}>
              {/* Glow */}
              <motion.circle
                cx={cx} cy={cy} r={d.size * 0.8}
                fill={d.color}
                fillOpacity={0.08}
                initial={{ scale: 0 }}
                animate={isInView ? { scale: [0, 1.3, 1] } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
              />
              {/* Main bubble */}
              <motion.circle
                cx={cx} cy={cy} r={d.size * 0.5}
                fill={d.color}
                fillOpacity={0.25}
                stroke={d.color}
                strokeWidth="1.5"
                strokeOpacity={0.6}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 200 }}
              />
              {/* Label */}
              <motion.text
                x={cx} y={cy - d.size * 0.5 - 8}
                textAnchor="middle" fill={d.color} fontSize="11" fontWeight="bold"
                initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                {d.city}
              </motion.text>
              <motion.text
                x={cx} y={cy + 4}
                textAnchor="middle" fill="white" fontSize="10" fontWeight="bold"
                initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                {d.sensors}
              </motion.text>
              <motion.text
                x={cx} y={cy + 16}
                textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8"
                initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                /km²
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────

export default function SmartCitiesStory() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <main className="bg-[#050507] text-white min-h-screen overflow-x-hidden">
      {/* ═══════ HERO ═══════ */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #6366f1, #06b6d4 30%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <svg className="w-full h-full">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.line
                key={`h-${i}`}
                x1="0" x2="100%"
                y1={`${i * 5}%`} y2={`${i * 5}%`}
                stroke="#6366f1" strokeWidth="0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 4, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.line
                key={`v-${i}`}
                y1="0" y2="100%"
                x1={`${i * 5}%`} x2={`${i * 5}%`}
                stroke="#06b6d4" strokeWidth="0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 4, delay: i * 0.15, repeat: Infinity }}
              />
            ))}
          </svg>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${(i * 47) % 100}%`,
                top: `${(i * 53) % 100}%`,
                backgroundColor: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#06b6d4' : '#c084fc',
              }}
              animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 2, 1] }}
              transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>

        <motion.div className="relative z-10 text-center px-6" style={{ opacity: heroOpacity, scale: heroScale }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-sm font-mono tracking-[0.3em] uppercase text-indigo-400 mb-6"
          >
            EXD Data Story
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6"
          >
            <span className="gradient-text">Smart Cities</span>
            <br />
            <span className="text-white/90">&amp; Digital Infra</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10"
          >
            By 2050, 68% of humanity will live in cities.
            The question isn&apos;t whether cities go digital — it&apos;s how fast.
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

      {/* ═══════ CHAPTER 1: THE INVESTMENT ═══════ */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter One"
            title="The Investment"
            subtitle="Cities worldwide are pouring billions into digital infrastructure — from IoT networks to intelligent transport systems."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-16">
            <StatCard value="68%" label="World population in cities by 2050" delay={0} />
            <StatCard value="$189B" label="Global smart city spending (2024)" delay={0.1} />
            <StatCard value="25B+" label="Connected IoT devices worldwide" delay={0.2} />
            <StatCard value="5G" label="Backbone of the urban data layer" delay={0.3} />
          </div>

          <FadeInText className="max-w-5xl mx-auto mb-20">
            <SmartCitySpendingChart />
          </FadeInText>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              Singapore leads the pack with <span className="text-indigo-300 font-semibold">$2.8 billion</span> in annual
              digital infrastructure investment — building a &quot;digital twin&quot; of the entire city-state.
              Seoul and Barcelona follow with ambitious sensor networks and open data platforms
              that are redefining what <span className="text-cyan-300 font-semibold">urban intelligence</span> looks like.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 2: DOOH ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Two"
            title="The Screens"
            subtitle="Digital Out-of-Home advertising is exploding — and programmatic DOOH is the game-changer."
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            <FadeInText delay={0.1}>
              <DOOHGrowthChart />
            </FadeInText>
            <FadeInText delay={0.2} className="flex flex-col justify-center">
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Programmatic DOOH</h3>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  The DOOH market is projected to grow from $18B in 2020 to $45B by 2030 — a
                  <span className="text-indigo-300 font-semibold"> 150% increase</span>. The real revolution?
                  Programmatic buying, which brings real-time bidding, audience targeting, and dynamic
                  creative to the physical world.
                </p>
                <ul className="space-y-3 text-zinc-300">
                  {[
                    ['📺', 'Digital signage replacing static billboards globally'],
                    ['🎯', 'Programmatic DOOH: real-time, data-driven ad placement'],
                    ['📊', 'Audience measurement via mobile data & computer vision'],
                    ['🔄', 'Dynamic creatives adapt to weather, time & events'],
                    ['🌐', 'Connected screens form a new urban data layer'],
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

      {/* ═══════ CHAPTER 3: SENSORS ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Three"
            title="The Sensors"
            subtitle="The invisible nervous system of smart cities — IoT sensors measuring everything from air quality to traffic flow."
          />

          <FadeInText className="max-w-5xl mx-auto mb-16">
            <SensorDensityChart />
          </FadeInText>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              Singapore deploys over <span className="text-indigo-300 font-semibold">1,200 sensors per km²</span>,
              monitoring everything from flood levels to pedestrian density in real time.
              This data feeds into city-wide dashboards that enable
              <span className="text-cyan-300 font-semibold"> predictive governance</span> —
              solving problems before citizens even notice them.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CLOSING ═══════ */}
      <section className="relative py-40 md:py-56">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, #6366f1, transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeInText>
            <div className="text-sm font-mono tracking-[0.3em] uppercase text-indigo-400 mb-6">The Vision</div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 gradient-text">Built Today,<br />Lived Tomorrow</h2>
          </FadeInText>

          <FadeInText delay={0.2}>
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              The city of tomorrow is being built today. From sensor grids to digital signage networks,
              urban spaces are becoming programmable platforms.
            </p>
          </FadeInText>

          <FadeInText delay={0.3}>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-12">
              EXD helps you see the data behind the transformation.
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
                href="/stories/energy-transition/"
                className="px-8 py-4 border border-zinc-700 hover:border-zinc-500 rounded-xl text-zinc-300 hover:text-white font-semibold transition-colors"
              >
                Next: The Energy Transition
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
