import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../stores/useGameStore';

/**
 * Hệ thống đo lường hiệu năng thời gian thực (FPS, Draw Calls, Triangles, Memory).
 * Chỉ cập nhật store mỗi 0.5s để không gây re-render thừa trong render loop.
 */
export const PerformanceMonitor: React.FC = () => {
  const updateMetrics = useGameStore((s) => s.updateMetrics);
  const frameCount = useRef(0);
  const elapsed = useRef(0);

  useFrame(({ gl }, delta) => {
    frameCount.current += 1;
    elapsed.current += delta;

    if (elapsed.current >= 0.5) {
      const fps = Math.min(120, Math.round(frameCount.current / elapsed.current));
      const info = gl.info;

      updateMetrics({
        fps,
        drawCalls: info.render.calls,
        triangles: info.render.triangles,
        geometries: info.memory.geometries,
        textures: info.memory.textures,
      });

      frameCount.current = 0;
      elapsed.current = 0;
    }
  });

  return null;
};
