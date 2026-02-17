'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

type Category = 'Stories' | 'Use Cases' | 'Tools' | 'Pages';

interface SearchItem {
  title: string;
  description: string;
  url: string;
  category: Category;
}

const searchIndex: SearchItem[] = [
  // Pages
  { title: 'Home', description: 'EXD — Experience Data Platform. Data you don\'t just see. You feel.', url: '/', category: 'Pages' },
  { title: 'Dashboard', description: 'Interactive data dashboard with real-time visualizations', url: '/dashboard', category: 'Tools' },
  { title: 'Explore', description: 'Explore datasets and discover insights', url: '/explore', category: 'Tools' },
  { title: 'AI Copilot', description: 'AI-powered data exploration and visualization assistant', url: '/copilot', category: 'Tools' },
  { title: 'Compare', description: 'Compare datasets and metrics side by side', url: '/compare', category: 'Tools' },
  { title: 'Visualizations', description: 'Gallery of interactive data visualizations', url: '/visualizations', category: 'Tools' },
  { title: 'API Docs', description: 'Developer documentation and API reference', url: '/api-docs', category: 'Pages' },
  { title: 'Pricing', description: 'Plans and pricing for EXD platform', url: '/pricing', category: 'Pages' },
  { title: 'About', description: 'About EXD and the team behind it', url: '/about', category: 'Pages' },
  { title: 'Changelog', description: 'Latest updates, features, and improvements', url: '/changelog', category: 'Pages' },
  { title: 'Quiz', description: 'Test your data literacy knowledge', url: '/quiz', category: 'Pages' },
  { title: 'Embed', description: 'Embed EXD visualizations in your website', url: '/embed', category: 'Tools' },

  // Stories
  { title: 'Data Stories', description: 'All data stories — immersive explorations of global trends', url: '/stories', category: 'Stories' },
  { title: 'AI Revolution', description: 'How artificial intelligence is reshaping every industry', url: '/stories/ai-revolution', category: 'Stories' },
  { title: 'Rise of AI', description: 'The meteoric rise of AI adoption worldwide', url: '/stories/rise-of-ai', category: 'Stories' },
  { title: 'Smart Cities', description: 'How data is building the cities of tomorrow', url: '/stories/smart-cities', category: 'Stories' },
  { title: 'Berlin Pulse', description: 'Real-time data portrait of Berlin', url: '/stories/berlin-pulse', category: 'Stories' },
  { title: 'DOOH Revolution', description: 'The digital out-of-home advertising transformation', url: '/stories/dooh-revolution', category: 'Stories' },
  { title: 'Energy Transition', description: 'Global shift towards renewable energy sources', url: '/stories/energy-transition', category: 'Stories' },
  { title: 'Global Finance', description: 'Data-driven exploration of global financial markets', url: '/stories/global-finance', category: 'Stories' },
  { title: 'Global Health', description: 'Worldwide health data trends and insights', url: '/stories/global-health', category: 'Stories' },
  { title: 'Global Urbanization', description: 'The world\'s shift towards urban living', url: '/stories/global-urbanization', category: 'Stories' },
  { title: 'Real Estate', description: 'Data stories about global real estate markets', url: '/stories/real-estate', category: 'Stories' },
  { title: 'World in 50 Years', description: 'Data-driven predictions for the next half century', url: '/stories/world-in-50-years', category: 'Stories' },

  // Use Cases
  { title: 'DOOH Advertising', description: 'Digital out-of-home advertising use cases', url: '/use-cases/dooh', category: 'Use Cases' },
  { title: 'Media & Advertising', description: 'Data visualization for media and advertising', url: '/use-cases/media-advertising', category: 'Use Cases' },
  { title: 'Real Estate Analytics', description: 'Real estate market analysis and visualization', url: '/use-cases/real-estate', category: 'Use Cases' },
  { title: 'Smart City Solutions', description: 'Urban data solutions for smart cities', url: '/use-cases/smart-city', category: 'Use Cases' },
  { title: 'Retail & E-Commerce', description: 'Consumer spending trends, location analytics, and competitive intelligence', url: '/use-cases/retail', category: 'Use Cases' },

  // Blog
  { title: 'Blog', description: 'Insights, updates, and thought leadership from the EXD team', url: '/blog', category: 'Pages' },
  { title: 'Why Experience Data?', description: 'The case for turning raw data into immersive, felt experiences', url: '/blog/why-experience-data', category: 'Pages' },
];

const categoryIcons: Record<Category, string> = {
  Stories: '📖',
  'Use Cases': '🎯',
  Tools: '⚡',
  Pages: '📄',
};

const categoryColors: Record<Category, string> = {
  Stories: 'from-purple-500 to-pink-500',
  'Use Cases': 'from-indigo-500 to-cyan-500',
  Tools: 'from-amber-500 to-orange-500',
  Pages: 'from-gray-400 to-gray-500',
};

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = query.trim()
    ? searchIndex.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : searchIndex;

  const grouped = results.reduce<Record<Category, SearchItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<Category, SearchItem[]>);

  const flatResults = results;

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  // Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? close() : open();
      }
      if (e.key === 'Escape' && isOpen) close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, open, close]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const navigate = useCallback(
    (url: string) => {
      close();
      router.push(url);
    },
    [close, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
      navigate(flatResults[selectedIndex].url);
    }
  };

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  return (
    <>
      {/* Trigger button for Navbar */}
      <button
        onClick={open}
        aria-label="Search (⌘K)"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline text-xs text-gray-500">⌘K</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal content */}
            <motion.div
              role="dialog"
              aria-label="Search"
              aria-modal="true"
              className="relative w-full max-w-xl mx-4 rounded-2xl border border-white/10 shadow-2xl shadow-indigo-500/10 overflow-hidden"
              style={{ background: 'rgba(5, 5, 7, 0.92)', backdropFilter: 'blur(24px)' }}
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                <svg className="w-5 h-5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search pages, stories, tools..."
                  className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none"
                />
                <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium text-gray-500 bg-white/5 border border-white/10">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2 scroll-smooth">
                {flatResults.length === 0 ? (
                  <div className="px-5 py-12 text-center text-gray-500 text-sm">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  Object.entries(grouped).map(([category, items]) => (
                    <div key={category}>
                      <div className="px-5 pt-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                        {categoryIcons[category as Category]} {category}
                      </div>
                      {items.map((item) => {
                        const globalIdx = flatResults.indexOf(item);
                        return (
                          <button
                            key={item.url}
                            data-index={globalIdx}
                            onClick={() => navigate(item.url)}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                              globalIdx === selectedIndex
                                ? 'bg-white/[0.06]'
                                : 'hover:bg-white/[0.03]'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${categoryColors[item.category]} flex items-center justify-center text-white text-xs font-bold shrink-0 opacity-70`}
                            >
                              {item.title.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm text-white truncate">{item.title}</div>
                              <div className="text-xs text-gray-500 truncate">{item.description}</div>
                            </div>
                            {globalIdx === selectedIndex && (
                              <motion.span
                                className="text-[10px] text-gray-600"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                ↵
                              </motion.span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-5 py-2.5 border-t border-white/[0.06] text-[11px] text-gray-600">
                <span>↑↓ navigate</span>
                <span>↵ open</span>
                <span>esc close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
