import type { ListeningContext, ListeningQuestionType, QuestionsRange } from './common.types';
 
// 1. Shared leaf types
export interface ListeningQuestion {
  id: string;
  number: number;
  text: string;
  options?: string[];
  note?: string;
  imgUrl?: string;
}
 
// 2. Question block variants (discriminated union)
interface QuestionBlockBase {
  question_type: ListeningQuestionType;
  questions_range: QuestionsRange;
  instruction: string;
  imgUrl?: string; // block-level image (e.g. form layout, map)
}
 
// ── 2a. multiple_choice ───────────────────────
export interface MultipleChoiceBlock extends QuestionBlockBase {
  question_type: 'multiple_choice';
  questions: ListeningQuestion[];
}
 
// ── 2b. form_completion ───────────────────────
export interface FormCompletionBlock extends QuestionBlockBase {
  question_type: 'form_completion';
  form_title?: string;
  questions: ListeningQuestion[];
}
 
// ── 2c. note_completion ───────────────────────
export interface NoteCompletionBlock extends QuestionBlockBase {
  question_type: 'note_completion';
  questions: ListeningQuestion[];
}
 
// ── 2d. matching ──────────────────────────────
export interface MatchingQuestion {
  id: string;
  number: number;
  text?: string; // populated by normalizeListeningData from questions_range
}
 
export interface MatchingBlock extends QuestionBlockBase {
  question_type: 'matching';
  options: string[];
  questions: MatchingQuestion[]; // synthesised by normalizeListeningData
  answers?: string[];            // correct answer keys, e.g. ["E","F","H"]
}
 
// ── Union ─────────────────────────────────────
export type ListeningQuestionBlock =
  | MultipleChoiceBlock
  | FormCompletionBlock
  | NoteCompletionBlock
  | MatchingBlock;
 
// 3. Section
export interface ListeningSection {
  section: number;
  context: ListeningContext;
  speakers: string[];
  description: string;
  audioUrl?: string;
  imgUrl?: string;
  question_blocks: ListeningQuestionBlock[];
}
 
// 4. Top-level content
export interface ListeningContent {
  sections: ListeningSection[];
}
 