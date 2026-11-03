import React, { useEffect } from 'react';
import { useGameplayStore } from '../../stores/useGameplayStore';
import { useGameStore } from '../../stores/useGameStore';

export const PalaceEventBanner: React.FC = () => {
  const activePalaceEvent = useGameplayStore((s) => s.activePalaceEvent);
  const eventTimeRemaining = useGameplayStore((s) => s.eventTimeRemaining);
  const triggerPalaceEvent = useGameplayStore((s) => s.triggerPalaceEvent);
  const dismissPalaceEvent = useGameplayStore((s) => s.dismissPalaceEvent);
  const tickPalaceEvent = useGameplayStore((s) => s.tickPalaceEvent);

  const navigateToLandmark = useGameStore((s) => s.navigateToLandmark);
  const isPhotoMode = useGameStore((s) => s.isPhotoMode);

  // Bộ đếm thời gian tự động kích hoạt sự kiện định kỳ trong cung mỗi 75-90 giây
  useEffect(() => {
    // Kích hoạt một sự kiện chào đón sau 12 giây khởi động game
    const initialTimer = setTimeout(() => {
      if (!useGameplayStore.getState().activePalaceEvent) {
        triggerPalaceEvent('event_edict_announced');
      }
    }, 12000);

    // Chu kỳ lặp định kỳ mỗi 85 giây
    const periodicInterval = setInterval(() => {
      const state = useGameplayStore.getState();
      if (!state.activePalaceEvent) {
        triggerPalaceEvent();
      }
    }, 85000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(periodicInterval);
    };
  }, [triggerPalaceEvent]);

  // Bộ đếm đếm lùi thời gian sự kiện
  useEffect(() => {
    if (!activePalaceEvent) return;
    const interval = setInterval(() => {
      tickPalaceEvent(1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activePalaceEvent, tickPalaceEvent]);

  if (!activePalaceEvent || isPhotoMode) return null;

  const handleAction = () => {
    if (activePalaceEvent.buildingTargetId) {
      navigateToLandmark(activePalaceEvent.buildingTargetId);
    }
    // Thưởng nhẹ cho người chơi hưởng ứng sự kiện
    useGameplayStore.setState((s) => ({
      meritPoints: s.meritPoints + 15,
      silverCoins: s.silverCoins + 30,
    }));
    useGameplayStore.getState().pushToast(
      'reward',
      'Hưởng Ứng Hoạt Động Hoàng Cung!',
      `Bạn đã tham gia sự kiện ${activePalaceEvent.title} (+15 Công trạng, +30 Bạc).`
    );
    dismissPalaceEvent();
  };

  return (
    <div className="palace-event-banner-root">
      <div className="palace-event-ribbon">
        <div className="event-icon-badge">{activePalaceEvent.bannerIcon}</div>
        <div className="event-content-col">
          <div className="event-header-row">
            <span className="event-tag-pill">HOẠT ĐỘNG HOÀNG CUNG</span>
            <span className="event-title-text">{activePalaceEvent.title}</span>
            <span className="event-timer-badge">⏳ {Math.ceil(eventTimeRemaining)}s</span>
          </div>
          <div className="event-announcement-text">{activePalaceEvent.announcement}</div>
        </div>
        <div className="event-actions-col">
          {activePalaceEvent.actionLabel && (
            <button
              type="button"
              className="event-join-btn"
              onClick={handleAction}
              title="Đi tới địa điểm diễn ra hoạt động"
            >
              {activePalaceEvent.actionLabel}
            </button>
          )}
          <button
            type="button"
            className="event-close-btn"
            onClick={dismissPalaceEvent}
            title="Bỏ qua sự kiện này"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
