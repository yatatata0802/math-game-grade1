export interface Character {
  stagesCleared: number;
  clearedDates: string[]; // YYYY-MM-DD format
  // Fix: Added properties for character customization to resolve type errors.
  color: string;
  hat: string;
  accessory: string;
}

export interface Question {
  num1: number;
  num2: number;
  operator: '+' | '-';
  answer: number;
}

export enum GameStatus {
  Playing,
  Answering,
  StageCleared,
}
