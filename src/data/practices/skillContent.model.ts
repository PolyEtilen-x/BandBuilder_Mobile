import type { SkillType } from './common.types';
import type { ListeningContent } from './listening.model';
import type { ReadingContent } from './reading.model';
 
// Content union — add Writing/Speaking when defined
export type WritingContent = Record<string, never>;
export type SpeakingContent = Record<string, never>;
 
export type SkillContent =
  | ListeningContent
  | ReadingContent
  | WritingContent
  | SpeakingContent;
 
// Skill Content Preview 
export interface SkillContentPreview {
  skillContentId: string;        
  skillType: SkillType;
  audioUrl: string | null;      
  source: string;                  
  createdAt: string;                
  content: SkillContent;
}
 