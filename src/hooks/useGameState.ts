import { useState, useCallback, useEffect } from 'react';
import { GameStatus, Tile } from '../types/game';
import { generateTiles, calculateMultiplier } from '../logic/mines';
import { supabase } from '../lib/supabase';

export const useGameState = (userId?: string, initialBalance: number = 0) => {
  const [balance, setBalance] = useState(initialBalance);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [minesCount, setMinesCount] = useState(3);
  const [betAmount, setBetAmount] = useState(10);
  const [revealedSafeTiles, setRevealedSafeTiles] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);

  // Sync balance with Supabase if userId is provided
  useEffect(() => {
    if (userId) {
      const fetchBalance = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', userId)
          .single();
        if (data) setBalance(data.balance);
      };
      
      fetchBalance();
    }
  }, [userId]);

  const updateServerBalance = async (newBalance: number) => {
    if (!userId) {
      setBalance(newBalance);
      return;
    }
    
    // Optimistic update
    setBalance(newBalance);
    
    const { error } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', userId);
      
    if (error) {
      console.error('Balance sync error:', error);
      // Fallback or alert
    }
  };

  const startGame = useCallback(async () => {
    if (balance < betAmount) {
      alert('Insufficient balance!');
      return;
    }
    
    await updateServerBalance(balance - betAmount);
    setTiles(generateTiles(minesCount));
    setRevealedSafeTiles(0);
    setMultiplier(1.0);
    setStatus('playing');
  }, [balance, betAmount, minesCount, userId]);

  const revealTile = useCallback((tileId: number) => {
    if (status !== 'playing') return;

    setTiles(prev => prev.map(tile => {
      if (tile.id === tileId && !tile.isRevealed) {
        if (tile.isMine) {
          setStatus('loss');
          return { ...tile, isRevealed: true };
        } else {
          const nextRevealedCount = revealedSafeTiles + 1;
          setRevealedSafeTiles(nextRevealedCount);
          setMultiplier(calculateMultiplier(minesCount, nextRevealedCount));
        }
        return { ...tile, isRevealed: true };
      }
      return tile;
    }));
  }, [status, minesCount, revealedSafeTiles]);

  const cashout = useCallback(async () => {
    if (status !== 'playing' || revealedSafeTiles === 0) return;
    const winAmount = betAmount * multiplier;
    const newBalance = balance + winAmount;
    
    await updateServerBalance(newBalance);
    setStatus('win');

    // Store history
    if (userId) {
      await supabase.from('game_history').insert({
        user_id: userId,
        bet_amount: betAmount,
        multiplier: multiplier,
        win_amount: winAmount,
        mines_count: minesCount
      });
    }
  }, [status, betAmount, multiplier, revealedSafeTiles, balance, userId, minesCount]);

  const rewardAd = useCallback(async (amount: number = 100) => {
    const newBalance = balance + amount;
    await updateServerBalance(newBalance);
  }, [balance, userId]);

  return {
    balance,
    status,
    tiles,
    minesCount,
    setMinesCount,
    betAmount,
    setBetAmount,
    revealedSafeTiles,
    multiplier,
    startGame,
    revealTile,
    cashout,
    rewardAd
  };
};
