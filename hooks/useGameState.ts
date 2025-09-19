import { useState, useEffect, useCallback } from 'react';
import { Character, Question, GameStatus } from '../types';
import { QUESTIONS_PER_STAGE } from '../constants';

const useGameState = () => {
  const [character, setCharacter] = useState<Character>({
    stagesCleared: 0,
    clearedDates: [],
    // Fix: Initialize character with default customization properties.
    color: '#3b82f6',
    hat: 'none',
    accessory: 'none',
  });
  const [question, setQuestion] = useState<Question | null>(null);
  const [choices, setChoices] = useState<number[]>([]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Playing);
  const [incorrectAnswer, setIncorrectAnswer] = useState<number | null>(null);

  const generateQuestion = useCallback(() => {
    const operator = Math.random() < 0.6 ? '+' : '-'; // More addition
    let num1: number, num2: number, answer: number;

    if (operator === '+') {
      num1 = Math.floor(Math.random() * 9) + 1;
      num2 = Math.floor(Math.random() * (10 - num1)) + 1;
      answer = num1 + num2;
    } else { // operator === '-'
      num1 = Math.floor(Math.random() * 8) + 2; // 2-9
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1; // 1 to num1-1
      answer = num1 - num2;
    }
    
    setQuestion({ num1, num2, operator, answer });
    generateChoices({ num1, num2, operator, answer });
  }, []);

  const generateChoices = (currentQuestion: Question) => {
    const { answer } = currentQuestion;
    const choiceSet = new Set<number>();
    choiceSet.add(answer);

    while (choiceSet.size < 4) {
      const randomOffset = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
      const incorrectAnswer = answer + randomOffset;
      if (incorrectAnswer >= 0 && incorrectAnswer !== answer) {
        choiceSet.add(incorrectAnswer);
      }
    }

    setChoices(Array.from(choiceSet).sort(() => Math.random() - 0.5));
  };
  
  // Load game from localStorage on mount
  useEffect(() => {
    try {
      const savedCharacter = localStorage.getItem('mathMonsterCharacter');
      const savedQuestionNumber = localStorage.getItem('mathMonsterQuestionNumber');
      if (savedCharacter) {
        const parsed = JSON.parse(savedCharacter);
        const stages = parsed.stagesCleared ?? (parsed.level ? parsed.level - 1 : 0);
        setCharacter({
          stagesCleared: stages,
          clearedDates: parsed.clearedDates || [],
          // Fix: Load customization properties from localStorage, with defaults.
          color: parsed.color || '#3b82f6',
          hat: parsed.hat || 'none',
          accessory: parsed.accessory || 'none',
        });
      }
      if (savedQuestionNumber) {
        setQuestionNumber(parseInt(savedQuestionNumber, 10));
      }
    } catch (error) {
      console.error("Failed to load game state from localStorage", error);
    }
    generateQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save game to localStorage when character or progress changes
  useEffect(() => {
    try {
      localStorage.setItem('mathMonsterCharacter', JSON.stringify(character));
      localStorage.setItem('mathMonsterQuestionNumber', questionNumber.toString());
    } catch (error) {
      console.error("Failed to save game state to localStorage", error);
    }
  }, [character, questionNumber]);
  

  const handleAnswer = (selectedAnswer: number) => {
    if (gameStatus !== GameStatus.Playing) return;

    if (selectedAnswer === question?.answer) {
      setGameStatus(GameStatus.Answering);
      setTimeout(() => {
        if (questionNumber === QUESTIONS_PER_STAGE) {
          setGameStatus(GameStatus.StageCleared);
        } else {
          setQuestionNumber(prev => prev + 1);
          generateQuestion();
          setGameStatus(GameStatus.Playing);
        }
      }, 1000);
    } else {
      setIncorrectAnswer(selectedAnswer);
      setTimeout(() => setIncorrectAnswer(null), 500);
    }
  };

  const startNextStage = () => {
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    setCharacter(prev => {
        const updatedClearedDates = prev.clearedDates.includes(today)
            ? prev.clearedDates
            : [...prev.clearedDates, today];
        return {
            ...prev,
            stagesCleared: prev.stagesCleared + 1,
            clearedDates: updatedClearedDates,
        };
    });
    setQuestionNumber(1);
    generateQuestion();
    setGameStatus(GameStatus.Playing);
  };

  // Fix: Added function to handle character customization updates.
  const applyCustomization = (customization: Partial<Pick<Character, 'color' | 'hat' | 'accessory'>>) => {
    setCharacter(prev => ({ ...prev, ...customization }));
  };

  return {
    character,
    question,
    choices,
    questionNumber,
    gameStatus,
    incorrectAnswer,
    handleAnswer,
    startNextStage,
    // Fix: Export applyCustomization to be used by CustomizationScreen.
    applyCustomization,
  };
};

export default useGameState;
