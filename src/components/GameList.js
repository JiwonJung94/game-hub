import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GameList.css';

const GameList = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'tetris',
      name: '테트리스',
      icon: '🧩',
      color: '#FF6B6B',
      path: '/tetris'
    },
    {
      id: 'pacman',
      name: '팩맨',
      icon: '🟡',
      color: '#FFD700',
      path: '/pacman'
    }
    // 새로운 게임을 여기에 추가할 수 있습니다
  ];

  const handleGameClick = (path) => {
    navigate(path);
  };

  return (
    <div className="phone-screen">
      <div className="status-bar">
        <div className="time">9:41</div>
        <div className="status-icons">
          <span>📶</span>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>
      
      <div className="home-screen">
        <div className="app-grid">
          {games.map((game) => (
            <div
              key={game.id}
              className="app-icon"
              style={{ '--app-color': game.color }}
              onClick={() => handleGameClick(game.path)}
            >
              <div className="app-icon-background">
                <div className="app-icon-emoji">{game.icon}</div>
              </div>
              <div className="app-name">{game.name}</div>
            </div>
          ))}
        </div>
        
        <div className="dock">
          <div className="dock-background"></div>
        </div>
      </div>
    </div>
  );
};

export default GameList;
