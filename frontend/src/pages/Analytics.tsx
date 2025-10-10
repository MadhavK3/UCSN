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

const Analytics: React.FC = () => {
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
    // Generate mock data based on selected metrics
    const mockData = Array.from({ length: 30 }, (_, i) => {
      const entry: any = { day: i + 1 }
      
      metrics.forEach(metric => {
        if (selectedMetrics.includes(metric.id)) {
          entry[metric.id] = Math.random() * 100
        }
      })
      
      return entry
    })
    
    setData(mockData)
  }, [selectedMetrics, dateRange])

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track trends, compare interventions, and identify anomalies across your resilience network
          </p>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <Filter className="mr-2" size={20} />
                Filter Analytics
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white flex items-center">
                <Calendar className="mr-2" size={16} />
                Custom Range
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Metrics
            </h3>
            <div className="flex flex-wrap gap-2">
              {metrics.map(metric => (
                <button
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedMetrics.includes(metric.id)
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
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
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="mr-2" size={20} />
                Trends Over Time
              </h2>
              <button className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <Download className="mr-1" size={16} />
                Export CSV
              </button>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  {metrics.filter(m => selectedMetrics.includes(m.id)).map(metric => (
                    <Line 
                      key={metric.id}
                      type="monotone" 
                      dataKey={metric.id} 
                      stroke={metric.color}
                      strokeWidth={2}
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
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <MapPin className="mr-2" size={20} />
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
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Anomaly Detection */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
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
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{anomaly.metric}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{anomaly.zone} Zone</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    anomaly.severity === 'high' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                      : anomaly.severity === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
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
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Intervention Impact Comparison
            </h2>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.slice(0, 7)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="temp" fill="#3B82F6" name="Before" />
                  <Bar dataKey="aqi" fill="#10B981" name="After" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-center mt-4 space-x-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-3B82F6 rounded mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Before Intervention</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-10B981 rounded mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">After Intervention</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Analytics