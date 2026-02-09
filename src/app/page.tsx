import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Problem from '@/components/Problem';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="noise-overlay">
      <Navigation />
      <Hero />
      <Problem />
      <Features />
      <HowItWorks />
      <Waitlist />
      <Footer />
    </main>
  );
}
