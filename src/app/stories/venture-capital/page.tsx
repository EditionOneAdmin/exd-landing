'use client';
import StoryNavigation from '@/components/StoryNavigation';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// ─── Data (based on Crunchbase / PitchBook / CB Insights public reports) ──

const VC_FUNDING_BY_SECTOR = [
  { year: 2010, AI: 2, Climate: 4, Health: 8, Fintech: 5, Enterprise: 12, Consumer: 18, Other: 11 },
  { year: 2011, AI: 3, Climate: 5, Health: 10, Fintech: 7, Enterprise: 16, Consumer: 22, Other: 13 },
  { year: 2012, AI: 4, Climate: 5, Health: 11, Fintech: 9, Enterprise: 18, Consumer: 25, Other: 14 },
  { year: 2013, AI: 6, Climate: 4, Health: 13, Fintech: 12, Enterprise: 22, Consumer: 30, Other: 16 },
  { year: 2014, AI: 9, Climate: 5, Health: 16, Fintech: 18, Enterprise: 28, Consumer: 42, Other: 20 },
  { year: 2015, AI: 12, Climate: 6, Health: 19, Fintech: 24, Enterprise: 32, Consumer: 48, Other: 22 },
  { year: 2016, AI: 16, Climate: 7, Health: 21, Fintech: 26, Enterprise: 34, Consumer: 44, Other: 20 },
  { year: 2017, AI: 22, Climate: 9, Health: 24, Fintech: 30, Enterprise: 38, Consumer: 50, Other: 22 },
  { year: 2018, AI: 32, Climate: 12, Health: 28, Fintech: 40, Enterprise: 45, Consumer: 58, Other: 25 },
  { year: 2019, AI: 38, Climate: 16, Health: 30, Fintech: 42, Enterprise: 48, Consumer: 55, Other: 27 },
  { year: 2020, AI: 45, Climate: 22, Health: 42, Fintech: 48, Enterprise: 52, Consumer: 50, Other: 30 },
  { year: 2021, AI: 75, Climate: 40, Health: 65, Fintech: 90, Enterprise: 80, Consumer: 85, Other: 48 },
  { year: 2022, AI: 55, Climate: 48, Health: 42, Fintech: 45, Enterprise: 52, Consumer: 48, Other: 32 },
  { year: 2023, AI: 62, Climate: 52, Health: 38, Fintech: 35, Enterprise: 42, Consumer: 35, Other: 28 },
  { year: 2024, AI: 95, Climate: 58, Health: 40, Fintech: 38, Enterprise: 48, Consumer: 38, Other: 30 },
  { year: 2025, AI: 110, Climate: 62, Health: 42, Fintech: 40, Enterprise: 50, Consumer: 40, Other: 32 },
];

const SECTORS = ['AI', 'Climate', 'Health', 'Fintech', 'Enterprise', 'Consumer', 'Other'] as const;
const SECTOR_COLORS: Record<string, string> = {
  AI: '#8b5cf6', Climate: '#10b981', Health: '#ec4899', Fintech: '#f59e0b',
  Enterprise: '#6366f1', Consumer: '#06b6d4', Other: '#71717a',
};

const BUBBLE_DATA = [
  { name: 'OpenAI', sector: 'AI', value: 157, country: 'US' },
  { name: 'Anthropic', sector: 'AI', value: 18, country: 'US' },
  { name: 'SpaceX', sector: 'Enterprise', value: 10, country: 'US' },
  { name: 'Stripe', sector: 'Fintech', value: 95, country: 'US' },
  { name: 'Databricks', sector: 'AI', value: 62, country: 'US' },
  { name: 'Shein', sector: 'Consumer', value: 66, country: 'CN' },
  { name: 'ByteDance', sector: 'Consumer', value: 220, country: 'CN' },
  { name: 'Revolut', sector: 'Fintech', value: 45, country: 'UK' },
  { name: 'Northvolt', sector: 'Climate', value: 15, country: 'SE' },
  { name: 'Checkout.com', sector: 'Fintech', value: 40, country: 'UK' },
  { name: 'Klarna', sector: 'Fintech', value: 46, country: 'SE' },
  { name: 'xAI', sector: 'AI', value: 44, country: 'US' },
  { name: 'Wiz', sector: 'Enterprise', value: 32, country: 'IL' },
  { name: 'Figure AI', sector: 'AI', value: 18, country: 'US' },
  { name: 'Impossible Foods', sector: 'Climate', value: 12, country: 'US' },
  { name: 'Celonis', sector: 'Enterprise', value: 13, country: 'DE' },
  { name: 'Nuro', sector: 'AI', value: 10, country: 'US' },
  { name: 'Rappi', sector: 'Consumer', value: 9, country: 'CO' },
  { name: 'Monzo', sector: 'Fintech', value: 5, country: 'UK' },
  { name: 'Vercel', sector: 'Enterprise', value: 6, country: 'US' },
];

const UNICORN_COUNTS = [
  { year: 2010, count: 10 },
  { year: 2012, count: 30 },
  { year: 2014, count: 80 },
  { year: 2016, count: 170 },
  { year: 2018, count: 310 },
  { year: 2020, count: 500 },
  { year: 2021, count: 950 },
  { year: 2022, count: 1200 },
  { year: 2023, count: 1350 },
  { year: 2024, count: 1450 },
  { year: 2025, count: 1550 },
];

const GEO_SHIFT = [
  { year: 2010, US: 70, Asia: 15, Europe: 10, Other: 5 },
  { year: 2013, US: 62, Asia: 22, Europe: 11, Other: 5 },
  { year: 2016, US: 52, Asia: 30, Europe: 12, Other: 6 },
  { year: 2019, US: 48, Asia: 32, Europe: 14, Other: 6 },
  { year: 2021, US: 45, Asia: 30, Europe: 18, Other: 7 },
  { year: 2023, US: 50, Asia: 24, Europe: 19, Other: 7 },
  { year: 2025, US: 52, Asia: 20, Europe: 21, Other: 7 },
];

const GEO_COLORS: Record<string, string> = {
  US: '#6366f1', Asia: '#ec4899', Europe: '#06b6d4', Other: '#71717a',
};

const MILESTONES = [
  { year: 2011, name: 'The Social IPO Wave', desc: 'LinkedIn IPOs at $9B. Facebook files S-1. The era of mega-tech IPOs begins.', color: '#6366f1' },
  { year: 2014, name: 'Unicorn Boom', desc: 'Aileen Lee coins "unicorn." Uber, Airbnb, Xiaomi cross $10B valuations.', color: '#8b5cf6' },
  { year: 2016, name: 'SoftBank Vision Fund', desc: '$100B mega-fund reshapes late-stage VC. Unprecedented check sizes.', color: '#f59e0b' },
  { year: 2018, name: 'Crypto Winter Begins', desc: 'After $20K Bitcoin peak, crypto VC drops 70%. Web3 hype deflates.', color: '#ec4899' },
  { year: 2021, name: 'ZIRP Peak', desc: 'Zero interest rates fuel $621B in global VC. SPACs, meme stocks, everything rallies.', color: '#10b981' },
  { year: 2022, name: 'The Great Correction', desc: 'Fed rate hikes crush valuations. VC funding drops 35%. Down rounds everywhere.', color: '#ef4444' },
  { year: 2023, name: 'AI Takes Over', desc: 'ChatGPT triggers the biggest AI investment boom in history. OpenAI hits $80B.', color: '#8b5cf6' },
  { year: 2025, name: 'AI Mega-Round Era', desc: 'OpenAI raises $40B. AI companies account for 30%+ of all VC dollars.', color: '#06b6d4' },
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

// ─── Chart 1: VC Funding by Sector (Stacked Area) ───────────────────

function VCFundingStackedArea() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const w = 800, h = 450, px = 60, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const minYear = 2010, maxYear = 2025;

  const toX = (year: number) => px + ((year - minYear) / (maxYear - minYear)) * cw;
  const toY = (val: number) => py + ch - (val / 500) * ch;

  // Build stacked data
  const stackOrder = [...SECTORS].reverse();

  const stackedPaths: { key: string; color: string; path: string }[] = [];
  stackOrder.forEach((sector) => {
    const topLine: string[] = [];
    const bottomLine: string[] = [];

    VC_FUNDING_BY_SECTOR.forEach((d, i) => {
      let cumBottom = 0;
      for (const sk of stackOrder) {
        if (sk === sector) break;
        cumBottom += d[sk as keyof typeof d] as number;
      }
      const cumTop = cumBottom + (d[sector as keyof typeof d] as number);
      topLine.push(`${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(cumTop)}`);
      bottomLine.unshift(`L${toX(d.year)},${toY(cumBottom)}`);
    });

    stackedPaths.push({
      key: sector,
      color: SECTOR_COLORS[sector],
      path: topLine.join(' ') + ' ' + bottomLine.join(' ') + ' Z',
    });
  });

  const hoveredData = hoveredYear ? VC_FUNDING_BY_SECTOR.find(d => d.year === hoveredYear) : null;
  const hoveredTotal = hoveredData ? SECTORS.reduce((sum, s) => sum + (hoveredData[s as keyof typeof hoveredData] as number), 0) : 0;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Global VC Funding by Sector</h3>
      <p className="text-sm text-zinc-500 mb-6">Billions USD, 2010–2025</p>

      <div className="relative">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full"
          onMouseLeave={() => setHoveredYear(null)}
        >
          <defs>
            {SECTORS.map(s => (
              <linearGradient key={s} id={`vc-grad-${s}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SECTOR_COLORS[s]} stopOpacity="0.8" />
                <stop offset="100%" stopColor={SECTOR_COLORS[s]} stopOpacity="0.3" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid */}
          {[0, 100, 200, 300, 400, 500].map(v => (
            <g key={v}>
              <line x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="rgba(139,92,246,0.08)" strokeDasharray="4 4" />
              <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="11">${v}B</text>
            </g>
          ))}
          {VC_FUNDING_BY_SECTOR.filter((_, i) => i % 2 === 0).map(d => (
            <text key={d.year} x={toX(d.year)} y={h - 4} textAnchor="middle" fill="#52525b" fontSize="11">{d.year}</text>
          ))}

          {/* Stacked areas */}
          {stackedPaths.map((sp, i) => (
            <motion.path
              key={sp.key}
              d={sp.path}
              fill={`url(#vc-grad-${sp.key})`}
              stroke={sp.color}
              strokeWidth="0.5"
              strokeOpacity={0.4}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
          ))}

          {/* 2021 peak annotation */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 2 }}
          >
            <line x1={toX(2021)} y1={py} x2={toX(2021)} y2={py + ch} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.5} />
            <text x={toX(2021)} y={py - 8} textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">
              2021 Peak: $483B
            </text>
          </motion.g>

          {/* Hover overlay */}
          {VC_FUNDING_BY_SECTOR.map(d => (
            <rect
              key={d.year}
              x={toX(d.year) - (cw / (maxYear - minYear)) / 2}
              y={py}
              width={cw / (maxYear - minYear)}
              height={ch}
              fill="transparent"
              onMouseEnter={() => setHoveredYear(d.year)}
            />
          ))}

          {/* Hover line */}
          {hoveredYear && (
            <line x1={toX(hoveredYear)} y1={py} x2={toX(hoveredYear)} y2={py + ch} stroke="white" strokeOpacity={0.3} strokeWidth={1} />
          )}
        </svg>

        {/* Tooltip */}
        {hoveredData && (
          <div
            className="absolute top-4 right-4 glass-card rounded-xl p-4 text-sm pointer-events-none"
            style={{ minWidth: 160 }}
          >
            <div className="text-white font-bold mb-2">{hoveredYear} — ${hoveredTotal}B total</div>
            {SECTORS.map(s => (
              <div key={s} className="flex items-center justify-between gap-4 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SECTOR_COLORS[s] }} />
                  <span className="text-zinc-400">{s}</span>
                </div>
                <span className="text-white font-medium">${hoveredData[s as keyof typeof hoveredData] as number}B</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {SECTORS.map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: SECTOR_COLORS[s] }} />
            <span className="text-xs text-zinc-400">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chart 2: Bubble Chart — Top Funded Companies ────────────────────

function TopCompaniesBubbleChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  const [hovered, setHovered] = useState<string | null>(null);

  const w = 800, h = 500;
  const maxVal = Math.max(...BUBBLE_DATA.map(d => d.value));
  const minR = 18, maxR = 72;

  // Simple circle packing (deterministic positions using golden angle)
  const bubbles = BUBBLE_DATA
    .sort((a, b) => b.value - a.value)
    .map((d, i) => {
      const r = minR + ((d.value / maxVal) ** 0.5) * (maxR - minR);
      const angle = i * 2.399963; // golden angle
      const dist = 60 + i * 18;
      const cx = w / 2 + Math.cos(angle) * dist;
      const cy = h / 2 + Math.sin(angle) * dist;
      return { ...d, r, cx: Math.max(r + 10, Math.min(w - r - 10, cx)), cy: Math.max(r + 10, Math.min(h - r - 10, cy)) };
    });

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Highest-Valued Private Companies</h3>
      <p className="text-sm text-zinc-500 mb-6">Bubble size = latest valuation ($B). Color = sector.</p>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          {Object.entries(SECTOR_COLORS).map(([key, color]) => (
            <radialGradient key={key} id={`bubble-${key}`} cx="35%" cy="35%">
              <stop offset="0%" stopColor={color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </radialGradient>
          ))}
        </defs>

        {bubbles.map((b, i) => (
          <motion.g
            key={b.name}
            onMouseEnter={() => setHovered(b.name)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'pointer' }}
          >
            {/* Glow */}
            <motion.circle
              cx={b.cx} cy={b.cy} r={b.r + 4}
              fill="none"
              stroke={SECTOR_COLORS[b.sector]}
              strokeOpacity={hovered === b.name ? 0.6 : 0.15}
              strokeWidth={2}
              initial={{ r: 0, opacity: 0 }}
              animate={isInView ? { r: b.r + 4, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: i * 0.05, type: 'spring', stiffness: 100 }}
            />
            <motion.circle
              cx={b.cx} cy={b.cy} r={b.r}
              fill={`url(#bubble-${b.sector})`}
              initial={{ r: 0, opacity: 0 }}
              animate={isInView ? { r: b.r, opacity: hovered === b.name ? 1 : 0.85 } : {}}
              transition={{ duration: 0.8, delay: i * 0.05, type: 'spring', stiffness: 100 }}
            />
            {/* Label inside bubble */}
            {b.r > 24 && (
              <motion.text
                x={b.cx} y={b.cy - 4}
                textAnchor="middle"
                fill="white"
                fontSize={b.r > 50 ? 12 : b.r > 35 ? 10 : 9}
                fontWeight="bold"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 + i * 0.05 }}
              >
                {b.name}
              </motion.text>
            )}
            {b.r > 24 && (
              <motion.text
                x={b.cx} y={b.cy + (b.r > 50 ? 12 : 10)}
                textAnchor="middle"
                fill="rgba(255,255,255,0.7)"
                fontSize={b.r > 50 ? 11 : 8}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 + i * 0.05 }}
              >
                ${b.value}B
              </motion.text>
            )}
          </motion.g>
        ))}
      </svg>

      {/* Hover tooltip for small bubbles */}
      {hovered && (() => {
        const b = bubbles.find(x => x.name === hovered);
        if (!b || b.r > 24) return null;
        return (
          <div className="absolute bottom-4 left-4 glass-card rounded-xl p-3 text-sm pointer-events-none">
            <span className="text-white font-bold">{b.name}</span>
            <span className="text-zinc-400 ml-2">${b.value}B · {b.sector} · {b.country}</span>
          </div>
        );
      })()}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {['AI', 'Fintech', 'Enterprise', 'Consumer', 'Climate'].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SECTOR_COLORS[s] }} />
            <span className="text-xs text-zinc-400">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chart 3: Unicorn Growth ─────────────────────────────────────────

function UnicornChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 700, h = 380, px = 60, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const maxVal = 1700;
  const minYear = 2010, maxYear = 2025;

  const toX = (year: number) => px + ((year - minYear) / (maxYear - minYear)) * cw;
  const toY = (val: number) => py + ch - (val / maxVal) * ch;

  const linePath = UNICORN_COUNTS.map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(d.count)}`
  ).join(' ');

  const areaPath = linePath + ` L${toX(2025)},${py + ch} L${toX(2010)},${py + ch} Z`;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">The Unicorn Explosion</h3>
      <p className="text-sm text-zinc-500 mb-6">Number of $1B+ private companies, 2010–2025</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          <linearGradient id="unicorn-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {[0, 500, 1000, 1500].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="rgba(139,92,246,0.08)" strokeDasharray="4 4" />
            <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="11">{v.toLocaleString()}</text>
          </g>
        ))}
        {UNICORN_COUNTS.filter((_, i) => i % 2 === 0).map(d => (
          <text key={d.year} x={toX(d.year)} y={h - 4} textAnchor="middle" fill="#52525b" fontSize="11">{d.year}</text>
        ))}

        <motion.path
          d={areaPath}
          fill="url(#unicorn-area)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: 'easeOut' }}
        />

        {/* Data points */}
        {UNICORN_COUNTS.map((d, i) => (
          <motion.circle
            key={d.year}
            cx={toX(d.year)}
            cy={toY(d.count)}
            r={4}
            fill="#8b5cf6"
            stroke="#050507"
            strokeWidth={2}
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
          />
        ))}

        {/* Key annotations */}
        <motion.text
          x={toX(2021) + 6} y={toY(950) - 8}
          fill="#f59e0b" fontSize="10" fontWeight="bold"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 2.5 }}
        >
          2021: ZIRP explosion
        </motion.text>
      </svg>
    </div>
  );
}

// ─── Chart 4: Geographic Shift (Stacked Bar) ─────────────────────────

function GeoShiftChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 700, h = 350, px = 60, py = 40;
  const ch = h - 2 * py;
  const barWidth = 60;
  const geoOrder = ['US', 'Asia', 'Europe', 'Other'] as const;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Geographic Shift in VC Funding</h3>
      <p className="text-sm text-zinc-500 mb-6">Share of global VC by region (%), 2010–2025</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={py + ch - (v / 100) * ch} y2={py + ch - (v / 100) * ch} stroke="rgba(99,102,241,0.08)" strokeDasharray="4 4" />
            <text x={px - 8} y={py + ch - (v / 100) * ch + 4} textAnchor="end" fill="#52525b" fontSize="11">{v}%</text>
          </g>
        ))}

        {GEO_SHIFT.map((d, di) => {
          const cx = px + 30 + di * ((w - 2 * px - 60) / (GEO_SHIFT.length - 1));
          let cumY = 0;

          return (
            <g key={d.year}>
              <text x={cx + barWidth / 2} y={h - 4} textAnchor="middle" fill="#52525b" fontSize="11">{d.year}</text>
              {geoOrder.map((region, ri) => {
                const val = d[region as keyof typeof d] as number;
                const barH = (val / 100) * ch;
                const y = py + ch - cumY - barH;
                cumY += barH;
                return (
                  <motion.rect
                    key={region}
                    x={cx}
                    y={y}
                    width={barWidth}
                    height={barH}
                    rx={3}
                    fill={GEO_COLORS[region]}
                    fillOpacity={0.75}
                    initial={{ height: 0, y: py + ch }}
                    animate={isInView ? { height: barH, y } : {}}
                    transition={{ duration: 0.8, delay: di * 0.1 + ri * 0.05 }}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {geoOrder.map(r => (
          <div key={r} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: GEO_COLORS[r] }} />
            <span className="text-xs text-zinc-400">{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Milestones Timeline ─────────────────────────────────────────────

function VCMilestonesTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <div ref={ref} className="relative max-w-3xl mx-auto">
      <motion.div
        className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-indigo-500/50 to-cyan-500/50"
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

export default function VentureCapitalStory() {
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
            style={{ background: 'radial-gradient(circle, #8b5cf6, #6366f1 30%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </div>

        {/* Floating $ particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xs font-mono"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                color: i % 4 === 0 ? '#8b5cf6' : i % 4 === 1 ? '#6366f1' : i % 4 === 2 ? '#06b6d4' : '#ec4899',
              }}
              animate={{ opacity: [0.05, 0.3, 0.05], y: [0, -20, 0] }}
              transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.3 }}
            >
              $
            </motion.div>
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
            <span className="gradient-text">The Global</span>
            <br />
            <span className="text-white">VC Boom</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10"
          >
            $3.8 trillion deployed. 1,500+ unicorns. From garage startups
            to AI mega-rounds — venture capital is reshaping the world economy.
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

      {/* ═══════ CHAPTER 1: THE BOOM ═══════ */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter One"
            title="The Money Flood"
            subtitle="In 15 years, global VC funding grew from $60B to $376B — a 6× explosion fueled by low rates, tech disruption, and the AI revolution."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-16">
            <StatCard value="$3.8T" label="Total VC deployed (2010–2025)" delay={0} />
            <StatCard value="1,550+" label="Unicorns worldwide" delay={0.1} />
            <StatCard value="$621B" label="Peak year funding (2021)" delay={0.2} />
            <StatCard value="30%+" label="VC now flows to AI" delay={0.3} />
          </div>

          <FadeInText className="max-w-6xl mx-auto mb-20">
            <VCFundingStackedArea />
          </FadeInText>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              The <span className="text-purple-300 font-semibold">2021 ZIRP peak</span> saw $483B flood into startups —
              more than the previous three years combined. When rates rose, funding cratered 35%.
              But <span className="text-indigo-300 font-semibold">AI reignited the fire</span>: by 2025,
              artificial intelligence alone attracts more capital than all of VC did in 2010.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 2: THE GIANTS ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Two"
            title="The New Giants"
            subtitle="Private companies now rival public market caps. OpenAI alone is valued higher than 90% of the S&P 500."
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
            <FadeInText delay={0.1}>
              <TopCompaniesBubbleChart />
            </FadeInText>
            <FadeInText delay={0.2} className="flex flex-col justify-center">
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">The Mega-Round Era</h3>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  In 2024-2025, the largest private fundraises in history reshaped VC.
                  Rounds exceeding $1B — once unthinkable — became routine for AI companies.
                </p>
                <ul className="space-y-3 text-zinc-300">
                  {[
                    ['🤖', 'OpenAI: $40B round at $300B valuation (2025)'],
                    ['🧠', 'Anthropic: $18B raised across multiple mega-rounds'],
                    ['⚡', 'xAI: $12B raised in under 18 months'],
                    ['💳', 'Stripe: $95B valuation, largest fintech ever'],
                    ['🌍', 'ByteDance: $220B — most valuable private company'],
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

      {/* ═══════ CHAPTER 3: THE SHIFT ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Three"
            title="The Geographic Shift"
            subtitle="Silicon Valley still leads — but Asia surged, and Europe is catching up fast."
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            <FadeInText delay={0.1}>
              <GeoShiftChart />
            </FadeInText>
            <FadeInText delay={0.2}>
              <UnicornChart />
            </FadeInText>
          </div>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              In 2010, the US commanded <span className="text-indigo-300 font-semibold">70% of global VC</span>.
              By 2019, Asia had surged to 32% — driven by China&apos;s tech giants.
              After the 2022 crackdown, capital rotated: <span className="text-cyan-300 font-semibold">Europe now captures 21%</span>,
              with London, Berlin, Stockholm, and Paris emerging as global startup hubs.
              The unicorn count exploded from 10 in 2010 to over 1,500 today.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 4: MILESTONES ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Four"
            title="The Milestones"
            subtitle="Booms, busts, and breakthroughs — the key moments that defined a decade of venture capital."
          />

          <div className="mb-32">
            <VCMilestonesTimeline />
          </div>
        </div>
      </section>

      {/* ═══════ CLOSING ═══════ */}
      <section className="relative py-40 md:py-56">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, #8b5cf6, transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeInText>
            <div className="text-sm font-mono tracking-[0.3em] uppercase text-purple-400 mb-6">The Horizon</div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 gradient-text">The AI Capital Era</h2>
          </FadeInText>

          <FadeInText delay={0.2}>
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              We&apos;re entering an era where single AI companies raise more than entire
              countries&apos; startup ecosystems. The next trillion-dollar company
              is being funded right now.
            </p>
          </FadeInText>

          <FadeInText delay={0.3}>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-12">
              The question isn&apos;t whether AI will dominate venture capital.
              It&apos;s whether anything else will still get funded.
            </p>
          </FadeInText>

          <FadeInText delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/stories"
                className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-semibold transition-colors shadow-lg shadow-purple-600/30"
              >
                Explore More Stories
              </a>
              <a
                href="/stories/rise-of-ai"
                className="px-8 py-4 border border-zinc-700 hover:border-zinc-500 rounded-xl text-zinc-300 hover:text-white font-semibold transition-colors"
              >
                Next: The Rise of AI →
              </a>
            </div>
          </FadeInText>
        </div>
      </section>

      <StoryNavigation currentSlug="venture-capital" />

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-zinc-600 text-sm">
        <p>Built with EXD — Data you don&apos;t just see. You feel.</p>
      </footer>
    </main>
  );
}
