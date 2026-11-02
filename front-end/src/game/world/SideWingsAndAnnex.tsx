import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { createPalaceMaterialSet } from '../assets/PalaceMaterials';
import { useGameStore } from '../../stores/useGameStore';
import { Player } from '../characters/Player';

/**
 * Các Gian Phụ kết nối trực tiếp với Thái Hòa Điện (Phong cách Cung đình Triều Nguyễn – Huế):
 * 1. Hành Lang Đông & Tây (Đông – Tây Trường Lang): X = ±16m -> ±20.6m, Z = -18m -> +18m
 * 2. Gian Chờ Quan Viên (Tả Vu – Tây Phối Điện): X = -20.6m -> -31.0m, Z = -10.5m -> +10.5m
 * 3. Phòng Phụ Tiếp Khách (Hữu Vu – Đông Phối Điện): X = +20.6m -> +31.0m, Z = -10.5m -> +10.5m
 * 4. Lối Ra Phía Sau & Hậu Sảnh (Hậu Đường Bắc): Z = -22.0m -> -34.0m, X = -14.5m -> +14.5m
 *
 * Tất cả đều có cửa gỗ cung đình mở thông và nhân vật có thể đi bộ vào trực tiếp.
 */
export const SideWingsAndAnnex: React.FC = () => {
  const showWireframe = useGameStore((s) => s.showWireframe);
  const materials = useMemo(() => createPalaceMaterialSet(showWireframe), [showWireframe]);

  // LatheGeometry cho Bình sứ Pháp Lam Huế & Ấm trà cung đình
  const customGeos = useMemo(() => {
    const vaseProfile = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.24, 0.0),
      new THREE.Vector2(0.2, 0.16),
      new THREE.Vector2(0.38, 0.56),
      new THREE.Vector2(0.32, 0.92),
      new THREE.Vector2(0.15, 1.18),
      new THREE.Vector2(0.24, 1.38),
    ];
    const vaseGeo = new THREE.LatheGeometry(vaseProfile, 16);

    const teapotProfile = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.09, 0.0),
      new THREE.Vector2(0.13, 0.08),
      new THREE.Vector2(0.11, 0.16),
      new THREE.Vector2(0.05, 0.2),
      new THREE.Vector2(0.0, 0.22),
    ];
    const teapotGeo = new THREE.LatheGeometry(teapotProfile, 12);

    return {
      vaseGeo,
      teapotGeo,
      dispose: () => {
        vaseGeo.dispose();
        teapotGeo.dispose();
      },
    };
  }, []);

  useEffect(() => {
    return () => {
      materials.dispose();
      customGeos.dispose();
    };
  }, [materials, customGeos]);

  // Hàm dựng bức tường có 2 cửa mở thông tại Z = -5.0m và Z = +5.0m (dùng cho vách ngăn giữa Hành Lang và Phòng Phụ)
  const renderPartitionWallWithDoors = (xPos: number, inwardSign: number) => {
    // Tổng chiều dài phòng Z từ -10.5 đến +10.5 (21m), chừa 2 cửa rộng 3.2m tại Z = -5.0 và Z = +5.0:
    // Đoạn 1: Z từ -10.5 đến -6.6 (dài 3.9, tâm -8.55)
    // Đoạn 2: Z từ -3.4 đến +3.4 (dài 6.8, tâm 0.0)
    // Đoạn 3: Z từ +6.6 đến +10.5 (dài 3.9, tâm +8.55)
    const segments = [
      { centerZ: -8.55, len: 3.9 },
      { centerZ: 0.0, len: 6.8 },
      { centerZ: 8.55, len: 3.9 },
    ];

    return (
      <group position={[xPos, 0, 0]}>
        {segments.map((seg, idx) => (
          <mesh
            key={`part-seg-${idx}`}
            position={[0, 2.1, seg.centerZ]}
            material={materials.carvedWallPanel}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[0.45, 4.2, seg.len]} />
          </mesh>
        ))}
        {/* Tường trên và Liên ba Nhất Thi Nhất Họa */}
        <mesh position={[0, 6.1, 0]} material={materials.creamWall}>
          <boxGeometry args={[0.4, 3.8, 21]} />
        </mesh>
        <mesh position={[inwardSign * 0.1, 7.6, 0]} material={materials.nhatThiNhatHoa}>
          <boxGeometry args={[0.48, 0.85, 21]} />
        </mesh>

        {/* Khung cửa gỗ cung đình tại Z = -5.0m và Z = +5.0m */}
        {[-5.0, 5.0].map((zDoor) => (
          <group key={`part-door-${zDoor}`} position={[0, 0, zDoor]}>
            <mesh position={[0, 2.15, -1.65]} material={materials.redPillar} castShadow>
              <boxGeometry args={[0.55, 4.3, 0.24]} />
            </mesh>
            <mesh position={[0, 2.15, 1.65]} material={materials.redPillar} castShadow>
              <boxGeometry args={[0.55, 4.3, 0.24]} />
            </mesh>
            <mesh position={[0, 4.2, 0]} material={materials.warmGold}>
              <boxGeometry args={[0.62, 0.32, 3.6]} />
            </mesh>
          </group>
        ))}
      </group>
    );
  };

  return (
    <group name="SideWingsAndAnnexGroup">
      {/* ================================================================= */}
      {/* 1. HÀNH LANG HAI BÊN (ĐÔNG – TÂY TRƯỜNG LANG: X = ±16m -> ±20.6m) */}
      {/* ================================================================= */}
      {[-1, 1].map((sideSign) => {
        const corridorCenterX = sideSign * 18.3;
        const outerEdgeX = sideSign * 20.4;

        return (
          <group key={`corridor-${sideSign}`} name={`Corridor_${sideSign < 0 ? 'West' : 'East'}`}>
            {/* Sàn gỗ hành lang chạy dọc hông Đại Điện (Z từ -18 đến +18) */}
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[corridorCenterX, 0.005, 0]}
              receiveShadow
              material={materials.woodFloor}
            >
              <planeGeometry args={[4.8, 36]} />
            </mesh>

            {/* Thảm dẫn lối ngang từ cửa Đại Điện (Z = ±5.0) băng qua Hành Lang vào Phòng Phụ */}
            {[-5.0, 5.0].map((zPath) => (
              <mesh
                key={`corridor-carpet-${zPath}`}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[corridorCenterX, 0.016, zPath]}
                receiveShadow
                material={materials.redCarpet}
              >
                <planeGeometry args={[4.6, 2.4]} />
              </mesh>
            ))}

            {/* Trần gỗ & Dầm vì kèo hành lang */}
            <mesh
              rotation={[Math.PI / 2, 0, 0]}
              position={[corridorCenterX, 8.2, 0]}
              material={materials.cofferedCeiling}
            >
              <planeGeometry args={[4.8, 36]} />
            </mesh>

            {/* Hàng cột gỗ đỏ dọc hành lang & Đèn lồng treo */}
            {[-16.5, -11.5, -7.2, -2.8, 2.8, 7.2, 11.5, 16.5].map((zCol, cIdx) => (
              <group key={`corridor-col-${cIdx}`} position={[outerEdgeX, 0, zCol]}>
                <mesh position={[0, 4.1, 0]} material={materials.redPillar} castShadow>
                  <cylinderGeometry args={[0.26, 0.28, 8.2, 14]} />
                </mesh>
                <mesh position={[0, 0.2, 0]} material={materials.stoneBase}>
                  <cylinderGeometry args={[0.36, 0.42, 0.4, 12]} />
                </mesh>
                {/* Xà ngang nối từ cột hành lang vào tường Đại Điện */}
                <mesh
                  position={[-sideSign * 2.1, 7.85, 0]}
                  material={materials.paintedBeam}
                >
                  <boxGeometry args={[4.4, 0.35, 0.32]} />
                </mesh>
              </group>
            ))}

            {/* Lan can con tiện gỗ ở hai đoạn đầu Bắc & Nam hành lang (Z < -10.5 và Z > +10.5) */}
            {[-14.25, 14.25].map((zRail) => (
              <group key={`corridor-rail-${zRail}`} position={[outerEdgeX, 0.55, zRail]}>
                <mesh material={materials.darkWood} castShadow>
                  <boxGeometry args={[0.22, 1.1, 7.5]} />
                </mesh>
                <mesh position={[0, 0.58, 0]} material={materials.warmGold}>
                  <boxGeometry args={[0.28, 0.1, 7.6]} />
                </mesh>
              </group>
            ))}

            {/* Tường chắn hai đầu Bắc/Nam của hành lang (Z = ±18m) */}
            {[-18, 18].map((zEnd) => (
              <mesh
                key={`corridor-end-${zEnd}`}
                position={[corridorCenterX, 4.1, zEnd]}
                material={materials.carvedWallPanel}
              >
                <boxGeometry args={[4.8, 8.2, 0.45]} />
              </mesh>
            ))}

            {/* Đèn lồng cung đình Huế treo dọc hành lang */}
            {[-13.5, -5.0, 0.0, 5.0, 13.5].map((zLantern, lIdx) => (
              <group
                key={`corridor-lantern-${lIdx}`}
                position={[corridorCenterX, 6.5, zLantern]}
              >
                <mesh position={[0, 0.8, 0]} material={materials.darkWood}>
                  <cylinderGeometry args={[0.02, 0.02, 1.6, 6]} />
                </mesh>
                <mesh material={materials.lanternSilk}>
                  <sphereGeometry args={[0.34, 12, 10]} />
                </mesh>
                <mesh position={[0, 0.36, 0]} material={materials.warmGold}>
                  <cylinderGeometry args={[0.2, 0.24, 0.14, 10]} />
                </mesh>
              </group>
            ))}
          </group>
        );
      })}

      {/* Ánh sáng ấm chiếu sáng cho Gian Chờ Quan Viên, Phòng Tiếp Khách & Hậu Điện */}
      <pointLight position={[-25.5, 5.8, 0]} intensity={16} distance={22} decay={1.7} color="#FFB866" />
      <pointLight position={[25.5, 5.8, 0]} intensity={16} distance={22} decay={1.7} color="#FFB866" />
      <pointLight position={[0, 5.8, -28]} intensity={18} distance={24} decay={1.7} color="#FFC278" />

      {/* ================================================================= */}
      {/* 2. GIAN CHỜ QUAN VIÊN (TẢ VU – TÂY PHỐI ĐIỆN: X = -20.6 -> -31.0) */}
      {/* ================================================================= */}
      <group name="OfficialWaitingRoom_West">
        {/* Vách ngăn có 2 cửa thông với Hành Lang Tây tại X = -20.6m */}
        {renderPartitionWallWithDoors(-20.6, -1)}

        {/* Sàn gỗ & Thảm lót Gian Chờ Quan Viên */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-25.8, 0.008, 0]}
          receiveShadow
          material={materials.woodFloor}
        >
          <planeGeometry args={[10.4, 21.0]} />
        </mesh>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-25.8, 0.018, 0]}
          receiveShadow
          material={materials.redCarpet}
        >
          <planeGeometry args={[6.4, 15.6]} />
        </mesh>

        {/* Trần tảo tỉnh & Hệ xà ngang Gian Chờ */}
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[-25.8, 8.2, 0]}
          material={materials.cofferedCeiling}
        >
          <planeGeometry args={[10.4, 21.0]} />
        </mesh>

        {/* Tường bao phía Tây (X = -31.0m) kèm cửa sổ song hoa & Hoành phi "TẢ VU TRIỀU ĐƯỜNG" */}
        <group position={[-31.0, 0, 0]}>
          <mesh position={[0, 2.0, 0]} material={materials.carvedWallPanel} receiveShadow>
            <boxGeometry args={[0.5, 4.0, 21.0]} />
          </mesh>
          <mesh position={[0, 6.1, 0]} material={materials.creamWall}>
            <boxGeometry args={[0.45, 4.2, 21.0]} />
          </mesh>
          {[-5.5, 5.5].map((zWin) => (
            <mesh
              key={`west-room-win-${zWin}`}
              position={[0.28, 5.2, zWin]}
              rotation={[0, Math.PI / 2, 0]}
              material={materials.latticeWindow}
            >
              <planeGeometry args={[4.2, 2.8]} />
            </mesh>
          ))}
          {/* Hoành phi chính giữa vách Tây */}
          <mesh position={[0.32, 5.6, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.imperialPlaque}>
            <boxGeometry args={[4.4, 1.25, 0.16]} />
          </mesh>
        </group>

        {/* Tường Bắc & Nam của Gian Chờ (Z = ±10.5m) */}
        {[-10.5, 10.5].map((zWall) => (
          <mesh
            key={`west-room-end-${zWall}`}
            position={[-25.8, 4.1, zWall]}
            material={materials.carvedWallPanel}
            receiveShadow
          >
            <boxGeometry args={[10.4, 8.2, 0.5]} />
          </mesh>
        ))}

        {/* NỘI THẤT GIAN CHỜ 1: Án Thư Soạn Tấu Chương & Bình Phong Tứ Quý sát vách Tây */}
        <group position={[-28.8, 0, 0]}>
          {/* Bình phong gỗ chạm */}
          <mesh position={[-1.1, 1.9, 0]} material={materials.dragonScreen} castShadow>
            <boxGeometry args={[0.18, 3.8, 3.6]} />
          </mesh>
          {/* Án thư gỗ lim sơn son thếp vàng */}
          <mesh position={[0, 0.78, 0]} material={materials.darkWood} castShadow>
            <boxGeometry args={[1.2, 0.14, 2.4]} />
          </mesh>
          <mesh position={[0, 0.38, 0]} material={materials.mediumWood} castShadow>
            <boxGeometry args={[1.0, 0.68, 2.1]} />
          </mesh>
          {/* Văn phòng tứ bảo: Nghiên mực, Giá bút lông, Tấu chương, Bình hoa Pháp Lam */}
          <mesh position={[0.1, 0.9, -0.35]} rotation={[0, 0, Math.PI / 2]} material={materials.warmGold}>
            <cylinderGeometry args={[0.06, 0.06, 0.6, 10]} />
          </mesh>
          <mesh position={[0.1, 0.88, 0.25]} material={materials.darkWood}>
            <boxGeometry args={[0.25, 0.05, 0.34]} />
          </mesh>
          <mesh position={[-0.2, 1.0, 0.25]} material={materials.warmGold}>
            <boxGeometry args={[0.08, 0.24, 0.28]} />
          </mesh>
          <mesh
            position={[-0.2, 0.85, -0.75]}
            scale={[0.45, 0.45, 0.45]}
            geometry={customGeos.vaseGeo}
            material={materials.porcelainVase}
          />
        </group>

        {/* NỘI THẤT GIAN CHỜ 2: 2 Bộ Trường Kỷ & Bàn Trà Quan Viên Đàm Đạo (Z = -3.8m và Z = +3.8m) */}
        {[-3.8, 3.8].map((zSet, idx) => (
          <group key={`waiting-tea-set-${idx}`} position={[-25.2, 0, zSet]}>
            {/* Bàn trà gỗ gụ ở giữa */}
            <mesh position={[0, 0.62, 0]} material={materials.darkWood} castShadow>
              <boxGeometry args={[1.8, 0.1, 1.0]} />
            </mesh>
            <mesh position={[0, 0.3, 0]} material={materials.mediumWood} castShadow>
              <boxGeometry args={[1.5, 0.54, 0.8]} />
            </mesh>
            {/* Ấm trà & chén ngọc trên bàn */}
            <mesh
              position={[0, 0.68, 0]}
              geometry={customGeos.teapotGeo}
              material={materials.mutedJade}
            />
            {[-0.35, 0.35].map((xCup) => (
              <mesh
                key={`cup-${xCup}`}
                position={[xCup, 0.71, 0.15]}
                material={materials.porcelainVase}
              >
                <cylinderGeometry args={[0.05, 0.04, 0.07, 10]} />
              </mesh>
            ))}

            {/* 2 Ghế Trường Kỷ đối diện nhau qua bàn trà (Có thể ngồi bằng phím F/E) */}
            {[-1.15, 1.15].map((zBench) => (
              <group key={`bench-${zBench}`} position={[0, 0, zBench]}>
                <mesh position={[0, 0.45, 0]} material={materials.darkWood} castShadow>
                  <boxGeometry args={[1.85, 0.12, 0.72]} />
                </mesh>
                <mesh position={[0, 0.53, 0]} material={materials.cushionBrocade}>
                  <boxGeometry args={[1.7, 0.06, 0.6]} />
                </mesh>
                <mesh
                  position={[0, 0.92, zBench < 0 ? -0.32 : 0.32]}
                  material={materials.darkWood}
                  castShadow
                >
                  <boxGeometry args={[1.85, 0.85, 0.1]} />
                </mesh>
              </group>
            ))}
          </group>
        ))}

        {/* NỘI THẤT GIAN CHỜ 3: Tủ Điển Tịch & Giá Treo Mũ Quan sát vách Bắc & Nam */}
        {[-9.4, 9.4].map((zShelf, idx) => (
          <group key={`Archive-shelf-${idx}`} position={[-25.8, 0, zShelf]}>
            <mesh position={[0, 1.6, 0]} material={materials.darkWood} castShadow>
              <boxGeometry args={[4.2, 3.2, 0.75]} />
            </mesh>
            {[0.8, 1.6, 2.4].map((yTier) => (
              <mesh
                key={`scroll-row-${yTier}`}
                position={[0, yTier, zShelf < 0 ? 0.38 : -0.38]}
                material={materials.warmGold}
              >
                <boxGeometry args={[3.6, 0.18, 0.12]} />
              </mesh>
            ))}
          </group>
        ))}

        {/* NPC Quan Văn & Quan Võ đang đứng chờ thiết triều trong Tả Vu */}
        <group position={[-27.2, 0, -1.6]} rotation={[0, Math.PI / 3, 0]}>
          <Player rank="mid_official" animationState="idle" />
        </group>
        <group position={[-27.2, 0, 1.6]} rotation={[0, (Math.PI * 2) / 3, 0]}>
          <Player rank="minister" animationState="idle" />
        </group>

        {/* Nhãn tên nổi 3D trong Gian Chờ Quan Viên */}
        <Html position={[-25.8, 4.8, 0]} center distanceFactor={24} zIndexRange={[10, 0]}>
          <div className="map-building-label">
            <span className="map-label-icon">👥</span>
            <span className="map-label-text">Tả Vu – Gian Chờ Quan Viên</span>
          </div>
        </Html>
      </group>

      {/* ================================================================= */}
      {/* 3. PHÒNG PHỤ TIẾP KHÁCH (HỮU VU – ĐÔNG PHỐI ĐIỆN: X = +20.6 -> +31.0) */}
      {/* ================================================================= */}
      <group name="RoyalReceptionRoom_East">
        {/* Vách ngăn có 2 cửa thông với Hành Lang Đông tại X = +20.6m */}
        {renderPartitionWallWithDoors(20.6, 1)}

        {/* Sàn gỗ & Thảm gấm Phòng Tiếp Khách */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[25.8, 0.008, 0]}
          receiveShadow
          material={materials.woodFloor}
        >
          <planeGeometry args={[10.4, 21.0]} />
        </mesh>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[25.8, 0.018, 0]}
          receiveShadow
          material={materials.redCarpet}
        >
          <planeGeometry args={[6.8, 16.2]} />
        </mesh>

        {/* Trần tảo tỉnh Phòng Tiếp Khách */}
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[25.8, 8.2, 0]}
          material={materials.cofferedCeiling}
        >
          <planeGeometry args={[10.4, 21.0]} />
        </mesh>

        {/* Tường bao phía Đông (X = +31.0m) */}
        <group position={[31.0, 0, 0]}>
          <mesh position={[0, 2.0, 0]} material={materials.carvedWallPanel} receiveShadow>
            <boxGeometry args={[0.5, 4.0, 21.0]} />
          </mesh>
          <mesh position={[0, 6.1, 0]} material={materials.creamWall}>
            <boxGeometry args={[0.45, 4.2, 21.0]} />
          </mesh>
          {[-5.5, 5.5].map((zWin) => (
            <mesh
              key={`east-room-win-${zWin}`}
              position={[-0.28, 5.2, zWin]}
              rotation={[0, -Math.PI / 2, 0]}
              material={materials.latticeWindow}
            >
              <planeGeometry args={[4.2, 2.8]} />
            </mesh>
          ))}
          <mesh
            position={[-0.32, 5.6, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            material={materials.imperialPlaque}
          >
            <boxGeometry args={[4.4, 1.25, 0.16]} />
          </mesh>
        </group>

        {/* Tường Bắc & Nam của Phòng Tiếp Khách (Z = ±10.5m) */}
        {[-10.5, 10.5].map((zWall) => (
          <mesh
            key={`east-room-end-${zWall}`}
            position={[25.8, 4.1, zWall]}
            material={materials.carvedWallPanel}
            receiveShadow
          >
            <boxGeometry args={[10.4, 8.2, 0.5]} />
          </mesh>
        ))}

        {/* NỘI THẤT PHÒNG TIẾP KHÁCH 1: Sập Gụ Tủ Chè Cung Đình Huế & Bình Phong Lưỡng Long */}
        <group position={[28.6, 0, 0]}>
          {/* Bình phong sơn mài thếp vàng phía sau */}
          <mesh position={[1.2, 2.1, 0]} material={materials.dragonScreen} castShadow>
            <boxGeometry args={[0.2, 4.2, 4.4]} />
          </mesh>
          {/* Sập Gụ chạm ngũ phúc + Đệm gấm đỏ */}
          <mesh position={[0, 0.36, 0]} material={materials.darkWood} castShadow>
            <boxGeometry args={[1.9, 0.56, 3.2]} />
          </mesh>
          <mesh position={[0, 0.68, 0]} material={materials.cushionBrocade}>
            <boxGeometry args={[1.72, 0.1, 2.95]} />
          </mesh>
          {/* Bàn kỷ trà thấp đặt giữa sập gụ */}
          <mesh position={[-0.1, 0.86, 0]} material={materials.warmGold} castShadow>
            <boxGeometry args={[0.72, 0.26, 1.1]} />
          </mesh>
          <mesh
            position={[-0.1, 1.0, 0]}
            geometry={customGeos.teapotGeo}
            material={materials.warmGold}
          />
          {/* Đôi Bảo Bình Pháp Lam Huế trên đôn gỗ hai bên Sập Gụ */}
          {[-2.4, 2.4].map((zVase) => (
            <group key={`east-vase-${zVase}`} position={[0.4, 0, zVase]}>
              <mesh position={[0, 0.32, 0]} material={materials.darkWood} castShadow>
                <cylinderGeometry args={[0.34, 0.4, 0.64, 12]} />
              </mesh>
              <mesh
                position={[0, 0.64, 0]}
                scale={[0.85, 0.85, 0.85]}
                geometry={customGeos.vaseGeo}
                material={materials.porcelainVase}
                castShadow
              />
            </group>
          ))}
        </group>

        {/* NỘI THẤT PHÒNG TIẾP KHÁCH 2: 4 Ghế Thái Sư & 2 Bàn Trà Tiếp Sứ Thần (Có thể ngồi bằng phím F/E) */}
        {[-3.6, 3.6].map((zSet, idx) => (
          <group key={`reception-chair-set-${idx}`} position={[24.8, 0, zSet]}>
            {/* Bàn trà tiếp khách */}
            <mesh position={[0, 0.68, 0]} material={materials.darkWood} castShadow>
              <boxGeometry args={[1.1, 0.12, 1.1]} />
            </mesh>
            <mesh position={[0, 0.34, 0]} material={materials.mediumWood} castShadow>
              <boxGeometry args={[0.85, 0.6, 0.85]} />
            </mesh>
            <mesh
              position={[0, 0.75, 0]}
              geometry={customGeos.teapotGeo}
              material={materials.porcelainVase}
            />

            {/* 2 Ghế Thái Sư đối xứng hai bên bàn trà */}
            {[-1.1, 1.1].map((zChair) => (
              <group key={`r-chair-${zChair}`} position={[0, 0, zChair]}>
                <mesh position={[0, 0.46, 0]} material={materials.darkWood} castShadow>
                  <boxGeometry args={[0.86, 0.12, 0.86]} />
                </mesh>
                <mesh position={[0, 0.55, 0]} material={materials.cushionBrocade}>
                  <boxGeometry args={[0.74, 0.08, 0.74]} />
                </mesh>
                <mesh
                  position={[0, 0.98, zChair < 0 ? -0.38 : 0.38]}
                  material={materials.darkWood}
                  castShadow
                >
                  <boxGeometry args={[0.86, 1.05, 0.1]} />
                </mesh>
              </group>
            ))}
          </group>
        ))}

        {/* Lư Trầm Hương Đồng ở tâm Phòng Tiếp Khách */}
        <group position={[23.2, 0, 0]}>
          <mesh position={[0, 0.45, 0]} material={materials.warmGold} castShadow>
            <cylinderGeometry args={[0.36, 0.28, 0.9, 12]} />
          </mesh>
          <mesh position={[0, 1.0, 0]} material={materials.warmGold} castShadow>
            <sphereGeometry args={[0.42, 14, 12]} />
          </mesh>
        </group>

        {/* Nhãn tên nổi 3D trong Phòng Tiếp Khách */}
        <Html position={[25.8, 4.8, 0]} center distanceFactor={24} zIndexRange={[10, 0]}>
          <div className="map-building-label">
            <span className="map-label-icon">🍵</span>
            <span className="map-label-text">Hữu Vu – Phòng Phụ Tiếp Khách</span>
          </div>
        </Html>
      </group>

      {/* ================================================================= */}
      {/* 4. LỐI RA PHÍA SAU & HẬU SẢNH CẦN CHÁNH (Z = -22.0m -> -34.0m)     */}
      {/* ================================================================= */}
      <group name="RearExitAndCorridor_North">
        {/* Sàn gỗ & Gạch Bát Tràng khu vực Hậu Sảnh */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.008, -28.0]}
          receiveShadow
          material={materials.woodFloor}
        >
          <planeGeometry args={[29.0, 12.0]} />
        </mesh>

        {/* 2 Dải Thảm Đỏ nối từ 2 Cửa Hậu Điện (X = ±10.5m) dẫn về Cổng Hậu Cung ở giữa */}
        {[-10.5, 10.5].map((xPath) => (
          <mesh
            key={`rear-carpet-side-${xPath}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[xPath, 0.018, -25.5]}
            receiveShadow
            material={materials.redCarpet}
          >
            <planeGeometry args={[2.8, 7.0]} />
          </mesh>
        ))}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.02, -28.2]}
          receiveShadow
          material={materials.redCarpet}
        >
          <planeGeometry args={[24.0, 2.8]} />
        </mesh>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.022, -31.0]}
          receiveShadow
          material={materials.redCarpet}
        >
          <planeGeometry args={[3.6, 6.0]} />
        </mesh>

        {/* Trần gỗ Hậu Sảnh */}
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 8.2, -28.0]}
          material={materials.cofferedCeiling}
        >
          <planeGeometry args={[29.0, 12.0]} />
        </mesh>

        {/* Tường Đông & Tây của Hậu Sảnh (X = ±14.5m) */}
        {[-14.5, 14.5].map((xRearWall) => (
          <mesh
            key={`rear-side-wall-${xRearWall}`}
            position={[xRearWall, 4.1, -28.0]}
            material={materials.carvedWallPanel}
            receiveShadow
          >
            <boxGeometry args={[0.5, 8.2, 12.0]} />
          </mesh>
        ))}

        {/* Tường Bắc Hậu Sảnh & Cổng Tam Quan Mở Ra Lối Ra Phía Sau (Z = -34.0m) */}
        <group position={[0, 0, -34.0]}>
          {/* Hai cánh tường hai bên cổng ra phía sau */}
          {[-8.8, 8.8].map((xSeg) => (
            <mesh
              key={`rear-north-seg-${xSeg}`}
              position={[xSeg, 4.1, 0]}
              material={materials.carvedWallPanel}
              receiveShadow
            >
              <boxGeometry args={[11.4, 8.2, 0.55]} />
            </mesh>
          ))}
          {/* Thượng lương & Hoành phi trên Cổng Lối Ra Phía Sau (Rộng 6.2m ở giữa) */}
          <mesh position={[0, 6.5, 0]} material={materials.nhatThiNhatHoa}>
            <boxGeometry args={[6.4, 3.4, 0.6]} />
          </mesh>
          <mesh position={[0, 5.2, 0.34]} material={materials.imperialPlaque}>
            <boxGeometry args={[4.2, 1.15, 0.16]} />
          </mesh>
          {[-3.1, 3.1].map((xGateCol) => (
            <mesh
              key={`rear-gate-col-${xGateCol}`}
              position={[xGateCol, 4.1, 0]}
              material={materials.redPillar}
              castShadow
            >
              <cylinderGeometry args={[0.32, 0.36, 8.2, 14]} />
            </mesh>
          ))}
        </group>

        {/* NỘI THẤT HẬU SẢNH: Ngự Án Đọc Mật Tấu, Ghế Ngự & Bình Phong Thếp Vàng (Tại [0, 0, -25.2]) */}
        <group position={[0, 0, -25.2]}>
          {/* Bình phong hậu điện */}
          <mesh position={[0, 2.0, 2.1]} material={materials.dragonScreen} castShadow>
            <boxGeometry args={[4.2, 4.0, 0.2]} />
          </mesh>
          {/* Ghế Ngự Hậu Sảnh (Có thể ngồi bằng phím F/E) */}
          <mesh position={[0, 0.48, 0.85]} material={materials.warmGold} castShadow>
            <boxGeometry args={[1.35, 0.16, 0.95]} />
          </mesh>
          <mesh position={[0, 0.58, 0.85]} material={materials.cushionBrocade}>
            <boxGeometry args={[1.2, 0.08, 0.82]} />
          </mesh>
          <mesh position={[0, 1.1, 1.28]} material={materials.warmGold} castShadow>
            <boxGeometry args={[1.35, 1.15, 0.14]} />
          </mesh>
          {/* Ngự Án Hậu Sảnh */}
          <mesh position={[0, 0.78, -0.35]} material={materials.darkWood} castShadow>
            <boxGeometry args={[2.2, 0.14, 1.05]} />
          </mesh>
          <mesh position={[0, 0.38, -0.35]} material={materials.redPillar} castShadow>
            <boxGeometry args={[1.95, 0.68, 0.85]} />
          </mesh>
          {/* Chồng tấu chương, nghiên mực & bình hoa trên Ngự Án */}
          <mesh position={[-0.45, 0.9, -0.35]} rotation={[0, 0, Math.PI / 2]} material={materials.warmGold}>
            <cylinderGeometry args={[0.06, 0.06, 0.58, 10]} />
          </mesh>
          <mesh position={[0.15, 0.88, -0.35]} material={materials.darkWood}>
            <boxGeometry args={[0.28, 0.05, 0.22]} />
          </mesh>
          <mesh
            position={[0.68, 0.85, -0.35]}
            scale={[0.42, 0.42, 0.42]}
            geometry={customGeos.vaseGeo}
            material={materials.porcelainVase}
          />
        </group>

        {/* Đôi Lư Hương Đồng & Bình Sứ Thanh Hoa chầu hai bên Cổng Lối Ra Phía Sau */}
        {[-5.2, 5.2].map((xOrn) => (
          <group key={`rear-orn-${xOrn}`} position={[xOrn, 0, -31.2]}>
            <mesh position={[0, 0.32, 0]} material={materials.darkWood} castShadow>
              <cylinderGeometry args={[0.38, 0.44, 0.64, 12]} />
            </mesh>
            <mesh
              position={[0, 0.64, 0]}
              geometry={customGeos.vaseGeo}
              material={materials.porcelainVase}
              castShadow
            />
          </group>
        ))}

        {/* Nhãn tên nổi 3D tại Hậu Sảnh & Lối Ra Phía Sau */}
        <Html position={[0, 4.8, -31.5]} center distanceFactor={24} zIndexRange={[10, 0]}>
          <div className="map-building-label">
            <span className="map-label-icon">⛩️</span>
            <span className="map-label-text">Hậu Sảnh & Lối Ra Cần Chánh Điện</span>
          </div>
        </Html>
      </group>
    </group>
  );
};
