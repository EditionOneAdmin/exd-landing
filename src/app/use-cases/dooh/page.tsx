'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
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
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          DOOH Use Case
        </motion.span>
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}
        >
          Turn Location Data into{' '}
          <span className="gradient-text">Revenue</span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
        >
          EXD transforms raw footfall, audience and impression data into actionable insights for Digital Out-of-Home networks — so every screen earns more.
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

// ─── HEATMAP ────────────────────────────────────────────────────
function FootfallHeatmap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Realistic footfall data (impressions per hour per day)
  const data = useRef(
    days.flatMap((day, di) =>
      hours.map((hour) => {
        const isWeekend = di >= 5;
        let base = isWeekend ? 400 : 600;
        // Morning commute
        if (hour >= 7 && hour <= 9 && !isWeekend) base += 800;
        // Lunch
        if (hour >= 12 && hour <= 13) base += 500;
        // Evening commute
        if (hour >= 17 && hour <= 19 && !isWeekend) base += 900;
        // Weekend shopping
        if (isWeekend && hour >= 11 && hour <= 16) base += 700;
        // Night dip
        if (hour >= 0 && hour <= 5) base = 50 + Math.random() * 80;
        return { day: di, hour, value: Math.round(base + (Math.random() - 0.5) * 200) };
      })
    )
  ).current;

  useEffect(() => {
    if (!svgRef.current || !isInView) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 30, right: 10, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const cellW = width / 24;
    const cellH = height / 7;

    const color = d3.scaleSequential(d3.interpolateViridis).domain([0, d3.max(data, d => d.value) ?? 1800]);

    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => d.hour * cellW)
      .attr('y', d => d.day * cellH)
      .attr('width', cellW - 1)
      .attr('height', cellH - 1)
      .attr('rx', 2)
      .attr('fill', d => color(d.value))
      .attr('opacity', 0)
      .on('mouseenter', function (event, d) {
        const rect = svgRef.current!.getBoundingClientRect();
        setTooltip({ x: event.clientX - rect.left, y: event.clientY - rect.top - 10, text: `${days[d.day]} ${d.hour}:00 — ${d.value.toLocaleString()} impressions` });
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 1.5);
      })
      .on('mouseleave', function () {
        setTooltip(null);
        d3.select(this).attr('stroke', 'none');
      })
      .transition()
      .delay((_, i) => i * 3)
      .duration(400)
      .attr('opacity', 1);

    // Axes
    g.selectAll('.day-label')
      .data(days)
      .enter()
      .append('text')
      .attr('x', -8)
      .attr('y', (_, i) => i * cellH + cellH / 2 + 4)
      .attr('text-anchor', 'end')
      .attr('fill', '#9ca3af')
      .attr('font-size', 11)
      .text(d => d);

    g.selectAll('.hour-label')
      .data([0, 6, 12, 18, 23])
      .enter()
      .append('text')
      .attr('x', d => d * cellW + cellW / 2)
      .attr('y', height + 16)
      .attr('text-anchor', 'middle')
      .attr('fill', '#9ca3af')
      .attr('font-size', 11)
      .text(d => `${d}:00`);
  }, [isInView, data, days]);

  return (
    <div ref={containerRef} className="glass-card rounded-2xl p-6 relative">
      <h3 className="text-lg font-semibold mb-1">Footfall Heatmap</h3>
      <p className="text-sm text-gray-500 mb-4">Hourly impressions across a typical week</p>
      <div className="overflow-x-auto relative">
        <svg ref={svgRef} viewBox="0 0 600 280" className="w-full" />
        {tooltip && (
          <div className="absolute pointer-events-none px-3 py-1.5 rounded-lg bg-black/90 text-xs text-white border border-white/10 whitespace-nowrap" style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%,-100%)' }}>
            {tooltip.text}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROI CALCULATOR ─────────────────────────────────────────────
function ROICalculator() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [budget, setBudget] = useState(10000);

  const cpm = 6.5; // €6.50 CPM
  const impressions = Math.round((budget / cpm) * 1000);
  const reach = Math.round(impressions * 0.62); // 62% unique reach
  const screens = Math.min(Math.round(budget / 120), 250);

  return (
    <motion.div
      ref={ref}
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-lg font-semibold mb-1">ROI Calculator</h3>
      <p className="text-sm text-gray-500 mb-6">Estimate campaign performance by budget</p>

      <label className="block text-sm text-gray-400 mb-2">
        Monthly Budget: <span className="text-white font-semibold">€{budget.toLocaleString()}</span>
      </label>
      <input
        type="range"
        min={1000}
        max={100000}
        step={500}
        value={budget}
        onChange={e => setBudget(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none bg-white/10 accent-indigo-500 mb-8 cursor-pointer"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Impressions', value: impressions.toLocaleString(), color: 'text-indigo-400' },
          { label: 'Unique Reach', value: reach.toLocaleString(), color: 'text-purple-400' },
          { label: 'Avg CPM', value: `€${cpm.toFixed(2)}`, color: 'text-cyan-400' },
          { label: 'Screens', value: screens.toLocaleString(), color: 'text-emerald-400' },
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

// ─── NETWORK PERFORMANCE ────────────────────────────────────────
function NetworkPerformance() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  const locations = [
    { name: 'Alexanderplatz', value: 18400 },
    { name: 'Friedrichstraße', value: 16200 },
    { name: 'Kurfürstendamm', value: 15100 },
    { name: 'Potsdamer Platz', value: 14300 },
    { name: 'Hauptbahnhof', value: 13800 },
    { name: 'Mall of Berlin', value: 12500 },
    { name: 'Hackescher Markt', value: 11700 },
    { name: 'East Side Mall', value: 10900 },
    { name: 'Schönhauser Allee', value: 9600 },
    { name: 'Warschauer Str.', value: 8800 },
  ];

  useEffect(() => {
    if (!svgRef.current || !isInView) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 10, right: 50, bottom: 10, left: 120 };
    const width = 600 - margin.left - margin.right;
    const height = 360 - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, d3.max(locations, d => d.value)! * 1.1]).range([0, width]);
    const y = d3.scaleBand().domain(locations.map(d => d.name)).range([0, height]).padding(0.25);

    // Bars
    g.selectAll('rect')
      .data(locations)
      .enter()
      .append('rect')
      .attr('y', d => y(d.name)!)
      .attr('height', y.bandwidth())
      .attr('rx', 4)
      .attr('fill', (_, i) => d3.interpolateViridis(1 - i / locations.length))
      .attr('width', 0)
      .transition()
      .delay((_, i) => i * 80)
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr('width', d => x(d.value));

    // Values
    g.selectAll('.val')
      .data(locations)
      .enter()
      .append('text')
      .attr('y', d => y(d.name)! + y.bandwidth() / 2 + 4)
      .attr('fill', '#d1d5db')
      .attr('font-size', 11)
      .attr('x', 0)
      .attr('opacity', 0)
      .text(d => d.value.toLocaleString())
      .transition()
      .delay((_, i) => i * 80 + 400)
      .duration(400)
      .attr('x', d => x(d.value) + 6)
      .attr('opacity', 1);

    // Labels
    g.selectAll('.label')
      .data(locations)
      .enter()
      .append('text')
      .attr('x', -8)
      .attr('y', d => y(d.name)! + y.bandwidth() / 2 + 4)
      .attr('text-anchor', 'end')
      .attr('fill', '#9ca3af')
      .attr('font-size', 11)
      .text(d => d.name);
  }, [isInView, locations]);

  return (
    <div ref={containerRef} className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-1">Network Performance</h3>
      <p className="text-sm text-gray-500 mb-4">Top 10 Berlin DOOH locations — daily impressions</p>
      <div className="overflow-x-auto">
        <svg ref={svgRef} viewBox="0 0 600 360" className="w-full" />
      </div>
    </div>
  );
}

// ─── HOW IT WORKS ───────────────────────────────────────────────
function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const steps = [
    { num: '01', title: 'Ingest', desc: 'Connect footfall sensors, SSP feeds and audience data in minutes via EXD\u2019s unified API.', icon: '📡' },
    { num: '02', title: 'Enrich', desc: 'EXD\u2019s AI layers weather, events and demographic context onto every data point in real time.', icon: '🧠' },
    { num: '03', title: 'Activate', desc: 'Push enriched audience segments to your DSP or visualize network health in live dashboards.', icon: '🚀' },
  ];
  return (
    <section className="py-28 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        >
          How EXD Powers <span className="gradient-text">DOOH</span>
        </motion.h2>
        <motion.p
          className="text-gray-500 text-center mb-16 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.6 }}
        >
          Three steps from raw location data to revenue-driving insights.
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
          Ready to <span className="gradient-text">supercharge</span> your network?
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Join the waitlist and be among the first DOOH operators to leverage EXD's data platform.
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
export default function DOOHUseCasePage() {
  useTypeform();
  return (
    <main className="min-h-screen">
      <Hero />
      <section id="visualizations" className="py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <FootfallHeatmap />
          <ROICalculator />
          <NetworkPerformance />
        </div>
      </section>
      <HowItWorks />
      <CTA />
    </main>
  );
}
