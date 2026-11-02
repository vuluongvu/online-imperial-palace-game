import { OfficialRank } from '../game/characters/CharacterMaterials';
import { SceneZoneMode } from '../game/world/compoundLayout';

export type BuildingId =
  | 'cong_chinh'
  | 'chinh_dien'
  | 'ngu_thu_phong'
  | 'lai_bo'
  | 'hinh_bo'
  | 'han_lam_vien'
  | 'ngu_hoa_vien';

export type InteractableType = 'npc' | 'object';

export interface InteractableEntity {
  id: string;
  zoneMode: SceneZoneMode;
  buildingId: BuildingId;
  type: InteractableType;
  name: string;
  title: string;
  promptText: string;
  position: [number, number, number];
  rotationY?: number;
  interactRadius: number;
  defaultTab: string;
  npcRank?: OfficialRank;
  propKind?:
    | 'board'
    | 'desk'
    | 'bookshelf'
    | 'map_stand'
    | 'chest'
    | 'throne_info'
    | 'stone_bench';
}

export type QuestStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface QuestReward {
  merit: number;
  coins: number;
  itemTitle?: string;
}

export interface QuestDefinition {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  requirementText: string;
  targetBuildingId: BuildingId;
  targetBuildingName: string;
  targetInteractableId: string;
  reward: QuestReward;
}

export interface CourtOfficialMember {
  id: string;
  name: string;
  title: string;
  ministry: string;
  rankLabel: string;
  status: 'present' | 'on_duty';
  loyalty: number;
}

export interface ImperialEdict {
  id: string;
  title: string;
  content: string;
  issuedBy: string;
  timestamp: string;
  category: 'appointment' | 'policy' | 'reward';
}

export interface ImperialMemorial {
  id: string;
  title: string;
  senderName: string;
  senderTitle: string;
  ministry: string;
  summary: string;
  details: string;
  impactApprove: string;
  impactReject: string;
  rewardMerit: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface OfficialGradeInfo {
  gradeId: string;
  gradeCode: string; // Cửu phẩm -> Nhất phẩm -> Hoàng Đế
  titleVi: string;
  department: string;
  requiredMerit: number;
  salaryCoins: number;
  visualRank: OfficialRank;
  privileges: string[];
}

export interface AppointmentRecord {
  id: string;
  officialName: string;
  fromTitle: string;
  toTitle: string;
  timestamp: string;
  note: string;
}

export interface CaseClue {
  id: string;
  title: string;
  source: string;
  content: string;
}

export interface CaseSuspectOption {
  id: string;
  suspectName: string;
  conclusionText: string;
  isCorrect: boolean;
  explanation: string;
}

export interface CriminalCase {
  id: string;
  code: string;
  title: string;
  difficulty: string;
  summary: string;
  incidentLocation: string;
  clues: CaseClue[];
  options: CaseSuspectOption[];
  rewardMerit: number;
  rewardCoins: number;
}

export interface ExamQuestion {
  id: string;
  question: string;
  category: 'Lịch Sử' | 'Điển Chế' | 'Mưu Lược Logic';
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudyDocument {
  id: string;
  title: string;
  category: string;
  content: string;
  examHint: string;
}

export interface ExamLeaderboardEntry {
  rank: number;
  scholarName: string;
  title: string;
  score: number;
  timeTakenSec: number;
}

export interface LocalChatMessage {
  id: string;
  sender: string;
  rankTitle: string;
  text: string;
  timestamp: string;
  isPlayer?: boolean;
}

export interface EmoteAction {
  id: string;
  icon: string;
  label: string;
  bubbleText: string;
}

export type GameplayToastType =
  | 'quest_accept'
  | 'quest_complete'
  | 'reward'
  | 'promotion'
  | 'edict'
  | 'player'
  | 'info'
  | 'error';

export interface GameplayToast {
  id: string;
  type: GameplayToastType;
  title: string;
  message: string;
  createdAt: number;
}
