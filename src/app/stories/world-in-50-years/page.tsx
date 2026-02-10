'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────

interface LifeExpDataPoint {
  code: string;
  name: string;
  life: number;
  gdp: number;
  pop: number;
  region: string;
}

interface GDPEntry {
  year: number;
  countries: { code: string; value: number; name: string }[];
}

interface CO2YearData {
  [countryCode: string]: { co2: number; co2_per_capita: number };
}

// ─── Narrative Step Component ────────────────────────────────────────

function NarrativeBlock({
  children,
  onVisible,
  isActive,
}: {
  children: React.ReactNode;
  onVisible: () => void;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '-35% 0px -35% 0px' });

  useEffect(() => {
    if (isInView) onVisible();
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      className="min-h-[70vh] flex items-center py-20 md:py-28"
      animate={{ opacity: isActive ? 1 : 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="space-y-6">{children}</div>
    </motion.div>
  );
}

// ─── Animated Number ─────────────────────────────────────────────────

function AnimNum({ value, decimals = 0, prefix = '', suffix = '' }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;
    let start: number;
    const dur = 800;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * ease);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  );
}

// ─── Mini Bar Chart (GDP) ────────────────────────────────────────────

function GDPBarChart({ data, year }: { data: GDPEntry[]; year: number }) {
  const entry = data.find((d) => d.year === year);
  const top10 = useMemo(() => {
    if (!entry) return [];
    return [...entry.countries].sort((a, b) => b.value - a.value).slice(0, 10);
  }, [entry]);

  const maxVal = top10[0]?.value || 1;

  return (
    <div className="w-full space-y-2">
      <div className="text-center mb-6">
        <motion.span
          key={year}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold gradient-text"
        >
          {year}
        </motion.span>
        <p className="text-sm text-gray-500 mt-2">GDP (current US$) — Top 10</p>
      </div>
      <div className="space-y-1.5">
        {top10.map((c, i) => (
          <motion.div
            key={c.code}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03, duration: 0.4 }}
          >
            <span className="w-10 text-right text-xs text-gray-400 font-mono">{c.code}</span>
            <div className="flex-1 h-7 bg-white/5 rounded overflow-hidden">
              <motion.div
                className="h-full rounded"
                style={{
                  background: `linear-gradient(90deg, var(--accent-primary), var(--accent-tertiary))`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(c.value / maxVal) * 100}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            </div>
            <span className="w-20 text-right text-xs text-gray-400 font-mono">
              ${(c.value / 1e12).toFixed(2)}T
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Bubble Scatter (Life Exp vs GDP) ────────────────────────────────

const REGION_COLORS: Record<string, string> = {
  Americas: '#6366f1',
  Europe: '#22c55e',
  Asia: '#f43f5e',
  Africa: '#f97316',
  Oceania: '#8b5cf6',
};

function LifeExpScatter({ data, year, highlight }: { data: Record<string, LifeExpDataPoint[]>; year: string; highlight?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 600, h: 450 });

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setDims({ w: width, h: Math.min(450, width * 0.7) });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data[year]) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const m = { top: 30, right: 20, bottom: 40, left: 50 };
    const w = dims.w - m.left - m.right;
    const h = dims.h - m.top - m.bottom;

    const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);

    const x = d3.scaleLog().domain([300, 120000]).range([0, w]);
    const y = d3.scaleLinear().domain([30, 90]).range([h, 0]);
    const r = d3.scaleSqrt().domain([0, 1.5e9]).range([2, 40]);

    // Grid
    g.selectAll('.hg')
      .data(y.ticks(6))
      .join('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', (d) => y(d)).attr('y2', (d) => y(d))
      .attr('stroke', 'rgba(99,102,241,0.08)')
      .attr('stroke-dasharray', '3,3');

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x).ticks(4, '$,.0s'))
      .selectAll('text').style('fill', '#52525b').style('font-size', '10px');

    g.append('g')
      .call(d3.axisLeft(y).ticks(6))
      .selectAll('text').style('fill', '#52525b').style('font-size', '10px');

    // Axis labels
    g.append('text').attr('x', w / 2).attr('y', h + 35).attr('text-anchor', 'middle')
      .attr('fill', '#52525b').attr('font-size', '10px').text('GDP per capita →');
    g.append('text').attr('transform', 'rotate(-90)').attr('x', -h / 2).attr('y', -38)
      .attr('text-anchor', 'middle').attr('fill', '#52525b').attr('font-size', '10px').text('Life expectancy →');

    const pts = data[year].sort((a, b) => b.pop - a.pop);

    g.selectAll('circle')
      .data(pts)
      .join('circle')
      .attr('cx', (d) => x(Math.max(300, d.gdp)))
      .attr('cy', (d) => y(d.life))
      .attr('r', (d) => r(d.pop))
      .attr('fill', (d) => REGION_COLORS[d.region] || '#64748b')
      .attr('fill-opacity', (d) => (highlight && d.region !== highlight ? 0.12 : 0.65))
      .attr('stroke', (d) => REGION_COLORS[d.region] || '#64748b')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', (d) => (highlight && d.region !== highlight ? 0.2 : 0.8));

    // Labels for big countries
    g.selectAll('.label')
      .data(pts.filter((d) => d.pop > 150000000))
      .join('text')
      .attr('x', (d) => x(Math.max(300, d.gdp)))
      .attr('y', (d) => y(d.life))
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .attr('pointer-events', 'none')
      .text((d) => d.code);
  }, [data, year, dims, highlight]);

  return (
    <div ref={containerRef} className="w-full">
      <div className="text-center mb-4">
        <motion.span key={year} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold gradient-text">
          {year}
        </motion.span>
      </div>
      <svg ref={svgRef} width={dims.w} height={dims.h} className="overflow-visible" />
      <div className="flex justify-center gap-4 mt-3 flex-wrap">
        {Object.entries(REGION_COLORS).map(([region, color]) => (
          <div key={region} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-500">{region}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CO2 Top Emitters Bar ────────────────────────────────────────────

function CO2Bars({ data, year }: { data: Record<string, CO2YearData>; year: string }) {
  const yearData = data[year];
  if (!yearData) return null;

  const sorted = Object.entries(yearData)
    .map(([code, d]) => ({ code, co2: d.co2 }))
    .sort((a, b) => b.co2 - a.co2)
    .slice(0, 10);

  const max = sorted[0]?.co2 || 1;

  return (
    <div className="w-full space-y-2">
      <div className="text-center mb-6">
        <motion.span key={year} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-5xl md:text-7xl font-bold gradient-text">
          {year}
        </motion.span>
        <p className="text-sm text-gray-500 mt-2">CO₂ emissions (Mt) — Top 10</p>
      </div>
      <div className="space-y-1.5">
        {sorted.map((c, i) => (
          <motion.div
            key={c.code}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <span className="w-10 text-right text-xs text-gray-400 font-mono">{c.code}</span>
            <div className="flex-1 h-7 bg-white/5 rounded overflow-hidden">
              <motion.div
                className="h-full rounded"
                style={{ background: 'linear-gradient(90deg, #f97316, #ef4444)' }}
                initial={{ width: 0 }}
                animate={{ width: `${(c.co2 / max) * 100}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            </div>
            <span className="w-16 text-right text-xs text-gray-400 font-mono">
              {c.co2.toLocaleString()}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Population Pyramid Mini ─────────────────────────────────────────

function PopPyramidMini({ data, country, year }: { data: Record<string, Record<string, { age: string; male: number; female: number }[]>>; country: string; year: string }) {
  const yearData = data?.[country]?.[year];
  if (!yearData) return <div className="text-gray-500 text-center">No data for {country} {year}</div>;

  const maxPop = Math.max(...yearData.flatMap((d) => [d.male, d.female]));

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <motion.span key={`${country}-${year}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-5xl md:text-7xl font-bold gradient-text">
          {year}
        </motion.span>
        <p className="text-sm text-gray-500 mt-2">{country} — Population by age</p>
      </div>
      <div className="space-y-0.5">
        {[...yearData].reverse().map((row) => (
          <div key={row.age} className="flex items-center gap-1 h-5">
            {/* Male bar (right-aligned) */}
            <div className="flex-1 flex justify-end">
              <motion.div
                className="h-full rounded-l"
                style={{ background: 'rgba(99,102,241,0.7)' }}
                initial={{ width: 0 }}
                animate={{ width: `${(row.male / maxPop) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="w-10 text-center text-[9px] text-gray-500">{row.age}</span>
            {/* Female bar */}
            <div className="flex-1">
              <motion.div
                className="h-full rounded-r"
                style={{ background: 'rgba(244,63,94,0.7)' }}
                initial={{ width: 0 }}
                animate={{ width: `${(row.female / maxPop) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>♂ Male</span>
        <span>Female ♀</span>
      </div>
    </div>
  );
}

// ─── Big Number Display ──────────────────────────────────────────────

function BigStat({ value, label, unit }: { value: string; label: string; unit?: string }) {
  return (
    <div className="text-center">
      <div className="text-5xl md:text-8xl font-bold gradient-text">{value}</div>
      {unit && <div className="text-lg text-gray-400 mt-1">{unit}</div>}
      <div className="text-sm text-gray-500 mt-2">{label}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════

export default function WorldIn50YearsPage() {
  // ── Data state ──
  const [lifeData, setLifeData] = useState<Record<string, LifeExpDataPoint[]>>({});
  const [gdpData, setGDPData] = useState<GDPEntry[]>([]);
  const [co2Data, setCO2Data] = useState<Record<string, CO2YearData>>({});
  const [popData, setPopData] = useState<Record<string, Record<string, { age: string; male: number; female: number }[]>>>({});
  const [loaded, setLoaded] = useState(false);

  // ── Active step per section ──
  const [activeStep, setActiveStep] = useState({
    intro: 'intro-1',
    gdp: 'gdp-1',
    life: 'life-1',
    co2: 'co2-1',
    pop: 'pop-1',
  });

  const basePath = typeof window !== 'undefined' && window.location.pathname.includes('exd-landing') ? '/exd-landing' : '';

  // ── Load data ──
  useEffect(() => {
    Promise.all([
      fetch(`${basePath}/data/life-expectancy.json`).then((r) => r.json()),
      fetch(`${basePath}/data/gdp-racing.json`).then((r) => r.json()),
      fetch(`${basePath}/data/co2-emissions.json`).then((r) => r.json()),
      fetch(`${basePath}/data/population-pyramid.json`).then((r) => r.json()),
    ]).then(([life, gdp, co2, pop]) => {
      setLifeData(life);
      setGDPData(gdp);
      setCO2Data(co2);
      setPopData(pop);
      setLoaded(true);
    });
  }, [basePath]);

  // ── Derived viz params from active steps ──
  const gdpYear = useMemo(() => {
    const map: Record<string, number> = { 'gdp-1': 1960, 'gdp-2': 1990, 'gdp-3': 2000, 'gdp-4': 2023 };
    return map[activeStep.gdp] || 1960;
  }, [activeStep.gdp]);

  const lifeYear = useMemo(() => {
    const map: Record<string, string> = { 'life-1': '1990', 'life-2': '2000', 'life-3': '2010', 'life-4': '2022' };
    return map[activeStep.life] || '1990';
  }, [activeStep.life]);

  const lifeHighlight = useMemo(() => {
    const map: Record<string, string | undefined> = { 'life-1': undefined, 'life-2': 'Asia', 'life-3': 'Africa', 'life-4': undefined };
    return map[activeStep.life];
  }, [activeStep.life]);

  const co2Year = useMemo(() => {
    const map: Record<string, string> = { 'co2-1': '1990', 'co2-2': '2000', 'co2-3': '2010', 'co2-4': '2022' };
    return map[activeStep.co2] || '1990';
  }, [activeStep.co2]);

  const popConfig = useMemo(() => {
    const map: Record<string, { country: string; year: string }> = {
      'pop-1': { country: 'JPN', year: '1990' },
      'pop-2': { country: 'JPN', year: '2020' },
      'pop-3': { country: 'USA', year: '2020' },
      'pop-4': { country: 'DEU', year: '2020' },
    };
    return map[activeStep.pop] || { country: 'JPN', year: '1990' };
  }, [activeStep.pop]);

  // ── Loading ──
  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading the world&apos;s story…</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-[var(--background)] text-white min-h-screen">
      {/* ── Back nav ── */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[var(--background)]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to EXD
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-sm text-gray-500">Data Story</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* HERO */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)', left: '50%', top: '40%', transform: 'translate(-50%,-50%)' }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">A Data Story by EXD</p>
          <h1 className="text-5xl md:text-8xl font-bold leading-tight mb-8">
            <span className="text-white/90">The World</span>
            <br />
            <span className="gradient-text">in 50 Years</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            How wealth, health, climate, and demographics reshaped humanity — told through the data that witnessed it all.
          </p>
        </motion.div>

        <motion.div
          className="absolute bottom-12"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 1: GDP — The Rise of Nations */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          {/* Narrative */}
          <div className="md:w-[40%]">
            <NarrativeBlock isActive={activeStep.gdp === 'gdp-1'} onVisible={() => setActiveStep((s) => ({ ...s, gdp: 'gdp-1' }))}>
              <p className="text-indigo-400 text-sm uppercase tracking-widest mb-3">Chapter I</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The Rise of Nations</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                In <strong className="text-white">1960</strong>, the United States stood alone at the top — its economy larger than the next five nations combined. The world was still rebuilding from war. Most of Asia and Africa were finding their footing as newly independent nations.
              </p>
              <p className="text-gray-400 mt-4">
                Global GDP was just <span className="text-white font-medium">$1.4 trillion</span>. Today, Apple alone is worth twice that.
              </p>
            </NarrativeBlock>

            <NarrativeBlock isActive={activeStep.gdp === 'gdp-2'} onVisible={() => setActiveStep((s) => ({ ...s, gdp: 'gdp-2' }))}>
              <p className="text-lg text-gray-300 leading-relaxed">
                By <strong className="text-white">1990</strong>, Japan had stunned the world — its economic miracle lifted 120 million people into unprecedented prosperity. Germany reunified. The Soviet Union crumbled.
              </p>
              <p className="text-gray-400 mt-4">
                The rules of the game were being rewritten, and new players were warming up.
              </p>
            </NarrativeBlock>

            <NarrativeBlock isActive={activeStep.gdp === 'gdp-3'} onVisible={() => setActiveStep((s) => ({ ...s, gdp: 'gdp-3' }))}>
              <p className="text-lg text-gray-300 leading-relaxed">
                <strong className="text-white">2000</strong>. The dot-com bubble had just burst, but something bigger was brewing. China&apos;s GDP had grown 10× in two decades. India was waking up. The center of economic gravity was shifting — slowly, then all at once.
              </p>
            </NarrativeBlock>

            <NarrativeBlock isActive={activeStep.gdp === 'gdp-4'} onVisible={() => setActiveStep((s) => ({ ...s, gdp: 'gdp-4' }))}>
              <p className="text-lg text-gray-300 leading-relaxed">
                <strong className="text-white">2023</strong>. China is now the world&apos;s second-largest economy. India has surpassed the UK. The top 10 looks nothing like it did 60 years ago.
              </p>
              <p className="text-gray-400 mt-4">
                The story of GDP is the story of ambition — billions of people refusing to accept that poverty was their destiny.
              </p>
            </NarrativeBlock>
          </div>

          {/* Sticky viz */}
          <div className="md:w-[60%]">
            <div className="sticky top-24 pt-8">
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <GDPBarChart data={gdpData} year={gdpYear} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 2: Life Expectancy — The Gift of Years */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          <div className="md:w-[40%]">
            <NarrativeBlock isActive={activeStep.life === 'life-1'} onVisible={() => setActiveStep((s) => ({ ...s, life: 'life-1' }))}>
              <p className="text-emerald-400 text-sm uppercase tracking-widest mb-3">Chapter II</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The Gift of Years</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                In <strong className="text-white">1990</strong>, the average human could expect to live about <span className="text-emerald-400 font-bold text-2xl">65 years</span>. But that number hid a cruel truth: where you were born determined how long you&apos;d live.
              </p>
              <p className="text-gray-400 mt-4">
                A child born in Japan could expect 79 years. A child born in Sierra Leone? Just 38.
              </p>
            </NarrativeBlock>

            <NarrativeBlock isActive={activeStep.life === 'life-2'} onVisible={() => setActiveStep((s) => ({ ...s, life: 'life-2' }))}>
              <p className="text-lg text-gray-300 leading-relaxed">
                Then something remarkable happened. <strong className="text-white">Asia</strong> began closing the gap — not in decades, but in years. Vaccines, clean water, education. Simple things that changed everything.
              </p>
              <p className="text-gray-400 mt-4">
                By 2000, China&apos;s life expectancy had reached 72 years. India hit 63. The bubbles were drifting upward — slowly, stubbornly, beautifully.
              </p>
            </NarrativeBlock>

            <NarrativeBlock isActive={activeStep.life === 'life-3'} onVisible={() => setActiveStep((s) => ({ ...s, life: 'life-3' }))}>
              <p className="text-lg text-gray-300 leading-relaxed">
                But <strong className="text-white">Africa</strong> tells a different story. The HIV/AIDS crisis of the early 2000s reversed decades of progress. In some nations, life expectancy dropped by 20 years.
              </p>
              <p className="text-gray-400 mt-4">
                Look at the orange cluster. That&apos;s not just data — those are millions of lives cut short, families broken, futures stolen.
              </p>
            </NarrativeBlock>

            <NarrativeBlock isActive={activeStep.life === 'life-4'} onVisible={() => setActiveStep((s) => ({ ...s, life: 'life-4' }))}>
              <p className="text-lg text-gray-300 leading-relaxed">
                By <strong className="text-white">2022</strong>, the world has largely recovered. The gap between richest and poorest nations has narrowed from 40 years to about 25.
              </p>
              <p className="text-gray-400 mt-4">
                We&apos;re not there yet. But the trajectory is clear: <span className="text-white">humanity is winning the race against death</span> — one vaccine, one well, one clinic at a time.
              </p>
            </NarrativeBlock>
          </div>

          <div className="md:w-[60%]">
            <div className="sticky top-24 pt-8">
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <LifeExpScatter data={lifeData} year={lifeYear} highlight={lifeHighlight} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 3: CO₂ — The Price of Progress */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          <div className="md:w-[40%]">
            <NarrativeBlock isActive={activeStep.co2 === 'co2-1'} onVisible={() => setActiveStep((s) => ({ ...s, co2: 'co2-1' }))}>
              <p className="text-orange-400 text-sm uppercase tracking-widest mb-3">Chapter III</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The Price of Progress</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Every ton of GDP came with a shadow: carbon dioxide. In <strong className="text-white">1990</strong>, the world emitted 22 billion tons of CO₂. The US and Europe were the undisputed champions of this dubious race.
              </p>
              <p className="text-gray-400 mt-4">
                For 200 years, the West had been burning fossil fuels as if the atmosphere were infinite. It isn&apos;t.
              </p>
            </NarrativeBlock>

            <NarrativeBlock isActive={activeStep.co2 === 'co2-2'} onVisible={() => setActiveStep((s) => ({ ...s, co2: 'co2-2' }))}>
              <p className="text-lg text-gray-300 leading-relaxed">
                By <strong className="text-white">2000</strong>, a new giant was emerging. China&apos;s factories — building the products the world wanted — were pumping out CO₂ at an accelerating rate.
              </p>
              <p className="text-gray-400 mt-4">
                The moral question haunts every climate summit: who pays for progress?
              </p>
            </NarrativeBlock>

            <NarrativeBlock isActive={activeStep.co2 === 'co2-3'} onVisible={() => setActiveStep((s) => ({ ...s, co2: 'co2-3' }))}>
              <p className="text-lg text-gray-300 leading-relaxed">
                <strong className="text-white">2010</strong>. China surpasses the United States as the world&apos;s largest emitter. India enters the top 3. The global south argues: &ldquo;You industrialized with coal. Why can&apos;t we?&rdquo;
              </p>
              <p className="text-gray-400 mt-4">
                They have a point. The cumulative emissions tell a very different story than the annual ones.
              </p>
            </NarrativeBlock>

            <NarrativeBlock isActive={activeStep.co2 === 'co2-4'} onVisible={() => setActiveStep((s) => ({ ...s, co2: 'co2-4' }))}>
              <p className="text-lg text-gray-300 leading-relaxed">
                <strong className="text-white">2022</strong>. Global emissions: 37 billion tons. But there are glimmers of hope — European emissions are falling. Renewable energy is now cheaper than coal in most of the world.
              </p>
              <p className="text-gray-400 mt-4">
                The question is no longer <em>if</em> we can transition. It&apos;s <span className="text-white">whether we&apos;ll do it fast enough</span>.
              </p>
            </NarrativeBlock>
          </div>

          <div className="md:w-[60%]">
            <div className="sticky top-24 pt-8">
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <CO2Bars data={co2Data} year={co2Year} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 4: Population — The Shape of Tomorrow */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          <div className="md:w-[40%]">
            <NarrativeBlock isActive={activeStep.pop === 'pop-1'} onVisible={() => setActiveStep((s) => ({ ...s, pop: 'pop-1' }))}>
              <p className="text-pink-400 text-sm uppercase tracking-widest mb-3">Chapter IV</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The Shape of Tomorrow</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                A population pyramid tells you everything about a nation&apos;s future. In <strong className="text-white">Japan, 1990</strong>, the shape was healthy — wide at the base, tapering at the top. Young people everywhere. Potential everywhere.
              </p>
            </NarrativeBlock>

            <NarrativeBlock isActive={activeStep.pop === 'pop-2'} onVisible={() => setActiveStep((s) => ({ ...s, pop: 'pop-2' }))}>
              <p className="text-lg text-gray-300 leading-relaxed">
                Fast forward to <strong className="text-white">Japan, 2020</strong>. The pyramid has inverted. The bulge has shifted upward. Japan now sells more adult diapers than baby diapers.
              </p>
              <p className="text-gray-400 mt-4">
                This isn&apos;t just a demographic curiosity — it&apos;s an economic earthquake. Fewer workers supporting more retirees. A shrinking tax base. Empty schools. Entire villages abandoned.
              </p>
            </NarrativeBlock>

            <NarrativeBlock isActive={activeStep.pop === 'pop-3'} onVisible={() => setActiveStep((s) => ({ ...s, pop: 'pop-3' }))}>
              <p className="text-lg text-gray-300 leading-relaxed">
                The <strong className="text-white">United States</strong> tells a different story. Immigration has kept the base wider. The millennial generation creates a bulge in the middle. But the trend is the same — just slower.
              </p>
            </NarrativeBlock>

            <NarrativeBlock isActive={activeStep.pop === 'pop-4'} onVisible={() => setActiveStep((s) => ({ ...s, pop: 'pop-4' }))}>
              <p className="text-lg text-gray-300 leading-relaxed">
                <strong className="text-white">Germany</strong> — Europe&apos;s largest economy — faces the same challenge. The baby boom generation is retiring. Who will build the cars? Who will pay the pensions?
              </p>
              <p className="text-gray-400 mt-4">
                The shape of a population isn&apos;t just a chart. It&apos;s a <span className="text-white">prophecy</span>.
              </p>
            </NarrativeBlock>
          </div>

          <div className="md:w-[60%]">
            <div className="sticky top-24 pt-8">
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <PopPyramidMini data={popData} country={popConfig.country} year={popConfig.year} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* OUTRO */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[1000px] h-[1000px] rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-3xl"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            <span className="text-white/90">Data doesn&apos;t just</span>
            <br />
            <span className="text-white/90">describe the world.</span>
            <br />
            <span className="gradient-text">It reveals its soul.</span>
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed mb-12">
            Behind every data point is a human life. A child who survived. A factory that opened. A forest that burned. A nation that rose. These numbers are not abstract — they are the autobiography of our species.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:scale-105 transition-transform"
          >
            Explore More with EXD
          </Link>
          <p className="text-gray-600 text-sm mt-8">
            Sources: World Bank, Our World in Data, United Nations
          </p>
        </motion.div>
      </section>
    </main>
  );
}
