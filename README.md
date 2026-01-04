# ♟️ 7IBO Chess App

A modern, feature-rich chess application built with React, TypeScript, and Tailwind CSS. Play chess with full rule validation, move history, undo/redo functionality, and persistent game state.

![Chess App](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Features

### Core Chess Functionality
- ✅ **Complete Chess Rules** - All standard chess rules including castling, en passant, and pawn promotion
- ✅ **Move Validation** - Real-time validation of legal moves with visual indicators
- ✅ **Check & Checkmate Detection** - Automatic detection of check, checkmate, and stalemate
- ✅ **Drag & Drop Interface** - Intuitive piece movement with smooth animations
- ✅ **Visual Feedback** - Highlights for selected pieces, valid moves, last move, and king in check

### Advanced Features
- 🔄 **Undo/Redo** - Navigate through move history with full state restoration
- 💾 **Auto-Save** - Game state persists using IndexedDB (survives page refresh)
- 📝 **Move History** - Complete record of all moves in algebraic notation
- 🎯 **Captured Pieces** - Track all captured pieces for both players
- 🎨 **Modern UI** - Beautiful gradient-based design with smooth transitions
- ⚡ **Performance Optimized** - React.memo optimization for efficient rendering

### Developer Features
- 🧪 **Full Test Coverage** - Comprehensive test suite with Vitest
- 🔍 **Type Safety** - 100% TypeScript with strict type checking
- 🎨 **Code Quality** - Biome linter and formatter for consistent code style
- 🛡️ **Error Boundaries** - Graceful error handling with user-friendly messages
- 📦 **Modern Build** - Lightning-fast development with Vite

## 🚀 Getting Started

### Prerequisites

- **Bun** >= 1.0.0 (or Node.js >= 18.0.0)
- A modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/chess-app.git
   cd chess-app
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start the development server**
   ```bash
   bun run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎮 How to Play

1. **Starting a Game**
   - The board is set up automatically with white pieces at the bottom
   - White always moves first

2. **Making Moves**
   - Click on a piece to select it (valid moves will be highlighted in blue)
   - Click on a highlighted square to move the piece
   - Alternatively, drag and drop pieces to their destination

3. **Special Moves**
   - **Castling**: Click on your king and then click two squares toward a rook
   - **En Passant**: Automatically detected and allowed when conditions are met
   - **Pawn Promotion**: Choose a piece when your pawn reaches the opposite end

4. **Game Controls**
   - **Undo**: Revert the last move (↶ button or Ctrl+Z)
   - **Redo**: Replay an undone move (↷ button or Ctrl+Y)
   - **New Game**: Start a fresh game (resets the board)

## 📂 Project Structure

```
chess-app/
├── src/
│   ├── components/           # React components
│   │   ├── chess-board/      # Main board and pieces
│   │   ├── game-panel/       # Sidebar with game info
│   │   ├── promotion-dialog/ # Pawn promotion UI
│   │   └── ErrorBoundary.tsx # Error handling
│   ├── models/               # Chess logic (OOP)
│   │   ├── Board.ts          # Game board and rules
│   │   ├── Piece.ts          # Base piece class
│   │   ├── Pawn.ts           # Pawn-specific logic
│   │   ├── Rook.ts           # Rook moves
│   │   ├── Knight.ts         # Knight moves
│   │   ├── Bishop.ts         # Bishop moves
│   │   ├── Queen.ts          # Queen moves
│   │   └── King.ts           # King and castling
│   ├── hooks/                # React custom hooks
│   │   └── useChessGame.ts   # Main game logic hook
│   ├── contexts/             # React context providers
│   │   └── BoardContext.tsx  # Board state management
│   ├── utils/                # Utility functions
│   │   ├── gameStorage.ts    # IndexedDB persistence
│   │   └── logger.ts         # Conditional logging
│   ├── constants/            # App constants
│   ├── types/                # TypeScript types
│   ├── data/                 # Initial data
│   └── test/                 # Test files
├── public/                   # Static assets (piece images)
├── biome.json               # Biome configuration
├── vitest.config.ts         # Vitest configuration
├── tailwind.config.ts       # Tailwind CSS config
└── package.json             # Dependencies
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
bun run test

# Run tests with UI
bun run test:ui

# Generate coverage report
bun run test:coverage
```

Current test coverage: **15/15 tests passing** ✅

## 🛠️ Development

### Available Scripts

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run preview      # Preview production build
bun run lint         # Check code with Biome
bun run lint:fix     # Fix linting issues
bun run format       # Format code with Biome
bun run test         # Run tests
bun run test:ui      # Run tests with UI
bun run test:coverage # Generate coverage report
```

### Code Style

This project uses **Biome** for linting and formatting:
- 2 spaces indentation
- Double quotes
- Semicolons enforced
- Line width: 100 characters
- Accessibility rules enabled

### Architecture

The chess app follows a **Model-View-Controller (MVC)** pattern:

- **Models** (`src/models/`): Pure TypeScript classes handling chess logic
- **Views** (`src/components/`): React components for UI rendering
- **Controllers** (`src/hooks/`): React hooks connecting models and views

Key design principles:
- **Separation of Concerns**: Chess logic is independent of React
- **Immutability**: Game state changes create new history entries
- **Type Safety**: Comprehensive TypeScript types prevent errors
- **Performance**: Memoization prevents unnecessary re-renders

## 🎨 Technologies

### Core
- **React 19** - UI library
- **TypeScript 5.7** - Type-safe JavaScript
- **Vite 7** - Build tool and dev server

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - CSS processing

### Testing
- **Vitest 4** - Fast unit test framework
- **Testing Library** - React component testing
- **jsdom** - DOM simulation

### Code Quality
- **Biome 2** - Fast linter and formatter
- **TypeScript strict mode** - Maximum type safety

### Storage
- **IndexedDB** - Client-side database for game persistence

## 🔮 Future Enhancements

Potential features for future development:

- [ ] **Game Timer** - Clock for timed matches (blitz, rapid, classical)
- [ ] **PGN Export/Import** - Save and load games in standard notation
- [ ] **Chess Engine** - AI opponent with adjustable difficulty
- [ ] **Multiplayer** - Online play with WebSockets
- [ ] **Move Annotations** - Add comments and variations
- [ ] **Opening Database** - Recognize and name chess openings
- [ ] **Puzzle Mode** - Tactical puzzles for training
- [ ] **Theme Customization** - Multiple board and piece styles
- [ ] **Sound Effects** - Audio feedback for moves
- [ ] **Board Rotation** - View from black's perspective
- [ ] **Move Suggestions** - Hint system for beginners
- [ ] **Game Analysis** - Post-game review with engine evaluation

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**7IBO** - Chess Application

## 🙏 Acknowledgments

- Chess piece images from standard chess icon sets
- Inspired by classical chess applications
- Built with modern web technologies

---

**Enjoy your game!** ♟️
