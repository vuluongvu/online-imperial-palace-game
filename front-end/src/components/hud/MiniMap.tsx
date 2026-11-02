import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useUiStore } from '../../stores/useUiStore';
import { PALACE_LANDMARKS } from '../../game/world/compoundLayout';

export const MiniMap: React.FC = () => {
  const sceneMode = useGameStore((s) => s.sceneMode);
  const playerPosition = useGameStore((s) => s.playerPosition);
  const activeLandmarkId = useGameStore((s) => s.activeLandmarkId);
  const openWindow = useUiStore((s) => s.openWindow);
  const miniMapOpen = useUiStore((s) => s.miniMapOpen);
  const toggleMiniMap = useUiStore((s) => s.toggleMiniMap);

  // Map world bounds to minimap coordinates
  // Compound map world coordinates roughly X: [-40, 40], Z: [-40, 48]
  const [px, , pz] = playerPosition;

  // Normalize world (-40..40, -42..48) to (0..100%)
  const normX = ((px + 42) / 84) * 100;
  const normY = ((pz + 44) / 92) * 100;

  const currentLandmark = PALACE_LANDMARKS.find((l) => l.id === activeLandmarkId);

  if (!miniMapOpen) {
    return (
      <div className="hud-minimap-collapsed">
        <button
          type="button"
          className="hud-minimap-toggle-pill"
          onClick={() => openWindow('map')}
          title="Mở Bản Đồ Toàn Cảnh Hoàng Cung (Phím M)"
        >
          <span className="minimap-pill-icon">🗺️</span>
          <span className="minimap-pill-text">
            {sceneMode === 'main_hall_interior'
              ? 'Thái Hòa Điện'
              : currentLandmark?.name ?? 'Bản Đồ [M]'}
          </span>
          <span
            className="minimap-radar-peek-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleMiniMap();
            }}
            title="Bật/Tắt Radar thu nhỏ"
          >
            🧭
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="hud-minimap-container">
      <div className="hud-minimap-header">
        <span className="minimap-header-title">🧭 Radar</span>
        <button
          type="button"
          className="minimap-close-btn"
          onClick={toggleMiniMap}
          title="Thu gọn Radar"
        >
          ✕
        </button>
      </div>
      <div
        className="hud-minimap-radar"
        onClick={() => openWindow('map')}
        title="Bản Đồ Thu Nhỏ (Nhấn để mở Bản Đồ Toàn Cảnh Phím M)"
      >
        {/* Radar background grid */}
        <div className="radar-grid-rings">
          <div className="radar-ring r1" />
          <div className="radar-ring r2" />
          <div className="radar-crosshair-h" />
          <div className="radar-crosshair-v" />
        </div>

        {/* Landmarks representation */}
        {sceneMode === 'compound_map' && (
          <div className="radar-landmarks-layer">
            {PALACE_LANDMARKS.map((lm) => {
              const lx = ((lm.position[0] + 42) / 84) * 100;
              const lz = ((lm.position[2] + 44) / 92) * 100;
              return (
                <div
                  key={lm.id}
                  className={`radar-landmark-dot ${lm.id === activeLandmarkId ? 'active' : ''}`}
                  style={{ left: `${lx}%`, top: `${lz}%` }}
                  title={lm.name}
                >
                  <span className="landmark-mini-icon">{lm.icon}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Player blip */}
        <div
          className="radar-player-blip"
          style={{
            left: `${Math.max(5, Math.min(95, normX))}%`,
            top: `${Math.max(5, Math.min(95, normY))}%`,
          }}
        >
          <div className="player-blip-arrow" />
        </div>

        {/* Compass Cardinal Points */}
        <span className="compass-n">B</span>
        <span className="compass-s">N</span>
        <span className="compass-w">T</span>
        <span className="compass-e">Đ</span>

        {/* Expand button */}
        <button
          type="button"
          className="minimap-expand-btn"
          onClick={(e) => {
            e.stopPropagation();
            openWindow('map');
          }}
          title="Mở toàn màn hình (Phím M)"
        >
          ⤢
        </button>
      </div>

      <div className="minimap-footer-name">
        <span className="minimap-zone-title">
          {sceneMode === 'main_hall_interior'
            ? '🏛️ Nội Điện Thái Hòa'
            : currentLandmark?.name ?? 'Hoàng Cung'}
        </span>
        <span className="minimap-coords">
          {Math.round(px)}, {Math.round(pz)}
        </span>
      </div>
    </div>
  );
};
