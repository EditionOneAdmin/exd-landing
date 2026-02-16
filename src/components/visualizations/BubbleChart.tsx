'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface DataPoint {
  code: string;
  name: string;
  life: number;
  gdp: number;
  pop: number;
  region: string;
}

interface BubbleChartProps {
  data?: Record<string, DataPoint[]>;
  title?: string;
  subtitle?: string;
}

const REGION_COLORS: Record<string, string> = {
  'Americas': '#6366f1',
  'Europe': '#22c55e',
  'Asia': '#f43f5e',
  'Africa': '#f97316',
  'Oceania': '#8b5cf6',
  'Other': '#64748b',
};

export default function BubbleChart({
  data,
  title = "Life Expectancy vs Income",
  subtitle = "The Hans Rosling legacy: watching the world get better"
}: BubbleChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });
  const [year, setYear] = useState(2000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chartData, setChartData] = useState<Record<string, DataPoint[]>>({});
  const [hoveredBubble, setHoveredBubble] = useState<DataPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [highlightedRegion, setHighlightedRegion] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const years = useMemo(() => {
    if (!chartData || Object.keys(chartData).length === 0) return [];
    return Object.keys(chartData).map(Number).sort((a, b) => a - b);
  }, [chartData]);

  // Load data
  useEffect(() => {
    if (data) {
      setChartData(data);
    } else {
      fetch('/exd-landing/data/life-expectancy.json')
        .then(res => res.json())
        .then(setChartData)
        .catch(console.error);
    }
  }, [data]);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setDimensions({ width, height: Math.min(600, width * 0.65) });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Scales
  const scales = useMemo(() => {
    const isSmall = dimensions.width < 500;
    const margin = isSmall
      ? { top: 24, right: 16, bottom: 40, left: 45 }
      : { top: 40, right: 40, bottom: 60, left: 70 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // GDP scale (log)
    const xScale = d3.scaleLog()
      .domain([200, 150000])
      .range([0, width])
      .nice();

    // Life expectancy scale
    const yScale = d3.scaleLinear()
      .domain([25, 90])
      .range([height, 0]);

    // Population to radius
    const radiusScale = d3.scaleSqrt()
      .domain([0, 1.5e9])
      .range(isSmall ? [2, 30] : [3, 60]);

    return { xScale, yScale, radiusScale, margin, width, height };
  }, [dimensions]);

  // Animation loop
  useEffect(() => {
    if (isPlaying && years.length > 0) {
      intervalRef.current = setInterval(() => {
        setYear(prev => {
          const currentIdx = years.indexOf(prev);
          if (currentIdx >= years.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return years[currentIdx + 1];
        });
      }, 300);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, years]);

  // Draw chart
  useEffect(() => {
    if (!svgRef.current || !chartData[year.toString()]) return;

    const svg = d3.select(svgRef.current);
    const { xScale, yScale, radiusScale, margin, width, height } = scales;
    const yearData = chartData[year.toString()] || [];

    // Clear previous
    svg.selectAll('*').remove();

    // Chart area
    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Grid lines
    const gridGroup = chart.append('g').attr('class', 'chart-grid');

    // Horizontal grid
    gridGroup.selectAll('.h-grid')
      .data(yScale.ticks(8))
      .join('line')
      .attr('class', 'h-grid')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', 'rgba(99, 102, 241, 0.1)')
      .attr('stroke-dasharray', '4,4');

    // Vertical grid
    gridGroup.selectAll('.v-grid')
      .data([500, 1000, 2000, 5000, 10000, 20000, 50000, 100000])
      .join('line')
      .attr('class', 'v-grid')
      .attr('x1', d => xScale(d))
      .attr('x2', d => xScale(d))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', 'rgba(99, 102, 241, 0.1)')
      .attr('stroke-dasharray', '4,4');

    // X Axis
    const xAxis = d3.axisBottom(xScale)
      .tickValues([500, 1000, 2000, 5000, 10000, 20000, 50000, 100000])
      .tickFormat(d => `$${d3.format('.0s')(d as number)}`);

    chart.append('g')
      .attr('class', 'chart-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('fill', 'var(--exd-text-secondary)');

    // X Axis label
    chart.append('text')
      .attr('x', width / 2)
      .attr('y', height + 45)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--exd-text-muted)')
      .attr('font-size', '12px')
      .text('GDP per capita (PPP, log scale)');

    // Y Axis
    const yAxis = d3.axisLeft(yScale)
      .ticks(8);

    chart.append('g')
      .attr('class', 'chart-axis')
      .call(yAxis)
      .selectAll('text')
      .style('fill', 'var(--exd-text-secondary)');

    // Y Axis label
    chart.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -50)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--exd-text-muted)')
      .attr('font-size', '12px')
      .text('Life expectancy (years)');

    // Bubbles
    const bubblesGroup = chart.append('g').attr('class', 'bubbles');

    bubblesGroup.selectAll('circle')
      .data(yearData.sort((a, b) => b.pop - a.pop))
      .join('circle')
      .attr('cx', d => xScale(Math.max(200, d.gdp)))
      .attr('cy', d => yScale(d.life))
      .attr('r', d => radiusScale(d.pop))
      .attr('fill', d => REGION_COLORS[d.region] || '#64748b')
      .attr('fill-opacity', d => {
        if (highlightedRegion && d.region !== highlightedRegion) return 0.15;
        return 0.7;
      })
      .attr('stroke', d => REGION_COLORS[d.region] || '#64748b')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', d => {
        if (highlightedRegion && d.region !== highlightedRegion) return 0.2;
        return 1;
      })
      .style('cursor', 'pointer')
      .style('transition', 'fill-opacity 0.3s, stroke-opacity 0.3s')
      .on('mouseenter', function(event: any, d: DataPoint) {
        d3.select(this)
          .attr('fill-opacity', 1)
          .attr('stroke-width', 3);
        setHoveredBubble(d);
        setTooltipPos({ x: event.clientX, y: event.clientY });
      })
      .on('mousemove', (event: any) => {
        setTooltipPos({ x: event.clientX, y: event.clientY });
      })
      .on('mouseleave', function(event: any, d: DataPoint) {
        d3.select(this)
          .attr('fill-opacity', highlightedRegion && d.region !== highlightedRegion ? 0.15 : 0.7)
          .attr('stroke-width', 1.5);
        setHoveredBubble(null);
      });

    // Country labels for large bubbles
    bubblesGroup.selectAll('text')
      .data(yearData.filter(d => d.pop > 200000000))
      .join('text')
      .attr('x', d => xScale(Math.max(200, d.gdp)))
      .attr('y', d => yScale(d.life))
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .attr('pointer-events', 'none')
      .text(d => d.code);

  }, [chartData, year, scales, highlightedRegion]);

  const handlePlayPause = useCallback(() => {
    if (year === years[years.length - 1]) {
      setYear(years[0]);
    }
    setIsPlaying(prev => !prev);
  }, [year, years]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setYear(years[0] || 1990);
  }, [years]);

  if (Object.keys(chartData).length === 0) {
    return (
      <div className="exd-card p-8 flex items-center justify-center min-h-[300px] sm:min-h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--exd-accent-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--exd-text-secondary)]">Loading global health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exd-card exd-glow overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-white/5">
        <h2 className="text-2xl font-bold exd-gradient-text">{title}</h2>
        <p className="text-[var(--exd-text-secondary)] mt-1">{subtitle}</p>
      </div>

      {/* Year Display */}
      <div className="px-4 sm:px-6 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <motion.div 
          key={year}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl sm:text-6xl font-bold exd-gradient-text"
        >
          {year}
        </motion.div>

        {/* Region Legend */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {Object.entries(REGION_COLORS).filter(([k]) => k !== 'Other').map(([region, color]) => (
            <button
              key={region}
              onClick={() => setHighlightedRegion(prev => prev === region ? null : region)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                highlightedRegion === region 
                  ? 'bg-white/10 ring-2 ring-white/30' 
                  : 'hover:bg-white/5'
              }`}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-[var(--exd-text-secondary)]">{region}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 pb-2" ref={containerRef}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="overflow-visible"
        />
      </div>

      {/* Size Legend */}
      <div className="px-4 sm:px-6 pb-4 flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
        <span className="text-xs text-[var(--exd-text-muted)]">Population:</span>
        {[10, 100, 500, 1000].map(pop => (
          <div key={pop} className="flex items-center gap-2">
            <div 
              className="rounded-full border border-white/30"
              style={{ 
                width: Math.sqrt(pop / 1000) * 20 + 'px',
                height: Math.sqrt(pop / 1000) * 20 + 'px',
              }}
            />
            <span className="text-xs text-[var(--exd-text-muted)]">{pop}M</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="p-6 pt-2 border-t border-white/5">
        {/* Timeline slider */}
        <div className="mb-4">
          <input
            type="range"
            min={years[0] || 1990}
            max={years[years.length - 1] || 2022}
            value={year}
            onChange={(e) => {
              setIsPlaying(false);
              setYear(parseInt(e.target.value));
            }}
            className="w-full h-2 bg-[var(--exd-bg-tertiary)] rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--exd-accent-primary)]
              [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between mt-2 text-xs text-[var(--exd-text-muted)]">
            <span>{years[0]}</span>
            <span>{years[years.length - 1]}</span>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleReset}
            className="p-3 rounded-full bg-[var(--exd-bg-tertiary)] hover:bg-[var(--exd-accent-primary)]/20 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={handlePlayPause}
            className="p-4 rounded-full bg-[var(--exd-accent-primary)] hover:bg-[var(--exd-accent-secondary)] transition-colors shadow-lg shadow-[var(--exd-accent-primary)]/30"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="chart-tooltip"
          style={{
            left: tooltipPos.x + 15,
            top: tooltipPos.y - 10,
          }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: REGION_COLORS[hoveredBubble.region] }}
            />
            <span className="font-bold text-white">{hoveredBubble.name}</span>
          </div>
          <div className="text-[var(--exd-text-secondary)] text-sm mt-2 space-y-1">
            <div>Life expectancy: <span className="text-white font-medium">{hoveredBubble.life.toFixed(1)} years</span></div>
            <div>GDP per capita: <span className="text-white font-medium">${hoveredBubble.gdp.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
            <div>Population: <span className="text-white font-medium">{(hoveredBubble.pop / 1e6).toFixed(1)}M</span></div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
