import React, { useState } from 'react';
import { GameWindow } from '../ui/GameWindow';
import { useGameplayStore } from '../../stores/useGameplayStore';
import { COURT_OFFICIALS } from '../../data/palaceGameplayData';

export const RankingWindow: React.FC = () => {
  const leaderboard = useGameplayStore((s) => s.leaderboard);
  const bestExamScore = useGameplayStore((s) => s.bestExamScore);
  const [tab, setTab] = useState<'exam' | 'merit'>('exam');

  return (
    <GameWindow
      title="Bảng Vàng Đại Nghiệp"
      subtitle="Vinh danh đỗ đạt khoa cử và đại thần có công trạng hiển hách"
      icon="🏆"
      width={740}
    >
      <div className="ranking-window-layout">
        <div className="ranking-filter-tabs">
          <button
            type="button"
            className={`clean-filter-btn ${tab === 'exam' ? 'active' : ''}`}
            onClick={() => setTab('exam')}
          >
            📜 Bảng Vàng Khoa Cử Hàn Lâm
          </button>
          <button
            type="button"
            className={`clean-filter-btn ${tab === 'merit' ? 'active' : ''}`}
            onClick={() => setTab('merit')}
          >
            🏛️ Bảng Xếp Hạng Bách Quan
          </button>
        </div>

        {tab === 'exam' ? (
          <div className="ranking-table-container">
            <div className="ranking-my-score-banner">
              <span>Thành tích thi cử của bạn:</span>
              <strong>{bestExamScore} / 500 Điểm</strong>
            </div>

            <table className="clean-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>Hạng</th>
                  <th>Họ Tên Sĩ Tử</th>
                  <th>Danh Hiệu</th>
                  <th style={{ textAlign: 'center' }}>Thời Gian</th>
                  <th style={{ textAlign: 'right' }}>Điểm Số</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => {
                  const isTop1 = entry.rank === 1;
                  const isTop2 = entry.rank === 2;
                  const isTop3 = entry.rank === 3;
                  const isPlayer = entry.scholarName.includes('(Bạn)');

                  return (
                    <tr
                      key={entry.rank}
                      className={`${isPlayer ? 'player-row' : ''} ${
                        isTop1 ? 'top-1' : isTop2 ? 'top-2' : isTop3 ? 'top-3' : ''
                      }`}
                    >
                      <td>
                        <span className={`rank-medal-badge rank-${entry.rank}`}>
                          {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : `#${entry.rank}`}
                        </span>
                      </td>
                      <td className="rank-name-col">
                        <strong>{entry.scholarName}</strong>
                      </td>
                      <td className="rank-title-col">{entry.title}</td>
                      <td style={{ textAlign: 'center' }}>
                        {entry.timeTakenSec} giây
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>
                        {entry.score}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ranking-table-container">
            <table className="clean-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>Hạng</th>
                  <th>Đại Thần Đương Triều</th>
                  <th>Nha Môn Phụ Trách</th>
                  <th>Phẩm Hàm</th>
                  <th style={{ textAlign: 'right' }}>Độ Trung Thành</th>
                </tr>
              </thead>
              <tbody>
                {COURT_OFFICIALS.map((off, idx) => (
                  <tr key={off.id}>
                    <td>
                      <span className="rank-medal-badge">#{idx + 1}</span>
                    </td>
                    <td>
                      <strong>{off.name}</strong>
                    </td>
                    <td>{off.title}</td>
                    <td>{off.rankLabel}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#38a169' }}>
                      {off.loyalty}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </GameWindow>
  );
};
