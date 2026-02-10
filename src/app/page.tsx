import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Problem from '@/components/Problem';
import ExperienceData from '@/components/ExperienceData';
import DataLibrary from '@/components/DataLibrary';
import AICopilot from '@/components/AICopilot';
import UseCases from '@/components/UseCases';
import LiveDemo from '@/components/LiveDemo';
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
      <ExperienceData />
      <AICopilot />
      <DataLibrary />
      <UseCases />
      <LiveDemo />
      <Features />
      <HowItWorks />
      <Waitlist />
      <Footer />
    </main>
  );
}
