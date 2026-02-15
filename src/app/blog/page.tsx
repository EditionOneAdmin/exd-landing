'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const posts = [
  {
    slug: 'why-experience-data',
    title: 'Why Experience Data is the Next Frontier',
    excerpt: 'Traditional data tells you what happened. Experience data tells you what it felt like. Here\'s why that distinction will reshape entire industries.',
    category: 'Vision',
    date: 'Feb 15, 2025',
    readTime: '6 min read',
    live: true,
  },
  {
    slug: 'building-exd-stack',
    title: 'Building the EXD Stack: Architecture for Real-Time Experience Intelligence',
    excerpt: 'A deep dive into how we process millions of environmental signals per second to create actionable experience scores.',
    category: 'Engineering',
    date: 'Coming Soon',
    readTime: '8 min read',
    live: false,
  },
  {
    slug: 'smart-cities-experience-layer',
    title: 'Smart Cities Need an Experience Layer',
    excerpt: 'Urban planning optimizes for traffic and infrastructure. But what about the human experience of living in a city?',
    category: 'Use Cases',
    date: 'Coming Soon',
    readTime: '5 min read',
    live: false,
  },
];

const categoryColors: Record<string, string> = {
  Vision: 'from-indigo-500 to-purple-500',
  Engineering: 'from-cyan-500 to-blue-500',
  'Use Cases': 'from-emerald-500 to-teal-500',
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#050507] noise-overlay pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Blog
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Insights on experience data, spatial intelligence, and the future of how we measure the world around us.
          </p>
        </motion.div>

        {/* Posts */}
        <div className="flex flex-col gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {post.live ? (
                <Link href={`/blog/${post.slug}`}>
                  <Card post={post} />
                </Link>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm text-gray-300 border border-white/10">
                      Coming Soon
                    </span>
                  </div>
                  <div className="blur-[2px] opacity-50 pointer-events-none">
                    <Card post={post} />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Card({ post }: { post: (typeof posts)[0] }) {
  return (
    <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]">
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${
            categoryColors[post.category] || 'from-gray-500 to-gray-600'
          } text-white`}
        >
          {post.category}
        </span>
        <span className="text-gray-500 text-sm">{post.date}</span>
        <span className="text-gray-600 text-sm">·</span>
        <span className="text-gray-500 text-sm">{post.readTime}</span>
      </div>
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 group-hover:text-indigo-300 transition-colors">
        {post.title}
      </h2>
      <p className="text-gray-400 leading-relaxed">{post.excerpt}</p>
    </div>
  );
}
