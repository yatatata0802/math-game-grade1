
import React from 'react';
import { StarIcon } from './icons';

interface ResultsScreenProps {
  currentTime: number;
  bestTime: number | null;
  previousTime: number | null;
  onPlayAgain: () => void;
}

const formatTime = (ms: number | null): string => {
  if (ms === null) return '-:--.--';
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10);
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};

const TimeDisplay: React.FC<{ label: string, time: number | null, className?: string }> = ({ label, time, className }) => (
    <div className={`bg-white/80 rounded-2xl p-4 text-center shadow-lg ${className}`}>
        <p className="text-xl md:text-2xl text-gray-600">{label}</p>
        <p className="text-4xl md:text-5xl font-bold text-gray-800 mt-1">{formatTime(time)}</p>
    </div>
);

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ currentTime, bestTime, previousTime, onPlayAgain }) => {
  const isNewBestTime = bestTime === currentTime;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 animate-fade-in">
        <div className="flex items-center gap-4">
            <h1 className="text-6xl md:text-8xl font-bold text-gray-800">クリア！</h1>
        </div>

        {isNewBestTime && (
            <div className="mt-6 bg-yellow-300 text-yellow-800 font-bold px-6 py-2 rounded-full flex items-center gap-2 animate-bounce">
                <StarIcon className="w-6 h-6"/>
                <p>さいこうきろく！</p>
                <StarIcon className="w-6 h-6"/>
            </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            <TimeDisplay label="ぜんかいのタイム" time={previousTime} />
            <TimeDisplay label="こんかいのタイム" time={currentTime} className="md:scale-110 md:shadow-2xl border-4 border-pink-400" />
            <TimeDisplay label="さいこうタイム" time={bestTime} />
        </div>

      <button
        onClick={onPlayAgain}
        className="mt-12 bg-pink-500 text-white font-bold text-3xl py-6 px-16 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-100 active:shadow-md"
      >
        もういちど あそぶ！
      </button>
    </div>
  );
};
