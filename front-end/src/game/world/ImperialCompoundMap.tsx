import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import {
  COMPOUND_NPC_POSITIONS,
  COMPOUND_STREET_LANTERNS,
  COMPOUND_TREES,
  LandmarkZone,
  PALACE_LANDMARKS,
} from './compoundLayout';
import { Player } from '../characters/Player';
import { useGameStore } from '../../stores/useGameStore';
import { useGameplayStore } from '../../stores/useGameplayStore';

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
  const roofMat =
    zone.roofStyle === 'gold'
      ? materials.roofGold
      : zone.roofStyle === 'slate'
        ? materials.roofSlate
        : materials.roofJade;

  const isGate = zone.id === 'cong_chinh';
  const isMainHall = zone.id === 'chinh_dien';

  return (
    <group position={zone.position}>
      {/* Bệ đá Bạch Ngọc nâng đỡ tòa điện */}
      {!isGate ? (
        <group>
          <mesh position={[0, 0.45, 0]} material={materials.whiteMarble} receiveShadow castShadow>
            <boxGeometry args={[w + 2.6, 0.9, d + 2.6]} />
          </mesh>
          {isMainHall && (
            <mesh position={[0, 1.1, 0]} material={materials.whiteMarble} receiveShadow castShadow>
              <boxGeometry args={[w + 1.0, 0.6, d + 1.0]} />
            </mesh>
          )}
          {/* Bậc thang đá & Thảm đỏ trước sảnh điện */}
          <mesh
            position={[0, isMainHall ? 0.72 : 0.45, d / 2 + 1.6]}
            rotation={[-0.45, 0, 0]}
            material={isMainHall ? materials.redCarpet : materials.whiteMarble}
            receiveShadow
          >
            <boxGeometry args={[isMainHall ? 4.6 : 3.2, 0.3, 2.4]} />
          </mesh>
        </group>
      ) : (
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
      )}

      {/* Thân tòa điện (Tường gỗ đỏ + Cửa bức bàn + Hàng cột hiên) */}
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

        {/* Mái Đao Tầng 1 (Eave Tier 1) */}
        <group position={[0, h * 0.58, 0]}>
          {/* Diềm mái cong */}
          <mesh material={roofMat} castShadow receiveShadow>
            <boxGeometry args={[w + 1.8, 0.42, d + 1.8]} />
          </mesh>
          {/* Khối mái dốc 4 chiều (Hip Roof) */}
          <mesh
            position={[0, 1.15, 0]}
            rotation={[0, Math.PI / 4, 0]}
            scale={[w * 0.78, 1.9, d * 0.78]}
            material={roofMat}
            castShadow
          >
            <coneGeometry args={[1, 1, 4]} />
          </mesh>
          {/* Sống nóc thếp vàng */}
          <mesh position={[0, 1.95, 0]} material={materials.goldTrim}>
            <boxGeometry args={[w * 0.58, 0.28, 0.32]} />
          </mesh>
        </group>

        {/* Mái Đao Tầng 2 (Trùng Diêm cho Chính Điện, Ngự Thư Phòng & Cổng Chính) */}
        {zone.tiers === 2 && (
          <group position={[0, h * 0.82, 0]}>
            <mesh position={[0, -0.3, 0]} material={materials.wallRed} castShadow>
              <boxGeometry args={[w * 0.62, 1.2, d * 0.58]} />
            </mesh>
            <mesh material={roofMat} castShadow>
              <boxGeometry args={[w * 0.82, 0.38, d * 0.82]} />
            </mesh>
            <mesh
              position={[0, 1.05, 0]}
              rotation={[0, Math.PI / 4, 0]}
              scale={[w * 0.6, 1.75, d * 0.6]}
              material={roofMat}
              castShadow
            >
              <coneGeometry args={[1, 1, 4]} />
            </mesh>
            {/* Đỉnh bờ nóc & Kìm nóc Rồng Vàng (Chiwen) */}
            <mesh position={[0, 1.85, 0]} material={materials.goldTrim}>
              <boxGeometry args={[w * 0.44, 0.32, 0.32]} />
            </mesh>
            {[-w * 0.22, w * 0.22].map((xFin, fIdx) => (
              <mesh
                key={`finial-${fIdx}`}
                position={[xFin, 2.08, 0]}
                material={materials.goldTrim}
              >
                <boxGeometry args={[0.35, 0.45, 0.35]} />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* Biển Tên Tòa Điện Nổi 3D (Giống hệt phong cách thẻ bài trong ảnh mẫu) */}
      <Html
        position={[0, zone.labelHeight + (isGate ? 3.8 : 1.2), 0]}
        center
        distanceFactor={48}
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
    </group>
  );
};

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
      <mesh position={[0, 0.45, 0]} material={materials.pillarRed} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.28, 2.1]} />
      </mesh>
      {[-0.92, 0.92].map((zRail, idx) => (
        <mesh
          key={`bridge-rail-${idx}`}
          position={[0, 0.85, zRail]}
          material={materials.pillarRed}
          castShadow
        >
          <boxGeometry args={[4.4, 0.55, 0.14]} />
        </mesh>
      ))}
      {[-2.1, 0, 2.1].map((xPost) =>
        [-0.92, 0.92].map((zRail) => (
          <mesh
            key={`bpost-${xPost}-${zRail}`}
            position={[xPost, 1.22, zRail]}
            material={materials.goldTrim}
          >
            <sphereGeometry args={[0.12, 8, 8]} />
          </mesh>
        ))
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
  return (
    <group position={position}>
      <mesh position={[0, 2.6, 0]} material={materials.wallRed} castShadow receiveShadow>
        <boxGeometry args={[5.4, 5.2, 5.4]} />
      </mesh>
      <mesh position={[0, 6.2, 0]} material={materials.wallRed} castShadow>
        <boxGeometry args={[3.8, 2.4, 3.8]} />
      </mesh>
      <mesh
        position={[0, 8.1, 0]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[3.8, 1.8, 3.8]}
        material={materials.roofSlate}
        castShadow
      >
        <coneGeometry args={[1, 1, 4]} />
      </mesh>
      <mesh position={[0, 9.1, 0]} material={materials.goldTrim}>
        <sphereGeometry args={[0.24, 10, 10]} />
      </mesh>
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
        position={[0, 0.04, 5.5]}
        receiveShadow
        material={materials.redCarpet}
      >
        <planeGeometry args={[4.2, 10]} />
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

      {/* Hồ Sen Ngự Hoa Viên bên Đông */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[14.5, 0.03, 20.5]}
        material={materials.waterPond}
      >
        <planeGeometry args={[14.5, 16.5]} />
      </mesh>
      <ArchedRedBridge
        position={[14.5, 0, 18.5]}
        rotationY={0}
        materials={materials}
      />
      <HexagonalPavilion position={[11.5, 0, 12.2]} materials={materials} />
      <HexagonalPavilion position={[21.5, 0, 23.5]} materials={materials} />

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
      {/* 6. CÁC QUAN VIÊN & THỊ VỆ CHIBI ĐỨNG CHẦU TRÊN SÂN RỒNG           */}
      {/* ================================================================= */}
      {COMPOUND_NPC_POSITIONS.map((npc, idx) => (
        <group
          key={`compound-npc-${idx}`}
          position={npc.pos}
          rotation={[0, npc.rotY, 0]}
        >
          <Player rank={npc.rank} animationState="idle" />
        </group>
      ))}
    </group>
  );
};
