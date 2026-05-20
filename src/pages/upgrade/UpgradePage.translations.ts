export interface UpgradeTranslations {
  title: string;
  loadingText: string;
  introLabel: string;
  introTitle: string;
  introDesc: string;
  bestValue: string;
  speakingCredits: string;
  pronunciationMetrics: string;
  grammarCorrections: string;
  bonusPractice: (bonus: number) => string;
  unlockNow: string;
  paymentComplete: string;
  scanQrToPay: string;
  autoTopUpInfo: string;
  amount: string;
  memo: string;
  beneficiaryBank: string;
  accountNumber: string;
  waitingVerification: string;
  paymentSuccess: string;
  successTopUpDesc: (credits?: number) => string;
  viewProfile: string;
  paymentErrorTitle: string;
  paymentErrorDesc: string;
  copiedTitle: string;
  copiedDesc: string;
}

export const upgradeTranslations: Record<"vi" | "en", UpgradeTranslations> = {
  vi: {
    title: "Nâng Cấp Tài Khoản",
    loadingText: "Đang lấy bảng giá từ máy chủ...",
    introLabel: "MỞ KHÓA TẤT CẢ",
    introTitle: "Gia Tăng Băng Điểm IELTS",
    introDesc: "Nâng cấp gói lượt chấm để sử dụng đầy đủ chức năng phân tích chi tiết của Giám khảo Luyện Nói AI Sophia, Alex và David.",
    bestValue: "PHỔ BIẾN NHẤT",
    speakingCredits: "lượt chấm Speaking đầy đủ",
    pronunciationMetrics: "Phân tích phát âm & đề xuất nâng cấp",
    grammarCorrections: "Gợi ý sửa cấu trúc lỗi ngữ pháp",
    bonusPractice: (bonus: number): string => `Tặng thêm ${bonus} lượt luyện tập`,
    unlockNow: "Mở Khóa Ngay",
    paymentComplete: "Giao Dịch Thành Công",
    scanQrToPay: "Quét Mã QR Chuyển Khoản",
    autoTopUpInfo: "Hệ thống sẽ tự động cộng lượt luyện tập ngay sau khi nhận được tiền chuyển khoản.",
    amount: "Số tiền:",
    memo: "Nội dung chuyển khoản:",
    beneficiaryBank: "Ngân hàng thụ hưởng:",
    accountNumber: "Số tài khoản:",
    waitingVerification: "Đang chờ hệ thống ghi nhận giao dịch...",
    paymentSuccess: "Thanh Toán Thành Công!",
    successTopUpDesc: (credits?: number): string => `Đã nạp thành công ${credits ?? 0} lượt luyện nói IELTS vào tài khoản của bạn.`,
    viewProfile: "Kiểm tra Sổ Tay / Cá Nhân",
    paymentErrorTitle: "Lỗi thanh toán",
    paymentErrorDesc: "Không thể khởi tạo thanh toán. Vui lòng thử lại sau.",
    copiedTitle: "Sao chép thành công",
    copiedDesc: "Đã lưu nội dung vào bộ nhớ tạm!",
  },
  en: {
    title: "Upgrade Premium",
    loadingText: "Loading special offers...",
    introLabel: "GET ALL INCLUSIVE",
    introTitle: "Accelerate Your IELTS Band",
    introDesc: "Top up credits to unlock professional evaluations and face-to-face practice sessions with examiner models.",
    bestValue: "BEST VALUE",
    speakingCredits: "IELTS speaking report credits",
    pronunciationMetrics: "Detailed metrics & Lexical polish",
    grammarCorrections: "Grammar structure corrections",
    bonusPractice: (bonus: number): string => `Bonus ${bonus} study credits`,
    unlockNow: "Choose Package",
    paymentComplete: "Payment Complete",
    scanQrToPay: "Scan QR Code to Pay",
    autoTopUpInfo: "Your account credits will be topped up automatically upon transaction verification.",
    amount: "Amount:",
    memo: "Memo:",
    beneficiaryBank: "Beneficiary Bank:",
    accountNumber: "Account Number:",
    waitingVerification: "Waiting for payment verification...",
    paymentSuccess: "Payment Approved!",
    successTopUpDesc: (credits?: number): string => `Successfully topped up ${credits ?? 0} IELTS exam credits to your account.`,
    viewProfile: "View My Profile",
    paymentErrorTitle: "Payment Error",
    paymentErrorDesc: "Failed to initiate payment. Please try again.",
    copiedTitle: "Copied",
    copiedDesc: "Copied content to clipboard!",
  }
};
