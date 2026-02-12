'use client';
import StoryNavigation from '@/components/StoryNavigation';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// ─── Data ────────────────────────────────────────────────────────────

// Interest rates: Fed, ECB, BoE, BoJ (annual avg, 2005-2025)
const INTEREST_RATES = {
  years: [2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025],
  fed:   [3.22,4.97,5.02,1.92,0.16,0.18,0.10,0.14,0.11,0.09,0.13,0.40,1.00,1.83,2.16,0.36,0.08,1.68,5.33,4.58,4.33],
  ecb:   [2.00,2.50,3.75,3.75,1.00,1.00,1.25,0.75,0.25,0.05,0.05,0.00,0.00,0.00,0.00,0.00,0.00,2.00,4.50,3.65,2.65],
  boe:   [4.50,4.75,5.50,4.50,0.50,0.50,0.50,0.50,0.50,0.50,0.50,0.25,0.25,0.75,0.75,0.10,0.10,2.25,5.25,4.75,4.50],
  boj:   [0.00,0.25,0.50,0.30,0.10,0.10,0.10,0.10,0.10,0.10,0.10,-.10,-.10,-.10,-.10,-.10,-.10,-.10,-.10,0.25,0.50],
};

const RATE_LINES = [
  { key: 'fed' as const, label: 'Fed Funds Rate', color: '#6366f1' },
  { key: 'ecb' as const, label: 'ECB Main Refi', color: '#8b5cf6' },
  { key: 'boe' as const, label: 'Bank of England', color: '#06b6d4' },
  { key: 'boj' as const, label: 'Bank of Japan', color: '#f59e0b' },
];

// Stock exchanges market cap (trillions USD) — racing bar data
const STOCK_EXCHANGES: Record<string, { name: string; color: string; values: Record<number,number> }> = {
  nyse:     { name: 'NYSE',         color: '#6366f1', values: {2010:13.4,2013:17.9,2016:19.6,2019:23.3,2022:22.8,2025:28.5} },
  nasdaq:   { name: 'NASDAQ',       color: '#8b5cf6', values: {2010:3.9,2013:6.1,2016:7.8,2019:11.2,2022:15.4,2025:24.6} },
  shanghai: { name: 'Shanghai',     color: '#ec4899', values: {2010:2.7,2013:2.5,2016:4.1,2019:4.0,2022:6.9,2025:7.2} },
  euronext: { name: 'Euronext',     color: '#06b6d4', values: {2010:2.9,2013:3.6,2016:3.5,2019:4.3,2022:5.5,2025:6.8} },
  tokyo:    { name: 'Tokyo (JPX)',  color: '#f59e0b', values: {2010:3.8,2013:4.5,2016:4.9,2019:5.7,2022:5.3,2025:6.5} },
  shenzhen: { name: 'Shenzhen',     color: '#10b981', values: {2010:1.3,2013:1.5,2016:3.2,2019:2.5,2022:4.2,2025:5.1} },
  hkex:     { name: 'HKEX',         color: '#f472b6', values: {2010:2.7,2013:3.1,2016:3.2,2019:4.0,2022:4.6,2025:4.8} },
  lse:      { name: 'LSE',          color: '#a78bfa', values: {2010:3.6,2013:4.4,2016:3.5,2019:3.8,2022:3.4,2025:3.6} },
  bombay:   { name: 'BSE India',    color: '#fb923c', values: {2010:1.6,2013:1.1,2016:1.6,2019:2.1,2022:3.5,2025:4.3} },
  toronto:  { name: 'TMX (Toronto)',color: '#38bdf8', values: {2010:2.2,2013:2.1,2016:1.9,2019:2.2,2022:2.6,2025:3.1} },
};

const EXCHANGE_YEARS = [2010,2013,2016,2019,2022,2025];

// Debt-to-GDP scatter data (realistic 2023 figures)
const DEBT_GDP_DATA = [
  { country: 'Japan', code: 'JP', debt: 255, growth: 1.9, gdp: 4231, color: '#f59e0b' },
  { country: 'Greece', code: 'GR', debt: 166, growth: 2.0, gdp: 239, color: '#ec4899' },
  { country: 'Italy', code: 'IT', debt: 140, growth: 0.7, gdp: 2255, color: '#10b981' },
  { country: 'USA', code: 'US', debt: 123, growth: 2.5, gdp: 27360, color: '#6366f1' },
  { country: 'France', code: 'FR', debt: 112, growth: 0.9, gdp: 3049, color: '#8b5cf6' },
  { country: 'UK', code: 'GB', debt: 101, growth: 0.1, gdp: 3332, color: '#06b6d4' },
  { country: 'Brazil', code: 'BR', debt: 88, growth: 2.9, gdp: 2127, color: '#a78bfa' },
  { country: 'India', code: 'IN', debt: 83, growth: 7.8, gdp: 3730, color: '#fb923c' },
  { country: 'China', code: 'CN', debt: 77, growth: 5.2, gdp: 17795, color: '#ec4899' },
  { country: 'Germany', code: 'DE', debt: 64, growth: -0.3, gdp: 4456, color: '#38bdf8' },
  { country: 'Canada', code: 'CA', debt: 106, growth: 1.1, gdp: 2140, color: '#f472b6' },
  { country: 'Australia', code: 'AU', debt: 52, growth: 2.0, gdp: 1688, color: '#34d399' },
  { country: 'South Korea', code: 'KR', debt: 54, growth: 1.4, gdp: 1713, color: '#c084fc' },
  { country: 'Mexico', code: 'MX', debt: 53, growth: 3.2, gdp: 1789, color: '#fbbf24' },
  { country: 'Indonesia', code: 'ID', debt: 39, growth: 5.1, gdp: 1417, color: '#22d3ee' },
];

// Inflation heatmap data — realistic 2023 CPI inflation rates
const INFLATION_DATA: Record<string, { rate: number; name: string }> = {
  US: { rate: 4.1, name: 'United States' }, CN: { rate: 0.2, name: 'China' },
  JP: { rate: 3.3, name: 'Japan' }, DE: { rate: 5.9, name: 'Germany' },
  GB: { rate: 7.3, name: 'United Kingdom' }, FR: { rate: 4.9, name: 'France' },
  IN: { rate: 5.7, name: 'India' }, BR: { rate: 4.6, name: 'Brazil' },
  CA: { rate: 3.9, name: 'Canada' }, AU: { rate: 5.6, name: 'Australia' },
  KR: { rate: 3.6, name: 'South Korea' }, MX: { rate: 5.5, name: 'Mexico' },
  ID: { rate: 3.7, name: 'Indonesia' }, RU: { rate: 7.4, name: 'Russia' },
  TR: { rate: 53.9, name: 'Turkey' }, AR: { rate: 133.5, name: 'Argentina' },
  ZA: { rate: 6.1, name: 'South Africa' }, SA: { rate: 2.3, name: 'Saudi Arabia' },
  NG: { rate: 24.1, name: 'Nigeria' }, EG: { rate: 33.9, name: 'Egypt' },
  PK: { rate: 29.2, name: 'Pakistan' }, TH: { rate: 1.2, name: 'Thailand' },
  VN: { rate: 3.3, name: 'Vietnam' }, PH: { rate: 6.0, name: 'Philippines' },
  PL: { rate: 11.4, name: 'Poland' }, NL: { rate: 3.8, name: 'Netherlands' },
  CH: { rate: 2.1, name: 'Switzerland' }, SE: { rate: 5.9, name: 'Sweden' },
  NO: { rate: 5.5, name: 'Norway' }, IT: { rate: 5.6, name: 'Italy' },
  ES: { rate: 3.5, name: 'Spain' }, PT: { rate: 4.3, name: 'Portugal' },
  CL: { rate: 7.6, name: 'Chile' }, CO: { rate: 11.7, name: 'Colombia' },
  PE: { rate: 6.3, name: 'Peru' }, KE: { rate: 7.7, name: 'Kenya' },
  GH: { rate: 40.0, name: 'Ghana' }, ET: { rate: 30.2, name: 'Ethiopia' },
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

// ─── Visualization 1: Inflation Heatmap (Bubble Grid) ───────────────

function InflationHeatmap() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });
  const [tooltip, setTooltip] = useState<{ name: string; rate: number } | null>(null);

  const entries = Object.entries(INFLATION_DATA).sort((a, b) => b[1].rate - a[1].rate);

  const getColor = (rate: number) => {
    if (rate > 50) return '#dc2626';
    if (rate > 20) return '#ef4444';
    if (rate > 10) return '#f97316';
    if (rate > 6) return '#f59e0b';
    if (rate > 4) return '#eab308';
    if (rate > 2) return '#84cc16';
    return '#22c55e';
  };

  const getSize = (rate: number) => {
    if (rate > 50) return 'w-16 h-16';
    if (rate > 20) return 'w-14 h-14';
    if (rate > 10) return 'w-12 h-12';
    if (rate > 5) return 'w-10 h-10';
    return 'w-8 h-8';
  };

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Global Inflation Rates</h3>
      <p className="text-sm text-zinc-500 mb-6">Consumer Price Index, 2023 annual average (%)</p>

      {tooltip && (
        <div className="text-center mb-4">
          <span className="text-white font-semibold">{tooltip.name}</span>
          <span className="text-zinc-400 mx-2">—</span>
          <span className="font-bold" style={{ color: getColor(tooltip.rate) }}>{tooltip.rate}%</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-center items-center">
        {entries.map(([code, d], i) => (
          <motion.div
            key={code}
            className={`${getSize(d.rate)} rounded-full flex items-center justify-center cursor-pointer text-[10px] font-bold text-black/80 relative`}
            style={{ backgroundColor: getColor(d.rate) }}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.05 * i, duration: 0.4, type: 'spring' }}
            whileHover={{ scale: 1.3, zIndex: 10 }}
            onHoverStart={() => setTooltip(d)}
            onHoverEnd={() => setTooltip(null)}
          >
            {code}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-6 flex-wrap">
        {[
          { label: '<2%', color: '#22c55e' },
          { label: '2-4%', color: '#84cc16' },
          { label: '4-6%', color: '#eab308' },
          { label: '6-10%', color: '#f59e0b' },
          { label: '10-20%', color: '#f97316' },
          { label: '20%+', color: '#ef4444' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
            <span className="text-[10px] text-zinc-500">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Visualization 2: Interest Rate Timeline ────────────────────────

function InterestRateTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 750, h = 400, px = 55, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const minYear = 2005, maxYear = 2025;
  const minRate = -1, maxRate = 6;

  const toX = (year: number) => px + ((year - minYear) / (maxYear - minYear)) * cw;
  const toY = (val: number) => py + ch - ((val - minRate) / (maxRate - minRate)) * ch;

  const makePath = (data: number[]) =>
    data.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(INTEREST_RATES.years[i])},${toY(v)}`).join(' ');

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Central Bank Interest Rates</h3>
      <p className="text-sm text-zinc-500 mb-6">Key policy rates, 2005–2025</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* Grid */}
        {[-1, 0, 1, 2, 3, 4, 5, 6].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke={v === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(99,102,241,0.08)'} strokeDasharray={v === 0 ? undefined : '4 4'} />
            <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="10">{v}%</text>
          </g>
        ))}
        {/* Year labels */}
        {[2005,2008,2011,2014,2017,2020,2023,2025].map(yr => (
          <text key={yr} x={toX(yr)} y={h - 6} textAnchor="middle" fill="#52525b" fontSize="10">{yr}</text>
        ))}
        {/* Crisis annotations */}
        <motion.g initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.5 } : {}} transition={{ delay: 2 }}>
          <rect x={toX(2008)} y={py} width={toX(2009) - toX(2008)} height={ch} fill="rgba(239,68,68,0.08)" rx="4" />
          <text x={toX(2008.5)} y={py + 14} textAnchor="middle" fill="#71717a" fontSize="8">GFC</text>
        </motion.g>
        <motion.g initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.5 } : {}} transition={{ delay: 2.2 }}>
          <rect x={toX(2020)} y={py} width={toX(2021) - toX(2020)} height={ch} fill="rgba(239,68,68,0.08)" rx="4" />
          <text x={toX(2020.5)} y={py + 14} textAnchor="middle" fill="#71717a" fontSize="8">COVID</text>
        </motion.g>
        {/* Lines */}
        {RATE_LINES.map((line, li) => (
          <motion.path
            key={line.key}
            d={makePath(INTEREST_RATES[line.key])}
            fill="none"
            stroke={line.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 2, delay: li * 0.3, ease: 'easeOut' }}
          />
        ))}
      </svg>
      {/* Legend */}
      <div className="flex gap-5 mt-4 justify-center flex-wrap">
        {RATE_LINES.map(l => (
          <div key={l.key} className="flex items-center gap-2">
            <div className="w-3 h-0.5 rounded" style={{ backgroundColor: l.color }} />
            <span className="text-xs text-zinc-400">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Visualization 3: Racing Bar Chart ──────────────────────────────

function RacingBarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });
  const [yearIdx, setYearIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(() => {
    setYearIdx(0);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (isInView && !isPlaying && yearIdx === 0) play();
  }, [isInView, isPlaying, yearIdx, play]);

  useEffect(() => {
    if (!isPlaying) return;
    if (yearIdx >= EXCHANGE_YEARS.length - 1) { setIsPlaying(false); return; }
    const timer = setTimeout(() => setYearIdx(prev => prev + 1), 1800);
    return () => clearTimeout(timer);
  }, [isPlaying, yearIdx]);

  const currentYear = EXCHANGE_YEARS[yearIdx];
  const sorted = Object.values(STOCK_EXCHANGES)
    .map(e => ({ ...e, value: e.values[currentYear] || 0 }))
    .sort((a, b) => b.value - a.value);
  const maxVal = sorted[0]?.value || 1;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xl font-bold exd-gradient-text">Stock Exchanges by Market Cap</h3>
        <button
          onClick={play}
          className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/5"
        >
          ▶ Replay
        </button>
      </div>
      <p className="text-sm text-zinc-500 mb-6">Trillions USD</p>

      <div className="flex items-center gap-4 mb-6">
        <motion.div
          key={currentYear}
          className="text-5xl font-bold text-white/20 font-mono"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentYear}
        </motion.div>
        <div className="flex gap-1">
          {EXCHANGE_YEARS.map((yr, i) => (
            <div
              key={yr}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${i <= yearIdx ? 'bg-indigo-500' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        {sorted.map((ex, i) => (
          <div key={ex.name} className="flex items-center gap-3">
            <div className="w-24 text-right text-xs text-zinc-400 font-medium shrink-0 truncate">{ex.name}</div>
            <div className="flex-1 h-7 rounded bg-white/[0.03] overflow-hidden relative">
              <motion.div
                className="h-full rounded flex items-center justify-end pr-2"
                style={{ backgroundColor: ex.color + 'cc' }}
                animate={{ width: `${(ex.value / maxVal) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <span className="text-[10px] font-bold text-white/90">${ex.value.toFixed(1)}T</span>
              </motion.div>
            </div>
            <div className="w-6 text-xs text-zinc-600 font-mono">#{i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Visualization 4: Debt-to-GDP Scatter ───────────────────────────

function DebtGDPScatter() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });
  const [hovered, setHovered] = useState<string | null>(null);

  const w = 750, h = 450, px = 65, py = 50;
  const cw = w - 2 * px, ch = h - 2 * py;
  const minDebt = 20, maxDebt = 270;
  const minGrowth = -1.5, maxGrowth = 9;

  const toX = (debt: number) => px + ((debt - minDebt) / (maxDebt - minDebt)) * cw;
  const toY = (growth: number) => py + ch - ((growth - minGrowth) / (maxGrowth - minGrowth)) * ch;
  const toR = (gdp: number) => Math.sqrt(gdp / 300) + 4;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Debt-to-GDP vs. Economic Growth</h3>
      <p className="text-sm text-zinc-500 mb-6">Government debt (% of GDP) vs GDP growth (2023) — bubble size = GDP</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* Grid */}
        {[0, 50, 100, 150, 200, 250].map(v => (
          <g key={`d${v}`}>
            <line x1={toX(v)} x2={toX(v)} y1={py} y2={py + ch} stroke="rgba(99,102,241,0.06)" strokeDasharray="3 3" />
            <text x={toX(v)} y={py + ch + 16} textAnchor="middle" fill="#52525b" fontSize="10">{v}%</text>
          </g>
        ))}
        {[-1, 0, 2, 4, 6, 8].map(v => (
          <g key={`g${v}`}>
            <line x1={px} x2={px + cw} y1={toY(v)} y2={toY(v)} stroke={v === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(99,102,241,0.06)'} strokeDasharray={v === 0 ? undefined : '3 3'} />
            <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="10">{v}%</text>
          </g>
        ))}
        {/* Axis labels */}
        <text x={px + cw / 2} y={h - 2} textAnchor="middle" fill="#71717a" fontSize="11">Government Debt (% of GDP)</text>
        <text x={14} y={py + ch / 2} textAnchor="middle" fill="#71717a" fontSize="11" transform={`rotate(-90, 14, ${py + ch / 2})`}>GDP Growth (%)</text>
        {/* Bubbles */}
        {DEBT_GDP_DATA.map((d, i) => {
          const r = toR(d.gdp);
          const isHov = hovered === d.code;
          return (
            <g key={d.code}>
              <motion.circle
                cx={toX(d.debt)} cy={toY(d.growth)} r={r}
                fill={d.color + '88'} stroke={d.color} strokeWidth={isHov ? 2.5 : 1.5}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: isHov ? 1 : 0.85 } : {}}
                transition={{ delay: 0.08 * i, duration: 0.5, type: 'spring' }}
                onMouseEnter={() => setHovered(d.code)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              />
              <motion.text
                x={toX(d.debt)} y={toY(d.growth) + (r > 12 ? 4 : -r - 6)}
                textAnchor="middle" fill="white" fontSize={isHov ? '11' : '9'} fontWeight={isHov ? 'bold' : 'normal'}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: isHov ? 1 : 0.7 } : {}}
                transition={{ delay: 0.08 * i + 0.3 }}
              >
                {d.code}
              </motion.text>
              {isHov && (
                <motion.text
                  x={toX(d.debt)} y={toY(d.growth) - r - 14}
                  textAnchor="middle" fill={d.color} fontSize="10" fontWeight="bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {d.country}: {d.debt}% debt, {d.growth}% growth
                </motion.text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Visualization 5: Currency Strength Radar-like bars ─────────────

const CURRENCY_DATA = [
  { currency: 'USD', label: 'US Dollar', strength: 92, change: '+3.2%', color: '#6366f1' },
  { currency: 'EUR', label: 'Euro', strength: 78, change: '-1.4%', color: '#8b5cf6' },
  { currency: 'GBP', label: 'British Pound', strength: 74, change: '-0.8%', color: '#06b6d4' },
  { currency: 'JPY', label: 'Japanese Yen', strength: 45, change: '-12.1%', color: '#f59e0b' },
  { currency: 'CHF', label: 'Swiss Franc', strength: 85, change: '+1.9%', color: '#10b981' },
  { currency: 'CNY', label: 'Chinese Yuan', strength: 62, change: '-4.3%', color: '#ec4899' },
  { currency: 'INR', label: 'Indian Rupee', strength: 48, change: '-2.1%', color: '#fb923c' },
  { currency: 'BRL', label: 'Brazilian Real', strength: 38, change: '-8.7%', color: '#a78bfa' },
];

function CurrencyStrengthChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <div ref={ref} className="exd-card exd-glow p-6">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Currency Strength Index</h3>
      <p className="text-sm text-zinc-500 mb-6">Relative strength vs basket of currencies (2024, 100 = strongest)</p>
      <div className="space-y-3">
        {CURRENCY_DATA.map((d, i) => (
          <div key={d.currency} className="flex items-center gap-3">
            <div className="w-10 text-right font-mono text-sm text-zinc-300 font-bold">{d.currency}</div>
            <div className="flex-1 h-6 rounded bg-white/[0.03] overflow-hidden">
              <motion.div
                className="h-full rounded flex items-center px-2"
                style={{ backgroundColor: d.color + 'aa' }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${d.strength}%` } : {}}
                transition={{ duration: 1, delay: 0.1 * i, ease: 'easeOut' }}
              >
                <span className="text-[10px] font-bold text-white/90 ml-auto">{d.strength}</span>
              </motion.div>
            </div>
            <div className={`w-14 text-right text-xs font-mono ${d.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
              {d.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────

export default function GlobalFinanceStory() {
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
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #6366f1, #06b6d4 40%, transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Floating ticker dots */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 rounded-full"
              style={{
                left: `${(i * 29) % 100}%`,
                top: `${(i * 47 + 13) % 100}%`,
                backgroundColor: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#06b6d4' : '#8b5cf6',
              }}
              animate={{
                opacity: [0.1, 0.6, 0.1],
                y: [0, -20, 0],
              }}
              transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.15 }}
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
            <span className="gradient-text">The Pulse</span>
            <br />
            <span className="text-white">of Global Finance</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10"
          >
            Inflation, interest rates, market caps, and sovereign debt —
            the forces that shape the world economy, visualized.
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

      {/* ═══════ CHAPTER 1: INFLATION ═══════ */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter One"
            title="The Inflation Landscape"
            subtitle="From Argentina's 133% to China's near-zero — inflation reveals the fault lines of the global economy."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-16">
            <StatCard value="133%" label="Argentina — highest major economy" delay={0} />
            <StatCard value="0.2%" label="China — near deflation" delay={0.1} />
            <StatCard value="4.1%" label="USA — cooling from peak" delay={0.2} />
            <StatCard value="53.9%" label="Turkey — persistent crisis" delay={0.3} />
          </div>

          <FadeInText className="max-w-5xl mx-auto mb-20">
            <InflationHeatmap />
          </FadeInText>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              The post-pandemic inflation shock hit differently everywhere.
              While <span className="text-cyan-300 font-semibold">developed economies</span> saw rates peak around 8-10% before central banks intervened,
              <span className="text-red-300 font-semibold"> emerging markets</span> like Argentina, Turkey, and Nigeria spiraled
              into double- and triple-digit territory — a stark reminder that monetary stability is a privilege, not a given.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 2: INTEREST RATES ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Two"
            title="The Rate Cycle"
            subtitle="20 years of central bank policy — from the Great Financial Crisis to the post-COVID tightening."
          />

          <FadeInText className="max-w-5xl mx-auto mb-16">
            <InterestRateTimeline />
          </FadeInText>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              The <span className="text-indigo-300 font-semibold">2008 financial crisis</span> sent rates to near-zero across the globe.
              For over a decade, cheap money fueled asset prices, tech valuations, and sovereign borrowing.
              Then <span className="text-cyan-300 font-semibold">inflation returned in 2022</span>, forcing the fastest rate-hiking
              cycle in 40 years. Japan, remarkably, kept rates negative until 2024.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 3: STOCK MARKETS ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Three"
            title="The Market Race"
            subtitle="How the world's stock exchanges grew — and how NASDAQ went from challenger to champion."
          />

          <FadeInText className="max-w-5xl mx-auto mb-16">
            <RacingBarChart />
          </FadeInText>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              In 2010, <span className="text-indigo-300 font-semibold">NYSE</span> dominated at $13.4 trillion.
              NASDAQ was a distant second at $3.9T. Fast-forward to 2025: powered by tech giants
              (Apple, Microsoft, Nvidia), <span className="text-purple-300 font-semibold">NASDAQ surged to $24.6T</span> —
              nearly matching NYSE. Meanwhile, <span className="text-pink-300 font-semibold">Shanghai and Shenzhen</span> combined
              now rival any single Western exchange.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 4: DEBT & GROWTH ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Four"
            title="Debt vs. Growth"
            subtitle="The eternal trade-off — does debt fuel growth, or strangle it?"
          />

          <FadeInText className="max-w-5xl mx-auto mb-16">
            <DebtGDPScatter />
          </FadeInText>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              <span className="text-amber-300 font-semibold">Japan</span> carries 255% debt-to-GDP yet avoids crisis —
              thanks to domestic bond ownership and deflation history.
              <span className="text-orange-300 font-semibold"> India</span> shows the opposite pattern: moderate debt (83%)
              with the world&apos;s fastest growth (7.8%). The data challenges simplistic narratives:
              debt level alone doesn&apos;t determine economic fate.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 5: CURRENCIES ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Five"
            title="Currency Power"
            subtitle="The dollar's dominance, the yen's decline, and the shifting balance of monetary power."
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            <FadeInText delay={0.1}>
              <CurrencyStrengthChart />
            </FadeInText>
            <FadeInText delay={0.2} className="flex flex-col justify-center">
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">King Dollar</h3>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  The US dollar strengthened dramatically through 2022-2024, powered by the
                  Fed&apos;s aggressive rate hikes. The Japanese yen fell to 30-year lows as the
                  BoJ maintained ultra-loose policy. Emerging market currencies bore the brunt —
                  the Brazilian real and Indian rupee declined steadily against the greenback.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-xl bg-white/5">
                    <div className="text-2xl font-bold text-indigo-400">88%</div>
                    <div className="text-xs text-zinc-500">of FX trades involve USD</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white/5">
                    <div className="text-2xl font-bold text-cyan-400">59%</div>
                    <div className="text-xs text-zinc-500">of global reserves in USD</div>
                  </div>
                </div>
              </div>
            </FadeInText>
          </div>
        </div>
      </section>

      {/* ═══════ CLOSING ═══════ */}
      <section className="relative py-40 md:py-56">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, #6366f1, #06b6d4 40%, transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeInText>
            <div className="text-sm font-mono tracking-[0.3em] uppercase text-indigo-400 mb-6">The Outlook</div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 gradient-text">Money Never Sleeps</h2>
          </FadeInText>

          <FadeInText delay={0.2}>
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              The global financial system is a living organism — constantly adapting,
              sometimes fracturing, always interconnected. Every rate decision in Washington
              sends ripples to Tokyo, São Paulo, and Lagos.
            </p>
          </FadeInText>

          <FadeInText delay={0.3}>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-12">
              Understanding these patterns isn&apos;t just for traders and economists.
              It&apos;s for anyone who wants to understand the forces shaping their world.
            </p>
          </FadeInText>

          <FadeInText delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/stories"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-semibold transition-colors shadow-lg shadow-indigo-600/30"
              >
                Explore More Stories
              </a>
              <a
                href="/stories/energy-transition"
                className="px-8 py-4 border border-zinc-700 hover:border-zinc-500 rounded-xl text-zinc-300 hover:text-white font-semibold transition-colors"
              >
                Next: The Energy Transition
              </a>
            </div>
          </FadeInText>
        </div>
      </section>

      <StoryNavigation currentSlug="global-finance" />

      <footer className="border-t border-white/5 py-12 text-center text-zinc-600 text-sm">
        <p>Built with EXD — Data you don&apos;t just see. You feel.</p>
      </footer>
    </main>
  );
}
