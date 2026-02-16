'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface AgeGroup {
  age: string;
  male: number;
  female: number;
}

interface PopulationPyramidProps {
  data?: Record<string, Record<string, AgeGroup[]>>;
  title?: string;
  subtitle?: string;
}

const COUNTRY_INFO: Record<string, { name: string; flag: string; description: string }> = {
  USA: { name: 'United States', flag: '🇺🇸', description: 'Stable growth with aging population' },
  JPN: { name: 'Japan', flag: '🇯🇵', description: 'Super-aged society, declining population' },
  DEU: { name: 'Germany', flag: '🇩🇪', description: 'Post-war baby boom echo, low fertility' },
  IND: { name: 'India', flag: '🇮🇳', description: 'Young population, demographic dividend' },
  BRA: { name: 'Brazil', flag: '🇧🇷', description: 'Transitioning demographics' },
  NGA: { name: 'Nigeria', flag: '🇳🇬', description: 'Rapid growth, very young population' },
};

const YEARS = [1990, 2000, 2010, 2020];

export default function PopulationPyramid({
  data,
  title = "Population Pyramids",
  subtitle = "How demographics shape nations"
}: PopulationPyramidProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 550 });
  const [selectedCountry, setSelectedCountry] = useState('USA');
  const [yearIndex, setYearIndex] = useState(3); // Start at 2020
  const [isPlaying, setIsPlaying] = useState(false);
  const [pyramidData, setPyramidData] = useState<Record<string, Record<string, AgeGroup[]>>>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load data
  useEffect(() => {
    if (data) {
      setPyramidData(data);
    } else {
      fetch('/exd-landing/data/population-pyramid.json')
        .then(res => res.json())
        .then(setPyramidData)
        .catch(console.error);
    }
  }, [data]);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setDimensions({ width, height: Math.min(550, width * 0.6) });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const currentYear = YEARS[yearIndex];
  const currentData = pyramidData[selectedCountry]?.[currentYear.toString()] || [];

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setYearIndex(prev => {
          if (prev >= YEARS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  // Draw pyramid
  useEffect(() => {
    if (!svgRef.current || currentData.length === 0) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;
    const isSmall = width < 500;
    const margin = isSmall
      ? { top: 20, right: 10, bottom: 30, left: 10 }
      : { top: 30, right: 20, bottom: 40, left: 20 };
    const centerGap = isSmall ? 30 : 60;
    const chartWidth = (width - margin.left - margin.right - centerGap) / 2; // Half for each side
    const chartHeight = height - margin.top - margin.bottom;

    // Clear previous
    svg.selectAll('*').remove();

    // Max value for scale
    const maxValue = Math.max(
      ...currentData.map(d => Math.max(d.male, d.female))
    );

    // Scales
    const xScaleLeft = d3.scaleLinear()
      .domain([0, maxValue * 1.1])
      .range([chartWidth, 0]);

    const xScaleRight = d3.scaleLinear()
      .domain([0, maxValue * 1.1])
      .range([0, chartWidth]);

    const yScale = d3.scaleBand()
      .domain(currentData.map(d => d.age))
      .range([chartHeight, 0])
      .padding(0.15);

    // Chart group
    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Center axis
    const centerX = chartWidth + 30;

    // Male bars (left side)
    const maleGroup = chart.append('g')
      .attr('class', 'male-bars');

    maleGroup.selectAll('rect')
      .data(currentData)
      .join('rect')
      .attr('x', d => xScaleLeft(d.male))
      .attr('y', d => yScale(d.age)!)
      .attr('width', d => chartWidth - xScaleLeft(d.male))
      .attr('height', yScale.bandwidth())
      .attr('fill', '#6366f1')
      .attr('rx', 3)
      .style('transition', 'all 0.5s ease-out');

    // Female bars (right side)
    const femaleGroup = chart.append('g')
      .attr('class', 'female-bars')
      .attr('transform', `translate(${centerX + 30}, 0)`);

    femaleGroup.selectAll('rect')
      .data(currentData)
      .join('rect')
      .attr('x', 0)
      .attr('y', d => yScale(d.age)!)
      .attr('width', d => xScaleRight(d.female))
      .attr('height', yScale.bandwidth())
      .attr('fill', '#ec4899')
      .attr('rx', 3)
      .style('transition', 'all 0.5s ease-out');

    // Age labels (center)
    chart.append('g')
      .attr('class', 'age-labels')
      .selectAll('text')
      .data(currentData)
      .join('text')
      .attr('x', centerX + 15)
      .attr('y', d => yScale(d.age)! + yScale.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'var(--exd-text-secondary)')
      .attr('font-size', '11px')
      .text(d => d.age);

    // X Axis (left)
    const xAxisLeft = d3.axisBottom(xScaleLeft)
      .ticks(5)
      .tickFormat(d => `${d}M`);

    chart.append('g')
      .attr('class', 'chart-axis')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(xAxisLeft)
      .selectAll('text')
      .style('fill', 'var(--exd-text-secondary)');

    // X Axis (right)
    const xAxisRight = d3.axisBottom(xScaleRight)
      .ticks(5)
      .tickFormat(d => `${d}M`);

    chart.append('g')
      .attr('class', 'chart-axis')
      .attr('transform', `translate(${centerX + 30}, ${chartHeight})`)
      .call(xAxisRight)
      .selectAll('text')
      .style('fill', 'var(--exd-text-secondary)');

    // Gender labels
    chart.append('text')
      .attr('x', chartWidth / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#6366f1')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('♂ Male');

    chart.append('text')
      .attr('x', centerX + 30 + chartWidth / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ec4899')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('Female ♀');

  }, [currentData, dimensions]);

  const handlePlayPause = useCallback(() => {
    if (yearIndex >= YEARS.length - 1) {
      setYearIndex(0);
    }
    setIsPlaying(prev => !prev);
  }, [yearIndex]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setYearIndex(0);
  }, []);

  const countryInfo = COUNTRY_INFO[selectedCountry];

  if (Object.keys(pyramidData).length === 0) {
    return (
      <div className="exd-card p-8 flex items-center justify-center min-h-[550px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--exd-accent-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--exd-text-secondary)]">Loading demographic data...</p>
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

      {/* Country selector */}
      <div className="px-4 sm:px-6 pt-4">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {Object.entries(COUNTRY_INFO).map(([code, info]) => (
            <button
              key={code}
              onClick={() => {
                setSelectedCountry(code);
                setIsPlaying(false);
              }}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all ${
                selectedCountry === code
                  ? 'bg-[var(--exd-accent-primary)] text-white shadow-lg shadow-[var(--exd-accent-primary)]/30'
                  : 'bg-[var(--exd-bg-tertiary)] hover:bg-[var(--exd-bg-tertiary)]/80 text-[var(--exd-text-secondary)]'
              }`}
            >
              <span className="text-base sm:text-xl">{info.flag}</span>
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">{info.name}</span>
              <span className="text-xs font-medium sm:hidden">{code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Country info & Year */}
      <div className="px-4 sm:px-6 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <motion.div 
            key={selectedCountry}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <span className="text-3xl sm:text-4xl">{countryInfo.flag}</span>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">{countryInfo.name}</h3>
              <p className="text-xs sm:text-sm text-[var(--exd-text-muted)]">{countryInfo.description}</p>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          key={currentYear}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl sm:text-6xl font-bold exd-gradient-text"
        >
          {currentYear}
        </motion.div>
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

      {/* Year steps */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-center gap-4">
          {YEARS.map((y, i) => (
            <button
              key={y}
              onClick={() => {
                setYearIndex(i);
                setIsPlaying(false);
              }}
              className={`relative px-4 py-2 rounded-lg transition-all ${
                yearIndex === i
                  ? 'bg-[var(--exd-accent-primary)] text-white shadow-lg shadow-[var(--exd-accent-primary)]/30'
                  : 'bg-[var(--exd-bg-tertiary)] text-[var(--exd-text-secondary)] hover:text-white'
              }`}
            >
              {y}
              {i < YEARS.length - 1 && (
                <div className="absolute right-[-1rem] top-1/2 -translate-y-1/2 w-4 h-0.5 bg-[var(--exd-bg-tertiary)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 pt-2 border-t border-white/5">
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
        <p className="text-center text-xs text-[var(--exd-text-muted)] mt-3">
          Watch 30 years of demographic change unfold
        </p>
      </div>
    </div>
  );
}
