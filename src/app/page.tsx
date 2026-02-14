import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import DataSources from '@/components/DataSources';
import Problem from '@/components/Problem';
import ExperienceData from '@/components/ExperienceData';
import DataLibrary from '@/components/DataLibrary';
import AICopilot from '@/components/AICopilot';
import UseCases from '@/components/UseCases';
import LiveDemo from '@/components/LiveDemo';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import IndustryUseCases from '@/components/IndustryUseCases';
import Waitlist from '@/components/Waitlist';

export default function Home() {
  return (
    <main className="noise-overlay overflow-x-hidden">
      <Hero />
      <StatsBar />
      <DataSources />
      <Problem />
      <ExperienceData />
      <AICopilot />
      <DataLibrary />
      <UseCases />
      <LiveDemo />
      <Features />
      <HowItWorks />
      <IndustryUseCases />
      <Waitlist />
    </main>
  );
}
