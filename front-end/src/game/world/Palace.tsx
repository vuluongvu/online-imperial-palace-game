import React from 'react';
import { Environment } from './Environment';
import { MainHall } from './MainHall';
import { ImperialDragons } from './ImperialDragons';

export const Palace: React.FC = () => {
  return (
    <group name="ImperialPalaceWorld">
      <Environment />
      <MainHall />
      <ImperialDragons />
    </group>
  );
};
