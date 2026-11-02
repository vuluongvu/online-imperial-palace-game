import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createPalaceMaterialSet } from '../assets/PalaceMaterials';
import { useGameStore } from '../../stores/useGameStore';

/**
 * Kích thước & tọa độ bố cục Chính Điện (Imperial Main Hall)
 * Xuất dữ liệu để tái sử dụng cho hệ thống Physics/Collision ở Phase 2.
 */
export const MAIN_HALL_LAYOUT = {
  width: 32,
  length: 44,
  wallHeight: 11.5,
  pillarPositions: [
    // Hàng cột nội điện bên trái (X = -6.2)
    [-6.2, 0, -13.5],
    [-6.2, 0, -4.5],
    [-6.2, 0, 4.5],
    [-6.2, 0, 13.5],
    // Hàng cột nội điện bên phải (X = +6.2)
    [6.2, 0, -13.5],
    [6.2, 0, -4.5],
    [6.2, 0, 4.5],
    [6.2, 0, 13.5],
    // Hàng cột ngoại điện bên trái (X = -12.6)
    [-12.6, 0, -13.5],
    [-12.6, 0, -4.5],
    [-12.6, 0, 4.5],
    [-12.6, 0, 13.5],
    // Hàng cột ngoại điện bên phải (X = +12.6)
    [12.6, 0, -13.5],
    [12.6, 0, -4.5],
    [12.6, 0, 4.5],
    [12.6, 0, 13.5],
  ] as [number, number, number][],
  officialDeskPositions: [
    // Hàng quan văn bên trái hướng mặt vào Ngự Đạo (X = -4.0)
    { pos: [-4.0, 0, -7.5] as [number, number, number], rotY: Math.PI / 2 },
    { pos: [-4.0, 0, -4.0] as [number, number, number], rotY: Math.PI / 2 },
    { pos: [-4.0, 0, -0.5] as [number, number, number], rotY: Math.PI / 2 },
    { pos: [-4.0, 0, 3.0] as [number, number, number], rotY: Math.PI / 2 },
    { pos: [-4.0, 0, 6.5] as [number, number, number], rotY: Math.PI / 2 },
    { pos: [-4.0, 0, 10.0] as [number, number, number], rotY: Math.PI / 2 },
    // Hàng quan võ bên phải hướng mặt vào Ngự Đạo (X = +4.0)
    { pos: [4.0, 0, -7.5] as [number, number, number], rotY: -Math.PI / 2 },
    { pos: [4.0, 0, -4.0] as [number, number, number], rotY: -Math.PI / 2 },
    { pos: [4.0, 0, -0.5] as [number, number, number], rotY: -Math.PI / 2 },
    { pos: [4.0, 0, 3.0] as [number, number, number], rotY: -Math.PI / 2 },
    { pos: [4.0, 0, 6.5] as [number, number, number], rotY: -Math.PI / 2 },
    { pos: [4.0, 0, 10.0] as [number, number, number], rotY: -Math.PI / 2 },
  ],
  lanternPositions: [
    [-5.0, 8.6, -11.5],
    [-5.0, 8.6, -6.5],
    [-5.0, 8.6, -1.5],
    [-5.0, 8.6, 3.5],
    [-5.0, 8.6, 8.5],
    [-5.0, 8.6, 13.5],
    [5.0, 8.6, -11.5],
    [5.0, 8.6, -6.5],
    [5.0, 8.6, -1.5],
    [5.0, 8.6, 3.5],
    [5.0, 8.6, 8.5],
    [5.0, 8.6, 13.5],
  ] as [number, number, number][],
  vasePositions: [
    [-9.2, 0, -12.0],
    [9.2, 0, -12.0],
    [-9.2, 0, -4.5],
    [9.2, 0, -4.5],
    [-9.2, 0, 4.5],
    [9.2, 0, 4.5],
    [-9.2, 0, 13.0],
    [9.2, 0, 13.0],
  ] as [number, number, number][],
};

export const MainHall: React.FC = () => {
  const showWireframe = useGameStore((s) => s.showWireframe);
  const lanternAnimationEnabled = useGameStore((s) => s.lanternAnimationEnabled);

  // Khởi tạo bộ vật liệu dùng chung và tự động dispose khi unmount
  const materials = useMemo(() => createPalaceMaterialSet(showWireframe), [showWireframe]);

  useEffect(() => {
    return () => {
      materials.dispose();
    };
  }, [materials]);

  // Shared Geometries cho InstancedMesh (dispose tự động khi unmount)
  const geometries = useMemo(() => {
    const pillarShaft = new THREE.CylinderGeometry(0.46, 0.5, 10.6, 20);
    const pillarBase = new THREE.CylinderGeometry(0.64, 0.74, 0.55, 16);
    const pillarGoldRing = new THREE.CylinderGeometry(0.52, 0.52, 0.24, 20);
    const pillarCapital = new THREE.BoxGeometry(1.45, 0.65, 1.45);

    const tableTop = new THREE.BoxGeometry(1.15, 0.14, 1.9);
    const tableSubFrame = new THREE.BoxGeometry(0.95, 0.25, 1.7);

    const chairSeat = new THREE.BoxGeometry(0.82, 0.12, 0.82);
    const chairBack = new THREE.BoxGeometry(0.1, 1.05, 0.78);
    const chairCushion = new THREE.BoxGeometry(0.7, 0.08, 0.7);

    const lanternBody = new THREE.SphereGeometry(0.46, 16, 12);
    lanternBody.scale(1, 1.25, 1);
    const lanternCap = new THREE.CylinderGeometry(0.28, 0.32, 0.18, 12);
    const lanternCord = new THREE.CylinderGeometry(0.025, 0.025, 2.2, 8);

    // Bình hoa sứ cổ trang bằng LatheGeometry
    const vasePoints = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.28, 0.0),
      new THREE.Vector2(0.24, 0.18),
      new THREE.Vector2(0.42, 0.58),
      new THREE.Vector2(0.38, 0.96),
      new THREE.Vector2(0.18, 1.22),
      new THREE.Vector2(0.26, 1.42),
      new THREE.Vector2(0.22, 1.45),
    ];
    const porcelainVase = new THREE.LatheGeometry(vasePoints, 18);
    const vaseStand = new THREE.CylinderGeometry(0.36, 0.42, 0.55, 12);

    return {
      pillarShaft,
      pillarBase,
      pillarGoldRing,
      pillarCapital,
      tableTop,
      tableSubFrame,
      chairSeat,
      chairBack,
      chairCushion,
      lanternBody,
      lanternCap,
      lanternCord,
      porcelainVase,
      vaseStand,
      dispose: () => {
        pillarShaft.dispose();
        pillarBase.dispose();
        pillarGoldRing.dispose();
        pillarCapital.dispose();
        tableTop.dispose();
        tableSubFrame.dispose();
        chairSeat.dispose();
        chairBack.dispose();
        chairCushion.dispose();
        lanternBody.dispose();
        lanternCap.dispose();
        lanternCord.dispose();
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

  // Refs cho các InstancedMesh
  const pillarShaftRef = useRef<THREE.InstancedMesh>(null);
  const pillarBaseRef = useRef<THREE.InstancedMesh>(null);
  const pillarRingRef = useRef<THREE.InstancedMesh>(null);
  const pillarCapitalRef = useRef<THREE.InstancedMesh>(null);

  const tableTopRef = useRef<THREE.InstancedMesh>(null);
  const tableFrameRef = useRef<THREE.InstancedMesh>(null);
  const chairSeatRef = useRef<THREE.InstancedMesh>(null);
  const chairBackRef = useRef<THREE.InstancedMesh>(null);
  const chairCushionRef = useRef<THREE.InstancedMesh>(null);

  const lanternBodyRef = useRef<THREE.InstancedMesh>(null);
  const lanternCapRef = useRef<THREE.InstancedMesh>(null);
  const lanternCordRef = useRef<THREE.InstancedMesh>(null);

  const vaseStandRef = useRef<THREE.InstancedMesh>(null);
  const vaseBodyRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Thiết lập ma trận tĩnh cho Cột, Bàn ghế, Bình hoa
  useEffect(() => {
    // 1. 16 Cột gỗ đỏ hoàng cung
    MAIN_HALL_LAYOUT.pillarPositions.forEach(([x, , z], idx) => {
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);

      dummy.position.set(x, 5.55, z);
      dummy.updateMatrix();
      pillarShaftRef.current?.setMatrixAt(idx, dummy.matrix);

      dummy.position.set(x, 0.275, z);
      dummy.updateMatrix();
      pillarBaseRef.current?.setMatrixAt(idx, dummy.matrix);

      dummy.position.set(x, 0.68, z);
      dummy.updateMatrix();
      pillarRingRef.current?.setMatrixAt(idx, dummy.matrix);

      dummy.position.set(x, 10.65, z);
      dummy.updateMatrix();
      pillarCapitalRef.current?.setMatrixAt(idx, dummy.matrix);
    });

    if (pillarShaftRef.current) pillarShaftRef.current.instanceMatrix.needsUpdate = true;
    if (pillarBaseRef.current) pillarBaseRef.current.instanceMatrix.needsUpdate = true;
    if (pillarRingRef.current) pillarRingRef.current.instanceMatrix.needsUpdate = true;
    if (pillarCapitalRef.current) pillarCapitalRef.current.instanceMatrix.needsUpdate = true;

    // 2. 12 Bộ bàn ghế quan viên
    MAIN_HALL_LAYOUT.officialDeskPositions.forEach(({ pos, rotY }, idx) => {
      const [x, , z] = pos;
      const chairOffsetX = x < 0 ? -1.05 : 1.05;

      // Mặt bàn gỗ
      dummy.position.set(x, 0.78, z);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      tableTopRef.current?.setMatrixAt(idx, dummy.matrix);

      // Khung chân bàn
      dummy.position.set(x, 0.39, z);
      dummy.updateMatrix();
      tableFrameRef.current?.setMatrixAt(idx, dummy.matrix);

      // Mặt ghế quan viên
      dummy.position.set(x + chairOffsetX, 0.46, z);
      dummy.rotation.set(0, rotY, 0);
      dummy.updateMatrix();
      chairSeatRef.current?.setMatrixAt(idx, dummy.matrix);

      // Đệm gấm đỏ trên ghế
      dummy.position.set(x + chairOffsetX, 0.55, z);
      dummy.rotation.set(0, rotY, 0);
      dummy.updateMatrix();
      chairCushionRef.current?.setMatrixAt(idx, dummy.matrix);

      // Lưng tựa ghế thái sư
      const backShift = x < 0 ? -0.36 : 0.36;
      dummy.position.set(x + chairOffsetX + backShift, 0.96, z);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      chairBackRef.current?.setMatrixAt(idx, dummy.matrix);
    });

    if (tableTopRef.current) tableTopRef.current.instanceMatrix.needsUpdate = true;
    if (tableFrameRef.current) tableFrameRef.current.instanceMatrix.needsUpdate = true;
    if (chairSeatRef.current) chairSeatRef.current.instanceMatrix.needsUpdate = true;
    if (chairCushionRef.current) chairCushionRef.current.instanceMatrix.needsUpdate = true;
    if (chairBackRef.current) chairBackRef.current.instanceMatrix.needsUpdate = true;

    // 3. 8 Bình hoa sứ Thanh Hoa trên đôn gỗ
    MAIN_HALL_LAYOUT.vasePositions.forEach(([x, , z], idx) => {
      dummy.rotation.set(0, 0, 0);
      dummy.position.set(x, 0.275, z);
      dummy.updateMatrix();
      vaseStandRef.current?.setMatrixAt(idx, dummy.matrix);

      dummy.position.set(x, 0.55, z);
      dummy.updateMatrix();
      vaseBodyRef.current?.setMatrixAt(idx, dummy.matrix);
    });

    if (vaseStandRef.current) vaseStandRef.current.instanceMatrix.needsUpdate = true;
    if (vaseBodyRef.current) vaseBodyRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  // Chuyển động đung đưa nhẹ nhàng của 12 Đèn lồng cung đình (không phụ thuộc frame rate)
  useFrame(({ clock }) => {
    if (!lanternBodyRef.current || !lanternCapRef.current || !lanternCordRef.current) return;

    const t = lanternAnimationEnabled ? clock.getElapsedTime() : 0;

    MAIN_HALL_LAYOUT.lanternPositions.forEach(([x, y, z], idx) => {
      const swayAngle = Math.sin(t * 1.35 + idx * 0.8) * 0.045;
      const swayOffsetX = Math.sin(swayAngle) * 0.8;

      // Dây treo đèn lồng
      dummy.position.set(x + swayOffsetX * 0.5, y + 1.1, z);
      dummy.rotation.set(0, 0, -swayAngle);
      dummy.updateMatrix();
      lanternCordRef.current!.setMatrixAt(idx, dummy.matrix);

      // Bầu đèn lồng lụa đỏ
      dummy.position.set(x + swayOffsetX, y, z);
      dummy.rotation.set(0, t * 0.2 + idx, -swayAngle);
      dummy.updateMatrix();
      lanternBodyRef.current!.setMatrixAt(idx, dummy.matrix);

      // Nắp vàng đèn lồng
      dummy.position.set(x + swayOffsetX, y + 0.58, z);
      dummy.rotation.set(0, 0, -swayAngle);
      dummy.updateMatrix();
      lanternCapRef.current!.setMatrixAt(idx, dummy.matrix);
    });

    lanternCordRef.current.instanceMatrix.needsUpdate = true;
    lanternBodyRef.current.instanceMatrix.needsUpdate = true;
    lanternCapRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group name="ImperialMainHall">
      {/* ================================================================= */}
      {/* 1. WOODEN FLOOR (Sàn gỗ nâu bóng + bó vỉa đá cẩm thạch xung quanh) */}
      {/* ================================================================= */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        material={materials.woodFloor}
      >
        <planeGeometry args={[MAIN_HALL_LAYOUT.width, MAIN_HALL_LAYOUT.length]} />
      </mesh>

      {/* ================================================================= */}
      {/* 6. RED CARPET (Thảm đỏ Ngự Đạo thêu viền vàng từ cửa chính tới bệ) */}
      {/* ================================================================= */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.018, 4.5]}
        receiveShadow
        material={materials.redCarpet}
      >
        <planeGeometry args={[4.4, 33.5]} />
      </mesh>

      {/* ================================================================= */}
      {/* 2. RED PALACE PILLARS (16 Cột đại điện bằng InstancedMesh)        */}
      {/* ================================================================= */}
      <instancedMesh
        ref={pillarShaftRef}
        args={[geometries.pillarShaft, materials.redPillar, MAIN_HALL_LAYOUT.pillarPositions.length]}
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={pillarBaseRef}
        args={[geometries.pillarBase, materials.stoneBase, MAIN_HALL_LAYOUT.pillarPositions.length]}
        receiveShadow
      />
      <instancedMesh
        ref={pillarRingRef}
        args={[geometries.pillarGoldRing, materials.warmGold, MAIN_HALL_LAYOUT.pillarPositions.length]}
      />
      <instancedMesh
        ref={pillarCapitalRef}
        args={[geometries.pillarCapital, materials.mutedJade, MAIN_HALL_LAYOUT.pillarPositions.length]}
      />

      {/* Hệ thống Xà ngang (Hoành phi & Dầm gỗ sơn xanh ngọc / đỏ thếp vàng) */}
      {[-13.5, -4.5, 4.5, 13.5].map((zPos) => (
        <group key={`crossbeam-${zPos}`} position={[0, 10.75, zPos]}>
          <mesh material={materials.redPillar} castShadow>
            <boxGeometry args={[31.6, 0.55, 0.55]} />
          </mesh>
          <mesh position={[0, -0.35, 0]} material={materials.mutedJade}>
            <boxGeometry args={[31.4, 0.25, 0.42]} />
          </mesh>
        </group>
      ))}

      {/* Dầm dọc nối hai hàng cột trung tâm */}
      {[-6.2, 6.2].map((xPos) => (
        <mesh
          key={`longbeam-${xPos}`}
          position={[xPos, 10.8, 0]}
          material={materials.redPillar}
        >
          <boxGeometry args={[0.52, 0.55, 43.6]} />
        </mesh>
      ))}

      {/* ================================================================= */}
      {/* 3. PALACE WALLS & COFFERED CEILING (Tường cung điện & Trần tảo tỉnh) */}
      {/* ================================================================= */}
      {/* Trần tảo tỉnh cổ trang (Coffered Ceiling) */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, MAIN_HALL_LAYOUT.wallHeight, 0]}
        material={materials.cofferedCeiling}
      >
        <planeGeometry args={[MAIN_HALL_LAYOUT.width, MAIN_HALL_LAYOUT.length]} />
      </mesh>

      {/* Tường Bắc (Phía sau Long Ngai) */}
      <group position={[0, 0, -22]}>
        {/* Chân tường ốp gỗ trầm */}
        <mesh position={[0, 1.6, 0]} material={materials.darkWood} receiveShadow>
          <boxGeometry args={[32, 3.2, 0.6]} />
        </mesh>
        {/* Thân tường màu kem hoàng gia */}
        <mesh position={[0, 6.8, 0]} material={materials.creamWall} receiveShadow>
          <boxGeometry args={[32, 7.2, 0.5]} />
        </mesh>
        {/* Cổ diềm xanh ngọc & đỏ */}
        <mesh position={[0, 10.9, 0.1]} material={materials.mutedJade}>
          <boxGeometry args={[32, 1.1, 0.65]} />
        </mesh>
      </group>

      {/* Tường Tây (Bên trái) & Tường Đông (Bên phải) kèm cửa sổ song gỗ đón nắng */}
      {[-16, 16].map((xWall) => (
        <group key={`side-wall-${xWall}`} position={[xWall, 0, 0]}>
          {/* Chân tường ốp gỗ */}
          <mesh position={[0, 1.5, 0]} material={materials.darkWood} receiveShadow>
            <boxGeometry args={[0.6, 3.0, 44]} />
          </mesh>
          {/* Tường kem phía trên */}
          <mesh position={[0, 6.8, 0]} material={materials.creamWall} receiveShadow>
            <boxGeometry args={[0.5, 7.6, 44]} />
          </mesh>
          {/* Khung cửa sổ song hoa cổ trang phát sáng ấm */}
          {[-9, 0, 9].map((zWin) => (
            <mesh
              key={`window-${xWall}-${zWin}`}
              position={[xWall < 0 ? 0.28 : -0.28, 5.8, zWin]}
              rotation={[0, xWall < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
              material={materials.latticeWindow}
            >
              <planeGeometry args={[5.2, 3.6]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ================================================================= */}
      {/* 4. TRADITIONAL WOODEN DOORS (Cửa gỗ 6 cánh phía Nam đinh đồng vàng) */}
      {/* ================================================================= */}
      <group position={[0, 0, 22]}>
        {/* Tường hai bên cổng chính */}
        <mesh position={[-10.5, 5.75, 0]} material={materials.redPillar} receiveShadow>
          <boxGeometry args={[11, 11.5, 0.65]} />
        </mesh>
        <mesh position={[10.5, 5.75, 0]} material={materials.redPillar} receiveShadow>
          <boxGeometry args={[11, 11.5, 0.65]} />
        </mesh>

        {/* Bức hoành phi và thượng lương trên cổng chính */}
        <mesh position={[0, 9.2, 0]} material={materials.redPillar}>
          <boxGeometry args={[10, 4.6, 0.65]} />
        </mesh>
        {/* Biển ngạch thếp vàng "THÁI HÒA ĐIỆN" */}
        <mesh position={[0, 8.2, -0.4]} material={materials.warmGold}>
          <boxGeometry args={[4.6, 1.35, 0.25]} />
        </mesh>
        <mesh position={[0, 8.2, -0.54]} material={materials.darkWood}>
          <boxGeometry args={[4.2, 1.05, 0.08]} />
        </mesh>

        {/* Cánh cửa gỗ cổ trang bên trái & phải (Mở 2 cánh giữa đón ánh nắng) */}
        {[-4.1, -2.6, 2.6, 4.1].map((xDoor, idx) => (
          <group key={`door-leaf-${idx}`} position={[xDoor, 3.4, -0.1]}>
            <mesh material={materials.redPillar} castShadow>
              <boxGeometry args={[1.38, 6.8, 0.18]} />
            </mesh>
            {/* Ô nan hoa cửa trên */}
            <mesh position={[0, 1.2, -0.11]} material={materials.latticeWindow}>
              <planeGeometry args={[1.05, 2.8]} />
            </mesh>
            {/* Hàng đinh đồng môn hoàng gia */}
            {[-1.2, -1.7, -2.2].map((yStud, sIdx) => (
              <mesh
                key={`stud-${sIdx}`}
                position={[0, yStud, -0.12]}
                material={materials.warmGold}
              >
                <boxGeometry args={[1.0, 0.08, 0.06]} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Hai cánh cửa chính giữa mở hé về phía trong */}
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
      {/* 5. IMPERIAL THRONE & RAISED DAIS (Bệ Rồng 3 cấp & Long Ngai vàng) */}
      {/* ================================================================= */}
      <group name="ImperialThroneDais" position={[0, 0, -16.2]}>
        {/* Cấp bệ 1 (Rộng nhất) */}
        <mesh position={[0, 0.3, 0]} material={materials.stoneBase} receiveShadow>
          <boxGeometry args={[16.5, 0.6, 9.2]} />
        </mesh>
        <mesh position={[0, 0.61, 0]} material={materials.redCarpet} receiveShadow>
          <boxGeometry args={[16.1, 0.04, 8.8]} />
        </mesh>

        {/* Cấp bệ 2 */}
        <mesh position={[0, 0.9, -0.5]} material={materials.stoneBase} receiveShadow>
          <boxGeometry args={[13.6, 0.6, 7.6]} />
        </mesh>
        <mesh position={[0, 1.21, -0.5]} material={materials.redCarpet} receiveShadow>
          <boxGeometry args={[13.2, 0.04, 7.2]} />
        </mesh>

        {/* Cấp bệ 3 (Đỉnh Bệ Rồng) */}
        <mesh position={[0, 1.5, -1.0]} material={materials.stoneBase} receiveShadow>
          <boxGeometry args={[10.8, 0.6, 6.0]} />
        </mesh>
        <mesh position={[0, 1.81, -1.0]} material={materials.redCarpet} receiveShadow>
          <boxGeometry args={[10.4, 0.04, 5.6]} />
        </mesh>

        {/* Bậc thang Ngự Đạo và Đan Bệ chạm rồng vàng ở chính giữa */}
        {[0, 1, 2, 3, 4, 5].map((step) => (
          <mesh
            key={`throne-step-${step}`}
            position={[0, 0.15 + step * 0.3, 4.8 - step * 0.52]}
            material={step % 2 === 0 ? materials.redCarpet : materials.warmGold}
            receiveShadow
          >
            <boxGeometry args={[4.4, 0.3, 0.56]} />
          </mesh>
        ))}

        {/* Lan can đá & trụ rồng thếp vàng bao quanh Bệ Rồng */}
        {[-7.8, 7.8].map((xBal) => (
          <mesh
            key={`balustrade-side-${xBal}`}
            position={[xBal, 1.05, 0]}
            material={materials.stoneBase}
            castShadow
          >
            <boxGeometry args={[0.35, 0.9, 8.8]} />
          </mesh>
        ))}
        {[-2.4, 2.4].map((xRail) => (
          <mesh
            key={`stair-rail-${xRail}`}
            position={[xRail, 1.15, 3.4]}
            rotation={[0.52, 0, 0]}
            material={materials.warmGold}
            castShadow
          >
            <boxGeometry args={[0.26, 0.45, 3.8]} />
          </mesh>
        ))}

        {/* Bình Phong Cửu Long 5 tấm phía sau Long Ngai */}
        <group position={[0, 1.82, -3.1]}>
          <mesh position={[0, 2.2, 0]} material={materials.dragonScreen} castShadow>
            <boxGeometry args={[6.8, 4.4, 0.24]} />
          </mesh>
          {/* Khung đỉnh bình phong chạm vàng */}
          <mesh position={[0, 4.5, 0]} material={materials.warmGold}>
            <boxGeometry args={[7.2, 0.35, 0.34]} />
          </mesh>
        </group>

        {/* LONG NGAI (Imperial Dragon Throne) */}
        <group position={[0, 1.82, -1.25]}>
          {/* Bệ ngai thếp vàng */}
          <mesh position={[0, 0.32, 0]} material={materials.warmGold} castShadow>
            <boxGeometry args={[2.6, 0.64, 1.9]} />
          </mesh>
          {/* Đệm ngồi hoàng bào */}
          <mesh position={[0, 0.7, 0.05]} material={materials.cushionBrocade}>
            <boxGeometry args={[2.1, 0.16, 1.55]} />
          </mesh>
          {/* Tựa lưng chạm rồng 3 bậc */}
          <mesh position={[0, 1.65, -0.78]} material={materials.warmGold} castShadow>
            <boxGeometry args={[2.3, 1.9, 0.22]} />
          </mesh>
          <mesh position={[0, 2.75, -0.78]} material={materials.warmGold} castShadow>
            <boxGeometry args={[1.5, 0.55, 0.24]} />
          </mesh>
          {/* Tay vịn Long Ngai trái & phải */}
          {[-1.08, 1.08].map((xArm) => (
            <mesh
              key={`throne-arm-${xArm}`}
              position={[xArm, 1.12, 0.05]}
              material={materials.warmGold}
              castShadow
            >
              <boxGeometry args={[0.24, 0.72, 1.65]} />
            </mesh>
          ))}
          {/* Bục gác chân Hoàng Đế (Footrest) */}
          <mesh position={[0, 0.14, 1.25]} material={materials.warmGold}>
            <boxGeometry args={[1.5, 0.28, 0.65]} />
          </mesh>
        </group>

        {/* Bửu Cái / Lọng Vàng treo phía trên Long Ngai */}
        <group position={[0, 7.6, -1.25]}>
          <mesh material={materials.warmGold}>
            <cylinderGeometry args={[1.6, 2.3, 0.65, 8]} />
          </mesh>
          <mesh position={[0, -0.4, 0]} material={materials.redPillar}>
            <cylinderGeometry args={[2.25, 2.25, 0.25, 8]} />
          </mesh>
        </group>

        {/* Đôi Lư Hương Đồng (Incense Burners) chầu hai bên Bệ Rồng */}
        {[-4.2, 4.2].map((xBurner) => (
          <group key={`incense-burner-${xBurner}`} position={[xBurner, 0.62, 2.6]}>
            <mesh position={[0, 0.45, 0]} material={materials.warmGold} castShadow>
              <cylinderGeometry args={[0.45, 0.35, 0.9, 12]} />
            </mesh>
            <mesh position={[0, 1.05, 0]} material={materials.warmGold} castShadow>
              <sphereGeometry args={[0.52, 14, 12]} />
            </mesh>
            <mesh position={[0, 1.68, 0]} material={materials.warmGold}>
              <coneGeometry args={[0.38, 0.55, 8]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================================================================= */}
      {/* 7 & 8. WOODEN TABLES & OFFICIAL CHAIRS (12 bộ bàn ghế Instanced)  */}
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
      {/* 9. DECORATIVE LANTERNS (12 Đèn lồng lụa đỏ đung đưa nhẹ)          */}
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

      {/* ================================================================= */}
      {/* 10. TRADITIONAL ORNAMENTS (8 Bình hoa sứ Thanh Hoa trên đôn gỗ)   */}
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
