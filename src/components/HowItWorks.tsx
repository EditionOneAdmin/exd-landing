'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    number: '01',
    title: 'Upload Your Data',
    description: 'CSV, JSON, API connections, or direct database links. We speak every data language.',
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
    color: 'indigo',
  },
  {
    number: '02',
    title: 'Describe Your Vision',
    description: 'Tell our AI what you want to convey. A story, an emotion, an experience. It understands.',
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    color: 'purple',
  },
  {
    number: '03',
    title: 'Share & Inspire',
    description: 'Publish stunning experiences. Embed anywhere. Watch your data move people.',
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
          d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>
    ),
    color: 'cyan',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 overflow-hidden" ref={containerRef}>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent" />
      
      {/* Parallax floating elements */}
      <motion.div
        className="absolute -right-20 top-1/4 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl"
        style={{ y }}
      />
      <motion.div
        className="absolute -left-20 bottom-1/4 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl"
        style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
      />

      <div className="max-w-6xl mx-auto relative z-10" ref={ref}>
        {/* Section header */}
        <motion.div
          className="text-center mb-10 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Three steps to <span className="gradient-text">wow</span>
          </h2>
          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto">
            From raw data to emotional experience in minutes, not months.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />
          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.2 }}
              >
                {/* Step card */}
                <div className="glass-card rounded-2xl p-5 sm:p-8 text-center relative overflow-hidden group hover:bg-white/[0.04] transition-all duration-500">
                  {/* Background glow on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${
                    step.color === 'indigo' ? 'from-indigo-500/10' :
                    step.color === 'purple' ? 'from-purple-500/10' :
                    'from-cyan-500/10'
                  } to-transparent`} />
                  
                  {/* Step number */}
                  <motion.div
                    className="absolute -top-4 -right-4 text-8xl font-bold text-white/[0.03] select-none"
                    whileHover={{ scale: 1.1 }}
                  >
                    {step.number}
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    className={`relative inline-flex p-4 rounded-2xl mb-6 ${
                      step.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-400' :
                      step.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-cyan-500/10 text-cyan-400'
                    }`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {step.icon}
                    {/* Animated ring */}
                    <motion.div
                      className={`absolute inset-0 rounded-2xl border-2 ${
                        step.color === 'indigo' ? 'border-indigo-500/30' :
                        step.color === 'purple' ? 'border-purple-500/30' :
                        'border-cyan-500/30'
                      }`}
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    />
                  </motion.div>

                  {/* Number badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                    step.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-400' :
                    step.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                    'bg-cyan-500/10 text-cyan-400'
                  }`}>
                    Step {step.number}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector (hidden on mobile) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 translate-x-1/2 -translate-y-1/2 z-10">
                    <motion.svg
                      className="w-6 h-6 text-white/20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
