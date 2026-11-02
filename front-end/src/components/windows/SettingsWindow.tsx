import React from 'react';
import { GameWindow } from '../ui/GameWindow';
import { useGameStore, CAMERA_PRESETS, CameraViewPreset } from '../../stores/useGameStore';

export const SettingsWindow: React.FC = () => {
  const isPointerLocked = useGameStore((s) => s.isPointerLocked);
  const clickToLockEnabled = useGameStore((s) => s.clickToLockEnabled);
  const mouseSensitivity = useGameStore((s) => s.mouseSensitivity);
  const invertY = useGameStore((s) => s.invertY);
  const requestMouseLock = useGameStore((s) => s.requestMouseLock);
  const exitMouseLock = useGameStore((s) => s.exitMouseLock);
  const toggleClickToLock = useGameStore((s) => s.toggleClickToLock);
  const setMouseSensitivity = useGameStore((s) => s.setMouseSensitivity);
  const toggleInvertY = useGameStore((s) => s.toggleInvertY);

  const showWireframe = useGameStore((s) => s.showWireframe);
  const toggleWireframe = useGameStore((s) => s.toggleWireframe);
  const metrics = useGameStore((s) => s.metrics);

  const cameraPreset = useGameStore((s) => s.cameraPreset);
  const setCameraPreset = useGameStore((s) => s.setCameraPreset);
  const setCameraMode = useGameStore((s) => s.setCameraMode);

  const presets = Object.values(CAMERA_PRESETS);

  return (
    <GameWindow
      title="Cài Đặt Trò Chơi & Hiệu Năng"
      subtitle="Tùy chỉnh điều khiển chuột, góc máy camera và hiệu năng đồ họa"
      icon="⚙️"
      width={740}
    >
      <div className="settings-window-layout">
        {/* Điều khiển chuột */}
        <div className="clean-section">
          <h4 className="clean-section-heading">Điều Khiển & Khóa Chuột (Mouse Lock)</h4>
          <div className="settings-control-grid">
            <div className="setting-row">
              <div>
                <div className="setting-label">Chế Độ Khóa Chuột 360°</div>
                <div className="setting-desc">
                  Xoay camera tự do không cần giữ chuột trái (Phím tắt [L])
                </div>
              </div>
              <button
                type="button"
                className={`clean-btn ${isPointerLocked ? 'secondary' : 'primary'}`}
                onClick={() => {
                  if (isPointerLocked) exitMouseLock();
                  else requestMouseLock();
                }}
              >
                {isPointerLocked ? 'Đang Bật [ESC để tắt]' : 'Bật Khóa Chuột'}
              </button>
            </div>

            <div className="setting-row">
              <div>
                <div className="setting-label">Độ Nhạy Chuột: {mouseSensitivity.toFixed(1)}x</div>
                <div className="setting-desc">Tốc độ xoay camera khi di chuột</div>
              </div>
              <input
                type="range"
                min="0.3"
                max="2.5"
                step="0.1"
                className="clean-slider"
                value={mouseSensitivity}
                onChange={(e) => setMouseSensitivity(parseFloat(e.target.value))}
              />
            </div>

            <div className="setting-row">
              <div>
                <div className="setting-label">Click Trái Màn Hình 3D Để Khóa Chuột</div>
                <div className="setting-desc">Tự động khóa chuột khi click vào khung cảnh 3D</div>
              </div>
              <button
                type="button"
                className={`clean-toggle-btn ${clickToLockEnabled ? 'active' : ''}`}
                onClick={toggleClickToLock}
              >
                {clickToLockEnabled ? 'BẬT' : 'TẮT'}
              </button>
            </div>

            <div className="setting-row">
              <div>
                <div className="setting-label">Đảo Trục Dọc Y (Invert Pitch)</div>
                <div className="setting-desc">Đảo hướng nhìn lên/xuống theo chuột</div>
              </div>
              <button
                type="button"
                className={`clean-toggle-btn ${invertY ? 'active' : ''}`}
                onClick={toggleInvertY}
              >
                {invertY ? 'BẬT' : 'TẮT'}
              </button>
            </div>
          </div>
        </div>

        {/* Hiệu năng */}
        <div className="clean-section">
          <h4 className="clean-section-heading">Hiệu Năng Trình Duyệt</h4>
          <div className="perf-stats-banner">
            <div className="perf-stat-box">
              <span className="perf-num">{metrics.fps}</span>
              <span className="perf-unit">FPS</span>
            </div>
            <div className="perf-stat-box">
              <span className="perf-num">{metrics.drawCalls}</span>
              <span className="perf-unit">Draw Calls</span>
            </div>
            <div className="perf-stat-box">
              <span className="perf-num">{metrics.triangles.toLocaleString()}</span>
              <span className="perf-unit">Tam Giác (Tris)</span>
            </div>
            <div className="perf-stat-box">
              <button
                type="button"
                className={`clean-btn ${showWireframe ? 'primary' : 'secondary'}`}
                onClick={toggleWireframe}
              >
                {showWireframe ? 'Tắt Wireframe' : 'Bật Wireframe'}
              </button>
            </div>
          </div>
        </div>

        {/* Góc máy Preset */}
        <div className="clean-section">
          <h4 className="clean-section-heading">Góc Máy Camera Định Sẵn</h4>
          <div className="camera-presets-grid">
            <button
              type="button"
              className="clean-chip-btn"
              onClick={() => setCameraMode('follow')}
            >
              📹 Theo Sau Nhân Vật (Third-Person)
            </button>
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`clean-chip-btn ${cameraPreset === preset.id ? 'active' : ''}`}
                onClick={() => setCameraPreset(preset.id as CameraViewPreset)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameWindow>
  );
};
