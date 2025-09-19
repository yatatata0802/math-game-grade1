
import React from 'react';
import { QUESTIONS_PER_STAGE } from '../constants';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progressPercentage = (Math.max(0, current - 1) / total) * 100;

  return (
    <div className="w-full bg-black/20 rounded-full h-8 shadow-inner overflow-hidden">
      <div
        className="bg-gradient-to-r from-yellow-300 to-amber-500 h-8 rounded-full transition-all duration-500 ease-out flex items-center justify-end"
        style={{ width: `${progressPercentage}%` }}
      >
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-white drop-shadow-md">
            {Math.max(0, current - 1)} / {QUESTIONS_PER_STAGE}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
