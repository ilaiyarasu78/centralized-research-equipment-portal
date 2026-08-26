import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Wrench, ArrowRight, Sparkles, MapPin, Cpu, Database, Laptop, Radio } from 'lucide-react';

interface LabData {
  id: string;
  name: string;
  subtitle: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  pinColor: string;
  equipmentCount: number;
  availableCount: number;
  icon: React.ReactNode;
  isMain?: boolean;
}

// Bright, Light & Vibrant College Campus Buildings (Light Color Theme)
const LABS_DATA: LabData[] = [
  {
    id: 'main-block',
    name: 'KARPAGAM MAIN BLOCK',
    subtitle: 'Academic & Administrative Headquarters',
    position: [0, 0, -3.5],
    size: [10, 4.2, 4],
    color: '#38bdf8', // Bright Sky Blue
    pinColor: '#0284c7',
    equipmentCount: 180,
    availableCount: 52,
    icon: <Database className="w-4 h-4 text-sky-600" />,
    isMain: true,
  },
  {
    id: 'idea-lab',
    name: 'AICTE IDEA LAB',
    subtitle: '3D Printing, Laser Cutting & PCB Milling',
    position: [-6.5, 0, -0.5],
    size: [4.2, 3.2, 3.2],
    color: '#c084fc', // Bright Light Purple
    pinColor: '#7c3aed',
    equipmentCount: 45,
    availableCount: 14,
    icon: <Wrench className="w-4 h-4 text-purple-600" />,
  },
  {
    id: 'cadence-lab',
    name: 'CADENCE VLSI LAB',
    subtitle: 'Microelectronics & Chip Design Suite',
    position: [6.5, 0, -0.5],
    size: [4.2, 3.2, 3.2],
    color: '#22d3ee', // Bright Cyan
    pinColor: '#0891b2',
    equipmentCount: 38,
    availableCount: 9,
    icon: <Cpu className="w-4 h-4 text-cyan-600" />,
  },
  {
    id: 'robotics-lab',
    name: 'ROBOTICS & AI CENTER',
    subtitle: 'Autonomous Drones & Industrial Arms',
    position: [-6.5, 0, 4.2],
    size: [3.8, 2.8, 3],
    color: '#f472b6', // Bright Pink
    pinColor: '#db2777',
    equipmentCount: 26,
    availableCount: 7,
    icon: <Radio className="w-4 h-4 text-pink-600" />,
  },
  {
    id: 'labview-lab',
    name: 'NI LABVIEW LAB',
    subtitle: 'Virtual Instrumentation & Embedded DAQ',
    position: [6.5, 0, 4.2],
    size: [3.8, 2.8, 3],
    color: '#34d399', // Bright Mint Green
    pinColor: '#059669',
    equipmentCount: 30,
    availableCount: 11,
    icon: <Laptop className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: 'library-hub',
    name: 'DIGITAL LIBRARY & CLUSTER',
    subtitle: 'High Performance Compute & 24/7 Digital Hub',
    position: [0, 0, 4.5],
    size: [5.2, 3, 3],
    color: '#fbbf24', // Bright Amber / Gold
    pinColor: '#d97706',
    equipmentCount: 65,
    availableCount: 28,
    icon: <Sparkles className="w-4 h-4 text-amber-600" />,
  },
];

// Interactive 3D Building Component (Light Mode Facade & Windows)
const CampusBuilding3D: React.FC<{
  lab: LabData;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (lab: LabData) => void;
}> = ({ lab, isHovered, onHover, onClick }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [w, h, d] = lab.size;

  return (
    <group
      ref={meshRef}
      position={lab.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(lab.id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(lab);
      }}
    >
      {/* Main Building Block (Bright Light Colors) */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={isHovered ? lab.pinColor : lab.color}
          roughness={0.2}
          metalness={0.1}
          emissive={isHovered ? lab.pinColor : '#ffffff'}
          emissiveIntensity={isHovered ? 0.3 : 0.05}
        />
      </mesh>

      {/* Pure White Architectural Pillars & Columns */}
      <mesh position={[-w / 2 + 0.25, h / 2, d / 2 + 0.05]}>
        <boxGeometry args={[0.4, h, 0.15]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
      <mesh position={[w / 2 - 0.25, h / 2, d / 2 + 0.05]}>
        <boxGeometry args={[0.4, h, 0.15]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>

      {/* Glass Windows Grid */}
      {Array.from({ length: Math.floor(h) }).map((_, fIdx) => (
        <group key={fIdx} position={[0, 0.7 + fIdx * 0.9, d / 2 + 0.02]}>
          {[-w * 0.3, 0, w * 0.3].map((xOffset, wIdx) => (
            <mesh key={wIdx} position={[xOffset, 0, 0]}>
              <planeGeometry args={[w * 0.22, 0.5]} />
              <meshStandardMaterial
                color="#0ea5e9"
                roughness={0.1}
                metalness={0.8}
                emissive="#38bdf8"
                emissiveIntensity={isHovered ? 0.6 : 0.2}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* White Roof Trim */}
      <mesh position={[0, h + 0.15, 0]}>
        <boxGeometry args={[w + 0.2, 0.3, d + 0.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.2} />
      </mesh>
    </group>
  );
};

// Realistic Glowing 3D Map Pin Component
const MapPin3D: React.FC<{
  lab: LabData;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (lab: LabData) => void;
}> = ({ lab, isHovered, onHover, onClick }) => {
  const pinRef = useRef<THREE.Group>(null);
  const [, h] = lab.size;

  useFrame((state) => {
    if (pinRef.current) {
      const t = state.clock.getElapsedTime();
      pinRef.current.position.y = lab.position[1] + h + 1.2 + Math.sin(t * 2.5 + lab.position[0]) * 0.15;
      pinRef.current.rotation.y = t * 0.8;
    }
  });

  const pinPosY = lab.position[1] + h + 1.2;

  return (
    <group
      ref={pinRef}
      position={[lab.position[0], pinPosY, lab.position[2]]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(lab.id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(lab);
      }}
      scale={isHovered ? [1.3, 1.3, 1.3] : [1, 1, 1]}
    >
      {/* 3D Pin Head Sphere */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color={lab.pinColor}
          emissive={lab.pinColor}
          emissiveIntensity={isHovered ? 1.2 : 0.8}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>

      {/* Inner White Core */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Cone Tail pointing down */}
      <mesh position={[0, -0.05, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.32, 0.7, 32]} />
        <meshStandardMaterial
          color={lab.pinColor}
          emissive={lab.pinColor}
          emissiveIntensity={isHovered ? 1.2 : 0.8}
        />
      </mesh>

      {/* Translucent Pulsing Glow Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.38, 0]}>
        <ringGeometry args={[0.3, 0.65, 32]} />
        <meshBasicMaterial color={lab.pinColor} transparent opacity={isHovered ? 0.7 : 0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* HTML 3D Interactive Tooltip Tag (White Theme) */}
      {isHovered && (
        <Html position={[0, 0.9, 0]} center distanceFactor={14}>
          <div className="bg-white text-slate-900 border border-slate-200 p-3 rounded-2xl shadow-2xl backdrop-blur-xl min-w-[170px] pointer-events-none animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-lg bg-purple-100 border border-purple-200">
                {lab.icon}
              </span>
              <h5 className="text-xs font-bold text-slate-900 leading-tight">{lab.name}</h5>
            </div>
            <p className="text-[10px] text-slate-600 line-clamp-1 font-medium">{lab.subtitle}</p>
            <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold">
              <span className="text-slate-500">Items: <strong className="text-slate-900">{lab.equipmentCount}</strong></span>
              <span className="text-emerald-700 font-extrabold">{lab.availableCount} Ready</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Bright Daylight Campus Ground Terrain & Lawn
const CampusEnvironment: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Fresh Green Lawn Base Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#86efac" roughness={0.8} /> {/* Fresh Light Green Lawn */}
      </mesh>

      {/* Light Stone Campus Pedestrian Roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 1.8]} receiveShadow>
        <planeGeometry args={[28, 3.2]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1.8]} receiveShadow>
        <planeGeometry args={[28, 2.5]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>

      {/* White Lane Markings */}
      {[-10, -5, 0, 5, 10].map((xPos, idx) => (
        <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[xPos, 0.02, 1.8]}>
          <planeGeometry args={[1.6, 0.15]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Light Street Lamp Posts */}
      {[-9, 0, 9].map((x, i) => (
        <group key={i} position={[x, 0, 3.8]}>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 2.4, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.5} />
          </mesh>
          <mesh position={[0, 2.4, 0]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Mouse Parallax Controller
const CameraRig: React.FC = () => {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 9 + state.mouse.x * 2, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 8 + state.mouse.y * 1.5, 0.05);
    state.camera.lookAt(0, 1, 0);
  });
  return null;
};

export const InteractiveCampus3D: React.FC = () => {
  const [hoveredLabId, setHoveredLabId] = useState<string | null>(null);
  const [selectedLab, setSelectedLab] = useState<LabData | null>(null);

  return (
    <div className="w-full h-full relative select-none bg-slate-100">
      {/* 3D WebGL Canvas Container (Daylight Sky Setup) */}
      <Canvas
        shadows
        camera={{ position: [9, 8, 12], fov: 42 }}
        className="w-full h-full"
      >
        {/* Soft Bright Sky Background & Daylight Fog */}
        <color attach="background" args={['#e0f2fe']} />
        <fog attach="fog" args={['#e0f2fe', 18, 45]} />

        {/* Daylight Sun Lighting Setup */}
        <ambientLight intensity={2.0} />
        <directionalLight
          position={[15, 25, 15]}
          intensity={2.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <hemisphereLight skyColor="#e0f2fe" groundColor="#86efac" intensity={1.5} />

        {/* Camera Rig & Orbit Controls */}
        <CameraRig />
        <OrbitControls
          enableZoom={true}
          maxPolarAngle={Math.PI / 2.15}
          minDistance={6}
          maxDistance={22}
          enablePan={false}
        />

        {/* Ground Terrain */}
        <CampusEnvironment />

        {/* 3D Campus Buildings */}
        {LABS_DATA.map((lab) => (
          <CampusBuilding3D
            key={lab.id}
            lab={lab}
            isHovered={hoveredLabId === lab.id}
            onHover={setHoveredLabId}
            onClick={setSelectedLab}
          />
        ))}

        {/* Glowing 3D Pins */}
        {LABS_DATA.map((lab) => (
          <MapPin3D
            key={`pin-${lab.id}`}
            lab={lab}
            isHovered={hoveredLabId === lab.id}
            onHover={setHoveredLabId}
            onClick={setSelectedLab}
          />
        ))}
      </Canvas>

      {/* Top Left HUD Overlay Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-xs font-bold text-slate-800 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-sm backdrop-blur-md">
          Daylight 3D Campus • Hover to Inspect
        </span>
      </div>

      {/* Bottom Floating Stats Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-white/95 text-slate-900 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-md flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Karpagam Institute of Technology Campus</span>
        </div>

        <div className="bg-white/95 text-slate-900 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-md hidden sm:flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>240+ Equipment Available Across Labs</span>
        </div>
      </div>
    </div>
  );
};
