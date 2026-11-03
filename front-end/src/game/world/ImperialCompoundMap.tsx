import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import {
  COMPOUND_STREET_LANTERNS,
  COMPOUND_TREES,
  LandmarkZone,
  PALACE_LANDMARKS,
} from './compoundLayout';
import { TieredPalaceRoof } from './ImperialPalaceRoof';
import { createImperialRoofGeometry } from './roofGeometry';
import {
  LaiBoInterior,
  HinhBoInterior,
  HanLamVienInterior,
  NguThuPhongInterior,
} from './MinistryInteriors';
import { PALACE_QUEST_CHAIN } from '../../data/palaceGameplayData';
import { LivingPalaceNpcs } from './LivingPalaceNpcs';
import { useGameStore } from '../../stores/useGameStore';
import { useGameplayStore } from '../../stores/useGameplayStore';
import { useUiStore } from '../../stores/useUiStore';

/**
 * Thủy Đình Lục Giác Mái Xanh Ngọc (Hexagonal Garden Pavilion)
 */
const HexagonalPavilion: React.FC<{
  position: [number, number, number];
  materials: Record<string, THREE.Material>;
}> = ({ position, materials }) => {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} material={materials.whiteMarble} receiveShadow>
        <cylinderGeometry args={[2.3, 2.5, 0.5, 6]} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI) / 3;
        return (
          <mesh
            key={`pav-col-${i}`}
            position={[Math.cos(angle) * 1.85, 1.65, Math.sin(angle) * 1.85]}
            material={materials.pillarRed}
            castShadow
          >
            <cylinderGeometry args={[0.12, 0.14, 2.4, 8]} />
          </mesh>
        );
      })}
      <mesh position={[0, 3.35, 0]} material={materials.roofJade} castShadow>
        <coneGeometry args={[2.85, 1.45, 6]} />
      </mesh>
      <mesh position={[0, 4.15, 0]} material={materials.goldTrim}>
        <sphereGeometry args={[0.2, 10, 10]} />
      </mesh>
    </group>
  );
};

/**
 * Cầu Vồng Gỗ Đỏ Bắc Qua Hồ Sen (Arched Red Wooden Bridge)
 */
const ArchedRedBridge: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  materials: Record<string, THREE.Material>;
}> = ({ position, rotationY = 0, materials }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.22, 0]} material={materials.pillarRed} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.24, 2.2]} />
      </mesh>
      {[-0.98, 0.98].map((zRail, idx) => (
        <mesh
          key={`bridge-rail-${idx}`}
          position={[0, 0.65, zRail]}
          material={materials.pillarRed}
          castShadow
        >
          <boxGeometry args={[4.4, 0.45, 0.12]} />
        </mesh>
      ))}
      {[-2.1, 0, 2.1].map((xPost) =>
        [-0.98, 0.98].map((zRail) => (
          <mesh
            key={`bpost-${xPost}-${zRail}`}
            position={[xPost, 1.0, zRail]}
            material={materials.goldTrim}
          >
            <sphereGeometry args={[0.1, 8, 8]} />
          </mesh>
        ))
      )}
    </group>
  );
};

/**
 * Không Gian Mở Ngự Hoa Viên (Imperial Royal Garden)
 * Tọa độ tâm công trình: [26, 0, 17]
 * Không gian mở ngoài trời: hồ sen trong xanh, thủy đình lục giác, cầu đỏ, đào nở hoa, thạch đăng
 */
const NguHoaVienGarden: React.FC<{
  materials: Record<string, THREE.Material>;
}> = ({ materials }) => {
  const lotusPads = useMemo(
    () => [
      { x: -1.8, z: -2.8, r: 0.38, hasFlower: true },
      { x: -2.6, z: -1.9, r: 0.32, hasFlower: false },
      { x: -1.2, z: 2.6, r: 0.42, hasFlower: true },
      { x: -2.4, z: 3.1, r: 0.34, hasFlower: false },
      { x: 2.2, z: -2.9, r: 0.4, hasFlower: true },
      { x: 3.4, z: -2.2, r: 0.3, hasFlower: false },
      { x: 2.1, z: 2.7, r: 0.36, hasFlower: true },
      { x: 3.2, z: 2.0, r: 0.33, hasFlower: false },
      { x: 0.0, z: -3.8, r: 0.44, hasFlower: true },
      { x: 0.0, z: 3.8, r: 0.44, hasFlower: true },
    ],
    []
  );

  return (
    <group name="NguHoaVienGarden">
      {/* 1. Thềm viền đá Bạch Ngọc quanh hồ sen */}
      <mesh position={[0, 0.08, -5.8]} material={materials.whiteMarble} receiveShadow>
        <boxGeometry args={[13.6, 0.16, 0.6]} />
      </mesh>
      <mesh position={[0, 0.08, 5.8]} material={materials.whiteMarble} receiveShadow>
        <boxGeometry args={[13.6, 0.16, 0.6]} />
      </mesh>
      <mesh position={[6.6, 0.08, 0]} material={materials.whiteMarble} receiveShadow>
        <boxGeometry args={[0.6, 0.16, 11.6]} />
      </mesh>
      <mesh position={[-6.6, 0.08, -3.5]} material={materials.whiteMarble} receiveShadow>
        <boxGeometry args={[0.6, 0.16, 4.6]} />
      </mesh>
      <mesh position={[-6.6, 0.08, 3.5]} material={materials.whiteMarble} receiveShadow>
        <boxGeometry args={[0.6, 0.16, 4.6]} />
      </mesh>

      {/* 2. Mặt nước Hồ Sen trong biếc */}
      <mesh
        position={[0, 0.03, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={materials.waterPond}
      >
        <planeGeometry args={[13.0, 11.2]} />
      </mesh>

      {/* 3. Lá sen xanh biếc và búp hoa sen hồng */}
      {lotusPads.map((pad, idx) => (
        <group key={`lotus-${idx}`} position={[pad.x, 0.045, pad.z]}>
          <mesh rotation={[-Math.PI / 2, 0, idx * 0.7]} material={materials.foliageGreen}>
            <circleGeometry args={[pad.r, 10]} />
          </mesh>
          {pad.hasFlower && (
            <mesh position={[pad.r * 0.35, 0.06, 0]} material={materials.foliageBlossom}>
              <sphereGeometry args={[0.1, 8, 6]} />
            </mesh>
          )}
        </group>
      ))}

      {/* 4. Lan can đá chạm khắc bảo vệ quanh hồ sen */}
      <mesh position={[0, 0.38, -5.8]} material={materials.whiteMarble}>
        <boxGeometry args={[13.6, 0.44, 0.16]} />
      </mesh>
      <mesh position={[0, 0.38, 5.8]} material={materials.whiteMarble}>
        <boxGeometry args={[13.6, 0.44, 0.16]} />
      </mesh>
      <mesh position={[6.6, 0.38, 0]} material={materials.whiteMarble}>
        <boxGeometry args={[0.16, 0.44, 11.6]} />
      </mesh>
      <mesh position={[-6.6, 0.38, -3.5]} material={materials.whiteMarble}>
        <boxGeometry args={[0.16, 0.44, 4.6]} />
      </mesh>
      <mesh position={[-6.6, 0.38, 3.5]} material={materials.whiteMarble}>
        <boxGeometry args={[0.16, 0.44, 4.6]} />
      </mesh>

      {/* Trụ góc lan can đá */}
      {[
        [-6.6, -5.8],
        [6.6, -5.8],
        [6.6, 5.8],
        [-6.6, 5.8],
        [-6.6, -1.3],
        [-6.6, 1.3],
      ].map(([px, pz], pIdx) => (
        <group key={`post-${pIdx}`} position={[px, 0.35, pz]}>
          <mesh material={materials.whiteMarble}>
            <boxGeometry args={[0.26, 0.7, 0.26]} />
          </mesh>
          <mesh position={[0, 0.42, 0]} material={materials.goldTrim}>
            <sphereGeometry args={[0.1, 8, 8]} />
          </mesh>
        </group>
      ))}

      {/* 5. Cầu Gỗ Đỏ Vòm (Arched Red Bridge) bắc từ bờ Tây sang Thủy Đình trung tâm */}
      <ArchedRedBridge position={[-4.2, 0, 0]} materials={materials} />

      {/* 6. Thủy Đình Lục Giác trung tâm [0, 0, 0] */}
      <mesh position={[0, 0.16, 0]} material={materials.whiteMarble} receiveShadow>
        <cylinderGeometry args={[2.7, 2.9, 0.32, 6]} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI) / 3;
        return (
          <mesh
            key={`nhv-col-${i}`}
            position={[Math.cos(angle) * 2.2, 1.48, Math.sin(angle) * 2.2]}
            material={materials.pillarRed}
            castShadow
          >
            <cylinderGeometry args={[0.12, 0.14, 2.4, 8]} />
          </mesh>
        );
      })}
      <mesh position={[0, 3.1, 0]} material={materials.roofJade} castShadow>
        <coneGeometry args={[3.2, 1.5, 6]} />
      </mesh>
      <mesh position={[0, 3.95, 0]} material={materials.goldTrim}>
        <sphereGeometry args={[0.24, 10, 10]} />
      </mesh>
      <mesh position={[0, 4.2, 0]} material={materials.goldTrim}>
        <coneGeometry args={[0.1, 0.3, 6]} />
      </mesh>

      {/* 7. Hai Cây Hoa Đào Cung Đình tô điểm góc hồ */}
      {[
        [4.8, -4.0],
        [4.8, 4.0],
      ].map(([tx, tz], tIdx) => (
        <group key={`garden-peach-${tIdx}`} position={[tx, 0, tz]}>
          <mesh position={[0, 1.1, 0]} material={materials.treeTrunk} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 2.2, 8]} />
          </mesh>
          <mesh position={[0, 2.6, 0]} material={materials.foliageBlossom} castShadow>
            <sphereGeometry args={[1.5, 12, 10]} />
          </mesh>
          <mesh position={[0.6, 2.2, 0.3]} material={materials.foliageBlossom}>
            <sphereGeometry args={[0.9, 10, 8]} />
          </mesh>
          <mesh position={[-0.5, 2.3, -0.3]} material={materials.foliageBlossom}>
            <sphereGeometry args={[0.95, 10, 8]} />
          </mesh>
        </group>
      ))}

      {/* 8. Đèn Lồng Trụ Đá (Thạch Đăng) đầu lối vào cầu đỏ */}
      {[
        [-5.8, -1.8],
        [-5.8, 1.8],
      ].map(([lx, lz], lIdx) => (
        <group key={`garden-lantern-${lIdx}`} position={[lx, 0, lz]}>
          <mesh position={[0, 0.65, 0]} material={materials.whiteMarble} castShadow>
            <cylinderGeometry args={[0.12, 0.16, 1.3, 8]} />
          </mesh>
          <mesh position={[0, 1.45, 0]} material={materials.lanternGlow}>
            <sphereGeometry args={[0.26, 12, 10]} />
          </mesh>
          <mesh position={[0, 1.78, 0]} material={materials.roofSlate}>
            <coneGeometry args={[0.42, 0.28, 6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/**
 * Component dựng một Tòa Cung Điện Cổ Trang (Đế đá Bạch Ngọc + Tường Đỏ + Hàng Cột + Mái Đao Lưu Ly 1 hoặc 2 tầng)
 */
const PalaceBuildingMesh: React.FC<{
  zone: LandmarkZone;
  materials: Record<string, THREE.Material>;
  onSelect: (id: string) => void;
  onEnterInterior?: () => void;
}> = ({ zone, materials, onSelect, onEnterInterior }) => {
  const [w, h, d] = zone.size;
  const isGate = zone.id === 'cong_chinh';
  const isMainHall = zone.id === 'chinh_dien';
  const hasWalkableInterior = [
    'lai_bo',
    'hinh_bo',
    'han_lam_vien',
    'ngu_thu_phong',
  ].includes(zone.id);

  const playerPos = useGameStore((s) => s.playerPosition);
  const activeInteractableId = useGameplayStore((s) => s.activeInteractableId);
  const currentQuestStep = useGameplayStore((s) => s.currentQuestStep);
  const courtCeremonyStage = useGameplayStore((s) => s.courtCeremonyStage);
  const activeWindow = useUiStore((s) => s.activeWindow);
  const showAssetModal = useGameStore((s) => s.showAssetModal);
  const isAnyModalOpen = Boolean(
    activeInteractableId ||
    activeWindow ||
    showAssetModal ||
    (courtCeremonyStage && courtCeremonyStage !== 'idle')
  );

  const activeQuest = useMemo(
    () => PALACE_QUEST_CHAIN.find((q) => q.stepNumber === currentQuestStep),
    [currentQuestStep]
  );
  const isQuestTargetBuilding = activeQuest?.targetBuildingId === zone.id;

  // Khoảng cách từ người chơi đến công trình
  const distToPlayer = Math.hypot(
    playerPos[0] - zone.position[0],
    playerPos[2] - zone.position[2]
  );

  // Nếu người chơi đang ở bên trong gian nhà có nội thất, ẩn nhãn biển tên bên ngoài
  const isInsideThisBuilding = hasWalkableInterior && distToPlayer <= 7.5;

  // Hiển thị nhãn công trình chỉ khi người chơi lại gần hợp lý, hoặc là công trình mục tiêu nhiệm vụ
  const showBuildingLabel =
    !isAnyModalOpen &&
    !isInsideThisBuilding &&
    (isQuestTargetBuilding
      ? distToPlayer <= 26
      : isMainHall
        ? distToPlayer <= 22
        : distToPlayer <= 16);

  return (
    <group position={zone.position}>
      {/* Bệ đá Bạch Ngọc nâng đỡ tòa điện */}
      {isMainHall ? (
        <group>
          <mesh position={[0, 0.45, 0]} material={materials.whiteMarble} receiveShadow castShadow>
            <boxGeometry args={[w + 2.6, 0.9, d + 2.6]} />
          </mesh>
          <mesh position={[0, 1.1, 0]} material={materials.whiteMarble} receiveShadow castShadow>
            <boxGeometry args={[w + 1.0, 0.6, d + 1.0]} />
          </mesh>
          {/* Thềm Rồng Bậc Tam Cấp & Lan Can Rồng Đá Chính Điện Thái Hòa */}
          {/* 5 bậc đá Bạch Ngọc vững chãi cao từ Y=0 đến Y=1.4, sâu 3.0m (Z = 7.5 đến 10.5) */}
          {[0, 1, 2, 3, 4].map((stepIdx) => {
            const stepYTop = (stepIdx + 1) * 0.28;
            const stepH = (stepIdx + 1) * 0.28;
            const stepYCenter = stepH / 2;
            const stepZCenter = 10.2 - stepIdx * 0.6;
            const stepZFront = 10.5 - stepIdx * 0.6;

            return (
              <group key={`chinh-dien-step-${stepIdx}`}>
                {/* Khối đá Bạch Ngọc toàn bộ bề rộng 12m của bậc thang */}
                <mesh
                  position={[0, stepYCenter, stepZCenter]}
                  material={materials.whiteMarble}
                  receiveShadow
                  castShadow
                >
                  <boxGeometry args={[12.0, stepH, 0.6]} />
                </mesh>

                {/* Thảm đỏ Ngự Đạo phủ trên mặt bậc (rộng 4.0m) */}
                <mesh
                  position={[0, stepYTop + 0.008, stepZCenter]}
                  material={materials.redCarpet}
                  receiveShadow
                >
                  <boxGeometry args={[4.0, 0.016, 0.6]} />
                </mesh>

                {/* Nẹp chỉ viền vàng hai bên thảm đỏ */}
                <mesh
                  position={[-2.0, stepYTop + 0.012, stepZCenter]}
                  material={materials.goldTrim}
                >
                  <boxGeometry args={[0.08, 0.012, 0.6]} />
                </mesh>
                <mesh
                  position={[2.0, stepYTop + 0.012, stepZCenter]}
                  material={materials.goldTrim}
                >
                  <boxGeometry args={[0.08, 0.012, 0.6]} />
                </mesh>

                {/* Thảm đỏ phủ cổ bậc (mặt đứng trước mỗi bậc) */}
                <mesh
                  position={[0, (stepIdx + 0.5) * 0.28, stepZFront + 0.008]}
                  material={materials.redCarpet}
                >
                  <boxGeometry args={[4.0, 0.28, 0.016]} />
                </mesh>
              </group>
            );
          })}

          {/* Thảm đỏ ngự đạo tiếp nối trên mặt sàn thềm trên (từ đầu cầu thang Z=7.5 đến cửa điện Z=5.46) */}
          <mesh
            position={[0, 1.408, 6.48]}
            material={materials.redCarpet}
            receiveShadow
          >
            <boxGeometry args={[4.0, 0.016, 2.04]} />
          </mesh>
          <mesh position={[-2.0, 1.412, 6.48]} material={materials.goldTrim}>
            <boxGeometry args={[0.08, 0.012, 2.04]} />
          </mesh>
          <mesh position={[2.0, 1.412, 6.48]} material={materials.goldTrim}>
            <boxGeometry args={[0.08, 0.012, 2.04]} />
          </mesh>

          {/* 2 Lan can Rồng Đá ở giữa phân chia Ngự Đạo và bậc Quan Viên (X = -2.12 & +2.12) */}
          {[-2.12, 2.12].map((xBal) => (
            <group key={`dragon-rail-${xBal}`}>
              {/* Thân lan can đá dốc nghiêng theo bậc thang */}
              <mesh
                position={[xBal, 1.02, 9.0]}
                rotation={[0.437, 0, 0]}
                material={materials.whiteMarble}
                castShadow
              >
                <boxGeometry args={[0.24, 0.4, 3.32]} />
              </mesh>
              {/* Sống lưng rồng uốn lượn viền vàng */}
              <mesh
                position={[xBal, 1.2, 9.0]}
                rotation={[0.437, 0, 0]}
                material={materials.goldTrim}
              >
                <boxGeometry args={[0.08, 0.08, 3.2]} />
              </mesh>
              {/* Trụ bệ rồng đá ở chân cầu thang (Z = 10.52) */}
              <mesh
                position={[xBal, 0.3, 10.52]}
                material={materials.whiteMarble}
                castShadow
              >
                <boxGeometry args={[0.34, 0.6, 0.34]} />
              </mesh>
              {/* Đầu rồng chạm khắc thếp vàng uy nghiêm chầu ra sân */}
              <mesh
                position={[xBal, 0.68, 10.52]}
                material={materials.goldTrim}
                castShadow
              >
                <boxGeometry args={[0.26, 0.22, 0.3]} />
              </mesh>
              {/* Trụ đỉnh lan can trên thềm điện (Z = 7.48) */}
              <mesh
                position={[xBal, 1.65, 7.48]}
                material={materials.whiteMarble}
                castShadow
              >
                <boxGeometry args={[0.3, 0.5, 0.3]} />
              </mesh>
              <mesh position={[xBal, 1.98, 7.48]} material={materials.goldTrim}>
                <sphereGeometry args={[0.13, 10, 8]} />
              </mesh>
            </group>
          ))}

          {/* 2 Lan can đá Bạch Ngọc ngoài cùng của cầu thang (X = -6.0 & +6.0) */}
          {[-6.0, 6.0].map((xBal) => (
            <group key={`outer-stair-rail-${xBal}`}>
              <mesh
                position={[xBal, 1.02, 9.0]}
                rotation={[0.437, 0, 0]}
                material={materials.whiteMarble}
                castShadow
              >
                <boxGeometry args={[0.22, 0.38, 3.32]} />
              </mesh>
              <mesh
                position={[xBal, 0.3, 10.52]}
                material={materials.whiteMarble}
              >
                <boxGeometry args={[0.3, 0.6, 0.3]} />
              </mesh>
              <mesh
                position={[xBal, 0.66, 10.52]}
                material={materials.whiteMarble}
              >
                <sphereGeometry args={[0.12, 8, 8]} />
              </mesh>
              <mesh
                position={[xBal, 1.65, 7.48]}
                material={materials.whiteMarble}
              >
                <boxGeometry args={[0.3, 0.5, 0.3]} />
              </mesh>
              <mesh
                position={[xBal, 1.98, 7.48]}
                material={materials.whiteMarble}
              >
                <sphereGeometry args={[0.12, 8, 8]} />
              </mesh>
            </group>
          ))}

          {/* Lan can đá Bạch Ngọc mặt tiền hai bên thềm trên (X từ 6.0 đến 11.2) */}
          {[-8.65, 8.65].map((xWing) => (
            <group key={`front-terrace-rail-${xWing}`}>
              <mesh
                position={[xWing, 1.65, 7.48]}
                material={materials.whiteMarble}
                castShadow
              >
                <boxGeometry args={[5.1, 0.5, 0.2]} />
              </mesh>
              <mesh
                position={[xWing < 0 ? -11.2 : 11.2, 1.65, 7.48]}
                material={materials.whiteMarble}
              >
                <boxGeometry args={[0.3, 0.5, 0.3]} />
              </mesh>
              <mesh
                position={[xWing < 0 ? -11.2 : 11.2, 1.98, 7.48]}
                material={materials.whiteMarble}
              >
                <sphereGeometry args={[0.12, 8, 8]} />
              </mesh>
              <mesh
                position={[xWing, 1.98, 7.48]}
                material={materials.whiteMarble}
              >
                <sphereGeometry args={[0.12, 8, 8]} />
              </mesh>
            </group>
          ))}
        </group>
      ) : isGate ? (
        /* Cổng Chính (Ngọ Môn) có vòm cổng ở giữa cho người chơi đi qua */
        <group>
          {/* Hai khối đài thành Đỏ hai bên vòm cổng */}
          <mesh position={[-6.2, 2.4, 0]} material={materials.wallRed} castShadow receiveShadow>
            <boxGeometry args={[7.6, 4.8, d]} />
          </mesh>
          <mesh position={[6.2, 2.4, 0]} material={materials.wallRed} castShadow receiveShadow>
            <boxGeometry args={[7.6, 4.8, d]} />
          </mesh>
          {/* Dầm tường đỏ bắc ngang trên vòm cổng */}
          <mesh position={[0, 4.0, 0]} material={materials.wallRed} castShadow receiveShadow>
            <boxGeometry args={[4.8, 1.6, d]} />
          </mesh>
          {/* Lan can đá trên đài Ngọ Môn */}
          <mesh position={[0, 4.95, 0]} material={materials.whiteMarble}>
            <boxGeometry args={[w + 1.2, 0.35, d + 0.6]} />
          </mesh>
        </group>
      ) : hasWalkableInterior ? (
        /* Các gian nha môn có nội thất đi bộ: sàn ở mức mặt đất Y=0, chỉ thêm thềm đá thấp ngoài cửa */
        <mesh
          position={[
            zone.id === 'lai_bo' || zone.id === 'han_lam_vien'
              ? (w * 0.84) / 2 + 0.5
              : zone.id === 'hinh_bo'
                ? -(w * 0.84) / 2 - 0.5
                : 0,
            0.04,
            zone.id === 'ngu_thu_phong' ? (d * 0.8) / 2 + 0.5 : 0,
          ]}
          material={materials.whiteMarble}
          receiveShadow
        >
          <boxGeometry
            args={[
              zone.id === 'ngu_thu_phong' ? 3.6 : 1.0,
              0.08,
              zone.id === 'ngu_thu_phong' ? 1.0 : 3.6,
            ]}
          />
        </mesh>
      ) : zone.id === 'ngu_hoa_vien' ? null : (
        /* Công trình phụ khác */
        <mesh position={[0, 0.05, 0]} material={materials.whiteMarble} receiveShadow>
          <boxGeometry args={[w + 1.2, 0.1, d + 1.2]} />
        </mesh>
      )}

      {/* =================================================================== */}
      {/* THÂN TÒA ĐIỆN: CÓ KHÔNG GIAN NỘI THẤT 3D CHO 4 NHA MÔN & VƯỜN HOA    */}
      {/* =================================================================== */}
      {zone.id === 'lai_bo' ? (
        <LaiBoInterior materials={materials} />
      ) : zone.id === 'hinh_bo' ? (
        <HinhBoInterior materials={materials} />
      ) : zone.id === 'han_lam_vien' ? (
        <HanLamVienInterior materials={materials} />
      ) : zone.id === 'ngu_thu_phong' ? (
        <NguThuPhongInterior materials={materials} />
      ) : zone.id === 'ngu_hoa_vien' ? (
        <NguHoaVienGarden materials={materials} />
      ) : (
        /* Thân tòa điện ngoài cho Chính Điện & Cổng */
        <group position={[0, isGate ? 4.8 : isMainHall ? 1.4 : 0.9, 0]}>
          <mesh
            position={[0, h * 0.28, 0]}
            material={materials.wallRed}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w * 0.82, h * 0.56, d * 0.78]} />
          </mesh>

          {/* Khung cửa chính thếp vàng */}
          <mesh
            position={[0, h * 0.24, (d * 0.78) / 2 + 0.06]}
            material={materials.goldTrim}
          >
            <boxGeometry args={[w * 0.28, h * 0.44, 0.12]} />
          </mesh>
          <mesh
            position={[0, h * 0.24, (d * 0.78) / 2 + 0.14]}
            material={materials.darkWood}
          >
            <boxGeometry args={[w * 0.24, h * 0.4, 0.08]} />
          </mesh>

          {/* Hàng cột đỏ mặt tiền tòa điện */}
          {[-0.38, -0.19, 0.19, 0.38].map((ratio, idx) => (
            <mesh
              key={`col-${idx}`}
              position={[w * ratio, h * 0.28, d * 0.44]}
              material={materials.pillarRed}
              castShadow
            >
              <cylinderGeometry args={[0.24, 0.26, h * 0.56, 12]} />
            </mesh>
          ))}
        </group>
      )}

      {/* Hệ Thống Mái Cung Đình Cổ Trang (Chỉ dành cho các tòa kiến trúc khép kín, Ngự Hoa Viên dùng Thủy Đình mái ngọc riêng) */}
      {zone.id !== 'ngu_hoa_vien' && (
        <TieredPalaceRoof zone={zone} materials={materials} />
      )}

      {/* Biển Tên Tòa Điện Nổi 3D (Tự ẩn khi mở bảng menu hoặc ở quá xa) */}
      {showBuildingLabel && (
        <Html
          position={[0, zone.labelHeight + (isGate ? 3.8 : zone.id === 'ngu_hoa_vien' ? 0.3 : 1.2), 0]}
          center
          zIndexRange={[10, 0]}
        >
          <div
            className={`map-building-label ${isMainHall ? 'main-hall-badge' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (isMainHall && onEnterInterior) {
                onEnterInterior();
              } else {
                onSelect(zone.id);
              }
            }}
            title={zone.subtitle}
          >
            <span className="map-label-icon">{zone.icon}</span>
            <span className="map-label-text">{zone.name}</span>
            {isMainHall && <span className="map-label-sub">(Vào Điện)</span>}
          </div>
        </Html>
      )}
    </group>
  );
};

/**
 * Lầu Canh Góc Tường Thành (Palace Corner Watchtower / Giác Lâu)
 */
const WatchtowerMesh: React.FC<{
  position: [number, number, number];
  materials: Record<string, THREE.Material>;
}> = ({ position, materials }) => {
  const watchtowerRoofGeom = useMemo(() => {
    return createImperialRoofGeometry(5.2, 5.2, 0.45, 0.45, 1.7, 0.32, -0.08);
  }, []);

  return (
    <group position={position}>
      <mesh position={[0, 2.6, 0]} material={materials.wallRed} castShadow receiveShadow>
        <boxGeometry args={[5.4, 5.2, 5.4]} />
      </mesh>
      <mesh position={[0, 6.2, 0]} material={materials.wallRed} castShadow>
        <boxGeometry args={[3.8, 2.4, 3.8]} />
      </mesh>
      <group position={[0, 7.4, 0]}>
        <mesh
          geometry={watchtowerRoofGeom}
          material={materials.roofSlate}
          castShadow
          receiveShadow
        />
        <mesh position={[0, 1.82, 0]} material={materials.goldTrim}>
          <sphereGeometry args={[0.26, 12, 12]} />
        </mesh>
        <mesh position={[0, 2.05, 0]} material={materials.goldTrim}>
          <coneGeometry args={[0.1, 0.32, 6]} />
        </mesh>
      </group>
    </group>
  );
};

export const ImperialCompoundMap: React.FC = () => {
  const navigateToLandmark = useGameStore((s) => s.navigateToLandmark);
  const setSceneMode = useGameStore((s) => s.setSceneMode);
  const showWireframe = useGameStore((s) => s.showWireframe);

  const materials = useMemo(() => {
    const grass = new THREE.MeshStandardMaterial({
      color: '#5D8A4B',
      roughness: 0.88,
      wireframe: showWireframe,
    });
    const courtyardStone = new THREE.MeshStandardMaterial({
      color: '#D5C7B2',
      roughness: 0.72,
      wireframe: showWireframe,
    });
    const roadStone = new THREE.MeshStandardMaterial({
      color: '#C7B69E',
      roughness: 0.65,
      wireframe: showWireframe,
    });
    const whiteMarble = new THREE.MeshStandardMaterial({
      color: '#ECE5D8',
      roughness: 0.45,
      wireframe: showWireframe,
    });
    const wallRed = new THREE.MeshStandardMaterial({
      color: '#9E2A22',
      roughness: 0.55,
      wireframe: showWireframe,
    });
    const pillarRed = new THREE.MeshStandardMaterial({
      color: '#B5261E',
      roughness: 0.35,
      wireframe: showWireframe,
    });
    const roofGold = new THREE.MeshStandardMaterial({
      color: '#E5A932',
      roughness: 0.28,
      metalness: 0.45,
      wireframe: showWireframe,
    });
    const roofSlate = new THREE.MeshStandardMaterial({
      color: '#3B4856',
      roughness: 0.45,
      metalness: 0.2,
      wireframe: showWireframe,
    });
    const roofJade = new THREE.MeshStandardMaterial({
      color: '#2F6E62',
      roughness: 0.38,
      metalness: 0.2,
      wireframe: showWireframe,
    });
    const goldTrim = new THREE.MeshStandardMaterial({
      color: '#F6CB65',
      roughness: 0.22,
      metalness: 0.72,
      wireframe: showWireframe,
    });
    const redCarpet = new THREE.MeshStandardMaterial({
      color: '#A61919',
      roughness: 0.75,
      wireframe: showWireframe,
    });
    const waterPond = new THREE.MeshStandardMaterial({
      color: '#3E8E8E',
      roughness: 0.15,
      metalness: 0.35,
      wireframe: showWireframe,
    });
    const treeTrunk = new THREE.MeshStandardMaterial({
      color: '#5C3A21',
      roughness: 0.8,
      wireframe: showWireframe,
    });
    const foliageGreen = new THREE.MeshStandardMaterial({
      color: '#467D38',
      roughness: 0.65,
      wireframe: showWireframe,
    });
    const foliageBlossom = new THREE.MeshStandardMaterial({
      color: '#F49DB6',
      roughness: 0.55,
      wireframe: showWireframe,
    });
    const lanternGlow = new THREE.MeshStandardMaterial({
      color: '#FF5722',
      emissive: '#FF8C42',
      emissiveIntensity: 1.1,
      wireframe: showWireframe,
    });
    const darkWood = new THREE.MeshStandardMaterial({
      color: '#472916',
      roughness: 0.55,
      wireframe: showWireframe,
    });
    const mountainRock = new THREE.MeshStandardMaterial({
      color: '#6C7D8C',
      roughness: 0.9,
      wireframe: showWireframe,
    });

    return {
      grass,
      courtyardStone,
      roadStone,
      whiteMarble,
      wallRed,
      pillarRed,
      roofGold,
      roofSlate,
      roofJade,
      goldTrim,
      redCarpet,
      waterPond,
      treeTrunk,
      foliageGreen,
      foliageBlossom,
      lanternGlow,
      darkWood,
      mountainRock,
    };
  }, [showWireframe]);

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [materials]);

  return (
    <group name="ImperialCompoundMap">
      {/* ================================================================= */}
      {/* BẦU TRỜI & ÁNH SÁNG BAN NGÀY ẤM ÁP CỦA QUẦN THỂ HOÀNG CUNG       */}
      {/* ================================================================= */}
      <color attach="background" args={['#C9DFF2']} />
      <fog attach="fog" args={['#D9E4EE', 58, 145]} />

      <ambientLight intensity={0.85} color="#FFF4E0" />
      <hemisphereLight
        color="#FFF5D6"
        groundColor="#5D7A4C"
        intensity={0.9}
        position={[0, 40, 0]}
      />
      <directionalLight
        position={[28, 45, 36]}
        intensity={1.85}
        color="#FFE2B0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
        shadow-camera-near={5}
        shadow-camera-far={130}
        shadow-camera-left={-48}
        shadow-camera-right={48}
        shadow-camera-top={48}
        shadow-camera-bottom={-48}
      />

      {/* ================================================================= */}
      {/* 1. NỀN ĐẤT NGOẠI THÀNH, SÂN ĐÁ HOÀNG CUNG & DÃY NÚI XA           */}
      {/* ================================================================= */}
      {/* Thảo nguyên xanh bao quanh ngoại thành */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.08, 0]}
        receiveShadow
        material={materials.grass}
      >
        <planeGeometry args={[220, 220]} />
      </mesh>

      {/* Nền đá cẩm thạch toàn bộ Nội Thành Hoàng Cung */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -2]}
        receiveShadow
        material={materials.courtyardStone}
      >
        <planeGeometry args={[84, 82]} />
      </mesh>

      {/* Trục Thần Đạo trung tâm từ ngoại môn xuyên qua Cổng Chính tới Chính Điện */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 22]}
        receiveShadow
        material={materials.roadStone}
      >
        <planeGeometry args={[11, 56]} />
      </mesh>

      {/* Thảm Đỏ Ngự Đạo ngoài trời (Tại Cổng Chính & Sân trước Chính Điện) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.04, 41.5]}
        receiveShadow
        material={materials.redCarpet}
      >
        <planeGeometry args={[3.8, 16]} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.04, 8.5]}
        receiveShadow
        material={materials.redCarpet}
      >
        <planeGeometry args={[4.2, 8]} />
      </mesh>

      {/* Dãy núi non trùng điệp phía Bắc hậu cảnh (Giống ảnh mẫu) */}
      {[
        [-48, 0, -68, 22, 24],
        [-22, 0, -72, 26, 30],
        [4, 0, -75, 28, 34],
        [28, 0, -70, 24, 28],
        [52, 0, -66, 20, 22],
      ].map(([mx, my, mz, mr, mh], idx) => (
        <mesh
          key={`mountain-${idx}`}
          position={[mx, my + mh / 2 - 2, mz]}
          material={materials.mountainRock}
        >
          <coneGeometry args={[mr, mh, 7]} />
        </mesh>
      ))}

      {/* ================================================================= */}
      {/* 2. HỒ SEN KIM THỦY, CẦU VỒNG GỖ ĐỎ & THỦY ĐÌNH LỤC GIÁC          */}
      {/* ================================================================= */}
      {/* Hồ nước bên Tây (Cạnh Hàn Lâm Viện) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-13.5, 0.03, 18.5]}
        material={materials.waterPond}
      >
        <planeGeometry args={[12.5, 13.5]} />
      </mesh>
      <ArchedRedBridge
        position={[-13.5, 0, 18.5]}
        rotationY={0}
        materials={materials}
      />
      <HexagonalPavilion position={[-11.5, 0, 12.2]} materials={materials} />
      <HexagonalPavilion position={[-11.5, 0, 24.5]} materials={materials} />

      {/* Hai hồ tiểu cảnh đối xứng trước Lại Bộ & Hình Bộ */}
      {[-11.2, 11.2].map((xPool, idx) => (
        <group key={`courtyard-pool-${idx}`} position={[xPool, 0.03, 4.5]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.waterPond}>
            <planeGeometry args={[6.2, 5.2]} />
          </mesh>
          <mesh position={[0, 0.18, 0]} material={materials.whiteMarble}>
            <boxGeometry args={[6.6, 0.32, 5.6]} />
          </mesh>
          <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.waterPond}>
            <planeGeometry args={[5.8, 4.8]} />
          </mesh>
        </group>
      ))}

      {/* Bàn đọc sách ngoài trời tại sân Hàn Lâm Viện */}
      {[-29, -25, -21].map((xDesk, idx) => (
        <group key={`scholar-desk-${idx}`} position={[xDesk, 0.45, 26.5]}>
          <mesh material={materials.darkWood} castShadow>
            <boxGeometry args={[1.6, 0.7, 1.0]} />
          </mesh>
          <mesh position={[0, 0.4, 0]} material={materials.roofGold}>
            <boxGeometry args={[0.6, 0.08, 0.45]} />
          </mesh>
        </group>
      ))}

      {/* ================================================================= */}
      {/* 3. TƯỜNG THÀNH ĐỎ BAO QUANH & HỆ THỐNG LẦU CANH (WATCHTOWERS)     */}
      {/* ================================================================= */}
      {/* Tường Bắc */}
      <mesh position={[0, 2.2, -42]} material={materials.wallRed} castShadow receiveShadow>
        <boxGeometry args={[84, 4.4, 1.6]} />
      </mesh>
      {/* Tường Tây */}
      <mesh position={[-42, 2.2, -2]} material={materials.wallRed} castShadow receiveShadow>
        <boxGeometry args={[1.6, 4.4, 80]} />
      </mesh>
      {/* Tường Đông */}
      <mesh position={[42, 2.2, -2]} material={materials.wallRed} castShadow receiveShadow>
        <boxGeometry args={[1.6, 4.4, 80]} />
      </mesh>
      {/* Tường Nam (Hai cánh nối vào Cổng Chính) */}
      <mesh position={[-25.5, 2.2, 38]} material={materials.wallRed} castShadow receiveShadow>
        <boxGeometry args={[33, 4.4, 1.6]} />
      </mesh>
      <mesh position={[25.5, 2.2, 38]} material={materials.wallRed} castShadow receiveShadow>
        <boxGeometry args={[33, 4.4, 1.6]} />
      </mesh>

      {/* Các Lầu Canh (Giác Lâu / Vọng Lâu) trên tường thành */}
      {[
        [-42, 0, 38],
        [42, 0, 38],
        [-10.5, 0, 38],
        [10.5, 0, 38],
        [-42, 0, 12],
        [42, 0, 12],
        [-42, 0, -16],
        [42, 0, -16],
        [-42, 0, -42],
        [42, 0, -42],
        [-16, 0, -42],
        [16, 0, -42],
      ].map((pos, idx) => (
        <WatchtowerMesh
          key={`watchtower-${idx}`}
          position={pos as [number, number, number]}
          materials={materials}
        />
      ))}

      {/* ================================================================= */}
      {/* 4. 7 CUNG ĐIỆN CHÍNH CÓ NHÃN TƯƠNG TÁC (CHÍNH ĐIỆN, LẠI BỘ...)    */}
      {/* ================================================================= */}
      {PALACE_LANDMARKS.map((zone) => (
        <PalaceBuildingMesh
          key={zone.id}
          zone={zone}
          materials={materials}
          onSelect={(id) => {
            const prevLandmark = useGameStore.getState().activeLandmarkId;
            navigateToLandmark(id);
            if (prevLandmark === id) {
              useGameplayStore.getState().openBuildingModal(id);
            }
          }}
          onEnterInterior={
            zone.id === 'chinh_dien'
              ? () => setSceneMode('main_hall_interior')
              : undefined
          }
        />
      ))}

      {/* ================================================================= */}
      {/* 5. RỪNG ĐÀO NỞ HỒNG, CÂY TÙNG BÁCH & ĐÈN LỒNG TRỤ ĐÁ             */}
      {/* ================================================================= */}
      {COMPOUND_TREES.map((tree, idx) => (
        <group
          key={`tree-${idx}`}
          position={tree.pos}
          scale={[tree.scale, tree.scale, tree.scale]}
        >
          <mesh position={[0, 1.1, 0]} material={materials.treeTrunk} castShadow>
            <cylinderGeometry args={[0.22, 0.34, 2.2, 8]} />
          </mesh>
          <mesh
            position={[0, 2.6, 0]}
            material={
              tree.type === 'blossom'
                ? materials.foliageBlossom
                : materials.foliageGreen
            }
            castShadow
          >
            <sphereGeometry args={[1.45, 12, 10]} />
          </mesh>
          <mesh
            position={[0.7, 2.2, 0.4]}
            material={
              tree.type === 'blossom'
                ? materials.foliageBlossom
                : materials.foliageGreen
            }
          >
            <sphereGeometry args={[0.95, 10, 8]} />
          </mesh>
          <mesh
            position={[-0.65, 2.3, -0.35]}
            material={
              tree.type === 'blossom'
                ? materials.foliageBlossom
                : materials.foliageGreen
            }
          >
            <sphereGeometry args={[1.0, 10, 8]} />
          </mesh>
        </group>
      ))}

      {/* Đèn lồng trụ đá dọc theo trục thần đạo */}
      {COMPOUND_STREET_LANTERNS.map(([lx, ly, lz], idx) => (
        <group key={`street-lantern-${idx}`} position={[lx, ly, lz]}>
          <mesh position={[0, 1.2, 0]} material={materials.darkWood} castShadow>
            <cylinderGeometry args={[0.1, 0.14, 2.4, 8]} />
          </mesh>
          <mesh position={[0, 2.55, 0]} material={materials.lanternGlow}>
            <sphereGeometry args={[0.34, 12, 10]} />
          </mesh>
          <mesh position={[0, 2.95, 0]} material={materials.roofSlate}>
            <coneGeometry args={[0.48, 0.32, 6]} />
          </mesh>
        </group>
      ))}

      {/* ================================================================= */}
      {/* 6. HỆ THỐNG NPC CUNG ĐÌNH SỐNG ĐỘNG (TUẦN TRA, THÁI GIÁM, ĐÀM ĐẠO) */}
      {/* ================================================================= */}
      <LivingPalaceNpcs />
    </group>
  );
};
