'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const testimonials = [
  {
    quote: "EXD turned weeks of spreadsheet wrangling into a 10-minute exploration. I've never seen GDP trends come alive like this.",
    name: 'Sarah Chen',
    role: 'Senior Data Analyst',
    company: 'McKinsey & Company',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    quote: "We used EXD to benchmark urbanization rates across 40 cities. The interactive maps alone saved our team months of GIS work.",
    name: 'Marcus Okonkwo',
    role: 'Urban Planner',
    company: 'UN-Habitat',
    gradient: 'from-purple-500 to-cyan-500',
  },
  {
    quote: "Understanding population density and mobility patterns by country used to require three different tools. Now it's one page on EXD.",
    name: 'Julia Hartmann',
    role: 'DOOH Media Buyer',
    company: 'GroupM',
    gradient: 'from-cyan-500 to-indigo-500',
  },
  {
    quote: "As a founder, I needed fast market sizing across emerging economies. EXD's data library is like having a research team on demand.",
    name: 'Raj Patel',
    role: 'Startup Founder',
    company: 'Stealth AI Startup',
    gradient: 'from-indigo-400 to-cyan-400',
  },
  {
    quote: "My PhD research compares education spending across 195 countries. EXD replaced a semester of data collection with a single afternoon.",
    name: 'Dr. Elena Vasquez',
    role: 'Academic Researcher',
    company: 'MIT Media Lab',
    gradient: 'from-purple-400 to-indigo-500',
  },
];

const stats = [
  { value: '30+', label: 'Interactive Pages' },
  { value: '500+', label: 'Datasets' },
  { value: '195', label: 'Countries' },
  { value: 'Live', label: 'API' },
];

export default function SocialProof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-mono tracking-widest text-indigo-400 uppercase mb-4">
            Trusted by data people
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built for the{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              curious
            </span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            From analysts to academics — here's what early users are saying.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 md:gap-16 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs font-mono text-white/40 uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className={`group relative rounded-2xl p-6 backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors ${
                i === 3 ? 'lg:col-span-1' : ''
              }`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
            >
              {/* Top gradient line */}
              <div
                className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${t.gradient} opacity-30 group-hover:opacity-60 transition-opacity`}
              />

              {/* Quote */}
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} opacity-80 flex items-center justify-center text-white text-xs font-bold`}
                >
                  {t.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{t.name}</div>
                  <div className="text-white/40 text-xs">
                    {t.role} · {t.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
