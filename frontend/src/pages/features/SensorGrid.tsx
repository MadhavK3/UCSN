import React from 'react'
import { motion } from 'framer-motion'
import { Wifi, Radio, Map, Database } from 'lucide-react'
import { Link } from 'react-router-dom'

const SensorGrid: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050510] pt-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block p-4 rounded-full bg-emerald-100 dark:bg-emerald-500/10 mb-6 border border-emerald-200 dark:border-emerald-500/20">
                        <Wifi className="text-emerald-600 dark:text-emerald-400 w-12 h-12" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-200 dark:to-teal-500 mb-6 text-glow">
                        IoT Sensor Grid
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        A dense, real-time hyper-local environmental monitoring network that acts as the city's nervous system, sensing changes in air, water, and energy flows.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-8 rounded-2xl border border-gray-200 dark:border-white/10"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <Radio className="mr-3 text-emerald-600 dark:text-emerald-400" /> Sensing Fabric
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                            Thousands of low-power, wide-area network (LoRaWAN) sensors are deployed across the urban landscape. They monitor temperature, humidity, air quality (AQI), noise levels, and soil moisture every 30 seconds.
                        </p>
                        <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                            <li className="flex items-start">
                                <span className="text-emerald-600 dark:text-emerald-400 mr-2">•</span>
                                Self-healing mesh network topology
                            </li>
                            <li className="flex items-start">
                                <span className="text-emerald-600 dark:text-emerald-400 mr-2">•</span>
                                Solar-powered with 5-year battery life
                            </li>
                            <li className="flex items-start">
                                <span className="text-emerald-600 dark:text-emerald-400 mr-2">•</span>
                                Edge computing for immediate anomaly detection
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-8 rounded-2xl border border-gray-200 dark:border-white/10"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <Database className="mr-3 text-teal-600 dark:text-teal-400" /> Network Stats
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-transparent shadow-sm dark:shadow-none">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700 dark:text-gray-300">Active Sensors</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">8,432</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-[85%]"></div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-transparent shadow-sm dark:shadow-none">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700 dark:text-gray-300">Uptime (Last 30 Days)</span>
                                    <span className="text-teal-600 dark:text-teal-400 font-bold">99.99%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-teal-500 h-full w-[99%]"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="text-center">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-emerald-500/20"
                    >
                        <Map className="mr-2" /> View Sensor Map
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SensorGrid
