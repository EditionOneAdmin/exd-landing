'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const values = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: 'Clarity Over Complexity',
    desc: 'We strip away the noise so the signal speaks for itself. Every visualization earns its place.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Speed of Insight',
    desc: 'From question to answer in seconds, not hours. AI-powered analysis meets real-time data.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Global by Default',
    desc: 'Built for every country, every indicator. Data without borders, insights without limits.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Human-Centered',
    desc: 'Behind every data point is a person. We design for empathy, not just efficiency.',
  },
];

const techStack = [
  { name: 'Next.js 15', desc: 'App Router & React 19' },
  { name: 'D3.js', desc: 'Data Visualization' },
  { name: 'World Bank API', desc: 'Global Indicators' },
  { name: 'Framer Motion', desc: 'Fluid Animations' },
  { name: 'AI / LLM', desc: 'Natural Language Queries' },
  { name: 'Tailwind CSS', desc: 'Design System' },
];

export default function AboutPage() {
  return (
    <main className="noise-overlay overflow-x-hidden bg-[#050507] text-white min-h-screen">
      {/* Hero / Mission */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.p
            className="text-sm font-medium tracking-widest uppercase text-indigo-400 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About EXD
          </motion.p>
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Data you don&apos;t just see.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              You feel.
            </span>
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            EXD transforms raw global data into immersive, interactive experiences.
            We believe the world&apos;s most important stories are hidden in numbers — and deserve to be told beautifully.
          </motion.p>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            Vision & Values
          </motion.h2>
          <motion.p
            className="text-gray-400 text-center mb-14 max-w-xl mx-auto"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            The principles that drive everything we build.
          </motion.p>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="group relative p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-indigo-500/30 transition-colors"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i + 2}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  {v.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            Meet the Founder
          </motion.h2>
          <motion.div
            className="relative p-8 sm:p-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm flex flex-col sm:flex-row items-center gap-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            <div className="relative shrink-0 w-28 h-28 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-[2px]">
              <div className="w-full h-full rounded-[14px] bg-[#0a0a0f] flex items-center justify-center">
                <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AH</span>
              </div>
            </div>
            <div className="relative text-center sm:text-left">
              <h3 className="text-xl font-bold">Antonius HYGH</h3>
              <p className="text-sm text-indigo-400 font-medium mt-1">Founder & CEO</p>
              <p className="text-gray-400 text-sm leading-relaxed mt-4">
                Before EXD, Antonius built{' '}
                <span className="text-white font-medium">HYGH</span> — a digital-out-of-home platform powering{' '}
                <span className="text-white font-medium">3,700+ displays across 15 cities</span>.
                That experience taught him one thing: data only matters when people actually understand it.
                EXD is the result — turning the world&apos;s most important datasets into experiences that inform, inspire, and move people to act.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Backed by real-world experience */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-medium mb-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Backed by real-world experience
          </motion.div>
          <motion.h2
            className="text-3xl font-bold mb-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            From billboards to dashboards
          </motion.h2>
          <motion.p
            className="text-gray-400 max-w-2xl mx-auto leading-relaxed"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            HYGH proved that the right content on the right screen changes behavior.
            EXD takes that lesson digital: the right data, visualized the right way, changes understanding.
            We&apos;re not building another chart library — we&apos;re building a new way to experience the world&apos;s data.
          </motion.p>
          <motion.div
            className="mt-10 grid grid-cols-3 gap-6 max-w-md mx-auto"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
          >
            {[
              { stat: '3,700+', label: 'Displays' },
              { stat: '15', label: 'Cities' },
              { stat: '∞', label: 'Data Points' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {s.stat}
                </div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            Tech Stack
          </motion.h2>
          <motion.p
            className="text-gray-400 text-center mb-14 max-w-xl mx-auto"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            Modern tools for modern data experiences.
          </motion.p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {techStack.map((t, i) => (
              <motion.div
                key={t.name}
                className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-cyan-500/20 transition-colors text-center"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i + 2}
              >
                <div className="text-sm font-semibold text-white">{t.name}</div>
                <div className="text-xs text-gray-500 mt-1">{t.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to experience data differently?</h2>
          <p className="text-gray-400 mb-8">Join the waitlist and be first to explore.</p>
          <Link href="/">
            <motion.span
              className="inline-flex px-8 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Early Access
            </motion.span>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
