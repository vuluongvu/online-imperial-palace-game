import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createPalaceMaterialSet } from '../assets/PalaceMaterials';
import { useGameStore } from '../../stores/useGameStore';

/**
 * Kích thước & tọa độ bố cục Thái Hòa Chính Điện (Imperial Main Hall)
 * Đã chuẩn hóa theo kiến trúc cung đình:
 * - Khu vực Minh Gian (Sân chầu trung tâm) rộng 16.4m (X từ -8.2m đến +8.2m), hoàn toàn thông thoáng.
 * - 6 Cột Bàn Long Thếp Vàng (Golden Dragon Pillars) đứng chầu trên Bệ Rồng quanh Long Ngai.
 * - 16 Cột Đại Điện Sơn Son (Red Palace Pillars) chia thành 4 trục gian (Z = -8.5, -1.0, +6.5, +14.0)
 *   tại X = ±8.2m (Nội điện) và X = ±13.6m (Ngoại điện), không cắt vào Bệ Rồng hay bàn quan viên.
 */
export const MAIN_HALL_LAYOUT = {
  width: 32,
  length: 44,
  wallHeight: 11.5,
  // 6 Cột Rồng Vàng (Bàn Long Kim Trụ) bao quanh Long Ngai trên khu vực Bệ Rồng
  goldenDragonPillarPositions: [
    [-4.5, 0, -13.0],
    [4.5, 0, -13.0],
    [-4.5, 0, -16.8],
    [4.5, 0, -16.8],
    [-4.5, 0, -20.4],
    [4.5, 0, -20.4],
  ] as [number, number, number][],
  // 16 Cột Đại Điện Sơn Son (Hàng cột Nội điện X = ±8.2m & Ngoại điện X = ±13.6m)
  pillarPositions: [
    // Hàng cột Nội điện bên trái (X = -8.2m, thẳng mép Bệ Rồng, ngoài hàng ghế quan viên)
    [-8.2, 0, -8.5],
    [-8.2, 0, -1.0],
    [-8.2, 0, 6.5],
    [-8.2, 0, 14.0],
    // Hàng cột Nội điện bên phải (X = +8.2m)
    [8.2, 0, -8.5],
    [8.2, 0, -1.0],
    [8.2, 0, 6.5],
    [8.2, 0, 14.0],
    // Hàng cột Ngoại điện bên trái (X = -13.6m)
    [-13.6, 0, -8.5],
    [-13.6, 0, -1.0],
    [-13.6, 0, 6.5],
    [-13.6, 0, 14.0],
    // Hàng cột Ngoại điện bên phải (X = +13.6m)
    [13.6, 0, -8.5],
    [13.6, 0, -1.0],
    [13.6, 0, 6.5],
    [13.6, 0, 14.0],
  ] as [number, number, number][],
  officialDeskPositions: [
    // Hàng quan văn bên trái hướng mặt vào Ngự Đạo (X = -4.3m)
    { pos: [-4.3, 0, -7.2] as [number, number, number], rotY: Math.PI / 2 },
    { pos: [-4.3, 0, -3.6] as [number, number, number], rotY: Math.PI / 2 },
    { pos: [-4.3, 0, 0.0] as [number, number, number], rotY: Math.PI / 2 },
    { pos: [-4.3, 0, 3.6] as [number, number, number], rotY: Math.PI / 2 },
    { pos: [-4.3, 0, 7.2] as [number, number, number], rotY: Math.PI / 2 },
    { pos: [-4.3, 0, 10.8] as [number, number, number], rotY: Math.PI / 2 },
    // Hàng quan võ bên phải hướng mặt vào Ngự Đạo (X = +4.3m)
    { pos: [4.3, 0, -7.2] as [number, number, number], rotY: -Math.PI / 2 },
    { pos: [4.3, 0, -3.6] as [number, number, number], rotY: -Math.PI / 2 },
    { pos: [4.3, 0, 0.0] as [number, number, number], rotY: -Math.PI / 2 },
    { pos: [4.3, 0, 3.6] as [number, number, number], rotY: -Math.PI / 2 },
    { pos: [4.3, 0, 7.2] as [number, number, number], rotY: -Math.PI / 2 },
    { pos: [4.3, 0, 10.8] as [number, number, number], rotY: -Math.PI / 2 },
  ],
  // 12 Đèn lồng cung đình treo tại tâm các gian giữa hàng cột
  lanternPositions: [
    [-6.6, 8.6, -8.5],
    [-6.6, 8.6, -4.75],
    [-6.6, 8.6, -1.0],
    [-6.6, 8.6, 2.75],
    [-6.6, 8.6, 6.5],
    [-6.6, 8.6, 10.25],
    [6.6, 8.6, -8.5],
    [6.6, 8.6, -4.75],
    [6.6, 8.6, -1.0],
    [6.6, 8.6, 2.75],
    [6.6, 8.6, 6.5],
    [6.6, 8.6, 10.25],
  ] as [number, number, number][],
  // 8 Phướn lụa Hoàng Gia treo dọc hành lang nội điện
  silkBannerPositions: [
    [-7.4, 7.2, -8.5],
    [-7.4, 7.2, -1.0],
    [-7.4, 7.2, 6.5],
    [-7.4, 7.2, 14.0],
    [7.4, 7.2, -8.5],
    [7.4, 7.2, -1.0],
    [7.4, 7.2, 6.5],
    [7.4, 7.2, 14.0],
  ] as [number, number, number][],
  // 10 Bình hoa sứ Thanh Hoa & Bảo Bình đặt tại các gian điện
  vasePositions: [
    [-10.8, 0, -11.5],
    [10.8, 0, -11.5],
    [-10.8, 0, -4.8],
    [10.8, 0, -4.8],
    [-10.8, 0, 2.8],
    [10.8, 0, 2.8],
    [-10.8, 0, 10.2],
    [10.8, 0, 10.2],
    [-5.8, 0.6, -12.4],
    [5.8, 0.6, -12.4],
  ] as [number, number, number][],
};

export const MainHall: React.FC = () => {
  const showWireframe = useGameStore((s) => s.showWireframe);
  const lanternAnimationEnabled = useGameStore((s) => s.lanternAnimationEnabled);

  const materials = useMemo(() => createPalaceMaterialSet(showWireframe), [showWireframe]);

  useEffect(() => {
    return () => {
      materials.dispose();
    };
  }, [materials]);

  // Shared Geometries cho InstancedMesh (Tối ưu draw calls)
  const geometries = useMemo(() => {
    const pillarShaft = new THREE.CylinderGeometry(0.48, 0.52, 10.6, 22);
    const pillarBase = new THREE.CylinderGeometry(0.68, 0.82, 0.58, 18);
    const pillarGoldRing = new THREE.CylinderGeometry(0.55, 0.55, 0.24, 20);
    // Đấu củng 2 tầng (DouGong bracket capital)
    const pillarCapitalLower = new THREE.BoxGeometry(1.35, 0.42, 1.35);
    const pillarCapitalUpper = new THREE.BoxGeometry(1.75, 0.45, 1.75);

    const tableTop = new THREE.BoxGeometry(1.18, 0.14, 1.95);
    const tableSubFrame = new THREE.BoxGeometry(0.98, 0.68, 1.75);
    const tableScroll = new THREE.CylinderGeometry(0.055, 0.055, 0.55, 10);

    const chairSeat = new THREE.BoxGeometry(0.84, 0.12, 0.84);
    const chairBack = new THREE.BoxGeometry(0.1, 1.08, 0.8);
    const chairCushion = new THREE.BoxGeometry(0.72, 0.08, 0.72);

    const lanternBody = new THREE.SphereGeometry(0.48, 16, 12);
    lanternBody.scale(1, 1.28, 1);
    const lanternCap = new THREE.CylinderGeometry(0.3, 0.34, 0.18, 12);
    const lanternCord = new THREE.CylinderGeometry(0.025, 0.025, 2.2, 8);
    const lanternTassel = new THREE.ConeGeometry(0.12, 0.48, 8);

    const bannerCloth = new THREE.PlaneGeometry(0.78, 3.6);

    const vasePoints = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.28, 0.0),
      new THREE.Vector2(0.24, 0.18),
      new THREE.Vector2(0.44, 0.62),
      new THREE.Vector2(0.38, 0.98),
      new THREE.Vector2(0.18, 1.24),
      new THREE.Vector2(0.28, 1.46),
      new THREE.Vector2(0.22, 1.5),
    ];
    const porcelainVase = new THREE.LatheGeometry(vasePoints, 18);
    const vaseStand = new THREE.CylinderGeometry(0.38, 0.44, 0.55, 14);

    return {
      pillarShaft,
      pillarBase,
      pillarGoldRing,
      pillarCapitalLower,
      pillarCapitalUpper,
      tableTop,
      tableSubFrame,
      tableScroll,
      chairSeat,
      chairBack,
      chairCushion,
      lanternBody,
      lanternCap,
      lanternCord,
      lanternTassel,
      bannerCloth,
      porcelainVase,
      vaseStand,
      dispose: () => {
        pillarShaft.dispose();
        pillarBase.dispose();
        pillarGoldRing.dispose();
        pillarCapitalLower.dispose();
        pillarCapitalUpper.dispose();
        tableTop.dispose();
        tableSubFrame.dispose();
        tableScroll.dispose();
        chairSeat.dispose();
        chairBack.dispose();
        chairCushion.dispose();
        lanternBody.dispose();
        lanternCap.dispose();
        lanternCord.dispose();
        lanternTassel.dispose();
        bannerCloth.dispose();
        porcelainVase.dispose();
        vaseStand.dispose();
      },
    };
  }, []);

  useEffect(() => {
    return () => {
      geometries.dispose();
    };
  }, [geometries]);

  const totalPillarsCount =
    MAIN_HALL_LAYOUT.pillarPositions.length +
    MAIN_HALL_LAYOUT.goldenDragonPillarPositions.length;

  // Refs cho InstancedMesh
  const redPillarShaftRef = useRef<THREE.InstancedMesh>(null);
  const goldPillarShaftRef = useRef<THREE.InstancedMesh>(null);
  const pillarBaseRef = useRef<THREE.InstancedMesh>(null);
  const pillarRingRef = useRef<THREE.InstancedMesh>(null);
  const pillarCapLowerRef = useRef<THREE.InstancedMesh>(null);
  const pillarCapUpperRef = useRef<THREE.InstancedMesh>(null);

  const tableTopRef = useRef<THREE.InstancedMesh>(null);
  const tableFrameRef = useRef<THREE.InstancedMesh>(null);
  const tableScrollRef = useRef<THREE.InstancedMesh>(null);
  const chairSeatRef = useRef<THREE.InstancedMesh>(null);
  const chairBackRef = useRef<THREE.InstancedMesh>(null);
  const chairCushionRef = useRef<THREE.InstancedMesh>(null);

  const lanternBodyRef = useRef<THREE.InstancedMesh>(null);
  const lanternCapRef = useRef<THREE.InstancedMesh>(null);
  const lanternCordRef = useRef<THREE.InstancedMesh>(null);
  const lanternTasselRef = useRef<THREE.InstancedMesh>(null);
  const bannerRef = useRef<THREE.InstancedMesh>(null);

  const vaseStandRef = useRef<THREE.InstancedMesh>(null);
  const vaseBodyRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    // 1A. 16 Cột Đại Điện Sơn Son
    MAIN_HALL_LAYOUT.pillarPositions.forEach(([x, y, z], idx) => {
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);

      dummy.position.set(x, y + 5.55, z);
      dummy.updateMatrix();
      redPillarShaftRef.current?.setMatrixAt(idx, dummy.matrix);
    });
    if (redPillarShaftRef.current) redPillarShaftRef.current.instanceMatrix.needsUpdate = true;

    // 1B. 6 Cột Bàn Long Thếp Vàng quanh Long Ngai
    MAIN_HALL_LAYOUT.goldenDragonPillarPositions.forEach(([x, y, z], idx) => {
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1.06, 1, 1.06);

      dummy.position.set(x, y + 5.55, z);
      dummy.updateMatrix();
      goldPillarShaftRef.current?.setMatrixAt(idx, dummy.matrix);
    });
    if (goldPillarShaftRef.current) goldPillarShaftRef.current.instanceMatrix.needsUpdate = true;

    // 1C. Chân tảng đá cánh sen + Đai vàng + Đấu củng 2 tầng cho toàn bộ 22 cột
    const allPillars = [
      ...MAIN_HALL_LAYOUT.pillarPositions,
      ...MAIN_HALL_LAYOUT.goldenDragonPillarPositions,
    ];
    allPillars.forEach(([x, y, z], idx) => {
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);

      const isOnDais = z < -11.5;
      const baseHeightOffset = isOnDais ? 0.6 : 0;

      dummy.position.set(x, y + baseHeightOffset + 0.28, z);
      dummy.updateMatrix();
      pillarBaseRef.current?.setMatrixAt(idx, dummy.matrix);

      dummy.position.set(x, y + baseHeightOffset + 0.68, z);
      dummy.updateMatrix();
      pillarRingRef.current?.setMatrixAt(idx, dummy.matrix);

      dummy.position.set(x, 10.35, z);
      dummy.updateMatrix();
      pillarCapLowerRef.current?.setMatrixAt(idx, dummy.matrix);

      dummy.position.set(x, 10.78, z);
      dummy.updateMatrix();
      pillarCapUpperRef.current?.setMatrixAt(idx, dummy.matrix);
    });

    if (pillarBaseRef.current) pillarBaseRef.current.instanceMatrix.needsUpdate = true;
    if (pillarRingRef.current) pillarRingRef.current.instanceMatrix.needsUpdate = true;
    if (pillarCapLowerRef.current) pillarCapLowerRef.current.instanceMatrix.needsUpdate = true;
    if (pillarCapUpperRef.current) pillarCapUpperRef.current.instanceMatrix.needsUpdate = true;

    // 2. 12 Bộ bàn ghế quan viên + Tấu chương vàng trên bàn
    MAIN_HALL_LAYOUT.officialDeskPositions.forEach(({ pos, rotY }, idx) => {
      const [x, , z] = pos;
      const chairOffsetX = x < 0 ? -1.08 : 1.08;

      dummy.position.set(x, 0.78, z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      tableTopRef.current?.setMatrixAt(idx, dummy.matrix);

      dummy.position.set(x, 0.38, z);
      dummy.updateMatrix();
      tableFrameRef.current?.setMatrixAt(idx, dummy.matrix);

      // Cuộn tấu chương đặt trên mỗi bàn quan viên
      dummy.position.set(x, 0.89, z - 0.25);
      dummy.rotation.set(0, 0, Math.PI / 2);
      dummy.updateMatrix();
      tableScrollRef.current?.setMatrixAt(idx, dummy.matrix);

      // Ghế quan viên
      dummy.position.set(x + chairOffsetX, 0.46, z);
      dummy.rotation.set(0, rotY, 0);
      dummy.updateMatrix();
      chairSeatRef.current?.setMatrixAt(idx, dummy.matrix);

      dummy.position.set(x + chairOffsetX, 0.55, z);
      dummy.rotation.set(0, rotY, 0);
      dummy.updateMatrix();
      chairCushionRef.current?.setMatrixAt(idx, dummy.matrix);

      const backShift = x < 0 ? -0.36 : 0.36;
      dummy.position.set(x + chairOffsetX + backShift, 0.96, z);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      chairBackRef.current?.setMatrixAt(idx, dummy.matrix);
    });

    if (tableTopRef.current) tableTopRef.current.instanceMatrix.needsUpdate = true;
    if (tableFrameRef.current) tableFrameRef.current.instanceMatrix.needsUpdate = true;
    if (tableScrollRef.current) tableScrollRef.current.instanceMatrix.needsUpdate = true;
    if (chairSeatRef.current) chairSeatRef.current.instanceMatrix.needsUpdate = true;
    if (chairCushionRef.current) chairCushionRef.current.instanceMatrix.needsUpdate = true;
    if (chairBackRef.current) chairBackRef.current.instanceMatrix.needsUpdate = true;

    // 3. 10 Bình hoa sứ Thanh Hoa trên đôn gỗ
    MAIN_HALL_LAYOUT.vasePositions.forEach(([x, y, z], idx) => {
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);

      dummy.position.set(x, y + 0.275, z);
      dummy.updateMatrix();
      vaseStandRef.current?.setMatrixAt(idx, dummy.matrix);

      dummy.position.set(x, y + 0.55, z);
      dummy.updateMatrix();
      vaseBodyRef.current?.setMatrixAt(idx, dummy.matrix);
    });

    if (vaseStandRef.current) vaseStandRef.current.instanceMatrix.needsUpdate = true;
    if (vaseBodyRef.current) vaseBodyRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  // Chuyển động đung đưa nhẹ của 12 Đèn lồng cung đình & 8 Phướn lụa Hoàng Gia
  useFrame(({ clock }) => {
    const t = lanternAnimationEnabled ? clock.getElapsedTime() : 0;

    if (
      lanternBodyRef.current &&
      lanternCapRef.current &&
      lanternCordRef.current &&
      lanternTasselRef.current
    ) {
      MAIN_HALL_LAYOUT.lanternPositions.forEach(([x, y, z], idx) => {
        const swayAngle = Math.sin(t * 1.35 + idx * 0.8) * 0.045;
        const swayOffsetX = Math.sin(swayAngle) * 0.8;

        dummy.scale.set(1, 1, 1);
        dummy.position.set(x + swayOffsetX * 0.5, y + 1.1, z);
        dummy.rotation.set(0, 0, -swayAngle);
        dummy.updateMatrix();
        lanternCordRef.current!.setMatrixAt(idx, dummy.matrix);

        dummy.position.set(x + swayOffsetX, y, z);
        dummy.rotation.set(0, t * 0.2 + idx, -swayAngle);
        dummy.updateMatrix();
        lanternBodyRef.current!.setMatrixAt(idx, dummy.matrix);

        dummy.position.set(x + swayOffsetX, y + 0.6, z);
        dummy.rotation.set(0, 0, -swayAngle);
        dummy.updateMatrix();
        lanternCapRef.current!.setMatrixAt(idx, dummy.matrix);

        dummy.position.set(x + swayOffsetX, y - 0.72, z);
        dummy.rotation.set(Math.PI, 0, -swayAngle * 1.3);
        dummy.updateMatrix();
        lanternTasselRef.current!.setMatrixAt(idx, dummy.matrix);
      });

      lanternCordRef.current.instanceMatrix.needsUpdate = true;
      lanternBodyRef.current.instanceMatrix.needsUpdate = true;
      lanternCapRef.current.instanceMatrix.needsUpdate = true;
      lanternTasselRef.current.instanceMatrix.needsUpdate = true;
    }

    if (bannerRef.current) {
      MAIN_HALL_LAYOUT.silkBannerPositions.forEach(([x, y, z], idx) => {
        const waveZ = Math.sin(t * 1.6 + idx) * 0.035;
        dummy.position.set(x, y, z);
        dummy.rotation.set(waveZ, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        bannerRef.current!.setMatrixAt(idx, dummy.matrix);
      });
      bannerRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group name="ImperialMainHall">
      {/* ================================================================= */}
      {/* 1. WOODEN FLOOR & IMPERIAL CARPET (Sàn Kim Chuyên & Thảm Ngự Đạo) */}
      {/* ================================================================= */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        material={materials.woodFloor}
      >
        <planeGeometry args={[MAIN_HALL_LAYOUT.width, MAIN_HALL_LAYOUT.length]} />
      </mesh>

      {/* Đường đá bạch ngọc dẫn hai bên mép Thảm Đỏ Ngự Đạo */}
      {[-2.45, 2.45].map((xBorder) => (
        <mesh
          key={`jade-carpet-border-${xBorder}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[xBorder, 0.012, 5.2]}
          receiveShadow
          material={materials.stoneBase}
        >
          <planeGeometry args={[0.35, 33.2]} />
        </mesh>
      ))}

      {/* Thảm Đỏ Ngự Đạo dệt Đoàn Long Vàng từ cửa Nam tới chân Bệ Rồng */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 5.2]}
        receiveShadow
        material={materials.redCarpet}
      >
        <planeGeometry args={[4.6, 33.2]} />
      </mesh>

      {/* ================================================================= */}
      {/* 2. PILLARS: 16 CỘT ĐẠI ĐIỆN SƠN SON + 6 CỘT RỒNG VÀNG BÀN LONG    */}
      {/* ================================================================= */}
      <instancedMesh
        ref={redPillarShaftRef}
        args={[
          geometries.pillarShaft,
          materials.redPillar,
          MAIN_HALL_LAYOUT.pillarPositions.length,
        ]}
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={goldPillarShaftRef}
        args={[
          geometries.pillarShaft,
          materials.goldenDragonPillar,
          MAIN_HALL_LAYOUT.goldenDragonPillarPositions.length,
        ]}
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={pillarBaseRef}
        args={[geometries.pillarBase, materials.stoneBase, totalPillarsCount]}
        receiveShadow
      />
      <instancedMesh
        ref={pillarRingRef}
        args={[geometries.pillarGoldRing, materials.warmGold, totalPillarsCount]}
      />
      <instancedMesh
        ref={pillarCapLowerRef}
        args={[geometries.pillarCapitalLower, materials.redPillar, totalPillarsCount]}
      />
      <instancedMesh
        ref={pillarCapUpperRef}
        args={[geometries.pillarCapitalUpper, materials.paintedBeam, totalPillarsCount]}
      />

      {/* Đôi Câu Đối Sơn Son Thếp Vàng treo trên 2 Cột Rồng Vàng tiền điện (Z = -13.0) */}
      {[-4.5, 4.5].map((xCol) => (
        <group key={`dragon-pillar-couplet-${xCol}`} position={[xCol, 5.2, -12.44]}>
          <mesh material={materials.darkWood} castShadow>
            <boxGeometry args={[0.46, 5.4, 0.08]} />
          </mesh>
          <mesh position={[0, 0, 0.045]} material={materials.warmGold}>
            <boxGeometry args={[0.36, 5.1, 0.02]} />
          </mesh>
        </group>
      ))}

      {/* Bức Đại Tự Hoành Phi "CHÍNH ĐẠI QUANG MINH" treo giữa 2 Cột Rồng Vàng phía trên Long Ngai */}
      <group position={[0, 8.85, -12.9]}>
        <mesh material={materials.warmGold} castShadow>
          <boxGeometry args={[7.6, 1.95, 0.28]} />
        </mesh>
        <mesh position={[0, 0, 0.15]} material={materials.imperialPlaque}>
          <planeGeometry args={[7.2, 1.65]} />
        </mesh>
      </group>

      {/* Hệ thống Xà Ngang & Dầm Hoa Văn Hòa Tỷ Thái Bình theo đúng 5 trục gian */}
      {[-13.0, -8.5, -1.0, 6.5, 14.0].map((zPos) => (
        <group key={`crossbeam-${zPos}`} position={[0, 10.75, zPos]}>
          <mesh material={materials.paintedBeam} castShadow>
            <boxGeometry args={[31.6, 0.62, 0.58]} />
          </mesh>
          <mesh position={[0, -0.38, 0]} material={materials.redPillar}>
            <boxGeometry args={[31.4, 0.24, 0.44]} />
          </mesh>
          <mesh position={[0, -0.52, 0]} material={materials.warmGold}>
            <boxGeometry args={[31.4, 0.06, 0.46]} />
          </mesh>
        </group>
      ))}

      {/* Dầm dọc nối các hàng cột Nội điện (X = ±8.2m) & Ngoại điện (X = ±13.6m) */}
      {[-13.6, -8.2, 8.2, 13.6].map((xPos) => (
        <group key={`longbeam-${xPos}`} position={[xPos, 10.8, 0]}>
          <mesh material={materials.paintedBeam}>
            <boxGeometry args={[0.56, 0.58, 43.6]} />
          </mesh>
          <mesh position={[0, -0.35, 0]} material={materials.redPillar}>
            <boxGeometry args={[0.44, 0.22, 43.6]} />
          </mesh>
        </group>
      ))}

      {/* ================================================================= */}
      {/* 3. COFFERED CEILING & CAISSON DRAGON DOME (Tảo Tỉnh Hiên Viên Kính) */}
      {/* ================================================================= */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, MAIN_HALL_LAYOUT.wallHeight, 0]}
        material={materials.cofferedCeiling}
      >
        <planeGeometry args={[MAIN_HALL_LAYOUT.width, MAIN_HALL_LAYOUT.length]} />
      </mesh>

      {/* Tảo Tỉnh Bát Giác Thếp Vàng & Hiên Viên Kính (Caisson Dome ngay trên Long Ngai) */}
      <group position={[0, 11.4, -16.8]}>
        {/* Khung vuông ngoài Tảo Tỉnh */}
        <mesh position={[0, -0.15, 0]} material={materials.redPillar}>
          <boxGeometry args={[7.8, 0.35, 7.2]} />
        </mesh>
        {/* Tầng bát giác thứ nhất */}
        <mesh position={[0, -0.45, 0]} material={materials.warmGold}>
          <cylinderGeometry args={[2.8, 3.3, 0.45, 8]} />
        </mesh>
        {/* Tầng bát giác thứ hai chạm rồng */}
        <mesh position={[0, -0.82, 0]} material={materials.paintedBeam}>
          <cylinderGeometry args={[1.9, 2.5, 0.42, 8]} />
        </mesh>
        {/* Đỉnh vòm vàng Tảo Tỉnh */}
        <mesh position={[0, -1.12, 0]} material={materials.warmGold}>
          <cylinderGeometry args={[0.9, 1.7, 0.35, 16]} />
        </mesh>
        {/* Dây treo và Quả cầu Hiên Viên Kính (Xuanyuan Mirror Pearl) */}
        <mesh position={[0, -1.55, 0]} material={materials.warmGold}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        </mesh>
        <mesh position={[0, -1.95, 0]} material={materials.warmGold} castShadow>
          <sphereGeometry args={[0.38, 20, 20]} />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 4. PALACE WALLS & TRADITIONAL WOODEN DOORS                        */}
      {/* ================================================================= */}
      {/* Tường Bắc (Phía sau Long Ngai) */}
      <group position={[0, 0, -22]}>
        <mesh position={[0, 1.8, 0]} material={materials.redPillar} receiveShadow>
          <boxGeometry args={[32, 3.6, 0.6]} />
        </mesh>
        <mesh position={[0, 6.9, 0]} material={materials.creamWall} receiveShadow>
          <boxGeometry args={[32, 6.8, 0.5]} />
        </mesh>
        <mesh position={[0, 10.8, 0.1]} material={materials.paintedBeam}>
          <boxGeometry args={[32, 1.2, 0.65]} />
        </mesh>
        {/* Hoành phi & Bích họa trang trí tường hậu */}
        {[-10.5, 10.5].map((xMural) => (
          <group key={`north-mural-${xMural}`} position={[xMural, 6.2, 0.3]}>
            <mesh material={materials.warmGold}>
              <boxGeometry args={[4.4, 3.4, 0.08]} />
            </mesh>
            <mesh position={[0, 0, 0.05]} material={materials.dragonScreen}>
              <planeGeometry args={[4.0, 3.0]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Tường Tây (Bên trái) & Tường Đông (Bên phải) có bổ trụ đỏ và cửa sổ song hoa */}
      {[-16, 16].map((xWall) => (
        <group key={`side-wall-${xWall}`} position={[xWall, 0, 0]}>
          <mesh position={[0, 1.6, 0]} material={materials.darkWood} receiveShadow>
            <boxGeometry args={[0.6, 3.2, 44]} />
          </mesh>
          <mesh position={[0, 6.8, 0]} material={materials.creamWall} receiveShadow>
            <boxGeometry args={[0.5, 7.4, 44]} />
          </mesh>
          {/* Các bổ trụ tường màu đỏ theo từng gian */}
          {[-14, -6.5, 1, 8.5, 16].map((zPilaster) => (
            <mesh
              key={`pilaster-${xWall}-${zPilaster}`}
              position={[xWall < 0 ? 0.26 : -0.26, 5.75, zPilaster]}
              material={materials.redPillar}
            >
              <boxGeometry args={[0.25, 11.5, 0.55]} />
            </mesh>
          ))}
          {/* Cửa sổ song hoa cổ trang đón nắng */}
          {[-10.25, -2.75, 4.75, 12.25].map((zWin) => (
            <mesh
              key={`window-${xWall}-${zWin}`}
              position={[xWall < 0 ? 0.28 : -0.28, 6.0, zWin]}
              rotation={[0, xWall < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
              material={materials.latticeWindow}
            >
              <planeGeometry args={[5.4, 3.8]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Cổng Gỗ Cổ Trang 6 Cánh Phía Nam (Z = +22) */}
      <group position={[0, 0, 22]}>
        <mesh position={[-10.5, 5.75, 0]} material={materials.redPillar} receiveShadow>
          <boxGeometry args={[11, 11.5, 0.65]} />
        </mesh>
        <mesh position={[10.5, 5.75, 0]} material={materials.redPillar} receiveShadow>
          <boxGeometry args={[11, 11.5, 0.65]} />
        </mesh>
        <mesh position={[0, 9.2, 0]} material={materials.redPillar}>
          <boxGeometry args={[10, 4.6, 0.65]} />
        </mesh>
        <mesh position={[0, 8.2, -0.4]} material={materials.warmGold}>
          <boxGeometry args={[5.2, 1.45, 0.25]} />
        </mesh>
        <mesh position={[0, 8.2, -0.54]} material={materials.imperialPlaque}>
          <planeGeometry args={[4.8, 1.15]} />
        </mesh>

        {[-4.1, -2.6, 2.6, 4.1].map((xDoor, idx) => (
          <group key={`door-leaf-${idx}`} position={[xDoor, 3.4, -0.1]}>
            <mesh material={materials.redPillar} castShadow>
              <boxGeometry args={[1.38, 6.8, 0.18]} />
            </mesh>
            <mesh position={[0, 1.2, -0.11]} material={materials.latticeWindow}>
              <planeGeometry args={[1.05, 2.8]} />
            </mesh>
            {[-1.1, -1.6, -2.1, -2.6].map((yStud, sIdx) => (
              <mesh
                key={`stud-${sIdx}`}
                position={[0, yStud, -0.12]}
                material={materials.warmGold}
              >
                <boxGeometry args={[1.05, 0.08, 0.06]} />
              </mesh>
            ))}
          </group>
        ))}

        {[-1.85, 1.85].map((xOpen, idx) => (
          <group
            key={`open-door-${idx}`}
            position={[xOpen, 3.4, -0.2]}
            rotation={[0, xOpen < 0 ? -1.15 : 1.15, 0]}
          >
            <mesh
              position={[xOpen < 0 ? 0.68 : -0.68, 0, 0]}
              material={materials.redPillar}
              castShadow
            >
              <boxGeometry args={[1.36, 6.8, 0.18]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================================================================= */}
      {/* 5. IMPERIAL THRONE DAIS (Bệ Rồng Tu Di Tọa 3 Cấp & Bảo Vật Ngự Tiền) */}
      {/* ================================================================= */}
      <group name="ImperialThroneDais" position={[0, 0, -16.4]}>
        {/* Cấp bệ 1 (Rộng 16.4m khớp chuẩn hàng cột Nội điện X = ±8.2m) */}
        <mesh position={[0, 0.3, 0]} material={materials.stoneBase} receiveShadow>
          <boxGeometry args={[16.4, 0.6, 9.6]} />
        </mesh>
        <mesh position={[0, 0.58, 0]} material={materials.warmGold}>
          <boxGeometry args={[16.5, 0.06, 9.7]} />
        </mesh>
        <mesh position={[0, 0.61, 0]} material={materials.redCarpet} receiveShadow>
          <boxGeometry args={[15.8, 0.03, 9.2]} />
        </mesh>

        {/* Cấp bệ 2 */}
        <mesh position={[0, 0.9, -0.4]} material={materials.stoneBase} receiveShadow>
          <boxGeometry args={[13.2, 0.6, 8.0]} />
        </mesh>
        <mesh position={[0, 1.18, -0.4]} material={materials.warmGold}>
          <boxGeometry args={[13.3, 0.06, 8.1]} />
        </mesh>
        <mesh position={[0, 1.21, -0.4]} material={materials.redCarpet} receiveShadow>
          <boxGeometry args={[12.6, 0.03, 7.6]} />
        </mesh>

        {/* Cấp bệ 3 (Đỉnh Bệ Rồng nơi đặt Long Ngai) */}
        <mesh position={[0, 1.5, -0.85]} material={materials.stoneBase} receiveShadow>
          <boxGeometry args={[10.4, 0.6, 6.4]} />
        </mesh>
        <mesh position={[0, 1.78, -0.85]} material={materials.warmGold}>
          <boxGeometry args={[10.5, 0.06, 6.5]} />
        </mesh>
        <mesh position={[0, 1.81, -0.85]} material={materials.redCarpet} receiveShadow>
          <boxGeometry args={[9.8, 0.03, 6.0]} />
        </mesh>

        {/* Bậc Tam Cấp Ngự Đạo (Hai làn bậc thang hai bên + Đan Bệ chạm rồng ở giữa) */}
        {[0, 1, 2, 3, 4, 5].map((step) => (
          <mesh
            key={`throne-step-${step}`}
            position={[0, 0.15 + step * 0.3, 5.0 - step * 0.52]}
            material={step % 2 === 0 ? materials.redCarpet : materials.warmGold}
            receiveShadow
          >
            <boxGeometry args={[4.8, 0.3, 0.56]} />
          </mesh>
        ))}

        {/* Tấm Đá Đan Bệ Chạm Nổi Cửu Long Vờn Mây ở chính tâm bậc tam cấp */}
        <mesh
          position={[0, 0.96, 3.65]}
          rotation={[-0.98, 0, 0]}
          material={materials.danBeStone}
          receiveShadow
        >
          <boxGeometry args={[1.95, 3.45, 0.16]} />
        </mesh>

        {/* Lan can đá Bạch Ngọc & Cột Vọng Trụ đầu rồng quanh Bệ Rồng */}
        {[-7.9, 7.9].map((xBal) => (
          <group key={`balustrade-side-${xBal}`} position={[xBal, 1.0, 0]}>
            <mesh material={materials.stoneBase} castShadow>
              <boxGeometry args={[0.3, 0.75, 9.2]} />
            </mesh>
            {[-4.2, -1.4, 1.4, 4.2].map((zPost) => (
              <mesh
                key={`post-${zPost}`}
                position={[0, 0.55, zPost]}
                material={materials.warmGold}
              >
                <cylinderGeometry args={[0.16, 0.2, 0.45, 10]} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Lan can bậc tam cấp dẫn lên Bệ Rồng */}
        {[-2.5, -1.05, 1.05, 2.5].map((xRail) => (
          <group key={`stair-rail-${xRail}`} position={[xRail, 1.15, 3.6]}>
            <mesh
              rotation={[0.52, 0, 0]}
              material={materials.stoneBase}
              castShadow
            >
              <boxGeometry args={[0.22, 0.42, 3.6]} />
            </mesh>
            <mesh position={[0, -0.45, 1.65]} material={materials.warmGold}>
              <cylinderGeometry args={[0.16, 0.18, 0.75, 10]} />
            </mesh>
          </group>
        ))}

        {/* Bình Phong Cửu Long 7 Bức Gấp Khúc (Folding Nine-Dragon Screen) */}
        <group position={[0, 1.82, -3.15]}>
          {/* Tấm chính giữa */}
          <mesh position={[0, 2.35, 0]} material={materials.dragonScreen} castShadow>
            <boxGeometry args={[4.4, 4.7, 0.22]} />
          </mesh>
          <mesh position={[0, 4.82, 0]} material={materials.warmGold}>
            <boxGeometry args={[4.6, 0.36, 0.32]} />
          </mesh>
          {/* Hai cánh bình phong mở góc 25 độ hai bên */}
          {[-3.15, 3.15].map((xWing) => (
            <group
              key={`screen-wing-${xWing}`}
              position={[xWing, 2.2, 0.42]}
              rotation={[0, xWing < 0 ? 0.38 : -0.38, 0]}
            >
              <mesh material={materials.dragonScreen} castShadow>
                <boxGeometry args={[2.2, 4.4, 0.2]} />
              </mesh>
              <mesh position={[0, 2.3, 0]} material={materials.warmGold}>
                <boxGeometry args={[2.35, 0.32, 0.28]} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Đôi Quạt Chướng Phiến Lông Công Hoàng Gia (Imperial Ceremonial Fans) */}
        {[-2.35, 2.35].map((xFan) => (
          <group key={`ceremonial-fan-${xFan}`} position={[xFan, 1.82, -2.2]}>
            <mesh position={[0, 1.8, 0]} material={materials.redPillar} castShadow>
              <cylinderGeometry args={[0.05, 0.06, 3.6, 10]} />
            </mesh>
            <mesh
              position={[0, 3.5, 0]}
              scale={[1, 1.25, 0.18]}
              material={materials.warmGold}
              castShadow
            >
              <sphereGeometry args={[0.68, 18, 14]} />
            </mesh>
            <mesh
              position={[0, 3.5, 0.04]}
              scale={[1, 1.25, 0.18]}
              material={materials.mutedJade}
            >
              <sphereGeometry args={[0.48, 16, 12]} />
            </mesh>
          </group>
        ))}

        {/* LONG NGAI CỬU LONG THẾP VÀNG (Imperial Dragon Throne) */}
        <group position={[0, 1.82, -1.25]}>
          {/* Đế Tu Di Tọa của Long Ngai */}
          <mesh position={[0, 0.34, 0]} material={materials.warmGold} castShadow>
            <boxGeometry args={[2.8, 0.68, 2.0]} />
          </mesh>
          <mesh position={[0, 0.34, 0.02]} material={materials.redPillar}>
            <boxGeometry args={[2.6, 0.42, 1.98]} />
          </mesh>
          {/* Đệm gấm hoàng bào */}
          <mesh position={[0, 0.74, 0.05]} material={materials.cushionBrocade}>
            <boxGeometry args={[2.2, 0.18, 1.6]} />
          </mesh>
          {/* Lưng ngai chạm Cửu Long 3 bậc */}
          <mesh position={[0, 1.72, -0.8]} material={materials.warmGold} castShadow>
            <boxGeometry args={[2.45, 2.0, 0.24]} />
          </mesh>
          <mesh position={[0, 2.9, -0.8]} material={materials.warmGold} castShadow>
            <boxGeometry args={[1.65, 0.65, 0.26]} />
          </mesh>
          {/* Hai tay vịn chạm đầu rồng */}
          {[-1.14, 1.14].map((xArm) => (
            <group key={`throne-arm-${xArm}`} position={[xArm, 1.18, 0.05]}>
              <mesh material={materials.warmGold} castShadow>
                <boxGeometry args={[0.26, 0.76, 1.72]} />
              </mesh>
              <mesh position={[0, 0.32, 0.85]} material={materials.warmGold}>
                <sphereGeometry args={[0.18, 12, 12]} />
              </mesh>
            </group>
          ))}
          {/* Bục gác chân Hoàng Đế (Bình kỷ) */}
          <mesh position={[0, 0.15, 1.3]} material={materials.warmGold}>
            <boxGeometry args={[1.6, 0.3, 0.7]} />
          </mesh>
        </group>

        {/* Đôi Tiên Hạc Đồng Cưỡi Quy Chầu Ngai (Twin Imperial Bronze Cranes) */}
        {[-2.85, 2.85].map((xCrane) => (
          <group
            key={`imperial-crane-${xCrane}`}
            position={[xCrane, 1.82, -0.35]}
            rotation={[0, xCrane < 0 ? 0.35 : -0.35, 0]}
          >
            {/* Bệ Rùa Vàng */}
            <mesh position={[0, 0.18, 0]} material={materials.warmGold} castShadow>
              <cylinderGeometry args={[0.38, 0.45, 0.36, 14]} />
            </mesh>
            {/* Đôi chân Hạc mảnh cao */}
            <mesh position={[0, 0.75, 0]} material={materials.warmGold}>
              <cylinderGeometry args={[0.045, 0.045, 0.9, 8]} />
            </mesh>
            {/* Thân Hạc đồng thếp vàng */}
            <mesh
              position={[0, 1.25, -0.05]}
              rotation={[0.35, 0, 0]}
              scale={[0.85, 1.35, 0.95]}
              material={materials.warmGold}
              castShadow
            >
              <sphereGeometry args={[0.32, 14, 12]} />
            </mesh>
            {/* Cổ Hạc vươn cao uyển chuyển */}
            <mesh
              position={[0, 1.88, 0.14]}
              rotation={[-0.18, 0, 0]}
              material={materials.warmGold}
            >
              <cylinderGeometry args={[0.055, 0.085, 0.85, 10]} />
            </mesh>
            {/* Đầu Hạc đội mũ đỏ ngậm cành sen vàng */}
            <mesh position={[0, 2.32, 0.22]} material={materials.warmGold}>
              <sphereGeometry args={[0.11, 10, 10]} />
            </mesh>
            <mesh position={[0, 2.41, 0.22]} material={materials.lanternSilk}>
              <sphereGeometry args={[0.055, 8, 8]} />
            </mesh>
            <mesh
              position={[0, 2.3, 0.42]}
              rotation={[Math.PI / 2, 0, 0]}
              material={materials.warmGold}
            >
              <coneGeometry args={[0.04, 0.35, 8]} />
            </mesh>
          </group>
        ))}

        {/* Đôi Đỉnh Hương Đồng Tam Túc (Twin Bronze Censers) ở thềm Bệ Rồng */}
        {[-3.6, 3.6].map((xBurner) => (
          <group key={`incense-burner-${xBurner}`} position={[xBurner, 0.62, 3.2]}>
            <mesh position={[0, 0.45, 0]} material={materials.warmGold} castShadow>
              <cylinderGeometry args={[0.48, 0.38, 0.9, 14]} />
            </mesh>
            <mesh position={[0, 1.1, 0]} material={materials.warmGold} castShadow>
              <sphereGeometry args={[0.56, 16, 14]} />
            </mesh>
            <mesh position={[0, 1.76, 0]} material={materials.warmGold}>
              <coneGeometry args={[0.42, 0.6, 8]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================================================================= */}
      {/* 7 & 8. WOODEN TABLES, SCROLLS & OFFICIAL CHAIRS (InstancedMesh)   */}
      {/* ================================================================= */}
      <instancedMesh
        ref={tableTopRef}
        args={[
          geometries.tableTop,
          materials.darkWood,
          MAIN_HALL_LAYOUT.officialDeskPositions.length,
        ]}
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={tableFrameRef}
        args={[
          geometries.tableSubFrame,
          materials.mediumWood,
          MAIN_HALL_LAYOUT.officialDeskPositions.length,
        ]}
        castShadow
      />
      <instancedMesh
        ref={tableScrollRef}
        args={[
          geometries.tableScroll,
          materials.warmGold,
          MAIN_HALL_LAYOUT.officialDeskPositions.length,
        ]}
      />
      <instancedMesh
        ref={chairSeatRef}
        args={[
          geometries.chairSeat,
          materials.darkWood,
          MAIN_HALL_LAYOUT.officialDeskPositions.length,
        ]}
        castShadow
      />
      <instancedMesh
        ref={chairCushionRef}
        args={[
          geometries.chairCushion,
          materials.cushionBrocade,
          MAIN_HALL_LAYOUT.officialDeskPositions.length,
        ]}
      />
      <instancedMesh
        ref={chairBackRef}
        args={[
          geometries.chairBack,
          materials.darkWood,
          MAIN_HALL_LAYOUT.officialDeskPositions.length,
        ]}
        castShadow
      />

      {/* ================================================================= */}
      {/* 9. DECORATIVE LANTERNS & SILK BANNERS (InstancedMesh)             */}
      {/* ================================================================= */}
      <instancedMesh
        ref={lanternCordRef}
        args={[
          geometries.lanternCord,
          materials.darkWood,
          MAIN_HALL_LAYOUT.lanternPositions.length,
        ]}
      />
      <instancedMesh
        ref={lanternBodyRef}
        args={[
          geometries.lanternBody,
          materials.lanternSilk,
          MAIN_HALL_LAYOUT.lanternPositions.length,
        ]}
      />
      <instancedMesh
        ref={lanternCapRef}
        args={[
          geometries.lanternCap,
          materials.warmGold,
          MAIN_HALL_LAYOUT.lanternPositions.length,
        ]}
      />
      <instancedMesh
        ref={lanternTasselRef}
        args={[
          geometries.lanternTassel,
          materials.warmGold,
          MAIN_HALL_LAYOUT.lanternPositions.length,
        ]}
      />
      <instancedMesh
        ref={bannerRef}
        args={[
          geometries.bannerCloth,
          materials.silkBanner,
          MAIN_HALL_LAYOUT.silkBannerPositions.length,
        ]}
      />

      {/* ================================================================= */}
      {/* 10. TRADITIONAL ORNAMENTS (10 Bình hoa sứ Thanh Hoa trên đôn gỗ)  */}
      {/* ================================================================= */}
      <instancedMesh
        ref={vaseStandRef}
        args={[
          geometries.vaseStand,
          materials.darkWood,
          MAIN_HALL_LAYOUT.vasePositions.length,
        ]}
        castShadow
      />
      <instancedMesh
        ref={vaseBodyRef}
        args={[
          geometries.porcelainVase,
          materials.porcelainVase,
          MAIN_HALL_LAYOUT.vasePositions.length,
        ]}
        castShadow
      />
    </group>
  );
};
