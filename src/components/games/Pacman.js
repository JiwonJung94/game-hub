import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pacman.css';

const BOARD_WIDTH = 19;
const BOARD_HEIGHT = 21;
const CELL_SIZE = 20;

// 미로 맵 정의 (1: 벽, 0: 빈 공간, 2: 점, 3: 파워업)
const MAZE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,3,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,3,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,2,1,1,1,0,1,1,1,2,1,1,1,2,1],
  [1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1],
  [1,1,1,1,1,2,1,2,1,1,1,2,1,2,1,1,1,1,1],
  [0,0,0,0,1,2,1,2,1,0,1,2,1,2,1,0,0,0,0],
  [1,1,1,1,1,2,1,2,1,1,1,2,1,2,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,2,1,1,1,0,1,1,1,2,1,1,1,2,1],
  [1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1],
  [1,1,1,1,1,2,1,2,1,1,1,2,1,2,1,1,1,1,1],
  [0,0,0,0,1,2,1,2,1,0,1,2,1,2,1,0,0,0,0],
  [1,1,1,1,1,2,1,2,1,1,1,2,1,2,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,2,1,1,1,0,1,1,1,2,1,1,1,2,1],
  [1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1],
  [1,3,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,3,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

const Pacman = () => {
  const navigate = useNavigate();
  
  // 게임 상태
  const [pacman, setPacman] = useState({ x: 9, y: 15, direction: 'RIGHT', nextDirection: 'RIGHT' });
  const [ghosts, setGhosts] = useState([
    { x: 9, y: 9, direction: 'UP', color: 'red', mode: 'chase' },
    { x: 9, y: 9, direction: 'DOWN', color: 'pink', mode: 'chase' },
    { x: 9, y: 9, direction: 'LEFT', color: 'cyan', mode: 'chase' },
    { x: 9, y: 9, direction: 'RIGHT', color: 'orange', mode: 'chase' }
  ]);
  const [maze, setMaze] = useState(MAZE.map(row => [...row]));
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [powerMode, setPowerMode] = useState(false);
  const [powerTimer, setPowerTimer] = useState(0);

  // 게임 초기화
  const initializeGame = useCallback(() => {
    setPacman({ x: 9, y: 15, direction: 'RIGHT', nextDirection: 'RIGHT' });
    setGhosts([
      { x: 9, y: 9, direction: 'UP', color: 'red', mode: 'chase' },
      { x: 9, y: 9, direction: 'DOWN', color: 'pink', mode: 'chase' },
      { x: 9, y: 9, direction: 'LEFT', color: 'cyan', mode: 'chase' },
      { x: 9, y: 9, direction: 'RIGHT', color: 'orange', mode: 'chase' }
    ]);
    setMaze(MAZE.map(row => [...row]));
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setIsPaused(false);
    setPowerMode(false);
    setPowerTimer(0);
  }, []);

  // 벽 충돌 검사
  const isValidPosition = (x, y) => {
    if (x < 0 || x >= BOARD_WIDTH || y < 0 || y >= BOARD_HEIGHT) {
      return false;
    }
    return maze[y][x] !== 1;
  };

  // 팩맨 이동
  const movePacman = useCallback(() => {
    if (gameOver || gameWon || isPaused) return;

    setPacman(prevPacman => {
      const { x, y, nextDirection } = prevPacman;
      const direction = DIRECTIONS[nextDirection];
      const newX = x + direction.x;
      const newY = y + direction.y;

      // 다음 방향으로 이동 가능한지 확인
      if (isValidPosition(newX, newY)) {
        return { ...prevPacman, x: newX, y: newY, direction: nextDirection };
      }
      
      // 현재 방향으로 이동 가능한지 확인
      const currentDirection = DIRECTIONS[prevPacman.direction];
      const currentNewX = x + currentDirection.x;
      const currentNewY = y + currentDirection.y;
      
      if (isValidPosition(currentNewX, currentNewY)) {
        return { ...prevPacman, x: currentNewX, y: currentNewY };
      }
      
      return prevPacman;
    });
  }, [gameOver, gameWon, isPaused, maze]);

  // 유령 이동
  const moveGhosts = useCallback(() => {
    if (gameOver || gameWon || isPaused) return;

    setGhosts(prevGhosts => {
      return prevGhosts.map(ghost => {
        const { x, y, direction } = ghost;
        const directionVector = DIRECTIONS[direction];
        const newX = x + directionVector.x;
        const newY = y + directionVector.y;

        // 현재 방향으로 이동 가능한지 확인
        if (isValidPosition(newX, newY)) {
          return { ...ghost, x: newX, y: newY };
        }
        
        // 다른 방향으로 이동 시도
        const directions = Object.keys(DIRECTIONS);
        const shuffledDirections = directions.sort(() => Math.random() - 0.5);
        
        for (const newDirection of shuffledDirections) {
          const newDirectionVector = DIRECTIONS[newDirection];
          const testX = x + newDirectionVector.x;
          const testY = y + newDirectionVector.y;
          
          if (isValidPosition(testX, testY)) {
            return { ...ghost, x: testX, y: testY, direction: newDirection };
          }
        }
        
        return ghost;
      });
    });
  }, [gameOver, gameWon, isPaused, maze]);

  // 점수 처리
  const handleDotCollection = useCallback(() => {
    setMaze(prevMaze => {
      const newMaze = prevMaze.map(row => [...row]);
      const { x, y } = pacman;
      
      if (newMaze[y][x] === 2) {
        newMaze[y][x] = 0;
        setScore(prevScore => prevScore + 10);
      } else if (newMaze[y][x] === 3) {
        newMaze[y][x] = 0;
        setScore(prevScore => prevScore + 50);
        setPowerMode(true);
        setPowerTimer(200); // 200 프레임 동안 파워 모드
      }
      
      return newMaze;
    });
  }, [pacman]);

  // 파워 모드 타이머
  useEffect(() => {
    if (powerMode && powerTimer > 0) {
      const timer = setTimeout(() => {
        setPowerTimer(prev => prev - 1);
      }, 50);
      return () => clearTimeout(timer);
    } else if (powerMode && powerTimer === 0) {
      setPowerMode(false);
    }
  }, [powerMode, powerTimer]);

  // 충돌 검사
  const checkCollisions = useCallback(() => {
    const { x: pacmanX, y: pacmanY } = pacman;
    
    ghosts.forEach(ghost => {
      if (ghost.x === pacmanX && ghost.y === pacmanY) {
        if (powerMode) {
          // 유령을 먹음
          setScore(prevScore => prevScore + 200);
          setGhosts(prevGhosts => 
            prevGhosts.map(g => 
              g === ghost ? { ...g, x: 9, y: 9 } : g
            )
          );
        } else {
          // 팩맨이 죽음
          setLives(prevLives => {
            const newLives = prevLives - 1;
            if (newLives <= 0) {
              setGameOver(true);
            } else {
              // 팩맨 위치 리셋
              setPacman({ x: 9, y: 15, direction: 'RIGHT', nextDirection: 'RIGHT' });
            }
            return newLives;
          });
        }
      }
    });
  }, [pacman, ghosts, powerMode]);

  // 게임 승리 조건 확인
  const checkWinCondition = useCallback(() => {
    const hasDots = maze.some(row => row.some(cell => cell === 2 || cell === 3));
    if (!hasDots) {
      setGameWon(true);
    }
  }, [maze]);

  // 게임 루프
  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!gameOver && !gameWon && !isPaused) {
        movePacman();
        moveGhosts();
        handleDotCollection();
        checkCollisions();
        checkWinCondition();
      }
    }, 150);

    return () => clearInterval(gameLoop);
  }, [movePacman, moveGhosts, handleDotCollection, checkCollisions, checkWinCondition, gameOver, gameWon, isPaused]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver || gameWon) return;
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setPacman(prev => ({ ...prev, nextDirection: 'UP' }));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setPacman(prev => ({ ...prev, nextDirection: 'DOWN' }));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setPacman(prev => ({ ...prev, nextDirection: 'LEFT' }));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setPacman(prev => ({ ...prev, nextDirection: 'RIGHT' }));
          break;
        case ' ':
          e.preventDefault();
          setIsPaused(!isPaused);
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          initializeGame();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, gameWon, isPaused, initializeGame]);

  // 게임 시작 시 초기화
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // 팩맨 회전 각도 계산
  const getPacmanRotation = (direction) => {
    switch (direction) {
      case 'UP': return 270;
      case 'DOWN': return 90;
      case 'LEFT': return 180;
      case 'RIGHT': return 0;
      default: return 0;
    }
  };

  return (
    <div className="pacman-container">
      <div className="pacman-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← 게임 목록으로
        </button>
        <h1>팩맨</h1>
        <div className="game-controls">
          <button onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? '▶️' : '⏸️'}
          </button>
          <button onClick={initializeGame}>🔄</button>
        </div>
      </div>
      
      <div className="pacman-game">
        <div className="game-info">
          <div className="info-item">
            <span>점수: {score}</span>
          </div>
          <div className="info-item">
            <span>생명: {'❤️'.repeat(lives)}</span>
          </div>
          {powerMode && (
            <div className="info-item power-mode">
              <span>파워 모드! {Math.ceil(powerTimer / 4)}초</span>
            </div>
          )}
        </div>
        
        <div className="game-board">
          <div 
            className="maze"
            style={{
              width: BOARD_WIDTH * CELL_SIZE,
              height: BOARD_HEIGHT * CELL_SIZE
            }}
          >
            {maze.map((row, rowIndex) => 
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell cell-${cell}`}
                  style={{
                    left: colIndex * CELL_SIZE,
                    top: rowIndex * CELL_SIZE,
                    width: CELL_SIZE,
                    height: CELL_SIZE
                  }}
                />
              ))
            )}
            
            {/* 팩맨 */}
            <div
              className={`pacman ${powerMode ? 'power-mode' : ''}`}
              style={{
                left: pacman.x * CELL_SIZE + 2,
                top: pacman.y * CELL_SIZE + 2,
                width: CELL_SIZE - 4,
                height: CELL_SIZE - 4,
                transform: `rotate(${getPacmanRotation(pacman.direction)}deg)`
              }}
            />
            
            {/* 유령들 */}
            {ghosts.map((ghost, index) => (
              <div
                key={index}
                className={`ghost ghost-${ghost.color} ${powerMode ? 'vulnerable' : ''}`}
                style={{
                  left: ghost.x * CELL_SIZE + 2,
                  top: ghost.y * CELL_SIZE + 2,
                  width: CELL_SIZE - 4,
                  height: CELL_SIZE - 4
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {(gameOver || gameWon) && (
        <div className="game-over">
          <h2>{gameWon ? '축하합니다!' : '게임 오버!'}</h2>
          <p>최종 점수: {score}</p>
          <button onClick={initializeGame}>다시 시작</button>
        </div>
      )}
      
      <div className="controls-info">
        <h3>조작법</h3>
        <div className="controls-grid">
          <div className="control-item">← → ↑ ↓ 이동</div>
          <div className="control-item">스페이스 일시정지</div>
          <div className="control-item">R 다시 시작</div>
          <div className="control-item">점을 먹어 점수 획득</div>
          <div className="control-item">파워업으로 유령 잡기</div>
        </div>
      </div>
    </div>
  );
};

export default Pacman;
