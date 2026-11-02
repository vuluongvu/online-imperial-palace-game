import React from 'react';
import { GameWindow } from '../ui/GameWindow';
import { useUiStore } from '../../stores/useUiStore';
import { useGameplayStore } from '../../stores/useGameplayStore';
import { InventoryItem } from '../../data/uiContent';

export const InventoryWindow: React.FC = () => {
  const inventory = useUiStore((s) => s.inventory);
  const filter = useUiStore((s) => s.inventoryFilter);
  const setFilter = useUiStore((s) => s.setInventoryFilter);
  const selectedItemId = useUiStore((s) => s.selectedItemId);
  const selectItem = useUiStore((s) => s.selectItem);
  const useItem = useUiStore((s) => s.useItem);

  const silverCoins = useGameplayStore((s) => s.silverCoins);
  const pushToast = useGameplayStore((s) => s.pushToast);

  const filteredItems = inventory.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const selectedItem =
    inventory.find((i) => i.id === selectedItemId) ?? filteredItems[0] ?? null;

  // 20 ô trong túi đồ (5 cột x 4 hàng)
  const totalSlots = 20;
  const slots: (InventoryItem | null)[] = Array.from(
    { length: totalSlots },
    (_, idx) => filteredItems[idx] ?? null
  );

  const handleUse = (item: InventoryItem) => {
    if (!item.usable) {
      pushToast('info', item.name, 'Vật phẩm này không thể sử dụng trực tiếp.');
      return;
    }
    useItem(item.id);
    pushToast('reward', 'Đã sử dụng', `Đã dùng 1 ${item.name}`);
  };

  return (
    <GameWindow
      title="Túi Đồ Hoàng Cung"
      subtitle="Quản lý trang bị, ấn tín và vật phẩm công vụ"
      icon="🎒"
      width={760}
    >
      <div className="inventory-window-layout">
        {/* Cột trái: Bộ lọc & Lưới ô vật phẩm */}
        <div className="inventory-left-side">
          <div className="inventory-filter-tabs">
            {(
              [
                { id: 'all', label: 'Tất Cả' },
                { id: 'equipment', label: 'Trang Bị' },
                { id: 'quest', label: 'Công Vụ' },
                { id: 'consumable', label: 'Tiêu Hao' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                className={`clean-filter-btn ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="inventory-grid">
            {slots.map((item, idx) => {
              const isSelected = item && item.id === selectedItem?.id;
              return (
                <div
                  key={item ? item.id : `empty-${idx}`}
                  className={`inventory-slot ${item ? `quality-${item.quality}` : 'empty'} ${
                    isSelected ? 'selected' : ''
                  }`}
                  onClick={() => item && selectItem(item.id)}
                >
                  {item && (
                    <>
                      <span className="slot-item-icon">{item.icon}</span>
                      {item.count > 1 && (
                        <span className="slot-item-count">{item.count}</span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="inventory-wallet-footer">
            <span className="wallet-label">Ngân Khố Cá Nhân:</span>
            <span className="wallet-coins">
              🪙 <strong>{silverCoins.toLocaleString()}</strong> Lượng Bạc
            </span>
          </div>
        </div>

        {/* Cột phải: Chi tiết vật phẩm đang chọn */}
        <div className="inventory-right-side">
          {selectedItem ? (
            <div className="item-detail-card">
              <div className="item-detail-header">
                <div className={`item-detail-icon-box quality-${selectedItem.quality}`}>
                  <span className="item-large-icon">{selectedItem.icon}</span>
                </div>
                <div>
                  <h3 className="item-detail-name">{selectedItem.name}</h3>
                  <span className={`item-quality-badge quality-${selectedItem.quality}`}>
                    {selectedItem.quality === 'legendary'
                      ? 'Thần Phẩm'
                      : selectedItem.quality === 'epic'
                        ? 'Cực Phẩm'
                        : selectedItem.quality === 'rare'
                          ? 'Thượng Phẩm'
                          : 'Phổ Thông'}
                  </span>
                </div>
              </div>

              <div className="item-detail-desc">
                {selectedItem.description}
              </div>

              {selectedItem.lore && (
                <div className="item-detail-lore">
                  “{selectedItem.lore}”
                </div>
              )}

              <div className="item-detail-specs">
                <div className="spec-row">
                  <span>Phân loại:</span>
                  <strong>
                    {selectedItem.category === 'equipment'
                      ? 'Trang Bị Quan Viên'
                      : selectedItem.category === 'quest'
                        ? 'Vật Phẩm Nhiệm Vụ'
                        : 'Vật Phẩm Tiêu Hao'}
                  </strong>
                </div>
                <div className="spec-row">
                  <span>Số lượng:</span>
                  <strong>{selectedItem.count} cái</strong>
                </div>
              </div>

              <div className="item-actions-row">
                <button
                  type="button"
                  className={`clean-btn primary full-width ${
                    !selectedItem.usable ? 'disabled' : ''
                  }`}
                  onClick={() => handleUse(selectedItem)}
                  disabled={!selectedItem.usable}
                >
                  {selectedItem.usable ? 'Sử Dụng Vật Phẩm' : 'Không Thể Sử Dụng'}
                </button>
              </div>
            </div>
          ) : (
            <div className="item-empty-detail">
              <span>🎒</span>
              <p>Chọn một vật phẩm từ túi đồ để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </GameWindow>
  );
};
