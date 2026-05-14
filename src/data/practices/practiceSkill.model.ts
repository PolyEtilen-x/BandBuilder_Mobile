import type { SkillType } from './common.types';
import type { PaginationMeta, PracticeTest } from './practiceTest.model';
 
// ── Single item ───────────────────────────────
 
export interface PracticeSkill {
  title: string;
  skillContentId: string;      
  skillType: SkillType;
  numberOfVisits: number;
  practiceTests: PracticeTest[]; 
}
 
// ── API response ──────────────────────────────
 
export interface PracticeSkillListResponse {
  data: PracticeSkill[];
  meta: PaginationMeta;
}