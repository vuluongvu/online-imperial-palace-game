import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CAMERA_PRESETS, useGameStore } from '../../stores/useGameStore';

/**
 * Hệ thống Camera:
 * - Phase 1: Cho phép xoay chuột kiểm tra không gian Chính điện + chuyển mượt giữa các góc máy chuẩn (Presets).
 * - Giới hạn góc nhìn và khoảng cách zoom để không xuyên qua tường hay sàn Chính điện.
 * - Sẵn sàng mở rộng sang chế độ bám theo nhân vật (MMORPG Third-Person Follow) ở Phase 2.
 */
export const ThirdPersonCamera: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraPreset = useGameStore((s) => s.cameraPreset);
  const { camera } = useThree();

  const desiredPosition = useRef(new THREE.Vector3(...CAMERA_PRESETS.overview.position));
  const desiredTarget = useRef(new THREE.Vector3(...CAMERA_PRESETS.overview.target));
  const isTransitioning = useRef(false);

  useEffect(() => {
    const preset = CAMERA_PRESETS[cameraPreset];
    desiredPosition.current.set(...preset.position);
    desiredTarget.current.set(...preset.target);
    isTransitioning.current = true;
  }, [cameraPreset]);

  useFrame((_, delta) => {
    if (!isTransitioning.current || !controlsRef.current) return;

    const lerpFactor = 1 - Math.exp(-5.5 * delta);
    camera.position.lerp(desiredPosition.current, lerpFactor);
    controlsRef.current.target.lerp(desiredTarget.current, lerpFactor);
    controlsRef.current.update();

    if (
      camera.position.distanceTo(desiredPosition.current) < 0.06 &&
      controlsRef.current.target.distanceTo(desiredTarget.current) < 0.06
    ) {
      isTransitioning.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      minDistance={2.5}
      maxDistance={26}
      minPolarAngle={0.22}
      maxPolarAngle={Math.PI / 2 - 0.04}
      onStart={() => {
        isTransitioning.current = false;
      }}
    />
  );
};
