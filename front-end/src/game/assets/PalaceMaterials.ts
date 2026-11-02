import * as THREE from 'three';

/**
 * Bảng màu chuẩn Art Direction (Mục 3 - Environment Style):
 * - Imperial Red: #8E1B1B / #A92222
 * - Warm Gold: #D9A738 / #F2C96B
 * - Dark Wood Brown: #3C2415 / #51321E
 * - Cream: #F4EAD5
 * - Muted Jade Green: #4E7C67
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
  stoneBase: '#C8BFA8',
  stoneDark: '#8F8672',
  porcelainWhite: '#F1F4F6',
  porcelainBlue: '#2C5882',
} as const;

export interface PalaceMaterialSet {
  woodFloor: THREE.MeshStandardMaterial;
  redPillar: THREE.MeshStandardMaterial;
  warmGold: THREE.MeshStandardMaterial;
  darkWood: THREE.MeshStandardMaterial;
  mediumWood: THREE.MeshStandardMaterial;
  creamWall: THREE.MeshStandardMaterial;
  mutedJade: THREE.MeshStandardMaterial;
  redCarpet: THREE.MeshStandardMaterial;
  stoneBase: THREE.MeshStandardMaterial;
  lanternSilk: THREE.MeshStandardMaterial;
  cofferedCeiling: THREE.MeshStandardMaterial;
  dragonScreen: THREE.MeshStandardMaterial;
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

  ctx.fillStyle = '#3D2415';
  ctx.fillRect(0, 0, 512, 512);

  const plankRows = 8;
  const plankHeight = 512 / plankRows;

  for (let r = 0; r < plankRows; r++) {
    const y = r * plankHeight;
    const toneShift = (r % 3) * 6 - 4;
    ctx.fillStyle = `rgb(${61 + toneShift}, ${36 + Math.floor(toneShift * 0.7)}, ${21 + Math.floor(toneShift * 0.5)})`;
    ctx.fillRect(0, y, 512, plankHeight);

    // Vân gỗ mảnh
    ctx.strokeStyle = 'rgba(28, 15, 8, 0.35)';
    ctx.lineWidth = 1.5;
    for (let g = 1; g <= 4; g++) {
      ctx.beginPath();
      ctx.moveTo(0, y + (plankHeight / 5) * g);
      ctx.lineTo(512, y + (plankHeight / 5) * g);
      ctx.stroke();
    }

    // Khe ván ngang
    ctx.strokeStyle = '#1E1008';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    // Khe ván dọc so le
    const jointX = ((r * 173) % 380) + 64;
    ctx.beginPath();
    ctx.moveTo(jointX, y);
    ctx.lineTo(jointX, y + plankHeight);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 14);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createCarpetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Nền đỏ hoàng gia
  ctx.fillStyle = '#8B1818';
  ctx.fillRect(0, 0, 512, 512);

  // Họa tiết dệt chìm ở giữa thảm
  ctx.strokeStyle = 'rgba(220, 168, 58, 0.22)';
  ctx.lineWidth = 3;
  for (let y = 32; y < 512; y += 64) {
    ctx.beginPath();
    ctx.arc(256, y, 22, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Đường diềm vàng hai bên mép thảm (Hồi văn cổ trang)
  ctx.fillStyle = '#DCA83A';
  ctx.fillRect(18, 0, 14, 512);
  ctx.fillRect(480, 0, 14, 512);

  ctx.fillRect(42, 0, 5, 512);
  ctx.fillRect(465, 0, 5, 512);

  // Họa tiết chữ Vạn / Hồi văn chạy dọc biên
  ctx.strokeStyle = '#F3C766';
  ctx.lineWidth = 2.5;
  for (let y = 8; y < 512; y += 32) {
    ctx.strokeRect(54, y, 18, 18);
    ctx.strokeRect(440, y, 18, 18);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 9);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createCofferedCeilingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Nền xanh ngọc bích trầm (Muted Jade Green)
  ctx.fillStyle = '#385C4C';
  ctx.fillRect(0, 0, 256, 256);

  // Khung gỗ đỏ
  ctx.strokeStyle = '#7E1919';
  ctx.lineWidth = 22;
  ctx.strokeRect(0, 0, 256, 256);

  // Viền chỉ vàng
  ctx.strokeStyle = '#DCA83A';
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, 220, 220);

  // Hoa sen vàng chính tâm
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

  // Nền sơn mài đỏ thẫm
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#5E1111');
  grad.addColorStop(0.6, '#871919');
  grad.addColorStop(1, '#3D1E12');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // Khung chia 5 bức bình phong
  ctx.strokeStyle = '#DCA83A';
  ctx.lineWidth = 6;
  const panelWidth = 512 / 5;
  for (let i = 0; i < 5; i++) {
    ctx.strokeRect(i * panelWidth + 4, 6, panelWidth - 8, 244);
  }

  // Mặt trời / Châu ngọc rồng phát sáng ở chính tâm
  ctx.fillStyle = '#F5CC6A';
  ctx.beginPath();
  ctx.arc(256, 96, 36, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#FFF0B8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(256, 96, 46, 0, Math.PI * 2);
  ctx.stroke();

  // Vân mây vàng và sóng thủy ba phía dưới
  ctx.strokeStyle = '#E6B649';
  ctx.lineWidth = 4;
  for (let x = 24; x < 490; x += 48) {
    ctx.beginPath();
    ctx.arc(x, 215, 24, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 20, 150, 16, 0, Math.PI * 1.5);
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

  // Giấy tuyên phủ ánh nắng ấm (Cream)
  ctx.fillStyle = '#F7EED7';
  ctx.fillRect(0, 0, 256, 256);

  // Nan cửa sổ gỗ cổ trang
  ctx.strokeStyle = '#4B2816';
  ctx.lineWidth = 10;
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

  // Họa tiết chữ Thọ / Kỷ hà chính tâm
  ctx.strokeStyle = '#6E1818';
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
  const carpetTex = createCarpetTexture();
  const ceilingTex = createCofferedCeilingTexture();
  const dragonScreenTex = createDragonScreenTexture();
  const latticeTex = createLatticeWindowTexture();

  const textures = [woodFloorTex, carpetTex, ceilingTex, dragonScreenTex, latticeTex];

  const woodFloor = new THREE.MeshStandardMaterial({
    map: woodFloorTex,
    roughness: 0.45,
    metalness: 0.08,
    wireframe,
  });

  const redPillar = new THREE.MeshStandardMaterial({
    color: IMPERIAL_PALETTE.imperialRed,
    roughness: 0.32,
    metalness: 0.12,
    wireframe,
  });

  const warmGold = new THREE.MeshStandardMaterial({
    color: IMPERIAL_PALETTE.warmGold,
    roughness: 0.25,
    metalness: 0.72,
    wireframe,
  });

  const darkWood = new THREE.MeshStandardMaterial({
    color: IMPERIAL_PALETTE.darkWood,
    roughness: 0.55,
    metalness: 0.08,
    wireframe,
  });

  const mediumWood = new THREE.MeshStandardMaterial({
    color: IMPERIAL_PALETTE.mediumWood,
    roughness: 0.5,
    metalness: 0.08,
    wireframe,
  });

  const creamWall = new THREE.MeshStandardMaterial({
    color: IMPERIAL_PALETTE.cream,
    roughness: 0.78,
    metalness: 0.02,
    wireframe,
  });

  const mutedJade = new THREE.MeshStandardMaterial({
    color: IMPERIAL_PALETTE.mutedJade,
    roughness: 0.42,
    metalness: 0.1,
    wireframe,
  });

  const redCarpet = new THREE.MeshStandardMaterial({
    map: carpetTex,
    roughness: 0.82,
    metalness: 0.04,
    wireframe,
  });

  const stoneBase = new THREE.MeshStandardMaterial({
    color: IMPERIAL_PALETTE.stoneBase,
    roughness: 0.65,
    metalness: 0.05,
    wireframe,
  });

  const lanternSilk = new THREE.MeshStandardMaterial({
    color: '#D93829',
    emissive: '#FF6B2B',
    emissiveIntensity: 0.85,
    roughness: 0.4,
    metalness: 0.05,
    wireframe,
  });

  const cofferedCeiling = new THREE.MeshStandardMaterial({
    map: ceilingTex,
    roughness: 0.6,
    metalness: 0.1,
    wireframe,
  });

  const dragonScreen = new THREE.MeshStandardMaterial({
    map: dragonScreenTex,
    roughness: 0.35,
    metalness: 0.25,
    wireframe,
  });

  const latticeWindow = new THREE.MeshStandardMaterial({
    map: latticeTex,
    emissive: '#FFE4B5',
    emissiveIntensity: 0.38,
    roughness: 0.5,
    wireframe,
  });

  const porcelainVase = new THREE.MeshStandardMaterial({
    color: IMPERIAL_PALETTE.porcelainWhite,
    roughness: 0.18,
    metalness: 0.15,
    wireframe,
  });

  const cushionBrocade = new THREE.MeshStandardMaterial({
    color: '#C83228',
    roughness: 0.65,
    metalness: 0.15,
    wireframe,
  });

  const materials = [
    woodFloor,
    redPillar,
    warmGold,
    darkWood,
    mediumWood,
    creamWall,
    mutedJade,
    redCarpet,
    stoneBase,
    lanternSilk,
    cofferedCeiling,
    dragonScreen,
    latticeWindow,
    porcelainVase,
    cushionBrocade,
  ];

  return {
    woodFloor,
    redPillar,
    warmGold,
    darkWood,
    mediumWood,
    creamWall,
    mutedJade,
    redCarpet,
    stoneBase,
    lanternSilk,
    cofferedCeiling,
    dragonScreen,
    latticeWindow,
    porcelainVase,
    cushionBrocade,
    dispose: () => {
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}
