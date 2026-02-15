'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, FormEvent } from 'react';
import Link from 'next/link';

const FORMSPREE_URL = 'https://formspree.io/f/xpwzgvqk';

const featuredStories = [
  {
    title: 'The World in 50 Years',
    description: 'A data-driven vision of humanity\'s future — population, climate, and technology.',
    href: '/stories/world-in-50-years',
    gradient: 'from-indigo-500 to-cyan-500',
    icon: '🌍',
  },
  {
    title: 'DOOH Revolution',
    description: 'How digital out-of-home is transforming urban landscapes with real-time data.',
    href: '/stories/dooh-revolution',
    gradient: 'from-purple-500 to-pink-500',
    icon: '📺',
  },
  {
    title: 'Rise of AI',
    description: 'The exponential growth of artificial intelligence — visualized like never before.',
    href: '/stories/rise-of-ai',
    gradient: 'from-cyan-500 to-emerald-500',
    icon: '🤖',
  },
];

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function Waitlist() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        const data = await res.json().catch(() => null);
        setErrorMsg(data?.errors?.[0]?.message || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  return (
    <section id="waitlist" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6" ref={ref}>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 text-center overflow-hidden"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

          <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-gray-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Limited Early Access
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Be the first to <span className="gradient-text">experience</span>
            </h2>

            <p className="text-lg text-gray-400 mb-2 max-w-lg mx-auto">
              Join the waitlist for early access. We&apos;re crafting something special,
              and we want you there when it launches.
            </p>

            {/* Social Proof */}
            <motion.p
              className="text-sm text-indigo-300/80 mb-8 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <span className="inline-flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <span
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-[#050507] bg-gradient-to-br from-indigo-400 to-purple-500 inline-block"
                  />
                ))}
              </span>
              Join 500+ data enthusiasts on the waitlist
            </motion.p>

            {/* Waitlist Form */}
            <div className="max-w-md mx-auto">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">You&apos;re on the list! 🎉</h3>
                  <p className="text-gray-400">We&apos;ll notify you when early access opens.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-5 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-white font-medium text-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all bg-[length:200%_100%] hover:bg-right disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                    style={{ backgroundPosition: 'left' }}
                  >
                    {status === 'submitting' ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Joining…
                      </span>
                    ) : 'Get Early Access →'}
                  </button>
                </form>
              )}
              {errorMsg && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 mt-3"
                >
                  {errorMsg}
                </motion.p>
              )}
              {status !== 'success' && (
                <p className="text-sm text-gray-500 mt-4">
                  No spam, ever. Unsubscribe anytime.
                </p>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {[
              { value: '500+', label: 'On Waitlist' },
              { value: 'Q2 2026', label: 'Early Access' },
              { value: '∞', label: 'Possibilities' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Featured Data Stories */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-3">
            Featured <span className="gradient-text">Data Stories</span>
          </h3>
          <p className="text-gray-500 text-center mb-10 max-w-md mx-auto">
            Explore immersive narratives powered by real-world data.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredStories.map((story, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.15, duration: 0.6 }}
              >
                <Link href={story.href} className="block group">
                  <div className="glass-card rounded-2xl p-6 h-full hover:border-white/20 transition-all duration-300 group-hover:-translate-y-1">
                    {/* Gradient accent */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${story.gradient} flex items-center justify-center text-2xl mb-4 opacity-80 group-hover:opacity-100 transition-opacity`}>
                      {story.icon}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                      {story.title}
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {story.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm text-indigo-400 mt-4 group-hover:gap-2 transition-all">
                      Explore story
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
