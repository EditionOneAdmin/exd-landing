'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import Link from 'next/link';
import ShareEmbed from '../../components/ShareEmbed';

// --- Types ---
interface DataPoint {
  year: number;
  value: number;
}

interface IndicatorData {
  key: string;
  label: string;
  unit: string;
  icon: string;
  color: string;
  colorB: string;
  wbCode: string;
}

// --- Countries (30+) ---
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
  { code: 'ITA', name: 'Italy' },
  { code: 'ESP', name: 'Spain' },
  { code: 'RUS', name: 'Russia' },
  { code: 'TUR', name: 'Turkey' },
  { code: 'POL', name: 'Poland' },
  { code: 'ARG', name: 'Argentina' },
  { code: 'THA', name: 'Thailand' },
  { code: 'EGY', name: 'Egypt' },
  { code: 'NLD', name: 'Netherlands' },
  { code: 'CHE', name: 'Switzerland' },
  { code: 'COL', name: 'Colombia' },
  { code: 'KEN', name: 'Kenya' },
];

// --- Indicators ---
const INDICATORS: IndicatorData[] = [
  { key: 'gdp', label: 'GDP', unit: 'gdp', icon: '💰', color: '#818cf8', colorB: '#22d3ee', wbCode: 'NY.GDP.MKTP.CD' },
  { key: 'population', label: 'Population', unit: 'population', icon: '👥', color: '#a78bfa', colorB: '#f472b6', wbCode: 'SP.POP.TOTL' },
  { key: 'lifeExpectancy', label: 'Life Expectancy', unit: 'lifeExpectancy', icon: '❤️', color: '#f472b6', colorB: '#fbbf24', wbCode: 'SP.DYN.LE00.IN' },
  { key: 'co2', label: 'CO₂ Emissions (per capita)', unit: 'co2', icon: '🏭', color: '#22d3ee', colorB: '#818cf8', wbCode: 'EN.ATM.CO2E.PC' },
  { key: 'urban', label: 'Urban Population %', unit: 'percent', icon: '🏙️', color: '#34d399', colorB: '#a78bfa', wbCode: 'SP.URB.TOTL.IN.ZS' },
  { key: 'internet', label: 'Internet Users %', unit: 'percent', icon: '🌐', color: '#fbbf24', colorB: '#34d399', wbCode: 'IT.NET.USER.ZS' },
];

// --- API ---
async function fetchIndicator(countryCode: string, indicator: string): Promise<DataPoint[]> {
  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&per_page=30&date=2003:2023`;
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
function formatValue(val: number | null, unit: string): string {
  if (val === null) return '—';
  switch (unit) {
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
    case 'percent':
      return `${val.toFixed(1)}%`;
    default:
      return val.toLocaleString();
  }
}

// --- Comparison Bar Chart (side-by-side) ---
function ComparisonBar({
  valueA,
  valueB,
  nameA,
  nameB,
  colorA,
  colorB,
  unit,
}: {
  valueA: number | null;
  valueB: number | null;
  nameA: string;
  nameB: string;
  colorA: string;
  colorB: string;
  unit: string;
}) {
  const maxVal = Math.max(valueA || 0, valueB || 0);
  const pctA = maxVal > 0 && valueA ? (valueA / maxVal) * 100 : 0;
  const pctB = maxVal > 0 && valueB ? (valueB / maxVal) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">{nameA}</span>
          <span className="text-white font-medium">{formatValue(valueA, unit)}</span>
        </div>
        <div className="h-6 bg-white/[0.03] rounded-lg overflow-hidden">
          <motion.div
            className="h-full rounded-lg"
            style={{ backgroundColor: colorA }}
            initial={{ width: 0 }}
            animate={{ width: `${pctA}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">{nameB}</span>
          <span className="text-white font-medium">{formatValue(valueB, unit)}</span>
        </div>
        <div className="h-6 bg-white/[0.03] rounded-lg overflow-hidden">
          <motion.div
            className="h-full rounded-lg"
            style={{ backgroundColor: colorB }}
            initial={{ width: 0 }}
            animate={{ width: `${pctB}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          />
        </div>
      </div>
    </div>
  );
}

// --- Sparkline (D3) ---
function Sparkline({
  dataA,
  dataB,
  colorA,
  colorB,
  nameA,
  nameB,
  unit,
}: {
  dataA: DataPoint[];
  dataB: DataPoint[];
  colorA: string;
  colorB: string;
  nameA: string;
  nameB: string;
  unit: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 12, right: 12, bottom: 28, left: 50 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 140 - margin.top - margin.bottom;
    if (width <= 0) return;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const allData = [...dataA, ...dataB];
    if (allData.length === 0) return;

    const xDomain = d3.extent(allData, d => d.year) as [number, number];
    const yMax = d3.max(allData, d => d.value) || 1;

    const x = d3.scaleLinear().domain(xDomain).range([0, width]);
    const y = d3.scaleLinear().domain([0, yMax * 1.1]).range([height, 0]);

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => String(d)))
      .selectAll('text').attr('fill', '#6b7280').attr('font-size', '9px');
    g.selectAll('.domain').attr('stroke', 'rgba(255,255,255,0.06)');
    g.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.06)');

    // Y axis (minimal)
    g.append('g')
      .call(d3.axisLeft(y).ticks(3).tickFormat(d => {
        const v = d as number;
        if (v >= 1e12) return `${(v / 1e12).toFixed(1)}T`;
        if (v >= 1e9) return `${(v / 1e9).toFixed(0)}B`;
        if (v >= 1e6) return `${(v / 1e6).toFixed(0)}M`;
        if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
        return v.toFixed(0);
      }))
      .selectAll('text').attr('fill', '#6b7280').attr('font-size', '9px');

    const drawLine = (data: DataPoint[], color: string) => {
      if (data.length === 0) return;
      const line = d3.line<DataPoint>().x(d => x(d.year)).y(d => y(d.value)).curve(d3.curveMonotoneX);
      const path = g.append('path').datum(data).attr('d', line).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2);
      const totalLength = path.node()?.getTotalLength() || 0;
      path.attr('stroke-dasharray', totalLength).attr('stroke-dashoffset', totalLength)
        .transition().duration(800).ease(d3.easeCubicOut).attr('stroke-dashoffset', 0);
    };

    drawLine(dataA, colorA);
    drawLine(dataB, colorB);

    // Legend
    const legend = svg.append('g').attr('transform', `translate(${margin.left + 4}, 8)`);
    [{ name: nameA, color: colorA }, { name: nameB, color: colorB }].forEach((item, i) => {
      legend.append('circle').attr('cx', i * 90).attr('cy', 0).attr('r', 4).attr('fill', item.color);
      legend.append('text').attr('x', i * 90 + 8).attr('y', 4).text(item.name).attr('fill', '#9ca3af').attr('font-size', '9px');
    });
  }, [dataA, dataB, colorA, colorB, nameA, nameB, unit]);

  const hasData = dataA.length > 0 || dataB.length > 0;

  return hasData ? (
    <svg ref={svgRef} width="100%" height={140} />
  ) : (
    <div className="h-[140px] flex items-center justify-center text-gray-600 text-xs">No time series data</div>
  );
}

// --- Indicator Card ---
function IndicatorCard({
  indicator,
  dataA,
  dataB,
  nameA,
  nameB,
  index,
}: {
  indicator: IndicatorData;
  dataA: DataPoint[];
  dataB: DataPoint[];
  nameA: string;
  nameB: string;
  index: number;
}) {
  const latestA = dataA.length > 0 ? dataA[dataA.length - 1].value : null;
  const latestB = dataB.length > 0 ? dataB[dataB.length - 1].value : null;

  return (
    <motion.div
      className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{indicator.icon}</span>
        <h3 className="text-sm font-medium text-gray-300">{indicator.label}</h3>
      </div>

      <ComparisonBar
        valueA={latestA}
        valueB={latestB}
        nameA={nameA}
        nameB={nameB}
        colorA={indicator.color}
        colorB={indicator.colorB}
        unit={indicator.unit}
      />

      <div className="mt-4 pt-3 border-t border-white/[0.04]">
        <p className="text-[10px] text-gray-600 mb-1 uppercase tracking-wider">20-Year Trend</p>
        <Sparkline
          dataA={dataA}
          dataB={dataB}
          colorA={indicator.color}
          colorB={indicator.colorB}
          nameA={nameA}
          nameB={nameB}
          unit={indicator.unit}
        />
      </div>
    </motion.div>
  );
}

// --- Country Selector ---
function CountrySelect({
  value,
  onChange,
  label,
  color,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  color: string;
}) {
  return (
    <div className="flex-1 min-w-0 sm:min-w-[180px]">
      <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block" style={{ color }}>
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 cursor-pointer"
        >
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code} className="bg-[#0a0a0f] text-white">
              {c.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 6l4 4 4-4" /></svg>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function ComparePage() {
  const [countryA, setCountryA] = useState('USA');
  const [countryB, setCountryB] = useState('CHN');
  const [allData, setAllData] = useState<Record<string, { a: DataPoint[]; b: DataPoint[] }>>({});
  const [loading, setLoading] = useState(true);

  const nameA = COUNTRIES.find(c => c.code === countryA)?.name || countryA;
  const nameB = COUNTRIES.find(c => c.code === countryB)?.name || countryB;

  const loadData = useCallback(async (codeA: string, codeB: string) => {
    setLoading(true);
    const results: Record<string, { a: DataPoint[]; b: DataPoint[] }> = {};

    await Promise.all(
      INDICATORS.map(async (ind) => {
        const [a, b] = await Promise.all([
          fetchIndicator(codeA, ind.wbCode),
          fetchIndicator(codeB, ind.wbCode),
        ]);
        results[ind.key] = { a, b };
      })
    );

    setAllData(results);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData(countryA, countryB);
  }, [countryA, countryB, loadData]);

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
            <span className="text-sm font-medium text-gray-300">Compare</span>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Title */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-1">Country Comparison</h1>
          <p className="text-gray-500 text-sm">Compare real-time World Bank indicators side by side</p>
        </motion.div>

        {/* Country Selectors */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <CountrySelect value={countryA} onChange={setCountryA} label="Country A" color="#818cf8" />
          <div className="hidden sm:flex items-end pb-2">
            <span className="text-gray-600 text-lg font-light">vs</span>
          </div>
          <CountrySelect value={countryB} onChange={setCountryB} label="Country B" color="#22d3ee" />
        </motion.div>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Loading data for {nameA} & {nameB}…</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicator Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {INDICATORS.map((ind, i) => (
            <IndicatorCard
              key={`${ind.key}-${countryA}-${countryB}`}
              indicator={ind}
              dataA={allData[ind.key]?.a || []}
              dataB={allData[ind.key]?.b || []}
              nameA={nameA}
              nameB={nameB}
              index={i}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-xs text-gray-600">Data sourced from the World Bank Open Data API · Updated periodically</p>
        </div>
      </main>

      <ShareEmbed type="compare" params={{ countries: `${countryA},${countryB}` }} />
    </div>
  );
}
