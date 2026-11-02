import { create } from 'zustand';
import { OfficialRank } from '../game/characters/CharacterMaterials';
import { CharacterAnimationState } from '../game/characters/CharacterAnimations';
import { MAIN_HALL_LAYOUT } from '../game/world/hallLayout';
import { PALACE_LANDMARKS, SceneZoneMode } from '../game/world/compoundLayout';

export type CameraViewPreset =
  | 'overview'
  | 'throne'
  | 'roof_truss_canopy'
  | 'ta_vu_waiting'
  | 'huu_vu_reception'
  | 'hau_sanh_rear'
  | 'corridors_east_west'
  | 'emperor_closeup'
  | 'throne_seated'
  | 'aisle'
  | 'officials'
  | 'entrance'
  | 'compound_panorama';

export type InteriorRoomKey =
  | 'main_hall'
  | 'corridors'
  | 'ta_vu'
  | 'huu_vu'
  | 'hau_sanh';

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
  // Ghế ngồi trong Tả Vu (Gian Chờ Quan Viên)
  {
    id: 'ta_vu_bench_north',
    label: 'Trường Kỷ Tả Vu (Gian Chờ Quan Viên - Bắc)',
    seatPosition: [-26.75, 0.42, -5.6],
    dismountPosition: [-24.2, 0.05, -5.6],
    rotationY: Math.PI / 2,
    interactRadius: 3.0,
  },
  {
    id: 'ta_vu_bench_south',
    label: 'Trường Kỷ Tả Vu (Gian Chờ Quan Viên - Nam)',
    seatPosition: [-26.75, 0.42, 5.6],
    dismountPosition: [-24.2, 0.05, 5.6],
    rotationY: Math.PI / 2,
    interactRadius: 3.0,
  },
  // Ghế ngồi trong Hữu Vu (Phòng Phụ Tiếp Khách)
  {
    id: 'huu_vu_sap_gu',
    label: 'Sập Gụ Khảm Trai (Hữu Vu – Phòng Tiếp Khách)',
    seatPosition: [28.0, 0.56, 0],
    dismountPosition: [26.2, 0.05, 0],
    rotationY: -Math.PI / 2,
    interactRadius: 3.2,
  },
  {
    id: 'huu_vu_chair_north',
    label: 'Ghế Thái Sư Tiếp Khách (Hữu Vu - Bắc)',
    seatPosition: [24.0, 0.44, -5.2],
    dismountPosition: [22.6, 0.05, -5.2],
    rotationY: Math.PI / 2,
    interactRadius: 2.8,
  },
  // Ghế ngồi tại Hậu Sảnh (Lối Ra Phía Sau)
  {
    id: 'hau_sanh_throne_chair',
    label: 'Bảo Tọa Ngự Án Hậu Sảnh (Cần Chánh)',
    seatPosition: [0, 0.48, -26.35],
    dismountPosition: [0, 0.05, -24.1],
    rotationY: 0,
    interactRadius: 3.0,
  },
];

export const CAMERA_PRESETS: Record<CameraViewPreset, CameraPresetConfig> = {
  overview: {
    id: 'overview',
    label: 'Toàn Cảnh Nội Điện Thái Hòa',
    description: 'Góc nhìn tổng quát Thái Hòa Điện phong cách Huế hướng về Long Ngai & Bửu Tán',
    position: [0, 8.2, 16.2],
    target: [0, 2.5, -8.5],
  },
  throne: {
    id: 'throne',
    label: 'Long Ngai, Bửu Tán & Ngự Án Hoàng Đế',
    description: 'Cận cảnh Bệ Rồng 3 cấp, Bửu Tán Hoàng Kim, Ngự Án và Đôi Cự Long quấn cột',
    position: [0, 4.6, -7.2],
    target: [0, 3.4, -17.2],
  },
  roof_truss_canopy: {
    id: 'roof_truss_canopy',
    label: 'Hệ Vì Kèo Chồng Rường & Nhất Thi Nhất Họa',
    description: 'Chi tiết kết cấu gỗ vì kèo giả thủ, ô hộc Nhất Thi Nhất Họa và Bửu Tán trên trần',
    position: [0, 4.8, -2.5],
    target: [0, 7.6, -15.0],
  },
  ta_vu_waiting: {
    id: 'ta_vu_waiting',
    label: 'Tả Vu – Gian Chờ Quan Viên (Phía Tây)',
    description: 'Gian chờ bá quan với Án thư trực phòng, Trường kỷ trà đạo, Tủ điển tịch và Quan viên chờ triều',
    position: [-21.2, 4.3, 1.8],
    target: [-26.5, 1.4, -1.2],
  },
  huu_vu_reception: {
    id: 'huu_vu_reception',
    label: 'Hữu Vu – Phòng Phụ Tiếp Khách (Phía Đông)',
    description: 'Phòng tiếp sứ thần & mệnh quan với Sập gụ tủ chè, Ghế Thái Sư, Lư trầm và Đôi lục bình Pháp Lam',
    position: [21.2, 4.3, 1.8],
    target: [26.6, 1.4, -0.8],
  },
  hau_sanh_rear: {
    id: 'hau_sanh_rear',
    label: 'Hậu Sảnh & Lối Ra Phía Sau (Phía Bắc)',
    description: 'Hành lang Hậu điện kết nối qua 2 cửa Bắc với Ngự Án Hậu Sảnh và Cổng Tam Quan Hậu Điện',
    position: [0, 4.5, -31.8],
    target: [0, 1.6, -24.8],
  },
  corridors_east_west: {
    id: 'corridors_east_west',
    label: 'Hành Lang Hai Bên & Cửa Gỗ Liên Thông',
    description: 'Hành lang Đông – Tây Trường Lang kết nối đại điện với các gian phụ qua hệ cửa gỗ cung đình',
    position: [-18.3, 3.2, 11.5],
    target: [-18.3, 1.8, -5.0],
  },
  emperor_closeup: {
    id: 'emperor_closeup',
    label: 'Cận Cảnh Hoàng Đế (Chibi)',
    description: 'Quan sát chi tiết thiết kế Vua Chibi Big Head, Mũ Miện Lưu & Long Bào',
    position: [0, 2.25, -6.8],
    target: [0, 1.35, -9.5],
  },
  throne_seated: {
    id: 'throne_seated',
    label: 'Hoàng Đế Ngự Long Ngai',
    description: 'Góc nhìn uy nghiêm khi Thiên Tử ngự trên Cửu Long Bảo Tọa dưới Bửu Tán Hoàng Kim',
    position: [0, 4.1, -13.2],
    target: [0, 3.3, -17.6],
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
    label: 'Khu Vực Bá Quan Văn Võ & Án Thư',
    description: 'Khu vực 12 bàn án thư bày nghiên mực, giá bút lông, tấu chương, bình Pháp Lam và chiếu cạp điều',
    position: [-6.8, 3.8, 3.5],
    target: [2.5, 1.4, -2.5],
  },
  entrance: {
    id: 'entrance',
    label: 'Bộ Cửa Gỗ Cung Đình (Tiền Điện)',
    description: 'Nhìn từ phía Bệ Rồng hướng ra cổng gỗ 6 cánh phía Nam và ánh nắng chiếu vào',
    position: [0, 4.8, -11.5],
    target: [0, 2.5, 18.0],
  },
  compound_panorama: {
    id: 'compound_panorama',
    label: 'Toàn Cảnh Bản Đồ Hoàng Cung',
    description: 'Góc nhìn tổng quát Quần thể Hoàng Cung từ Cổng Chính tới Ngự Thư Phòng',
    position: [0, 42, 68],
    target: [0, 2, -2],
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
  sceneMode: SceneZoneMode;
  activeLandmarkId: string;
  activeInteriorRoom: InteriorRoomKey;
  cameraMode: 'follow' | 'preset';
  cameraPreset: CameraViewPreset;
  characterRank: OfficialRank;
  animationState: CharacterAnimationState;
  previewAnimOverride: CharacterAnimationState | null;
  holdingJadeTablet: boolean;
  playerPosition: [number, number, number];
  teleportTarget: [number, number, number] | null;
  virtualInput: { x: number; z: number };
  seatedSpotId: string | null;
  nearbySeatId: string | null;
  laiBoQuestCompleted: boolean;
  showInspectorDrawer: boolean;
  showAssetModal: boolean;
  showWireframe: boolean;
  lanternAnimationEnabled: boolean;
  metrics: PerformanceMetrics;
  setSceneMode: (mode: SceneZoneMode) => void;
  navigateToLandmark: (landmarkId: string) => void;
  navigateToInteriorRoom: (room: InteriorRoomKey) => void;
  setCameraMode: (mode: 'follow' | 'preset') => void;
  setCameraPreset: (preset: CameraViewPreset) => void;
  setCharacterRank: (rank: OfficialRank) => void;
  setAnimationState: (state: CharacterAnimationState) => void;
  setPreviewAnimOverride: (state: CharacterAnimationState | null) => void;
  toggleJadeTablet: () => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  clearTeleportTarget: () => void;
  setVirtualInput: (input: { x: number; z: number }) => void;
  sitAtSpot: (spotId: string) => void;
  standUp: () => void;
  setNearbySeatId: (spotId: string | null) => void;
  completeLaiBoQuest: () => void;
  toggleInspectorDrawer: () => void;
  setShowAssetModal: (show: boolean) => void;
  toggleWireframe: () => void;
  toggleLanternAnimation: () => void;
  updateMetrics: (metrics: PerformanceMetrics) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentPhase: 4,
  sceneMode: 'main_hall_interior',
  activeLandmarkId: 'chinh_dien',
  activeInteriorRoom: 'main_hall',
  cameraMode: 'preset',
  cameraPreset: 'overview',
  characterRank: 'emperor',
  animationState: 'idle',
  previewAnimOverride: null,
  holdingJadeTablet: true,
  playerPosition: [0, 0, -9.5],
  teleportTarget: null,
  virtualInput: { x: 0, z: 0 },
  seatedSpotId: null,
  nearbySeatId: null,
  laiBoQuestCompleted: false,
  showInspectorDrawer: false,
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
  setSceneMode: (sceneMode) =>
    set(() => {
      if (sceneMode === 'main_hall_interior') {
        return {
          sceneMode,
          activeInteriorRoom: 'main_hall',
          seatedSpotId: null,
          teleportTarget: [0, 0, -9.5],
          playerPosition: [0, 0, -9.5],
          cameraMode: 'preset',
          cameraPreset: 'overview',
        };
      }
      return {
        sceneMode,
        seatedSpotId: null,
        teleportTarget: [0, 0, 20],
        playerPosition: [0, 0, 20],
        cameraMode: 'preset',
        cameraPreset: 'compound_panorama',
      };
    }),
  navigateToLandmark: (landmarkId) =>
    set((state) => {
      const lm = PALACE_LANDMARKS.find((l) => l.id === landmarkId);
      if (!lm) return {};
      return {
        sceneMode: 'compound_map',
        activeLandmarkId: landmarkId,
        seatedSpotId: null,
        teleportTarget: lm.spawnPoint,
        playerPosition: lm.spawnPoint,
        cameraMode: 'follow',
        laiBoQuestCompleted:
          landmarkId === 'lai_bo' ? true : state.laiBoQuestCompleted,
      };
    }),
  navigateToInteriorRoom: (room) =>
    set(() => {
      const roomConfigs: Record<
        InteriorRoomKey,
        { pos: [number, number, number]; preset: CameraViewPreset }
      > = {
        main_hall: { pos: [0, 0, -9.5], preset: 'overview' },
        corridors: { pos: [-18.3, 0, -5.0], preset: 'corridors_east_west' },
        ta_vu: { pos: [-23.8, 0, -1.5], preset: 'ta_vu_waiting' },
        huu_vu: { pos: [23.8, 0, -1.5], preset: 'huu_vu_reception' },
        hau_sanh: { pos: [0, 0, -24.0], preset: 'hau_sanh_rear' },
      };
      const cfg = roomConfigs[room];
      return {
        sceneMode: 'main_hall_interior',
        activeInteriorRoom: room,
        seatedSpotId: null,
        teleportTarget: cfg.pos,
        playerPosition: cfg.pos,
        cameraMode: 'preset',
        cameraPreset: cfg.preset,
      };
    }),
  setCameraMode: (cameraMode) => set({ cameraMode }),
  setCameraPreset: (cameraPreset) => set({ cameraPreset, cameraMode: 'preset' }),
  setCharacterRank: (characterRank) => set({ characterRank }),
  setAnimationState: (animationState) => set({ animationState }),
  setPreviewAnimOverride: (previewAnimOverride) => set({ previewAnimOverride }),
  toggleJadeTablet: () =>
    set((state) => ({ holdingJadeTablet: !state.holdingJadeTablet })),
  setPlayerPosition: (playerPosition) => set({ playerPosition }),
  clearTeleportTarget: () => set({ teleportTarget: null }),
  setVirtualInput: (virtualInput) => set({ virtualInput }),
  sitAtSpot: (spotId) =>
    set({
      sceneMode: 'main_hall_interior',
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
  completeLaiBoQuest: () => set({ laiBoQuestCompleted: true }),
  toggleInspectorDrawer: () =>
    set((state) => ({ showInspectorDrawer: !state.showInspectorDrawer })),
  setShowAssetModal: (showAssetModal) => set({ showAssetModal }),
  toggleWireframe: () => set((state) => ({ showWireframe: !state.showWireframe })),
  toggleLanternAnimation: () =>
    set((state) => ({ lanternAnimationEnabled: !state.lanternAnimationEnabled })),
  updateMetrics: (metrics) => set({ metrics }),
}));
