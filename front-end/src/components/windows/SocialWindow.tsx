import React from 'react';
import { GameWindow } from '../ui/GameWindow';
import { useUiStore } from '../../stores/useUiStore';
import { useGameplayStore } from '../../stores/useGameplayStore';

export const SocialWindow: React.FC = () => {
  const contacts = useUiStore((s) => s.contacts);
  const sendGreeting = useUiStore((s) => s.sendGreeting);
  const pushToast = useGameplayStore((s) => s.pushToast);

  const handleGreeting = (id: string, name: string) => {
    sendGreeting(id);
    pushToast(
      'reward',
      'Đã gửi lời chào',
      `Đã gửi thiếp vấn an đến ${name} (+5 Hảo cảm)`
    );
  };

  return (
    <GameWindow
      title="Quan Hệ Đồng Liêu"
      subtitle="Danh sách quan viên và hảo hữu đang có mặt tại Cấm Thành"
      icon="👥"
      width={740}
    >
      <div className="social-window-layout">
        <div className="social-contacts-list">
          {contacts.map((contact) => (
            <div key={contact.id} className="social-contact-card">
              <div className="contact-avatar-box">
                <span className="contact-avatar-icon">🎓</span>
                <span className={`contact-status-dot ${contact.status}`} />
              </div>

              <div className="contact-info-col">
                <div className="contact-name-row">
                  <h4 className="contact-name">{contact.name}</h4>
                  <span className="contact-status-label">
                    {contact.status === 'online'
                      ? 'Đang trực triều'
                      : contact.status === 'busy'
                        ? 'Đang thiết triều'
                        : 'Nghỉ dưỡng'}
                  </span>
                </div>

                <div className="contact-rank">{contact.rankTitle}</div>

                <div className="contact-meta-row">
                  <span>📍 {contact.location}</span>
                  <span>🎖️ {contact.merit} Công trạng</span>
                  <span>❤️ Hảo cảm: {contact.affinity}/100</span>
                </div>
              </div>

              <div className="contact-actions-col">
                <button
                  type="button"
                  className="clean-btn secondary"
                  onClick={() => handleGreeting(contact.id, contact.name)}
                  title="Gửi thiếp vấn an tăng hảo cảm"
                >
                  ✉️ Vấn An
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GameWindow>
  );
};
