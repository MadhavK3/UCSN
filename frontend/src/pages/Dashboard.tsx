import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Wind,
  Droplets,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import WindyMap from '../components/Map/WindyMap'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

// Mock data for sparklines (since we don't have historical backend data yet)
const generateSparklineData = (base: number, variance: number) => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    value: base + Math.random() * variance - variance / 2
  }))
}

const Dashboard: React.FC = () => {
  const [hubStatus, setHubStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLog, setActionLog] = useState<string[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)

  // Sparkline data states
  const [tempData, setTempData] = useState<any[]>([])
  const [energyData, setEnergyData] = useState<any[]>([])

  const fetchStatus = () => {
    // Don't set loading to true on poll to avoid flickering
    if (!hubStatus) setLoading(true)

    fetch('http://localhost:8000/api/command-hub/status?city=Mumbai')
      .then(res => res.json())
      .then(data => {
        setHubStatus(data)
        setLoading(false)

        // Update sparklines based on current values
        if (tempData.length === 0) {
          setTempData(generateSparklineData(data.subsystems.uhi.average_temp, 2))
          setEnergyData(generateSparklineData(data.subsystems.energy.forecast.peak_demand, 200))
        } else {
          // Shift and push new value
          setTempData(prev => [...prev.slice(1), { time: prev.length, value: data.subsystems.uhi.average_temp }])
          setEnergyData(prev => [...prev.slice(1), { time: prev.length, value: data.subsystems.energy.forecast.peak_demand }])
        }
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 5000) // Poll faster for "live" feel

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

    return () => clearInterval(interval)
  }, [])

  const triggerAction = (system: string, action: string, target: string) => {
    fetch('http://localhost:8000/api/command-hub/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system, action, target })
    })
      .then(res => res.json())
      .then(data => {
        setActionLog(prev => [data.message, ...prev].slice(0, 5))
        fetchStatus() // Refresh status
      })
  }

  if (loading && !hubStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-blue-400 font-mono animate-pulse">INITIALIZING COMMAND LINK...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-fixed bg-center">
      <div className="min-h-screen bg-white/90 dark:bg-[#050510]/90 backdrop-blur-md w-full px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-end border-b border-gray-200 dark:border-white/10 pb-6">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500 text-glow tracking-tight">
                UCSN COMMAND HUB
              </h1>
            </div>
            <p className="text-cyan-700/70 dark:text-cyan-100/60 font-mono text-sm tracking-widest uppercase">
              AI-Powered Urban Climate Shield Network | Mumbai Sector
            </p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <div className={`text-3xl font-black tracking-tighter ${hubStatus?.alert_level === 'RED' ? 'text-red-600 dark:text-red-500 animate-pulse' : hubStatus?.alert_level === 'YELLOW' ? 'text-yellow-600 dark:text-yellow-400' : 'text-emerald-600 dark:text-emerald-400'} `}>
              {hubStatus?.alert_level} STATUS
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1 opacity-70">LAST SYNC: {hubStatus?.timestamp}</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* UHI Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 border border-gray-100 dark:border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity size={80} />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="p-3 bg-orange-100 dark:bg-orange-500/20 rounded-xl">
                <Activity className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{hubStatus?.subsystems?.uhi?.average_temp}°C</span>
            </div>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Urban Heat Index</h3>

            <div className="h-16 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tempData}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#f97316" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
              <span>{hubStatus?.subsystems?.uhi?.hotspots_count} Hotspots</span>
              <span className="text-orange-500 font-bold">High Alert</span>
            </div>

            <button
              onClick={() => triggerAction('Cooling', 'Activate Misting', 'All Hotspots')}
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg transition-all text-xs font-bold tracking-wider shadow-lg shadow-orange-500/20"
            >
              DEPLOY COOLING
            </button>
          </motion.div>

          {/* Flood Defense */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6 border border-gray-100 dark:border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Droplets size={80} />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
                <Droplets className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{hubStatus?.subsystems?.flood?.risk} Risk</span>
            </div>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Flood Defense</h3>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-500">Rainfall</div>
                <div className="text-lg font-bold text-blue-500">{hubStatus?.subsystems?.flood?.details?.rainfall}mm</div>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-500">Tide</div>
                <div className="text-lg font-bold text-cyan-500">{hubStatus?.subsystems?.flood?.details?.tide}m</div>
              </div>
            </div>

            <button
              onClick={() => triggerAction('Flood', 'Raise Barriers', 'Coastal Zone')}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg transition-all text-xs font-bold tracking-wider shadow-lg shadow-blue-500/20"
            >
              RAISE SHIELDS
            </button>
          </motion.div>

          {/* Energy Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 border border-gray-100 dark:border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap size={80} />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="p-3 bg-purple-100 dark:bg-purple-500/20 rounded-xl">
                <Zap className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{hubStatus?.subsystems?.energy?.forecast?.peak_demand} MW</span>
            </div>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Grid Load</h3>

            <div className="h-16 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={energyData}>
                  <defs>
                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#a855f7" fillOpacity={1} fill="url(#colorEnergy)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-xs mb-4">
              <span className="text-gray-500 dark:text-gray-400">Trend: {hubStatus?.subsystems?.energy?.forecast?.trend}</span>
              <span className="text-green-500 font-bold flex items-center">
                <Zap size={10} className="mr-1" />
                +{hubStatus?.subsystems?.coastal?.wave_energy_generated_mw} MW
              </span>
            </div>

            <div className="w-full py-3 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-lg text-center text-xs font-bold tracking-wider">
              GRID BALANCED
            </div>
          </motion.div>

          {/* Air Quality */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6 border border-gray-100 dark:border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wind size={80} />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="p-3 bg-green-100 dark:bg-green-500/20 rounded-xl">
                <Wind className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{hubStatus?.subsystems?.air_quality?.aqi}</span>
            </div>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Air Quality Index</h3>

            <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full rounded-full ${hubStatus?.subsystems?.air_quality?.aqi < 50 ? 'bg-green-500' : hubStatus?.subsystems?.air_quality?.aqi < 100 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, (hubStatus?.subsystems?.air_quality?.aqi / 300) * 100)}%` }}
              ></div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300 mb-6 font-medium">
              Status: {hubStatus?.subsystems?.air_quality?.status}
            </div>

            <button
              onClick={() => triggerAction('Air', 'Activate Purifiers', 'City Center')}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg transition-all text-xs font-bold tracking-wider shadow-lg shadow-green-500/20"
            >
              PURIFY AIR
            </button>
          </motion.div>
        </div>

        {/* Detailed Views */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Map View */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-1 h-[500px] relative overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10">
            <div className="absolute top-4 left-4 z-[1000] bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1.5 rounded-lg text-gray-900 dark:text-white text-xs font-mono flex items-center shadow-lg border border-gray-200 dark:border-white/10">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
              LIVE SATELLITE FEED
            </div>
            {userLocation ? (
              <WindyMap lat={userLocation.lat} lon={userLocation.lon} className="h-full w-full rounded-xl" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-white">Locating...</div>
            )}
          </div>

          {/* System Logs & Coastal Detail */}
          <div className="space-y-6">

            {/* Coastal Detail */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-6 border border-gray-100 dark:border-white/5"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Shield className="mr-2 text-cyan-600 dark:text-cyan-400" /> Coastal Shield Network
              </h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-white/5">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Barrier Status</span>
                  <span className={`font-bold text-sm px-3 py-1 rounded-full ${hubStatus?.subsystems?.coastal?.barriers_active ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'}`}>
                    {hubStatus?.subsystems?.coastal?.barriers_active ? 'DEPLOYED' : 'RETRACTED'}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-white/5">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Erosion Control</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-medium text-sm">{hubStatus?.subsystems?.coastal?.erosion_control_status}</span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Mangrove Health</span>
                    <span className="text-green-500 font-bold text-xs">{(hubStatus?.subsystems?.coastal?.details?.mangrove_health_index || 0) * 100}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-600" style={{ width: `${(hubStatus?.subsystems?.coastal?.details?.mangrove_health_index || 0) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Log */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6 h-[250px] flex flex-col border border-gray-100 dark:border-white/5"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertTriangle className="mr-2 text-yellow-500" size={18} /> System Activity
              </h3>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {actionLog.map((log, i) => (
                  <div key={i} className="flex items-start text-xs p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <CheckCircle size={14} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 font-mono">{log}</span>
                  </div>
                ))}
                {actionLog.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping mb-2"></div>
                    <span className="text-xs font-mono">SYSTEM IDLE - MONITORING</span>
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard