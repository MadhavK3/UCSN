import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

const RotatingCity = () => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.005; // Slow rotation
        }
    });

    return (
        <group ref={groupRef}>
            {/* Central Tower */}
            <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[1, 3, 1]} />
                <meshStandardMaterial color="#06b6d4" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Surrounding Buildings */}
            <mesh position={[1.5, 0.75, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.8, 1.5, 0.8]} />
                <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[-1.5, 1, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.8, 2, 0.8]} />
                <meshStandardMaterial color="#6366f1" metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.5, 1.5]} castShadow receiveShadow>
                <boxGeometry args={[0.8, 1, 0.8]} />
                <meshStandardMaterial color="#8b5cf6" metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[0, 1.2, -1.5]} castShadow receiveShadow>
                <boxGeometry args={[0.8, 2.4, 0.8]} />
                <meshStandardMaterial color="#ec4899" metalness={0.6} roughness={0.3} />
            </mesh>

            {/* Base Platform */}
            <mesh position={[0, -0.1, 0]} receiveShadow>
                <cylinderGeometry args={[3, 3, 0.2, 32]} />
                <meshStandardMaterial color="#1f2937" metalness={0.5} roughness={0.5} />
            </mesh>
        </group>
    );
};

const DigitalTwinCard: React.FC = () => {
    return (
        <div className="w-full h-full min-h-[200px] bg-gray-900 rounded-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10 pointer-events-none" />

            <Canvas shadows>
                <PerspectiveCamera makeDefault position={[5, 4, 5]} fov={50} />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />

                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                <Environment preset="city" />

                <RotatingCity />
            </Canvas>

            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h3 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">Digital Twin</h3>
                <p className="text-gray-300 text-xs">Interactive 3D City Model</p>
            </div>
        </div>
    );
};

export default DigitalTwinCard;
