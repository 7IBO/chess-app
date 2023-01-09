import { ChessBoard } from "./components/chess-board";
import { pieces } from "./config/const";

function App() {
  return (
    <div className="container m-auto">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <ChessBoard />
      </div>
    </div>
  );
}

export default App;
