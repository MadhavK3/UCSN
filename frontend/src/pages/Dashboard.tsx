import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Cpu, 
  RefreshCw 
} from 'lucide-react'
// using Windy iframe for temperature overlay as requested

const Dashboard: React.FC = () => {
  const [iframeKey, setIframeKey] = useState(0)
  const [lat, setLat] = useState<number | null>(null)
  const [lon, setLon] = useState<number | null>(null)
  const [geoStatus, setGeoStatus] = useState<string>('locating')
  const [oceanIframeKey, setOceanIframeKey] = useState(0)
  const [weather, setWeather] = useState<any>(null)
  const [localCity, setLocalCity] = useState<string | null>(null)
  const [floodAlert, setFloodAlert] = useState<any>(null)
  const [hotspots, setHotspots] = useState<any[]>([])
  const [greenSim, setGreenSim] = useState<any[]>([])
  const [energyForecast, setEnergyForecast] = useState<any>(null)
  const [coolingStatus, setCoolingStatus] = useState<any>(null)

  useEffect(() => {
  // (UHI geojson endpoint removed from UI) -- keep other fetches
    // Fetch weather
    fetch('http://localhost:8000/api/weather?city=Mumbai')
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(() => setWeather(null))
    // Fetch flood alert (if endpoint exists)
    fetch('http://localhost:8000/api/floodalert')
      .then(res => res.json())
      .then(data => setFloodAlert(data))
      .catch(() => setFloodAlert(null))
    fetch('http://localhost:8000/api/hotspots')
      .then(res => res.json())
      .then(data => setHotspots(data))
      .catch(() => setHotspots([]))
    fetch('http://localhost:8000/api/energyforecast?city=Mumbai')
      .then(res => res.json())
      .then(data => setEnergyForecast(data))
      .catch(() => setEnergyForecast(null))
    // try to get user location for the Windy embed
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude)
          setLon(pos.coords.longitude)
          setGeoStatus('current')
          // fetch reverse geocode and weather for the user's coordinates
          fetch(`http://localhost:8000/api/reverse-geocode?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
            .then(r => r.json())
            .then(d => setLocalCity(d?.name ?? null))
            .catch(() => setLocalCity(null))

          fetch(`http://localhost:8000/api/weather-by-coords?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
            .then(r => r.json())
            .then(d => setWeather(d))
            .catch(() => {})
        },
        (_) => {
          // fallback to default
          setLat(17.202)
          setLon(77.285)
          setGeoStatus('default')
        },
        { enableHighAccuracy: false, timeout: 5000 }
      )
  } else {
      setLat(17.202)
      setLon(77.285)
      setGeoStatus('unsupported')
    }
  }, [])

  // reload Windy iframe by changing key
  const reloadIframe = () => setIframeKey(k => k + 1)

  const runGreenSim = () => {
    fetch('http://localhost:8000/api/green-simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        if (!res.ok) throw new Error('Simulation failed')
        return res.json()
      })
      .then(data => setGreenSim(Array.isArray(data) ? data : []))
      .catch(() => setGreenSim([]))
  }

  const activateCooling = (zone: string) => {
    fetch(`http://localhost:8000/api/cooling-control?zone=${encodeURIComponent(zone)}&activate=true`, {
      method: 'POST',
    })
      .then(res => res.json())
      .then(data => setCoolingStatus(data))
      .catch(() => setCoolingStatus(null))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Command Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor and manage your climate resilience infrastructure in real-time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
              <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Activity className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">{
                typeof weather?.main?.temp === 'number' ? `${Math.round((weather.main.temp - 273.15) * 10) / 10}°C` : '...'
              }</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Weather {localCity ? `(${localCity})` : '(Mumbai)'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {weather?.weather?.[0]?.description ?? 'Loading...'}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Cpu className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">247</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Active Sensors
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              12 needing attention
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-amber-600 dark:text-amber-400" size={20} />
              </div>
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Active Alerts
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              All medium priority
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{typeof energyForecast?.forecast?.peak_demand !== 'undefined' ? `${energyForecast.forecast.peak_demand}MW` : '...'}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Energy Production
            </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
              {energyForecast?.forecast?.trend ?? '+12% from yesterday'}
            </p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* UHI Heatmap Widget */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Urban Heat Island Map
                </h2>
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  onClick={reloadIframe}
                >
                  <RefreshCw size={16} />
                </button>
              </div>
              <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                {/* Windy embed iframe (temperature overlay). This replaces OpenWeather tiles per user request. */}
          <div className="relative h-full w-full">
                  <iframe
                    key={`windy-${iframeKey}`}
                    title="Windy Temperature Map"
                    src={`https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=°C&metricWind=default&zoom=8&overlay=temp&product=ecmwf&level=surface&lat=${lat ?? 17.202}&lon=${lon ?? 77.285}&message=true`}
                    style={{ width: '100%', height: '100%', border: 0 }}
                    loading="lazy"
                  />
            {/* Visual mask removed for top-right controls to avoid covering map UI */}
            <div className="absolute left-4 bottom-4 bg-white/80 dark:bg-black/60 text-xs px-2 py-1 rounded z-20">
                    {geoStatus === 'locating' && 'Locating...'}
                    {geoStatus === 'current' && 'Using your location'}
                    {geoStatus === 'default' && 'Using default location'}
                    {geoStatus === 'unsupported' && 'Geolocation unsupported'}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hotspots Widget */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Heat Pockets
              </h2>
              <ul>
                {hotspots.filter(Boolean).map(h => (
                  <li key={h?.zone ?? Math.random()} className="mb-2 text-gray-900 dark:text-white">
                    <span className="font-bold">{h?.zone ?? 'unknown'}</span> — {typeof h?.temp !== 'undefined' ? `${h.temp}°C` : 'N/A'} ({h?.type ?? '—'})
                    <button className="ml-2 px-2 py-1 bg-blue-500 text-white rounded" onClick={() => h?.zone && activateCooling(h.zone)} disabled={!h?.zone}>
                      Activate Cooling
                    </button>
                  </li>
                ))}
              </ul>
              {coolingStatus && <div className="mt-2 text-green-600">{coolingStatus.zone} cooling system activated!</div>}
            </motion.div>

            {/* Green Simulation Widget */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Green Simulation
              </h2>
              <button className="mb-2 px-4 py-2 bg-green-600 text-white rounded" onClick={runGreenSim}>
                Run Simulation
              </button>
              <ul>
                {greenSim.filter(Boolean).map((sim) => (
                  <li key={sim?.zone ?? Math.random()} className="mb-2 text-gray-900 dark:text-white">
                    <span className="font-bold">{sim?.zone ?? 'unknown'}</span>: {typeof sim?.original_temp !== 'undefined' ? `${sim.original_temp}°C` : 'N/A'} → {typeof sim?.simulated_temp !== 'undefined' ? `${sim.simulated_temp}°C` : 'N/A'}, CO₂ reduction: {sim?.co2_reduction ?? '—'}kg/year
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Coastal Shield Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Coastal Shield Status
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2.3m</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Wave Height</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">1.1m</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Tide Level</div>
                </div>
              </div>
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                {/* Windy ocean/waves embed centered on user location */}
                <iframe
                  key={`ocean-${oceanIframeKey}`}
                  title="Windy Ocean Map"
                  src={`https://embed.windy.com/embed.html?type=map&location=coordinates&metricWind=default&zoom=6&overlay=waves&product=gfs&level=surface&lat=${lat ?? 17.202}&lon=${lon ?? 77.285}&message=true`}
                  style={{ width: '100%', height: '100%', border: 0 }}
                  loading="lazy"
                />
                {/* bottom-left mask to hide Windy watermark; pointer-events-none keeps iframe interactive */}
                <div className="absolute left-3 bottom-3 w-40 h-6 bg-white dark:bg-gray-800 rounded pointer-events-none z-10" />
                <button
                  className="absolute right-3 top-3 p-1 bg-white/80 dark:bg-black/60 rounded z-20"
                  onClick={() => setOceanIframeKey(k => k + 1)}
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Activate Misting Systems
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Raise Coastal Barriers
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Dispatch Drones
                </button>
              </div>
            </motion.div>

            {/* Flood Alert Widget */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Flood Alert
              </h2>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="ml-2 text-gray-500 dark:text-gray-300">{floodAlert ? floodAlert.risk : 'No data'}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard