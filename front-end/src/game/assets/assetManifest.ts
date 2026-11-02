export type AssetCategory = 'characters' | 'buildings' | 'props' | 'animations' | 'textures';

export interface AssetEntry {
  id: string;
  name: string;
  category: AssetCategory;
  targetPath: string;
  status: 'placeholder_instanced' | 'placeholder_procedural' | 'glb_ready';
  recommendedSources: {
    provider: 'Kenney' | 'Sketchfab' | 'Poly Haven' | 'Mixamo';
    suggestion: string;
    license: string;
  }[];
  notes: string;
}

/**
 * Danh mục quản lý tài nguyên 3D của Đại Nghiệp.
 * Tuân thủ nghiêm ngặt quy tắc: Minh bạch trạng thái file .glb thực tế và placeholder.
 */
export const ASSET_MANIFEST: AssetEntry[] = [
  {
    id: 'char_official_chibi',
    name: 'Nhân vật Quan Viên Chibi Big Head (40-45% head ratio)',
    category: 'characters',
    targetPath: '/assets/characters/chibi_official.glb',
    status: 'placeholder_procedural',
    recommendedSources: [
      {
        provider: 'Sketchfab',
        suggestion: 'Chibi Mandarin Official / Ancient Chinese Chibi Character (Rigged GLB)',
        license: 'CC-BY 4.0 / Standard Royalty-Free',
      },
      {
        provider: 'Mixamo',
        suggestion: 'Y-Bot / Chibi Rig retargeted with Idle, Walking, Running animations',
        license: 'Royalty-Free (Adobe Mixamo)',
      },
    ],
    notes: 'Sẽ triển khai đầy đủ Chibi rig + Idle/Walk/Run trong Phase 2.',
  },
  {
    id: 'building_palace_pillar',
    name: 'Cột Gỗ Đỏ Hoàng Cung (Red Palace Pillar)',
    category: 'buildings',
    targetPath: '/assets/buildings/red_palace_pillar.glb',
    status: 'placeholder_instanced',
    recommendedSources: [
      {
        provider: 'Sketchfab',
        suggestion: 'Chinese Imperial Palace Column / DouGong Bracket Pillar (Low-poly GLB)',
        license: 'CC0 / CC-BY 4.0',
      },
    ],
    notes: 'Đang render bằng InstancedMesh (16 cột đại điện + chân tảng đá + vòng kim loại vàng).',
  },
  {
    id: 'building_traditional_door',
    name: 'Cửa Gỗ Cổ Trang Đinh Đồng (Traditional Palace Door)',
    category: 'buildings',
    targetPath: '/assets/buildings/traditional_wooden_door.glb',
    status: 'placeholder_procedural',
    recommendedSources: [
      {
        provider: 'Sketchfab',
        suggestion: 'Chinese Traditional Palace Gate / Wooden Lattice Door',
        license: 'CC-BY 4.0',
      },
    ],
    notes: 'Cửa gỗ 6 cánh phía Nam có nan hoa cửa sổ và đinh đồng hoàng gia.',
  },
  {
    id: 'prop_imperial_throne',
    name: 'Long Ngai & Bình Phong Cửu Long (Imperial Dragon Throne)',
    category: 'props',
    targetPath: '/assets/props/imperial_throne.glb',
    status: 'placeholder_procedural',
    recommendedSources: [
      {
        provider: 'Sketchfab',
        suggestion: 'Forbidden City Dragon Throne (Hall of Supreme Harmony) Stylized GLB',
        license: 'CC-BY 4.0',
      },
    ],
    notes: 'Đặt trên bệ rồng 3 cấp ở cuối Chính điện (Z = -18), sơn son thếp vàng.',
  },
  {
    id: 'prop_official_desk_set',
    name: 'Bàn & Ghế Quan Viên (Official Wooden Table & Chair)',
    category: 'props',
    targetPath: '/assets/props/official_table_chair.glb',
    status: 'placeholder_instanced',
    recommendedSources: [
      {
        provider: 'Kenney',
        suggestion: 'Kenney Furniture Kit (customized Ming-style dark wood material)',
        license: 'CC0 1.0 Universal',
      },
      {
        provider: 'Sketchfab',
        suggestion: 'Ming Dynasty Wooden Table & Official Armchair (Guanyinmao)',
        license: 'CC-BY 4.0',
      },
    ],
    notes: '12 bộ bàn ghế quan viên xếp 2 hàng đối xứng hai bên thảm đỏ, tối ưu bằng InstancedMesh.',
  },
  {
    id: 'prop_palace_lantern',
    name: 'Đèn Lồng Cung Đình (Decorative Palace Lantern)',
    category: 'props',
    targetPath: '/assets/props/palace_lantern.glb',
    status: 'placeholder_instanced',
    recommendedSources: [
      {
        provider: 'Sketchfab',
        suggestion: 'Traditional Chinese Red Silk Palace Lantern (Low-Poly GLB)',
        license: 'CC0 / CC-BY 4.0',
      },
    ],
    notes: '12 đèn lồng treo dọc hành lang cột, có chuyển động đung đưa nhẹ theo thời gian thực.',
  },
  {
    id: 'prop_porcelain_vase',
    name: 'Bình Hoa Sứ Thanh Hoa & Lư Hương Đồng (Traditional Ornaments)',
    category: 'props',
    targetPath: '/assets/props/porcelain_vase.glb',
    status: 'placeholder_instanced',
    recommendedSources: [
      {
        provider: 'Poly Haven',
        suggestion: 'Ceramic Vase / Brass Urn props (GLTF)',
        license: 'CC0 1.0 Universal',
      },
    ],
    notes: 'Bình hoa sứ tạo bằng LatheGeometry kết hợp InstancedMesh và lư hương đồng trước bệ rồng.',
  },
];
