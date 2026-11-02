import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Player } from './Player';
import { SEATING_SPOTS, useGameStore } from '../../stores/useGameStore';
import { CharacterAnimationState } from './CharacterAnimations';
import { resolvePalaceMovement } from '../physics/PalaceColliders';

const WALK_SPEED = 4.5;
const RUN_SPEED = 8.0;

/**
 * Bộ điều khiển nhân vật Chibi:
 * - WASD / Phím mũi tên để di chuyển, giữ Shift để chạy nhanh.
 * - Phím [F] hoặc [E] để Ngự Long Ngai / Ngồi vào Ghế Quan Viên gần nhất (hoặc đứng dậy khi đang ngồi).
 * - Tích hợp va chạm vật lý mượt mà với 22 cột đại điện, 12 bàn ghế quan viên, tường bao và bậc tam cấp Bệ Rồng.
 */
export const CharacterController: React.FC = () => {
  const characterGroupRef = useRef<THREE.Group>(null);
  const currentPos = useRef<[number, number, number]>([0, 0, -11.0]);
  const currentRotationY = useRef<number>(0);

  const setAnimationState = useGameStore((s) => s.setAnimationState);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const setCameraMode = useGameStore((s) => s.setCameraMode);
  const setPreviewAnimOverride = useGameStore((s) => s.setPreviewAnimOverride);
  const seatedSpotId = useGameStore((s) => s.seatedSpotId);
  const standUp = useGameStore((s) => s.standUp);
  const setNearbySeatId = useGameStore((s) => s.setNearbySeatId);

  const { camera } = useThree();
  const prevSeatedSpotId = useRef<string | null>(null);

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
  });

  // Khi chuyển từ trạng thái Ngồi -> Đứng dậy, đặt nhân vật ra vị trí đứng trước ghế/ngai
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
    const activeSeatedId = useGameStore.getState().seatedSpotId;

    // 1. Nếu nhân vật đang ngồi trên Long Ngai hoặc Ghế Quan Viên
    if (activeSeatedId) {
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

    // 2. Di chuyển tự do bằng WASD
    const { forward, backward, left, right, shift } = keys.current;
    const isMoving = forward || backward || left || right;

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
    if (forward) moveDir.current.add(forwardVec.current);
    if (backward) moveDir.current.sub(forwardVec.current);
    if (right) moveDir.current.add(rightVec.current);
    if (left) moveDir.current.sub(rightVec.current);

    const [px, py, pz] = currentPos.current;
    let nextX = px;
    let nextY = py;
    let nextZ = pz;

    if (isMoving && moveDir.current.lengthSq() > 0.001) {
      moveDir.current.normalize();
      const speed = shift ? RUN_SPEED : WALK_SPEED;

      const rawTargetX = px + moveDir.current.x * speed * clampedDelta;
      const rawTargetZ = pz + moveDir.current.z * speed * clampedDelta;

      [nextX, nextY, nextZ] = resolvePalaceMovement(
        px,
        py,
        pz,
        rawTargetX,
        rawTargetZ
      );

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

    // Kiểm tra khoảng cách tới Long Ngai & 12 Ghế Quan Viên để hiện gợi ý ngồi
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
  });

  return (
    <group ref={characterGroupRef} position={[0, 0, -11.0]}>
      <Player />
    </group>
  );
};
