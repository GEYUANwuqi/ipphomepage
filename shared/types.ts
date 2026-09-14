export type QuestionType = 'single' | 'multiple' | 'boolean' | 'text' | 'scale';
export interface Question {
  id: string; type: QuestionType; category: string; prompt: string;
  options: string[]; correct: number[]; points: number; explanation: string; active: boolean;
}
export type PublicQuestion = Omit<Question, 'correct' | 'explanation' | 'active'>;
export interface Settings { enabled: boolean; questionCount: number; passScore: number; version: number; }
export type Answers = Record<string, number[] | string | number>;
export interface Result {
  score: number; passed: boolean; earned: number; total: number; displayName: string;
  demo: boolean; certificateId: string | null; issuedAt: string; version: number; passScore: number;
}
export interface Attempt {
  id: string; questions: PublicQuestion[]; answers: Answers; demo: boolean;
  passScore: number; expiresAt: number; result: Result | null;
}
export interface Certificate {
  id: string; displayName: string; score: number; issuedAt: string; version: number; revoked: boolean;
}
export const typeLabels: Record<QuestionType, string> = {
  single: '单选题', multiple: '多选题', boolean: '判断题', text: '简答题', scale: '量表题',
};
