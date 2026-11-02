import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CAMERA_PRESETS, useGameStore } from '../../stores/useGameStore';
import { useGameplayStore } from '../../stores/useGameplayStore';

/**
 * Hệ thống Camera MMORPG hỗ trợ:
 * 1. Chế độ Khóa Chuột (Pointer Lock / Mouse Lock): Xoay camera 360° tự do theo chuyển động chuột mà không cần giữ chuột trái, cuộn con lăn để zoom, Click trái để tương tác NPC/Vật thể.
 * 2. Chế độ OrbitControls: Kéo chuột xoay camera và chuyển góc máy Preset mượt mà.
 */
export const ThirdPersonCamera: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const sceneMode = useGameStore((s) => s.sceneMode);
  const cameraMode = useGameStore((s) => s.cameraMode);
  const cameraPreset = useGameStore((s) => s.cameraPreset);
  const isPointerLocked = useGameStore((s) => s.isPointerLocked);

  const { camera, gl } = useThree();

  const desiredPosition = useRef(
    new THREE.Vector3(...CAMERA_PRESETS.compound_panorama.position)
  );
  const desiredTarget = useRef(
    new THREE.Vector3(...CAMERA_PRESETS.compound_panorama.target)
  );
  const isTransitioning = useRef(true);
  const prevPlayerPos = useRef<THREE.Vector3 | null>(null);

  // Tọa độ cầu (Spherical: radius, phi, theta) phục vụ chế độ Khóa Chuột (Mouse Lock)
  const sphericalRef = useRef(new THREE.Spherical(10.5, 1.12, 0));
  const targetSphericalRef = useRef(new THREE.Spherical(10.5, 1.12, 0));
  const smoothFocusRef = useRef(new THREE.Vector3(0, 1.45, 31));

  useEffect(() => {
    if (cameraMode === 'preset') {
      const preset = CAMERA_PRESETS[cameraPreset];
      desiredPosition.current.set(...preset.position);
      desiredTarget.current.set(...preset.target);
      isTransitioning.current = true;
    }
  }, [cameraMode, cameraPreset, sceneMode]);

  // Lắng nghe sự kiện Pointer Lock, di chuyển chuột, con lăn zoom và phím tắt L
  useEffect(() => {
    const canvasEl = gl.domElement;

    const syncSphericalFromCamera = () => {
      const [px, py, pz] = useGameStore.getState().playerPosition;
      const focus = new THREE.Vector3(px, py + 1.45, pz);
      smoothFocusRef.current.copy(focus);

      const offset = new THREE.Vector3().subVectors(camera.position, focus);
      if (offset.lengthSq() < 1.0) {
        offset.set(0, 4.5, 9.5);
      }
      sphericalRef.current.setFromVector3(offset);
      sphericalRef.current.radius = THREE.MathUtils.clamp(
        sphericalRef.current.radius,
        2.5,
        useGameStore.getState().sceneMode === 'compound_map' ? 22 : 13
      );
      sphericalRef.current.phi = THREE.MathUtils.clamp(
        sphericalRef.current.phi,
        0.24,
        Math.PI / 2 - 0.06
      );
      targetSphericalRef.current.copy(sphericalRef.current);
    };

    const handlePointerLockChange = () => {
      const locked = document.pointerLockElement === canvasEl;
      const store = useGameStore.getState();
      store.setPointerLocked(locked);

      if (locked) {
        store.setCameraMode('follow');
        isTransitioning.current = false;
        syncSphericalFromCamera();
      } else if (controlsRef.current) {
        const [px, py, pz] = store.playerPosition;
        controlsRef.current.target.set(px, py + 1.45, pz);
        controlsRef.current.update();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvasEl) return;
      const { mouseSensitivity, invertY } = useGameStore.getState();
      const yawSpeed = 0.0024 * mouseSensitivity;
      const pitchSpeed = 0.002 * mouseSensitivity * (invertY ? -1 : 1);

      targetSphericalRef.current.theta -= e.movementX * yawSpeed;
      targetSphericalRef.current.phi = THREE.MathUtils.clamp(
        targetSphericalRef.current.phi - e.movementY * pitchSpeed,
        0.22,
        Math.PI / 2 - 0.05
      );
    };

    const handleWheel = (e: WheelEvent) => {
      if (document.pointerLockElement !== canvasEl) return;
      e.preventDefault();
      const maxRadius =
        useGameStore.getState().sceneMode === 'compound_map' ? 34 : 15;
      targetSphericalRef.current.radius = THREE.MathUtils.clamp(
        targetSphericalRef.current.radius + e.deltaY * 0.006,
        2.2,
        maxRadius
      );
    };

    const handleMouseDown = (e: MouseEvent) => {
      const gpState = useGameplayStore.getState();
      const gameState = useGameStore.getState();

      // Nếu đang ở chế độ Khóa Chuột
      if (document.pointerLockElement === canvasEl) {
        // Click chuột trái (Button 0): Tương tác ngay với NPC/Vật thể hoặc Ghế gần nhất
        if (e.button === 0) {
          if (gpState.nearbyInteractableId) {
            gpState.openInteraction(gpState.nearbyInteractableId);
          } else if (gameState.nearbySeatId) {
            gameState.sitAtSpot(gameState.nearbySeatId);
          }
        } else if (e.button === 2) {
          // Click chuột phải (Button 2): Thoát khóa chuột nhanh
          gameState.exitMouseLock();
        }
        return;
      }

      // Nếu chưa khóa chuột và người chơi click trái vào Canvas khi đang ở chế độ Follow (và bật Click-to-Lock)
      if (
        e.button === 0 &&
        e.target === canvasEl &&
        gameState.clickToLockEnabled &&
        gameState.cameraMode === 'follow' &&
        !gpState.activeInteractableId &&
        !gameState.showAssetModal
      ) {
        gameState.requestMouseLock();
      }
    };

    const handleDoubleClick = (e: MouseEvent) => {
      const gpState = useGameplayStore.getState();
      const gameState = useGameStore.getState();
      if (
        e.target === canvasEl &&
        !gpState.activeInteractableId &&
        !gameState.showAssetModal &&
        document.pointerLockElement !== canvasEl
      ) {
        gameState.requestMouseLock();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      // Phím L: Bật / Tắt Khóa Chuột (Mouse Lock)
      if (e.code === 'KeyL') {
        e.preventDefault();
        const gameState = useGameStore.getState();
        const gpState = useGameplayStore.getState();
        if (gpState.activeInteractableId || gameState.showAssetModal) return;

        if (document.pointerLockElement === canvasEl) {
          gameState.exitMouseLock();
        } else {
          gameState.requestMouseLock();
        }
      }
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('dblclick', handleDoubleClick);
    window.addEventListener('keydown', handleKeyDown);
    canvasEl.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('dblclick', handleDoubleClick);
      window.removeEventListener('keydown', handleKeyDown);
      canvasEl.removeEventListener('wheel', handleWheel);
    };
  }, [camera, gl.domElement]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    const state = useGameStore.getState();
    const [px, py, pz] = state.playerPosition;

    // 1. Xử lý khi đang Khóa Chuột (Pointer Lock Active)
    if (state.isPointerLocked) {
      const targetFocus = new THREE.Vector3(px, py + 1.45, pz);
      const focusLerp = 1 - Math.exp(-16 * delta);
      const rotLerp = 1 - Math.exp(-22 * delta);

      smoothFocusRef.current.lerp(targetFocus, focusLerp);

      sphericalRef.current.theta = THREE.MathUtils.lerp(
        sphericalRef.current.theta,
        targetSphericalRef.current.theta,
        rotLerp
      );
      sphericalRef.current.phi = THREE.MathUtils.lerp(
        sphericalRef.current.phi,
        targetSphericalRef.current.phi,
        rotLerp
      );
      sphericalRef.current.radius = THREE.MathUtils.lerp(
        sphericalRef.current.radius,
        targetSphericalRef.current.radius,
        focusLerp
      );

      const offset = new THREE.Vector3().setFromSpherical(sphericalRef.current);
      const desiredCamPos = new THREE.Vector3().addVectors(
        smoothFocusRef.current,
        offset
      );

      if (state.sceneMode === 'main_hall_interior') {
        desiredCamPos.x = THREE.MathUtils.clamp(desiredCamPos.x, -30.0, 30.0);
        desiredCamPos.z = THREE.MathUtils.clamp(desiredCamPos.z, -33.0, 20.8);
        desiredCamPos.y = THREE.MathUtils.clamp(desiredCamPos.y, 0.75, 11.2);
      } else {
        desiredCamPos.y = THREE.MathUtils.clamp(desiredCamPos.y, 1.2, 58.0);
      }

      camera.position.copy(desiredCamPos);
      camera.lookAt(smoothFocusRef.current);

      if (controls) {
        controls.target.copy(smoothFocusRef.current);
      }
      prevPlayerPos.current = new THREE.Vector3(px, py, pz);
      return;
    }

    if (!controls) return;

    // 2. Xử lý khi ở chế độ Follow bình thường (Không khóa chuột)
    if (state.cameraMode === 'follow') {
      const targetFocus = new THREE.Vector3(px, py + 1.45, pz);

      if (!prevPlayerPos.current) {
        prevPlayerPos.current = new THREE.Vector3(px, py, pz);
        if (state.sceneMode === 'compound_map') {
          camera.position.set(px, py + 8.5, pz + 12.5);
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

      if (state.sceneMode === 'main_hall_interior') {
        camera.position.x = THREE.MathUtils.clamp(camera.position.x, -30.0, 30.0);
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, -33.0, 20.8);
        camera.position.y = THREE.MathUtils.clamp(camera.position.y, 0.65, 11.2);
      } else {
        camera.position.y = THREE.MathUtils.clamp(camera.position.y, 2.0, 58.0);
      }

      controls.update();
      return;
    }

    // 3. Xử lý khi chuyển góc nhìn Preset
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
      enabled={!isPointerLocked}
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
