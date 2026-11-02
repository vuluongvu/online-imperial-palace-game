import React, { Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
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
        dpr={[1, 1.75]}
        camera={{
          fov: 45,
          near: 0.2,
          far: 90,
          position: CAMERA_PRESETS.emperor_closeup.position,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <Suspense fallback={null}>
          <Palace />
          <Physics gravity={[0, -24, 0]}>
            <PalaceColliders />
            <CharacterController />
          </Physics>
          <ThirdPersonCamera />
          <PerformanceMonitor />
        </Suspense>
      </Canvas>

      <SceneInspectOverlay />
    </main>
  );
};

export default App;
