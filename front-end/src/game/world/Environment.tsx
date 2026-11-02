import React from 'react';
import { Sparkles } from '@react-three/drei';

export const Environment: React.FC = () => {
  return (
    <>
      {/* Nền không gian hoàng cung trầm ấm và sương mờ tạo chiều sâu */}
      <color attach="background" args={['#1A0E0A']} />
      <fog attach="fog" args={['#1E100B', 28, 64]} />

      {/* Ánh sáng môi trường ấm áp, trang nghiêm nhưng thân thiện */}
      <ambientLight intensity={0.65} color="#FFF0D6" />
      <hemisphereLight
        color="#FFE6BA"
        groundColor="#472816"
        intensity={0.75}
        position={[0, 12, 0]}
      />

      {/* Ánh sáng mặt trời chiếu xiên từ cổng Nam vào Chính điện (giới hạn shadow frustum tối ưu FPS) */}
      <directionalLight
        position={[8, 16, 18]}
        intensity={1.65}
        color="#FFD89B"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
        shadow-camera-near={2}
        shadow-camera-far={48}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
      />

      {/* Đèn điểm tôn vinh khu vực Long Ngai & Bệ Rồng */}
      <pointLight
        position={[0, 6.2, -15.5]}
        intensity={26}
        distance={18}
        decay={1.8}
        color="#FFBE5C"
      />

      {/* Ánh sáng ấm dọc theo trục Ngự Đạo giữa Chính điện */}
      <pointLight
        position={[0, 6.5, -2]}
        intensity={18}
        distance={22}
        decay={1.8}
        color="#FFA94D"
      />
      <pointLight
        position={[0, 6.5, 11]}
        intensity={16}
        distance={20}
        decay={1.8}
        color="#FFB563"
      />

      {/* Hạt bụi vàng (Ambient Particles) lơ lửng nhẹ nhàng trong nắng hoàng cung */}
      <Sparkles
        count={75}
        scale={[22, 8, 34]}
        position={[0, 4.2, 0]}
        size={2.2}
        speed={0.22}
        opacity={0.42}
        color="#FFE299"
      />
    </>
  );
};
