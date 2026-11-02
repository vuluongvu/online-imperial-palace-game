import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { INTERACTABLE_ENTITIES, PALACE_QUEST_CHAIN } from '../../data/palaceGameplayData';
import { InteractableEntity } from '../../types/gameplay';
import { Player } from '../characters/Player';
import { useGameStore } from '../../stores/useGameStore';
import { useGameplayStore } from '../../stores/useGameplayStore';
import { useUiStore } from '../../stores/useUiStore';

/**
 * Mô hình 3D cho từng loại Vật thể tương tác (Bảng cáo thị, Bàn làm việc, Giá sách, Bản đồ, Rương vật chứng, Bàn trà đá)
 */
const InteractivePropMesh: React.FC<{
  entity: InteractableEntity;
  materials: Record<string, THREE.Material>;
}> = ({ entity, materials }) => {
  switch (entity.propKind) {
    case 'board':
      return (
        <group>
          {/* Hai trụ gỗ sơn đỏ đỡ bảng */}
          <mesh position={[-0.95, 1.15, 0]} material={materials.redWood} castShadow>
            <cylinderGeometry args={[0.09, 0.11, 2.3, 10]} />
          </mesh>
          <mesh position={[0.95, 1.15, 0]} material={materials.redWood} castShadow>
            <cylinderGeometry args={[0.09, 0.11, 2.3, 10]} />
          </mesh>
          {/* Khung bảng gỗ lim */}
          <mesh position={[0, 1.35, 0]} material={materials.darkWood} castShadow>
            <boxGeometry args={[1.85, 1.15, 0.12]} />
          </mesh>
          {/* Mặt bảng giấy tuyên thành vàng */}
          <mesh position={[0, 1.35, 0.07]} material={materials.parchment}>
            <boxGeometry args={[1.62, 0.92, 0.02]} />
          </mesh>
          {/* Mái che bảng thếp vàng */}
          <mesh position={[0, 2.12, 0]} material={materials.goldRoof} castShadow>
            <boxGeometry args={[2.25, 0.22, 0.55]} />
          </mesh>
        </group>
      );

    case 'desk':
      return (
        <group>
          {/* Bàn gỗ cung đình */}
          <mesh position={[0, 0.42, 0]} material={materials.darkWood} castShadow receiveShadow>
            <boxGeometry args={[1.65, 0.84, 0.92]} />
          </mesh>
          {/* Khăn trải bàn gấm đỏ */}
          <mesh position={[0, 0.85, 0]} material={materials.redWood}>
            <boxGeometry args={[1.45, 0.04, 0.72]} />
          </mesh>
          {/* Chồng tấu chương & Ấn vàng trên bàn */}
          <mesh position={[-0.32, 0.92, 0]} material={materials.parchment}>
            <boxGeometry args={[0.42, 0.1, 0.32]} />
          </mesh>
          <mesh position={[0.35, 0.94, 0.05]} material={materials.goldRoof}>
            <boxGeometry args={[0.18, 0.14, 0.18]} />
          </mesh>
        </group>
      );

    case 'bookshelf':
      return (
        <group>
          {/* Khung giá sách cổ tịch */}
          <mesh position={[0, 1.15, 0]} material={materials.darkWood} castShadow>
            <boxGeometry args={[1.7, 2.3, 0.52]} />
          </mesh>
          {/* Các tầng sách kinh sử */}
          {[0.55, 1.15, 1.75].map((yPos, idx) => (
            <mesh
              key={`shelf-row-${idx}`}
              position={[0, yPos, 0.04]}
              material={idx % 2 === 0 ? materials.parchment : materials.jadeStone}
            >
              <boxGeometry args={[1.42, 0.34, 0.42]} />
            </mesh>
          ))}
        </group>
      );

    case 'map_stand':
      return (
        <group>
          {/* Bệ sa bàn bản đồ */}
          <mesh position={[0, 0.48, 0]} material={materials.darkWood} castShadow>
            <boxGeometry args={[1.75, 0.96, 1.25]} />
          </mesh>
          {/* Mặt bản đồ sơn hà */}
          <mesh position={[0, 0.98, 0]} material={materials.jadeStone}>
            <boxGeometry args={[1.52, 0.06, 1.04]} />
          </mesh>
          {/* Mô hình núi non thu nhỏ trên sa bàn */}
          <mesh position={[-0.3, 1.12, -0.15]} material={materials.goldRoof}>
            <coneGeometry args={[0.22, 0.28, 5]} />
          </mesh>
          <mesh position={[0.28, 1.1, 0.12]} material={materials.goldRoof}>
            <coneGeometry args={[0.18, 0.22, 5]} />
          </mesh>
        </group>
      );

    case 'chest':
      return (
        <group>
          {/* Bục đá đặt rương */}
          <mesh position={[0, 0.18, 0]} material={materials.whiteMarble} receiveShadow>
            <boxGeometry args={[1.35, 0.36, 0.95]} />
          </mesh>
          {/* Rương vật chứng sơn đỏ bọc đồng */}
          <mesh position={[0, 0.58, 0]} material={materials.redWood} castShadow>
            <boxGeometry args={[1.05, 0.52, 0.68]} />
          </mesh>
          <mesh position={[0, 0.62, 0.35]} material={materials.goldRoof}>
            <boxGeometry args={[0.22, 0.2, 0.06]} />
          </mesh>
        </group>
      );

    case 'stone_bench':
      return (
        <group>
          {/* Bàn đá tròn cẩm thạch tại Ngự Hoa Viên */}
          <mesh position={[0, 0.42, 0]} material={materials.whiteMarble} castShadow>
            <cylinderGeometry args={[0.68, 0.52, 0.84, 16]} />
          </mesh>
          {/* Ấm trà ngọc bích trên bàn đá */}
          <mesh position={[0, 0.92, 0]} material={materials.jadeStone}>
            <sphereGeometry args={[0.14, 12, 10]} />
          </mesh>
          {/* 4 Đôn ghế đá xung quanh */}
          {[
            [-1.05, 0],
            [1.05, 0],
            [0, -1.05],
            [0, 1.05],
          ].map(([sx, sz], idx) => (
            <mesh
              key={`stool-${idx}`}
              position={[sx, 0.25, sz]}
              material={materials.whiteMarble}
              castShadow
            >
              <cylinderGeometry args={[0.26, 0.24, 0.5, 12]} />
            </mesh>
          ))}
        </group>
      );

    case 'throne_info':
    default:
      // Điểm tương tác trên Ngự Án Thái Hòa Điện (đã có mô hình Ngự Án trong MainHall.tsx, chỉ thêm vòng sáng dưới chân)
      return null;
  }
};

export const BuildingInteractiveProps: React.FC = () => {
  const sceneMode = useGameStore((s) => s.sceneMode);
  const playerPos = useGameStore((s) => s.playerPosition);
  const showAssetModal = useGameStore((s) => s.showAssetModal);
  const nearbyInteractableId = useGameplayStore((s) => s.nearbyInteractableId);
  const activeInteractableId = useGameplayStore((s) => s.activeInteractableId);
  const currentQuestStep = useGameplayStore((s) => s.currentQuestStep);
  const openInteraction = useGameplayStore((s) => s.openInteraction);
  const activeWindow = useUiStore((s) => s.activeWindow);

  const isAnyModalOpen = Boolean(
    activeInteractableId || activeWindow || showAssetModal
  );

  const activeQuest = useMemo(
    () => PALACE_QUEST_CHAIN.find((q) => q.stepNumber === currentQuestStep),
    [currentQuestStep]
  );

  const visibleEntities = useMemo(
    () => INTERACTABLE_ENTITIES.filter((e) => e.zoneMode === sceneMode),
    [sceneMode]
  );

  const materials = useMemo(() => {
    return {
      redWood: new THREE.MeshStandardMaterial({ color: '#9E1F1B', roughness: 0.45 }),
      darkWood: new THREE.MeshStandardMaterial({ color: '#462614', roughness: 0.55 }),
      goldRoof: new THREE.MeshStandardMaterial({
        color: '#EAB338',
        roughness: 0.25,
        metalness: 0.65,
      }),
      parchment: new THREE.MeshStandardMaterial({ color: '#F5E6C4', roughness: 0.7 }),
      jadeStone: new THREE.MeshStandardMaterial({ color: '#397D6C', roughness: 0.35 }),
      whiteMarble: new THREE.MeshStandardMaterial({ color: '#ECE5D8', roughness: 0.4 }),
      ringActive: new THREE.MeshBasicMaterial({
        color: '#FFD86B',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      }),
      ringIdle: new THREE.MeshBasicMaterial({
        color: '#D4A238',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.38,
      }),
    };
  }, []);

  return (
    <group name="BuildingInteractiveEntities">
      {visibleEntities.map((entity) => {
        const isNearby = nearbyInteractableId === entity.id;
        const isQuestTarget = activeQuest?.targetInteractableId === entity.id;
        const labelY =
          entity.type === 'npc'
            ? 2.25
            : entity.propKind === 'throne_info'
              ? 1.55
              : 2.35;

        // Tính cự ly từ nhân vật đến đối tượng
        const dx = playerPos[0] - entity.position[0];
        const dz = playerPos[2] - entity.position[2];
        const dist = Math.hypot(dx, dz);

        // Hiển thị theo khoảng cách chuẩn RPG:
        // 1. Ở xa (> 8.0m): KHÔNG hiển thị nhãn chữ HTML (tránh rối màn hình)
        // 2. Lại gần (4.5m < dist <= 8.0m): Chỉ hiển thị nhãn tên nhỏ gọn, mờ nhẹ nhận biết
        // 3. Ở đủ gần tương tác (dist <= 4.5m hoặc isNearby): Hiển thị phím [E] Tương tác
        // 4. Nếu đang mở bảng menu/đối thoại: Tự ẩn toàn bộ 100%
        const shouldRenderTag = !isAnyModalOpen && dist <= 8.0;
        const showFullPrompt = dist <= 4.5 || isNearby;

        return (
          <group
            key={entity.id}
            position={entity.position}
            rotation={[0, entity.rotationY ?? 0, 0]}
          >
            {/* Vòng tròn chỉ dẫn tương tác dưới mặt đất (chỉ hiện khi trong tầm nhận biết <= 8m) */}
            {dist <= 8.0 && (
              <mesh
                position={[0, 0.05, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                material={isNearby || isQuestTarget ? materials.ringActive : materials.ringIdle}
              >
                <ringGeometry args={[0.72, 0.92, 24]} />
              </mesh>
            )}

            {/* Cột Sáng Vàng Dẫn Đường 3D (Waypoint Light Beacon) cho mục tiêu nhiệm vụ */}
            {isQuestTarget && (
              <group position={[0, 0, 0]}>
                {/* Luồng sáng vàng rực rỡ chiếu thẳng lên trời */}
                <mesh position={[0, 10, 0]}>
                  <cylinderGeometry args={[0.35, 0.75, 20, 16, 1, true]} />
                  <meshBasicMaterial
                    color="#FFD700"
                    transparent
                    opacity={0.32}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                  />
                </mesh>
                {/* Tia lõi sáng trắng tập trung ở giữa */}
                <mesh position={[0, 10, 0]}>
                  <cylinderGeometry args={[0.08, 0.18, 20, 12, 1, true]} />
                  <meshBasicMaterial
                    color="#FFFFFF"
                    transparent
                    opacity={0.65}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                  />
                </mesh>
                {/* Mũi tên dẫn hướng lấp lánh phía trên đầu mục tiêu */}
                <mesh position={[0, 3.8, 0]} rotation={[0, 0, Math.PI]}>
                  <coneGeometry args={[0.3, 0.65, 6]} />
                  <meshBasicMaterial color="#FFD700" />
                </mesh>
              </group>
            )}

            {/* Render NPC Chibi hoặc Vật thể 3D */}
            {entity.type === 'npc' ? (
              <Player rank={entity.npcRank ?? 'minister'} animationState="idle" />
            ) : (
              <InteractivePropMesh entity={entity} materials={materials} />
            )}

            {/* Nhãn Tên & Chỉ báo Nhiệm Vụ / Phím E nổi phía trên */}
            {shouldRenderTag && (
              <Html
                position={[0, labelY, 0]}
                center
                distanceFactor={sceneMode === 'compound_map' ? 24 : 16}
                zIndexRange={[10, 0]}
              >
                <div
                  className={`interactable-3d-tag ${showFullPrompt ? 'nearby' : 'minimal'} ${
                    isQuestTarget ? 'quest-target' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    openInteraction(entity.id);
                  }}
                  title="Nhấn chuột hoặc lại gần bấm phím E để tương tác"
                >
                  {isQuestTarget && (
                    <span className="quest-excl-badge">
                      {showFullPrompt ? '❗ Nhiệm Vụ' : '◆'}
                    </span>
                  )}
                  <span className="interactable-tag-name">
                    {entity.type === 'npc' ? '👤 ' : '✨ '}
                    {entity.name}
                  </span>
                  {showFullPrompt && (
                    <span className="interactable-key-pill">[E] Tương tác</span>
                  )}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};
