'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';

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

// ─── HERO ───────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-6 py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-transparent to-transparent" />
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        >
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          Media &amp; Advertising Use Case
        </motion.span>
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}
        >
          Powering the Future of{' '}
          <span className="gradient-text">Advertising</span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
        >
          EXD transforms media spend, audience analytics and DOOH performance data into actionable insights — enabling smarter campaigns and higher ROI across every channel.
        </motion.p>
        <motion.a
          href="#visualizations"
          className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-white font-medium text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          Explore the Data ↓
        </motion.a>
      </div>
    </section>
  );
}

// ─── 1. AD SPEND TRACKER ────────────────────────────────────────
const AD_SPEND_DATA = (() => {
  const channels = ['TV', 'Digital', 'OOH', 'Social', 'Print'];
  const years = Array.from({ length: 10 }, (_, i) => 2016 + i);
  // Billions USD — realistic global ad spend trends
  const base: Record<string, number[]> = {
    TV:      [185, 182, 178, 175, 160, 155, 162, 160, 155, 150],
    Digital: [195, 230, 270, 310, 340, 380, 420, 465, 510, 560],
    OOH:     [ 32,  34,  36,  38,  24,  29,  35,  39,  42,  46],
    Social:  [ 31,  48,  65,  84,  96, 115, 137, 155, 172, 190],
    Print:   [ 68,  62,  55,  49,  38,  33,  30,  27,  25,  23],
  };
  return years.map((year, yi) => ({
    year,
    ...Object.fromEntries(channels.map(ch => [ch, base[ch][yi]])),
  }));
})();

const CHANNEL_COLORS: Record<string, string> = {
  TV: '#8b5cf6',
  Digital: '#06b6d4',
  OOH: '#6366f1',
  Social: '#a855f7',
  Print: '#64748b',
};

function AdSpendTracker() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const [activeYear, setActiveYear] = useState<number | null>(null);

  useEffect(() => {
    if (!svgRef.current || !isInView) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 700, height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const iw = width - margin.left - margin.right;
    const ih = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const channels = ['TV', 'Digital', 'OOH', 'Social', 'Print'];
    const years = AD_SPEND_DATA.map(d => d.year);

    const stackedData = d3.stack<Record<string, number>>()
      .keys(channels)(AD_SPEND_DATA as unknown as Record<string, number>[]);

    const x = d3.scaleBand().domain(years.map(String)).range([0, iw]).padding(0.25);
    const maxY = d3.max(stackedData[stackedData.length - 1], d => d[1]) || 1000;
    const y = d3.scaleLinear().domain([0, maxY * 1.05]).range([ih, 0]);

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${ih})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll('text').attr('fill', '#6b7280').attr('font-size', 10);
    g.selectAll('.domain').attr('stroke', 'rgba(255,255,255,0.1)');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(6).tickFormat(d => `$${d}B`).tickSize(-iw))
      .selectAll('text').attr('fill', '#6b7280').attr('font-size', 10);
    g.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.05)');
    g.selectAll('.domain').remove();

    // Bars
    stackedData.forEach((layer, li) => {
      g.selectAll(`.bar-${layer.key}`)
        .data(layer)
        .enter()
        .append('rect')
        .attr('x', d => x(String((d.data as Record<string, number>).year))!)
        .attr('width', x.bandwidth())
        .attr('y', ih)
        .attr('height', 0)
        .attr('fill', CHANNEL_COLORS[layer.key])
        .attr('opacity', 0.85)
        .attr('rx', 2)
        .transition()
        .delay((_, i) => i * 60 + li * 40)
        .duration(600)
        .ease(d3.easeCubicOut)
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]));
    });
  }, [isInView]);

  const yearData = activeYear ? AD_SPEND_DATA.find(d => d.year === activeYear) : null;

  return (
    <div ref={containerRef} className="glass-card rounded-2xl p-6 relative">
      <h3 className="text-lg font-semibold mb-1">Global Ad Spend by Channel</h3>
      <p className="text-sm text-gray-500 mb-4">Stacked bar chart — billions USD, 2016–2025</p>
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(CHANNEL_COLORS).map(([ch, col]) => (
          <span key={ch} className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-3 h-3 rounded-sm" style={{ background: col, opacity: 0.85 }} />
            {ch}
          </span>
        ))}
      </div>
      <div className="overflow-x-auto">
        <svg ref={svgRef} viewBox="0 0 700 400" className="w-full" />
      </div>
      {/* Year hover pills */}
      <div className="flex flex-wrap gap-2 mt-4">
        {AD_SPEND_DATA.map(d => (
          <button
            key={d.year}
            onMouseEnter={() => setActiveYear(d.year)}
            onMouseLeave={() => setActiveYear(null)}
            className={`px-2.5 py-1 rounded-full text-[11px] transition-all ${
              activeYear === d.year ? 'bg-white/10 text-white' : 'bg-white/[0.03] text-gray-500 hover:text-gray-300'
            }`}
          >
            {d.year}
          </button>
        ))}
      </div>
      {yearData && (
        <motion.div
          className="mt-3 grid grid-cols-5 gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
        >
          {(['TV', 'Digital', 'OOH', 'Social', 'Print'] as const).map(ch => (
            <div key={ch} className="text-center">
              <div className="text-sm font-bold" style={{ color: CHANNEL_COLORS[ch] }}>
                ${(yearData as Record<string, number>)[ch]}B
              </div>
              <div className="text-[10px] text-gray-500">{ch}</div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ─── 2. DOOH REACH CALCULATOR ───────────────────────────────────
const CITY_DATA: Record<string, { displays: number; weeklyContacts: number; cpmBase: number }> = {
  Berlin:    { displays: 3700, weeklyContacts: 226_000_000, cpmBase: 5.80 },
  Hamburg:   { displays: 1800, weeklyContacts: 112_000_000, cpmBase: 6.20 },
  München:   { displays: 1500, weeklyContacts: 98_000_000,  cpmBase: 6.50 },
  Köln:      { displays: 1200, weeklyContacts: 78_000_000,  cpmBase: 5.40 },
  Frankfurt: { displays: 1100, weeklyContacts: 72_000_000,  cpmBase: 6.10 },
  Stuttgart: { displays: 900,  weeklyContacts: 58_000_000,  cpmBase: 5.60 },
};

function DOOHReachCalculator() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [city, setCity] = useState('Berlin');
  const [screens, setScreens] = useState(200);

  const result = useMemo(() => {
    const cd = CITY_DATA[city];
    const ratio = screens / cd.displays;
    const weeklyImpressions = Math.round(cd.weeklyContacts * ratio);
    const reach = Math.round(weeklyImpressions * 0.62); // 62% unique
    const cpm = +(cd.cpmBase * (1 + ratio * 0.15)).toFixed(2); // slight premium at scale
    return { weeklyImpressions, reach, cpm, maxDisplays: cd.displays };
  }, [city, screens]);

  return (
    <motion.div
      ref={ref}
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-lg font-semibold mb-1">DOOH Reach Calculator</h3>
      <p className="text-sm text-gray-500 mb-6">Select a city and number of screens to estimate weekly performance</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* City selector */}
        <div>
          <label className="text-xs text-gray-400 mb-2 block">City</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(CITY_DATA).map(c => (
              <button
                key={c}
                onClick={() => { setCity(c); setScreens(Math.min(screens, CITY_DATA[c].displays)); }}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                  city === c
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-white'
                    : 'bg-white/[0.02] border-white/[0.06] text-gray-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Screen slider */}
        <div>
          <label className="text-xs text-gray-400 mb-2 block">
            Screens: <span className="text-white font-semibold">{screens.toLocaleString()}</span>
            <span className="text-gray-600"> / {result.maxDisplays.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min={10}
            max={result.maxDisplays}
            step={10}
            value={screens}
            onChange={e => setScreens(+e.target.value)}
            className="w-full accent-indigo-500 mt-2"
          />
          <div className="flex justify-between text-[10px] text-gray-600 mt-1">
            <span>10</span>
            <span>{result.maxDisplays.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Weekly Impressions', value: result.weeklyImpressions >= 1_000_000 ? `${(result.weeklyImpressions / 1_000_000).toFixed(1)}M` : `${(result.weeklyImpressions / 1_000).toFixed(0)}K`, color: 'text-cyan-400' },
          { label: 'Unique Reach', value: result.reach >= 1_000_000 ? `${(result.reach / 1_000_000).toFixed(1)}M` : `${(result.reach / 1_000).toFixed(0)}K`, color: 'text-purple-400' },
          { label: 'Avg CPM', value: `€${result.cpm}`, color: 'text-indigo-400' },
        ].map((m, i) => (
          <motion.div
            key={i}
            className="text-center bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
            initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}
          >
            <div className={`text-2xl md:text-3xl font-bold ${m.color}`}>{m.value}</div>
            <div className="text-xs text-gray-500 mt-1">{m.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── 3. AUDIENCE HEATMAP ────────────────────────────────────────
const BERLIN_LOCATIONS = [
  'Alexanderplatz', 'Kurfürstendamm', 'Friedrichstraße',
  'Potsdamer Platz', 'Hackescher Markt', 'East Side Gallery',
];
const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00–21:00

// Mock pedestrian traffic (thousands per hour)
const HEATMAP_DATA: number[][] = [
  [2.1,3.4,5.8,7.2,8.1,9.5,10.2,11.8,12.5,11.2,10.8,9.5,8.2,7.1,5.8,3.2], // Alexanderplatz
  [1.2,2.8,4.5,5.8,6.2,7.1,7.8,8.5,9.2,8.8,8.1,7.5,6.8,5.2,3.8,2.1],     // Ku'damm
  [1.8,3.1,5.2,6.5,7.8,8.2,8.8,9.5,10.1,9.2,8.5,7.8,6.5,5.5,4.2,2.5],    // Friedrichstr
  [1.5,2.5,4.8,6.8,7.5,8.8,9.5,10.8,11.2,10.5,9.8,8.8,7.2,6.1,4.5,2.8],  // Potsdamer Pl
  [0.8,1.5,3.2,4.5,5.8,6.5,7.2,8.1,8.8,8.2,7.5,6.8,5.5,4.2,3.1,1.8],     // Hackescher M
  [0.5,0.8,2.1,3.2,4.1,5.2,6.5,7.8,8.5,9.1,8.8,7.5,6.2,4.8,3.5,2.2],     // East Side
];

function AudienceHeatmap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const allValues = HEATMAP_DATA.flat();
  const colorScale = d3.scaleSequential(d3.interpolateViridis)
    .domain([d3.min(allValues)!, d3.max(allValues)!]);

  const cellW = 38, cellH = 32;
  const labelW = 130, headerH = 28;
  const svgW = labelW + HOURS.length * cellW;
  const svgH = headerH + BERLIN_LOCATIONS.length * cellH;

  return (
    <motion.div
      ref={ref}
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-lg font-semibold mb-1">Audience Heatmap — Berlin</h3>
      <p className="text-sm text-gray-500 mb-4">Pedestrian traffic (thousands/hr) by location and time of day</p>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full min-w-[600px]">
          {/* Hour headers */}
          {HOURS.map((h, i) => (
            <text
              key={h}
              x={labelW + i * cellW + cellW / 2}
              y={headerH - 8}
              textAnchor="middle"
              fill="#6b7280"
              fontSize={9}
            >
              {String(h).padStart(2, '0')}:00
            </text>
          ))}

          {/* Rows */}
          {BERLIN_LOCATIONS.map((loc, li) => (
            <g key={loc}>
              <text
                x={labelW - 8}
                y={headerH + li * cellH + cellH / 2 + 4}
                textAnchor="end"
                fill="#9ca3af"
                fontSize={10}
              >
                {loc}
              </text>
              {HOURS.map((_, hi) => {
                const val = HEATMAP_DATA[li][hi];
                return (
                  <motion.rect
                    key={hi}
                    x={labelW + hi * cellW + 1}
                    y={headerH + li * cellH + 1}
                    width={cellW - 2}
                    height={cellH - 2}
                    rx={4}
                    fill={colorScale(val)}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 0.85 } : {}}
                    transition={{ delay: li * 0.04 + hi * 0.02, duration: 0.3 }}
                  />
                );
              })}
              {HOURS.map((_, hi) => {
                const val = HEATMAP_DATA[li][hi];
                return (
                  <text
                    key={`t-${hi}`}
                    x={labelW + hi * cellW + cellW / 2}
                    y={headerH + li * cellH + cellH / 2 + 4}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.7)"
                    fontSize={8}
                    fontWeight={600}
                  >
                    {val.toFixed(1)}
                  </text>
                );
              })}
            </g>
          ))}
        </svg>
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        <span>Low</span>
        <div className="h-2 w-32 rounded-full" style={{ background: `linear-gradient(to right, ${colorScale(0.5)}, ${colorScale(6)}, ${colorScale(12.5)})` }} />
        <span>High</span>
      </div>
    </motion.div>
  );
}

// ─── 4. CAMPAIGN ROI SIMULATOR ──────────────────────────────────
function CampaignROISimulator() {
  const ref = useRef(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const [budget, setBudget] = useState(50000);
  const [duration, setDuration] = useState(4); // weeks
  const [channelMix, setChannelMix] = useState({ digital: 40, social: 30, ooh: 20, tv: 10 });

  const updateMix = useCallback((key: string, val: number) => {
    setChannelMix(prev => {
      const others = Object.entries(prev).filter(([k]) => k !== key);
      const remaining = 100 - val;
      const othersTotal = others.reduce((s, [, v]) => s + v, 0) || 1;
      const newMix = { ...prev, [key]: val };
      others.forEach(([k, v]) => {
        (newMix as Record<string, number>)[k] = Math.max(0, Math.round((v / othersTotal) * remaining));
      });
      return newMix;
    });
  }, []);

  // ROI projection over weeks
  const projection = useMemo(() => {
    const weeks = Array.from({ length: duration }, (_, i) => i + 1);
    // Different channel multipliers
    const mult: Record<string, number> = { digital: 3.2, social: 2.8, ooh: 2.1, tv: 1.6 };
    const weeklyBudget = budget / duration;

    return weeks.map(w => {
      const cumulativeSpend = weeklyBudget * w;
      // Revenue grows with diminishing returns + channel efficiency
      const efficiency = Object.entries(channelMix).reduce(
        (s, [k, pct]) => s + (pct / 100) * mult[k], 0
      );
      const revenue = cumulativeSpend * efficiency * (1 - Math.exp(-w / (duration * 0.6)));
      return { week: w, spend: Math.round(cumulativeSpend), revenue: Math.round(revenue), roi: revenue > 0 ? +((revenue / cumulativeSpend - 1) * 100).toFixed(0) : 0 };
    });
  }, [budget, duration, channelMix]);

  useEffect(() => {
    if (!svgRef.current || !isInView) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 600, height = 280;
    const margin = { top: 20, right: 20, bottom: 30, left: 55 };
    const iw = width - margin.left - margin.right;
    const ih = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([1, duration]).range([0, iw]);
    const maxVal = d3.max(projection, d => Math.max(d.spend, d.revenue)) || 1;
    const y = d3.scaleLinear().domain([0, maxVal * 1.1]).range([ih, 0]);

    // Grid
    g.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => `€${(+d / 1000).toFixed(0)}k`).tickSize(-iw))
      .selectAll('text').attr('fill', '#6b7280').attr('font-size', 10);
    g.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.05)');
    g.selectAll('.domain').remove();

    g.append('g').attr('transform', `translate(0,${ih})`).call(d3.axisBottom(x).ticks(duration).tickFormat(d => `W${d}`).tickSize(0))
      .selectAll('text').attr('fill', '#6b7280').attr('font-size', 10);
    g.selectAll('.domain').attr('stroke', 'rgba(255,255,255,0.1)');

    // Area fill for revenue
    const area = d3.area<typeof projection[0]>()
      .x(d => x(d.week)).y0(ih).y1(d => y(d.revenue)).curve(d3.curveMonotoneX);
    g.append('path').datum(projection).attr('d', area).attr('fill', 'rgba(139,92,246,0.1)');

    // Spend line
    const spendLine = d3.line<typeof projection[0]>().x(d => x(d.week)).y(d => y(d.spend)).curve(d3.curveMonotoneX);
    const spendPath = g.append('path').datum(projection).attr('d', spendLine).attr('fill', 'none')
      .attr('stroke', '#64748b').attr('stroke-width', 2).attr('stroke-dasharray', '6,3');
    const spendLen = (spendPath.node() as SVGPathElement).getTotalLength();
    spendPath.attr('stroke-dashoffset', spendLen).transition().duration(1200).attr('stroke-dashoffset', 0);

    // Revenue line
    const revLine = d3.line<typeof projection[0]>().x(d => x(d.week)).y(d => y(d.revenue)).curve(d3.curveMonotoneX);
    const revPath = g.append('path').datum(projection).attr('d', revLine).attr('fill', 'none')
      .attr('stroke', '#8b5cf6').attr('stroke-width', 2.5);
    const revLen = (revPath.node() as SVGPathElement).getTotalLength();
    revPath.attr('stroke-dasharray', revLen).attr('stroke-dashoffset', revLen).transition().duration(1400).attr('stroke-dashoffset', 0);

    // Dots on revenue line
    projection.forEach((d, i) => {
      g.append('circle').attr('cx', x(d.week)).attr('cy', y(d.revenue)).attr('r', 0)
        .attr('fill', '#8b5cf6').attr('stroke', '#050507').attr('stroke-width', 2)
        .transition().delay(i * 100 + 800).duration(300).attr('r', 4);
    });
  }, [isInView, projection, duration]);

  const finalROI = projection[projection.length - 1]?.roi ?? 0;

  return (
    <motion.div
      ref={ref}
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-lg font-semibold mb-1">Campaign ROI Simulator</h3>
      <p className="text-sm text-gray-500 mb-6">Adjust budget, duration &amp; channel mix to project returns</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-xs text-gray-400 block mb-1">
            Budget: <span className="text-white font-semibold">€{budget.toLocaleString()}</span>
          </label>
          <input type="range" min={5000} max={500000} step={5000} value={budget}
            onChange={e => setBudget(+e.target.value)} className="w-full accent-purple-500" />
          <div className="flex justify-between text-[10px] text-gray-600 mt-1"><span>€5K</span><span>€500K</span></div>
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">
            Duration: <span className="text-white font-semibold">{duration} weeks</span>
          </label>
          <input type="range" min={1} max={12} step={1} value={duration}
            onChange={e => setDuration(+e.target.value)} className="w-full accent-purple-500" />
          <div className="flex justify-between text-[10px] text-gray-600 mt-1"><span>1w</span><span>12w</span></div>
        </div>
      </div>

      {/* Channel mix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(channelMix).map(([k, v]) => (
          <div key={k}>
            <label className="text-[10px] text-gray-400 block mb-1 capitalize">{k}: {v}%</label>
            <input type="range" min={0} max={100} step={5} value={v}
              onChange={e => updateMix(k, +e.target.value)} className="w-full accent-indigo-500" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="overflow-x-auto">
        <svg ref={svgRef} viewBox="0 0 600 280" className="w-full" />
      </div>

      <div className="flex items-center gap-6 mt-4">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-5 h-0.5 bg-gray-500 inline-block" style={{ borderTop: '2px dashed #64748b' }} /> Spend
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-5 h-0.5 bg-purple-500 inline-block rounded" /> Revenue
        </span>
        <span className="ml-auto text-sm font-semibold">
          Projected ROI: <span className={finalROI >= 0 ? 'text-emerald-400' : 'text-red-400'}>{finalROI}%</span>
        </span>
      </div>
    </motion.div>
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
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Supercharge Your <span className="gradient-text">Campaigns</span>
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Join the waitlist and unlock EXD&apos;s media intelligence platform for data-driven advertising.
        </p>
        <button
          data-tf-popup="RX9edslL"
          data-tf-opacity="100"
          data-tf-size="100"
          data-tf-iframe-props="title=EXD Waitlist"
          data-tf-transitive-search-params
          data-tf-medium="snippet"
          className="px-10 py-4 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-white font-medium text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all cursor-pointer"
        >
          Get Early Access →
        </button>
      </motion.div>
    </section>
  );
}

// ─── PAGE ───────────────────────────────────────────────────────
export default function MediaAdvertisingUseCasePage() {
  useTypeform();
  return (
    <main className="min-h-screen">
      <Hero />
      <section id="visualizations" className="py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <AdSpendTracker />
          <DOOHReachCalculator />
          <AudienceHeatmap />
          <CampaignROISimulator />
        </div>
      </section>
      <CTA />
    </main>
  );
}
