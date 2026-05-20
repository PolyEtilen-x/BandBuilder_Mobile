export interface SetupTranslations {
  headerTitle: string;
  loadingTitle: string;
  loadingDesc: string;
  engineBadge: string;
  introTitle: string;
  introDesc: string;
  learningFocusTitle: string;
  targetBandDesc: string;
  cefrLevelDesc: string;
  levelExpectationTitle: string;
  currentLevelLabel: string;
  targetLevelLabel: string;
  adjustSkillTitle: string;
  generateBtnText: string;
}

export const setupTranslations: Record<"vi" | "en", SetupTranslations> = {
  vi: {
    headerTitle: "Thiết Kế Lộ Trình Học",
    loadingTitle: "Đang Khởi Tạo Bản Đồ Học Tập...",
    loadingDesc: "Trí tuệ nhân tạo đang phân tích các kỹ năng đầu vào và thiết lập các chặng lộ trình tối ưu.",
    engineBadge: "Band-Architect Engine v1.0",
    introTitle: "Cá Nhân Hóa Chặng Đường",
    introDesc: "Trả lời vài câu hỏi trắc nghiệm để xây dựng thời khóa biểu học tập phù hợp nhất với năng lực hiện tại của bạn.",
    learningFocusTitle: "1. Chọn Trọng Tâm Luyện Tập",
    targetBandDesc: "Mục tiêu Band Score",
    cefrLevelDesc: "Giao tiếp khung CEFR",
    levelExpectationTitle: "2. Thiết Lập Mốc Điểm Kỳ Vọng",
    currentLevelLabel: "Hiện Tại",
    targetLevelLabel: "Mục Tiêu",
    adjustSkillTitle: "3. Điều Chỉnh Chi Tiết Từng Kỹ Năng",
    generateBtnText: "Khởi Tạo Bản Đồ Lộ Trình"
  },
  en: {
    headerTitle: "Setup Roadmap",
    loadingTitle: "Assembling Milestones...",
    loadingDesc: "Our Band-Architect Engine is generating optimized study milestones based on your profile.",
    engineBadge: "Band-Architect Engine v1.0",
    introTitle: "Map Out Your Journey",
    introDesc: "Answer a few questions to build a personalized study timeline tailored to your current performance and goals.",
    learningFocusTitle: "1. Select Learning Focus",
    targetBandDesc: "Target Band Score",
    cefrLevelDesc: "CEFR Levels Focus",
    levelExpectationTitle: "2. Set Level Expectations",
    currentLevelLabel: "Current",
    targetLevelLabel: "Target",
    adjustSkillTitle: "3. Adjust Skill Performance",
    generateBtnText: "Generate Journey Map"
  }
};
