import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CAMERA_PRESETS, useGameStore } from '../../stores/useGameStore';

/**
 * Hệ thống Camera MMORPG Third-Person & Preset Inspection:
 * - Chế độ 'follow': Camera luôn bám theo nhân vật Hoàng Đế / Quan Viên, xoay bằng chuột, zoom bằng con lăn,
 *   tự động giới hạn tọa độ trong lòng Chính điện để không xuyên qua tường.
 * - Chế độ 'preset': Chuyển mượt tới góc máy cận cảnh Hoàng Đế hoặc toàn cảnh Chính điện.
 */
export const ThirdPersonCamera: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraMode = useGameStore((s) => s.cameraMode);
  const cameraPreset = useGameStore((s) => s.cameraPreset);
  const { camera } = useThree();

  const desiredPosition = useRef(
    new THREE.Vector3(...CAMERA_PRESETS.emperor_closeup.position)
  );
  const desiredTarget = useRef(
    new THREE.Vector3(...CAMERA_PRESETS.emperor_closeup.target)
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
  }, [cameraMode, cameraPreset]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    const [px, py, pz] = useGameStore.getState().playerPosition;

    if (cameraMode === 'follow') {
      const targetFocus = new THREE.Vector3(px, py + 1.35, pz);

      if (!prevPlayerPos.current) {
        prevPlayerPos.current = new THREE.Vector3(px, py, pz);
      }

      // Dịch chuyển camera đồng bộ với quãng đường di chuyển của nhân vật
      const deltaMove = new THREE.Vector3(
        px - prevPlayerPos.current.x,
        py - prevPlayerPos.current.y,
        pz - prevPlayerPos.current.z
      );
      camera.position.add(deltaMove);
      prevPlayerPos.current.set(px, py, pz);

      // Bám mượt tâm nhìn vào vai/đầu nhân vật
      const followLerp = 1 - Math.exp(-14 * delta);
      controls.target.lerp(targetFocus, followLerp);

      // Chống xuyên tường Chính điện (Clamping camera bên trong không gian tường bao)
      camera.position.x = THREE.MathUtils.clamp(camera.position.x, -14.8, 14.8);
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, -20.8, 20.8);
      camera.position.y = THREE.MathUtils.clamp(camera.position.y, 0.65, 10.5);

      controls.update();
      return;
    }

    // Chế độ chuyển góc máy Preset mượt mà
    prevPlayerPos.current = null;
    if (isTransitioning.current) {
      const lerpFactor = 1 - Math.exp(-6.0 * delta);
      camera.position.lerp(desiredPosition.current, lerpFactor);
      controls.target.lerp(desiredTarget.current, lerpFactor);
      controls.update();

      if (
        camera.position.distanceTo(desiredPosition.current) < 0.05 &&
        controls.target.distanceTo(desiredTarget.current) < 0.05
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
      enablePan={cameraMode === 'preset'}
      minDistance={1.6}
      maxDistance={24}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2 - 0.04}
      onStart={() => {
        isTransitioning.current = false;
      }}
    />
  );
};
