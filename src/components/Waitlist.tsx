'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'exd-waitlist-emails';

function getStoredEmails(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function storeEmail(email: string) {
  const emails = getStoredEmails();
  if (!emails.includes(email)) {
    emails.push(email);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
  }
}

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

export default function Waitlist() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [signupCount, setSignupCount] = useState(47);

  useEffect(() => {
    const stored = getStoredEmails();
    setSignupCount(47 + stored.length);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 1200));

    storeEmail(email);
    setSignupCount((c) => c + 1);
    setStatus('success');
    setEmail('');
  };

  return (
    <section id="waitlist" className="relative py-32 px-6" ref={ref}>
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
          className="glass-card rounded-3xl p-8 md:p-12 text-center overflow-hidden"
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
              Join {signupCount} data enthusiasts on the waitlist
            </motion.p>

            {/* Form */}
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="py-8"
                >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  >
                    <motion.svg
                      className="w-8 h-8 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">You&apos;re on the list! 🎉</h3>
                  <p className="text-gray-400 mb-4">We&apos;ll be in touch soon with exclusive updates.</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4"
                  >
                    Add another email
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="relative max-w-md mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all pr-36"
                      required
                      disabled={status === 'loading'}
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="absolute right-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[length:200%_100%] hover:bg-right"
                      style={{ backgroundPosition: 'left' }}
                    >
                      {status === 'loading' ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        'Join'
                      )}
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 mt-4">
                    No spam, ever. Unsubscribe anytime.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
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
