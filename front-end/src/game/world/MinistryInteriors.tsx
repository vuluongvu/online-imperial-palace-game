import React from 'react';
import * as THREE from 'three';

interface MinistryProps {
  materials: Record<string, THREE.Material>;
  showWireframe?: boolean;
}

/**
 * Khung tường bao với Cửa Chính Mở (3 Vách Kín + 1 Mặt Cửa mở thông)
 * faceDirection:
 *   - 'east'  (+X): Lại Bộ, Hàn Lâm Viện (Cửa hướng Đông ra Sân Rồng)
 *   - 'west'  (-X): Hình Bộ (Cửa hướng Tây ra Sân Rồng)
 *   - 'south' (+Z): Ngự Thư Phòng (Cửa hướng Nam ra sau Thái Hòa Điện)
 */
const OpenHallWalls: React.FC<{
  w: number;
  h: number;
  d: number;
  doorWidth: number;
  doorHeight: number;
  faceDirection: 'east' | 'west' | 'south';
  materials: Record<string, THREE.Material>;
  hallSignText?: string;
}> = ({
  w,
  h,
  d,
  doorWidth,
  doorHeight,
  faceDirection,
  materials,
  hallSignText,
}) => {
  const wallThick = 0.42;
  const wallH = h * 0.58;
  const halfW = (w * 0.84) / 2;
  const halfD = (d * 0.8) / 2;
  const yCenter = wallH / 2;

  // Lắp ghép 4 vách tường dựa trên hướng cửa ra vào
  return (
    <group position={[0, 0.45, 0]}>
      {/* Sàn gỗ bóng cung đình bên trong sảnh */}
      <mesh
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={materials.darkWood}
        receiveShadow
      >
        <planeGeometry args={[w * 0.82, d * 0.78]} />
      </mesh>

      {/* Thảm đỏ dẫn đường từ cửa vào án thư */}
      {faceDirection === 'south' ? (
        <mesh
          position={[0, 0.025, halfD / 2 - 0.6]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.redCarpet}
          receiveShadow
        >
          <planeGeometry args={[doorWidth * 0.85, halfD + 1.2]} />
        </mesh>
      ) : (
        <mesh
          position={[
            faceDirection === 'east' ? halfW / 2 - 0.6 : -halfW / 2 + 0.6,
            0.025,
            0,
          ]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.redCarpet}
          receiveShadow
        >
          <planeGeometry args={[halfW + 1.2, doorWidth * 0.85]} />
        </mesh>
      )}

      {/* =================================================================== */}
      {/* TRƯỜNG HỢP 1: CỬA HƯỚNG ĐÔNG (+X) - LẠI BỘ & HÀN LÂM VIỆN           */}
      {/* =================================================================== */}
      {faceDirection === 'east' && (
        <>
          {/* Vách Hậu (Tây: X = -halfW) - Vách kín */}
          <mesh
            position={[-halfW, yCenter, 0]}
            material={materials.wallRed}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[wallThick, wallH, d * 0.8]} />
          </mesh>

          {/* Vách Bắc (Z = -halfD) - Vách kín */}
          <mesh
            position={[0, yCenter, -halfD]}
            material={materials.wallRed}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w * 0.84, wallH, wallThick]} />
          </mesh>

          {/* Vách Nam (Z = +halfD) - Vách kín */}
          <mesh
            position={[0, yCenter, halfD]}
            material={materials.wallRed}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w * 0.84, wallH, wallThick]} />
          </mesh>

          {/* Vách Mặt Tiền (Đông: X = +halfW) - Có Lối Vào Ở Giữa */}
          {/* Mảng tường Bắc mặt tiền */}
          <mesh
            position={[
              halfW,
              yCenter,
              -halfD + (halfD - doorWidth / 2) / 2,
            ]}
            material={materials.wallRed}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[wallThick, wallH, halfD - doorWidth / 2]} />
          </mesh>

          {/* Mảng tường Nam mặt tiền */}
          <mesh
            position={[
              halfW,
              yCenter,
              halfD - (halfD - doorWidth / 2) / 2,
            ]}
            material={materials.wallRed}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[wallThick, wallH, halfD - doorWidth / 2]} />
          </mesh>

          {/* Khung Dầm Cửa ngang phía trên cửa */}
          <mesh
            position={[
              halfW,
              doorHeight + (wallH - doorHeight) / 2,
              0,
            ]}
            material={materials.wallRed}
            castShadow
          >
            <boxGeometry args={[wallThick + 0.12, wallH - doorHeight, doorWidth]} />
          </mesh>

          {/* Trụ khung cửa thếp vàng */}
          <mesh
            position={[halfW + 0.08, doorHeight / 2, -doorWidth / 2]}
            material={materials.darkWood}
          >
            <boxGeometry args={[0.22, doorHeight, 0.22]} />
          </mesh>
          <mesh
            position={[halfW + 0.08, doorHeight / 2, doorWidth / 2]}
            material={materials.darkWood}
          >
            <boxGeometry args={[0.22, doorHeight, 0.22]} />
          </mesh>

          {/* Biển Hoành Phi thếp vàng trên cửa vào */}
          {hallSignText && (
            <group position={[halfW + 0.18, doorHeight + 0.42, 0]}>
              <mesh material={materials.darkWood}>
                <boxGeometry args={[0.12, 0.58, 2.4]} />
              </mesh>
              <mesh position={[0.07, 0, 0]} material={materials.goldTrim}>
                <boxGeometry args={[0.04, 0.46, 2.24]} />
              </mesh>
            </group>
          )}

          {/* Cánh cửa gỗ lim mở nép vào hai bên tường */}
          <mesh
            position={[halfW - 0.45, doorHeight / 2, -doorWidth / 2 - 0.15]}
            rotation={[0, 0.25, 0]}
            material={materials.darkWood}
          >
            <boxGeometry args={[0.12, doorHeight * 0.95, doorWidth * 0.48]} />
          </mesh>
          <mesh
            position={[halfW - 0.45, doorHeight / 2, doorWidth / 2 + 0.15]}
            rotation={[0, -0.25, 0]}
            material={materials.darkWood}
          >
            <boxGeometry args={[0.12, doorHeight * 0.95, doorWidth * 0.48]} />
          </mesh>
        </>
      )}

      {/* =================================================================== */}
      {/* TRƯỜNG HỢP 2: CỬA HƯỚNG TÂY (-X) - HÌNH BỘ                           */}
      {/* =================================================================== */}
      {faceDirection === 'west' && (
        <>
          {/* Vách Hậu (Đông: X = +halfW) - Vách kín */}
          <mesh
            position={[halfW, yCenter, 0]}
            material={materials.wallRed}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[wallThick, wallH, d * 0.8]} />
          </mesh>

          {/* Vách Bắc (Z = -halfD) - Vách kín */}
          <mesh
            position={[0, yCenter, -halfD]}
            material={materials.wallRed}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w * 0.84, wallH, wallThick]} />
          </mesh>

          {/* Vách Nam (Z = +halfD) - Vách kín */}
          <mesh
            position={[0, yCenter, halfD]}
            material={materials.wallRed}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w * 0.84, wallH, wallThick]} />
          </mesh>

          {/* Vách Mặt Tiền (Tây: X = -halfW) - Có Lối Vào Ở Giữa */}
          <mesh
            position={[
              -halfW,
              yCenter,
              -halfD + (halfD - doorWidth / 2) / 2,
            ]}
            material={materials.wallRed}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[wallThick, wallH, halfD - doorWidth / 2]} />
          </mesh>

          <mesh
            position={[
              -halfW,
              yCenter,
              halfD - (halfD - doorWidth / 2) / 2,
            ]}
            material={materials.wallRed}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[wallThick, wallH, halfD - doorWidth / 2]} />
          </mesh>

          <mesh
            position={[
              -halfW,
              doorHeight + (wallH - doorHeight) / 2,
              0,
            ]}
            material={materials.wallRed}
            castShadow
          >
            <boxGeometry args={[wallThick + 0.12, wallH - doorHeight, doorWidth]} />
          </mesh>

          {/* Trụ khung cửa thếp vàng */}
          <mesh
            position={[-halfW - 0.08, doorHeight / 2, -doorWidth / 2]}
            material={materials.darkWood}
          >
            <boxGeometry args={[0.22, doorHeight, 0.22]} />
          </mesh>
          <mesh
            position={[-halfW - 0.08, doorHeight / 2, doorWidth / 2]}
            material={materials.darkWood}
          >
            <boxGeometry args={[0.22, doorHeight, 0.22]} />
          </mesh>

          {/* Biển Hoành Phi thếp vàng */}
          {hallSignText && (
            <group position={[-halfW - 0.18, doorHeight + 0.42, 0]}>
              <mesh material={materials.darkWood}>
                <boxGeometry args={[0.12, 0.58, 2.4]} />
              </mesh>
              <mesh position={[-0.07, 0, 0]} material={materials.goldTrim}>
                <boxGeometry args={[0.04, 0.46, 2.24]} />
              </mesh>
            </group>
          )}

          {/* Cánh cửa mở */}
          <mesh
            position={[-halfW + 0.45, doorHeight / 2, -doorWidth / 2 - 0.15]}
            rotation={[0, -0.25, 0]}
            material={materials.darkWood}
          >
            <boxGeometry args={[0.12, doorHeight * 0.95, doorWidth * 0.48]} />
          </mesh>
          <mesh
            position={[-halfW + 0.45, doorHeight / 2, doorWidth / 2 + 0.15]}
            rotation={[0, 0.25, 0]}
            material={materials.darkWood}
          >
            <boxGeometry args={[0.12, doorHeight * 0.95, doorWidth * 0.48]} />
          </mesh>
        </>
      )}

      {/* =================================================================== */}
      {/* TRƯỜNG HỢP 3: CỬA HƯỚNG NAM (+Z) - NGỰ THƯ PHÒNG                    */}
      {/* =================================================================== */}
      {faceDirection === 'south' && (
        <>
          {/* Vách Hậu (Bắc: Z = -halfD) - Vách kín */}
          <mesh
            position={[0, yCenter, -halfD]}
            material={materials.wallRed}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[w * 0.84, wallH, wallThick]} />
          </mesh>

          {/* Vách Tây (X = -halfW) - Vách kín */}
          <mesh
            position={[-halfW, yCenter, 0]}
            material={materials.wallRed}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[wallThick, wallH, d * 0.8]} />
          </mesh>

          {/* Vách Đông (X = +halfW) - Vách kín */}
          <mesh
            position={[halfW, yCenter, 0]}
            material={materials.wallRed}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[wallThick, wallH, d * 0.8]} />
          </mesh>

          {/* Vách Mặt Tiền (Nam: Z = +halfD) - Có Lối Vào Ở Giữa */}
          <mesh
            position={[
              -halfW + (halfW - doorWidth / 2) / 2,
              yCenter,
              halfD,
            ]}
            material={materials.wallRed}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[halfW - doorWidth / 2, wallH, wallThick]} />
          </mesh>

          <mesh
            position={[
              halfW - (halfW - doorWidth / 2) / 2,
              yCenter,
              halfD,
            ]}
            material={materials.wallRed}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[halfW - doorWidth / 2, wallH, wallThick]} />
          </mesh>

          <mesh
            position={[
              0,
              doorHeight + (wallH - doorHeight) / 2,
              halfD,
            ]}
            material={materials.wallRed}
            castShadow
          >
            <boxGeometry args={[doorWidth, wallH - doorHeight, wallThick + 0.12]} />
          </mesh>

          {/* Trụ khung cửa thếp vàng */}
          <mesh
            position={[-doorWidth / 2, doorHeight / 2, halfD + 0.08]}
            material={materials.darkWood}
          >
            <boxGeometry args={[0.22, doorHeight, 0.22]} />
          </mesh>
          <mesh
            position={[doorWidth / 2, doorHeight / 2, halfD + 0.08]}
            material={materials.darkWood}
          >
            <boxGeometry args={[0.22, doorHeight, 0.22]} />
          </mesh>

          {/* Biển Hoành Phi thếp vàng */}
          {hallSignText && (
            <group position={[0, doorHeight + 0.42, halfD + 0.18]}>
              <mesh material={materials.darkWood}>
                <boxGeometry args={[2.4, 0.58, 0.12]} />
              </mesh>
              <mesh position={[0, 0, 0.07]} material={materials.goldTrim}>
                <boxGeometry args={[2.24, 0.46, 0.04]} />
              </mesh>
            </group>
          )}

          {/* Cánh cửa mở */}
          <mesh
            position={[-doorWidth / 2 - 0.15, doorHeight / 2, halfD - 0.45]}
            rotation={[0, 0, 0.25]}
            material={materials.darkWood}
          >
            <boxGeometry args={[doorWidth * 0.48, doorHeight * 0.95, 0.12]} />
          </mesh>
          <mesh
            position={[doorWidth / 2 + 0.15, doorHeight / 2, halfD - 0.45]}
            rotation={[0, 0, -0.25]}
            material={materials.darkWood}
          >
            <boxGeometry args={[doorWidth * 0.48, doorHeight * 0.95, 0.12]} />
          </mesh>
        </>
      )}

      {/* 4 Cột đỏ chống đỡ kết cấu xà ngang bên trong */}
      {[-halfW * 0.5, halfW * 0.5].map((xCol) =>
        [-halfD * 0.5, halfD * 0.5].map((zCol) => (
          <group key={`int-col-${xCol}-${zCol}`} position={[xCol, yCenter, zCol]}>
            <mesh material={materials.pillarRed} castShadow>
              <cylinderGeometry args={[0.2, 0.22, wallH, 12]} />
            </mesh>
            {/* Chân tảng đá hoa sen */}
            <mesh position={[0, -wallH / 2 + 0.1, 0]} material={materials.whiteMarble}>
              <cylinderGeometry args={[0.3, 0.34, 0.2, 10]} />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
};

/**
 * =============================================================================
 * 1. NỘI THẤT LẠI BỘ (MINISTRY OF PERSONNEL INTERIOR)
 * Quản lý tuyển bổ, thăng hàm, công đức quan viên. Cửa mở hướng Đông.
 * =============================================================================
 */
export const LaiBoInterior: React.FC<MinistryProps> = ({ materials }) => {
  return (
    <group name="LaiBoInterior_Group">
      {/* Tường bao có cửa mở hướng Đông ra sân chầu */}
      <OpenHallWalls
        w={14}
        h={7.2}
        d={10}
        doorWidth={2.8}
        doorHeight={3.2}
        faceDirection="east"
        materials={materials}
        hallSignText="LẠI BỘ QUAN THỰ"
      />

      {/* Án thư Thượng Thư Phạm Công Trứ (Phía Tây sảnh điện) */}
      <group position={[-3.8, 0.45, 0]}>
        {/* Sập gụ nâng cao */}
        <mesh position={[0, 0.08, 0]} material={materials.darkWood} receiveShadow>
          <boxGeometry args={[2.4, 0.16, 1.8]} />
        </mesh>
        {/* Bình phong tứ quý đằng sau lưng quan Thượng Thư */}
        <mesh position={[-0.95, 1.25, 0]} material={materials.darkWood} castShadow>
          <boxGeometry args={[0.1, 2.2, 2.2]} />
        </mesh>
        <mesh position={[-0.88, 1.25, 0]} material={materials.goldTrim}>
          <boxGeometry args={[0.02, 1.9, 2.0]} />
        </mesh>
        {/* Bàn làm việc Thượng Thư */}
        <mesh position={[0.35, 0.5, 0]} material={materials.darkWood} castShadow>
          <boxGeometry args={[0.85, 0.84, 1.6]} />
        </mesh>
        {/* Khăn trải gấm đỏ & Tấu chương */}
        <mesh position={[0.35, 0.93, 0]} material={materials.redCarpet}>
          <boxGeometry args={[0.65, 0.02, 1.4]} />
        </mesh>
        <mesh position={[0.42, 0.98, -0.4]} material={materials.goldTrim}>
          <boxGeometry args={[0.2, 0.12, 0.2]} />
        </mesh>
        <mesh position={[0.35, 0.96, 0.3]} material={materials.whiteMarble}>
          <boxGeometry args={[0.35, 0.08, 0.4]} />
        </mesh>
      </group>

      {/* Bàn Thư lại & Điểm danh bên sườn Bắc (Z = -2.8) */}
      <group position={[-0.8, 0.45, -2.8]}>
        <mesh position={[0, 0.42, 0]} material={materials.darkWood} castShadow>
          <boxGeometry args={[1.6, 0.8, 0.8]} />
        </mesh>
        <mesh position={[0, 0.83, 0]} material={materials.whiteMarble}>
          <boxGeometry args={[1.2, 0.04, 0.5]} />
        </mesh>
      </group>

      {/* Tủ lưu trữ hồ sơ bổ nhiệm bên sườn Nam (Z = +2.8) */}
      <group position={[-0.8, 0.45, 2.8]}>
        <mesh position={[0, 1.25, 0]} material={materials.darkWood} castShadow>
          <boxGeometry args={[1.8, 2.4, 0.6]} />
        </mesh>
        {/* Ngăn kéo & Cuộn tấu */}
        <mesh position={[0, 1.25, -0.28]} material={materials.goldTrim}>
          <boxGeometry args={[1.6, 2.1, 0.06]} />
        </mesh>
      </group>
    </group>
  );
};

/**
 * =============================================================================
 * 2. NỘI THẤT HÌNH BỘ (MINISTRY OF JUSTICE INTERIOR)
 * Công đường xét xử, hồ sơ mật án, rương chứng cứ. Cửa mở hướng Tây.
 * =============================================================================
 */
export const HinhBoInterior: React.FC<MinistryProps> = ({ materials }) => {
  return (
    <group name="HinhBoInterior_Group">
      {/* Tường bao có cửa mở hướng Tây ra sân chầu */}
      <OpenHallWalls
        w={14}
        h={7.2}
        d={10}
        doorWidth={2.8}
        doorHeight={3.2}
        faceDirection="west"
        materials={materials}
        hallSignText="HÌNH BỘ NHA MÔN"
      />

      {/* Bàn Công Đường Thượng Thư Bao Thanh (Phía Đông sảnh điện) */}
      <group position={[3.8, 0.45, 0]}>
        <mesh position={[0, 0.08, 0]} material={materials.darkWood} receiveShadow>
          <boxGeometry args={[2.4, 0.16, 1.8]} />
        </mesh>
        {/* Bức bình phong uy nghiêm hình Hải Triều Nhật Xuất */}
        <mesh position={[0.95, 1.25, 0]} material={materials.darkWood} castShadow>
          <boxGeometry args={[0.1, 2.2, 2.2]} />
        </mesh>
        <mesh position={[0.88, 1.25, 0]} material={materials.pillarRed}>
          <boxGeometry args={[0.02, 1.9, 2.0]} />
        </mesh>
        {/* Bàn án công đường sơn son thếp vàng */}
        <mesh position={[-0.35, 0.5, 0]} material={materials.darkWood} castShadow>
          <boxGeometry args={[0.85, 0.84, 1.6]} />
        </mesh>
        {/* Kinh đường mộc & Thẻ bài lệnh tiễn */}
        <mesh position={[-0.35, 0.94, 0]} material={materials.redCarpet}>
          <boxGeometry args={[0.65, 0.02, 1.4]} />
        </mesh>
        <mesh position={[-0.42, 0.98, -0.3]} material={materials.darkWood}>
          <boxGeometry args={[0.14, 0.08, 0.28]} />
        </mesh>
        <mesh position={[-0.35, 0.98, 0.35]} material={materials.goldTrim}>
          <boxGeometry args={[0.22, 0.12, 0.18]} />
        </mesh>
      </group>

      {/* Bàn Hồ sơ Vụ án bên sườn Bắc (Z = -2.8) */}
      <group position={[0.8, 0.45, -2.8]}>
        <mesh position={[0, 0.42, 0]} material={materials.darkWood} castShadow>
          <boxGeometry args={[1.6, 0.8, 0.8]} />
        </mesh>
        <mesh position={[0, 0.84, 0]} material={materials.whiteMarble}>
          <boxGeometry args={[1.3, 0.06, 0.5]} />
        </mesh>
      </group>

      {/* Rương Thiết Giáp chứa Tang vật & Bằng chứng bên sườn Nam (Z = +2.8) */}
      <group position={[0.8, 0.45, 2.8]}>
        <mesh position={[0, 0.32, 0]} material={materials.darkWood} castShadow>
          <boxGeometry args={[1.2, 0.64, 0.7]} />
        </mesh>
        {/* Đai sắt kiên cố trên rương */}
        <mesh position={[0, 0.33, 0]} material={materials.goldTrim}>
          <boxGeometry args={[1.24, 0.66, 0.12]} />
        </mesh>
      </group>
    </group>
  );
};

/**
 * =============================================================================
 * 3. NỘI THẤT HÀN LÂM VIỆN (IMPERIAL ACADEMY INTERIOR)
 * Không gian thi cử khoa bảng, bàn đọc sách, giá sách cổ tịch. Cửa mở hướng Đông.
 * =============================================================================
 */
export const HanLamVienInterior: React.FC<MinistryProps> = ({ materials }) => {
  return (
    <group name="HanLamVienInterior_Group">
      <OpenHallWalls
        w={15}
        h={7.2}
        d={11}
        doorWidth={2.8}
        doorHeight={3.2}
        faceDirection="east"
        materials={materials}
        hallSignText="HÀN LÂM VIỆN"
      />

      {/* Bàn Chủ Khảo Chu Văn (Phía Tây) */}
      <group position={[-4.2, 0.45, 0]}>
        <mesh position={[0, 0.08, 0]} material={materials.darkWood} receiveShadow>
          <boxGeometry args={[2.2, 0.16, 1.8]} />
        </mesh>
        {/* Bình phong Thư Họa sau lưng Chủ khảo */}
        <mesh position={[-0.95, 1.25, 0]} material={materials.darkWood} castShadow>
          <boxGeometry args={[0.1, 2.2, 2.2]} />
        </mesh>
        <mesh position={[-0.88, 1.25, 0]} material={materials.whiteMarble}>
          <boxGeometry args={[0.02, 1.9, 2.0]} />
        </mesh>
        {/* Án thư Giám Khảo */}
        <mesh position={[0.35, 0.5, 0]} material={materials.darkWood} castShadow>
          <boxGeometry args={[0.85, 0.84, 1.6]} />
        </mesh>
        <mesh position={[0.35, 0.94, 0]} material={materials.whiteMarble}>
          <boxGeometry args={[0.65, 0.04, 1.3]} />
        </mesh>
      </group>

      {/* Dãy bàn thấp Khảo Thí cho thí sinh (2 hàng bàn ngay ngắn) */}
      {[-1.6, 1.2].map((xPos, colIdx) =>
        [-1.8, 1.8].map((zPos, rowIdx) => (
          <group key={`exam-desk-${colIdx}-${rowIdx}`} position={[xPos, 0.45, zPos]}>
            {/* Bàn thi gỗ thấp */}
            <mesh position={[0, 0.28, 0]} material={materials.darkWood} castShadow>
              <boxGeometry args={[1.1, 0.54, 0.7]} />
            </mesh>
            {/* Cuộn giấy thi & nghiên mực */}
            <mesh position={[-0.1, 0.56, 0]} material={materials.whiteMarble}>
              <boxGeometry args={[0.6, 0.03, 0.45]} />
            </mesh>
            <mesh position={[0.32, 0.57, 0.12]} material={materials.darkWood}>
              <cylinderGeometry args={[0.08, 0.09, 0.04, 10]} />
            </mesh>
            {/* Đệm ngồi gấm điều */}
            <mesh position={[0, 0.04, -0.65]} material={materials.redCarpet}>
              <boxGeometry args={[0.6, 0.08, 0.5]} />
            </mesh>
          </group>
        ))
      )}

      {/* Giá sách Cổ tịch dọc tường Bắc (Z = -3.4) */}
      <group position={[-0.8, 0.45, -3.4]}>
        <mesh position={[0, 1.25, 0]} material={materials.darkWood} castShadow>
          <boxGeometry args={[2.8, 2.4, 0.55]} />
        </mesh>
        {/* Hàng gáy sách cổ Han-Nom */}
        {[-0.8, 0, 0.8].map((xS, idx) => (
          <mesh key={`book-row-n-${idx}`} position={[xS, 1.2, 0.25]} material={materials.goldTrim}>
            <boxGeometry args={[0.65, 0.45, 0.12]} />
          </mesh>
        ))}
      </group>

      {/* Giá sách Cổ tịch dọc tường Nam (Z = +3.4) */}
      <group position={[-0.8, 0.45, 3.4]}>
        <mesh position={[0, 1.25, 0]} material={materials.darkWood} castShadow>
          <boxGeometry args={[2.8, 2.4, 0.55]} />
        </mesh>
        {[-0.8, 0, 0.8].map((xS, idx) => (
          <mesh key={`book-row-s-${idx}`} position={[xS, 1.2, -0.25]} material={materials.goldTrim}>
            <boxGeometry args={[0.65, 0.45, 0.12]} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/**
 * =============================================================================
 * 4. NỘI THẤT NGỰ THƯ PHÒNG (IMPERIAL STUDY INTERIOR)
 * Ngự Án Hoàng Đế, bình phong Cửu Long, sa bàn non sông. Cửa mở hướng Nam.
 * =============================================================================
 */
export const NguThuPhongInterior: React.FC<MinistryProps> = ({ materials }) => {
  return (
    <group name="NguThuPhongInterior_Group">
      <OpenHallWalls
        w={17}
        h={8.2}
        d={10}
        doorWidth={3.2}
        doorHeight={3.4}
        faceDirection="south"
        materials={materials}
        hallSignText="NGỰ THƯ PHÒNG"
      />

      {/* Ngự Án Hoàng Đế phê duyệt quốc sự (Phía Bắc sảnh điện) */}
      <group position={[0, 0.45, -2.6]}>
        {/* Bệ ngự tọa bọc gấm vàng hoàng gia */}
        <mesh position={[0, 0.08, 0]} material={materials.darkWood} receiveShadow>
          <boxGeometry args={[3.2, 0.16, 2.0]} />
        </mesh>
        {/* Bình phong Cửu Long thếp vàng uy nghiêm sau lưng Ngự Tọa */}
        <mesh position={[0, 1.35, -0.92]} material={materials.darkWood} castShadow>
          <boxGeometry args={[3.0, 2.4, 0.1]} />
        </mesh>
        <mesh position={[0, 1.35, -0.85]} material={materials.goldTrim}>
          <boxGeometry args={[2.7, 2.1, 0.03]} />
        </mesh>
        {/* Ngự Án chạm khắc rồng vàng */}
        <mesh position={[0, 0.52, 0.35]} material={materials.darkWood} castShadow>
          <boxGeometry args={[2.0, 0.88, 0.85]} />
        </mesh>
        {/* Thảm trải gấm điều ngự dụng */}
        <mesh position={[0, 0.98, 0.35]} material={materials.redCarpet}>
          <boxGeometry args={[1.7, 0.02, 0.65]} />
        </mesh>
        {/* Hộp Ngọc Tỷ thếp vàng & Tấu chương chu phê */}
        <mesh position={[-0.55, 1.05, 0.35]} material={materials.goldTrim}>
          <boxGeometry args={[0.24, 0.16, 0.24]} />
        </mesh>
        <mesh position={[0.42, 1.02, 0.35]} material={materials.whiteMarble}>
          <boxGeometry args={[0.4, 0.06, 0.45]} />
        </mesh>
      </group>

      {/* Sa bàn Bản Đồ Đại Nghiệp bên sườn Đông (X = +3.8, Z = -0.5) */}
      <group position={[3.8, 0.45, -0.5]}>
        {/* Chân giá sa bàn gỗ lim */}
        <mesh position={[0, 0.42, 0]} material={materials.darkWood} castShadow>
          <boxGeometry args={[1.8, 0.84, 1.4]} />
        </mesh>
        {/* Mặt sa bàn địa hình non sông */}
        <mesh position={[0, 0.86, 0]} material={materials.foliageGreen}>
          <boxGeometry args={[1.6, 0.08, 1.2]} />
        </mesh>
        {/* Dòng sông xanh uốn lượn trên sa bàn */}
        <mesh position={[0, 0.91, 0]} material={materials.waterPond}>
          <boxGeometry args={[0.4, 0.03, 1.15]} />
        </mesh>
      </group>

      {/* Giá sách Hoàng Triều Thực Lục bên sườn Tây (X = -3.8, Z = -0.5) */}
      <group position={[-3.8, 0.45, -0.5]}>
        <mesh position={[0, 1.35, 0]} material={materials.darkWood} castShadow>
          <boxGeometry args={[1.5, 2.6, 0.6]} />
        </mesh>
        {/* Các cuộn ngự chiếu trên giá sách */}
        <mesh position={[0, 1.35, 0.28]} material={materials.goldTrim}>
          <boxGeometry args={[1.3, 2.2, 0.08]} />
        </mesh>
      </group>
    </group>
  );
};
