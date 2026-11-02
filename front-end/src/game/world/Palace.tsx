import React from 'react';
import { Environment } from './Environment';
import { MainHall } from './MainHall';

export const Palace: React.FC = () => {
  return (
    <group name="ImperialPalaceWorld">
      <Environment />
      <MainHall />
    </group>
  );
};
