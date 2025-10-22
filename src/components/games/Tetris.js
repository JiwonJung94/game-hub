import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tetris.css';

// 테트리스 블록 모양 정의
const TETRIS_PIECES = [
  {
    shape: [
      [1, 1, 1, 1]
    ],
    color: '#00f0f0'
  },
  {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#f0f000'
  },
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: '#a000f0'
  },
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: '#00f000'
  },
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: '#f00000'
  },
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: '#f0a000'
  },
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: '#0000f0'
  }
];

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const Tetris = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(() => 
    Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dropTime, setDropTime] = useState(1000);

  // 랜덤한 테트리스 조각 생성
  const createPiece = () => {
    const randomIndex = Math.floor(Math.random() * TETRIS_PIECES.length);
    return {
      ...TETRIS_PIECES[randomIndex],
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETRIS_PIECES[randomIndex].shape[0].length / 2),
      y: 0
    };
  };

  // 게임 초기화
  const initializeGame = useCallback(() => {
    setBoard(Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0)));
    setCurrentPiece(createPiece());
    setNextPiece(createPiece());
    setPosition({ x: 0, y: 0 });
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPaused(false);
    setDropTime(1000);
  }, []);

  // 블록이 보드 경계 내에 있는지 확인
  const isValidPosition = (piece, x, y) => {
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const newX = x + col;
          const newY = y + row;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  };

  // 블록을 보드에 고정
  const placePiece = (piece, x, y) => {
    const newBoard = board.map(row => [...row]);
    
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const boardY = y + row;
          const boardX = x + col;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.color;
          }
        }
      }
    }
    
    setBoard(newBoard);
  };

  // 완성된 라인 제거
  const clearLines = () => {
    const newBoard = board.filter(row => row.some(cell => cell === 0));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    
    if (linesCleared > 0) {
      const newLines = lines + linesCleared;
      const newScore = score + linesCleared * 100 * level;
      const newLevel = Math.floor(newLines / 10) + 1;
      
      setLines(newLines);
      setScore(newScore);
      setLevel(newLevel);
      setDropTime(Math.max(100, 1000 - (newLevel - 1) * 100));
      
      // 빈 라인을 위에 추가
      while (newBoard.length < BOARD_HEIGHT) {
        newBoard.unshift(Array(BOARD_WIDTH).fill(0));
      }
      
      setBoard(newBoard);
    }
  };

  // 블록 이동
  const movePiece = (dx, dy) => {
    if (!currentPiece || gameOver || isPaused) return;
    
    const newX = position.x + dx;
    const newY = position.y + dy;
    
    if (isValidPosition(currentPiece, newX, newY)) {
      setPosition({ x: newX, y: newY });
    } else if (dy > 0) {
      // 아래로 이동할 수 없으면 블록을 고정
      placePiece(currentPiece, position.x, position.y);
      clearLines();
      
      // 다음 조각으로 변경
      setCurrentPiece(nextPiece);
      setNextPiece(createPiece());
      setPosition({ x: nextPiece.x, y: 0 });
      
      // 게임 오버 확인
      if (!isValidPosition(nextPiece, nextPiece.x, 0)) {
        setGameOver(true);
      }
    }
  };

  // 블록 회전
  const rotatePiece = () => {
    if (!currentPiece || gameOver || isPaused) return;
    
    const rotated = {
      ...currentPiece,
      shape: currentPiece.shape[0].map((_, index) =>
        currentPiece.shape.map(row => row[index]).reverse()
      )
    };
    
    if (isValidPosition(rotated, position.x, position.y)) {
      setCurrentPiece(rotated);
    }
  };

  // 자동 낙하
  useEffect(() => {
    if (gameOver || isPaused) return;
    
    const interval = setInterval(() => {
      movePiece(0, 1);
    }, dropTime);
    
    return () => clearInterval(interval);
  }, [dropTime, gameOver, isPaused, currentPiece, position]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePiece(0, 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotatePiece();
          break;
        case ' ':
          e.preventDefault();
          if (isPaused) {
            setIsPaused(false);
          } else {
            setIsPaused(true);
          }
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
  }, [gameOver, isPaused, currentPiece, position, initializeGame]);

  // 게임 시작 시 초기화
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // 보드 렌더링 (현재 블록 포함)
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    if (currentPiece) {
      for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
          if (currentPiece.shape[row][col]) {
            const boardY = position.y + row;
            const boardX = position.x + col;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }
    
    return displayBoard;
  };

  return (
    <div className="tetris-container">
      <div className="tetris-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← 게임 목록으로
        </button>
        <h1>테트리스</h1>
        <div className="game-controls">
          <button onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? '▶️' : '⏸️'}
          </button>
          <button onClick={initializeGame}>🔄</button>
        </div>
      </div>
      
      <div className="tetris-game">
        <div className="game-info">
          <div className="info-item">
            <span>점수: {score}</span>
          </div>
          <div className="info-item">
            <span>레벨: {level}</span>
          </div>
          <div className="info-item">
            <span>라인: {lines}</span>
          </div>
          <div className="next-piece">
            <h3>다음 블록</h3>
            <div className="next-piece-display">
              {nextPiece && nextPiece.shape.map((row, rowIndex) => (
                <div key={rowIndex} className="next-piece-row">
                  {row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`next-piece-cell ${cell ? 'filled' : ''}`}
                      style={{ backgroundColor: cell ? nextPiece.color : 'transparent' }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="game-board">
          {renderBoard().map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`board-cell ${cell ? 'filled' : ''}`}
                  style={{ backgroundColor: cell || 'transparent' }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {gameOver && (
        <div className="game-over">
          <h2>게임 오버!</h2>
          <p>최종 점수: {score}</p>
          <button onClick={initializeGame}>다시 시작</button>
        </div>
      )}
      
      <div className="controls-info">
        <h3>조작법</h3>
        <div className="controls-grid">
          <div className="control-item">← → 이동</div>
          <div className="control-item">↓ 빠른 낙하</div>
          <div className="control-item">↑ 회전</div>
          <div className="control-item">스페이스 일시정지</div>
          <div className="control-item">R 다시 시작</div>
        </div>
      </div>
    </div>
  );
};

export default Tetris;
