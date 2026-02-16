'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import Link from 'next/link';
import ShareEmbed from '../../components/ShareEmbed';

// --- Types ---
interface DataPoint {
  year: number;
  value: number;
}

interface CountryStats {
  gdp: number | null;
  population: number | null;
  co2: number | null;
  lifeExpectancy: number | null;
}

// --- Constants ---
const COUNTRIES = [
  { code: 'USA', name: 'United States' },
  { code: 'CHN', name: 'China' },
  { code: 'DEU', name: 'Germany' },
  { code: 'JPN', name: 'Japan' },
  { code: 'GBR', name: 'United Kingdom' },
  { code: 'IND', name: 'India' },
  { code: 'FRA', name: 'France' },
  { code: 'BRA', name: 'Brazil' },
  { code: 'CAN', name: 'Canada' },
  { code: 'AUS', name: 'Australia' },
  { code: 'KOR', name: 'South Korea' },
  { code: 'MEX', name: 'Mexico' },
  { code: 'IDN', name: 'Indonesia' },
  { code: 'NGA', name: 'Nigeria' },
  { code: 'ZAF', name: 'South Africa' },
  { code: 'SAU', name: 'Saudi Arabia' },
  { code: 'SWE', name: 'Sweden' },
  { code: 'NOR', name: 'Norway' },
  { code: 'SGP', name: 'Singapore' },
  { code: 'ARE', name: 'UAE' },
];

const INDICATORS = {
  gdp: 'NY.GDP.MKTP.CD',
  population: 'SP.POP.TOTL',
  co2: 'EN.ATM.CO2E.PC',
  lifeExpectancy: 'SP.DYN.LE00.IN',
};

// --- API ---
async function fetchIndicator(countryCode: string, indicator: string): Promise<DataPoint[]> {
  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&per_page=30&date=1995:2023`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (!json[1]) return [];
    return json[1]
      .filter((d: { value: number | null }) => d.value !== null)
      .map((d: { date: string; value: number }) => ({ year: parseInt(d.date), value: d.value }))
      .sort((a: DataPoint, b: DataPoint) => a.year - b.year);
  } catch {
    return [];
  }
}

// --- Formatters ---
function formatNumber(val: number | null, type: string): string {
  if (val === null) return '—';
  switch (type) {
    case 'gdp':
      if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
      if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
      return `$${(val / 1e6).toFixed(0)}M`;
    case 'population':
      if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`;
      if (val >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
      return val.toLocaleString();
    case 'co2':
      return `${val.toFixed(2)} t`;
    case 'lifeExpectancy':
      return `${val.toFixed(1)} yrs`;
    default:
      return val.toLocaleString();
  }
}

// --- D3 Line Chart ---
function LineChart({ data, color, label, unit }: { data: DataPoint[]; color: string; label: string; unit: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const isSmall = svgRef.current.clientWidth < 400;
    const margin = isSmall
      ? { top: 16, right: 12, bottom: 32, left: 40 }
      : { top: 20, right: 20, bottom: 40, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 260 - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain(d3.extent(data, d => d.year) as [number, number]).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.value)! * 1.1]).range([height, 0]);

    // Grid
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y).ticks(isSmall ? 3 : 5).tickSize(-width).tickFormat(() => ''))
      .selectAll('line').attr('stroke', 'rgba(255,255,255,0.06)');
    g.selectAll('.grid .domain').remove();

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d => String(d)))
      .selectAll('text').attr('fill', '#9ca3af').attr('font-size', '11px');
    g.selectAll('.domain').attr('stroke', 'rgba(255,255,255,0.1)');
    g.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.1)');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => {
        const v = d as number;
        if (v >= 1e12) return `${(v / 1e12).toFixed(1)}T`;
        if (v >= 1e9) return `${(v / 1e9).toFixed(0)}B`;
        if (v >= 1e6) return `${(v / 1e6).toFixed(0)}M`;
        return String(v);
      }))
      .selectAll('text').attr('fill', '#9ca3af').attr('font-size', '11px');

    // Gradient fill
    const gradientId = `grad-${label.replace(/\s/g, '')}`;
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient').attr('id', gradientId).attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.3);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0);

    // Area
    const area = d3.area<DataPoint>().x(d => x(d.year)).y0(height).y1(d => y(d.value)).curve(d3.curveMonotoneX);
    g.append('path').datum(data).attr('d', area).attr('fill', `url(#${gradientId})`);

    // Line
    const line = d3.line<DataPoint>().x(d => x(d.year)).y(d => y(d.value)).curve(d3.curveMonotoneX);
    const path = g.append('path').datum(data).attr('d', line).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2.5);
    
    // Animate
    const totalLength = path.node()?.getTotalLength() || 0;
    path.attr('stroke-dasharray', totalLength).attr('stroke-dashoffset', totalLength)
      .transition().duration(1000).ease(d3.easeCubicOut).attr('stroke-dashoffset', 0);

    // Dots
    g.selectAll('.dot').data(data).enter().append('circle')
      .attr('cx', d => x(d.year)).attr('cy', d => y(d.value))
      .attr('r', 3).attr('fill', color).attr('opacity', 0)
      .transition().delay((_, i) => i * 30).duration(300).attr('opacity', 0.8);

    // Tooltip on hover
    const tooltip = g.append('g').style('display', 'none');
    tooltip.append('rect').attr('width', 120).attr('height', 40).attr('fill', 'rgba(0,0,0,0.85)').attr('rx', 6).attr('stroke', color).attr('stroke-width', 1);
    const tooltipText1 = tooltip.append('text').attr('x', 10).attr('y', 16).attr('fill', '#fff').attr('font-size', '11px');
    const tooltipText2 = tooltip.append('text').attr('x', 10).attr('y', 32).attr('fill', '#9ca3af').attr('font-size', '10px');

    svg.on('mousemove', (event) => {
      const [mx] = d3.pointer(event, g.node());
      const yearVal = x.invert(mx);
      const closest = data.reduce((prev, curr) => Math.abs(curr.year - yearVal) < Math.abs(prev.year - yearVal) ? curr : prev);
      tooltip.style('display', null)
        .attr('transform', `translate(${x(closest.year) + 10},${y(closest.value) - 20})`);
      tooltipText1.text(`${closest.year}: ${formatNumber(closest.value, unit)}`);
      tooltipText2.text(label);
    });
    svg.on('mouseleave', () => tooltip.style('display', 'none'));

  }, [data, color, label, unit]);

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
      <h3 className="text-sm font-medium text-gray-400 mb-3">{label}</h3>
      {data.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-gray-600 text-sm">No data available</div>
      ) : (
        <svg ref={svgRef} width="100%" height={260} />
      )}
    </div>
  );
}

// --- D3 Bar Chart ---
function BarChart({ data, color, label, unit }: { data: DataPoint[]; color: string; label: string; unit: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const isSmall = svgRef.current.clientWidth < 400;
    const margin = isSmall
      ? { top: 16, right: 12, bottom: 32, left: 40 }
      : { top: 20, right: 20, bottom: 40, left: 55 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 260 - margin.top - margin.bottom;

    // Show last 15 years max (fewer on small screens)
    const trimmed = data.slice(isSmall ? -10 : -15);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(trimmed.map(d => String(d.year))).range([0, width]).padding(isSmall ? 0.2 : 0.3);
    const y = d3.scaleLinear().domain([0, d3.max(trimmed, d => d.value)! * 1.1]).range([height, 0]);

    // Grid
    g.append('g')
      .call(d3.axisLeft(y).ticks(isSmall ? 3 : 5).tickSize(-width).tickFormat(() => ''))
      .selectAll('line').attr('stroke', 'rgba(255,255,255,0.06)');
    g.selectAll('.grid .domain').remove();

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickValues(trimmed.filter((_, i) => i % 3 === 0).map(d => String(d.year))))
      .selectAll('text').attr('fill', '#9ca3af').attr('font-size', '11px');
    g.selectAll('.domain').attr('stroke', 'rgba(255,255,255,0.1)');
    g.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.1)');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => String(d)))
      .selectAll('text').attr('fill', '#9ca3af').attr('font-size', '11px');

    // Bars
    g.selectAll('.bar').data(trimmed).enter().append('rect')
      .attr('x', d => x(String(d.year))!)
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', color)
      .attr('rx', 3)
      .attr('opacity', 0.85)
      .transition().duration(600).delay((_, i) => i * 30)
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value));

    // Tooltip
    const tooltip = g.append('g').style('display', 'none');
    tooltip.append('rect').attr('width', 110).attr('height', 36).attr('fill', 'rgba(0,0,0,0.85)').attr('rx', 6).attr('stroke', color).attr('stroke-width', 1);
    const tt1 = tooltip.append('text').attr('x', 8).attr('y', 15).attr('fill', '#fff').attr('font-size', '11px');
    const tt2 = tooltip.append('text').attr('x', 8).attr('y', 29).attr('fill', '#9ca3af').attr('font-size', '10px');

    g.selectAll('.bar-hover').data(trimmed).enter().append('rect')
      .attr('x', d => x(String(d.year))!)
      .attr('width', x.bandwidth())
      .attr('y', 0).attr('height', height)
      .attr('fill', 'transparent')
      .on('mouseenter', (_, d) => {
        tooltip.style('display', null).attr('transform', `translate(${x(String(d.year))! + x.bandwidth() / 2},${y(d.value) - 42})`);
        tt1.text(`${d.year}: ${formatNumber(d.value, unit)}`);
        tt2.text(label);
      })
      .on('mouseleave', () => tooltip.style('display', 'none'));

  }, [data, color, label, unit]);

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
      <h3 className="text-sm font-medium text-gray-400 mb-3">{label}</h3>
      {data.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-gray-600 text-sm">No data available</div>
      ) : (
        <svg ref={svgRef} width="100%" height={260} />
      )}
    </div>
  );
}

// --- Stat Card ---
function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg`} style={{ background: `${color}20` }}>
          {icon}
        </div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

// --- Main Dashboard ---
export default function DashboardPage() {
  const [country, setCountry] = useState('DEU');
  const [stats, setStats] = useState<CountryStats>({ gdp: null, population: null, co2: null, lifeExpectancy: null });
  const [gdpHistory, setGdpHistory] = useState<DataPoint[]>([]);
  const [co2History, setCo2History] = useState<DataPoint[]>([]);
  const [popHistory, setPopHistory] = useState<DataPoint[]>([]);
  const [leHistory, setLeHistory] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (code: string) => {
    setLoading(true);
    const [gdp, pop, co2, le] = await Promise.all([
      fetchIndicator(code, INDICATORS.gdp),
      fetchIndicator(code, INDICATORS.population),
      fetchIndicator(code, INDICATORS.co2),
      fetchIndicator(code, INDICATORS.lifeExpectancy),
    ]);

    setGdpHistory(gdp);
    setPopHistory(pop);
    setCo2History(co2);
    setLeHistory(le);

    setStats({
      gdp: gdp.length > 0 ? gdp[gdp.length - 1].value : null,
      population: pop.length > 0 ? pop[pop.length - 1].value : null,
      co2: co2.length > 0 ? co2[co2.length - 1].value : null,
      lifeExpectancy: le.length > 0 ? le[le.length - 1].value : null,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData(country);
  }, [country, loadData]);

  const countryName = COUNTRIES.find(c => c.code === country)?.name || country;

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#050507]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-lg opacity-80" />
                <div className="absolute inset-[2px] bg-[#050507] rounded-[5px] flex items-center justify-center">
                  <span className="text-xs font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">E</span>
                </div>
              </div>
              <span className="text-base font-bold">EXD</span>
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-sm font-medium text-gray-300">Dashboard</span>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Title + Selector */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              World Data Explorer
            </h1>
            <p className="text-gray-500 text-sm">Real-time indicators from the World Bank</p>
          </div>
          <div className="relative">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="appearance-none bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 cursor-pointer w-full sm:min-w-[200px]"
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code} className="bg-[#0a0a0f] text-white">
                  {c.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 6l4 4 4-4"/></svg>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Loading data for {countryName}…</span>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="GDP" value={formatNumber(stats.gdp, 'gdp')} icon="💰" color="#818cf8" />
          <StatCard label="Population" value={formatNumber(stats.population, 'population')} icon="👥" color="#a78bfa" />
          <StatCard label="CO₂ per Capita" value={formatNumber(stats.co2, 'co2')} icon="🏭" color="#22d3ee" />
          <StatCard label="Life Expectancy" value={formatNumber(stats.lifeExpectancy, 'lifeExpectancy')} icon="❤️" color="#f472b6" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LineChart data={gdpHistory} color="#818cf8" label={`GDP — ${countryName}`} unit="gdp" />
          <BarChart data={co2History} color="#22d3ee" label={`CO₂ per Capita — ${countryName}`} unit="co2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChart data={popHistory} color="#a78bfa" label={`Population — ${countryName}`} unit="population" />
          <LineChart data={leHistory} color="#f472b6" label={`Life Expectancy — ${countryName}`} unit="lifeExpectancy" />
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-xs text-gray-600">Data sourced from the World Bank Open Data API · Updated periodically</p>
        </div>
      </main>

      <ShareEmbed type="dashboard" params={{ country }} />
    </div>
  );
}
