import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import { Player } from './Player';
import { SEATING_SPOTS, useGameStore } from '../../stores/useGameStore';
import { CharacterAnimationState } from './CharacterAnimations';

const WALK_SPEED = 4.2;
const RUN_SPEED = 7.6;

/**
 * Bộ điều khiển nhân vật Chibi:
 * - WASD / Phím mũi tên để di chuyển, giữ Shift để chạy nhanh.
 * - Phím [F] hoặc [E] để Ngự Long Ngai / Ngồi vào Ghế Quan Viên gần nhất (hoặc đứng dậy khi đang ngồi).
 * - Tích hợp Rapier Physics chống xuyên cột/tường/bàn ghế và bước lên bậc tam cấp Bệ Rồng.
 */
export const CharacterController: React.FC = () => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const characterGroupRef = useRef<THREE.Group>(null);
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
    const body = rigidBodyRef.current;
    if (!body) return;

    if (prevSeatedSpotId.current && !seatedSpotId) {
      const prevSpot = SEATING_SPOTS.find((s) => s.id === prevSeatedSpotId.current);
      if (prevSpot) {
        const [dx, dy, dz] = prevSpot.dismountPosition;
        body.setTranslation({ x: dx, y: dy + 0.85, z: dz }, true);
        body.setLinvel({ x: 0, y: 0, z: 0 }, true);
        setPlayerPosition([dx, dy, dz]);
      }
    }
    prevSeatedSpotId.current = seatedSpotId;
  }, [seatedSpotId, setPlayerPosition]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Phím F hoặc E: Ngồi xuống ghế gần nhất / Ngự Long Ngai hoặc Đứng dậy
      if (e.code === 'KeyF' || e.code === 'KeyE') {
        const state = useGameStore.getState();
        if (state.seatedSpotId) {
          state.standUp();
        } else if (state.nearbySeatId) {
          state.sitAtSpot(state.nearbySeatId);
        } else {
          // Nếu đang đứng xa, mặc định phím F/E cho phép Ngự thẳng lên Long Ngai
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

      // Nếu đang ngồi trên ghế/ngai mà bấm WASD thì tự động đứng dậy để di chuyển
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
    const body = rigidBodyRef.current;
    if (!body) return;

    const activeSeatedId = useGameStore.getState().seatedSpotId;

    // 1. Nếu nhân vật đang ngồi trên Long Ngai hoặc Ghế Quan Viên
    if (activeSeatedId) {
      const seat = SEATING_SPOTS.find((s) => s.id === activeSeatedId);
      if (seat) {
        const [sx, sy, sz] = seat.seatPosition;
        body.setTranslation({ x: sx, y: sy + 0.85, z: sz }, true);
        body.setLinvel({ x: 0, y: 0, z: 0 }, true);

        let angleDiff = seat.rotationY - currentRotationY.current;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        currentRotationY.current += angleDiff * (1 - Math.exp(-14 * delta));

        if (characterGroupRef.current) {
          characterGroupRef.current.rotation.y = currentRotationY.current;
        }

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

    const currentLinVel = body.linvel();
    const speed = shift ? RUN_SPEED : WALK_SPEED;

    if (isMoving && moveDir.current.lengthSq() > 0.001) {
      moveDir.current.normalize();

      body.setLinvel(
        {
          x: moveDir.current.x * speed,
          y: currentLinVel.y,
          z: moveDir.current.z * speed,
        },
        true
      );

      const targetAngle = Math.atan2(moveDir.current.x, moveDir.current.z);
      let angleDiff = targetAngle - currentRotationY.current;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      currentRotationY.current += angleDiff * (1 - Math.exp(-14 * delta));
      if (characterGroupRef.current) {
        characterGroupRef.current.rotation.y = currentRotationY.current;
      }
    } else {
      body.setLinvel(
        {
          x: currentLinVel.x * Math.exp(-18 * delta),
          y: currentLinVel.y,
          z: currentLinVel.z * Math.exp(-18 * delta),
        },
        true
      );
    }

    const nextAnim: CharacterAnimationState = !isMoving
      ? 'idle'
      : shift
        ? 'run'
        : 'walk';

    if (nextAnim !== lastAnimState.current) {
      lastAnimState.current = nextAnim;
      setAnimationState(nextAnim);
    }

    const pos = body.translation();
    const px = pos.x;
    const py = pos.y - 0.85;
    const pz = pos.z;
    setPlayerPosition([px, py, pz]);

    // Kiểm tra khoảng cách tới Long Ngai & 12 Ghế Quan Viên để hiện gợi ý ngồi
    let closestSpotId: string | null = null;
    let minDistance = Infinity;

    for (const spot of SEATING_SPOTS) {
      const dx = px - spot.seatPosition[0];
      const dz = pz - spot.seatPosition[2];
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
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      position={[0, 0.9, -11.0]}
      enabledRotations={[false, false, false]}
      mass={1}
      linearDamping={0.5}
    >
      <CapsuleCollider args={[0.45, 0.4]} position={[0, 0, 0]} />
      <group ref={characterGroupRef} position={[0, -0.85, 0]}>
        <Player />
      </group>
    </RigidBody>
  );
};
