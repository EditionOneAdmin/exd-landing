'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
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
            { label: 'Use Cases', href: '#use-cases' },
            { label: 'Demo', href: '#demo' },
            { label: 'Features', href: '#features' },
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

        {/* CTA */}
        <motion.a
          href="#waitlist"
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            isScrolled
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
              : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Join Waitlist
        </motion.a>
      </div>
    </motion.nav>
  );
}
