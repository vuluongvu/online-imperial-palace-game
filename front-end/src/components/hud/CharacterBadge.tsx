import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useGameplayStore } from '../../stores/useGameplayStore';
import { useUiStore } from '../../stores/useUiStore';
import { OFFICIAL_PROMOTION_LADDER } from '../../data/palaceGameplayData';
import { RANK_OUTFITS } from '../../game/characters/CharacterMaterials';

export const CharacterBadge: React.FC = () => {
  const characterRank = useGameStore((s) => s.characterRank);
  const meritPoints = useGameplayStore((s) => s.meritPoints);
  const silverCoins = useGameplayStore((s) => s.silverCoins);
  const officialGradeIndex = useGameplayStore((s) => s.officialGradeIndex);
  const openWindow = useUiStore((s) => s.openWindow);

  const currentGrade = OFFICIAL_PROMOTION_LADDER[officialGradeIndex];
  const outfit = RANK_OUTFITS[characterRank];

  return (
    <div
      className="hud-character-badge"
      onClick={() => openWindow('character')}
      title="Nhấn để mở Bảng Nhân Vật & Phẩm Cấp (Phím C)"
    >
      <div className="char-badge-portrait">
        <div
          className="char-badge-avatar"
          style={{ borderColor: outfit.trimColor }}
        >
          {characterRank === 'emperor' ? (
            <span className="char-badge-emoji">👑</span>
          ) : (
            <svg
              viewBox="0 0 36 36"
              className="char-badge-vector"
              fill="none"
            >
              {/* Chibi Court Scholar Face */}
              <circle cx="18" cy="18" r="14" fill="#fde3be" />
              {/* Hair */}
              <path
                d="M8 17c0-6 4-11 10-11s10 5 10 11c-2-2-5-3-10-3s-8 1-10 3z"
                fill="#241a15"
              />
              {/* Imperial scholar cap */}
              <path
                d="M13 3h10v4h-10z"
                fill="#3a2518"
                stroke="#c69a48"
                strokeWidth="1"
              />
              <path
                d="M10 7h16v3H10z"
                fill="#8f1f18"
                stroke="#ffd875"
                strokeWidth="0.8"
              />
              {/* Eyes */}
              <ellipse cx="14" cy="18" rx="1.5" ry="2" fill="#241a15" />
              <ellipse cx="22" cy="18" rx="1.5" ry="2" fill="#241a15" />
              <circle cx="14.5" cy="17.2" r="0.6" fill="#fff" />
              <circle cx="22.5" cy="17.2" r="0.6" fill="#fff" />
              {/* Smile */}
              <path
                d="M16 22q2 1.8 4 0"
                stroke="#a6543b"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              {/* Cheeks */}
              <circle cx="11.5" cy="20" r="1.5" fill="#f7a89e" fillOpacity="0.6" />
              <circle cx="24.5" cy="20" r="1.5" fill="#f7a89e" fillOpacity="0.6" />
            </svg>
          )}
        </div>
        {/* Level badge positioned at bottom-left just like concept image */}
        <span className="char-badge-lv-pill">
          {characterRank === 'emperor' ? 'Vua' : 'Lv.1'}
        </span>
      </div>

      <div className="char-badge-info">
        <div className="char-badge-name">
          {characterRank === 'emperor' ? 'Minh Vương Đế' : 'Minh Vương'}
        </div>

        <div className="char-badge-rank-text">
          {currentGrade.titleVi} • {currentGrade.gradeCode}
        </div>

        <div className="char-badge-sub-row">
          <span className="char-coin-pill" title="Bổng Lộc Ngân Lượng">
            <span className="char-coin-icon">🪙</span>
            <span className="char-coin-val">{silverCoins.toLocaleString()}</span>
          </span>
          <span className="char-merit-pill" title="Điểm Công Trạng">
            <span className="char-merit-icon">🏵️</span>
            <span className="char-merit-val">{meritPoints}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
