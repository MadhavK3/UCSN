import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface HeatmapProps {
  center: [number, number]
  zoom: number
}

export interface HeatmapHandle {
  addRandomTrees: (count?: number, minDistanceMeters?: number) => Promise<{ placed: number }>
  clearTrees: () => void
}

// Helper: haversine distance in meters
function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180
  const R = 6371000 // m
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const Heatmap = forwardRef<HeatmapHandle, HeatmapProps>(({ center, zoom }, ref) => {
  const [trees, setTrees] = useState<Array<{ lat: number; lng: number; id: string }>>([])
  const leafletMapRef = useRef<any>(null)

  // Small child component to grab the map instance via hook and expose it to parent
  const MapRef: React.FC = () => {
    const map = useMap()
    // set once
    if (!leafletMapRef.current) leafletMapRef.current = map
    return null
  }

  // Try to center the map on the user's location when available (one-time)
  useEffect(() => {
    if (!('geolocation' in navigator)) return
    try {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords
        const m = leafletMapRef.current
        try {
          if (m && typeof m.setView === 'function') {
            // pick a comfortable zoom when moving to user location
            const targetZoom = Math.max((m.getZoom && m.getZoom()) || zoom, 10)
            m.setView([latitude, longitude], targetZoom)
          }
        } catch (err) {
          // ignore
        }
      }, () => {
        // permission denied or error — noop
      }, { maximumAge: 60_000, timeout: 10_000 })
    } catch (e) {
      // ignore
    }
  }, [])

  useImperativeHandle(ref, () => ({
  addRandomTrees: async (count = 200, minDistanceMeters = 50000) => {
      // Generate random tree points on the globe keeping min distance between them
      // Use rejection sampling with a safety cap on attempts. Skip locations that appear to be ocean
      const placed: Array<{ lat: number; lng: number; id: string }> = [...trees]
      const maxAttempts = Math.max(1000, count * 800)
  let attempts = 0

      // Simple tile-based land detection cache
      const tileLandCache: Map<string, boolean> = new Map()

      function latLngToTile(lat: number, lng: number, z: number) {
        const latRad = (lat * Math.PI) / 180
        const n = Math.pow(2, z)
        const x = Math.floor(((lng + 180) / 360) * n)
        const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n)
        return { x, y, z }
      }

      async function isTileLikelyLand(lat: number, lng: number) {
        // Use a moderate zoom so coastlines are visible but not too many requests
        const z = 5
        const { x, y } = latLngToTile(lat, lng, z)
        const key = `${z}/${x}/${y}`
        if (tileLandCache.has(key)) return tileLandCache.get(key) as boolean
        const url = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`
        try {
          // try tile pixel sampling first (fast and usually reliable)
          const resp = await fetch(url, { mode: 'cors' })
          if (resp.ok) {
            const blob = await resp.blob()
            const img = await new Promise<HTMLImageElement>((resolve, reject) => {
              const i = new Image()
              i.crossOrigin = 'Anonymous'
              i.onload = () => resolve(i)
              i.onerror = (e) => reject(e)
              i.src = URL.createObjectURL(blob)
            })

            // draw to canvas and sample a few center pixels
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.drawImage(img, 0, 0)
              const cx = Math.floor(img.width / 2)
              const cy = Math.floor(img.height / 2)
              const sampleOffsets = [ [0,0], [-3,0],[3,0],[0,-3],[0,3] ]
              let landVotes = 0
              for (const [ox, oy] of sampleOffsets) {
                const px = cx + ox
                const py = cy + oy
                if (px < 0 || py < 0 || px >= img.width || py >= img.height) continue
                const d = ctx.getImageData(px, py, 1, 1).data
                const [r,g,b] = [d[0], d[1], d[2]]
                const blueDominant = b > 140 && b > r + 30 && b > g + 20
                if (!blueDominant) landVotes += 1
              }
              const isLand = landVotes >= 1
              tileLandCache.set(key, isLand)
              return isLand
            }
          }

          // Tile sampling failed (CORS or other); fall through to reverse-geocode fallback
        } catch (e) {
          // continue to fallback
        }

        // Fallback: use Nominatim reverse geocoding to get a place type. This is slower
        // but more robust for areas where tiles are unavailable or CORS blocks pixel sampling.
        try {
          const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=10&accept-language=en`
          const r2 = await fetch(nomUrl, { headers: { 'User-Agent': 'IndradhanuApp/1.0 (contact@local)' } })
          if (r2.ok) {
            const j = await r2.json()
            // if the reverse geocode returns a class or type that indicates water, treat as water
            const cls = (j && j.class) ? String(j.class).toLowerCase() : ''
            const type = (j && j.type) ? String(j.type).toLowerCase() : ''
            const waterClasses = ['water', 'ocean', 'river', 'lake']
            const isWater = waterClasses.some(w => cls.includes(w) || type.includes(w))
            const isLand = !isWater
            tileLandCache.set(key, isLand)
            return isLand
          }
        } catch (e) {
          // if fallback fails, mark as water to be conservative
        }

        tileLandCache.set(key, false)
        return false
      }

      // If the map is available, prefer sampling within the current visible bounds
      const map = leafletMapRef.current
      const bounds = map && typeof map.getBounds === 'function' ? map.getBounds() : null

      function sampleRandomLatLngWithinBounds() {
        if (bounds) {
          // Leaflet bounds: getSouthWest() and getNorthEast() or getWest()/getEast()/getSouth()/getNorth()
          const south = bounds.getSouth()
          const north = bounds.getNorth()
          let west = bounds.getWest()
          let east = bounds.getEast()
          // handle antimeridian-crossing bounds
          if (east < west) {
            // sample in [west, 180] U [-180, east]
            const wSpan = 180 - west
            const eSpan = east + 180
            const total = wSpan + eSpan
            const r = Math.random() * total
            if (r < wSpan) return { lat: south + Math.random() * (north - south), lng: west + r }
            return { lat: south + Math.random() * (north - south), lng: -180 + (r - wSpan) }
          }
          return { lat: south + Math.random() * (north - south), lng: west + Math.random() * (east - west) }
        }
        // fallback: global sampling as before
        return { lat: Math.max(-85, Math.min(85, (Math.random() * 170) - 85)), lng: (Math.random() * 360) - 180 }
      }

  while (placed.length < (trees.length + count) && attempts < maxAttempts) {
        attempts += 1
        const { lat, lng } = sampleRandomLatLngWithinBounds()

        let ok = true
        for (const p of placed) {
          if (haversineMeters(lat, lng, p.lat, p.lng) < minDistanceMeters) {
            ok = false
            break
          }
        }
        if (!ok) continue

        // Skip if tile appears to be ocean
        const land = await isTileLikelyLand(lat, lng)
        if (!land) continue

        placed.push({ lat, lng, id: `${Date.now()}-${placed.length}-${Math.random().toString(36).slice(2, 8)}` })
      }
  setTrees(placed)
  return { placed: placed.length - trees.length }
    },
    clearTrees: () => {
      setTrees([])
    }
  }))

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      <MapRef />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />

      {/* Render trees as small green circle markers */}
      {trees.map((t) => (
        <CircleMarker
          key={t.id}
          center={[t.lat, t.lng]}
          radius={6}
          pathOptions={{ color: '#14532d', fillColor: '#16a34a', fillOpacity: 0.9, weight: 1 }}
        />
      ))}
    </MapContainer>
  )
})

export default Heatmap