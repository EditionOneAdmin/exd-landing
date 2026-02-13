'use client';
import StoryNavigation from '@/components/StoryNavigation';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// ─── Data ────────────────────────────────────────────────────────────

// 1. AI Investment Timeline (Global AI private investment, $B)
const AI_INVESTMENT = {
  years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
  values: [2.4, 5.1, 10.8, 22.1, 26.6, 36.5, 68.0, 45.8, 67.2, 97.8, 110.0],
  milestones: [
    { year: 2016, label: 'AlphaGo defeats Lee Sedol' },
    { year: 2017, label: '"Attention Is All You Need"' },
    { year: 2020, label: 'GPT-3 launched' },
    { year: 2022, label: 'ChatGPT released' },
    { year: 2023, label: 'GPT-4 & generative AI boom' },
    { year: 2025, label: 'AI agents go mainstream' },
  ],
};

// 2. AI Adoption by Industry (% of companies using AI)
const AI_ADOPTION = {
  years: [2018, 2020, 2022, 2024],
  industries: [
    { name: 'Financial Services', color: '#6366f1', values: [25, 37, 52, 72] },
    { name: 'Technology', color: '#8b5cf6', values: [32, 48, 63, 78] },
    { name: 'Healthcare', color: '#06b6d4', values: [12, 22, 38, 58] },
    { name: 'Retail & E-Commerce', color: '#ec4899', values: [18, 28, 42, 61] },
    { name: 'Manufacturing', color: '#f59e0b', values: [15, 24, 35, 55] },
    { name: 'Transportation', color: '#10b981', values: [10, 18, 30, 48] },
    { name: 'Education', color: '#f472b6', values: [6, 12, 25, 45] },
    { name: 'Agriculture', color: '#38bdf8', values: [4, 8, 16, 32] },
  ],
};

// 3. Training Compute (PetaFLOP/s-days, log scale)
const COMPUTE_MILESTONES = [
  { year: 2012, name: 'AlexNet', compute: 0.01, color: '#6366f1' },
  { year: 2014, name: 'VGG-16', compute: 0.04, color: '#8b5cf6' },
  { year: 2015, name: 'ResNet', compute: 0.05, color: '#a78bfa' },
  { year: 2017, name: 'Transformer', compute: 0.09, color: '#06b6d4' },
  { year: 2018, name: 'BERT', compute: 1.5, color: '#ec4899' },
  { year: 2019, name: 'GPT-2', compute: 7.5, color: '#f59e0b' },
  { year: 2020, name: 'GPT-3', compute: 3640, color: '#10b981' },
  { year: 2021, name: 'Megatron-Turing', compute: 9800, color: '#f472b6' },
  { year: 2022, name: 'PaLM', compute: 25000, color: '#38bdf8' },
  { year: 2023, name: 'GPT-4', compute: 70000, color: '#6366f1' },
  { year: 2024, name: 'Gemini Ultra', compute: 150000, color: '#8b5cf6' },
  { year: 2025, name: 'Claude/GPT-5 era', compute: 350000, color: '#06b6d4' },
];

// 4. Job Market Impact (thousands of jobs by sector)
const JOB_IMPACT = [
  { sector: 'Software & IT', created: 2800, displaced: 450 },
  { sector: 'Healthcare', created: 1200, displaced: 320 },
  { sector: 'Finance', created: 850, displaced: 1100 },
  { sector: 'Manufacturing', created: 600, displaced: 1800 },
  { sector: 'Retail', created: 400, displaced: 1400 },
  { sector: 'Transportation', created: 350, displaced: 900 },
  { sector: 'Education', created: 550, displaced: 280 },
  { sector: 'Legal', created: 200, displaced: 380 },
  { sector: 'Media & Content', created: 450, displaced: 650 },
  { sector: 'Customer Service', created: 150, displaced: 1200 },
];

// 5. AI Readiness Index by Country (mock Oxford Insights-style, 0-100)
const AI_READINESS: Record<string, { score: number; name: string }> = {
  US: { score: 88.2, name: 'United States' }, GB: { score: 81.4, name: 'United Kingdom' },
  SG: { score: 80.1, name: 'Singapore' }, FI: { score: 78.9, name: 'Finland' },
  DE: { score: 77.5, name: 'Germany' }, CA: { score: 77.2, name: 'Canada' },
  FR: { score: 76.0, name: 'France' }, AU: { score: 75.8, name: 'Australia' },
  SE: { score: 75.2, name: 'Sweden' }, NL: { score: 74.6, name: 'Netherlands' },
  JP: { score: 74.1, name: 'Japan' }, KR: { score: 73.8, name: 'South Korea' },
  DK: { score: 73.5, name: 'Denmark' }, NO: { score: 72.8, name: 'Norway' },
  CH: { score: 72.4, name: 'Switzerland' }, CN: { score: 71.9, name: 'China' },
  IL: { score: 71.5, name: 'Israel' }, EE: { score: 70.8, name: 'Estonia' },
  NZ: { score: 70.2, name: 'New Zealand' }, IE: { score: 69.5, name: 'Ireland' },
  AT: { score: 68.3, name: 'Austria' }, BE: { score: 67.8, name: 'Belgium' },
  AE: { score: 67.2, name: 'UAE' }, ES: { score: 65.4, name: 'Spain' },
  IT: { score: 64.1, name: 'Italy' }, PT: { score: 62.8, name: 'Portugal' },
  CZ: { score: 61.5, name: 'Czech Republic' }, PL: { score: 60.2, name: 'Poland' },
  IN: { score: 58.5, name: 'India' }, BR: { score: 55.3, name: 'Brazil' },
  MY: { score: 54.8, name: 'Malaysia' }, TH: { score: 52.1, name: 'Thailand' },
  MX: { score: 51.4, name: 'Mexico' }, CL: { score: 50.8, name: 'Chile' },
  SA: { score: 50.2, name: 'Saudi Arabia' }, TR: { score: 49.5, name: 'Turkey' },
  RU: { score: 48.8, name: 'Russia' }, AR: { score: 47.2, name: 'Argentina' },
  CO: { score: 45.6, name: 'Colombia' }, ZA: { score: 44.1, name: 'South Africa' },
  ID: { score: 42.8, name: 'Indonesia' }, VN: { score: 41.5, name: 'Vietnam' },
  PH: { score: 40.2, name: 'Philippines' }, EG: { score: 38.5, name: 'Egypt' },
  KE: { score: 36.8, name: 'Kenya' }, NG: { score: 34.2, name: 'Nigeria' },
  PK: { score: 32.5, name: 'Pakistan' }, BD: { score: 30.1, name: 'Bangladesh' },
  GH: { score: 29.4, name: 'Ghana' }, ET: { score: 24.8, name: 'Ethiopia' },
  TZ: { score: 23.2, name: 'Tanzania' }, MM: { score: 20.5, name: 'Myanmar' },
  UY: { score: 53.2, name: 'Uruguay' }, PE: { score: 46.1, name: 'Peru' },
  RO: { score: 56.3, name: 'Romania' }, HU: { score: 58.1, name: 'Hungary' },
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

// ─── Visualization 1: AI Investment Area Chart ──────────────────────

function InvestmentTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const w = 800, h = 420, px = 60, py = 45;
  const cw = w - 2 * px, ch = h - 2 * py;
  const maxVal = 120;

  const toX = (year: number) => px + ((year - 2015) / 10) * cw;
  const toY = (val: number) => py + ch - (val / maxVal) * ch;

  const linePath = AI_INVESTMENT.years.map((yr, i) =>
    `${i === 0 ? 'M' : 'L'}${toX(yr)},${toY(AI_INVESTMENT.values[i])}`
  ).join(' ');

  const areaPath = linePath +
    ` L${toX(2025)},${toY(0)} L${toX(2015)},${toY(0)} Z`;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Global AI Private Investment</h3>
      <p className="text-sm text-zinc-500 mb-6">Annual investment in $B, 2015–2025</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* Grid lines */}
        {[0, 20, 40, 60, 80, 100, 120].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="rgba(99,102,241,0.08)" strokeDasharray="4 4" />
            <text x={px - 10} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="10">${v}B</text>
          </g>
        ))}
        {/* Year labels */}
        {AI_INVESTMENT.years.map(yr => (
          <text key={yr} x={toX(yr)} y={h - 6} textAnchor="middle" fill="#52525b" fontSize="10">{yr}</text>
        ))}
        {/* Gradient fill area */}
        <defs>
          <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaPath}
          fill="url(#investGrad)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="url(#investLineGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        <defs>
          <linearGradient id="investLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        {/* Data points */}
        {AI_INVESTMENT.years.map((yr, i) => (
          <motion.circle
            key={yr}
            cx={toX(yr)}
            cy={toY(AI_INVESTMENT.values[i])}
            r={hoveredYear === yr ? 6 : 4}
            fill="#6366f1"
            stroke="#050507"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2 + i * 0.1, type: 'spring' }}
            onMouseEnter={() => setHoveredYear(yr)}
            onMouseLeave={() => setHoveredYear(null)}
            className="cursor-pointer"
          />
        ))}
        {/* Tooltip */}
        {hoveredYear !== null && (() => {
          const idx = AI_INVESTMENT.years.indexOf(hoveredYear);
          const val = AI_INVESTMENT.values[idx];
          return (
            <g>
              <rect x={toX(hoveredYear) - 30} y={toY(val) - 32} width={60} height={22} rx={6} fill="#18181b" stroke="#6366f1" strokeWidth="1" />
              <text x={toX(hoveredYear)} y={toY(val) - 17} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">${val}B</text>
            </g>
          );
        })()}
        {/* Milestones */}
        {AI_INVESTMENT.milestones.map((m, i) => {
          const idx = AI_INVESTMENT.years.indexOf(m.year);
          const val = idx >= 0 ? AI_INVESTMENT.values[idx] : 0;
          return (
            <motion.g
              key={m.year}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.5 + i * 0.2 }}
            >
              <line x1={toX(m.year)} y1={toY(val) - 8} x2={toX(m.year)} y2={toY(val) - 30} stroke="#8b5cf6" strokeWidth="1" strokeDasharray="2 2" />
              <text x={toX(m.year)} y={toY(val) - 34} textAnchor="middle" fill="#a78bfa" fontSize="8" fontWeight="500">{m.label}</text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Visualization 2: AI Adoption Bar Chart Race ────────────────────

function AdoptionByIndustry() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });
  const [yearIdx, setYearIdx] = useState(3); // default to latest

  const year = AI_ADOPTION.years[yearIdx];
  const sorted = [...AI_ADOPTION.industries]
    .map(ind => ({ ...ind, value: ind.values[yearIdx] }))
    .sort((a, b) => b.value - a.value);

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">AI Adoption by Industry</h3>
      <p className="text-sm text-zinc-500 mb-4">Share of companies actively using AI (%)</p>

      {/* Year selector */}
      <div className="flex gap-3 mb-6 justify-center">
        {AI_ADOPTION.years.map((yr, i) => (
          <button
            key={yr}
            onClick={() => setYearIdx(i)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              yearIdx === i
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            {yr}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {sorted.map((ind, i) => (
          <motion.div
            key={ind.name}
            className="flex items-center gap-3"
            layout
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            <div className="w-36 text-right text-sm text-zinc-400 shrink-0">{ind.name}</div>
            <div className="flex-1 h-8 bg-white/5 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: ind.color }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${ind.value}%` } : {}}
                transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
              />
              <motion.span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 + i * 0.05 }}
              >
                {ind.value}%
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Visualization 3: Compute Growth (Log Scale) ────────────────────

function ComputeGrowth() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  const w = 800, h = 450, px = 70, py = 50;
  const cw = w - 2 * px, ch = h - 2 * py;
  const minYear = 2011, maxYear = 2026;
  const minLog = -2, maxLog = 6; // 0.01 to 1,000,000

  const toX = (year: number) => px + ((year - minYear) / (maxYear - minYear)) * cw;
  const toY = (compute: number) => {
    const logVal = Math.log10(compute);
    return py + ch - ((logVal - minLog) / (maxLog - minLog)) * ch;
  };

  const linePath = COMPUTE_MILESTONES
    .map((m, i) => `${i === 0 ? 'M' : 'L'}${toX(m.year)},${toY(m.compute)}`)
    .join(' ');

  const logLabels = [
    { val: 0.01, label: '0.01' },
    { val: 1, label: '1' },
    { val: 100, label: '100' },
    { val: 10000, label: '10K' },
    { val: 1000000, label: '1M' },
  ];

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Training Compute Explosion</h3>
      <p className="text-sm text-zinc-500 mb-6">PetaFLOP/s-days (log scale), 2012–2025</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* Grid */}
        {logLabels.map(({ val, label }) => (
          <g key={label}>
            <line x1={px} x2={w - px} y1={toY(val)} y2={toY(val)} stroke="rgba(99,102,241,0.08)" strokeDasharray="4 4" />
            <text x={px - 10} y={toY(val) + 4} textAnchor="end" fill="#52525b" fontSize="10">{label}</text>
          </g>
        ))}
        {/* Year labels */}
        {[2012, 2014, 2016, 2018, 2020, 2022, 2024].map(yr => (
          <text key={yr} x={toX(yr)} y={h - 6} textAnchor="middle" fill="#52525b" fontSize="10">{yr}</text>
        ))}
        {/* Doubling trend line */}
        <motion.line
          x1={toX(2012)} y1={toY(0.01)} x2={toX(2025)} y2={toY(350000)}
          stroke="rgba(99,102,241,0.15)" strokeWidth="1" strokeDasharray="6 4"
          initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ duration: 2 }}
        />
        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
        />
        {/* Points and labels */}
        {COMPUTE_MILESTONES.map((m, i) => (
          <motion.g
            key={m.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.15, type: 'spring' }}
          >
            <circle cx={toX(m.year)} cy={toY(m.compute)} r="5" fill={m.color} stroke="#050507" strokeWidth="2" />
            <text
              x={toX(m.year)}
              y={toY(m.compute) - 12}
              textAnchor="middle"
              fill="#a78bfa"
              fontSize="8"
              fontWeight="600"
            >
              {m.name}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

// ─── Visualization 4: Job Market Butterfly Chart ────────────────────

function JobMarketImpact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  const maxVal = Math.max(...JOB_IMPACT.flatMap(j => [j.created, j.displaced]));

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">AI&apos;s Job Market Impact</h3>
      <p className="text-sm text-zinc-500 mb-2">Estimated jobs created vs displaced by AI (thousands), by 2030</p>
      <div className="flex justify-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-zinc-400">Jobs Created</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-xs text-zinc-400">Jobs Displaced</span>
        </div>
      </div>
      <div className="space-y-2">
        {JOB_IMPACT.map((job, i) => (
          <div key={job.sector} className="flex items-center gap-2">
            {/* Displaced (left) */}
            <div className="flex-1 flex justify-end">
              <div className="relative h-7 flex items-center" style={{ width: '100%' }}>
                <motion.div
                  className="absolute right-0 h-full bg-rose-500/80 rounded-l-full"
                  style={{ maxWidth: '100%' }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${(job.displaced / maxVal) * 100}%` } : {}}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                />
                <motion.span
                  className="absolute right-2 text-[10px] font-bold text-white z-10"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.8 + i * 0.05 }}
                >
                  {job.displaced > 200 ? `${(job.displaced / 1000).toFixed(1)}M` : ''}
                </motion.span>
              </div>
            </div>
            {/* Label */}
            <div className="w-28 text-center text-[11px] text-zinc-300 font-medium shrink-0">{job.sector}</div>
            {/* Created (right) */}
            <div className="flex-1">
              <div className="relative h-7 flex items-center" style={{ width: '100%' }}>
                <motion.div
                  className="absolute left-0 h-full bg-emerald-500/80 rounded-r-full"
                  style={{ maxWidth: '100%' }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${(job.created / maxVal) * 100}%` } : {}}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                />
                <motion.span
                  className="absolute left-2 text-[10px] font-bold text-white z-10"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.8 + i * 0.05 }}
                >
                  {job.created > 200 ? `${(job.created / 1000).toFixed(1)}M` : ''}
                </motion.span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Visualization 5: AI Readiness Bubble Grid (Choropleth-style) ───

function AIReadinessMap() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });
  const [tooltip, setTooltip] = useState<{ name: string; score: number } | null>(null);

  const entries = Object.entries(AI_READINESS).sort((a, b) => b[1].score - a[1].score);

  const getColor = (score: number) => {
    if (score >= 80) return '#6366f1';
    if (score >= 70) return '#8b5cf6';
    if (score >= 60) return '#a78bfa';
    if (score >= 50) return '#06b6d4';
    if (score >= 40) return '#14b8a6';
    if (score >= 30) return '#f59e0b';
    return '#ef4444';
  };

  const getSize = (score: number) => {
    if (score >= 80) return 'w-14 h-14';
    if (score >= 70) return 'w-12 h-12';
    if (score >= 60) return 'w-11 h-11';
    if (score >= 50) return 'w-10 h-10';
    if (score >= 40) return 'w-9 h-9';
    return 'w-8 h-8';
  };

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Global AI Readiness Index</h3>
      <p className="text-sm text-zinc-500 mb-6">Government AI Readiness Score (0–100), 2025 estimates</p>

      {tooltip && (
        <div className="text-center mb-4">
          <span className="text-white font-semibold">{tooltip.name}</span>
          <span className="text-zinc-400 mx-2">—</span>
          <span className="font-bold" style={{ color: getColor(tooltip.score) }}>{tooltip.score}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-center items-center">
        {entries.map(([code, d], i) => (
          <motion.div
            key={code}
            className={`${getSize(d.score)} rounded-full flex items-center justify-center cursor-pointer text-[10px] font-bold text-black/80 relative`}
            style={{ backgroundColor: getColor(d.score) }}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.03 * i, duration: 0.4, type: 'spring' }}
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
          { label: '80+', color: '#6366f1' },
          { label: '70-79', color: '#8b5cf6' },
          { label: '60-69', color: '#a78bfa' },
          { label: '50-59', color: '#06b6d4' },
          { label: '40-49', color: '#14b8a6' },
          { label: '30-39', color: '#f59e0b' },
          { label: '<30', color: '#ef4444' },
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

// ─── Page ────────────────────────────────────────────────────────────

export default function AIRevolutionStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050507] text-white">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Hero */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-purple-950/10 to-[#050507]" />
          {/* Animated grid background */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div
            className="text-sm font-mono tracking-[0.3em] uppercase text-indigo-400 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Data Story · 9 min read
          </motion.div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-[0.9]">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              The AI Revolution
            </span>
            <br />
            <span className="text-white/90">in Numbers</span>
          </h1>
          <motion.p
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            From billions in investment to billions of parameters — tracing the exponential rise
            of artificial intelligence through the data that defines our era.
          </motion.p>
        </motion.div>

        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-zinc-600 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-zinc-400 rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* Intro stats */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value="$110B+" label="AI investment in 2025" delay={0} />
          <StatCard value="72%" label="Enterprise AI adoption" delay={0.1} />
          <StatCard value="10M×" label="Compute growth since 2012" delay={0.2} />
          <StatCard value="97M" label="New AI jobs by 2030" delay={0.3} />
        </div>
      </div>

      {/* Chapter 1: Investment Timeline */}
      <ChapterHeading
        number="Chapter 01"
        title="Follow the Money"
        subtitle="Global AI investment has surged from $2.4 billion in 2015 to over $110 billion in 2025 — a 45× increase in a single decade."
      />
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <InvestmentTimeline />
        <FadeInText className="mt-8 text-zinc-400 text-center max-w-2xl mx-auto leading-relaxed">
          The 2022 dip reflects a broader tech correction, but generative AI reignited the market in 2023.
          By 2025, AI investment represents over 15% of all global venture funding.
        </FadeInText>
      </div>

      {/* Chapter 2: Adoption */}
      <ChapterHeading
        number="Chapter 02"
        title="Industry Adoption"
        subtitle="AI is no longer a tech-only phenomenon. Every major industry is racing to integrate AI into core operations."
      />
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <AdoptionByIndustry />
        <FadeInText className="mt-8 text-zinc-400 text-center max-w-2xl mx-auto leading-relaxed">
          Technology and financial services lead adoption, but the fastest growth is in healthcare and education —
          sectors where AI promises the most transformative impact.
        </FadeInText>
      </div>

      {/* Chapter 3: Compute */}
      <ChapterHeading
        number="Chapter 03"
        title="The Compute Explosion"
        subtitle="Training compute for frontier AI models has grown over 10 million times since AlexNet in 2012, doubling roughly every 6 months."
      />
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <ComputeGrowth />
        <FadeInText className="mt-8 text-zinc-400 text-center max-w-2xl mx-auto leading-relaxed">
          This exponential growth far outpaces Moore&apos;s Law. The question is no longer whether we can scale,
          but whether our energy infrastructure and chip supply chains can keep up.
        </FadeInText>
      </div>

      {/* Chapter 4: Jobs */}
      <ChapterHeading
        number="Chapter 04"
        title="The Labor Shift"
        subtitle="AI will create and destroy millions of jobs. The net impact varies dramatically by sector."
      />
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <JobMarketImpact />
        <FadeInText className="mt-8 text-zinc-400 text-center max-w-2xl mx-auto leading-relaxed">
          Software and healthcare see net job creation, while manufacturing, retail, and customer service
          face significant displacement. The key: reskilling at unprecedented scale.
        </FadeInText>
      </div>

      {/* Chapter 5: Geographic Power */}
      <ChapterHeading
        number="Chapter 05"
        title="The Global AI Race"
        subtitle="AI readiness varies dramatically by country — driven by talent, infrastructure, policy, and investment."
      />
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <AIReadinessMap />
        <FadeInText className="mt-8 text-zinc-400 text-center max-w-2xl mx-auto leading-relaxed">
          The US and UK lead, but smaller nations like Singapore, Finland, and Estonia punch well above their weight.
          The gap between AI leaders and laggards is widening, creating a new kind of digital divide.
        </FadeInText>
      </div>

      {/* Closing */}
      <div className="py-32 text-center px-6">
        <FadeInText>
          <p className="text-sm font-mono tracking-[0.3em] uppercase text-indigo-400 mb-4">The Bottom Line</p>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            The revolution is here.<br />The data is clear.
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Artificial intelligence is reshaping every industry, every economy, and every career path on the planet.
            The only question is how we choose to shape it back.
          </p>
        </FadeInText>
      </div>

      {/* Navigation */}
      <StoryNavigation currentSlug="ai-revolution" />
    </div>
  );
}
