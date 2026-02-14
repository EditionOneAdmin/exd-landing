'use client';
import { motion } from 'framer-motion';
import RacingBarChart from '@/components/visualizations/RacingBarChart';
import CO2WorldMap from '@/components/visualizations/CO2WorldMap';
import BubbleChart from '@/components/visualizations/BubbleChart';
import PopulationPyramid from '@/components/visualizations/PopulationPyramid';
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
};
const visualizations = [
  {
    id: 'racing-bar',
    title: 'Racing Bar Chart',
    description:
      'Watch the world\'s largest economies compete over six decades. This animated bar chart race shows GDP rankings shifting in real-time — press play and watch history unfold.',
    tags: ['Animation', 'Time Series', 'Economics'],
    Component: RacingBarChart,
  },
  {
    id: 'co2-map',
    title: 'CO₂ World Map',
    description:
      'A choropleth map of global carbon dioxide emissions over time. Toggle between total and per-capita views, scrub through decades, and hover over countries for detailed stats.',
    tags: ['Geospatial', 'Environment', 'Interactive'],
    Component: CO2WorldMap,
  },
  {
    id: 'bubble-chart',
    title: 'Bubble Chart',
    description:
      'Inspired by Hans Rosling\'s legendary talks — explore how life expectancy, income, and population relate across every nation. Filter by region and animate through time.',
    tags: ['Multi-Dimensional', 'Health', 'Global'],
    Component: BubbleChart,
  },
  {
    id: 'population-pyramid',
    title: 'Population Pyramid',
    description:
      'Compare the demographic structures of six countries across three decades. See how aging societies, youth bulges, and migration reshape the human landscape.',
    tags: ['Demographics', 'Comparison', 'Social'],
    Component: PopulationPyramid,
  },
];
export default function VisualizationsPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
        {/* Glow background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Visualizations Gallery
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Data in Motion
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Four interactive visualizations that turn raw numbers into stories you can feel.
            Play, explore, and discover patterns hidden in the data.
          </p>
          {/* Quick nav pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {visualizations.map((v) => (
              <a
                key={v.id}
                href={`#${v.id}`}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:border-indigo-500/40 transition-all"
              >
                {v.title}
              </a>
            ))}
          </div>
        </motion.div>
      </section>
      {/* Visualization Sections */}
      <div className="max-w-6xl mx-auto px-6 pb-24 space-y-28">
        {visualizations.map((viz, i) => (
          <motion.section
            key={viz.id}
            id={viz.id}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="scroll-mt-24"
          >
            {/* Section header */}
            <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono text-indigo-400/60">0{i + 1}</span>
                  <h2 className="text-3xl font-bold text-white">{viz.title}</h2>
                </div>
                <p className="text-gray-400 max-w-2xl">{viz.description}</p>
              </div>
              <div className="flex gap-2">
                {viz.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {/* Visualization */}
            <viz.Component />
          </motion.section>
        ))}
      </div>
      {/* Back to home */}
      <div className="text-center pb-16">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-indigo-500/40 transition-all"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
}
