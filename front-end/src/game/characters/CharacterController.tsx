import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import { Player } from './Player';
import { useGameStore } from '../../stores/useGameStore';
import { CharacterAnimationState } from './CharacterAnimations';

const WALK_SPEED = 4.2;
const RUN_SPEED = 7.6;

/**
 * Bộ điều khiển nhân vật Chibi (WASD + Shift để chạy + Xoay mặt mượt theo hướng di chuyển).
 * Sử dụng Rapier Physics để xử lý va chạm với cột, tường, bàn ghế và bước lên bậc Bệ Rồng.
 */
export const CharacterController: React.FC = () => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const characterGroupRef = useRef<THREE.Group>(null);
  const currentRotationY = useRef<number>(0);

  const setAnimationState = useGameStore((s) => s.setAnimationState);
  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const setCameraMode = useGameStore((s) => s.setCameraMode);
  const setPreviewAnimOverride = useGameStore((s) => s.setPreviewAnimOverride);

  const { camera } = useThree();

  // Trạng thái phím bấm
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      // Khi người chơi bấm WASD, tự động chuyển sang camera theo sau nhân vật và tắt override preview
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
  }, [setCameraMode, setPreviewAnimOverride]);

  const forwardVec = useRef(new THREE.Vector3());
  const rightVec = useRef(new THREE.Vector3());
  const moveDir = useRef(new THREE.Vector3());
  const lastAnimState = useRef<CharacterAnimationState>('idle');

  useFrame((_, delta) => {
    const body = rigidBodyRef.current;
    if (!body) return;

    const { forward, backward, left, right, shift } = keys.current;
    const isMoving = forward || backward || left || right;

    // Tính hướng di chuyển dựa trên hướng nhìn ngang của Camera
    camera.getWorldDirection(forwardVec.current);
    forwardVec.current.y = 0;
    if (forwardVec.current.lengthSq() > 0.0001) {
      forwardVec.current.normalize();
    } else {
      forwardVec.current.set(0, 0, -1);
    }

    rightVec.current.crossVectors(forwardVec.current, THREE.Object3D.DEFAULT_UP).normalize();

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

      // Xoay mặt nhân vật mượt mà theo hướng di chuyển (Frame-rate independent)
      const targetAngle = Math.atan2(moveDir.current.x, moveDir.current.z);
      let angleDiff = targetAngle - currentRotationY.current;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      currentRotationY.current += angleDiff * (1 - Math.exp(-14 * delta));
      if (characterGroupRef.current) {
        characterGroupRef.current.rotation.y = currentRotationY.current;
      }
    } else {
      // Giảm tốc nhanh khi thả phím để không bị trượt băng
      body.setLinvel(
        {
          x: currentLinVel.x * Math.exp(-18 * delta),
          y: currentLinVel.y,
          z: currentLinVel.z * Math.exp(-18 * delta),
        },
        true
      );
    }

    // Cập nhật trạng thái Animation khi có thay đổi
    const nextAnim: CharacterAnimationState = !isMoving
      ? 'idle'
      : shift
        ? 'run'
        : 'walk';

    if (nextAnim !== lastAnimState.current) {
      lastAnimState.current = nextAnim;
      setAnimationState(nextAnim);
    }

    // Đồng bộ tọa độ nhân vật cho Camera theo dõi
    const pos = body.translation();
    setPlayerPosition([pos.x, pos.y - 0.85, pos.z]);
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
