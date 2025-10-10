import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  Map,
  Cpu,
  AlertTriangle
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation()

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Heatmap', href: '/dashboard/heatmap', icon: Map },
    { name: 'Coastal Shield', href: '/dashboard/coastal', icon: BarChart3 },
    { name: 'Energy Grid', href: '/dashboard/energy', icon: Cpu },
    { name: 'Alerts', href: '/dashboard/alerts', icon: AlertTriangle },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <>
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isOpen ? 256 : 64 }}
        className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0 hidden md:block"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            {isOpen && (
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Dashboard
              </h2>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft
                className={`transition-transform ${isOpen ? '' : 'rotate-180'}`}
                size={20}
              />
            </button>
          </div>

          <nav className="flex-1 p-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-1 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </motion.div>

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-40">
        <div className="flex justify-around">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center p-2 text-xs ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Icon size={20} />
                <span className="mt-1">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Sidebar