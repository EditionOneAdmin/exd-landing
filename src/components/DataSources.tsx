'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const sources = [
  { name: 'World Bank', desc: 'Global Development Indicators' },
  { name: 'United Nations', desc: 'Population & Demographics' },
  { name: 'Our World in Data', desc: 'Research & Statistics' },
  { name: 'IEA', desc: 'Energy & Climate Data' },
  { name: 'IMF', desc: 'Economic & Financial Data' },
  { name: 'WHO', desc: 'Global Health Statistics' },
];

export default function DataSources() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="relative py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.p
          className="text-sm uppercase tracking-widest text-gray-500 mb-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Built on trusted data from
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-3 md:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {sources.map((source, i) => (
            <motion.div
              key={source.name}
              className="group relative px-5 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-white/[0.12] transition-all duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
            >
              <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                {source.name}
              </span>
              <span className="block text-[11px] text-gray-500 mt-0.5">
                {source.desc}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
