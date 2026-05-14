export type SkillType = 'Listening' | 'Reading' | 'Writing' | 'Speaking';

export type ListeningContext =
  | 'social_conversation'
  | 'social_monologue'
  | 'academic_conversation'
  | 'academic_monologue';

export type ReadingTopic = string; 

// ── Question types ────────────────────────────

/** Listening question types */
export type ListeningQuestionType =
  | 'multiple_choice'
  | 'form_completion'
  | 'note_completion'
  | 'matching';

/** Reading question types */
export type ReadingQuestionType =
  | 'summary_completion'
  | 'matching_features'
  | 'yes_no_not_given'
  | 'multiple_choice'
  | 'selecting_factors'
  | 'table_completion'
  | 'matching_cause_effect';

export type QuestionType = ListeningQuestionType | ReadingQuestionType;

// ── Shared ────────────────────────────────────

/** e.g. "1-5", "11-13", "22-25" */
export type QuestionsRange = string;