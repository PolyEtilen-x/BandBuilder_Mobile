export interface ExaminerVoice {
  id: string;
  name: string;
  accent: string;
  description: string;
  avatar: string;
}

export interface CallTranslations {
  headerTitle: string;
  statusLive: string;
  statusOffline: string;
  subTitle: string;
  heroTitle: string;
  heroDesc: string;
  selectExaminerTitle: string;
  startCallText: string;
  connectingText: string;
  ringingText: string;
  listeningText: string;
  processingText: string;
  speakingHint: string;
  feedbackLoaderTitle: string;
  feedbackLoaderDesc: string;
  completedBadge: string;
  reportTitle: string;
  reportSub: string;
  overallLabel: string;
  fluencyLabel: string;
  lexicalLabel: string;
  grammarLabel: string;
  pronunciationLabel: string;
  correctionsTitle: string;
  grammarCorr: string;
  vocabCorr: string;
  positiveCorr: string;
  restartBtnText: string;
  examinerSpeaking: (name: string) => string;
  examiners: ExaminerVoice[];
}

export const callTranslations: Record<"vi" | "en", CallTranslations> = {
  vi: {
    headerTitle: "Giám Khảo Luyện Nói AI",
    statusLive: "TRỰC TUYẾN",
    statusOffline: "NGOẠI TUYẾN",
    subTitle: "LUYỆN NÓI PHẢN XẠ 1-1",
    heroTitle: "Giám Khảo Luyện Nói AI Sophia",
    heroDesc: "Trò chuyện phản xạ trực tiếp và nhận thẻ điểm phân tích chi tiết (Fluency, Grammar, Lexical, Pronunciation) chuẩn giám khảo bản xứ.",
    selectExaminerTitle: "Chọn Giám Khảo Luyện Thi:",
    startCallText: "Bắt Đầu Luyện Tập",
    connectingText: "ĐANG KẾT NỐI GATEWAY...",
    ringingText: "ĐANG ĐỔ CHUÔNG...",
    listeningText: "ĐANG LẮNG NGHE BẠN...",
    processingText: "ĐANG PHÂN TÍCH...",
    speakingHint: "Hãy bắt đầu nói khi mic có màu xanh lá.",
    feedbackLoaderTitle: "Đang Chấm Điểm & Phân Tích...",
    feedbackLoaderDesc: "Thuật toán AI đang phân tích dữ liệu giọng nói của bạn đối chiếu với thang chấm điểm IELTS 9.0...",
    completedBadge: "KẾT QUẢ ĐÁNH GIÁ CHUYÊN GIA",
    reportTitle: "Thẻ Điểm IELTS Chi Tiết",
    reportSub: "Được chấm bởi Giám khảo AI chuyên nghiệp",
    overallLabel: "BĂNG ĐIỂM",
    fluencyLabel: "Sự Trôi Chảy (Fluency)",
    lexicalLabel: "Vốn Từ Vựng (Lexical)",
    grammarLabel: "Ngữ Pháp (Grammar)",
    pronunciationLabel: "Phát Âm (Pronunciation)",
    correctionsTitle: "Khuyến Nghị & Sửa Lỗi Chi Tiết",
    grammarCorr: "Lỗi Ngữ Pháp",
    vocabCorr: "Nâng Cấp Từ Vựng",
    positiveCorr: "Điểm Tốt",
    restartBtnText: "Luyện Tập Lượt Mới",
    examinerSpeaking: (name: string): string => `${name.toUpperCase()} ĐANG NÓI...`,
    examiners: [
      { id: "sophia", name: "Sophia", accent: "Giọng Mỹ (American)", description: "Thân thiện, nói rõ ràng dễ nghe, phù hợp cho cấp độ trung cấp luyện xạ.", avatar: "S" },
      { id: "alex", name: "Alex", accent: "Giọng Anh (British)", description: "Học thuật và nghiêm nghị, mô phỏng chuẩn xác phong thái giám khảo IDP thực tế.", avatar: "A" },
      { id: "david", name: "David", accent: "Giọng Úc (Australian)", description: "Tốc độ nói tự nhiên, âm điệu chân thực, phù hợp cho người học nâng cao.", avatar: "D" },
    ]
  },
  en: {
    headerTitle: "AI Speaking Coach",
    statusLive: "LIVE",
    statusOffline: "DEMO",
    subTitle: "1-1 REAL-TIME DIALOGUE",
    heroTitle: "IELTS AI Examiner Sophia",
    heroDesc: "Engage in face-to-face spoken practice. Receive immediate analytical scorecards across official IELTS criteria.",
    selectExaminerTitle: "Select Your AI Examiner:",
    startCallText: "Start Practice Session",
    connectingText: "ESTABLISHING CONNECTION...",
    ringingText: "RINGING...",
    listeningText: "LISTENING TO YOU...",
    processingText: "PROCESSING AUDIO...",
    speakingHint: "Start speaking when the mic button flashes green.",
    feedbackLoaderTitle: "Generating Expert Evaluation...",
    feedbackLoaderDesc: "AI model is assessing grammar depth, vocabulary diversity, fluency, and pronunciation...",
    completedBadge: "EXAMINER SCORECARD COMPLETED",
    reportTitle: "Analytical Performance",
    reportSub: "Generated via official IELTS assessment protocols",
    overallLabel: "BAND",
    fluencyLabel: "Fluency & Coherence",
    lexicalLabel: "Lexical Resource",
    grammarLabel: "Grammatical Range",
    pronunciationLabel: "Pronunciation Quality",
    correctionsTitle: "Lexical & Grammatical Insights",
    grammarCorr: "Grammar Correction",
    vocabCorr: "Lexical Suggestion",
    positiveCorr: "Good Usage",
    restartBtnText: "Start New Practice",
    examinerSpeaking: (name: string): string => `${name.toUpperCase()} SPEAKING...`,
    examiners: [
      { id: "sophia", name: "Sophia", accent: "American Accent", description: "Friendly, speaks clearly, perfect for intermediate level practice.", avatar: "S" },
      { id: "alex", name: "Alex", accent: "British Accent", description: "Academic and formal, simulated after a real IDP examiner.", avatar: "A" },
      { id: "david", name: "David", accent: "Australian Accent", description: "Natural tempo with mild dialect, great for advanced listeners.", avatar: "D" },
    ]
  }
};
