// Dữ liệu mẫu vật phẩm, quan hệ xã giao, danh hiệu và bản đồ cho UI Clean MMORPG

export interface InventoryItem {
  id: string;
  name: string;
  category: 'equipment' | 'quest' | 'consumable';
  quality: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  count: number;
  description: string;
  lore?: string;
  usable?: boolean;
}

export interface PlayerSocialContact {
  id: string;
  name: string;
  rankTitle: string;
  level: number;
  status: 'online' | 'busy' | 'offline';
  location: string;
  merit: number;
  affinity: number;
}

export interface OfficialHonorTitle {
  id: string;
  name: string;
  unlocked: boolean;
  requirement: string;
  bonus: string;
}

export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'item_ngoc_khue',
    name: 'Ngọc Khuê Triều Thần',
    category: 'equipment',
    quality: 'epic',
    icon: '🪨',
    count: 1,
    description: 'Thẻ ngọc cầm tay của quan viên khi vào chầu tại Điện Thái Hòa.',
    lore: 'Ngọc phỉ thúy nguyên khối chạm hình mây lành do Lễ Bộ cấp phát.',
    usable: true,
  },
  {
    id: 'item_lenh_bai_tap_su',
    name: 'Lệnh Bài Tập Sự Lại Bộ',
    category: 'quest',
    quality: 'common',
    icon: '🏷️',
    count: 1,
    description: 'Chứng nhận quan viên đang thực hiện công vụ khảo công mùa xuân.',
    lore: 'Ấn triện son đỏ của Thượng thư Lại Bộ Phạm Công Trứ.',
  },
  {
    id: 'item_mat_tau_bien_thuy',
    name: 'Bản Mật Tấu Biên Ải',
    category: 'quest',
    quality: 'rare',
    icon: '📜',
    count: 1,
    description: 'Bản sao tấu chương biên giới thu được trong vụ án tại Hình Bộ.',
    lore: 'Có dấu mực Chu Sa đỏ của thư lại ca đêm.',
  },
  {
    id: 'item_bang_tien_si',
    name: 'Bằng Hàn Lâm Tiến Sĩ',
    category: 'quest',
    quality: 'rare',
    icon: '📜',
    count: 1,
    description: 'Văn bằng chứng nhận đã đỗ kỳ khảo thí điển chế tại Hàn Lâm Viện.',
    lore: 'Ghi danh bảng vàng khoa thi Đại Nghiệp niên hiệu thứ ba.',
  },
  {
    id: 'item_tra_sen',
    name: 'Trà Sen Bách Diệp',
    category: 'consumable',
    quality: 'common',
    icon: '🍵',
    count: 5,
    description: 'Trà ướp hoa sen thượng uyển, tăng 10% tốc độ di chuyển trong 3 phút.',
    usable: true,
  },
  {
    id: 'item_but_long',
    name: 'Bút Lông Tử Hào',
    category: 'equipment',
    quality: 'rare',
    icon: '🖌️',
    count: 1,
    description: 'Bút lông thỏ quý giá dành cho quan lại biên tu quốc sử.',
    lore: 'Thân khắc chữ "Chính Đại Quang Minh".',
  },
  {
    id: 'item_an_hoang_de',
    name: 'Ấn Vàng Sắc Mệnh Chi Bảo',
    category: 'equipment',
    quality: 'legendary',
    icon: '👑',
    count: 1,
    description: 'Bảo tỉ truyền quốc của Hoàng Đế Đại Nghiệp, tượng trưng quyền lực tối cao.',
    lore: 'Chỉ bậc Cửu Ngũ Chí Tôn mới đủ tư cách nắm giữ.',
  },
  {
    id: 'item_nghien_muc',
    name: 'Nghiên Mực Đoan Khê',
    category: 'consumable',
    quality: 'rare',
    icon: '⬛',
    count: 2,
    description: 'Đá mài mực thượng hạng, tăng 20 điểm Công Trạng khi phê duyệt tấu chương.',
    usable: true,
  },
];

export const INITIAL_SOCIAL_CONTACTS: PlayerSocialContact[] = [
  {
    id: 'contact_1',
    name: 'Trần Văn Liêm',
    rankTitle: 'Ngũ Phẩm • Lại Bộ Lang Trung',
    level: 18,
    status: 'online',
    location: 'Lại Bộ',
    merit: 280,
    affinity: 85,
  },
  {
    id: 'contact_2',
    name: 'Lê Thạc Tĩnh',
    rankTitle: 'Tam Phẩm • Hàn Lâm Học Sĩ',
    level: 32,
    status: 'online',
    location: 'Hàn Lâm Viện',
    merit: 420,
    affinity: 92,
  },
  {
    id: 'contact_3',
    name: 'Nguyễn Quốc Bảo',
    rankTitle: 'Cửu Phẩm • Tân Khoa Chủ Sự',
    level: 6,
    status: 'offline',
    location: 'Cổng Chính',
    merit: 60,
    affinity: 40,
  },
  {
    id: 'contact_4',
    name: 'Phan Đình Nghị',
    rankTitle: 'Nhất Phẩm • Phụ Chính Đại Thần',
    level: 60,
    status: 'busy',
    location: 'Thái Hòa Điện',
    merit: 950,
    affinity: 70,
  },
];

export const OFFICIAL_HONOR_TITLES: OfficialHonorTitle[] = [
  {
    id: 'title_tan_khoa',
    name: 'Tân Khoa Đắc Đạo',
    unlocked: true,
    requirement: 'Vượt qua kỳ nhập môn bước vào Hoàng Thành',
    bonus: '+5% Tốc độ di chuyển trong cung',
  },
  {
    id: 'title_minh_kinh',
    name: 'Minh Kính Cao Huyền',
    unlocked: false,
    requirement: 'Phá thành công vụ án mật tấu tại Hình Bộ',
    bonus: '+10% Công trạng khi điều tra',
  },
  {
    id: 'title_trang_nguyen',
    name: 'Đại Khoa Trạng Nguyên',
    unlocked: false,
    requirement: 'Đạt điểm tuyệt đối 5/5 tại Hàn Lâm Viện',
    bonus: '+15% Ngân lượng bổng lộc',
  },
  {
    id: 'title_cuu_ngu',
    name: 'Thiên Tử Trị Quốc',
    unlocked: false,
    requirement: 'Đăng cơ Hoàng Đế ngự trên Long Ngai',
    bonus: 'Toàn triều kính ngưỡng',
  },
];
