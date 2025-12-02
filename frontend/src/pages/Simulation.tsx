import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trees, Sun, Shield, Layers, Play, RotateCcw, MapPin } from 'lucide-react'
import WeatherMap from '../components/Map/WeatherMap'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Custom Icons for Map
const treeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const paintIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const roofIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const barrierIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const Simulation: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [mapPoints, setMapPoints] = useState<any[]>([])
  const [carbonData, setCarbonData] = useState<any>(null)
  const [cbaData, setCbaData] = useState<any>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [params, setParams] = useState({
    trees: 100,
    reflective_paint: true,
    green_roofs: true,
    coastal_barriers: false
  })

  useEffect(() => {
    // Get User Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          // Fallback to Mumbai
          setUserLocation({ lat: 19.0760, lon: 72.8777 })
        }
      )
    } else {
      setUserLocation({ lat: 19.0760, lon: 72.8777 })
    }
  }, [])

  const runSimulation = () => {
    setLoading(true)
    // Construct query params
    const query = new URLSearchParams({
      city: 'Mumbai',
      trees: params.trees.toString(),
      reflective_paint: params.reflective_paint.toString(),
      green_roofs: params.green_roofs.toString(),
      coastal_barriers: params.coastal_barriers.toString(),
      lat: userLocation ? userLocation.lat.toString() : '19.0760',
      lon: userLocation ? userLocation.lon.toString() : '72.8777'
    })

    fetch(`http://localhost:8000/api/green-simulate?${query.toString()}`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        setResults(data.impact_stats)
        setMapPoints(data.map_points)
        setCarbonData(data.carbon_analysis || null)
        setCbaData(data.cost_benefit_analysis || null)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  const reset = () => {
    setResults([])
    setMapPoints([])
    setCarbonData(null)
    setCbaData(null)
    setParams({
      trees: 100,
      reflective_paint: true,
      green_roofs: true,
      coastal_barriers: false
    })
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'tree': return treeIcon
      case 'paint': return paintIcon
      case 'roof': return roofIcon
      case 'barrier': return barrierIcon
      default: return treeIcon
    }
  }

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-fixed bg-center">
      <div className="min-h-screen bg-white/90 dark:bg-black/80 backdrop-blur-sm w-full px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-cyan-600 dark:from-green-400 dark:to-cyan-500 mb-2 text-glow">
            PREDICTIVE SIMULATION ENGINE
          </h1>
          <p className="text-gray-600 dark:text-gray-300 font-mono">
            Test climate interventions and visualize impact before deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Controls */}
          <div className="glass-card rounded-xl p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Layers className="mr-2 text-cyan-600 dark:text-cyan-400" /> Parameters
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 flex items-center">
                  <Trees className="mr-2 text-green-600 dark:text-green-400" size={16} /> Tree Plantation Density
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={params.trees}
                  onChange={(e) => setParams({ ...params, trees: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <div className="text-right text-green-600 dark:text-green-400 font-mono">{params.trees} Units</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                <span className="text-gray-700 dark:text-gray-300 flex items-center">
                  <Sun className="mr-2 text-yellow-500 dark:text-yellow-400" size={16} /> Reflective Paint
                </span>
                <input
                  type="checkbox"
                  checked={params.reflective_paint}
                  onChange={(e) => setParams({ ...params, reflective_paint: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                <span className="text-gray-700 dark:text-gray-300 flex items-center">
                  <Trees className="mr-2 text-green-600 dark:text-green-600" size={16} /> Green Roofs
                </span>
                <input
                  type="checkbox"
                  checked={params.green_roofs}
                  onChange={(e) => setParams({ ...params, green_roofs: e.target.checked })}
                  className="w-5 h-5 accent-green-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                <span className="text-gray-700 dark:text-gray-300 flex items-center">
                  <Shield className="mr-2 text-blue-600 dark:text-blue-400" size={16} /> Coastal Barriers
                </span>
                <input
                  type="checkbox"
                  checked={params.coastal_barriers}
                  onChange={(e) => setParams({ ...params, coastal_barriers: e.target.checked })}
                  className="w-5 h-5 accent-blue-500"
                />
              </div>

              <div className="pt-4 flex space-x-4">
                <button
                  onClick={runSimulation}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center"
                >
                  {loading ? 'Simulating...' : <><Play size={18} className="mr-2" /> RUN SIMULATION</>}
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg transition-colors"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Results & Map */}
          <div className="lg:col-span-2 space-y-6">

            {/* Map Visualization */}
            <div className="glass-panel rounded-xl p-1 h-[400px] relative overflow-hidden">
              <div className="absolute top-4 left-4 z-[1000] bg-white/90 dark:bg-black/70 p-2 rounded text-gray-900 dark:text-white text-xs font-mono flex items-center shadow-sm">
                <MapPin size={12} className="mr-1 text-green-500" /> INTERVENTION MAP
              </div>
              {userLocation ? (
                <WeatherMap lat={userLocation.lat} lon={userLocation.lon} className="h-full w-full rounded-lg">
                  {mapPoints.map((pt, idx) => (
                    <Marker key={idx} position={[pt.lat, pt.lon]} icon={getIcon(pt.type)}>
                      <Popup>
                        <strong>{pt.type.toUpperCase()}</strong><br />
                        {pt.description}
                      </Popup>
                    </Marker>
                  ))}
                </WeatherMap>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-white">Locating...</div>
              )}
            </div>

            {results.length === 0 ? (
              <div className="glass-panel rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <Layers size={48} className="mb-4 opacity-20" />
                <p>Run simulation to see impact analysis.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`grid grid-cols-1 ${cbaData ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4`}>
                  <div className="glass-card p-4 rounded-xl text-center">
                    <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Avg Temp Reduction</div>
                    <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                      -{Math.round(results.reduce((acc, curr) => acc + (curr.original_temp - curr.simulated_temp), 0) / results.length * 10) / 10}°C
                    </div>
                  </div>
                  <div className="glass-card p-4 rounded-xl text-center">
                    <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">CO₂ Sequestered</div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {carbonData ? `${carbonData.total_co2_offset_tons.toFixed(1)} tons` : `${results.reduce((acc, curr) => acc + curr.co2_reduction, 0)} kg`}
                    </div>
                    {carbonData && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ≈ {carbonData.equivalent_cars_removed} cars removed
                      </div>
                    )}
                  </div>
                  <div className="glass-card p-4 rounded-xl text-center">
                    <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Energy Saved</div>
                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                      ~{Math.round(results.length * 1.2)} kWh
                    </div>
                  </div>
                  {cbaData && (
                    <div className="glass-card p-4 rounded-xl text-center">
                      <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">ROI</div>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {cbaData.aggregate.overall_roi_percent.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ${cbaData.aggregate.total_cost_usd.toLocaleString()} investment
                      </div>
                    </div>
                  )}
                </div>

                <div className="glass-panel rounded-xl overflow-hidden">
                  <table className="w-full text-left text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-100 dark:bg-black/40 text-xs uppercase font-bold text-gray-500">
                      <tr>
                        <th className="p-4">Zone</th>
                        <th className="p-4">Current Temp</th>
                        <th className="p-4">Projected Temp</th>
                        <th className="p-4">Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {results.map((res, idx) => (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="hover:bg-gray-50 dark:hover:bg-white/5"
                        >
                          <td className="p-4 font-bold text-gray-900 dark:text-white">{res.zone}</td>
                          <td className="p-4 text-red-500 dark:text-red-400">{res.original_temp}°C</td>
                          <td className="p-4 text-green-600 dark:text-green-400 font-bold">{Math.round(res.simulated_temp * 10) / 10}°C</td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded text-xs">
                              -{Math.round((res.original_temp - res.simulated_temp) * 10) / 10}°C
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Carbon & Cost-Benefit Details */}
                {(carbonData || cbaData) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {carbonData && (
                      <div className="glass-panel rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Trees className="mr-2 text-green-600 dark:text-green-400" /> Carbon Impact
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Total CO₂ Offset:</span>
                            <span className="font-bold text-green-600 dark:text-green-400">
                              {carbonData.total_co2_offset_tons} tons/year
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Carbon Credits:</span>
                            <span className="font-bold text-cyan-600 dark:text-cyan-400">
                              {carbonData.carbon_credits}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Equivalent Trees:</span>
                            <span className="font-bold">{carbonData.equivalent_trees}</span>
                          </div>
                          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Equivalent to removing {carbonData.equivalent_cars_removed} cars from the road
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {cbaData && (
                      <div className="glass-panel rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Sun className="mr-2 text-yellow-600 dark:text-yellow-400" /> Cost-Benefit Analysis
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Initial Investment:</span>
                            <span className="font-bold">${cbaData.aggregate.total_cost_usd.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Net Present Value:</span>
                            <span className={`font-bold ${cbaData.aggregate.total_npv_usd > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              ${cbaData.aggregate.total_npv_usd.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">ROI:</span>
                            <span className={`font-bold ${cbaData.aggregate.overall_roi_percent > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {cbaData.aggregate.overall_roi_percent}%
                            </span>
                          </div>
                          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Based on {cbaData.interventions.length} intervention type(s)
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Simulation