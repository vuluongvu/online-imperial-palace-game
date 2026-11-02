export type SceneZoneMode = 'compound_map' | 'main_hall_interior';

export interface LandmarkZone {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  position: [number, number, number];
  size: [number, number, number];
  labelHeight: number;
  roofStyle: 'gold' | 'slate' | 'jade';
  tiers: 1 | 2;
  spawnPoint: [number, number, number];
  cameraOffset: [number, number, number];
}

/**
 * Bố cục tổng thể Bản đồ Hoàng Cung Đại Nghiệp (7 Khu vực chuẩn theo thiết kế):
 * Trục Nam -> Bắc: Cổng Chính (Z = +38) -> Sân Chầu & Cầu Kim Thủy -> Chính Điện (Z = -6) -> Ngự Thư Phòng (Z = -32)
 * Cánh Tây (X < 0): Hàn Lâm Viện (Tây Nam) & Lại Bộ (Tây Bắc)
 * Cánh Đông (X > 0): Ngự Hoa Viên (Đông Nam) & Hình Bộ (Đông Bắc)
 */
export const PALACE_LANDMARKS: LandmarkZone[] = [
  {
    id: 'cong_chinh',
    name: 'Cổng Chính',
    icon: '⛩️',
    subtitle: 'Ngọ Môn Quan – Lối vào chính Hoàng Cung',
    position: [0, 0, 38],
    size: [18, 7.5, 6.5],
    labelHeight: 7.2,
    roofStyle: 'gold',
    tiers: 2,
    spawnPoint: [0, 0, 31],
    cameraOffset: [0, 26, 56],
  },
  {
    id: 'chinh_dien',
    name: 'Chính Điện',
    icon: '👑',
    subtitle: 'Thái Hòa Điện – Trung tâm thiết triều của Hoàng Đế (Nhấn để vào Nội Điện)',
    position: [0, 0, -6],
    size: [22, 10.5, 14],
    labelHeight: 11.2,
    roofStyle: 'gold',
    tiers: 2,
    spawnPoint: [0, 0, 7.5],
    cameraOffset: [0, 22, 24],
  },
  {
    id: 'ngu_thu_phong',
    name: 'Ngự Thư Phòng',
    icon: '📜',
    subtitle: 'Nơi Hoàng Đế phê duyệt tấu chương và triệu kiến trọng thần',
    position: [0, 0, -31],
    size: [17, 8.2, 10],
    labelHeight: 9.0,
    roofStyle: 'gold',
    tiers: 2,
    spawnPoint: [0, 0, -22],
    cameraOffset: [0, 18, -10],
  },
  {
    id: 'lai_bo',
    name: 'Lại Bộ',
    icon: '👥',
    subtitle: 'Quan署 quản lý bổ nhiệm, thăng giáng và khảo công bá quan',
    position: [-26, 0, -6],
    size: [14, 7.2, 10],
    labelHeight: 8.2,
    roofStyle: 'gold',
    tiers: 1,
    spawnPoint: [-17.5, 0, -6],
    cameraOffset: [-26, 18, 12],
  },
  {
    id: 'hinh_bo',
    name: 'Hình Bộ',
    icon: '⚖️',
    subtitle: 'Cơ quan xét xử hình luật, kỷ cương và pháp độ triều đình',
    position: [26, 0, -6],
    size: [14, 7.2, 10],
    labelHeight: 8.2,
    roofStyle: 'gold',
    tiers: 1,
    spawnPoint: [17.5, 0, -6],
    cameraOffset: [26, 18, 12],
  },
  {
    id: 'han_lam_vien',
    name: 'Hàn Lâm Viện',
    icon: '📖',
    subtitle: 'Nơi biên soạn quốc sử, chiếu chỉ và hội tụ bậc đại nho',
    position: [-27, 0, 18],
    size: [15, 7.2, 11],
    labelHeight: 8.2,
    roofStyle: 'slate',
    tiers: 1,
    spawnPoint: [-18, 0, 18],
    cameraOffset: [-27, 18, 34],
  },
  {
    id: 'ngu_hoa_vien',
    name: 'Ngự Hoa Viên',
    icon: '🌸',
    subtitle: 'Vườn thượng uyển có hồ sen, cầu đỏ, thủy đình và rừng đào nở rộ',
    position: [26, 0, 17],
    size: [12, 6.5, 10],
    labelHeight: 7.5,
    roofStyle: 'jade',
    tiers: 1,
    spawnPoint: [15.5, 0, 17],
    cameraOffset: [26, 18, 34],
  },
];

// Tọa độ các NPC Quan Viên & Thị Vệ đứng chầu trên Sân Rồng (Giống ảnh mẫu)
export const COMPOUND_NPC_POSITIONS: {
  pos: [number, number, number];
  rotY: number;
  rank: 'minister' | 'mid_official' | 'low_official';
}[] = [
  // Hai hàng quan đại thần đứng chầu trước thềm Chính Điện
  { pos: [-3.2, 0, 4.5], rotY: Math.PI / 2, rank: 'minister' },
  { pos: [3.2, 0, 4.5], rotY: -Math.PI / 2, rank: 'minister' },
  { pos: [-3.2, 0, 8.8], rotY: Math.PI / 2, rank: 'mid_official' },
  { pos: [3.2, 0, 8.8], rotY: -Math.PI / 2, rank: 'mid_official' },
  { pos: [-2.8, 0, 14.2], rotY: 0, rank: 'low_official' },
  { pos: [2.8, 0, 14.2], rotY: 0, rank: 'low_official' },
  // Hai quan viên gác trước Cổng Chính
  { pos: [-3.6, 0, 43.5], rotY: 0, rank: 'low_official' },
  { pos: [3.6, 0, 43.5], rotY: 0, rank: 'low_official' },
];

// Tọa độ cây xanh và cây hoa đào hồng trong Hoàng Cung
export const COMPOUND_TREES: {
  pos: [number, number, number];
  scale: number;
  type: 'green' | 'blossom';
}[] = [
  // Rừng hoa đào quanh Ngự Hoa Viên (Đông Nam)
  { pos: [33, 0, 11], scale: 1.25, type: 'blossom' },
  { pos: [34, 0, 23], scale: 1.3, type: 'blossom' },
  { pos: [20, 0, 25], scale: 1.1, type: 'blossom' },
  { pos: [14, 0, 11], scale: 1.0, type: 'blossom' },
  { pos: [29, 0, 4], scale: 1.15, type: 'blossom' },
  // Hoa đào quanh Chính Điện & Ngự Thư Phòng
  { pos: [-13, 0, -5], scale: 1.15, type: 'blossom' },
  { pos: [13, 0, -5], scale: 1.15, type: 'blossom' },
  { pos: [-12, 0, -26], scale: 1.25, type: 'blossom' },
  { pos: [12, 0, -26], scale: 1.25, type: 'blossom' },
  { pos: [-18, 0, -31], scale: 1.2, type: 'blossom' },
  { pos: [18, 0, -31], scale: 1.2, type: 'blossom' },
  { pos: [-8, 0, 32], scale: 1.05, type: 'blossom' },
  { pos: [8, 0, 32], scale: 1.05, type: 'blossom' },
  // Cây tùng bách xanh quanh Hàn Lâm Viện, Lại Bộ, Hình Bộ & Tường thành
  { pos: [-16, 0, 28], scale: 1.2, type: 'green' },
  { pos: [-22, 0, 31], scale: 1.3, type: 'green' },
  { pos: [-35, 0, 26], scale: 1.25, type: 'green' },
  { pos: [-35, 0, 10], scale: 1.15, type: 'green' },
  { pos: [-35, 0, -14], scale: 1.2, type: 'green' },
  { pos: [35, 0, -14], scale: 1.2, type: 'green' },
  { pos: [-16, 0, -16], scale: 1.1, type: 'green' },
  { pos: [16, 0, -16], scale: 1.1, type: 'green' },
  { pos: [-26, 0, -24], scale: 1.25, type: 'green' },
  { pos: [26, 0, -24], scale: 1.25, type: 'green' },
  // Cây cảnh dọc ngoại thành phía Nam Cổng Chính
  { pos: [-18, 0, 44], scale: 1.35, type: 'green' },
  { pos: [-26, 0, 45], scale: 1.2, type: 'green' },
  { pos: [18, 0, 44], scale: 1.35, type: 'green' },
  { pos: [26, 0, 45], scale: 1.2, type: 'green' },
];

// Đèn lồng trụ đá dọc theo trục thần đạo & các sân điện
export const COMPOUND_STREET_LANTERNS: [number, number, number][] = [
  [-5.2, 0, 33],
  [5.2, 0, 33],
  [-5.2, 0, 23],
  [5.2, 0, 23],
  [-5.2, 0, 13],
  [5.2, 0, 13],
  [-5.2, 0, 4],
  [5.2, 0, 4],
  [-15.5, 0, 1],
  [15.5, 0, 1],
  [-15.5, 0, -13],
  [15.5, 0, -13],
  [-8.5, 0, -22],
  [8.5, 0, -22],
];
