import React from 'react';
import { Environment } from './Environment';
import { MainHall } from './MainHall';
import { ImperialDragons } from './ImperialDragons';
import { SideWingsAndAnnex } from './SideWingsAndAnnex';
import { ImperialCompoundMap } from './ImperialCompoundMap';
import { BuildingInteractiveProps } from './BuildingInteractiveProps';
import { useGameStore } from '../../stores/useGameStore';

export const Palace: React.FC = () => {
  const sceneMode = useGameStore((s) => s.sceneMode);

  if (sceneMode === 'compound_map') {
    return (
      <group name="ImperialCompoundRoot">
        <ImperialCompoundMap />
        <BuildingInteractiveProps />
      </group>
    );
  }

  return (
    <group name="ImperialPalaceInterior">
      <Environment />
      <MainHall />
      <ImperialDragons />
      <SideWingsAndAnnex />
      <BuildingInteractiveProps />
    </group>
  );
};
