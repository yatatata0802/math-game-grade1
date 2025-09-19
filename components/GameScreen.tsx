import React, { useState } from 'react';
import CharacterDisplay from './CharacterDisplay';
import ProgressBar from './ProgressBar';
import ChoiceButton from './ChoiceButton';
import useGameState from '../hooks/useGameState';
import { GameStatus } from '../types';
import { QUESTIONS_PER_STAGE } from '../constants';
import CalendarModal from './CalendarModal';

type GameScreenProps = ReturnType<typeof useGameState> & {
  playSound: (sound: 'correct' | 'incorrect' | 'levelUp') => void;
};

const GameScreen: React.FC<GameScreenProps> = (props) => {
  const {
    character,
    question,
    choices,
    questionNumber,
    gameStatus,
    incorrectAnswer,
    handleAnswer,
    startNextStage,
    playSound,
  } = props;
  const [correctAnswer, setCorrectAnswer] = React.useState<number | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const onAnswerClick = (answer: number) => {
    if (gameStatus !== GameStatus.Playing) return;
    
    if (answer === question?.answer) {
      playSound('correct');
      setCorrectAnswer(answer);
    } else {
      playSound('incorrect');
    }
    handleAnswer(answer);
  };
  
  React.useEffect(() => {
    if (gameStatus === GameStatus.Playing) {
        setCorrectAnswer(null);
    }
    if (gameStatus === GameStatus.StageCleared) {
        playSound('levelUp');
    }
  }, [gameStatus, playSound]);

  if (!question) {
    return <div className="text-white text-4xl">Loading...</div>;
  }
  
  if (gameStatus === GameStatus.StageCleared) {
    return (
      <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-8 text-center flex flex-col items-center shadow-2xl animate-pop-in">
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">ステージクリア！</h2>
        <div className="w-48 h-48 my-4">
          {/* Fix: Pass the character object to CharacterDisplay to show customizations. */}
          <CharacterDisplay character={character} isHappy={true} />
        </div>
        <p className="text-2xl text-white mb-8">よくできました！</p>
        <button
          onClick={startNextStage}
          className="bg-green-500 text-white font-bold py-4 px-12 rounded-full text-3xl shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          つぎのステージへ！
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 md:gap-8 w-full">
      <div className="w-full flex justify-between items-center bg-white/30 backdrop-blur-sm rounded-full p-3 shadow-lg gap-4">
        <div className="w-24 h-24 flex-shrink-0">
            {/* Fix: Pass the character object to CharacterDisplay to show customizations. */}
            <CharacterDisplay character={character} isHappy={gameStatus === GameStatus.Answering} />
        </div>
        <div className="flex-grow">
            <ProgressBar current={questionNumber} total={QUESTIONS_PER_STAGE} />
        </div>
         <button 
            onClick={() => setIsCalendarOpen(true)}
            className="w-16 h-16 flex-shrink-0 bg-white/30 rounded-full flex items-center justify-center shadow-lg hover:bg-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="カレンダーをひらく"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
         </button>
      </div>

      <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 w-full text-center shadow-2xl">
        <p className="text-6xl md:text-9xl font-bold text-white tracking-widest drop-shadow-md">
          {question.num1} {question.operator} {question.num2} = ?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
        {choices.map((choice) => (
          <ChoiceButton
            key={choice}
            value={choice}
            onClick={() => onAnswerClick(choice)}
            isCorrect={choice === correctAnswer}
            isIncorrect={choice === incorrectAnswer}
            disabled={gameStatus !== GameStatus.Playing}
          />
        ))}
      </div>
      <div className="h-10 text-center">
        {gameStatus === GameStatus.Answering && <p className="text-3xl font-bold text-green-300 animate-bounce">せいかい！</p>}
        {incorrectAnswer !== null && <p className="text-3xl font-bold text-yellow-300">おしい！もういちど！</p>}
      </div>
       <CalendarModal 
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        // Fix: Pass the entire character object to the modal instead of just clearedDates.
        character={character}
      />
    </div>
  );
};

export default GameScreen;
