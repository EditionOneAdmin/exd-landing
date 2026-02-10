'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { BarChart3, Globe, Sparkles, Users } from 'lucide-react';

// Dynamic imports for visualizations (client-side only due to D3)
const RacingBarChart = dynamic(() => import('./visualizations/RacingBarChart'), { 
  ssr: false,
  loading: () => <VisualizationSkeleton />
});
const CO2WorldMap = dynamic(() => import('./visualizations/CO2WorldMap'), { 
  ssr: false,
  loading: () => <VisualizationSkeleton />
});
const BubbleChart = dynamic(() => import('./visualizations/BubbleChart'), { 
  ssr: false,
  loading: () => <VisualizationSkeleton />
});
const PopulationPyramid = dynamic(() => import('./visualizations/PopulationPyramid'), { 
  ssr: false,
  loading: () => <VisualizationSkeleton />
});

function VisualizationSkeleton() {
  return (
    <div className="exd-card p-8 flex items-center justify-center min-h-[400px] sm:min-h-[600px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">Loading visualization...</p>
      </div>
    </div>
  );
}

const tabs = [
  {
    id: 'gdp',
    label: 'GDP Race',
    icon: BarChart3,
    description: 'Watch 60+ years of economic power shifts',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'co2',
    label: 'CO₂ Map',
    icon: Globe,
    description: 'Global emissions through time',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'life',
    label: 'Life vs Wealth',
    icon: Sparkles,
    description: 'The Hans Rosling visualization',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'population',
    label: 'Demographics',
    icon: Users,
    description: 'Population pyramids across nations',
    color: 'from-pink-500 to-rose-500',
  },
];

export default function ExperienceData() {
  const [activeTab, setActiveTab] = useState('gdp');
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section 
      ref={sectionRef}
      id="experience" 
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[1000px] h-[1000px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
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
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-gray-400">Live Visualizations</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white/90">Experience </span>
            <span className="gradient-text">Data</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Not just charts. These are stories that move, breathe, and reveal 
            patterns you&apos;d never see in a spreadsheet.
          </p>
        </motion.div>

        {/* Tab navigation */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative group flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/10 shadow-lg shadow-indigo-500/10' 
                    : 'hover:bg-white/5'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tab.color} opacity-10`}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                
                <Icon className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'
                }`} />
                
                <div className="text-left">
                  <div className={`text-sm sm:text-base font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                  }`}>
                    {tab.label}
                  </div>
                  <div className={`text-xs transition-colors hidden sm:block ${
                    isActive ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {tab.description}
                  </div>
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* Visualization container */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'gdp' && <RacingBarChart />}
              {activeTab === 'co2' && <CO2WorldMap />}
              {activeTab === 'life' && <BubbleChart />}
              {activeTab === 'population' && <PopulationPyramid />}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Bottom hint */}
        <motion.p
          className="text-center text-gray-500 text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          ✨ All visualizations are fully interactive. Try the controls!
        </motion.p>
      </div>
    </section>
  );
}
