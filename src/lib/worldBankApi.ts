// World Bank API client for live data fetching

const BASE = 'https://api.worldbank.org/v2';

interface WBDataPoint {
  country: { id: string; value: string };
  date: string;
  value: number | null;
  indicator: { id: string; value: string };
}

async function fetchIndicator(
  countries: string,
  indicator: string,
  dateRange = '2000:2024',
): Promise<WBDataPoint[]> {
  const url = `${BASE}/country/${countries}/indicator/${indicator}?format=json&date=${dateRange}&per_page=1000`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WB API ${res.status}`);
  const json = await res.json();
  if (!Array.isArray(json) || !json[1]) throw new Error('No data');
  return json[1] as WBDataPoint[];
}

// Country colors
const COLORS: Record<string, string> = {
  Germany: '#6366f1', France: '#22c55e', 'United Kingdom': '#f59e0b',
  'United States': '#6366f1', China: '#ef4444', India: '#22c55e',
  Japan: '#818cf8', Brazil: '#22c55e', Nigeria: '#f59e0b',
  Indonesia: '#06b6d4', Pakistan: '#a78bfa', Bangladesh: '#ec4899',
  'Russian Federation': '#f97316', Mexico: '#14b8a6',
};

function buildSeries(
  data: WBDataPoint[],
  countryNames?: Record<string, string>,
) {
  const byCountry: Record<string, { x: number; y: number }[]> = {};
  for (const d of data) {
    if (d.value == null) continue;
    const name = countryNames?.[d.country.value] || d.country.value;
    if (!byCountry[name]) byCountry[name] = [];
    byCountry[name].push({ x: parseInt(d.date), y: d.value });
  }
  // Sort each series by year
  for (const k of Object.keys(byCountry)) {
    byCountry[k].sort((a, b) => a.x - b.x);
  }
  return Object.entries(byCountry).map(([name, pts]) => ({
    name,
    color: COLORS[name] || '#6366f1',
    data: pts,
  }));
}

export interface LiveChartResult {
  spec: {
    type: string;
    title: string;
    subtitle?: string;
    xAxis: { label: string; type: string };
    yAxis: { label: string; format?: string };
    series: { name: string; color?: string; data: { x: string | number; y: number; label?: string }[] }[];
    source?: string;
  };
  isLive: boolean;
}

// Definitions for each query key that can use live data
interface LiveQueryDef {
  countries: string;
  indicator: string;
  dateRange: string;
  chartType: string;
  title: string;
  subtitle: string;
  yLabel: string;
  yFormat: string;
  countryNames?: Record<string, string>;
  transform?: 'horizontal-bar' | 'scatter-dual';
  secondIndicator?: string;
  xLabel?: string;
  valueDivisor?: number;
  seriesName?: string;
}

const LIVE_QUERIES: Record<string, LiveQueryDef> = {
  'gdp-europe': {
    countries: 'DEU;FRA;GBR',
    indicator: 'NY.GDP.MKTP.KD.ZG',
    dateRange: '2000:2024',
    chartType: 'line',
    title: 'GDP Growth in Europe',
    subtitle: '2000–2024, Annual % Change (Live Data)',
    yLabel: 'Growth Rate (%)',
    yFormat: '%',
  },
  'co2-emissions': {
    countries: 'USA;CHN;IND',
    indicator: 'EN.ATM.CO2E.PC',
    dateRange: '2000:2022',
    chartType: 'area',
    title: 'CO₂ Emissions Comparison',
    subtitle: 'USA vs China vs India (metric tons per capita)',
    yLabel: 'CO₂ per capita (t)',
    yFormat: 't',
  },
  'population-top10': {
    countries: 'IND;CHN;USA;IDN;PAK;NGA;BRA;BGD;RUS;MEX',
    indicator: 'SP.POP.TOTL',
    dateRange: '2023:2024',
    chartType: 'horizontal-bar',
    title: 'Top 10 Countries by Population',
    subtitle: 'Latest available data (millions)',
    yLabel: 'Population (M)',
    yFormat: 'M',
    transform: 'horizontal-bar',
    valueDivisor: 1e6,
    seriesName: 'Population',
  },
  'inflation': {
    countries: 'USA;FRA;GBR',
    indicator: 'FP.CPI.TOTL.ZG',
    dateRange: '2019:2024',
    chartType: 'area',
    title: 'Inflation Rate Trends',
    subtitle: 'Consumer Prices, Annual % (Live Data)',
    yLabel: 'Inflation (%)',
    yFormat: '%',
    countryNames: { France: 'France (EU proxy)' },
  },
  'life-expectancy': {
    countries: 'USA;CHN;IND;DEU;JPN;BRA;NGA;AUS;KOR',
    indicator: 'SP.DYN.LE00.IN',
    dateRange: '2020:2023',
    chartType: 'scatter',
    title: 'Life Expectancy vs GDP per Capita',
    subtitle: 'Latest available data',
    yLabel: 'Life Expectancy (years)',
    yFormat: '',
    secondIndicator: 'NY.GDP.PCAP.CD',
    transform: 'scatter-dual',
    xLabel: 'GDP per Capita ($)',
  },
  'renewable-energy': {
    countries: 'ISL;NOR;SWE;BRA;DNK;DEU;GBR;USA;CHN;IND',
    indicator: 'EG.FEC.RNEW.ZS',
    dateRange: '2020:2023',
    chartType: 'bar',
    title: 'Renewable Energy Share',
    subtitle: '% of Total Final Energy Consumption (Live Data)',
    yLabel: 'Renewable %',
    yFormat: '%',
    transform: 'horizontal-bar',
    valueDivisor: 1,
    seriesName: 'Renewable',
  },
  'healthcare-spending': {
    countries: 'USA;DEU;FRA;JPN;SWE;GBR;KOR;CHN;IND;NGA',
    indicator: 'SP.DYN.LE00.IN',
    dateRange: '2020:2023',
    chartType: 'scatter',
    title: 'Healthcare Spending vs Outcomes',
    subtitle: '% of GDP vs Life Expectancy (Live Data)',
    yLabel: 'Life Expectancy (years)',
    yFormat: '',
    secondIndicator: 'SH.XPD.CHEX.GD.ZS',
    transform: 'scatter-dual',
    xLabel: 'Health Spending (% GDP)',
  },
  'internet-users': {
    countries: 'WLD',
    indicator: 'IT.NET.USER.ZS',
    dateRange: '2000:2023',
    chartType: 'line',
    title: 'Global Internet Users',
    subtitle: '% of Population Using Internet (Live Data)',
    yLabel: 'Internet Users (% pop)',
    yFormat: '%',
  },
  'global-debt': {
    countries: 'JPN;ITA;USA;FRA;GBR;BRA;IND;DEU;CHN;AUS',
    indicator: 'GC.DOD.TOTL.GD.ZS',
    dateRange: '2020:2023',
    chartType: 'horizontal-bar',
    title: 'Government Debt to GDP Ratio',
    subtitle: 'Central Government Debt, % of GDP (Live Data)',
    yLabel: 'Debt/GDP (%)',
    yFormat: '%',
    transform: 'horizontal-bar',
    valueDivisor: 1,
    seriesName: 'Debt/GDP',
  },
};

export async function fetchLiveData(queryKey: string): Promise<LiveChartResult | null> {
  const def = LIVE_QUERIES[queryKey];
  if (!def) return null;

  try {
    if (def.transform === 'scatter-dual' && def.secondIndicator) {
      // Fetch two indicators for scatter
      const [lifeData, gdpData] = await Promise.all([
        fetchIndicator(def.countries, def.indicator, def.dateRange),
        fetchIndicator(def.countries, def.secondIndicator, def.dateRange),
      ]);

      // Get latest value per country for each indicator
      const lifeByCountry: Record<string, { value: number; name: string }> = {};
      const gdpByCountry: Record<string, number> = {};

      for (const d of lifeData) {
        if (d.value != null && !lifeByCountry[d.country.id]) {
          lifeByCountry[d.country.id] = { value: d.value, name: d.country.value };
        }
      }
      for (const d of gdpData) {
        if (d.value != null && !gdpByCountry[d.country.id]) {
          gdpByCountry[d.country.id] = d.value;
        }
      }

      const points: { x: number; y: number; label: string }[] = [];
      for (const [id, life] of Object.entries(lifeByCountry)) {
        if (gdpByCountry[id]) {
          points.push({
            x: Math.round(gdpByCountry[id]),
            y: Math.round(life.value * 10) / 10,
            label: life.name,
          });
        }
      }

      return {
        spec: {
          type: 'scatter',
          title: def.title,
          subtitle: def.subtitle,
          xAxis: { label: def.xLabel || 'GDP per Capita ($)', type: 'linear' },
          yAxis: { label: def.yLabel },
          series: [{ name: 'Countries', data: points }],
          source: 'World Bank (Live)',
        },
        isLive: true,
      };
    }

    if (def.transform === 'horizontal-bar') {
      const data = await fetchIndicator(def.countries, def.indicator, def.dateRange);
      // Get latest value per country
      const latest: Record<string, { name: string; value: number }> = {};
      for (const d of data) {
        if (d.value != null && !latest[d.country.id]) {
          latest[d.country.id] = { name: d.country.value, value: d.value };
        }
      }
      const sorted = Object.values(latest).sort((a, b) => b.value - a.value);
      return {
        spec: {
          type: 'horizontal-bar',
          title: def.title,
          subtitle: def.subtitle,
          xAxis: { label: 'Country', type: 'category' },
          yAxis: { label: def.yLabel, format: def.yFormat },
          series: [{
            name: def.seriesName || 'Value',
            color: '#6366f1',
            data: sorted.map(c => ({
              x: c.name,
              y: Math.round(c.value / (def.valueDivisor || 1e6) * 10) / 10,
            })),
          }],
          source: 'World Bank (Live)',
        },
        isLive: true,
      };
    }

    // Standard time series
    const data = await fetchIndicator(def.countries, def.indicator, def.dateRange);
    const series = buildSeries(data, def.countryNames);

    return {
      spec: {
        type: def.chartType,
        title: def.title,
        subtitle: def.subtitle,
        xAxis: { label: 'Year', type: 'time' },
        yAxis: { label: def.yLabel, format: def.yFormat },
        series,
        source: 'World Bank (Live)',
      },
      isLive: true,
    };
  } catch (err) {
    console.warn('World Bank API fetch failed:', err);
    return null;
  }
}
