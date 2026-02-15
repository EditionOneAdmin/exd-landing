import Hero from '@/components/Hero';
import ExplorePlatform from '@/components/ExplorePlatform';
import DataSources from '@/components/DataSources';
import SocialProof from '@/components/SocialProof';
import Waitlist from '@/components/Waitlist';

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
