import { ChessBoard } from "./components/chess-board";
import { pieces } from "./config/const";

function App() {
  return (
    <div className="w-screen h-screen bg-gray-700">
      <div className="container m-auto h-full">
        <div className="flex flex-col items-center justify-center gap-12 h-full">
          <h1 className="text-5xl font-bold text-white">7IBO Chess App</h1>
          <ChessBoard />
        </div>
      </div>
    </div>
  );
}

export default App;
