/**
 * Kích thước & tọa độ bố cục Thái Hòa Chính Điện (Imperial Main Hall)
 * Tách riêng thành module dữ liệu thuần túy (pure data) để tránh circular dependency
 * giữa MainHall, PalaceColliders và useGameStore.
 */
export const MAIN_HALL_LAYOUT = {
  width: 32,
  length: 44,
  wallHeight: 11.5,
  // 6 Cột Rồng Vàng (Bàn Long Kim Trụ) bao quanh Long Ngai trên khu vực Bệ Rồng
  goldenDragonPillarPositions: [
    [-4.5, 0, -13.0],
    [4.5, 0, -13.0],
    [-4.5, 0, -16.8],
    [4.5, 0, -16.8],
    [-4.5, 0, -20.4],
    [4.5, 0, -20.4],
  ] as [number, number, number][],
  // 16 Cột Đại Điện Sơn Son (Hàng cột Nội điện X = ±8.2m & Ngoại điện X = ±13.6m)
  pillarPositions: [
    [-8.2, 0, -8.5],
    [-8.2, 0, -1.0],
    [-8.2, 0, 6.5],
    [-8.2, 0, 14.0],
    [8.2, 0, -8.5],
    [8.2, 0, -1.0],
    [8.2, 0, 6.5],
    [8.2, 0, 14.0],
    [-13.6, 0, -8.5],
    [-13.6, 0, -1.0],
    [-13.6, 0, 6.5],
    [-13.6, 0, 14.0],
    [13.6, 0, -8.5],
    [13.6, 0, -1.0],
    [13.6, 0, 6.5],
    [13.6, 0, 14.0],
  ] as [number, number, number][],
  officialDeskPositions: [
    // Hàng quan văn bên trái hướng mặt vào Ngự Đạo (X = -4.3m)
    { pos: [-4.3, 0, -7.2] as [number, number, number], rotY: Math.PI / 2 },
    { pos: [-4.3, 0, -3.6] as [number, number, number], rotY: Math.PI / 2 },
    { pos: [-4.3, 0, 0.0] as [number, number, number], rotY: Math.PI / 2 },
    { pos: [-4.3, 0, 3.6] as [number, number, number], rotY: Math.PI / 2 },
    { pos: [-4.3, 0, 7.2] as [number, number, number], rotY: Math.PI / 2 },
    { pos: [-4.3, 0, 10.8] as [number, number, number], rotY: Math.PI / 2 },
    // Hàng quan võ bên phải hướng mặt vào Ngự Đạo (X = +4.3m)
    { pos: [4.3, 0, -7.2] as [number, number, number], rotY: -Math.PI / 2 },
    { pos: [4.3, 0, -3.6] as [number, number, number], rotY: -Math.PI / 2 },
    { pos: [4.3, 0, 0.0] as [number, number, number], rotY: -Math.PI / 2 },
    { pos: [4.3, 0, 3.6] as [number, number, number], rotY: -Math.PI / 2 },
    { pos: [4.3, 0, 7.2] as [number, number, number], rotY: -Math.PI / 2 },
    { pos: [4.3, 0, 10.8] as [number, number, number], rotY: -Math.PI / 2 },
  ],
  // 12 Đèn lồng cung đình treo tại tâm các gian giữa hàng cột
  lanternPositions: [
    [-6.6, 8.6, -8.5],
    [-6.6, 8.6, -4.75],
    [-6.6, 8.6, -1.0],
    [-6.6, 8.6, 2.75],
    [-6.6, 8.6, 6.5],
    [-6.6, 8.6, 10.25],
    [6.6, 8.6, -8.5],
    [6.6, 8.6, -4.75],
    [6.6, 8.6, -1.0],
    [6.6, 8.6, 2.75],
    [6.6, 8.6, 6.5],
    [6.6, 8.6, 10.25],
  ] as [number, number, number][],
  // 8 Phướn lụa Hoàng Gia treo dọc hành lang nội điện
  silkBannerPositions: [
    [-7.4, 7.2, -8.5],
    [-7.4, 7.2, -1.0],
    [-7.4, 7.2, 6.5],
    [-7.4, 7.2, 14.0],
    [7.4, 7.2, -8.5],
    [7.4, 7.2, -1.0],
    [7.4, 7.2, 6.5],
    [7.4, 7.2, 14.0],
  ] as [number, number, number][],
  // 10 Bình hoa sứ Thanh Hoa & Bảo Bình đặt tại các gian điện
  vasePositions: [
    [-10.8, 0, -11.5],
    [10.8, 0, -11.5],
    [-10.8, 0, -4.8],
    [10.8, 0, -4.8],
    [-10.8, 0, 2.8],
    [10.8, 0, 2.8],
    [-10.8, 0, 10.2],
    [10.8, 0, 10.2],
    [-5.8, 0.6, -12.4],
    [5.8, 0.6, -12.4],
  ] as [number, number, number][],
};
