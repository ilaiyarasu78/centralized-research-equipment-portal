import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Wrench, ArrowRight, Sparkles, MapPin, Cpu, Database, Laptop, Radio, X, Terminal, BookOpen, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

interface LabData {
  id: string;
  dbId?: string;
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

// Bright, Light & Vibrant College Campus Buildings (All 8 Labs + Main Block)
const DEFAULT_LABS_DATA: LabData[] = [
  {
    id: 'main-block',
    name: 'KARPAGAM MAIN BLOCK',
    subtitle: 'Academic & Administrative Headquarters',
    position: [0, 0, -5],
    size: [11, 4.5, 4.5],
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
    position: [-8.5, 0, -1.5],
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
    position: [8.5, 0, -1.5],
    size: [4.2, 3.2, 3.2],
    color: '#22d3ee', // Bright Cyan
    pinColor: '#0891b2',
    equipmentCount: 38,
    availableCount: 9,
    icon: <Cpu className="w-4 h-4 text-cyan-600" />,
  },
  {
    id: 'synopsys-lab',
    name: 'SYNOPSYS EDA LAB',
    subtitle: 'RTL Synthesis & Chip Signoff Suite',
    position: [12.5, 0, 3],
    size: [3.8, 3.0, 3.0],
    color: '#818cf8', // Bright Indigo
    pinColor: '#4f46e5',
    equipmentCount: 32,
    availableCount: 10,
    icon: <Terminal className="w-4 h-4 text-indigo-600" />,
  },
  {
    id: 'matlab-lab',
    name: 'MATLAB COMPUTING LAB',
    subtitle: 'High Performance Compute & Analytics Server',
    position: [-12.5, 0, 3],
    size: [3.8, 3.0, 3.0],
    color: '#fb923c', // Bright Orange
    pinColor: '#ea580c',
    equipmentCount: 50,
    availableCount: 20,
    icon: <Layers className="w-4 h-4 text-orange-600" />,
  },
  {
    id: 'robotics-lab',
    name: 'ROBOTICS & AI CENTER',
    subtitle: 'Autonomous Drones & Industrial Manipulators',
    position: [-7.5, 0, 5],
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
    position: [7.5, 0, 5],
    size: [3.8, 2.8, 3],
    color: '#34d399', // Bright Mint Green
    pinColor: '#059669',
    equipmentCount: 30,
    availableCount: 11,
    icon: <Laptop className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: 'texas-lab',
    name: 'TEXAS INNOVATION LAB',
    subtitle: 'IoT, Wireless Sensors & Microcontrollers',
    position: [-2.8, 0, 6.2],
    size: [4.0, 3.2, 3.2],
    color: '#f87171', // Bright Red
    pinColor: '#dc2626',
    equipmentCount: 40,
    availableCount: 18,
    icon: <Cpu className="w-4 h-4 text-red-600" />,
  },
  {
    id: 'library-hub',
    name: 'DIGITAL LIBRARY & CLUSTER',
    subtitle: 'IEEE E-Journals & 24/7 Digital Hub',
    position: [2.8, 0, 6.2],
    size: [4.8, 3, 3],
    color: '#fbbf24', // Bright Amber / Gold
    pinColor: '#d97706',
    equipmentCount: 65,
    availableCount: 28,
    icon: <BookOpen className="w-4 h-4 text-amber-600" />,
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

      {/* HTML 3D Interactive Tooltip Tag */}
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
        <meshStandardMaterial color="#86efac" roughness={0.8} />
      </mesh>

      {/* Light Stone Campus Pedestrian Roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 1.8]} receiveShadow>
        <planeGeometry args={[34, 3.2]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1.8]} receiveShadow>
        <planeGeometry args={[34, 2.5]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>

      {/* White Lane Markings */}
      {[-14, -8, -2, 4, 10].map((xPos, idx) => (
        <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[xPos, 0.02, 1.8]}>
          <planeGeometry args={[1.6, 0.15]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Light Street Lamp Posts */}
      {[-12, -4, 4, 12].map((x, i) => (
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
  const navigate = useNavigate();
  const [hoveredLabId, setHoveredLabId] = useState<string | null>(null);
  const [selectedLab, setSelectedLab] = useState<LabData | null>(null);
  const [labsData, setLabsData] = useState<LabData[]>(DEFAULT_LABS_DATA);
  const [dbLabsMap, setDbLabsMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchBackendLabs();
  }, []);

  const fetchBackendLabs = async () => {
    try {
      const res = await api.get('/labs');
      if (res.data.success && Array.isArray(res.data.data)) {
        const dbLabs = res.data.data;
        const mapping: Record<string, string> = {};
        
        dbLabs.forEach((l: any) => {
          const upper = (l.name || '').toUpperCase();
          mapping[upper] = l.id;
          if (upper.includes('IDEA')) mapping['idea-lab'] = l.id;
          if (upper.includes('CADENCE')) mapping['cadence-lab'] = l.id;
          if (upper.includes('SYNOPSYS')) mapping['synopsys-lab'] = l.id;
          if (upper.includes('MATLAB')) mapping['matlab-lab'] = l.id;
          if (upper.includes('LABVIEW')) mapping['labview-lab'] = l.id;
          if (upper.includes('TEXAS')) mapping['texas-lab'] = l.id;
          if (upper.includes('LIBRARY')) mapping['library-hub'] = l.id;
          if (upper.includes('ROBOTICS')) mapping['robotics-lab'] = l.id;
        });

        setDbLabsMap(mapping);

        setLabsData((prev) =>
          prev.map((item) => {
            const matchedDb = dbLabs.find((d: any) => {
              const u = (d.name || '').toUpperCase();
              return u.includes(item.name.split(' ')[0]) || (mapping[item.id] === d.id);
            });

            if (matchedDb) {
              return {
                ...item,
                dbId: matchedDb.id,
                equipmentCount: matchedDb.totalEquipments || item.equipmentCount,
                availableCount: matchedDb.availableEquipments || item.availableCount
              };
            }
            return item;
          })
        );
      }
    } catch (e) {
      console.error('Failed to sync 3D map with backend labs', e);
    }
  };

  const handleExploreLab = (lab: LabData) => {
    const targetId = lab.dbId || dbLabsMap[lab.id] || Object.values(dbLabsMap)[0];
    if (targetId) {
      navigate(`/student/labs/${targetId}`);
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="w-full h-full relative select-none bg-slate-100">
      {/* 3D WebGL Canvas Container */}
      <Canvas
        shadows
        camera={{ position: [10, 9, 14], fov: 42 }}
        className="w-full h-full"
      >
        <color attach="background" args={['#e0f2fe']} />
        <fog attach="fog" args={['#e0f2fe', 18, 48]} />

        <ambientLight intensity={2.0} />
        <directionalLight
          position={[15, 25, 15]}
          intensity={2.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <hemisphereLight skyColor="#e0f2fe" groundColor="#86efac" intensity={1.5} />

        <CameraRig />
        <OrbitControls
          enableZoom={true}
          maxPolarAngle={Math.PI / 2.15}
          minDistance={6}
          maxDistance={25}
          enablePan={false}
        />

        <CampusEnvironment />

        {labsData.map((lab) => (
          <CampusBuilding3D
            key={lab.id}
            lab={lab}
            isHovered={hoveredLabId === lab.id}
            onHover={setHoveredLabId}
            onClick={setSelectedLab}
          />
        ))}

        {labsData.map((lab) => (
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
          Daylight 3D Campus • Click Building to Explore
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
          <span>8 Active Campus Labs Synchronized</span>
        </div>
      </div>

      {/* Building Click Information Popup Card */}
      {selectedLab && (
        <div className="absolute top-6 right-6 z-40 bg-white/95 text-slate-900 border border-purple-200 rounded-3xl p-5 shadow-2xl backdrop-blur-xl max-w-xs animate-in fade-in zoom-in-95 pointer-events-auto">
          <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                {selectedLab.icon}
              </span>
              <div>
                <h4 className="text-sm font-black text-slate-900 leading-tight">{selectedLab.name}</h4>
                <p className="text-[10px] text-slate-500 font-bold">{selectedLab.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedLab(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs font-bold mb-4">
            <div className="flex items-center justify-between p-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-100">
              <span className="flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5 text-purple-600" /> Equipment Items:</span>
              <strong className="text-slate-900 font-black">{selectedLab.equipmentCount}</strong>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100">
              <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Operational Status:</span>
              <strong className="text-emerald-700 font-black">{selectedLab.availableCount} Ready</strong>
            </div>
          </div>

          <button
            onClick={() => handleExploreLab(selectedLab)}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Explore Lab Facilities <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

