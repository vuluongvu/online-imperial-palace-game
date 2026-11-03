export type CourtCeremonyStage = 'idle' | 'assembly' | 'kowtow' | 'decree' | 'rewarded';

export interface CeremonyStageInfo {
  stage: CourtCeremonyStage;
  stepNumber: number;
  stageTitle: string;
  heraldAnnounce: string;
  courtActionLabel: string;
  npcChoralShout?: string;
  durationSeconds: number;
}

export const COURT_CEREMONY_STAGES: Record<CourtCeremonyStage, CeremonyStageInfo> = {
  idle: {
    stage: 'idle',
    stepNumber: 0,
    stageTitle: 'Chưa Bắt Đầu',
    heraldAnnounce: '',
    courtActionLabel: '',
    durationSeconds: 0,
  },
  assembly: {
    stage: 'assembly',
    stepNumber: 1,
    stageTitle: 'Khai Triều Tề Tựu',
    heraldAnnounce:
      'Chủ trì Trương Đình tuyên xướng: "Giờ lành đã điểm! Trăm quan văn võ chỉnh tề quan phục, tề tựu hai hàng nghênh đón Thiên Tử khai triều!"',
    courtActionLabel: 'Tiến Vào Hàng Triều [Bước 1]',
    durationSeconds: 30,
  },
  kowtow: {
    stage: 'kowtow',
    stepNumber: 2,
    stageTitle: 'Bá Quan Triều Bái (Tam Quỳ Cửu Khấu)',
    heraldAnnounce:
      'Chủ trì xướng: "Bá quan văn võ cúc cung triều bái! Cúi lạy Thiên Tử... Ngô hoàng vạn tuế, vạn tuế, vạn vạn tuế!"',
    courtActionLabel: 'Cùng Bá Quan Quỳ Lạy [Phím K]',
    npcChoralShout: 'VẠN TUẾ! VẠN TUẾ! VẠN VẠN TUẾ!',
    durationSeconds: 30,
  },
  decree: {
    stage: 'decree',
    stepNumber: 3,
    stageTitle: 'Tấu Trình Quốc Sự & Ban Bố Chiếu Chỉ',
    heraldAnnounce:
      'Hoàng Đế ban dụ: "Trẫm xem tấu chương, thấy thiên hạ thái bình, văn thần võ tướng tận trung chức phận. Nay ban thánh chỉ khen thưởng đình thần!"',
    courtActionLabel: 'Khấu Đầu Lĩnh Chỉ [Bước 3]',
    durationSeconds: 30,
  },
  rewarded: {
    stage: 'rewarded',
    stepNumber: 4,
    stageTitle: 'Lãnh Bổng Lộc & Hoàn Tất Thiết Triều',
    heraldAnnounce:
      'Chủ trì xướng: "Bá quan tạ ơn Hoàng ân! Buổi thiết triều viên mãn thành công, bãi triều!"',
    courtActionLabel: 'Nhận Bổng Lộc & Hoàn Tất [Bước 4]',
    durationSeconds: 30,
  },
};
