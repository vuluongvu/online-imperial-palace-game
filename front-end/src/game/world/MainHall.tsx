import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createPalaceMaterialSet } from '../assets/PalaceMaterials';
import { useGameStore } from '../../stores/useGameStore';
import { MAIN_HALL_LAYOUT } from './hallLayout';

export { MAIN_HALL_LAYOUT };

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
    const pillarCapitalLower = new THREE.BoxGeometry(1.35, 0.42, 1.35);
    const pillarCapitalUpper = new THREE.BoxGeometry(1.75, 0.45, 1.75);

    const tableTop = new THREE.BoxGeometry(1.18, 0.14, 1.95);
    const tableSubFrame = new THREE.BoxGeometry(0.98, 0.68, 1.75);
    const tableScroll = new THREE.CylinderGeometry(0.055, 0.055, 0.55, 10);
    // Nghiên mực đá Đoan Khê, Giá bút lông & Bình hoa Pháp Lam trên bàn quan viên
    const tableInkstone = new THREE.BoxGeometry(0.24, 0.045, 0.32);
    const tableBrushStand = new THREE.BoxGeometry(0.08, 0.22, 0.26);
    const tableMiniVase = new THREE.CylinderGeometry(0.07, 0.09, 0.28, 10);

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
      tableInkstone,
      tableBrushStand,
      tableMiniVase,
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
        tableInkstone.dispose();
        tableBrushStand.dispose();
        tableMiniVase.dispose();
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

  const redPillarShaftRef = useRef<THREE.InstancedMesh>(null);
  const goldPillarShaftRef = useRef<THREE.InstancedMesh>(null);
  const pillarBaseRef = useRef<THREE.InstancedMesh>(null);
  const pillarRingRef = useRef<THREE.InstancedMesh>(null);
  const pillarCapLowerRef = useRef<THREE.InstancedMesh>(null);
  const pillarCapUpperRef = useRef<THREE.InstancedMesh>(null);

  const tableTopRef = useRef<THREE.InstancedMesh>(null);
  const tableFrameRef = useRef<THREE.InstancedMesh>(null);
  const tableScrollRef = useRef<THREE.InstancedMesh>(null);
  const tableInkstoneRef = useRef<THREE.InstancedMesh>(null);
  const tableBrushStandRef = useRef<THREE.InstancedMesh>(null);
  const tableMiniVaseRef = useRef<THREE.InstancedMesh>(null);
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

    // 2. 12 Bộ Án Thư Bá Quan Văn Võ + Tấu chương, Nghiên mực, Giá bút, Bình hoa Pháp Lam
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

      // Cuộn tấu chương vàng
      dummy.position.set(x, 0.89, z - 0.15);
      dummy.rotation.set(0, 0, Math.PI / 2);
      dummy.updateMatrix();
      tableScrollRef.current?.setMatrixAt(idx, dummy.matrix);

      // Nghiên mực đá Đoan Khê
      dummy.position.set(x + (x < 0 ? 0.18 : -0.18), 0.87, z + 0.38);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      tableInkstoneRef.current?.setMatrixAt(idx, dummy.matrix);

      // Giá gác bút lông
      dummy.position.set(x + (x < 0 ? -0.18 : 0.18), 0.96, z + 0.42);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      tableBrushStandRef.current?.setMatrixAt(idx, dummy.matrix);

      // Bình hoa Pháp Lam nhỏ trên góc bàn án
      dummy.position.set(x + (x < 0 ? 0.25 : -0.25), 0.98, z - 0.58);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      tableMiniVaseRef.current?.setMatrixAt(idx, dummy.matrix);

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
    if (tableInkstoneRef.current) tableInkstoneRef.current.instanceMatrix.needsUpdate = true;
    if (tableBrushStandRef.current) tableBrushStandRef.current.instanceMatrix.needsUpdate = true;
    if (tableMiniVaseRef.current) tableMiniVaseRef.current.instanceMatrix.needsUpdate = true;
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

      {/* Chiếu Cạp Điều / Thảm lót dưới khu vực hai hàng Án Thư Bá Quan Văn Võ */}
      {[-4.3, 4.3].map((xMat) => (
        <mesh
          key={`official-floor-mat-${xMat}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[xMat, 0.014, 1.8]}
          receiveShadow
          material={materials.redCarpet}
        >
          <planeGeometry args={[2.8, 21.5]} />
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

      {/* Bức Đại Tự Hoành Phi chính "THÁI HÒA ĐIỆN" treo giữa 2 Cột Rồng Vàng trên Long Ngai */}
      <group position={[0, 8.85, -12.9]}>
        <mesh material={materials.warmGold} castShadow>
          <boxGeometry args={[7.6, 1.95, 0.28]} />
        </mesh>
        <mesh position={[0, 0, 0.15]} material={materials.imperialPlaque}>
          <planeGeometry args={[7.2, 1.65]} />
        </mesh>
      </group>

      {/* Các bức Hoành Phi phụ tại Tiền Điện (Z = +6.5) & Trung Điện (Z = -1.0) */}
      {[-1.0, 6.5].map((zPlaque) => (
        <group key={`hall-plaque-${zPlaque}`} position={[0, 9.55, zPlaque]}>
          <mesh material={materials.warmGold} castShadow>
            <boxGeometry args={[5.8, 1.35, 0.24]} />
          </mesh>
          <mesh position={[0, 0, 0.14]} material={materials.imperialPlaque}>
            <planeGeometry args={[5.4, 1.08]} />
          </mesh>
        </group>
      ))}

      {/* ================================================================= */}
      {/* HỆ THỐNG LIÊN BA "NHẤT THI NHẤT HỌA" & KẾT CẤU VÌ KÈO GỖ HUẾ      */}
      {/* ================================================================= */}
      {[-13.0, -8.5, -1.0, 6.5, 14.0].map((zPos) => (
        <group key={`crossbeam-${zPos}`} position={[0, 10.75, zPos]}>
          {/* Xà ngang chính */}
          <mesh material={materials.paintedBeam} castShadow>
            <boxGeometry args={[31.6, 0.62, 0.58]} />
          </mesh>
          {/* Dải ô hộc Nhất Thi Nhất Họa (Một bài thơ - Một bức họa) dưới xà ngang */}
          <mesh position={[0, -0.58, 0]} material={materials.nhatThiNhatHoa}>
            <boxGeometry args={[31.4, 0.56, 0.38]} />
          </mesh>
          <mesh position={[0, -0.9, 0]} material={materials.warmGold}>
            <boxGeometry args={[31.4, 0.08, 0.44]} />
          </mesh>

          {/* Kết cấu Vì Kèo "Chồng Rường – Giả Thủ" & Kẻ Chuyền gỗ lim dưới mái */}
          {[-10.8, 0, 10.8].map((xTruss, tIdx) => (
            <group key={`truss-${tIdx}`} position={[xTruss, 0.45, 0]}>
              <mesh material={materials.darkWood}>
                <boxGeometry args={[4.8, 0.28, 0.34]} />
              </mesh>
              <mesh position={[-1.4, -0.25, 0]} material={materials.warmGold}>
                <cylinderGeometry args={[0.14, 0.18, 0.38, 10]} />
              </mesh>
              <mesh position={[1.4, -0.25, 0]} material={materials.warmGold}>
                <cylinderGeometry args={[0.14, 0.18, 0.38, 10]} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Dầm dọc & Liên ba Nhất Thi Nhất Họa nối các hàng cột Nội điện (X = ±8.2m) & Ngoại điện (X = ±13.6m) */}
      {[-13.6, -8.2, 8.2, 13.6].map((xPos) => (
        <group key={`longbeam-${xPos}`} position={[xPos, 10.8, 0]}>
          <mesh material={materials.paintedBeam}>
            <boxGeometry args={[0.56, 0.58, 43.6]} />
          </mesh>
          <mesh position={[0, -0.55, 0]} material={materials.nhatThiNhatHoa}>
            <boxGeometry args={[0.38, 0.52, 43.6]} />
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

      {/* Hệ thống Đòn Tay / Rui Mè gỗ lim nhìn thấy dưới trần tạo chiều sâu mái cổ */}
      {[-12, -8, -4, 0, 4, 8, 12].map((xRafter) => (
        <mesh
          key={`ceiling-rafter-${xRafter}`}
          position={[xRafter, MAIN_HALL_LAYOUT.wallHeight - 0.08, 0]}
          material={materials.darkWood}
        >
          <boxGeometry args={[0.18, 0.16, 43.8]} />
        </mesh>
      ))}

      {/* Tảo Tỉnh Bát Giác Thếp Vàng & Hiên Viên Kính (Caisson Dome ngay trên Long Ngai) */}
      <group position={[0, 11.4, -16.8]}>
        <mesh position={[0, -0.15, 0]} material={materials.redPillar}>
          <boxGeometry args={[7.8, 0.35, 7.2]} />
        </mesh>
        <mesh position={[0, -0.45, 0]} material={materials.warmGold}>
          <cylinderGeometry args={[2.8, 3.3, 0.45, 8]} />
        </mesh>
        <mesh position={[0, -0.82, 0]} material={materials.paintedBeam}>
          <cylinderGeometry args={[1.9, 2.5, 0.42, 8]} />
        </mesh>
        <mesh position={[0, -1.12, 0]} material={materials.warmGold}>
          <cylinderGeometry args={[0.9, 1.7, 0.35, 16]} />
        </mesh>
        <mesh position={[0, -1.55, 0]} material={materials.warmGold}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        </mesh>
        <mesh position={[0, -1.95, 0]} material={materials.warmGold} castShadow>
          <sphereGeometry args={[0.38, 20, 20]} />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 4. PALACE WALLS & CONNECTING DOORS TO SIDE WINGS & REAR HALL      */}
      {/* (Mở các Cửa Gỗ Cung Đình tại X = ±16m và Z = -22m để đi qua)      */}
      {/* ================================================================= */}
      {/* Tường Bắc (Z = -22m, có 2 Cửa Hậu Điện tại X = -10.5m và X = +10.5m) */}
      <group position={[0, 0, -22]}>
        {/* Đoạn tường Bắc trung tâm phía sau Bình Phong Cửu Long (X từ -8.7 đến +8.7) */}
        <mesh position={[0, 1.8, 0]} material={materials.carvedWallPanel} receiveShadow>
          <boxGeometry args={[17.4, 3.6, 0.6]} />
        </mesh>
        {/* Hai đoạn tường Bắc ngoài cùng (X từ ±12.3 đến ±16.0) */}
        {[-14.15, 14.15].map((xOuter) => (
          <mesh
            key={`north-outer-wall-${xOuter}`}
            position={[xOuter, 1.8, 0]}
            material={materials.carvedWallPanel}
            receiveShadow
          >
            <boxGeometry args={[3.7, 3.6, 0.6]} />
          </mesh>
        ))}

        {/* Phần tường trên (Y từ 4.2m lên 11.5m chạy suốt chiều ngang 32m) */}
        <mesh position={[0, 7.4, 0]} material={materials.creamWall} receiveShadow>
          <boxGeometry args={[32, 6.4, 0.5]} />
        </mesh>
        <mesh position={[0, 10.8, 0.1]} material={materials.nhatThiNhatHoa}>
          <boxGeometry args={[32, 1.2, 0.65]} />
        </mesh>

        {/* 2 Bộ Khung Cửa Gỗ Cung Đình Hậu Điện (X = -10.5m & X = +10.5m, rộng 3.4m mở thông ra Hậu Sảnh) */}
        {[-10.5, 10.5].map((xDoor) => (
          <group key={`rear-door-${xDoor}`} position={[xDoor, 0, 0]}>
            {/* Khung bao cửa gỗ sơn son thếp vàng */}
            <mesh position={[-1.75, 2.2, 0]} material={materials.redPillar} castShadow>
              <boxGeometry args={[0.28, 4.4, 0.72]} />
            </mesh>
            <mesh position={[1.75, 2.2, 0]} material={materials.redPillar} castShadow>
              <boxGeometry args={[0.28, 4.4, 0.72]} />
            </mesh>
            <mesh position={[0, 4.3, 0]} material={materials.warmGold}>
              <boxGeometry args={[3.9, 0.38, 0.78]} />
            </mesh>
            {/* Biển ngạch trên cửa hậu */}
            <mesh position={[0, 4.85, 0.32]} material={materials.imperialPlaque}>
              <boxGeometry args={[2.6, 0.72, 0.12]} />
            </mesh>
            {/* Hai cánh cửa bức bàn mở rộng về phía Hậu Điện */}
            {[-1.55, 1.55].map((leafX, lIdx) => (
              <group
                key={`rear-leaf-${lIdx}`}
                position={[leafX, 2.05, -0.25]}
                rotation={[0, leafX < 0 ? 1.22 : -1.22, 0]}
              >
                <mesh
                  position={[leafX < 0 ? 0.72 : -0.72, 0, 0]}
                  material={materials.carvedWallPanel}
                  castShadow
                >
                  <boxGeometry args={[1.44, 4.1, 0.14]} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* Tường Tây (X = -16m) & Tường Đông (X = +16m) có 2 Cửa Cung Đình mỗi bên tại Z = -5.0m và Z = +5.0m */}
      {[-16, 16].map((xWall) => {
        const inwardSign = xWall < 0 ? 1 : -1;
        // 3 đoạn tường thấp chừa trống 2 khoang cửa rộng 3.4m tại Z = -5.0m và Z = +5.0m:
        // Đoạn 1: Z từ -22 đến -6.7 (dài 15.3, tâm -14.35)
        // Đoạn 2: Z từ -3.3 đến +3.3 (dài 6.6, tâm 0.0)
        // Đoạn 3: Z từ +6.7 đến +22 (dài 15.3, tâm +14.35)
        const lowerSegments = [
          { centerZ: -14.35, len: 15.3 },
          { centerZ: 0.0, len: 6.6 },
          { centerZ: 14.35, len: 15.3 },
        ];

        return (
          <group key={`side-wall-${xWall}`} position={[xWall, 0, 0]}>
            {/* Các đoạn tường vách gỗ chạm rồng phía dưới */}
            {lowerSegments.map((seg, sIdx) => (
              <mesh
                key={`low-seg-${sIdx}`}
                position={[0, 2.1, seg.centerZ]}
                material={materials.carvedWallPanel}
                receiveShadow
              >
                <boxGeometry args={[0.6, 4.2, seg.len]} />
              </mesh>
            ))}

            {/* Phần tường kem phía trên (Y từ 4.2m lên 11.5m) */}
            <mesh position={[0, 7.4, 0]} material={materials.creamWall} receiveShadow>
              <boxGeometry args={[0.5, 6.4, 44]} />
            </mesh>
            {/* Dải Liên Ba Nhất Thi Nhất Họa chạy dọc đỉnh tường Đông/Tây */}
            <mesh
              position={[inwardSign * 0.12, 10.75, 0]}
              material={materials.nhatThiNhatHoa}
            >
              <boxGeometry args={[0.55, 1.1, 44]} />
            </mesh>

            {/* Các bổ trụ tường màu đỏ theo từng gian */}
            {[-14, -8.5, -1.0, 6.5, 14].map((zPilaster) => (
              <mesh
                key={`pilaster-${xWall}-${zPilaster}`}
                position={[inwardSign * 0.26, 5.75, zPilaster]}
                material={materials.redPillar}
              >
                <boxGeometry args={[0.25, 11.5, 0.55]} />
              </mesh>
            ))}

            {/* Cửa sổ song hoa cổ trang đón nắng ở tầng trên */}
            {[-11.2, 0.0, 11.2].map((zWin) => (
              <mesh
                key={`window-${xWall}-${zWin}`}
                position={[inwardSign * 0.28, 6.6, zWin]}
                rotation={[0, xWall < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
                material={materials.latticeWindow}
              >
                <planeGeometry args={[4.8, 3.2]} />
              </mesh>
            ))}

            {/* 2 Bộ Cửa Gỗ Cung Đình Kết Nối Hành Lang & Gian Phụ (tại Z = -5.0m và Z = +5.0m) */}
            {[-5.0, 5.0].map((zDoor) => (
              <group key={`side-door-${xWall}-${zDoor}`} position={[0, 0, zDoor]}>
                {/* Hai đố cửa gỗ đỏ */}
                <mesh position={[0, 2.2, -1.75]} material={materials.redPillar} castShadow>
                  <boxGeometry args={[0.72, 4.4, 0.28]} />
                </mesh>
                <mesh position={[0, 2.2, 1.75]} material={materials.redPillar} castShadow>
                  <boxGeometry args={[0.72, 4.4, 0.28]} />
                </mesh>
                {/* Mi cửa thếp vàng */}
                <mesh position={[0, 4.3, 0]} material={materials.warmGold}>
                  <boxGeometry args={[0.78, 0.38, 3.9]} />
                </mesh>
                {/* Hoành phi nhỏ trên cửa thông sang Đông/Tây Phối Điện */}
                <mesh
                  position={[inwardSign * 0.34, 4.95, 0]}
                  material={materials.imperialPlaque}
                >
                  <boxGeometry args={[0.12, 0.72, 2.8]} />
                </mesh>
                {/* Hai cánh cửa bức bàn mở thông ra Hành Lang */}
                {[-1.55, 1.55].map((leafZ, lIdx) => (
                  <group
                    key={`side-leaf-${lIdx}`}
                    position={[-inwardSign * 0.22, 2.05, leafZ]}
                    rotation={[
                      0,
                      leafZ < 0 ? -inwardSign * 1.18 : inwardSign * 1.18,
                      0,
                    ]}
                  >
                    <mesh
                      position={[0, 0, leafZ < 0 ? 0.72 : -0.72]}
                      material={materials.carvedWallPanel}
                      castShadow
                    >
                      <boxGeometry args={[0.14, 4.1, 1.44]} />
                    </mesh>
                  </group>
                ))}
              </group>
            ))}
          </group>
        );
      })}

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
      {/* 5. IMPERIAL THRONE DAIS, BỬU TÁN HUẾ & NGỰ ÁN HOÀNG ĐẾ           */}
      {/* (Giữ nguyên 100% vị trí Bệ Rồng và Long Ngai)                     */}
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
        {/* Phù điêu Rồng chạm nổi mặt trước Bệ Rồng cấp 1 */}
        {[-5.2, 5.2].map((xRel) => (
          <mesh
            key={`dais-relief-1-${xRel}`}
            position={[xRel, 0.3, 4.82]}
            material={materials.nhatThiNhatHoa}
          >
            <planeGeometry args={[4.6, 0.44]} />
          </mesh>
        ))}

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

        {/* Bậc Tam Cấp Ngự Đạo */}
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

        {/* Bình Phong Cửu Long 7 Bức Gấp Khúc */}
        <group position={[0, 1.82, -3.15]}>
          <mesh position={[0, 2.35, 0]} material={materials.dragonScreen} castShadow>
            <boxGeometry args={[4.4, 4.7, 0.22]} />
          </mesh>
          <mesh position={[0, 4.82, 0]} material={materials.warmGold}>
            <boxGeometry args={[4.6, 0.36, 0.32]} />
          </mesh>
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

        {/* Đôi Quạt Chướng Phiến Lông Công Hoàng Gia */}
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

        {/* LONG NGAI CỬU LONG THẾP VÀNG (Giữ nguyên vị trí [0, 1.82, -1.25]) */}
        <group position={[0, 1.82, -1.25]}>
          <mesh position={[0, 0.34, 0]} material={materials.warmGold} castShadow>
            <boxGeometry args={[2.8, 0.68, 2.0]} />
          </mesh>
          <mesh position={[0, 0.34, 0.02]} material={materials.redPillar}>
            <boxGeometry args={[2.6, 0.42, 1.98]} />
          </mesh>
          <mesh position={[0, 0.74, 0.05]} material={materials.cushionBrocade}>
            <boxGeometry args={[2.2, 0.18, 1.6]} />
          </mesh>
          <mesh position={[0, 1.72, -0.8]} material={materials.warmGold} castShadow>
            <boxGeometry args={[2.45, 2.0, 0.24]} />
          </mesh>
          <mesh position={[0, 2.9, -0.8]} material={materials.warmGold} castShadow>
            <boxGeometry args={[1.65, 0.65, 0.26]} />
          </mesh>
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
          <mesh position={[0, 0.15, 1.3]} material={materials.warmGold}>
            <boxGeometry args={[1.6, 0.3, 0.7]} />
          </mesh>
        </group>

        {/* BỬU TÁN HOÀNG KIM THÊU CỬU LONG (Đặc trưng Điện Thái Hòa – Huế) treo trên Long Ngai */}
        <group position={[0, 6.25, -1.25]}>
          {/* Vòm Bửu Tán thếp vàng */}
          <mesh material={materials.warmGold} castShadow>
            <boxGeometry args={[3.9, 0.36, 3.1]} />
          </mesh>
          <mesh position={[0, 0.34, 0]} material={materials.redPillar}>
            <boxGeometry args={[2.8, 0.32, 2.2]} />
          </mesh>
          {/* Diềm gấm thêu rồng rủ 4 phía của Bửu Tán */}
          <mesh position={[0, -0.36, 1.52]} material={materials.buuTanCanopy}>
            <planeGeometry args={[3.85, 0.58]} />
          </mesh>
          <mesh
            position={[0, -0.36, -1.52]}
            rotation={[0, Math.PI, 0]}
            material={materials.buuTanCanopy}
          >
            <planeGeometry args={[3.85, 0.58]} />
          </mesh>
          <mesh
            position={[-1.92, -0.36, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            material={materials.buuTanCanopy}
          >
            <planeGeometry args={[3.05, 0.58]} />
          </mesh>
          <mesh
            position={[1.92, -0.36, 0]}
            rotation={[0, Math.PI / 2, 0]}
            material={materials.buuTanCanopy}
          >
            <planeGeometry args={[3.05, 0.58]} />
          </mesh>
          {/* 4 Tua rua ngọc rủ ở 4 góc Bửu Tán */}
          {[
            [-1.85, -0.7, 1.45],
            [1.85, -0.7, 1.45],
            [-1.85, -0.7, -1.45],
            [1.85, -0.7, -1.45],
          ].map(([tx, ty, tz], idx) => (
            <mesh
              key={`buutan-tassel-${idx}`}
              position={[tx, ty, tz]}
              rotation={[Math.PI, 0, 0]}
              material={materials.lanternSilk}
            >
              <coneGeometry args={[0.12, 0.45, 8]} />
            </mesh>
          ))}
        </group>

        {/* NGỰ ÁN SƠN SON THẾP VÀNG (Án thư của Hoàng Đế kèm Ấn Ngọc, Nghiên Mực, Bình Hoa) */}
        <group position={[1.95, 1.82, 0.35]} rotation={[0, -0.35, 0]}>
          <mesh position={[0, 0.78, 0]} material={materials.warmGold} castShadow>
            <boxGeometry args={[1.45, 0.14, 0.85]} />
          </mesh>
          <mesh position={[0, 0.4, 0]} material={materials.redPillar} castShadow>
            <boxGeometry args={[1.28, 0.68, 0.7]} />
          </mesh>
          {/* Ấn Vàng "Hoàng Đế Chi Bảo" */}
          <mesh position={[-0.35, 0.94, 0]} material={materials.warmGold}>
            <boxGeometry args={[0.24, 0.18, 0.24]} />
          </mesh>
          {/* Nghiên mực đá & Giá bút lông Ngự dụng */}
          <mesh position={[0.05, 0.88, 0.12]} material={materials.darkWood}>
            <boxGeometry args={[0.26, 0.05, 0.2]} />
          </mesh>
          <mesh position={[0.05, 0.98, -0.14]} material={materials.warmGold}>
            <boxGeometry args={[0.28, 0.22, 0.06]} />
          </mesh>
          {/* Bình hoa Pháp Lam Huế trên Ngự Án */}
          <mesh position={[0.45, 1.04, -0.1]} material={materials.porcelainVase} castShadow>
            <cylinderGeometry args={[0.1, 0.13, 0.38, 12]} />
          </mesh>
        </group>

        {/* Đôi Tiên Hạc Đồng Cưỡi Quy Chầu Ngai */}
        {[-2.85, 2.85].map((xCrane) => (
          <group
            key={`imperial-crane-${xCrane}`}
            position={[xCrane, 1.82, -0.35]}
            rotation={[0, xCrane < 0 ? 0.35 : -0.35, 0]}
          >
            <mesh position={[0, 0.18, 0]} material={materials.warmGold} castShadow>
              <cylinderGeometry args={[0.38, 0.45, 0.36, 14]} />
            </mesh>
            <mesh position={[0, 0.75, 0]} material={materials.warmGold}>
              <cylinderGeometry args={[0.045, 0.045, 0.9, 8]} />
            </mesh>
            <mesh
              position={[0, 1.25, -0.05]}
              rotation={[0.35, 0, 0]}
              scale={[0.85, 1.35, 0.95]}
              material={materials.warmGold}
              castShadow
            >
              <sphereGeometry args={[0.32, 14, 12]} />
            </mesh>
            <mesh
              position={[0, 1.88, 0.14]}
              rotation={[-0.18, 0, 0]}
              material={materials.warmGold}
            >
              <cylinderGeometry args={[0.055, 0.085, 0.85, 10]} />
            </mesh>
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

        {/* Đôi Đỉnh Hương Đồng Tam Túc ở thềm Bệ Rồng */}
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
      {/* 7 & 8. WOODEN TABLES, INKSTONES, VASES & OFFICIAL CHAIRS          */}
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
        ref={tableInkstoneRef}
        args={[
          geometries.tableInkstone,
          materials.darkWood,
          MAIN_HALL_LAYOUT.officialDeskPositions.length,
        ]}
      />
      <instancedMesh
        ref={tableBrushStandRef}
        args={[
          geometries.tableBrushStand,
          materials.warmGold,
          MAIN_HALL_LAYOUT.officialDeskPositions.length,
        ]}
      />
      <instancedMesh
        ref={tableMiniVaseRef}
        args={[
          geometries.tableMiniVase,
          materials.porcelainVase,
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
