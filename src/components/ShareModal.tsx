'use client';

import { useState, useEffect } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  vizId: string;
  vizTitle: string;
}

const BASE_URL = 'https://editiononeadmin.github.io/exd-landing';

export default function ShareModal({ isOpen, onClose, vizId, vizTitle }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'link' | 'embed' | 'social'>('link');
  const [copied, setCopied] = useState(false);

  const embedUrl = `${BASE_URL}/embed?viz=${vizId}`;
  const vizUrl = `${BASE_URL}/visualizations#${vizId}`;
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="500" frameborder="0" style="border-radius:12px;border:1px solid rgba(255,255,255,0.1);" allowfullscreen></iframe>`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this ${vizTitle} visualization`)}&url=${encodeURIComponent(vizUrl)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(vizUrl)}`;

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(t);
    }
  }, [copied]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  if (!isOpen) return null;

  const tabs = [
    { key: 'link' as const, label: 'Link' },
    { key: 'embed' as const, label: 'Embed Code' },
    { key: 'social' as const, label: 'Social' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h3 className="text-lg font-semibold text-white">Share — {vizTitle}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setCopied(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {activeTab === 'link' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Direct link to this visualization:</p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={vizUrl}
                  className="flex-1 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 font-mono outline-none"
                />
                <button
                  onClick={() => copyToClipboard(vizUrl)}
                  className="px-4 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors shrink-0"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'embed' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Paste this into your website:</p>
              <div className="relative">
                <textarea
                  readOnly
                  value={iframeCode}
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 font-mono outline-none resize-none"
                />
                <button
                  onClick={() => copyToClipboard(iframeCode)}
                  className="mt-2 px-4 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors"
                >
                  {copied ? '✓ Copied' : 'Copy Embed Code'}
                </button>
              </div>
              <p className="text-xs text-gray-500">Responsive iframe — adjust height as needed.</p>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Share on social media:</p>
              <div className="flex gap-3">
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm text-gray-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Twitter / X
                </a>
                <a
                  href={linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm text-gray-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
