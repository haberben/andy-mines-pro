import { useState, useCallback } from 'react';

const sounds = {
  bet: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Coin sound
  reveal: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Click/Bubble
  win: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Cash register
  loss: 'https://assets.mixkit.co/active_storage/sfx/1105/1105-preview.mp3', // Explosion/Impact
  adReward: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3' // Success
};

export type SoundEffect = keyof typeof sounds;

export const useAudio = () => {
  const [audioEnabled, setAudioEnabled] = useState(() => {
    const saved = localStorage.getItem('candy_mines_audio');
    return saved === null ? true : saved === 'true';
  });

  const toggleAudio = useCallback(() => {
    setAudioEnabled((prev: boolean) => {
      const newState = !prev;
      localStorage.setItem('candy_mines_audio', String(newState));
      return newState;
    });
  }, []);

  const playSound = useCallback((effect: SoundEffect) => {
    if (!audioEnabled) return;
    
    try {
      const audio = new Audio(sounds[effect]);
      audio.volume = 0.5;
      audio.play().catch(err => {
        // Silent fail for browsers blocking auto-play
        console.debug('Audio play blocked:', err);
      });
    } catch (err) {
      console.error('Audio creation failed:', err);
    }
  }, [audioEnabled]);

  return { audioEnabled, toggleAudio, playSound };
};
