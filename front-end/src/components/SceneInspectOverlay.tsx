import React from 'react';
import {
  CAMERA_PRESETS,
  CameraViewPreset,
  useGameStore,
} from '../stores/useGameStore';
import { ASSET_MANIFEST } from '../game/assets/assetManifest';

export const SceneInspectOverlay: React.FC = () => {
  const cameraPreset = useGameStore((s) => s.cameraPreset);
  const setCameraPreset = useGameStore((s) => s.setCameraPreset);
  const showAssetModal = useGameStore((s) => s.showAssetModal);
  const setShowAssetModal = useGameStore((s) => s.setShowAssetModal);
  const showWireframe = useGameStore((s) => s.showWireframe);
  const toggleWireframe = useGameStore((s) => s.toggleWireframe);
  const lanternAnimationEnabled = useGameStore((s) => s.lanternAnimationEnabled);
  const toggleLanternAnimation = useGameStore((s) => s.toggleLanternAnimation);
  const metrics = useGameStore((s) => s.metrics);

  const presets = Object.values(CAMERA_PRESETS);

  return (
    <div className="overlay-container">
      {/* Header thương hiệu & Trạng thái Phase 1 */}
      <header className="top-bar">
        <div className="brand-badge">
          <span className="imperial-seal">ĐẠI NGHIỆP</span>
          <div className="brand-text">
            <h1>THÁI HÒA CHÍNH ĐIỆN</h1>
            <p>Phase 1: 3D Architecture, Instanced Props & Imperial Lighting</p>
          </div>
        </div>

        <div className="stats-bar">
          <div className="stat-pill">
            <span className="stat-label">FPS</span>
            <span className="stat-value">{metrics.fps}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">Draw Calls</span>
            <span className="stat-value">{metrics.drawCalls}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-label">Triangles</span>
            <span className="stat-value">{metrics.triangles.toLocaleString()}</span>
          </div>
          <button
            type="button"
            className={`action-btn ${showWireframe ? 'active' : ''}`}
            onClick={toggleWireframe}
          >
            {showWireframe ? 'Tắt Wireframe' : 'Xem Wireframe'}
          </button>
          <button
            type="button"
            className={`action-btn ${lanternAnimationEnabled ? 'active' : ''}`}
            onClick={toggleLanternAnimation}
          >
            {lanternAnimationEnabled ? 'Đèn Lồng: Động' : 'Đèn Lồng: Tĩnh'}
          </button>
          <button
            type="button"
            className="action-btn gold"
            onClick={() => setShowAssetModal(true)}
          >
            Danh Mục 3D Assets ({ASSET_MANIFEST.length})
          </button>
        </div>
      </header>

      {/* Thanh chọn góc nhìn kiểm tra bố cục Chính điện */}
      <aside className="camera-panel">
        <div className="panel-title">GÓC MÁY KIỂM TRA BỐ CỤC</div>
        <div className="preset-list">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`preset-btn ${cameraPreset === preset.id ? 'selected' : ''}`}
              onClick={() => setCameraPreset(preset.id as CameraViewPreset)}
            >
              <span className="preset-name">{preset.label}</span>
              <span className="preset-desc">{preset.description}</span>
            </button>
          ))}
        </div>
        <div className="controls-hint">
          <span>Chuột trái: Xoay góc nhìn</span>
          <span>Chuột phải: Di chuyển tâm</span>
          <span>Con lăn: Thu phóng (Zoom)</span>
        </div>
      </aside>

      {/* Modal báo cáo minh bạch trạng thái 3D Asset & đề xuất nguồn GLB chuẩn */}
      {showAssetModal && (
        <div className="modal-backdrop" onClick={() => setShowAssetModal(false)}>
          <div className="asset-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Quản Lý Tài Nguyên 3D (Asset Manifest – Phase 1)</h2>
                <p>
                  Tuân thủ mục 9 & 14: Không giả mạo file GLB. Các vật thể lặp lại đang dùng{' '}
                  <code>InstancedMesh</code> và sẵn sàng thay thế bằng file <code>.glb</code>.
                </p>
              </div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowAssetModal(false)}
              >
                Đóng
              </button>
            </div>

            <div className="asset-table-wrapper">
              <table className="asset-table">
                <thead>
                  <tr>
                    <th>Thành phần</th>
                    <th>Đường dẫn đích (.glb)</th>
                    <th>Trạng thái</th>
                    <th>Nguồn Asset đề xuất (License hợp lệ)</th>
                  </tr>
                </thead>
                <tbody>
                  {ASSET_MANIFEST.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                        <div className="asset-note">{item.notes}</div>
                      </td>
                      <td>
                        <code>{item.targetPath}</code>
                      </td>
                      <td>
                        <span className={`status-tag ${item.status}`}>
                          {item.status === 'placeholder_instanced'
                            ? 'Instanced Placeholder'
                            : 'Procedural Placeholder'}
                        </span>
                      </td>
                      <td>
                        {item.recommendedSources.map((src, idx) => (
                          <div key={idx} className="source-item">
                            <strong>{src.provider}:</strong> {src.suggestion}{' '}
                            <em>({src.license})</em>
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
