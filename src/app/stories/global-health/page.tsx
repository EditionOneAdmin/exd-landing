'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// ─── Data: Life Expectancy by Region (World Bank) ────────────────────

const LIFE_EXPECTANCY = [
  { year: 1960, Africa: 40.0, Europe: 68.6, Asia: 45.2, Americas: 60.1 },
  { year: 1965, Africa: 42.1, Europe: 69.8, Asia: 48.5, Americas: 61.8 },
  { year: 1970, Africa: 44.0, Europe: 70.5, Asia: 52.7, Americas: 63.2 },
  { year: 1975, Africa: 46.1, Europe: 71.1, Asia: 56.3, Americas: 64.8 },
  { year: 1980, Africa: 48.0, Europe: 71.7, Asia: 59.6, Americas: 66.5 },
  { year: 1985, Africa: 49.4, Europe: 72.3, Asia: 61.6, Americas: 68.0 },
  { year: 1990, Africa: 50.3, Europe: 72.6, Asia: 63.3, Americas: 69.5 },
  { year: 1995, Africa: 49.8, Europe: 72.2, Asia: 65.0, Americas: 71.0 },
  { year: 2000, Africa: 50.0, Europe: 73.5, Asia: 66.8, Americas: 72.5 },
  { year: 2005, Africa: 52.4, Europe: 75.0, Asia: 68.5, Americas: 73.8 },
  { year: 2010, Africa: 56.0, Europe: 76.5, Asia: 70.2, Americas: 75.0 },
  { year: 2015, Africa: 59.5, Europe: 77.5, Asia: 72.0, Americas: 75.8 },
  { year: 2020, Africa: 61.5, Europe: 77.2, Asia: 73.2, Americas: 74.0 },
  { year: 2023, Africa: 62.7, Europe: 78.0, Asia: 74.0, Americas: 75.5 },
];

const REGIONS = ['Africa', 'Europe', 'Asia', 'Americas'] as const;
const REGION_COLORS: Record<string, string> = {
  Africa: '#a855f7', Europe: '#6366f1', Asia: '#06b6d4', Americas: '#ec4899',
};

// ─── Data: Healthcare Spending vs Life Expectancy (WHO/World Bank 2021) ──

const HEALTH_SPENDING = [
  { country: 'USA', spending: 16.6, lifeExp: 77.0, pop: 331 },
  { country: 'Switzerland', spending: 11.8, lifeExp: 83.4, pop: 8.7 },
  { country: 'Germany', spending: 12.8, lifeExp: 80.6, pop: 83 },
  { country: 'France', spending: 12.2, lifeExp: 82.5, pop: 67 },
  { country: 'Japan', spending: 10.7, lifeExp: 84.8, pop: 125 },
  { country: 'UK', spending: 11.9, lifeExp: 80.7, pop: 67 },
  { country: 'Canada', spending: 12.2, lifeExp: 81.7, pop: 38 },
  { country: 'Australia', spending: 10.6, lifeExp: 83.0, pop: 25 },
  { country: 'Sweden', spending: 10.9, lifeExp: 83.0, pop: 10 },
  { country: 'Norway', spending: 11.3, lifeExp: 83.2, pop: 5 },
  { country: 'South Korea', spending: 8.4, lifeExp: 83.7, pop: 52 },
  { country: 'Spain', spending: 10.7, lifeExp: 83.0, pop: 47 },
  { country: 'Italy', spending: 9.0, lifeExp: 82.9, pop: 59 },
  { country: 'Israel', spending: 8.3, lifeExp: 82.6, pop: 9 },
  { country: 'Portugal', spending: 10.6, lifeExp: 81.1, pop: 10 },
  { country: 'Chile', spending: 9.3, lifeExp: 78.9, pop: 19 },
  { country: 'Costa Rica', spending: 7.3, lifeExp: 80.3, pop: 5 },
  { country: 'Cuba', spending: 11.2, lifeExp: 78.8, pop: 11 },
  { country: 'Mexico', spending: 5.4, lifeExp: 75.1, pop: 128 },
  { country: 'Brazil', spending: 9.6, lifeExp: 75.4, pop: 212 },
  { country: 'China', spending: 5.6, lifeExp: 78.2, pop: 1412 },
  { country: 'India', spending: 3.0, lifeExp: 70.2, pop: 1408 },
  { country: 'Indonesia', spending: 3.4, lifeExp: 71.7, pop: 273 },
  { country: 'Turkey', spending: 4.6, lifeExp: 76.0, pop: 84 },
  { country: 'Thailand', spending: 4.4, lifeExp: 78.7, pop: 70 },
  { country: 'South Africa', spending: 9.1, lifeExp: 64.9, pop: 59 },
  { country: 'Nigeria', spending: 3.0, lifeExp: 52.7, pop: 211 },
  { country: 'Ethiopia', spending: 3.5, lifeExp: 65.0, pop: 115 },
  { country: 'Russia', spending: 7.6, lifeExp: 73.2, pop: 144 },
  { country: 'Poland', spending: 6.5, lifeExp: 77.4, pop: 38 },
];

// ─── Data: Disease Burden Shift (GBD/IHME) ───────────────────────────

const DISEASE_BURDEN = [
  { year: 1990, infectious: 44.2, ncd: 42.8, injuries: 13.0 },
  { year: 1995, infectious: 42.5, ncd: 44.0, injuries: 13.5 },
  { year: 2000, infectious: 40.0, ncd: 46.5, injuries: 13.5 },
  { year: 2005, infectious: 35.5, ncd: 50.2, injuries: 14.3 },
  { year: 2010, infectious: 30.2, ncd: 55.8, injuries: 14.0 },
  { year: 2015, infectious: 25.1, ncd: 61.0, injuries: 13.9 },
  { year: 2019, infectious: 22.0, ncd: 64.3, injuries: 13.7 },
  { year: 2023, infectious: 20.5, ncd: 66.0, injuries: 13.5 },
];

const BURDEN_LAYERS = [
  { key: 'ncd' as const, label: 'Non-communicable diseases', color: '#6366f1' },
  { key: 'infectious' as const, label: 'Infectious diseases', color: '#a855f7' },
  { key: 'injuries' as const, label: 'Injuries', color: '#06b6d4' },
] as const;

// ─── Data: Vaccination Coverage by Region (WHO/UNICEF) ───────────────

const VACCINATION_DATA = [
  { decade: '1980s', Africa: 22, Europe: 78, Asia: 45, Americas: 65, label: '1980' },
  { decade: '1990s', Africa: 48, Europe: 90, Asia: 72, Americas: 82, label: '1990' },
  { decade: '2000s', Africa: 62, Europe: 93, Asia: 82, Americas: 90, label: '2000' },
  { decade: '2010s', Africa: 72, Europe: 94, Asia: 88, Americas: 92, label: '2010' },
  { decade: '2020s', Africa: 74, Europe: 93, Asia: 90, Americas: 88, label: '2020' },
];

// ─── Data: Mental Health DALYs (IHME GBD) ────────────────────────────

const MENTAL_HEALTH = [
  { year: 1990, dalys: 80.8 },
  { year: 1995, dalys: 88.2 },
  { year: 2000, dalys: 96.5 },
  { year: 2005, dalys: 105.3 },
  { year: 2010, dalys: 116.4 },
  { year: 2015, dalys: 128.9 },
  { year: 2019, dalys: 140.2 },
  { year: 2020, dalys: 152.8 },
  { year: 2023, dalys: 163.5 },
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
      <div className="text-sm font-mono tracking-[0.3em] uppercase text-purple-400 mb-4">{number}</div>
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

// ─── Chart 1: Life Expectancy Line Chart ─────────────────────────────

function LifeExpectancyChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 700, h = 400, px = 55, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const minYear = 1960, maxYear = 2023;
  const minVal = 35, maxVal = 85;

  const toX = (year: number) => px + ((year - minYear) / (maxYear - minYear)) * cw;
  const toY = (val: number) => py + ch - ((val - minVal) / (maxVal - minVal)) * ch;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Life Expectancy by Region</h3>
      <p className="text-sm text-zinc-500 mb-6">Years of life at birth, 1960–2023 (World Bank)</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* Grid */}
        {[40, 50, 60, 70, 80].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="rgba(139,92,246,0.1)" strokeDasharray="4 4" />
            <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="11">{v}</text>
          </g>
        ))}
        {[1960, 1970, 1980, 1990, 2000, 2010, 2020].map(yr => (
          <text key={yr} x={toX(yr)} y={h - 8} textAnchor="middle" fill="#52525b" fontSize="11">{yr}</text>
        ))}
        {/* HIV/AIDS annotation */}
        <motion.g initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2 }}>
          <line x1={toX(1995)} y1={toY(49.8)} x2={toX(1995)} y2={toY(55)} stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3" />
          <text x={toX(1995) + 4} y={toY(56)} fill="#a855f7" fontSize="9" fontWeight="bold">HIV/AIDS crisis</text>
        </motion.g>
        {/* COVID annotation */}
        <motion.g initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2.2 }}>
          <line x1={toX(2020)} y1={toY(74)} x2={toX(2020)} y2={toY(80)} stroke="#ec4899" strokeWidth="1" strokeDasharray="3 3" />
          <text x={toX(2020) - 4} y={toY(81)} fill="#ec4899" fontSize="9" fontWeight="bold" textAnchor="end">COVID-19</text>
        </motion.g>
        {/* Lines */}
        {REGIONS.map((region, ri) => {
          const path = LIFE_EXPECTANCY.map((d, i) =>
            `${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(d[region])}`
          ).join(' ');
          const last = LIFE_EXPECTANCY[LIFE_EXPECTANCY.length - 1];
          return (
            <g key={region}>
              <motion.path
                d={path}
                fill="none"
                stroke={REGION_COLORS[region]}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 2, delay: ri * 0.2, ease: 'easeOut' }}
              />
              <motion.text
                x={toX(last.year) + 6}
                y={toY(last[region]) + 4}
                fill={REGION_COLORS[region]}
                fontSize="10"
                fontWeight="bold"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 2 + ri * 0.1 }}
              >
                {region} ({last[region]})
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Chart 2: Healthcare Spending Scatter Plot ───────────────────────

function HealthcareScatterPlot() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 700, h = 450, px = 55, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const minX = 2, maxX = 18, minY = 50, maxY = 86;

  const toSvgX = (val: number) => px + ((val - minX) / (maxX - minX)) * cw;
  const toSvgY = (val: number) => py + ch - ((val - minY) / (maxY - minY)) * ch;
  const toR = (pop: number) => Math.max(4, Math.min(18, Math.sqrt(pop) * 0.8));

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Healthcare Spending vs. Life Expectancy</h3>
      <p className="text-sm text-zinc-500 mb-6">% of GDP on health vs. years of life — bubble size = population (WHO/World Bank, 2021)</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* Grid */}
        {[55, 60, 65, 70, 75, 80, 85].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={toSvgY(v)} y2={toSvgY(v)} stroke="rgba(139,92,246,0.08)" strokeDasharray="4 4" />
            <text x={px - 8} y={toSvgY(v) + 4} textAnchor="end" fill="#52525b" fontSize="10">{v} yr</text>
          </g>
        ))}
        {[4, 6, 8, 10, 12, 14, 16].map(v => (
          <g key={v}>
            <line x1={toSvgX(v)} x2={toSvgX(v)} y1={py} y2={py + ch} stroke="rgba(139,92,246,0.08)" strokeDasharray="4 4" />
            <text x={toSvgX(v)} y={h - 8} textAnchor="middle" fill="#52525b" fontSize="10">{v}%</text>
          </g>
        ))}
        {/* Axis labels */}
        <text x={w / 2} y={h} textAnchor="middle" fill="#71717a" fontSize="11">Health Expenditure (% of GDP)</text>
        <text x={12} y={h / 2} textAnchor="middle" fill="#71717a" fontSize="11" transform={`rotate(-90, 12, ${h / 2})`}>Life Expectancy (years)</text>
        {/* Trend line (approximate) */}
        <motion.line
          x1={toSvgX(3)} y1={toSvgY(65)}
          x2={toSvgX(13)} y2={toSvgY(83)}
          stroke="rgba(139,92,246,0.2)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
        />
        {/* Bubbles */}
        {HEALTH_SPENDING.map((d, i) => {
          const isUSA = d.country === 'USA';
          const color = isUSA ? '#ec4899' : d.lifeExp > 80 ? '#6366f1' : d.lifeExp > 70 ? '#06b6d4' : '#a855f7';
          return (
            <g key={d.country}>
              <motion.circle
                cx={toSvgX(d.spending)}
                cy={toSvgY(d.lifeExp)}
                r={toR(d.pop)}
                fill={color}
                fillOpacity={isUSA ? 0.8 : 0.5}
                stroke={isUSA ? '#ec4899' : color}
                strokeWidth={isUSA ? 2 : 1}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 200 }}
              />
              {(isUSA || d.country === 'Japan' || d.country === 'Nigeria' || d.country === 'India' || d.country === 'China' || d.country === 'South Korea' || d.country === 'Costa Rica') && (
                <motion.text
                  x={toSvgX(d.spending) + (isUSA ? 0 : toR(d.pop) + 4)}
                  y={toSvgY(d.lifeExp) + (isUSA ? -toR(d.pop) - 6 : 3)}
                  textAnchor={isUSA ? 'middle' : 'start'}
                  fill={isUSA ? '#ec4899' : '#a1a1aa'}
                  fontSize={isUSA ? '11' : '9'}
                  fontWeight={isUSA ? 'bold' : 'normal'}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.8 }}
                >
                  {d.country}
                </motion.text>
              )}
            </g>
          );
        })}
        {/* USA callout */}
        <motion.g initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2.2 }}>
          <rect x={toSvgX(13.5)} y={toSvgY(79)} width="130" height="36" rx="6" fill="rgba(236,72,153,0.15)" stroke="#ec4899" strokeWidth="0.5" />
          <text x={toSvgX(13.5) + 8} y={toSvgY(79) + 15} fill="#ec4899" fontSize="9" fontWeight="bold">🇺🇸 USA: Spends most,</text>
          <text x={toSvgX(13.5) + 8} y={toSvgY(79) + 28} fill="#ec4899" fontSize="9">lives less than peers</text>
        </motion.g>
      </svg>
    </div>
  );
}

// ─── Chart 3: Disease Burden Stacked Area ────────────────────────────

function DiseaseBurdenChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 700, h = 400, px = 55, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const minYear = 1990, maxYear = 2023;

  const toX = (year: number) => px + ((year - minYear) / (maxYear - minYear)) * cw;
  const toY = (pct: number) => py + ch - (pct / 100) * ch;

  const stackOrder = ['ncd', 'infectious', 'injuries'] as const;
  const stackedPaths: { key: string; label: string; color: string; path: string }[] = [];

  stackOrder.forEach((layerKey) => {
    const layer = BURDEN_LAYERS.find(l => l.key === layerKey)!;
    const topLine: string[] = [];
    const bottomLine: string[] = [];

    DISEASE_BURDEN.forEach((d, i) => {
      let cumBottom = 0;
      for (const sk of stackOrder) {
        if (sk === layerKey) break;
        cumBottom += d[sk];
      }
      const cumTop = cumBottom + d[layerKey];
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
      <h3 className="text-xl font-bold exd-gradient-text mb-1">The Global Disease Burden Shift</h3>
      <p className="text-sm text-zinc-500 mb-6">Share of global DALYs by cause (%), 1990–2023 (IHME GBD)</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {[0, 25, 50, 75, 100].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="rgba(139,92,246,0.08)" strokeDasharray="4 4" />
            <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="11">{v}%</text>
          </g>
        ))}
        {[1990, 1995, 2000, 2005, 2010, 2015, 2020].map(yr => (
          <text key={yr} x={toX(yr)} y={h - 8} textAnchor="middle" fill="#52525b" fontSize="11">{yr}</text>
        ))}
        {stackedPaths.map((sp, i) => (
          <motion.path
            key={sp.key}
            d={sp.path}
            fill={sp.color}
            fillOpacity={0.55}
            stroke={sp.color}
            strokeWidth="1"
            strokeOpacity={0.6}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: i * 0.2 }}
          />
        ))}
        {/* Labels on areas */}
        <motion.text x={toX(2010)} y={toY(33)} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.8 } : {}} transition={{ delay: 1.5 }}>
          NCDs ↑
        </motion.text>
        <motion.text x={toX(2010)} y={toY(80)} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.8 } : {}} transition={{ delay: 1.7 }}>
          Infectious ↓
        </motion.text>
      </svg>
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {BURDEN_LAYERS.map(l => (
          <div key={l.key} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color }} />
            <span className="text-xs text-zinc-400">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chart 4: Vaccination Coverage Grouped Bars ──────────────────────

function VaccinationChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 700, h = 400, px = 55, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const barGroupWidth = cw / VACCINATION_DATA.length;
  const barWidth = barGroupWidth / 5.5;
  const maxVal = 100;

  const toY = (val: number) => py + ch - (val / maxVal) * ch;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Vaccination Coverage by Region</h3>
      <p className="text-sm text-zinc-500 mb-6">DPT3 immunization coverage (%), by decade (WHO/UNICEF)</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {[0, 25, 50, 75, 100].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="rgba(139,92,246,0.08)" strokeDasharray="4 4" />
            <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="11">{v}%</text>
          </g>
        ))}
        {VACCINATION_DATA.map((group, gi) => {
          const groupX = px + gi * barGroupWidth + barGroupWidth / 2;
          return (
            <g key={group.decade}>
              <text x={groupX} y={h - 8} textAnchor="middle" fill="#52525b" fontSize="11">{group.label}</text>
              {REGIONS.map((region, ri) => {
                const barX = groupX - (REGIONS.length * barWidth) / 2 + ri * barWidth;
                const barH = (group[region] / maxVal) * ch;
                return (
                  <motion.rect
                    key={region}
                    x={barX}
                    y={toY(group[region])}
                    width={barWidth - 2}
                    height={barH}
                    rx={2}
                    fill={REGION_COLORS[region]}
                    fillOpacity={0.75}
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    style={{ transformOrigin: `${barX}px ${py + ch}px` }}
                    transition={{ duration: 0.8, delay: gi * 0.15 + ri * 0.05, ease: 'easeOut' }}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {REGIONS.map(r => (
          <div key={r} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: REGION_COLORS[r] }} />
            <span className="text-xs text-zinc-400">{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chart 5: Mental Health DALYs ────────────────────────────────────

function MentalHealthChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 700, h = 380, px = 65, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const minYear = 1990, maxYear = 2023;
  const minVal = 70, maxVal = 175;

  const toX = (year: number) => px + ((year - minYear) / (maxYear - minYear)) * cw;
  const toY = (val: number) => py + ch - ((val - minVal) / (maxVal - minVal)) * ch;

  const linePath = MENTAL_HEALTH.map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(d.dalys)}`
  ).join(' ');
  const areaPath = linePath + ` L${toX(2023)},${py + ch} L${toX(1990)},${py + ch} Z`;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">The Silent Pandemic: Mental Health</h3>
      <p className="text-sm text-zinc-500 mb-6">Global DALYs from mental health disorders (millions), 1990–2023 (IHME GBD)</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          <linearGradient id="mental-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[80, 100, 120, 140, 160].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="rgba(139,92,246,0.08)" strokeDasharray="4 4" />
            <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="10">{v}M</text>
          </g>
        ))}
        {[1990, 1995, 2000, 2005, 2010, 2015, 2020].map(yr => (
          <text key={yr} x={toX(yr)} y={h - 8} textAnchor="middle" fill="#52525b" fontSize="11">{yr}</text>
        ))}
        <motion.path
          d={areaPath}
          fill="url(#mental-grad)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="#a855f7"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
        {/* COVID spike annotation */}
        <motion.g initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2.2 }}>
          <line x1={toX(2020)} y1={toY(152.8)} x2={toX(2020)} y2={toY(165)} stroke="#ec4899" strokeWidth="1" strokeDasharray="3 3" />
          <text x={toX(2020)} y={toY(168)} fill="#ec4899" fontSize="9" fontWeight="bold" textAnchor="middle">COVID-19 spike</text>
        </motion.g>
        {/* Data points */}
        {MENTAL_HEALTH.map((d, i) => (
          <motion.circle
            key={d.year}
            cx={toX(d.year)}
            cy={toY(d.dalys)}
            r={4}
            fill="#a855f7"
            stroke="#050507"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.5 + i * 0.15, type: 'spring' }}
          />
        ))}
        {/* Start and end values */}
        <motion.text x={toX(1990)} y={toY(80.8) + 18} fill="#a855f7" fontSize="10" fontWeight="bold" textAnchor="middle"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2 }}>
          80.8M
        </motion.text>
        <motion.text x={toX(2023)} y={toY(163.5) - 10} fill="#a855f7" fontSize="11" fontWeight="bold" textAnchor="middle"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2.3 }}>
          163.5M (+102%)
        </motion.text>
      </svg>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────

export default function GlobalHealthStory() {
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
            style={{ background: 'radial-gradient(circle, #a855f7, #6366f1 30%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Floating particles (health/pulse) */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${(i * 47) % 100}%`,
                top: `${(i * 53) % 100}%`,
                backgroundColor: i % 3 === 0 ? '#a855f7' : i % 3 === 1 ? '#6366f1' : '#06b6d4',
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
            className="text-sm font-mono tracking-[0.3em] uppercase text-purple-400 mb-6"
          >
            EXD Data Story
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6"
          >
            <span className="gradient-text">Global Health</span>
            <br />
            <span className="text-white">The State of Humanity</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10"
          >
            Life expectancy doubled. Diseases shifted. Mental health exploded.
            The story of human health — told in data.
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

      {/* ═══════ CHAPTER 1: LIFE EXPECTANCY ═══════ */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter One"
            title="The Great Convergence"
            subtitle="In 1960, a child born in Africa could expect to live 40 years. In Europe, 69. Today, the gap has narrowed — but hasn't closed."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-16">
            <StatCard value="+23 yrs" label="Africa's life expectancy gain since 1960" delay={0} />
            <StatCard value="78.0" label="European average (2023)" delay={0.1} />
            <StatCard value="84.8" label="Japan — world's highest" delay={0.2} />
            <StatCard value="52.7" label="Nigeria — still behind" delay={0.3} />
          </div>

          <FadeInText className="max-w-5xl mx-auto mb-20">
            <LifeExpectancyChart />
          </FadeInText>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              Africa&apos;s progress stalled in the 1990s as the <span className="text-purple-300 font-semibold">HIV/AIDS epidemic</span> devastated
              the continent. After 2005, antiretroviral therapy drove a remarkable recovery.
              COVID-19 caused a visible dip in 2020 across all regions — a reminder that
              <span className="text-pink-300 font-semibold"> progress is never guaranteed</span>.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 2: SPENDING VS OUTCOMES ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Two"
            title="Money ≠ Health"
            subtitle="The United States spends more on healthcare than any nation on Earth — yet lives shorter lives than countries spending half as much."
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            <FadeInText delay={0.1}>
              <HealthcareScatterPlot />
            </FadeInText>
            <FadeInText delay={0.2} className="flex flex-col justify-center">
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">The American Paradox</h3>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  The US spends 16.6% of GDP on healthcare — $4.3 trillion annually — yet ranks
                  below Costa Rica, Chile, and Cuba in life expectancy. Why?
                </p>
                <ul className="space-y-3 text-zinc-300">
                  {[
                    ['💊', 'Admin overhead: ~30% of US health spending'],
                    ['🏥', 'Uninsured: 27 million Americans lack coverage'],
                    ['🇯🇵', 'Japan spends 10.7%, lives 8 years longer'],
                    ['🇨🇷', 'Costa Rica: 7.3% GDP, 80.3 yr life expectancy'],
                    ['📊', 'Correlation weakens above ~8% of GDP'],
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

      {/* ═══════ CHAPTER 3: DISEASE BURDEN SHIFT ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Three"
            title="The Epidemiological Transition"
            subtitle="Humanity conquered many infectious diseases — only to face a rising tide of chronic conditions."
          />

          <FadeInText className="max-w-5xl mx-auto mb-16">
            <DiseaseBurdenChart />
          </FadeInText>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              In 1990, infectious diseases caused <span className="text-purple-300 font-semibold">44% of all DALYs</span> globally.
              By 2023, that fell to 20% — a triumph of vaccines, antibiotics, and clean water.
              But non-communicable diseases — heart disease, cancer, diabetes — now account for
              <span className="text-indigo-300 font-semibold"> 66% of the global burden</span>.
              We traded one crisis for another.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 4: VACCINATION ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Four"
            title="The Vaccine Revolution"
            subtitle="From 22% coverage in Africa in the 1980s to 74% today — vaccines are humanity's greatest public health tool."
          />

          <FadeInText className="max-w-5xl mx-auto mb-16">
            <VaccinationChart />
          </FadeInText>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              Global DPT3 coverage rose from under <span className="text-cyan-300 font-semibold">50% in the 1980s to over 85%</span> today.
              But the pandemic disrupted routine immunization:
              the Americas saw coverage <span className="text-pink-300 font-semibold">drop from 92% to 88%</span>,
              and millions of children missed critical doses. Recovery is underway — but inequity persists.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 5: MENTAL HEALTH ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Five"
            title="The Silent Pandemic"
            subtitle="Mental health disorders have doubled since 1990. COVID-19 didn't start the crisis — it amplified it."
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-16">
            <StatCard value="+102%" label="Rise in mental health DALYs since 1990" delay={0} />
            <StatCard value="970M" label="People with mental disorders globally" delay={0.1} />
            <StatCard value="$1T" label="Annual economic cost of depression & anxiety" delay={0.2} />
          </div>

          <FadeInText className="max-w-5xl mx-auto mb-16">
            <MentalHealthChart />
          </FadeInText>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              The paradox of progress: as physical health improved, mental health deteriorated.
              <span className="text-purple-300 font-semibold"> Depression is now the leading cause of disability</span> worldwide.
              Yet most countries spend less than 2% of their health budget on mental health.
              The data demands we treat this as a crisis — not a stigma.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CLOSING ═══════ */}
      <section className="relative py-40 md:py-56">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, #a855f7, transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeInText>
            <div className="text-sm font-mono tracking-[0.3em] uppercase text-purple-400 mb-6">The Outlook</div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 gradient-text">Health Is a Choice</h2>
          </FadeInText>

          <FadeInText delay={0.2}>
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              We have the knowledge to add 20 years to every life on Earth.
              We have the vaccines, the treatments, the data.
              What we lack is the will to distribute them equitably.
            </p>
          </FadeInText>

          <FadeInText delay={0.3}>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-12">
              The data is clear. The question is whether we&apos;ll act on it.
            </p>
          </FadeInText>

          <FadeInText delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-semibold transition-colors shadow-lg shadow-purple-600/30"
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
