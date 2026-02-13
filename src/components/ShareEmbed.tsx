'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareEmbedProps {
  type: 'dashboard' | 'compare';
  params?: Record<string, string>;
}

export default function ShareEmbed({ type, params = {} }: ShareEmbedProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const basePath = process.env.NODE_ENV === 'production' ? '/exd-landing' : '';

  const queryString = new URLSearchParams({ type, ...params }).toString();
  const pageUrl = `${baseUrl}${basePath}/${type === 'dashboard' ? 'dashboard' : 'compare'}/?${new URLSearchParams(params).toString()}`;
  const embedUrl = `${baseUrl}${basePath}/embed/?${queryString}`;
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" style="border-radius:12px;border:1px solid rgba(255,255,255,0.1)"></iframe>`;

  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent('Check out this data visualization on EXD 📊')}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  useEffect(() => {
    if (open) {
      const handler = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }
  }, [open]);

  return (
    <>
      {/* Floating Share Button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-white/[0.07] border border-white/[0.1] backdrop-blur-xl text-white text-sm font-medium hover:bg-white/[0.12] hover:border-white/[0.2] transition-all shadow-lg shadow-black/20 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        Share
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="pointer-events-auto w-full max-w-lg bg-[#0a0a12]/80 border border-white/[0.08] backdrop-blur-2xl rounded-2xl p-6 shadow-2xl shadow-black/40"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">Share & Embed</h2>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-500 hover:text-white transition-colors p-1 cursor-pointer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                {/* Copy Link */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">Page Link</label>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={pageUrl}
                      className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-gray-300 font-mono truncate"
                    />
                    <button
                      onClick={() => copyToClipboard(pageUrl, 'link')}
                      className="px-3 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-sm text-indigo-300 hover:bg-indigo-500/30 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {copied === 'link' ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Embed Code */}
                <div className="mb-5">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">Embed Code</label>
                  <div className="relative">
                    <textarea
                      readOnly
                      value={iframeCode}
                      rows={3}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-gray-400 font-mono resize-none"
                    />
                    <button
                      onClick={() => copyToClipboard(iframeCode, 'embed')}
                      className="absolute top-2 right-2 px-2.5 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-md text-xs text-cyan-300 hover:bg-cyan-500/30 transition-colors cursor-pointer"
                    >
                      {copied === 'embed' ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Social Share */}
                <div className="flex gap-3">
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-gray-300 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Twitter / X
                  </a>
                  <a
                    href={linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-gray-300 hover:bg-white/[0.08] hover:border-white/[0.15] transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            className="fixed bottom-20 right-6 z-[60] px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-xl text-sm text-emerald-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            ✓ Copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
