/**
 * World Bank API Integration
 * Fetches real data from https://api.worldbank.org/v2/
 * No API key required - free public API
 */

const BASE = 'https://api.worldbank.org/v2';

// Indicator codes
const INDICATORS = {
  gdp: 'NY.GDP.MKTP.CD',           // GDP (current US$)
  population: 'SP.POP.TOTL',        // Population, total
  lifeExpectancy: 'SP.DYN.LE00.IN', // Life expectancy at birth
  co2: 'EN.ATM.CO2E.KT',           // CO2 emissions (kt)
  co2PerCapita: 'EN.ATM.CO2E.PC',  // CO2 emissions per capita (metric tons)
  gdpPerCapita: 'NY.GDP.PCAP.CD',  // GDP per capita (current US$)
} as const;

// Top countries to fetch for visualizations
const TOP_COUNTRIES = ['USA', 'CHN', 'IND', 'JPN', 'DEU', 'GBR', 'FRA', 'BRA', 'ITA', 'CAN', 'RUS', 'KOR', 'AUS', 'MEX', 'IDN'];

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States', CN: 'China', IN: 'India', JP: 'Japan', DE: 'Germany',
  GB: 'United Kingdom', FR: 'France', BR: 'Brazil', IT: 'Italy', CA: 'Canada',
  RU: 'Russia', KR: 'South Korea', AU: 'Australia', MX: 'Mexico', ID: 'Indonesia',
  ZA: 'South Africa', SA: 'Saudi Arabia', NG: 'Nigeria', EG: 'Egypt', TR: 'Turkey',
};

const COUNTRY_REGIONS: Record<string, string> = {
  US: 'Americas', CN: 'Asia', IN: 'Asia', JP: 'Asia', DE: 'Europe',
  GB: 'Europe', FR: 'Europe', BR: 'Americas', IT: 'Europe', CA: 'Americas',
  RU: 'Europe', KR: 'Asia', AU: 'Oceania', MX: 'Americas', ID: 'Asia',
  ZA: 'Africa', SA: 'Middle East', NG: 'Africa', EG: 'Africa', TR: 'Europe',
};

// ISO2 to ISO3 mapping
const ISO2_TO_ISO3: Record<string, string> = {
  US: 'USA', CN: 'CHN', IN: 'IND', JP: 'JPN', DE: 'DEU',
  GB: 'GBR', FR: 'FRA', BR: 'BRA', IT: 'ITA', CA: 'CAN',
  RU: 'RUS', KR: 'KOR', AU: 'AUS', MX: 'MEX', ID: 'IDN',
  ZA: 'ZAF', SA: 'SAU', NG: 'NGA', EG: 'EGY', TR: 'TUR',
};

interface WBResponse {
  page: number;
  pages: number;
  per_page: number;
  total: number;
}

interface WBDataPoint {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
}

async function fetchIndicator(
  countries: string,
  indicator: string,
  dateRange: string,
  perPage = 1000
): Promise<WBDataPoint[]> {
  const url = `${BASE}/country/${countries}/indicator/${indicator}?format=json&date=${dateRange}&per_page=${perPage}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`World Bank API error: ${res.status}`);
  const json = await res.json();
  if (!json[1]) return [];
  return json[1] as WBDataPoint[];
}

/**
 * Fetch GDP racing data in format:
 * [{year, countries: [{code, value, name}]}]
 */
export async function fetchGDPRacing(startYear = 1960, endYear = 2023): Promise<unknown[]> {
  const countries = TOP_COUNTRIES.join(';');
  const data = await fetchIndicator(countries, INDICATORS.gdp, `${startYear}:${endYear}`, 5000);

  // Group by year
  const byYear: Record<number, { code: string; value: number; name: string }[]> = {};
  for (const d of data) {
    if (d.value == null) continue;
    const year = parseInt(d.date);
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push({
      code: d.countryiso3code,
      value: d.value,
      name: d.country.value,
    });
  }

  // Sort and format
  return Object.keys(byYear)
    .map(Number)
    .sort((a, b) => a - b)
    .map(year => ({
      year,
      countries: byYear[year].sort((a, b) => b.value - a.value).slice(0, 12),
    }));
}

/**
 * Fetch CO2 emissions data in format:
 * {[year]: {[ISO3]: {co2, co2_per_capita}}}
 */
export async function fetchCO2Emissions(startYear = 1990, endYear = 2020): Promise<Record<string, Record<string, { co2: number; co2_per_capita: number }>>> {
  const countries = TOP_COUNTRIES.join(';');
  const [co2Data, co2pcData] = await Promise.all([
    fetchIndicator(countries, INDICATORS.co2, `${startYear}:${endYear}`, 5000),
    fetchIndicator(countries, INDICATORS.co2PerCapita, `${startYear}:${endYear}`, 5000),
  ]);

  const result: Record<string, Record<string, { co2: number; co2_per_capita: number }>> = {};

  // Index co2 per capita by country+year
  const pcIndex: Record<string, number> = {};
  for (const d of co2pcData) {
    if (d.value != null) pcIndex[`${d.countryiso3code}_${d.date}`] = d.value;
  }

  for (const d of co2Data) {
    if (d.value == null) continue;
    const year = d.date;
    if (!result[year]) result[year] = {};
    result[year][d.countryiso3code] = {
      co2: Math.round(d.value / 1000), // Convert kt to Mt
      co2_per_capita: parseFloat((pcIndex[`${d.countryiso3code}_${year}`] || 0).toFixed(2)),
    };
  }

  return result;
}

/**
 * Fetch life expectancy bubble chart data in format:
 * {[year]: [{code, name, life, gdp, pop, region}]}
 */
export async function fetchLifeExpectancy(startYear = 1990, endYear = 2022): Promise<Record<string, unknown[]>> {
  const countries = TOP_COUNTRIES.join(';');
  const dateRange = `${startYear}:${endYear}`;

  const [lifeData, gdppcData, popData] = await Promise.all([
    fetchIndicator(countries, INDICATORS.lifeExpectancy, dateRange, 5000),
    fetchIndicator(countries, INDICATORS.gdpPerCapita, dateRange, 5000),
    fetchIndicator(countries, INDICATORS.population, dateRange, 5000),
  ]);

  // Index by country+year
  const idx = (arr: WBDataPoint[]) => {
    const m: Record<string, number> = {};
    for (const d of arr) if (d.value != null) m[`${d.countryiso3code}_${d.date}`] = d.value;
    return m;
  };

  const gdpIdx = idx(gdppcData);
  const popIdx = idx(popData);

  const result: Record<string, unknown[]> = {};

  for (const d of lifeData) {
    if (d.value == null) continue;
    const year = d.date;
    const key = `${d.countryiso3code}_${year}`;
    const iso2 = d.country.id;
    if (!result[year]) result[year] = [];
    result[year].push({
      code: d.countryiso3code,
      name: d.country.value,
      life: parseFloat(d.value.toFixed(1)),
      gdp: Math.round(gdpIdx[key] || 0),
      pop: Math.round(popIdx[key] || 0),
      region: COUNTRY_REGIONS[iso2] || 'Other',
    });
  }

  return result;
}

/**
 * Fetch population data. World Bank doesn't have age-group breakdowns
 * in a single indicator, so we return total population by country/year
 * formatted for the pyramid component (simplified).
 */
export async function fetchPopulationData(startYear = 1990, endYear = 2023): Promise<Record<string, Record<string, { total: number }>>> {
  const countries = TOP_COUNTRIES.slice(0, 6).join(';');
  const data = await fetchIndicator(countries, INDICATORS.population, `${startYear}:${endYear}`, 5000);

  const result: Record<string, Record<string, { total: number }>> = {};
  for (const d of data) {
    if (d.value == null) continue;
    if (!result[d.countryiso3code]) result[d.countryiso3code] = {};
    result[d.countryiso3code][d.date] = { total: d.value };
  }

  return result;
}
