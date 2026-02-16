'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const DashboardPage = dynamic(() => import('../dashboard/page'), { ssr: false });
const ComparePage = dynamic(() => import('../compare/page'), { ssr: false });
const RacingBarChart = dynamic(() => import('@/components/visualizations/RacingBarChart'), { ssr: false });
const CO2WorldMap = dynamic(() => import('@/components/visualizations/CO2WorldMap'), { ssr: false });
const BubbleChart = dynamic(() => import('@/components/visualizations/BubbleChart'), { ssr: false });
const PopulationPyramid = dynamic(() => import('@/components/visualizations/PopulationPyramid'), { ssr: false });

const VIZ_MAP: Record<string, { Component: React.ComponentType; title: string }> = {
  'racing-bar': { Component: RacingBarChart, title: 'Racing Bar Chart' },
  'co2-map': { Component: CO2WorldMap, title: 'CO₂ World Map' },
  'bubble-chart': { Component: BubbleChart, title: 'Bubble Chart' },
  'population-pyramid': { Component: PopulationPyramid, title: 'Population Pyramid' },
};

function EmbedContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || '';
  const viz = searchParams.get('viz') || '';

  // Individual visualization embed
  const vizEntry = VIZ_MAP[viz];

  return (
    <div className="min-h-screen bg-[#050507] text-white relative">
      {/* Hide nav/footer from embedded full pages */}
      <style>{`
        header, footer, nav, [data-embed-hide] { display: none !important; }
        main { padding-top: 0.5rem !important; }
      `}</style>

      {vizEntry ? (
        <div className="w-full h-full px-4 py-4">
          <vizEntry.Component />
        </div>
      ) : type === 'compare' ? (
        <ComparePage />
      ) : (
        <DashboardPage />
      )}

      {/* Powered by EXD watermark */}
      <a
        href="https://editiononeadmin.github.io/exd-landing/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-3 right-3 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] backdrop-blur-xl text-xs text-gray-500 hover:text-gray-300 transition-colors"
      >
        <div className="relative w-4 h-4">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-[3px] opacity-80" />
          <div className="absolute inset-[1px] bg-[#050507] rounded-[2px] flex items-center justify-center">
            <span className="text-[7px] font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">E</span>
          </div>
        </div>
        Powered by EXD
      </a>
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050507]" />}>
      <EmbedContent />
    </Suspense>
  );
}
