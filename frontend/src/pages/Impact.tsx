import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Leaf,
  Zap,
  Shield,
  Target,
  BarChart3,
  Award,
  IndianRupee
} from 'lucide-react'

const Impact: React.FC = () => {
  const [impactData, setImpactData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<any>(null)

  useEffect(() => {
    // Fetch AI recommendations
    fetch('http://localhost:8000/api/ai/recommendations?city=Mumbai')
      .then(res => res.json())
      .then(data => {
        setRecommendations(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })

    // Simulate impact data (in real app, this would come from historical database)
    const mockImpactData = {
      total_co2_offset_tons: 1250.5,
      total_energy_saved_mwh: 450.2,
      total_investment_usd: 250000,
      total_npv_usd: 580000,
      roi_percent: 132.0,
      lives_protected: 15000,
      property_protected_usd: 2500000,
      interventions_deployed: 45,
      carbon_credits: 1250.5,
      equivalent_cars_removed: 271.8
    }
    setImpactData(mockImpactData)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-green-400 font-mono animate-pulse">LOADING IMPACT METRICS...</div>
        </div>
      </div>
    )
  }

  const metrics = [
    {
      icon: Leaf,
      label: "CO₂ Offset",
      value: `${impactData?.total_co2_offset_tons.toFixed(1) || 0} tons`,
      subtext: `≈ ${impactData?.equivalent_cars_removed || 0} cars removed`,
      color: "green",
      trend: "+12.5%"
    },
    {
      icon: Zap,
      label: "Energy Saved",
      value: `${impactData?.total_energy_saved_mwh || 0} MWh`,
      subtext: "From reduced AC demand",
      color: "yellow",
      trend: "+8.3%"
    },
    {
      icon: IndianRupee,
      label: "ROI",
      value: `${impactData?.roi_percent || 0}%`,
      subtext: `₹${(impactData?.total_npv_usd / 1000).toFixed(0)}K NPV`,
      color: "purple",
      trend: "+15.2%"
    },
    {
      icon: Shield,
      label: "Lives Protected",
      value: `${(impactData?.lives_protected / 1000).toFixed(1) || 0}K`,
      subtext: "From heat/flood events",
      color: "red",
      trend: "Stable"
    }
  ]

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-fixed bg-center">
      <div className="min-h-screen bg-white/90 dark:bg-black/80 backdrop-blur-sm w-full px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-cyan-600 dark:from-green-400 dark:to-cyan-500 mb-2 text-glow">
            IMPACT DASHBOARD
          </h1>
          <p className="text-gray-600 dark:text-gray-300 font-mono">
            Comprehensive metrics on climate resilience interventions and their impact.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon
            const colorClasses = {
              green: "from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-500",
              yellow: "from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-500",
              purple: "from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-500",
              red: "from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-500"
            }

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card rounded-2xl p-6 border border-gray-100 dark:border-white/5 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Icon size={80} />
                </div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={`p-3 bg-${metric.color}-100 dark:bg-${metric.color}-500/20 rounded-xl`}>
                    <Icon className={`text-${metric.color}-600 dark:text-${metric.color}-400`} size={24} />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full bg-${metric.color}-100 dark:bg-${metric.color}-500/20 text-${metric.color}-600 dark:text-${metric.color}-400 font-bold`}>
                    {metric.trend}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {metric.label}
                </h3>
                <div className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${colorClasses[metric.color as keyof typeof colorClasses]} mb-2`}>
                  {metric.value}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{metric.subtext}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Financial Impact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <IndianRupee className="mr-2 text-purple-600 dark:text-purple-400" /> Financial Impact
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-white/10">
                <span className="text-gray-600 dark:text-gray-400">Total Investment</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  ₹{(impactData?.total_investment_usd / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-white/10">
                <span className="text-gray-600 dark:text-gray-400">Net Present Value</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  ₹{(impactData?.total_npv_usd / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-white/10">
                <span className="text-gray-600 dark:text-gray-400">Return on Investment</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {impactData?.roi_percent}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Property Protected</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  ₹{(impactData?.property_protected_usd / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>
          </motion.div>

          {/* Environmental Impact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Leaf className="mr-2 text-green-600 dark:text-green-400" /> Environmental Impact
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-white/10">
                <span className="text-gray-600 dark:text-gray-400">Carbon Credits Generated</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {impactData?.carbon_credits.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-white/10">
                <span className="text-gray-600 dark:text-gray-400">Energy Saved</span>
                <span className="font-bold text-yellow-600 dark:text-yellow-400">
                  {impactData?.total_energy_saved_mwh} MWh
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-white/10">
                <span className="text-gray-600 dark:text-gray-400">Interventions Deployed</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">
                  {impactData?.interventions_deployed}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Equivalent Cars Removed</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {impactData?.equivalent_cars_removed.toFixed(0)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Recommendations */}
        {recommendations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Target className="mr-2 text-cyan-600 dark:text-cyan-400" /> AI-Powered Recommendations
            </h2>
            <div className="space-y-4 mb-4">
              {recommendations.recommendations?.slice(0, 3).map((rec: any, idx: number) => (
                <div key={idx} className="p-4 bg-white/50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">{rec.intervention}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${rec.priority === 'CRITICAL' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' :
                        rec.priority === 'HIGH' ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' :
                          'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                      }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{rec.expected_impact}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Urgency: {rec.urgency}</p>
                </div>
              ))}
            </div>
            {recommendations.ai_insights && (
              <div className="mt-4 p-4 bg-cyan-50 dark:bg-cyan-500/10 rounded-lg border border-cyan-200 dark:border-cyan-500/20">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {recommendations.ai_insights}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Achievement Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 glass-panel rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Award className="mr-2 text-yellow-600 dark:text-yellow-400" /> Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Carbon Neutral", icon: Leaf, achieved: true },
              { name: "Energy Efficient", icon: Zap, achieved: true },
              { name: "ROI Champion", icon: IndianRupee, achieved: true },
              { name: "Climate Leader", icon: Shield, achieved: true }
            ].map((badge, idx) => {
              const Icon = badge.icon
              return (
                <div key={idx} className={`p-4 rounded-xl text-center border-2 ${badge.achieved
                    ? 'bg-green-50 dark:bg-green-500/10 border-green-500 dark:border-green-400'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-50'
                  }`}>
                  <Icon className={`mx-auto mb-2 ${badge.achieved ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} size={32} />
                  <p className={`text-xs font-bold ${badge.achieved ? 'text-green-700 dark:text-green-400' : 'text-gray-500'}`}>
                    {badge.name}
                  </p>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Impact
