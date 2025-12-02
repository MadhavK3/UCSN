import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Zap,
  Activity,
  CheckCircle,
  XCircle,
  Play,
  BarChart3
} from 'lucide-react'

const AIMLHub: React.FC = () => {
  const [forecasts, setForecasts] = useState<any>(null)
  const [anomalies, setAnomalies] = useState<any>(null)
  const [autoDecisions, setAutoDecisions] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'forecast' | 'anomalies' | 'decisions'>('forecast')

  const fetchAllData = () => {
    setLoading(true)

    // Fetch forecasts
    // Fetch forecasts
    Promise.all([
      fetch('http://127.0.0.1:8000/api/ml/forecast/temperature?city=Mumbai&hours_ahead=48'),
      fetch('http://127.0.0.1:8000/api/ml/forecast/flood?city=Mumbai&hours_ahead=72'),
      fetch('http://127.0.0.1:8000/api/ml/anomalies/temperature?city=Mumbai'),
      fetch('http://127.0.0.1:8000/api/ml/anomalies/rainfall?city=Mumbai'),
      fetch('http://127.0.0.1:8000/api/ml/auto-decisions?city=Mumbai')
    ])
      .then(responses => Promise.all(responses.map(r => r.json())))
      .then(([tempForecast, floodForecast, tempAnomalies, rainAnomalies, decisions]) => {
        setForecasts({ temperature: tempForecast, flood: floodForecast })
        setAnomalies({ temperature: tempAnomalies, rainfall: rainAnomalies })
        setAutoDecisions(decisions)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Failed to load AI/ML models. Please ensure the backend is running.')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchAllData()
    const interval = setInterval(fetchAllData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  if (loading && !forecasts) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-purple-400 font-mono animate-pulse">LOADING AI/ML MODELS...</div>
        </div>
      </div>
    )
  }

  if (error && !forecasts) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center text-center p-6">
          <AlertTriangle size={48} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchAllData}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-fixed bg-center">
      <div className="min-h-screen bg-white/90 dark:bg-black/80 backdrop-blur-sm w-full px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-500 mb-2 text-glow flex items-center">
                <Brain className="mr-3" size={40} /> AI/ML HUB
              </h1>
              <p className="text-gray-600 dark:text-gray-300 font-mono">
                Machine Learning Models for Climate Prediction & Automated Decision-Making
              </p>
            </div>
            <button
              onClick={fetchAllData}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-purple-500/20 flex items-center"
            >
              <Play size={18} className="mr-2" /> Refresh Models
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-200 dark:border-white/10">
            {[
              { id: 'forecast', label: 'ML Forecasts', icon: TrendingUp },
              { id: 'anomalies', label: 'Anomaly Detection', icon: AlertTriangle },
              { id: 'decisions', label: 'Auto Decisions', icon: Brain }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 font-bold transition-all flex items-center ${activeTab === tab.id
                      ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  <Icon size={18} className="mr-2" /> {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Forecast Tab */}
        {activeTab === 'forecast' && forecasts && (
          <div className="space-y-6">
            {/* Temperature Forecast */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Activity className="mr-2 text-orange-600 dark:text-orange-400" /> Temperature Forecast
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Model: {forecasts.temperature.model_info.type} | Accuracy: {forecasts.temperature.model_info.accuracy}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-4 rounded-xl">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current</div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {forecasts.temperature.current_temp.toFixed(1)}°C
                  </div>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Predicted Max</div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {forecasts.temperature.statistics.maximum.toFixed(1)}°C
                  </div>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Risk Level</div>
                  <div className={`text-3xl font-bold ${forecasts.temperature.risk_assessment.level === 'Critical' ? 'text-red-600 dark:text-red-400' :
                      forecasts.temperature.risk_assessment.level === 'High' ? 'text-orange-600 dark:text-orange-400' :
                        'text-green-600 dark:text-green-400'
                    }`}>
                    {forecasts.temperature.risk_assessment.level}
                  </div>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-white/5 p-4 rounded-lg">
                <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Forecast Trend: {forecasts.temperature.statistics.trend}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Peak temperature expected at {new Date(forecasts.temperature.risk_assessment.peak_hour).toLocaleString()}
                </div>
              </div>
            </motion.div>

            {/* Flood Forecast */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Zap className="mr-2 text-blue-600 dark:text-blue-400" /> Flood Risk Forecast
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Model: {forecasts.flood.model_info.type} | Accuracy: {forecasts.flood.model_info.accuracy}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="glass-card p-4 rounded-xl">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Overall Risk</div>
                  <div className={`text-3xl font-bold ${forecasts.flood.risk_assessment.overall_risk === 'High' ? 'text-red-600 dark:text-red-400' :
                      forecasts.flood.risk_assessment.overall_risk === 'Medium' ? 'text-orange-600 dark:text-orange-400' :
                        'text-green-600 dark:text-green-400'
                    }`}>
                    {forecasts.flood.risk_assessment.overall_risk}
                  </div>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Peak Rainfall</div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {forecasts.flood.risk_assessment.peak_rainfall} mm
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-lg border border-blue-200 dark:border-blue-500/20">
                <div className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-1">
                  AI Recommendation: {forecasts.flood.risk_assessment.recommendation}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  {forecasts.flood.risk_assessment.high_risk_periods} high-risk periods detected
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Anomalies Tab */}
        {activeTab === 'anomalies' && anomalies && (
          <div className="space-y-6">
            {['temperature', 'rainfall'].map((type, idx) => {
              const anomaly = anomalies[type]
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center capitalize">
                      <AlertTriangle className="mr-2 text-red-600 dark:text-red-400" /> {type} Anomaly Detection
                    </h2>
                    <div className={`px-4 py-2 rounded-full font-bold text-sm ${anomaly.severity === 'Critical' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' :
                        anomaly.severity === 'High' ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' :
                          anomaly.severity === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                            'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                      }`}>
                      {anomaly.severity} ({anomaly.anomaly_count} anomalies)
                    </div>
                  </div>

                  {anomaly.anomalies.length > 0 ? (
                    <div className="space-y-3">
                      {anomaly.anomalies.slice(0, 5).map((a: any, i: number) => (
                        <div key={i} className="p-4 bg-white/50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-gray-900 dark:text-white">
                              Anomaly #{i + 1}: {a.value}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${a.severity === 'Critical' ? 'bg-red-500 text-white' :
                                a.severity === 'High' ? 'bg-orange-500 text-white' :
                                  'bg-yellow-500 text-white'
                              }`}>
                              {a.severity}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Z-Score: {a.z_score} | Deviation: {a.deviation > 0 ? '+' : ''}{a.deviation}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                      <p>No anomalies detected. All systems normal.</p>
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                    <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                      AI Recommendation:
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {anomaly.recommendation}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Auto Decisions Tab */}
        {activeTab === 'decisions' && autoDecisions && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Brain className="mr-2 text-purple-600 dark:text-purple-400" /> Automated Decisions
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Confidence: {(autoDecisions.overall_confidence * 100).toFixed(0)}%
                </div>
              </div>

              {autoDecisions.decisions.length > 0 ? (
                <div className="space-y-4">
                  {autoDecisions.decisions.map((decision: any, idx: number) => (
                    <div key={idx} className="p-6 bg-white/50 dark:bg-white/5 rounded-xl border-2 border-gray-200 dark:border-white/10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mr-3">
                              {decision.action.replace(/_/g, ' ')}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${decision.priority === 'CRITICAL' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' :
                                'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400'
                              }`}>
                              {decision.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{decision.reason}</p>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Target: {decision.target} | ML Model: {decision.ml_model} | Confidence: {(decision.confidence * 100).toFixed(0)}%
                          </div>
                        </div>
                        <button className="ml-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-bold transition-colors">
                          Execute
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                  <p>No automated interventions required. All systems operating normally.</p>
                </div>
              )}

              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-500/10 rounded-lg border border-purple-200 dark:border-purple-500/20">
                <div className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-2">
                  AI Recommendation:
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">
                  {autoDecisions.recommendation}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIMLHub

