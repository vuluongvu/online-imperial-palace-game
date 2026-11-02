import React, { useState } from 'react';
import {
  CAMERA_PRESETS,
  CameraViewPreset,
  InteriorRoomKey,
  SEATING_SPOTS,
  useGameStore,
} from '../stores/useGameStore';
import { ASSET_MANIFEST } from '../game/assets/assetManifest';
import {
  OfficialRank,
  RANK_OUTFITS,
} from '../game/characters/CharacterMaterials';
import { CharacterAnimationState } from '../game/characters/CharacterAnimations';
import { PALACE_LANDMARKS } from '../game/world/compoundLayout';

const INTERIOR_ROOM_TABS: {
  key: InteriorRoomKey;
  label: string;
  subtitle: string;
}[] = [
  {
    key: 'main_hall',
    label: '🏛️ Chính Điện Thái Hòa',
    subtitle: 'Long Ngai, Bửu Tán, Vì Kèo Chồng Rường & 12 Án Thư Bá Quan',
  },
  {
    key: 'corridors',
    label: '🚪 Hành Lang Đông – Tây',
    subtitle: 'Trường lang gỗ đỏ, lan can cung đình & hệ cửa gỗ liên thông',
  },
  {
    key: 'ta_vu',
    label: '📜 Tả Vu (Gian Chờ Quan)',
    subtitle: 'Án thư trực phòng, Trường kỷ trà đạo, Tủ điển tịch & Quan viên chờ triều',
  },
  {
    key: 'huu_vu',
    label: '🍵 Hữu Vu (Phòng Tiếp Khách)',
    subtitle: 'Sập gụ tủ chè, Ghế Thái Sư, Lư trầm đồng & Đôi lục bình Pháp Lam',
  },
  {
    key: 'hau_sanh',
    label: '⛩️ Hậu Sảnh (Lối Ra Sau)',
    subtitle: 'Ngự Án Hậu Sảnh Cần Chánh & Cổng Tam Quan Hậu Điện',
  },
];

export const SceneInspectOverlay: React.FC = () => {
  const sceneMode = useGameStore((s) => s.sceneMode);
  const setSceneMode = useGameStore((s) => s.setSceneMode);
  const activeLandmarkId = useGameStore((s) => s.activeLandmarkId);
  const navigateToLandmark = useGameStore((s) => s.navigateToLandmark);
  const activeInteriorRoom = useGameStore((s) => s.activeInteriorRoom);
  const navigateToInteriorRoom = useGameStore((s) => s.navigateToInteriorRoom);

  const cameraMode = useGameStore((s) => s.cameraMode);
  const cameraPreset = useGameStore((s) => s.cameraPreset);
  const setCameraPreset = useGameStore((s) => s.setCameraPreset);
  const setCameraMode = useGameStore((s) => s.setCameraMode);

  const characterRank = useGameStore((s) => s.characterRank);
  const setCharacterRank = useGameStore((s) => s.setCharacterRank);
  const animationState = useGameStore((s) => s.animationState);
  const previewAnimOverride = useGameStore((s) => s.previewAnimOverride);
  const setPreviewAnimOverride = useGameStore((s) => s.setPreviewAnimOverride);
  const holdingJadeTablet = useGameStore((s) => s.holdingJadeTablet);
  const toggleJadeTablet = useGameStore((s) => s.toggleJadeTablet);
  const setVirtualInput = useGameStore((s) => s.setVirtualInput);

  const seatedSpotId = useGameStore((s) => s.seatedSpotId);
  const nearbySeatId = useGameStore((s) => s.nearbySeatId);
  const sitAtSpot = useGameStore((s) => s.sitAtSpot);
  const standUp = useGameStore((s) => s.standUp);
  const laiBoQuestCompleted = useGameStore((s) => s.laiBoQuestCompleted);

  const showInspectorDrawer = useGameStore((s) => s.showInspectorDrawer);
  const toggleInspectorDrawer = useGameStore((s) => s.toggleInspectorDrawer);
  const showAssetModal = useGameStore((s) => s.showAssetModal);
  const setShowAssetModal = useGameStore((s) => s.setShowAssetModal);
  const showWireframe = useGameStore((s) => s.showWireframe);
  const toggleWireframe = useGameStore((s) => s.toggleWireframe);
  const metrics = useGameStore((s) => s.metrics);

  const [activeBottomDrawer, setActiveBottomDrawer] = useState<
    'character' | 'landmarks' | null
  >(null);

  const presets = Object.values(CAMERA_PRESETS);
  const ranks = Object.values(RANK_OUTFITS);
  const currentOutfit = RANK_OUTFITS[characterRank];
  const effectiveAnim = previewAnimOverride ?? animationState;

  const currentSeatedSpot = SEATING_SPOTS.find((s) => s.id === seatedSpotId);
  const currentNearbySpot = SEATING_SPOTS.find((s) => s.id === nearbySeatId);

  return (
    <div className="mmorpg-hud-root">
      {/* ================================================================= */}
      {/* 1. TOP BAR: AVATAR NHÂN VẬT (TRÁI) & TIỀN TỆ / CÀI ĐẶT (PHẢI)     */}
      {/* ================================================================= */}
      <header className="hud-top-row">
        {/* Khung Avatar Nhân Vật góc trên bên trái (Giống ảnh mẫu) */}
        <div
          className="hud-avatar-card"
          onClick={() =>
            setActiveBottomDrawer(
              activeBottomDrawer === 'character' ? null : 'character'
            )
          }
          title="Nhấn để đổi Phẩm cấp Vua / Đại Thần / Quan Viên"
        >
          <div className="avatar-portrait-ring">
            <div
              className="avatar-chibi-head"
              style={{
                borderColor: currentOutfit.trimColor,
                background:
                  characterRank === 'emperor'
                    ? 'radial-gradient(circle at 50% 35%, #ffe4c4, #d99b26)'
                    : 'radial-gradient(circle at 50% 35%, #ffe4c4, #5c3a21)',
              }}
            >
              <span className="avatar-crown-emoji">
                {characterRank === 'emperor' ? '👑' : '🎓'}
              </span>
            </div>
            <span className="avatar-lv-badge">
              {characterRank === 'emperor' ? 'Thiên Tử' : 'Lv.1'}
            </span>
          </div>

          <div className="avatar-info-col">
            <div className="avatar-name">
              {characterRank === 'emperor' ? 'Minh Vương Đế' : 'Minh Vương'}
            </div>
            <div className="avatar-rank-title">
              {characterRank === 'emperor'
                ? 'Cửu Ngũ Chí Tôn • Hoàng Đế'
                : characterRank === 'minister'
                  ? 'Thượng Thư • Nhất phẩm'
                  : characterRank === 'mid_official'
                    ? 'Lang Trung • Ngũ phẩm'
                    : 'Chủ sự • Cửu phẩm'}
            </div>
            <div className="avatar-wealth-row">
              <span className="coin-dot">🪙</span>
              <span>{characterRank === 'emperor' ? '99,999' : '0'}</span>
            </div>
          </div>
        </div>

        {/* Nút chuyển đổi nhanh giữa Bản Đồ Hoàng Cung & Nội Điện Thái Hòa */}
        <div className="hud-zone-switcher">
          <button
            type="button"
            className={`zone-tab-btn ${sceneMode === 'compound_map' ? 'active' : ''}`}
            onClick={() => setSceneMode('compound_map')}
          >
            🗺️ Toàn Cảnh Hoàng Cung (Map)
          </button>
          <button
            type="button"
            className={`zone-tab-btn ${
              sceneMode === 'main_hall_interior' ? 'active' : ''
            }`}
            onClick={() => setSceneMode('main_hall_interior')}
          >
            🏛️ Nội Điện Thái Hòa & Long Ngai
          </button>
        </div>

        {/* Thanh Tiền Tệ & Hệ thống góc trên bên phải */}
        <div className="hud-top-right">
          <div className="currency-pill">
            <span className="currency-icon">🪙</span>
            <span className="currency-val">1000</span>
          </div>
          <div className="currency-pill">
            <span className="currency-icon">🏵️</span>
            <span className="currency-val">0</span>
          </div>

          <button
            type="button"
            className="hud-icon-circle"
            onClick={() => setShowAssetModal(true)}
            title="Danh mục 3D Assets"
          >
            📜
          </button>
          <button
            type="button"
            className={`hud-icon-circle ${showInspectorDrawer ? 'active' : ''}`}
            onClick={toggleInspectorDrawer}
            title="Bật/Tắt bảng Góc Máy & FPS"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* ================================================================= */}
      {/* 2. BẢNG NHIỆM VỤ & ĐIỀU HƯỚNG CÁC GIAN THÁI HÒA ĐIỆN              */}
      {/* ================================================================= */}
      <aside className="hud-quest-card">
        <div className="quest-header">
          <span className="quest-diamond">✦</span>
          <span className="quest-header-title">
            {sceneMode === 'main_hall_interior'
              ? 'Khu Vực Thái Hòa Điện'
              : 'Nhiệm Vụ'}
          </span>
        </div>
        <div className="quest-body">
          {sceneMode === 'main_hall_interior' ? (
            <>
              <div className="quest-main-name">Các Gian & Hành Lang Liên Thông</div>
              {INTERIOR_ROOM_TABS.map((room) => (
                <div
                  key={room.key}
                  className={`quest-step-item ${
                    activeInteriorRoom === room.key ? 'done' : ''
                  }`}
                  onClick={() => navigateToInteriorRoom(room.key)}
                  title={room.subtitle}
                >
                  • {room.label}
                </div>
              ))}
              <div
                className={`quest-step-item ${
                  seatedSpotId === 'imperial_throne' ? 'done' : ''
                }`}
                onClick={() => sitAtSpot('imperial_throne')}
                title="Nhấn để Ngự lên Long Ngai"
              >
                • 👑 Ngự lên Long Ngai ({seatedSpotId === 'imperial_throne' ? '1/1' : '0/1'})
              </div>
            </>
          ) : (
            <>
              <div className="quest-main-name">Nhiệm vụ nhập môn</div>
              <div
                className={`quest-step-item ${laiBoQuestCompleted ? 'done' : ''}`}
                onClick={() => navigateToLandmark('lai_bo')}
                title="Nhấn để di chuyển đến Lại Bộ"
              >
                • Đến Lại Bộ nhận nhiệm vụ kiểm tra hồ sơ (
                {laiBoQuestCompleted ? '1/1' : '0/1'})
              </div>
              <div
                className={`quest-step-item ${
                  seatedSpotId === 'imperial_throne' ? 'done' : ''
                }`}
                onClick={() => sitAtSpot('imperial_throne')}
                title="Nhấn để vào Chính Điện và Ngự lên Long Ngai"
              >
                • Vào Chính Điện ngự lên Long Ngai (
                {seatedSpotId === 'imperial_throne' ? '1/1' : '0/1'})
              </div>
            </>
          )}
        </div>
      </aside>

      {/* ================================================================= */}
      {/* 3. THÔNG BÁO TƯƠNG TÁC NGỰ LONG NGAI / VÀO ĐIỆN NỔI GIỮA MÀN HÌNH */}
      {/* ================================================================= */}
      <div className="center-interact-banner">
        {sceneMode === 'main_hall_interior' && currentSeatedSpot ? (
          <div className="interact-toast seated">
            <span>
              Đang ngự tại: <strong>{currentSeatedSpot.label}</strong>
            </span>
            <button type="button" className="toast-btn" onClick={standUp}>
              Đứng Dậy [Phím F / Space / WASD]
            </button>
          </div>
        ) : sceneMode === 'main_hall_interior' && currentNearbySpot ? (
          <div className="interact-toast nearby">
            <span>
              Gần vị trí: <strong>{currentNearbySpot.label}</strong>
            </span>
            <button
              type="button"
              className="toast-btn"
              onClick={() => sitAtSpot(currentNearbySpot.id)}
            >
              Ngồi Xuống [Phím F / E]
            </button>
          </div>
        ) : null}
      </div>

      {/* ================================================================= */}
      {/* 4. DRAWER TÙY CHỈNH NHÂN VẬT / KHU VỰC / CAMERA (KHI MỞ)          */}
      {/* ================================================================= */}
      {activeBottomDrawer === 'character' && (
        <div className="floating-drawer left-drawer">
          <div className="panel-title">
            <span>NHÂN VẬT CHIBI & PHẨM CẤP</span>
            <button
              type="button"
              className="drawer-close"
              onClick={() => setActiveBottomDrawer(null)}
            >
              ✕
            </button>
          </div>

          <div className="throne-actions-box">
            {seatedSpotId ? (
              <button
                type="button"
                className="action-btn gold full-width"
                onClick={standUp}
              >
                Đứng Dậy Khỏi {currentSeatedSpot?.label ?? 'Ghế'} (Phím F)
              </button>
            ) : (
              <div className="seat-btn-grid">
                <button
                  type="button"
                  className="action-btn gold"
                  onClick={() => sitAtSpot('imperial_throne')}
                >
                  👑 Ngự Long Ngai
                </button>
                <button
                  type="button"
                  className="action-btn active"
                  onClick={() => sitAtSpot(nearbySeatId ?? 'official_chair_0')}
                >
                  🪑 Ngồi Ghế Quan
                </button>
              </div>
            )}
          </div>

          <div className="rank-list">
            {ranks.map((item) => (
              <button
                key={item.rank}
                type="button"
                className={`preset-btn ${characterRank === item.rank ? 'selected' : ''}`}
                onClick={() => setCharacterRank(item.rank as OfficialRank)}
              >
                <div className="rank-header-row">
                  <span
                    className="color-dot"
                    style={{ backgroundColor: item.primaryColor }}
                  />
                  <span className="preset-name">{item.titleVi}</span>
                </div>
                <span className="preset-desc">{item.subtitleVi}</span>
              </button>
            ))}
          </div>

          <div className="sub-section-title">HOẠT ẢNH ({effectiveAnim.toUpperCase()})</div>
          <div className="anim-btn-group">
            {(
              [
                { id: null, label: 'Theo WASD' },
                { id: 'idle', label: 'Idle' },
                { id: 'walk', label: 'Walk' },
                { id: 'run', label: 'Run' },
                { id: 'sit', label: 'Sit (Ngồi)' },
              ] as { id: CharacterAnimationState | null; label: string }[]
            ).map((btn) => (
              <button
                key={String(btn.id)}
                type="button"
                className={`mini-btn ${previewAnimOverride === btn.id ? 'active' : ''}`}
                onClick={() => setPreviewAnimOverride(btn.id)}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="accessory-row">
            <button
              type="button"
              className={`action-btn full-width ${holdingJadeTablet ? 'active' : ''}`}
              onClick={toggleJadeTablet}
            >
              {holdingJadeTablet
                ? 'Đang cầm: Ngọc Khuê / Hốt Triều'
                : 'Bỏ cầm Ngọc Khuê / Hốt Triều'}
            </button>
          </div>
        </div>
      )}

      {activeBottomDrawer === 'landmarks' && (
        <div className="floating-drawer right-drawer">
          <div className="panel-title">
            <span>CÁC GIAN THÁI HÒA ĐIỆN & BẢN ĐỒ HOÀNG CUNG</span>
            <button
              type="button"
              className="drawer-close"
              onClick={() => setActiveBottomDrawer(null)}
            >
              ✕
            </button>
          </div>
          <div className="sub-section-title">NỘI ĐIỆN THÁI HÒA & CÁC GIAN PHỤ</div>
          <div className="preset-list" style={{ marginBottom: 10 }}>
            {INTERIOR_ROOM_TABS.map((room) => (
              <button
                key={room.key}
                type="button"
                className={`preset-btn ${
                  sceneMode === 'main_hall_interior' && activeInteriorRoom === room.key
                    ? 'selected'
                    : ''
                }`}
                onClick={() => navigateToInteriorRoom(room.key)}
              >
                <span className="preset-name">{room.label}</span>
                <span className="preset-desc">{room.subtitle}</span>
              </button>
            ))}
          </div>
          <div className="sub-section-title">QUẦN THỂ CUNG ĐIỆN & LỤC BỘ (OUTDOOR MAP)</div>
          <div className="preset-list">
            {PALACE_LANDMARKS.map((lm) => (
              <button
                key={lm.id}
                type="button"
                className={`preset-btn ${
                  sceneMode === 'compound_map' && activeLandmarkId === lm.id
                    ? 'selected'
                    : ''
                }`}
                onClick={() => {
                  navigateToLandmark(lm.id);
                }}
              >
                <span className="preset-name">
                  {lm.icon} {lm.name}
                </span>
                <span className="preset-desc">{lm.subtitle}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {showInspectorDrawer && (
        <div className="floating-drawer right-drawer">
          <div className="panel-title">
            <span>GÓC MÁY CAMERA & HIỆU NĂNG ({metrics.fps} FPS)</span>
            <button
              type="button"
              className="drawer-close"
              onClick={toggleInspectorDrawer}
            >
              ✕
            </button>
          </div>

          <div className="perf-mini-row">
            <span>FPS: {metrics.fps}</span>
            <span>Draws: {metrics.drawCalls}</span>
            <span>Tris: {metrics.triangles.toLocaleString()}</span>
            <button
              type="button"
              className={`mini-btn ${showWireframe ? 'active' : ''}`}
              onClick={toggleWireframe}
            >
              Wireframe
            </button>
          </div>

          <button
            type="button"
            className={`preset-btn ${cameraMode === 'follow' ? 'selected' : ''}`}
            style={{ marginBottom: 6 }}
            onClick={() => setCameraMode('follow')}
          >
            <span className="preset-name">Camera Third-Person (Theo Nhân Vật)</span>
            <span className="preset-desc">Bám theo nhân vật khi di chuyển WASD</span>
          </button>

          <div className="preset-list">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`preset-btn ${
                  cameraMode === 'preset' && cameraPreset === preset.id ? 'selected' : ''
                }`}
                onClick={() => setCameraPreset(preset.id as CameraViewPreset)}
              >
                <span className="preset-name">{preset.label}</span>
                <span className="preset-desc">{preset.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 5. BOTTOM ROW: VÒNG ĐIỀU HƯỚNG WASD (TRÁI) & 6 NÚT MENU (PHẢI)    */}
      {/* ================================================================= */}
      <footer className="hud-bottom-row">
        {/* Vòng điều hướng W - A - S - D góc dưới bên trái giống hệt ảnh mẫu */}
        <div className="wasd-compass-wheel">
          <button
            type="button"
            className="wasd-dir-btn up"
            onMouseDown={() => {
              setCameraMode('follow');
              setVirtualInput({ x: 0, z: -1 });
            }}
            onMouseUp={() => setVirtualInput({ x: 0, z: 0 })}
            onMouseLeave={() => setVirtualInput({ x: 0, z: 0 })}
          >
            W
          </button>
          <button
            type="button"
            className="wasd-dir-btn left"
            onMouseDown={() => {
              setCameraMode('follow');
              setVirtualInput({ x: -1, z: 0 });
            }}
            onMouseUp={() => setVirtualInput({ x: 0, z: 0 })}
            onMouseLeave={() => setVirtualInput({ x: 0, z: 0 })}
          >
            A
          </button>
          <div className="wasd-center-knob" />
          <button
            type="button"
            className="wasd-dir-btn right"
            onMouseDown={() => {
              setCameraMode('follow');
              setVirtualInput({ x: 1, z: 0 });
            }}
            onMouseUp={() => setVirtualInput({ x: 0, z: 0 })}
            onMouseLeave={() => setVirtualInput({ x: 0, z: 0 })}
          >
            D
          </button>
          <button
            type="button"
            className="wasd-dir-btn down"
            onMouseDown={() => {
              setCameraMode('follow');
              setVirtualInput({ x: 0, z: 1 });
            }}
            onMouseUp={() => setVirtualInput({ x: 0, z: 0 })}
            onMouseLeave={() => setVirtualInput({ x: 0, z: 0 })}
          >
            S
          </button>
        </div>

        {/* 6 Nút Menu Chức Năng MMORPG góc dưới bên phải giống hệt ảnh mẫu */}
        <nav className="hud-bottom-menu">
          <button
            type="button"
            className={`hud-menu-medallion ${
              activeBottomDrawer === 'character' ? 'active' : ''
            }`}
            onClick={() =>
              setActiveBottomDrawer(
                activeBottomDrawer === 'character' ? null : 'character'
              )
            }
          >
            <div className="medallion-icon">🤴</div>
            <span className="medallion-label">Nhân Vật</span>
          </button>

          <button
            type="button"
            className={`hud-menu-medallion ${holdingJadeTablet ? 'active' : ''}`}
            onClick={toggleJadeTablet}
          >
            <div className="medallion-icon">💰</div>
            <span className="medallion-label">Túi Đồ</span>
          </button>

          <button
            type="button"
            className={`hud-menu-medallion ${
              activeBottomDrawer === 'landmarks' ? 'active' : ''
            }`}
            onClick={() =>
              setActiveBottomDrawer(
                activeBottomDrawer === 'landmarks' ? null : 'landmarks'
              )
            }
          >
            <div className="medallion-icon">📜</div>
            <span className="medallion-label">Công Vụ</span>
          </button>

          <button
            type="button"
            className="hud-menu-medallion"
            onClick={() => {
              setSceneMode('compound_map');
              setCameraPreset('compound_panorama');
            }}
          >
            <div className="medallion-icon">👥</div>
            <span className="medallion-label">Quan Hệ</span>
          </button>

          <button
            type="button"
            className="hud-menu-medallion"
            onClick={() => sitAtSpot('imperial_throne')}
          >
            <div className="medallion-icon">🏆</div>
            <span className="medallion-label">Xếp Hạng</span>
          </button>

          <button
            type="button"
            className={`hud-menu-medallion ${showInspectorDrawer ? 'active' : ''}`}
            onClick={toggleInspectorDrawer}
          >
            <div className="medallion-icon">⊞</div>
            <span className="medallion-label">Menu</span>
          </button>
        </nav>
      </footer>

      {/* Modal báo cáo minh bạch trạng thái 3D Asset */}
      {showAssetModal && (
        <div className="modal-backdrop" onClick={() => setShowAssetModal(false)}>
          <div className="asset-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Quản Lý Tài Nguyên 3D (Asset Manifest)</h2>
                <p>
                  Tuân thủ mục 9 & 14: Không giả mạo file GLB. Bản đồ Hoàng Cung & Nhân vật
                  được module hóa để thay thế bằng file <code>.glb</code> bất kỳ lúc nào.
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
                            : 'Procedural Chibi / Mesh'}
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
