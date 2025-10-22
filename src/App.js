import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameList from './components/GameList';
import Tetris from './components/games/Tetris';
import Pacman from './components/games/Pacman';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GameList />} />
          <Route path="/tetris" element={<Tetris />} />
          <Route path="/pacman" element={<Pacman />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
