import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StudentProps {
  initialX: number;
  zPos: number;
  speed?: number;
  shirtColor?: string;
  isBicycle?: boolean;
}

export const CampusStudent: React.FC<StudentProps> = ({
  initialX,
  zPos,
  speed = 0.03,
  shirtColor = '#3b82f6',
  isBicycle = false
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x += speed * delta * 60;
      if (groupRef.current.position.x > 18) {
        groupRef.current.position.x = -18;
      }
    }
  });

  return (
    <group ref={groupRef} position={[initialX, 0, zPos]}>
      {!isBicycle ? (
        // Low Poly Walking Student Figure
        <group position={[0, 0.45, 0]}>
          {/* Head */}
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#fcd34d" />
          </mesh>
          {/* Body */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 0.4, 8]} />
            <meshStandardMaterial color={shirtColor} />
          </mesh>
          {/* Backpack */}
          <mesh position={[0, 0.22, -0.09]}>
            <boxGeometry args={[0.14, 0.2, 0.08]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      ) : (
        // Simple Low Poly Bicycle & Cyclist
        <group position={[0, 0.3, 0]}>
          {/* Bicycle Wheels */}
          <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.18, 0.03, 8, 16]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.18, 0.03, 8, 16]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          {/* Frame */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.04]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </group>
      )}
    </group>
  );
};
