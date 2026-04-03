export type GameStatus = 'idle' | 'playing' | 'win' | 'loss';

export interface Tile {
  id: number;
  isMine: boolean;
  isRevealed: boolean;
}

export interface GameState {
  status: GameStatus;
  tiles: Tile[];
  minesCount: number;
  betAmount: number;
  multiplier: number;
  revealedCount: number;
}
