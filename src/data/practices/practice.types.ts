export type IELTSComponentType = 'Reading' | 'Listening' | 'Writing' | 'Speaking';

export interface Question {
  id: string;
  question_number?: number;
  text?: string;
  options?: string[];
  content?: string; // For some specific types
}

export interface QuestionBlock {
  id: string;
  instruction: string;
  question_type: string;
  questions_range: string;
  questions?: Question[];
  guide?: string;
  content?: string;
}

export interface Passage {
  id: string;
  passage_number: number;
  title: string;
  content: string;
  question_blocks: QuestionBlock[];
  time_suggested_minutes?: number;
}

export interface Section {
  id: string;
  section: number;
  title: string;
  audio_url: string;
  question_blocks: QuestionBlock[];
  time_suggested_minutes?: number;
}

export interface TestContent {
  passages?: Passage[];
  sections?: Section[];
}

export interface PracticeTestDTO {
  skillContentId: string;
  skillType: IELTSComponentType;
  audioUrl: string | null;
  source: string;
  createdAt: string;
  content: TestContent;
  // Aliases for compatibility
  id: string;
  skill: IELTSComponentType;
}

export interface PracticeTestPreview {
  id: string;
  title: string;
  skill: IELTSComponentType;
  thumbnail?: string;
}

export type SkillKey = "reading" | "listening" | "writing" | "speaking"
export type Mode = "full" | "single"

export type SidebarState = {
  skill: SkillKey
  mode: Mode
  subSection: number | null
}
