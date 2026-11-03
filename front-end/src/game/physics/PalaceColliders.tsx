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
  // Bàn ghế bá quan văn võ trong Chính Điện
  ...MAIN_HALL_LAYOUT.officialDeskPositions.map(({ pos }) => {
    const [x, , z] = pos;
    return x < 0
      ? { minX: x - 1.5, maxX: x + 0.6, minZ: z - 1.0, maxZ: z + 1.0 }
      : { minX: x - 0.6, maxX: x + 1.5, minZ: z - 1.0, maxZ: z + 1.0 };
  }),
  // Đỉnh đồng, Hạc đồng, Long Ngai, Bình phong Cửu Long & Ngự Án Hoàng Đế trên Bệ Rồng
  { minX: -4.2, maxX: -3.0, minZ: -13.8, maxZ: -12.6 },
  { minX: 3.0, maxX: 4.2, minZ: -13.8, maxZ: -12.6 },
  { minX: -3.35, maxX: -2.35, minZ: -17.25, maxZ: -16.25 },
  { minX: 2.35, maxX: 3.35, minZ: -17.25, maxZ: -16.25 },
  { minX: -1.42, maxX: 1.42, minZ: -18.65, maxZ: -16.65 },
  { minX: 1.05, maxX: 2.85, minZ: -16.65, maxZ: -15.45 }, // Ngự Án Hoàng Đế
  { minX: -4.5, maxX: 4.5, minZ: -20.1, maxZ: -19.1 },

  // =========================================================================
  // VÁCH TƯỜNG NGĂN CÓ CỬA LIÊN THÔNG (CHÍNH ĐIỆN <-> HÀNH LANG <-> PHỐI ĐIỆN)
  // =========================================================================
  // Tường Tây Chính Điện (X = -16.0): Mở 2 cửa tại Z ∈ [-6.55, -3.45] và Z ∈ [3.45, 6.55]
  { minX: -16.35, maxX: -15.65, minZ: -22.2, maxZ: -6.55 },
  { minX: -16.35, maxX: -15.65, minZ: -3.45, maxZ: 3.45 },
  { minX: -16.35, maxX: -15.65, minZ: 6.55, maxZ: 22.2 },

  // Tường Đông Chính Điện (X = +16.0): Mở 2 cửa tại Z ∈ [-6.55, -3.45] và Z ∈ [3.45, 6.55]
  { minX: 15.65, maxX: 16.35, minZ: -22.2, maxZ: -6.55 },
  { minX: 15.65, maxX: 16.35, minZ: -3.45, maxZ: 3.45 },
  { minX: 15.65, maxX: 16.35, minZ: 6.55, maxZ: 22.2 },

  // Vách ngăn Hành Lang Tây -> Tả Vu (X = -20.6): Mở 2 cửa tại Z ∈ [-6.55, -3.45] và Z ∈ [3.45, 6.55]
  { minX: -20.9, maxX: -20.3, minZ: -18.2, maxZ: -6.55 },
  { minX: -20.9, maxX: -20.3, minZ: -3.45, maxZ: 3.45 },
  { minX: -20.9, maxX: -20.3, minZ: 6.55, maxZ: 18.2 },

  // Vách ngăn Hành Lang Đông -> Hữu Vu (X = +20.6): Mở 2 cửa tại Z ∈ [-6.55, -3.45] và Z ∈ [3.45, 6.55]
  { minX: 20.3, maxX: 20.9, minZ: -18.2, maxZ: -6.55 },
  { minX: 20.3, maxX: 20.9, minZ: -3.45, maxZ: 3.45 },
  { minX: 20.3, maxX: 20.9, minZ: 6.55, maxZ: 18.2 },

  // Lan can đầu Bắc/Nam của 2 Hành Lang (X ∈ [-20.8, -16.0] và [16.0, 20.8], Z = ±18.0)
  { minX: -20.9, maxX: -15.9, minZ: -18.4, maxZ: -17.6 },
  { minX: -20.9, maxX: -15.9, minZ: 17.6, maxZ: 18.4 },
  { minX: 15.9, maxX: 20.9, minZ: -18.4, maxZ: -17.6 },
  { minX: 15.9, maxX: 20.9, minZ: 17.6, maxZ: 18.4 },

  // Tường bao Bắc/Nam của Tả Vu & Hữu Vu (Z = ±10.5 cho |X| >= 20.6)
  { minX: -31.4, maxX: -20.5, minZ: -10.85, maxZ: -10.15 },
  { minX: -31.4, maxX: -20.5, minZ: 10.15, maxZ: 10.85 },
  { minX: 20.5, maxX: 31.4, minZ: -10.85, maxZ: -10.15 },
  { minX: 20.5, maxX: 31.4, minZ: 10.15, maxZ: 10.85 },

  // Tường Hậu Chính Điện (Z = -22.0): Mở 2 cửa Hậu Điện tại X ∈ [-12.15, -8.85] và X ∈ [8.85, 12.15]
  { minX: -16.2, maxX: -12.15, minZ: -22.35, maxZ: -21.65 },
  { minX: -8.85, maxX: 8.85, minZ: -22.35, maxZ: -21.65 },
  { minX: 12.15, maxX: 16.2, minZ: -22.35, maxZ: -21.65 },

  // Tường bao Đông/Tây của Hậu Sảnh (X = ±14.5 cho Z <= -22.0)
  { minX: -14.9, maxX: -14.1, minZ: -34.2, maxZ: -21.8 },
  { minX: 14.1, maxX: 14.9, minZ: -34.2, maxZ: -21.8 },

  // =========================================================================
  // NỘI THẤT TẢ VU (GIAN CHỜ QUAN VIÊN - PHÍA TÂY)
  // =========================================================================
  { minX: -29.8, maxX: -27.4, minZ: -2.1, maxZ: 2.1 }, // Án thư Trực Phòng & Bình phong Tả Vu
  { minX: -27.2, maxX: -24.0, minZ: -7.6, maxZ: -3.6 }, // Bộ Trường kỷ & Bàn trà Bắc Tả Vu
  { minX: -27.2, maxX: -24.0, minZ: 3.6, maxZ: 7.6 }, // Bộ Trường kỷ & Bàn trà Nam Tả Vu
  { minX: -29.9, maxX: -21.9, minZ: -10.3, maxZ: -9.1 }, // Tủ điển tịch Bắc
  { minX: -29.9, maxX: -21.9, minZ: 9.1, maxZ: 10.3 }, // Tủ điển tịch Nam

  // =========================================================================
  // NỘI THẤT HỮU VU (PHÒNG PHỤ TIẾP KHÁCH - PHÍA ĐÔNG)
  // =========================================================================
  { minX: 27.2, maxX: 30.2, minZ: -2.8, maxZ: 2.8 }, // Sập Gụ Tủ Chè & Bình phong Hữu Vu
  { minX: 23.6, maxX: 26.8, minZ: -6.9, maxZ: -3.5 }, // Cụm Ghế Thái Sư Bắc Hữu Vu
  { minX: 23.6, maxX: 26.8, minZ: 3.5, maxZ: 6.9 }, // Cụm Ghế Thái Sư Nam Hữu Vu
  { minX: 23.5, maxX: 24.9, minZ: -0.7, maxZ: 0.7 }, // Lư trầm đồng trung tâm Hữu Vu

  // =========================================================================
  // NỘI THẤT HẬU SẢNH & LỐI RA PHÍA SAU (PHÍA BẮC)
  // =========================================================================
  { minX: -2.6, maxX: 2.6, minZ: -26.8, maxZ: -24.4 }, // Ngự Án Hậu Sảnh & Bình phong
];

// Danh sách các công trình có nội thất 3D đi bộ vào trực tiếp (không bị chặn kín nguyên khối)
const OPEN_INTERIOR_BUILDING_IDS = new Set([
  'cong_chinh',
  'lai_bo',
  'hinh_bo',
  'han_lam_vien',
  'ngu_thu_phong',
  'ngu_hoa_vien',
]);

// Các khối kiến trúc trên Bản đồ Quần thể Hoàng Cung
const COMPOUND_BUILDING_BOXES: BoxObstacle[] = [
  // Chính Điện Thái Hòa vẫn giữ khối bao ngoài (để tương tác chuyển cảnh vào Nội Điện)
  ...PALACE_LANDMARKS.filter((l) => !OPEN_INTERIOR_BUILDING_IDS.has(l.id)).map((l) => {
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

  // =========================================================================
  // 1. TƯỜNG BAO & NỘI THẤT LẠI BỘ (Tâm: [-26, 0, -6], Cửa mở Đông tại X = -19.6, Z ∈ [-7.4, -4.6])
  // =========================================================================
  { minX: -32.6, maxX: -31.4, minZ: -10.4, maxZ: -1.6 }, // Vách Hậu Tây
  { minX: -32.6, maxX: -19.4, minZ: -10.4, maxZ: -9.4 }, // Vách Bắc
  { minX: -32.6, maxX: -19.4, minZ: -2.6, maxZ: -1.6 },  // Vách Nam
  { minX: -20.6, maxX: -19.4, minZ: -10.4, maxZ: -7.4 }, // Vách Mặt Tiền Bắc
  { minX: -20.6, maxX: -19.4, minZ: -4.6, maxZ: -1.6 },  // Vách Mặt Tiền Nam (Cửa hở -7.4 -> -4.6)
  { minX: -31.2, maxX: -28.4, minZ: -7.5, maxZ: -4.5 }, // Án thư & Bình phong Thượng Thư
  { minX: -28.0, maxX: -25.5, minZ: -9.6, maxZ: -7.8 }, // Bàn bổ nhiệm
  { minX: -28.0, maxX: -25.5, minZ: -4.2, maxZ: -2.4 }, // Tủ hồ sơ công trạng

  // =========================================================================
  // 2. TƯỜNG BAO & NỘI THẤT HÌNH BỘ (Tâm: [26, 0, -6], Cửa mở Tây tại X = 19.6, Z ∈ [-7.4, -4.6])
  // =========================================================================
  { minX: 31.4, maxX: 32.6, minZ: -10.4, maxZ: -1.6 }, // Vách Hậu Đông
  { minX: 19.4, maxX: 32.6, minZ: -10.4, maxZ: -9.4 }, // Vách Bắc
  { minX: 19.4, maxX: 32.6, minZ: -2.6, maxZ: -1.6 },  // Vách Nam
  { minX: 19.4, maxX: 20.6, minZ: -10.4, maxZ: -7.4 }, // Vách Mặt Tiền Bắc
  { minX: 19.4, maxX: 20.6, minZ: -4.6, maxZ: -1.6 },  // Vách Mặt Tiền Nam (Cửa hở -7.4 -> -4.6)
  { minX: 28.4, maxX: 31.2, minZ: -7.5, maxZ: -4.5 }, // Bàn Công Đường & Bình phong
  { minX: 25.5, maxX: 28.0, minZ: -9.6, maxZ: -7.8 }, // Bàn mật án
  { minX: 25.5, maxX: 28.0, minZ: -4.2, maxZ: -2.4 }, // Rương vật chứng

  // =========================================================================
  // 3. TƯỜNG BAO & NỘI THẤT HÀN LÂM VIỆN (Tâm: [-27, 0, 18], Cửa mở Đông tại X = -20.0, Z ∈ [16.5, 19.5])
  // =========================================================================
  { minX: -33.8, maxX: -32.6, minZ: 13.2, maxZ: 22.8 }, // Vách Hậu Tây
  { minX: -33.8, maxX: -20.0, minZ: 13.2, maxZ: 14.2 }, // Vách Bắc
  { minX: -33.8, maxX: -20.0, minZ: 21.8, maxZ: 22.8 }, // Vách Nam
  { minX: -21.0, maxX: -19.8, minZ: 13.2, maxZ: 16.5 }, // Vách Mặt Tiền Bắc
  { minX: -21.0, maxX: -19.8, minZ: 19.5, maxZ: 22.8 }, // Vách Mặt Tiền Nam (Cửa hở 16.5 -> 19.5)
  { minX: -32.5, maxX: -29.8, minZ: 16.6, maxZ: 19.4 }, // Bàn Chủ Khảo Chu Văn
  { minX: -29.5, maxX: -27.5, minZ: 14.6, maxZ: 16.6 }, // Bàn khảo thí Bắc
  { minX: -29.5, maxX: -27.5, minZ: 19.4, maxZ: 21.4 }, // Bàn khảo thí Nam
  { minX: -31.5, maxX: -24.5, minZ: 13.8, maxZ: 15.0 }, // Giá sách Bắc
  { minX: -31.5, maxX: -24.5, minZ: 21.0, maxZ: 22.2 }, // Giá sách Nam

  // =========================================================================
  // 4. TƯỜNG BAO & NỘI THẤT NGỰ THƯ PHÒNG (Tâm: [0, 0, -31], Cửa mở Nam tại Z = -26.8, X ∈ [-1.6, 1.6])
  // =========================================================================
  { minX: -7.8, maxX: 7.8, minZ: -35.6, maxZ: -34.6 }, // Vách Hậu Bắc
  { minX: -7.8, maxX: -6.8, minZ: -35.6, maxZ: -26.6 }, // Vách Tây
  { minX: 6.8, maxX: 7.8, minZ: -35.6, maxZ: -26.6 },  // Vách Đông
  { minX: -7.8, maxX: -1.6, minZ: -27.6, maxZ: -26.6 }, // Vách Mặt Tiền Tây
  { minX: 1.6, maxX: 7.8, minZ: -27.6, maxZ: -26.6 },  // Vách Mặt Tiền Đông (Cửa hở -1.6 -> +1.6)
  { minX: -2.0, maxX: 2.0, minZ: -34.8, maxZ: -31.8 }, // Ngự Án Hoàng Đế & Bình phong
  { minX: 2.8, maxX: 5.0, minZ: -32.6, maxZ: -30.4 },  // Sa bàn Bản đồ
  { minX: -5.0, maxX: -2.8, minZ: -32.6, maxZ: -30.4 }, // Giá sách thực lục

  // =========================================================================
  // 5. LAN CAN & NỘI THẤT THỦY ĐÌNH NGỰ HOA VIÊN (Tâm: [26, 0, 17])
  // Lối vào cầu đỏ phía Tây: X ∈ [19.2, 23.8], Z ∈ [15.6, 18.4]
  // =========================================================================
  { minX: 19.2, maxX: 32.8, minZ: 11.0, maxZ: 11.6 }, // Lan can Bắc hồ sen
  { minX: 19.2, maxX: 32.8, minZ: 22.4, maxZ: 23.0 }, // Lan can Nam hồ sen
  { minX: 32.2, maxX: 32.8, minZ: 11.0, maxZ: 23.0 }, // Lan can Đông hồ sen
  { minX: 19.2, maxX: 19.8, minZ: 11.0, maxZ: 15.6 }, // Lan can Tây Bắc hồ sen
  { minX: 19.2, maxX: 19.8, minZ: 18.4, maxZ: 23.0 }, // Lan can Tây Nam hồ sen
  { minX: 25.3, maxX: 26.7, minZ: 16.3, maxZ: 17.7 }, // Bàn trà đá cẩm thạch trung tâm Thủy Đình
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
 * Va chạm trong Nội Điện Thái Hòa, Hành Lang Đông – Tây, Tả Vu, Hữu Vu & Hậu Sảnh
 */
export function resolvePalaceMovement(
  prevX: number,
  prevY: number,
  prevZ: number,
  targetX: number,
  targetZ: number
): [number, number, number] {
  let x = THREE.MathUtils.clamp(targetX, -30.2, 30.2);
  let z = THREE.MathUtils.clamp(targetZ, -33.2, 21.1);

  const inStairCorridorX = Math.abs(x) <= 2.15;
  const wasOnDais =
    prevY >= 1.1 || (prevZ <= -13.8 && prevZ >= -21.2 && Math.abs(prevX) <= 7.5);

  if (!wasOnDais) {
    // Khối Bệ Rồng (chỉ áp dụng trong lòng Chính Điện Z ∈ [-21.2, -11.2], |X| < 8.4)
    if (z < -11.2 && z > -21.2 && !inStairCorridorX && Math.abs(x) < 8.4) {
      if (prevZ >= -11.2) {
        z = -11.2;
      } else if (prevZ <= -21.2) {
        z = -21.2;
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
  if (Math.abs(x) <= 7.6 && z <= -14.0 && z >= -21.2) {
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
