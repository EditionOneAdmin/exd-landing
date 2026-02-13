'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Search, X, SlidersHorizontal, ArrowUpRight, Globe2, Calendar, Tag,
  TrendingUp, Clock, BarChart3, ChevronDown,
} from 'lucide-react';
import * as d3 from 'd3';
import { DATASETS, CATEGORIES, SORT_OPTIONS, sortDatasets, type Dataset, type Category, type SortKey } from '@/lib/datasets';

/* ─── Sparkline (D3) ─── */
function Sparkline({ data, width = 120, height = 40, color = '#818cf8' }: { data: number[]; width?: number; height?: number; color?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    const x = d3.scaleLinear().domain([0, data.length - 1]).range([4, width - 4]);
    const y = d3.scaleLinear().domain([d3.min(data)! * 0.9, d3.max(data)! * 1.1]).range([height - 4, 4]);
    const line = d3.line<number>().x((_, i) => x(i)).y(d => y(d)).curve(d3.curveMonotoneX);
    const area = d3.area<number>().x((_, i) => x(i)).y0(height).y1(d => y(d)).curve(d3.curveMonotoneX);
    svg.append('path').datum(data).attr('d', area).attr('fill', `${color}15`);
    svg.append('path').datum(data).attr('d', line).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2);
    svg.append('circle').attr('cx', x(data.length - 1)).attr('cy', y(data[data.length - 1])).attr('r', 3).attr('fill', color);
  }, [data, width, height, color]);
  return <svg ref={ref} width={width} height={height} />;
}

/* ─── Preview Panel ─── */
function PreviewPanel({ dataset, onClose }: { dataset: Dataset; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] z-50 bg-[#0a0a10]/95 backdrop-blur-2xl border-l border-white/10 overflow-y-auto"
    >
      <div className="p-6 space-y-6">
        {/* header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider">{dataset.source}</span>
            <h2 className="text-xl font-bold text-white mt-1">{dataset.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* sparkline big */}
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-5">
          <Sparkline data={dataset.sparklineData} width={360} height={120} color="#818cf8" />
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-white/40">{dataset.timeRange.split('–')[0]}</span>
            <span className="text-indigo-400 font-semibold">{dataset.latestValue}</span>
            <span className="text-white/40">{dataset.timeRange.split('–')[1]}</span>
          </div>
        </div>

        {/* description */}
        <p className="text-white/60 text-sm leading-relaxed">{dataset.description}</p>

        {/* stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Countries', value: dataset.countries.toString(), icon: Globe2 },
            { label: 'Time Span', value: dataset.timeRange, icon: Calendar },
            { label: 'Coverage', value: `${dataset.coverage}%`, icon: BarChart3 },
            { label: 'Updated', value: dataset.updatedAt, icon: Clock },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.03] rounded-xl border border-white/5 p-3">
              <s.icon className="w-4 h-4 text-white/30 mb-1" />
              <p className="text-white font-semibold text-sm">{s.value}</p>
              <p className="text-white/40 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* tags */}
        <div className="flex flex-wrap gap-2">
          {dataset.tags.map(tag => (
            <span key={tag} className="px-3 py-1 text-xs rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2">
          Open in Copilot
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Dataset Card ─── */
function DatasetCard({ dataset, onClick, index }: { dataset: Dataset; onClick: () => void; index: number }) {
  const categoryColors: Record<string, string> = {
    Economy: '#818cf8', Health: '#34d399', Environment: '#22d3ee', Demographics: '#f472b6',
    Energy: '#fbbf24', Education: '#a78bfa', Finance: '#f87171', Technology: '#38bdf8',
  };
  const color = categoryColors[dataset.category] || '#818cf8';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      onClick={onClick}
      className="group cursor-pointer bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.06] hover:border-white/15 p-5 transition-all duration-300 hover:bg-white/[0.06]"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>{dataset.source}</span>
        <Sparkline data={dataset.sparklineData} width={64} height={24} color={color} />
      </div>
      <h3 className="text-white font-semibold text-sm leading-snug mb-2 group-hover:text-indigo-300 transition-colors">{dataset.title}</h3>
      <div className="flex items-center gap-3 text-[11px] text-white/40 mb-3">
        <span className="flex items-center gap-1"><Globe2 className="w-3 h-3" />{dataset.countries}</span>
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{dataset.timeRange}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {dataset.tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 text-white/50">{tag}</span>
          ))}
        </div>
        <span className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          Explore <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Search suggestions ─── */
const SUGGESTIONS = [
  'GDP per capita trends', 'Climate change data', 'Population projections',
  'Healthcare spending', 'Renewable energy growth', 'AI adoption rates',
];

/* ─── Main Page ─── */
export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [sortKey, setSortKey] = useState<SortKey>('popularity');
  const [showSort, setShowSort] = useState(false);
  const [preview, setPreview] = useState<Dataset | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    let results = DATASETS;
    if (activeCategory !== 'All') results = results.filter(d => d.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.source.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q)) ||
        d.description.toLowerCase().includes(q)
      );
    }
    return sortDatasets(results, sortKey);
  }, [search, activeCategory, sortKey]);

  const activeSuggestions = useMemo(
    () => search.trim() ? SUGGESTIONS.filter(s => s.toLowerCase().includes(search.toLowerCase())).slice(0, 4) : SUGGESTIONS.slice(0, 4),
    [search]
  );

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* Hero / Search */}
      <section className="relative pt-20 pb-10 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.04] via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent"
          >
            Explore the World&apos;s Data
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-lg mb-8"
          >
            Discover, preview, and visualize 500+ curated global datasets
          </motion.p>

          {/* Search bar */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search 500+ global datasets..."
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all text-base"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10">
                  <X className="w-4 h-4 text-white/40" />
                </button>
              )}
            </div>
            <AnimatePresence>
              {showSuggestions && activeSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full mt-2 w-full bg-[#0f0f18]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-40"
                >
                  {activeSuggestions.map((s) => (
                    <button
                      key={s}
                      onMouseDown={() => { setSearch(s); setShowSuggestions(false); }}
                      className="w-full px-4 py-3 text-left text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />{s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Filters + Sort */}
      <section className="px-6 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Category chips */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:border-white/15 hover:text-white/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white/60 hover:text-white/80 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {SORT_OPTIONS.find(o => o.key === sortKey)?.label}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {showSort && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 top-full mt-2 bg-[#0f0f18]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-40 w-48"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => { setSortKey(opt.key); setShowSort(false); }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                          sortKey === opt.key ? 'text-indigo-300 bg-indigo-500/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Results count */}
          <p className="mt-4 text-sm text-white/30">
            {filtered.length} dataset{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </section>

      {/* Dataset Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/30">No datasets match your search.</p>
              </motion.div>
            ) : (
              <motion.div
                key={`${activeCategory}-${sortKey}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filtered.map((d, i) => (
                  <DatasetCard key={d.id} dataset={d} index={i} onClick={() => setPreview(d)} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Preview Panel */}
      <AnimatePresence>
        {preview && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreview(null)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <PreviewPanel dataset={preview} onClose={() => setPreview(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
