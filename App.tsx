import React, { useRef, useEffect } from 'react';
import GameScreen from './components/GameScreen';
import useGameState from './hooks/useGameState';
import { GameStatus } from './types';

// Updated sound URLs to reliable, publicly available sources
const BGM_URL = 'https://cdn.pixabay.com/audio/2022/08/04/audio_2dde6431e5.mp3';
const CORRECT_SOUND_URL = 'https://cdn.pixabay.com/audio/2022/03/15/audio_2b33a5228f.mp3';
const INCORRECT_SOUND_URL = 'https://cdn.pixabay.com/audio/2021/08/04/audio_c6d590e698.mp3';
const LEVEL_UP_SOUND_URL = 'https://cdn.pixabay.com/audio/2022/01/18/audio_83d02b3316.mp3';


const App: React.FC = () => {
  const gameState = useGameState();
  
  const bgmRef = useRef<HTMLAudioElement>(null);
  const correctSfxRef = useRef<HTMLAudioElement>(null);
  const incorrectSfxRef = useRef<HTMLAudioElement>(null);
  const levelUpSfxRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Autoplay BGM
    const playBGM = () => {
      if (bgmRef.current) {
        bgmRef.current.volume = 0.1;
        bgmRef.current.play().catch(() => {
          // Muted autoplay is usually allowed, if not, user interaction will be needed.
          bgmRef.current!.muted = true;
          bgmRef.current!.play();
        });
      }
    };
    
    // Set up a one-time interaction listener to unmute and play BGM
    const handleFirstInteraction = () => {
      if (bgmRef.current && bgmRef.current.muted) {
        bgmRef.current.muted = false;
        bgmRef.current.play();
      }
       window.removeEventListener('click', handleFirstInteraction);
       window.removeEventListener('keydown', handleFirstInteraction);
    };

    playBGM();

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
       window.removeEventListener('click', handleFirstInteraction);
       window.removeEventListener('keydown', handleFirstInteraction);
    }

  }, []);

  const playSound = (sound: 'correct' | 'incorrect' | 'levelUp') => {
    switch(sound) {
      case 'correct':
        correctSfxRef.current?.play();
        break;
      case 'incorrect':
        incorrectSfxRef.current?.play();
        break;
      case 'levelUp':
        levelUpSfxRef.current?.play();
        break;
    }
  };


  return (
    <div className="bg-gradient-to-br from-sky-400 to-blue-600 min-h-screen w-full flex items-center justify-center text-slate-800 p-4 overflow-hidden">
      <audio ref={bgmRef} src={BGM_URL} loop />
      <audio ref={correctSfxRef} src={CORRECT_SOUND_URL} />
      <audio ref={incorrectSfxRef} src={INCORRECT_SOUND_URL} />
      <audio ref={levelUpSfxRef} src={LEVEL_UP_SOUND_URL} />
      
      <div className="w-full max-w-4xl mx-auto">
        <GameScreen {...gameState} playSound={playSound} />
      </div>
    </div>
  );
};

export default App;