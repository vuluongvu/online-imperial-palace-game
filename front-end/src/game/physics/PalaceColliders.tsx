import React from 'react';
import * as THREE from 'three';
import { MAIN_HALL_LAYOUT } from '../world/hallLayout';
import { PALACE_LANDMARKS } from '../world/compoundLayout';

interface BoxObstacle {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

const CHAR_RADIUS = 0.44;
const PILLAR_RADIUS = 0.62;

const ALL_PILLARS: [number, number, number][] = [
  ...MAIN_HALL_LAYOUT.pillarPositions,
  ...MAIN_HALL_LAYOUT.goldenDragonPillarPositions,
];

const STATIC_BOX_OBSTACLES: BoxObstacle[] = [
  ...MAIN_HALL_LAYOUT.officialDeskPositions.map(({ pos }) => {
    const [x, , z] = pos;
    return x < 0
      ? { minX: x - 1.5, maxX: x + 0.6, minZ: z - 1.0, maxZ: z + 1.0 }
      : { minX: x - 0.6, maxX: x + 1.5, minZ: z - 1.0, maxZ: z + 1.0 };
  }),
  { minX: -4.2, maxX: -3.0, minZ: -13.8, maxZ: -12.6 },
  { minX: 3.0, maxX: 4.2, minZ: -13.8, maxZ: -12.6 },
  { minX: -3.35, maxX: -2.35, minZ: -17.25, maxZ: -16.25 },
  { minX: 2.35, maxX: 3.35, minZ: -17.25, maxZ: -16.25 },
  { minX: -1.42, maxX: 1.42, minZ: -18.65, maxZ: -16.65 },
  { minX: -4.5, maxX: 4.5, minZ: -20.1, maxZ: -19.1 },
];

// Các khối kiến trúc trên Bản đồ Quần thể Hoàng Cung (trừ Cổng Chính có vòm đi qua ở giữa)
const COMPOUND_BUILDING_BOXES: BoxObstacle[] = [
  ...PALACE_LANDMARKS.filter((l) => l.id !== 'cong_chinh').map((l) => {
    const [x, , z] = l.position;
    const [w, , d] = l.size;
    return {
      minX: x - w / 2 - 0.8,
      maxX: x + w / 2 + 0.8,
      minZ: z - d / 2 - 0.8,
      maxZ: z + d / 2 + 0.8,
    };
  }),
  // Hai mố tường hai bên vòm Cổng Chính (Để hở cổng vòm X từ -2.2 đến +2.2)
  { minX: -42, maxX: -2.3, minZ: 34.8, maxZ: 41.2 },
  { minX: 2.3, maxX: 42, minZ: 34.8, maxZ: 41.2 },
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

  if (distSq > 0.00001) {
    const dist = Math.sqrt(distSq);
    const overlap = radius - dist;
    return [x + (dx / dist) * overlap, z + (dz / dist) * overlap];
  }

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
 * Va chạm trong Nội Điện Thái Hòa (Main Hall Interior)
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

  const inStairCorridorX = Math.abs(x) <= 2.15;
  const wasOnDais = prevY >= 1.1 || (prevZ <= -13.8 && Math.abs(prevX) <= 7.5);

  if (!wasOnDais) {
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

  for (const box of STATIC_BOX_OBSTACLES) {
    [x, z] = resolveCircleAABB(x, z, CHAR_RADIUS, box);
  }

  let y = 0;
  if (Math.abs(x) <= 7.6 && z <= -14.0) {
    y = 1.82;
  } else if (Math.abs(x) <= 2.25 && z < -11.0 && z > -14.0) {
    const t = THREE.MathUtils.clamp((-11.0 - z) / 3.0, 0, 1);
    y = t * 1.82;
  }

  return [x, y, z];
}

/**
 * Va chạm trên Bản đồ Quần thể Hoàng Cung (Outdoor Compound Map)
 */
export function resolveCompoundMapMovement(
  targetX: number,
  targetZ: number
): [number, number, number] {
  let x = THREE.MathUtils.clamp(targetX, -40.2, 40.2);
  let z = THREE.MathUtils.clamp(targetZ, -40.2, 48.0);

  for (const box of COMPOUND_BUILDING_BOXES) {
    [x, z] = resolveCircleAABB(x, z, CHAR_RADIUS, box);
  }

  return [x, 0, z];
}

export const PalaceColliders: React.FC = () => {
  return null;
};
