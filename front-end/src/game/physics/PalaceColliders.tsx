import React from 'react';
import {
  CuboidCollider,
  CylinderCollider,
  RigidBody,
} from '@react-three/rapier';
import { MAIN_HALL_LAYOUT } from '../world/MainHall';

/**
 * Hệ thống Collider vật lý cho Chính điện bằng @react-three/rapier:
 * - Đồng bộ tự động với tọa độ 16 Cột Đại Điện Sơn Son + 6 Cột Bàn Long Thếp Vàng mới.
 * - Tạo mặt dốc (Ramp Collider) mượt mà tại bậc tam cấp Bệ Rồng để Hoàng Đế có thể bước lên Bệ Rồng.
 */
export const PalaceColliders: React.FC = () => {
  return (
    <RigidBody type="fixed" colliders={false} friction={0.2}>
      {/* Sàn gỗ Chính điện */}
      <CuboidCollider args={[16, 0.5, 22]} position={[0, -0.5, 0]} />

      {/* 4 Bức tường bao quanh Chính điện */}
      <CuboidCollider args={[16, 6, 0.5]} position={[0, 6, -22]} />
      <CuboidCollider args={[16, 6, 0.5]} position={[0, 6, 22]} />
      <CuboidCollider args={[0.5, 6, 22]} position={[-16, 6, 0]} />
      <CuboidCollider args={[0.5, 6, 22]} position={[16, 6, 0]} />

      {/* 16 Cột gỗ đỏ đại điện */}
      {MAIN_HALL_LAYOUT.pillarPositions.map(([x, , z], idx) => (
        <CylinderCollider
          key={`pillar-col-${idx}`}
          args={[5.5, 0.68]}
          position={[x, 5.5, z]}
        />
      ))}

      {/* 6 Cột Bàn Long Thếp Vàng trên Bệ Rồng */}
      {MAIN_HALL_LAYOUT.goldenDragonPillarPositions.map(([x, , z], idx) => (
        <CylinderCollider
          key={`gold-pillar-col-${idx}`}
          args={[5.5, 0.7]}
          position={[x, 5.5, z]}
        />
      ))}

      {/* 12 Bộ bàn ghế quan viên hai bên Ngự Đạo */}
      {MAIN_HALL_LAYOUT.officialDeskPositions.map(({ pos }, idx) => {
        const [x, , z] = pos;
        const offsetX = x < 0 ? -0.45 : 0.45;
        return (
          <CuboidCollider
            key={`desk-col-${idx}`}
            args={[1.15, 0.9, 1.0]}
            position={[x + offsetX, 0.9, z]}
          />
        );
      })}

      {/* Bệ Rồng (Hai cánh trái/phải của bệ cao chặn đi xuyên ngang) */}
      <CuboidCollider args={[2.8, 0.9, 4.8]} position={[-5.4, 0.9, -16.4]} />
      <CuboidCollider args={[2.8, 0.9, 4.8]} position={[5.4, 0.9, -16.4]} />

      {/* Mặt sàn đỉnh Bệ Rồng (Nơi đặt Long Ngai, cao Y = 1.82m) */}
      <CuboidCollider args={[5.2, 0.91, 3.2]} position={[0, 0.91, -17.25]} />

      {/* Mặt dốc Ngự Đạo giữa Bệ Rồng (Cho phép nhân vật bước mượt từ sàn lên Bệ Rồng) */}
      <CuboidCollider
        args={[2.4, 0.15, 2.3]}
        position={[0, 0.85, -12.9]}
        rotation={[0.46, 0, 0]}
      />

      {/* Collider chặn xuyên qua Long Ngai & Bình Phong Cửu Long */}
      <CuboidCollider args={[1.45, 2.0, 1.1]} position={[0, 2.8, -17.65]} />
      <CuboidCollider args={[4.2, 2.5, 0.35]} position={[0, 3.2, -19.55]} />
    </RigidBody>
  );
};
