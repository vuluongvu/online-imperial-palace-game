export interface PalaceEvent {
  id: string;
  category: 'decree' | 'court' | 'exam' | 'banquet' | 'parade';
  title: string;
  announcement: string;
  bannerIcon: string;
  buildingTargetId?: string;
  rewardText: string;
  durationSeconds: number;
  actionLabel?: string;
}

export const PALACE_EVENTS_CATALOG: PalaceEvent[] = [
  {
    id: 'event_edict_announced',
    category: 'decree',
    title: 'Ban Bố Thánh Chỉ Hoàng Triều',
    announcement:
      'Hoàng Đế vừa hạ chiếu chỉ chấn hưng khoa cử và thưởng phạt phân minh. Mau đến Bảng Cáo Thị nghênh tiếp thánh chỉ!',
    bannerIcon: '📜',
    buildingTargetId: 'cong_chinh',
    rewardText: '+25 Bạc • +15 Công trạng',
    durationSeconds: 60,
    actionLabel: 'Xem Thánh Chỉ',
  },
  {
    id: 'event_grand_court_session',
    category: 'court',
    title: 'Đại Triều Thái Hòa Điện Chuẩn Bị Khai Mạc',
    announcement:
      'Tiếng chuông ngân vang! Bá quan văn võ tề tựu thiết triều tại Thái Hòa Điện. Mời quan viên mau chóng vào điện triều bái!',
    bannerIcon: '👑',
    buildingTargetId: 'chinh_dien',
    rewardText: '+40 Công trạng • +80 Bạc',
    durationSeconds: 70,
    actionLabel: 'Vào Điện Thiết Triều',
  },
  {
    id: 'event_mini_exam_hlv',
    category: 'exam',
    title: 'Khảo Thí Tốc Ký Hàn Lâm Viện',
    announcement:
      'Chủ khảo Chu Văn mở kỳ thi vấn đáp nhanh tại Hàn Lâm Viện. Sĩ tử trả lời đúng nhận ngay điểm thưởng và bổng lộc!',
    bannerIcon: '📖',
    buildingTargetId: 'han_lam_vien',
    rewardText: '+35 Công trạng • Danh hiệu Tiến Sĩ',
    durationSeconds: 65,
    actionLabel: 'Đến Hàn Lâm Viện',
  },
  {
    id: 'event_garden_tea_party',
    category: 'banquet',
    title: 'Dạ Yến Thưởng Trà Ngự Hoa Viên',
    announcement:
      'Thượng Uyển mở tiệc trà ngắm hoa đào bên Hồ Sen. Kính mời quan lại và sĩ tử cùng ghé Thủy Đình giao lưu đàm đạo!',
    bannerIcon: '🌸',
    buildingTargetId: 'ngu_hoa_vien',
    rewardText: 'Mở khóa Biểu cảm • Thưởng Trà Đạo',
    durationSeconds: 70,
    actionLabel: 'Đến Ngự Hoa Viên',
  },
  {
    id: 'event_guard_parade',
    category: 'parade',
    title: 'Cấm Vệ Quân Diễu Binh Qua Sân Rồng',
    announcement:
      'Đoàn Thị Vệ cử hành lễ diễu binh thị uy dọc theo Trục Thần Đạo. Uy phong lẫm liệt, chấn chỉnh kỷ cương hoàng cung!',
    bannerIcon: '🛡️',
    buildingTargetId: 'chinh_dien',
    rewardText: '+20 Công trạng uy danh',
    durationSeconds: 50,
    actionLabel: 'Xem Diễu Binh',
  },
];
