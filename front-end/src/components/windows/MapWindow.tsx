import React from 'react';
import { GameWindow } from '../ui/GameWindow';
import { useGameStore } from '../../stores/useGameStore';
import { useUiStore } from '../../stores/useUiStore';
import { PALACE_LANDMARKS } from '../../game/world/compoundLayout';

export const MapWindow: React.FC = () => {
  const activeLandmarkId = useGameStore((s) => s.activeLandmarkId);
  const navigateToLandmark = useGameStore((s) => s.navigateToLandmark);
  const setSceneMode = useGameStore((s) => s.setSceneMode);
  const closeWindow = useUiStore((s) => s.closeWindow);

  const handleTeleport = (id: string) => {
    closeWindow();
    if (id === 'chinh_dien') {
      setSceneMode('main_hall_interior');
    } else {
      navigateToLandmark(id);
    }
  };

  return (
    <GameWindow
      title="Bản Đồ Quần Thể Hoàng Cung"
      subtitle="Tổng quan 7 đại kiến trúc và dịch chuyển nhanh"
      icon="🗺️"
      width={800}
    >
      <div className="map-window-layout">
        <div className="map-landmarks-grid">
          {PALACE_LANDMARKS.map((lm) => {
            const isCurrent = lm.id === activeLandmarkId;
            return (
              <div
                key={lm.id}
                className={`map-landmark-card ${isCurrent ? 'current' : ''}`}
              >
                <div className="landmark-card-top">
                  <span className="landmark-large-icon">{lm.icon}</span>
                  <div>
                    <h4 className="landmark-card-title">{lm.name}</h4>
                    <span className="landmark-card-coords">
                      Tọa độ: [{lm.position[0]}, {lm.position[2]}]
                    </span>
                  </div>
                </div>

                <p className="landmark-card-sub">{lm.subtitle}</p>

                <div className="landmark-card-actions">
                  <button
                    type="button"
                    className={`clean-btn ${isCurrent ? 'secondary' : 'primary'} full-width`}
                    onClick={() => handleTeleport(lm.id)}
                  >
                    {isCurrent ? 'Đang Ở Đây' : `Dịch Chuyển Tới ${lm.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GameWindow>
  );
};
