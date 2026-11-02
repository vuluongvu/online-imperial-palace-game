import React, { Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Palace } from './game/world/Palace';
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
          fov: 48,
          near: 0.25,
          far: 90,
          position: CAMERA_PRESETS.overview.position,
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
          <ThirdPersonCamera />
          <PerformanceMonitor />
        </Suspense>
      </Canvas>

      <SceneInspectOverlay />
    </main>
  );
};

export default App;
