import React, { useState } from 'react';
import { GameWindow } from '../ui/GameWindow';
import { useGameStore } from '../../stores/useGameStore';
import { useGameplayStore } from '../../stores/useGameplayStore';
import { OFFICIAL_PROMOTION_LADDER } from '../../data/palaceGameplayData';
import { OFFICIAL_HONOR_TITLES } from '../../data/uiContent';
import {
  OfficialRank,
  RANK_OUTFITS,
} from '../../game/characters/CharacterMaterials';
import { CharacterAnimationState } from '../../game/characters/CharacterAnimations';

export const CharacterWindow: React.FC = () => {
  const characterRank = useGameStore((s) => s.characterRank);
  const setCharacterRank = useGameStore((s) => s.setCharacterRank);
  const animationState = useGameStore((s) => s.animationState);
  const previewAnimOverride = useGameStore((s) => s.previewAnimOverride);
  const setPreviewAnimOverride = useGameStore((s) => s.setPreviewAnimOverride);
  const holdingJadeTablet = useGameStore((s) => s.holdingJadeTablet);
  const toggleJadeTablet = useGameStore((s) => s.toggleJadeTablet);

  const meritPoints = useGameplayStore((s) => s.meritPoints);
  const silverCoins = useGameplayStore((s) => s.silverCoins);
  const officialGradeIndex = useGameplayStore((s) => s.officialGradeIndex);
  const submitPromotionApplication = useGameplayStore(
    (s) => s.submitPromotionApplication
  );

  const [feedback, setFeedback] = useState<string | null>(null);

  const currentGrade = OFFICIAL_PROMOTION_LADDER[officialGradeIndex];
  const nextGrade = OFFICIAL_PROMOTION_LADDER[officialGradeIndex + 1];
  const ranks = Object.values(RANK_OUTFITS);
  const effectiveAnim = previewAnimOverride ?? animationState;

  const handlePromote = () => {
    const res = submitPromotionApplication();
    setFeedback(res.message);
  };

  return (
    <GameWindow
      title="Thông Tin Quan Viên"
      subtitle="Phẩm cấp, danh hiệu và trang phục triều chính"
      icon="👤"
      width={780}
    >
      <div className="char-window-grid">
        {/* Cột trái: Thông tin tổng quan phẩm hàm & bổng lộc */}
        <div className="char-window-left">
          <div className="char-profile-card">
            <div className="char-profile-avatar-circle">
              <span className="char-profile-crown">
                {characterRank === 'emperor' ? '👑' : '🎓'}
              </span>
            </div>
            <div className="char-profile-titles">
              <h3 className="char-profile-name">
                {characterRank === 'emperor' ? 'Minh Vương Đế' : 'Minh Vương'}
              </h3>
              <span className="char-profile-grade-tag">
                {currentGrade.gradeCode}
              </span>
            </div>
          </div>

          <div className="clean-spec-list">
            <div className="spec-item">
              <span className="spec-label">Chức Vụ:</span>
              <span className="spec-val highlight">{currentGrade.titleVi}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Nha Môn:</span>
              <span className="spec-val">{currentGrade.department}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Công Trạng:</span>
              <span className="spec-val">{meritPoints} Điểm</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Ngân Lượng:</span>
              <span className="spec-val">{silverCoins.toLocaleString()} Lượng</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Bổng Lộc Phẩm:</span>
              <span className="spec-val">{currentGrade.salaryCoins} Lượng / kỳ</span>
            </div>
          </div>

          {/* Khối thăng chức */}
          <div className="promotion-check-card">
            <div className="promo-check-title">Tiến Trình Thăng Chức</div>
            {nextGrade ? (
              <>
                <div className="promo-target-line">
                  Đích đến: <strong>{nextGrade.gradeCode}</strong> ({nextGrade.titleVi})
                </div>
                <div className="promo-bar">
                  <div
                    className="promo-fill"
                    style={{
                      width: `${Math.min(100, (meritPoints / nextGrade.requiredMerit) * 100)}%`,
                    }}
                  />
                </div>
                <div className="promo-text-sub">
                  Yêu cầu: {meritPoints} / {nextGrade.requiredMerit} Công trạng
                </div>
                <button
                  type="button"
                  className="clean-btn primary full-width"
                  style={{ marginTop: 8 }}
                  onClick={handlePromote}
                >
                  Nộp Đơn Thăng Chức
                </button>
              </>
            ) : (
              <div className="promo-maxed-text">
                Đã đạt đỉnh cao quyền lực Cửu Ngũ Chí Tôn!
              </div>
            )}
            {feedback && <div className="promo-feedback-note">{feedback}</div>}
          </div>
        </div>

        {/* Cột phải: Danh hiệu & Thử trang phục */}
        <div className="char-window-right">
          {/* Danh hiệu */}
          <div className="clean-section">
            <h4 className="clean-section-heading">Danh Hiệu Triều Đình</h4>
            <div className="honor-titles-grid">
              {OFFICIAL_HONOR_TITLES.map((title) => (
                <div
                  key={title.id}
                  className={`honor-title-badge ${title.unlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="honor-badge-name">
                    {title.unlocked ? '🎖️' : '🔒'} {title.name}
                  </div>
                  <div className="honor-badge-desc">{title.requirement}</div>
                  <div className="honor-badge-bonus">{title.bonus}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chọn trang phục phẩm hàm */}
          <div className="clean-section">
            <h4 className="clean-section-heading">Thử Nghiệm Lễ Phục 3D</h4>
            <div className="outfit-presets-row">
              {ranks.map((item) => (
                <button
                  key={item.rank}
                  type="button"
                  className={`outfit-chip-btn ${characterRank === item.rank ? 'active' : ''}`}
                  onClick={() => setCharacterRank(item.rank as OfficialRank)}
                >
                  <span
                    className="outfit-color-dot"
                    style={{ backgroundColor: item.primaryColor }}
                  />
                  <span>{item.titleVi}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hoạt ảnh & Phụ kiện */}
          <div className="clean-section">
            <h4 className="clean-section-heading">
              Động Tác Nhân Vật ({effectiveAnim.toUpperCase()})
            </h4>
            <div className="anim-chips-row">
              {(
                [
                  { id: null, label: 'Tự động (WASD)' },
                  { id: 'idle', label: 'Nghỉ (Idle)' },
                  { id: 'walk', label: 'Đi bộ' },
                  { id: 'run', label: 'Chạy nhanh' },
                  { id: 'sit', label: 'Ngồi chầu' },
                ] as { id: CharacterAnimationState | null; label: string }[]
              ).map((btn) => (
                <button
                  key={String(btn.id)}
                  type="button"
                  className={`clean-chip-btn ${previewAnimOverride === btn.id ? 'active' : ''}`}
                  onClick={() => setPreviewAnimOverride(btn.id)}
                >
                  {btn.label}
                </button>
              ))}
              <button
                type="button"
                className={`clean-chip-btn ${holdingJadeTablet ? 'active' : ''}`}
                onClick={toggleJadeTablet}
              >
                {holdingJadeTablet ? '✓ Cầm Ngọc Khuê' : 'Bỏ Ngọc Khuê'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </GameWindow>
  );
};
