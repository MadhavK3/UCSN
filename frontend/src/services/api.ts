
export interface HeatmapData {
  lat: number
  lng: number
  intensity: number
}

export interface SimulationParams {
  scenario: string
  treeCover?: number
  albedo?: number
  populationDensity?: number
  rainfall?: number
  windSpeed?: number
  humidity?: number
  aqi?: number
}

export interface SimulationResults {
  temperatureDelta?: number[]
  inundationArea?: number[]
  aqiData?: number[]
  humidityData?: number[]
  maxTemperature?: number
  maxInundation?: number
  maxAQI?: number
  maxHumidity?: number
  waterloggingRisk?: string
}

export interface AnalyticsData {
  timestamp: string
  [key: string]: number | string
}

export const BASE_URL = "http://127.0.0.1:8000/api";

export const api = {
  async getUhiHeatmap(): Promise<any> {
    const res = await fetch(`${BASE_URL}/uhimap`);
    if (!res.ok) throw new Error('Failed to fetch heatmap data');
    return await res.json();
  },

  async runSimulation(params: SimulationParams): Promise<SimulationResults> {
    const res = await fetch(`${BASE_URL}/simulation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to run simulation');
    return await res.json();
  },

  async getAnalytics(metrics: string[] = []): Promise<AnalyticsData[]> {
    const query = metrics.length ? `?metrics=${metrics.join("&metrics=")}` : '';
    const res = await fetch(`${BASE_URL}/analytics${query}`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return await res.json();
  },

  async submitContact(form: { name: string; email: string; organization?: string; message: string }): Promise<void> {
    const res = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (!res.ok) throw new Error('Failed to submit contact form');
    return;
  }
}