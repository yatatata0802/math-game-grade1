
import React from 'react';
import { StarIcon } from './icons';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
      <div className="flex items-center gap-4">
        <StarIcon className="w-12 h-12 text-yellow-400" />
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800">さんすうゲーム</h1>
        <StarIcon className="w-12 h-12 text-yellow-400" />
      </div>
      <p className="mt-4 text-lg text-gray-600">たしざん と ひきざん の もんだい だよ！</p>
      <button
        onClick={onStart}
        className="mt-12 bg-pink-500 text-white font-bold text-3xl py-6 px-16 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-100 active:shadow-md"
      >
        はじめる！
      </button>
    </div>
  );
};
