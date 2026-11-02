import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CAMERA_PRESETS, useGameStore } from '../../stores/useGameStore';

/**
 * Hệ thống Camera MMORPG hỗ trợ cả Bản đồ Quần thể Hoàng Cung (compound_map) và Nội Điện Thái Hòa (main_hall_interior).
 */
export const ThirdPersonCamera: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const sceneMode = useGameStore((s) => s.sceneMode);
  const cameraMode = useGameStore((s) => s.cameraMode);
  const cameraPreset = useGameStore((s) => s.cameraPreset);
  const { camera } = useThree();

  const desiredPosition = useRef(
    new THREE.Vector3(...CAMERA_PRESETS.overview.position)
  );
  const desiredTarget = useRef(
    new THREE.Vector3(...CAMERA_PRESETS.overview.target)
  );
  const isTransitioning = useRef(true);
  const prevPlayerPos = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (cameraMode === 'preset') {
      const preset = CAMERA_PRESETS[cameraPreset];
      desiredPosition.current.set(...preset.position);
      desiredTarget.current.set(...preset.target);
      isTransitioning.current = true;
    }
  }, [cameraMode, cameraPreset, sceneMode]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    const [px, py, pz] = useGameStore.getState().playerPosition;

    if (cameraMode === 'follow') {
      const targetFocus = new THREE.Vector3(px, py + 1.45, pz);

      if (!prevPlayerPos.current) {
        prevPlayerPos.current = new THREE.Vector3(px, py, pz);
        if (sceneMode === 'compound_map') {
          camera.position.set(px, py + 10.5, pz + 14.5);
        }
      }

      const deltaMove = new THREE.Vector3(
        px - prevPlayerPos.current.x,
        py - prevPlayerPos.current.y,
        pz - prevPlayerPos.current.z
      );
      camera.position.add(deltaMove);
      prevPlayerPos.current.set(px, py, pz);

      const followLerp = 1 - Math.exp(-14 * delta);
      controls.target.lerp(targetFocus, followLerp);

      if (sceneMode === 'main_hall_interior') {
        camera.position.x = THREE.MathUtils.clamp(camera.position.x, -30.0, 30.0);
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, -33.0, 20.8);
        camera.position.y = THREE.MathUtils.clamp(camera.position.y, 0.65, 11.2);
      } else {
        camera.position.y = THREE.MathUtils.clamp(camera.position.y, 2.0, 58.0);
      }

      controls.update();
      return;
    }

    prevPlayerPos.current = null;
    if (isTransitioning.current) {
      const lerpFactor = 1 - Math.exp(-5.5 * delta);
      camera.position.lerp(desiredPosition.current, lerpFactor);
      controls.target.lerp(desiredTarget.current, lerpFactor);
      controls.update();

      if (
        camera.position.distanceTo(desiredPosition.current) < 0.08 &&
        controls.target.distanceTo(desiredTarget.current) < 0.08
      ) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enablePan={true}
      minDistance={1.6}
      maxDistance={sceneMode === 'compound_map' ? 95 : 24}
      minPolarAngle={0.18}
      maxPolarAngle={Math.PI / 2 - 0.04}
      onStart={() => {
        isTransitioning.current = false;
      }}
    />
  );
};
