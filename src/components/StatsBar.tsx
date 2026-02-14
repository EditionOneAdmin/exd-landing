'use client';

import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface CountUpProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  inView: boolean;
}

function CountUp({ target, suffix = '', prefix = '', duration = 2, inView }: CountUpProps) {
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (inView && !hasAnimated.current) {
      hasAnimated.current = true;
      const controls = animate(0, target, {
        duration,
        ease: 'easeOut',
        onUpdate: (v) => setDisplay(Math.round(v)),
      });
      return () => controls.stop();
    }
  }, [inView, target, duration]);

  return (
    <span className="tabular-nums">
      {prefix}{display}{suffix}
    </span>
  );
}

const stats = [
  { target: 500, suffix: '+', label: 'Datasets', icon: '📊' },
  { target: 195, suffix: '', label: 'Countries', icon: '🌍' },
  { target: 60, suffix: '+', label: 'Years of Data', icon: '📅' },
  { target: 0, suffix: '', label: 'Real-time API', icon: '⚡', isText: true, textValue: 'Live' },
];

export default function StatsBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="relative py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center justify-center py-8 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
              >
                <span className="text-2xl mb-2">{stat.icon}</span>
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                  {stat.isText ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      {(stat as any).textValue || 'AI'}
                    </motion.span>
                  ) : (
                    <CountUp target={stat.target} suffix={stat.suffix} inView={isInView} />
                  )}
                </div>
                <span className="text-sm text-gray-500 text-center">{stat.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
