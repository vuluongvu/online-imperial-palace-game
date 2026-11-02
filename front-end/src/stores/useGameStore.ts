import { create } from 'zustand';
import { OfficialRank } from '../game/characters/CharacterMaterials';
import { CharacterAnimationState } from '../game/characters/CharacterAnimations';
import { MAIN_HALL_LAYOUT } from '../game/world/hallLayout';

export type CameraViewPreset =
  | 'emperor_closeup'
  | 'throne_seated'
  | 'overview'
  | 'throne'
  | 'aisle'
  | 'officials'
  | 'entrance';

export interface CameraPresetConfig {
  id: CameraViewPreset;
  label: string;
  description: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface SeatSpot {
  id: string;
  label: string;
  seatPosition: [number, number, number];
  dismountPosition: [number, number, number];
  rotationY: number;
  interactRadius: number;
}

export const SEATING_SPOTS: SeatSpot[] = [
  {
    id: 'imperial_throne',
    label: 'Long Ngai Hoàng Đế (Cửu Long Bảo Tọa)',
    seatPosition: [0, 2.36, -17.55],
    dismountPosition: [0, 1.85, -15.6],
    rotationY: 0,
    interactRadius: 4.2,
  },
  ...MAIN_HALL_LAYOUT.officialDeskPositions.map((desk, idx) => {
    const [x, , z] = desk.pos;
    const chairX = x < 0 ? x - 1.08 : x + 1.08;
    const dismountX = x < 0 ? x + 1.35 : x - 1.35;
    const sideLabel = x < 0 ? `Ghế Quan Văn #${idx + 1}` : `Ghế Quan Võ #${idx - 5}`;
    return {
      id: `official_chair_${idx}`,
      label: sideLabel,
      seatPosition: [chairX, 0.36, z] as [number, number, number],
      dismountPosition: [dismountX, 0.05, z] as [number, number, number],
      rotationY: desk.rotY,
      interactRadius: 2.6,
    };
  }),
];

export const CAMERA_PRESETS: Record<CameraViewPreset, CameraPresetConfig> = {
  emperor_closeup: {
    id: 'emperor_closeup',
    label: 'Cận Cảnh Hoàng Đế (Chibi)',
    description: 'Quan sát chi tiết thiết kế Vua Chibi Big Head, Mũ Miện Lưu & Long Bào',
    position: [0, 2.25, -8.3],
    target: [0, 1.35, -11.0],
  },
  throne_seated: {
    id: 'throne_seated',
    label: 'Hoàng Đế Ngự Long Ngai',
    description: 'Góc nhìn uy nghiêm khi Thiên Tử ngự trên Cửu Long Bảo Tọa giữa Đôi Rồng Vàng',
    position: [0, 4.1, -13.2],
    target: [0, 3.3, -17.6],
  },
  overview: {
    id: 'overview',
    label: 'Toàn Cảnh Chính Điện',
    description: 'Góc nhìn tổng quát Thái Hòa Điện từ lối vào chính hướng về Long Ngai',
    position: [0, 8.5, 16.5],
    target: [0, 2.2, -8],
  },
  throne: {
    id: 'throne',
    label: 'Long Ngai & Cửu Long Hộ Điện',
    description: 'Cận cảnh Bệ Rồng 3 cấp, Đôi Cự Long quấn cột và Long Ngai thếp vàng',
    position: [0, 4.6, -7.2],
    target: [0, 3.4, -17.5],
  },
  aisle: {
    id: 'aisle',
    label: 'Thảm Đỏ Ngự Đạo',
    description: 'Góc nhìn thấp dọc theo thảm đỏ hoàng gia và hàng cột đại điện',
    position: [0, 2.4, 11.0],
    target: [0, 2.5, -14.0],
  },
  officials: {
    id: 'officials',
    label: 'Hàng Ghế Quan Viên',
    description: 'Khu vực bàn ghế gỗ và đệm gấm dành cho bá quan văn võ thiết triều',
    position: [-6.8, 3.8, 3.5],
    target: [2.5, 1.4, -2.5],
  },
  entrance: {
    id: 'entrance',
    label: 'Cửa Gỗ Hoàng Cung',
    description: 'Nhìn từ phía Bệ Rồng hướng ra cổng gỗ 6 cánh phía Nam và ánh nắng chiếu vào',
    position: [0, 4.8, -11.5],
    target: [0, 2.5, 18.0],
  },
};

interface PerformanceMetrics {
  fps: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
}

interface GameState {
  currentPhase: 1 | 2 | 3 | 4;
  cameraMode: 'follow' | 'preset';
  cameraPreset: CameraViewPreset;
  characterRank: OfficialRank;
  animationState: CharacterAnimationState;
  previewAnimOverride: CharacterAnimationState | null;
  holdingJadeTablet: boolean;
  playerPosition: [number, number, number];
  seatedSpotId: string | null;
  nearbySeatId: string | null;
  showAssetModal: boolean;
  showWireframe: boolean;
  lanternAnimationEnabled: boolean;
  metrics: PerformanceMetrics;
  setCameraMode: (mode: 'follow' | 'preset') => void;
  setCameraPreset: (preset: CameraViewPreset) => void;
  setCharacterRank: (rank: OfficialRank) => void;
  setAnimationState: (state: CharacterAnimationState) => void;
  setPreviewAnimOverride: (state: CharacterAnimationState | null) => void;
  toggleJadeTablet: () => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  sitAtSpot: (spotId: string) => void;
  standUp: () => void;
  setNearbySeatId: (spotId: string | null) => void;
  setShowAssetModal: (show: boolean) => void;
  toggleWireframe: () => void;
  toggleLanternAnimation: () => void;
  updateMetrics: (metrics: PerformanceMetrics) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentPhase: 3,
  cameraMode: 'follow',
  cameraPreset: 'emperor_closeup',
  characterRank: 'emperor',
  animationState: 'idle',
  previewAnimOverride: null,
  holdingJadeTablet: true,
  playerPosition: [0, 0, -11.0],
  seatedSpotId: null,
  nearbySeatId: null,
  showAssetModal: false,
  showWireframe: false,
  lanternAnimationEnabled: true,
  metrics: {
    fps: 60,
    drawCalls: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
  },
  setCameraMode: (cameraMode) => set({ cameraMode }),
  setCameraPreset: (cameraPreset) => set({ cameraPreset, cameraMode: 'preset' }),
  setCharacterRank: (characterRank) => set({ characterRank }),
  setAnimationState: (animationState) => set({ animationState }),
  setPreviewAnimOverride: (previewAnimOverride) => set({ previewAnimOverride }),
  toggleJadeTablet: () =>
    set((state) => ({ holdingJadeTablet: !state.holdingJadeTablet })),
  setPlayerPosition: (playerPosition) => set({ playerPosition }),
  sitAtSpot: (spotId) =>
    set({
      seatedSpotId: spotId,
      animationState: 'sit',
      previewAnimOverride: null,
      cameraMode: spotId === 'imperial_throne' ? 'preset' : 'follow',
      cameraPreset: spotId === 'imperial_throne' ? 'throne_seated' : 'emperor_closeup',
    }),
  standUp: () =>
    set({
      seatedSpotId: null,
      animationState: 'idle',
      previewAnimOverride: null,
      cameraMode: 'follow',
    }),
  setNearbySeatId: (nearbySeatId) => set({ nearbySeatId }),
  setShowAssetModal: (showAssetModal) => set({ showAssetModal }),
  toggleWireframe: () => set((state) => ({ showWireframe: !state.showWireframe })),
  toggleLanternAnimation: () =>
    set((state) => ({ lanternAnimationEnabled: !state.lanternAnimationEnabled })),
  updateMetrics: (metrics) => set({ metrics }),
}));
