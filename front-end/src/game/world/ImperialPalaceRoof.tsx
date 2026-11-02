import React, { useMemo } from 'react';
import * as THREE from 'three';
import { LandmarkZone } from './compoundLayout';
import { createImperialRoofGeometry } from './roofGeometry';

/**
 * Đôi Rồng Kìm Nóc (Hồi Long / Chiwen) ở hai đầu bờ nóc
 */
const DragonRidgeFinial: React.FC<{
  position: [number, number, number];
  facingLeft: boolean;
  material: THREE.Material;
}> = ({ position, facingLeft, material }) => {
  const dir = facingLeft ? -1 : 1;
  return (
    <group position={position}>
      {/* Khối đầu rồng há miệng ngậm bờ nóc */}
      <mesh position={[0, 0.16, 0]} material={material} castShadow>
        <boxGeometry args={[0.38, 0.36, 0.38]} />
      </mesh>
      {/* Sừng rồng / Đuôi rồng uốn cong vểnh lên */}
      <mesh
        position={[dir * -0.1, 0.44, 0]}
        rotation={[0, 0, dir * 0.38]}
        material={material}
        castShadow
      >
        <boxGeometry args={[0.18, 0.48, 0.22]} />
      </mesh>
      {/* Mõm rồng vươn vào giữa bờ nóc */}
      <mesh position={[dir * 0.18, 0.12, 0]} material={material}>
        <boxGeometry args={[0.22, 0.18, 0.26]} />
      </mesh>
    </group>
  );
};

/**
 * Một tầng Mái Tứ Diện Cung Đình hoàn chỉnh với bờ nóc, rồng ngậm nóc và đầu đao
 */
export const ImperialRoofTier: React.FC<{
  wBottom: number;
  dBottom: number;
  wTop: number;
  dTop: number;
  height: number;
  eaveLift?: number;
  eaveSag?: number;
  roofMaterial: THREE.Material;
  goldMaterial: THREE.Material;
  hasDragonFinials?: boolean;
}> = ({
  wBottom,
  dBottom,
  wTop,
  dTop,
  height,
  eaveLift = 0.38,
  eaveSag = -0.12,
  roofMaterial,
  goldMaterial,
  hasDragonFinials = true,
}) => {
  const roofGeom = useMemo(() => {
    return createImperialRoofGeometry(
      wBottom,
      dBottom,
      wTop,
      dTop,
      height,
      eaveLift,
      eaveSag
    );
  }, [wBottom, dBottom, wTop, dTop, height, eaveLift, eaveSag]);

  const halfWt = wTop / 2;
  const halfWb = wBottom / 2;
  const halfDb = dBottom / 2;
  const cornerFlare = eaveLift * 0.4;

  return (
    <group>
      {/* 1. Khối mái ngói lưu ly chính */}
      <mesh geometry={roofGeom} material={roofMaterial} castShadow receiveShadow />

      {/* 2. Sống bờ nóc thếp vàng (Gilded Main Ridge Beam) */}
      <mesh
        position={[0, height + 0.12, 0]}
        material={goldMaterial}
        castShadow
      >
        <boxGeometry args={[wTop + 0.45, 0.24, dTop + 0.12]} />
      </mesh>

      {/* 3. Đôi Rồng Kìm Nóc chầu ở hai đầu bờ nóc */}
      {hasDragonFinials && (
        <>
          <DragonRidgeFinial
            position={[-halfWt - 0.14, height + 0.16, 0]}
            facingLeft={false}
            material={goldMaterial}
          />
          <DragonRidgeFinial
            position={[halfWt + 0.14, height + 0.16, 0]}
            facingLeft={true}
            material={goldMaterial}
          />

          {/* Viên Châu Nguyệt / Mặt trời lửa ở chính giữa bờ nóc (Lưỡng Long Chầu Nguyệt) */}
          <group position={[0, height + 0.34, 0]}>
            <mesh material={goldMaterial}>
              <sphereGeometry args={[0.22, 12, 12]} />
            </mesh>
            <mesh position={[0, 0.18, 0]} material={goldMaterial}>
              <coneGeometry args={[0.08, 0.24, 6]} />
            </mesh>
          </group>
        </>
      )}

      {/* 4. Đầu đao uốn cong ở 4 góc mái (Upturned Eave Corners) */}
      {[
        [-halfWb - cornerFlare, halfDb + cornerFlare],
        [halfWb + cornerFlare, halfDb + cornerFlare],
        [halfWb + cornerFlare, -halfDb - cornerFlare],
        [-halfWb - cornerFlare, -halfDb - cornerFlare],
      ].map(([cx, cz], cIdx) => (
        <group key={`corner-tip-${cIdx}`} position={[cx, eaveLift, cz]}>
          <mesh position={[0, 0.16, 0]} material={goldMaterial}>
            <coneGeometry args={[0.16, 0.36, 5]} />
          </mesh>
        </group>
      ))}

      {/* 5. Gờ riềm gỗ son chạy quanh chân mái che hàng rui mè */}
      <mesh position={[0, -0.06, 0]} material={goldMaterial}>
        <boxGeometry args={[wBottom * 0.94, 0.14, dBottom * 0.94]} />
      </mesh>
    </group>
  );
};

/**
 * Component Mái Cung Đình hoàn chỉnh (Hỗ trợ Đơn Diêm 1 tầng và Trùng Diêm 2 tầng)
 */
export const TieredPalaceRoof: React.FC<{
  zone: LandmarkZone;
  materials: Record<string, THREE.Material>;
}> = ({ zone, materials }) => {
  const [w, h, d] = zone.size;
  const isMainHall = zone.id === 'chinh_dien';

  const roofMat =
    zone.roofStyle === 'gold'
      ? materials.roofGold
      : zone.roofStyle === 'slate'
        ? materials.roofSlate
        : materials.roofJade;

  if (zone.tiers === 2) {
    // =========================================================================
    // MÁI TRÙNG DIÊM 2 TẦNG (Chính Điện Thái Hòa, Ngự Thư Phòng, Cổng Chính)
    // =========================================================================
    const t1W = w + 2.6;
    const t1D = d + 2.2;
    const t1RidgeW = w * 0.64;
    const t1Height = isMainHall ? 2.1 : 1.85;

    const t2W = w * 0.84;
    const t2D = d * 0.78;
    const t2RidgeW = w * 0.52;
    const t2Height = isMainHall ? 2.3 : 1.95;

    return (
      <group>
        {/* Tầng Mái 1 (Hạ Diêm - Dốc rộng che hiên và hàng cột) */}
        <group position={[0, h * 0.56, 0]}>
          <ImperialRoofTier
            wBottom={t1W}
            dBottom={t1D}
            wTop={t1RidgeW}
            dTop={0.5}
            height={t1Height}
            eaveLift={0.34}
            eaveSag={-0.12}
            roofMaterial={roofMat}
            goldMaterial={materials.goldTrim}
            hasDragonFinials={false}
          />
        </group>

        {/* Cổ Diêm (Tường đỏ ngăn giữa 2 tầng mái với hoa văn chấn song vàng) */}
        <group position={[0, h * 0.56 + t1Height * 0.88, 0]}>
          <mesh position={[0, 0.55, 0]} material={materials.wallRed} castShadow>
            <boxGeometry args={[w * 0.68, 1.1, d * 0.62]} />
          </mesh>
          {/* Chấn song cửa cổ diêm thếp vàng */}
          <mesh position={[0, 0.55, (d * 0.62) / 2 + 0.04]} material={materials.goldTrim}>
            <boxGeometry args={[w * 0.52, 0.65, 0.06]} />
          </mesh>
          <mesh position={[0, 0.55, -(d * 0.62) / 2 - 0.04]} material={materials.goldTrim}>
            <boxGeometry args={[w * 0.52, 0.65, 0.06]} />
          </mesh>
        </group>

        {/* Tầng Mái 2 (Thượng Diêm - Đỉnh ngọn với Lưỡng Long Chầu Nguyệt) */}
        <group position={[0, h * 0.56 + t1Height * 0.88 + 1.05, 0]}>
          <ImperialRoofTier
            wBottom={t2W}
            dBottom={t2D}
            wTop={t2RidgeW}
            dTop={0.42}
            height={t2Height}
            eaveLift={0.42}
            eaveSag={-0.14}
            roofMaterial={roofMat}
            goldMaterial={materials.goldTrim}
            hasDragonFinials={true}
          />
        </group>
      </group>
    );
  }

  // =========================================================================
  // MÁI ĐƠN DIÊM 1 TẦNG (Lại Bộ, Hình Bộ, Hàn Lâm Viện, Ngự Hoa Viên)
  // =========================================================================
  const tW = w + 2.4;
  const tD = d + 2.0;
  const ridgeW = w * 0.58;
  const roofHeight = 2.4;

  return (
    <group position={[0, h * 0.56, 0]}>
      <ImperialRoofTier
        wBottom={tW}
        dBottom={tD}
        wTop={ridgeW}
        dTop={0.45}
        height={roofHeight}
        eaveLift={0.4}
        eaveSag={-0.14}
        roofMaterial={roofMat}
        goldMaterial={materials.goldTrim}
        hasDragonFinials={true}
      />
    </group>
  );
};
