import React from 'react';
import { Environment } from './Environment';
import { MainHall } from './MainHall';
import { ImperialDragons } from './ImperialDragons';
import { ImperialCompoundMap } from './ImperialCompoundMap';
import { useGameStore } from '../../stores/useGameStore';

export const Palace: React.FC = () => {
  const sceneMode = useGameStore((s) => s.sceneMode);

  if (sceneMode === 'compound_map') {
    return <ImperialCompoundMap />;
  }

  return (
    <group name="ImperialPalaceInterior">
      <Environment />
      <MainHall />
      <ImperialDragons />
    </group>
  );
};
