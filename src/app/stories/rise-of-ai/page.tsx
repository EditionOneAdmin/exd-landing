'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// ─── Data ────────────────────────────────────────────────────────────

const AI_INVESTMENT = [
  { year: 2015, value: 2 },
  { year: 2016, value: 5 },
  { year: 2017, value: 12 },
  { year: 2018, value: 22 },
  { year: 2019, value: 30 },
  { year: 2020, value: 36 },
  { year: 2021, value: 52 },
  { year: 2022, value: 45 },
  { year: 2023, value: 67 },
  { year: 2024, value: 85 },
  { year: 2025, value: 105 },
];

const ADOPTION_BY_INDUSTRY = [
  { industry: 'Technology', value: 75, color: '#6366f1' },
  { industry: 'Finance', value: 60, color: '#8b5cf6' },
  { industry: 'Healthcare', value: 45, color: '#06b6d4' },
  { industry: 'Manufacturing', value: 35, color: '#ec4899' },
  { industry: 'Education', value: 25, color: '#f59e0b' },
];

const JOBS_DATA = [
  { year: 2020, newJobs: 2, automated: 5 },
  { year: 2021, newJobs: 5, automated: 8 },
  { year: 2022, newJobs: 9, automated: 14 },
  { year: 2023, newJobs: 15, automated: 20 },
  { year: 2024, newJobs: 25, automated: 28 },
  { year: 2025, newJobs: 40, automated: 35 },
  { year: 2026, newJobs: 55, automated: 42 },
  { year: 2027, newJobs: 70, automated: 50 },
  { year: 2028, newJobs: 85, automated: 55 },
  { year: 2030, newJobs: 97, automated: 65 },
];

const MILESTONES = [
  { year: 2017, name: 'Transformer', desc: 'Attention Is All You Need paper', color: '#6366f1' },
  { year: 2018, name: 'BERT', desc: 'Google revolutionizes NLP', color: '#8b5cf6' },
  { year: 2020, name: 'GPT-3', desc: 'OpenAI scales to 175B parameters', color: '#06b6d4' },
  { year: 2021, name: 'GitHub Copilot', desc: 'AI learns to code', color: '#10b981' },
  { year: 2022, name: 'DALL·E 2', desc: 'Text-to-image goes viral', color: '#ec4899' },
  { year: 2022.5, name: 'ChatGPT', desc: 'AI goes mainstream overnight', color: '#f59e0b' },
  { year: 2023, name: 'GPT-4', desc: 'Multimodal reasoning arrives', color: '#6366f1' },
  { year: 2024, name: 'Claude 3', desc: 'Anthropic pushes safety + capability', color: '#8b5cf6' },
  { year: 2024.5, name: 'Sora', desc: 'AI generates photorealistic video', color: '#06b6d4' },
];

// ─── Helpers ─────────────────────────────────────────────────────────

function FadeInText({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ChapterHeading({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <FadeInText className="text-center py-32 md:py-48">
      <div className="text-sm font-mono tracking-[0.3em] uppercase text-indigo-400 mb-4">{number}</div>
      <h2 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">{title}</h2>
      <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
    </FadeInText>
  );
}

function StatCard({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <FadeInText delay={delay} className="glass-card rounded-2xl p-8 text-center">
      <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{value}</div>
      <div className="text-zinc-400 text-sm">{label}</div>
    </FadeInText>
  );
}

// ─── Visualizations ──────────────────────────────────────────────────

function InvestmentTimelineChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 700, h = 360, px = 60, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const maxVal = 120;
  const minYear = 2015, maxYear = 2025;

  const toX = (year: number) => px + ((year - minYear) / (maxYear - minYear)) * cw;
  const toY = (val: number) => py + ch - (val / maxVal) * ch;

  const linePath = AI_INVESTMENT.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(d.value)}`).join(' ');
  const areaPath = linePath + ` L${toX(2025)},${py + ch} L${toX(2015)},${py + ch} Z`;

  // Split actual vs projected at 2024
  const projIdx = AI_INVESTMENT.findIndex(d => d.year === 2024);
  const solidPath = AI_INVESTMENT.slice(0, projIdx + 1).map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(d.value)}`).join(' ');
  const dashedPath = AI_INVESTMENT.slice(projIdx).map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(d.value)}`).join(' ');

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Global AI VC Funding</h3>
      <p className="text-sm text-zinc-500 mb-6">Billions USD (2025 projected)</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          <linearGradient id="aiAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid */}
        {[0, 30, 60, 90, 120].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="rgba(99,102,241,0.1)" strokeDasharray="4 4" />
            <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="11">${v}B</text>
          </g>
        ))}
        {/* Year labels */}
        {[2015, 2017, 2019, 2021, 2023, 2025].map(yr => (
          <text key={yr} x={toX(yr)} y={h - 8} textAnchor="middle" fill="#52525b" fontSize="11">{yr}</text>
        ))}
        {/* Area */}
        <motion.path
          d={areaPath}
          fill="url(#aiAreaGrad)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5 }}
        />
        {/* Solid line */}
        <motion.path
          d={solidPath}
          fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        {/* Dashed projected */}
        <motion.path
          d={dashedPath}
          fill="none" stroke="#818cf8" strokeWidth="3" strokeDasharray="8 4" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.8 } : {}}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
        />
        {/* Key points */}
        {AI_INVESTMENT.map((d, i) => (
          <motion.circle
            key={d.year}
            cx={toX(d.year)} cy={toY(d.value)} r="4"
            fill={d.year <= 2024 ? '#6366f1' : '#818cf8'}
            stroke="#050507" strokeWidth="2"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
          />
        ))}
        {/* Labels for first and last */}
        {[AI_INVESTMENT[0], AI_INVESTMENT[AI_INVESTMENT.length - 1]].map(d => (
          <motion.text
            key={d.year}
            x={toX(d.year)} y={toY(d.value) - 14}
            textAnchor="middle" fill="white" fontSize="12" fontWeight="bold"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
          >
            ${d.value}B
          </motion.text>
        ))}
      </svg>
    </div>
  );
}

function AdoptionBarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <div ref={ref} className="exd-card exd-glow p-6">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">AI Adoption by Industry</h3>
      <p className="text-sm text-zinc-500 mb-6">% of companies using AI in production (2024)</p>
      <div className="space-y-5">
        {ADOPTION_BY_INDUSTRY.map((d, i) => (
          <div key={d.industry}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm text-zinc-300 font-medium">{d.industry}</span>
              <motion.span
                className="text-sm font-bold"
                style={{ color: d.color }}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                {d.value}%
              </motion.span>
            </div>
            <div className="h-3 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${d.color}, ${d.color}88)` }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${d.value}%` } : {}}
                transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JobsImpactChart() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const w = 700, h = 360, px = 60, py = 40;
  const cw = w - 2 * px, ch = h - 2 * py;
  const maxVal = 110;
  const minYear = 2020, maxYear = 2030;

  const toX = (year: number) => px + ((year - minYear) / (maxYear - minYear)) * cw;
  const toY = (val: number) => py + ch - (val / maxVal) * ch;

  const newJobsPath = JOBS_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(d.newJobs)}`).join(' ');
  const automatedPath = JOBS_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(d.year)},${toY(d.automated)}`).join(' ');

  const newJobsArea = newJobsPath + ` L${toX(2030)},${py + ch} L${toX(2020)},${py + ch} Z`;
  const automatedArea = automatedPath + ` L${toX(2030)},${py + ch} L${toX(2020)},${py + ch} Z`;

  return (
    <div ref={ref} className="exd-card exd-glow p-6 overflow-hidden">
      <h3 className="text-xl font-bold exd-gradient-text mb-1">Jobs Impact Forecast</h3>
      <p className="text-sm text-zinc-500 mb-6">Millions of jobs (global estimate)</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          <linearGradient id="newJobsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="autoJobsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid */}
        {[0, 25, 50, 75, 100].map(v => (
          <g key={v}>
            <line x1={px} x2={w - px} y1={toY(v)} y2={toY(v)} stroke="rgba(99,102,241,0.1)" strokeDasharray="4 4" />
            <text x={px - 8} y={toY(v) + 4} textAnchor="end" fill="#52525b" fontSize="11">{v}M</text>
          </g>
        ))}
        {/* Year labels */}
        {[2020, 2022, 2024, 2026, 2028, 2030].map(yr => (
          <text key={yr} x={toX(yr)} y={h - 8} textAnchor="middle" fill="#52525b" fontSize="11">{yr}</text>
        ))}
        {/* Areas */}
        <motion.path d={newJobsArea} fill="url(#newJobsGrad)" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 1.5 }} />
        <motion.path d={automatedArea} fill="url(#autoJobsGrad)" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 1.5 }} />
        {/* Lines */}
        <motion.path
          d={newJobsPath} fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <motion.path
          d={automatedPath} fill="none" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
        />
        {/* Crossover annotation */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 2 }}
        >
          <line x1={toX(2025)} y1={toY(40) - 20} x2={toX(2025)} y2={toY(40) + 20} stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" />
          <text x={toX(2025)} y={toY(maxVal) + 16} textAnchor="middle" fill="#a1a1aa" fontSize="10">Crossover</text>
        </motion.g>
      </svg>
      {/* Legend */}
      <div className="flex gap-6 mt-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-500" />
          <span className="text-xs text-zinc-400">New AI-created jobs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-pink-500" />
          <span className="text-xs text-zinc-400">Automated jobs</span>
        </div>
      </div>
    </div>
  );
}

function MilestonesTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <div ref={ref} className="relative max-w-3xl mx-auto">
      {/* Vertical line */}
      <motion.div
        className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-cyan-500/50"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        style={{ transformOrigin: 'top' }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />
      <div className="space-y-12">
        {MILESTONES.map((m, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={m.name}
              className={`relative flex items-center gap-4 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
              initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
            >
              {/* Content */}
              <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'} ml-12 md:ml-0`}>
                <div className="glass-card rounded-xl p-4 inline-block">
                  <div className="text-xs font-mono text-zinc-500 mb-1">{Math.floor(m.year)}</div>
                  <div className="text-lg font-bold text-white mb-1">{m.name}</div>
                  <div className="text-sm text-zinc-400">{m.desc}</div>
                </div>
              </div>
              {/* Dot */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  className="w-4 h-4 rounded-full border-2 border-[#050507]"
                  style={{ backgroundColor: m.color }}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.15, type: 'spring' }}
                />
              </div>
              {/* Spacer for other side */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────

export default function RiseOfAIStory() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <main className="bg-[#050507] text-white min-h-screen overflow-x-hidden">
      {/* ═══════ HERO ═══════ */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #6366f1, #8b5cf6 30%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Neural network dots */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-indigo-500/30"
              style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
              animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 1.5, 1] }}
              transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>

        <motion.div className="relative z-10 text-center px-6" style={{ opacity: heroOpacity, scale: heroScale }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-sm font-mono tracking-[0.3em] uppercase text-indigo-400 mb-6"
          >
            EXD Data Story
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6"
          >
            <span className="gradient-text">The Rise</span>
            <br />
            <span className="text-white">of AI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10"
          >
            From $2 billion to $100 billion+. How artificial intelligence
            became the most transformative technology of our generation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-zinc-600 text-sm"
          >
            Scroll to explore ↓
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════ CHAPTER 1: THE MONEY ═══════ */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter One"
            title="The Money"
            subtitle="A decade of exponential capital inflow turned AI from a research curiosity into a $100B+ industry."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-16">
            <StatCard value="52×" label="Funding growth (2015→2025)" delay={0} />
            <StatCard value="$105B" label="Projected 2025 VC funding" delay={0.1} />
            <StatCard value="4,500+" label="AI startups funded in 2024" delay={0.2} />
            <StatCard value="$14T" label="Projected GDP impact by 2030" delay={0.3} />
          </div>

          <FadeInText className="max-w-5xl mx-auto mb-20">
            <InvestmentTimelineChart />
          </FadeInText>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              In 2015, AI venture funding was a niche bet — roughly <span className="text-indigo-300 font-semibold">$2 billion</span> globally.
              By 2023, that number had exploded past <span className="text-cyan-300 font-semibold">$67 billion</span>, driven
              by breakthroughs in large language models and generative AI. The trend shows no signs of slowing.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 2: ADOPTION ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Two"
            title="The Adoption Wave"
            subtitle="Every industry is feeling the shift — but some are moving faster than others."
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            <FadeInText delay={0.1}>
              <AdoptionBarChart />
            </FadeInText>
            <FadeInText delay={0.2} className="flex flex-col justify-center">
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">The Uneven Revolution</h3>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  Tech leads adoption at 75%, using AI for everything from code generation to customer support.
                  Finance follows with algorithmic trading and fraud detection.
                  Healthcare, manufacturing, and education are accelerating — but face unique regulatory and infrastructure hurdles.
                </p>
                <ul className="space-y-3 text-zinc-300">
                  {[
                    ['💻', 'Tech: AI-native products, copilots, automation'],
                    ['🏦', 'Finance: Fraud detection, algorithmic trading, risk'],
                    ['🏥', 'Healthcare: Diagnostics, drug discovery, imaging'],
                    ['🏭', 'Manufacturing: Predictive maintenance, QA, robotics'],
                    ['📚', 'Education: Personalized learning, tutoring, grading'],
                  ].map(([icon, text]) => (
                    <li key={text as string} className="flex items-start gap-3">
                      <span className="text-2xl">{icon}</span>
                      <span className="leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInText>
          </div>
        </div>
      </section>

      {/* ═══════ CHAPTER 3: JOBS ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Three"
            title="The Jobs Equation"
            subtitle="AI destroys jobs and creates them — but the crossover point is approaching faster than expected."
          />

          <FadeInText className="max-w-5xl mx-auto mb-16">
            <JobsImpactChart />
          </FadeInText>

          <FadeInText className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-lg text-zinc-400 leading-relaxed">
              By <span className="text-cyan-300 font-semibold">2025</span>, new AI-created roles are projected to
              overtake jobs lost to automation. The net effect is <span className="text-indigo-300 font-semibold">positive</span> —
              but only for those who adapt. Prompt engineers, AI trainers, ethics specialists, and data curators
              represent entirely new career categories that didn&apos;t exist five years ago.
            </p>
          </FadeInText>
        </div>
      </section>

      {/* ═══════ CHAPTER 4: MILESTONES ═══════ */}
      <section className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <ChapterHeading
            number="Chapter Four"
            title="The Milestones"
            subtitle="Key breakthroughs that defined the AI era — each one building on the last."
          />

          <div className="mb-32">
            <MilestonesTimeline />
          </div>
        </div>
      </section>

      {/* ═══════ CLOSING ═══════ */}
      <section className="relative py-40 md:py-56">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, #6366f1, transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeInText>
            <div className="text-sm font-mono tracking-[0.3em] uppercase text-indigo-400 mb-6">The Horizon</div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 gradient-text">Intelligence Is Everywhere</h2>
          </FadeInText>

          <FadeInText delay={0.2}>
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              We are at the beginning, not the end. Every model is getting smarter.
              Every industry is getting reshaped. Every assumption is being challenged.
            </p>
          </FadeInText>

          <FadeInText delay={0.3}>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-12">
              The question isn&apos;t whether AI will transform your world.
              It&apos;s whether you&apos;ll be ready when it does.
            </p>
          </FadeInText>

          <FadeInText delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-semibold transition-colors shadow-lg shadow-indigo-600/30"
              >
                Explore More Stories
              </a>
              <a
                href="/stories/dooh-revolution/"
                className="px-8 py-4 border border-zinc-700 hover:border-zinc-500 rounded-xl text-zinc-300 hover:text-white font-semibold transition-colors"
              >
                Next: The DOOH Revolution
              </a>
            </div>
          </FadeInText>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-zinc-600 text-sm">
        <p>Built with EXD — Data you don&apos;t just see. You feel.</p>
      </footer>
    </main>
  );
}
