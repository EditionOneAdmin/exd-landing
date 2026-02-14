'use client';
import StoryNavigation from '@/components/StoryNavigation';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// ─── Berlin Bezirke Data ─────────────────────────────────────────────

const BEZIRKE = [
  { name: 'Mitte',                pop: 384172, area: 39.47, rent: 14.50, startups: 312, footfall: 95 },
  { name: 'Friedrichshain-Kreuzberg', pop: 289762, area: 20.16, rent: 13.80, startups: 287, footfall: 88 },
  { name: 'Pankow',              pop: 410716, area: 103.01, rent: 12.20, startups: 145, footfall: 62 },
  { name: 'Charlottenburg-Wilmersdorf', pop: 342529, area: 64.72, rent: 13.90, startups: 198, footfall: 78 },
  { name: 'Spandau',             pop: 245527, area: 91.91, rent: 9.80,  startups: 42,  footfall: 38 },
  { name: 'Steglitz-Zehlendorf', pop: 310071, area: 102.50, rent: 11.60, startups: 67,  footfall: 45 },
  { name: 'Tempelhof-Schöneberg', pop: 351644, area: 53.09, rent: 12.40, startups: 156, footfall: 72 },
  { name: 'Neukölln',            pop: 329917, area: 44.93, rent: 11.90, startups: 134, footfall: 70 },
  { name: 'Treptow-Köpenick',    pop: 275382, area: 168.42, rent: 10.50, startups: 89,  footfall: 42 },
  { name: 'Marzahn-Hellersdorf', pop: 269967, area: 61.74, rent: 8.90,  startups: 28,  footfall: 30 },
  { name: 'Lichtenberg',         pop: 296838, area: 52.29, rent: 10.20, startups: 56,  footfall: 40 },
  { name: 'Reinickendorf',       pop: 265225, area: 89.46, rent: 9.90,  startups: 38,  footfall: 35 },
];

// Mobility flows between bezirke (schematic, top corridors)
const FLOWS = [
  { from: 'Friedrichshain-Kreuzberg', to: 'Mitte', volume: 48000 },
  { from: 'Pankow', to: 'Mitte', volume: 42000 },
  { from: 'Charlottenburg-Wilmersdorf', to: 'Mitte', volume: 38000 },
  { from: 'Neukölln', to: 'Friedrichshain-Kreuzberg', volume: 32000 },
  { from: 'Tempelhof-Schöneberg', to: 'Mitte', volume: 29000 },
  { from: 'Lichtenberg', to: 'Mitte', volume: 24000 },
  { from: 'Steglitz-Zehlendorf', to: 'Charlottenburg-Wilmersdorf', volume: 22000 },
  { from: 'Spandau', to: 'Charlottenburg-Wilmersdorf', volume: 19000 },
  { from: 'Treptow-Köpenick', to: 'Friedrichshain-Kreuzberg', volume: 18000 },
  { from: 'Marzahn-Hellersdorf', to: 'Lichtenberg', volume: 16000 },
  { from: 'Reinickendorf', to: 'Mitte', volume: 15000 },
  { from: 'Pankow', to: 'Friedrichshain-Kreuzberg', volume: 14000 },
];

// ─── Helpers ─────────────────────────────────────────────────────────

function FadeInText({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ChapterHeading({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <FadeInText className="text-center py-32 md:py-48">
      <div className="text-sm font-mono tracking-[0.3em] uppercase text-indigo-400 mb-4">{number}</div>
      <h2 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">{title}</h2>
      <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
    </FadeInText>
  );
}

function StatCard({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <FadeInText delay={delay} className="glass-card rounded-2xl p-8 text-center">
      <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{value}</div>
      <div className="text-zinc-400 text-sm">{label}</div>
    </FadeInText>
  );
}

// ─── Chart 1: Bezirke Dashboard (Bar Chart) ─────────────────────────

type MetricKey = 'pop' | 'rent' | 'startups' | 'footfall';

function BezirkeDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });
  const [metric, setMetric] = useState<MetricKey>('pop');

  const metrics: { key: MetricKey; label: string; format: (v: number) => string; color: string }[] = [
    { key: 'pop', label: 'Bevölkerung', format: (v) => `${(v / 1000).toFixed(0)}k`, color: '#818cf8' },
    { key: 'rent', label: 'Ø Miete €/m²', format: (v) => `€${v.toFixed(1)}`, color: '#22d3ee' },
    { key: 'startups', label: 'Startups', format: (v) => `${v}`, color: '#a78bfa' },
    { key: 'footfall', label: 'Footfall Index', format: (v) => `${v}`, color: '#f472b6' },
  ];

  const active = metrics.find((m) => m.key === metric)!;
  const sorted = [...BEZIRKE].sort((a, b) => (b[metric] as number) - (a[metric] as number));
  const maxVal = Math.max(...sorted.map((d) => d[metric] as number));

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Berlin Bezirke Dashboard</h3>
      <p className="text-sm text-zinc-500 mb-4">12 Bezirke — wähle eine Metrik</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {metrics.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              metric === m.key
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {sorted.map((d, i) => {
          const val = d[metric] as number;
          const short = d.name.length > 18 ? d.name.slice(0, 16) + '…' : d.name;
          return (
            <div key={d.name} className="flex items-center gap-3">
              <div className="w-[140px] text-right text-xs text-zinc-400 shrink-0 truncate" title={d.name}>{short}</div>
              <div className="flex-1 relative h-7 bg-white/5 rounded-lg overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-lg"
                  style={{ backgroundColor: active.color }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${(val / maxVal) * 100}%` } : {}}
                  transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
                />
                <motion.span
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-white"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.05 }}
                >
                  {active.format(val)}
                </motion.span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Chart 2: Mobility Flow (Radial) ────────────────────────────────

function MobilityFlowChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  // Place bezirke in a circle
  const bezirkeNames = BEZIRKE.map((b) => b.name);
  const n = bezirkeNames.length;
  const cx = 350, cy = 350, r = 280;
  const positions = bezirkeNames.map((_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const maxVol = Math.max(...FLOWS.map((f) => f.volume));

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Mobilität zwischen Bezirken</h3>
      <p className="text-sm text-zinc-500 mb-6">Tägliche Pendlerströme — Top-Korridore</p>
      <div className="w-full overflow-x-auto">
        <svg viewBox="0 0 700 700" className="w-full max-w-[600px] mx-auto">
          {/* Flow arcs */}
          {FLOWS.map((flow, i) => {
            const fi = bezirkeNames.indexOf(flow.from);
            const ti = bezirkeNames.indexOf(flow.to);
            if (fi === -1 || ti === -1) return null;
            const from = positions[fi];
            const to = positions[ti];
            const opacity = 0.15 + (flow.volume / maxVol) * 0.55;
            const width = 1 + (flow.volume / maxVol) * 4;
            // Quadratic bezier through center
            const midX = cx + (((from.x + to.x) / 2) - cx) * 0.3;
            const midY = cy + (((from.y + to.y) / 2) - cy) * 0.3;
            return (
              <motion.path
                key={i}
                d={`M${from.x},${from.y} Q${midX},${midY} ${to.x},${to.y}`}
                fill="none"
                stroke="#818cf8"
                strokeWidth={width}
                opacity={0}
                animate={isInView ? { opacity } : {}}
                transition={{ duration: 1.2, delay: i * 0.08 }}
              />
            );
          })}
          {/* Nodes */}
          {bezirkeNames.map((name, i) => {
            const pos = positions[i];
            const short = name.length > 12 ? name.slice(0, 10) + '…' : name;
            const angle = (i / n) * 360 - 90;
            const labelR = r + 30;
            const lx = cx + labelR * Math.cos((angle * Math.PI) / 180);
            const ly = cy + labelR * Math.sin((angle * Math.PI) / 180);
            const anchor = lx > cx ? 'start' : lx < cx ? 'end' : 'middle';
            return (
              <g key={name}>
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={8}
                  fill="#818cf8"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
                <motion.text
                  x={lx}
                  y={ly}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  className="fill-zinc-400 text-[10px]"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.05 }}
                >
                  {short}
                </motion.text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ─── Chart 3: Startup Treemap ────────────────────────────────────────

function StartupTreemap() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  const sorted = [...BEZIRKE].sort((a, b) => b.startups - a.startups);
  const total = sorted.reduce((s, b) => s + b.startups, 0);

  const colors = ['#818cf8', '#6366f1', '#a78bfa', '#c084fc', '#06b6d4', '#22d3ee', '#f472b6', '#fb923c', '#4ade80', '#fbbf24', '#e879f9', '#34d399'];

  // Simple treemap layout: single row wrapped proportionally
  type Rect = { name: string; startups: number; x: number; y: number; w: number; h: number; color: string };
  const rects: Rect[] = [];
  const cols = 4;
  const cellH = 100;
  let col = 0, row = 0, xOff = 0;
  const totalW = 100; // percentage

  // Slice-and-dice rows of 4
  for (let i = 0; i < sorted.length; i++) {
    const rowItems = sorted.slice(Math.floor(i / cols) * cols, Math.floor(i / cols) * cols + cols);
    const rowTotal = rowItems.reduce((s, b) => s + b.startups, 0);
    const idxInRow = i % cols;
    if (idxInRow === 0) xOff = 0;
    const w = (sorted[i].startups / rowTotal) * totalW;
    rects.push({
      name: sorted[i].name,
      startups: sorted[i].startups,
      x: xOff,
      y: Math.floor(i / cols) * cellH,
      w,
      h: cellH,
      color: colors[i % colors.length],
    });
    xOff += w;
  }

  const totalH = Math.ceil(sorted.length / cols) * cellH;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Startup Heatmap Berlin</h3>
      <p className="text-sm text-zinc-500 mb-6">{total.toLocaleString()} Startups — Proportional Area Chart</p>
      <div className="relative w-full" style={{ height: totalH }}>
        {rects.map((r, i) => {
          const short = r.name.length > 14 ? r.name.slice(0, 12) + '…' : r.name;
          return (
            <motion.div
              key={r.name}
              className="absolute rounded-lg border border-white/10 flex flex-col items-center justify-center p-1 overflow-hidden"
              style={{
                left: `${r.x}%`,
                top: r.y,
                width: `${r.w}%`,
                height: r.h,
                backgroundColor: r.color + '22',
                borderColor: r.color + '44',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            >
              <span className="text-[11px] text-zinc-300 font-medium truncate w-full text-center">{short}</span>
              <span className="text-lg font-bold" style={{ color: r.color }}>{r.startups}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Chart 4: DOOH Opportunity Score ─────────────────────────────────

function DOOHOpportunityScore() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  // Compute score: normalized footfall (40%) + rent (30%) + startup density (30%)
  const maxFootfall = Math.max(...BEZIRKE.map((b) => b.footfall));
  const maxRent = Math.max(...BEZIRKE.map((b) => b.rent));
  const maxStartups = Math.max(...BEZIRKE.map((b) => b.startups));

  const scored = BEZIRKE.map((b) => {
    const score =
      ((b.footfall / maxFootfall) * 0.4 +
        (b.rent / maxRent) * 0.3 +
        (b.startups / maxStartups) * 0.3) * 100;
    return { ...b, score: Math.round(score) };
  }).sort((a, b) => b.score - a.score);

  const getColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#818cf8';
    if (score >= 40) return '#f59e0b';
    return '#6b7280';
  };

  const getLabel = (score: number) => {
    if (score >= 80) return 'Prime';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">DOOH Opportunity Score</h3>
      <p className="text-sm text-zinc-500 mb-2">Location Intelligence: Footfall (40%) + Miete (30%) + Startups (30%)</p>
      <p className="text-xs text-indigo-400/60 mb-6">Powered by EXD × HYGH</p>

      <div className="space-y-3">
        {scored.map((d, i) => {
          const short = d.name.length > 18 ? d.name.slice(0, 16) + '…' : d.name;
          const color = getColor(d.score);
          return (
            <div key={d.name} className="flex items-center gap-3">
              <div className="w-[140px] text-right text-xs text-zinc-400 shrink-0 truncate" title={d.name}>{short}</div>
              <div className="flex-1 relative h-8 bg-white/5 rounded-lg overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-lg"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${d.score}%` } : {}}
                  transition={{ duration: 1, delay: i * 0.06, ease: 'easeOut' }}
                />
                <motion.div
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.8 + i * 0.06 }}
                >
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: color + '33', color }}>{getLabel(d.score)}</span>
                  <span className="text-xs font-bold text-white">{d.score}</span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

export default function BerlinPulseStory() {
  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <StoryNavigation />

      {/* Hero */}
      <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-[120px]" />
        </div>
        <motion.div
          className="relative text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="text-sm font-mono tracking-[0.3em] uppercase text-indigo-400 mb-6">Data Story</div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="gradient-text">Berlin Pulse</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Europas Startup-Hauptstadt, durchleuchtet mit Daten. 12 Bezirke, Millionen Datenpunkte, eine Stadt im Puls der Daten.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
            <span>🏙️</span>
            <span>Berlin</span>
            <span className="mx-2">·</span>
            <span>7 min read</span>
            <span className="mx-2">·</span>
            <span>Location Intelligence</span>
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <StatCard value="3.85M" label="Einwohner" delay={0} />
          <StatCard value="12" label="Bezirke" delay={0.1} />
          <StatCard value="1,552" label="Startups" delay={0.2} />
          <StatCard value="€12.1" label="Ø Miete €/m²" delay={0.3} />
        </div>

        {/* Chapter 1: Bezirke Dashboard */}
        <ChapterHeading
          number="Chapter 01"
          title="Die 12 Bezirke"
          subtitle="Berlin ist nicht eine Stadt — es sind zwölf. Jeder Bezirk hat seine eigene Identität, Demografie und Wirtschaftskraft."
        />

        <FadeInText className="mb-16">
          <p className="text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Von den Tech-Hubs in <span className="text-indigo-400 font-medium">Mitte</span> und <span className="text-indigo-400 font-medium">Friedrichshain-Kreuzberg</span> bis zu den ruhigeren Wohnbezirken wie <span className="text-cyan-400 font-medium">Spandau</span> — jeder Bezirk erzählt eine andere Geschichte.
          </p>
        </FadeInText>

        <FadeInText className="mb-32">
          <BezirkeDashboard />
        </FadeInText>

        {/* Chapter 2: Mobility */}
        <ChapterHeading
          number="Chapter 02"
          title="Stadt in Bewegung"
          subtitle="Jeden Tag strömen Hunderttausende zwischen den Bezirken — zur Arbeit, zum Leben, zum Feiern."
        />

        <FadeInText className="mb-16">
          <p className="text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            <span className="text-indigo-400 font-medium">Mitte</span> ist das Gravitationszentrum: Aus fast jedem Bezirk fließen die größten Ströme hierher. <span className="text-cyan-400 font-medium">Friedrichshain-Kreuzberg</span> ist der zweitstärkste Magnet — Berlins Kreativ- und Tech-Szene zieht täglich Tausende an.
          </p>
        </FadeInText>

        <FadeInText className="mb-32">
          <MobilityFlowChart />
        </FadeInText>

        {/* Chapter 3: Startup Heatmap */}
        <ChapterHeading
          number="Chapter 03"
          title="Startup Heatmap"
          subtitle="Berlin ist Europas Nr. 1 für Venture Capital — aber wo genau sitzen die Startups?"
        />

        <FadeInText className="mb-16">
          <p className="text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Über <span className="text-purple-400 font-bold">60%</span> aller Berliner Startups konzentrieren sich in nur drei Bezirken: Mitte, Friedrichshain-Kreuzberg und Charlottenburg-Wilmersdorf. Diese Cluster-Effekte sind Gold für datengetriebene Standortentscheidungen.
          </p>
        </FadeInText>

        <FadeInText className="mb-32">
          <StartupTreemap />
        </FadeInText>

        {/* Chapter 4: DOOH Opportunity Score */}
        <ChapterHeading
          number="Chapter 04"
          title="DOOH Opportunity Score"
          subtitle="Wo lohnt sich Digital Out-of-Home am meisten? Ein Location Intelligence Score für Berlin."
        />

        <FadeInText className="mb-16">
          <p className="text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Wir kombinieren <span className="text-green-400 font-medium">Footfall</span>, <span className="text-cyan-400 font-medium">Mietpreisniveau</span> und <span className="text-purple-400 font-medium">Startup-Dichte</span> zu einem Score, der zeigt, wo digitale Außenwerbung den höchsten Impact hat. Die Top-Bezirke? Genau dort, wo HYGH seine Screens platziert.
          </p>
        </FadeInText>

        <FadeInText className="mb-32">
          <DOOHOpportunityScore />
        </FadeInText>

        {/* Conclusion */}
        <FadeInText className="text-center py-32 md:py-48">
          <div className="text-sm font-mono tracking-[0.3em] uppercase text-indigo-400 mb-4">Conclusion</div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Daten machen Städte lesbar
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Berlin ist mehr als eine Karte. Es ist ein lebendes System aus Bewegung, Wirtschaft und Potenzial. Mit den richtigen Daten wird jeder Bezirk zum strategischen Asset.
          </p>
          <p className="text-sm text-zinc-500">
            Datenquellen: Amt für Statistik Berlin-Brandenburg, Startup-Datenbanken, EXD Location Intelligence Platform
          </p>
        </FadeInText>
      </div>
    </div>
  );
}
