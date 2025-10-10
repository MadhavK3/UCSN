import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Thermometer, 
  Droplets, 
  Zap, 
  CloudRain,
  Target
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const AnimatedCounter: React.FC<{ value: number; suffix?: string; decimals?: number }> = ({ 
  value, 
  suffix = '', 
  decimals = 0 
}) => {
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    const duration = 2000 // ms
    const steps = 60
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      current += increment
      step += 1
      setCurrentValue(current)
      
      if (step >= steps) {
        setCurrentValue(value)
        clearInterval(timer)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return <>{currentValue.toFixed(decimals)}{suffix}</>
}

const Impact: React.FC = () => {
  const [timeframe, setTimeframe] = useState('year')

  const impactData = {
    temperatureReduction: 3.2,
    floodIncidentsReduced: 42,
    energyGenerated: 1250,
    co2Avoided: 3200
  }

  const timelineData = [
    {
      date: 'Jan 2023',
      title: 'System Deployment',
      description: 'Initial deployment of cooling nodes in downtown area',
      icon: Target
    },
    {
      date: 'Mar 2023',
      title: 'Coastal Barriers Activated',
      description: 'First successful activation during spring tides',
      icon: Droplets
    },
    {
      date: 'Jun 2023',
      title: 'Heatwave Response',
      description: 'System reduced peak temperatures by 4.2°C during heatwave',
      icon: Thermometer
    },
    {
      date: 'Sep 2023',
      title: 'Energy Milestone',
      description: 'Produced 1.5GWh of renewable energy',
      icon: Zap
    },
    {
      date: 'Dec 2023',
      title: 'Expansion Phase',
      description: 'System expanded to cover 100% of urban area',
      icon: Target
    }
  ]

  const performanceData = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    temperature: 25 - (i % 3),
    incidents: 10 - Math.floor(i / 2),
    energy: 80 + (i * 5)
  }))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Impact Assessment
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Measuring the positive environmental and social impact of our climate resilience systems
          </p>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Thermometer className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              <AnimatedCounter value={impactData.temperatureReduction} decimals={1} />°C
            </div>
            <div className="text-gray-600 dark:text-gray-300">Average Temperature Reduction</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Droplets className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              <AnimatedCounter value={impactData.floodIncidentsReduced} />%
            </div>
            <div className="text-gray-600 dark:text-gray-300">Flood Incidents Reduced</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
          >
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="text-yellow-600 dark:text-yellow-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
              <AnimatedCounter value={impactData.energyGenerated} />MWh
            </div>
            <div className="text-gray-600 dark:text-gray-300">Clean Energy Generated</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CloudRain className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              <AnimatedCounter value={impactData.co2Avoided} /> tons
            </div>
            <div className="text-gray-600 dark:text-gray-300">CO₂ Emissions Avoided</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Performance Trends
              </h2>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="month">Month</option>
                <option value="quarter">Quarter</option>
                <option value="year">Year</option>
              </select>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Temp Reduction (°C)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="incidents" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Incidents Reduced (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="energy" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    name="Energy (MWh)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Impact Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Implementation Timeline
            </h2>
            
            <div className="space-y-4">
              {timelineData.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex"
                  >
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Icon className="text-blue-600 dark:text-blue-400" size={16} />
                      </div>
                      {index < timelineData.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-200 dark:bg-gray-700 my-1"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 pb-4">
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {item.date}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mt-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Case Studies */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mt-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Success Stories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Downtown Cooling Project',
                result: '3.5°C reduction in peak temperatures',
                impact: 'Reduced energy consumption by 15% during heatwaves'
              },
              {
                title: 'Coastal Protection Initiative',
                result: 'Zero flood damage during spring tides',
                impact: 'Protected $2.3M in property value'
              },
              {
                title: 'Renewable Energy Integration',
                result: '1.2GWh of clean energy generated',
                impact: 'Offset 950 tons of CO₂ emissions'
              },
              {
                title: 'Community Resilience Program',
                result: '42% faster emergency response',
                impact: 'Trained 250+ community volunteers'
              }
            ].map((story, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {story.title}
                </h3>
                <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                  {story.result}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                  {story.impact}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Impact