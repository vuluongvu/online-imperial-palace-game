import {
  AppointmentRecord,
  CourtOfficialMember,
  CriminalCase,
  EmoteAction,
  ExamLeaderboardEntry,
  ExamQuestion,
  ImperialEdict,
  ImperialMemorial,
  InteractableEntity,
  LocalChatMessage,
  OfficialGradeInfo,
  QuestDefinition,
  StudyDocument,
} from '../types/gameplay';

// ============================================================================
// 1. DANH SÁCH TOÀN BỘ NPC & VẬT THỂ TƯƠNG TÁC TRONG 7 CÔNG TRÌNH (PHÍM E)
// ============================================================================
export const INTERACTABLE_ENTITIES: InteractableEntity[] = [
  // --------------------------------------------------------------------------
  // G. CỔNG CHÍNH (NGỌ MÔN QUAN) - Z = +38 trên Bản Đồ Hoàng Cung
  // --------------------------------------------------------------------------
  {
    id: 'npc_gate_captain',
    zoneMode: 'compound_map',
    buildingId: 'cong_chinh',
    type: 'npc',
    name: 'Thống Lĩnh Thị Vệ – Trần Uy',
    title: 'Chưởng Quản Ngọ Môn Quan',
    promptText: 'Trò chuyện với Thống Lĩnh Trần Uy (Hướng dẫn Tân Thủ)',
    position: [-2.8, 0, 31.8],
    rotationY: 0.35,
    interactRadius: 4.5,
    defaultTab: 'guide',
    npcRank: 'mid_official',
  },
  {
    id: 'obj_gate_notice_board',
    zoneMode: 'compound_map',
    buildingId: 'cong_chinh',
    type: 'object',
    name: 'Bảng Cáo Thị Hoàng Cung',
    title: 'Thông Báo Nhiệm Vụ & Chỉ Đường',
    promptText: 'Xem Bảng Cáo Thị & Sơ Đồ Hoàng Cung',
    position: [3.2, 0, 31.8],
    rotationY: -0.35,
    interactRadius: 4.5,
    defaultTab: 'directory',
    propKind: 'board',
  },

  // --------------------------------------------------------------------------
  // A. THÁI HÒA ĐIỆN (NGOÀI SÂN RỒNG & BÊN TRONG NỘI ĐIỆN)
  // --------------------------------------------------------------------------
  {
    id: 'npc_thai_hoa_minister_out',
    zoneMode: 'compound_map',
    buildingId: 'chinh_dien',
    type: 'npc',
    name: 'Thừa Tướng – Nguyễn Bá',
    title: 'Đầu Triều Đại Thần • Nhất Phẩm',
    promptText: 'Tham kiến Thừa Tướng Nguyễn Bá (Thiết Triều & Vào Điện)',
    position: [-3.4, 0, 6.2],
    rotationY: 0.4,
    interactRadius: 4.8,
    defaultTab: 'court',
    npcRank: 'minister',
  },
  {
    id: 'obj_thai_hoa_edict_out',
    zoneMode: 'compound_map',
    buildingId: 'chinh_dien',
    type: 'object',
    name: 'Bảng Chiếu Chỉ Sân Rồng',
    title: 'Thánh Chỉ & Thông Báo Triều Đình',
    promptText: 'Đọc Bảng Chiếu Chỉ Hoàng Gia',
    position: [3.8, 0, 6.2],
    rotationY: -0.35,
    interactRadius: 4.8,
    defaultTab: 'edicts',
    propKind: 'board',
  },
  // Các điểm tương tác bên trong Nội Điện Thái Hòa (sceneMode === 'main_hall_interior')
  {
    id: 'obj_interior_throne_info',
    zoneMode: 'main_hall_interior',
    buildingId: 'chinh_dien',
    type: 'object',
    name: 'Ngự Án & Long Ngai Thái Hòa',
    title: 'Trung Tâm Thiết Triều Hoàng Đế',
    promptText: 'Mở Giao Diện Thiết Triều & Ban Chiếu Chỉ',
    position: [1.95, 1.82, -15.5],
    rotationY: 0,
    interactRadius: 4.8,
    defaultTab: 'court',
    propKind: 'throne_info',
  },
  {
    id: 'npc_interior_minister',
    zoneMode: 'main_hall_interior',
    buildingId: 'chinh_dien',
    type: 'npc',
    name: 'Nội Các Thủ Phụ – Trương Đình',
    title: 'Chủ Trì Đại Triều • Nhất Phẩm',
    promptText: 'Trò chuyện với Nội Các Thủ Phụ (Điểm danh Bá Quan)',
    position: [-3.2, 0, -9.2],
    rotationY: 0.65,
    interactRadius: 4.2,
    defaultTab: 'officials',
    npcRank: 'minister',
  },
  {
    id: 'obj_interior_edict_board',
    zoneMode: 'main_hall_interior',
    buildingId: 'chinh_dien',
    type: 'object',
    name: 'Bảng Hoàng Bảng Chiếu Chỉ',
    title: 'Niêm Yết Thánh Chỉ & Bổ Nhiệm',
    promptText: 'Xem Hoàng Bảng Chiếu Chỉ Triều Đình',
    position: [3.4, 0, -9.2],
    rotationY: -0.5,
    interactRadius: 4.2,
    defaultTab: 'edicts',
    propKind: 'board',
  },

  // --------------------------------------------------------------------------
  // B. NGỰ THƯ PHÒNG – TRUNG TÂM ĐIỀU HÀNH (Z = -31, X = 0)
  // --------------------------------------------------------------------------
  {
    id: 'npc_ngu_thu_scholar',
    zoneMode: 'compound_map',
    buildingId: 'ngu_thu_phong',
    type: 'npc',
    name: 'Nội Các Học Sĩ – Lê Văn Hưu',
    title: 'Thị Độc Học Sĩ Ngự Thư Phòng',
    promptText: 'Gặp Nội Các Học Sĩ (Báo cáo tình hình Triều Đình)',
    position: [-2.4, 0, -32.6],
    rotationY: 0.5,
    interactRadius: 4.0,
    defaultTab: 'reports',
    npcRank: 'minister',
  },
  {
    id: 'obj_ntp_work_desk',
    zoneMode: 'compound_map',
    buildingId: 'ngu_thu_phong',
    type: 'object',
    name: 'Bàn Ngự Án Phê Duyệt Tấu Chương',
    title: 'Xử Lý Công Việc & Chu Phê Tấu Chương',
    promptText: 'Mở Bàn Làm Việc & Phê Duyệt Tấu Chương',
    position: [0, 0, -33.2],
    rotationY: 0,
    interactRadius: 4.2,
    defaultTab: 'memorials',
    propKind: 'desk',
  },
  {
    id: 'obj_ntp_territory_map',
    zoneMode: 'compound_map',
    buildingId: 'ngu_thu_phong',
    type: 'object',
    name: 'Sa Bàn Bản Đồ Đại Nghiệp',
    title: 'Bản Đồ Cương Vực & Tình Hình Các Trấn',
    promptText: 'Quan sát Bản Đồ Lãnh Thổ Đại Nghiệp',
    position: [3.8, 0, -31.5],
    rotationY: -0.4,
    interactRadius: 3.8,
    defaultTab: 'map',
    propKind: 'map_stand',
  },
  {
    id: 'obj_ntp_bookshelf',
    zoneMode: 'compound_map',
    buildingId: 'ngu_thu_phong',
    type: 'object',
    name: 'Giá Sách Hoàng Triều Thực Lục',
    title: 'Tư Liệu Điển Chế & Danh Sách Quan Viên',
    promptText: 'Đọc Tư Liệu Quốc Sử & Danh Sách Quan Viên',
    position: [-3.8, 0, -31.5],
    rotationY: 0.4,
    interactRadius: 3.8,
    defaultTab: 'books',
    propKind: 'bookshelf',
  },

  // --------------------------------------------------------------------------
  // C. LẠI BỘ – TUYỂN DỤNG & THĂNG CHỨC (X = -26, Z = -6)
  // --------------------------------------------------------------------------
  {
    id: 'npc_lai_bo_minister',
    zoneMode: 'compound_map',
    buildingId: 'lai_bo',
    type: 'npc',
    name: 'Lại Bộ Thượng Thư – Phạm Công Trứ',
    title: 'Chưởng Quản Tuyển Dụng & Khảo Công',
    promptText: 'Gặp Thượng Thư Lại Bộ (Nhận Nhiệm Vụ & Báo Cáo)',
    position: [-29.8, 0, -6.0],
    rotationY: Math.PI / 2,
    interactRadius: 4.2,
    defaultTab: 'quests',
    npcRank: 'minister',
  },
  {
    id: 'obj_lb_promotion_desk',
    zoneMode: 'compound_map',
    buildingId: 'lai_bo',
    type: 'object',
    name: 'Bàn Bổ Nhiệm & Thăng Chức',
    title: 'Nộp Hồ Sơ Thăng Phẩm & Ấn Tín',
    promptText: 'Mở Bàn Bổ Nhiệm (Nộp Đơn Thăng Chức)',
    position: [-26.8, 0, -8.8],
    rotationY: 0,
    interactRadius: 3.8,
    defaultTab: 'promotion',
    propKind: 'desk',
  },
  {
    id: 'obj_lb_merit_board',
    zoneMode: 'compound_map',
    buildingId: 'lai_bo',
    type: 'object',
    name: 'Bảng Công Trạng & Danh Sách Quan Viên',
    title: 'Thành Tích Cá Nhân & Lịch Sử Bổ Nhiệm',
    promptText: 'Xem Bảng Công Trạng & Danh Sách Chức Quan',
    position: [-26.8, 0, -3.2],
    rotationY: Math.PI,
    interactRadius: 3.8,
    defaultTab: 'merit',
    propKind: 'board',
  },

  // --------------------------------------------------------------------------
  // D. HÌNH BỘ – ĐIỀU TRA & XÉT XỬ (X = +26, Z = -6)
  // --------------------------------------------------------------------------
  {
    id: 'npc_hinh_bo_judge',
    zoneMode: 'compound_map',
    buildingId: 'hinh_bo',
    type: 'npc',
    name: 'Hình Bộ Thượng Thư – Bao Thanh',
    title: 'Chưởng Quản Hình Luật & Xét Xử',
    promptText: 'Gặp Thượng Thư Hình Bộ (Nhận Vụ Án & Phán Quyết)',
    position: [29.8, 0, -6.0],
    rotationY: -Math.PI / 2,
    interactRadius: 4.2,
    defaultTab: 'case_overview',
    npcRank: 'minister',
  },
  {
    id: 'obj_hb_case_files',
    zoneMode: 'compound_map',
    buildingId: 'hinh_bo',
    type: 'object',
    name: 'Bàn Hồ Sơ Mật Án & Lời Khai',
    title: 'Hồ Sơ Vụ Án & Khẩu Cung NPC',
    promptText: 'Đọc Hồ Sơ Vụ Án & Lời Khai Nhân Chứng',
    position: [26.8, 0, -8.8],
    rotationY: 0,
    interactRadius: 3.8,
    defaultTab: 'clues',
    propKind: 'desk',
  },
  {
    id: 'obj_hb_evidence_chest',
    zoneMode: 'compound_map',
    buildingId: 'hinh_bo',
    type: 'object',
    name: 'Rương Vật Chứng Hoàng Cung',
    title: 'Thu Thập & Đối Chiếu Bằng Chứng',
    promptText: 'Kiểm tra Rương Vật Chứng & Kết Luận Vụ Án',
    position: [26.8, 0, -3.2],
    rotationY: Math.PI,
    interactRadius: 3.8,
    defaultTab: 'verdict',
    propKind: 'chest',
  },

  // --------------------------------------------------------------------------
  // E. HÀN LÂM VIỆN – HỌC TẬP & KHẢO THÍ (X = -27, Z = +18)
  // --------------------------------------------------------------------------
  {
    id: 'npc_han_lam_examiner',
    zoneMode: 'compound_map',
    buildingId: 'han_lam_vien',
    type: 'npc',
    name: 'Chưởng Viện Học Sĩ – Chu Văn',
    title: 'Chủ Khảo Kỳ Thi Hàn Lâm Viện',
    promptText: 'Gặp Chủ Khảo Chu Văn (Thông tin Kỳ Thi Khoa Cử)',
    position: [-31.2, 0, 18.0],
    rotationY: Math.PI / 2,
    interactRadius: 4.2,
    defaultTab: 'exam',
    npcRank: 'mid_official',
  },
  {
    id: 'obj_hlv_exam_desk',
    zoneMode: 'compound_map',
    buildingId: 'han_lam_vien',
    type: 'object',
    name: 'Bàn Thi Khoa Cử Hàn Lâm',
    title: 'Làm Bài Trắc Nghiệm Kiến Thức & Logic',
    promptText: 'Ngồi vào Bàn Thi – Bắt Đầu Kỳ Thi Khoa Cử',
    position: [-28.6, 0, 18.0],
    rotationY: 0,
    interactRadius: 3.8,
    defaultTab: 'exam',
    propKind: 'desk',
  },
  {
    id: 'obj_hlv_library',
    zoneMode: 'compound_map',
    buildingId: 'han_lam_vien',
    type: 'object',
    name: 'Tàng Thư Các Hàn Lâm',
    title: 'Thư Viện Ôn Tập Kiến Thức Cung Đình',
    promptText: 'Đọc Tài Liệu Thư Viện (Ôn Thi Khoa Cử)',
    position: [-27.8, 0, 14.6],
    rotationY: 0,
    interactRadius: 3.8,
    defaultTab: 'library',
    propKind: 'bookshelf',
  },
  {
    id: 'obj_hlv_leaderboard',
    zoneMode: 'compound_map',
    buildingId: 'han_lam_vien',
    type: 'object',
    name: 'Bảng Vàng Khoa Cử Đại Nghiệp',
    title: 'Kết Quả Thi & Bảng Xếp Hạng Tiến Sĩ',
    promptText: 'Xem Bảng Vàng Kết Quả Khoa Cử',
    position: [-27.8, 0, 21.4],
    rotationY: Math.PI,
    interactRadius: 3.8,
    defaultTab: 'leaderboard',
    propKind: 'board',
  },

  // --------------------------------------------------------------------------
  // F. NGỰ HOA VIÊN – GIAO LƯU & GIẢI TRÍ (X = +26, Z = +17)
  // --------------------------------------------------------------------------
  {
    id: 'npc_ngu_hoa_host',
    zoneMode: 'compound_map',
    buildingId: 'ngu_hoa_vien',
    type: 'npc',
    name: 'Quản Sự Thượng Uyển – Nhã Lan',
    title: 'Chưởng Quản Yến Tiệc & Thi Hội',
    promptText: 'Trò chuyện với Nhã Lan (Giao Lưu, Chat & Biểu Cảm)',
    position: [21.5, 0, 15.0],
    rotationY: -Math.PI / 2,
    interactRadius: 4.2,
    defaultTab: 'chat',
    npcRank: 'low_official',
  },
  {
    id: 'obj_nhv_stone_bench',
    zoneMode: 'compound_map',
    buildingId: 'ngu_hoa_vien',
    type: 'object',
    name: 'Bàn Trà Đá Cẩm Thạch Bên Hồ Sen',
    title: 'Ngồi Nghỉ Ngắm Cảnh & Tổ Chức Sự Kiện',
    promptText: 'Thưởng Trà Ngắm Hoa Đào & Mở Sự Kiện Giao Lưu',
    position: [25.8, 0, 17.5],
    rotationY: -Math.PI / 2,
    interactRadius: 4.2,
    defaultTab: 'events',
    propKind: 'stone_bench',
  },
];

// ============================================================================
// 2. CHUỖI 5 NHIỆM VỤ XUYÊN SUỐT CÁC CÔNG TRÌNH (MAIN QUEST CHAIN)
// ============================================================================
export const PALACE_QUEST_CHAIN: QuestDefinition[] = [
  {
    id: 'quest_1_lai_bo_init',
    stepNumber: 1,
    title: 'Nhiệm vụ 1: Trình Diện Lại Bộ',
    description:
      'Tân khoa quan viên vừa bước qua Ngọ Môn Quan cần đến Lại Bộ gặp Thượng Thư Phạm Công Trứ để điểm danh nhận công vụ đầu tiên.',
    requirementText: 'Đến Lại Bộ gặp Thượng Thư Phạm Công Trứ nhận nhiệm vụ',
    targetBuildingId: 'lai_bo',
    targetBuildingName: 'Lại Bộ',
    targetInteractableId: 'npc_lai_bo_minister',
    reward: {
      merit: 60,
      coins: 150,
      itemTitle: 'Lệnh Bài Quan Viên Tập Sự',
    },
  },
  {
    id: 'quest_2_hinh_bo_case',
    stepNumber: 2,
    title: 'Nhiệm vụ 2: Điều Tra Mật Án Hình Bộ',
    description:
      'Bản mật tấu biên thùy vừa bị thất lạc trong đêm. Hãy đến Hình Bộ gặp Thượng Thư Bao Thanh, thu thập bằng chứng và chỉ ra thủ phạm.',
    requirementText: 'Giải quyết chính xác vụ án thất lạc mật tấu tại Hình Bộ',
    targetBuildingId: 'hinh_bo',
    targetBuildingName: 'Hình Bộ',
    targetInteractableId: 'npc_hinh_bo_judge',
    reward: {
      merit: 120,
      coins: 300,
      itemTitle: 'Minh Kính Huy Chương',
    },
  },
  {
    id: 'quest_3_han_lam_exam',
    stepNumber: 3,
    title: 'Nhiệm vụ 3: Khảo Thí Hàn Lâm Viện',
    description:
      'Để đủ tư cách thăng chức, quan viên phải vượt qua kỳ khảo thí 3 câu hỏi kiến thức điển chế & văn hóa tại Hàn Lâm Viện.',
    requirementText: 'Hoàn thành bài thi tại Hàn Lâm Viện (đạt từ 2/3 câu)',
    targetBuildingId: 'han_lam_vien',
    targetBuildingName: 'Hàn Lâm Viện',
    targetInteractableId: 'obj_hlv_exam_desk',
    reward: {
      merit: 150,
      coins: 350,
      itemTitle: 'Bằng Hàn Lâm Tiến Sĩ',
    },
  },
  {
    id: 'quest_4_lai_bo_report',
    stepNumber: 4,
    title: 'Nhiệm vụ 4: Phục Mệnh Tại Lại Bộ',
    description:
      'Bạn đã lập công phá án tại Hình Bộ và đỗ kỳ khảo thí tại Hàn Lâm Viện. Hãy quay lại Lại Bộ nộp kết quả khảo công cho Thượng Thư.',
    requirementText: 'Quay lại Lại Bộ nộp kết quả khảo công cho Thượng Thư',
    targetBuildingId: 'lai_bo',
    targetBuildingName: 'Lại Bộ',
    targetInteractableId: 'npc_lai_bo_minister',
    reward: {
      merit: 100,
      coins: 250,
      itemTitle: 'Chứng Chỉ Khảo Công Ưu Tú',
    },
  },
  {
    id: 'quest_5_promotion_rank',
    stepNumber: 5,
    title: 'Nhiệm vụ 5: Thăng Chức & Dự Triều',
    description:
      'Công trạng đã tích lũy đủ! Hãy mở Bàn Bổ Nhiệm tại Lại Bộ nộp hồ sơ thăng chức lên phẩm cấp mới và nhận lễ phục mới.',
    requirementText: 'Nộp đơn thăng chức thành công tại Bàn Bổ Nhiệm Lại Bộ',
    targetBuildingId: 'lai_bo',
    targetBuildingName: 'Lại Bộ',
    targetInteractableId: 'obj_lb_promotion_desk',
    reward: {
      merit: 200,
      coins: 500,
      itemTitle: 'Ấn Quan Thăng Phẩm & Triều Phục Mới',
    },
  },
];

// ============================================================================
// 3. DỮ LIỆU THÁI HÒA ĐIỆN (DANH SÁCH BÁ QUAN DỰ TRIỀU & CHIẾU CHỈ)
// ============================================================================
export const COURT_OFFICIALS: CourtOfficialMember[] = [
  {
    id: 'off_1',
    name: 'Nguyễn Bá',
    title: 'Thừa Tướng Nội Các',
    ministry: 'Tam Công • Đứng đầu trăm quan',
    rankLabel: 'Chánh Nhất Phẩm',
    status: 'present',
    loyalty: 98,
  },
  {
    id: 'off_2',
    name: 'Phạm Công Trứ',
    title: 'Lại Bộ Thượng Thư',
    ministry: 'Lại Bộ • Tuyển dụng & Khảo công',
    rankLabel: 'Tòng Nhất Phẩm',
    status: 'present',
    loyalty: 95,
  },
  {
    id: 'off_3',
    name: 'Bao Thanh',
    title: 'Hình Bộ Thượng Thư',
    ministry: 'Hình Bộ • Hình luật & Xét xử',
    rankLabel: 'Tòng Nhất Phẩm',
    status: 'present',
    loyalty: 99,
  },
  {
    id: 'off_4',
    name: 'Lê Văn Hưu',
    title: 'Nội Các Đại Học Sĩ',
    ministry: 'Ngự Thư Phòng • Quốc sử & Tấu chương',
    rankLabel: 'Chánh Nhị Phẩm',
    status: 'present',
    loyalty: 96,
  },
  {
    id: 'off_5',
    name: 'Chu Văn',
    title: 'Hàn Lâm Chưởng Viện Học Sĩ',
    ministry: 'Hàn Lâm Viện • Khoa cử & Biên tu',
    rankLabel: 'Chánh Tam Phẩm',
    status: 'present',
    loyalty: 94,
  },
  {
    id: 'off_6',
    name: 'Trần Uy',
    title: 'Thống Lĩnh Cấm Quân Thị Vệ',
    ministry: 'Cấm Vệ Quân • Bảo vệ Hoàng Thành',
    rankLabel: 'Chánh Tứ Phẩm',
    status: 'on_duty',
    loyalty: 97,
  },
];

export const INITIAL_IMPERIAL_EDICTS: ImperialEdict[] = [
  {
    id: 'edict_1',
    title: 'Chiếu Mở Khoa Thi Ân Khoa Mùa Xuân',
    content:
      'Truyền cho Hàn Lâm Viện mở kỳ khảo thí tuyển chọn hiền tài khắp thiên hạ, lấy công trạng và thực tài làm gốc để bổ nhiệm vào Lục Bộ.',
    issuedBy: 'Hoàng Đế Minh Vương Đế',
    timestamp: 'Niên hiệu Đại Nghiệp năm thứ 3',
    category: 'policy',
  },
  {
    id: 'edict_2',
    title: 'Thánh Chỉ Chỉnh Đốn Kỷ Cương Hoàng Thành',
    content:
      'Giao cho Hình Bộ phối hợp cùng Cấm Vệ Quân điều tra nghiêm ngặt các vụ việc thất lạc văn thư mật tấu, thưởng phạt phân minh.',
    issuedBy: 'Hoàng Đế Minh Vương Đế',
    timestamp: 'Niên hiệu Đại Nghiệp năm thứ 3',
    category: 'appointment',
  },
];

// ============================================================================
// 4. DỮ LIỆU NGỰ THƯ PHÒNG (TẤU CHƯƠNG CHỜ PHÊ DUYỆT, SÁCH & BẢN ĐỒ)
// ============================================================================
export const INITIAL_MEMORIALS: ImperialMemorial[] = [
  {
    id: 'mem_1',
    title: 'Tấu xin mở kho lương cứu trợ dân vùng hạ lưu sông Nhị',
    senderName: 'Hộ Bộ Thượng Thư – Đặng Huấn',
    senderTitle: 'Chánh Nhị Phẩm',
    ministry: 'Hộ Bộ',
    summary:
      'Mưa lũ đầu mùa khiến 3 huyện ven đê ngập úng. Xin xuất 5,000 thạch lương thực từ Thường Bình Thương để an dân.',
    details:
      'Thần Đặng Huấn kính tấu: Bách tính vùng hạ lưu đang thiếu lương thực gieo trồng vụ mới. Nếu mở kho kịp thời sẽ giữ vững lòng dân, thu thuế vụ thu không bị hao hụt.',
    impactApprove: 'Lòng dân +15, Trị an +10, Nhận +45 Công Trạng',
    impactReject: 'Giữ nguyên ngân khố nhưng lòng dân giảm nhẹ, Nhận +15 Công Trạng',
    rewardMerit: 45,
    status: 'pending',
  },
  {
    id: 'mem_2',
    title: 'Đề xuất bổ nhiệm Tân Khoa Tiến Sĩ vào Hàn Lâm Viện',
    senderName: 'Lại Bộ Thượng Thư – Phạm Công Trứ',
    senderTitle: 'Tòng Nhất Phẩm',
    ministry: 'Lại Bộ',
    summary:
      'Đề cử 12 sĩ tử đạt điểm ưu tú trong kỳ khảo thí vào chức Hàn Lâm Viện Biên Tu để biên soạn Đại Nghiệp Thực Lục.',
    details:
      'Thần Phạm Công Trứ kính tấu: Qua đợt khảo thí vừa qua, nhiều sĩ tử thông hiểu kinh sử và mưu lược trị quốc, xứng đáng được bổ dụng ngay.',
    impactApprove: 'Nhân tài triều đình +20, Nhận +50 Công Trạng',
    impactReject: 'Hoãn bổ nhiệm sang kỳ sau, Nhận +15 Công Trạng',
    rewardMerit: 50,
    status: 'pending',
  },
  {
    id: 'mem_3',
    title: 'Tấu xin gia cố chiến thuyền tuần tra vùng biển Đông Nam',
    senderName: 'Binh Bộ Thượng Thư – Lý Thường',
    senderTitle: 'Tòng Nhất Phẩm',
    ministry: 'Binh Bộ',
    summary:
      'Xin cấp kinh phí đóng thêm 10 thuyền Mông Đồng tuần tiễu hải đạo, bảo vệ thương thuyền giao thương.',
    details:
      'Thần Lý Thường kính tấu: Hải đạo Đông Nam gần đây có thuyền lạ qua lại. Tăng cường thủy quân sẽ bảo đảm an toàn cho cả vùng duyên hải.',
    impactApprove: 'Quốc phòng +25, Thương mại +10, Nhận +55 Công Trạng',
    impactReject: 'Tiết kiệm ngân lượng quốc khố, Nhận +15 Công Trạng',
    rewardMerit: 55,
    status: 'pending',
  },
];

export const NGU_THU_BOOKS: StudyDocument[] = [
  {
    id: 'book_1',
    title: 'Hoàng Triều Lục Bộ Điển Lệ',
    category: 'Điển Chế Triều Đình',
    content:
      'Triều đình đặt 6 bộ gồm: Lại Bộ (quan chức, thăng giáng), Hộ Bộ (hộ khẩu, thuế khóa, ruộng đất), Lễ Bộ (nghi lễ, khoa cử, ngoại giao), Binh Bộ (quân비, võ quan), Hình Bộ (pháp luật, xét xử) và Công Bộ (xây dựng cung điện, đê điều).',
    examHint: 'Gợi ý thi Hàn Lâm: Lại Bộ phụ trách bổ nhiệm quan viên; Hình Bộ phụ trách xét xử.',
  },
  {
    id: 'book_2',
    title: 'Kiến Trúc Điện Thái Hòa & Cửu Phẩm Quan Chế',
    category: 'Kiến Trúc & Lễ Nghi',
    content:
      'Điện Thái Hòa xây dựng theo thức Trùng Diêm Điệp Ốc (mái chồng hai tầng), hệ vì kèo Chồng rường – Giả thủ và trang trí Nhất Thi Nhất Họa (một bài thơ kèm một bức họa). Hệ thống quan lại chia làm Cửu Phẩm (từ Cửu phẩm lên Nhất phẩm).',
    examHint: 'Gợi ý thi Hàn Lâm: Hoa văn đặc trưng trên liên ba Điện Thái Hòa là Nhất Thi Nhất Họa.',
  },
  {
    id: 'book_3',
    title: 'Mưu Lược Trị Quốc & Điều Tra Hình Sự',
    category: 'Pháp Độ & Logic',
    content:
      'Khi xét xử tại Hình Bộ, quan án cần kết hợp đủ Nhân chứng (lời khai), Vật chứng (dấu vết tại hiện trường) và Thời gian biểu (ngoại phạm) trước khi kết luận.',
    examHint: 'Gợi ý phá án: Chú ý vết sáp nến đỏ và mực Chu Sa chỉ có ở phòng trực ca đêm.',
  },
];

export const TERRITORY_REGIONS = [
  {
    id: 'reg_kinh_do',
    name: 'Kinh Đô Phú Xuân – Hoàng Thành',
    governor: 'Phủ Doãn Thừa Thiên',
    prosperity: '98/100 (Thịnh trị)',
    security: 'Tuyệt đối an toàn – Cấm Vệ Quân trấn giữ',
    taxOutput: '45,000 lượng bạc / năm',
  },
  {
    id: 'reg_bac_thanh',
    name: 'Bắc Thành (Thăng Long Trấn)',
    governor: 'Tổng Trấn Bắc Thành',
    prosperity: '92/100 (Trù phú)',
    security: 'Ổn định – Đang mở mang đê điều sông Nhị',
    taxOutput: '62,000 lượng bạc / năm',
  },
  {
    id: 'reg_gia_dinh',
    name: 'Gia Định Thành (Nam Kỳ Lục Tỉnh)',
    governor: 'Tổng Trấn Gia Định',
    prosperity: '95/100 (Vựa lúa lớn nhất nước)',
    security: 'Thương cảng sầm uất, thuyền buôn tấp nập',
    taxOutput: '58,000 lượng bạc / năm',
  },
];

// ============================================================================
// 5. DỮ LIỆU LẠI BỘ (THANG PHẨM CẤP QUAN VIÊN & LỊCH SỬ BỔ NHIỆM)
// ============================================================================
export const OFFICIAL_PROMOTION_LADDER: OfficialGradeInfo[] = [
  {
    gradeId: 'grade_9',
    gradeCode: 'Cửu Phẩm',
    titleVi: 'Hàn Lâm Viện Đãi Chế • Chủ Sự',
    department: 'Tập sự Lục Bộ',
    requiredMerit: 0,
    salaryCoins: 100,
    visualRank: 'low_official',
    privileges: [
      'Ra vào Hoàng Thành và nhận nhiệm vụ tại Lục Bộ',
      'Mặc quan phục Xanh Lam truyền thống',
    ],
  },
  {
    gradeId: 'grade_5',
    gradeCode: 'Ngũ Phẩm',
    titleVi: 'Lại Bộ Lang Trung • Ngũ Phẩm',
    department: 'Lại Bộ & Hàn Lâm Viện',
    requiredMerit: 150,
    salaryCoins: 300,
    visualRank: 'mid_official',
    privileges: [
      'Mở khóa quan phục Xanh Chàm Ngũ Phẩm thêu mây bạc',
      'Được phép tham dự bàn nghị sự tại Tả Vu Điện Thái Hòa',
      'Nhận bổng lộc 300 ngân lượng',
    ],
  },
  {
    gradeId: 'grade_3',
    gradeCode: 'Tam Phẩm',
    titleVi: 'Hàn Lâm Học Sĩ • Tham Tri Lục Bộ',
    department: 'Nội Các & Ngự Thư Phòng',
    requiredMerit: 320,
    salaryCoins: 600,
    visualRank: 'mid_official',
    privileges: [
      'Quyền duyệt hồ sơ tại Ngự Thư Phòng',
      'Đứng hàng đầu ban Văn trong lễ Thiết Triều',
      'Nhận bổng lộc 600 ngân lượng',
    ],
  },
  {
    gradeId: 'grade_1',
    gradeCode: 'Nhất Phẩm',
    titleVi: 'Đầu Triều Thượng Thư • Phụ Chính Đại Thần',
    department: 'Chưởng Quản Lục Bộ & Thái Hòa Điện',
    requiredMerit: 500,
    salaryCoins: 1200,
    visualRank: 'minister',
    privileges: [
      'Khoác Đại Triều Phục Đỏ Thẫm Nhất Phẩm thêu Bổ Tử Hạc Vàng',
      'Quyền đề xuất bổ nhiệm và ban phát chiếu chỉ tại Thái Hòa Điện',
      'Nhận bổng lộc 1,200 ngân lượng',
    ],
  },
  {
    gradeId: 'grade_emperor',
    gradeCode: 'Cửu Ngũ Chí Tôn',
    titleVi: 'Hoàng Đế Đại Nghiệp • Thiên Tử',
    department: 'Thái Hòa Điện & Ngự Thư Phòng',
    requiredMerit: 800,
    salaryCoins: 9999,
    visualRank: 'emperor',
    privileges: [
      'Khoác Hoàng Bào Thêu Rồng Vàng & Mũ Miện Lưu 12 Chuỗi Ngọc',
      'Độc quyền ngự trên Cửu Long Bảo Tọa và phê chuẩn mọi tấu chương',
    ],
  },
];

export const INITIAL_APPOINTMENT_HISTORY: AppointmentRecord[] = [
  {
    id: 'app_1',
    officialName: 'Minh Vương',
    fromTitle: 'Tân Khoa Sĩ Tử',
    toTitle: 'Cửu Phẩm Chủ Sự',
    timestamp: 'Khởi đầu',
    note: 'Tuyển chọn qua kỳ ân khoa mùa xuân, nhập chức tại Hoàng Cung.',
  },
  {
    id: 'app_2',
    officialName: 'Chu Văn',
    fromTitle: 'Thị Giảng Học Sĩ',
    toTitle: 'Hàn Lâm Chưởng Viện Học Sĩ (Tam Phẩm)',
    timestamp: 'Tháng trước',
    note: 'Có công biên soạn bộ Đại Nghiệp Hội Điển.',
  },
];

// ============================================================================
// 6. DỮ LIỆU HÌNH BỘ (HỒ SƠ VỤ ÁN, LỜI KHAI NPC & BẰNG CHỨNG)
// ============================================================================
export const CRIMINAL_CASES: CriminalCase[] = [
  {
    id: 'case_missing_memorial',
    code: 'MẬT ÁN #01',
    title: 'Vụ Án Thất Lạc Bản Mật Tấu Biên Thùy',
    difficulty: 'Quan trọng (Nhiệm vụ chính tuyến)',
    summary:
      'Đêm qua tại Văn Thư Phòng, bản Mật Tấu khẩn từ biên ải phía Bắc đã biến mất khỏi tráp gỗ khóa đồng. Có 3 nghi phạm có mặt gần hiện trường.',
    incidentLocation: 'Văn Thư Phòng (Cạnh Ngự Thư Phòng)',
    rewardMerit: 120,
    rewardCoins: 300,
    clues: [
      {
        id: 'clue_1',
        title: 'Bằng chứng #1: Vết mực Chu Sa Đỏ trên ổ khóa đồng',
        source: 'Khám nghiệm hiện trường (Rương Vật Chứng)',
        content:
          'Trên thành tráp gỗ đựng mật tấu có dính một vệt mực Chu Sa Đỏ còn mới — loại mực chỉ dành riêng cho người giữ sổ trực đêm ghi chép công văn.',
      },
      {
        id: 'clue_2',
        title: 'Lời khai #1: Thị Vệ Tuần Đêm – Trương Hổ',
        source: 'Khẩu cung NPC Thị Vệ',
        content:
          '"Canh ba đêm qua tôi đứng gác ngoài hiên, chỉ thấy Thư Lại Ngô Bình cầm đèn lồng giấy và nghiên mực Chu Sa đi ra từ Văn Thư Phòng với vẻ mặt vội vã."',
      },
      {
        id: 'clue_3',
        title: 'Lời khai #2: Thư Lại Trực Đêm – Ngô Bình',
        source: 'Khẩu cung NPC Thư Lại',
        content:
          '"Tôi thề là suốt canh ba tôi chỉ ngồi ở Tả Vu, tuyệt đối không bước chân vào Văn Thư Phòng hay chạm vào nghiên mực Chu Sa nào cả!" (Mâu thuẫn với vết mực Chu Sa trên tay áo Ngô Bình).',
      },
      {
        id: 'clue_4',
        title: 'Lời khai #3: Cung Nữ Pha Trà – Mai Nhi',
        source: 'Khẩu cung NPC Cung Nữ',
        content:
          '"Canh hai tôi chỉ mang trà sen đến đặt ở bàn ngoài hiên rồi lui về Ngự Hoa Viên ngay, có Thị vệ Trương Hổ làm chứng."',
      },
    ],
    options: [
      {
        id: 'opt_guard',
        suspectName: 'Thị Vệ Trương Hổ',
        conclusionText: 'Kết luận Thị Vệ Trương Hổ tự ý mở khóa lấy mật tấu.',
        isCorrect: false,
        explanation:
          'Chưa chính xác! Trương Hổ đứng gác bên ngoài và không hề sử dụng mực Chu Sa Đỏ.',
      },
      {
        id: 'opt_clerk',
        suspectName: 'Thư Lại Ngô Bình (Kẻ khai gian & để lại vết mực Chu Sa)',
        conclusionText:
          'Kết luận Thư Lại Ngô Bình lén sao chép mật tấu, làm dính mực Chu Sa lên ổ khóa và khai gian ngoại phạm.',
        isCorrect: true,
        explanation:
          'Chính xác! Vết mực Chu Sa trên ổ khóa trùng khớp với tay áo Ngô Bình và lời làm chứng của Thị vệ Trương Hổ. Ngô Bình đã cúi đầu nhận tội và giao nộp lại bản mật tấu!',
      },
      {
        id: 'opt_maid',
        suspectName: 'Cung Nữ Mai Nhi',
        conclusionText: 'Kết luận Cung Nữ Mai Nhi lấy mật tấu khi mang trà.',
        isCorrect: false,
        explanation:
          'Chưa chính xác! Mai Nhi chỉ đặt trà ngoài hiên vào canh hai và có nhân chứng xác nhận.',
      },
    ],
  },
  {
    id: 'case_jade_seal',
    code: 'KỲ ÁN #02',
    title: 'Vụ Án Đánh Tráo Bình Hoa Pháp Lam Tại Hữu Vu',
    difficulty: 'Nâng cao (Thưởng thêm Công Trạng)',
    summary:
      'Một chiếc bình Pháp Lam tiến cử trong Hữu Vu Điện Thái Hòa bị thay bằng bình gốm thường trước buổi tiếp sứ thần.',
    incidentLocation: 'Hữu Vu – Phòng Phụ Tiếp Khách (Thái Hòa Điện)',
    rewardMerit: 90,
    rewardCoins: 220,
    clues: [
      {
        id: 'clue_2_1',
        title: 'Bằng chứng #1: Vết bùn đất sét trắng dưới chân đôn gỗ',
        source: 'Khám nghiệm Hữu Vu',
        content:
          'Dưới chân đôn gỗ có vụn rơm bọc hàng và đất sét trắng thường dùng ở kho củi Nội Vụ Phủ.',
      },
      {
        id: 'clue_2_2',
        title: 'Lời khai Quản Kho Nội Vụ – Lý Thành',
        source: 'Biên bản thẩm vấn',
        content:
          'Lý Thành khai không rời khỏi kho, nhưng chìa khóa kho phụ lại tìm thấy ngay dưới gầm Sập Gụ Hữu Vu.',
      },
    ],
    options: [
      {
        id: 'opt_2_correct',
        suspectName: 'Quản Kho Lý Thành (Đánh rơi chìa khóa kho tại Hữu Vu)',
        conclusionText:
          'Kết luận Quản Kho Lý Thành lợi dụng lúc kiểm kê để tráo bình Pháp Lam giấu vào kho củi.',
        isCorrect: true,
        explanation:
          'Phán quyết chuẩn xác! Tang vật bình Pháp Lam đã được tìm thấy nguyên vẹn trong kho củi Nội Vụ Phủ.',
      },
      {
        id: 'opt_2_wrong',
        suspectName: 'Nhạc Công Thượng Uyển',
        conclusionText: 'Kết luận Nhạc Công Thượng Uyển làm vỡ bình rồi giấu đi.',
        isCorrect: false,
        explanation:
          'Chưa chính xác! Nhạc công chỉ ở Ngự Hoa Viên, không có chìa khóa kho Nội Vụ.',
      },
    ],
  },
];

// ============================================================================
// 7. DỮ LIỆU HÀN LÂM VIỆN (5 CÂU HỎI TRẮC NGHIỆM CÓ ĐẾM NGƯỢC & BẢNG VÀNG)
// ============================================================================
export const IMPERIAL_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'q1',
    category: 'Điển Chế',
    question:
      'Câu 1: Trong Lục Bộ của triều đình phong kiến, cơ quan nào chịu trách nhiệm tuyển dụng, khảo công và thăng giáng chức tước cho quan viên?',
    options: ['Lễ Bộ', 'Lại Bộ', 'Hộ Bộ', 'Binh Bộ'],
    correctIndex: 1,
    explanation:
      'Lại Bộ đứng đầu Lục Bộ, chuyên trách việc bổ nhiệm, khảo công và thăng giáng quan lại.',
  },
  {
    id: 'q2',
    category: 'Lịch Sử',
    question:
      'Câu 2: Trên các dải liên ba gỗ trong Điện Thái Hòa (Hoàng thành Huế), phong cách trang trí một bài thơ chữ Hán đi kèm một bức tranh gọi là gì?',
    options: [
      'Nhất Thi Nhất Họa',
      'Tứ Linh Hội Tụ',
      'Cửu Long Tranh Châu',
      'Bách Điểu Triều Phụng',
    ],
    correctIndex: 0,
    explanation:
      'Nhất Thi Nhất Họa (một bài thơ kèm một bức họa) là di sản trang trí độc đáo của kiến trúc cung đình Huế.',
  },
  {
    id: 'q3',
    category: 'Điển Chế',
    question:
      'Câu 3: Trong nghi thức Đại Triều tại Điện Thái Hòa, bậc Cửu Ngũ Chí Tôn (Hoàng Đế) đội loại mũ nào có 12 chuỗi ngọc rủ trước và sau?',
    options: [
      'Mũ Ô Sa cánh chuồn',
      'Mũ Miện Lưu (Thập Nhị Lưu)',
      'Mũ Phương Sơn',
      'Mũ Phốc Đầu',
    ],
    correctIndex: 1,
    explanation:
      'Mũ Miện Lưu với 12 chuỗi ngọc (Thập nhị lưu) là mũ đại triều dành riêng cho Hoàng Đế.',
  },
];

export const HAN_LAM_STUDY_DOCS: StudyDocument[] = NGU_THU_BOOKS;

export const INITIAL_EXAM_LEADERBOARD: ExamLeaderboardEntry[] = [
  {
    rank: 1,
    scholarName: 'Nguyễn Hiền',
    title: 'Trạng Nguyên Khoa Giáp Thìn',
    score: 500,
    timeTakenSec: 28,
  },
  {
    rank: 2,
    scholarName: 'Mạc Đĩnh Chi',
    title: 'Lưỡng Quốc Trạng Nguyên',
    score: 480,
    timeTakenSec: 34,
  },
  {
    rank: 3,
    scholarName: 'Lê Quý Đôn',
    title: 'Bảng Nhãn Hàn Lâm',
    score: 450,
    timeTakenSec: 39,
  },
];

// ============================================================================
// 8. DỮ LIỆU NGỰ HOA VIÊN (CHAT GẦN, BIỂU CẢM EMOTE & SỰ KIỆN GIAO LƯU)
// ============================================================================
export const INITIAL_GARDEN_CHATS: LocalChatMessage[] = [
  {
    id: 'chat_1',
    sender: 'Hàn Lâm Học Sĩ – Chu Văn',
    rankTitle: 'Tam Phẩm',
    text: 'Hoa đào Ngự Hoa Viên mùa này nở rộ đẹp quá, mời chư vị đồng liêu cùng thưởng trà đàm đạo!',
    timestamp: 'Vừa xong',
  },
  {
    id: 'chat_2',
    sender: 'Quản Sự Thượng Uyển – Nhã Lan',
    rankTitle: 'Nội Đình',
    text: 'Trà sen Bách Diệp vừa pha xong tại Thủy Đình, quý quan viên có thể ngồi ghế đá bên hồ nghỉ chân ạ.',
    timestamp: 'Vừa xong',
  },
];

export const GARDEN_EMOTES: EmoteAction[] = [
  {
    id: 'emote_bow',
    icon: '🙇',
    label: 'Hành Lễ Cung Kính',
    bubbleText: '🙇 Tiểu quan xin bái kiến chư vị đại nhân!',
  },
  {
    id: 'emote_tea',
    icon: '🍵',
    label: 'Thưởng Trà Sen',
    bubbleText: '🍵 Nhấp một ngụm trà sen thượng uyển, tâm hồn thư thái!',
  },
  {
    id: 'emote_poem',
    icon: '🌸',
    label: 'Ngâm Thơ Hoa Đào',
    bubbleText: '🌸 "Xuân phong đào lý hoa khai nhật – Đại Nghiệp thiên thu thái bình thì!"',
  },
  {
    id: 'emote_cheer',
    icon: '🎉',
    label: 'Chúc Mừng Thăng Quan',
    bubbleText: '🎉 Chúc chư vị đồng liêu thăng quan tiến chức, công thành danh toại!',
  },
];

// ============================================================================
// 9. CẨM NANG HƯỚNG DẪN TÂN THỦ TẠI CỔNG CHÍNH
// ============================================================================
export const GATE_GUIDE_TIPS = [
  {
    title: '1. Điều khiển nhân vật & Camera',
    content:
      'Sử dụng phím W, A, S, D (hoặc mũi tên) để di chuyển, giữ Shift để chạy nhanh. Dùng chuột trái xoay góc nhìn và con lăn chuột để thu phóng.',
  },
  {
    title: '2. Hệ thống tương tác Phím E & Phím F',
    content:
      'Khi đến gần NPC hoặc Bàn làm việc / Bảng thông báo, nhấn phím E để mở giao diện tương tác, nhấn ESC để đóng. Khi đến gần Ngai Vàng hoặc Ghế, nhấn phím F để ngồi.',
  },
  {
    title: '3. Lộ trình thăng quan tiến chức (5 Nhiệm vụ chính)',
    content:
      'Bắt đầu tại Lại Bộ nhận nhiệm vụ -> Sang Hình Bộ điều tra phá án -> Đến Hàn Lâm Viện thi đỗ Khoa Cử -> Quay về Lại Bộ nộp kết quả & Thăng chức -> Vào Thái Hòa Điện dự Thiết Triều!',
  },
];
