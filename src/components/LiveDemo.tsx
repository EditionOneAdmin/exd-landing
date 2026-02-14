'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Play, MousePointer2, Sparkles, ArrowRight } from 'lucide-react';

// Dynamic import for the demo visualization
const BubbleChart = dynamic(() => import('./visualizations/BubbleChart'), { 
  ssr: false,
  loading: () => (
    <div className="exd-card p-8 flex items-center justify-center min-h-[500px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">Loading demo...</p>
      </div>
    </div>
  )
});

const tips = [
  { icon: Play, text: 'Press play to animate through decades of data' },
  { icon: MousePointer2, text: 'Hover over bubbles to see country details' },
  { icon: Sparkles, text: 'Click regions to highlight and compare' },
];

export default function LiveDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTip, setActiveTip] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Cycle through tips
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTip((prev) => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="demo" 
      className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent"
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            left: '50%',
            top: '30%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm text-gray-400">Try It Live</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white/90">See It </span>
            <span className="gradient-text">In Action</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            This is the famous Hans Rosling visualization — now in your hands. 
            Watch 30 years of global progress unfold.
          </p>
        </motion.div>

        {/* Tips bar */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-4 sm:gap-8 px-4 sm:px-6 py-3 rounded-full glass-card">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              const isActive = activeTip === index;

              return (
                <motion.div
                  key={tip.text}
                  className={`flex items-center gap-2 transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-30 hidden sm:flex'
                  }`}
                  animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    {tip.text}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Demo visualization */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Decorative frame */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl opacity-20 blur-sm" />
          
          <div className="relative rounded-2xl overflow-hidden border border-white/10">
            <BubbleChart 
              title="Life vs Wealth: The World's Progress"
              subtitle="Interactive: hover, click regions, and press play!"
            />
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="text-gray-400 mb-6">
            Imagine your data, visualized like this. <span className="text-white">No code required.</span>
          </p>
          <a
            href="#waitlist"
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 transition-all duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <span className="relative text-white font-semibold">Create Your First Visualization</span>
            <ArrowRight className="relative w-5 h-5 text-white transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
