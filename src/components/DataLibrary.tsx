'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Globe2, 
  Leaf, 
  Users, 
  Coins, 
  Database, 
  TrendingUp,
  BarChart3,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Animated counter component
function AnimatedCounter({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { 
    icon: Database, 
    value: 500, 
    suffix: '+', 
    label: 'Curated Datasets',
    description: 'Ready to visualize'
  },
  { 
    icon: MapPin, 
    value: 195, 
    suffix: '', 
    label: 'Countries Covered',
    description: 'Global perspective'
  },
  { 
    icon: Calendar, 
    value: 60, 
    suffix: '+', 
    label: 'Years of History',
    description: 'Deep time series'
  },
  { 
    icon: TrendingUp, 
    value: 50, 
    suffix: 'M+', 
    label: 'Data Points',
    description: 'Continuously updated'
  },
];

const categories = [
  {
    icon: Globe2,
    title: 'Global Economics',
    description: 'GDP, trade flows, inflation, currency, market indices',
    datasets: ['GDP by Country', 'Trade Balance', 'Inflation Rates', 'Exchange Rates'],
    color: 'from-blue-500 to-indigo-500',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    count: 120,
  },
  {
    icon: Leaf,
    title: 'Climate & Environment',
    description: 'CO₂ emissions, renewable energy, deforestation, air quality',
    datasets: ['Carbon Emissions', 'Renewable Share', 'Temperature Anomaly', 'Forest Coverage'],
    color: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    count: 95,
  },
  {
    icon: Users,
    title: 'Demographics',
    description: 'Population pyramids, life expectancy, education, migration',
    datasets: ['Population Growth', 'Life Expectancy', 'Literacy Rates', 'Urbanization'],
    color: 'from-purple-500 to-pink-500',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    count: 150,
  },
  {
    icon: Coins,
    title: 'Development',
    description: 'Poverty rates, healthcare access, infrastructure, inequality',
    datasets: ['Poverty Index', 'Healthcare Spending', 'Internet Access', 'Gini Coefficient'],
    color: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    count: 135,
  },
];

const dataSources = [
  { name: 'World Bank', description: '190+ countries, 60 years' },
  { name: 'Our World in Data', description: 'Climate, Health, Energy' },
  { name: 'United Nations', description: 'Demographics, Development' },
  { name: 'OECD', description: 'Economic Indicators' },
];

const sampleDatasets = [
  { 
    title: 'GDP Growth Race',
    category: 'Economics',
    countries: 195,
    years: '1960-2023',
    gradient: 'from-indigo-500/20 to-purple-500/20',
    icon: BarChart3,
  },
  { 
    title: 'CO₂ Emissions Map',
    category: 'Climate',
    countries: 195,
    years: '1990-2023',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    icon: Globe2,
  },
  { 
    title: 'Life vs Wealth',
    category: 'Demographics',
    countries: 180,
    years: '1990-2022',
    gradient: 'from-pink-500/20 to-rose-500/20',
    icon: TrendingUp,
  },
  { 
    title: 'Population Pyramids',
    category: 'Demographics',
    countries: 50,
    years: '1990-2020',
    gradient: 'from-amber-500/20 to-orange-500/20',
    icon: Users,
  },
];

export default function DataLibrary() {
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
      id="data-library" 
      className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-transparent via-purple-950/10 to-transparent"
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[1200px] h-[1200px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 60%)',
            left: '50%',
            top: '20%',
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
            <Database className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">Curated Data Library</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white/90">The World&apos;s Data, </span>
            <span className="gradient-text">Ready to Explore</span>
          </h2>
          <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto">
            We&apos;ve aggregated and cleaned datasets from the world&apos;s most trusted sources. 
            No more hunting for CSVs — just pick a topic and start visualizing.
          </p>
        </motion.div>

        {/* Stats counters */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-12 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="relative group text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <Icon className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                
                <div className="text-white font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Categories */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-center text-white mb-10">
            Explore by Category
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all duration-500 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  {/* Hover glow */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className={`inline-flex p-3 rounded-xl ${category.iconBg} mb-4`}>
                      <Icon className={`w-6 h-6 ${category.iconColor}`} />
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-white">{category.title}</h4>
                      <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                        {category.count} sets
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-4">{category.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {category.datasets.slice(0, 3).map((dataset) => (
                        <span 
                          key={dataset}
                          className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-500"
                        >
                          {dataset}
                        </span>
                      ))}
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-500">
                        +{category.count - 3} more
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Sample datasets preview */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-center text-white mb-10">
            Popular Datasets
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleDatasets.map((dataset, index) => {
              const Icon = dataset.icon;
              return (
                <motion.div
                  key={dataset.title}
                  className={`group relative p-5 rounded-xl bg-gradient-to-br ${dataset.gradient} border border-white/5 hover:border-white/20 transition-all duration-500 cursor-pointer overflow-hidden`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -3 }}
                >
                  {/* Decorative icon in background */}
                  <Icon className="absolute right-2 bottom-2 w-20 h-20 text-white/5 group-hover:text-white/10 transition-colors" />
                  
                  <div className="relative z-10">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      {dataset.category}
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1 mb-3">
                      {dataset.title}
                    </h4>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {dataset.countries} countries
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dataset.years}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Data sources */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <p className="text-sm text-gray-500 mb-6">Powered by trusted global data sources</p>
          
          <div className="flex flex-wrap justify-center gap-6">
            {dataSources.map((source, index) => (
              <motion.div
                key={source.name}
                className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/[0.02] border border-white/5"
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <div className="text-left">
                  <div className="text-sm font-medium text-white">{source.name}</div>
                  <div className="text-xs text-gray-500">{source.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <a
            href="#experience"
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 transition-all duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <Database className="relative w-5 h-5 text-white" />
            <span className="relative text-white font-semibold">Explore All Data</span>
            <ArrowRight className="relative w-5 h-5 text-white transition-transform group-hover:translate-x-1" />
          </a>
          
          <p className="text-gray-500 text-sm mt-4">
            Or bring your own data — we support CSV, JSON, APIs, and more
          </p>
          <div className="flex flex-col items-center gap-2 mt-4">
            <a
              href="/stories/dooh-revolution/"
              className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Read our Data Story: The Rise of Digital Out-of-Home
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/stories/world-in-50-years/"
              className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Read our Data Story: The World in 50 Years
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/stories/rise-of-ai/"
              className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Read our Data Story: The Rise of AI
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/stories/energy-transition/"
              className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Read our Data Story: The Energy Transition
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/stories/smart-cities/"
              className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Read our Data Story: Smart Cities &amp; Digital Infrastructure
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/stories/global-health/"
              className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Read our Data Story: Global Health — The State of Humanity
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/stories/real-estate/"
              className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Read our Data Story: Real Estate &amp; Location Intelligence
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
