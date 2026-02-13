export interface Story {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  gradient: string;
  icon: string;
}

export const STORIES: Story[] = [
  {
    slug: 'world-in-50-years',
    title: 'The World in 50 Years',
    description: 'How population shifts, economic power, and climate change will reshape our planet by 2075.',
    category: 'Economy',
    readTime: '8 min',
    gradient: 'from-indigo-500 to-purple-600',
    icon: '🌍',
  },
  {
    slug: 'dooh-revolution',
    title: 'The DOOH Revolution',
    description: 'Digital Out-of-Home advertising is transforming how brands reach audiences in the physical world.',
    category: 'Tech',
    readTime: '6 min',
    gradient: 'from-pink-500 to-rose-600',
    icon: '📺',
  },
  {
    slug: 'rise-of-ai',
    title: 'The Rise of AI',
    description: 'From transformers to trillion-parameter models — the exponential acceleration of artificial intelligence.',
    category: 'Tech',
    readTime: '7 min',
    gradient: 'from-violet-500 to-indigo-600',
    icon: '🤖',
  },
  {
    slug: 'energy-transition',
    title: 'The Energy Transition',
    description: 'Tracking the global shift from fossil fuels to renewables — progress, setbacks, and the road ahead.',
    category: 'Climate',
    readTime: '7 min',
    gradient: 'from-emerald-500 to-teal-600',
    icon: '⚡',
  },
  {
    slug: 'global-urbanization',
    title: 'Global Urbanization',
    description: 'By 2050, two-thirds of humanity will live in cities. What does that mean for infrastructure and life?',
    category: 'Economy',
    readTime: '6 min',
    gradient: 'from-amber-500 to-orange-600',
    icon: '🏙️',
  },
  {
    slug: 'smart-cities',
    title: 'Smart Cities',
    description: 'How IoT, AI, and data are building the intelligent, connected cities of tomorrow.',
    category: 'Tech',
    readTime: '6 min',
    gradient: 'from-cyan-500 to-blue-600',
    icon: '🏗️',
  },
  {
    slug: 'global-health',
    title: 'Global Health',
    description: 'Pandemics, life expectancy, and the data behind humanity\'s greatest health challenges.',
    category: 'Health',
    readTime: '7 min',
    gradient: 'from-red-500 to-pink-600',
    icon: '🏥',
  },
  {
    slug: 'global-finance',
    title: 'The Pulse of Global Finance',
    description: 'Inflation heatmaps, interest rate cycles, market cap races, and sovereign debt — the forces driving the world economy.',
    category: 'Economy',
    readTime: '8 min',
    gradient: 'from-indigo-500 to-cyan-600',
    icon: '💹',
  },
  {
    slug: 'ai-revolution',
    title: 'The AI Revolution in Numbers',
    description: 'Investment surges, compute explosions, job market shifts, and global AI readiness — the data behind the biggest technological transformation of our time.',
    category: 'Tech',
    readTime: '9 min',
    gradient: 'from-purple-500 to-cyan-600',
    icon: '🧠',
  },
  {
    slug: 'real-estate',
    title: 'Real Estate Transformed',
    description: 'How data and technology are reshaping property markets, valuations, and urban development.',
    category: 'Real Estate',
    readTime: '6 min',
    gradient: 'from-sky-500 to-indigo-600',
    icon: '🏠',
  },
];

export const CATEGORIES = ['All', 'Economy', 'Climate', 'Health', 'Tech', 'Real Estate'];
