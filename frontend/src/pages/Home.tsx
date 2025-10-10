import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  CloudRain, 
  Shield, 
  Brain, 
  Zap, 
  Wifi 
} from 'lucide-react'
import Scene from '../components/Three/Scene'

const Home: React.FC = () => {
  const features = [
    {
      icon: CloudRain,
      title: 'Urban Cooling Nodes',
      description: 'Smart systems that reduce urban heat island effect through evaporative cooling and shade optimization'
    },
    {
      icon: Shield,
      title: 'Smart Coastal Shields',
      description: 'Adaptive barrier systems that protect coastal areas from storm surges and rising sea levels'
    },
    {
      icon: Brain,
      title: 'AI Command Hub',
      description: 'Central intelligence that predicts, monitors, and responds to climate events in real-time'
    },
    {
      icon: Zap,
      title: 'Energy Harvesting',
      description: 'Renewable energy systems that power resilience infrastructure while reducing carbon footprint'
    },
    {
      icon: Wifi,
      title: 'IoT Grid',
      description: 'Network of sensors providing real-time environmental data across the urban landscape'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
  <section className="relative h-screen flex items-center justify-center overflow-hidden py-8">
        <div className="absolute inset-0 z-0">
          <Scene />
        </div>
  <div className="relative z-10 text-center text-white px-4 w-full max-w-4xl mx-auto py-8">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-bold mb-6 text-blue-600"
      >
        Urban Climate Shield Network (UCSN)
      </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-gray-200"
          >
            Building sustainable urban ecosystems resilient to climate change through advanced AI and IoT technologies
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center transition-colors"
            >
              Open Dashboard <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              to="/simulation"
              className="bg-transparent hover:bg-white/10 text-white border border-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center transition-colors"
            >
              Run Simulation
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Integrated Resilience Solutions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive system combines multiple technologies to create a cohesive defense against climate challenges
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home