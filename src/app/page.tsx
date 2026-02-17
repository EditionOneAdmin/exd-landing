import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';

const ExplorePlatform = dynamic(() => import('@/components/ExplorePlatform'), {
  loading: () => <div className="min-h-[400px]" />,
});
const DataSources = dynamic(() => import('@/components/DataSources'), {
  loading: () => <div className="min-h-[200px]" />,
});
const SocialProof = dynamic(() => import('@/components/SocialProof'), {
  loading: () => <div className="min-h-[400px]" />,
});
const Waitlist = dynamic(() => import('@/components/Waitlist'), {
  loading: () => <div className="min-h-[600px]" />,
});

export default function Home() {
  return (
    <main className="noise-overlay overflow-x-hidden">
      <Hero />
      <ExplorePlatform />
      <DataSources />
      <SocialProof />
      <Waitlist />
    </main>
  );
}
