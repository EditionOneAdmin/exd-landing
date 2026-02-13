'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
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
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-transparent to-transparent" />
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Real Estate Use Case
        </motion.span>
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}
        >
          Data-Driven{' '}
          <span className="gradient-text">Real Estate Intelligence</span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
        >
          EXD fuses location analytics, market trends and demographic data to give investors, developers and agents a decisive edge in European property markets.
        </motion.p>
        <motion.a
          href="#visualizations"
          className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-white font-medium text-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          Explore the Data ↓
        </motion.a>
      </div>
    </section>
  );
}

// ─── PROPERTY PRICE MAP (Choropleth) ────────────────────────────
const europeanCountries = [
  { id: 'DE', name: 'Germany', index: 178, x: 280, y: 140, w: 50, h: 55 },
  { id: 'FR', name: 'France', index: 165, x: 220, y: 170, w: 55, h: 60 },
  { id: 'GB', name: 'United Kingdom', index: 192, x: 200, y: 100, w: 40, h: 55 },
  { id: 'ES', name: 'Spain', index: 142, x: 190, y: 240, w: 60, h: 50 },
  { id: 'IT', name: 'Italy', index: 128, x: 300, y: 210, w: 40, h: 65 },
  { id: 'NL', name: 'Netherlands', index: 205, x: 260, y: 120, w: 25, h: 25 },
  { id: 'SE', name: 'Sweden', index: 168, x: 310, y: 30, w: 35, h: 80 },
  { id: 'AT', name: 'Austria', index: 171, x: 305, y: 165, w: 35, h: 20 },
  { id: 'PL', name: 'Poland', index: 138, x: 340, y: 125, w: 45, h: 40 },
  { id: 'CZ', name: 'Czech Republic', index: 162, x: 315, y: 145, w: 30, h: 20 },
  { id: 'DK', name: 'Denmark', index: 155, x: 280, y: 95, w: 25, h: 25 },
  { id: 'PT', name: 'Portugal', index: 152, x: 170, y: 245, w: 20, h: 45 },
  { id: 'IE', name: 'Ireland', index: 148, x: 175, y: 105, w: 25, h: 30 },
  { id: 'NO', name: 'Norway', index: 185, x: 285, y: 20, w: 30, h: 85 },
  { id: 'FI', name: 'Finland', index: 145, x: 360, y: 20, w: 40, h: 70 },
  { id: 'CH', name: 'Switzerland', index: 210, x: 275, y: 180, w: 25, h: 18 },
  { id: 'BE', name: 'Belgium', index: 158, x: 248, y: 140, w: 20, h: 18 },
  { id: 'HU', name: 'Hungary', index: 132, x: 345, y: 175, w: 35, h: 22 },
  { id: 'RO', name: 'Romania', index: 118, x: 370, y: 190, w: 40, h: 30 },
  { id: 'GR', name: 'Greece', index: 108, x: 360, y: 240, w: 35, h: 40 },
];

function PropertyPriceMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !isInView) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 550;
    const height = 340;

    const color = d3.scaleSequential(d3.interpolatePlasma).domain([100, 220]);

    const g = svg.append('g');

    // Draw country blocks
    g.selectAll('rect')
      .data(europeanCountries)
      .enter()
      .append('rect')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.w)
      .attr('height', d => d.h)
      .attr('rx', 4)
      .attr('fill', d => color(d.index))
      .attr('stroke', '#1a1a2e')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0)
      .on('mouseenter', function (event, d) {
        const rect = svgRef.current!.getBoundingClientRect();
        setTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top - 10,
          text: `${d.name}: HPI ${d.index} (2015 = 100)`
        });
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 2);
      })
      .on('mouseleave', function () {
        setTooltip(null);
        d3.select(this).attr('stroke', '#1a1a2e').attr('stroke-width', 1.5);
      })
      .transition()
      .delay((_, i) => i * 60)
      .duration(500)
      .attr('opacity', 1);

    // Country labels
    g.selectAll('text')
      .data(europeanCountries)
      .enter()
      .append('text')
      .attr('x', d => d.x + d.w / 2)
      .attr('y', d => d.y + d.h / 2 + 4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', 9)
      .attr('font-weight', 600)
      .attr('pointer-events', 'none')
      .attr('opacity', 0)
      .text(d => d.id)
      .transition()
      .delay((_, i) => i * 60 + 300)
      .duration(400)
      .attr('opacity', 0.9);

    // Legend
    const legendW = 180;
    const legendH = 10;
    const legendX = width - legendW - 20;
    const legendY = height - 25;
    const defs = svg.append('defs');
    const grad = defs.append('linearGradient').attr('id', 'price-legend');
    grad.append('stop').attr('offset', '0%').attr('stop-color', color(100));
    grad.append('stop').attr('offset', '100%').attr('stop-color', color(220));
    g.append('rect').attr('x', legendX).attr('y', legendY).attr('width', legendW).attr('height', legendH).attr('rx', 3).attr('fill', 'url(#price-legend)');
    g.append('text').attr('x', legendX).attr('y', legendY - 5).attr('fill', '#9ca3af').attr('font-size', 9).text('HPI 100');
    g.append('text').attr('x', legendX + legendW).attr('y', legendY - 5).attr('fill', '#9ca3af').attr('font-size', 9).attr('text-anchor', 'end').text('HPI 220');
  }, [isInView]);

  return (
    <div ref={containerRef} className="glass-card rounded-2xl p-6 relative">
      <h3 className="text-lg font-semibold mb-1">European Housing Price Index</h3>
      <p className="text-sm text-gray-500 mb-4">2024 Q4 — Eurostat House Price Index (2015 = 100)</p>
      <div className="overflow-x-auto relative">
        <svg ref={svgRef} viewBox="0 0 550 340" className="w-full" />
        {tooltip && (
          <div className="absolute pointer-events-none px-3 py-1.5 rounded-lg bg-black/90 text-xs text-white border border-white/10 whitespace-nowrap" style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%,-100%)' }}>
            {tooltip.text}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LOCATION SCORE CALCULATOR ──────────────────────────────────
const locationData: Record<string, { transport: number; amenities: number; growth: number; rental: number }> = {
  'Berlin — Mitte': { transport: 95, amenities: 92, growth: 78, rental: 62 },
  'Berlin — Kreuzberg': { transport: 88, amenities: 90, growth: 82, rental: 68 },
  'Berlin — Prenzlauer Berg': { transport: 85, amenities: 88, growth: 75, rental: 58 },
  'Munich — Schwabing': { transport: 90, amenities: 94, growth: 65, rental: 48 },
  'Munich — Maxvorstadt': { transport: 92, amenities: 91, growth: 60, rental: 45 },
  'Hamburg — HafenCity': { transport: 82, amenities: 85, growth: 88, rental: 72 },
  'Hamburg — Altona': { transport: 80, amenities: 82, growth: 70, rental: 65 },
  'London — Shoreditch': { transport: 88, amenities: 90, growth: 72, rental: 55 },
  'London — Canary Wharf': { transport: 85, amenities: 78, growth: 68, rental: 52 },
  'Paris — Le Marais': { transport: 95, amenities: 96, growth: 55, rental: 42 },
  'Paris — Belleville': { transport: 82, amenities: 75, growth: 85, rental: 70 },
};

function LocationScoreCalculator() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [selected, setSelected] = useState('Berlin — Mitte');
  const scores = locationData[selected];
  const overall = Math.round((scores.transport + scores.amenities + scores.growth + scores.rental) / 4);

  const categories = [
    { label: 'Transport', value: scores.transport, color: 'bg-indigo-500' },
    { label: 'Amenities', value: scores.amenities, color: 'bg-purple-500' },
    { label: 'Growth Potential', value: scores.growth, color: 'bg-cyan-500' },
    { label: 'Rental Yield', value: scores.rental, color: 'bg-emerald-500' },
  ];

  return (
    <motion.div
      ref={ref}
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-lg font-semibold mb-1">Location Score Calculator</h3>
      <p className="text-sm text-gray-500 mb-6">Select a city district to see its investment scores</p>

      <select
        value={selected}
        onChange={e => setSelected(e.target.value)}
        className="w-full md:w-auto px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm mb-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        {Object.keys(locationData).map(k => (
          <option key={k} value={k} className="bg-[#0a0a12] text-white">{k}</option>
        ))}
      </select>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
        <div className="md:col-span-1 text-center">
          <div className="relative w-28 h-28 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="url(#score-grad)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${overall * 2.64} ${264 - overall * 2.64}`}
              />
              <defs>
                <linearGradient id="score-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{overall}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Overall Score</p>
        </div>

        <div className="md:col-span-4 space-y-4">
          {categories.map((cat, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{cat.label}</span>
                <span className="text-white font-semibold">{cat.value}/100</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${cat.color}`}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${cat.value}%` } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── MARKET TREND CHART ─────────────────────────────────────────
const cityTrends: Record<string, number[]> = {
  Berlin:  [100, 108, 118, 132, 148, 160, 172, 165, 170, 178, 185],
  Munich:  [100, 106, 114, 126, 140, 155, 168, 158, 162, 170, 180],
  Hamburg: [100, 105, 112, 122, 134, 145, 155, 150, 154, 162, 170],
  London:  [100, 110, 122, 136, 150, 158, 170, 162, 168, 180, 192],
  Paris:   [100, 104, 110, 118, 128, 138, 150, 145, 148, 155, 165],
};
const trendYears = Array.from({ length: 11 }, (_, i) => 2015 + i);
const cityColors: Record<string, string> = {
  Berlin: '#6366f1', Munich: '#a855f7', Hamburg: '#22d3ee', London: '#f59e0b', Paris: '#ef4444',
};

function MarketTrendChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !isInView) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 90, bottom: 40, left: 50 };
    const width = 650 - margin.left - margin.right;
    const height = 320 - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([2015, 2025]).range([0, width]);
    const y = d3.scaleLinear().domain([90, 200]).range([height, 0]);

    // Grid
    g.selectAll('.grid-line')
      .data(y.ticks(5))
      .enter()
      .append('line')
      .attr('x1', 0).attr('x2', width)
      .attr('y1', d => y(d)).attr('y2', d => y(d))
      .attr('stroke', 'rgba(255,255,255,0.05)');

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(11).tickFormat(d => String(d)))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('text').attr('fill', '#9ca3af').attr('font-size', 10))
      .call(g => g.selectAll('line').attr('stroke', 'rgba(255,255,255,0.1)'));

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('text').attr('fill', '#9ca3af').attr('font-size', 10))
      .call(g => g.selectAll('line').attr('stroke', 'rgba(255,255,255,0.1)'));

    const line = d3.line<number>()
      .x((_, i) => x(trendYears[i]))
      .y(d => y(d))
      .curve(d3.curveMonotoneX);

    Object.entries(cityTrends).forEach(([city, values], ci) => {
      const path = g.append('path')
        .datum(values)
        .attr('fill', 'none')
        .attr('stroke', cityColors[city])
        .attr('stroke-width', 2.5)
        .attr('d', line);

      const totalLength = path.node()!.getTotalLength();
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .delay(ci * 150)
        .duration(1200)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);

      // End label
      g.append('text')
        .attr('x', width + 8)
        .attr('y', y(values[values.length - 1]) + 4)
        .attr('fill', cityColors[city])
        .attr('font-size', 11)
        .attr('font-weight', 600)
        .attr('opacity', 0)
        .text(city)
        .transition()
        .delay(ci * 150 + 1000)
        .duration(400)
        .attr('opacity', 1);
    });

    // Hover overlay
    const hoverLine = g.append('line').attr('y1', 0).attr('y2', height).attr('stroke', 'rgba(255,255,255,0.2)').attr('stroke-width', 1).style('display', 'none');
    const overlay = g.append('rect').attr('width', width).attr('height', height).attr('fill', 'transparent').attr('cursor', 'crosshair');

    overlay
      .on('mousemove', function (event) {
        const [mx] = d3.pointer(event);
        const year = Math.round(x.invert(mx));
        if (year < 2015 || year > 2025) return;
        const idx = year - 2015;
        hoverLine.style('display', null).attr('x1', x(year)).attr('x2', x(year));
        const lines = Object.entries(cityTrends).map(([city, v]) => `${city}: ${v[idx]}`).join(' · ');
        const rect = svgRef.current!.getBoundingClientRect();
        setTooltip({ x: event.clientX - rect.left, y: event.clientY - rect.top - 10, text: `${year} — ${lines}` });
      })
      .on('mouseleave', () => { hoverLine.style('display', 'none'); setTooltip(null); });

  }, [isInView]);

  return (
    <div ref={containerRef} className="glass-card rounded-2xl p-6 relative">
      <h3 className="text-lg font-semibold mb-1">Market Price Trends</h3>
      <p className="text-sm text-gray-500 mb-4">Housing Price Index 2015–2025 for 5 European cities (2015 = 100)</p>
      <div className="overflow-x-auto relative">
        <svg ref={svgRef} viewBox="0 0 650 320" className="w-full" />
        {tooltip && (
          <div className="absolute pointer-events-none px-3 py-1.5 rounded-lg bg-black/90 text-xs text-white border border-white/10 whitespace-nowrap" style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%,-100%)' }}>
            {tooltip.text}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── INVESTMENT ROI SIMULATOR ───────────────────────────────────
function InvestmentROISimulator() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const [purchasePrice, setPurchasePrice] = useState(350000);
  const [monthlyRent, setMonthlyRent] = useState(1200);
  const [appreciationRate, setAppreciationRate] = useState(3.5);
  const [holdYears] = useState(10);

  const annualRent = monthlyRent * 12;
  const grossYield = ((annualRent / purchasePrice) * 100);
  const totalRentalIncome = annualRent * holdYears;
  const futureValue = purchasePrice * Math.pow(1 + appreciationRate / 100, holdYears);
  const capitalGain = futureValue - purchasePrice;
  const totalReturn = totalRentalIncome + capitalGain;
  const roi = ((totalReturn / purchasePrice) * 100);
  const annualizedROI = (Math.pow(1 + totalReturn / purchasePrice, 1 / holdYears) - 1) * 100;

  // Projection data for mini chart
  const projectionData = Array.from({ length: holdYears + 1 }, (_, i) => ({
    year: i,
    value: purchasePrice * Math.pow(1 + appreciationRate / 100, i) + annualRent * i,
  }));

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !isInView) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 10, right: 10, bottom: 25, left: 55 };
    const width = 500 - margin.left - margin.right;
    const height = 160 - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, holdYears]).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(projectionData, d => d.value)! * 1.05]).range([height, 0]);

    const area = d3.area<typeof projectionData[0]>()
      .x(d => x(d.year))
      .y0(height)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    const line = d3.line<typeof projectionData[0]>()
      .x(d => x(d.year))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    const defs = svg.append('defs');
    const grad = defs.append('linearGradient').attr('id', 'roi-area').attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#6366f1').attr('stop-opacity', 0.3);
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#6366f1').attr('stop-opacity', 0);

    g.append('path').datum(projectionData).attr('fill', 'url(#roi-area)').attr('d', area);
    g.append('path').datum(projectionData).attr('fill', 'none').attr('stroke', '#6366f1').attr('stroke-width', 2).attr('d', line);

    // Purchase price line
    g.append('line')
      .attr('x1', 0).attr('x2', width)
      .attr('y1', y(purchasePrice)).attr('y2', y(purchasePrice))
      .attr('stroke', 'rgba(255,255,255,0.15)')
      .attr('stroke-dasharray', '4 4');

    g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x).ticks(5).tickFormat(d => `Y${d}`))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('text').attr('fill', '#9ca3af').attr('font-size', 9))
      .call(g => g.selectAll('line').remove());

    g.append('g').call(d3.axisLeft(y).ticks(4).tickFormat(d => `€${(Number(d) / 1000).toFixed(0)}k`))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('text').attr('fill', '#9ca3af').attr('font-size', 9))
      .call(g => g.selectAll('line').remove());

  }, [isInView, purchasePrice, monthlyRent, appreciationRate, projectionData, holdYears]);

  return (
    <motion.div
      ref={ref}
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-lg font-semibold mb-1">Investment ROI Simulator</h3>
      <p className="text-sm text-gray-500 mb-6">Adjust parameters to project 10-year returns</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Purchase Price: <span className="text-white font-semibold">€{purchasePrice.toLocaleString()}</span>
          </label>
          <input type="range" min={100000} max={2000000} step={10000} value={purchasePrice}
            onChange={e => setPurchasePrice(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-white/10 accent-indigo-500 cursor-pointer" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Monthly Rent: <span className="text-white font-semibold">€{monthlyRent.toLocaleString()}</span>
          </label>
          <input type="range" min={300} max={5000} step={50} value={monthlyRent}
            onChange={e => setMonthlyRent(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-white/10 accent-purple-500 cursor-pointer" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Appreciation Rate: <span className="text-white font-semibold">{appreciationRate.toFixed(1)}%</span>
          </label>
          <input type="range" min={0} max={10} step={0.5} value={appreciationRate}
            onChange={e => setAppreciationRate(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-white/10 accent-cyan-500 cursor-pointer" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Gross Yield', value: `${grossYield.toFixed(1)}%`, color: 'text-indigo-400' },
          { label: 'Capital Gain', value: `€${(capitalGain / 1000).toFixed(0)}k`, color: 'text-purple-400' },
          { label: 'Total Return', value: `€${(totalReturn / 1000).toFixed(0)}k`, color: 'text-cyan-400' },
          { label: 'Annualized ROI', value: `${annualizedROI.toFixed(1)}%`, color: 'text-emerald-400' },
        ].map((m, i) => (
          <div key={i} className="text-center">
            <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
            <div className="text-xs text-gray-500 mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg ref={svgRef} viewBox="0 0 500 160" className="w-full" />
      </div>
    </motion.div>
  );
}

// ─── HOW IT WORKS ───────────────────────────────────────────────
function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const steps = [
    { num: '01', title: 'Aggregate', desc: 'EXD pulls property listings, transaction records, demographic and infrastructure data into one unified layer.', icon: '🏗️' },
    { num: '02', title: 'Analyze', desc: 'Machine learning models score locations, forecast appreciation and identify undervalued micro-markets in real time.', icon: '🧠' },
    { num: '03', title: 'Act', desc: 'Push insights to investment dashboards, CRM automations or site-selection tools — make confident decisions faster.', icon: '🚀' },
  ];
  return (
    <section className="py-28 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        >
          How EXD Powers <span className="gradient-text">Real Estate</span>
        </motion.h2>
        <motion.p
          className="text-gray-500 text-center mb-16 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.6 }}
        >
          Three steps from raw market data to investment-grade intelligence.
        </motion.p>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-2xl p-8 text-center relative overflow-hidden group hover:border-white/20 transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
            >
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-4xl mb-4 block">{s.icon}</span>
              <span className="text-xs font-mono text-indigo-400 tracking-widest">{s.num}</span>
              <h3 className="text-xl font-semibold mt-2 mb-3">{s.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to <span className="gradient-text">transform</span> your portfolio?
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Join the waitlist and be among the first to leverage EXD for smarter real estate decisions.
        </p>
        <button
          data-tf-popup="RX9edslL"
          data-tf-opacity="100"
          data-tf-size="100"
          data-tf-iframe-props="title=EXD Waitlist"
          data-tf-transitive-search-params
          data-tf-medium="snippet"
          className="px-10 py-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-white font-medium text-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
        >
          Get Early Access →
        </button>
      </motion.div>
    </section>
  );
}

// ─── PAGE ───────────────────────────────────────────────────────
export default function RealEstateUseCasePage() {
  useTypeform();
  return (
    <main className="min-h-screen">
      <Hero />
      <section id="visualizations" className="py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <PropertyPriceMap />
          <LocationScoreCalculator />
          <MarketTrendChart />
          <InvestmentROISimulator />
        </div>
      </section>
      <HowItWorks />
      <CTA />
    </main>
  );
}
