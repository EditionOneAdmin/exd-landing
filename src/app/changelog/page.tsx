'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

const changelog = [
  {
    version: 'v0.5',
    date: '2026-02-10',
    title: 'AI Copilot & Compare Engine',
    features: [
      'AI Copilot for natural-language data queries',
      'Side-by-side company comparison tool',
      'Prompt-based chart generation',
      'Contextual data suggestions & autocomplete',
    ],
    accent: 'from-cyan-400 to-blue-500',
  },
  {
    version: 'v0.4',
    date: '2026-01-20',
    title: 'Pricing & API Docs',
    features: [
      'Tiered pricing page with Stripe integration',
      'Interactive API documentation with live examples',
      'Rate limiting & usage dashboard',
      'Embed mode for external integrations',
    ],
    accent: 'from-purple-400 to-pink-500',
  },
  {
    version: 'v0.3',
    date: '2025-12-15',
    title: 'Visualizations & Stories',
    features: [
      'Interactive chart engine (bar, line, scatter, radar)',
      'Data stories with guided narratives',
      'Export charts as PNG / SVG',
      'Responsive chart components with Framer Motion',
    ],
    accent: 'from-indigo-400 to-purple-500',
  },
  {
    version: 'v0.2',
    date: '2025-11-01',
    title: 'Dashboard & Explore',
    features: [
      'Real-time KPI dashboard with sparklines',
      'Company explorer with search & filters',
      'Glassmorphism UI system & dark theme',
      'Responsive layout with mobile navigation',
    ],
    accent: 'from-violet-400 to-indigo-500',
  },
  {
    version: 'v0.1',
    date: '2025-10-01',
    title: 'Project Kickoff',
    features: [
      'Next.js 14 app scaffold with TypeScript',
      'Landing page with hero section',
      'Tailwind CSS + Framer Motion setup',
      'GitHub Actions CI/CD pipeline',
    ],
    accent: 'from-blue-400 to-cyan-500',
  },
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-[#050507] text-white">
      <Navbar />

      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Changelog
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Every milestone on the journey to making company data explorable.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 via-purple-500/20 to-transparent" />

          {changelog.map((entry, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={entry.version}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative mb-12 md:mb-16 flex flex-col md:flex-row ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 ring-4 ring-[#050507] z-10 mt-6" />

                {/* Spacer */}
                <div className="hidden md:block md:w-1/2" />

                {/* Card */}
                <div className={`ml-14 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-10' : 'md:pl-10'}`}>
                  <div className="relative group">
                    <div className={`absolute -inset-px rounded-2xl bg-gradient-to-r ${entry.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm`} />
                    <div className="relative rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${entry.accent} text-white`}>
                          {entry.version}
                        </span>
                        <span className="text-xs text-gray-500">{entry.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-3">{entry.title}</h3>
                      <ul className="space-y-2">
                        {entry.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500/60 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
