import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, Text, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Interfaces for the 3D Model Data
interface Coordinate {
  lat: number;
  lon: number;
}

interface Landmark {
  id: string;
  name: string;
  type: string;
  coordinates: Coordinate;
  height_m: number;
  area_m2: number;
  description?: string;
  color?: string;
}

interface Road {
  id: string;
  name: string;
  type: string;
  coordinates: Coordinate[];
  width_m: number;
}

interface GreenArea {
  id: string;
  name: string;
  type: string;
  coordinates: Coordinate;
  area_m2: number;
}

interface LayoutData {
  region: string;
  coordinates: {
    center: Coordinate;
    bounds?: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  };
  landmarks: Landmark[];
  roads: Road[];
  green_areas?: GreenArea[];
}

interface Zone {
  id: string;
  name: string;
  type: string;
  coordinates: { lat: number; lon: number };
  area_km2: number;
  building_density: number;
  traffic_intensity: number;
  green_coverage: number;
}



interface SceneProps {
  zones?: Zone[];
}

// Convert Lat/Lon to Local 3D Coordinates (Simple Projection)
const project = (lat: number, lon: number, centerLat: number, centerLon: number) => {
  const scale = 2000; // Increased scale for better visibility
  const x = (lon - centerLon) * scale;
  const z = (centerLat - lat) * scale; // Invert Lat for Z
  return [x, 0, z] as [number, number, number];
};

const Building = ({ position, height, color, name, isLandmark = false }: { position: [number, number, number], height: number, color: string, name?: string, isLandmark?: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Randomize building dimensions slightly for variety if not a landmark
  const width = isLandmark ? 1.5 : 0.5 + Math.random() * 0.5;
  const depth = isLandmark ? 1.5 : 0.5 + Math.random() * 0.5;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        position={[0, height / 20, 0]} // Scale height down for view
        castShadow
        receiveShadow
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      >
        <boxGeometry args={[width, height / 10, depth]} />
        <meshStandardMaterial
          color={hovered ? '#ffffff' : color}
          roughness={0.2}
          metalness={isLandmark ? 0.8 : 0.1}
          emissive={isLandmark && hovered ? color : '#000000'}
          emissiveIntensity={0.5}
        />
      </mesh>
      {hovered && name && (
        <Text position={[0, height / 10 + 1 + (isLandmark ? 1 : 0), 0]} fontSize={isLandmark ? 0.8 : 0.4} color="white" anchorX="center" anchorY="bottom" outlineWidth={0.05} outlineColor="#000000">
          {name}
        </Text>
      )}
    </group>
  );
};

const Road = ({ points, width }: { points: [number, number, number][], width: number }) => {
  const lineGeometry = useMemo(() => {
    if (points.length < 2) return null;
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], 0.02, p[2])));
    return new THREE.TubeGeometry(curve, 64, width / 20, 8, false);
  }, [points, width]);

  if (!lineGeometry) return null;

  return (
    <mesh geometry={lineGeometry} receiveShadow scale={[1, 0.005, 1]} position={[0, 0.005, 0]}>
      <meshStandardMaterial color="#0f172a" roughness={0.9} />
    </mesh>
  );
};





// Procedural City Generator
const ProceduralCity = ({ center, bounds }: { center: Coordinate, bounds: { north: number, south: number, east: number, west: number } }) => {
  const buildings = useMemo(() => {
    const tempBuildings = [];
    const count = 1500; // Number of procedural buildings

    // Simple bounds check to avoid placing buildings exactly on center (where landmarks are)
    const exclusionRadius = 0.002;

    for (let i = 0; i < count; i++) {
      const lat = bounds.south + Math.random() * (bounds.north - bounds.south);
      const lon = bounds.west + Math.random() * (bounds.east - bounds.west);

      // Skip if too close to center
      if (Math.abs(lat - center.lat) < exclusionRadius && Math.abs(lon - center.lon) < exclusionRadius) continue;

      const pos = project(lat, lon, center.lat, center.lon);
      const height = 5 + Math.random() * 25; // Random height 5-30m

      // Vibrant Urban Palette
      const palette = [
        '#3b82f6', // Blue
        '#06b6d4', // Cyan
        '#8b5cf6', // Violet
        '#6366f1', // Indigo
        '#10b981', // Emerald
        '#f59e0b', // Amber
        '#64748b', // Slate (Base)
        '#475569', // Slate Dark
      ];
      const color = palette[Math.floor(Math.random() * palette.length)];

      tempBuildings.push({ pos, height, color, id: i });
    }
    return tempBuildings;
  }, [center, bounds]);

  return (
    <group>
      {buildings.map((b) => (
        <Building key={b.id} position={b.pos} height={b.height} color={b.color} />
      ))}
    </group>
  );
};

const Scene: React.FC<SceneProps> = ({ zones: _zones = [] }) => {
  const [layoutData, setLayoutData] = useState<LayoutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/digital-twin/3d-model');
        if (!response.ok) throw new Error('Failed to fetch layout');
        const data = await response.json();
        setLayoutData(data);
      } catch (error) {
        console.error("Error loading 3D model:", error);
        // Fallback or error handling could go here
      } finally {
        setLoading(false);
      }
    };

    fetchLayout();
  }, []);

  if (loading || !layoutData) {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center text-cyan-500">
        Loading 3D Model...
      </div>
    );
  }

  const center = layoutData.coordinates.center;

  // Helper to get color based on type
  const getLandmarkColor = (type: string) => {
    switch (type) {
      case 'transport_hub': return '#ef4444';
      case 'industrial': return '#f97316';
      case 'commercial': return '#8b5cf6';
      case 'residential': return '#10b981';
      default: return '#3b82f6';
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 rounded-xl overflow-hidden relative">
      <Canvas shadows camera={{ position: [20, 20, 20], fov: 45 }}>
        <PerspectiveCamera makeDefault position={[25, 25, 25]} fov={50} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2.1}
        />

        <ambientLight intensity={0.4} />
        <directionalLight
          position={[50, 50, 25]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <Environment preset="city" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <fog attach="fog" args={['#111827', 20, 150]} />


        <Grid
          infiniteGrid
          fadeDistance={100}
          sectionColor="#4f46e5"
          cellColor="#6366f1"
          sectionSize={10}
          cellSize={2}
        />





        {/* Render Procedural City Background */}
        {layoutData.coordinates.bounds && (
          <ProceduralCity center={center} bounds={layoutData.coordinates.bounds} />
        )}

        {/* Render Landmarks from Layout Data */}
        {layoutData.landmarks.map((landmark) => {
          const pos = project(landmark.coordinates.lat, landmark.coordinates.lon, center.lat, center.lon);
          return (
            <Building
              key={landmark.id}
              position={pos}
              height={landmark.height_m}
              color={getLandmarkColor(landmark.type)}
              name={landmark.name}
              isLandmark={true}
            />
          );
        })}

        {/* Render Roads */}
        {layoutData.roads.map((road) => {
          const points = road.coordinates.map(coord => project(coord.lat, coord.lon, center.lat, center.lon));
          return <Road key={road.id} points={points} width={road.width_m} />;
        })}



      </Canvas>

      {/* Legend Overlay */}
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-gray-700 text-xs text-gray-300 pointer-events-none select-none">
        <div className="font-semibold mb-2 text-white">Legend</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-sm bg-red-500"></span> Transport Hub</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-sm bg-purple-500"></span> Commercial</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-sm bg-orange-500"></span> Industrial</div>

        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-slate-600"></span> General Buildings</div>
      </div>
    </div>
  );
};

export default Scene;
