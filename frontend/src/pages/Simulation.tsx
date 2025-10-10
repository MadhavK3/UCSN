import React from 'react'
import Heatmap, { HeatmapHandle } from '../components/Map/Heatmap'

const Simulation: React.FC = () => {
  // World center for first view
  const center: [number, number] = [20, 0]
  const mapRef = React.useRef<HeatmapHandle | null>(null)
  const [status, setStatus] = React.useState<string>('No trees placed')

  const placeTrees = async () => {
    setStatus('Placing trees...')
    // default: try to place 200 trees with 50km min spacing
    try {
  const res = mapRef.current ? await mapRef.current.addRandomTrees(200, 50000) : undefined
  setStatus(`Placed ${res?.placed ?? 0} trees`)
    } catch (err) {
      console.error('placeTrees failed', err)
      setStatus('Failed to place trees')
    }
  }

  const clearTrees = () => {
    mapRef.current?.clearTrees()
    setStatus('Cleared trees')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              Urban Climate Simulation
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4" style={{ height: '600px' }}>
            {/* Map area */}
            <div className="h-full w-full rounded overflow-hidden">
              <Heatmap ref={mapRef} center={center} zoom={2} />
            </div>
          </div>

          <aside className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Simulation Controls</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Random tree placement</p>

            <div className="flex flex-col space-y-3">
              <button onClick={placeTrees} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Run Simulation</button>
              <button onClick={clearTrees} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Clear Trees</button>
              <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">Status: {status}</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Simulation