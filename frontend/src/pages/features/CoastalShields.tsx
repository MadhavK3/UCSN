import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Waves, Anchor, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'

const CoastalShields: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050510] pt-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block p-4 rounded-full bg-blue-100 dark:bg-blue-500/10 mb-6 border border-blue-200 dark:border-blue-500/20">
                        <Shield className="text-blue-600 dark:text-blue-400 w-12 h-12" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-200 dark:to-indigo-500 mb-6 text-glow">
                        Smart Coastal Shields
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Adaptive physical barriers and wave energy converters that protect coastlines from rising sea levels and storm surges while generating clean power.
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
                            <Waves className="mr-3 text-blue-600 dark:text-blue-400" /> Adaptive Defense
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                            The coastal shield system consists of modular, hydraulically actuated barriers that lie flat on the seabed during calm weather to preserve views and ecology. When storm sensors detect a surge, the barriers automatically rise to form a protective wall.
                        </p>
                        <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                            <li className="flex items-start">
                                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                                Auto-deployment in &lt; 15 minutes
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                                Withstands Category 5 storm surges
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                                Integrated mangrove restoration zones
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
                            <Activity className="mr-3 text-green-600 dark:text-green-400" /> Defense Stats
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-transparent shadow-sm dark:shadow-none">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700 dark:text-gray-300">Flood Risk Reduction</span>
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">94%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full w-[94%]"></div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-transparent shadow-sm dark:shadow-none">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700 dark:text-gray-300">Coastline Protected</span>
                                    <span className="text-green-600 dark:text-green-400 font-bold">45 km</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full w-[60%]"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="text-center">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Anchor className="mr-2" /> View Coastal Status
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CoastalShields
