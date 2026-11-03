import React from 'react';
import { Player } from '../characters/Player';
import { OfficialRank } from '../characters/CharacterMaterials';
import { CharacterAnimationState } from '../characters/CharacterAnimations';
import { useGameplayStore } from '../../stores/useGameplayStore';
import { useGameStore } from '../../stores/useGameStore';

export const CourtOfficialsAssembly: React.FC = () => {
  const courtCeremonyStage = useGameplayStore((s) => s.courtCeremonyStage);
  const characterRank = useGameStore((s) => s.characterRank);

  // Xác định animation của toàn thể quan viên theo giai đoạn nghi lễ
  let officialAnim: CharacterAnimationState = 'idle';
  if (courtCeremonyStage === 'kowtow') {
    officialAnim = 'kneel'; // Trăm quan đồng loạt quỳ lạy Thiên Tử
  } else if (courtCeremonyStage === 'decree' || courtCeremonyStage === 'rewarded') {
    officialAnim = 'bow'; // Trăm quan cúc cung khấu đầu cảm tạ Hoàng ân
  }

  // Tọa độ 4 quan văn bên Tả (Tây) & 4 quan võ bên Hữu (Đông)
  const civilOfficials: { pos: [number, number, number]; rank: OfficialRank }[] = [
    { pos: [-2.5, 0, -13.0], rank: 'minister' },
    { pos: [-2.5, 0, -10.5], rank: 'mid_official' },
    { pos: [-2.5, 0, -8.0], rank: 'mid_official' },
    { pos: [-2.5, 0, -5.5], rank: 'low_official' },
  ];

  const militaryOfficials: { pos: [number, number, number]; rank: OfficialRank }[] = [
    { pos: [2.5, 0, -13.0], rank: 'guard' },
    { pos: [2.5, 0, -10.5], rank: 'guard' },
    { pos: [2.5, 0, -8.0], rank: 'guard' },
    { pos: [2.5, 0, -5.5], rank: 'guard' },
  ];

  return (
    <group name="CourtOfficialsAssembly">
      {/* 1. Hoàng Đế ngự trên Long Ngai Thái Hòa Điện (nếu người chơi chưa đăng cơ Hoàng Đế) */}
      {characterRank !== 'emperor' && (
        <group position={[0, 1.82, -18.2]} rotation={[0, 0, 0]}>
          <Player rank="emperor" animationState="sit" />
        </group>
      )}

      {/* 2. Dãy 4 Quan Văn bên Tả ban */}
      {civilOfficials.map((npc, idx) => (
        <group
          key={`civil-official-${idx}`}
          position={npc.pos}
          rotation={[0, Math.PI / 2, 0]}
        >
          <Player rank={npc.rank} animationState={officialAnim} />
        </group>
      ))}

      {/* 3. Dãy 4 Quan Võ bên Hữu ban */}
      {militaryOfficials.map((npc, idx) => (
        <group
          key={`military-official-${idx}`}
          position={npc.pos}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <Player rank={npc.rank} animationState={officialAnim} />
        </group>
      ))}
    </group>
  );
};
