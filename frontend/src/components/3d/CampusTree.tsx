import React from 'react';

interface TreeProps {
  position: [number, number, number];
  scale?: number;
}

export const CampusTree: React.FC<TreeProps> = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 1.2, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Foliage Cones */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[0.7, 1.4, 8]} />
        <meshStandardMaterial color="#0284c7" roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.1, 0]} castShadow>
        <coneGeometry args={[0.5, 1.1, 8]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.6} />
      </mesh>
    </group>
  );
};
