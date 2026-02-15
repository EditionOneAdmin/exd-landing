'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative py-16 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <motion.div
              className="flex items-center gap-3 mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-xl opacity-80" />
                <div className="absolute inset-[2px] bg-[#050507] rounded-[10px] flex items-center justify-center">
                  <span className="text-lg font-bold gradient-text">E</span>
                </div>
              </div>
              <span className="text-xl font-bold text-white">EXD</span>
            </motion.div>
            <p className="text-gray-500 max-w-xs mb-6 text-sm">
              Experience Data Platform. Transform how the world sees, feels,
              and understands information.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4">
              {[
                {
                  name: 'Twitter',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  name: 'LinkedIn',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
                {
                  name: 'GitHub',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  ),
                },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-300 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/visualizations" className="text-gray-500 hover:text-gray-300 transition-colors">
                  Visualizations
                </Link>
              </li>
              <li>
                <Link href="/copilot" className="text-gray-500 hover:text-gray-300 transition-colors">
                  AI Copilot
                </Link>
              </li>
              <li>
                <Link href="/use-cases/dooh" className="text-gray-500 hover:text-gray-300 transition-colors">
                  DOOH Use Case
                </Link>
              </li>
              <li>
                <Link href="/use-cases/smart-city" className="text-gray-500 hover:text-gray-300 transition-colors">
                  Smart City Use Case
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Stories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Data Stories</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/stories/world-in-50-years" className="text-gray-500 hover:text-gray-300 transition-colors">
                  The World in 50 Years
                </Link>
              </li>
              <li>
                <Link href="/stories/dooh-revolution" className="text-gray-500 hover:text-gray-300 transition-colors">
                  DOOH Revolution
                </Link>
              </li>
              <li>
                <Link href="/stories/rise-of-ai" className="text-gray-500 hover:text-gray-300 transition-colors">
                  Rise of AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-500 hover:text-gray-300 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-500 hover:text-gray-300 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-gray-500 hover:text-gray-300 transition-colors">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-500 hover:text-gray-300 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            Built with ❤️ by{' '}
            <a href="https://editionone.io" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              Edition One
            </a>{' '}
            · © {new Date().getFullYear()} EXD
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Cookies</a>
          </div>
        </div>

        {/* Decorative tagline */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p className="text-lg text-gray-700 italic">
            &quot;Data you don&apos;t just see. You feel.&quot;
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
