'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const stats = [
  { value: '68%', label: 'of world population urban by 2050', source: 'UN DESA' },
  { value: '4.4B', label: 'people living in cities today', source: 'World Bank' },
  { value: '$2.5T', label: 'smart city market by 2030', source: 'Grand View Research' },
  { value: '<3%', label: 'of city budgets spent on quality-of-life metrics', source: 'McKinsey' },
];

const sensorData = [
  { icon: '🔊', name: 'Noise Levels', desc: 'Decibel mapping across neighborhoods reveals that prolonged exposure above 55 dB reduces well-being by up to 15%. Most cities lack granular noise data beyond airport flight paths.', metric: '55 dB WHO threshold' },
  { icon: '🌬️', name: 'Air Quality', desc: 'PM2.5 and NO₂ concentrations at street level can vary 8x within a single city block. Citywide averages mask the micro-environments people actually breathe in.', metric: '8x variance per block' },
  { icon: '🌳', name: 'Green Space Access', desc: 'Residents within 300m of green space report 20% higher life satisfaction. Yet most cities measure park acreage, not actual accessibility or quality of green zones.', metric: '300m access radius' },
  { icon: '🚶', name: 'Walkability', desc: 'Walkable neighborhoods generate 2.4x more retail revenue per square meter. Walkability scores combine sidewalk width, shade, obstacles, and pedestrian density.', metric: '2.4x retail uplift' },
];

const caseStudies = [
  {
    city: 'Copenhagen',
    flag: '🇩🇰',
    headline: 'The Cycling Experience Index',
    body: 'Copenhagen doesn\'t just count cyclists — it measures the cycling experience. Sensors track wind exposure, intersection wait times, surface quality, and perceived safety. The result: targeted infrastructure investments that increased cycling modal share to 49% of commutes, up from 36% in 2012. The city saves an estimated €0.16 per kilometer cycled in health and environmental costs.',
    stat: '49% cycling modal share',
  },
  {
    city: 'Barcelona',
    flag: '🇪🇸',
    headline: 'Superblocks & Livability Scores',
    body: 'Barcelona\'s Superblock program reclaims streets from cars and returns them to residents. But what made it work was data: noise sensors, air quality monitors, and pedestrian counters proved that superblocks reduced NO₂ by 25%, cut noise by 5 dB, and increased pedestrian activity by 10%. Experience data turned a political gamble into evidence-based policy.',
    stat: '25% NO₂ reduction',
  },
  {
    city: 'Singapore',
    flag: '🇸🇬',
    headline: 'The Digital Twin Approach',
    body: 'Singapore\'s Virtual Singapore project creates a 3D digital twin of the entire city-state, layered with real-time environmental data. Urban planners simulate how new buildings affect wind corridors, shadow patterns, and heat islands before breaking ground. This experience-first approach has helped maintain livability despite adding 700,000 residents in the last decade.',
    stat: '700K residents absorbed',
  },
];

export default function SmartCitiesExperienceLayerPost() {
  return (
    <main className="min-h-screen bg-[#050507] noise-overlay pt-32 pb-24 px-6">
      <article className="max-w-3xl mx-auto">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-sm mb-10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
              Use Cases
            </span>
            <span className="text-gray-500 text-sm">Feb 17, 2025</span>
            <span className="text-gray-600 text-sm">·</span>
            <span className="text-gray-500 text-sm">5 min read</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            Smart Cities Need an Experience Layer
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Urban planning optimizes for traffic and infrastructure. But 68% of the world&apos;s population will live in cities by 2050 — and nobody is systematically measuring what it actually <em className="text-emerald-300">feels like</em> to live there.
          </p>
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <div className="space-y-8 text-gray-300 leading-relaxed">

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-10">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center"
                >
                  <div className="text-2xl font-bold text-emerald-400">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                  <div className="text-[10px] text-gray-700 mt-1">{s.source}</div>
                </motion.div>
              ))}
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">The Infrastructure Trap</h2>
              <p>
                Smart cities have been a buzzword for over a decade. Governments have poured billions into IoT sensors, traffic management systems, and digital infrastructure. Yet most &quot;smart city&quot; initiatives measure the same things: vehicle throughput, energy consumption, water pressure, waste collection efficiency.
              </p>
              <p className="mt-4">
                These are important metrics — but they optimize for <em>systems</em>, not <em>people</em>. A city can have world-class traffic flow and still feel hostile to live in. It can hit every sustainability KPI while its residents report declining quality of life. The problem isn&apos;t a lack of data. It&apos;s a lack of the <strong className="text-white">right</strong> data.
              </p>
              <p className="mt-4">
                According to the UN Department of Economic and Social Affairs, <strong className="text-white">68% of the world&apos;s population will live in urban areas by 2050</strong>, up from 56% today. That&apos;s an additional 2.5 billion urban residents in the next 25 years. The cities that thrive won&apos;t be the ones with the most sensors — they&apos;ll be the ones that measure what matters to the humans living in them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">What an Experience Layer Measures</h2>
              <p>
                An experience layer captures the environmental signals that directly affect how people perceive and interact with urban space. Not traffic counts — but whether a street feels safe to walk at night. Not average temperature — but whether a park provides relief on a hot day.
              </p>

              <div className="space-y-4 mt-8">
                {sensorData.map((s, i) => (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex gap-4"
                  >
                    <span className="text-2xl shrink-0">{s.icon}</span>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-white font-semibold">{s.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{s.metric}</span>
                      </div>
                      <p className="text-sm text-gray-400 m-0">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="mt-6">
                These signals, combined and scored in real time, create an <strong className="text-white">Experience Index</strong> — a living, breathing measure of what it&apos;s like to be in a specific place at a specific moment. This is the layer smart cities are missing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">Cities Leading the Way</h2>
              <p>
                A handful of cities have started building fragments of an experience layer — even if they don&apos;t call it that. Their results offer a roadmap for what&apos;s possible.
              </p>

              <div className="space-y-6 mt-8">
                {caseStudies.map((cs, i) => (
                  <motion.div
                    key={cs.city}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.15 }}
                    className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{cs.flag}</span>
                      <h3 className="text-lg font-semibold text-white m-0">{cs.city}: {cs.headline}</h3>
                    </div>
                    <p className="text-gray-400 text-sm m-0">{cs.body}</p>
                    <div className="mt-3 inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
                      {cs.stat}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">Why This Hasn&apos;t Been Done Before</h2>
              <p>
                The challenge isn&apos;t technical — it&apos;s structural. Experience data requires integrating signals from dozens of heterogeneous sources: environmental sensors, mobile devices, satellite imagery, citizen reports, social media sentiment, and more. Each city has different vendors, protocols, and data formats. There&apos;s no standard &quot;experience API&quot; for urban environments.
              </p>
              <p className="mt-4">
                Until now, the only way to get a holistic view of urban experience was through expensive, manual surveys conducted once a year. The result: cities make billion-dollar infrastructure decisions based on data that&apos;s 12 months old and aggregated to a level that masks neighborhood-by-neighborhood reality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">How EXD Makes It Possible</h2>
              <p>
                This is exactly the problem <strong className="text-white">EXD</strong> is built to solve. Our platform ingests, normalizes, and scores real-time environmental data from any source — IoT sensors, satellite feeds, mobile SDKs, open data portals — and transforms it into a unified experience layer accessible through a single API.
              </p>
              <ul className="list-none space-y-4 mt-4 pl-0">
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold shrink-0">01</span>
                  <span><strong className="text-white">Universal ingestion.</strong> Connect any sensor, any protocol, any city. EXD normalizes heterogeneous data streams into a consistent experience schema — no custom integration work.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold shrink-0">02</span>
                  <span><strong className="text-white">Real-time scoring.</strong> Raw sensor data becomes actionable experience scores: livability indices, comfort ratings, safety perceptions — updated continuously, queryable by location and time.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold shrink-0">03</span>
                  <span><strong className="text-white">Spatial resolution.</strong> Not city-level averages, but block-by-block, hour-by-hour experience maps. Planners see exactly where interventions will have the most impact on residents&apos; daily lives.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-400 font-bold shrink-0">04</span>
                  <span><strong className="text-white">Developer-first.</strong> A clean REST API and SDKs let city platforms, mobility apps, and real estate tools integrate experience data in days, not months.</span>
                </li>
              </ul>
              <p className="mt-6">
                The result: cities can finally measure, map, and optimize for the thing that matters most — <em className="text-emerald-300">how it feels to live there</em>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">The Bottom Line</h2>
              <p>
                Smart cities have spent a decade optimizing for machines. The next decade will be about optimizing for humans. The cities that build an experience layer — one that captures, scores, and acts on the lived reality of their residents — will attract talent, investment, and growth. The ones that don&apos;t will have efficient infrastructure that nobody wants to live near.
              </p>
              <p className="mt-4">
                The data is already there. What&apos;s been missing is the platform to make it legible, actionable, and real-time. That&apos;s what we&apos;re building.
              </p>
            </section>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-16" />

        {/* Author Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-5 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] mb-12"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <p className="text-white font-semibold">EXD Team</p>
            <p className="text-gray-500 text-sm">Building the experience data layer for the physical world.</p>
          </div>
        </motion.div>

        {/* Share */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-gray-500 text-sm">Share this post:</span>
          <a
            href="https://twitter.com/intent/tweet?text=Smart%20Cities%20Need%20an%20Experience%20Layer&url="
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a
            href="https://www.linkedin.com/sharing/share-offsite/?url="
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center p-10 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-emerald-500/[0.06] to-teal-500/[0.06]"
        >
          <h3 className="text-2xl font-bold text-white mb-3">Build the experience layer for your city</h3>
          <p className="text-gray-400 mb-6">Join our waitlist and be among the first to turn urban sensor data into actionable experience intelligence.</p>
          <a
            href="https://form.typeform.com/to/exd-early-access"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-8 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
          >
            Join the Waitlist
          </a>
        </motion.div>
      </article>
    </main>
  );
}
