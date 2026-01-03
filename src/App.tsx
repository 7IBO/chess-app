/**
 * Composant principal de l'application
 */

import { ChessBoard } from "./components/chess-board";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { BoardProvider } from "./contexts/BoardContext";

function App() {
  return (
    <ErrorBoundary>
      <BoardProvider>
        <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="container m-auto h-full">
            <div className="flex flex-col items-center justify-center gap-8 h-full">
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg">
                7IBO Chess App
              </h1>
              <ChessBoard />
            </div>
          </div>
        </div>
      </BoardProvider>
    </ErrorBoundary>
  );
}

export default App;
