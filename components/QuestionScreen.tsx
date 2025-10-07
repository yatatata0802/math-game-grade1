import React from 'react';
import type { Question } from '../types';
import { CheckCircleIcon, XCircleIcon, StarIcon, ClockIcon } from './icons';

interface QuestionScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: number) => void;
  feedback: 'correct' | 'incorrect' | null;
  feedbackMessage: string;
  elapsedTime: number;
}

const buttonColors = [
  'bg-yellow-400 hover:bg-yellow-500',
  'bg-sky-400 hover:bg-sky-500',
  'bg-green-400 hover:bg-green-500',
  'bg-purple-400 hover:bg-purple-500'
];

const formatTime = (ms: number): string => {
  if (ms < 0) ms = 0;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10);
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};

const FeedbackOverlay: React.FC<{ type: 'correct' | 'incorrect', message: string }> = ({ type, message }) => {
  return (
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 animate-fade-in">
      <div className="text-center text-white">
        {type === 'correct' ? (
          <CheckCircleIcon className="w-48 h-48 mx-auto text-green-300 animate-jump-in" />
        ) : (
          <XCircleIcon className="w-48 h-48 mx-auto text-red-300 animate-wiggle" />
        )}
        <p className="text-8xl font-bold mt-4" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.2)' }}>{message}</p>
      </div>
    </div>
  );
};


export const QuestionScreen: React.FC<QuestionScreenProps> = ({ question, questionNumber, totalQuestions, onAnswer, feedback, feedbackMessage, elapsedTime }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-4 relative">
      {feedback && <FeedbackOverlay type={feedback} message={feedbackMessage} />}
      
      <div className="w-full max-w-4xl text-center">
        <div className="flex items-center justify-between gap-4 bg-white/80 rounded-full px-6 py-2 shadow-md">
            <div className="flex items-center gap-4">
                <StarIcon className="w-8 h-8 text-yellow-400" />
                <p className="text-3xl font-bold text-gray-700">もんだい {questionNumber}/{totalQuestions}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
                <ClockIcon className="w-8 h-8" />
                <p className="text-3xl font-bold w-36 text-left tabular-nums">{formatTime(elapsedTime)}</p>
            </div>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 w-full max-w-4xl">
          <p className="text-center text-7xl md:text-9xl font-bold text-gray-800 tracking-wider">
            {question.text}
          </p>
        </div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            disabled={feedback === 'correct'}
            className={`text-white font-bold text-5xl py-8 rounded-2xl shadow-lg transform transition-transform duration-150 active:scale-95 disabled:opacity-50 ${buttonColors[index % 4]}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};