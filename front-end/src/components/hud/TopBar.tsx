import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useGameplayStore } from '../../stores/useGameplayStore';
import { useUiStore } from '../../stores/useUiStore';

export const TopBar: React.FC = () => {
  const sceneMode = useGameStore((s) => s.sceneMode);
  const setSceneMode = useGameStore((s) => s.setSceneMode);
  const isPointerLocked = useGameStore((s) => s.isPointerLocked);
  const requestMouseLock = useGameStore((s) => s.requestMouseLock);
  const exitMouseLock = useGameStore((s) => s.exitMouseLock);

  const meritPoints = useGameplayStore((s) => s.meritPoints);
  const silverCoins = useGameplayStore((s) => s.silverCoins);

  const openWindow = useUiStore((s) => s.openWindow);

  const handlePointerLockToggle = () => {
    if (isPointerLocked) {
      exitMouseLock();
    } else {
      requestMouseLock();
    }
  };

  return (
    <div className="hud-top-bar">
      {/* 1. Nút chuyển đổi khu vực Cung Điện (Bản Đồ Ngoài Trời vs Thái Hòa Điện) */}
      <div className="hud-scene-segmented">
        <button
          type="button"
          className={`hud-segment-btn ${sceneMode === 'compound_map' ? 'active' : ''}`}
          onClick={() => setSceneMode('compound_map')}
          title="Chuyển sang Bản Đồ Cung Điện Ngoài Trời"
        >
          <span className="segment-icon">🗺️</span>
          <span className="segment-text">Bản Đồ Cung</span>
        </button>

        <button
          type="button"
          className={`hud-segment-btn ${sceneMode === 'main_hall_interior' ? 'active' : ''}`}
          onClick={() => setSceneMode('main_hall_interior')}
          title="Chuyển vào Nội Điện Thái Hòa"
        >
          <span className="segment-icon">🏛️</span>
          <span className="segment-text">Thái Hòa Điện</span>
        </button>
      </div>

      {/* 2. Nút Khóa Chuột xoay Camera 360° */}
      <button
        type="button"
        className={`hud-lock-pill ${isPointerLocked ? 'locked' : ''}`}
        onClick={handlePointerLockToggle}
        title="Khóa chuột xoay góc nhìn 360° (Phím L hoặc Nhấp đúp chuột)"
      >
        <span className="lock-icon">{isPointerLocked ? '🔒' : '🖱️'}</span>
        <span className="lock-label">
          {isPointerLocked ? 'Khóa Chuột' : 'Xoay Chuột [L]'}
        </span>
      </button>

      {/* 3. Khối tiền tệ & tiện ích góc trên bên phải giống hệt ảnh concept */}
      <div className="hud-top-right-group">
        <div
          className="top-currency-pill gold"
          onClick={() => openWindow('inventory')}
          title="Ngân Lượng bổng lộc (Nhấn để mở túi đồ)"
        >
          <span className="top-pill-icon">🪙</span>
          <span className="top-pill-value">{silverCoins.toLocaleString()}</span>
        </div>

        <div
          className="top-currency-pill merit"
          onClick={() => openWindow('character')}
          title="Công Trạng tích lũy (Nhấn để xem phẩm cấp)"
        >
          <span className="top-pill-icon">🏵️</span>
          <span className="top-pill-value">{meritPoints}</span>
        </div>

        <button
          type="button"
          className="top-icon-circle-btn"
          onClick={() => openWindow('social')}
          title="Hòm Thư & Vấn An Quan Lại (Phím O)"
        >
          <span className="btn-icon">✉️</span>
        </button>

        <button
          type="button"
          className="top-icon-circle-btn"
          onClick={() => openWindow('settings')}
          title="Cài Đặt Hệ Thống & Góc Nhìn (Phím ESC)"
        >
          <span className="btn-icon">⚙️</span>
        </button>
      </div>
    </div>
  );
};
