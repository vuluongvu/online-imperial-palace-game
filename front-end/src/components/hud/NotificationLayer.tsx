import React from 'react';
import { useGameplayStore } from '../../stores/useGameplayStore';

export const NotificationLayer: React.FC = () => {
  const toasts = useGameplayStore((s) => s.toasts);
  const dismissToast = useGameplayStore((s) => s.dismissToast);

  // Group notifications by placement
  const questToasts = toasts.filter(
    (t) => t.type === 'quest_accept' || t.type === 'quest_complete'
  );
  const promotionToasts = toasts.filter((t) => t.type === 'promotion');
  const edictToasts = toasts.filter((t) => t.type === 'edict');
  const standardToasts = toasts.filter(
    (t) =>
      t.type === 'reward' ||
      t.type === 'info' ||
      t.type === 'error' ||
      t.type === 'player'
  );

  return (
    <div className="hud-notification-root">
      {/* 1. Banner Nhận & Hoàn Thành Nhiệm Vụ (Giữa trên màn hình) */}
      {questToasts.length > 0 && (
        <div className="notif-center-top">
          {questToasts.map((toast) => {
            const isComplete = toast.type === 'quest_complete';
            return (
              <div
                key={toast.id}
                className={`notif-quest-banner ${isComplete ? 'complete' : 'accept'}`}
                onClick={() => dismissToast(toast.id)}
              >
                <div className="notif-quest-seal">
                  {isComplete ? 'ĐẠT' : 'CHỈNH'}
                </div>
                <div className="notif-quest-content">
                  <span className="notif-quest-tag">
                    {isComplete ? 'HOÀN THÀNH CÔNG VỤ' : 'TIẾP NHẬN CÔNG VỤ'}
                  </span>
                  <h3 className="notif-quest-title">{toast.title}</h3>
                  <p className="notif-quest-desc">{toast.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Chiếu Chỉ Ban Hành (Dải hoàng bảng trang trọng) */}
      {edictToasts.length > 0 && (
        <div className="notif-edict-overlay">
          {edictToasts.map((toast) => (
            <div
              key={toast.id}
              className="notif-edict-card"
              onClick={() => dismissToast(toast.id)}
            >
              <div className="notif-edict-header">
                <span className="edict-crest">👑</span>
                <span className="edict-label">HOÀNG BẢNG CHIẾU CHỈ</span>
              </div>
              <h4 className="notif-edict-title">{toast.title}</h4>
              <p className="notif-edict-text">“{toast.message}”</p>
              <div className="notif-edict-footer">Khâm thử • Triều Đình Ban Bố</div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Lễ Sắc Phong Thăng Chức (Chính giữa màn hình) */}
      {promotionToasts.length > 0 && (
        <div className="notif-promotion-overlay">
          {promotionToasts.map((toast) => (
            <div
              key={toast.id}
              className="notif-promotion-card"
              onClick={() => dismissToast(toast.id)}
            >
              <div className="promotion-ribbon">SẮC PHONG HOÀNG GIA</div>
              <div className="promotion-badge-ring">
                <span className="promotion-crown-icon">👑</span>
              </div>
              <h3 className="promotion-title">{toast.title}</h3>
              <p className="promotion-desc">{toast.message}</p>
              <button
                type="button"
                className="promotion-dismiss-btn"
                onClick={() => dismissToast(toast.id)}
              >
                Tạ Ơn Thánh Thượng
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. Toasts Nhận Thưởng / Lỗi / Thông Tin (Góc phải dưới mini-map) */}
      {standardToasts.length > 0 && (
        <div className="notif-standard-stack">
          {standardToasts.map((toast) => (
            <div
              key={toast.id}
              className={`notif-toast-item ${toast.type}`}
              onClick={() => dismissToast(toast.id)}
            >
              <span className="notif-toast-icon">
                {toast.type === 'reward'
                  ? '🎖️'
                  : toast.type === 'error'
                    ? '⚠️'
                    : toast.type === 'player'
                      ? '👤'
                      : 'ℹ️'}
              </span>
              <div className="notif-toast-body">
                <div className="notif-toast-heading">{toast.title}</div>
                <div className="notif-toast-sub">{toast.message}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
