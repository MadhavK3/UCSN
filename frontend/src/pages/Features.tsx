import React from 'react'
import { motion } from 'framer-motion'
import {
  CloudRain,
  Shield,
  Brain,
  Zap,
  Wifi,
  ArrowRight,
  TrendingUp
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Features: React.FC = () => {
  const features = [
    {
      id: 1,
      icon: CloudRain,
      title: 'Urban Cooling Nodes',
      description: 'Smart systems that reduce urban heat island effect through evaporative cooling and shade optimization',
      link: '/features/cooling-nodes'
    },
    {
      id: 2,
      icon: Shield,
      title: 'Smart Coastal Shields',
      description: 'Adaptive barrier systems that protect coastal areas from storm surges and rising sea levels',
      link: '/features/coastal-shields'
    },
    {
      id: 3,
      icon: Brain,
      title: 'AI Command Hub',
      description: 'Central intelligence that predicts, monitors, and responds to climate events in real-time',
      link: '/features/command-hub'
    },
    {
      id: 4,
      icon: Zap,
      title: 'Energy Positive',
      description: 'Renewable energy systems that power resilience infrastructure while reducing carbon footprint',
      link: '/features/energy-positive'
    },
    {
      id: 5,
      icon: Wifi,
      title: 'IoT Sensor Grid',
      description: 'Network of sensors providing real-time environmental data across the urban landscape',
      link: '/features/sensor-grid'
    },
    {
      id: 6,
      icon: TrendingUp,
      title: 'Predictive Intelligence',
      description: 'Forecasting threats before they strike using advanced ML models.',
      link: '/features/predictive-intelligence'
    },
    {
      id: 7,
      icon: Brain,
      title: 'AI/ML Hub',
      description: 'Central hub for ML forecasting, anomaly detection, and automated decision-making.',
      link: '/features/ai-ml-hub'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050510] py-8 transition-colors duration-300">
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
              <Link to={feature.link} key={feature.id} className="block h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all h-full flex flex-col border border-gray-100 dark:border-white/10"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium mt-auto">
                    View Details <ArrowRight className="ml-1" size={16} />
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>

        {/* System Integration Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-white/5 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-white/10"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Integrated Neural Architecture
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-8">
            A unified, self-healing ecosystem where IoT sensor fabrics, edge computing nodes, and autonomous response units synchronize in real-time to maintain urban homeostasis.
          </p>
          <div className="bg-gray-50 dark:bg-black/20 rounded-lg p-4 h-[500px] flex items-center justify-center border border-gray-100 dark:border-white/5 relative overflow-hidden">

            {/* Background Grid & Glow */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none"></div>

            {/* Central Hub Container */}
            <div className="relative w-[400px] h-[400px] flex items-center justify-center">

              {/* Orbit Rings */}
              <div className="absolute inset-0 border border-blue-200 dark:border-blue-500/20 rounded-full animate-spin-slow-reverse opacity-50"></div>
              <div className="absolute inset-12 border border-dashed border-purple-200 dark:border-purple-500/20 rounded-full animate-spin-slow"></div>

              {/* Central Core */}
              <div className="relative z-20 w-32 h-32 bg-white dark:bg-gray-900 rounded-full shadow-2xl shadow-blue-500/30 flex items-center justify-center border-4 border-blue-50 dark:border-blue-500/10">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse"></div>
                <Brain className="w-16 h-16 text-purple-600 dark:text-purple-400" />

                {/* Core Label */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-sm font-bold text-gray-900 dark:text-white bg-white/80 dark:bg-black/80 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                    CORTEX CORE
                  </span>
                </div>
              </div>

              {/* Orbiting Nodes */}
              {/* We position these absolutely based on rotation or fixed positions */}

              {/* Node 1: Top (Sensors) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Wifi className="text-blue-500 w-8 h-8" />
                </div>
                <div className="absolute top-full mt-2 bg-white/90 dark:bg-black/90 px-2 py-1 rounded text-xs font-mono text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  IoT Fabric
                </div>
                {/* Data Beam */}
                <div className="absolute top-16 left-1/2 w-0.5 h-24 bg-gradient-to-b from-blue-500 to-transparent opacity-50"></div>
              </div>

              {/* Node 2: Right (Energy) */}
              <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="text-yellow-500 w-8 h-8" />
                </div>
                <div className="absolute top-full mt-2 bg-white/90 dark:bg-black/90 px-2 py-1 rounded text-xs font-mono text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Smart Grid
                </div>
                {/* Data Beam */}
                <div className="absolute right-16 top-1/2 w-24 h-0.5 bg-gradient-to-l from-yellow-500 to-transparent opacity-50"></div>
              </div>

              {/* Node 3: Bottom (Shields) */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 flex flex-col items-center group">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="text-emerald-500 w-8 h-8" />
                </div>
                <div className="absolute bottom-full mb-2 bg-white/90 dark:bg-black/90 px-2 py-1 rounded text-xs font-mono text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Coastal Defense
                </div>
                {/* Data Beam */}
                <div className="absolute bottom-16 left-1/2 w-0.5 h-24 bg-gradient-to-t from-emerald-500 to-transparent opacity-50"></div>
              </div>

              {/* Node 4: Left (Predictive) */}
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="text-purple-500 w-8 h-8" />
                </div>
                <div className="absolute top-full mt-2 bg-white/90 dark:bg-black/90 px-2 py-1 rounded text-xs font-mono text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Predictive Models
                </div>
                {/* Data Beam */}
                <div className="absolute left-16 top-1/2 w-24 h-0.5 bg-gradient-to-r from-purple-500 to-transparent opacity-50"></div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Features