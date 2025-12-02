import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Wind, Map as MapIcon, Play, AlertTriangle } from 'lucide-react';
import Scene from '../components/DigitalTwin/Scene';
import Map from '../components/DigitalTwin/Map';

interface Zone {
  id: string;
  name: string;
  type: string;
  coordinates: { lat: number; lon: number };
  area_km2: number;
  building_density: number;
  traffic_intensity: number;
  green_coverage: number;
}

interface SensorReading {
  aqi: number;
  pm25: number;
  pm10: number;
  temperature: number;
  humidity: number;
  co2_ppm: number;
  wind_speed_ms: number;
  wind_direction_deg: number;
  pressure_hpa: number;
}

interface Sensor {
  sensor_id: string;
  zone_id: string;
  readings: SensorReading;
  status: string;
}

interface DigitalTwinState {
  region: string;
  timestamp: string;
  zones: Zone[];
  sensors: Sensor[];
  hotspots: any[];
  current_metrics: any;
  heat_island: any;
  pm25_dispersion: any;
  traffic_emissions: any;
  projections: any;
}

const DigitalTwin: React.FC = () => {
  const [state, setState] = useState<DigitalTwinState | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedScenario, setSelectedScenario] = useState('');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchState = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/digital-twin/state');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setState(data);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching digital twin state:', error);
      setError('Failed to load Digital Twin data. Please ensure backend is running at http://127.0.0.1:8000');
      setLoading(false);
    }
  };

  const runScenario = async (scenarioName: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:8000/api/digital-twin/scenario/${scenarioName}`);
      if (!response.ok) throw new Error('Failed to run scenario');
      const data = await response.json();
      setState(data); // Update state with scenario result
      setLoading(false);
      alert(`Scenario "${scenarioName}" executed successfully!`);
    } catch (error) {
      console.error('Error running scenario:', error);
      setLoading(false);
      alert('Failed to run scenario');
    }
  };

  if (loading && !state) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error && !state) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => { setLoading(true); fetchState(); }}
          className="px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
          Anand Vihar Digital Twin
        </h1>
        <p className="text-gray-400 mt-2">Real-time holistic simulation and monitoring system</p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-gray-700 pb-2">
        {['overview', 'sensors', 'heatmap', 'scenarios'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === tab
              ? 'bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-500'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Visualization (Left 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 3D Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl border border-gray-700 h-[500px] relative overflow-hidden group"
          >
            <div className="absolute inset-0">
              <Scene zones={state?.zones || []} />
            </div>

            {/* Overlay UI */}

            <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="bg-black/50 backdrop-blur-md p-3 rounded-lg border border-gray-600 pointer-events-auto">
                  <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
                    <MapIcon size={20} /> 3D View
                  </h3>
                  <p className="text-xs text-gray-400">Interactive Model</p>
                </div>

                <div className="flex flex-col gap-4 items-end">
                  <div className="bg-black/50 backdrop-blur-md p-3 rounded-lg border border-gray-600 pointer-events-auto">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Live Simulation
                    </div>
                  </div>

                  {/* Zone Stats Overlay - Moved to Right Side */}
                  <div className="space-y-2 pointer-events-auto w-64">
                    {state?.zones?.slice(0, 3).map(zone => (
                      <div key={zone.id} className="bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50 hover:border-cyan-500/50 transition-colors">
                        <h4 className="text-sm font-medium text-white">{zone.name}</h4>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Density: {zone.building_density}</span>
                          <span>Traffic: {zone.traffic_intensity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Heatmap / Analysis View */}
          {activeTab === 'heatmap' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-[500px]"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapIcon className="text-green-400" /> Geospatial Analysis
              </h3>
              <div className="h-[400px] w-full rounded-lg overflow-hidden">
                <Map zones={state?.zones || []} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar Controls (Right 1/3) */}
        <div className="space-y-6">

          {/* Key Metrics */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-cyan-300 flex items-center gap-2">
              <Activity size={20} /> Real-time Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span className="text-gray-400">Avg AQI</span>
                <span className={`text-xl font-bold ${state?.current_metrics?.aqi?.average_aqi > 100 ? 'text-orange-400' : 'text-green-400'}`}>
                  {state?.current_metrics?.aqi?.average_aqi?.toFixed(0) || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span className="text-gray-400">Avg Temp</span>
                <span className="text-xl font-bold text-yellow-400">
                  {state?.current_metrics?.heat_island?.average_temperature?.toFixed(1) || 'N/A'}°C
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span className="text-gray-400">Wind Speed</span>
                <span className="text-xl font-bold text-blue-400 flex items-center gap-1">
                  <Wind size={16} /> {state?.current_metrics?.pm25_dispersion?.wind_speed_ms?.toFixed(1) || '0'} m/s
                </span>
              </div>
            </div>
          </div>

          {/* Scenarios Control */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-purple-300 flex items-center gap-2">
              <MapIcon size={20} /> Scenario Runner
            </h3>
            <div className="space-y-3">
              <select
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-sm focus:border-cyan-500 outline-none"
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
              >
                <option value="">Select Scenario...</option>
                <option value="severe_pollution_morning_peak">Severe Pollution Morning Peak</option>
                <option value="evening_traffic_haze">Evening Traffic Haze</option>
                <option value="heatwave_high_aqi">Heatwave + High AQI</option>
                <option value="wind_shift_event">Wind Shift Event</option>
              </select>
              <button
                onClick={() => selectedScenario && runScenario(selectedScenario)}
                disabled={!selectedScenario}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Play size={16} /> Run Simulation
              </button>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-orange-300 flex items-center gap-2">
              <AlertTriangle size={20} /> Active Alerts
            </h3>
            <div className="space-y-3">
              {state?.hotspots?.map((hotspot, idx) => (
                <div key={idx} className="bg-orange-900/20 border border-orange-500/30 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-orange-200">{hotspot.zone_name}</span>
                    <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded">
                      {hotspot.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    High {hotspot.type} detected. AQI: {hotspot.metrics?.aqi}
                  </p>
                </div>
              ))}
              {(!state?.hotspots || state.hotspots.length === 0) && (
                <p className="text-sm text-gray-500 italic">No active alerts.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;
