import React, { useEffect } from 'react';
import { useUiStore, GameWindowType } from '../../stores/useUiStore';

interface ActionItem {
  id: GameWindowType;
  key: string;
  label: string;
  renderIcon: () => React.ReactNode;
}

const ACTION_ITEMS: ActionItem[] = [
  {
    id: 'character',
    key: 'C',
    label: 'Nhân Vật',
    renderIcon: () => (
      <svg viewBox="0 0 32 32" className="dock-svg" fill="currentColor">
        <circle cx="16" cy="14" r="6.5" fill="#ffdca8" />
        <path d="M10 12c0-4 3-7 6-7s6 3 6 7z" fill="#3a2518" />
        <path d="M7 12h18v2H7z" fill="#e5b85d" />
        <path d="M14 5h4v2.5h-4z" fill="#e5b85d" />
        <path d="M8 27c0-4.5 3.5-7.5 8-7.5s8 3 8 7.5z" fill="#8f1f18" />
        <path d="M14.5 19.5h3v7.5h-3z" fill="#e5b85d" />
      </svg>
    ),
  },
  {
    id: 'inventory',
    key: 'B',
    label: 'Túi Đồ',
    renderIcon: () => (
      <svg
        viewBox="0 0 32 32"
        className="dock-svg"
        fill="none"
        stroke="#e5b85d"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M10 11c-2.8 1.8-4.5 5.5-4.5 9.5 0 4.5 4.5 7.5 10.5 7.5s10.5-3 10.5-7.5c0-4-1.7-7.7-4.5-9.5"
          fill="#c69a48"
          fillOpacity="0.22"
        />
        <path d="M11 11h10l2-4.5H9l2 4.5z" fill="#3a2518" />
        <path d="M10.5 11c2 1 3.5 1.5 5.5 1.5s3.5-.5 5.5-1.5" />
        <circle
          cx="16"
          cy="19"
          r="3"
          fill="#ffd875"
          stroke="#e5b85d"
          strokeWidth="1.2"
        />
      </svg>
    ),
  },
  {
    id: 'quests',
    key: 'J',
    label: 'Công Vụ',
    renderIcon: () => (
      <svg
        viewBox="0 0 32 32"
        className="dock-svg"
        fill="none"
        stroke="#e5b85d"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M8.5 7.5h11a3.5 3.5 0 0 1 3.5 3.5v12a3 3 0 0 1-3 3h-12a3 3 0 0 1-3-3v-12a3.5 3.5 0 0 1 3.5-3.5z"
          fill="#c69a48"
          fillOpacity="0.18"
        />
        <path d="M6 10a2 2 0 0 1 2-2h11" />
        <path d="M10 13.5h9M10 17.5h9M10 21.5h5.5" strokeWidth="1.5" />
        <circle cx="20" cy="21.5" r="2" fill="#8f1f18" stroke="#e5b85d" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: 'social',
    key: 'O',
    label: 'Quan Hệ',
    renderIcon: () => (
      <svg
        viewBox="0 0 32 32"
        className="dock-svg"
        fill="none"
        stroke="#e5b85d"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="16" cy="9.5" r="3.5" fill="#c69a48" fillOpacity="0.25" />
        <path d="M10.5 24c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" />
        <circle cx="8" cy="11.5" r="2.5" fill="#c69a48" fillOpacity="0.15" />
        <path d="M4.5 23c0-2 1.8-3.8 3.8-3.8" />
        <circle cx="24" cy="11.5" r="2.5" fill="#c69a48" fillOpacity="0.15" />
        <path d="M27.5 23c0-2-1.8-3.8-3.8-3.8" />
      </svg>
    ),
  },
  {
    id: 'ranking',
    key: 'K',
    label: 'Xếp Hạng',
    renderIcon: () => (
      <svg
        viewBox="0 0 32 32"
        className="dock-svg"
        fill="none"
        stroke="#e5b85d"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M9.5 7h13v7a6.5 6.5 0 0 1-13 0V7z"
          fill="#c69a48"
          fillOpacity="0.2"
        />
        <path d="M9.5 10H6a2 2 0 0 0-2 2v.8a3.5 3.5 0 0 0 3.5 3.5h2M22.5 10H26a2 2 0 0 1 2 2v.8a3.5 3.5 0 0 1-3.5 3.5h-2" />
        <path d="M16 20.5v4M11.5 24.5h9" />
        <circle cx="16" cy="13" r="2.2" fill="#ffd875" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'settings',
    key: 'ESC',
    label: 'Menu',
    renderIcon: () => (
      <svg viewBox="0 0 32 32" className="dock-svg" fill="#e5b85d">
        <rect x="7" y="7" width="4.5" height="4.5" rx="1.2" />
        <rect x="13.75" y="7" width="4.5" height="4.5" rx="1.2" />
        <rect x="20.5" y="7" width="4.5" height="4.5" rx="1.2" />
        <rect x="7" y="13.75" width="4.5" height="4.5" rx="1.2" />
        <rect x="13.75" y="13.75" width="4.5" height="4.5" rx="1.2" />
        <rect x="20.5" y="13.75" width="4.5" height="4.5" rx="1.2" />
        <rect x="7" y="20.5" width="4.5" height="4.5" rx="1.2" />
        <rect x="13.75" y="20.5" width="4.5" height="4.5" rx="1.2" />
        <rect x="20.5" y="20.5" width="4.5" height="4.5" rx="1.2" />
      </svg>
    ),
  },
];

export const ActionBar: React.FC = () => {
  const activeWindow = useUiStore((s) => s.activeWindow);
  const toggleWindow = useUiStore((s) => s.toggleWindow);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in input or textarea
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return;
      }

      switch (e.code) {
        case 'KeyC':
          e.preventDefault();
          toggleWindow('character');
          break;
        case 'KeyB':
          e.preventDefault();
          toggleWindow('inventory');
          break;
        case 'KeyJ':
          e.preventDefault();
          toggleWindow('quests');
          break;
        case 'KeyO':
          e.preventDefault();
          toggleWindow('social');
          break;
        case 'KeyK':
          e.preventDefault();
          toggleWindow('ranking');
          break;
        case 'KeyM':
          e.preventDefault();
          toggleWindow('map');
          break;
        case 'Escape':
          // Esc closes any open window or toggles settings
          if (activeWindow) {
            e.preventDefault();
            toggleWindow(null);
          } else {
            toggleWindow('settings');
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleWindow, activeWindow]);

  return (
    <nav className="hud-action-bar" aria-label="Thanh công cụ nhanh">
      <div className="action-bar-items">
        {ACTION_ITEMS.map((item) => {
          const isActive = activeWindow === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`action-dock-button ${isActive ? 'active' : ''}`}
              onClick={() => toggleWindow(item.id)}
              title={`${item.label} (Phím [${item.key}])`}
            >
              <div className="dock-medallion-disc">
                {item.renderIcon()}
                <span className="dock-key-tag">{item.key}</span>
              </div>
              <span className="dock-label-text">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
