'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Send, Sparkles, ArrowLeft, Loader2, BarChart3, Globe2, Activity, Users } from 'lucide-react';

// Dynamic imports to avoid SSR issues with D3
const RacingBarChart = dynamic(() => import('@/components/visualizations/RacingBarChart'), { ssr: false });
const CO2WorldMap = dynamic(() => import('@/components/visualizations/CO2WorldMap'), { ssr: false });
const BubbleChart = dynamic(() => import('@/components/visualizations/BubbleChart'), { ssr: false });
const PopulationPyramid = dynamic(() => import('@/components/visualizations/PopulationPyramid'), { ssr: false });

// Types
type VizType = 'gdp' | 'co2' | 'health' | 'population' | null;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  vizType?: VizType;
  isTyping?: boolean;
}

interface ParsedQuery {
  vizType: VizType;
  region?: string;
  startYear?: number;
  endYear?: number;
  response: string;
}

// ─── Query Parser ────────────────────────────────────────────────────────────

function parseQuery(input: string): ParsedQuery {
  const lower = input.toLowerCase();

  // Detect visualization type
  let vizType: VizType = null;
  if (/gdp|economic|economy|growth|income|wealth/i.test(lower)) vizType = 'gdp';
  else if (/co2|carbon|emission|climate|pollution|warming/i.test(lower)) vizType = 'co2';
  else if (/life expectancy|health|mortality|lifespan|longevity/i.test(lower)) vizType = 'health';
  else if (/population|demographic|people|birth|fertility/i.test(lower)) vizType = 'population';

  // Detect region
  let region: string | undefined;
  const regionMatch = lower.match(/\b(europe|asia|africa|americas|oceania|north america|south america|middle east)\b/);
  if (regionMatch) region = regionMatch[1];

  // Detect time range
  let startYear: number | undefined;
  let endYear: number | undefined;
  const sinceMatch = lower.match(/since\s+(\d{4})/);
  const rangeMatch = lower.match(/(\d{4})\s*[-–to]+\s*(\d{4})/);
  const inMatch = lower.match(/\bin\s+(\d{4})\b/);
  if (rangeMatch) {
    startYear = parseInt(rangeMatch[1]);
    endYear = parseInt(rangeMatch[2]);
  } else if (sinceMatch) {
    startYear = parseInt(sinceMatch[1]);
    endYear = 2023;
  } else if (inMatch) {
    startYear = parseInt(inMatch[1]);
    endYear = parseInt(inMatch[1]);
  }

  // Build response
  const vizLabels: Record<string, string> = {
    gdp: 'GDP growth as a racing bar chart',
    co2: 'CO₂ emissions on a world map',
    health: 'life expectancy data as a bubble chart',
    population: 'population demographics as a pyramid',
  };

  let response: string;
  if (vizType) {
    const parts = [`Here's ${vizLabels[vizType]}`];
    if (region) parts[0] += ` for ${region.charAt(0).toUpperCase() + region.slice(1)}`;
    if (startYear && endYear && startYear !== endYear) parts[0] += ` from ${startYear} to ${endYear}`;
    else if (startYear) parts[0] += ` since ${startYear}`;
    parts[0] += '.';
    parts.push('Use the controls to explore the data interactively. You can ask me for a different view anytime.');
    response = parts.join(' ');
  } else {
    response = "I can help you explore data! Try asking about **GDP growth**, **CO₂ emissions**, **life expectancy**, or **population demographics**. You can also specify a region or time period.";
  }

  return { vizType, region, startYear, endYear, response };
}

// ─── Suggestion Chips ────────────────────────────────────────────────────────

const suggestions = [
  { label: 'GDP Growth', query: 'Show me GDP growth worldwide since 1960', icon: BarChart3 },
  { label: 'CO₂ Emissions', query: 'Show CO2 emissions around the world', icon: Globe2 },
  { label: 'Life Expectancy', query: 'Compare life expectancy across regions', icon: Activity },
  { label: 'Population', query: 'Show population demographics by country', icon: Users },
  { label: 'Europe GDP', query: 'GDP growth in Europe since 2000', icon: BarChart3 },
  { label: 'Asia Health', query: 'Life expectancy trends in Asia', icon: Activity },
];

// ─── Typing Animation Component ─────────────────────────────────────────────

function TypingText({ text, onComplete }: { text: string; onComplete: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      indexRef.current++;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        clearInterval(interval);
        onComplete();
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
    }, 18);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          className="inline-block w-0.5 h-4 bg-purple-400 ml-0.5 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
      )}
    </span>
  );
}

// ─── Data Fetching Hook ─────────────────────────────────────────────────────

function useVisualizationData(vizType: VizType) {
  const [gdpData, setGdpData] = useState(null);
  const [co2Data, setCo2Data] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [popData, setPopData] = useState(null);

  useEffect(() => {
    if (vizType === 'gdp' && !gdpData) {
      fetch('/data/gdp-racing.json').then(r => r.json()).then(setGdpData);
    }
    if (vizType === 'co2') {
      if (!co2Data) fetch('/data/co2-emissions.json').then(r => r.json()).then(setCo2Data);
      if (!geoData) fetch('/data/world.geojson').then(r => r.json()).then(setGeoData);
    }
    if (vizType === 'health' && !healthData) {
      fetch('/data/life-expectancy.json').then(r => r.json()).then(setHealthData);
    }
    if (vizType === 'population' && !popData) {
      fetch('/data/population-pyramid.json').then(r => r.json()).then(setPopData);
    }
  }, [vizType, gdpData, co2Data, geoData, healthData, popData]);

  return { gdpData, co2Data, geoData, healthData, popData };
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeViz, setActiveViz] = useState<VizType>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const data = useVisualizationData(activeViz);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const handleSubmit = useCallback((query: string) => {
    if (!query.trim() || isProcessing) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: query.trim() };
    const parsed = parseQuery(query);

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: parsed.response,
        vizType: parsed.vizType,
        isTyping: true,
      };
      setMessages(prev => [...prev, assistantMsg]);
      if (parsed.vizType) setActiveViz(parsed.vizType);
      setIsProcessing(false);
    }, 600 + Math.random() * 800);
  }, [isProcessing]);

  const handleTypingComplete = useCallback((msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isTyping: false } : m));
  }, []);

  const vizReady = (activeViz === 'gdp' && data.gdpData) ||
    (activeViz === 'co2' && data.co2Data && data.geoData) ||
    (activeViz === 'health' && data.healthData) ||
    (activeViz === 'population' && data.popData);

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-[#050507]/80 backdrop-blur-xl z-50">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg animate-pulse" />
            <div className="absolute inset-[2px] bg-[#050507] rounded-[5px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-semibold">EXD Copilot</h1>
            <p className="text-xs text-gray-500">Ask anything about world data</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-gray-500">Online</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Chat Panel */}
        <div className="lg:w-[420px] w-full flex flex-col border-r border-white/5 bg-[#050507]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center px-4 py-12"
              >
                <motion.div
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center mb-6"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </motion.div>
                <h2 className="text-xl font-semibold mb-2">Explore World Data</h2>
                <p className="text-gray-500 text-sm mb-8 max-w-xs">
                  Ask me about GDP, emissions, health, or demographics — I&apos;ll create a visualization for you.
                </p>

                {/* Suggestion chips */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleSubmit(s.query)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:border-purple-500/30 transition-all"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <s.icon className="w-3.5 h-3.5 text-purple-400" />
                      {s.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-md'
                        : 'bg-white/5 border border-white/10 text-gray-300 rounded-bl-md'
                    }`}
                  >
                    {msg.role === 'assistant' && msg.isTyping ? (
                      <TypingText text={msg.text} onComplete={() => handleTypingComplete(msg.id)} />
                    ) : (
                      <span>{msg.text}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  <span className="text-sm text-gray-500">Analyzing...</span>
                </div>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggestion chips (after first message) */}
          {messages.length > 0 && (
            <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-thin border-t border-white/5">
              {suggestions.slice(0, 4).map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(s.query)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  <s.icon className="w-3 h-3" />
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/5">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSubmit(input); }}
              className="flex items-center gap-2"
            >
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about world data..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all"
                  disabled={isProcessing}
                />
              </div>
              <motion.button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </div>
        </div>

        {/* Visualization Panel */}
        <div className="flex-1 relative overflow-hidden bg-[#0a0a0f]">
          <AnimatePresence mode="wait">
            {!activeViz && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-center">
                  {/* Animated background grid */}
                  <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                      backgroundSize: '40px 40px',
                    }}
                  />
                  <motion.div
                    className="relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="w-32 h-32 mx-auto mb-8 relative">
                      {/* Orbiting rings */}
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="absolute inset-0 rounded-full border border-purple-500/20"
                          style={{ margin: `${i * 12}px` }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8 + i * 4, repeat: Infinity, ease: 'linear' }}
                        />
                      ))}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-purple-400" />
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-lg font-medium">Your visualization will appear here</p>
                    <p className="text-gray-700 text-sm mt-2">Ask a question to get started</p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeViz && (
              <motion.div
                key={activeViz}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute inset-0 p-4"
              >
                {!vizReady ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                  </div>
                ) : (
                  <>
                    {activeViz === 'gdp' && <RacingBarChart data={data.gdpData!} />}
                    {activeViz === 'co2' && <CO2WorldMap geoData={data.geoData!} co2Data={data.co2Data!} />}
                    {activeViz === 'health' && <BubbleChart data={data.healthData!} />}
                    {activeViz === 'population' && <PopulationPyramid data={data.popData!} />}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
