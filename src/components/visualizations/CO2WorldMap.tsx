'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Maximize2, Info } from 'lucide-react';

interface CO2Data {
  co2: number;
  co2_per_capita: number;
}

interface CO2WorldMapProps {
  geoData?: GeoJSON.FeatureCollection;
  co2Data?: Record<string, Record<string, CO2Data>>;
  title?: string;
  subtitle?: string;
}

// ISO3 to ISO2 mapping for GeoJSON matching
const ISO3_TO_ISO2: Record<string, string> = {
  'AFG': 'AF', 'ALB': 'AL', 'DZA': 'DZ', 'AGO': 'AO', 'ARG': 'AR',
  'AUS': 'AU', 'AUT': 'AT', 'BGD': 'BD', 'BEL': 'BE', 'BRA': 'BR',
  'CAN': 'CA', 'CHN': 'CN', 'COL': 'CO', 'DEU': 'DE', 'EGY': 'EG',
  'ESP': 'ES', 'FRA': 'FR', 'GBR': 'GB', 'IND': 'IN', 'IDN': 'ID',
  'IRN': 'IR', 'IRQ': 'IQ', 'ITA': 'IT', 'JPN': 'JP', 'KOR': 'KR',
  'MEX': 'MX', 'NGA': 'NG', 'NLD': 'NL', 'NOR': 'NO', 'PAK': 'PK',
  'PHL': 'PH', 'POL': 'PL', 'RUS': 'RU', 'SAU': 'SA', 'ZAF': 'ZA',
  'SWE': 'SE', 'CHE': 'CH', 'THA': 'TH', 'TUR': 'TR', 'UKR': 'UA',
  'USA': 'US', 'VEN': 'VE', 'VNM': 'VN',
};

// Country name to ISO3 mapping
const NAME_TO_ISO3: Record<string, string> = {
  'United States of America': 'USA', 'United States': 'USA',
  'China': 'CHN', 'Russia': 'RUS', 'Russian Federation': 'RUS',
  'United Kingdom': 'GBR', 'Germany': 'DEU', 'France': 'FRA',
  'Japan': 'JPN', 'India': 'IND', 'Brazil': 'BRA', 'Canada': 'CAN',
  'Australia': 'AUS', 'Italy': 'ITA', 'Spain': 'ESP', 'Mexico': 'MEX',
  'Indonesia': 'IDN', 'Netherlands': 'NLD', 'Saudi Arabia': 'SAU',
  'Turkey': 'TUR', 'Switzerland': 'CHE', 'Poland': 'POL',
  'Sweden': 'SWE', 'Norway': 'NOR', 'South Africa': 'ZAF',
  'Nigeria': 'NGA', 'Egypt': 'EGY', 'Argentina': 'ARG',
  'South Korea': 'KOR', 'Korea': 'KOR', 'Iran': 'IRN',
  'Iraq': 'IRQ', 'Pakistan': 'PAK', 'Bangladesh': 'BGD',
  'Vietnam': 'VNM', 'Thailand': 'THA', 'Philippines': 'PHL',
  'Colombia': 'COL', 'Venezuela': 'VEN', 'Ukraine': 'UKR',
  'Belgium': 'BEL', 'Austria': 'AUT', 'Algeria': 'DZA',
  'Angola': 'AGO', 'Afghanistan': 'AFG', 'Albania': 'ALB',
};

export default function CO2WorldMap({
  geoData,
  co2Data,
  title = "Global CO₂ Emissions",
  subtitle = "Annual carbon dioxide emissions by country (million tonnes)"
}: CO2WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 500 });
  const [year, setYear] = useState(2020);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<{ name: string; co2: number; co2_per_capita: number } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [mapData, setMapData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [emissionsData, setEmissionsData] = useState<Record<string, Record<string, CO2Data>>>({});
  const [metric, setMetric] = useState<'total' | 'per_capita'>('total');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const years = useMemo(() => {
    if (!emissionsData || Object.keys(emissionsData).length === 0) return [];
    return Object.keys(emissionsData).map(Number).sort((a, b) => a - b);
  }, [emissionsData]);

  // Load data
  useEffect(() => {
    if (geoData && co2Data) {
      setMapData(geoData);
      setEmissionsData(co2Data);
    } else {
      Promise.all([
        fetch('/exd-landing/data/world.geojson').then(res => res.json()),
        fetch('/exd-landing/data/co2-emissions.json').then(res => res.json())
      ])
        .then(([geo, co2]) => {
          setMapData(geo);
          setEmissionsData(co2);
        })
        .catch(console.error);
    }
  }, [geoData, co2Data]);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setDimensions({ width, height: width * 0.55 });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Color scale
  const colorScale = useMemo(() => {
    const yearData = emissionsData[year.toString()] || {};
    const values = Object.values(yearData).map(d => metric === 'total' ? d.co2 : d.co2_per_capita);
    const maxValue = d3.max(values) || 1000;
    
    return d3.scaleSequential()
      .domain([0, metric === 'total' ? Math.min(maxValue, 12000) : Math.min(maxValue, 25)])
      .interpolator(d3.interpolateRgbBasis([
        '#0a0a0f',  // Near black
        '#1e1b4b',  // Deep purple
        '#4c1d95',  // Purple
        '#7c3aed',  // Violet
        '#c026d3',  // Fuchsia
        '#f43f5e',  // Rose
        '#fb923c',  // Orange
        '#fbbf24',  // Amber
      ]));
  }, [emissionsData, year, metric]);

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
      }, 200);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, years]);

  // Draw map
  useEffect(() => {
    if (!svgRef.current || !mapData) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;
    const yearData = emissionsData[year.toString()] || {};

    // Clear previous
    svg.selectAll('*').remove();

    // Projection
    const projection = d3.geoNaturalEarth1()
      .fitSize([width - 40, height - 40], mapData)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Draw countries
    const countriesGroup = svg.append('g')
      .attr('class', 'countries');

    countriesGroup.selectAll('path')
      .data(mapData.features)
      .join('path')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        const name = d.properties?.name || '';
        const iso3 = NAME_TO_ISO3[name] || d.properties?.iso_a3 || d.properties?.ISO_A3 || '';
        const countryData = yearData[iso3];
        
        if (countryData) {
          const value = metric === 'total' ? countryData.co2 : countryData.co2_per_capita;
          return colorScale(value);
        }
        return '#1a1a24';
      })
      .attr('stroke', 'rgba(99, 102, 241, 0.2)')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .style('transition', 'opacity 0.2s')
      .on('mouseenter', function(event: any, d: any) {
        d3.select(this).attr('stroke', '#6366f1').attr('stroke-width', 2);
        
        const name = d.properties?.name || '';
        const iso3 = NAME_TO_ISO3[name] || d.properties?.iso_a3 || '';
        const countryData = yearData[iso3];
        
        if (countryData) {
          setHoveredCountry({ 
            name, 
            co2: countryData.co2, 
            co2_per_capita: countryData.co2_per_capita 
          });
          setTooltipPos({ x: event.clientX, y: event.clientY });
        }
      })
      .on('mousemove', (event: any) => {
        setTooltipPos({ x: event.clientX, y: event.clientY });
      })
      .on('mouseleave', function() {
        d3.select(this).attr('stroke', 'rgba(99, 102, 241, 0.2)').attr('stroke-width', 0.5);
        setHoveredCountry(null);
      });

  }, [mapData, emissionsData, year, dimensions, colorScale, metric]);

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

  if (!mapData || Object.keys(emissionsData).length === 0) {
    return (
      <div className="exd-card p-8 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--exd-accent-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--exd-text-secondary)]">Loading emissions data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exd-card exd-glow overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-white/5 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold exd-gradient-text">{title}</h2>
          <p className="text-[var(--exd-text-secondary)] mt-1">{subtitle}</p>
        </div>
        
        {/* Metric toggle */}
        <div className="flex gap-1 bg-[var(--exd-bg-tertiary)] rounded-lg p-1">
          <button
            onClick={() => setMetric('total')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              metric === 'total' 
                ? 'bg-[var(--exd-accent-primary)] text-white' 
                : 'text-[var(--exd-text-secondary)] hover:text-white'
            }`}
          >
            Total CO₂
          </button>
          <button
            onClick={() => setMetric('per_capita')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              metric === 'per_capita' 
                ? 'bg-[var(--exd-accent-primary)] text-white' 
                : 'text-[var(--exd-text-secondary)] hover:text-white'
            }`}
          >
            Per Capita
          </button>
        </div>
      </div>

      {/* Year Display */}
      <div className="px-6 pt-4">
        <motion.div 
          key={year}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold text-center exd-gradient-text"
        >
          {year}
        </motion.div>
      </div>

      {/* Map */}
      <div className="p-6 pb-2" ref={containerRef}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="overflow-visible"
        />
      </div>

      {/* Legend */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-[var(--exd-text-muted)]">Low</span>
          <div 
            className="w-48 h-3 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #0a0a0f, #1e1b4b, #4c1d95, #7c3aed, #c026d3, #f43f5e, #fb923c, #fbbf24)'
            }}
          />
          <span className="text-xs text-[var(--exd-text-muted)]">High</span>
        </div>
        <p className="text-xs text-center text-[var(--exd-text-muted)] mt-2">
          {metric === 'total' ? 'Million tonnes CO₂' : 'Tonnes CO₂ per person'}
        </p>
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
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
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
      {hoveredCountry && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="chart-tooltip"
          style={{
            left: tooltipPos.x + 15,
            top: tooltipPos.y - 10,
          }}
        >
          <div className="font-bold text-white">{hoveredCountry.name}</div>
          <div className="text-[var(--exd-text-secondary)] text-sm mt-1">
            <div>Total: {hoveredCountry.co2.toLocaleString()} Mt CO₂</div>
            <div>Per capita: {hoveredCountry.co2_per_capita.toFixed(2)} t</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
