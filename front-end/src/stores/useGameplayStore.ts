import { create } from 'zustand';
import {
  AppointmentRecord,
  ExamLeaderboardEntry,
  GameplayToast,
  ImperialEdict,
  ImperialMemorial,
  LocalChatMessage,
  QuestStatus,
} from '../types/gameplay';
import {
  CRIMINAL_CASES,
  GARDEN_EMOTES,
  INITIAL_APPOINTMENT_HISTORY,
  INITIAL_EXAM_LEADERBOARD,
  INITIAL_GARDEN_CHATS,
  INITIAL_IMPERIAL_EDICTS,
  INITIAL_MEMORIALS,
  INTERACTABLE_ENTITIES,
  OFFICIAL_PROMOTION_LADDER,
  PALACE_QUEST_CHAIN,
} from '../data/palaceGameplayData';
import { useGameStore } from './useGameStore';

export interface MeritLogEntry {
  id: string;
  reason: string;
  amount: number;
  timestamp: string;
}

interface GameplayState {
  // Chỉ số quan trường của người chơi
  meritPoints: number;
  silverCoins: number;
  officialGradeIndex: number; // 0: Cửu phẩm -> 1: Ngũ phẩm -> 2: Tam phẩm -> 3: Nhất phẩm -> 4: Hoàng Đế
  meritLogs: MeritLogEntry[];

  // Hệ thống Tương tác dùng chung (Phím E / ESC)
  nearbyInteractableId: string | null;
  activeInteractableId: string | null;
  activeTab: string;

  // Hệ thống Nhiệm vụ xuyên suốt (5 Nhiệm vụ chính tuyến)
  currentQuestStep: number; // 1 -> 5 (6 = Hoàn thành toàn bộ chuỗi)
  questStatuses: Record<string, QuestStatus>;

  // A. Thái Hòa Điện
  edicts: ImperialEdict[];
  courtSessionCount: number;

  // B. Ngự Thư Phòng
  memorials: ImperialMemorial[];

  // C. Lại Bộ
  appointmentHistory: AppointmentRecord[];

  // D. Hình Bộ
  activeCaseId: string;
  inspectedClueIds: string[];
  solvedCaseIds: string[];
  lastVerdictFeedback: { isCorrect: boolean; message: string } | null;

  // E. Hàn Lâm Viện
  bestExamScore: number;
  lastExamCorrectCount: number | null;
  examCompletedCount: number;
  leaderboard: ExamLeaderboardEntry[];

  // F. Ngự Hoa Viên (Chat gần & Emote trên đầu nhân vật)
  gardenChats: LocalChatMessage[];
  overheadBubbleText: string | null;
  banquetHostedCount: number;

  // Hệ thống Thông báo nổi (Toasts)
  toasts: GameplayToast[];

  // Actions
  setNearbyInteractableId: (id: string | null) => void;
  openInteraction: (interactableId: string, tabOverride?: string) => void;
  openBuildingModal: (buildingId: string, tabOverride?: string) => void;
  setActiveTab: (tab: string) => void;
  closeInteraction: () => void;

  // Quest Actions
  handleLaiBoQuestInteraction: () => void;
  completeQuestByStep: (stepNumber: number) => void;

  // Thái Hòa Điện Actions
  issueImperialEdict: (
    title: string,
    content: string,
    category: 'appointment' | 'policy' | 'reward'
  ) => void;
  holdCourtSession: () => void;

  // Ngự Thư Phòng Actions
  reviewMemorial: (memorialId: string, decision: 'approved' | 'rejected') => void;

  // Lại Bộ Actions
  submitPromotionApplication: () => { ok: boolean; message: string };

  // Hình Bộ Actions
  setActiveCaseId: (caseId: string) => void;
  inspectClue: (clueId: string) => void;
  submitCaseVerdict: (caseId: string, optionId: string) => void;

  // Hàn Lâm Viện Actions
  submitExamResult: (correctCount: number, totalQuestions: number, timeSpentSec: number) => void;

  // Ngự Hoa Viên Actions
  sendLocalChat: (text: string) => void;
  triggerEmote: (emoteId: string) => void;
  hostGardenBanquet: () => void;

  // Toast Actions
  pushToast: (type: GameplayToast['type'], title: string, message: string) => void;
  dismissToast: (id: string) => void;
}

export const useGameplayStore = create<GameplayState>((set, get) => ({
  meritPoints: 40,
  silverCoins: 1000,
  officialGradeIndex: 0,
  meritLogs: [
    {
      id: 'log_init',
      reason: 'Đỗ kỳ thi Ân Khoa – Nhập cung nhận chức Cửu Phẩm Chủ Sự',
      amount: 40,
      timestamp: 'Khởi đầu',
    },
  ],

  nearbyInteractableId: null,
  activeInteractableId: null,
  activeTab: 'overview',

  currentQuestStep: 1,
  questStatuses: {
    quest_1_lai_bo_init: 'in_progress',
    quest_2_hinh_bo_case: 'locked',
    quest_3_han_lam_exam: 'locked',
    quest_4_lai_bo_report: 'locked',
    quest_5_promotion_rank: 'locked',
  },

  edicts: INITIAL_IMPERIAL_EDICTS,
  courtSessionCount: 1,

  memorials: INITIAL_MEMORIALS,

  appointmentHistory: INITIAL_APPOINTMENT_HISTORY,

  activeCaseId: CRIMINAL_CASES[0].id,
  inspectedClueIds: [],
  solvedCaseIds: [],
  lastVerdictFeedback: null,

  bestExamScore: 0,
  lastExamCorrectCount: null,
  examCompletedCount: 0,
  leaderboard: INITIAL_EXAM_LEADERBOARD,

  gardenChats: INITIAL_GARDEN_CHATS,
  overheadBubbleText: null,
  banquetHostedCount: 0,

  toasts: [],

  setNearbyInteractableId: (nearbyInteractableId) => set({ nearbyInteractableId }),

  openInteraction: (interactableId, tabOverride) => {
    const entity = INTERACTABLE_ENTITIES.find((e) => e.id === interactableId);
    if (!entity) return;
    useGameStore.getState().exitMouseLock();
    set({
      activeInteractableId: interactableId,
      activeTab: tabOverride ?? entity.defaultTab,
      lastVerdictFeedback: null,
    });

    // Nếu người chơi đang ở Nhiệm vụ 1 hoặc 4 và tương tác với Thượng Thư Lại Bộ
    if (entity.buildingId === 'lai_bo') {
      const state = get();
      if (state.currentQuestStep === 1 || state.currentQuestStep === 4) {
        // Tự động mở tab nhiệm vụ để người chơi dễ dàng nhận/nộp
        if (!tabOverride) {
          set({ activeTab: 'quests' });
        }
      }
    }
  },

  openBuildingModal: (buildingId, tabOverride) => {
    const entity = INTERACTABLE_ENTITIES.find((e) => e.buildingId === buildingId);
    if (!entity) return;
    get().openInteraction(entity.id, tabOverride);
  },

  setActiveTab: (activeTab) => set({ activeTab }),

  closeInteraction: () => set({ activeInteractableId: null }),

  pushToast: (type, title, message) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    set((state) => ({
      toasts: [...state.toasts.slice(-3), { id, type, title, message }],
    }));
    setTimeout(() => {
      get().dismissToast(id);
    }, 5200);
  },

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  completeQuestByStep: (stepNumber) => {
    const state = get();
    const quest = PALACE_QUEST_CHAIN.find((q) => q.stepNumber === stepNumber);
    if (!quest) return;
    if (state.questStatuses[quest.id] === 'completed') return;

    const nextStep = stepNumber + 1;
    const nextQuest = PALACE_QUEST_CHAIN.find((q) => q.stepNumber === nextStep);

    const updatedStatuses: Record<string, QuestStatus> = {
      ...state.questStatuses,
      [quest.id]: 'completed',
    };
    if (nextQuest) {
      updatedStatuses[nextQuest.id] = 'in_progress';
    }

    const newMerit = state.meritPoints + quest.reward.merit;
    const newCoins = state.silverCoins + quest.reward.coins;

    set({
      currentQuestStep: nextStep,
      questStatuses: updatedStatuses,
      meritPoints: newMerit,
      silverCoins: newCoins,
      meritLogs: [
        {
          id: `merit_q_${stepNumber}_${Date.now()}`,
          reason: `Hoàn thành ${quest.title}`,
          amount: quest.reward.merit,
          timestamp: 'Vừa xong',
        },
        ...state.meritLogs,
      ],
    });

    if (stepNumber === 1) {
      useGameStore.getState().completeLaiBoQuest();
    }

    get().pushToast(
      'quest',
      `Hoàn Thành ${quest.title}!`,
      `Thưởng: +${quest.reward.merit} Công Trạng, +${quest.reward.coins} Ngân Lượng${
        quest.reward.itemTitle ? ` • Vật phẩm: ${quest.reward.itemTitle}` : ''
      }`
    );

    if (nextQuest) {
      setTimeout(() => {
        get().pushToast(
          'info',
          `Nhiệm Vụ Mới: ${nextQuest.title}`,
          `Điểm đến tiếp theo: ${nextQuest.targetBuildingName} — ${nextQuest.requirementText}`
        );
      }, 900);
    }
  },

  handleLaiBoQuestInteraction: () => {
    const state = get();
    if (state.currentQuestStep === 1) {
      state.completeQuestByStep(1);
    } else if (state.currentQuestStep === 4) {
      state.completeQuestByStep(4);
    }
  },

  issueImperialEdict: (title, content, category) => {
    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    if (!cleanTitle || !cleanContent) return;

    const newEdict: ImperialEdict = {
      id: `edict_${Date.now()}`,
      title: cleanTitle,
      content: cleanContent,
      issuedBy: 'Thánh Chỉ Ban Hành Tại Điện Thái Hòa',
      timestamp: 'Vừa ban bố',
      category,
    };

    set((state) => ({
      edicts: [newEdict, ...state.edicts],
      meritPoints: state.meritPoints + 35,
      meritLogs: [
        {
          id: `merit_edict_${Date.now()}`,
          reason: `Công bố Chiếu Chỉ: "${cleanTitle}" tại Thái Hòa Điện`,
          amount: 35,
          timestamp: 'Vừa xong',
        },
        ...state.meritLogs,
      ],
    }));

    get().pushToast(
      'reward',
      'Đã Ban Bố Thánh Chỉ Mới!',
      `Chiếu chỉ "${cleanTitle}" đã được niêm yết trên Hoàng Bảng (+35 Công Trạng).`
    );
  },

  holdCourtSession: () => {
    set((state) => ({
      courtSessionCount: state.courtSessionCount + 1,
      meritPoints: state.meritPoints + 40,
      silverCoins: state.silverCoins + 120,
      meritLogs: [
        {
          id: `merit_court_${Date.now()}`,
          reason: `Tham dự Đại Triều Thiết Triều lần thứ ${state.courtSessionCount + 1} tại Thái Hòa Điện`,
          amount: 40,
          timestamp: 'Vừa xong',
        },
        ...state.meritLogs,
      ],
    }));

    get().pushToast(
      'reward',
      'Buổi Thiết Triều Thành Công!',
      'Trăm quan bái lạy tại Điện Thái Hòa! Bạn nhận +40 Công Trạng và +120 Ngân Lượng.'
    );
  },

  reviewMemorial: (memorialId, decision) => {
    const state = get();
    const target = state.memorials.find((m) => m.id === memorialId);
    if (!target || target.status !== 'pending') return;

    const gainedMerit = decision === 'approved' ? target.rewardMerit : 15;
    const gainedCoins = decision === 'approved' ? 80 : 30;

    set({
      memorials: state.memorials.map((m) =>
        m.id === memorialId ? { ...m, status: decision } : m
      ),
      meritPoints: state.meritPoints + gainedMerit,
      silverCoins: state.silverCoins + gainedCoins,
      meritLogs: [
        {
          id: `merit_mem_${Date.now()}`,
          reason: `${decision === 'approved' ? 'Chu phê Chuẩn Tấu' : 'Bác Tấu'}: ${target.title}`,
          amount: gainedMerit,
          timestamp: 'Vừa xong',
        },
        ...state.meritLogs,
      ],
    });

    get().pushToast(
      'reward',
      decision === 'approved' ? 'Đã Chu Phê: CHUẨN TẤU!' : 'Đã Phê Duyệt: BÁC TẤU!',
      `Tấu chương của ${target.senderName} đã được xử lý (+${gainedMerit} Công Trạng, +${gainedCoins} Ngân Lượng).`
    );
  },

  submitPromotionApplication: () => {
    const state = get();
    const nextIndex = state.officialGradeIndex + 1;
    if (nextIndex >= OFFICIAL_PROMOTION_LADDER.length) {
      return {
        ok: false,
        message: 'Bệ hạ đã đạt ngôi vị Cửu Ngũ Chí Tôn tối cao của Đại Nghiệp!',
      };
    }

    const currentGrade = OFFICIAL_PROMOTION_LADDER[state.officialGradeIndex];
    const nextGrade = OFFICIAL_PROMOTION_LADDER[nextIndex];

    if (state.meritPoints < nextGrade.requiredMerit) {
      return {
        ok: false,
        message: `Chưa đủ Công Trạng! Cần ${nextGrade.requiredMerit} điểm Công Trạng (hiện có ${state.meritPoints}). Hãy làm nhiệm vụ, phá án hoặc thi Khoa Cử để tích lũy thêm.`,
      };
    }

    const record: AppointmentRecord = {
      id: `app_${Date.now()}`,
      officialName: 'Minh Vương',
      fromTitle: `${currentGrade.gradeCode} (${currentGrade.titleVi})`,
      toTitle: `${nextGrade.gradeCode} (${nextGrade.titleVi})`,
      timestamp: 'Vừa bổ nhiệm',
      note: `Đạt ${state.meritPoints} điểm Công Trạng, được Lại Bộ trình Hoàng Đế sắc phong.`,
    };

    set({
      officialGradeIndex: nextIndex,
      silverCoins: state.silverCoins + nextGrade.salaryCoins,
      appointmentHistory: [record, ...state.appointmentHistory],
      meritLogs: [
        {
          id: `merit_promo_${Date.now()}`,
          reason: `Thăng chức lên ${nextGrade.gradeCode} – ${nextGrade.titleVi}`,
          amount: 50,
          timestamp: 'Vừa xong',
        },
        ...state.meritLogs,
      ],
    });

    // Cập nhật trang phục 3D của nhân vật theo phẩm cấp mới
    useGameStore.getState().setCharacterRank(nextGrade.visualRank);

    get().pushToast(
      'promotion',
      `Thăng Chức Thành Công: ${nextGrade.gradeCode}!`,
      `Chúc mừng đại nhân được sắc phong làm "${nextGrade.titleVi}"! Bổng lộc thưởng: +${nextGrade.salaryCoins} Ngân Lượng.`
    );

    if (get().currentQuestStep === 5) {
      get().completeQuestByStep(5);
    }

    return {
      ok: true,
      message: `Đã thăng chức lên ${nextGrade.gradeCode} – ${nextGrade.titleVi}!`,
    };
  },

  setActiveCaseId: (activeCaseId) =>
    set({ activeCaseId, lastVerdictFeedback: null }),

  inspectClue: (clueId) => {
    const state = get();
    if (state.inspectedClueIds.includes(clueId)) return;

    set({
      inspectedClueIds: [...state.inspectedClueIds, clueId],
      meritPoints: state.meritPoints + 10,
    });
  },

  submitCaseVerdict: (caseId, optionId) => {
    const state = get();
    const targetCase = CRIMINAL_CASES.find((c) => c.id === caseId);
    if (!targetCase) return;

    const chosenOption = targetCase.options.find((o) => o.id === optionId);
    if (!chosenOption) return;

    if (!chosenOption.isCorrect) {
      set({
        lastVerdictFeedback: {
          isCorrect: false,
          message: chosenOption.explanation,
        },
      });
      get().pushToast('info', 'Suy Luận Chưa Chính Xác!', chosenOption.explanation);
      return;
    }

    const alreadySolved = state.solvedCaseIds.includes(caseId);
    const gainedMerit = alreadySolved ? 20 : targetCase.rewardMerit;
    const gainedCoins = alreadySolved ? 50 : targetCase.rewardCoins;

    set({
      solvedCaseIds: alreadySolved
        ? state.solvedCaseIds
        : [...state.solvedCaseIds, caseId],
      meritPoints: state.meritPoints + gainedMerit,
      silverCoins: state.silverCoins + gainedCoins,
      lastVerdictFeedback: {
        isCorrect: true,
        message: chosenOption.explanation,
      },
      meritLogs: [
        {
          id: `merit_case_${Date.now()}`,
          reason: `Phá án thành công tại Hình Bộ: ${targetCase.title}`,
          amount: gainedMerit,
          timestamp: 'Vừa xong',
        },
        ...state.meritLogs,
      ],
    });

    get().pushToast(
      'reward',
      `Phá Án Thành Công: ${targetCase.code}!`,
      `Thưởng phá án: +${gainedMerit} Công Trạng, +${gainedCoins} Ngân Lượng.`
    );

    if (get().currentQuestStep === 2) {
      get().completeQuestByStep(2);
    }
  },

  submitExamResult: (correctCount, totalQuestions, timeSpentSec) => {
    const state = get();
    const score = correctCount * 100;
    const passed = correctCount >= 3;
    const gainedMerit = passed ? correctCount * 35 : correctCount * 15;
    const gainedCoins = passed ? correctCount * 70 : 50;

    const currentGrade = OFFICIAL_PROMOTION_LADDER[state.officialGradeIndex];
    const playerEntry: ExamLeaderboardEntry = {
      rank: 1,
      scholarName: 'Minh Vương (Bạn)',
      title:
        score === 500
          ? 'Tân Khoa Trạng Nguyên'
          : score >= 400
            ? 'Tân Khoa Bảng Nhãn'
            : currentGrade.gradeCode,
      score,
      timeTakenSec: Math.max(5, timeSpentSec),
    };

    const mergedBoard = [
      ...state.leaderboard.filter((e) => !e.scholarName.includes('(Bạn)')),
      playerEntry,
    ]
      .sort((a, b) => b.score - a.score || a.timeTakenSec - b.timeTakenSec)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    set({
      bestExamScore: Math.max(state.bestExamScore, score),
      lastExamCorrectCount: correctCount,
      examCompletedCount: state.examCompletedCount + 1,
      leaderboard: mergedBoard,
      meritPoints: state.meritPoints + gainedMerit,
      silverCoins: state.silverCoins + gainedCoins,
      meritLogs: [
        {
          id: `merit_exam_${Date.now()}`,
          reason: `Hoàn thành Kỳ Thi Hàn Lâm Viện (${correctCount}/${totalQuestions} câu đúng – ${score} điểm)`,
          amount: gainedMerit,
          timestamp: 'Vừa xong',
        },
        ...state.meritLogs,
      ],
    });

    get().pushToast(
      'reward',
      passed ? `Đỗ Kỳ Thi Hàn Lâm (${correctCount}/${totalQuestions} Câu)!` : 'Hoàn Thành Bài Thi!',
      `Đạt ${score} điểm! Nhận +${gainedMerit} Công Trạng và +${gainedCoins} Ngân Lượng.`
    );

    if (passed && get().currentQuestStep === 3) {
      get().completeQuestByStep(3);
    }
  },

  sendLocalChat: (text) => {
    const clean = text.trim();
    if (!clean) return;
    const state = get();
    const currentGrade = OFFICIAL_PROMOTION_LADDER[state.officialGradeIndex];

    const newMsg: LocalChatMessage = {
      id: `chat_${Date.now()}`,
      sender: 'Minh Vương (Bạn)',
      rankTitle: currentGrade.gradeCode,
      text: clean,
      timestamp: 'Vừa xong',
      isPlayer: true,
    };

    set({
      gardenChats: [...state.gardenChats.slice(-15), newMsg],
      overheadBubbleText: `💬 ${clean}`,
    });

    setTimeout(() => {
      if (get().overheadBubbleText === `💬 ${clean}`) {
        set({ overheadBubbleText: null });
      }
    }, 5000);
  },

  triggerEmote: (emoteId) => {
    const emote = GARDEN_EMOTES.find((e) => e.id === emoteId);
    if (!emote) return;
    const state = get();
    const currentGrade = OFFICIAL_PROMOTION_LADDER[state.officialGradeIndex];

    const newMsg: LocalChatMessage = {
      id: `emote_${Date.now()}`,
      sender: 'Minh Vương (Bạn)',
      rankTitle: currentGrade.gradeCode,
      text: emote.bubbleText,
      timestamp: 'Vừa xong',
      isPlayer: true,
    };

    set({
      gardenChats: [...state.gardenChats.slice(-15), newMsg],
      overheadBubbleText: emote.bubbleText,
      meritPoints: state.meritPoints + 5,
    });

    get().pushToast('info', `Biểu Cảm: ${emote.label}`, emote.bubbleText);

    setTimeout(() => {
      if (get().overheadBubbleText === emote.bubbleText) {
        set({ overheadBubbleText: null });
      }
    }, 5000);
  },

  hostGardenBanquet: () => {
    set((state) => ({
      banquetHostedCount: state.banquetHostedCount + 1,
      meritPoints: state.meritPoints + 30,
      gardenChats: [
        ...state.gardenChats,
        {
          id: `banquet_${Date.now()}`,
          sender: 'Quản Sự Thượng Uyển – Nhã Lan',
          rankTitle: 'Nội Đình',
          text: '🎊 Yến tiệc Thưởng Hoa Đào tại Ngự Hoa Viên đã khai tiệc! Trăm quan cùng nâng chén chúc tụng!',
          timestamp: 'Vừa xong',
        },
      ],
      overheadBubbleText: '🍵 Khai tiệc Thưởng Hoa tại Ngự Hoa Viên!',
    }));

    get().pushToast(
      'reward',
      'Khai Tiệc Ngự Hoa Viên!',
      'Tổ chức thành công Hội Thơ Hoa Đào cùng bá quan (+30 Công Trạng).'
    );
  },
}));
