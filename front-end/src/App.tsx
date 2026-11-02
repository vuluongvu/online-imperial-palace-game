import React, { Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Palace } from './game/world/Palace';
import { PalaceColliders } from './game/physics/PalaceColliders';
import { CharacterController } from './game/characters/CharacterController';
import { ThirdPersonCamera } from './game/camera/ThirdPersonCamera';
import { PerformanceMonitor } from './game/systems/PerformanceMonitor';
import { SceneInspectOverlay } from './components/SceneInspectOverlay';
import { CAMERA_PRESETS } from './stores/useGameStore';

export const App: React.FC = () => {
  return (
    <main className="app-viewport">
      <Canvas
        shadows
        dpr={[1, 1.35]}
        camera={{
          fov: 45,
          near: 0.2,
          far: 240,
          position: CAMERA_PRESETS.compound_panorama.position,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
        }}
      >
        <Suspense fallback={null}>
          <Palace />
          <PalaceColliders />
          <CharacterController />
          <ThirdPersonCamera />
          <PerformanceMonitor />
        </Suspense>
      </Canvas>

      <SceneInspectOverlay />
    </main>
  );
};

export default App;
