import type { SkillType } from './common.types';
import type { SkillContent } from './skillContent.model';

// Skill Test (one skill inside a full test)
export interface SkillTest {
  skillTestId: string;        
  skillType: SkillType;
  audioUrl: string | null;
  source: string;
  createdAt: string;     
  content: SkillContent;      // ListeningContent | ReadingContent | {} for Writing/Speaking
}

// Full Practice Test Preview
export interface PracticeTestPreview {
  practiceTestId: string;     // e.g. "pt-cambridge-1"
  title: string;
  skills: SkillTest[];
}