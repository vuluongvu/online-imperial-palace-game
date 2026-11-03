import React, { useEffect, useState } from 'react';
import {
  CRIMINAL_CASES,
  GARDEN_EMOTES,
  IMPERIAL_EXAM_QUESTIONS,
  INTERACTABLE_ENTITIES,
  OFFICIAL_PROMOTION_LADDER,
  PALACE_QUEST_CHAIN,
} from '../data/palaceGameplayData';
import { useGameplayStore } from '../stores/useGameplayStore';
import { useGameStore } from '../stores/useGameStore';

export const BuildingGameplayModal: React.FC = () => {
  const activeInteractableId = useGameplayStore((s) => s.activeInteractableId);
  const interactionView = useGameplayStore((s) => s.interactionView);
  const closeInteraction = useGameplayStore((s) => s.closeInteraction);

  const meritPoints = useGameplayStore((s) => s.meritPoints);
  const silverCoins = useGameplayStore((s) => s.silverCoins);
  const officialGradeIndex = useGameplayStore((s) => s.officialGradeIndex);

  const currentQuestStep = useGameplayStore((s) => s.currentQuestStep);
  const handleLaiBoQuestInteraction = useGameplayStore(
    (s) => s.handleLaiBoQuestInteraction
  );

  // Thái Hòa Điện state
  const edicts = useGameplayStore((s) => s.edicts);
  const courtSessionCount = useGameplayStore((s) => s.courtSessionCount);
  const startCourtCeremony = useGameplayStore((s) => s.startCourtCeremony);

  // Ngự Thư Phòng state
  const memorials = useGameplayStore((s) => s.memorials);
  const reviewMemorial = useGameplayStore((s) => s.reviewMemorial);

  // Lại Bộ state
  const submitPromotionApplication = useGameplayStore(
    (s) => s.submitPromotionApplication
  );

  // Hình Bộ state
  const activeCaseId = useGameplayStore((s) => s.activeCaseId);
  const solvedCaseIds = useGameplayStore((s) => s.solvedCaseIds);
  const lastVerdictFeedback = useGameplayStore((s) => s.lastVerdictFeedback);
  const submitCaseVerdict = useGameplayStore((s) => s.submitCaseVerdict);

  // Hàn Lâm Viện state
  const submitExamResult = useGameplayStore((s) => s.submitExamResult);

  // Ngự Hoa Viên state
  const gardenChats = useGameplayStore((s) => s.gardenChats);
  const sendLocalChat = useGameplayStore((s) => s.sendLocalChat);
  const triggerEmote = useGameplayStore((s) => s.triggerEmote);
  const hostGardenBanquet = useGameplayStore((s) => s.hostGardenBanquet);

  // Game store actions
  const sitAtSpot = useGameStore((s) => s.sitAtSpot);
  const setSceneMode = useGameStore((s) => s.setSceneMode);
  const navigateToLandmark = useGameStore((s) => s.navigateToLandmark);

  // Local component states
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctTally, setCorrectTally] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(15);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  const [chatInputText, setChatInputText] = useState('');

  // Exam Countdown Timer
  useEffect(() => {
    if (!examStarted || examFinished || selectedOption !== null) return;
    const timer = window.setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          handleAnswerExam(-1);
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

  // Nếu là NPC và đang ở chế độ đối thoại, để NpcDialogue hiển thị
  if (entity.type === 'npc' && interactionView === 'dialogue') return null;

  const currentGrade = OFFICIAL_PROMOTION_LADDER[officialGradeIndex];
  const nextGrade = OFFICIAL_PROMOTION_LADDER[officialGradeIndex + 1] ?? null;
  const currentCase =
    CRIMINAL_CASES.find((c) => c.id === activeCaseId) ?? CRIMINAL_CASES[0];
  const isCaseSolved = solvedCaseIds.includes(currentCase.id);

  const activeQuest = PALACE_QUEST_CHAIN.find((q) => q.stepNumber === currentQuestStep);

  const startImperialExam = () => {
    setExamStarted(true);
    setExamFinished(false);
    setCurrentQIdx(0);
    setSelectedOption(null);
    setCorrectTally(0);
    setQuestionTimer(15);
    setTotalTimeSpent(0);
  };

  const handleAnswerExam = (optIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIdx);
    const q = IMPERIAL_EXAM_QUESTIONS[currentQIdx];
    if (optIdx === q.correctIndex) {
      setCorrectTally((prev) => prev + 1);
    }
  };

  const handleNextExamQuestion = () => {
    if (currentQIdx + 1 < IMPERIAL_EXAM_QUESTIONS.length) {
      setCurrentQIdx((i) => i + 1);
      setSelectedOption(null);
      setQuestionTimer(15);
    } else {
      setExamFinished(true);
      submitExamResult(
        correctTally,
        IMPERIAL_EXAM_QUESTIONS.length,
        Math.max(5, totalTimeSpent)
      );
    }
  };

  const handleSendChat = () => {
    if (!chatInputText.trim()) return;
    sendLocalChat(chatInputText);
    setChatInputText('');
  };

  const canPromote = nextGrade && meritPoints >= nextGrade.requiredMerit;

  return (
    <div className="modal-backdrop" onClick={closeInteraction}>
      <div className="gameplay-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* =============================================================== */}
        {/* HEADER CHUNG CUNG ĐÌNH                                          */}
        {/* =============================================================== */}
        <header className="gp-modal-header">
          <div>
            <div className="gp-modal-badge-row">
              <span className="gp-building-pill">
                {entity.type === 'npc' ? '👤 NPC Triều Đình' : '🏛️ Công Trình Hoàng Cung'}
              </span>
              <span className="gp-stat-pill">
                🎖️ Công Trạng: <strong>{meritPoints}</strong>
              </span>
              <span className="gp-stat-pill">
                🪙 Bạc: <strong>{silverCoins}</strong>
              </span>
              <span className="gp-stat-pill">
                👑 Phẩm Cấp: <strong>{currentGrade.gradeCode} ({currentGrade.titleVi})</strong>
              </span>
            </div>
            <h2 className="gp-modal-title">{entity.name}</h2>
            <p className="gp-modal-subtitle">{entity.title}</p>
          </div>

          <button
            type="button"
            className="close-btn"
            onClick={closeInteraction}
            title="Đóng giao diện (ESC)"
          >
            ✕ Đóng [ESC]
          </button>
        </header>

        {/* =============================================================== */}
        {/* NỘI DUNG 1 CHỨC NĂNG DUY NHẤT CHO TỪNG CÔNG TRÌNH                */}
        {/* =============================================================== */}
        <div className="gp-modal-body">
          {/* ------------------------------------------------------------- */}
          {/* 1. CỔNG CHÍNH (NGỌ MÔN QUAN) - HƯỚNG DẪN BAN ĐẦU              */}
          {/* ------------------------------------------------------------- */}
          {entity.buildingId === 'cong_chinh' && (
            <div className="gp-section-grid">
              <div className="gp-card">
                <h3>💂‍♂️ Hướng Dẫn Nhập Cung & Di Chuyển</h3>
                <p className="gp-text">
                  Chào mừng quan nhân bước qua Ngọ Môn Quan vào cấm thành Đại Nghiệp!
                  Mỗi bước đi trong hoàng cung đều gắn liền với con đường thăng tiến phẩm hàm.
                </p>
                <div className="gp-info-box">
                  <div>• <strong>WASD / Phím Mũi Tên:</strong> Di chuyển nhân vật trong cung</div>
                  <div>• <strong>Phím [E]:</strong> Tương tác với quan viên, bàn làm việc hoặc ngồi ghế</div>
                  <div>• <strong>Phím [ESC]:</strong> Đóng các bảng hội thoại và giao diện</div>
                  <div>• <strong>Cột Sáng Vàng (Waypoint):</strong> Chiếu thẳng vào mục tiêu nhiệm vụ tiếp theo</div>
                </div>

                <div className="gp-action-row">
                  <button
                    type="button"
                    className="action-btn gold"
                    onClick={() => {
                      closeInteraction();
                      navigateToLandmark('lai_bo');
                    }}
                  >
                    📍 Đến Lại Bộ Điểm Danh (Nhiệm Vụ 1)
                  </button>
                  <button
                    type="button"
                    className="action-btn"
                    onClick={() => {
                      closeInteraction();
                      navigateToLandmark('chinh_dien');
                    }}
                  >
                    👑 Đến Chính Điện Thái Hòa
                  </button>
                </div>
              </div>

              <div className="gp-card">
                <h3>📜 Nhiệm Vụ Khởi Đầu</h3>
                {activeQuest ? (
                  <div>
                    <h4 className="gold-text">{activeQuest.title}</h4>
                    <p className="gp-text">{activeQuest.description}</p>
                    <div className="gp-info-box">
                      <div>• Mục tiêu: <strong>{activeQuest.requirementText}</strong></div>
                      <div>• Địa điểm: <strong>{activeQuest.targetBuildingName}</strong></div>
                      <div>• Thưởng: <strong>+{activeQuest.reward.merit} Công trạng, +{activeQuest.reward.coins} Bạc</strong></div>
                    </div>
                  </div>
                ) : (
                  <p className="gp-text">Bạn đã hoàn thành xuất sắc chuỗi công vụ khởi nghiệp!</p>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* 2. THÁI HÒA ĐIỆN – THIẾT TRIỀU & SỰ KIỆN ĐẠI LỄ                */}
          {/* ------------------------------------------------------------- */}
          {entity.buildingId === 'chinh_dien' && (
            <div className="gp-section-grid">
              <div className="gp-card">
                <h3>👑 Đại Triều Thiết Triều</h3>
                <p className="gp-text">
                  Điện Thái Hòa là trung tâm quyền lực tối cao của Đại Nghiệp — nơi Hoàng Đế ngự trên
                  Cửu Long Bảo Tọa cùng bá quan văn võ ban bố quốc sách và đại điển triều đình.
                </p>

                <div className="gp-info-box">
                  <div>• Phiên thiết triều đã cử hành: <strong>{courtSessionCount} phiên</strong></div>
                  <div>• Phẩm hàm hiện tại: <strong>{currentGrade.gradeCode} ({currentGrade.titleVi})</strong></div>
                  <div>• Quyền hạn: <strong>{currentGrade.privileges.join(' • ')}</strong></div>
                </div>

                <div className="gp-action-row">
                  <button
                    type="button"
                    className="action-btn gold"
                    onClick={() => {
                      closeInteraction();
                      startCourtCeremony();
                    }}
                  >
                    👑 Khai Mở & Tham Dự Đại Triều Thiết Triều
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
                <h3>📜 Hoàng Bảng Chiếu Chỉ Triều Đình</h3>
                <div className="gp-list-stack">
                  {edicts.slice(0, 2).map((item) => (
                    <div key={item.id} className="gp-edict-card">
                      <div className="gp-edict-top">
                        <span className="gp-edict-title">👑 {item.title}</span>
                        <span className="gp-edict-badge">{item.category}</span>
                      </div>
                      <p className="gp-edict-body">"{item.content}"</p>
                      <div className="gp-edict-footer">
                        <span>{item.issuedBy}</span>
                        <span className="gp-edict-time">{item.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* 3. LẠI BỘ – NHẬN CÔNG VIỆC & THĂNG QUAN TIẾN CHỨC             */}
          {/* ------------------------------------------------------------- */}
          {entity.buildingId === 'lai_bo' && (
            <div className="gp-section-grid">
              <div className="gp-card highlight-card">
                <h3>👑 Bàn Bổ Nhiệm & Thăng Chức</h3>
                <p className="gp-text">
                  Lại Bộ chưởng quản quan lại và phẩm hàm. Khi tích lũy đủ Công Trạng từ việc thực thi
                  công vụ, hãy nộp đơn thăng phẩm để nhận chức tước và quan phục mới!
                </p>

                <div className="gp-info-box">
                  <div>• Phẩm hàm hiện tại: <strong>{currentGrade.gradeCode} – {currentGrade.titleVi}</strong></div>
                  <div>
                    • Mục tiêu tiếp theo:{' '}
                    <strong>
                      {nextGrade ? `${nextGrade.gradeCode} – ${nextGrade.titleVi}` : 'Đã đạt Chí Tôn Tối Cao'}
                    </strong>
                  </div>
                  <div>
                    • Yêu cầu Công Trạng:{' '}
                    <strong className={canPromote ? 'loyalty-high' : 'gold-text'}>
                      {meritPoints} / {nextGrade?.requiredMerit ?? 'MAX'}
                    </strong>
                  </div>
                </div>

                <div className="gp-action-row">
                  <button
                    type="button"
                    className={`action-btn ${canPromote ? 'gold' : ''} full-width`}
                    disabled={!canPromote}
                    onClick={submitPromotionApplication}
                    style={{ padding: '10px 16px', fontSize: '0.88rem' }}
                  >
                    {canPromote
                      ? `👑 NỘP ĐƠN THĂNG CHỨC LÊN ${nextGrade?.gradeCode}! (+Quan Phục Mới)`
                      : `⏳ Chưa Đủ Công Trạng (Còn thiếu ${Math.max(0, (nextGrade?.requiredMerit ?? 0) - meritPoints)} điểm)`}
                  </button>
                </div>
              </div>

              <div className="gp-card">
                <h3>📜 Công Vụ Triều Đình Hiện Tại</h3>
                {activeQuest ? (
                  <div>
                    <h4 className="gold-text">{activeQuest.title}</h4>
                    <p className="gp-text">{activeQuest.description}</p>
                    <div className="gp-info-box">
                      <div>• Yêu cầu: <strong>{activeQuest.requirementText}</strong></div>
                      <div>• Nơi thi hành: <strong>{activeQuest.targetBuildingName}</strong></div>
                      <div>• Phần thưởng: <strong>+{activeQuest.reward.merit} Công trạng, +{activeQuest.reward.coins} Bạc</strong></div>
                    </div>

                    {(currentQuestStep === 1 || currentQuestStep === 4) && (
                      <div className="gp-action-row">
                        <button
                          type="button"
                          className="action-btn gold"
                          onClick={() => {
                            handleLaiBoQuestInteraction();
                            closeInteraction();
                          }}
                        >
                          ✅ {currentQuestStep === 1 ? 'Điểm Danh Nhận Công Vụ (+60 Công Trạng)' : 'Phục Mệnh Nộp Kết Quả (+100 Công Trạng)'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="gp-text">Bạn đã hoàn tất mọi công vụ! Hãy tiếp tục tham dự thiết triều và khảo thí.</p>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* 4. HÌNH BỘ – GIẢI QUYẾT MẬT ÁN                                */}
          {/* ------------------------------------------------------------- */}
          {entity.buildingId === 'hinh_bo' && (
            <div className="gp-section-grid">
              <div className="gp-card">
                <h3>⚖️ {currentCase.title}</h3>
                <span className="gp-hint-pill">{currentCase.code}</span>
                <p className="gp-text" style={{ marginTop: '8px' }}>
                  {currentCase.summary}
                </p>

                <div className="gp-info-box">
                  <div>• Hiện trường: <strong>{currentCase.incidentLocation}</strong></div>
                  <div>• Bằng chứng 1: <strong>Vết mực Chu Sa Đỏ còn mới dính trên tráp gỗ khóa đồng</strong></div>
                  <div>• Khẩu cung thị vệ: <strong>Thấy Thư Lại Ngô Bình cầm nghiên mực Chu Sa vội vã rời thư phòng</strong></div>
                  <div>• Thưởng phá án: <strong>+{currentCase.rewardMerit} Công Trạng, +{currentCase.rewardCoins} Bạc</strong></div>
                </div>

                {isCaseSolved && (
                  <div className="gp-feedback-banner">
                    ✅ Vụ án đã được phá thành công! Công lý cấm thành được giữ vững.
                  </div>
                )}
                {lastVerdictFeedback && !isCaseSolved && (
                  <div className="gp-banner-note" style={{ color: '#fc8181' }}>
                    ❌ {lastVerdictFeedback.message}
                  </div>
                )}
              </div>

              <div className="gp-card highlight-card">
                <h3>🔍 Phán Quyết Kẻ Chủ Mưu (Chọn 1 Trong 3)</h3>
                <p className="gp-text">
                  Dựa vào dấu vết mực Chu Sa và lời khai thị vệ tuần đêm, hãy chỉ ra thủ phạm thực sự:
                </p>

                <div className="gp-list-stack">
                  {currentCase.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className="gp-quiz-option"
                      onClick={() => submitCaseVerdict(currentCase.id, opt.id)}
                    >
                      <strong>{opt.suspectName}</strong>: {opt.conclusionText}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* 5. HÀN LÂM VIỆN – KHẢO THÍ KHOA CỬ                           */}
          {/* ------------------------------------------------------------- */}
          {entity.buildingId === 'han_lam_vien' && (
            <div className="gp-section-grid">
              {!examStarted && !examFinished && (
                <div className="gp-card" style={{ gridColumn: '1 / -1' }}>
                  <h3>📖 Khoa Cử Hàn Lâm Viện (3 Câu Trắc Nghiệm)</h3>
                  <p className="gp-text">
                    Nơi tuyển chọn hiền tài cho quốc gia. Quan viên vượt qua kỳ khảo thí 3 câu hỏi
                    về điển chế và lịch sử cung đình sẽ được cấp bằng Tiến Sĩ và tích lũy công trạng thăng hàm!
                  </p>
                  <div className="gp-info-box">
                    <div>• Số câu hỏi: <strong>3 câu trắc nghiệm nhanh</strong></div>
                    <div>• Thời gian: <strong>15 giây / câu</strong></div>
                    <div>• Điều kiện đỗ: <strong>Đạt từ 2/3 câu đúng</strong></div>
                    <div>• Thưởng khi đỗ: <strong>+150 Công Trạng, +350 Bạc</strong> (Hoàn thành Nhiệm vụ 3)</div>
                  </div>
                  <div className="gp-action-row" style={{ marginTop: '14px' }}>
                    <button
                      type="button"
                      className="action-btn gold"
                      onClick={startImperialExam}
                      style={{ padding: '10px 24px', fontSize: '0.9rem' }}
                    >
                      📜 BẮT ĐẦU BÀI THI KHOA CỬ
                    </button>
                  </div>
                </div>
              )}

              {examStarted && !examFinished && (
                <div className="gp-card" style={{ gridColumn: '1 / -1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="gp-hint-pill">
                      Câu Hỏi {currentQIdx + 1} / {IMPERIAL_EXAM_QUESTIONS.length}
                    </span>
                    <span className="gp-timer-pill">
                      ⏳ Thời gian còn: {questionTimer}s
                    </span>
                  </div>

                  <h3 style={{ marginTop: '10px', fontSize: '1rem', color: '#ffd875' }}>
                    {IMPERIAL_EXAM_QUESTIONS[currentQIdx].question}
                  </h3>

                  <div className="gp-list-stack" style={{ marginTop: '12px' }}>
                    {IMPERIAL_EXAM_QUESTIONS[currentQIdx].options.map((opt, optIdx) => {
                      let btnClass = 'gp-quiz-option';
                      if (selectedOption !== null) {
                        if (optIdx === IMPERIAL_EXAM_QUESTIONS[currentQIdx].correctIndex) {
                          btnClass += ' correct';
                        } else if (optIdx === selectedOption) {
                          btnClass += ' wrong';
                        }
                      }
                      return (
                        <button
                          key={opt}
                          type="button"
                          className={btnClass}
                          disabled={selectedOption !== null}
                          onClick={() => handleAnswerExam(optIdx)}
                        >
                          <strong>{['A', 'B', 'C', 'D'][optIdx]}.</strong> {opt}
                        </button>
                      );
                    })}
                  </div>

                  {selectedOption !== null && (
                    <div style={{ marginTop: '10px' }}>
                      <p className="gp-text" style={{ fontStyle: 'italic', color: '#c6f6d5' }}>
                        💡 {IMPERIAL_EXAM_QUESTIONS[currentQIdx].explanation}
                      </p>
                      <button
                        type="button"
                        className="action-btn gold"
                        onClick={handleNextExamQuestion}
                      >
                        {currentQIdx + 1 < IMPERIAL_EXAM_QUESTIONS.length
                          ? 'Câu Tiếp Theo ➔'
                          : 'Xem Kết Quả Khảo Thí ➔'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {examFinished && (
                <div className="gp-card" style={{ gridColumn: '1 / -1' }}>
                  <h3>🎓 Kết Quả Khoa Cử Hàn Lâm Viện</h3>
                  <div className="gp-info-box">
                    <div>• Số câu đúng: <strong>{correctTally} / {IMPERIAL_EXAM_QUESTIONS.length} câu</strong></div>
                    <div>• Điểm số: <strong>{correctTally * 100} điểm</strong></div>
                    <div>
                      • Đánh giá:{' '}
                      <strong style={{ color: correctTally >= 2 ? '#68d391' : '#fc8181' }}>
                        {correctTally >= 2 ? 'TRÚNG TUYỂN TIẾN SĨ KHOA CỬ!' : 'CHƯA ĐẠT (Cần từ 2 câu đúng)'}
                      </strong>
                    </div>
                  </div>
                  <div className="gp-action-row" style={{ marginTop: '12px' }}>
                    <button
                      type="button"
                      className="action-btn gold"
                      onClick={startImperialExam}
                    >
                      🔄 Thi Lại Để Cải Thiện Điểm Số
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* 6. NGỰ THƯ PHÒNG – CHIẾU CHỈ & TẤU CHƯƠNG                      */}
          {/* ------------------------------------------------------------- */}
          {entity.buildingId === 'ngu_thu_phong' && (
            <div className="gp-section-grid">
              <div className="gp-card">
                <h3>📜 Chiếu Chỉ Quốc Gia</h3>
                <p className="gp-text">
                  Ngự Thư Phòng lưu trữ văn thư cơ mật và các bản chiếu chỉ điều hành triều cương.
                </p>
                <div className="gp-list-stack">
                  {edicts.slice(0, 2).map((item) => (
                    <div key={item.id} className="gp-edict-card">
                      <div className="gp-edict-top">
                        <span className="gp-edict-title">👑 {item.title}</span>
                      </div>
                      <p className="gp-edict-body">"{item.content}"</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="gp-card highlight-card">
                <h3>✍️ Phê Duyệt Tấu Chương Khẩn</h3>
                <p className="gp-text">
                  Bản tấu từ biên ải phía Bắc xin cấp 5,000 thạch lương thảo cứu trợ:
                </p>
                {memorials[0] && (
                  <div>
                    <div className="gp-info-box">
                      <div>• Người tấu: <strong>{memorials[0].senderName} ({memorials[0].senderTitle})</strong></div>
                      <div>• Nội dung: <strong>{memorials[0].summary}</strong></div>
                      <div>• Trạng thái: <strong>{memorials[0].status === 'pending' ? 'Chờ phê duyệt' : 'Đã xử lý'}</strong></div>
                    </div>

                    {memorials[0].status === 'pending' ? (
                      <div className="gp-action-row" style={{ marginTop: '10px' }}>
                        <button
                          type="button"
                          className="action-btn gold"
                          onClick={() => reviewMemorial(memorials[0].id, 'approved')}
                        >
                          ✅ CHUẨN TẤU (+50 Công Trạng, +80 Bạc)
                        </button>
                        <button
                          type="button"
                          className="action-btn"
                          onClick={() => reviewMemorial(memorials[0].id, 'rejected')}
                        >
                          ❌ BÁC TẤU
                        </button>
                      </div>
                    ) : (
                      <div className="gp-feedback-banner">
                        Đã xử lý bản tấu chương thành công!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* 7. NGỰ HOA VIÊN – GIAO LƯU & THƯ GIÃN                        */}
          {/* ------------------------------------------------------------- */}
          {entity.buildingId === 'ngu_hoa_vien' && (
            <div className="gp-section-grid">
              <div className="gp-card">
                <h3>🌸 Thưởng Trà & Biểu Cảm Cung Đình</h3>
                <p className="gp-text">
                  Không gian thư giãn bên hồ sen, nơi các quan viên đàm đạo thi ca và tương tác biểu cảm:
                </p>

                <div className="gp-action-row" style={{ marginBottom: '12px' }}>
                  <button
                    type="button"
                    className="action-btn gold"
                    onClick={hostGardenBanquet}
                  >
                    🍵 Khai Tiệc Thưởng Trà (+30 Công Trạng)
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                  {GARDEN_EMOTES.slice(0, 4).map((emote) => (
                    <button
                      key={emote.id}
                      type="button"
                      className="action-btn"
                      onClick={() => triggerEmote(emote.id)}
                    >
                      {emote.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="gp-card">
                <h3>💬 Trò Chuyện Cung Đình (Chat Gần)</h3>
                <div className="gp-chat-box">
                  {gardenChats.slice(-6).map((msg) => (
                    <div
                      key={msg.id}
                      className={`gp-chat-line ${msg.isPlayer ? 'self' : ''}`}
                    >
                      <span className="gp-chat-sender">[{msg.sender}]:</span> {msg.text}
                    </div>
                  ))}
                </div>

                <div className="gp-chat-input-row">
                  <input
                    type="text"
                    className="gp-input"
                    style={{ marginBottom: 0 }}
                    placeholder="Nhập lời đàm đạo cùng bá quan..."
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendChat();
                    }}
                  />
                  <button
                    type="button"
                    className="action-btn gold"
                    onClick={handleSendChat}
                  >
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
