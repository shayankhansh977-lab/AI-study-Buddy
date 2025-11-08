export enum PanelType {
  CHAT = 'Chat Tutor',
  SUMMARIZE = 'Note Summarizer',
  QUIZ = 'Quiz Generator',
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}
