import React, { useEffect } from 'react';
import { useGameplayStore } from '../../stores/useGameplayStore';
import { useGameStore } from '../../stores/useGameStore';
import { useUiStore } from '../../stores/useUiStore';
import { COURT_CEREMONY_STAGES } from '../../data/palaceCourtCeremony';

export const CourtCeremonyOverlay: React.FC = () => {
  const courtCeremonyStage = useGameplayStore((s) => s.courtCeremonyStage);
  const activeInteractableId = useGameplayStore((s) => s.activeInteractableId);
  const startCourtCeremony = useGameplayStore((s) => s.startCourtCeremony);
  const advanceCourtCeremony = useGameplayStore((s) => s.advanceCourtCeremony);
  const cancelCourtCeremony = useGameplayStore((s) => s.cancelCourtCeremony);

  const sceneMode = useGameStore((s) => s.sceneMode);
  const isPhotoMode = useGameStore((s) => s.isPhotoMode);
  const showAssetModal = useGameStore((s) => s.showAssetModal);
  const setPreviewAnimOverride = useGameStore((s) => s.setPreviewAnimOverride);
  const activeWindow = useUiStore((s) => s.activeWindow);

  const isAnyModalOpen = Boolean(activeInteractableId || activeWindow || showAssetModal);

  // Lắng nghe phím K trong lúc diễn ra bước quỳ lạy triều bái
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (courtCeremonyStage === 'kowtow' && (e.code === 'KeyK' || e.code === 'KeyF')) {
        setPreviewAnimOverride('kneel');
        setTimeout(() => {
          advanceCourtCeremony();
        }, 1200);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [courtCeremonyStage, advanceCourtCeremony, setPreviewAnimOverride]);

  if (isPhotoMode || isAnyModalOpen) return null;

  // Nếu đang ở trong Nội Điện Thái Hòa nhưng chưa bắt đầu buổi lễ, hiện nút bắt đầu tiện lợi
  if (sceneMode === 'main_hall_interior' && courtCeremonyStage === 'idle') {
    return (
      <div className="court-ceremony-idle-trigger">
        <div className="ceremony-trigger-card">
          <div className="trigger-icon">👑</div>
          <div className="trigger-info">
            <div className="trigger-title">Đại Triều Thái Hòa Điện</div>
            <div className="trigger-sub">Trăm quan tề tựu, cử hành nghi lễ Tam Quỳ Cửu Khấu bái yết Thiên Tử</div>
          </div>
          <button
            type="button"
            className="ceremony-start-btn"
            onClick={startCourtCeremony}
          >
            👑 Khai Triều Thiết Triều
          </button>
        </div>
      </div>
    );
  }

  if (courtCeremonyStage === 'idle') return null;

  const currentInfo = COURT_CEREMONY_STAGES[courtCeremonyStage];

  const handleAction = () => {
    if (courtCeremonyStage === 'kowtow') {
      setPreviewAnimOverride('kneel');
    }
    advanceCourtCeremony();
  };

  return (
    <div
      className="court-ceremony-overlay-root"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className="court-ceremony-scroll-box"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Phần đầu bảng thánh chỉ nghi lễ */}
        <div className="ceremony-top-bar">
          <div className="ceremony-seal-badge">NGHI LỄ THIẾT TRIỀU</div>
          <div className="ceremony-step-counter">
            Bước {currentInfo.stepNumber} / 4 • {currentInfo.stageTitle}
          </div>
          <button
            type="button"
            className="ceremony-cancel-btn"
            onClick={cancelCourtCeremony}
            title="Dừng nghi lễ thiết triều"
          >
            ✕ Bãi Triều
          </button>
        </div>

        {/* Lời xướng của Chủ trì / Thánh chỉ Hoàng Đế */}
        <div className="ceremony-dialogue-box">
          <p className="ceremony-announcement">{currentInfo.heraldAnnounce}</p>
          {currentInfo.npcChoralShout && (
            <div className="ceremony-choral-shout">
              « {currentInfo.npcChoralShout} »
            </div>
          )}
        </div>

        {/* Nút hành động tương tác chính */}
        <div className="ceremony-action-bar">
          <button
            type="button"
            className="ceremony-primary-btn"
            onClick={handleAction}
          >
            {currentInfo.courtActionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
