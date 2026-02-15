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
    quote: "As a founder, I needed fast market sizing across emerging economies. EXD's data library is like having a research team on demand.",
    name: 'Raj Patel',
    role: 'Startup Founder',
    company: 'Stealth AI Startup',
    gradient: 'from-indigo-400 to-cyan-400',
  },
];

export default function SocialProof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-mono tracking-widest text-indigo-400 uppercase mb-3">
            Trusted by data people
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Built for the{' '}
            <span className="gradient-text">curious</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="group relative rounded-2xl p-6 backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.12 * i }}
            >
              <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${t.gradient} opacity-30 group-hover:opacity-60 transition-opacity`} />
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} opacity-80 flex items-center justify-center text-white text-xs font-bold`}>
                  {t.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{t.name}</div>
                  <div className="text-white/40 text-xs">{t.role} · {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
