// React import not required with new JSX transform
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Layout/Navbar'
import ScrollToTop from './components/Layout/ScrollToTop'
import { useThemeStore } from './state/themeStore'
import { useEffect } from 'react'
import { ToastContainer } from './components/UI/Toast'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Simulation from './pages/Simulation'
import Analytics from './pages/Analytics'
import Impact from './pages/Impact'
import Features from './pages/Features'
import About from './pages/About'
import Contact from './pages/Contact'
import CoolingNodes from './pages/features/CoolingNodes'
import CoastalShields from './pages/features/CoastalShields'
import CommandHub from './pages/features/CommandHub'
import EnergyPositive from './pages/features/EnergyPositive'
import PredictiveIntelligence from './pages/features/PredictiveIntelligence'
import SensorGrid from './pages/features/SensorGrid'
import AIMLHub from './pages/features/AIMLHub'
import DigitalTwin from './pages/DigitalTwin'

function App() {
  const { isDark } = useThemeStore()
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])
  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/features" element={<Features />} />
            <Route path="/features/cooling-nodes" element={<CoolingNodes />} />
            <Route path="/features/coastal-shields" element={<CoastalShields />} />
            <Route path="/features/command-hub" element={<CommandHub />} />
            <Route path="/features/energy-positive" element={<EnergyPositive />} />
            <Route path="/features/predictive-intelligence" element={<PredictiveIntelligence />} />
            <Route path="/features/sensor-grid" element={<SensorGrid />} />
            <Route path="/features/ai-ml-hub" element={<AIMLHub />} />
            <Route path="/digital-twin" element={<DigitalTwin />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <ToastContainer />
      </div>
    </Router>
  )
}

export default App