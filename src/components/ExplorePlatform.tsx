'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

const features = [
  {
    title: 'Dashboard',
    description: 'Key global metrics at a glance — GDP, population, climate, and more.',
    href: '/dashboard',
    icon: '📊',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    title: 'Compare',
    description: 'Benchmark countries side-by-side across 500+ indicators.',
    href: '/compare',
    icon: '⚖️',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Stories',
    description: 'Immersive, narrative-driven data explorations you can share.',
    href: '/stories',
    icon: '📖',
    gradient: 'from-cyan-500 to-emerald-500',
  },
  {
    title: 'Quiz',
    description: 'Test your intuition — can you guess the data before it\'s revealed?',
    href: '/quiz',
    icon: '🧠',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Data Explorer',
    description: 'Dive deep into raw datasets with powerful filters and charts.',
    href: '/explorer',
    icon: '🔍',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'AI Copilot',
    description: 'Ask questions in plain English — get instant visualizations.',
    href: '/copilot',
    icon: '✨',
    gradient: 'from-violet-500 to-indigo-500',
  },
];

export default function ExplorePlatform() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="features" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-mono tracking-widest text-indigo-400 uppercase mb-3">
            What&apos;s inside
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Explore the <span className="gradient-text">Platform</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 * i }}
            >
              <Link href={f.href} className="block group h-full">
                <div className="glass-card rounded-2xl p-6 h-full hover:border-white/20 transition-all duration-300 group-hover:-translate-y-1">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-2xl mb-4 opacity-80 group-hover:opacity-100 transition-opacity`}
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
