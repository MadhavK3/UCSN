import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CloudRain, 
  Shield, 
  Brain, 
  Zap, 
  Wifi,
  X,
  ArrowRight
} from 'lucide-react'

const Features: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null)

  const features = [
    {
      id: 1,
      icon: CloudRain,
      title: 'Urban Cooling Nodes',
      description: 'Smart systems that reduce urban heat island effect through evaporative cooling and shade optimization',
      details: 'Our cooling nodes use advanced misting technology and adaptive shading to reduce ambient temperatures by up to 5°C. Each node is IoT-connected and can be controlled remotely based on real-time weather data and predictive analytics.',
      image: '/api/placeholder/400/250',
      benefits: [
        'Reduces energy consumption for cooling',
        'Improves outdoor comfort and safety',
        'Lowers urban heat island effect',
        'Integrates with existing infrastructure'
      ]
    },
    {
      id: 2,
      icon: Shield,
      title: 'Smart Coastal Shields',
      description: 'Adaptive barrier systems that protect coastal areas from storm surges and rising sea levels',
      details: 'Our coastal protection system uses retractable barriers that can be deployed in minutes when storm surges are detected. The system includes predictive modeling that forecasts water levels 48 hours in advance with 95% accuracy.',
      image: '/api/placeholder/400/250',
      benefits: [
        'Protects against storm surges up to 3m',
        'Minimal visual impact when retracted',
        'Solar-powered operation',
        'Real-time monitoring and alerts'
      ]
    },
    {
      id: 3,
      icon: Brain,
      title: 'AI Command Hub',
      description: 'Central intelligence that predicts, monitors, and responds to climate events in real-time',
      details: 'The AI hub processes data from thousands of sensors across the city, using machine learning to predict climate events and optimize response strategies. It can automatically activate defense systems and coordinate emergency services.',
      image: '/api/placeholder/400/250',
      benefits: [
        'Predicts events with 92% accuracy',
        'Reduces response time by 75%',
        'Automates resource allocation',
        'Provides detailed analytics and reporting'
      ]
    },
    {
      id: 4,
      icon: Zap,
      title: 'Energy Harvesting',
      description: 'Renewable energy systems that power resilience infrastructure while reducing carbon footprint',
      details: 'Our integrated energy system combines solar, wind, and kinetic energy harvesting to power all resilience infrastructure. Excess energy is fed back into the grid, creating a revenue stream that offsets maintenance costs.',
      image: '/api/placeholder/400/250',
      benefits: [
        'Generates 125% of system energy needs',
        'Reduces carbon emissions by 3200 tons/year',
        'Provides emergency backup power',
        'Payback period of 3.5 years'
      ]
    },
    {
      id: 5,
      icon: Wifi,
      title: 'IoT Grid',
      description: 'Network of sensors providing real-time environmental data across the urban landscape',
      details: 'The IoT grid consists of over 10,000 sensors monitoring temperature, humidity, air quality, water levels, and energy consumption. Data is transmitted securely to the AI hub for analysis and decision-making.',
      image: '/api/placeholder/400/250',
      benefits: [
        'Real-time environmental monitoring',
        'Predictive maintenance alerts',
        'Scalable and modular design',
        '5-year battery life on all sensors'
      ]
    }
  ]

  // Lightweight, dependency-free visualization used inside the feature modal.
  // Renders a small deterministic IoT grid where each cell color is computed
  // from the feature title so the visualization is consistent per feature.
  const GridVisualization: React.FC<{ title: string }> = ({ title }) => {
    const rows = 6
    const cols = 12
    const cellSize = 18
    const gap = 8
    const padding = 10
    const width = cols * cellSize + (cols - 1) * gap + padding * 2
    const height = rows * cellSize + (rows - 1) * gap + padding * 2 + 30

    const computeValue = (r: number, c: number) => {
      // deterministic pseudo-value derived from title so each feature looks distinct
      const t = title.length
      const v = (Math.sin((r + 1) * 0.6 + t * 0.13) + Math.cos((c + 1) * 0.4 + t * 0.07)) * 0.5 + 0.5
      return Math.max(0, Math.min(1, v))
    }

    const colorFor = (v: number) => {
      // simple green->yellow->red mapping
      const r = Math.round(Math.min(255, 255 * Math.max(0, (v - 0.5) * 2)))
      const g = Math.round(Math.min(255, 255 * (1 - Math.abs(v - 0.5) * 2)))
      const b = 60
      return `rgb(${r},${g},${b})`
    }

    const [hover, setHover] = useState<{ r: number; c: number; v: number } | null>(null)

    return (
      <div className="w-full flex items-center justify-center">
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title} grid visualization`}>
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((__, c) => {
              const v = computeValue(r, c)
              const x = padding + c * (cellSize + gap)
              const y = padding + r * (cellSize + gap)
              return (
                <g key={`${r}-${c}`}>
                  <rect
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    rx={4}
                    fill={colorFor(v)}
                    stroke="rgba(0,0,0,0.06)"
                    onMouseEnter={() => setHover({ r, c, v })}
                    onMouseLeave={() => setHover(null)}
                    style={{ cursor: 'default' }}
                  />
                </g>
              )
            })
          )}

          {hover && (
            <g>
              <rect x={padding} y={height - 28} width={width - padding * 2} height={22} rx={6} fill="rgba(0,0,0,0.6)" />
              <text x={width / 2} y={height - 12} textAnchor="middle" fontSize={12} fill="#fff">
                {`Sensor ${hover.r + 1},${hover.c + 1}: ${(hover.v * 100).toFixed(0)}%`}
              </text>
            </g>
          )}
        </svg>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            System Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our comprehensive climate resilience system combines multiple technologies to create a cohesive defense against climate challenges
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedFeature(feature.id)}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                  Learn more <ArrowRight className="ml-1" size={16} />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* System Integration Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Integrated System Architecture
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-8">
            All components work together seamlessly through our unified platform, creating a smart ecosystem that's greater than the sum of its parts
          </p>
          
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-64 flex items-center justify-center">
            <div className="text-center text-gray-500 w-full">
              <div className="mx-auto mb-3" style={{maxWidth: 560}}>
                {/* Small inline system architecture SVG diagram (non-critical, decorative)
                    Keeps everything local so no external assets are required. */}
                <svg viewBox="0 0 800 240" width="100%" height="160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="System architecture diagram">
                  <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                      <path d="M0,0 L10,5 L0,10 z" fill="#2563eb" />
                    </marker>
                  </defs>
                  <rect x="20" y="20" width="160" height="80" rx="8" fill="#e0f2fe" stroke="#bfdbfe" />
                  <text x="100" y="65" textAnchor="middle" fontSize="14" fill="#075985">Sensors / IoT</text>

                  <rect x="220" y="10" width="200" height="100" rx="8" fill="#ecfccb" stroke="#bbf7d0" />
                  <text x="320" y="55" textAnchor="middle" fontSize="14" fill="#14532d">Edge & AI Hub</text>

                  <rect x="460" y="20" width="200" height="80" rx="8" fill="#f0f9ff" stroke="#dbeafe" />
                  <text x="560" y="65" textAnchor="middle" fontSize="14" fill="#0f172a">Control & Actuation</text>

                  <line x1="180" y1="60" x2="220" y2="60" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arrow)" />
                  <line x1="420" y1="60" x2="460" y2="60" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arrow)" />

                  {/* small legend */}
                  <g transform="translate(20,132)">
                    <rect x="0" y="0" width="18" height="12" fill="#e0f2fe" stroke="#bfdbfe" rx="2"/>
                    <text x="28" y="10" fontSize="12" fill="#475569">Sensors</text>
                    <rect x="140" y="0" width="18" height="12" fill="#ecfccb" stroke="#bbf7d0" rx="2"/>
                    <text x="170" y="10" fontSize="12" fill="#475569">AI Hub</text>
                    <rect x="300" y="0" width="18" height="12" fill="#f0f9ff" stroke="#dbeafe" rx="2"/>
                    <text x="330" y="10" fontSize="12" fill="#475569">Actuation</text>
                  </g>
                </svg>
              </div>
              <p className="text-sm">System architecture: sensors feed the AI hub which coordinates control systems and interventions</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feature Detail Modal */}
      <AnimatePresence>
        {selectedFeature !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedFeature(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const feature = features.find(f => f.id === selectedFeature)
                if (!feature) return null
                const Icon = feature.icon
                
                return (
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                          <Icon className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {feature.title}
                        </h2>
                      </div>
                      <button
                        onClick={() => setSelectedFeature(null)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center p-4">
                      <div className="text-center text-gray-500 w-full">
                        <GridVisualization title={feature.title} />
                        <p className="text-sm mt-2">Diagram or image of {feature.title}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {feature.details}
                    </p>

                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Key Benefits
                    </h3>
                    <ul className="space-y-2 mb-6">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                            <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                          </div>
                          <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex space-x-4">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                        Request Demo
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg transition-colors">
                        Technical Specifications
                      </button>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Features