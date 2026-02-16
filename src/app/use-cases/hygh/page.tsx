'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
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

// ─── CITY DATA ──────────────────────────────────────────────────
const CITIES = [
  { name: 'Berlin', lat: 52.52, lng: 13.405, displays: 620, contacts: '42M' },
  { name: 'Hamburg', lat: 53.551, lng: 9.994, displays: 380, contacts: '28M' },
  { name: 'München', lat: 48.137, lng: 11.576, displays: 450, contacts: '35M' },
  { name: 'Köln', lat: 50.938, lng: 6.96, displays: 310, contacts: '22M' },
  { name: 'Frankfurt', lat: 50.111, lng: 8.682, displays: 280, contacts: '20M' },
  { name: 'Düsseldorf', lat: 51.228, lng: 6.774, displays: 240, contacts: '17M' },
  { name: 'Stuttgart', lat: 48.776, lng: 9.183, displays: 210, contacts: '15M' },
  { name: 'Dortmund', lat: 51.514, lng: 7.468, displays: 180, contacts: '12M' },
  { name: 'Essen', lat: 51.455, lng: 7.012, displays: 150, contacts: '10M' },
  { name: 'Leipzig', lat: 51.34, lng: 12.375, displays: 140, contacts: '9M' },
  { name: 'Bremen', lat: 53.08, lng: 8.801, displays: 120, contacts: '7M' },
  { name: 'Dresden', lat: 51.051, lng: 13.738, displays: 110, contacts: '6M' },
  { name: 'Hannover', lat: 52.376, lng: 9.732, displays: 160, contacts: '11M' },
  { name: 'Nürnberg', lat: 49.452, lng: 11.077, displays: 130, contacts: '8M' },
  { name: 'Mannheim', lat: 49.489, lng: 8.467, displays: 120, contacts: '5M' },
];

const AUDIENCES = [
  { id: 'young-professionals', label: 'Young Professionals (25–34)', icon: '💼' },
  { id: 'families', label: 'Families with Children', icon: '👨‍👩‍👧' },
  { id: 'students', label: 'Students (18–24)', icon: '🎓' },
  { id: 'commuters', label: 'Daily Commuters', icon: '🚇' },
  { id: 'shoppers', label: 'Retail Shoppers', icon: '🛍️' },
];

const NETWORKS = [
  { name: 'Retail', screens: 840, color: '#818cf8' },
  { name: 'Transit', screens: 720, color: '#a78bfa' },
  { name: 'Roadside', screens: 680, color: '#c084fc' },
  { name: 'Mall', screens: 520, color: '#22d3ee' },
  { name: 'Airport', screens: 380, color: '#67e8f9' },
  { name: 'Office', screens: 340, color: '#6366f1' },
  { name: 'Fitness', screens: 220, color: '#8b5cf6' },
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

// ─── HERO with Germany Map ──────────────────────────────────────
function Hero() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeCity, setActiveCity] = useState<typeof CITIES[0] | null>(null);

  // Simple mercator projection for Germany
  const project = useCallback((lat: number, lng: number): [number, number] => {
    const x = ((lng - 5.5) / (15.5 - 5.5)) * 500 + 50;
    const y = ((55.0 - lat) / (55.0 - 47.0)) * 500 + 25;
    return [x, y];
  }, []);

  // Germany outline (simplified polygon)
  const germanyPath = useMemo(() => {
    const points: [number, number][] = [
      [8.5, 55.0], [9.9, 54.8], [10.4, 54.0], [11.0, 54.3], [12.0, 54.4],
      [13.0, 54.1], [14.0, 53.9], [14.7, 53.3], [14.6, 52.6], [14.7, 51.9],
      [15.0, 51.1], [14.8, 50.9], [14.3, 50.9], [13.6, 50.7], [12.7, 50.2],
      [12.1, 50.3], [12.5, 49.8], [13.0, 49.3], [13.8, 48.8], [13.5, 48.6],
      [13.0, 47.5], [12.7, 47.7], [12.2, 47.6], [11.4, 47.5], [10.5, 47.4],
      [10.1, 47.6], [9.6, 47.5], [8.6, 47.8], [8.2, 47.6], [7.7, 47.5],
      [7.5, 47.9], [7.0, 48.0], [6.8, 48.8], [6.1, 49.5], [6.4, 49.8],
      [6.1, 50.1], [6.0, 50.8], [5.9, 51.0], [6.2, 51.4], [5.9, 51.8],
      [6.7, 51.9], [7.0, 52.2], [6.7, 52.5], [7.1, 52.8], [7.2, 53.3],
      [7.0, 53.5], [7.3, 53.8], [8.0, 54.0], [8.5, 55.0],
    ];
    return points.map(([lng, lat]) => project(lat, lng)).map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + 'Z';
  }, [project]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-transparent to-transparent" />
      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, rgba(139,92,246,0.3) 40%, transparent 70%)' }}
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
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            HYGH × EXD Use Case
          </motion.span>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}
          >
            DOOH Intelligence —{' '}
            <span className="gradient-text">Data-Driven Out-of-Home</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-xl mb-10"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          >
            EXD powers HYGH&apos;s 3,700+ digital screens across Germany with real-time audience intelligence, turning impressions into measurable impact.
          </motion.p>
          <motion.a
            href="#kpis"
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white font-medium text-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          >
            Explore the Network ↓
          </motion.a>
        </div>

        {/* Right: Germany Map */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="glass-card rounded-2xl p-4">
            <svg ref={svgRef} viewBox="0 0 600 570" className="w-full">
              {/* Germany shape */}
              <path d={germanyPath} fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.3)" strokeWidth="1.5" />

              {/* City hotspots */}
              {CITIES.map((city, i) => {
                const [cx, cy] = project(city.lat, city.lng);
                const r = Math.sqrt(city.displays) * 0.6;
                return (
                  <g key={city.name} onMouseEnter={() => setActiveCity(city)} onMouseLeave={() => setActiveCity(null)} className="cursor-pointer">
                    <motion.circle
                      cx={cx} cy={cy} r={r}
                      fill="rgba(99,102,241,0.3)"
                      stroke="rgba(129,140,248,0.6)"
                      strokeWidth="1"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
                    />
                    <motion.circle
                      cx={cx} cy={cy} r={r * 1.5}
                      fill="none"
                      stroke="rgba(129,140,248,0.3)"
                      strokeWidth="0.5"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ delay: 1 + i * 0.1, duration: 3, repeat: Infinity }}
                    />
                    <motion.circle
                      cx={cx} cy={cy} r={3}
                      fill="#818cf8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + i * 0.08 }}
                    />
                    <text x={cx} y={cy - r - 6} textAnchor="middle" fill="#d1d5db" fontSize="10" fontWeight="500">
                      {city.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Tooltip */}
            <AnimatePresence>
              {activeCity && (
                <motion.div
                  className="absolute bottom-6 left-6 right-6 glass-card rounded-xl p-4 flex items-center justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <div>
                    <div className="font-semibold text-white">{activeCity.name}</div>
                    <div className="text-sm text-gray-400">{activeCity.displays} Displays</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-indigo-400">{activeCity.contacts}</div>
                    <div className="text-xs text-gray-500">Weekly Contacts</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
    { label: 'Digital Displays', value: 3700, suffix: '+', color: 'text-indigo-400', icon: '📺' },
    { label: 'Cities', value: 15, suffix: '', color: 'text-purple-400', icon: '🏙️' },
    { label: 'Weekly Contacts', value: 226, suffix: 'M', color: 'text-cyan-400', icon: '👥' },
    { label: 'Networks', value: 7, suffix: '', color: 'text-emerald-400', icon: '🌐' },
  ];

  return (
    <section id="kpis" className="py-20 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        >
          HYGH Network at a <span className="gradient-text">Glance</span>
        </motion.h2>
        <motion.p
          className="text-gray-500 text-center mb-14 max-w-xl mx-auto"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
        >
          Real-time metrics from Germany&apos;s fastest-growing DOOH network.
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

// ─── NETWORK BREAKDOWN (D3 Donut) ───────────────────────────────
function NetworkBreakdown() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || !isInView) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const size = 300;
    const radius = size / 2;
    const innerRadius = radius * 0.6;
    const g = svg.append('g').attr('transform', `translate(${radius},${radius})`);

    const pie = d3.pie<typeof NETWORKS[0]>().value(d => d.screens).sort(null).padAngle(0.02);
    const arc = d3.arc<d3.PieArcDatum<typeof NETWORKS[0]>>().innerRadius(innerRadius).outerRadius(radius - 4).cornerRadius(4);

    g.selectAll('path')
      .data(pie(NETWORKS))
      .enter()
      .append('path')
      .attr('fill', d => d.data.color)
      .attr('opacity', 0.85)
      .attr('d', d3.arc<d3.PieArcDatum<typeof NETWORKS[0]>>().innerRadius(innerRadius).outerRadius(innerRadius).cornerRadius(4) as any)
      .on('mouseenter', function (_, d) {
        setHovered(d.data.name);
        d3.select(this).attr('opacity', 1).transition().duration(200).attr('d', d3.arc<d3.PieArcDatum<typeof NETWORKS[0]>>().innerRadius(innerRadius).outerRadius(radius).cornerRadius(4)(d) as any);
      })
      .on('mouseleave', function (_, d) {
        setHovered(null);
        d3.select(this).attr('opacity', 0.85).transition().duration(200).attr('d', arc(d) as any);
      })
      .transition()
      .delay((_, i) => i * 100)
      .duration(800)
      .ease(d3.easeCubicOut)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate({ startAngle: d.startAngle, endAngle: d.startAngle }, d);
        return (t: number) => arc(interpolate(t) as any) as string;
      });

    // Center text
    g.append('text').attr('text-anchor', 'middle').attr('dy', '-0.3em').attr('fill', '#fff').attr('font-size', 28).attr('font-weight', 'bold').text('3,700+');
    g.append('text').attr('text-anchor', 'middle').attr('dy', '1.2em').attr('fill', '#9ca3af').attr('font-size', 12).text('Total Screens');
  }, [isInView]);

  return (
    <div ref={containerRef} className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-1">Network Breakdown</h3>
      <p className="text-sm text-gray-500 mb-6">Distribution across 7 DOOH networks</p>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <svg ref={svgRef} viewBox="0 0 300 300" className="w-64 h-64 shrink-0" />
        <div className="grid grid-cols-2 gap-3 flex-1">
          {NETWORKS.map(n => (
            <div key={n.name} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${hovered === n.name ? 'bg-white/10' : ''}`}>
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: n.color }} />
              <div>
                <div className="text-sm font-medium text-white">{n.name}</div>
                <div className="text-xs text-gray-500">{n.screens} screens</div>
              </div>
            </div>
          ))}
        </div>
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
      icon: '🚶',
      signal: 'Footfall Data',
      arrow: '→',
      outcome: 'Optimal Placement',
      desc: 'Real-time pedestrian flow analysis identifies highest-traffic locations for maximum screen visibility and engagement.',
      color: 'from-indigo-500/20 to-transparent',
    },
    {
      icon: '🌤️',
      signal: 'Weather Signals',
      arrow: '→',
      outcome: 'Dynamic Creative',
      desc: 'Weather-triggered content swaps — ice cream ads when sunny, umbrella brands when it rains. Contextual relevance drives +38% recall.',
      color: 'from-purple-500/20 to-transparent',
    },
    {
      icon: '👥',
      signal: 'Demographics',
      arrow: '→',
      outcome: 'Precision Targeting',
      desc: 'Audience composition data per screen enables advertisers to match creative to the right demographic at the right moment.',
      color: 'from-cyan-500/20 to-transparent',
    },
  ];

  return (
    <section className="py-28 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        >
          Data Signals → <span className="gradient-text">DOOH Outcomes</span>
        </motion.h2>
        <motion.p
          className="text-gray-500 text-center mb-16 max-w-xl mx-auto"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
        >
          How EXD transforms raw data into advertising intelligence.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((c, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-2xl p-8 relative overflow-hidden group hover:border-white/20 transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.15, duration: 0.6 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${c.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10">
                <span className="text-4xl mb-4 block">{c.icon}</span>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold text-indigo-300">{c.signal}</span>
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

// ─── CAMPAIGN PLANNER (Interactive Demo) ────────────────────────
function CampaignPlanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [selectedCity, setSelectedCity] = useState('Berlin');
  const [selectedAudience, setSelectedAudience] = useState('young-professionals');
  const [showResults, setShowResults] = useState(false);

  const city = CITIES.find(c => c.name === selectedCity)!;

  // Simulated optimal locations per city+audience
  const locations = useMemo(() => {
    const seed = selectedCity.length + selectedAudience.length;
    const types: Record<string, string[]> = {
      'young-professionals': ['Business District', 'Co-Working Hub', 'Transit Station', 'Café Quarter', 'Fitness Area'],
      'families': ['Shopping Mall', 'Park Entrance', 'School Zone', 'Playground Area', 'Supermarket'],
      'students': ['University Campus', 'Library Area', 'Nightlife District', 'Fast Food Row', 'Transit Hub'],
      'commuters': ['Main Station', 'Highway Billboard', 'Bus Terminal', 'Parking Garage', 'Subway Exit'],
      'shoppers': ['High Street', 'Shopping Center', 'Department Store', 'Market Square', 'Outlet Area'],
    };
    const locs = types[selectedAudience] || types['young-professionals'];
    return locs.map((name, i) => ({
      name: `${selectedCity} — ${name}`,
      score: Math.round(95 - i * 7 - (seed % 5)),
      impressions: Math.round((city.displays / 5) * (1 - i * 0.12) * 1200),
    }));
  }, [selectedCity, selectedAudience, city.displays]);

  const handlePlan = () => setShowResults(true);

  return (
    <section className="py-28 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        >
          Campaign <span className="gradient-text">Planner</span>
        </motion.h2>
        <motion.p
          className="text-gray-500 text-center mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
        >
          Select a city and target audience — see where to place your screens for maximum impact.
        </motion.p>

        <motion.div
          className="glass-card rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* City Select */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">City</label>
              <select
                value={selectedCity}
                onChange={e => { setSelectedCity(e.target.value); setShowResults(false); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
              >
                {CITIES.map(c => (
                  <option key={c.name} value={c.name} className="bg-[#0a0a0f] text-white">{c.name} — {c.displays} Displays</option>
                ))}
              </select>
            </div>

            {/* Audience Select */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Target Audience</label>
              <select
                value={selectedAudience}
                onChange={e => { setSelectedAudience(e.target.value); setShowResults(false); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
              >
                {AUDIENCES.map(a => (
                  <option key={a.id} value={a.id} className="bg-[#0a0a0f] text-white">{a.icon} {a.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handlePlan}
            className="w-full md:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
          >
            Find Optimal Displays →
          </button>

          {/* Results */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                className="mt-8 space-y-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm text-gray-400">Top 5 recommended placements in <span className="text-white font-medium">{selectedCity}</span></span>
                </div>
                {locations.map((loc, i) => (
                  <motion.div
                    key={loc.name}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-gray-500'}`}>
                        #{i + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{loc.name}</div>
                        <div className="text-xs text-gray-500">{loc.impressions.toLocaleString()} est. daily impressions</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:block w-24 h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${loc.score}%` }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-indigo-400 w-12 text-right">{loc.score}%</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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
          Transform your <span className="gradient-text">DOOH data</span>
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          See how EXD can power your out-of-home network with real-time intelligence and data-driven optimization.
        </p>
        <button
          data-tf-popup="RX9edslL"
          data-tf-opacity="100"
          data-tf-size="100"
          data-tf-iframe-props="title=EXD Waitlist"
          data-tf-transitive-search-params
          data-tf-medium="snippet"
          className="px-10 py-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white font-medium text-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
        >
          Get Early Access →
        </button>
      </motion.div>
    </section>
  );
}

// ─── PAGE ───────────────────────────────────────────────────────
export default function HYGHUseCasePage() {
  useTypeform();
  return (
    <main className="min-h-screen">
      <Hero />
      <KPIDashboard />
      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <NetworkBreakdown />
        </div>
      </section>
      <UseCaseSection />
      <CampaignPlanner />
      <CTA />
    </main>
  );
}
