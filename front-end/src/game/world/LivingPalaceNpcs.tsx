import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Player } from '../characters/Player';
import { OfficialRank } from '../characters/CharacterMaterials';
import { CharacterAnimationState } from '../characters/CharacterAnimations';
import { useGameStore } from '../../stores/useGameStore';

// ----------------------------------------------------------------------------
// 1. NPC TUẦN TRA / ĐI LẠI THEO LỘ TRÌNH ĐỊNH SẴN (PATROL / WALKING NPC)
// ----------------------------------------------------------------------------
interface PatrolNpcProps {
  id: string;
  rank: OfficialRank;
  waypoints: [number, number][]; // Tọa độ [x, z] của các điểm tuần tra
  speed?: number; // Tốc độ di chuyển (m/s)
  pauseDuration?: number; // Thời gian dừng quan sát tại mỗi trạm (giây)
  saluteRadius?: number; // Cự ly người chơi tới gần để dừng lại cúi chào
  initialWaypointIndex?: number;
}

export const PatrolNpc: React.FC<PatrolNpcProps> = ({
  rank,
  waypoints,
  speed = 1.6,
  pauseDuration = 3.5,
  saluteRadius = 2.8,
  initialWaypointIndex = 0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const playerPos = useGameStore((s) => s.playerPosition);

  // Trạng thái nội bộ được lưu bằng ref để 60 FPS không trigger re-render React thừa
  const stateRef = useRef({
    pos: [waypoints[initialWaypointIndex][0], 0, waypoints[initialWaypointIndex][1]] as [
      number,
      number,
      number,
    ],
    targetIndex: (initialWaypointIndex + 1) % waypoints.length,
    rotY: 0,
    waitTimer: 0,
    anim: 'walk' as CharacterAnimationState,
  });

  const [currentAnim, setCurrentAnim] = useState<CharacterAnimationState>('walk');

  const frameRef = useRef(0);

  useFrame(({ camera }, delta) => {
    if (!groupRef.current) return;
    frameRef.current++;

    // Tối ưu hóa cự ly (LOD Optimization):
    const distToCam = camera.position.distanceTo(groupRef.current.position);
    if (distToCam > 45) return;
    if (distToCam > 24 && frameRef.current % 2 !== 0) return;

    const clampedDelta = Math.min(delta, 0.1);
    const s = stateRef.current;

    // Kiểm tra cự ly tới người chơi: Nếu người chơi lại gần, lính gác/thái giám dừng lại cúi chào
    const dxP = playerPos[0] - s.pos[0];
    const dzP = playerPos[2] - s.pos[2];
    const distPlayer = Math.hypot(dxP, dzP);

    if (distPlayer <= saluteRadius) {
      // Hướng mặt về phía người chơi và hành lễ
      const targetAngle = Math.atan2(dxP, dzP);
      let angleDiff = targetAngle - s.rotY;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      s.rotY += angleDiff * (1 - Math.exp(-10 * clampedDelta));

      if (s.anim !== 'bow') {
        s.anim = 'bow';
        setCurrentAnim('bow');
      }

      groupRef.current.position.set(s.pos[0], 0, s.pos[2]);
      groupRef.current.rotation.y = s.rotY;
      return;
    }

    // Nếu đang trong thời gian dừng nghỉ / quan sát tại chốt tuần tra
    if (s.waitTimer > 0) {
      s.waitTimer -= clampedDelta;
      if (s.anim !== 'idle') {
        s.anim = 'idle';
        setCurrentAnim('idle');
      }
      groupRef.current.position.set(s.pos[0], 0, s.pos[2]);
      groupRef.current.rotation.y = s.rotY;
      return;
    }

    // Di chuyển tới điểm tuần tra mục tiêu
    const target = waypoints[s.targetIndex];
    const dx = target[0] - s.pos[0];
    const dz = target[1] - s.pos[2];
    const distTarget = Math.hypot(dx, dz);

    const step = speed * clampedDelta;
    if (distTarget <= step) {
      // Đã tới điểm trạm: Cập nhật vị trí, dừng lại quan sát
      s.pos[0] = target[0];
      s.pos[2] = target[1];
      s.targetIndex = (s.targetIndex + 1) % waypoints.length;
      s.waitTimer = pauseDuration;
      if (s.anim !== 'idle') {
        s.anim = 'idle';
        setCurrentAnim('idle');
      }
    } else {
      // Đang bước đi: Cập nhật tọa độ và xoay góc mặt mượt mà
      s.pos[0] += (dx / distTarget) * step;
      s.pos[2] += (dz / distTarget) * step;

      const targetAngle = Math.atan2(dx, dz);
      let angleDiff = targetAngle - s.rotY;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      s.rotY += angleDiff * (1 - Math.exp(-12 * clampedDelta));

      if (s.anim !== 'walk') {
        s.anim = 'walk';
        setCurrentAnim('walk');
      }
    }

    groupRef.current.position.set(s.pos[0], 0, s.pos[2]);
    groupRef.current.rotation.y = s.rotY;
  });

  return (
    <group
      ref={groupRef}
      position={[waypoints[initialWaypointIndex][0], 0, waypoints[initialWaypointIndex][1]]}
    >
      <Player rank={rank} animationState={currentAnim} />
    </group>
  );
};

// ----------------------------------------------------------------------------
// 2. CẶP QUAN VIÊN ĐỨNG ĐÀM ĐẠO (CONVERSING OFFICIALS PAIR)
// ----------------------------------------------------------------------------
interface ConversingPairProps {
  id: string;
  npcA: { pos: [number, number, number]; rotY: number; rank: OfficialRank };
  npcB: { pos: [number, number, number]; rotY: number; rank: OfficialRank };
  cycleDuration?: number; // Chu kỳ đổi phiên nói/nghe (giây)
}

export const ConversingPair: React.FC<ConversingPairProps> = ({
  npcA,
  npcB,
  cycleDuration = 6.5,
}) => {
  const groupARef = useRef<THREE.Group>(null);
  const groupBRef = useRef<THREE.Group>(null);
  const playerPos = useGameStore((s) => s.playerPosition);

  const [animA, setAnimA] = useState<CharacterAnimationState>('talk');
  const [animB, setAnimB] = useState<CharacterAnimationState>('idle');

  const timerRef = useRef(0);
  const isBowRef = useRef(false);

  // Tâm giữa 2 quan viên để đo cự ly người chơi
  const midX = (npcA.pos[0] + npcB.pos[0]) / 2;
  const midZ = (npcA.pos[2] + npcB.pos[2]) / 2;

  useFrame((_, delta) => {
    const distPlayer = Math.hypot(playerPos[0] - midX, playerPos[2] - midZ);
    if (distPlayer > 40) return;

    const clampedDelta = Math.min(delta, 0.1);
    timerRef.current += clampedDelta;

    // Khi người chơi tới gần (< 3.2m), hai quan viên tạm dừng việc riêng, quay ra cúi chào
    if (distPlayer <= 3.2) {
      if (!isBowRef.current) {
        isBowRef.current = true;
        setAnimA('bow');
        setAnimB('bow');
      }
      return;
    }

    if (isBowRef.current) {
      isBowRef.current = false;
    }

    // Luân phiên phiên nói và nghe
    const phase = Math.floor(timerRef.current / cycleDuration) % 2;
    if (phase === 0) {
      if (animA !== 'talk') setAnimA('talk');
      if (animB !== 'idle') setAnimB('idle');
    } else {
      if (animA !== 'idle') setAnimA('idle');
      if (animB !== 'talk') setAnimB('talk');
    }
  });

  return (
    <group>
      <group ref={groupARef} position={npcA.pos} rotation={[0, npcA.rotY, 0]}>
        <Player rank={npcA.rank} animationState={animA} />
      </group>
      <group ref={groupBRef} position={npcB.pos} rotation={[0, npcB.rotY, 0]}>
        <Player rank={npcB.rank} animationState={animB} />
      </group>
    </group>
  );
};

// ----------------------------------------------------------------------------
// 3. QUAN VIÊN / THỊ VỆ ĐỨNG CHẦU CÓ HÀNH LỄ (REACTIVE GREETING NPC)
// ----------------------------------------------------------------------------
interface GreetingNpcProps {
  pos: [number, number, number];
  rotY: number;
  rank: OfficialRank;
  defaultAnim?: CharacterAnimationState;
  saluteRadius?: number;
}

export const GreetingNpc: React.FC<GreetingNpcProps> = ({
  pos,
  rotY,
  rank,
  defaultAnim = 'idle',
  saluteRadius = 3.2,
}) => {
  const playerPos = useGameStore((s) => s.playerPosition);
  const [anim, setAnim] = useState<CharacterAnimationState>(defaultAnim);
  const isGreetingRef = useRef(false);

  useFrame(() => {
    const dist = Math.hypot(playerPos[0] - pos[0], playerPos[2] - pos[2]);
    if (dist > 38) return;
    if (dist <= saluteRadius) {
      if (!isGreetingRef.current) {
        isGreetingRef.current = true;
        setAnim('bow');
      }
    } else {
      if (isGreetingRef.current) {
        isGreetingRef.current = false;
        setAnim(defaultAnim);
      }
    }
  });

  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <Player rank={rank} animationState={anim} />
    </group>
  );
};

// ----------------------------------------------------------------------------
// 4. TỔNG HỢP TOÀN BỘ CỘNG ĐỒNG NPC CUNG ĐÌNH SỐNG ĐỘNG (LIVING PALACE NPCS)
// ----------------------------------------------------------------------------
export const LivingPalaceNpcs: React.FC = () => {
  return (
    <group name="LivingPalaceEcosystem">
      {/* =================================================================== */}
      {/* A. ĐỘI THỊ VỆ TUẦN TRA TRỤC THẦN ĐẠO (2 CẤM VỆ QUÂN SONG HÀNH)     */}
      {/* =================================================================== */}
      {/* Thị Vệ Cánh Phải */}
      <PatrolNpc
        id="guard-patrol-east"
        rank="guard"
        speed={1.75}
        pauseDuration={3.8}
        saluteRadius={2.8}
        waypoints={[
          [1.8, 34.0], // Đầu đường thần đạo gần Ngọ Môn
          [1.8, 15.5], // Trước thềm rồng Thái Hòa Điện
        ]}
      />
      {/* Thị Vệ Cánh Trái (bước song hành) */}
      <PatrolNpc
        id="guard-patrol-west"
        rank="guard"
        speed={1.75}
        pauseDuration={3.8}
        saluteRadius={2.8}
        waypoints={[
          [-1.8, 34.0],
          [-1.8, 15.5],
        ]}
      />

      {/* =================================================================== */}
      {/* B. THỊ VỆ TUẦN TRA HÀNH LANG ĐÔNG - TÂY (TIỀN TRIỀU)                */}
      {/* =================================================================== */}
      <PatrolNpc
        id="guard-patrol-horizontal"
        rank="guard"
        speed={1.65}
        pauseDuration={4.0}
        saluteRadius={2.8}
        waypoints={[
          [-15.0, 2.0], // Hành lang gần Lại Bộ
          [15.0, 2.0],  // Hành lang gần Hình Bộ
        ]}
      />

      {/* =================================================================== */}
      {/* C. THÁI GIÁM ĐI LẠI TRONG HOÀNG CUNG (TRUYỀN CHỈ & PHỤNG TRÀ)        */}
      {/* =================================================================== */}
      {/* Thái Giám Phụng Trà (Hành lang phía Đông: Hữu Vu <-> Ngự Hoa Viên) */}
      <PatrolNpc
        id="eunuch-tea-carrier"
        rank="eunuch"
        speed={1.35}
        pauseDuration={3.0}
        saluteRadius={2.4}
        initialWaypointIndex={0}
        waypoints={[
          [18.2, 4.0],  // Cửa Hữu Vu / Phòng Tiếp Khách
          [18.2, 16.5], // Lối dẫn vào Ngự Hoa Viên
        ]}
      />
      {/* Thái Giám Truyền Chỉ (Hành lang phía Tây: Tả Vu <-> Hàn Lâm Viện) */}
      <PatrolNpc
        id="eunuch-scroll-carrier"
        rank="eunuch"
        speed={1.35}
        pauseDuration={3.2}
        saluteRadius={2.4}
        initialWaypointIndex={1}
        waypoints={[
          [-18.2, 4.0],  // Cửa Tả Vu / Gian Chờ Quan Viên
          [-18.2, 16.5], // Lối dẫn sang Hàn Lâm Viện
        ]}
      />

      {/* =================================================================== */}
      {/* D. CÁC CẶP QUAN VIÊN ĐỨNG ĐÀM ĐẠO TRÊN SÂN RỒNG & HÀN LÂM VIỆN     */}
      {/* =================================================================== */}
      {/* Cặp Đại Thần Đàm Đạo Triều Chính trên Sân Rồng */}
      <ConversingPair
        id="court-ministers-discussion"
        cycleDuration={6.5}
        npcA={{
          pos: [-7.8, 0, 16.2],
          rotY: Math.PI / 2, // Hướng mặt sang phải
          rank: 'minister',
        }}
        npcB={{
          pos: [-5.8, 0, 16.2],
          rotY: -Math.PI / 2, // Hướng mặt sang trái
          rank: 'mid_official',
        }}
      />

      {/* Cặp Quan Trẻ / Tân Khoa Đàm Đạo Thi Phú trước Hàn Lâm Viện */}
      <ConversingPair
        id="scholars-exam-discussion"
        cycleDuration={5.5}
        npcA={{
          pos: [-17.5, 0, 24.5],
          rotY: Math.PI / 2,
          rank: 'low_official',
        }}
        npcB={{
          pos: [-15.8, 0, 24.5],
          rotY: -Math.PI / 2,
          rank: 'low_official',
        }}
      />

      {/* =================================================================== */}
      {/* E. QUAN VIÊN & THỊ VỆ ĐỨNG CHẦU TRANG TRỌNG CÓ CÚI CHÀO KHI LẠI GẦN */}
      {/* =================================================================== */}
      {/* Hai Quan Đại Thần đứng chầu chân thềm Chính Điện Thái Hòa */}
      <GreetingNpc
        pos={[-3.2, 0, 4.8]}
        rotY={Math.PI / 2}
        rank="minister"
        saluteRadius={3.2}
      />
      <GreetingNpc
        pos={[3.2, 0, 4.8]}
        rotY={-Math.PI / 2}
        rank="minister"
        saluteRadius={3.2}
      />

      {/* Hai Quan Trung Cấp đứng chầu giữa sân */}
      <GreetingNpc
        pos={[-3.2, 0, 9.2]}
        rotY={Math.PI / 2}
        rank="mid_official"
        saluteRadius={3.0}
      />
      <GreetingNpc
        pos={[3.2, 0, 9.2]}
        rotY={-Math.PI / 2}
        rank="mid_official"
        saluteRadius={3.0}
      />

      {/* Hai Thị Vệ đứng gác trước Cổng Chính Ngọ Môn */}
      <GreetingNpc
        pos={[-3.6, 0, 43.5]}
        rotY={0}
        rank="guard"
        saluteRadius={3.8}
      />
      <GreetingNpc
        pos={[3.6, 0, 43.5]}
        rotY={0}
        rank="guard"
        saluteRadius={3.8}
      />
    </group>
  );
};
