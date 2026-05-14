import { SkillType } from "@/data/practices/common.types";

export type SkillAttemptStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUBMITTED"

export type SkillAttempt = {
  skillType: SkillType

  status: SkillAttemptStatus

  attemptId?: string

  answers: Record<string, string>

  startedAt?: number
  timeSpentSec?: number
}