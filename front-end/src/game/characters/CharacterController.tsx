import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Player } from './Player';
import { SEATING_SPOTS, useGameStore } from '../../stores/useGameStore';
import { CharacterAnimationState } from './CharacterAnimations';
import {
  resolveCompoundMapMovement,
  resolvePalaceMovement,
} from '../physics/PalaceColliders';

const WALK_SPEED = 5.5;
const RUN_SPEED = 9.5;

export const CharacterController: React.FC = () => {
  const characterGroupRef = useRef<THREE.Group>(null);
  const currentPos = useRef<[number, number, number]>([0, 0, 20]);
  const currentRotationY = useRef<number>(Math.PI);

  const setAnimationState = useGameStore((s) => s.setAnimationState);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const setCameraMode = useGameStore((s) => s.setCameraMode);
  const setPreviewAnimOverride = useGameStore((s) => s.setPreviewAnimOverride);
  const seatedSpotId = useGameStore((s) => s.seatedSpotId);
  const standUp = useGameStore((s) => s.standUp);
  const setNearbySeatId = useGameStore((s) => s.setNearbySeatId);
  const teleportTarget = useGameStore((s) => s.teleportTarget);
  const clearTeleportTarget = useGameStore((s) => s.clearTeleportTarget);

  const { camera } = useThree();
  const prevSeatedSpotId = useRef<string | null>(null);

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
  });

  // Nhận yêu cầu dịch chuyển nhân vật khi đổi khu vực trên Map hoặc Vào/Ra Chính Điện
  useEffect(() => {
    if (teleportTarget) {
      const [tx, ty, tz] = teleportTarget;
      currentPos.current = [tx, ty, tz];
      if (characterGroupRef.current) {
        characterGroupRef.current.position.set(tx, ty, tz);
      }
      clearTeleportTarget();
    }
  }, [teleportTarget, clearTeleportTarget]);

  // Khi chuyển từ trạng thái Ngồi -> Đứng dậy
  useEffect(() => {
    if (prevSeatedSpotId.current && !seatedSpotId) {
      const prevSpot = SEATING_SPOTS.find((s) => s.id === prevSeatedSpotId.current);
      if (prevSpot) {
        const [dx, dy, dz] = prevSpot.dismountPosition;
        currentPos.current = [dx, dy, dz];
        if (characterGroupRef.current) {
          characterGroupRef.current.position.set(dx, dy, dz);
        }
        setPlayerPosition([dx, dy, dz]);
      }
    }
    prevSeatedSpotId.current = seatedSpotId;
  }, [seatedSpotId, setPlayerPosition]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyF' || e.code === 'KeyE') {
        const state = useGameStore.getState();
        if (state.sceneMode === 'compound_map') {
          // Nếu đang ở trước Chính Điện trên Map, phím F/E sẽ đưa vào Nội Điện Thái Hòa
          state.setSceneMode('main_hall_interior');
          return;
        }
        if (state.seatedSpotId) {
          state.standUp();
        } else if (state.nearbySeatId) {
          state.sitAtSpot(state.nearbySeatId);
        } else {
          state.sitAtSpot('imperial_throne');
        }
        return;
      }

      if (e.code === 'Space') {
        const state = useGameStore.getState();
        if (state.seatedSpotId) {
          state.standUp();
          return;
        }
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.shift = true;
          break;
        default:
          return;
      }

      const currentSeated = useGameStore.getState().seatedSpotId;
      if (currentSeated) {
        standUp();
      }
      setCameraMode('follow');
      setPreviewAnimOverride(null);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.shift = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setCameraMode, setPreviewAnimOverride, standUp]);

  const forwardVec = useRef(new THREE.Vector3());
  const rightVec = useRef(new THREE.Vector3());
  const moveDir = useRef(new THREE.Vector3());
  const lastAnimState = useRef<CharacterAnimationState>('idle');
  const lastNearbySeat = useRef<string | null>(null);

  useFrame((_, delta) => {
    const group = characterGroupRef.current;
    if (!group) return;

    const clampedDelta = Math.min(delta, 0.1);
    const storeState = useGameStore.getState();
    const activeSeatedId = storeState.seatedSpotId;
    const sceneMode = storeState.sceneMode;
    const vInput = storeState.virtualInput;

    // 1. Nếu đang ngồi trên Long Ngai hoặc Ghế Quan Viên trong Nội Điện
    if (sceneMode === 'main_hall_interior' && activeSeatedId) {
      const seat = SEATING_SPOTS.find((s) => s.id === activeSeatedId);
      if (seat) {
        const [sx, sy, sz] = seat.seatPosition;
        currentPos.current = [sx, sy, sz];
        group.position.set(sx, sy, sz);

        let angleDiff = seat.rotationY - currentRotationY.current;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        currentRotationY.current += angleDiff * (1 - Math.exp(-14 * clampedDelta));
        group.rotation.y = currentRotationY.current;

        if (lastAnimState.current !== 'sit') {
          lastAnimState.current = 'sit';
          setAnimationState('sit');
        }
        setPlayerPosition([sx, sy, sz]);
        return;
      }
    }

    // 2. Di chuyển bằng bàn phím WASD hoặc nút điều hướng ảo góc trái dưới HUD
    const { forward, backward, left, right, shift } = keys.current;
    const hasKeyMove = forward || backward || left || right;
    const hasVirtualMove = Math.abs(vInput.x) > 0.01 || Math.abs(vInput.z) > 0.01;
    const isMoving = hasKeyMove || hasVirtualMove;

    camera.getWorldDirection(forwardVec.current);
    forwardVec.current.y = 0;
    if (forwardVec.current.lengthSq() > 0.0001) {
      forwardVec.current.normalize();
    } else {
      forwardVec.current.set(0, 0, -1);
    }

    rightVec.current
      .crossVectors(forwardVec.current, THREE.Object3D.DEFAULT_UP)
      .normalize();

    moveDir.current.set(0, 0, 0);
    if (forward || vInput.z < 0) moveDir.current.add(forwardVec.current);
    if (backward || vInput.z > 0) moveDir.current.sub(forwardVec.current);
    if (right || vInput.x > 0) moveDir.current.add(rightVec.current);
    if (left || vInput.x < 0) moveDir.current.sub(rightVec.current);

    const [px, py, pz] = currentPos.current;
    let nextX = px;
    let nextY = py;
    let nextZ = pz;

    if (isMoving && moveDir.current.lengthSq() > 0.001) {
      moveDir.current.normalize();
      const speed = shift ? RUN_SPEED : WALK_SPEED;

      const rawTargetX = px + moveDir.current.x * speed * clampedDelta;
      const rawTargetZ = pz + moveDir.current.z * speed * clampedDelta;

      if (sceneMode === 'main_hall_interior') {
        [nextX, nextY, nextZ] = resolvePalaceMovement(
          px,
          py,
          pz,
          rawTargetX,
          rawTargetZ
        );
      } else {
        [nextX, nextY, nextZ] = resolveCompoundMapMovement(
          rawTargetX,
          rawTargetZ
        );

        // Kiểm tra hoàn thành nhiệm vụ nhập môn khi đi đến Lại Bộ (X < -14, Z gần -6)
        if (
          !storeState.laiBoQuestCompleted &&
          Math.hypot(nextX - -17.5, nextZ - -6) < 5.5
        ) {
          storeState.completeLaiBoQuest();
        }
      }

      const targetAngle = Math.atan2(moveDir.current.x, moveDir.current.z);
      let angleDiff = targetAngle - currentRotationY.current;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      currentRotationY.current += angleDiff * (1 - Math.exp(-14 * clampedDelta));
      group.rotation.y = currentRotationY.current;
    }

    currentPos.current = [nextX, nextY, nextZ];
    group.position.set(nextX, nextY, nextZ);
    setPlayerPosition([nextX, nextY, nextZ]);

    const nextAnim: CharacterAnimationState = !isMoving
      ? 'idle'
      : shift
        ? 'run'
        : 'walk';

    if (nextAnim !== lastAnimState.current) {
      lastAnimState.current = nextAnim;
      setAnimationState(nextAnim);
    }

    // Kiểm tra ghế ngồi gần nhất trong Nội Điện
    if (sceneMode === 'main_hall_interior') {
      let closestSpotId: string | null = null;
      let minDistance = Infinity;

      for (const spot of SEATING_SPOTS) {
        const dx = nextX - spot.seatPosition[0];
        const dz = nextZ - spot.seatPosition[2];
        const dist = Math.hypot(dx, dz);
        if (dist <= spot.interactRadius && dist < minDistance) {
          minDistance = dist;
          closestSpotId = spot.id;
        }
      }

      if (closestSpotId !== lastNearbySeat.current) {
        lastNearbySeat.current = closestSpotId;
        setNearbySeatId(closestSpotId);
      }
    } else if (lastNearbySeat.current !== null) {
      lastNearbySeat.current = null;
      setNearbySeatId(null);
    }
  });

  return (
    <group ref={characterGroupRef} position={[0, 0, 20]}>
      <Player />
    </group>
  );
};
