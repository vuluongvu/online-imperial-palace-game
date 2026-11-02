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
          d="M8.5 7.5h11a3.5 3.5 0 0 1 3.5 3.5v12a3 3 0 0 1-3 3h-12a3.5 3.5 0 0 1-3-3v-12a3.5 3.5 0 0 1 3.5-3.5z"
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
    id: 'map',
    key: 'M',
    label: 'Bản Đồ',
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
        <polygon
          points="5,7 11,5 21,9 27,6 27,25 21,27 11,23 5,25"
          fill="#c69a48"
          fillOpacity="0.22"
        />
        <polyline points="11,5 11,23" />
        <polyline points="21,9 21,27" />
        <circle cx="16" cy="15" r="2.5" fill="#ffd875" />
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
        case 'KeyJ':
          e.preventDefault();
          toggleWindow('quests');
          break;
        case 'KeyM':
          e.preventDefault();
          toggleWindow('map');
          break;
        case 'Escape':
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
