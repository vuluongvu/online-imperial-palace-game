import * as THREE from 'three';

export type OfficialRank = 'emperor' | 'minister' | 'mid_official' | 'low_official';

export interface RankOutfitConfig {
  rank: OfficialRank;
  titleVi: string;
  subtitleVi: string;
  primaryColor: string;
  secondaryColor: string;
  trimColor: string;
  beltColor: string;
  hatType: 'mien_luu' | 'o_sa_mao';
}

export const RANK_OUTFITS: Record<OfficialRank, RankOutfitConfig> = {
  emperor: {
    rank: 'emperor',
    titleVi: 'Hoàng Đế (Thiên Tử)',
    subtitleVi: 'Cửu Ngũ Chí Tôn – Long Bào Hoàng Kim & Mũ Miện Lưu',
    primaryColor: '#E0A82E',
    secondaryColor: '#9E1B1B',
    trimColor: '#FBE088',
    beltColor: '#F4F1E8',
    hatType: 'mien_luu',
  },
  minister: {
    rank: 'minister',
    titleVi: 'Đại Thần (Nhất Phẩm)',
    subtitleVi: 'Tể Tướng / Thượng Thư – Cẩm Bào Đỏ Thẫm & Mũ Ô Sa',
    primaryColor: '#9E1E1E',
    secondaryColor: '#5C1010',
    trimColor: '#E2B447',
    beltColor: '#E8DFC8',
    hatType: 'o_sa_mao',
  },
  mid_official: {
    rank: 'mid_official',
    titleVi: 'Quan Cấp Trung (Ngũ Phẩm)',
    subtitleVi: 'Lang Trung / Tri Phủ – Quan Phục Xanh Đậm',
    primaryColor: '#1C3F6E',
    secondaryColor: '#122847',
    trimColor: '#D4A843',
    beltColor: '#3B2314',
    hatType: 'o_sa_mao',
  },
  low_official: {
    rank: 'low_official',
    titleVi: 'Quan Cấp Thấp (Cửu Phẩm)',
    subtitleVi: 'Tân Khoa Tiến Sĩ / Lục Sự – Quan Phục Xanh Lam',
    primaryColor: '#2E78B0',
    secondaryColor: '#1D5078',
    trimColor: '#B8C4CC',
    beltColor: '#3B2314',
    hatType: 'o_sa_mao',
  },
};

/**
 * Tạo CanvasTexture họa tiết Long Bào / Quan Phục cổ trang (thêu Đoàn Long, Thủy Ba ở gấu áo).
 */
export function createRobeTexture(config: RankOutfitConfig): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Nền lụa gấm chuyển sắc nhẹ
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, config.primaryColor);
  grad.addColorStop(0.75, config.primaryColor);
  grad.addColorStop(1, config.secondaryColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Họa tiết vân mây chìm trên gấm
  ctx.strokeStyle = 'rgba(255, 240, 190, 0.16)';
  ctx.lineWidth = 3;
  for (let y = 40; y < 380; y += 64) {
    for (let x = 32; x < 480; x += 80) {
      ctx.beginPath();
      ctx.arc(x + ((y / 64) % 2) * 35, y, 16, 0, Math.PI * 1.4);
      ctx.stroke();
    }
  }

  // Bổ tử trước ngực (Đoàn Long cho Hoàng Đế / Tiên Hạc cho Quan viên)
  ctx.fillStyle = config.rank === 'emperor' ? '#B82020' : '#182232';
  ctx.beginPath();
  if (config.rank === 'emperor') {
    ctx.arc(256, 155, 62, 0, Math.PI * 2);
  } else {
    ctx.rect(198, 98, 116, 112);
  }
  ctx.fill();

  ctx.strokeStyle = config.trimColor;
  ctx.lineWidth = 6;
  ctx.stroke();

  // Họa tiết Rồng Vàng / Hạc Vàng chính tâm Bổ Tử
  ctx.fillStyle = config.trimColor;
  ctx.beginPath();
  ctx.arc(256, 155, 34, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = config.primaryColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(256, 155, 20, 0.3, Math.PI * 1.8);
  ctx.stroke();

  // Viền Thủy Ba Giang Nha (Sóng biển & núi thiêng) ở chân vạt Long Bào
  ctx.fillStyle = config.secondaryColor;
  ctx.fillRect(0, 415, 512, 97);

  ctx.strokeStyle = config.trimColor;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 415);
  ctx.lineTo(512, 415);
  ctx.stroke();

  // Sóng cuộn vàng dưới vạt áo
  for (let x = 0; x <= 512; x += 48) {
    ctx.beginPath();
    ctx.arc(x, 465, 26, Math.PI, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + 24, 495, 22, Math.PI, 0);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
