import React from 'react';
import { useGameplayStore } from '../../stores/useGameplayStore';
import { useGameStore } from '../../stores/useGameStore';
import { useUiStore } from '../../stores/useUiStore';
import { PALACE_QUEST_CHAIN } from '../../data/palaceGameplayData';

export const QuestTracker: React.FC = () => {
  const currentQuestStep = useGameplayStore((s) => s.currentQuestStep);
  const openInteraction = useGameplayStore((s) => s.openInteraction);

  const navigateToLandmark = useGameStore((s) => s.navigateToLandmark);
  const setSceneMode = useGameStore((s) => s.setSceneMode);

  const collapsed = useUiStore((s) => s.questTrackerCollapsed);
  const toggleCollapse = useUiStore((s) => s.toggleQuestTracker);
  const openWindow = useUiStore((s) => s.openWindow);

  const currentQuest = PALACE_QUEST_CHAIN.find(
    (q) => q.stepNumber === currentQuestStep
  );
  const isAllComplete = currentQuestStep > PALACE_QUEST_CHAIN.length;

  const handleTrackClick = () => {
    if (!currentQuest) return;

    // Switch scene if quest is in main hall interior
    if (currentQuest.targetBuildingId === 'chinh_dien') {
      setSceneMode('compound_map');
    }

    navigateToLandmark(currentQuest.targetBuildingId);

    if (currentQuest.targetInteractableId) {
      setTimeout(() => {
        openInteraction(currentQuest.targetInteractableId);
      }, 500);
    }
  };

  return (
    <aside
      className={`hud-quest-tracker ${collapsed ? 'collapsed' : ''}`}
      aria-label="Bảng theo dõi nhiệm vụ"
    >
      <div className="quest-tracker-header" onClick={toggleCollapse}>
        <div className="quest-header-title-group">
          <span className="quest-diamond-icon">◆</span>
          <span className="quest-header-label">Nhiệm Vụ</span>
        </div>

        <div className="quest-header-actions">
          <button
            type="button"
            className="quest-tracker-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              openWindow('quests');
            }}
            title="Mở Nhật Ký Công Vụ (Phím J)"
          >
            📜
          </button>
          <button
            type="button"
            className="quest-tracker-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleCollapse();
            }}
            title={collapsed ? 'Mở rộng nhiệm vụ' : 'Thu gọn'}
          >
            {collapsed ? '▾' : '▴'}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="quest-tracker-body">
          {currentQuest ? (
            <div
              className="quest-tracker-active-item"
              onClick={handleTrackClick}
              title="Nhấn để tự động tìm đường đến mục tiêu"
            >
              <div className="quest-active-title">
                {currentQuest.title}
              </div>

              <div className="quest-active-req">
                {currentQuest.requirementText}
              </div>

              <div className="quest-active-footer">
                <span className="quest-target-pill">
                  📍 {currentQuest.targetBuildingName}
                </span>
                <span className="quest-reward-pill">
                  +{currentQuest.reward.merit} Công trạng
                </span>
              </div>
            </div>
          ) : isAllComplete ? (
            <div className="quest-tracker-completed-state">
              <span>💮</span>
              <span>Đã hoàn thành toàn bộ công vụ triều đình.</span>
            </div>
          ) : (
            <div className="quest-tracker-empty">
              <span>Đang chờ phân bổ công vụ mới...</span>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
