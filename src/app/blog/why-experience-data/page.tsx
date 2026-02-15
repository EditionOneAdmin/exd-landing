'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function WhyExperienceDataPost() {
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
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              Vision
            </span>
            <span className="text-gray-500 text-sm">Feb 15, 2025</span>
            <span className="text-gray-600 text-sm">·</span>
            <span className="text-gray-500 text-sm">6 min read</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            Why Experience Data is the Next Frontier
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Traditional data tells you what happened. Experience data tells you what it felt like. Here&apos;s why that distinction will reshape entire industries.
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
            <section>
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">The Data Gap Nobody Talks About</h2>
              <p>
                We live in an era of unprecedented data abundance. Every click, transaction, and GPS ping is captured, stored, and analyzed. Companies know what you bought, where you went, and how long you stayed. But there&apos;s a massive blind spot in all of this data: <em className="text-indigo-300">how did it actually feel to be there?</em>
              </p>
              <p className="mt-4">
                Think about the last time you visited a new neighborhood. You probably formed an opinion within minutes — the energy of the streets, the quality of light, the noise level, the sense of safety. These impressions drove real decisions: whether to return, whether to recommend it, whether to move there. Yet none of this &quot;experience&quot; is captured in any dataset that exists today.
              </p>
              <p className="mt-4">
                This is the gap that Experience Data (EXD) was built to close.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">What Is Experience Data?</h2>
              <p>
                Experience Data is a new category of structured information that quantifies how humans perceive and interact with physical spaces. It goes beyond foot traffic counts or weather forecasts. Instead, it fuses dozens of real-time environmental signals — air quality, noise levels, walkability, visual aesthetics, crowd density, greenery, accessibility, cultural vibrancy — into a unified, queryable layer.
              </p>
              <p className="mt-4">
                Imagine being able to ask: &quot;What are the most peaceful neighborhoods in Berlin on a Sunday morning?&quot; or &quot;Where in London has the best combination of walkability, cafe culture, and low pollution?&quot; These aren&apos;t opinion-based questions anymore — they&apos;re data-driven queries that EXD can answer.
              </p>
              <p className="mt-4">
                We call the output an <strong className="text-white">Experience Score</strong> — a composite, real-time metric that captures the multidimensional quality of a place at any given moment.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">Why Now?</h2>
              <p>
                Three converging forces make this the right time for experience data:
              </p>
              <ul className="list-none space-y-4 mt-4 pl-0">
                <li className="flex gap-3">
                  <span className="text-indigo-400 font-bold shrink-0">01</span>
                  <span><strong className="text-white">Sensor proliferation.</strong> IoT devices, satellite imagery, street-level cameras, and environmental monitors are generating spatial data at a scale that was unimaginable five years ago. The raw inputs exist — they just haven&apos;t been synthesized into something meaningful.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-400 font-bold shrink-0">02</span>
                  <span><strong className="text-white">AI maturity.</strong> Large language models and computer vision can now interpret qualitative signals — the &quot;feel&quot; of a streetscape, the aesthetic quality of architecture, the vibrancy of a commercial district — and convert them into structured metrics. What was subjective is becoming measurable.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-indigo-400 font-bold shrink-0">03</span>
                  <span><strong className="text-white">Demand from every industry.</strong> Real estate firms want to price &quot;neighborhood quality.&quot; Advertisers want to place DOOH screens based on audience mood. City planners want to optimize for citizen wellbeing, not just traffic flow. The market pull is enormous and cross-cutting.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">The Industries That Will Transform First</h2>
              <p>
                Experience data isn&apos;t a niche product — it&apos;s horizontal infrastructure. But some industries will feel the impact sooner:
              </p>
              <p className="mt-4">
                <strong className="text-white">Real Estate & PropTech:</strong> Property valuation has always relied on comparables, square footage, and location proxies like zip codes. EXD adds the missing dimension — the lived quality of a place. A quiet, tree-lined street and a noisy arterial road in the same zip code are not equivalent, and now we can prove it with data.
              </p>
              <p className="mt-4">
                <strong className="text-white">Media & Advertising:</strong> Out-of-home advertising has traditionally been bought on estimated impressions. EXD enables contextual targeting based on real-time environmental conditions — serving a cozy coffee ad when it&apos;s cold and rainy, or a fitness ad near parks on sunny mornings.
              </p>
              <p className="mt-4">
                <strong className="text-white">Smart Cities:</strong> Most smart city initiatives optimize for efficiency — shorter commutes, better traffic flow, lower energy use. EXD adds the human layer: are citizens actually <em className="text-indigo-300">enjoying</em> their city? Which interventions improve quality of life, not just throughput?
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">From Dashboards to Decisions</h2>
              <p>
                Data is only valuable if it changes decisions. That&apos;s why EXD isn&apos;t just a data provider — we&apos;re building an intelligence layer. Our AI Copilot lets analysts ask natural-language questions and get instant, source-backed answers. Our API integrates directly into existing workflows. Our Experience Scores plug into valuation models, ad platforms, and urban planning tools.
              </p>
              <p className="mt-4">
                The goal isn&apos;t more dashboards. It&apos;s better decisions — faster, more nuanced, and grounded in how people actually experience the world.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">What&apos;s Next</h2>
              <p>
                We&apos;re currently in early access, working with select partners across real estate, media, and urban tech to refine the EXD platform. Early results are promising: partners report that experience scores correlate strongly with property premiums, ad engagement rates, and citizen satisfaction surveys — validating that this data captures something real and actionable.
              </p>
              <p className="mt-4">
                This is just the beginning. As our sensor network grows and our models improve, the resolution and coverage of experience data will compound. We envision a future where every location on Earth has a living, breathing experience profile — updated in real time, queryable by anyone.
              </p>
              <p className="mt-4">
                The world doesn&apos;t need more data. It needs better data — data that captures what it&apos;s actually like to be somewhere. That&apos;s what we&apos;re building.
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
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center shrink-0">
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
            href="https://twitter.com/intent/tweet?text=Why%20Experience%20Data%20is%20the%20Next%20Frontier&url="
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
          className="text-center p-10 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-indigo-500/[0.06] to-purple-500/[0.06]"
        >
          <h3 className="text-2xl font-bold text-white mb-3">Ready to explore experience data?</h3>
          <p className="text-gray-400 mb-6">Join our early access program and be among the first to build with EXD.</p>
          <a
            href="https://form.typeform.com/to/exd-early-access"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-8 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
          >
            Join the Waitlist
          </a>
        </motion.div>
      </article>
    </main>
  );
}
