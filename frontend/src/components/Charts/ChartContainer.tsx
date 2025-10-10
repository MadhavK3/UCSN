import React from 'react'
import { motion } from 'framer-motion'

interface ChartContainerProps {
  title: string
  children: React.ReactNode
  className?: string
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, children, className = '' }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      {children}
    </motion.div>
  )
}

export default ChartContainer