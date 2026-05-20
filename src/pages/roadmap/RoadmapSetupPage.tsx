import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  GraduationCap,
  BookOpen,
  Target,
  Sparkles,
  Zap,
  Mic,
  Headphones,
  PenTool
} from "lucide-react-native"
import { useTranslation } from "react-i18next"

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const { width } = Dimensions.get("window")

interface Props {
  navigation: any
}

type LearningType = "ielts" | "general"

export default function RoadmapSetupPage({ navigation }: Props) {
  const { i18n } = useTranslation()
  const isVi = i18n.language === "vi"

  const [learningType, setLearningType] = useState<LearningType>("ielts")
  const [currentLevel, setCurrentLevel] = useState("5.0")
  const [targetLevel, setTargetLevel] = useState("6.5")
  const [isAssembling, setIsAssembling] = useState(false)

  const [skills, setSkills] = useState({
    speaking: "5.0",
    listening: "5.0",
    reading: "5.0",
    writing: "5.0"
  })

  const ieltsBands = ["4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0+"]
  const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"]

  const activeLevelList = learningType === "ielts" ? ieltsBands : cefrLevels

  const handleSkillChange = (skillKey: keyof typeof skills, direction: "up" | "down") => {
    const list = activeLevelList
    const currentIdx = list.indexOf(skills[skillKey])
    
    if (direction === "up" && currentIdx < list.length - 1) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setSkills((prev) => ({ ...prev, [skillKey]: list[currentIdx + 1] }))
    } else if (direction === "down" && currentIdx > 0) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setSkills((prev) => ({ ...prev, [skillKey]: list[currentIdx - 1] }))
    }
  }

  const handleSubmit = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setIsAssembling(true)

    // Simulate Band-Architect roadmap assembly
    setTimeout(() => {
      setIsAssembling(false)
      // Navigate directly to the main roadmap screen
      navigation.navigate("Main", { screen: "Roadmap" })
    }, 2000)
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0f172a", "#1e293b"]} style={StyleSheet.absoluteFillObject} />

      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isVi ? "Thiết Kế Lộ Trình Học" : "Setup Roadmap"}
        </Text>
        <View style={styles.headerRight}>
          <Compass size={18} color="#3b82f6" />
        </View>
      </View>

      {isAssembling ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingTitle}>
            {isVi ? "Đang Khởi Tạo Bản Đồ Học Tập..." : "Assembling Milestones..."}
          </Text>
          <Text style={styles.loadingDesc}>
            {isVi
              ? "Trí tuệ nhân tạo đang phân tích các kỹ năng đầu vào và thiết lập các chặng lộ trình tối ưu."
              : "Our Band-Architect Engine is generating optimized study milestones based on your profile."}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header Card */}
          <View style={styles.introCard}>
            <View style={styles.badgeRow}>
              <Compass size={14} color="#3b82f6" />
              <Text style={styles.badgeText}>Band-Architect Engine v1.0</Text>
            </View>
            <Text style={styles.introTitle}>
              {isVi ? "Cá Nhân Hóa Chặng Đường" : "Map Out Your Journey"}
            </Text>
            <Text style={styles.introDesc}>
              {isVi
                ? "Trả lời vài câu hỏi trắc nghiệm để xây dựng thời khóa biểu học tập phù hợp nhất với năng lực hiện tại của bạn."
                : "Answer a few questions to build a personalized study timeline tailored to your current performance and goals."}
            </Text>
          </View>

          {/* 1. FOCUS SELECTION */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>
              {isVi ? "1. Chọn Trọng Tâm Luyện Tập" : "1. Select Learning Focus"}
            </Text>

            <View style={styles.focusRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.focusCard, learningType === "ielts" && styles.focusCardActive]}
                onPress={() => {
                  setLearningType("ielts")
                  setCurrentLevel("5.0")
                  setTargetLevel("6.5")
                  setSkills({ speaking: "5.0", listening: "5.0", reading: "5.0", writing: "5.0" })
                }}
              >
                <View style={[styles.focusIconBg, learningType === "ielts" && styles.focusIconBgActive]}>
                  <GraduationCap size={22} color={learningType === "ielts" ? "#ffffff" : "#64748b"} />
                </View>
                <Text style={styles.focusTitle}>IELTS Academic</Text>
                <Text style={styles.focusDesc}>{isVi ? "Mục tiêu Band Score" : "Target Band Score"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.focusCard, learningType === "general" && styles.focusCardActive]}
                onPress={() => {
                  setLearningType("general")
                  setCurrentLevel("B1")
                  setTargetLevel("B2")
                  setSkills({ speaking: "B1", listening: "B1", reading: "B1", writing: "B1" })
                }}
              >
                <View style={[styles.focusIconBg, learningType === "general" && styles.focusIconBgActive]}>
                  <BookOpen size={22} color={learningType === "general" ? "#ffffff" : "#64748b"} />
                </View>
                <Text style={styles.focusTitle}>General English</Text>
                <Text style={styles.focusDesc}>{isVi ? "Giao tiếp khung CEFR" : "CEFR Levels Focus"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 2. BASELINE vs TARGET LEVEL */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>
              {isVi ? "2. Thiết Lập Mốc Điểm Kỳ Vọng" : "2. Set Level Expectations"}
            </Text>

            <View style={styles.selectorPairRow}>
              <View style={styles.selectorCol}>
                <View style={styles.levelLabelRow}>
                  <Target size={14} color="#cbd5e1" />
                  <Text style={styles.levelLabel}>{isVi ? "Hiện Tại" : "Current"}</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.levelScroll}
                >
                  {activeLevelList.map((l) => {
                    const isSelected = currentLevel === l
                    return (
                      <TouchableOpacity
                        key={l}
                        activeOpacity={0.7}
                        style={[styles.levelButton, isSelected && styles.levelButtonSelected]}
                        onPress={() => setCurrentLevel(l)}
                      >
                        <Text style={[styles.levelButtonText, isSelected && styles.levelButtonTextSelected]}>
                          {l}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>
              </View>

              <View style={styles.selectorCol}>
                <View style={styles.levelLabelRow}>
                  <Sparkles size={14} color="#fbbf24" />
                  <Text style={styles.levelLabel}>{isVi ? "Mục Tiêu" : "Target"}</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.levelScroll}
                >
                  {activeLevelList.map((l) => {
                    const isSelected = targetLevel === l
                    return (
                      <TouchableOpacity
                        key={l}
                        activeOpacity={0.7}
                        style={[styles.levelButton, isSelected && styles.levelButtonSelectedTarget]}
                        onPress={() => setTargetLevel(l)}
                      >
                        <Text style={[styles.levelButtonText, isSelected && styles.levelButtonTextSelected]}>
                          {l}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>
              </View>
            </View>
          </View>

          {/* 3. CORE SKILLS BREAKDOWN */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>
              {isVi ? "3. Điều Chỉnh Chi Tiết Từng Kỹ Năng" : "3. Adjust Skill Performance"}
            </Text>

            {(Object.keys(skills) as Array<keyof typeof skills>).map((skill) => {
              const val = skills[skill]
              return (
                <View key={skill} style={styles.skillAdjustRow}>
                  <View style={styles.skillHeaderCol}>
                    {skill === "speaking" && <Mic size={16} color="#f87171" />}
                    {skill === "listening" && <Headphones size={16} color="#a78bfa" />}
                    {skill === "reading" && <BookOpen size={16} color="#34d399" />}
                    {skill === "writing" && <PenTool size={16} color="#fbbf24" />}
                    <Text style={styles.skillLabelText}>{skill.toUpperCase()}</Text>
                  </View>

                  <View style={styles.skillController}>
                    <TouchableOpacity
                      style={styles.adjustBtn}
                      onPress={() => handleSkillChange(skill, "down")}
                    >
                      <Text style={styles.adjustBtnText}>-</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.skillValBox}>
                      <Text style={styles.skillValText}>{val}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.adjustBtn}
                      onPress={() => handleSkillChange(skill, "up")}
                    >
                      <Text style={styles.adjustBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })}
          </View>

          {/* 4. SUBMIT BUTTON */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSubmit}
            style={styles.submitBtnWrap}
          >
            <LinearGradient colors={["#3b82f6", "#1d4ed8"]} style={styles.submitBtn}>
              <Zap size={18} color="#fff" />
              <Text style={styles.submitBtnText}>
                {isVi ? "Khởi Tạo Bản Đồ Lộ Trình" : "Generate Journey Map"}
              </Text>
              <ChevronRight size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
    flex: 1,
  },
  headerRight: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 20,
    marginBottom: 8,
  },
  loadingDesc: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  introCard: {
    backgroundColor: "rgba(30, 41, 59, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  badgeText: {
    color: "#60a5fa",
    fontSize: 10,
    fontWeight: "800",
  },
  introTitle: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  introDesc: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 20,
  },
  sectionCard: {
    backgroundColor: "rgba(30, 41, 59, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  sectionLabel: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 16,
  },
  focusRow: {
    flexDirection: "row",
    gap: 12,
  },
  focusCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  focusCardActive: {
    backgroundColor: "rgba(59, 130, 246, 0.08)",
    borderColor: "#3b82f6",
  },
  focusIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  focusIconBgActive: {
    backgroundColor: "#3b82f6",
  },
  focusTitle: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  focusDesc: {
    color: "#64748b",
    fontSize: 11,
  },
  selectorPairRow: {
    flexDirection: "row",
    gap: 16,
  },
  selectorCol: {
    flex: 1,
  },
  levelLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  levelLabel: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "700",
  },
  levelScroll: {
    paddingVertical: 4,
    gap: 8,
  },
  levelButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  levelButtonSelected: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderColor: "#3b82f6",
  },
  levelButtonSelectedTarget: {
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    borderColor: "#fbbf24",
  },
  levelButtonText: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "700",
  },
  levelButtonTextSelected: {
    color: "#ffffff",
  },
  skillAdjustRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 10,
  },
  skillHeaderCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  skillLabelText: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  skillController: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  adjustBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  adjustBtnText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  skillValBox: {
    width: 44,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  skillValText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  submitBtnWrap: {
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  submitBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  }
})
