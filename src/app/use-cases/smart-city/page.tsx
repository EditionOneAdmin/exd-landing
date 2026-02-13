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
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/30 via-transparent to-transparent" />
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.6) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Smart City Use Case
        </motion.span>
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}
        >
          Data-Driven{' '}
          <span className="gradient-text">Urban Intelligence</span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
        >
          EXD transforms mobility, environmental and infrastructure data into real-time city dashboards — powering smarter decisions for urban planners and DOOH networks alike.
        </motion.p>
        <motion.a
          href="#visualizations"
          className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 text-white font-medium text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          Explore the Data ↓
        </motion.a>
      </div>
    </section>
  );
}

// ─── 1. URBAN MOBILITY FLOW MAP ─────────────────────────────────
const BERLIN_DISTRICTS = [
  { id: 'mitte',        name: 'Mitte',            x: 300, y: 180 },
  { id: 'fhain',        name: 'Friedrichshain',   x: 420, y: 210 },
  { id: 'pberg',        name: 'Prenzlauer Berg',  x: 340, y: 100 },
  { id: 'kreuzberg',    name: 'Kreuzberg',        x: 360, y: 300 },
  { id: 'charlottenburg', name: 'Charlottenburg', x: 140, y: 190 },
  { id: 'neukoelln',    name: 'Neukölln',         x: 400, y: 380 },
  { id: 'schoeneberg',  name: 'Schöneberg',       x: 230, y: 320 },
  { id: 'wedding',      name: 'Wedding',          x: 240, y: 80  },
];

const FLOWS = [
  { from: 'wedding',   to: 'mitte',       volume: 9200 },
  { from: 'pberg',     to: 'mitte',       volume: 11500 },
  { from: 'fhain',     to: 'mitte',       volume: 8800 },
  { from: 'kreuzberg', to: 'mitte',       volume: 7600 },
  { from: 'charlottenburg', to: 'mitte',  volume: 10200 },
  { from: 'schoeneberg', to: 'mitte',     volume: 6500 },
  { from: 'neukoelln', to: 'kreuzberg',   volume: 5800 },
  { from: 'fhain',     to: 'kreuzberg',   volume: 4900 },
  { from: 'charlottenburg', to: 'schoeneberg', volume: 4200 },
  { from: 'pberg',     to: 'fhain',       volume: 6100 },
  { from: 'wedding',   to: 'pberg',       volume: 3800 },
  { from: 'neukoelln', to: 'fhain',       volume: 3200 },
];

function UrbanMobilityFlowMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!svgRef.current || !isInView) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 560;
    const height = 460;

    // Defs for glow
    const defs = svg.append('defs');
    const glow = defs.append('filter').attr('id', 'glow');
    glow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const merge = glow.append('feMerge');
    merge.append('feMergeNode').attr('in', 'coloredBlur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g');

    const districtMap = new Map(BERLIN_DISTRICTS.map(d => [d.id, d]));
    const maxVol = d3.max(FLOWS, f => f.volume)!;
    const strokeScale = d3.scaleLinear().domain([0, maxVol]).range([1, 6]);
    const opacityScale = d3.scaleLinear().domain([0, maxVol]).range([0.2, 0.7]);

    // Draw flow lines
    FLOWS.forEach((flow, i) => {
      const from = districtMap.get(flow.from)!;
      const to = districtMap.get(flow.to)!;
      const midX = (from.x + to.x) / 2 + (Math.random() - 0.5) * 40;
      const midY = (from.y + to.y) / 2 + (Math.random() - 0.5) * 40;
      const path = `M${from.x},${from.y} Q${midX},${midY} ${to.x},${to.y}`;

      const line = g.append('path')
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', 'url(#flowGrad)')
        .attr('stroke-width', strokeScale(flow.volume))
        .attr('opacity', 0)
        .attr('stroke-linecap', 'round');

      line.transition()
        .delay(i * 100)
        .duration(800)
        .attr('opacity', opacityScale(flow.volume));

      // Animated particle
      const totalLen = (line.node() as SVGPathElement).getTotalLength();
      const particle = g.append('circle')
        .attr('r', strokeScale(flow.volume) * 0.6)
        .attr('fill', '#06b6d4')
        .attr('filter', 'url(#glow)')
        .attr('opacity', 0);

      function animateParticle() {
        particle
          .attr('opacity', 0.8)
          .transition()
          .delay(i * 200)
          .duration(2000 + Math.random() * 1000)
          .ease(d3.easeLinear)
          .attrTween('transform', () => {
            return (t: number) => {
              const p = (line.node() as SVGPathElement).getPointAtLength(t * totalLen);
              return `translate(${p.x},${p.y})`;
            };
          })
          .attr('opacity', 0)
          .on('end', animateParticle);
      }
      animateParticle();
    });

    // Flow gradient
    const flowGrad = defs.append('linearGradient').attr('id', 'flowGrad');
    flowGrad.append('stop').attr('offset', '0%').attr('stop-color', '#6366f1');
    flowGrad.append('stop').attr('offset', '100%').attr('stop-color', '#06b6d4');

    // District nodes
    BERLIN_DISTRICTS.forEach((d, i) => {
      const node = g.append('g').attr('transform', `translate(${d.x},${d.y})`);

      node.append('circle')
        .attr('r', 0)
        .attr('fill', '#050507')
        .attr('stroke', '#6366f1')
        .attr('stroke-width', 2)
        .transition()
        .delay(i * 60 + 500)
        .duration(500)
        .attr('r', 18);

      node.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 32)
        .attr('fill', '#9ca3af')
        .attr('font-size', 10)
        .attr('opacity', 0)
        .text(d.name)
        .transition()
        .delay(i * 60 + 800)
        .duration(400)
        .attr('opacity', 1);

      // Abbreviation inside circle
      node.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 4)
        .attr('fill', '#e0e7ff')
        .attr('font-size', 9)
        .attr('font-weight', 600)
        .attr('opacity', 0)
        .text(d.name.slice(0, 3).toUpperCase())
        .transition()
        .delay(i * 60 + 800)
        .duration(400)
        .attr('opacity', 1);
    });

  }, [isInView]);

  return (
    <div ref={containerRef} className="glass-card rounded-2xl p-6 relative">
      <h3 className="text-lg font-semibold mb-1">Urban Mobility Flow Map</h3>
      <p className="text-sm text-gray-500 mb-4">Commuter flows between Berlin districts — morning rush hour</p>
      <div className="overflow-x-auto">
        <svg ref={svgRef} viewBox="0 0 560 460" className="w-full" />
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 inline-block rounded" /> Flow volume</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> Transit pulse</span>
      </div>
    </div>
  );
}

// ─── 2. AIR QUALITY INDEX DASHBOARD ─────────────────────────────
const AQI_CITIES = [
  { city: 'Berlin',    aqi: 42, trend: [38,44,41,39,45,42,40,42] },
  { city: 'Amsterdam', aqi: 35, trend: [32,36,33,38,35,34,37,35] },
  { city: 'Paris',     aqi: 58, trend: [55,62,60,57,54,58,61,58] },
  { city: 'London',    aqi: 51, trend: [48,53,50,55,52,49,51,51] },
  { city: 'Stockholm', aqi: 22, trend: [20,25,22,21,24,23,20,22] },
  { city: 'Madrid',    aqi: 67, trend: [63,70,65,68,72,67,64,67] },
];

function aqiColor(aqi: number): string {
  if (aqi <= 50) return '#22c55e';
  if (aqi <= 100) return '#eab308';
  if (aqi <= 150) return '#f97316';
  return '#ef4444';
}

function aqiLabel(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy (SG)';
  return 'Unhealthy';
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const w = 80, h = 28;
    const x = d3.scaleLinear().domain([0, data.length - 1]).range([2, w - 2]);
    const y = d3.scaleLinear().domain([d3.min(data)! - 5, d3.max(data)! + 5]).range([h - 2, 2]);
    const line = d3.line<number>().x((_, i) => x(i)).y(d => y(d)).curve(d3.curveMonotoneX);
    svg.append('path').attr('d', line(data)).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 1.5).attr('opacity', 0.8);
  }, [data, color]);
  return <svg ref={svgRef} viewBox="0 0 80 28" className="w-20 h-7" />;
}

function AirQualityDashboard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-lg font-semibold mb-1">Air Quality Index</h3>
      <p className="text-sm text-gray-500 mb-6">Real-time AQI across European cities</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AQI_CITIES.map((c, i) => (
          <motion.div
            key={c.city}
            className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <div>
              <div className="text-sm font-medium text-white">{c.city}</div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-2xl font-bold"
                  style={{ color: aqiColor(c.aqi) }}
                >
                  {c.aqi}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: aqiColor(c.aqi) + '22', color: aqiColor(c.aqi) }}>
                  {aqiLabel(c.aqi)}
                </span>
              </div>
            </div>
            <Sparkline data={c.trend} color={aqiColor(c.aqi)} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── 3. SMART INFRASTRUCTURE RADAR ──────────────────────────────
const DIMENSIONS = ['Transit', 'Energy', 'Digital', 'Green Space', 'Safety', 'Connectivity'];
const RADAR_CITIES = [
  { name: 'Berlin',    color: '#6366f1', values: [82, 74, 88, 71, 79, 85] },
  { name: 'Amsterdam', color: '#06b6d4', values: [90, 82, 85, 88, 84, 91] },
  { name: 'London',    color: '#a855f7', values: [86, 68, 91, 62, 72, 89] },
];

function SmartInfrastructureRadar() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const [activeCity, setActiveCity] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || !isInView) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const size = 400;
    const cx = size / 2, cy = size / 2;
    const maxR = 150;
    const levels = 5;
    const angleSlice = (2 * Math.PI) / DIMENSIONS.length;

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`);

    // Grid circles
    for (let l = 1; l <= levels; l++) {
      const r = (maxR / levels) * l;
      g.append('circle')
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255,255,255,0.06)')
        .attr('stroke-width', 1);
    }

    // Axes
    DIMENSIONS.forEach((dim, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x2 = Math.cos(angle) * maxR;
      const y2 = Math.sin(angle) * maxR;
      g.append('line')
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', x2).attr('y2', y2)
        .attr('stroke', 'rgba(255,255,255,0.08)')
        .attr('stroke-width', 1);

      const lx = Math.cos(angle) * (maxR + 20);
      const ly = Math.sin(angle) * (maxR + 20);
      g.append('text')
        .attr('x', lx).attr('y', ly + 4)
        .attr('text-anchor', 'middle')
        .attr('fill', '#9ca3af')
        .attr('font-size', 10)
        .text(dim);
    });

    // City polygons
    const lineGen = d3.lineRadial<number>()
      .angle((_, i) => angleSlice * i)
      .radius(d => (d / 100) * maxR)
      .curve(d3.curveLinearClosed);

    RADAR_CITIES.forEach((city, ci) => {
      const isActive = activeCity === null || activeCity === city.name;

      g.append('path')
        .datum(city.values)
        .attr('d', lineGen as any)
        .attr('fill', city.color)
        .attr('fill-opacity', isActive ? 0.15 : 0.03)
        .attr('stroke', city.color)
        .attr('stroke-width', isActive ? 2 : 0.5)
        .attr('stroke-opacity', isActive ? 0.8 : 0.2)
        .attr('transform', 'rotate(-90)')
        .attr('opacity', 0)
        .transition()
        .delay(ci * 200)
        .duration(800)
        .attr('opacity', 1);

      // Dots on vertices
      city.values.forEach((v, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const r = (v / 100) * maxR;
        g.append('circle')
          .attr('cx', Math.cos(angle) * r)
          .attr('cy', Math.sin(angle) * r)
          .attr('r', isActive ? 3 : 1.5)
          .attr('fill', city.color)
          .attr('opacity', 0)
          .transition()
          .delay(ci * 200 + i * 50)
          .duration(400)
          .attr('opacity', isActive ? 1 : 0.3);
      });
    });
  }, [isInView, activeCity]);

  return (
    <div ref={containerRef} className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-1">Smart Infrastructure Score</h3>
      <p className="text-sm text-gray-500 mb-4">Compare cities across 6 key dimensions</p>
      <div className="flex items-center justify-center gap-4 mb-4">
        {RADAR_CITIES.map(c => (
          <button
            key={c.name}
            onClick={() => setActiveCity(prev => prev === c.name ? null : c.name)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCity === c.name
                ? 'bg-white/10 text-white'
                : 'bg-white/[0.03] text-gray-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
            {c.name}
          </button>
        ))}
      </div>
      <div className="flex justify-center overflow-x-auto">
        <svg ref={svgRef} viewBox="0 0 400 400" className="w-full max-w-md" />
      </div>
    </div>
  );
}

// ─── 4. DOOH NETWORK OPTIMIZER ──────────────────────────────────
const ZONE_DATA = [
  { id: 0, name: 'Mitte',           footfall: 45000, cpm: 7.2 },
  { id: 1, name: 'Alexanderplatz',   footfall: 52000, cpm: 8.1 },
  { id: 2, name: 'Friedrichshain',   footfall: 28000, cpm: 5.4 },
  { id: 3, name: 'Kreuzberg',        footfall: 31000, cpm: 5.8 },
  { id: 4, name: 'Charlottenburg',   footfall: 35000, cpm: 6.3 },
  { id: 5, name: 'Prenzlauer Berg',  footfall: 26000, cpm: 5.1 },
  { id: 6, name: 'Schöneberg',       footfall: 22000, cpm: 4.8 },
  { id: 7, name: 'Neukölln',         footfall: 24000, cpm: 4.5 },
  { id: 8, name: 'Wedding',          footfall: 19000, cpm: 4.2 },
  { id: 9, name: 'Tiergarten',       footfall: 38000, cpm: 6.8 },
  { id: 10, name: 'Potsdamer Platz', footfall: 41000, cpm: 7.5 },
  { id: 11, name: 'Hackescher Markt', footfall: 33000, cpm: 6.0 },
];

function DOOHNetworkOptimizer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [selected, setSelected] = useState<Set<number>>(new Set([1, 4, 10]));

  const toggle = useCallback((id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const stats = useMemo(() => {
    let totalFootfall = 0;
    let totalCost = 0;
    selected.forEach(id => {
      const z = ZONE_DATA[id];
      totalFootfall += z.footfall;
      totalCost += (z.footfall / 1000) * z.cpm;
    });
    const impressions = Math.round(totalFootfall * 0.72); // 72% viewability
    const reach = Math.round(impressions * 0.58); // 58% unique
    return { zones: selected.size, impressions, reach, cost: Math.round(totalCost) };
  }, [selected]);

  return (
    <motion.div
      ref={ref}
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-lg font-semibold mb-1">DOOH Network Optimizer</h3>
      <p className="text-sm text-gray-500 mb-6">Select city zones to estimate reach &amp; impressions</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
        {ZONE_DATA.map(z => {
          const isSelected = selected.has(z.id);
          return (
            <button
              key={z.id}
              onClick={() => toggle(z.id)}
              className={`relative p-3 rounded-xl text-left transition-all border ${
                isSelected
                  ? 'bg-indigo-500/10 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                  : 'bg-white/[0.02] border-white/[0.06] hover:border-white/15'
              }`}
            >
              <div className="text-xs font-medium text-white truncate">{z.name}</div>
              <div className="text-[10px] text-gray-500 mt-1">{(z.footfall / 1000).toFixed(0)}k footfall/day</div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-400" />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Zones', value: stats.zones.toString(), color: 'text-indigo-400' },
          { label: 'Est. Impressions', value: stats.impressions.toLocaleString(), color: 'text-cyan-400' },
          { label: 'Unique Reach', value: stats.reach.toLocaleString(), color: 'text-purple-400' },
          { label: 'Est. Daily Cost', value: `€${stats.cost.toLocaleString()}`, color: 'text-emerald-400' },
        ].map((m, i) => (
          <div key={i} className="text-center">
            <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
            <div className="text-xs text-gray-500 mt-1">{m.label}</div>
          </div>
        ))}
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
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Build Smarter <span className="gradient-text">Cities</span>
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Join the waitlist and unlock EXD&apos;s urban intelligence platform for your city or DOOH network.
        </p>
        <button
          data-tf-popup="RX9edslL"
          data-tf-opacity="100"
          data-tf-size="100"
          data-tf-iframe-props="title=EXD Waitlist"
          data-tf-transitive-search-params
          data-tf-medium="snippet"
          className="px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 text-white font-medium text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all cursor-pointer"
        >
          Get Early Access →
        </button>
      </motion.div>
    </section>
  );
}

// ─── PAGE ───────────────────────────────────────────────────────
export default function SmartCityUseCasePage() {
  useTypeform();
  return (
    <main className="min-h-screen">
      <Hero />
      <section id="visualizations" className="py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <UrbanMobilityFlowMap />
          <AirQualityDashboard />
          <SmartInfrastructureRadar />
          <DOOHNetworkOptimizer />
        </div>
      </section>
      <CTA />
    </main>
  );
}
