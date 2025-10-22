import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GameList.css';

const GameList = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'tetris',
      name: '테트리스',
      description: '클래식 블록 퍼즐 게임',
      icon: '🧩',
      color: '#FF6B6B',
      path: '/tetris'
    },
    {
      id: 'pacman',
      name: '팩맨',
      description: '미로에서 점을 먹으며 유령을 피하는 게임',
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
    <div className="game-list-container">
      <div className="game-list-header">
        <h1>🎮 게임 허브</h1>
        <p>즐거운 게임 시간을 보내세요!</p>
      </div>
      
      <div className="games-grid">
        {games.map((game) => (
          <div
            key={game.id}
            className="game-card"
            style={{ '--game-color': game.color }}
            onClick={() => handleGameClick(game.path)}
          >
            <div className="game-icon">{game.icon}</div>
            <div className="game-info">
              <h3>{game.name}</h3>
              <p>{game.description}</p>
            </div>
            <div className="game-arrow">→</div>
          </div>
        ))}
      </div>
      
      <div className="game-list-footer">
        <p>더 많은 게임이 곧 추가될 예정입니다!</p>
      </div>
    </div>
  );
};

export default GameList;
