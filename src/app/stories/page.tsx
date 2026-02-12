'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { STORIES, CATEGORIES } from '@/lib/stories';

export default function StoriesHub() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? STORIES
    : STORIES.filter((s) => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* Back nav */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#050507]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-lg opacity-80" />
              <div className="absolute inset-[2px] bg-[#050507] rounded-[6px] flex items-center justify-center">
                <span className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">E</span>
              </div>
            </div>
            <span className="text-lg font-bold">EXD</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="pt-32 pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm font-mono tracking-[0.3em] uppercase text-indigo-400 mb-4">
            Data Stories
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
            Stories that move data
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Immersive, scroll-driven narratives that turn complex datasets into experiences you can feel.
          </p>
        </motion.div>
      </div>

      {/* Category filters */}
      <div className="px-6 pb-12">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Story cards grid */}
      <div className="px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((story, i) => (
                <motion.div
                  key={story.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link href={`/stories/${story.slug}`}>
                    <motion.div
                      className="group relative rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden cursor-pointer h-full"
                      whileHover={{ scale: 1.03, y: -4 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {/* Glow effect on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${story.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                      {/* Top gradient bar */}
                      <div className={`h-1 bg-gradient-to-r ${story.gradient}`} />

                      <div className="p-6">
                        {/* Icon + Category + Read time */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{story.icon}</span>
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full bg-gradient-to-r ${story.gradient} bg-clip-text text-transparent border border-white/10`}>
                              {story.category}
                            </span>
                          </div>
                          <span className="text-xs text-zinc-500">{story.readTime}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold mb-3 text-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-200 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          {story.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                          {story.description}
                        </p>

                        {/* Read arrow */}
                        <div className="flex items-center gap-2 text-sm text-indigo-400 group-hover:text-indigo-300 transition-colors">
                          <span>Read story</span>
                          <motion.span
                            className="inline-block"
                            initial={{ x: 0 }}
                            whileHover={{ x: 4 }}
                          >
                            →
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
