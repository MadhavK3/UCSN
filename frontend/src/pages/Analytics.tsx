import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Download,
  Filter,
  MapPin,
  TrendingUp
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

import { useThemeStore } from '../state/themeStore'

const Analytics: React.FC = () => {
  const { isDark } = useThemeStore()
  const [dateRange, setDateRange] = useState('7d')
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['temp', 'aqi'])
  const [data, setData] = useState<any[]>([])

  const metrics = [
    { id: 'temp', name: 'Temperature', color: '#EF4444' },
    { id: 'aqi', name: 'Air Quality', color: '#10B981' },
    { id: 'humidity', name: 'Humidity', color: '#3B82F6' },
    { id: 'rainfall', name: 'Rainfall', color: '#6366F1' },
    { id: 'waveHeight', name: 'Wave Height', color: '#8B5CF6' },
    { id: 'energyOutput', name: 'Energy Output', color: '#F59E0B' }
  ]

  const zoneData = [
    { name: 'North', value: 400, color: '#3B82F6' },
    { name: 'South', value: 300, color: '#10B981' },
    { name: 'East', value: 300, color: '#F59E0B' },
    { name: 'West', value: 200, color: '#EF4444' },
    { name: 'Central', value: 278, color: '#8B5CF6' }
  ]

  useEffect(() => {
    // Generate more realistic mock data based on selected metrics
    const generateData = () => {
      return Array.from({ length: 30 }, (_, i) => {
        const entry: any = { day: i + 1 }
        const time = i / 5 // Time factor for sine waves

        metrics.forEach(metric => {
          if (selectedMetrics.includes(metric.id)) {
            // Base values + sine wave + random noise
            let val = 0
            if (metric.id === 'temp') val = 28 + 5 * Math.sin(time) + Math.random() * 2
            else if (metric.id === 'aqi') val = 100 + 40 * Math.cos(time * 0.5) + Math.random() * 20
            else if (metric.id === 'humidity') val = 60 + 15 * Math.sin(time + 2) + Math.random() * 5
            else if (metric.id === 'rainfall') val = Math.max(0, 5 * Math.sin(time * 2) - 2) * 10 // Spiky rainfall
            else if (metric.id === 'waveHeight') val = 1.5 + 0.5 * Math.sin(time * 3) + Math.random() * 0.3
            else if (metric.id === 'energyOutput') val = 500 + 100 * Math.sin(time) + Math.random() * 50

            entry[metric.id] = parseFloat(val.toFixed(1))
          }
        })

        return entry
      })
    }

    setData(generateData())
  }, [selectedMetrics, dateRange])

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    )
  }

  const handleExport = () => {
    if (data.length === 0) return

    const headers = ['Day', ...selectedMetrics].join(',')
    const rows = data.map(row => {
      return [row.day, ...selectedMetrics.map(m => row[m])].join(',')
    })
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "climate_analytics_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-fixed bg-center">
      <div className="min-h-screen bg-white/90 dark:bg-black/80 backdrop-blur-sm w-full px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-600 mb-2 text-glow">
            ANALYTICS DASHBOARD
          </h1>
          <p className="text-gray-600 dark:text-gray-300 font-mono">
            Track trends, compare interventions, and identify anomalies across your resilience network
          </p>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <Filter className="mr-2 text-purple-600 dark:text-purple-400" size={20} />
                Filter Analytics
              </h2>
            </div>

            <div className="flex flex-wrap gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
              >
                <option value="24h" className="bg-white dark:bg-gray-900">Last 24 hours</option>
                <option value="7d" className="bg-white dark:bg-gray-900">Last 7 days</option>
                <option value="30d" className="bg-white dark:bg-gray-900">Last 30 days</option>
                <option value="90d" className="bg-white dark:bg-gray-900">Last 90 days</option>
              </select>

              <button className="px-4 py-2 bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white flex items-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                <Calendar className="mr-2" size={16} />
                Custom Range
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Select Metrics
            </h3>
            <div className="flex flex-wrap gap-2">
              {metrics.map(metric => (
                <button
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${selectedMetrics.includes(metric.id)
                    ? 'bg-purple-100 dark:bg-purple-500/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/50'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                >
                  {metric.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="mr-2 text-cyan-600 dark:text-cyan-400" size={20} />
                Trends Over Time
              </h2>
              <button
                onClick={handleExport}
                className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 px-3 py-1 rounded-lg"
              >
                <Download className="mr-1" size={16} />
                Export CSV
              </button>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                  <XAxis dataKey="day" stroke={isDark ? "#9ca3af" : "#4b5563"} />
                  <YAxis stroke={isDark ? "#9ca3af" : "#4b5563"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#000'
                    }}
                  />
                  {metrics.filter(m => selectedMetrics.includes(m.id)).map(metric => (
                    <Line
                      key={metric.id}
                      type="monotone"
                      dataKey={metric.id}
                      stroke={metric.color}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Zone Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <MapPin className="mr-2 text-green-600 dark:text-green-400" size={20} />
              Zone Performance
            </h2>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={zoneData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {zoneData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#000'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Anomaly Detection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Anomaly Detection
            </h2>

            <div className="space-y-4">
              {[
                { metric: 'Temperature', zone: 'North', deviation: '+2.8°C', severity: 'high' },
                { metric: 'Rainfall', zone: 'West', deviation: '+15mm', severity: 'medium' },
                { metric: 'Energy Output', zone: 'Central', deviation: '-12%', severity: 'medium' },
                { metric: 'Wave Height', zone: 'Coastal', deviation: '+0.8m', severity: 'low' }
              ].map((anomaly, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{anomaly.metric}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{anomaly.zone} Zone</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${anomaly.severity === 'high'
                    ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30'
                    : anomaly.severity === 'medium'
                      ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30'
                      : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
                    }`}>
                    {anomaly.deviation}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Before/After Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-card rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Intervention Impact Comparison
            </h2>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.slice(0, 7)}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                  <XAxis dataKey="day" stroke={isDark ? "#9ca3af" : "#4b5563"} />
                  <YAxis stroke={isDark ? "#9ca3af" : "#4b5563"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#000'
                    }}
                  />
                  <Bar dataKey="temp" fill="#3B82F6" name="Before" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="aqi" fill="#10B981" name="After" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Analytics