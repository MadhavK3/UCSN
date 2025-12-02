import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, Stars } from '@react-three/drei'
import * as THREE from 'three'

const BrainParticles: React.FC = () => {
  const points = useMemo(() => {
    const p = []
    const numPoints = 3000

    // Brain shape parameters
    const a = 2.5 // x-axis radius (width)
    const b = 2.0 // y-axis radius (height)
    const c = 3.0 // z-axis radius (length)

    for (let i = 0; i < numPoints; i++) {
      // Random point in sphere
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)

      let x = Math.sin(phi) * Math.cos(theta)
      let y = Math.sin(phi) * Math.sin(theta)
      let z = Math.cos(phi)

      // Deform to ellipsoid
      x *= a
      y *= b
      z *= c

      // Create two hemispheres (lobes)
      // Shift x slightly to left or right based on sign
      x += (x > 0 ? 0.2 : -0.2)

      // Add some noise/fuzziness
      x += (Math.random() - 0.5) * 0.1
      y += (Math.random() - 0.5) * 0.1
      z += (Math.random() - 0.5) * 0.1

      p.push(x, y, z)
    }
    return new Float32Array(p)
  }, [])

  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry ref={geometryRef}>
          <bufferAttribute
            attach="attributes-position"
            count={points.length / 3}
            array={points}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          color="#00f0ff"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Connecting Lines (Neural Network effect) - Simplified for performance */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2, 2, 2)]} />
        {/* Note: Real neural connections would be computationally expensive to generate dynamically here. 
            Instead, we use a wireframe glow effect or just the points for the "data cloud" look. 
            Let's add an inner glow sphere instead. */}
      </lineSegments>

      {/* Inner Glow Core */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

const Scene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />

        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 5, 20]} />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00f0ff" />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#ff003c" />

        <BrainParticles />

        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}

export default Scene
