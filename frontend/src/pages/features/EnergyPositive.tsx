import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Sun, Battery, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const EnergyPositive: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050510] pt-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block p-4 rounded-full bg-yellow-100 dark:bg-yellow-500/10 mb-6 border border-yellow-200 dark:border-yellow-500/20">
                        <Zap className="text-yellow-600 dark:text-yellow-400 w-12 h-12" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-200 dark:to-orange-500 mb-6 text-glow">
                        Energy Positive
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Turning natural stressors into assets. We harvest energy from storm waves, solar heat, and urban wind tunnels to power the city's defense systems.
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
                            <Sun className="mr-3 text-yellow-600 dark:text-yellow-400" /> Renewable Integration
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                            Our infrastructure is embedded with piezoelectric generators and high-efficiency solar skins. The coastal shields double as wave energy converters, capturing the immense power of ocean swells to charge the city's emergency grid.
                        </p>
                        <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                            <li className="flex items-start">
                                <span className="text-yellow-600 dark:text-yellow-400 mr-2">•</span>
                                Wave Energy Converters (WEC) integrated into sea walls
                            </li>
                            <li className="flex items-start">
                                <span className="text-yellow-600 dark:text-yellow-400 mr-2">•</span>
                                Transparent solar glass on all monitoring stations
                            </li>
                            <li className="flex items-start">
                                <span className="text-yellow-600 dark:text-yellow-400 mr-2">•</span>
                                Self-sustaining grid independent of main power lines
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
                            <Battery className="mr-3 text-green-600 dark:text-green-400" /> Generation Metrics
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-transparent shadow-sm dark:shadow-none">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700 dark:text-gray-300">Daily Output</span>
                                    <span className="text-yellow-600 dark:text-yellow-400 font-bold">1.2 GWh</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-yellow-500 h-full w-[65%]"></div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-transparent shadow-sm dark:shadow-none">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700 dark:text-gray-300">Grid Independence</span>
                                    <span className="text-green-600 dark:text-green-400 font-bold">100%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full w-[100%]"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="text-center">
                    <Link
                        to="/analytics"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-yellow-500/20"
                    >
                        <TrendingUp className="mr-2" /> View Energy Analytics
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default EnergyPositive
