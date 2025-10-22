import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameList from './components/GameList';
import Tetris from './components/games/Tetris';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GameList />} />
          <Route path="/tetris" element={<Tetris />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
