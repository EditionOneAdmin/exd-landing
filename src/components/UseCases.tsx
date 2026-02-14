'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, FlaskConical, Megaphone, GraduationCap, ArrowRight } from 'lucide-react';

const useCases = [
  {
    id: 'journalists',
    icon: Newspaper,
    title: 'Journalists',
    tagline: 'Tell data stories that captivate',
    description: 'Transform breaking news data into viral visualizations. Make complex investigations accessible. Let your readers experience the story.',
    features: ['Embed-ready exports', 'Real-time data updates', 'Mobile-optimized views'],
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/5',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    id: 'researchers',
    icon: FlaskConical,
    title: 'Researchers',
    tagline: 'Explore patterns visually',
    description: 'Discover correlations hiding in your datasets. Present findings that committees actually understand. Make peer review engaging.',
    features: ['Statistical overlays', 'Publication-ready exports', 'Collaborative annotations'],
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-500/10 to-pink-500/5',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
  },
  {
    id: 'marketers',
    icon: Megaphone,
    title: 'Marketers',
    tagline: 'Present insights beautifully',
    description: 'Turn campaign metrics into compelling stories. Impress stakeholders with presentations they\'ll remember. Make ROI visual.',
    features: ['Brand customization', 'Presentation mode', 'Shareable links'],
    color: 'from-orange-500 to-rose-500',
    gradient: 'bg-gradient-to-br from-orange-500/10 to-rose-500/5',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
  },
  {
    id: 'educators',
    icon: GraduationCap,
    title: 'Educators',
    tagline: 'Make data click for students',
    description: 'Transform abstract concepts into intuitive experiences. Watch understanding happen in real-time. Make statistics unforgettable.',
    features: ['Interactive lessons', 'Student engagement tools', 'Progress tracking'],
    color: 'from-emerald-500 to-teal-500',
    gradient: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/5',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
];

export default function UseCases() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
      id="use-cases" 
      className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
            right: '-20%',
            top: '10%',
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)',
            left: '-10%',
            bottom: '10%',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-10 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white/90">Built for </span>
            <span className="gradient-text">Everyone</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Whether you&apos;re breaking news, publishing research, closing deals, 
            or teaching the next generation — data deserves to be experienced.
          </p>
        </motion.div>

        {/* Use case cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            const isHovered = hoveredCard === useCase.id;

            return (
              <motion.div
                key={useCase.id}
                className={`relative group rounded-2xl ${useCase.gradient} border border-white/5 p-8 transition-all duration-500 ${
                  isHovered ? 'border-white/20 scale-[1.02]' : ''
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                onMouseEnter={() => setHoveredCard(useCase.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Hover glow */}
                <div 
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${useCase.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl`}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-xl ${useCase.iconBg} mb-6`}>
                    <Icon className={`w-8 h-8 ${useCase.iconColor}`} />
                  </div>

                  {/* Text */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {useCase.title}
                  </h3>
                  <p className={`text-lg font-medium mb-4 bg-gradient-to-r ${useCase.color} bg-clip-text text-transparent`}>
                    {useCase.tagline}
                  </p>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {useCase.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {useCase.features.map((feature) => (
                      <span 
                        key={feature}
                        className="px-3 py-1 rounded-full text-xs bg-white/5 text-gray-400 border border-white/5"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <motion.a
                    href="#waitlist"
                    className={`inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${useCase.color} bg-clip-text text-transparent group/link`}
                    whileHover={{ x: 5 }}
                  >
                    <span>Learn more</span>
                    <ArrowRight className={`w-4 h-4 ${useCase.iconColor} transition-transform group-hover/link:translate-x-1`} />
                  </motion.a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="text-gray-500 mb-6">
            Don&apos;t see your use case? We&apos;re building for you too.
          </p>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition-all duration-300"
          >
            <span>Tell us what you need</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
