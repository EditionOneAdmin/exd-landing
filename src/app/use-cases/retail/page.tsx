'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState, useMemo } from 'react';

// ─── Typeform loader ────────────────────────────────────────────
function useTypeform() {
  useEffect(() => {
    const s = document.createElement('script');
    s.src = '//embed.typeform.com/next/embed.js';
    s.async = true;
    document.body.appendChild(s);
    return () => { s.remove(); };
  }, []);
}

// ─── RETAIL DATA ────────────────────────────────────────────────
const SPENDING_CATEGORIES = [
  { name: 'Groceries', value: 34, color: '#818cf8' },
  { name: 'Fashion', value: 22, color: '#a78bfa' },
  { name: 'Electronics', value: 18, color: '#c084fc' },
  { name: 'Home & Garden', value: 12, color: '#22d3ee' },
  { name: 'Health & Beauty', value: 9, color: '#67e8f9' },
  { name: 'Other', value: 5, color: '#6366f1' },
];

const MONTHLY_TRENDS = [
  { month: 'Jan', spending: 62, footfall: 45 },
  { month: 'Feb', spending: 58, footfall: 42 },
  { month: 'Mar', spending: 71, footfall: 55 },
  { month: 'Apr', spending: 68, footfall: 52 },
  { month: 'May', spending: 75, footfall: 60 },
  { month: 'Jun', spending: 82, footfall: 68 },
  { month: 'Jul', spending: 78, footfall: 65 },
  { month: 'Aug', spending: 73, footfall: 58 },
  { month: 'Sep', spending: 85, footfall: 72 },
  { month: 'Oct', spending: 80, footfall: 66 },
  { month: 'Nov', spending: 95, footfall: 88 },
  { month: 'Dec', spending: 100, footfall: 95 },
];

const LOCATIONS = [
  { name: 'Berlin Mitte', score: 94, demographic: 'Young Professionals', avgSpend: '€127', growth: '+12%' },
  { name: 'München Maxvorstadt', score: 91, demographic: 'Affluent Families', avgSpend: '€156', growth: '+8%' },
  { name: 'Hamburg Altona', score: 87, demographic: 'Urban Mix', avgSpend: '€98', growth: '+15%' },
  { name: 'Köln Ehrenfeld', score: 84, demographic: 'Students & Creatives', avgSpend: '€72', growth: '+22%' },
  { name: 'Frankfurt Nordend', score: 82, demographic: 'Commuters', avgSpend: '€143', growth: '+6%' },
];

const COMPETITORS = [
  { name: 'Your Brand', market: 24, satisfaction: 82, online: 35, color: '#818cf8' },
  { name: 'Competitor A', market: 31, satisfaction: 74, online: 42, color: '#475569' },
  { name: 'Competitor B', market: 19, satisfaction: 68, online: 28, color: '#64748b' },
  { name: 'Competitor C', market: 15, satisfaction: 71, online: 19, color: '#94a3b8' },
  { name: 'Others', market: 11, satisfaction: 60, online: 12, color: '#334155' },
];

// ─── ANIMATED COUNTER ───────────────────────────────────────────
function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2 }: { end: number; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

// ─── HERO ───────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-transparent to-transparent" />
      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.6) 0%, rgba(6,182,212,0.3) 40%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text */}
        <div>
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Retail & E-Commerce × EXD
          </motion.span>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}
          >
            Retail Intelligence —{' '}
            <span className="gradient-text">Data-Driven Commerce</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-xl mb-10"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          >
            EXD transforms consumer spending data, demographic insights, and market signals into actionable intelligence for retail and e-commerce businesses.
          </motion.p>
          <motion.a
            href="#kpis"
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 text-white font-medium text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          >
            Explore Insights ↓
          </motion.a>
        </div>

        {/* Right: Mini Dashboard Preview */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="glass-card rounded-2xl p-6">
            {/* Mock spending chart */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm text-gray-400">Consumer Spending Trends — Live</span>
            </div>
            <svg viewBox="0 0 500 250" className="w-full">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={i} x1="40" y1={30 + i * 50} x2="480" y2={30 + i * 50} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              ))}
              {/* Spending line */}
              <motion.path
                d={`M${MONTHLY_TRENDS.map((d, i) => `${40 + i * 40},${230 - d.spending * 2}`).join(' L')}`}
                fill="none"
                stroke="url(#spendGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 2, ease: 'easeOut' }}
              />
              {/* Footfall line */}
              <motion.path
                d={`M${MONTHLY_TRENDS.map((d, i) => `${40 + i * 40},${230 - d.footfall * 2}`).join(' L')}`}
                fill="none"
                stroke="rgba(34,211,238,0.5)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.8, duration: 2, ease: 'easeOut' }}
              />
              {/* Area fill */}
              <motion.path
                d={`M40,230 L${MONTHLY_TRENDS.map((d, i) => `${40 + i * 40},${230 - d.spending * 2}`).join(' L')} L480,230 Z`}
                fill="url(#areaGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
              />
              {/* Dots */}
              {MONTHLY_TRENDS.map((d, i) => (
                <motion.circle
                  key={i}
                  cx={40 + i * 40}
                  cy={230 - d.spending * 2}
                  r="3"
                  fill="#10b981"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                />
              ))}
              {/* Month labels */}
              {MONTHLY_TRENDS.map((d, i) => (
                <text key={i} x={40 + i * 40} y={248} textAnchor="middle" fill="#6b7280" fontSize="9">{d.month}</text>
              ))}
              <defs>
                <linearGradient id="spendGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(16,185,129,0.15)" />
                  <stop offset="100%" stopColor="rgba(16,185,129,0)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex items-center gap-6 mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-400 rounded" /> Spending Index</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-cyan-400 rounded opacity-50" style={{ borderTop: '1px dashed' }} /> Footfall</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── KPI DASHBOARD ──────────────────────────────────────────────
function KPIDashboard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const kpis = [
    { label: 'Consumer Data Points', value: 48, suffix: 'M+', color: 'text-emerald-400', icon: '📊' },
    { label: 'Retail Locations Tracked', value: 12, suffix: 'K+', color: 'text-cyan-400', icon: '📍' },
    { label: 'Avg. Revenue Uplift', value: 23, suffix: '%', color: 'text-indigo-400', icon: '📈' },
    { label: 'Supply Chain Efficiency', value: 31, suffix: '%', color: 'text-purple-400', icon: '🚛' },
  ];

  return (
    <section id="kpis" className="py-20 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        >
          Retail Impact at a <span className="gradient-text">Glance</span>
        </motion.h2>
        <motion.p
          className="text-gray-500 text-center mb-14 max-w-xl mx-auto"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
        >
          How EXD-powered insights translate into measurable business outcomes.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-2xl p-6 text-center group hover:border-white/20 transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
            >
              <span className="text-3xl mb-3 block">{kpi.icon}</span>
              <div className={`text-3xl md:text-4xl font-bold ${kpi.color}`}>
                {isInView && <AnimatedCounter end={kpi.value} suffix={kpi.suffix} />}
              </div>
              <div className="text-sm text-gray-500 mt-2">{kpi.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SPENDING BREAKDOWN ─────────────────────────────────────────
function SpendingBreakdown() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const total = SPENDING_CATEGORIES.reduce((s, c) => s + c.value, 0);
  let cumulative = 0;

  return (
    <div ref={ref} className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-1">Consumer Spending Breakdown</h3>
      <p className="text-sm text-gray-500 mb-6">Category distribution across tracked retailers</p>
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Horizontal stacked bar */}
        <div className="w-full">
          <div className="h-8 rounded-full overflow-hidden flex mb-6">
            {SPENDING_CATEGORIES.map((cat, i) => {
              const width = (cat.value / total) * 100;
              cumulative += width;
              return (
                <motion.div
                  key={cat.name}
                  className="h-full relative group"
                  style={{ backgroundColor: cat.color, width: `${width}%` }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${width}%` } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur rounded px-2 py-1 text-xs whitespace-nowrap">
                    {cat.name}: {cat.value}%
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SPENDING_CATEGORIES.map(cat => (
              <div key={cat.name} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <div>
                  <div className="text-sm font-medium text-white">{cat.name}</div>
                  <div className="text-xs text-gray-500">{cat.value}% of spend</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SEASONAL PATTERNS ──────────────────────────────────────────
function SeasonalPatterns() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-1">Seasonal Patterns</h3>
      <p className="text-sm text-gray-500 mb-6">Monthly spending index & footfall correlation</p>
      <div className="flex items-end gap-1.5 h-48">
        {MONTHLY_TRENDS.map((d, i) => (
          <motion.div
            key={d.month}
            className="flex-1 flex flex-col items-center gap-1 group"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
          >
            <div className="relative w-full flex flex-col items-center" style={{ height: '140px' }}>
              {/* Spending bar */}
              <motion.div
                className="absolute bottom-0 w-full rounded-t-sm bg-gradient-to-t from-emerald-500/60 to-emerald-400/30 group-hover:from-emerald-500/80 group-hover:to-emerald-400/50 transition-colors"
                style={{ maxWidth: '20px', left: '50%', transform: 'translateX(-60%)' }}
                initial={{ height: 0 }}
                animate={isInView ? { height: `${d.spending * 1.3}px` } : {}}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
              />
              {/* Footfall bar */}
              <motion.div
                className="absolute bottom-0 w-full rounded-t-sm bg-gradient-to-t from-cyan-500/40 to-cyan-400/20 group-hover:from-cyan-500/60 group-hover:to-cyan-400/40 transition-colors"
                style={{ maxWidth: '20px', left: '50%', transform: 'translateX(10%)' }}
                initial={{ height: 0 }}
                animate={isInView ? { height: `${d.footfall * 1.3}px` } : {}}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.6 }}
              />
            </div>
            <span className="text-[10px] text-gray-600 mt-1">{d.month}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-6 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500/60" /> Spending</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-cyan-500/40" /> Footfall</span>
      </div>
    </div>
  );
}

// ─── USE CASE CARDS ─────────────────────────────────────────────
function UseCaseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const cases = [
    {
      icon: '💳',
      signal: 'Spending Data',
      arrow: '→',
      outcome: 'Trend Forecasting',
      desc: 'Aggregate consumer spending patterns across categories, regions, and time periods. Predict demand shifts before they happen.',
      color: 'from-emerald-500/20 to-transparent',
    },
    {
      icon: '📍',
      signal: 'Location + Demographics',
      arrow: '→',
      outcome: 'Site Selection',
      desc: 'Overlay demographic profiles, foot traffic, and purchasing power data to identify optimal store locations with highest ROI potential.',
      color: 'from-cyan-500/20 to-transparent',
    },
    {
      icon: '📅',
      signal: 'Seasonal Signals',
      arrow: '→',
      outcome: 'Inventory Optimization',
      desc: 'Detect seasonal buying patterns months in advance. Align inventory, staffing, and promotions to maximize revenue during peak periods.',
      color: 'from-indigo-500/20 to-transparent',
    },
    {
      icon: '⚔️',
      signal: 'Market Data',
      arrow: '→',
      outcome: 'Competitive Edge',
      desc: 'Benchmark your performance against competitors on market share, customer satisfaction, and online presence — all in one dashboard.',
      color: 'from-purple-500/20 to-transparent',
    },
    {
      icon: '🚛',
      signal: 'Supply Chain Data',
      arrow: '→',
      outcome: 'Logistics Intelligence',
      desc: 'Combine demand forecasts with supplier lead times and logistics data to reduce stockouts by 40% and cut carrying costs.',
      color: 'from-rose-500/20 to-transparent',
    },
    {
      icon: '🛒',
      signal: 'E-Commerce Analytics',
      arrow: '→',
      outcome: 'Omnichannel Strategy',
      desc: 'Bridge online and offline data to create a unified view of customer journeys, optimizing touchpoints across every channel.',
      color: 'from-amber-500/20 to-transparent',
    },
  ];

  return (
    <section className="py-28 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        >
          Data Signals → <span className="gradient-text">Retail Outcomes</span>
        </motion.h2>
        <motion.p
          className="text-gray-500 text-center mb-16 max-w-xl mx-auto"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
        >
          How EXD transforms raw data into retail and e-commerce intelligence.
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((c, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-2xl p-8 relative overflow-hidden group hover:border-white/20 transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${c.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10">
                <span className="text-4xl mb-4 block">{c.icon}</span>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold text-emerald-300">{c.signal}</span>
                  <span className="text-gray-600">{c.arrow}</span>
                  <span className="text-sm font-semibold text-cyan-300">{c.outcome}</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{c.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── LOCATION ANALYZER ──────────────────────────────────────────
function LocationAnalyzer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-28 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        >
          Location <span className="gradient-text">Intelligence</span>
        </motion.h2>
        <motion.p
          className="text-gray-500 text-center mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
        >
          Demographic-enriched site scoring for data-driven expansion decisions.
        </motion.p>

        <motion.div
          className="glass-card rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-gray-400">Top expansion targets by EXD Location Score</span>
          </div>
          <div className="space-y-3">
            {LOCATIONS.map((loc, i) => (
              <motion.div
                key={loc.name}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-500'}`}>
                    #{i + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{loc.name}</div>
                    <div className="text-xs text-gray-500">{loc.demographic} · Avg. Spend {loc.avgSpend}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-emerald-400 font-medium">{loc.growth}</span>
                  <div className="hidden sm:block w-24 h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${loc.score}%` } : {}}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-emerald-400 w-12 text-right">{loc.score}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── COMPETITOR BENCHMARK ───────────────────────────────────────
function CompetitorBenchmark() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-1">Competitor Benchmarking</h3>
      <p className="text-sm text-gray-500 mb-6">Market share, satisfaction & online presence comparison</p>
      <div className="space-y-4">
        {COMPETITORS.map((comp, i) => (
          <motion.div
            key={comp.name}
            className={`p-4 rounded-xl ${i === 0 ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-white/[0.02] border border-white/5'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium ${i === 0 ? 'text-emerald-400' : 'text-gray-400'}`}>
                {comp.name} {i === 0 && '⭐'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-600 mb-1">Market Share</div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: comp.color }}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${comp.market * 2.5}%` } : {}}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{comp.market}%</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Satisfaction</div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: comp.color }}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${comp.satisfaction}%` } : {}}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{comp.satisfaction}/100</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Online Share</div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: comp.color }}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${comp.online * 2}%` } : {}}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{comp.online}%</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── CTA ────────────────────────────────────────────────────────
function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section className="py-28 px-6" ref={ref}>
      <motion.div
        className="max-w-2xl mx-auto glass-card rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Transform your <span className="gradient-text">Retail Data</span>
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          See how EXD can power your retail and e-commerce business with consumer intelligence, location analytics, and competitive insights.
        </p>
        <button
          data-tf-popup="RX9edslL"
          data-tf-opacity="100"
          data-tf-size="100"
          data-tf-iframe-props="title=EXD Waitlist"
          data-tf-transitive-search-params
          data-tf-medium="snippet"
          className="px-10 py-4 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 text-white font-medium text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer"
        >
          Get Early Access →
        </button>
      </motion.div>
    </section>
  );
}

// ─── PAGE ───────────────────────────────────────────────────────
export default function RetailUseCasePage() {
  useTypeform();
  return (
    <main className="min-h-screen">
      <Hero />
      <KPIDashboard />
      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
          <SpendingBreakdown />
          <SeasonalPatterns />
        </div>
      </section>
      <UseCaseSection />
      <LocationAnalyzer />
      <section className="py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <CompetitorBenchmark />
        </div>
      </section>
      <CTA />
    </main>
  );
}
