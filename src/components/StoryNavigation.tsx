'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { STORIES } from '@/lib/stories';

export default function StoryNavigation({ currentSlug }: { currentSlug: string }) {
  const currentIndex = STORIES.findIndex((s) => s.slug === currentSlug);
  const prev = currentIndex > 0 ? STORIES[currentIndex - 1] : null;
  const next = currentIndex < STORIES.length - 1 ? STORIES[currentIndex + 1] : null;

  return (
    <div className="border-t border-white/5 bg-[#050507]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Back to all stories */}
        <div className="text-center mb-12">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>All Stories</span>
          </Link>
        </div>

        {/* Prev / Next */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prev ? (
            <Link href={`/stories/${prev.slug}`}>
              <motion.div
                className="group relative rounded-xl border border-white/5 bg-white/[0.02] p-6 hover:border-white/10 transition-colors h-full"
                whileHover={{ scale: 1.02 }}
              >
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${prev.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">← Previous</p>
                <p className="text-lg font-semibold text-white group-hover:text-indigo-200 transition-colors">
                  {prev.icon} {prev.title}
                </p>
                <p className="text-sm text-zinc-500 mt-1">{prev.readTime}</p>
              </motion.div>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link href={`/stories/${next.slug}`}>
              <motion.div
                className="group relative rounded-xl border border-white/5 bg-white/[0.02] p-6 hover:border-white/10 transition-colors text-right h-full"
                whileHover={{ scale: 1.02 }}
              >
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${next.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Next →</p>
                <p className="text-lg font-semibold text-white group-hover:text-indigo-200 transition-colors">
                  {next.title} {next.icon}
                </p>
                <p className="text-sm text-zinc-500 mt-1">{next.readTime}</p>
              </motion.div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
