import React, { useState, useEffect, useCallback } from 'react';
import { GameState } from './types';
import type { Question } from './types';
import { TOTAL_QUESTIONS } from './constants';
import { StartScreen } from './components/StartScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { ResultsScreen } from './components/ResultsScreen';

const positiveFeedbackMessages = ["やったー！", "すごい！", "せいかい！", "そのちょうし！"];
const incorrectFeedbackMessage = "おしい！";

const generateQuestions = (): Question[] => {
  const questions: Question[] = [];
  while (questions.length < TOTAL_QUESTIONS) {
    const isAddition = Math.random() > 0.5;
    let num1: number, num2: number, answer: number, text: string;

    if (isAddition) {
      num1 = Math.floor(Math.random() * 19) + 1; // 1-19
      num2 = Math.floor(Math.random() * (20 - num1)) + 1; // Ensure sum <= 20
      answer = num1 + num2;
      text = `${num1} + ${num2} = ?`;
    } else {
      num1 = Math.floor(Math.random() * 19) + 2; // 2-20, to have room for num2
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1; // Ensure num1 > num2 and answer >= 0
      answer = num1 - num2;
      text = `${num1} - ${num2} = ?`;
    }

    const options = new Set<number>();
    options.add(answer);
    while (options.size < 4) {
      const wrongAnswer = Math.max(0, answer + (Math.floor(Math.random() * 7) - 3));
      if (wrongAnswer <= 20) {
        options.add(wrongAnswer);
      }
    }
    
    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

    questions.push({ text, correctAnswer: answer, options: shuffledOptions });
  }
  return questions;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [previousTime, setPreviousTime] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedBest = localStorage.getItem('mathGameBestTime');
      const storedPrev = localStorage.getItem('mathGamePreviousTime');
      if (storedBest) setBestTime(JSON.parse(storedBest));
      if (storedPrev) setPreviousTime(JSON.parse(storedPrev));
    } catch (error) {
      console.error("Failed to parse times from localStorage", error);
    }
  }, []);

  const startGame = useCallback(() => {
    if (gameState === GameState.Finished) {
      setPreviousTime(endTime - startTime);
    }
    setQuestions(generateQuestions());
    setCurrentQuestionIndex(0);
    setFeedback(null);
    const now = Date.now();
    setStartTime(now);
    setEndTime(0);
    setElapsedTime(0);
    setGameState(GameState.Playing);
  }, [gameState, endTime, startTime]);
  
  useEffect(() => {
    if (gameState !== GameState.Playing) return;

    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 50);

    return () => {
      clearInterval(timer);
    };
  }, [gameState, startTime]);

  const handleAnswer = useCallback((answer: number) => {
    if (feedback === 'correct') return;

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      const message = positiveFeedbackMessages[Math.floor(Math.random() * positiveFeedbackMessages.length)];
      setFeedbackMessage(message);
      setFeedback('correct');

      setTimeout(() => {
        if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setFeedback(null);
        } else {
          const finalTime = Date.now();
          setEndTime(finalTime);
          const duration = finalTime - startTime;

          localStorage.setItem('mathGamePreviousTime', JSON.stringify(duration));

          if (bestTime === null || duration < bestTime) {
            setBestTime(duration);
            localStorage.setItem('mathGameBestTime', JSON.stringify(duration));
          }
          
          setGameState(GameState.Finished);
        }
      }, 1200);
    } else {
      setFeedbackMessage(incorrectFeedbackMessage);
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
      }, 800);
    }
  }, [currentQuestionIndex, questions, startTime, bestTime, feedback]);

  const renderContent = () => {
    switch (gameState) {
      case GameState.Playing:
        return (
          <QuestionScreen
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={TOTAL_QUESTIONS}
            onAnswer={handleAnswer}
            feedback={feedback}
            feedbackMessage={feedbackMessage}
            elapsedTime={elapsedTime}
          />
        );
      case GameState.Finished:
        return (
          <ResultsScreen
            currentTime={endTime - startTime}
            bestTime={bestTime}
            previousTime={previousTime}
            onPlayAgain={startGame}
          />
        );
      case GameState.Start:
      default:
        return <StartScreen onStart={startGame} />;
    }
  };

  return (
    <main className="bg-sky-100 min-h-screen w-full flex items-center justify-center transition-colors duration-500">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-in-out; }
        
        @keyframes jump-in {
            0% { transform: scale(0.5) translateY(50px); opacity: 0; }
            80% { transform: scale(1.1) translateY(0); opacity: 1; }
            100% { transform: scale(1); }
        }
        .animate-jump-in { animation: jump-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); }

        @keyframes wiggle {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
        }
        .animate-wiggle { animation: wiggle 0.2s ease-in-out 2; }

        .tabular-nums {
            font-feature-settings: 'tnum' on, 'lnum' on;
        }
      `}</style>
      <div className="container mx-auto h-screen">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;