import React from 'react';
import { useGameStore, SEATING_SPOTS } from '../stores/useGameStore';
import { useGameplayStore } from '../stores/useGameplayStore';
import { useUiStore } from '../stores/useUiStore';
import { INTERACTABLE_ENTITIES } from '../data/palaceGameplayData';
import { ASSET_MANIFEST } from '../game/assets/assetManifest';

import { CharacterBadge } from './hud/CharacterBadge';
import { QuestTracker } from './hud/QuestTracker';
import { TopBar } from './hud/TopBar';
import { MiniMap } from './hud/MiniMap';
import { ChatPanel } from './hud/ChatPanel';
import { ActionBar } from './hud/ActionBar';
import { VirtualPad } from './hud/VirtualPad';
import { NotificationLayer } from './hud/NotificationLayer';

import { NpcDialogue } from './dialogue/NpcDialogue';
import { BuildingGameplayModal } from './BuildingGameplayModal';

import { CharacterWindow } from './windows/CharacterWindow';
import { InventoryWindow } from './windows/InventoryWindow';
import { QuestJournalWindow } from './windows/QuestJournalWindow';
import { SocialWindow } from './windows/SocialWindow';
import { RankingWindow } from './windows/RankingWindow';
import { MapWindow } from './windows/MapWindow';
import { SettingsWindow } from './windows/SettingsWindow';

export const SceneInspectOverlay: React.FC = () => {
  const isPointerLocked = useGameStore((s) => s.isPointerLocked);
  const nearbySeatId = useGameStore((s) => s.nearbySeatId);
  const sitAtSpot = useGameStore((s) => s.sitAtSpot);
  const showAssetModal = useGameStore((s) => s.showAssetModal);
  const setShowAssetModal = useGameStore((s) => s.setShowAssetModal);

  const nearbyInteractableId = useGameplayStore((s) => s.nearbyInteractableId);
  const activeInteractableId = useGameplayStore((s) => s.activeInteractableId);
  const openInteraction = useGameplayStore((s) => s.openInteraction);

  const activeWindow = useUiStore((s) => s.activeWindow);

  const currentNearbySpot = SEATING_SPOTS.find((s) => s.id === nearbySeatId);
  const currentNearbyEntity = INTERACTABLE_ENTITIES.find(
    (e) => e.id === nearbyInteractableId
  );

  const isAnyModalOpen = Boolean(
    activeInteractableId || activeWindow || showAssetModal
  );

  return (
    <>
      {/* ================================================================= */}
      {/* 1. HUD LAYER CHÍNH (TỰ ĐỘNG MỜ KHI MỞ BẢNG MODAL)               */}
      {/* ================================================================= */}
      <div className={`mmorpg-hud-root ${isAnyModalOpen ? 'modal-open' : ''}`}>
        {/* ================================================================= */}
        {/* 1. KHU VỰC ĐỈNH MÀN HÌNH (TOP HUD)                                 */}
        {/* ================================================================= */}
        <div className="hud-top-layout">
          <div className="hud-top-left-col">
            <CharacterBadge />
          </div>

          <div className="hud-top-right-col">
            <TopBar />
          </div>
        </div>

        {/* ================================================================= */}
        {/* CỘT NỔI BÊN PHẢI: NHIỆM VỤ & BẢN ĐỒ RADAR (THEO ẢNH CONCEPT)     */}
        {/* ================================================================= */}
        <div className="hud-right-floating-col">
          <QuestTracker />
          <MiniMap />
        </div>

        {/* ================================================================= */}
        {/* GỢI Ý TƯƠNG TÁC DƯỚI CHÂN (KHI Ở GẦN)                           */}
        {/* ================================================================= */}
        {!isPointerLocked && !isAnyModalOpen && (
          <div className="hud-center-prompt-anchor">
            {currentNearbyEntity ? (
              <div
                className="hud-interact-toast nearby"
                onClick={() => openInteraction(currentNearbyEntity.id)}
              >
                <span className="interact-key-pill">[E]</span>
                <span>
                  {currentNearbyEntity.name} — <em>{currentNearbyEntity.title}</em>
                </span>
              </div>
            ) : currentNearbySpot ? (
              <div
                className="hud-interact-toast nearby"
                onClick={() => sitAtSpot(currentNearbySpot.id)}
              >
                <span className="interact-key-pill">[E]</span>
                <span>
                  Ngồi tại: <strong>{currentNearbySpot.label}</strong>
                </span>
              </div>
            ) : null}
          </div>
        )}

        {/* ================================================================= */}
        {/* 3. KHU VỰC ĐÁY MÀN HÌNH (BOTTOM HUD)                               */}
        {/* ================================================================= */}
        <div className="hud-bottom-layout">
          <div className="hud-bottom-left-col">
            <ChatPanel />
            <VirtualPad />
          </div>
          <div className="hud-bottom-right-col">
            <ActionBar />
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. MODAL & DIALOGUE PORTAL LAYER (ĐÈ LÊN TẤT CẢ - Z-INDEX 10000)   */}
      {/* ================================================================= */}
      <div className="modal-portal-layer">
        {/* Hệ Thống Thông Báo */}
        <NotificationLayer />

        {/* Hội Thoại NPC Cung Đình */}
        <NpcDialogue />

        {/* Giao Diện Công Trình Hoàng Cung */}
        <BuildingGameplayModal />

        {/* Các Cửa Sổ Chức Năng Độc Lập */}
        {activeWindow === 'character' && <CharacterWindow />}
        {activeWindow === 'inventory' && <InventoryWindow />}
        {activeWindow === 'quests' && <QuestJournalWindow />}
        {activeWindow === 'social' && <SocialWindow />}
        {activeWindow === 'ranking' && <RankingWindow />}
        {activeWindow === 'map' && <MapWindow />}
        {activeWindow === 'settings' && <SettingsWindow />}

        {/* Modal 3D Asset Manifest */}
        {showAssetModal && (
          <div
            className="game-window-backdrop"
            onClick={() => setShowAssetModal(false)}
          >
            <div
              className="game-window-shell"
              style={{ width: '820px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <header className="game-window-header">
                <div className="game-window-title-group">
                  <span className="game-window-icon">📜</span>
                  <div>
                    <h2 className="game-window-title">Quản Lý 3D Asset</h2>
                    <p className="game-window-subtitle">
                      Kiểm tra trạng thái tài nguyên GLB/GLTF
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="game-window-close-btn"
                  onClick={() => setShowAssetModal(false)}
                >
                  ✕
                </button>
              </header>
              <div className="game-window-body">
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Thành phần</th>
                      <th>Đường dẫn (.glb)</th>
                      <th>Trạng thái</th>
                      <th>Nguồn đề xuất</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ASSET_MANIFEST.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>
                          <code>{item.targetPath}</code>
                        </td>
                        <td>
                          <span className="clean-status-pill">{item.status}</span>
                        </td>
                        <td>
                          {item.recommendedSources[0]?.provider}:{' '}
                          {item.recommendedSources[0]?.license}
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
    </>
  );
};
