'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function DOOHGrowthChart() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 300;
    const margin = { top: 30, right: 30, bottom: 40, left: 50 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
    const doohData = [6.0, 4.2, 7.5, 11.2, 15.8, 20.1, 25.4, 31.0];
    const tradData = [28.0, 18.5, 20.2, 22.0, 22.8, 23.1, 23.0, 22.6];

    const x = d3.scaleLinear().domain([2019, 2026]).range([0, w]);
    const y = d3.scaleLinear().domain([0, 35]).range([h, 0]);

    // Grid lines
    g.selectAll('.grid-line')
      .data([0, 10, 20, 30])
      .enter()
      .append('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', (d: number) => y(d)).attr('y2', (d: number) => y(d))
      .attr('stroke', 'rgba(255,255,255,0.06)');

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(x).ticks(8).tickFormat(d3.format('d')))
      .attr('color', 'rgba(255,255,255,0.3)')
      .selectAll('text').attr('fill', 'rgba(255,255,255,0.4)').style('font-size', '11px');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(4).tickFormat((d) => `$${d}B`))
      .attr('color', 'rgba(255,255,255,0.3)')
      .selectAll('text').attr('fill', 'rgba(255,255,255,0.4)').style('font-size', '11px');

    const line = d3.line<number>()
      .x((_, i) => x(years[i]))
      .y((d) => y(d))
      .curve(d3.curveMonotoneX);

    // Traditional OOH line
    g.append('path')
      .datum(tradData)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.25)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6,4')
      .attr('d', line);

    // DOOH line
    const doohPath = g.append('path')
      .datum(doohData)
      .attr('fill', 'none')
      .attr('stroke', 'url(#dooh-gradient)')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Gradient
    const defs = svg.append('defs');
    const grad = defs.append('linearGradient').attr('id', 'dooh-gradient').attr('x1', '0%').attr('x2', '100%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#818cf8');
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#a78bfa');

    // Animate DOOH line
    const totalLength = (doohPath.node() as SVGPathElement)?.getTotalLength() || 0;
    doohPath
      .attr('stroke-dasharray', totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Dots on DOOH
    g.selectAll('.dooh-dot')
      .data(doohData)
      .enter()
      .append('circle')
      .attr('cx', (_, i) => x(years[i]))
      .attr('cy', (d: number) => y(d))
      .attr('r', 3)
      .attr('fill', '#a78bfa')
      .attr('opacity', 0)
      .transition()
      .delay((_, i) => 200 * i)
      .duration(300)
      .attr('opacity', 1);

    // Legend
    const legend = g.append('g').attr('transform', `translate(${w - 180}, -10)`);
    legend.append('line').attr('x1', 0).attr('x2', 20).attr('y1', 0).attr('y2', 0).attr('stroke', '#a78bfa').attr('stroke-width', 3);
    legend.append('text').attr('x', 26).attr('y', 4).text('DOOH').attr('fill', 'rgba(255,255,255,0.6)').style('font-size', '11px');
    legend.append('line').attr('x1', 80).attr('x2', 100).attr('y1', 0).attr('y2', 0).attr('stroke', 'rgba(255,255,255,0.25)').attr('stroke-width', 2).attr('stroke-dasharray', '6,4');
    legend.append('text').attr('x', 106).attr('y', 4).text('Traditional OOH').attr('fill', 'rgba(255,255,255,0.4)').style('font-size', '11px');

  }, []);

  return (
    <div className="my-10 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
      <h3 className="text-sm font-medium text-gray-400 mb-4 text-center">DOOH vs Traditional OOH — Global Market Size ($B)</h3>
      <svg ref={svgRef} className="w-full" />
      <p className="text-xs text-gray-600 mt-3 text-center">Sources: Statista, PwC Global Entertainment & Media Outlook, OAAA. 2025–26 projected.</p>
    </div>
  );
}

export default function DOOHEatingAdvertisingPost() {
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
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              Industry
            </span>
            <span className="text-gray-500 text-sm">Feb 17, 2025</span>
            <span className="text-gray-600 text-sm">·</span>
            <span className="text-gray-500 text-sm">5 min read</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            How DOOH is Eating Traditional Advertising
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Digital Out-of-Home is growing at 12% CAGR while static billboards flatline. Here&apos;s why the shift is accelerating — and why experience data will define the next wave.
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
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">The Billboard is Dead. Long Live the Screen.</h2>
              <p>
                For decades, out-of-home advertising meant one thing: a static image on a roadside billboard, bought months in advance, measured by rough traffic estimates, and impossible to change once printed. It was the bluntest instrument in the marketer&apos;s toolkit — but it worked well enough because there was nothing better.
              </p>
              <p className="mt-4">
                That era is ending. Digital Out-of-Home (DOOH) is reshaping the entire landscape with the speed and precision of digital advertising, deployed in the physical world. The numbers tell a stark story: the global DOOH market is growing at a <strong className="text-white">12% compound annual growth rate (CAGR)</strong>, on track to surpass $35 billion by 2028. Meanwhile, traditional static OOH is stagnating — growing at barely 1-2% annually, essentially flat when adjusted for inflation.
              </p>
            </section>

            <DOOHGrowthChart />

            <section>
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">Programmatic: The Accelerant</h2>
              <p>
                The real revolution isn&apos;t just digital screens replacing paper posters — it&apos;s <em className="text-amber-300">programmatic</em> buying hitting out-of-home. Programmatic DOOH spend has grown over <strong className="text-white">100% year-over-year</strong> since 2021, according to VIOOH and Hivestack data. This means advertisers can now buy, target, and optimize outdoor campaigns with the same real-time precision they use for online display ads.
              </p>
              <p className="mt-4">
                The implications are profound. A coffee brand can serve ads on screens near office buildings at 7:30 AM on cold mornings. A fitness chain can target transit hubs during New Year&apos;s resolution season. A movie studio can trigger trailer ads within a 2-mile radius of theaters showing their film. This level of contextual, time-based targeting was science fiction for traditional OOH — for programmatic DOOH, it&apos;s table stakes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">Why Advertisers Are Shifting Budgets</h2>
              <p>
                The migration from traditional OOH to DOOH is being driven by three hard advantages that static simply can&apos;t match:
              </p>
              <ul className="list-none space-y-4 mt-4 pl-0">
                <li className="flex gap-3">
                  <span className="text-amber-400 font-bold shrink-0">01</span>
                  <span><strong className="text-white">Dynamic creative.</strong> DOOH screens can rotate multiple campaigns per hour, adapt creative to weather or time of day, and A/B test messaging in real time. A single screen generates 10-20x more revenue than a static billboard because it serves multiple advertisers simultaneously.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400 font-bold shrink-0">02</span>
                  <span><strong className="text-white">Measurable impressions.</strong> Mobile device data and computer vision now allow DOOH networks to report verified audience counts, dwell time, and demographic breakdowns. Traditional OOH relied on traffic surveys updated once a year — DOOH offers near-real-time reporting.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-400 font-bold shrink-0">03</span>
                  <span><strong className="text-white">Self-serve access.</strong> The old OOH market was dominated by a handful of media owners who required six-figure minimums and months of lead time. New platforms have democratized access, letting businesses of any size launch campaigns in minutes with budgets starting under €100.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">Case in Point: HYGH</h2>
              <p>
                One of the clearest examples of DOOH&apos;s disruptive potential is <strong className="text-white">HYGH</strong>, a Berlin-based platform that has built a network of over <strong className="text-white">3,700 digital screens across 15 cities</strong> in Germany. Through its self-serve platform, any advertiser — from local restaurants to national brands — can book screen time programmatically, generating <strong className="text-white">226 million weekly contacts</strong>.
              </p>
              <p className="mt-4">
                What makes HYGH significant isn&apos;t just scale — it&apos;s the model. By aggregating fragmented screen inventory into a single, accessible marketplace, HYGH has lowered the barrier to entry for OOH advertising by an order of magnitude. Small businesses that could never afford a billboard can now run hyper-local digital campaigns in high-traffic locations. The result: a long tail of advertisers that traditional OOH never captured.
              </p>
              <p className="mt-4">
                This democratization mirrors what Google Ads did to print advertising in the 2000s — and the parallels are not accidental.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">The Missing Layer: Experience Data</h2>
              <p>
                DOOH has solved distribution and targeting. But there&apos;s still a massive gap: <em className="text-amber-300">context beyond location</em>. Knowing that a screen is on Friedrichstraße tells you where, but not what the environment feels like at that moment. Is the area buzzing or dead? Are people rushing or lingering? Is the atmosphere premium or gritty?
              </p>
              <p className="mt-4">
                This is where Experience Data (EXD) enters the picture. By layering real-time environmental intelligence — crowd energy, noise levels, weather impact, foot traffic quality, ambiance scores — onto DOOH networks, advertisers can move from <strong className="text-white">location-based targeting to experience-based targeting</strong>.
              </p>
              <p className="mt-4">
                Imagine serving a luxury brand&apos;s ad only when the ambient experience around the screen scores high for &quot;premium feel&quot; — or a nightlife ad when energy and social density peak. This is the next frontier: ads that don&apos;t just appear in the right place, but in the right <em className="text-amber-300">moment</em>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-12 mb-4">The Tipping Point</h2>
              <p>
                We&apos;re approaching a tipping point where DOOH will surpass traditional OOH in total market share within the next 3–5 years. Several catalysts are converging: 5G enabling richer, real-time creative; retail media networks adding in-store screens at enormous scale; and the continued fragmentation of digital attention making physical-world advertising more valuable by contrast.
              </p>
              <p className="mt-4">
                The winners won&apos;t just be screen owners — they&apos;ll be the platforms that combine screen access with intelligent targeting powered by real-world data. The future of outdoor advertising isn&apos;t bigger billboards. It&apos;s smarter screens, powered by experience data, delivering the right message at the right moment to the right audience.
              </p>
              <p className="mt-4">
                Traditional advertising isn&apos;t being replaced. It&apos;s being eaten — one smart screen at a time.
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
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center shrink-0">
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
            href="https://twitter.com/intent/tweet?text=How%20DOOH%20is%20Eating%20Traditional%20Advertising&url="
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
          className="text-center p-10 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-amber-500/[0.06] to-orange-500/[0.06]"
        >
          <h3 className="text-2xl font-bold text-white mb-3">Want experience-powered DOOH targeting?</h3>
          <p className="text-gray-400 mb-6">Join our waitlist and be among the first to layer real-time experience data onto your outdoor campaigns.</p>
          <a
            href="https://form.typeform.com/to/exd-early-access"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-8 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/20 transition-all"
          >
            Join the Waitlist
          </a>
        </motion.div>
      </article>
    </main>
  );
}
