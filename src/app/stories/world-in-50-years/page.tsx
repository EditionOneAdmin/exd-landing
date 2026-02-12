'use client';
import StoryNavigation from '@/components/StoryNavigation';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import ScrollySection from '@/components/story/ScrollySection';
import RacingBarChart from '@/components/visualizations/RacingBarChart';
import PopulationPyramid from '@/components/visualizations/PopulationPyramid';

// ─── Inline Demo Data ────────────────────────────────────────────────

const GDP_DATA = (() => {
  const countries = [
    { code: 'USA', name: 'United States', base: 21000 },
    { code: 'CHN', name: 'China', base: 14700 },
    { code: 'IND', name: 'India', base: 3200 },
    { code: 'DEU', name: 'Germany', base: 4200 },
    { code: 'JPN', name: 'Japan', base: 5100 },
    { code: 'GBR', name: 'United Kingdom', base: 3100 },
    { code: 'BRA', name: 'Brazil', base: 1800 },
    { code: 'IDN', name: 'Indonesia', base: 1200 },
    { code: 'NGA', name: 'Nigeria', base: 450 },
    { code: 'KOR', name: 'South Korea', base: 1800 },
  ];
  const rates: Record<string, number> = {
    USA: 1.02, CHN: 1.045, IND: 1.06, DEU: 1.015, JPN: 1.008,
    GBR: 1.018, BRA: 1.025, IDN: 1.05, NGA: 1.055, KOR: 1.025,
  };
  const years = [];
  for (let y = 2025; y <= 2075; y += 5) {
    const factor = (y - 2025) / 5;
    years.push({
      year: y,
      countries: countries
        .map(c => ({
          code: c.code,
          name: c.name,
          value: Math.round(c.base * Math.pow(rates[c.code], factor * 5) * 1e9),
        }))
        .sort((a, b) => b.value - a.value),
    });
  }
  return years;
})();

const POPULATION_DATA = (() => {
  const ageGroups = ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80+'];
  const make = (maleArr: number[], femaleArr: number[]) =>
    ageGroups.map((age, i) => ({ age, male: maleArr[i], female: femaleArr[i] }));

  return {
    JPN: {
      '2020': make([4.8, 5.2, 5.9, 7.0, 8.2, 8.5, 8.0, 6.5, 3.5], [4.6, 5.0, 5.7, 6.8, 8.0, 8.3, 8.2, 7.2, 5.2]),
      '2050': make([3.2, 3.5, 3.8, 4.2, 4.8, 5.5, 6.8, 7.5, 6.0], [3.1, 3.3, 3.6, 4.0, 4.6, 5.3, 6.9, 8.0, 8.5]),
    },
    IND: {
      '2020': make([12.5, 12.8, 11.5, 10.2, 8.5, 7.0, 5.2, 3.0, 1.2], [11.5, 11.8, 10.8, 9.5, 8.0, 6.5, 4.8, 2.8, 1.0]),
      '2050': make([9.0, 9.5, 10.2, 11.0, 10.8, 10.0, 8.5, 6.0, 3.0], [8.5, 9.0, 9.8, 10.5, 10.5, 9.8, 8.2, 6.5, 4.0]),
    },
    NGA: {
      '2020': make([18.0, 15.5, 12.0, 9.0, 6.5, 4.5, 3.0, 1.5, 0.5], [17.5, 15.0, 11.5, 8.8, 6.2, 4.3, 2.8, 1.4, 0.5]),
      '2050': make([16.0, 15.0, 14.0, 12.5, 10.0, 7.5, 5.5, 3.5, 1.5], [15.5, 14.5, 13.5, 12.0, 9.8, 7.2, 5.2, 3.8, 2.0]),
    },
    DEU: {
      '2020': make([3.8, 3.9, 4.5, 5.2, 5.8, 6.5, 5.5, 4.0, 2.5], [3.6, 3.7, 4.3, 5.0, 5.6, 6.3, 5.8, 4.5, 3.8]),
      '2050': make([3.0, 3.2, 3.5, 3.8, 4.2, 4.8, 5.5, 5.0, 4.5], [2.8, 3.0, 3.3, 3.6, 4.0, 4.6, 5.6, 5.5, 6.0]),
    },
  } as Record<string, Record<string, { age: string; male: number; female: number }[]>>;
})();

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

// CO2 Scenario mini-chart (self-contained, no external data)
function CO2ScenarioChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const scenarios = [
    { name: 'Business as Usual', color: '#ef4444', temps: [1.1, 1.4, 1.8, 2.3, 2.8, 3.4, 4.0] },
    { name: 'Moderate Action', color: '#f59e0b', temps: [1.1, 1.3, 1.5, 1.7, 1.9, 2.1, 2.2] },
    { name: 'Paris Aligned', color: '#22c55e', temps: [1.1, 1.2, 1.3, 1.4, 1.45, 1.48, 1.5] },
  ];
  const years = [2025, 2035, 2045, 2055, 2065, 2075];

  const w = 600, h = 320, px = 60, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Global Temperature Projections</h3>
      <p className="text-sm text-zinc-500 mb-6">°C above pre-industrial levels</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* Grid */}
        {[1, 2, 3, 4].map(t => (
          <g key={t}>
            <line x1={px} x2={w - px} y1={py + ch - (t / 4.5) * ch} y2={py + ch - (t / 4.5) * ch} stroke="rgba(99,102,241,0.1)" strokeDasharray="4 4" />
            <text x={px - 8} y={py + ch - (t / 4.5) * ch + 4} textAnchor="end" fill="#52525b" fontSize="11">+{t}°C</text>
          </g>
        ))}
        {/* 2°C danger line */}
        <line x1={px} x2={w - px} y1={py + ch - (2 / 4.5) * ch} y2={py + ch - (2 / 4.5) * ch} stroke="#ef444466" strokeWidth="2" strokeDasharray="8 4" />
        <text x={w - px + 4} y={py + ch - (2 / 4.5) * ch + 4} fill="#ef4444" fontSize="10">2°C limit</text>
        {/* Year labels */}
        {years.map((yr, i) => (
          <text key={yr} x={px + (i / (years.length - 1)) * cw} y={h - 8} textAnchor="middle" fill="#52525b" fontSize="11">{yr}</text>
        ))}
        {/* Scenario lines */}
        {scenarios.map(s => {
          const pts = s.temps.map((t, i) => `${px + (i / (s.temps.length - 1)) * cw},${py + ch - (t / 4.5) * ch}`).join(' ');
          return (
            <g key={s.name}>
              <motion.polyline
                points={pts}
                fill="none"
                stroke={s.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
              {/* End label */}
              <text
                x={px + cw + 6}
                y={py + ch - (s.temps[s.temps.length - 1] / 4.5) * ch + 4}
                fill={s.color}
                fontSize="10"
                fontWeight="bold"
              >
                {s.temps[s.temps.length - 1]}°C
              </text>
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {scenarios.map(s => (
          <div key={s.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
            <span className="text-xs text-zinc-400">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CO2EmissionsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  const data = [
    { name: 'China', value: 11.5, color: '#ef4444' },
    { name: 'United States', value: 5.0, color: '#6366f1' },
    { name: 'India', value: 2.9, color: '#14b8a6' },
    { name: 'EU-27', value: 2.6, color: '#22c55e' },
    { name: 'Russia', value: 1.8, color: '#ec4899' },
    { name: 'Japan', value: 1.1, color: '#f97316' },
    { name: 'Rest of World', value: 12.0, color: '#64748b' },
  ];
  const max = Math.max(...data.map(d => d.value));

  return (
    <div ref={ref} className="exd-card exd-glow p-6">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">CO₂ Emissions by Region (2024)</h3>
      <p className="text-sm text-zinc-500 mb-6">Billion tonnes CO₂</p>
      <div className="space-y-3">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-3">
            <span className="text-sm text-zinc-400 w-28 shrink-0 text-right">{d.name}</span>
            <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden">
              <motion.div
                className="h-full rounded-lg flex items-center pl-3"
                style={{ background: d.color }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${(d.value / max) * 100}%` } : {}}
                transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
              >
                <span className="text-xs font-bold text-white whitespace-nowrap">{d.value} Gt</span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

export default function WorldIn50YearsPage() {
  const [economyStep, setEconomyStep] = useState('econ-1');
  const [populationStep, setPopulationStep] = useState('pop-1');
  const [selectedCountry, setSelectedCountry] = useState('JPN');

  // GDP data to show based on step
  const gdpStepConfig: Record<string, { startIdx: number; endIdx: number }> = {
    'econ-1': { startIdx: 0, endIdx: 3 },
    'econ-2': { startIdx: 3, endIdx: 7 },
    'econ-3': { startIdx: 7, endIdx: GDP_DATA.length },
  };
  const currentGdpRange = gdpStepConfig[economyStep] || gdpStepConfig['econ-1'];
  const gdpSlice = GDP_DATA.slice(currentGdpRange.startIdx, currentGdpRange.endIdx);

  // Population pyramid country based on step
  useEffect(() => {
    const map: Record<string, string> = { 'pop-1': 'JPN', 'pop-2': 'NGA', 'pop-3': 'DEU' };
    if (map[populationStep]) setSelectedCountry(map[populationStep]);
  }, [populationStep]);

  return (
    <main className="bg-[#050507] text-white min-h-screen overflow-x-hidden">
      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl opacity-20"
              style={{
                width: 300 + i * 100,
                height: 300 + i * 100,
                background: i % 2 === 0 ? 'radial-gradient(circle, #6366f1, transparent)' : 'radial-gradient(circle, #06b6d4, transparent)',
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
            <span className="gradient-text">The World</span>
            <br />
            <span className="text-white/90">in 50 Years</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            What will the world look like in 2075?
            <br />
            Scroll to explore the forces shaping our future.
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
            In the next half-century, the world will undergo transformations more profound than any in human history.
            <span className="gradient-text font-semibold"> Economies will shift. Climates will change. Populations will age — or explode.</span>
          </p>
        </FadeInText>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard value="9.7B" label="Global Population by 2050" delay={0} />
          <StatCard value="+2.7°C" label="Projected Warming (Business as Usual)" delay={0.1} />
          <StatCard value="$180T" label="Global GDP by 2075 (projected)" delay={0.2} />
          <StatCard value="28%" label="Population over 65 in Europe by 2050" delay={0.3} />
        </div>
      </section>

      {/* ═══════ CHAPTER 1: ECONOMY ═══════ */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter One"
            title="The Economy"
            subtitle="The great rebalancing: as Asia rises, the global economic center of gravity shifts east."
          />

          <ScrollySection
            activeStep={economyStep}
            onStepChange={setEconomyStep}
            steps={[
              {
                id: 'econ-1',
                content: (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-indigo-300">2025 — The Starting Line</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      Today, the United States leads the world in GDP, with China close behind.
                      But the seeds of change have already been planted. India&apos;s growth engine is accelerating.
                    </p>
                  </div>
                ),
              },
              {
                id: 'econ-2',
                content: (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-purple-300">2050 — The Overtake</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      By mid-century, China&apos;s economy is projected to surpass the US. India leaps into the top three.
                      Indonesia, Nigeria — the new tigers emerge. The old order fractures.
                    </p>
                  </div>
                ),
              },
              {
                id: 'econ-3',
                content: (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-cyan-300">2075 — A New World</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      India could be the world&apos;s second-largest economy. Africa&apos;s share of global GDP will have doubled.
                      The question isn&apos;t <em>if</em> the shift happens — but <em>how fast</em>.
                    </p>
                  </div>
                ),
              },
            ]}
            visualization={
              <RacingBarChart
                data={gdpSlice}
                title="GDP Projections"
                subtitle="Nominal GDP in trillions (projected)"
              />
            }
          />
        </div>
      </section>

      {/* ═══════ CHAPTER 2: CLIMATE ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Two"
            title="The Climate"
            subtitle="The most consequential graph you'll ever see: three paths, three futures."
          />

          <div className="max-w-3xl mx-auto mb-16">
            <FadeInText>
              <p className="text-xl text-zinc-300 leading-relaxed mb-8">
                Every fraction of a degree matters. The difference between 1.5°C and 4°C of warming is the difference between
                <span className="text-amber-400 font-semibold"> adaptation</span> and
                <span className="text-red-400 font-semibold"> catastrophe</span>.
              </p>
            </FadeInText>
          </div>

          <ParallaxSection speed={0.15} className="max-w-4xl mx-auto mb-16">
            <CO2ScenarioChart />
          </ParallaxSection>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            <FadeInText delay={0.1}>
              <CO2EmissionsBar />
            </FadeInText>
            <FadeInText delay={0.2}>
              <div className="exd-card exd-glow p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-6 gradient-text">What +4°C Looks Like</h3>
                <ul className="space-y-4 text-zinc-400">
                  {[
                    ['🌊', 'Sea levels rise up to 1 meter, displacing 200M+ people'],
                    ['🔥', 'Extreme heat events increase 5× in frequency'],
                    ['🌾', 'Global crop yields decline 20-30%'],
                    ['🧊', 'Arctic ice-free summers become the norm'],
                    ['💨', 'Category 5 hurricanes double in frequency'],
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

      {/* ═══════ CHAPTER 3: POPULATION ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Three"
            title="The People"
            subtitle="Some nations will age. Others will boom. Demographics are destiny."
          />

          <ScrollySection
            activeStep={populationStep}
            onStepChange={setPopulationStep}
            steps={[
              {
                id: 'pop-1',
                content: (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-pink-300">🇯🇵 Japan — The Silver Tsunami</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      Japan is the canary in the coal mine. By 2050, nearly 40% of its population will be over 65.
                      The pyramid inverts — a coffin shape, demographers grimly call it.
                    </p>
                  </div>
                ),
              },
              {
                id: 'pop-2',
                content: (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-orange-300">🇳🇬 Nigeria — Youth Explosion</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      By contrast, Nigeria&apos;s population will nearly double by 2050.
                      A median age of 18. A demographic dividend — or a ticking bomb, depending on jobs and governance.
                    </p>
                  </div>
                ),
              },
              {
                id: 'pop-3',
                content: (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-blue-300">🇩🇪 Germany — The Shrinking Giant</h3>
                    <p className="text-zinc-400 leading-relaxed text-lg">
                      Europe&apos;s largest economy faces a workforce crisis. Immigration is the lifeline,
                      but political tensions make it complicated. The math is unforgiving.
                    </p>
                  </div>
                ),
              },
            ]}
            visualization={
              <PopulationPyramid
                data={{ [selectedCountry]: POPULATION_DATA[selectedCountry] || POPULATION_DATA['JPN'] }}
                title={`Population Structure: ${selectedCountry}`}
                subtitle="Millions by age group"
              />
            }
          />
        </div>
      </section>

      {/* ═══════ CHAPTER 4: CONCLUSION ═══════ */}
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
            <h2 className="text-5xl md:text-7xl font-bold mb-8 gradient-text">The Choice Is Ours</h2>
          </FadeInText>

          <FadeInText delay={0.2}>
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed mb-12 max-w-2xl mx-auto">
              The future isn&apos;t written. Every projection is a <em>possibility</em>, not a certainty.
              The decisions made in the next decade — on energy, on policy, on technology — will echo for centuries.
            </p>
          </FadeInText>

          <FadeInText delay={0.4}>
            <p className="text-lg text-zinc-500 leading-relaxed max-w-xl mx-auto mb-16">
              Data doesn&apos;t just describe the future. It helps us <span className="text-white font-semibold">shape it</span>.
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
                href="/"
                className="px-8 py-4 border border-zinc-700 hover:border-zinc-500 rounded-xl text-zinc-300 hover:text-white font-semibold transition-colors"
              >
                Back to EXD
              </a>
            </div>
          </FadeInText>
        </div>
      </section>

      <StoryNavigation currentSlug="world-in-50-years" />

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-zinc-600 text-sm">
        <p>Built with EXD — Data you don&apos;t just see. You feel.</p>
      </footer>
    </main>
  );
}
