import type { ReadingQuestionType, QuestionsRange } from './common.types';

// 1. Shared leaf types
export interface ReadingQuestion {
  id: string;
  number: number;
  text: string;
  options?: string[];
}

// 2. Question block variants (discriminated union)
interface QuestionBlockBase {
  question_type: ReadingQuestionType;
  questions_range: QuestionsRange;
  instruction: string;
}

// ── 2a. summary_completion ───────────────────
export interface SummaryCompletionBlock extends QuestionBlockBase {
  question_type: 'summary_completion';
  questions: ReadingQuestion[];
  word_bank: string[];
}

// ── 2b. matching_features ────────────────────
export interface MatchingFeaturesBlock extends QuestionBlockBase {
  question_type: 'matching_features';
  options: string[];
  questions: ReadingQuestion[];
}

// ── 2c. yes_no_not_given ─────────────────────
export interface YesNoNotGivenBlock extends QuestionBlockBase {
  question_type: 'yes_no_not_given';
  questions: ReadingQuestion[];
}

// ── 2d. multiple_choice ──────────────────────
export interface MultipleChoiceBlock extends QuestionBlockBase {
  question_type: 'multiple_choice';
  questions: ReadingQuestion[];
}

// ── 2e. selecting_factors ────────────────────
// No questions[] — user picks `select_count` items from `options` directly.
export interface SelectingFactorsBlock extends QuestionBlockBase {
  question_type: 'selecting_factors';
  options: string[];
  select_count: number; // always required — drives "Which THREE factors" instruction
}

// ── 2f. table_completion ─────────────────────
export interface TableCompletionBlock extends QuestionBlockBase {
  question_type: 'table_completion';
  table_headers: string[];
  questions: ReadingQuestion[];
}

// ── 2g. matching_cause_effect ────────────────
export interface CauseEffectQuestion {
  id: string;
  number: number;
  cause: string;
}

export interface MatchingCauseEffectBlock extends QuestionBlockBase {
  question_type: 'matching_cause_effect';
  effects: string[];
  questions: CauseEffectQuestion[];
}

// ── Union ─────────────────────────────────────
export type ReadingQuestionBlock =
  | SummaryCompletionBlock
  | MatchingFeaturesBlock
  | YesNoNotGivenBlock
  | MultipleChoiceBlock
  | SelectingFactorsBlock
  | TableCompletionBlock
  | MatchingCauseEffectBlock;

// 3. Passage
export interface ReadingPassage {
  passage_number: number;
  title: string;
  topic: string;
  content: string;
  time_suggested_minutes?: number;
  question_blocks: ReadingQuestionBlock[];
}

// 4. Top-level content
export interface ReadingContent {
  passages: ReadingPassage[];
}