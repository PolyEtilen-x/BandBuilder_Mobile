import { Key } from "react";

export interface PracticeTest {
  skillContentId: Key | null | undefined;
  practiceTestId: string;  
  title: string;          
}
 
// ── Pagination meta ───────────────────────────
 
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
 
// ── API response ──────────────────────────────
 
export interface PracticeTestListResponse {
  data: PracticeTest[];
  meta: PaginationMeta;
}