import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CloudRain,
  Shield,
  Brain,
  Zap,
  Wifi,
  Activity
} from 'lucide-react'
import Scene from '../components/Three/Scene'
import DigitalTwinCard from '../components/Three/DigitalTwinCard'

const Home: React.FC = () => {
  const features = [
    {
      icon: CloudRain,
      title: 'Urban Cooling Nodes',
      description: 'AI-driven misting and smart surfaces to combat Urban Heat Islands.',
      link: '/features/cooling-nodes'
    },
    {
      icon: Shield,
      title: 'Smart Coastal Shields',
      description: 'Adaptive barriers and wave energy converters for flood defense.',
      link: '/features/coastal-shields'
    },
    {
      icon: Brain,
      title: 'AI Command Hub',
      description: 'Centralized neural network orchestrating city-wide climate response.',
      link: '/features/command-hub'
    },
    {
      icon: Zap,
      title: 'Energy Positive',
      description: 'Turning natural stressors like waves and heat into renewable power.',
      link: '/features/energy-positive'
    },
    {
      icon: Activity,
      title: 'Predictive Intelligence',
      description: 'Forecasting threats before they strike using advanced ML models.',
      link: '/features/predictive-intelligence'
    },
    {
      icon: Wifi,
      title: 'IoT Sensor Grid',
      description: 'Real-time hyper-local environmental monitoring network.',
      link: '/features/sensor-grid'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050510] transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-60">
          <Scene />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/50 dark:via-[#050510]/50 to-gray-50 dark:to-[#050510] z-0 pointer-events-none" />

        <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mb-4 inline-block px-4 py-1 rounded-full border border-cyan-600/30 dark:border-cyan-500/30 bg-cyan-100/50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-sm font-mono tracking-widest"
          >
            PCCOE INTERNATIONAL GRAND CHALLENGE 2025
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-cyan-600 to-blue-600 dark:from-white dark:via-cyan-200 dark:to-blue-500 text-glow tracking-tight"
          >
            URBAN CLIMATE<br />SHIELD NETWORK
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-10 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light"
          >
            An AI-Powered Adaptive Defense System for Cities Against Climate Change Threats.
            <br />
            <span className="text-cyan-600 dark:text-cyan-400 font-normal">Detect. Protect. Adapt.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              to="/dashboard"
              className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold flex items-center justify-center transition-all shadow-[0_0_20px_rgba(8,145,178,0.5)] hover:shadow-[0_0_30px_rgba(8,145,178,0.7)]"
            >
              <span className="relative z-10 flex items-center">
                ENTER COMMAND HUB <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </span>
            </Link>
            <Link
              to="/simulation"
              className="px-8 py-4 bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/20 rounded-lg font-bold flex items-center justify-center transition-all backdrop-blur-sm shadow-sm dark:shadow-none"
            >
              RUN SIMULATION
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-fixed opacity-5 dark:opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Integrated <span className="text-cyan-600 dark:text-cyan-400">City Brain</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              UCSN evolves cities from passive climate victims into intelligent, self-defending ecosystems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Digital Twin 3D Card */}
            <Link to="/digital-twin" className="block h-full md:col-span-2 lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="h-full rounded-2xl overflow-hidden border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 transition-all"
              >
                <DigitalTwinCard />
              </motion.div>
            </Link>

            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Link to={feature.link} key={feature.title} className="block h-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    className="glass-card p-8 rounded-2xl hover:border-cyan-500/50 transition-all group h-full"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-cyan-100 dark:border-white/10">
                      <Icon className="text-cyan-600 dark:text-cyan-400" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/40 text-center backdrop-blur-sm">
        <p className="text-gray-500 text-sm">
          TEAM HUSTLERS | PCCOE INTERNATIONAL GRAND CHALLENGE 2025
        </p>
      </footer>
    </div>
  )
}

export default Home