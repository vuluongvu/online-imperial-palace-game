import React, { useEffect, useState } from 'react';
import {
  COURT_OFFICIALS,
  CRIMINAL_CASES,
  GARDEN_EMOTES,
  GATE_GUIDE_TIPS,
  HAN_LAM_STUDY_DOCS,
  IMPERIAL_EXAM_QUESTIONS,
  INTERACTABLE_ENTITIES,
  NGU_THU_BOOKS,
  OFFICIAL_PROMOTION_LADDER,
  PALACE_QUEST_CHAIN,
  TERRITORY_REGIONS,
} from '../data/palaceGameplayData';
import { PALACE_LANDMARKS } from '../game/world/compoundLayout';
import { useGameplayStore } from '../stores/useGameplayStore';
import { useGameStore } from '../stores/useGameStore';

export const BuildingGameplayModal: React.FC = () => {
  const activeInteractableId = useGameplayStore((s) => s.activeInteractableId);
  const activeTab = useGameplayStore((s) => s.activeTab);
  const setActiveTab = useGameplayStore((s) => s.setActiveTab);
  const closeInteraction = useGameplayStore((s) => s.closeInteraction);
  const openInteraction = useGameplayStore((s) => s.openInteraction);

  const meritPoints = useGameplayStore((s) => s.meritPoints);
  const silverCoins = useGameplayStore((s) => s.silverCoins);
  const officialGradeIndex = useGameplayStore((s) => s.officialGradeIndex);
  const meritLogs = useGameplayStore((s) => s.meritLogs);

  const currentQuestStep = useGameplayStore((s) => s.currentQuestStep);
  const questStatuses = useGameplayStore((s) => s.questStatuses);
  const handleLaiBoQuestInteraction = useGameplayStore(
    (s) => s.handleLaiBoQuestInteraction
  );

  // Thái Hòa Điện state
  const edicts = useGameplayStore((s) => s.edicts);
  const courtSessionCount = useGameplayStore((s) => s.courtSessionCount);
  const issueImperialEdict = useGameplayStore((s) => s.issueImperialEdict);
  const holdCourtSession = useGameplayStore((s) => s.holdCourtSession);

  // Ngự Thư Phòng state
  const memorials = useGameplayStore((s) => s.memorials);
  const reviewMemorial = useGameplayStore((s) => s.reviewMemorial);

  // Lại Bộ state
  const appointmentHistory = useGameplayStore((s) => s.appointmentHistory);
  const submitPromotionApplication = useGameplayStore(
    (s) => s.submitPromotionApplication
  );

  // Hình Bộ state
  const activeCaseId = useGameplayStore((s) => s.activeCaseId);
  const setActiveCaseId = useGameplayStore((s) => s.setActiveCaseId);
  const inspectedClueIds = useGameplayStore((s) => s.inspectedClueIds);
  const solvedCaseIds = useGameplayStore((s) => s.solvedCaseIds);
  const lastVerdictFeedback = useGameplayStore((s) => s.lastVerdictFeedback);
  const inspectClue = useGameplayStore((s) => s.inspectClue);
  const submitCaseVerdict = useGameplayStore((s) => s.submitCaseVerdict);

  // Hàn Lâm Viện state
  const bestExamScore = useGameplayStore((s) => s.bestExamScore);
  const examCompletedCount = useGameplayStore((s) => s.examCompletedCount);
  const leaderboard = useGameplayStore((s) => s.leaderboard);
  const submitExamResult = useGameplayStore((s) => s.submitExamResult);

  // Ngự Hoa Viên state
  const gardenChats = useGameplayStore((s) => s.gardenChats);
  const sendLocalChat = useGameplayStore((s) => s.sendLocalChat);
  const triggerEmote = useGameplayStore((s) => s.triggerEmote);
  const hostGardenBanquet = useGameplayStore((s) => s.hostGardenBanquet);

  // GameStore navigation
  const navigateToLandmark = useGameStore((s) => s.navigateToLandmark);
  const setSceneMode = useGameStore((s) => s.setSceneMode);
  const sitAtSpot = useGameStore((s) => s.sitAtSpot);

  // Local Form States
  const [edictTitle, setEdictTitle] = useState('');
  const [edictContent, setEdictContent] = useState('');
  const [edictCategory, setEdictCategory] = useState<
    'appointment' | 'policy' | 'reward'
  >('policy');
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');

  // Hàn Lâm Viện Timed Quiz State
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctTally, setCorrectTally] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(20);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  // Bộ đếm ngược thời gian mỗi câu hỏi tại Hàn Lâm Viện (20 giây / câu)
  useEffect(() => {
    if (!examStarted || examFinished || selectedOption !== null) return;
    const timer = window.setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          // Hết giờ câu hiện tại -> tự động đánh dấu hết giờ (-1)
          setSelectedOption(-1);
          return 0;
        }
        return prev - 1;
      });
      setTotalTimeSpent((t) => t + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [examStarted, examFinished, selectedOption]);

  if (!activeInteractableId) return null;

  const entity = INTERACTABLE_ENTITIES.find((e) => e.id === activeInteractableId);
  if (!entity) return null;

  const currentGrade = OFFICIAL_PROMOTION_LADDER[officialGradeIndex];
  const nextGrade = OFFICIAL_PROMOTION_LADDER[officialGradeIndex + 1] ?? null;
  const siblingEntities = INTERACTABLE_ENTITIES.filter(
    (e) => e.buildingId === entity.buildingId && e.zoneMode === entity.zoneMode
  );
  const currentCase =
    CRIMINAL_CASES.find((c) => c.id === activeCaseId) ?? CRIMINAL_CASES[0];

  const startImperialExam = () => {
    setExamStarted(true);
    setExamFinished(false);
    setCurrentQIdx(0);
    setSelectedOption(null);
    setCorrectTally(0);
    setQuestionTimer(20);
    setTotalTimeSpent(0);
  };

  const handleAnswerExam = (optIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIdx);
    const q = IMPERIAL_EXAM_QUESTIONS[currentQIdx];
    if (optIdx === q.correctIndex) {
      setCorrectTally((c) => c + 1);
    }
  };

  const handleNextExamQuestion = () => {
    if (currentQIdx + 1 < IMPERIAL_EXAM_QUESTIONS.length) {
      setCurrentQIdx((i) => i + 1);
      setSelectedOption(null);
      setQuestionTimer(20);
    } else {
      setExamFinished(true);
      submitExamResult(
        correctTally,
        IMPERIAL_EXAM_QUESTIONS.length,
        Math.max(8, totalTimeSpent)
      );
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeInteraction}>
      <div
        className="gameplay-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =============================================================== */}
        {/* HEADER CHUNG CHO MỌI CÔNG TRÌNH                                 */}
        {/* =============================================================== */}
        <header className="gp-modal-header">
          <div>
            <div className="gp-modal-badge-row">
              <span className="gp-building-pill">
                {entity.type === 'npc' ? '👤 NPC Đối Thoại' : '🏛️ Vật Thể Tương Tác'}
              </span>
              <span className="gp-stat-pill">
                🎖️ Công Trạng: <strong>{meritPoints}</strong>
              </span>
              <span className="gp-stat-pill">
                🪙 Ngân Lượng: <strong>{silverCoins}</strong>
              </span>
              <span className="gp-stat-pill">
                🎓 Phẩm Cấp: <strong>{currentGrade.gradeCode}</strong>
              </span>
            </div>
            <h2 className="gp-modal-title">{entity.name}</h2>
            <p className="gp-modal-subtitle">{entity.title}</p>
          </div>

          <button
            type="button"
            className="close-btn"
            onClick={closeInteraction}
            title="Nhấn phím ESC để đóng"
          >
            Đóng [ESC]
          </button>
        </header>

        {/* Thanh chuyển nhanh giữa các NPC / Vật thể trong cùng công trình */}
        {siblingEntities.length > 1 && (
          <div className="gp-entity-switcher">
            <span className="gp-switcher-label">Đối tượng tại đây:</span>
            {siblingEntities.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`gp-entity-chip ${
                  item.id === entity.id ? 'active' : ''
                }`}
                onClick={() => openInteraction(item.id)}
              >
                {item.type === 'npc' ? '👤 ' : '✨ '}
                {item.name}
              </button>
            ))}
          </div>
        )}

        {/* =============================================================== */}
        {/* NỘI DUNG CHI TIẾT THEO TỪNG CÔNG TRÌNH (A -> G)                 */}
        {/* =============================================================== */}
        <div className="gp-modal-body">
          {/* ------------------------------------------------------------- */}
          {/* A. THÁI HÒA ĐIỆN – TRUNG TÂM QUYỀN LỰC                        */}
          {/* ------------------------------------------------------------- */}
          {entity.buildingId === 'chinh_dien' && (
            <div>
              <div className="gp-tab-bar">
                <button
                  type="button"
                  className={`gp-tab-btn ${activeTab === 'court' ? 'active' : ''}`}
                  onClick={() => setActiveTab('court')}
                >
                  👑 Thiết Triều & Ngai Vàng
                </button>
                <button
                  type="button"
                  className={`gp-tab-btn ${
                    activeTab === 'officials' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('officials')}
                >
                  👥 Bá Quan Có Mặt ({COURT_OFFICIALS.length})
                </button>
                <button
                  type="button"
                  className={`gp-tab-btn ${activeTab === 'edicts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('edicts')}
                >
                  📜 Hoàng Bảng Chiếu Chỉ ({edicts.length})
                </button>
              </div>

              {activeTab === 'court' && (
                <div className="gp-section-grid">
                  <div className="gp-card">
                    <h3>🏛️ Đại Triều Thái Hòa Điện</h3>
                    <p className="gp-text">
                      Điện Thái Hòa là trung tâm quyền lực tối cao của hoàng cung
                      Đại Nghiệp — nơi Hoàng Đế ngự trên Cửu Long Bảo Tọa, bá quan
                      văn võ đứng chầu hai bên công bố quốc sách và sắc phong chức
                      tước.
                    </p>
                    <div className="gp-info-box">
                      <div>
                        • Số phiên thiết triều đã cử hành:{' '}
                        <strong>{courtSessionCount} phiên</strong>
                      </div>
                      <div>
                        • Phẩm cấp hiện tại của bạn:{' '}
                        <strong>
                          {currentGrade.gradeCode} – {currentGrade.titleVi}
                        </strong>
                      </div>
                      <div>
                        • Quyền hạn tại Đại Điện:{' '}
                        <strong>{currentGrade.privileges.join(' • ')}</strong>
                      </div>
                    </div>

                    <div className="gp-action-row">
                      <button
                        type="button"
                        className="action-btn gold"
                        onClick={holdCourtSession}
                      >
                        🔔 Cử Hành Lễ Thiết Triều (+40 Công Trạng)
                      </button>
                      <button
                        type="button"
                        className="action-btn active"
                        onClick={() => {
                          closeInteraction();
                          sitAtSpot('imperial_throne');
                        }}
                      >
                        👑 Ngự Lên Cửu Long Bảo Tọa
                      </button>
                      {entity.zoneMode === 'compound_map' && (
                        <button
                          type="button"
                          className="action-btn"
                          onClick={() => {
                            closeInteraction();
                            setSceneMode('main_hall_interior');
                          }}
                        >
                          🚪 Bước Vào Nội Điện Thái Hòa 3D
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="gp-card">
                    <h3>✍️ Ban Bố Chiếu Chỉ Mới</h3>
                    <p className="gp-text">
                      Hoàng Đế hoặc Phụ Chính Đại Thần có thể ban bố Thánh Chỉ
                      niêm yết lên Hoàng Bảng cho toàn triều tuân lệnh:
                    </p>
                    <div className="gp-form-stack">
                      <input
                        type="text"
                        className="gp-input"
                        placeholder="Tiêu đề Chiếu Chỉ (VD: Chiếu Khuyến Nông & Tuyển Hiền)..."
                        value={edictTitle}
                        onChange={(e) => setEdictTitle(e.target.value)}
                      />
                      <select
                        className="gp-input"
                        value={edictCategory}
                        onChange={(e) =>
                          setEdictCategory(
                            e.target.value as 'appointment' | 'policy' | 'reward'
                          )
                        }
                      >
                        <option value="policy">Quốc Sách Triều Đình</option>
                        <option value="appointment">Sắc Phong & Bổ Nhiệm</option>
                        <option value="reward">Ban Thưởng Công Trạng</option>
                      </select>
                      <textarea
                        className="gp-textarea"
                        rows={3}
                        placeholder="Nội dung chiếu chỉ ban hành..."
                        value={edictContent}
                        onChange={(e) => setEdictContent(e.target.value)}
                      />
                      <button
                        type="button"
                        className="action-btn gold full-width"
                        onClick={() => {
                          if (!edictTitle.trim() || !edictContent.trim()) return;
                          issueImperialEdict(
                            edictTitle,
                            edictContent,
                            edictCategory
                          );
                          setEdictTitle('');
                          setEdictContent('');
                          setActiveTab('edicts');
                        }}
                      >
                        📜 Đóng Ấn Ban Bố Chiếu Chỉ (+35 Công Trạng)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'officials' && (
                <div className="gp-list-stack">
                  <div className="gp-banner-note">
                    Danh sách bá quan văn võ đang có mặt chầu trực tại Điện Thái Hòa:
                  </div>
                  {COURT_OFFICIALS.map((off) => (
                    <div key={off.id} className="gp-list-item">
                      <div>
                        <div className="gp-item-title">
                          {off.name} — <span className="gold-text">{off.title}</span>
                        </div>
                        <div className="gp-item-sub">
                          {off.ministry} • Phẩm hàm: <strong>{off.rankLabel}</strong>
                        </div>
                      </div>
                      <div className="gp-item-right">
                        <span className="status-tag">
                          {off.status === 'present'
                            ? 'Đang dự triều'
                            : 'Đang tuần phòng'}
                        </span>
                        <div className="gp-loyalty-text">
                          Trung thành: {off.loyalty}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'edicts' && (
                <div className="gp-list-stack">
                  {edicts.map((ed) => (
                    <div key={ed.id} className="gp-edict-card">
                      <div className="gp-edict-top">
                        <span className="gp-edict-badge">THÁNH CHỈ HOÀNG GIA</span>
                        <span className="gp-edict-time">{ed.timestamp}</span>
                      </div>
                      <h4 className="gp-edict-title">{ed.title}</h4>
                      <p className="gp-edict-body">“{ed.content}”</p>
                      <div className="gp-edict-footer">
                        Khâm thử • {ed.issuedBy}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* B. NGỰ THƯ PHÒNG – TRUNG TÂM ĐIỀU HÀNH                        */}
          {/* ------------------------------------------------------------- */}
          {entity.buildingId === 'ngu_thu_phong' && (
            <div>
              <div className="gp-tab-bar">
                <button
                  type="button"
                  className={`gp-tab-btn ${
                    activeTab === 'memorials' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('memorials')}
                >
                  📝 Phê Duyệt Tấu Chương (
                  {memorials.filter((m) => m.status === 'pending').length} chờ)
                </button>
                <button
                  type="button"
                  className={`gp-tab-btn ${
                    activeTab === 'reports' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('reports')}
                >
                  📊 Báo Cáo Triều Đình
                </button>
                <button
                  type="button"
                  className={`gp-tab-btn ${activeTab === 'books' ? 'active' : ''}`}
                  onClick={() => setActiveTab('books')}
                >
                  📚 Giá Sách Tư Liệu
                </button>
                <button
                  type="button"
                  className={`gp-tab-btn ${activeTab === 'map' ? 'active' : ''}`}
                  onClick={() => setActiveTab('map')}
                >
                  🗺️ Bản Đồ Lãnh Thổ
                </button>
              </div>

              {activeTab === 'memorials' && (
                <div className="gp-list-stack">
                  <div className="gp-banner-note">
                    Bàn Ngự Án: Hãy đọc kỹ các bản tấu chương từ Lục Bộ và chọn{' '}
                    <strong>Chu Phê Chuẩn Tấu</strong> hoặc <strong>Bác Tấu</strong>.
                  </div>
                  {memorials.map((mem) => (
                    <div key={mem.id} className="gp-card">
                      <div className="gp-item-header">
                        <span className="gp-item-title">
                          📜 {mem.title} ({mem.ministry})
                        </span>
                        <span
                          className={`status-tag ${
                            mem.status === 'approved'
                              ? 'approved'
                              : mem.status === 'rejected'
                                ? 'rejected'
                                : ''
                          }`}
                        >
                          {mem.status === 'pending'
                            ? 'Chờ Chu Phê'
                            : mem.status === 'approved'
                              ? 'Đã Chuẩn Tấu ✓'
                              : 'Đã Bác Tấu ✕'}
                        </span>
                      </div>
                      <div className="gp-item-sub">
                        Người dâng tấu: <strong>{mem.senderName}</strong> (
                        {mem.senderTitle})
                      </div>
                      <p className="gp-text" style={{ marginTop: 6 }}>
                        {mem.details}
                      </p>
                      <div className="gp-info-box">
                        <div>• Hệ quả Chuẩn tấu: {mem.impactApprove}</div>
                        <div>• Hệ quả Bác tấu: {mem.impactReject}</div>
                      </div>
                      {mem.status === 'pending' && (
                        <div className="gp-action-row">
                          <button
                            type="button"
                            className="action-btn gold"
                            onClick={() => reviewMemorial(mem.id, 'approved')}
                          >
                            🖌️ Chu Phê: CHUẨN TẤU (+{mem.rewardMerit} Công Trạng)
                          </button>
                          <button
                            type="button"
                            className="action-btn"
                            onClick={() => reviewMemorial(mem.id, 'rejected')}
                          >
                            ✕ Phê Duyệt: BÁC TẤU (+15 Công Trạng)
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="gp-section-grid">
                  <div className="gp-card">
                    <h3>📊 Tổng Quan Quốc Khố & Triều Chính</h3>
                    <div className="gp-info-box">
                      <div>
                        • Ngân khố triều đình: <strong>1,280,000 lượng bạc</strong>
                      </div>
                      <div>
                        • Lương thảo Thường Bình Thương:{' '}
                        <strong>85,000 thạch thóc</strong>
                      </div>
                      <div>
                        • Chỉ số An Dân toàn quốc: <strong>96/100 (Thái bình)</strong>
                      </div>
                      <div>
                        • Số tấu chương đã phê duyệt:{' '}
                        <strong>
                          {memorials.filter((m) => m.status !== 'pending').length} /{' '}
                          {memorials.length}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="gp-card">
                    <h3>👥 Danh Sách Trọng Thần Đương Nhiệm</h3>
                    {COURT_OFFICIALS.slice(0, 4).map((off) => (
                      <div key={off.id} className="gp-mini-row">
                        <strong>{off.name}</strong> — {off.title} ({off.rankLabel})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'books' && (
                <div className="gp-list-stack">
                  {NGU_THU_BOOKS.map((book) => (
                    <div key={book.id} className="gp-card">
                      <div className="gp-item-title">
                        📖 {book.title} ({book.category})
                      </div>
                      <p className="gp-text">{book.content}</p>
                      <div className="gp-hint-pill">💡 {book.examHint}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'map' && (
                <div className="gp-list-stack">
                  <div className="gp-banner-note">
                    Sa Bàn Cương Vực Đại Nghiệp – Báo cáo thực địa từ các Tổng Trấn:
                  </div>
                  {TERRITORY_REGIONS.map((reg) => (
                    <div key={reg.id} className="gp-card">
                      <div className="gp-item-title">🗺️ {reg.name}</div>
                      <div className="gp-info-box">
                        <div>• Quan trấn thủ: {reg.governor}</div>
                        <div>• Độ phồn vinh: {reg.prosperity}</div>
                        <div>• Tình hình trị an: {reg.security}</div>
                        <div>• Thuế khóa hàng năm: {reg.taxOutput}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* C. LẠI BỘ – TUYỂN DỤNG & THĂNG CHỨC                           */}
          {/* ------------------------------------------------------------- */}
          {entity.buildingId === 'lai_bo' && (
            <div>
              <div className="gp-tab-bar">
                <button
                  type="button"
                  className={`gp-tab-btn ${activeTab === 'quests' ? 'active' : ''}`}
                  onClick={() => setActiveTab('quests')}
                >
                  📋 Nhiệm Vụ Quan Trường (Bước {Math.min(currentQuestStep, 5)}/5)
                </button>
                <button
                  type="button"
                  className={`gp-tab-btn ${
                    activeTab === 'promotion' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('promotion')}
                >
                  🎖️ Bàn Bổ Nhiệm & Thăng Chức
                </button>
                <button
                  type="button"
                  className={`gp-tab-btn ${activeTab === 'merit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('merit')}
                >
                  📜 Bảng Công Trạng & Lịch Sử
                </button>
                <button
                  type="button"
                  className={`gp-tab-btn ${activeTab === 'ranks' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ranks')}
                >
                  🏛️ Danh Sách Chức Quan
                </button>
              </div>

              {activeTab === 'quests' && (
                <div className="gp-list-stack">
                  <div className="gp-card highlight-card">
                    <h3>👤 Lại Bộ Thượng Thư – Phạm Công Trứ</h3>
                    <p className="gp-text">
                      “Chào tân khoa quan viên <strong>Minh Vương</strong>! Lại Bộ
                      là nơi khảo xét công trạng và thăng giáng trăm quan. Hãy hoàn
                      thành chuỗi 5 công vụ dưới đây để tích lũy đủ Công Trạng bước
                      lên hàng Đại Thần!”
                    </p>
                    {(currentQuestStep === 1 || currentQuestStep === 4) && (
                      <button
                        type="button"
                        className="action-btn gold"
                        onClick={handleLaiBoQuestInteraction}
                      >
                        {currentQuestStep === 1
                          ? '✍️ Điểm Danh & Nhận Nhiệm Vụ Đầu Tiên (+60 Công Trạng)'
                          : '📜 Nộp Kết Quả Phá Án & Khảo Thí Cho Thượng Thư (+100 Công Trạng)'}
                      </button>
                    )}
                  </div>

                  {PALACE_QUEST_CHAIN.map((q) => {
                    const status = questStatuses[q.id];
                    return (
                      <div key={q.id} className="gp-list-item">
                        <div>
                          <div className="gp-item-title">
                            {status === 'completed'
                              ? '✅ '
                              : status === 'in_progress'
                                ? '🔶 '
                                : '🔒 '}
                            {q.title}
                          </div>
                          <div className="gp-item-sub">{q.description}</div>
                          <div className="gp-hint-pill">
                            🎯 Điều kiện: {q.requirementText} • Thưởng: +
                            {q.reward.merit} Công Trạng, +{q.reward.coins} Ngân Lượng
                          </div>
                        </div>
                        <div className="gp-item-right">
                          <span className="status-tag">
                            {status === 'completed'
                              ? 'Đã hoàn thành'
                              : status === 'in_progress'
                                ? 'Đang thực hiện'
                                : 'Chưa mở'}
                          </span>
                          {status === 'in_progress' && (
                            <button
                              type="button"
                              className="action-btn gold"
                              style={{ marginTop: 6 }}
                              onClick={() => {
                                closeInteraction();
                                navigateToLandmark(q.targetBuildingId);
                              }}
                            >
                              🚀 Đi tới {q.targetBuildingName}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'promotion' && (
                <div className="gp-section-grid">
                  <div className="gp-card">
                    <h3>🎓 Hồ Sơ Phẩm Cấp Hiện Tại</h3>
                    <div className="gp-info-box">
                      <div>
                        • Họ tên quan viên: <strong>Minh Vương</strong>
                      </div>
                      <div>
                        • Phẩm hàm hiện tại:{' '}
                        <strong className="gold-text">
                          {currentGrade.gradeCode} — {currentGrade.titleVi}
                        </strong>
                      </div>
                      <div>• Cơ quan trực thuộc: {currentGrade.department}</div>
                      <div>
                        • Điểm Công Trạng tích lũy:{' '}
                        <strong>{meritPoints} điểm</strong>
                      </div>
                    </div>

                    {nextGrade ? (
                      <div style={{ marginTop: 12 }}>
                        <h4>⬆️ Điều Kiện Thăng Lên: {nextGrade.gradeCode}</h4>
                        <div className="gp-info-box">
                          <div>
                            • Chức danh mới: <strong>{nextGrade.titleVi}</strong>
                          </div>
                          <div>
                            • Công Trạng yêu cầu:{' '}
                            <strong>
                              {meritPoints} / {nextGrade.requiredMerit} điểm
                            </strong>
                          </div>
                          <div>
                            • Bổng lộc thăng chức:{' '}
                            <strong>+{nextGrade.salaryCoins} Ngân Lượng</strong>
                          </div>
                          <div>
                            • Đặc quyền mở khóa: {nextGrade.privileges.join(' • ')}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="action-btn gold full-width"
                          style={{ marginTop: 10 }}
                          onClick={() => {
                            const res = submitPromotionApplication();
                            setPromoFeedback(res.message);
                          }}
                        >
                          📜 Nộp Hồ Sơ Xin Thăng Chức Lên {nextGrade.gradeCode}
                        </button>
                      </div>
                    ) : (
                      <div className="gp-banner-note" style={{ marginTop: 12 }}>
                        👑 Bạn đã đạt tới đỉnh cao quyền lực: Cửu Ngũ Chí Tôn!
                      </div>
                    )}

                    {promoFeedback && (
                      <div className="gp-feedback-banner" style={{ marginTop: 10 }}>
                        {promoFeedback}
                      </div>
                    )}
                  </div>

                  <div className="gp-card">
                    <h3>📜 Lịch Sử Bổ Nhiệm Quan Chức</h3>
                    <div className="gp-list-stack">
                      {appointmentHistory.map((rec) => (
                        <div key={rec.id} className="gp-mini-card">
                          <div className="gp-item-title">
                            {rec.officialName}: {rec.fromTitle} ➔{' '}
                            <span className="gold-text">{rec.toTitle}</span>
                          </div>
                          <div className="gp-item-sub">
                            {rec.timestamp} — {rec.note}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'merit' && (
                <div className="gp-list-stack">
                  <div className="gp-banner-note">
                    Bảng Vàng Ghi Nhận Công Trạng Cá Nhân (Tổng cộng:{' '}
                    <strong>{meritPoints} điểm Công Trạng</strong>):
                  </div>
                  {meritLogs.map((log) => (
                    <div key={log.id} className="gp-list-item">
                      <div>
                        <div className="gp-item-title">🎖️ {log.reason}</div>
                        <div className="gp-item-sub">{log.timestamp}</div>
                      </div>
                      <span className="status-tag">+{log.amount} Công Trạng</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'ranks' && (
                <div className="gp-list-stack">
                  {OFFICIAL_PROMOTION_LADDER.map((grade, idx) => (
                    <div key={grade.gradeId} className="gp-list-item">
                      <div>
                        <div className="gp-item-title">
                          {idx <= officialGradeIndex ? '✅ ' : '🔒 '}
                          {grade.gradeCode} —{' '}
                          <span className="gold-text">{grade.titleVi}</span>
                        </div>
                        <div className="gp-item-sub">
                          {grade.department} • Đặc quyền:{' '}
                          {grade.privileges.join(', ')}
                        </div>
                      </div>
                      <div className="gp-item-right">
                        <span className="status-tag">
                          Yêu cầu: {grade.requiredMerit} Công Trạng
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* D. HÌNH BỘ – ĐIỀU TRA & XÉT XỬ                                */}
          {/* ------------------------------------------------------------- */}
          {entity.buildingId === 'hinh_bo' && (
            <div>
              <div className="gp-tab-bar">
                <button
                  type="button"
                  className={`gp-tab-btn ${
                    activeTab === 'case_overview' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('case_overview')}
                >
                  ⚖️ Hồ Sơ Vụ Án ({CRIMINAL_CASES.length})
                </button>
                <button
                  type="button"
                  className={`gp-tab-btn ${activeTab === 'clues' ? 'active' : ''}`}
                  onClick={() => setActiveTab('clues')}
                >
                  🔍 Kiểm Tra Bằng Chứng & Lời Khai ({currentCase.clues.length})
                </button>
                <button
                  type="button"
                  className={`gp-tab-btn ${
                    activeTab === 'verdict' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('verdict')}
                >
                  🔨 Đưa Ra Kết Luận Xét Xử
                </button>
              </div>

              {/* Chọn vụ án */}
              <div className="gp-case-selector">
                {CRIMINAL_CASES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`gp-entity-chip ${
                      c.id === currentCase.id ? 'active' : ''
                    }`}
                    onClick={() => setActiveCaseId(c.id)}
                  >
                    {solvedCaseIds.includes(c.id) ? '✅ ' : '🕵️ '}
                    {c.code}: {c.title}
                  </button>
                ))}
              </div>

              {activeTab === 'case_overview' && (
                <div className="gp-card">
                  <div className="gp-item-header">
                    <h3>
                      {currentCase.code} — {currentCase.title}
                    </h3>
                    <span className="status-tag">
                      {solvedCaseIds.includes(currentCase.id)
                        ? 'Đã Phá Án ✓'
                        : currentCase.difficulty}
                    </span>
                  </div>
                  <p className="gp-text" style={{ marginTop: 8 }}>
                    {currentCase.summary}
                  </p>
                  <div className="gp-info-box">
                    <div>
                      • Hiện trường: <strong>{currentCase.incidentLocation}</strong>
                    </div>
                    <div>
                      • Phần thưởng phá án:{' '}
                      <strong>
                        +{currentCase.rewardMerit} Công Trạng, +
                        {currentCase.rewardCoins} Ngân Lượng
                      </strong>
                    </div>
                  </div>
                  <div className="gp-action-row">
                    <button
                      type="button"
                      className="action-btn gold"
                      onClick={() => setActiveTab('clues')}
                    >
                      🔍 Bắt Đầu Thu Thập Bằng Chứng & Lời Khai
                    </button>
                    <button
                      type="button"
                      className="action-btn"
                      onClick={() => setActiveTab('verdict')}
                    >
                      🔨 Chuyển Tới Bàn Phán Quyết
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'clues' && (
                <div className="gp-list-stack">
                  <div className="gp-banner-note">
                    Nhấn vào từng bằng chứng và lời khai NPC để thu thập manh mối
                    (+10 Công Trạng mỗi chứng cứ mới):
                  </div>
                  {currentCase.clues.map((clue) => {
                    const inspected = inspectedClueIds.includes(clue.id);
                    return (
                      <div key={clue.id} className="gp-card">
                        <div className="gp-item-header">
                          <span className="gp-item-title">🔎 {clue.title}</span>
                          <button
                            type="button"
                            className={`action-btn ${inspected ? 'active' : 'gold'}`}
                            onClick={() => inspectClue(clue.id)}
                          >
                            {inspected
                              ? '✓ Đã Thu Thập Chứng Cứ'
                              : 'Thu Thập & Đối Chiếu (+10 Công Trạng)'}
                          </button>
                        </div>
                        <div className="gp-item-sub">Nguồn: {clue.source}</div>
                        <p className="gp-text" style={{ marginTop: 6 }}>
                          {clue.content}
                        </p>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    className="action-btn gold full-width"
                    onClick={() => setActiveTab('verdict')}
                  >
                    🔨 Đã Nắm Rõ Chứng Cứ ➔ Đưa Ra Kết Luận Xét Xử
                  </button>
                </div>
              )}

              {activeTab === 'verdict' && (
                <div className="gp-list-stack">
                  <div className="gp-banner-note">
                    Dựa trên đối chiếu vết mực Chu Sa Đỏ và lời khai các nhân chứng,
                    hãy chọn kết luận xét xử chính xác cho{' '}
                    <strong>{currentCase.title}</strong>:
                  </div>
                  {currentCase.options.map((opt) => (
                    <div key={opt.id} className="gp-card">
                      <div className="gp-item-title">
                        ⚖️ Nghi phạm: {opt.suspectName}
                      </div>
                      <p className="gp-text">{opt.conclusionText}</p>
                      <button
                        type="button"
                        className="action-btn gold"
                        style={{ marginTop: 8 }}
                        onClick={() => submitCaseVerdict(currentCase.id, opt.id)}
                      >
                        🔨 Phán Quyết Chọn Kết Luận Này
                      </button>
                    </div>
                  ))}

                  {lastVerdictFeedback && (
                    <div
                      className={`gp-feedback-banner ${
                        lastVerdictFeedback.isCorrect ? 'success' : 'error'
                      }`}
                    >
                      <strong>
                        {lastVerdictFeedback.isCorrect
                          ? '🎉 PHÁ ÁN CHÍNH XÁC: '
                          : '⚠️ SUY LUẬN CHƯA ĐÚNG: '}
                      </strong>
                      {lastVerdictFeedback.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* E. HÀN LÂM VIỆN – HỌC TẬP & KHẢO THÍ                          */}
          {/* ------------------------------------------------------------- */}
          {entity.buildingId === 'han_lam_vien' && (
            <div>
              <div className="gp-tab-bar">
                <button
                  type="button"
                  className={`gp-tab-btn ${activeTab === 'exam' ? 'active' : ''}`}
                  onClick={() => setActiveTab('exam')}
                >
                  ✍️ Bàn Thi Khoa Cử (5 Câu Đếm Ngược)
                </button>
                <button
                  type="button"
                  className={`gp-tab-btn ${
                    activeTab === 'library' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('library')}
                >
                  📖 Thư Viện Ôn Tập
                </button>
                <button
                  type="button"
                  className={`gp-tab-btn ${
                    activeTab === 'leaderboard' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('leaderboard')}
                >
                  🏆 Bảng Vàng Kết Quả
                </button>
              </div>

              {activeTab === 'exam' && (
                <div>
                  {!examStarted ? (
                    <div className="gp-card">
                      <h3>🎓 Kỳ Thi Khảo Thí Hàn Lâm Viện</h3>
                      <p className="gp-text">
                        Chủ Khảo Chu Văn: “Bài thi gồm{' '}
                        <strong>5 câu hỏi trắc nghiệm</strong> về Điển Chế Lục Bộ,
                        Kiến Trúc Điện Thái Hòa và Tư Duy Logic. Mỗi câu có thời
                        gian suy nghĩ <strong>20 giây</strong>. Đạt từ{' '}
                        <strong>3/5 câu đúng</strong> sẽ đỗ kỳ thi và hoàn thành
                        Nhiệm vụ #3!”
                      </p>
                      <div className="gp-info-box">
                        <div>
                          • Điểm cao nhất của bạn: <strong>{bestExamScore} / 500</strong>
                        </div>
                        <div>
                          • Số lần đã dự thi: <strong>{examCompletedCount} lần</strong>
                        </div>
                      </div>
                      <div className="gp-action-row">
                        <button
                          type="button"
                          className="action-btn gold"
                          onClick={startImperialExam}
                        >
                          🖌️ Bắt Đầu Làm Bài Thi (5 Câu • 20s/câu)
                        </button>
                        <button
                          type="button"
                          className="action-btn"
                          onClick={() => setActiveTab('library')}
                        >
                          📖 Xem Tài Liệu Ôn Tập Trước Khi Thi
                        </button>
                      </div>
                    </div>
                  ) : !examFinished ? (
                    <div className="gp-card">
                      <div className="gp-item-header">
                        <span className="gp-item-title">
                          Câu {currentQIdx + 1} / {IMPERIAL_EXAM_QUESTIONS.length} •{' '}
                          {IMPERIAL_EXAM_QUESTIONS[currentQIdx].category}
                        </span>
                        <span className="gp-timer-pill">
                          ⏱️ Thời gian còn: <strong>{questionTimer}s</strong>
                        </span>
                      </div>

                      <p
                        className="gp-text"
                        style={{ fontSize: '0.96rem', margin: '12px 0' }}
                      >
                        <strong>{IMPERIAL_EXAM_QUESTIONS[currentQIdx].question}</strong>
                      </p>

                      <div className="gp-list-stack">
                        {IMPERIAL_EXAM_QUESTIONS[currentQIdx].options.map(
                          (opt, idx) => {
                            const isSelected = selectedOption === idx;
                            const isCorrect =
                              idx ===
                              IMPERIAL_EXAM_QUESTIONS[currentQIdx].correctIndex;
                            let btnClass = 'gp-quiz-option';
                            if (selectedOption !== null) {
                              if (isCorrect) btnClass += ' correct';
                              else if (isSelected) btnClass += ' wrong';
                            }

                            return (
                              <button
                                key={idx}
                                type="button"
                                className={btnClass}
                                onClick={() => handleAnswerExam(idx)}
                              >
                                <strong>{String.fromCharCode(65 + idx)}.</strong>{' '}
                                {opt}
                              </button>
                            );
                          }
                        )}
                      </div>

                      {selectedOption !== null && (
                        <div className="gp-feedback-banner" style={{ marginTop: 12 }}>
                          <div>
                            {selectedOption ===
                            IMPERIAL_EXAM_QUESTIONS[currentQIdx].correctIndex
                              ? '✅ Chính xác! (+100 điểm)'
                              : selectedOption === -1
                                ? '⏰ Hết thời gian trả lời câu này!'
                                : '❌ Chưa chính xác!'}
                          </div>
                          <div style={{ marginTop: 4 }}>
                            {IMPERIAL_EXAM_QUESTIONS[currentQIdx].explanation}
                          </div>
                          <button
                            type="button"
                            className="action-btn gold"
                            style={{ marginTop: 10 }}
                            onClick={handleNextExamQuestion}
                          >
                            {currentQIdx + 1 < IMPERIAL_EXAM_QUESTIONS.length
                              ? 'Câu Tiếp Theo ➔'
                              : '🏆 Nộp Bài & Xem Kết Quả Khoa Cử'}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="gp-card">
                      <h3>
                        🎉 Kết Quả Kỳ Thi Hàn Lâm: {correctTally} /{' '}
                        {IMPERIAL_EXAM_QUESTIONS.length} Câu Đúng ({correctTally * 100}{' '}
                        Điểm)
                      </h3>
                      <p className="gp-text">
                        {correctTally >= 3
                          ? 'Chúc mừng Tân Khoa Tiến Sĩ! Bạn đã vượt qua kỳ khảo thí Hàn Lâm Viện và được ghi tên lên Bảng Vàng!'
                          : 'Bạn chưa đạt mốc 3/5 câu đúng. Hãy đọc thêm tài liệu tại Tàng Thư Các và thử sức lại nhé!'}
                      </p>
                      <div className="gp-action-row">
                        <button
                          type="button"
                          className="action-btn gold"
                          onClick={() => setActiveTab('leaderboard')}
                        >
                          🏆 Xem Bảng Vàng Xếp Hạng
                        </button>
                        <button
                          type="button"
                          className="action-btn"
                          onClick={startImperialExam}
                        >
                          🔄 Thi Lại Kỳ Khảo Thí
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'library' && (
                <div className="gp-list-stack">
                  <div className="gp-banner-note">
                    Tàng Thư Các Hàn Lâm Viện – Đọc tài liệu dưới đây để nắm chắc
                    đáp án kỳ thi:
                  </div>
                  {HAN_LAM_STUDY_DOCS.map((doc) => (
                    <div key={doc.id} className="gp-card">
                      <div className="gp-item-title">
                        📚 {doc.title} ({doc.category})
                      </div>
                      <p className="gp-text">{doc.content}</p>
                      <div className="gp-hint-pill">💡 {doc.examHint}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'leaderboard' && (
                <div className="gp-list-stack">
                  <div className="gp-banner-note">
                    Bảng Vàng Khoa Cử Đại Nghiệp (Xếp hạng theo Điểm Số & Thời Gian):
                  </div>
                  {leaderboard.map((entry) => (
                    <div key={entry.rank} className="gp-list-item">
                      <div>
                        <div className="gp-item-title">
                          #{entry.rank} • {entry.scholarName} —{' '}
                          <span className="gold-text">{entry.title}</span>
                        </div>
                        <div className="gp-item-sub">
                          Thời gian hoàn thành: {entry.timeTakenSec} giây
                        </div>
                      </div>
                      <span className="status-tag">{entry.score} Điểm</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* F. NGỰ HOA VIÊN – GIAO LƯU & GIẢI TRÍ                         */}
          {/* ------------------------------------------------------------- */}
          {entity.buildingId === 'ngu_hoa_vien' && (
            <div>
              <div className="gp-tab-bar">
                <button
                  type="button"
                  className={`gp-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
                  onClick={() => setActiveTab('chat')}
                >
                  💬 Chat Gần & Biểu Cảm (Emote)
                </button>
                <button
                  type="button"
                  className={`gp-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
                  onClick={() => setActiveTab('events')}
                >
                  🌸 Ghế Đá Ngắm Cảnh & Yến Tiệc
                </button>
              </div>

              {activeTab === 'chat' && (
                <div className="gp-section-grid">
                  <div className="gp-card">
                    <h3>💬 Trò Chuyện Gần Tại Ngự Hoa Viên (Local Chat)</h3>
                    <div className="gp-chat-box">
                      {gardenChats.map((msg) => (
                        <div
                          key={msg.id}
                          className={`gp-chat-line ${msg.isPlayer ? 'self' : ''}`}
                        >
                          <span className="gp-chat-sender">
                            [{msg.rankTitle}] {msg.sender}:
                          </span>{' '}
                          <span>{msg.text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="gp-chat-input-row">
                      <input
                        type="text"
                        className="gp-input"
                        placeholder="Nhập lời trò chuyện cùng đồng liêu (hiển thị trên đầu nhân vật)..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && chatInput.trim()) {
                            sendLocalChat(chatInput);
                            setChatInput('');
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="action-btn gold"
                        onClick={() => {
                          if (!chatInput.trim()) return;
                          sendLocalChat(chatInput);
                          setChatInput('');
                        }}
                      >
                        Gửi
                      </button>
                    </div>
                  </div>

                  <div className="gp-card">
                    <h3>🎭 Biểu Cảm Nhân Vật (Emotes)</h3>
                    <p className="gp-text">
                      Chọn biểu cảm để hiển thị bong bóng hành động trên đầu nhân
                      vật 3D và giao lưu cùng các quan viên (+5 Công Trạng):
                    </p>
                    <div className="gp-list-stack">
                      {GARDEN_EMOTES.map((em) => (
                        <button
                          key={em.id}
                          type="button"
                          className="action-btn full-width"
                          style={{ textAlign: 'left' }}
                          onClick={() => triggerEmote(em.id)}
                        >
                          {em.icon} <strong>{em.label}</strong> — “{em.bubbleText}”
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'events' && (
                <div className="gp-card">
                  <h3>🌸 Thưởng Ngoạn Hồ Sen & Tổ Chức Hội Thơ Hoa Đào</h3>
                  <p className="gp-text">
                    Ngự Hoa Viên là khu vực thư giãn bên hồ sen Kim Thủy, cầu đỏ và
                    thủy đình lục giác. Bạn có thể ngồi nghỉ trên ghế đá cẩm thạch
                    hoặc mở tiệc chiêu đãi đồng liêu.
                  </p>
                  <div className="gp-action-row">
                    <button
                      type="button"
                      className="action-btn gold"
                      onClick={() => {
                        closeInteraction();
                        sitAtSpot('ngu_hoa_vien_stone_bench');
                      }}
                    >
                      🪑 Ngồi Nghỉ Tại Ghế Đá Bên Hồ Sen
                    </button>
                    <button
                      type="button"
                      className="action-btn active"
                      onClick={hostGardenBanquet}
                    >
                      🍵 Tổ Chức Yến Tiệc Thưởng Hoa (+30 Công Trạng)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* G. CỔNG CHÍNH – KHU VỰC TIẾP ĐÓN                              */}
          {/* ------------------------------------------------------------- */}
          {entity.buildingId === 'cong_chinh' && (
            <div>
              <div className="gp-tab-bar">
                <button
                  type="button"
                  className={`gp-tab-btn ${activeTab === 'guide' ? 'active' : ''}`}
                  onClick={() => setActiveTab('guide')}
                >
                  🛡️ Hướng Dẫn Người Chơi Mới
                </button>
                <button
                  type="button"
                  className={`gp-tab-btn ${
                    activeTab === 'directory' ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab('directory')}
                >
                  🗺️ Chỉ Đường 7 Công Trình Hoàng Cung
                </button>
              </div>

              {activeTab === 'guide' && (
                <div className="gp-list-stack">
                  <div className="gp-card highlight-card">
                    <h3>🛡️ Thống Lĩnh Thị Vệ – Trần Uy</h3>
                    <p className="gp-text">
                      “Chào mừng tân khoa quan viên tiến vào Ngọ Môn Quan! Hoàng
                      Cung Đại Nghiệp gồm 7 đại công trình. Hãy đọc kỹ cẩm nang
                      dưới đây và đến <strong>Lại Bộ</strong> nhận nhiệm vụ đầu tiên!”
                    </p>
                    <button
                      type="button"
                      className="action-btn gold"
                      onClick={() => {
                        closeInteraction();
                        navigateToLandmark('lai_bo');
                      }}
                    >
                      🚀 Dẫn Đường Tới Lại Bộ Ngay (Nhiệm Vụ #1)
                    </button>
                  </div>

                  {GATE_GUIDE_TIPS.map((tip, idx) => (
                    <div key={idx} className="gp-card">
                      <div className="gp-item-title">{tip.title}</div>
                      <p className="gp-text">{tip.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'directory' && (
                <div className="gp-list-stack">
                  <div className="gp-banner-note">
                    Bảng Cáo Thị Chỉ Đường – Nhấn vào bất kỳ công trình nào để di
                    chuyển nhanh tới đó:
                  </div>
                  {PALACE_LANDMARKS.map((lm) => (
                    <div key={lm.id} className="gp-list-item">
                      <div>
                        <div className="gp-item-title">
                          {lm.icon} {lm.name}
                        </div>
                        <div className="gp-item-sub">{lm.subtitle}</div>
                      </div>
                      <button
                        type="button"
                        className="action-btn gold"
                        onClick={() => {
                          closeInteraction();
                          if (lm.id === 'chinh_dien') {
                            setSceneMode('main_hall_interior');
                          } else {
                            navigateToLandmark(lm.id);
                          }
                        }}
                      >
                        Đi Tới {lm.name} ➔
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
