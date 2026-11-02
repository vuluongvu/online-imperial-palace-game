import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useUiStore } from '../../stores/useUiStore';

export const VirtualPad: React.FC = () => {
  const setVirtualInput = useGameStore((s) => s.setVirtualInput);
  const setCameraMode = useGameStore((s) => s.setCameraMode);

  const virtualPadEnabled = useUiStore((s) => s.virtualPadEnabled);
  const toggleVirtualPad = useUiStore((s) => s.toggleVirtualPad);

  const startMove = (x: number, z: number) => {
    setCameraMode('follow');
    setVirtualInput({ x, z });
  };

  const stopMove = () => {
    setVirtualInput({ x: 0, z: 0 });
  };

  if (!virtualPadEnabled) {
    return (
      <button
        type="button"
        className="virtual-pad-toggle-btn collapsed"
        onClick={toggleVirtualPad}
        title="Bật vòng điều hướng ảo WASD"
      >
        🕹️
      </button>
    );
  }

  return (
    <div className="hud-virtual-pad-wrapper" aria-label="Bàn phím ảo WASD">
      <div className="virtual-pad-disc">
        {/* Nút W (Tiến) */}
        <button
          type="button"
          className="pad-btn pad-w"
          onMouseDown={() => startMove(0, -1)}
          onMouseUp={stopMove}
          onMouseLeave={stopMove}
          onTouchStart={(e) => {
            e.preventDefault();
            startMove(0, -1);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopMove();
          }}
          title="Tiến (W)"
        >
          <span className="pad-key-letter">W</span>
        </button>

        {/* Nút A (Trái) */}
        <button
          type="button"
          className="pad-btn pad-a"
          onMouseDown={() => startMove(-1, 0)}
          onMouseUp={stopMove}
          onMouseLeave={stopMove}
          onTouchStart={(e) => {
            e.preventDefault();
            startMove(-1, 0);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopMove();
          }}
          title="Sang trái (A)"
        >
          <span className="pad-key-letter">A</span>
        </button>

        {/* Tâm xoay trung tâm */}
        <div className="pad-center-hub" onClick={toggleVirtualPad} title="Thu gọn bàn phím ảo">
          <span className="hub-core-dot" />
        </div>

        {/* Nút D (Phải) */}
        <button
          type="button"
          className="pad-btn pad-d"
          onMouseDown={() => startMove(1, 0)}
          onMouseUp={stopMove}
          onMouseLeave={stopMove}
          onTouchStart={(e) => {
            e.preventDefault();
            startMove(1, 0);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopMove();
          }}
          title="Sang phải (D)"
        >
          <span className="pad-key-letter">D</span>
        </button>

        {/* Nút S (Lùi) */}
        <button
          type="button"
          className="pad-btn pad-s"
          onMouseDown={() => startMove(0, 1)}
          onMouseUp={stopMove}
          onMouseLeave={stopMove}
          onTouchStart={(e) => {
            e.preventDefault();
            startMove(0, 1);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopMove();
          }}
          title="Lùi (S)"
        >
          <span className="pad-key-letter">S</span>
        </button>
      </div>
    </div>
  );
};
