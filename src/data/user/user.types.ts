export interface UserProfileDTO {
  user: {
    userId: string;
    email: string;
    fullName: string;
    avatarUrl: string;
    isPro: boolean;
    totalCredits: number;
    usedCredits: number;
    createdAt: string;
  };
  stats: {
    testsCompleted: number;
    avgBandScore: number;
    studyStreak: number;
    totalStudyTime: number;
  };
  recentActivities: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  title: string;
  skill: "Reading" | "Listening" | "Writing" | "Speaking";
  score: any;
  date: string;
  status: "COMPLETED" | "IN_PROGRESS" | "FAILED";
}

export interface UpdateProfileRequest {
  fullName?: string;
  avatarUrl?: string;
}
