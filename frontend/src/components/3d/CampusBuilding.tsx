import React, { useState } from 'react';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface BuildingProps {
  name: string;
  subtitle: string;
  position: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  equipmentCount?: number;
  availableCount?: number;
  isMain?: boolean;
  onSelectBuilding?: (info: any) => void;
}

export const CampusBuilding: React.FC<BuildingProps> = ({
  name,
  subtitle,
  position,
  scale = [4, 4, 3],
  color = '#0284c7', // Sky Blue matching Karpagam Institute of Technology photo
  equipmentCount = 45,
  availableCount = 12,
  isMain = false,
  onSelectBuilding
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelectBuilding) {
          onSelectBuilding({ name, subtitle, equipmentCount, availableCount });
        }
      }}
    >
      {/* Base White Pillar Structure */}
      <mesh position={[0, scale[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[scale[0], scale[1], scale[2]]} />
        <meshStandardMaterial
          color={hovered ? '#38bdf8' : color}
          roughness={0.3}
          metalness={0.2}
          emissive={hovered ? '#60a5fa' : '#000000'}
          emissiveIntensity={hovered ? 0.4 : 0}
        />
      </mesh>

      {/* White Architectural Accent Columns */}
      <mesh position={[-scale[0] / 2 + 0.3, scale[1] / 2, scale[2] / 2 + 0.05]} castShadow>
        <boxGeometry args={[0.5, scale[1], 0.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>
      <mesh position={[scale[0] / 2 - 0.3, scale[1] / 2, scale[2] / 2 + 0.05]} castShadow>
        <boxGeometry args={[0.5, scale[1], 0.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>

      {/* Glass Windows Grid */}
      {Array.from({ length: Math.floor(scale[1]) }).map((_, floorIdx) => (
        <group key={floorIdx} position={[0, 0.8 + floorIdx * 0.9, scale[2] / 2 + 0.02]}>
          <mesh position={[-1, 0, 0]}>
            <planeGeometry args={[0.7, 0.5]} />
            <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.7, 0.5]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[1, 0, 0]}>
            <planeGeometry args={[0.7, 0.5]} />
            <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}

      {/* Roof Parapet */}
      <mesh position={[0, scale[1] + 0.2, 0]} castShadow>
        <boxGeometry args={[scale[0] + 0.2, 0.4, scale[2] + 0.2]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* 3D Signboard Text */}
      <Text
        position={[0, scale[1] + 0.7, scale[2] / 2 + 0.1]}
        fontSize={isMain ? 0.35 : 0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#0f172a"
      >
        {name}
      </Text>

      {/* Hover Info Tag */}
      {hovered && (
        <Html position={[0, scale[1] + 1.4, 0]} center distanceFactor={15}>
          <div className="bg-slate-900/90 text-white border border-purple-500/50 p-2.5 rounded-xl shadow-2xl backdrop-blur-md text-center min-w-[140px] pointer-events-none animate-in fade-in">
            <h5 className="text-xs font-bold text-purple-300">{name}</h5>
            <p className="text-[10px] text-slate-300">{subtitle}</p>
            <div className="mt-1 flex items-center justify-center gap-2 text-[9px] font-semibold text-emerald-400">
              <span>Equip: {equipmentCount}</span>
              <span>Avail: {availableCount}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
