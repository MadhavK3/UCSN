import React from 'react'
import { motion } from 'framer-motion'
import { Activity, BarChart2, Eye, GitBranch } from 'lucide-react'
import { Link } from 'react-router-dom'

const PredictiveIntelligence: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050510] pt-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block p-4 rounded-full bg-red-100 dark:bg-red-500/10 mb-6 border border-red-200 dark:border-red-500/20">
                        <Activity className="text-red-600 dark:text-red-400 w-12 h-12" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600 dark:from-red-200 dark:to-rose-500 mb-6 text-glow">
                        Predictive Intelligence
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Forecasting threats before they strike. Our advanced ML models analyze historical data and real-time patterns to predict climate events with unprecedented accuracy.
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
                            <Eye className="mr-3 text-red-600 dark:text-red-400" /> Future Sight
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                            Using LSTM (Long Short-Term Memory) networks and Transformer models, we predict urban heat island formation up to 48 hours in advance and flood risks up to 72 hours ahead. This allows for proactive rather than reactive measures.
                        </p>
                        <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                            <li className="flex items-start">
                                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                                Hyper-local weather micro-forecasting
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                                Crowd density and traffic heat contribution modeling
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                                Scenario simulation for policy planning
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
                            <GitBranch className="mr-3 text-orange-600 dark:text-orange-400" /> Model Accuracy
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-transparent shadow-sm dark:shadow-none">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700 dark:text-gray-300">Heatwave Prediction (48h)</span>
                                    <span className="text-red-600 dark:text-red-400 font-bold">92.4%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-red-500 h-full w-[92%]"></div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-transparent shadow-sm dark:shadow-none">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700 dark:text-gray-300">Flood Risk Assessment</span>
                                    <span className="text-orange-600 dark:text-orange-400 font-bold">89.7%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-orange-500 h-full w-[89%]"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="text-center">
                    <Link
                        to="/simulation"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-red-500/20"
                    >
                        <BarChart2 className="mr-2" /> Run Prediction Models
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PredictiveIntelligence
