'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const industries = [
  {
    icon: '🏙️',
    title: 'Smart Cities & Urban Planning',
    description: 'Track urbanization, infrastructure spend, and quality of life metrics across global cities.',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: '📊',
    title: 'Marketing & Media',
    description: 'Understand audience reach, DOOH growth, and advertising effectiveness with real-time insights.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: '🌍',
    title: 'Climate & Energy',
    description: 'Monitor emissions, renewable adoption, and energy transitions across 195 countries.',
    gradient: 'from-cyan-500 to-emerald-500',
  },
  {
    icon: '🏥',
    title: 'Public Health',
    description: 'Analyze health outcomes, spending, and demographic shifts with interactive visualizations.',
    gradient: 'from-rose-500 to-orange-500',
  },
];

export default function IndustryUseCases() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[700px] h-[700px] rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            <span className="text-white/90">Powering insights across </span>
            <span className="gradient-text">industries</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            From urban planning to public health — experience data that drives decisions.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {industries.map((item, i) => (
            <motion.div
              key={i}
              className="relative group rounded-2xl p-[1px] cursor-default"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Gradient border */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
              />
              {/* Inner card */}
              <div className="relative rounded-2xl bg-[#0a0a0f] border border-white/[0.06] group-hover:border-transparent p-6 h-full transition-all duration-500 group-hover:-translate-y-1">
                {/* Icon */}
                <motion.span
                  className="text-4xl block mb-4"
                  animate={hoveredIndex === i ? { scale: 1.15, rotate: [0, -5, 5, 0] } : { scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {item.icon}
                </motion.span>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white/95">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">
                  {item.description}
                </p>

                {/* Subtle glow on hover */}
                <div
                  className={`absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
