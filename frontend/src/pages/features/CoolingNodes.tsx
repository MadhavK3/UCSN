import React from 'react'
import { motion } from 'framer-motion'
import { CloudRain, Wind, Droplets, Thermometer } from 'lucide-react'
import { Link } from 'react-router-dom'

const CoolingNodes: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050510] pt-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block p-4 rounded-full bg-cyan-100 dark:bg-cyan-500/10 mb-6 border border-cyan-200 dark:border-cyan-500/20">
                        <CloudRain className="text-cyan-600 dark:text-cyan-400 w-12 h-12" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-200 dark:to-blue-500 mb-6 text-glow">
                        Urban Cooling Nodes
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        AI-driven misting systems and smart surfaces designed to actively combat Urban Heat Islands (UHI) by creating localized micro-climates of cool air.
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
                            <Wind className="mr-3 text-cyan-600 dark:text-cyan-400" /> How It Works
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                            Our network of cooling nodes uses IoT sensors to detect temperature spikes in real-time. When a threshold is breached, the system automatically activates high-pressure misting nozzles that flash-evaporate water, reducing ambient temperature by up to 5-7°C without wetting surfaces.
                        </p>
                        <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                            <li className="flex items-start">
                                <span className="text-cyan-600 dark:text-cyan-400 mr-2">•</span>
                                Automated activation based on heat index
                            </li>
                            <li className="flex items-start">
                                <span className="text-cyan-600 dark:text-cyan-400 mr-2">•</span>
                                Water-efficient flash evaporation technology
                            </li>
                            <li className="flex items-start">
                                <span className="text-cyan-600 dark:text-cyan-400 mr-2">•</span>
                                Integrated with rainwater harvesting units
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
                            <Thermometer className="mr-3 text-red-500 dark:text-red-400" /> Impact Analysis
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-transparent shadow-sm dark:shadow-none">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700 dark:text-gray-300">Temperature Reduction</span>
                                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">-7°C</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-cyan-500 h-full w-[85%]"></div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-transparent shadow-sm dark:shadow-none">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700 dark:text-gray-300">Energy Saved (AC Load)</span>
                                    <span className="text-green-600 dark:text-green-400 font-bold">35%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full w-[35%]"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="text-center">
                    <Link
                        to="/simulation"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-cyan-500/20"
                    >
                        <Droplets className="mr-2" /> Simulate Cooling Effect
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CoolingNodes
