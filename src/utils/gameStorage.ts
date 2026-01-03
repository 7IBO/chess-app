/**
 * Utilitaire pour sauvegarder et charger l'état du jeu avec IndexedDB
 */

import type { CapturedPieces, Move, PieceColor } from "@/types/chess.types";

interface GameState {
  moveHistory: Move[];
  capturedPieces: CapturedPieces;
  currentPlayer: PieceColor;
  timestamp: number;
}

const DB_NAME = "ChessGameDB";
const DB_VERSION = 1;
const STORE_NAME = "gameState";

class GameStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
    });
  }

  async saveGame(state: Omit<GameState, "timestamp">): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db?.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      const gameState: GameState = {
        ...state,
        timestamp: Date.now(),
      };

      const request = store.put({ id: "current", ...gameState });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async loadGame(): Promise<GameState | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db?.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get("current");

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        if (request.result) {
          const { id, ...gameState } = request.result;
          resolve(gameState as GameState);
        } else {
          resolve(null);
        }
      };
    });
  }

  async clearGame(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db?.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete("current");

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log("Game state cleared from IndexedDB");
        resolve();
      };
    });
  }
}

export const gameStorage = new GameStorage();
