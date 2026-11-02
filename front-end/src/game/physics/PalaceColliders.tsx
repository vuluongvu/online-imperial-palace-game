import React from 'react';
import * as THREE from 'three';
import { MAIN_HALL_LAYOUT } from '../world/hallLayout';

interface BoxObstacle {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

const CHAR_RADIUS = 0.44;
const PILLAR_RADIUS = 0.62;

// Danh sách toàn bộ 22 cột (16 Cột Đỏ + 6 Cột Rồng Vàng)
const ALL_PILLARS: [number, number, number][] = [
  ...MAIN_HALL_LAYOUT.pillarPositions,
  ...MAIN_HALL_LAYOUT.goldenDragonPillarPositions,
];

// Danh sách AABB của 12 bộ bàn ghế quan viên + Đỉnh hương + Hạc đồng + Long Ngai + Bình phong
const STATIC_BOX_OBSTACLES: BoxObstacle[] = [
  // 12 Bộ bàn ghế quan viên
  ...MAIN_HALL_LAYOUT.officialDeskPositions.map(({ pos }) => {
    const [x, , z] = pos;
    return x < 0
      ? { minX: x - 1.5, maxX: x + 0.6, minZ: z - 1.0, maxZ: z + 1.0 }
      : { minX: x - 0.6, maxX: x + 1.5, minZ: z - 1.0, maxZ: z + 1.0 };
  }),
  // Đôi Đỉnh Hương Đồng trước Bệ Rồng
  { minX: -4.2, maxX: -3.0, minZ: -13.8, maxZ: -12.6 },
  { minX: 3.0, maxX: 4.2, minZ: -13.8, maxZ: -12.6 },
  // Đôi Tiên Hạc Đồng trên Bệ Rồng
  { minX: -3.35, maxX: -2.35, minZ: -17.25, maxZ: -16.25 },
  { minX: 2.35, maxX: 3.35, minZ: -17.25, maxZ: -16.25 },
  // Long Ngai Hoàng Đế (Khi đang đi bộ không cho đi xuyên qua ngai)
  { minX: -1.42, maxX: 1.42, minZ: -18.65, maxZ: -16.65 },
  // Bình Phong Cửu Long phía sau Long Ngai
  { minX: -4.5, maxX: 4.5, minZ: -20.1, maxZ: -19.1 },
];

function resolveCircleAABB(
  x: number,
  z: number,
  radius: number,
  box: BoxObstacle
): [number, number] {
  const closestX = THREE.MathUtils.clamp(x, box.minX, box.maxX);
  const closestZ = THREE.MathUtils.clamp(z, box.minZ, box.maxZ);

  const dx = x - closestX;
  const dz = z - closestZ;
  const distSq = dx * dx + dz * dz;

  if (distSq >= radius * radius) {
    return [x, z];
  }

  // Nếu tâm nằm ngoài mép hộp nhưng bán kính chạm hộp
  if (distSq > 0.00001) {
    const dist = Math.sqrt(distSq);
    const overlap = radius - dist;
    return [x + (dx / dist) * overlap, z + (dz / dist) * overlap];
  }

  // Nếu tâm lọt vào trong hộp, đẩy ra theo trục ngắn nhất
  const leftPen = x - box.minX + radius;
  const rightPen = box.maxX - x + radius;
  const topPen = z - box.minZ + radius;
  const bottomPen = box.maxZ - z + radius;
  const minPen = Math.min(leftPen, rightPen, topPen, bottomPen);

  if (minPen === leftPen) return [box.minX - radius, z];
  if (minPen === rightPen) return [box.maxX + radius, z];
  if (minPen === topPen) return [x, box.minZ - radius];
  return [x, box.maxZ + radius];
}

/**
 * Tính toán va chạm vật lý & độ cao mặt sàn Bệ Rồng cho nhân vật:
 * - Chống xuyên tường bao Chính điện.
 * - Chống xuyên 16 Cột Đại Điện Sơn Son & 6 Cột Bàn Long Thếp Vàng.
 * - Chống xuyên 12 bàn ghế quan viên, Long Ngai, Bình Phong, Đỉnh Hương, Tiên Hạc.
 * - Cho phép bước mượt mà lên bậc tam cấp Ngự Đạo (X từ -2.2 đến +2.2, Z từ -11.0 đến -14.2) lên đỉnh Bệ Rồng (Y = 1.82m).
 */
export function resolvePalaceMovement(
  prevX: number,
  prevY: number,
  prevZ: number,
  targetX: number,
  targetZ: number
): [number, number, number] {
  let x = THREE.MathUtils.clamp(targetX, -15.1, 15.1);
  let z = THREE.MathUtils.clamp(targetZ, -21.1, 21.1);

  // Kiểm tra hành lang bậc tam cấp và mặt sàn Bệ Rồng
  const inStairCorridorX = Math.abs(x) <= 2.15;
  const wasOnDais = prevY >= 1.1 || (prevZ <= -13.8 && Math.abs(prevX) <= 7.5);

  if (!wasOnDais) {
    // Đang ở dưới sàn gỗ Chính điện: Nếu đi về phía Bắc (Z < -11.2) ngoài lối bậc thang Ngự Đạo thì chặn bởi thành đá Bệ Rồng
    if (z < -11.2 && !inStairCorridorX && Math.abs(x) < 8.4) {
      if (prevZ >= -11.2) {
        z = -11.2;
      } else if (x < 0) {
        x = Math.min(x, -8.4);
      } else {
        x = Math.max(x, 8.4);
      }
    }
  } else {
    // Đang ở trên Bệ Rồng: Giữ nhân vật bên trong lan can Bạch Ngọc của Bệ Rồng (trừ lối bậc thang chính giữa)
    x = THREE.MathUtils.clamp(x, -7.3, 7.3);
    z = THREE.MathUtils.clamp(z, -20.8, -11.0);
    if (z > -14.0 && !inStairCorridorX) {
      if (prevZ <= -14.0) {
        z = -14.0;
      } else {
        x = THREE.MathUtils.clamp(x, -2.1, 2.1);
      }
    }
  }

  // Va chạm 22 Cột tròn (Cylinder collision)
  for (const [px, , pz] of ALL_PILLARS) {
    const dx = x - px;
    const dz = z - pz;
    const minDist = PILLAR_RADIUS + CHAR_RADIUS;
    const distSq = dx * dx + dz * dz;
    if (distSq < minDist * minDist && distSq > 0.00001) {
      const dist = Math.sqrt(distSq);
      const push = minDist - dist;
      x += (dx / dist) * push;
      z += (dz / dist) * push;
    }
  }

  // Va chạm các vật thể hộp (12 Bàn ghế, Long Ngai, Bình phong, Đỉnh hương, Hạc đồng)
  for (const box of STATIC_BOX_OBSTACLES) {
    [x, z] = resolveCircleAABB(x, z, CHAR_RADIUS, box);
  }

  // Tính độ cao Y theo vị trí bậc tam cấp hoặc đỉnh Bệ Rồng
  let y = 0;
  if (Math.abs(x) <= 7.6 && z <= -14.0) {
    y = 1.82;
  } else if (Math.abs(x) <= 2.25 && z < -11.0 && z > -14.0) {
    const t = THREE.MathUtils.clamp((-11.0 - z) / 3.0, 0, 1);
    y = t * 1.82;
  }

  return [x, y, z];
}

export const PalaceColliders: React.FC = () => {
  return null;
};
