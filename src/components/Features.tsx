'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    title: 'Interactive Visualizations',
    description: 'Transform flat data into immersive 3D experiences. Rotate, zoom, explore. Every dataset becomes a universe to discover.',
    gradient: 'from-indigo-500 to-purple-500',
    preview: (
      <div className="relative h-40">
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-500/30"
          animate={{ rotateY: 360, rotateX: 15 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ transformStyle: 'preserve-3d' }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/40 to-cyan-500/40 border border-purple-500/30"
          animate={{ rotateY: -360, rotateZ: 20 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{ transformStyle: 'preserve-3d' }}
        />
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-indigo-400"
            style={{
              left: `${20 + i * 12}%`,
              top: `${30 + Math.sin(i) * 15}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
            }}
          />
        ))}
      </div>
    ),
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: 'AI Copilot',
    description: 'Describe what you want in plain English. Our AI understands your vision and generates stunning visualizations instantly.',
    gradient: 'from-purple-500 to-pink-500',
    preview: (
      <div className="relative h-40 flex items-center justify-center">
        <div className="relative">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/30 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
          {/* Orbiting particles */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-pink-400"
              style={{ left: '50%', top: '50%' }}
              animate={{
                x: [Math.cos(i * 1.57) * 40, Math.cos(i * 1.57 + Math.PI) * 40],
                y: [Math.sin(i * 1.57) * 40, Math.sin(i * 1.57 + Math.PI) * 40],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
        {/* Typing effect */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/5 rounded-lg px-3 py-2 text-sm text-gray-400">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            >
              &quot;Show me climate trends as an aurora...&quot;
            </motion.span>
            <motion.span
              className="inline-block w-0.5 h-4 bg-purple-400 ml-1"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: 'Data Storytelling',
    description: 'Numbers become narratives. Guide your audience through insights with cinematic transitions and emotional arcs.',
    gradient: 'from-cyan-500 to-emerald-500',
    preview: (
      <div className="relative h-40">
        {/* Story timeline */}
        <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-cyan-500 via-emerald-500 to-transparent" />
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute left-6 flex items-center gap-3"
            style={{ top: `${20 + i * 30}%` }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.3, duration: 0.5 }}
          >
            <motion.div
              className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500"
              animate={{ scale: i === 1 ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="bg-white/5 rounded px-3 py-1.5 text-xs text-gray-400">
              {['Introduction', 'Key Insight', 'Conclusion'][i]}
            </div>
          </motion.div>
        ))}
        {/* Floating elements */}
        <motion.div
          className="absolute right-12 top-1/2 -translate-y-1/2 w-20 h-20 rounded-lg bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20"
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>
    ),
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-10 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-purple-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Built for <span className="gradient-text">impact</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Every tool designed to transform how people experience and understand data.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="group relative"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <div className="glass-card rounded-2xl p-6 h-full transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04]">
                {/* Preview area */}
                <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.02] to-transparent">
                  {feature.preview}
                </div>

                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 mb-4`}>
                  <span className="text-white/80">{feature.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
                {feature.title === 'AI Copilot' && (
                  <Link href="/copilot">
                    <motion.span
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Try Copilot →
                    </motion.span>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
