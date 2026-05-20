export interface VocabTranslations {
  headerTitle: string;
  tabTopics: string;
  tabFlashcards: string;
  tabNotebook: string;
  searchPlaceholder: string;
  loadingText: string;
  meaningLabel: string;
  exampleLabel: string;
  synonymsLabel: string;
  tapToFlip: string;
  tapToFlipBack: string;
  nextCard: string;
  emptyWords: string;
  notebookEmpty: string;
  detailStats: (count: number) => string;
  savedMeta: (saved: number, total: number) => string;
}

export const vocabTranslations: Record<"vi" | "en", VocabTranslations> = {
  vi: {
    headerTitle: "Kho Từ Vựng IELTS",
    tabTopics: "Chủ Đề",
    tabFlashcards: "Thẻ Nhớ",
    tabNotebook: "Của Tôi",
    searchPlaceholder: "Tìm chủ đề hoặc từ vựng...",
    loadingText: "Đang tải dữ liệu...",
    meaningLabel: "Định nghĩa / Ý nghĩa:",
    exampleLabel: "Ví dụ ngữ cảnh:",
    synonymsLabel: "Từ đồng nghĩa: ",
    tapToFlip: "CHẠM ĐỂ XEM ĐỊNH NGHĨA",
    tapToFlipBack: "CHẠM ĐỂ XEM CHỮ TIẾNG ANH",
    nextCard: "Thẻ Tiếp Theo",
    emptyWords: "Chưa có từ vựng nào trong danh sách!",
    notebookEmpty: "Sổ tay rỗng. Hãy thả tim các từ mới trong mục Chủ Đề để lưu lại nhé!",
    detailStats: (count: number): string => `${count} từ vựng cốt lõi`,
    savedMeta: (saved: number, total: number): string => `${saved}/${total} từ đã thuộc`,
  },
  en: {
    headerTitle: "Vocab Lab",
    tabTopics: "Topics",
    tabFlashcards: "Flashcards",
    tabNotebook: "Notebook",
    searchPlaceholder: "Search topics or words...",
    loadingText: "Loading vocab...",
    meaningLabel: "Meaning:",
    exampleLabel: "Context Example:",
    synonymsLabel: "Synonyms: ",
    tapToFlip: "TAP TO FLIP CARD",
    tapToFlipBack: "TAP TO SEE ENGLISH WORD",
    nextCard: "Next Flashcard",
    emptyWords: "No words loaded!",
    notebookEmpty: "Notebook is empty! Bookmark words under Topics tab to review here.",
    detailStats: (count: number): string => `${count} key IELTS words`,
    savedMeta: (saved: number, total: number): string => `${saved}/${total} words saved`,
  }
};
