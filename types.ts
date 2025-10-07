
export enum GameState {
  Start,
  Playing,
  Finished,
}

export interface Question {
  text: string;
  correctAnswer: number;
  options: number[];
}
