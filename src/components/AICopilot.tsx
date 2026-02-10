'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { Sparkles, Send, RotateCcw, Zap } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────
type ChartType = 'line' | 'bar' | 'scatter' | 'area' | 'horizontal-bar';

interface DataPoint { x: string | number; y: number; label?: string }
interface DataSeries { name: string; data: DataPoint[]; color?: string }
interface ChartSpec {
  type: ChartType;
  title: string;
  subtitle?: string;
  xAxis: { label: string; type: 'category' | 'time' | 'linear' };
  yAxis: { label: string; format?: string };
  series: DataSeries[];
  source?: string;
}

// ── Mock Data ──────────────────────────────────────────────────────
const MOCK_CHARTS: Record<string, ChartSpec> = {
  'gdp-europe': {
    type: 'line', title: 'GDP Growth in Europe', subtitle: '2000–2024, Annual % Change',
    xAxis: { label: 'Year', type: 'time' }, yAxis: { label: 'Growth Rate (%)', format: '%' },
    series: [
      { name: 'Germany', color: '#6366f1', data: [{x:2000,y:3},{x:2004,y:1.2},{x:2008,y:1.1},{x:2012,y:0.4},{x:2016,y:2.2},{x:2020,y:-3.7},{x:2024,y:0.2}] },
      { name: 'France', color: '#22c55e', data: [{x:2000,y:3.9},{x:2004,y:2.8},{x:2008,y:0.3},{x:2012,y:0.3},{x:2016,y:1.1},{x:2020,y:-7.5},{x:2024,y:0.9}] },
      { name: 'UK', color: '#f59e0b', data: [{x:2000,y:3.5},{x:2004,y:2.5},{x:2008,y:-0.3},{x:2012,y:1.4},{x:2016,y:1.7},{x:2020,y:-9.3},{x:2024,y:0.5}] },
    ],
    source: 'World Bank',
  },
  'co2-emissions': {
    type: 'line', title: 'CO₂ Emissions Comparison', subtitle: 'USA vs China vs India (t per capita)',
    xAxis: { label: 'Year', type: 'time' }, yAxis: { label: 'CO₂ per capita (t)', format: 't' },
    series: [
      { name: 'USA', color: '#6366f1', data: [{x:2000,y:20.2},{x:2005,y:19.5},{x:2010,y:17.4},{x:2015,y:16.1},{x:2020,y:13.5},{x:2023,y:14.2}] },
      { name: 'China', color: '#ef4444', data: [{x:2000,y:2.7},{x:2005,y:4.5},{x:2010,y:6.6},{x:2015,y:7.5},{x:2020,y:7.4},{x:2023,y:8.0}] },
      { name: 'India', color: '#22c55e', data: [{x:2000,y:1.0},{x:2005,y:1.2},{x:2010,y:1.5},{x:2015,y:1.8},{x:2020,y:1.7},{x:2023,y:2.0}] },
    ],
    source: 'Our World in Data',
  },
  'population-top10': {
    type: 'horizontal-bar', title: 'Top 10 Countries by Population', subtitle: '2024 Estimates (millions)',
    xAxis: { label: 'Country', type: 'category' }, yAxis: { label: 'Population (M)', format: 'M' },
    series: [{ name: 'Population', color: '#6366f1', data: [
      {x:'India',y:1428},{x:'China',y:1425},{x:'USA',y:340},{x:'Indonesia',y:277},{x:'Pakistan',y:240},
      {x:'Nigeria',y:224},{x:'Brazil',y:216},{x:'Bangladesh',y:173},{x:'Russia',y:144},{x:'Mexico',y:129}
    ]}],
    source: 'World Bank',
  },
  'renewable-energy': {
    type: 'bar', title: 'Renewable Energy Share', subtitle: '% of Total Energy (2023)',
    xAxis: { label: 'Country', type: 'category' }, yAxis: { label: 'Renewable %', format: '%' },
    series: [{ name: 'Renewable', color: '#22c55e', data: [
      {x:'Iceland',y:85},{x:'Norway',y:72},{x:'Sweden',y:56},{x:'Brazil',y:48},{x:'Denmark',y:44},
      {x:'Germany',y:22},{x:'UK',y:20},{x:'USA',y:13},{x:'China',y:11},{x:'India',y:8}
    ]}],
    source: 'IEA',
  },
  'inflation': {
    type: 'area', title: 'Inflation Rate Trends', subtitle: 'Major Economies 2019–2024',
    xAxis: { label: 'Year', type: 'time' }, yAxis: { label: 'Inflation (%)', format: '%' },
    series: [
      { name: 'USA', color: '#6366f1', data: [{x:2019,y:1.8},{x:2020,y:1.2},{x:2021,y:4.7},{x:2022,y:8.0},{x:2023,y:4.1},{x:2024,y:2.9}] },
      { name: 'Eurozone', color: '#22c55e', data: [{x:2019,y:1.2},{x:2020,y:0.3},{x:2021,y:2.6},{x:2022,y:8.4},{x:2023,y:5.4},{x:2024,y:2.4}] },
      { name: 'UK', color: '#f59e0b', data: [{x:2019,y:1.8},{x:2020,y:0.9},{x:2021,y:2.6},{x:2022,y:9.1},{x:2023,y:7.3},{x:2024,y:3.4}] },
    ],
    source: 'IMF',
  },
  'life-expectancy': {
    type: 'scatter', title: 'Life Expectancy vs GDP per Capita', subtitle: 'Selected countries, 2023',
    xAxis: { label: 'GDP per Capita ($)', type: 'linear' }, yAxis: { label: 'Life Expectancy (years)' },
    series: [{ name: 'Countries', data: [
      {x:65000,y:78.5,label:'USA'},{x:12500,y:78.2,label:'China'},{x:2250,y:70.4,label:'India'},
      {x:47000,y:81.3,label:'Germany'},{x:40000,y:84.5,label:'Japan'},{x:8700,y:75.9,label:'Brazil'},
      {x:2100,y:54.7,label:'Nigeria'},{x:55000,y:83.4,label:'Australia'},{x:32000,y:83.4,label:'S.Korea'},
    ]}],
    source: 'World Bank',
  },
};

const THINKING_MESSAGES: Record<string, string> = {
  'gdp-europe': 'Fetching GDP data from World Bank API for Germany, France, UK…',
  'co2-emissions': 'Comparing per-capita emissions across three major emitters…',
  'population-top10': 'Ranking countries by 2024 population estimates…',
  'renewable-energy': 'Analyzing renewable energy shares from IEA data…',
  'inflation': 'Pulling CPI data from IMF for US, Eurozone, UK…',
  'life-expectancy': 'Cross-referencing health & income indicators from World Bank…',
};

function findChart(query: string): { key: string; spec: ChartSpec } {
  const q = query.toLowerCase();
  if (q.includes('gdp') && q.includes('europ')) return { key: 'gdp-europe', spec: MOCK_CHARTS['gdp-europe'] };
  if (q.includes('co2') || q.includes('carbon') || q.includes('emission')) return { key: 'co2-emissions', spec: MOCK_CHARTS['co2-emissions'] };
  if (q.includes('population')) return { key: 'population-top10', spec: MOCK_CHARTS['population-top10'] };
  if (q.includes('renewable') || q.includes('energy')) return { key: 'renewable-energy', spec: MOCK_CHARTS['renewable-energy'] };
  if (q.includes('inflation')) return { key: 'inflation', spec: MOCK_CHARTS['inflation'] };
  if (q.includes('life') || q.includes('expectancy')) return { key: 'life-expectancy', spec: MOCK_CHARTS['life-expectancy'] };
  return { key: 'gdp-europe', spec: MOCK_CHARTS['gdp-europe'] };
}

const EXAMPLES = [
  'GDP growth in Europe',
  'CO₂ emissions: USA vs China vs India',
  'Top 10 countries by population',
  'Renewable energy share by country',
  'Inflation trends major economies',
  'Life expectancy vs income',
];

// ── D3 Chart Renderer ──────────────────────────────────────────────
function MiniChart({ spec }: { spec: ChartSpec }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 700, h: 400 });

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      setDims({ w, h: Math.min(400, w * 0.55) });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const m = { top: 30, right: 20, bottom: 45, left: 55 };
    const w = dims.w - m.left - m.right;
    const h = dims.h - m.top - m.bottom;
    const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);

    const allPoints = spec.series.flatMap(s => s.data);

    if (spec.type === 'horizontal-bar') {
      const data = spec.series[0].data;
      const yBand = d3.scaleBand().domain(data.map(d => String(d.x))).range([0, h]).padding(0.25);
      const xLin = d3.scaleLinear().domain([0, d3.max(data, d => d.y)! * 1.1]).range([0, w]);

      // Grid
      g.selectAll('.grid').data(xLin.ticks(5)).join('line')
        .attr('x1', d => xLin(d)).attr('x2', d => xLin(d))
        .attr('y1', 0).attr('y2', h)
        .attr('stroke', 'rgba(99,102,241,0.1)').attr('stroke-dasharray', '3,3');

      // Bars with animation
      g.selectAll('rect').data(data).join('rect')
        .attr('x', 0).attr('y', d => yBand(String(d.x))!)
        .attr('height', yBand.bandwidth()).attr('rx', 4)
        .attr('fill', (_, i) => `hsl(${240 + i * 8}, 70%, ${55 + i * 2}%)`)
        .attr('width', 0)
        .transition().duration(600).delay((_, i) => i * 50)
        .attr('width', d => xLin(d.y));

      // Value labels
      g.selectAll('.val').data(data).join('text')
        .attr('x', d => xLin(d.y) + 8)
        .attr('y', d => yBand(String(d.x))! + yBand.bandwidth() / 2)
        .attr('dy', '0.35em').attr('fill', '#a1a1aa').attr('font-size', '11px')
        .text(d => d.y >= 1000 ? `${(d.y / 1000).toFixed(1)}B` : `${d.y}M`);

      // Y axis labels
      g.selectAll('.label').data(data).join('text')
        .attr('x', -8).attr('y', d => yBand(String(d.x))! + yBand.bandwidth() / 2)
        .attr('dy', '0.35em').attr('text-anchor', 'end')
        .attr('fill', '#e2e8f0').attr('font-size', '12px')
        .text(d => String(d.x));

      return;
    }

    if (spec.type === 'bar') {
      const data = spec.series[0].data;
      const xBand = d3.scaleBand().domain(data.map(d => String(d.x))).range([0, w]).padding(0.3);
      const yLin = d3.scaleLinear().domain([0, d3.max(data, d => d.y)! * 1.1]).range([h, 0]).nice();

      // Grid
      g.selectAll('.grid').data(yLin.ticks(5)).join('line')
        .attr('x1', 0).attr('x2', w).attr('y1', d => yLin(d)).attr('y2', d => yLin(d))
        .attr('stroke', 'rgba(99,102,241,0.1)').attr('stroke-dasharray', '3,3');

      g.selectAll('rect').data(data).join('rect')
        .attr('x', d => xBand(String(d.x))!)
        .attr('width', xBand.bandwidth()).attr('rx', 4)
        .attr('fill', spec.series[0].color || '#22c55e')
        .attr('y', h).attr('height', 0)
        .transition().duration(500).delay((_, i) => i * 40)
        .attr('y', d => yLin(d.y)).attr('height', d => h - yLin(d.y));

      // X axis
      g.append('g').attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(xBand).tickSize(0))
        .selectAll('text').attr('fill', '#a1a1aa').attr('font-size', '10px')
        .attr('transform', 'rotate(-30)').attr('text-anchor', 'end');
      g.select('.domain').attr('stroke', 'rgba(255,255,255,0.1)');

      // Y axis
      g.append('g').call(d3.axisLeft(yLin).ticks(5).tickFormat(d => `${d}%`))
        .selectAll('text').attr('fill', '#a1a1aa').attr('font-size', '10px');

      return;
    }

    if (spec.type === 'scatter') {
      const xLin = d3.scaleLinear().domain([0, d3.max(allPoints, d => d.x as number)! * 1.1]).range([0, w]).nice();
      const yLin = d3.scaleLinear().domain([40, d3.max(allPoints, d => d.y)! * 1.05]).range([h, 0]).nice();

      // Grid
      g.selectAll('.hg').data(yLin.ticks(5)).join('line')
        .attr('x1', 0).attr('x2', w).attr('y1', d => yLin(d)).attr('y2', d => yLin(d))
        .attr('stroke', 'rgba(99,102,241,0.1)').attr('stroke-dasharray', '3,3');

      g.selectAll('circle').data(allPoints).join('circle')
        .attr('cx', d => xLin(d.x as number)).attr('cy', d => yLin(d.y))
        .attr('fill', '#6366f1').attr('fill-opacity', 0.7)
        .attr('stroke', '#818cf8').attr('stroke-width', 2)
        .attr('r', 0).transition().duration(400).delay((_, i) => i * 60)
        .attr('r', 10);

      g.selectAll('.lbl').data(allPoints).join('text')
        .attr('x', d => xLin(d.x as number)).attr('y', d => yLin(d.y) - 14)
        .attr('text-anchor', 'middle').attr('fill', '#e2e8f0').attr('font-size', '10px')
        .text(d => d.label || '');

      g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(xLin).ticks(5).tickFormat(d => `$${d3.format('.0s')(d as number)}`))
        .selectAll('text').attr('fill', '#a1a1aa').attr('font-size', '10px');
      g.append('g').call(d3.axisLeft(yLin).ticks(5)).selectAll('text').attr('fill', '#a1a1aa').attr('font-size', '10px');

      return;
    }

    // Line / Area chart (default)
    const xLin = d3.scaleLinear()
      .domain(d3.extent(allPoints, d => d.x as number) as [number, number])
      .range([0, w]);
    const yMin = Math.min(0, d3.min(allPoints, d => d.y) || 0);
    const yLin = d3.scaleLinear()
      .domain([yMin, d3.max(allPoints, d => d.y)! * 1.1])
      .range([h, 0]).nice();

    // Grid
    g.selectAll('.hg').data(yLin.ticks(5)).join('line')
      .attr('x1', 0).attr('x2', w).attr('y1', d => yLin(d)).attr('y2', d => yLin(d))
      .attr('stroke', 'rgba(99,102,241,0.1)').attr('stroke-dasharray', '3,3');

    const line = d3.line<DataPoint>()
      .x(d => xLin(d.x as number)).y(d => yLin(d.y))
      .curve(d3.curveMonotoneX);

    if (spec.type === 'area') {
      const area = d3.area<DataPoint>()
        .x(d => xLin(d.x as number)).y0(h).y1(d => yLin(d.y))
        .curve(d3.curveMonotoneX);

      spec.series.forEach((s, i) => {
        g.append('path').datum(s.data)
          .attr('d', area).attr('fill', s.color || '#6366f1').attr('fill-opacity', 0)
          .transition().duration(800).delay(i * 150).attr('fill-opacity', 0.2);
      });
    }

    spec.series.forEach((s, i) => {
      const path = g.append('path').datum(s.data)
        .attr('d', line).attr('fill', 'none')
        .attr('stroke', s.color || '#6366f1').attr('stroke-width', 2.5);

      const totalLen = (path.node() as SVGPathElement)?.getTotalLength() || 0;
      path.attr('stroke-dasharray', `${totalLen} ${totalLen}`)
        .attr('stroke-dashoffset', totalLen)
        .transition().duration(1000).delay(i * 200)
        .attr('stroke-dashoffset', 0);

      // Dots
      g.selectAll(`.dot-${i}`).data(s.data).join('circle')
        .attr('cx', d => xLin(d.x as number)).attr('cy', d => yLin(d.y))
        .attr('fill', s.color || '#6366f1')
        .attr('r', 0).transition().duration(300).delay((_, j) => i * 200 + j * 80)
        .attr('r', 3.5);
    });

    // Axes
    g.append('g').attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xLin).ticks(6).tickFormat(d => String(d)))
      .selectAll('text').attr('fill', '#a1a1aa').attr('font-size', '10px');
    g.append('g')
      .call(d3.axisLeft(yLin).ticks(5).tickFormat(d => {
        const fmt = spec.yAxis.format;
        if (fmt === '%') return `${d}%`;
        if (fmt === 't') return `${d}t`;
        return String(d);
      }))
      .selectAll('text').attr('fill', '#a1a1aa').attr('font-size', '10px');

    // Axis styling
    svg.selectAll('.domain').attr('stroke', 'rgba(255,255,255,0.1)');
    svg.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.05)');

  }, [spec, dims]);

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} width={dims.w} height={dims.h} className="overflow-visible" />
      {/* Legend */}
      {spec.series.length > 1 && (
        <div className="flex flex-wrap gap-4 mt-3 px-2">
          {spec.series.map(s => (
            <div key={s.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-xs text-[var(--exd-text-secondary)]">{s.name}</span>
            </div>
          ))}
        </div>
      )}
      {spec.source && (
        <p className="text-[10px] text-[var(--exd-text-muted)] mt-2 px-2">Source: {spec.source}</p>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function AICopilot() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ spec: ChartSpec; thinking: string } | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = useCallback(async (q?: string) => {
    const text = q || query;
    if (!text.trim() || loading) return;
    setQuery(text);
    setLoading(true);
    setResult(null);

    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    const { key, spec } = findChart(text);
    setResult({ spec, thinking: THINKING_MESSAGES[key] || 'Analyzing your query…' });
    setLoading(false);
  }, [query, loading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  return (
    <section
      ref={sectionRef}
      id="ai-copilot"
      className="relative py-32 px-6 overflow-hidden bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            left: '50%', top: '40%', transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-gray-400">AI-Powered</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white/90">Ask a Question. </span>
            <span className="gradient-text">Get a Chart.</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Type what you want to see in plain English. Our AI understands your intent 
            and creates the perfect visualization instantly.
          </p>
        </motion.div>

        {/* Input */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className={`relative max-w-3xl mx-auto rounded-2xl border transition-all duration-300 ${
            loading ? 'border-[var(--exd-accent-primary)]/50 shadow-lg shadow-[var(--exd-accent-primary)]/20' : 'border-white/10 hover:border-white/20'
          } bg-[var(--exd-bg-secondary)]`}>
            <div className="flex items-center p-1">
              <Sparkles className="w-5 h-5 text-[var(--exd-accent-primary)] ml-4 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Show me GDP growth in Europe 2000-2024..."
                className="flex-1 bg-transparent px-4 py-4 text-white placeholder-gray-500 focus:outline-none text-lg"
                disabled={loading}
              />
              <button
                onClick={() => handleSubmit()}
                disabled={loading || !query.trim()}
                className={`mr-2 p-3 rounded-xl transition-all duration-200 ${
                  loading || !query.trim()
                    ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                    : 'bg-[var(--exd-accent-primary)] text-white hover:bg-[var(--exd-accent-secondary)]'
                }`}
              >
                {loading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Example queries */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            <span className="text-gray-500 text-sm">Try:</span>
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(ex)}
                className="px-3 py-1.5 text-sm bg-white/[0.03] border border-white/5 rounded-lg text-gray-400 hover:text-white hover:border-[var(--exd-accent-primary)]/30 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="exd-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="w-8 h-8 rounded-lg bg-[var(--exd-accent-primary)]/20"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <div className="h-5 w-64 rounded bg-white/5 animate-pulse" />
                </div>
                <div className="h-[300px] rounded-lg bg-white/[0.02] animate-pulse" />
                <div className="flex items-center gap-2 mt-4">
                  <Sparkles className="w-4 h-4 text-[var(--exd-accent-primary)] animate-pulse" />
                  <span className="text-sm text-gray-400">AI is thinking…</span>
                </div>
              </div>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto"
            >
              {/* Thinking bubble */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-4"
              >
                <span className="inline-flex items-center gap-2 text-sm text-gray-400 bg-white/[0.03] px-4 py-2 rounded-full border border-white/5">
                  💭 {result.thinking}
                </span>
              </motion.div>

              {/* Chart card */}
              <div className="exd-card exd-glow overflow-hidden">
                <div className="p-6 pb-4 border-b border-white/5">
                  <h3 className="text-xl font-bold text-white">{result.spec.title}</h3>
                  {result.spec.subtitle && (
                    <p className="text-sm text-[var(--exd-text-secondary)] mt-1">{result.spec.subtitle}</p>
                  )}
                </div>
                <div className="p-6">
                  <MiniChart spec={result.spec} />
                </div>
              </div>

              {/* Reset */}
              <div className="text-center mt-6">
                <button
                  onClick={() => { setResult(null); setQuery(''); }}
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try another query
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state features */}
        {!result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid md:grid-cols-3 gap-4 mt-12 max-w-3xl mx-auto"
          >
            {[
              { icon: '🔮', title: 'AI-Powered', desc: 'Understands your intent and picks the best chart type' },
              { icon: '🌍', title: 'Real Data Sources', desc: 'Connected to World Bank, IEA, and Our World in Data' },
              { icon: '✨', title: 'Instant Charts', desc: 'Beautiful, animated visualizations in under 2 seconds' },
            ].map((f, i) => (
              <div key={i} className="text-center p-5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h4 className="font-semibold text-white mb-1 text-sm">{f.title}</h4>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
