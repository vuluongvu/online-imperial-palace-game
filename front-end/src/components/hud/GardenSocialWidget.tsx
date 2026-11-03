import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useGameplayStore } from '../../stores/useGameplayStore';
import { CharacterAnimationState } from '../../game/characters/CharacterAnimations';

export const GardenSocialWidget: React.FC = () => {
  const playerPos = useGameStore((s) => s.playerPosition);
  const isPhotoMode = useGameStore((s) => s.isPhotoMode);
  const setPreviewAnimOverride = useGameStore((s) => s.setPreviewAnimOverride);
  const setPhotoMode = useGameStore((s) => s.setPhotoMode);

  const sendLocalChat = useGameplayStore((s) => s.sendLocalChat);
  const hostGardenBanquet = useGameplayStore((s) => s.hostGardenBanquet);
  const activeInteractableId = useGameplayStore((s) => s.activeInteractableId);

  const [chatInput, setChatInput] = useState('');

  // Tọa độ tâm Ngự Hoa Viên: [26, 0, 17]
  const distToGarden = Math.hypot(playerPos[0] - 26, playerPos[2] - 17);
  const isInGarden = distToGarden <= 15.5;

  if (!isInGarden || isPhotoMode || activeInteractableId) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendLocalChat(chatInput.trim());
    setChatInput('');
  };

  const handleEmote = (anim: CharacterAnimationState) => {
    setPreviewAnimOverride(anim);
    setTimeout(() => {
      setPreviewAnimOverride(null);
    }, 4500);
  };

  return (
    <div className="garden-social-widget-root">
      <div className="garden-social-card">
        <div className="garden-header-row">
          <span className="garden-badge-icon">🌸</span>
          <span className="garden-badge-text">Ngự Hoa Viên • Thượng Uyển Giao Lưu</span>
          <button
            type="button"
            className="garden-camera-shortcut-btn"
            onClick={() => setPhotoMode(true)}
            title="Chụp ảnh phong cảnh Ngự Hoa Viên"
          >
            📷 Chụp Ảnh
          </button>
        </div>

        {/* Hàng nút Biểu cảm (Emotes) nhanh */}
        <div className="garden-emotes-row">
          <button
            type="button"
            className="garden-emote-pill"
            onClick={() => handleEmote('bow')}
            title="Cúi đầu hành lễ kính chào"
          >
            🙇 Cúi chào
          </button>
          <button
            type="button"
            className="garden-emote-pill"
            onClick={() => handleEmote('talk')}
            title="Đàm đạo trò chuyện cùng bằng hữu"
          >
            💬 Đàm đạo
          </button>
          <button
            type="button"
            className="garden-emote-pill"
            onClick={() => handleEmote('kneel')}
            title="Quỳ lạy theo nghi thức hoàng gia"
          >
            🧎 Quỳ lạy
          </button>
          <button
            type="button"
            className="garden-emote-pill"
            onClick={() => handleEmote('sit')}
            title="Ngồi ngắm hoa thưởng trà"
          >
            🍵 Thưởng trà
          </button>
          <button
            type="button"
            className="garden-emote-pill festive-btn"
            onClick={hostGardenBanquet}
            title="Mở tiệc trà ngắm hoa đào bên hồ sen"
          >
            🎉 Khai Tiệc
          </button>
        </div>

        {/* Ô Chat gần (Proximity Chat) dạng chữ */}
        <form onSubmit={handleSendChat} className="garden-chat-input-row">
          <input
            type="text"
            className="garden-chat-input"
            placeholder="Nói chuyện gần tại Ngự Hoa Viên (bấm Enter để gửi)..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            maxLength={75}
          />
          <button type="submit" className="garden-chat-send-btn">
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};
