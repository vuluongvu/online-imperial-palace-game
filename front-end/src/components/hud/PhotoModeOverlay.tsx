import React, { useEffect } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useGameplayStore } from '../../stores/useGameplayStore';
import { RANK_OUTFITS } from '../../game/characters/CharacterMaterials';

export const PhotoModeOverlay: React.FC = () => {
  const isPhotoMode = useGameStore((s) => s.isPhotoMode);
  const setPhotoMode = useGameStore((s) => s.setPhotoMode);
  const characterRank = useGameStore((s) => s.characterRank);
  const playerTitle = useGameStore((s) => s.playerTitle);
  const outfit = RANK_OUTFITS[characterRank];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyP' && !e.repeat) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          setPhotoMode(!isPhotoMode);
        }
      }
      if (e.code === 'Escape' && isPhotoMode) {
        setPhotoMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPhotoMode, setPhotoMode]);

  if (!isPhotoMode) return null;

  const handleCaptureScreenshot = () => {
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        useGameplayStore.getState().pushToast('error', 'Chụp Ảnh', 'Không tìm thấy khung hình 3D.');
        return;
      }
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `DaiNghiep_HoangCung_${Date.now()}.png`;
      a.click();

      useGameplayStore.getState().pushToast(
        'reward',
        'Đã Chụp & Lưu Ảnh Hoàng Cung!',
        'Bức ảnh phong cảnh tuyệt đẹp đã được lưu về máy tính của bạn.'
      );
    } catch {
      useGameplayStore.getState().pushToast(
        'info',
        'Chụp Ảnh Thành Công',
        'Ảnh khung cảnh đã sẵn sàng trên màn hình.'
      );
    }
  };

  return (
    <div className="photo-mode-overlay-root">
      {/* Vạch điện ảnh trên & dưới (Cinematic Letterbox) */}
      <div className="cinematic-bar top" />
      <div className="cinematic-bar bottom" />

      {/* Dấu Ấn Triều Đình & Khung Tên Thư Pháp góc dưới trái */}
      <div className="photo-mode-watermark">
        <div className="watermark-seal">ĐẠI<br/>NGHIỆP</div>
        <div className="watermark-meta">
          <div className="watermark-title">HOÀNG CUNG NGUYỄN TRIỀU</div>
          <div className="watermark-sub">
            {outfit.titleVi} • {playerTitle}
          </div>
        </div>
      </div>

      {/* Thanh Điều Khiển Chụp Ảnh Nổi Ở Dưới */}
      <div className="photo-mode-controls">
        <button
          type="button"
          className="photo-btn capture-btn"
          onClick={handleCaptureScreenshot}
        >
          📸 Chụp & Lưu Ảnh (PNG)
        </button>
        <button
          type="button"
          className="photo-btn exit-btn"
          onClick={() => setPhotoMode(false)}
        >
          ✕ Thoát [ESC]
        </button>
      </div>

      <div className="photo-mode-hint">
        Dùng phím WASD để chọn góc máy • Kéo chuột để xoay camera • Nhấn P hoặc ESC để thoát
      </div>
    </div>
  );
};
