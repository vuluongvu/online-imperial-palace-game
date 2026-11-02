import React, { useRef, useState } from 'react';
import { useGameplayStore } from '../../stores/useGameplayStore';
import { useUiStore, ChatChannel } from '../../stores/useUiStore';

export const ChatPanel: React.FC = () => {
  const gardenChats = useGameplayStore((s) => s.gardenChats);
  const notificationLog = useGameplayStore((s) => s.notificationLog);
  const sendLocalChat = useGameplayStore((s) => s.sendLocalChat);

  const collapsed = useUiStore((s) => s.chatCollapsed);
  const toggleCollapse = useUiStore((s) => s.toggleChatCollapsed);
  const chatChannel = useUiStore((s) => s.chatChannel);
  const setChatChannel = useUiStore((s) => s.setChatChannel);

  const [inputMessage, setInputMessage] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    sendLocalChat(inputMessage);
    setInputMessage('');
    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 50);
  };

  return (
    <div className={`hud-chat-panel ${collapsed ? 'collapsed' : ''}`}>
      <div className="chat-panel-header">
        <div className="chat-tabs-row">
          {(
            [
              { id: 'all', label: 'Tất Cả' },
              { id: 'nearby', label: 'Gần' },
              { id: 'system', label: 'Hệ Thống' },
            ] as { id: ChatChannel; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`chat-tab-btn ${chatChannel === tab.id ? 'active' : ''}`}
              onClick={() => setChatChannel(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="chat-collapse-btn"
          onClick={toggleCollapse}
          title={collapsed ? 'Mở rộng khung chat' : 'Thu gọn khung chat'}
        >
          {collapsed ? '▴' : '▾'}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="chat-messages-scroll" ref={chatScrollRef}>
            {/* Tin nhắn hệ thống */}
            {(chatChannel === 'all' || chatChannel === 'system') &&
              notificationLog.map((notif) => (
                <div key={notif.id} className={`chat-line system ${notif.type}`}>
                  <span className="chat-tag system">[Hệ Thống]</span>
                  <span className="chat-system-title">{notif.title}:</span>{' '}
                  <span className="chat-system-msg">{notif.message}</span>
                </div>
              ))}

            {/* Tin nhắn người chơi / NPC */}
            {(chatChannel === 'all' || chatChannel === 'nearby') &&
              gardenChats.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-line ${msg.isPlayer ? 'player' : 'npc'}`}
                >
                  <span className="chat-tag rank">[{msg.rankTitle}]</span>{' '}
                  <span className="chat-sender">{msg.sender}:</span>{' '}
                  <span className="chat-content">{msg.text}</span>
                </div>
              ))}
          </div>

          <div className="chat-input-row">
            <input
              type="text"
              className="chat-text-input"
              placeholder="Nhập nội dung trò chuyện (Enter để gửi)..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              type="button"
              className="chat-send-btn"
              onClick={handleSend}
            >
              Gửi
            </button>
          </div>
        </>
      )}
    </div>
  );
};
