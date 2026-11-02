import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../stores/useGameStore';

interface CoiledDragonProps {
  position: [number, number, number];
  mirrorX?: boolean;
  scale?: number;
}

/**
 * Mô hình Rồng Hoàng Kim 3D (Kim Long Hộ Pháp):
 * - Thân rồng uốn lượn 3D tạo từ CatmullRomCurve3 + TubeGeometry.
 * - Vây lưng rồng (Dorsal Spines) chạy dọc sống lưng.
 * - Đầu rồng chạm nổi với Sừng Hươu (Lộc Giác), Mắt Rồng phát sáng, Râu Rồng dài,
 *   Bờm Rồng, Chân Rồng Ngũ Trảo và viên Hỏa Châu / Minh Châu lơ lửng trước miệng.
 */
const CoiledGuardianDragon: React.FC<CoiledDragonProps> = ({
  position,
  mirrorX = false,
  scale = 1,
}) => {
  const showWireframe = useGameStore((s) => s.showWireframe);
  const headGroupRef = useRef<THREE.Group>(null);
  const pearlMeshRef = useRef<THREE.Mesh>(null);

  const sign = mirrorX ? -1 : 1;

  // Đường cong 3D uốn lượn quấn quanh cột Bàn Long và vươn đầu ra chầu Ngự Đạo
  const { bodyGeometry, spineTransforms, headPos, headLookAt } = useMemo(() => {
    const curvePoints = [
      new THREE.Vector3(0, 1.1, -0.58),
      new THREE.Vector3(0.62 * sign, 1.9, 0.0),
      new THREE.Vector3(0, 2.8, 0.62),
      new THREE.Vector3(-0.62 * sign, 3.7, 0.0),
      new THREE.Vector3(0, 4.6, -0.62),
      new THREE.Vector3(0.64 * sign, 5.5, 0.0),
      new THREE.Vector3(0.28 * sign, 6.2, 0.72),
      new THREE.Vector3(-0.45 * sign, 6.35, 1.25),
    ];

    const curve = new THREE.CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.5);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.21, 14, false);

    // Tính vị trí & góc xoay cho hàng vây lưng rồng dọc theo đường cong
    const spines: { pos: THREE.Vector3; quat: THREE.Quaternion; s: number }[] = [];
    const spineCount = 26;
    const up = new THREE.Vector3(0, 1, 0);

    for (let i = 2; i < spineCount - 1; i++) {
      const t = i / spineCount;
      const pt = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(up, tangent);
      const s = Math.sin(t * Math.PI) * 0.65 + 0.5;
      spines.push({ pos: pt, quat, s });
    }

    const endPt = curve.getPointAt(1);
    const endTangent = curve.getTangentAt(1).normalize();
    const lookTarget = endPt.clone().add(endTangent);

    return {
      bodyGeometry: tubeGeo,
      spineTransforms: spines,
      headPos: endPt,
      headLookAt: lookTarget,
    };
  }, [sign]);

  const materials = useMemo(() => {
    const dragonGold = new THREE.MeshStandardMaterial({
      color: '#F0BC42',
      roughness: 0.2,
      metalness: 0.82,
      wireframe: showWireframe,
    });

    const dragonCrimson = new THREE.MeshStandardMaterial({
      color: '#A81C1C',
      roughness: 0.32,
      metalness: 0.35,
      wireframe: showWireframe,
    });

    const dragonHorn = new THREE.MeshStandardMaterial({
      color: '#FFE596',
      roughness: 0.25,
      metalness: 0.65,
      wireframe: showWireframe,
    });

    const glowingPearl = new THREE.MeshStandardMaterial({
      color: '#FFF3B0',
      emissive: '#FF9E2C',
      emissiveIntensity: 1.4,
      roughness: 0.12,
      metalness: 0.1,
      wireframe: showWireframe,
    });

    const eyeGlow = new THREE.MeshBasicMaterial({
      color: '#FF3B1F',
    });

    return {
      dragonGold,
      dragonCrimson,
      dragonHorn,
      glowingPearl,
      eyeGlow,
      dispose: () => {
        dragonGold.dispose();
        dragonCrimson.dispose();
        dragonHorn.dispose();
        glowingPearl.dispose();
        eyeGlow.dispose();
      },
    };
  }, [showWireframe]);

  useEffect(() => {
    return () => {
      bodyGeometry.dispose();
      materials.dispose();
    };
  }, [bodyGeometry, materials]);

  // Đặt hướng nhìn ban đầu cho Đầu Rồng và hiệu ứng thở/lơ lửng Hỏa Châu
  useEffect(() => {
    if (headGroupRef.current) {
      headGroupRef.current.position.copy(headPos);
      headGroupRef.current.lookAt(headLookAt);
    }
  }, [headPos, headLookAt]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (headGroupRef.current) {
      headGroupRef.current.position.y =
        headPos.y + Math.sin(t * 2.2 + (mirrorX ? 1.5 : 0)) * 0.045;
    }
    if (pearlMeshRef.current) {
      pearlMeshRef.current.position.y =
        headPos.y - 0.15 + Math.sin(t * 3.2 + (mirrorX ? 1.5 : 0)) * 0.08;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Thân Rồng Vàng Uốn Lượn */}
      <mesh geometry={bodyGeometry} material={materials.dragonGold} castShadow />

      {/* Hàng Vây Lưng Rồng (Dorsal Spines) */}
      {spineTransforms.map((sp, idx) => (
        <mesh
          key={`dragon-spine-${idx}`}
          position={[sp.pos.x, sp.pos.y + 0.16, sp.pos.z]}
          quaternion={sp.quat}
          scale={[sp.s, sp.s, sp.s]}
          material={idx % 2 === 0 ? materials.dragonCrimson : materials.dragonHorn}
        >
          <coneGeometry args={[0.09, 0.28, 6]} />
        </mesh>
      ))}

      {/* Đuôi Rồng Rẽ Quạt */}
      <group position={[0, 0.95, -0.62]} rotation={[0.6, 0, 0]}>
        <mesh material={materials.dragonCrimson}>
          <coneGeometry args={[0.24, 0.65, 7]} />
        </mesh>
      </group>

      {/* Chân Rồng Ngũ Trảo bám vào cột & vươn vuốt vàng */}
      {[
        [0.42 * sign, 3.1, 0.45],
        [-0.22 * sign, 5.8, 0.85],
      ].map(([cx, cy, cz], idx) => (
        <group key={`dragon-claw-${idx}`} position={[cx, cy, cz]}>
          <mesh material={materials.dragonGold} castShadow>
            <sphereGeometry args={[0.18, 12, 12]} />
          </mesh>
          {[-0.1, 0, 0.1].map((clawOffset, cIdx) => (
            <mesh
              key={`talon-${cIdx}`}
              position={[clawOffset, -0.14, 0.16]}
              rotation={[0.8, 0, 0]}
              material={materials.dragonHorn}
            >
              <coneGeometry args={[0.04, 0.22, 6]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ĐẦU RỒNG HOÀNG KIM (Sculpted 3D Dragon Head) */}
      <group ref={headGroupRef}>
        {/* Hộp sọ rồng */}
        <mesh material={materials.dragonGold} castShadow>
          <boxGeometry args={[0.52, 0.44, 0.56]} />
        </mesh>

        {/* Bờm rồng đỏ/vàng xòe quanh đầu */}
        <mesh
          position={[0, 0.05, -0.18]}
          rotation={[Math.PI / 2, 0, 0]}
          material={materials.dragonCrimson}
        >
          <coneGeometry args={[0.46, 0.45, 10]} />
        </mesh>

        {/* Hàm trên vươn dài */}
        <mesh position={[0, 0.04, 0.44]} material={materials.dragonGold} castShadow>
          <boxGeometry args={[0.38, 0.22, 0.52]} />
        </mesh>
        {/* Mũi rồng & Lỗ mũi */}
        <mesh position={[0, 0.14, 0.64]} material={materials.dragonCrimson}>
          <boxGeometry args={[0.32, 0.12, 0.16]} />
        </mesh>

        {/* Hàm dưới mở uy phong (Roaring Lower Jaw) */}
        <mesh
          position={[0, -0.16, 0.38]}
          rotation={[0.36, 0, 0]}
          material={materials.dragonGold}
          castShadow
        >
          <boxGeometry args={[0.32, 0.14, 0.46]} />
        </mesh>

        {/* Lưỡi đỏ & Răng nanh rồng */}
        <mesh
          position={[0, -0.1, 0.38]}
          rotation={[0.32, 0, 0]}
          material={materials.dragonCrimson}
        >
          <boxGeometry args={[0.2, 0.06, 0.36]} />
        </mesh>
        {[-0.12, 0.12].map((xFang, idx) => (
          <mesh
            key={`fang-${idx}`}
            position={[xFang, -0.04, 0.58]}
            rotation={[Math.PI, 0, 0]}
            material={materials.dragonHorn}
          >
            <coneGeometry args={[0.035, 0.14, 6]} />
          </mesh>
        ))}

        {/* Đôi Mắt Rồng Đỏ Rực (Fierce Dragon Eyes) */}
        {[-0.22, 0.22].map((xEye, idx) => (
          <group key={`d-eye-${idx}`} position={[xEye, 0.14, 0.2]}>
            <mesh material={materials.eyeGlow}>
              <sphereGeometry args={[0.075, 10, 10]} />
            </mesh>
            {/* Mày rồng dựng ngược */}
            <mesh
              position={[0, 0.09, 0]}
              rotation={[-0.3, 0, xEye < 0 ? 0.4 : -0.4]}
              material={materials.dragonHorn}
            >
              <boxGeometry args={[0.18, 0.05, 0.14]} />
            </mesh>
          </group>
        ))}

        {/* Cặp Sừng Rồng (Lộc Giác Vàng) vươn dài về phía sau */}
        {[-0.18, 0.18].map((xHorn, idx) => (
          <group
            key={`d-horn-${idx}`}
            position={[xHorn, 0.34, -0.1]}
            rotation={[-0.65, 0, xHorn < 0 ? 0.25 : -0.25]}
          >
            <mesh material={materials.dragonHorn} castShadow>
              <cylinderGeometry args={[0.025, 0.065, 0.78, 8]} />
            </mesh>
            <mesh
              position={[0, 0.12, -0.14]}
              rotation={[-0.7, 0, 0]}
              material={materials.dragonHorn}
            >
              <cylinderGeometry args={[0.018, 0.04, 0.36, 6]} />
            </mesh>
          </group>
        ))}

        {/* Đôi Râu Rồng dài uốn lượn (Dragon Whiskers) */}
        {[-0.22, 0.22].map((xWhisker, idx) => (
          <mesh
            key={`whisker-${idx}`}
            position={[xWhisker * 1.4, 0.02, 0.62]}
            rotation={[0.3, 0, xWhisker < 0 ? 0.85 : -0.85]}
            material={materials.dragonHorn}
          >
            <cylinderGeometry args={[0.012, 0.025, 0.75, 8]} />
          </mesh>
        ))}
      </group>

      {/* Viên Hỏa Châu / Minh Châu phát sáng trước miệng Rồng */}
      <mesh
        ref={pearlMeshRef}
        position={[
          headPos.x - 0.18 * sign,
          headPos.y - 0.15,
          headPos.z + 0.72,
        ]}
        material={materials.glowingPearl}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
      </mesh>
    </group>
  );
};

/**
 * Hệ thống Cửu Long Hộ Điện:
 * 1. Đôi Hoàng Kim Cự Long quấn trên 2 Cột Rồng Tiền Điện (X = ±4.5m, Z = -13.0m) chầu vào Ngự Đạo.
 * 2. Đôi Tiểu Kim Long chầu trên đỉnh Long Ngai (X = ±1.0m, Y = 4.6m, Z = -18.2m).
 * 3. Rồng Đan Bệ chạm nổi uốn lượn ngay giữa bậc tam cấp Bệ Rồng.
 */
export const ImperialDragons: React.FC = () => {
  return (
    <group name="ImperialDragonsGroup">
      {/* Cặp Cự Long quấn cột tiền điện chầu Ngai Vàng */}
      <CoiledGuardianDragon position={[-4.5, 0.5, -13.0]} mirrorX={false} scale={1.0} />
      <CoiledGuardianDragon position={[4.5, 0.5, -13.0]} mirrorX={true} scale={1.0} />

      {/* Cặp Rồng Vàng Hộ Ngai trên đỉnh Bình Phong & Long Ngai */}
      <CoiledGuardianDragon position={[-2.4, 1.9, -18.8]} mirrorX={false} scale={0.55} />
      <CoiledGuardianDragon position={[2.4, 1.9, -18.8]} mirrorX={true} scale={0.55} />
    </group>
  );
};
