export interface GrammarTranslations {
  headerTitle: string;
  tabBasics: string;
  tabTenses: string;
  tabMistakes: string;
  loadingText: string;
  basicsBadge: string;
  explanationLabel: string;
  examplesLabel: string;
  tensesBadge: string;
  formulaLabel: string;
  usageLabel: string;
  tensesExamplesLabel: string;
  mistakesBadge: string;
  whyLabel: string;
  mistakesCount: (count: number) => string;
  mistakeIndex: (idx: number) => string;
}

export const grammarTranslations: Record<"vi" | "en", GrammarTranslations> = {
  vi: {
    headerTitle: "Ngữ Pháp Tinh Gọn IELTS",
    tabBasics: "Cơ Bản",
    tabTenses: "Thì Thời",
    tabMistakes: "Sửa Lỗi",
    loadingText: "Đang chuẩn bị lý thuyết...",
    basicsBadge: "Cấu Trúc Câu & Từ Loại IELTS",
    explanationLabel: "Giải Thích Lý Thuyết:",
    examplesLabel: "Ví Dụ Cụ Thể:",
    tensesBadge: "Ứng Dụng 12 Thì Thời Trong IELTS",
    formulaLabel: "Công Thức Cấu Trúc:",
    usageLabel: "Cách Sử Dụng Đột Phá:",
    tensesExamplesLabel: "Ví Dụ Ứng Dụng IELTS (Writing/Speaking):",
    mistakesBadge: "Tránh Bẫy Điểm Lỗi Thường Gặp",
    whyLabel: "Tại sao sai?",
    mistakesCount: (count: number): string => `${count} lỗi kinh điển`,
    mistakeIndex: (idx: number): string => `Lỗi số ${idx}`,
  },
  en: {
    headerTitle: "Grammar Lab",
    tabBasics: "Basics",
    tabTenses: "Tenses",
    tabMistakes: "Mistakes",
    loadingText: "Analyzing structures...",
    basicsBadge: "IELTS Parts of Speech & Syntax",
    explanationLabel: "Explanation:",
    examplesLabel: "Key Examples:",
    tensesBadge: "12 IELTS Time-Frame Tenses",
    formulaLabel: "Formula Structure:",
    usageLabel: "Key Usage:",
    tensesExamplesLabel: "IELTS Context Examples:",
    mistakesBadge: "Common Errors & Corrections",
    whyLabel: "Grammar Insight:",
    mistakesCount: (count: number): string => `${count} key error diagnostics`,
    mistakeIndex: (idx: number): string => `Error #${idx}`,
  }
};
