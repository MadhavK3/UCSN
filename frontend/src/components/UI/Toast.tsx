import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { Alert, useAlertStore } from '../../state/alertStore'

interface ToastProps {
  alert: Alert
  onDismiss: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({ alert, onDismiss }) => {
  const icons = {
    low: Info,
    medium: AlertCircle,
    high: AlertTriangle,
    critical: AlertCircle,
  }

  const bgColors = {
    low: 'bg-blue-100 border-blue-400',
    medium: 'bg-yellow-100 border-yellow-400',
    high: 'bg-orange-100 border-orange-400',
    critical: 'bg-red-100 border-red-400',
  }

  const textColors = {
    low: 'text-blue-800',
    medium: 'text-yellow-800',
    high: 'text-orange-800',
    critical: 'text-red-800',
  }

  const Icon = icons[alert.severity]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-start p-4 mb-2 rounded-lg border ${bgColors[alert.severity]} ${textColors[alert.severity]} shadow-lg max-w-sm`}
    >
      <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-semibold">{alert.title}</h4>
        <p className="text-sm mt-1">{alert.message}</p>
        <span className="text-xs opacity-75 mt-2 block">
          {new Date(alert.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <button
        onClick={() => onDismiss(alert.id)}
        className="ml-4 mt-0.5 hover:opacity-70 transition-opacity"
      >
        <X size={16} />
      </button>
    </motion.div>
  )
}

export const ToastContainer: React.FC = () => {
  const { alerts, dismissAlert } = useAlertStore()

  return (
    <div className="fixed top-20 right-4 z-50 max-h-screen overflow-hidden">
      <AnimatePresence>
        {alerts.map((alert) => (
          <Toast key={alert.id} alert={alert} onDismiss={dismissAlert} />
        ))}
      </AnimatePresence>
    </div>
  )
}