import React, { useState } from 'react';
import { GameWindow } from '../ui/GameWindow';
import { useGameplayStore } from '../../stores/useGameplayStore';
import { useGameStore } from '../../stores/useGameStore';
import { useUiStore } from '../../stores/useUiStore';
import { PALACE_QUEST_CHAIN } from '../../data/palaceGameplayData';

export const QuestJournalWindow: React.FC = () => {
  const currentQuestStep = useGameplayStore((s) => s.currentQuestStep);
  const questStatuses = useGameplayStore((s) => s.questStatuses);
  const openInteraction = useGameplayStore((s) => s.openInteraction);

  const navigateToLandmark = useGameStore((s) => s.navigateToLandmark);
  const setSceneMode = useGameStore((s) => s.setSceneMode);
  const closeWindow = useUiStore((s) => s.closeWindow);

  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed'>('all');

  const filteredQuests = PALACE_QUEST_CHAIN.filter((q) => {
    const status = questStatuses[q.id];
    if (filterTab === 'active') return status === 'in_progress';
    if (filterTab === 'completed') return status === 'completed';
    return true;
  });

  const handleNavigate = (targetBuildingId: string, interactableId: string) => {
    closeWindow();
    if (targetBuildingId === 'chinh_dien') {
      setSceneMode('main_hall_interior');
    } else {
      navigateToLandmark(targetBuildingId);
    }
    openInteraction(interactableId);
  };

  return (
    <GameWindow
      title="Nhật Ký Công Vụ Triều Đình"
      subtitle="Theo dõi tiến độ nhiệm vụ quan trường và bổng lộc khảo công"
      icon="📜"
      width={780}
    >
      <div className="quest-journal-layout">
        {/* Thanh lọc trạng thái */}
        <div className="quest-journal-tabs">
          {(
            [
              { id: 'all', label: 'Tất Cả Công Vụ' },
              { id: 'active', label: 'Đang Thực Hiện' },
              { id: 'completed', label: 'Đã Hoàn Thành' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`clean-filter-btn ${filterTab === tab.id ? 'active' : ''}`}
              onClick={() => setFilterTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Danh sách nhiệm vụ dạng thẻ thanh lịch */}
        <div className="quest-journal-list">
          {filteredQuests.length === 0 ? (
            <div className="quest-journal-empty">
              <span>📜</span>
              <p>Không có công vụ nào trong mục này.</p>
            </div>
          ) : (
            filteredQuests.map((quest) => {
              const status = questStatuses[quest.id];
              const isCurrent = quest.stepNumber === currentQuestStep;
              const isCompleted = status === 'completed';

              return (
                <div
                  key={quest.id}
                  className={`quest-journal-card ${
                    isCompleted ? 'completed' : isCurrent ? 'current' : 'locked'
                  }`}
                >
                  <div className="quest-card-left">
                    <div className="quest-card-header">
                      <span className={`quest-card-status-pill ${status}`}>
                        {isCompleted
                          ? '✓ Đã Hoàn Thành'
                          : isCurrent
                            ? '▶ Đang Thực Hiện'
                            : '🔒 Chưa Mở Khóa'}
                      </span>
                      <span className="quest-card-step">
                        Bước {quest.stepNumber} / {PALACE_QUEST_CHAIN.length}
                      </span>
                    </div>

                    <h3 className="quest-card-title">{quest.title}</h3>
                    <p className="quest-card-desc">{quest.description}</p>

                    <div className="quest-card-req">
                      <strong>Mục tiêu:</strong> {quest.requirementText}
                    </div>

                    <div className="quest-card-location">
                      📍 <strong>Địa điểm:</strong> {quest.targetBuildingName}
                    </div>
                  </div>

                  <div className="quest-card-right">
                    <div className="quest-rewards-box">
                      <div className="rewards-title">Bổng Lộc Ban Thưởng:</div>
                      <div className="reward-item">
                        🎖️ <strong>+{quest.reward.merit}</strong> Công Trạng
                      </div>
                      <div className="reward-item">
                        🪙 <strong>+{quest.reward.coins}</strong> Ngân Lượng
                      </div>
                      {quest.reward.itemTitle && (
                        <div className="reward-item item-reward">
                          🎁 {quest.reward.itemTitle}
                        </div>
                      )}
                    </div>

                    {isCurrent && (
                      <button
                        type="button"
                        className="clean-btn primary full-width"
                        style={{ marginTop: 8 }}
                        onClick={() =>
                          handleNavigate(
                            quest.targetBuildingId,
                            quest.targetInteractableId
                          )
                        }
                      >
                        🚀 Đi Đến Mục Tiêu
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </GameWindow>
  );
};
