'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { Sparkles, Send, RotateCcw, Zap, History, MessageSquare, ChevronRight, X, Radio } from 'lucide-react';
import { fetchLiveData } from '@/lib/worldBankApi';

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

interface QueryResult {
  query: string;
  spec: ChartSpec;
  thinking: string;
  followUps: string[];
  timestamp: number;
  isLive?: boolean;
}

// ── Mock Data ──────────────────────────────────────────────────────
const MOCK_CHARTS: Record<string, { spec: ChartSpec; thinking: string; followUps: string[] }> = {
  'gdp-europe': {
    spec: {
      type: 'line', title: 'GDP Growth in Europe', subtitle: '2000–2024, Annual % Change',
      xAxis: { label: 'Year', type: 'time' }, yAxis: { label: 'Growth Rate (%)', format: '%' },
      series: [
        { name: 'Germany', color: '#6366f1', data: [{x:2000,y:3},{x:2004,y:1.2},{x:2008,y:1.1},{x:2012,y:0.4},{x:2016,y:2.2},{x:2020,y:-3.7},{x:2024,y:0.2}] },
        { name: 'France', color: '#22c55e', data: [{x:2000,y:3.9},{x:2004,y:2.8},{x:2008,y:0.3},{x:2012,y:0.3},{x:2016,y:1.1},{x:2020,y:-7.5},{x:2024,y:0.9}] },
        { name: 'UK', color: '#f59e0b', data: [{x:2000,y:3.5},{x:2004,y:2.5},{x:2008,y:-0.3},{x:2012,y:1.4},{x:2016,y:1.7},{x:2020,y:-9.3},{x:2024,y:0.5}] },
      ],
      source: 'World Bank',
    },
    thinking: 'Fetching GDP data from World Bank API for Germany, France, UK…',
    followUps: ['How does GDP compare to unemployment in Europe?', 'Show me GDP per capita instead', 'What about Eastern European economies?'],
  },
  'co2-emissions': {
    spec: {
      type: 'area', title: 'CO₂ Emissions Comparison', subtitle: 'USA vs China vs India (t per capita)',
      xAxis: { label: 'Year', type: 'time' }, yAxis: { label: 'CO₂ per capita (t)', format: 't' },
      series: [
        { name: 'USA', color: '#6366f1', data: [{x:2000,y:20.2},{x:2005,y:19.5},{x:2010,y:17.4},{x:2015,y:16.1},{x:2020,y:13.5},{x:2023,y:14.2}] },
        { name: 'China', color: '#ef4444', data: [{x:2000,y:2.7},{x:2005,y:4.5},{x:2010,y:6.6},{x:2015,y:7.5},{x:2020,y:7.4},{x:2023,y:8.0}] },
        { name: 'India', color: '#22c55e', data: [{x:2000,y:1.0},{x:2005,y:1.2},{x:2010,y:1.5},{x:2015,y:1.8},{x:2020,y:1.7},{x:2023,y:2.0}] },
      ],
      source: 'Our World in Data',
    },
    thinking: 'Comparing per-capita emissions across three major emitters…',
    followUps: ['Show total emissions instead of per capita', 'Which countries reduced emissions the most?', 'Compare CO₂ to renewable energy adoption'],
  },
  'population-top10': {
    spec: {
      type: 'horizontal-bar', title: 'Top 10 Countries by Population', subtitle: '2024 Estimates (millions)',
      xAxis: { label: 'Country', type: 'category' }, yAxis: { label: 'Population (M)', format: 'M' },
      series: [{ name: 'Population', color: '#6366f1', data: [
        {x:'India',y:1428},{x:'China',y:1425},{x:'USA',y:340},{x:'Indonesia',y:277},{x:'Pakistan',y:240},
        {x:'Nigeria',y:224},{x:'Brazil',y:216},{x:'Bangladesh',y:173},{x:'Russia',y:144},{x:'Mexico',y:129}
      ]}],
      source: 'World Bank',
    },
    thinking: 'Ranking countries by 2024 population estimates…',
    followUps: ['Show population growth rate instead', 'What about population density?', 'Project population to 2050'],
  },
  'renewable-energy': {
    spec: {
      type: 'bar', title: 'Renewable Energy Share', subtitle: '% of Total Energy (2023)',
      xAxis: { label: 'Country', type: 'category' }, yAxis: { label: 'Renewable %', format: '%' },
      series: [{ name: 'Renewable', color: '#22c55e', data: [
        {x:'Iceland',y:85},{x:'Norway',y:72},{x:'Sweden',y:56},{x:'Brazil',y:48},{x:'Denmark',y:44},
        {x:'Germany',y:22},{x:'UK',y:20},{x:'USA',y:13},{x:'China',y:11},{x:'India',y:8}
      ]}],
      source: 'IEA',
    },
    thinking: 'Analyzing renewable energy shares from IEA data…',
    followUps: ['Break down by energy type (solar, wind, hydro)', 'Show renewable growth over time', 'Compare to fossil fuel dependency'],
  },
  'inflation': {
    spec: {
      type: 'area', title: 'Inflation Rate Trends', subtitle: 'Major Economies 2019–2024',
      xAxis: { label: 'Year', type: 'time' }, yAxis: { label: 'Inflation (%)', format: '%' },
      series: [
        { name: 'USA', color: '#6366f1', data: [{x:2019,y:1.8},{x:2020,y:1.2},{x:2021,y:4.7},{x:2022,y:8.0},{x:2023,y:4.1},{x:2024,y:2.9}] },
        { name: 'Eurozone', color: '#22c55e', data: [{x:2019,y:1.2},{x:2020,y:0.3},{x:2021,y:2.6},{x:2022,y:8.4},{x:2023,y:5.4},{x:2024,y:2.4}] },
        { name: 'UK', color: '#f59e0b', data: [{x:2019,y:1.8},{x:2020,y:0.9},{x:2021,y:2.6},{x:2022,y:9.1},{x:2023,y:7.3},{x:2024,y:3.4}] },
      ],
      source: 'IMF',
    },
    thinking: 'Pulling CPI data from IMF for US, Eurozone, UK…',
    followUps: ['How does inflation correlate with interest rates?', 'Show food price inflation separately', 'Compare to wage growth'],
  },
  'life-expectancy': {
    spec: {
      type: 'scatter', title: 'Life Expectancy vs GDP per Capita', subtitle: 'Selected countries, 2023',
      xAxis: { label: 'GDP per Capita ($)', type: 'linear' }, yAxis: { label: 'Life Expectancy (years)' },
      series: [{ name: 'Countries', data: [
        {x:65000,y:78.5,label:'USA'},{x:12500,y:78.2,label:'China'},{x:2250,y:70.4,label:'India'},
        {x:47000,y:81.3,label:'Germany'},{x:40000,y:84.5,label:'Japan'},{x:8700,y:75.9,label:'Brazil'},
        {x:2100,y:54.7,label:'Nigeria'},{x:55000,y:83.4,label:'Australia'},{x:32000,y:83.4,label:'S.Korea'},
      ]}],
      source: 'World Bank',
    },
    thinking: 'Cross-referencing health & income indicators from World Bank…',
    followUps: ['Show life expectancy over time', 'What about healthcare spending vs life expectancy?', 'Add infant mortality data'],
  },
  'global-temperature': {
    spec: {
      type: 'area', title: 'Global Temperature Anomaly', subtitle: 'Deviation from 1951–1980 average (°C)',
      xAxis: { label: 'Year', type: 'time' }, yAxis: { label: 'Anomaly (°C)', format: '°C' },
      series: [
        { name: 'Temperature Anomaly', color: '#ef4444', data: [
          {x:1960,y:0.01},{x:1970,y:0.02},{x:1980,y:0.26},{x:1990,y:0.45},{x:2000,y:0.39},{x:2005,y:0.67},
          {x:2010,y:0.72},{x:2015,y:0.87},{x:2020,y:1.02},{x:2023,y:1.17},{x:2025,y:1.35}
        ] },
      ],
      source: 'NASA GISS',
    },
    thinking: 'Loading NASA GISS surface temperature dataset…',
    followUps: ['Show sea level rise alongside temperature', 'Compare Arctic vs global warming rates', 'What are the projections for 2050?'],
  },
  'tech-market-cap': {
    spec: {
      type: 'bar', title: 'Top Tech Companies by Market Cap', subtitle: 'January 2025 ($ Trillions)',
      xAxis: { label: 'Company', type: 'category' }, yAxis: { label: 'Market Cap ($T)', format: 'T' },
      series: [{ name: 'Market Cap', color: '#818cf8', data: [
        {x:'Apple',y:3.7},{x:'Microsoft',y:3.1},{x:'NVIDIA',y:3.0},{x:'Amazon',y:2.4},{x:'Alphabet',y:2.3},
        {x:'Meta',y:1.6},{x:'TSMC',y:1.1},{x:'Tesla',y:0.8},{x:'Samsung',y:0.5},{x:'Oracle',y:0.5}
      ]}],
      source: 'Bloomberg',
    },
    thinking: 'Aggregating market cap data from Bloomberg terminals…',
    followUps: ['Show market cap growth over the last 5 years', 'Compare P/E ratios of these companies', 'Which sector grew fastest?'],
  },
  'internet-users': {
    spec: {
      type: 'line', title: 'Global Internet Users', subtitle: 'Billions of users, 2000–2024',
      xAxis: { label: 'Year', type: 'time' }, yAxis: { label: 'Users (B)', format: 'B' },
      series: [
        { name: 'Internet Users', color: '#06b6d4', data: [
          {x:2000,y:0.41},{x:2005,y:1.02},{x:2008,y:1.57},{x:2010,y:2.02},{x:2013,y:2.73},
          {x:2016,y:3.42},{x:2019,y:4.13},{x:2022,y:5.0},{x:2024,y:5.45}
        ] },
        { name: 'Mobile Users', color: '#f59e0b', data: [
          {x:2000,y:0.07},{x:2005,y:0.2},{x:2008,y:0.6},{x:2010,y:1.0},{x:2013,y:1.9},
          {x:2016,y:2.9},{x:2019,y:3.8},{x:2022,y:4.6},{x:2024,y:5.1}
        ] },
      ],
      source: 'ITU / Statista',
    },
    thinking: 'Querying ITU global connectivity statistics…',
    followUps: ['Show internet penetration by continent', 'What about broadband vs mobile access?', 'Compare digital divide across income groups'],
  },
  'healthcare-spending': {
    spec: {
      type: 'scatter', title: 'Healthcare Spending vs Outcomes', subtitle: '% of GDP vs Life Expectancy, 2023',
      xAxis: { label: 'Health Spending (% GDP)', type: 'linear' }, yAxis: { label: 'Life Expectancy (years)' },
      series: [{ name: 'Countries', data: [
        {x:16.6,y:78.5,label:'USA'},{x:12.8,y:81.3,label:'Germany'},{x:11.3,y:82.7,label:'France'},
        {x:11.0,y:84.5,label:'Japan'},{x:10.3,y:83.0,label:'Sweden'},{x:9.8,y:82.5,label:'UK'},
        {x:7.6,y:84.1,label:'S.Korea'},{x:5.6,y:78.2,label:'China'},{x:3.5,y:70.4,label:'India'},
        {x:3.0,y:54.7,label:'Nigeria'},
      ]}],
      source: 'WHO / World Bank',
    },
    thinking: 'Cross-referencing WHO health expenditure with outcomes data…',
    followUps: ['Show healthcare spending trends over time', 'Break down public vs private spending', 'Compare hospital beds per capita'],
  },
  'ev-adoption': {
    spec: {
      type: 'line', title: 'Electric Vehicle Sales Growth', subtitle: 'Global EV sales (millions), 2015–2024',
      xAxis: { label: 'Year', type: 'time' }, yAxis: { label: 'Sales (M)', format: 'M' },
      series: [
        { name: 'Battery EV', color: '#22c55e', data: [
          {x:2015,y:0.32},{x:2017,y:0.75},{x:2019,y:1.4},{x:2020,y:2.1},{x:2021,y:4.6},{x:2022,y:7.3},{x:2023,y:9.5},{x:2024,y:13.2}
        ] },
        { name: 'Plug-in Hybrid', color: '#f59e0b', data: [
          {x:2015,y:0.2},{x:2017,y:0.38},{x:2019,y:0.7},{x:2020,y:1.0},{x:2021,y:1.9},{x:2022,y:2.7},{x:2023,y:3.1},{x:2024,y:3.8}
        ] },
      ],
      source: 'IEA Global EV Outlook',
    },
    thinking: 'Loading IEA Global EV Outlook sales data…',
    followUps: ['Which countries lead EV adoption?', 'Show charging infrastructure growth', 'Compare EV vs ICE total cost of ownership'],
  },
  'global-debt': {
    spec: {
      type: 'horizontal-bar', title: 'Government Debt to GDP Ratio', subtitle: 'Selected countries, 2024 (%)',
      xAxis: { label: 'Country', type: 'category' }, yAxis: { label: 'Debt/GDP (%)', format: '%' },
      series: [{ name: 'Debt/GDP', color: '#ef4444', data: [
        {x:'Japan',y:255},{x:'Italy',y:140},{x:'USA',y:123},{x:'France',y:112},{x:'UK',y:101},
        {x:'Brazil',y:88},{x:'India',y:83},{x:'Germany',y:64},{x:'China',y:56},{x:'Australia',y:44}
      ]}],
      source: 'IMF Fiscal Monitor',
    },
    thinking: 'Pulling sovereign debt ratios from IMF Fiscal Monitor…',
    followUps: ['How has US debt changed over time?', 'Show interest payments as % of budget', 'Compare debt sustainability metrics'],
  },
  'ai-investment': {
    spec: {
      type: 'bar', title: 'Global AI Investment by Sector', subtitle: '2024, Billions USD',
      xAxis: { label: 'Sector', type: 'category' }, yAxis: { label: 'Investment ($B)', format: '$B' },
      series: [{ name: 'Investment', color: '#a78bfa', data: [
        {x:'Healthcare',y:28},{x:'Finance',y:24},{x:'Automotive',y:19},{x:'Retail',y:16},{x:'Manufacturing',y:14},
        {x:'Energy',y:11},{x:'Education',y:8},{x:'Agriculture',y:6},{x:'Defense',y:18},{x:'Media',y:9}
      ]}],
      source: 'Stanford HAI / McKinsey',
    },
    thinking: 'Aggregating AI investment data from Stanford HAI report…',
    followUps: ['Show AI investment growth year over year', 'Which startups received the most funding?', 'Compare AI adoption rates by industry'],
  },
};

function findChart(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('gdp') && q.includes('europ')) return 'gdp-europe';
  if (q.includes('co2') || q.includes('carbon') || q.includes('emission')) return 'co2-emissions';
  if (q.includes('population')) return 'population-top10';
  if ((q.includes('renewable') || q.includes('energy')) && !q.includes('ev') && !q.includes('electric')) return 'renewable-energy';
  if (q.includes('inflation')) return 'inflation';
  if (q.includes('life') || q.includes('expectancy')) return 'life-expectancy';
  if (q.includes('temperature') || q.includes('climate') || q.includes('warming') || q.includes('global temp')) return 'global-temperature';
  if (q.includes('tech') || q.includes('market cap') || q.includes('silicon')) return 'tech-market-cap';
  if (q.includes('internet') || q.includes('connectivity') || q.includes('digital')) return 'internet-users';
  if (q.includes('healthcare') || q.includes('health spend') || q.includes('medical')) return 'healthcare-spending';
  if (q.includes('ev') || q.includes('electric vehicle') || q.includes('electric car')) return 'ev-adoption';
  if (q.includes('debt') || q.includes('fiscal') || q.includes('sovereign')) return 'global-debt';
  if (q.includes('ai') || q.includes('artificial intelligence') || q.includes('machine learning')) return 'ai-investment';
  return 'gdp-europe';
}

const EXAMPLES = [
  'GDP growth in Europe',
  'CO₂ emissions: USA vs China vs India',
  'Top 10 countries by population',
  'Renewable energy share by country',
  'Inflation trends major economies',
  'Life expectancy vs income',
  'Global temperature anomaly',
  'Top tech companies by market cap',
  'Electric vehicle sales growth',
  'AI investment by sector',
];

// ── Typing Animation ───────────────────────────────────────────────
function TypingText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, 25);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <span>
      {displayed}
      {!done && (
        <motion.span
          className="inline-block w-[2px] h-4 bg-[var(--exd-accent-primary)] ml-0.5 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </span>
  );
}

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

      g.selectAll('.grid').data(xLin.ticks(5)).join('line')
        .attr('x1', d => xLin(d)).attr('x2', d => xLin(d))
        .attr('y1', 0).attr('y2', h)
        .attr('stroke', 'rgba(99,102,241,0.1)').attr('stroke-dasharray', '3,3');

      g.selectAll('rect').data(data).join('rect')
        .attr('x', 0).attr('y', d => yBand(String(d.x))!)
        .attr('height', yBand.bandwidth()).attr('rx', 4)
        .attr('fill', (_, i) => `hsl(${240 + i * 8}, 70%, ${55 + i * 2}%)`)
        .attr('width', 0)
        .transition().duration(600).delay((_, i) => i * 50)
        .attr('width', d => xLin(d.y));

      g.selectAll('.val').data(data).join('text')
        .attr('x', d => xLin(d.y) + 8)
        .attr('y', d => yBand(String(d.x))! + yBand.bandwidth() / 2)
        .attr('dy', '0.35em').attr('fill', '#a1a1aa').attr('font-size', '11px')
        .text(d => {
          const fmt = spec.yAxis.format;
          if (fmt === '%') return `${d.y}%`;
          if (d.y >= 1000) return `${(d.y / 1000).toFixed(1)}B`;
          return `${d.y}M`;
        });

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

      g.append('g').attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(xBand).tickSize(0))
        .selectAll('text').attr('fill', '#a1a1aa').attr('font-size', '10px')
        .attr('transform', 'rotate(-30)').attr('text-anchor', 'end');
      g.select('.domain').attr('stroke', 'rgba(255,255,255,0.1)');

      g.append('g').call(d3.axisLeft(yLin).ticks(5).tickFormat(d => {
        const fmt = spec.yAxis.format;
        if (fmt === '%') return `${d}%`;
        if (fmt === '$B') return `$${d}B`;
        if (fmt === 'T') return `$${d}T`;
        return String(d);
      }))
        .selectAll('text').attr('fill', '#a1a1aa').attr('font-size', '10px');

      return;
    }

    if (spec.type === 'scatter') {
      const xLin = d3.scaleLinear().domain([0, d3.max(allPoints, d => d.x as number)! * 1.1]).range([0, w]).nice();
      const yLin = d3.scaleLinear().domain([40, d3.max(allPoints, d => d.y)! * 1.05]).range([h, 0]).nice();

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

      g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(xLin).ticks(5).tickFormat(d => {
        const fmt = spec.xAxis.label;
        if (fmt.includes('$') || fmt.includes('GDP') || fmt.includes('Spend')) return `$${d3.format('.0s')(d as number)}`;
        return `${d}%`;
      }))
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
          .transition().duration(800).delay(i * 150).attr('fill-opacity', 0.15);
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
        if (fmt === '°C') return `${d}°C`;
        if (fmt === 'B') return `${d}B`;
        if (fmt === 'M') return `${d}M`;
        return String(d);
      }))
      .selectAll('text').attr('fill', '#a1a1aa').attr('font-size', '10px');

    svg.selectAll('.domain').attr('stroke', 'rgba(255,255,255,0.1)');
    svg.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.05)');

  }, [spec, dims]);

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} width={dims.w} height={dims.h} className="overflow-visible" />
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

// ── Conversation History Sidebar ───────────────────────────────────
function HistorySidebar({
  history,
  isOpen,
  onClose,
  onSelect,
}: {
  history: QueryResult[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (r: QueryResult) => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 top-0 bottom-0 w-60 sm:w-72 z-20 bg-[#0c0c1d]/95 backdrop-blur-xl border-r border-white/10 rounded-l-2xl overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[var(--exd-accent-primary)]" />
              <span className="text-sm font-semibold text-white">History</span>
              <span className="text-xs text-gray-500 bg-white/5 px-1.5 py-0.5 rounded-full">{history.length}</span>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {history.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-8">No queries yet</p>
            )}
            {history.map((r, i) => (
              <motion.button
                key={r.timestamp}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onSelect(r)}
                className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <p className="text-sm text-gray-300 truncate group-hover:text-white transition-colors">{r.query}</p>
                <p className="text-[10px] text-gray-600 mt-1">{r.spec.type} chart · {r.spec.source}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function AICopilot() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinkingPhase, setThinkingPhase] = useState<'connecting' | 'analyzing' | 'rendering' | null>(null);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [history, setHistory] = useState<QueryResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [chartReady, setChartReady] = useState(false);

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
    setChartReady(false);

    // Phase 1: Connecting
    setThinkingPhase('connecting');
    await new Promise(r => setTimeout(r, 600));

    // Phase 2: Analyzing
    setThinkingPhase('analyzing');
    await new Promise(r => setTimeout(r, 800 + Math.random() * 400));

    // Phase 3: Rendering
    setThinkingPhase('rendering');

    const key = findChart(text);
    const mockData = MOCK_CHARTS[key];

    // Try live data from World Bank API
    let liveResult = await fetchLiveData(key);

    await new Promise(r => setTimeout(r, 300));

    const newResult: QueryResult = {
      query: text,
      spec: liveResult ? liveResult.spec as ChartSpec : mockData.spec,
      thinking: liveResult
        ? mockData.thinking.replace('…', '… ✓ Live data loaded')
        : mockData.thinking,
      followUps: mockData.followUps,
      timestamp: Date.now(),
      isLive: !!liveResult,
    };

    setResult(newResult);
    setHistory(prev => [newResult, ...prev]);
    setLoading(false);
    setThinkingPhase(null);
  }, [query, loading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const thinkingSteps = [
    { phase: 'connecting', icon: '🔗', text: 'Connecting to data sources…' },
    { phase: 'analyzing', icon: '🧠', text: 'Analyzing query intent…' },
    { phase: 'rendering', icon: '📊', text: 'Generating visualization…' },
  ];

  return (
    <section
      ref={sectionRef}
      id="ai-copilot"
      className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent"
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

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white/90">Ask a Question. </span>
            <span className="gradient-text">Get a Chart.</span>
          </h2>
          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto">
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
              {/* History toggle */}
              {history.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="ml-2 p-2 rounded-lg hover:bg-white/5 transition-colors relative"
                  title="Query history"
                >
                  <History className="w-4 h-4 text-gray-500 hover:text-gray-300" />
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[var(--exd-accent-primary)] rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                    {history.length}
                  </span>
                </button>
              )}
              <Sparkles className={`w-5 h-5 text-[var(--exd-accent-primary)] ${history.length > 0 ? 'ml-1' : 'ml-4'} shrink-0`} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Show me GDP growth in Europe 2000-2024..."
                className="flex-1 bg-transparent px-3 sm:px-4 py-3 sm:py-4 text-white placeholder-gray-500 focus:outline-none text-base sm:text-lg"
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
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-5 px-2">
            <span className="text-gray-500 text-xs sm:text-sm">Try:</span>
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(ex)}
                className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-white/[0.03] border border-white/5 rounded-lg text-gray-400 hover:text-white hover:border-[var(--exd-accent-primary)]/30 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Result area with optional history sidebar */}
        <div className="relative max-w-3xl mx-auto">
          <HistorySidebar
            history={history}
            isOpen={showHistory}
            onClose={() => setShowHistory(false)}
            onSelect={(r) => {
              setResult(r);
              setChartReady(false);
              setShowHistory(false);
              setQuery(r.query);
            }}
          />

          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="exd-card p-8">
                  {/* Thinking steps */}
                  <div className="space-y-3 mb-6">
                    {thinkingSteps.map((step, i) => {
                      const isActive = step.phase === thinkingPhase;
                      const isDone = thinkingSteps.findIndex(s => s.phase === thinkingPhase) > i;
                      return (
                        <motion.div
                          key={step.phase}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: isDone || isActive ? 1 : 0.3, x: 0 }}
                          transition={{ delay: i * 0.15, duration: 0.3 }}
                          className="flex items-center gap-3"
                        >
                          <span className="text-base">{isDone ? '✅' : step.icon}</span>
                          <span className={`text-sm ${isActive ? 'text-white' : isDone ? 'text-gray-400' : 'text-gray-600'}`}>
                            {isActive ? <TypingText text={step.text} /> : step.text}
                          </span>
                          {isActive && (
                            <motion.div
                              className="w-3 h-3 rounded-full bg-[var(--exd-accent-primary)]"
                              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="h-[250px] rounded-lg bg-white/[0.02] animate-pulse" />
                </div>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {/* Thinking bubble with typing */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-start gap-3 mb-4"
                >
                  <div className="w-7 h-7 rounded-lg bg-[var(--exd-accent-primary)]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--exd-accent-primary)]" />
                  </div>
                  <div className="text-sm text-gray-300 bg-white/[0.03] px-4 py-2.5 rounded-2xl rounded-tl-sm border border-white/5">
                    <TypingText text={result.thinking} onComplete={() => setChartReady(true)} />
                  </div>
                </motion.div>

                {/* Chart card */}
                <AnimatePresence>
                  {chartReady && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                      <div className="exd-card exd-glow overflow-hidden">
                        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-white">{result.spec.title}</h3>
                            {result.spec.subtitle && (
                              <p className="text-sm text-[var(--exd-text-secondary)] mt-1">{result.spec.subtitle}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {result.isLive && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-full uppercase tracking-wider">
                                <Radio className="w-2.5 h-2.5" />
                                Live
                              </span>
                            )}
                            <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-full uppercase tracking-wider">
                              {result.spec.type} chart
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <MiniChart spec={result.spec} />
                        </div>
                      </div>

                      {/* Follow-up suggestions */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="mt-5"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-xs text-gray-500 uppercase tracking-wider">Suggested follow-ups</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {result.followUps.map((fu, i) => (
                            <motion.button
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + i * 0.1 }}
                              onClick={() => handleSubmit(fu)}
                              className="flex items-center gap-2 text-left px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-gray-400 hover:text-white hover:border-[var(--exd-accent-primary)]/30 hover:bg-white/[0.04] transition-all group"
                            >
                              <ChevronRight className="w-3.5 h-3.5 text-[var(--exd-accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                              <span>{fu}</span>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>

                      {/* Reset */}
                      <div className="text-center mt-6">
                        <button
                          onClick={() => { setResult(null); setQuery(''); setChartReady(false); }}
                          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Try another query
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
