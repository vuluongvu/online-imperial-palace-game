import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Player } from './Player';
import { SEATING_SPOTS, useGameStore } from '../../stores/useGameStore';
import { useGameplayStore } from '../../stores/useGameplayStore';
import { INTERACTABLE_ENTITIES } from '../../data/palaceGameplayData';
import { CharacterAnimationState } from './CharacterAnimations';
import {
  resolveCompoundMapMovement,
  resolvePalaceMovement,
} from '../physics/PalaceColliders';

const WALK_SPEED = 5.5;
const RUN_SPEED = 9.5;

export const CharacterController: React.FC = () => {
  const characterGroupRef = useRef<THREE.Group>(null);
  const currentPos = useRef<[number, number, number]>([0, 0, 31]);
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

  const overheadBubbleText = useGameplayStore((s) => s.overheadBubbleText);

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
      // Đóng giao diện tương tác bằng phím ESC
      if (e.code === 'Escape') {
        const gpState = useGameplayStore.getState();
        if (gpState.activeInteractableId) {
          gpState.closeInteraction();
          return;
        }
        const gameState = useGameStore.getState();
        if (gameState.showAssetModal) {
          gameState.setShowAssetModal(false);
          return;
        }
      }

      // Không bắt phím WASD/E/F khi người chơi đang gõ chữ trong ô input/textarea
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') {
        return;
      }

      // Phím E: Tương tác với NPC hoặc Vật thể công trình gần nhất
      if (e.code === 'KeyE') {
        const gpState = useGameplayStore.getState();
        const gameState = useGameStore.getState();

        if (gpState.activeInteractableId) {
          gpState.closeInteraction();
          return;
        }

        if (gpState.nearbyInteractableId) {
          gpState.openInteraction(gpState.nearbyInteractableId);
          return;
        }

        if (gameState.seatedSpotId) {
          gameState.standUp();
          return;
        }
        if (gameState.nearbySeatId) {
          gameState.sitAtSpot(gameState.nearbySeatId);
          return;
        }
        return;
      }

      // Phím F: Ngồi ghế / Đứng dậy (Ngai vàng, Ghế quan viên, Ghế đá Ngự Hoa Viên)
      if (e.code === 'KeyF') {
        const state = useGameStore.getState();
        if (state.seatedSpotId) {
          state.standUp();
        } else if (state.nearbySeatId) {
          state.sitAtSpot(state.nearbySeatId);
        } else {
          const gpState = useGameplayStore.getState();
          if (gpState.nearbyInteractableId) {
            gpState.openInteraction(gpState.nearbyInteractableId);
          } else if (state.sceneMode === 'main_hall_interior') {
            state.sitAtSpot('imperial_throne');
          }
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
  const lastNearbyInteractable = useRef<string | null>(null);

  useFrame((_, delta) => {
    const group = characterGroupRef.current;
    if (!group) return;

    const clampedDelta = Math.min(delta, 0.1);
    const storeState = useGameStore.getState();
    const activeSeatedId = storeState.seatedSpotId;
    const sceneMode = storeState.sceneMode;
    const vInput = storeState.virtualInput;

    // 1. Nếu đang ngồi trên Long Ngai, Ghế Quan Viên hoặc Ghế Đá Ngự Hoa Viên
    if (activeSeatedId) {
      const seat = SEATING_SPOTS.find((s) => s.id === activeSeatedId);
      if (seat && (seat.zoneMode ?? 'main_hall_interior') === sceneMode) {
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

    // 3. Kiểm tra đối tượng NPC / Vật thể tương tác gần nhất (Hệ thống tương tác Phím E dùng chung)
    let closestEntityId: string | null = null;
    let minEntityDist = Infinity;

    for (const entity of INTERACTABLE_ENTITIES) {
      if (entity.zoneMode !== sceneMode) continue;
      const dx = nextX - entity.position[0];
      const dz = nextZ - entity.position[2];
      const dist = Math.hypot(dx, dz);
      if (dist <= entity.interactRadius && dist < minEntityDist) {
        minEntityDist = dist;
        closestEntityId = entity.id;
      }
    }

    if (closestEntityId !== lastNearbyInteractable.current) {
      lastNearbyInteractable.current = closestEntityId;
      useGameplayStore.getState().setNearbyInteractableId(closestEntityId);
    }

    // 4. Kiểm tra ghế ngồi gần nhất (Trong Nội Điện hoặc Ghế Đá Ngự Hoa Viên)
    let closestSpotId: string | null = null;
    let minSeatDist = Infinity;

    for (const spot of SEATING_SPOTS) {
      const spotMode = spot.zoneMode ?? 'main_hall_interior';
      if (spotMode !== sceneMode) continue;
      const dx = nextX - spot.seatPosition[0];
      const dz = nextZ - spot.seatPosition[2];
      const dist = Math.hypot(dx, dz);
      if (dist <= spot.interactRadius && dist < minSeatDist) {
        minSeatDist = dist;
        closestSpotId = spot.id;
      }
    }

    if (closestSpotId !== lastNearbySeat.current) {
      lastNearbySeat.current = closestSpotId;
      setNearbySeatId(closestSpotId);
    }
  });

  return (
    <group ref={characterGroupRef} position={[0, 0, 31]}>
      <Player />
      {overheadBubbleText && (
        <Html position={[0, 2.35, 0]} center zIndexRange={[20, 0]}>
          <div className="player-overhead-bubble">{overheadBubbleText}</div>
        </Html>
      )}
    </group>
  );
};
