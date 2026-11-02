import { create } from 'zustand';
import {
  INITIAL_INVENTORY_ITEMS,
  INITIAL_SOCIAL_CONTACTS,
  InventoryItem,
  PlayerSocialContact,
} from '../data/uiContent';

export type GameWindowType =
  | 'character'
  | 'inventory'
  | 'quests'
  | 'social'
  | 'ranking'
  | 'map'
  | 'settings'
  | null;

export type ChatChannel = 'all' | 'nearby' | 'system';

interface UiState {
  // Cửa sổ chính đang mở (chỉ duy nhất 1 cửa sổ mở cùng lúc để tránh rối mắt)
  activeWindow: GameWindowType;
  openWindow: (window: GameWindowType) => void;
  closeWindow: () => void;
  toggleWindow: (window: GameWindowType) => void;

  // Thu gọn / Mở rộng các bảng HUD
  questTrackerCollapsed: boolean;
  toggleQuestTracker: () => void;
  chatCollapsed: boolean;
  toggleChatCollapsed: () => void;
  chatChannel: ChatChannel;
  setChatChannel: (channel: ChatChannel) => void;
  miniMapOpen: boolean;
  toggleMiniMap: () => void;

  // Điều khiển ảo WASD góc dưới
  virtualPadEnabled: boolean;
  toggleVirtualPad: () => void;

  // Túi đồ (Inventory)
  inventory: InventoryItem[];
  inventoryFilter: 'all' | 'equipment' | 'quest' | 'consumable';
  setInventoryFilter: (filter: 'all' | 'equipment' | 'quest' | 'consumable') => void;
  selectedItemId: string | null;
  selectItem: (id: string | null) => void;
  useItem: (id: string) => void;

  // Quan hệ (Social)
  contacts: PlayerSocialContact[];
  sendGreeting: (contactId: string) => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  activeWindow: null,

  openWindow: (window) => {
    // Tự động thoát Pointer Lock nếu đang khóa chuột để tương tác cửa sổ
    if (document.pointerLockElement) {
      document.exitPointerLock?.();
    }
    set({ activeWindow: window });
  },

  closeWindow: () => set({ activeWindow: null }),

  toggleWindow: (window) => {
    const current = get().activeWindow;
    if (current === window) {
      set({ activeWindow: null });
    } else {
      get().openWindow(window);
    }
  },

  questTrackerCollapsed: false,
  toggleQuestTracker: () =>
    set((s) => ({ questTrackerCollapsed: !s.questTrackerCollapsed })),

  chatCollapsed: true,
  toggleChatCollapsed: () =>
    set((s) => ({ chatCollapsed: !s.chatCollapsed })),

  chatChannel: 'all',
  setChatChannel: (chatChannel) => set({ chatChannel }),

  miniMapOpen: false,
  toggleMiniMap: () =>
    set((s) => ({ miniMapOpen: !s.miniMapOpen })),

  virtualPadEnabled: true,
  toggleVirtualPad: () =>
    set((s) => ({ virtualPadEnabled: !s.virtualPadEnabled })),

  inventory: INITIAL_INVENTORY_ITEMS,
  inventoryFilter: 'all',
  setInventoryFilter: (inventoryFilter) => set({ inventoryFilter }),
  selectedItemId: INITIAL_INVENTORY_ITEMS[0]?.id ?? null,
  selectItem: (id) => set({ selectedItemId: id }),

  useItem: (id) => {
    set((state) => {
      const target = state.inventory.find((i) => i.id === id);
      if (!target || !target.usable) return state;

      if (target.count > 1) {
        return {
          inventory: state.inventory.map((i) =>
            i.id === id ? { ...i, count: i.count - 1 } : i
          ),
        };
      }
      return {
        inventory: state.inventory.filter((i) => i.id !== id),
        selectedItemId: null,
      };
    });
  },

  contacts: INITIAL_SOCIAL_CONTACTS,
  sendGreeting: (contactId) => {
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === contactId
          ? { ...c, affinity: Math.min(100, c.affinity + 5) }
          : c
      ),
    }));
  },
}));
