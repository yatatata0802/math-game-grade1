
import React from 'react';

interface ChoiceButtonProps {
  value: number;
  onClick: () => void;
  isCorrect: boolean;
  isIncorrect: boolean;
  disabled: boolean;
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ value, onClick, isCorrect, isIncorrect, disabled }) => {
  const baseClasses = 'w-full text-5xl md:text-7xl font-bold py-8 md:py-12 rounded-2xl shadow-lg transform transition-all duration-300 ease-in-out';
  const disabledClasses = 'opacity-70 cursor-not-allowed';
  const interactiveClasses = 'hover:scale-105 hover:shadow-xl';

  let colorClasses = 'bg-white text-slate-700';
  if (isCorrect) {
    colorClasses = 'bg-green-500 text-white animate-bounce';
  } else if (isIncorrect) {
    colorClasses = 'bg-red-500 text-white animate-shake';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${colorClasses} ${disabled && !isCorrect ? disabledClasses : interactiveClasses}`}
    >
      {value}
    </button>
  );
};

export default ChoiceButton;
