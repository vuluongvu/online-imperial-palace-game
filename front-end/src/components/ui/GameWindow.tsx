import React, { useEffect } from 'react';
import { useUiStore } from '../../stores/useUiStore';

interface GameWindowProps {
  title: string;
  subtitle?: string;
  icon?: string;
  onClose?: () => void;
  width?: number | string;
  children: React.ReactNode;
}

export const GameWindow: React.FC<GameWindowProps> = ({
  title,
  subtitle,
  icon = '📜',
  onClose,
  width = 720,
  children,
}) => {
  const closeWindow = useUiStore((s) => s.closeWindow);

  const handleClose = () => {
    if (onClose) onClose();
    else closeWindow();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="game-window-backdrop"
      onClick={handleClose}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className="game-window-shell"
        style={{ width: typeof width === 'number' ? `${width}px` : width }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <header className="game-window-header">
          <div className="game-window-title-group">
            <span className="game-window-icon">{icon}</span>
            <div>
              <h2 className="game-window-title">{title}</h2>
              {subtitle && <p className="game-window-subtitle">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            className="game-window-close-btn"
            onClick={handleClose}
            title="Đóng (ESC)"
          >
            ✕
          </button>
        </header>

        <div className="game-window-body">{children}</div>
      </div>
    </div>
  );
};
