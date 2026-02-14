'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Problem() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 overflow-hidden" ref={ref}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-10 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            The Problem
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Data has lost its <span className="gradient-text">soul</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Spreadsheets. Bar charts. Slide decks. The same formats since 1987.
            Your insights deserve better.
          </p>
        </motion.div>

        {/* Before/After comparison */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Before - The Problem */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass-card rounded-2xl p-5 sm:p-8 h-full border-red-500/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <span className="text-red-400/80 font-medium">Yesterday</span>
              </div>
              
              {/* Fake boring chart */}
              <div className="bg-white/5 rounded-xl p-6 mb-6">
                <div className="flex items-end justify-between h-32 gap-3">
                  {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-full bg-gray-600 rounded-t"
                      style={{ height: `${h}%` }}
                      initial={{ height: 0 }}
                      animate={isInView ? { height: `${h}%` } : {}}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-xs text-gray-500">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-300 mb-3">
                Statista was the library
              </h3>
              <ul className="space-y-2 text-gray-500">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                  Static PDFs nobody reads
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                  Charts that all look the same
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                  Data without context or story
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                  Zero emotional impact
                </li>
              </ul>
            </div>
          </motion.div>

          {/* After - The Solution */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="glass-card rounded-2xl p-5 sm:p-8 h-full border-emerald-500/20 glow-primary">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-medium">Tomorrow</span>
              </div>
              
              {/* Fancy visualization preview */}
              <div className="relative bg-gradient-to-br from-indigo-950/50 to-purple-950/50 rounded-xl p-6 mb-6 overflow-hidden h-[168px]">
                {/* Animated circles */}
                <motion.div
                  className="absolute w-20 h-20 rounded-full bg-indigo-500/30 blur-xl"
                  animate={{
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{ left: '20%', top: '30%' }}
                />
                <motion.div
                  className="absolute w-16 h-16 rounded-full bg-purple-500/30 blur-xl"
                  animate={{
                    x: [0, -25, 0],
                    y: [0, 25, 0],
                    scale: [1, 0.8, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ right: '25%', top: '40%' }}
                />
                <motion.div
                  className="absolute w-12 h-12 rounded-full bg-cyan-500/30 blur-xl"
                  animate={{
                    x: [0, 20, 0],
                    y: [0, 15, 0],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ left: '50%', bottom: '20%' }}
                />
                
                {/* Floating data points */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white/40"
                    style={{
                      left: `${15 + i * 10}%`,
                      top: `${30 + Math.sin(i) * 20}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                  />
                ))}
                
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full opacity-30">
                  <motion.path
                    d="M 40 80 Q 100 40 160 70 Q 220 100 280 50"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 2, delay: 0.8 }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">
                EXD is the exhibition
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Interactive 3D experiences
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  AI-powered storytelling
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Emotional, memorable narratives
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Data that moves people
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
