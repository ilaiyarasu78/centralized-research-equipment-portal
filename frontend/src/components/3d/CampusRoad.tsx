import React from 'react';
import * as THREE from 'three';

export const CampusRoad: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Ground Grass Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.9} />
      </mesh>

      {/* Main Asphalt Campus Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 2]} receiveShadow>
        <planeGeometry args={[40, 5]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>

      {/* White Crosswalk Zebra Markings */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-2 + i * 0.8, 0.02, 2]}>
          <planeGeometry args={[0.4, 3.5]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      ))}

      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -0.8]} receiveShadow>
        <planeGeometry args={[40, 0.8]} />
        <meshStandardMaterial color="#64748b" roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 4.8]} receiveShadow>
        <planeGeometry args={[40, 0.8]} />
        <meshStandardMaterial color="#64748b" roughness={0.5} />
      </mesh>

      {/* Street Lights along Sidewalk */}
      {[-12, -6, 0, 6, 12].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0, 4.8]}>
          {/* Pole */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 2.4, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          {/* Light Fixture */}
          <mesh position={[0, 2.4, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#fef08a" emissive="#fde047" emissiveIntensity={1.5} />
          </mesh>
          {/* Soft Point Light */}
          <pointLight position={[0, 2.4, 0]} intensity={0.8} distance={6} color="#fde047" />
        </group>
      ))}
    </group>
  );
};
