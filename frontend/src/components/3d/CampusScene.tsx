import React, { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { CampusBuilding } from './CampusBuilding';
import { CampusRoad } from './CampusRoad';
import { CampusTree } from './CampusTree';
import { CampusStudent } from './CampusStudent';
import { SmartCampusLogo3D } from './SmartCampusLogo3D';
import { X, Wrench, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Camera Mouse Parallax Controller
const CameraRig = () => {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 8 + state.mouse.x * 2.5, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 6 + state.mouse.y * 1.5, 0.05);
    state.camera.lookAt(0, 2, 0);
  });
  return null;
};

export const CampusScene: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBuilding, setSelectedBuilding] = useState<any | null>(null);

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Real Karpagam College Building Background Texture Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 transition-opacity duration-700 pointer-events-none z-0"
        style={{ backgroundImage: `url('/assets/karpagam_building.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40 z-0 pointer-events-none"></div>

      {/* 3D WebGL Canvas Layer */}
      <Canvas
        shadows
        camera={{ position: [8, 6, 12], fov: 45 }}
        className="w-full h-full relative z-10"
      >
        <CameraRig />

        {/* Lighting */}
        <ambientLight intensity={0.7} />
        <hemisphereLight args={['#38bdf8', '#0f172a', 0.9]} />
        <directionalLight
          position={[12, 18, 10]}
          intensity={1.4}
          castShadow
          color="#ffffff"
        />

        {/* Central 3D Smart Campus Emblem */}
        <SmartCampusLogo3D />

        {/* Campus Road Infrastructure */}
        <CampusRoad />

        {/* 1. Main College Building (KARPAGAM INSTITUTE OF TECHNOLOGY - Exact Sky-Blue Architecture) */}
        <CampusBuilding
          name="KARPAGAM INSTITUTE OF TECHNOLOGY"
          subtitle="Main Academic & Administrative Block"
          position={[0, 0, -4]}
          scale={[11, 5.5, 4.2]}
          color="#0284c7"
          isMain={true}
          equipmentCount={150}
          availableCount={48}
          onSelectBuilding={setSelectedBuilding}
        />

        {/* 2. IDEA LAB */}
        <CampusBuilding
          name="IDEA LAB"
          subtitle="Prototyping, PCB Milling & 3D Printing"
          position={[-7.5, 0, -1]}
          scale={[4.5, 3.5, 3]}
          color="#7c3aed"
          equipmentCount={45}
          availableCount={12}
          onSelectBuilding={setSelectedBuilding}
        />

        {/* 3. CADENCE LAB */}
        <CampusBuilding
          name="CADENCE LAB"
          subtitle="VLSI EDA & Microelectronics Suite"
          position={[7.5, 0, -1]}
          scale={[4.5, 3.5, 3]}
          color="#059669"
          equipmentCount={28}
          availableCount={8}
          onSelectBuilding={setSelectedBuilding}
        />

        {/* 4. LABVIEW LAB */}
        <CampusBuilding
          name="LABVIEW LAB"
          subtitle="Virtual Instrumentation & Systems"
          position={[-12.5, 0, 1]}
          scale={[4, 3, 3]}
          color="#0891b2"
          equipmentCount={20}
          availableCount={6}
          onSelectBuilding={setSelectedBuilding}
        />

        {/* 5. CENTRAL LIBRARY */}
        <CampusBuilding
          name="LIBRARY"
          subtitle="24/7 Digital Knowledge Repository"
          position={[12.5, 0, 1]}
          scale={[4, 3, 3]}
          color="#d97706"
          equipmentCount={60}
          availableCount={24}
          onSelectBuilding={setSelectedBuilding}
        />

        {/* Trees */}
        <CampusTree position={[-11, 0, -3.5]} scale={1.2} />
        <CampusTree position={[-4, 0, -3.5]} scale={1.1} />
        <CampusTree position={[4, 0, -3.5]} scale={1.1} />
        <CampusTree position={[11, 0, -3.5]} scale={1.2} />

        {/* Students */}
        <CampusStudent initialX={-10} zPos={4.8} speed={0.04} shirtColor="#0284c7" />
        <CampusStudent initialX={-3} zPos={4.8} speed={0.03} shirtColor="#ec4899" />
        <CampusStudent initialX={5} zPos={2} speed={0.08} isBicycle={true} />

        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 4} />
      </Canvas>

      {/* Building Click Information Popup */}
      {selectedBuilding && (
        <div className="absolute top-6 left-6 z-40 bg-slate-900/95 text-white border border-purple-500/40 rounded-2xl p-5 shadow-2xl backdrop-blur-xl max-w-xs animate-in fade-in">
          <div className="flex items-start justify-between border-b border-slate-700/60 pb-3 mb-3">
            <div>
              <span className="text-[10px] font-extrabold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                KARPAGAM CAMPUS DIGITAL TWIN
              </span>
              <h4 className="text-sm font-black text-white mt-1">{selectedBuilding.name}</h4>
              <p className="text-xs text-slate-300">{selectedBuilding.subtitle}</p>
            </div>
            <button
              onClick={() => setSelectedBuilding(null)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-200">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5 text-purple-400" /> Total Equipment:</span>
              <strong className="text-white">{selectedBuilding.equipmentCount} Items</strong>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Available Now:</span>
              <strong className="text-emerald-400">{selectedBuilding.availableCount} Ready</strong>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedBuilding(null);
              navigate('/login');
            }}
            className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Explore Lab Facilities <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
