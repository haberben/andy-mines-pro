import { Tile } from '../types/game';

/**
 * Generates a 5x5 grid with the specified number of mines.
 */
export const generateTiles = (minesCount: number): Tile[] => {
  const tiles: Tile[] = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    isMine: false,
    isRevealed: false,
  }));

  // Randomly place mines
  let placedMines = 0;
  while (placedMines < minesCount) {
    const randomIndex = Math.floor(Math.random() * 25);
    if (!tiles[randomIndex].isMine) {
      tiles[randomIndex].isMine = true;
      placedMines++;
    }
  }

  return tiles;
};

/**
 * Calculates the multiplier for the current number of revealed safe tiles.
 * Standard Mines multiplier formula: 
 * (25-prevRevealed)/(25-prevRevealed-minesCount) * houseEdge
 */
export const calculateMultiplier = (minesCount: number, revealedSafeTiles: number): number => {
  if (revealedSafeTiles === 0) return 1.0;
  
  let multiplier = 1.0;
  const houseEdge = 0.97; // 3% house edge

  for (let i = 0; i < revealedSafeTiles; i++) {
    const safeTilesRemaining = 25 - i;
    const currentSafeTiles = safeTilesRemaining - minesCount;
    multiplier *= safeTilesRemaining / currentSafeTiles;
  }

  return Number((multiplier * houseEdge).toFixed(2));
};

/**
 * Gets the next potential multiplier if the player wins.
 */
export const getNextMultiplier = (minesCount: number, revealedSafeTiles: number): number => {
  return calculateMultiplier(minesCount, revealedSafeTiles + 1);
};
