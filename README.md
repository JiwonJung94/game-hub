# 🎮 Game Hub

A modern web-based game hub featuring multiple classic games, built with React and designed with a smartphone-inspired interface.

## ✨ Features

### 🎯 Available Games
- **Tetris** - Classic block-stacking puzzle game with full rotation, line clearing, and scoring system
- **Pacman** - Arcade-style maze game with ghosts, power-ups, and classic gameplay mechanics

### 📱 Smartphone-Inspired UI
- Mobile-first design with app icon grid layout
- Touch-friendly interface optimized for both desktop and mobile
- iOS-style visual design with smooth animations
- Responsive layout that works on all screen sizes

### 🚀 Technical Features
- Built with React 18 and modern JavaScript
- React Router for seamless navigation
- CSS3 animations and transitions
- Docker containerization for easy deployment
- Nginx web server for production hosting

## 🛠️ Tech Stack

- **Frontend**: React 18, JavaScript (ES6+), CSS3
- **Routing**: React Router
- **Build Tool**: Create React App
- **Containerization**: Docker, Nginx
- **Styling**: Custom CSS with mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for development)
- Docker (for containerized deployment)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/JiwonJung94/game-hub.git
   cd game-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t game-hub .
   ```

2. **Run the container**
   ```bash
   docker run -p 80:80 game-hub
   ```

3. **Access the application**
   Open `http://localhost` in your browser

## 🎮 How to Play

### Tetris
- **Arrow Keys**: Move and rotate pieces
- **Down Arrow**: Soft drop
- **Space**: Hard drop
- **Goal**: Clear lines to score points

### Pacman
- **Arrow Keys**: Move Pacman
- **Goal**: Eat all dots while avoiding ghosts
- **Power Pellets**: Make ghosts vulnerable temporarily

## 📁 Project Structure

```
game-hub/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── games/         # Game components
│   │   │   ├── Tetris.js  # Tetris game logic
│   │   │   ├── Tetris.css # Tetris styling
│   │   │   ├── Pacman.js  # Pacman game logic
│   │   │   └── Pacman.css # Pacman styling
│   │   ├── GameList.js    # Main game selection
│   │   └── GameList.css   # Game list styling
│   ├── App.js             # Main app component
│   ├── App.css            # App styling
│   ├── index.js           # React entry point
│   └── index.css          # Global styles
├── Dockerfile             # Docker configuration
├── nginx.conf             # Nginx configuration
└── package.json           # Dependencies
```

## 🎨 Design Philosophy

This project emphasizes a **mobile-first, smartphone-inspired design**:

- **App Icon Grid**: Games are presented as app icons on a smartphone home screen
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Visual Consistency**: Unified design language across all games
- **Responsive**: Seamless experience across all device sizes

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Production
```bash
# Build production image
docker build -t game-hub:latest .

# Run with custom port
docker run -p 8080:80 game-hub:latest
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-game`)
3. Commit your changes (`git commit -m 'Add amazing game'`)
4. Push to the branch (`git push origin feature/amazing-game`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Classic arcade games that inspired this project
- React community for excellent documentation
- Modern web technologies that made this possible

---

**Enjoy gaming! 🎮✨**
