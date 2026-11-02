import * as THREE from 'three';

/**
 * Bảng màu chuẩn Art Direction & Kiến trúc Cung đình Triều Nguyễn (Điện Thái Hòa – Huế):
 * - Imperial Red (Sơn son): #8E1B1B / #A92222
 * - Warm Gold (Thếp vàng): #D9A738 / #F2C96B
 * - Dark Wood Brown (Gỗ lim / Gỗ gụ): #3C2415 / #51321E
 * - Cream: #F4EAD5
 * - Muted Jade Green / Pháp Lam Huế: #4E7C67
 */
export const IMPERIAL_PALETTE = {
  imperialRed: '#941C1C',
  imperialRedBright: '#B82828',
  imperialRedDark: '#5E1010',
  warmGold: '#DCA83A',
  warmGoldLight: '#F6D379',
  darkWood: '#3B2314',
  mediumWood: '#593620',
  cream: '#F3E9D2',
  mutedJade: '#4F7D68',
  mutedJadeDark: '#335445',
  stoneBase: '#DBD2BE',
  stoneDark: '#9A8F7A',
  porcelainWhite: '#F1F4F6',
  porcelainBlue: '#2C5882',
} as const;

export interface PalaceMaterialSet {
  woodFloor: THREE.MeshStandardMaterial;
  redPillar: THREE.MeshStandardMaterial;
  goldenDragonPillar: THREE.MeshStandardMaterial;
  warmGold: THREE.MeshStandardMaterial;
  darkWood: THREE.MeshStandardMaterial;
  mediumWood: THREE.MeshStandardMaterial;
  creamWall: THREE.MeshStandardMaterial;
  mutedJade: THREE.MeshStandardMaterial;
  paintedBeam: THREE.MeshStandardMaterial;
  nhatThiNhatHoa: THREE.MeshStandardMaterial;
  carvedWallPanel: THREE.MeshStandardMaterial;
  buuTanCanopy: THREE.MeshStandardMaterial;
  redCarpet: THREE.MeshStandardMaterial;
  stoneBase: THREE.MeshStandardMaterial;
  danBeStone: THREE.MeshStandardMaterial;
  lanternSilk: THREE.MeshStandardMaterial;
  cofferedCeiling: THREE.MeshStandardMaterial;
  dragonScreen: THREE.MeshStandardMaterial;
  imperialPlaque: THREE.MeshStandardMaterial;
  silkBanner: THREE.MeshStandardMaterial;
  latticeWindow: THREE.MeshStandardMaterial;
  porcelainVase: THREE.MeshStandardMaterial;
  cushionBrocade: THREE.MeshStandardMaterial;
  dispose: () => void;
}

function createWoodFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Nền gạch Bát Tràng / Gỗ lim bóng có hoa văn kỷ hà cổ điển
  ctx.fillStyle = '#382012';
  ctx.fillRect(0, 0, 512, 512);

  const plankRows = 8;
  const plankHeight = 512 / plankRows;

  for (let r = 0; r < plankRows; r++) {
    const y = r * plankHeight;
    const toneShift = (r % 3) * 6 - 4;
    ctx.fillStyle = `rgb(${58 + toneShift}, ${33 + Math.floor(toneShift * 0.7)}, ${19 + Math.floor(toneShift * 0.5)})`;
    ctx.fillRect(0, y, 512, plankHeight);

    ctx.strokeStyle = 'rgba(25, 12, 6, 0.35)';
    ctx.lineWidth = 1.5;
    for (let g = 1; g <= 4; g++) {
      ctx.beginPath();
      ctx.moveTo(0, y + (plankHeight / 5) * g);
      ctx.lineTo(512, y + (plankHeight / 5) * g);
      ctx.stroke();
    }

    ctx.strokeStyle = '#1E1008';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    const jointX = ((r * 173) % 380) + 64;
    ctx.beginPath();
    ctx.moveTo(jointX, y);
    ctx.lineTo(jointX, y + plankHeight);
    ctx.stroke();

    // Hoa văn đồng tiền / chữ Thọ dập chìm trên nền gạch cung đình
    ctx.strokeStyle = 'rgba(220, 168, 58, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(jointX - 24, y + 14, 36, 36);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 14);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createRedPillarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Thân cột gỗ lim sơn son thếp vàng hình rồng mây ẩn hiện (Phong cách Điện Thái Hòa Huế)
  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, '#741212');
  grad.addColorStop(0.5, '#A61E1E');
  grad.addColorStop(1, '#741212');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Phần đầu cột vẽ hoa văn cung đình (Xanh Pháp Lam - Đỏ - Vàng Kim)
  ctx.fillStyle = '#2F5C4B';
  ctx.fillRect(0, 0, 512, 64);
  ctx.fillStyle = '#1E3F66';
  ctx.fillRect(0, 64, 512, 26);

  ctx.strokeStyle = '#F2C55C';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 64);
  ctx.lineTo(512, 64);
  ctx.moveTo(0, 90);
  ctx.lineTo(512, 90);
  ctx.stroke();

  // Họa tiết rồng cuốn thủy & vân mây thếp vàng dọc thân cột đỏ
  ctx.strokeStyle = 'rgba(245, 203, 105, 0.48)';
  ctx.lineWidth = 4;
  for (let y = 120; y < 440; y += 90) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(170, y - 45, 340, y + 45, 512, y - 15);
    ctx.stroke();

    for (let x = 48; x < 480; x += 96) {
      ctx.beginPath();
      ctx.arc(x, y + 12, 16, 0, Math.PI * 1.5);
      ctx.stroke();
    }
  }

  // Chân cột hoa văn cánh sen vàng
  ctx.strokeStyle = '#E6B445';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 472);
  ctx.lineTo(512, 472);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createGoldenDragonPillarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, '#B5811E');
  grad.addColorStop(0.5, '#F5CB69');
  grad.addColorStop(1, '#B5811E');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#7A1616';
  ctx.lineWidth = 8;
  for (let y = -64; y < 560; y += 96) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(170, y - 55, 340, y + 55, 512, y - 20);
    ctx.stroke();
  }

  ctx.strokeStyle = '#FFF2B2';
  ctx.lineWidth = 4;
  for (let y = -56; y < 560; y += 96) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(170, y - 55, 340, y + 55, 512, y - 20);
    ctx.stroke();

    for (let x = 40; x < 480; x += 96) {
      ctx.beginPath();
      ctx.arc(x, y + 20, 16, 0, Math.PI * 1.5);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Hệ thống ô hộc "Nhất Thi Nhất Họa" (Một bài thơ - Một bức tranh) trên liên ba Điện Thái Hòa Huế
 */
function createNhatThiNhatHoaTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Nền gỗ sơn son thẫm
  ctx.fillStyle = '#6E1212';
  ctx.fillRect(0, 0, 512, 128);

  // Viền khung vàng trên dưới
  ctx.strokeStyle = '#F2C65E';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 504, 120);

  // Ô 1: Ô Thơ Ngự Chế (Khung chữ nhật bo góc thếp vàng)
  ctx.fillStyle = '#4A0C0C';
  ctx.fillRect(22, 18, 212, 92);
  ctx.strokeStyle = '#F5CB69';
  ctx.lineWidth = 4;
  ctx.strokeRect(22, 18, 212, 92);

  ctx.fillStyle = '#FFE48F';
  ctx.font = 'bold 20px "Segoe UI", serif';
  ctx.textAlign = 'center';
  ctx.fillText('VẠN CỔ AN BÌNH', 128, 54);
  ctx.fillText('THÁI HÒA CHÍNH KHÍ', 128, 86);

  // Ô 2: Ô Họa Bát Bửu / Lưỡng Long Chầu Nhật
  ctx.fillStyle = '#264B3E';
  ctx.fillRect(274, 18, 216, 92);
  ctx.strokeRect(274, 18, 216, 92);

  // Họa tiết mặt trời lửa & đôi rồng chầu
  ctx.fillStyle = '#FFE48F';
  ctx.beginPath();
  ctx.arc(382, 64, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#F5CB69';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(325, 64, 24, 0, Math.PI * 1.6);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(439, 64, 24, 0, Math.PI * 1.6);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(4, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Vách gỗ chạm nổi Lưỡng Long & Tứ Linh trên tường Đại Điện
 */
function createCarvedWallPanelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#521A12';
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = '#DCA83A';
  ctx.lineWidth = 6;
  for (let i = 0; i < 4; i++) {
    const x = i * 128;
    ctx.strokeRect(x + 10, 12, 108, 232);
    ctx.strokeStyle = '#9E221B';
    ctx.strokeRect(x + 18, 20, 92, 216);

    ctx.strokeStyle = '#F2C65E';
    ctx.beginPath();
    ctx.arc(x + 64, 128, 32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 64, 128, 16, 0, Math.PI * 1.5);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(4, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Hoa văn Bửu Tán (Lọng Hoàng Kim thêu Cửu Long đặc trưng trên Long Ngai Điện Thái Hòa Huế)
 */
function createBuuTanCanopyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#F5CB69');
  grad.addColorStop(0.65, '#C88D22');
  grad.addColorStop(1, '#8C1818');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // Diềm tua rua & vân mây rồng chạm lộng
  ctx.strokeStyle = '#7A1212';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 496, 240);

  ctx.strokeStyle = '#FFF0B5';
  ctx.lineWidth = 4;
  for (let x = 42; x < 480; x += 64) {
    ctx.beginPath();
    ctx.arc(x, 110, 24, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, 220, 28, Math.PI, 0);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPaintedBeamTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2B5947';
  ctx.fillRect(0, 0, 512, 128);

  ctx.fillStyle = '#1B3B63';
  ctx.fillRect(80, 14, 352, 100);

  ctx.strokeStyle = '#F2C65E';
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, 504, 120);
  ctx.strokeRect(80, 14, 352, 100);

  ctx.fillStyle = '#F5CB69';
  ctx.beginPath();
  ctx.arc(256, 64, 28, 0, Math.PI * 2);
  ctx.fill();

  for (let x = 130; x <= 382; x += 64) {
    ctx.beginPath();
    ctx.arc(x, 64, 16, 0, Math.PI * 1.4);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(3, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createCarpetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#8B1818';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = 'rgba(242, 198, 94, 0.42)';
  ctx.lineWidth = 4;
  for (let y = 64; y < 512; y += 128) {
    ctx.beginPath();
    ctx.arc(256, y, 42, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(256, y, 22, 0, Math.PI * 2);
    ctx.stroke();

    [-70, 70].forEach((dx) => {
      ctx.beginPath();
      ctx.arc(256 + dx, y, 14, 0, Math.PI * 1.5);
      ctx.stroke();
    });
  }

  ctx.fillStyle = '#DCA83A';
  ctx.fillRect(16, 0, 16, 512);
  ctx.fillRect(480, 0, 16, 512);

  ctx.fillRect(42, 0, 6, 512);
  ctx.fillRect(464, 0, 6, 512);

  ctx.strokeStyle = '#F6D379';
  ctx.lineWidth = 3;
  for (let y = 8; y < 512; y += 32) {
    ctx.strokeRect(56, y, 20, 20);
    ctx.strokeRect(436, y, 20, 20);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 8);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createDanBeStoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#DFD6C3';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#B89B67';
  ctx.lineWidth = 10;
  ctx.strokeRect(18, 18, 476, 476);

  ctx.strokeStyle = '#9C7F4C';
  ctx.lineWidth = 5;
  for (let y = 60; y < 460; y += 80) {
    ctx.beginPath();
    ctx.arc(256, y, 52, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(130, y, 28, 0, Math.PI * 1.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(382, y, 28, 0, Math.PI * 1.5);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createImperialPlaqueTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#5E0E0E';
  ctx.fillRect(0, 0, 512, 192);

  ctx.strokeStyle = '#F5CB69';
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, 492, 172);

  ctx.strokeStyle = '#DCA83A';
  ctx.lineWidth = 4;
  ctx.strokeRect(26, 26, 460, 140);

  ctx.fillStyle = '#FCE08B';
  ctx.font = 'bold 46px "Segoe UI", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('THÁI HÒA ĐIỆN', 256, 98);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createSilkBannerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#9E1B1B');
  grad.addColorStop(0.8, '#7A1212');
  grad.addColorStop(1, '#DCA83A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 512);

  ctx.strokeStyle = '#F5CB69';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 112, 496);

  for (let y = 64; y < 448; y += 72) {
    ctx.beginPath();
    ctx.arc(64, y, 22, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createCofferedCeilingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#385C4C';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#7E1919';
  ctx.lineWidth = 22;
  ctx.strokeRect(0, 0, 256, 256);

  ctx.strokeStyle = '#DCA83A';
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, 220, 220);

  ctx.fillStyle = '#E5B548';
  ctx.beginPath();
  ctx.arc(128, 128, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#8E1B1B';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(128, 128, 18, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 16);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createDragonScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#5E1111');
  grad.addColorStop(0.6, '#871919');
  grad.addColorStop(1, '#3D1E12');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = '#F2C65E';
  ctx.lineWidth = 6;
  const panelWidth = 512 / 7;
  for (let i = 0; i < 7; i++) {
    ctx.strokeRect(i * panelWidth + 3, 6, panelWidth - 6, 244);

    const cx = (i + 0.5) * panelWidth;
    ctx.fillStyle = i === 3 ? '#FFE48F' : '#E5B548';
    ctx.beginPath();
    ctx.arc(cx, i === 3 ? 88 : 108, i === 3 ? 26 : 18, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = '#F5CB69';
  ctx.lineWidth = 4;
  for (let x = 20; x < 495; x += 36) {
    ctx.beginPath();
    ctx.arc(x, 222, 18, Math.PI, 0);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createLatticeWindowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F7EED7';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#6E1818';
  ctx.lineWidth = 12;
  ctx.strokeRect(5, 5, 246, 246);

  ctx.lineWidth = 5;
  for (let i = 32; i < 256; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();
  }

  ctx.strokeStyle = '#DCA83A';
  ctx.lineWidth = 6;
  ctx.strokeRect(72, 72, 112, 112);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createPalaceMaterialSet(wireframe = false): PalaceMaterialSet {
  const woodFloorTex = createWoodFloorTexture();
  const redPillarTex = createRedPillarTexture();
  const goldenDragonPillarTex = createGoldenDragonPillarTexture();
  const paintedBeamTex = createPaintedBeamTexture();
  const nhatThiNhatHoaTex = createNhatThiNhatHoaTexture();
  const carvedWallTex = createCarvedWallPanelTexture();
  const buuTanTex = createBuuTanCanopyTexture();
  const carpetTex = createCarpetTexture();
  const danBeTex = createDanBeStoneTexture();
  const plaqueTex = createImperialPlaqueTexture();
  const bannerTex = createSilkBannerTexture();
  const ceilingTex = createCofferedCeilingTexture();
  const dragonScreenTex = createDragonScreenTexture();
  const latticeTex = createLatticeWindowTexture();

  const textures = [
    woodFloorTex,
    redPillarTex,
    goldenDragonPillarTex,
    paintedBeamTex,
    nhatThiNhatHoaTex,
    carvedWallTex,
    buuTanTex,
    carpetTex,
    danBeTex,
    plaqueTex,
    bannerTex,
    ceilingTex,
    dragonScreenTex,
    latticeTex,
  ];

  const woodFloor = new THREE.MeshStandardMaterial({
    map: woodFloorTex,
    roughness: 0.42,
    metalness: 0.1,
    wireframe,
  });

  const redPillar = new THREE.MeshStandardMaterial({
    map: redPillarTex,
    roughness: 0.28,
    metalness: 0.14,
    wireframe,
  });

  const goldenDragonPillar = new THREE.MeshStandardMaterial({
    map: goldenDragonPillarTex,
    roughness: 0.24,
    metalness: 0.68,
    wireframe,
  });

  const warmGold = new THREE.MeshStandardMaterial({
    color: IMPERIAL_PALETTE.warmGold,
    roughness: 0.22,
    metalness: 0.78,
    wireframe,
  });

  const darkWood = new THREE.MeshStandardMaterial({
    color: IMPERIAL_PALETTE.darkWood,
    roughness: 0.5,
    metalness: 0.08,
    wireframe,
  });

  const mediumWood = new THREE.MeshStandardMaterial({
    color: IMPERIAL_PALETTE.mediumWood,
    roughness: 0.48,
    metalness: 0.08,
    wireframe,
  });

  const creamWall = new THREE.MeshStandardMaterial({
    color: IMPERIAL_PALETTE.cream,
    roughness: 0.72,
    metalness: 0.02,
    wireframe,
  });

  const mutedJade = new THREE.MeshStandardMaterial({
    color: IMPERIAL_PALETTE.mutedJade,
    roughness: 0.4,
    metalness: 0.12,
    wireframe,
  });

  const paintedBeam = new THREE.MeshStandardMaterial({
    map: paintedBeamTex,
    roughness: 0.42,
    metalness: 0.18,
    wireframe,
  });

  const nhatThiNhatHoa = new THREE.MeshStandardMaterial({
    map: nhatThiNhatHoaTex,
    roughness: 0.35,
    metalness: 0.35,
    wireframe,
  });

  const carvedWallPanel = new THREE.MeshStandardMaterial({
    map: carvedWallTex,
    roughness: 0.45,
    metalness: 0.22,
    wireframe,
  });

  const buuTanCanopy = new THREE.MeshStandardMaterial({
    map: buuTanTex,
    roughness: 0.3,
    metalness: 0.55,
    side: THREE.DoubleSide,
    wireframe,
  });

  const redCarpet = new THREE.MeshStandardMaterial({
    map: carpetTex,
    roughness: 0.8,
    metalness: 0.05,
    wireframe,
  });

  const stoneBase = new THREE.MeshStandardMaterial({
    color: IMPERIAL_PALETTE.stoneBase,
    roughness: 0.55,
    metalness: 0.06,
    wireframe,
  });

  const danBeStone = new THREE.MeshStandardMaterial({
    map: danBeTex,
    roughness: 0.48,
    metalness: 0.08,
    wireframe,
  });

  const lanternSilk = new THREE.MeshStandardMaterial({
    color: '#D93829',
    emissive: '#FF6B2B',
    emissiveIntensity: 0.9,
    roughness: 0.38,
    metalness: 0.05,
    wireframe,
  });

  const cofferedCeiling = new THREE.MeshStandardMaterial({
    map: ceilingTex,
    roughness: 0.58,
    metalness: 0.12,
    wireframe,
  });

  const dragonScreen = new THREE.MeshStandardMaterial({
    map: dragonScreenTex,
    roughness: 0.32,
    metalness: 0.3,
    wireframe,
  });

  const imperialPlaque = new THREE.MeshStandardMaterial({
    map: plaqueTex,
    roughness: 0.28,
    metalness: 0.45,
    wireframe,
  });

  const silkBanner = new THREE.MeshStandardMaterial({
    map: bannerTex,
    roughness: 0.5,
    metalness: 0.15,
    side: THREE.DoubleSide,
    wireframe,
  });

  const latticeWindow = new THREE.MeshStandardMaterial({
    map: latticeTex,
    emissive: '#FFE4B5',
    emissiveIntensity: 0.42,
    roughness: 0.48,
    wireframe,
  });

  const porcelainVase = new THREE.MeshStandardMaterial({
    color: IMPERIAL_PALETTE.porcelainWhite,
    roughness: 0.16,
    metalness: 0.18,
    wireframe,
  });

  const cushionBrocade = new THREE.MeshStandardMaterial({
    color: '#C83228',
    roughness: 0.6,
    metalness: 0.18,
    wireframe,
  });

  const materials = [
    woodFloor,
    redPillar,
    goldenDragonPillar,
    warmGold,
    darkWood,
    mediumWood,
    creamWall,
    mutedJade,
    paintedBeam,
    nhatThiNhatHoa,
    carvedWallPanel,
    buuTanCanopy,
    redCarpet,
    stoneBase,
    danBeStone,
    lanternSilk,
    cofferedCeiling,
    dragonScreen,
    imperialPlaque,
    silkBanner,
    latticeWindow,
    porcelainVase,
    cushionBrocade,
  ];

  return {
    woodFloor,
    redPillar,
    goldenDragonPillar,
    warmGold,
    darkWood,
    mediumWood,
    creamWall,
    mutedJade,
    paintedBeam,
    nhatThiNhatHoa,
    carvedWallPanel,
    buuTanCanopy,
    redCarpet,
    stoneBase,
    danBeStone,
    lanternSilk,
    cofferedCeiling,
    dragonScreen,
    imperialPlaque,
    silkBanner,
    latticeWindow,
    porcelainVase,
    cushionBrocade,
    dispose: () => {
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}
