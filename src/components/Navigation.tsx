'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(5, 5, 7, 0)', 'rgba(5, 5, 7, 0.8)']
  );
  
  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(20px)']
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      style={{
        backgroundColor,
        backdropFilter: backdropBlur,
        WebkitBackdropFilter: backdropBlur,
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#"
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-lg opacity-80" />
            <div className="absolute inset-[2px] bg-[#050507] rounded-[6px] flex items-center justify-center">
              <span className="text-sm font-bold gradient-text">E</span>
            </div>
          </div>
          <span className="text-lg font-bold text-white">EXD</span>
        </motion.a>

        {/* Navigation links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Experience', href: '#experience' },
            { label: 'Data', href: '#data-library' },
            { label: 'Use Cases', href: '#use-cases' },
            { label: 'Demo', href: '#demo' },
            { label: 'AI Copilot', href: '#ai-copilot' },
            { label: 'Stories', href: '/stories' },
            { label: 'Dashboard', href: '/dashboard/' },
          ].map((link, i) => (
            <motion.a
              key={i}
              href={link.href}
              className="text-sm text-gray-400 hover:text-white transition-colors"
              whileHover={{ y: -2 }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* CTA + Mobile menu button */}
        <div className="flex items-center gap-3">
          <motion.a
            href="#waitlist"
            className={`hidden sm:inline-flex px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              isScrolled
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join Waitlist
          </motion.a>
          
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-[#050507]/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {[
                { label: 'Experience', href: '#experience' },
                { label: 'Data', href: '#data-library' },
                { label: 'Use Cases', href: '#use-cases' },
                { label: 'Demo', href: '#demo' },
                { label: 'AI Copilot', href: '#ai-copilot' },
                { label: 'Stories', href: '/stories' },
                { label: 'Dashboard', href: '/dashboard/' },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#waitlist"
                className="mt-2 px-5 py-2.5 rounded-full text-sm font-medium text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Join Waitlist
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
