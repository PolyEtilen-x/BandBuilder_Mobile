export type LearningType = "general" | "ielts"

export type ResourceType = "video" | "quiz" | "practice_test" | "reading"

// 1. Tài liệu & Bài học liên kết
export interface RoadmapResource {
  id: string
  nodeId: string
  type: ResourceType
  title: string
  contentId: string // ID tham chiếu đến bài học/bài test thực tế
  estimatedTime?: string
}

// 2. Các chặng trong lộ trình (Roadmap Node)
export interface RoadmapNode {
  id: string
  roadmapId: string
  title: string
  description: string
  orderIndex: number
  estimatedTime: string
  focusSkills: string[]
  iconType: "speaking" | "writing" | "reading" | "listening" | "foundation"
}

// 3. Lộ trình tổng quát (Roadmap Base)
export interface Roadmap {
  id: string
  title: string
  description: string
  type: LearningType
  currentLevel: string
  targetLevel: string
  estimatedDuration: string
  thumbnailUrl?: string
}

// 4. DTO Response chi tiết cho Frontend (Nested Structure)
export interface RoadmapDetailResponse extends Roadmap {
  nodes: (RoadmapNode & {
    resources: RoadmapResource[]
    isCompleted?: boolean // Phục vụ render UI checkmark
  })[]
}

// 5. Payload gửi lên để tạo Roadmap
export interface GenerateRoadmapPayload {
  learningType: LearningType
  currentLevel: string
  targetLevel: string
  speaking: string
  reading: string
  listening: string
  writing: string
}

// 6. Trạng thái học tập của User
export interface UserRoadmapProgress {
  userId: string
  roadmapId: string
  currentNodeId: string
  status: "active" | "completed" | "dropped"
  startedAt: string
  completedAt?: string
}
