'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Endpoint {
  id: string;
  method: 'GET';
  path: string;
  title: string;
  description: string;
  params: Param[];
  examples: { curl: string; python: string; javascript: string };
  response: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const endpoints: Endpoint[] = [
  {
    id: 'countries',
    method: 'GET',
    path: '/v1/countries',
    title: 'List Countries',
    description: 'Returns all available countries with their ISO codes, names, and available data coverage.',
    params: [
      { name: 'region', type: 'string', required: false, description: 'Filter by region (e.g. "europe", "asia")' },
      { name: 'search', type: 'string', required: false, description: 'Search countries by name' },
      { name: 'limit', type: 'integer', required: false, description: 'Max results (default: 50, max: 250)' },
      { name: 'offset', type: 'integer', required: false, description: 'Pagination offset' },
    ],
    examples: {
      curl: `curl -X GET "https://api.exd.dev/v1/countries?region=europe&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      python: `import requests

response = requests.get(
    "https://api.exd.dev/v1/countries",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    params={"region": "europe", "limit": 10}
)
data = response.json()`,
      javascript: `const response = await fetch(
  "https://api.exd.dev/v1/countries?region=europe&limit=10",
  { headers: { "Authorization": "Bearer YOUR_API_KEY" } }
);
const data = await response.json();`,
    },
    response: `{
  "data": [
    {
      "iso3": "DEU",
      "iso2": "DE",
      "name": "Germany",
      "region": "Europe",
      "indicators_available": 847,
      "data_points": 125400
    },
    {
      "iso3": "FRA",
      "iso2": "FR",
      "name": "France",
      "region": "Europe",
      "indicators_available": 812,
      "data_points": 118200
    }
  ],
  "meta": { "total": 195, "limit": 10, "offset": 0 }
}`,
  },
  {
    id: 'indicators',
    method: 'GET',
    path: '/v1/indicators',
    title: 'List Indicators',
    description: 'Browse all available indicators across categories like economy, health, demographics, environment, and more.',
    params: [
      { name: 'category', type: 'string', required: false, description: 'Filter by category (e.g. "economy", "health")' },
      { name: 'search', type: 'string', required: false, description: 'Full-text search on indicator names' },
      { name: 'source', type: 'string', required: false, description: 'Filter by data source (e.g. "world_bank", "imf")' },
      { name: 'limit', type: 'integer', required: false, description: 'Max results (default: 50, max: 500)' },
    ],
    examples: {
      curl: `curl -X GET "https://api.exd.dev/v1/indicators?category=economy&limit=5" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      python: `import requests

response = requests.get(
    "https://api.exd.dev/v1/indicators",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    params={"category": "economy", "limit": 5}
)
data = response.json()`,
      javascript: `const response = await fetch(
  "https://api.exd.dev/v1/indicators?category=economy&limit=5",
  { headers: { "Authorization": "Bearer YOUR_API_KEY" } }
);
const data = await response.json();`,
    },
    response: `{
  "data": [
    {
      "id": "gdp_current_usd",
      "name": "GDP (current US$)",
      "category": "Economy",
      "source": "World Bank",
      "unit": "US$",
      "frequency": "annual",
      "coverage": { "countries": 195, "years": "1960-2025" }
    },
    {
      "id": "inflation_cpi",
      "name": "Inflation, consumer prices (annual %)",
      "category": "Economy",
      "source": "IMF",
      "unit": "%",
      "frequency": "annual",
      "coverage": { "countries": 190, "years": "1970-2025" }
    }
  ],
  "meta": { "total": 1247, "limit": 5, "offset": 0 }
}`,
  },
  {
    id: 'data',
    method: 'GET',
    path: '/v1/data/{country}/{indicator}',
    title: 'Get Data',
    description: 'Retrieve time-series data for a specific country and indicator combination. This is the core endpoint for pulling actual data points.',
    params: [
      { name: 'country', type: 'string', required: true, description: 'ISO3 country code (e.g. "DEU")' },
      { name: 'indicator', type: 'string', required: true, description: 'Indicator ID (e.g. "gdp_current_usd")' },
      { name: 'year_from', type: 'integer', required: false, description: 'Start year (default: earliest available)' },
      { name: 'year_to', type: 'integer', required: false, description: 'End year (default: latest available)' },
      { name: 'format', type: 'string', required: false, description: 'Response format: "json" (default) or "csv"' },
    ],
    examples: {
      curl: `curl -X GET "https://api.exd.dev/v1/data/DEU/gdp_current_usd?year_from=2015&year_to=2025" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      python: `import requests

response = requests.get(
    "https://api.exd.dev/v1/data/DEU/gdp_current_usd",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    params={"year_from": 2015, "year_to": 2025}
)
data = response.json()`,
      javascript: `const response = await fetch(
  "https://api.exd.dev/v1/data/DEU/gdp_current_usd?year_from=2015&year_to=2025",
  { headers: { "Authorization": "Bearer YOUR_API_KEY" } }
);
const data = await response.json();`,
    },
    response: `{
  "country": { "iso3": "DEU", "name": "Germany" },
  "indicator": { "id": "gdp_current_usd", "name": "GDP (current US$)" },
  "data": [
    { "year": 2015, "value": 3356755800000 },
    { "year": 2016, "value": 3467498350000 },
    { "year": 2017, "value": 3664066580000 },
    { "year": 2018, "value": 3949549000000 },
    { "year": 2019, "value": 3861123560000 },
    { "year": 2020, "value": 3846413510000 },
    { "year": 2021, "value": 4259934910000 },
    { "year": 2022, "value": 4072191920000 },
    { "year": 2023, "value": 4456081000000 },
    { "year": 2024, "value": 4580230000000 },
    { "year": 2025, "value": null }
  ],
  "meta": { "unit": "US$", "source": "World Bank", "last_updated": "2025-09-15" }
}`,
  },
  {
    id: 'compare',
    method: 'GET',
    path: '/v1/compare',
    title: 'Compare Countries',
    description: 'Compare multiple countries across one or more indicators in a single request. Perfect for building dashboards and comparative analyses.',
    params: [
      { name: 'countries', type: 'string', required: true, description: 'Comma-separated ISO3 codes (max 10)' },
      { name: 'indicators', type: 'string', required: true, description: 'Comma-separated indicator IDs (max 5)' },
      { name: 'year_from', type: 'integer', required: false, description: 'Start year' },
      { name: 'year_to', type: 'integer', required: false, description: 'End year' },
      { name: 'normalize', type: 'boolean', required: false, description: 'Normalize values to 0-100 scale' },
    ],
    examples: {
      curl: `curl -X GET "https://api.exd.dev/v1/compare?countries=DEU,FRA,USA&indicators=gdp_current_usd&year_from=2020" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      python: `import requests

response = requests.get(
    "https://api.exd.dev/v1/compare",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    params={
        "countries": "DEU,FRA,USA",
        "indicators": "gdp_current_usd",
        "year_from": 2020
    }
)
data = response.json()`,
      javascript: `const response = await fetch(
  "https://api.exd.dev/v1/compare?countries=DEU,FRA,USA&indicators=gdp_current_usd&year_from=2020",
  { headers: { "Authorization": "Bearer YOUR_API_KEY" } }
);
const data = await response.json();`,
    },
    response: `{
  "comparison": {
    "gdp_current_usd": {
      "DEU": [
        { "year": 2020, "value": 3846413510000 },
        { "year": 2021, "value": 4259934910000 },
        { "year": 2022, "value": 4072191920000 },
        { "year": 2023, "value": 4456081000000 },
        { "year": 2024, "value": 4580230000000 }
      ],
      "FRA": [
        { "year": 2020, "value": 2624420000000 },
        { "year": 2021, "value": 2957880000000 },
        { "year": 2022, "value": 2784020000000 },
        { "year": 2023, "value": 3049020000000 },
        { "year": 2024, "value": 3130500000000 }
      ],
      "USA": [
        { "year": 2020, "value": 21060474000000 },
        { "year": 2021, "value": 23315081000000 },
        { "year": 2022, "value": 25462700000000 },
        { "year": 2023, "value": 27360935000000 },
        { "year": 2024, "value": 28780000000000 }
      ]
    }
  },
  "meta": { "countries": 3, "indicators": 1, "data_points": 15 }
}`,
  },
  {
    id: 'stories',
    method: 'GET',
    path: '/v1/stories',
    title: 'Data Stories',
    description: 'Access AI-generated data narratives that combine multiple indicators into compelling, contextual stories about global trends.',
    params: [
      { name: 'topic', type: 'string', required: false, description: 'Filter by topic (e.g. "climate", "economy", "health")' },
      { name: 'country', type: 'string', required: false, description: 'Filter stories mentioning a specific country' },
      { name: 'sort', type: 'string', required: false, description: '"recent" (default), "popular", "trending"' },
      { name: 'limit', type: 'integer', required: false, description: 'Max results (default: 10, max: 50)' },
    ],
    examples: {
      curl: `curl -X GET "https://api.exd.dev/v1/stories?topic=climate&limit=2" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      python: `import requests

response = requests.get(
    "https://api.exd.dev/v1/stories",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    params={"topic": "climate", "limit": 2}
)
data = response.json()`,
      javascript: `const response = await fetch(
  "https://api.exd.dev/v1/stories?topic=climate&limit=2",
  { headers: { "Authorization": "Bearer YOUR_API_KEY" } }
);
const data = await response.json();`,
    },
    response: `{
  "data": [
    {
      "id": "story_energy_transition_2025",
      "title": "The Energy Transition: Where Do We Stand?",
      "topic": "Climate & Energy",
      "summary": "Renewable energy capacity surpassed 4,000 GW globally in 2024...",
      "countries_mentioned": ["CHN", "USA", "DEU", "IND"],
      "indicators_used": ["renewable_energy_pct", "co2_emissions", "energy_consumption"],
      "published_at": "2025-12-01T10:00:00Z",
      "read_time_min": 8
    }
  ],
  "meta": { "total": 42, "limit": 2, "offset": 0 }
}`,
  },
];

const langTabs = ['cURL', 'Python', 'JavaScript'] as const;
type LangTab = (typeof langTabs)[number];
const langKey: Record<LangTab, 'curl' | 'python' | 'javascript'> = {
  cURL: 'curl',
  Python: 'python',
  JavaScript: 'javascript',
};

// ─── Syntax highlight (minimal, no deps) ────────────────────────────────────

function highlightJSON(json: string) {
  return json
    .replace(/("(?:[^"\\]|\\.)*")\s*:/g, '<span class="text-purple-400">$1</span>:')
    .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="text-emerald-400">$1</span>')
    .replace(/:\s*(\d[\d.]*)/g, ': <span class="text-cyan-400">$1</span>')
    .replace(/:\s*(null)/g, ': <span class="text-gray-500">$1</span>')
    .replace(/:\s*(true|false)/g, ': <span class="text-amber-400">$1</span>');
}

function highlightCode(code: string) {
  return code
    .replace(/(curl|import|from|const|await|let|var)\b/g, '<span class="text-purple-400">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*")/g, '<span class="text-emerald-400">$1</span>')
    .replace(/(requests|fetch|response|data|print|console)\b/g, '<span class="text-cyan-400">$1</span>');
}

// ─── Components ──────────────────────────────────────────────────────────────

function MethodBadge() {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
      GET
    </span>
  );
}

function CodeBlock({ code, lang }: { code: string; lang: 'json' | 'code' }) {
  const html = lang === 'json' ? highlightJSON(code) : highlightCode(code);
  return (
    <div className="relative group">
      <pre className="bg-[#0a0a0f] rounded-lg border border-white/[0.06] p-4 overflow-x-auto text-sm leading-relaxed font-mono">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
      <button
        onClick={() => navigator.clipboard.writeText(code)}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded text-xs bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10"
      >
        Copy
      </button>
    </div>
  );
}

function EndpointCard({ ep, isActive }: { ep: Endpoint; isActive: boolean }) {
  const [tab, setTab] = useState<LangTab>('cURL');

  return (
    <motion.section
      id={ep.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="scroll-mt-28"
    >
      {/* Header */}
      <div className="relative rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-purple-500/[0.03]" />
        <div className="relative p-6 md:p-8">
          {/* Title row */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <MethodBadge />
            <code className="text-base md:text-lg font-mono text-white/90">{ep.path}</code>
            <button
              disabled
              className="ml-auto px-4 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-gray-500 border border-white/[0.06] cursor-not-allowed"
            >
              Try It — Coming Soon
            </button>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{ep.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">{ep.description}</p>

          {/* Parameters */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Parameters</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left py-2 pr-4 text-gray-500 font-medium">Name</th>
                    <th className="text-left py-2 pr-4 text-gray-500 font-medium">Type</th>
                    <th className="text-left py-2 pr-4 text-gray-500 font-medium">Required</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {ep.params.map((p) => (
                    <tr key={p.name} className="border-b border-white/[0.03]">
                      <td className="py-2.5 pr-4 font-mono text-indigo-400">{p.name}</td>
                      <td className="py-2.5 pr-4 text-gray-400">{p.type}</td>
                      <td className="py-2.5 pr-4">
                        {p.required ? (
                          <span className="text-amber-400 text-xs font-medium">Required</span>
                        ) : (
                          <span className="text-gray-600 text-xs">Optional</span>
                        )}
                      </td>
                      <td className="py-2.5 text-gray-400">{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Code examples */}
          <div className="mt-6">
            <div className="flex items-center gap-1 mb-3">
              <h4 className="text-sm font-semibold text-gray-300 mr-3">Request</h4>
              {langTabs.map((l) => (
                <button
                  key={l}
                  onClick={() => setTab(l)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    tab === l
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                      : 'text-gray-500 hover:text-gray-300 border border-transparent'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <CodeBlock code={ep.examples[langKey[tab]]} lang="code" />
          </div>

          {/* Response */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Response</h4>
            <CodeBlock code={ep.response} lang="json" />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ApiDocsPage() {
  const [activeId, setActiveId] = useState('countries');

  const scrollTo = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="min-h-screen bg-[#050507] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-sm text-gray-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              API v1 — Beta
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                API Reference
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
              Access the world&apos;s development data programmatically. Build dashboards, power research, or integrate global indicators into your applications.
            </p>
          </motion.div>

          {/* Auth + Rate Limits */}
          <div className="grid md:grid-cols-2 gap-4 mt-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
                <h3 className="text-sm font-semibold text-white">Authentication</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">All requests require an API key passed via the <code className="text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded text-xs">Authorization</code> header.</p>
              <CodeBlock
                code={`Authorization: Bearer exd_live_k8f2m9x...`}
                lang="code"
              />
              <p className="text-xs text-gray-500 mt-3">Get your API key from the <span className="text-indigo-400">Dashboard → Settings → API Keys</span></p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h3 className="text-sm font-semibold text-white">Rate Limits</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Free tier</span>
                  <span className="font-mono text-cyan-400">100 requests / day</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Pro tier</span>
                  <span className="font-mono text-cyan-400">10,000 requests / day</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Enterprise</span>
                  <span className="font-mono text-cyan-400">Unlimited</span>
                </div>
                <div className="pt-2 border-t border-white/[0.04]">
                  <p className="text-xs text-gray-500">Rate limit headers: <code className="text-gray-400">X-RateLimit-Remaining</code>, <code className="text-gray-400">X-RateLimit-Reset</code></p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Base URL */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-4 flex items-center gap-3"
          >
            <span className="text-sm text-gray-500">Base URL</span>
            <code className="text-sm font-mono text-white/80">https://api.exd.dev</code>
            <span className="ml-auto text-xs text-gray-600">Responses in JSON • UTF-8 • gzip</span>
          </motion.div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0 sticky top-28 self-start">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Endpoints</h4>
            <nav className="space-y-1">
              {endpoints.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => scrollTo(ep.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    activeId === ep.id
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02] border border-transparent'
                  }`}
                >
                  <span className="text-[10px] font-bold text-emerald-500/70">GET</span>
                  <span className="font-mono text-xs truncate">{ep.path.replace('/v1', '')}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <p className="text-xs text-gray-500 leading-relaxed">
                Need help integrating? Check out our{' '}
                <span className="text-indigo-400 cursor-pointer hover:underline">SDKs & Libraries</span>{' '}
                or reach out to{' '}
                <span className="text-indigo-400 cursor-pointer hover:underline">support</span>.
              </p>
            </div>
          </aside>

          {/* Endpoint list */}
          <div className="flex-1 min-w-0 space-y-8">
            {endpoints.map((ep) => (
              <EndpointCard key={ep.id} ep={ep} isActive={activeId === ep.id} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
