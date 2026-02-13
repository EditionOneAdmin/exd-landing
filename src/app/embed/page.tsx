'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const DashboardPage = dynamic(() => import('../dashboard/page'), { ssr: false });
const ComparePage = dynamic(() => import('../compare/page'), { ssr: false });

function EmbedContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'dashboard';

  return (
    <div className="min-h-screen bg-[#050507] text-white relative">
      {/* Hide the header and footer from embedded pages via CSS */}
      <style>{`
        header, footer, [data-embed-hide] { display: none !important; }
        main { padding-top: 1rem !important; }
      `}</style>

      {type === 'compare' ? <ComparePage /> : <DashboardPage />}

      {/* Powered by EXD watermark */}
      <a
        href="https://editionone.github.io/exd-landing/"
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
