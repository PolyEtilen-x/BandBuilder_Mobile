import React, { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Platform,
  UIManager
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
import { styles } from "./RoadmapSetupPage.styles"
import { setupTranslations } from "./RoadmapSetupPage.translations"

interface Props {
  navigation: any
}

type LearningType = "ielts" | "general"

export default function RoadmapSetupPage({ navigation }: Props) {
  const { i18n } = useTranslation()
  const isVi = i18n.language === "vi"
  const t = isVi ? setupTranslations.vi : setupTranslations.en

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
      setSkills((prev) => ({ ...prev, [skillKey]: list[currentIdx + 1] }))
    } else if (direction === "down" && currentIdx > 0) {
      setSkills((prev) => ({ ...prev, [skillKey]: list[currentIdx - 1] }))
    }
  }

  const handleSubmit = () => {
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
      <LinearGradient colors={["#0f172a", "#1e293b"]} style={styles.container} />

      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.headerTitle}</Text>
        <View style={styles.headerRight}>
          <Compass size={18} color="#3b82f6" />
        </View>
      </View>

      {isAssembling ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingTitle}>{t.loadingTitle}</Text>
          <Text style={styles.loadingDesc}>{t.loadingDesc}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header Card */}
          <View style={styles.introCard}>
            <View style={styles.badgeRow}>
              <Compass size={14} color="#3b82f6" />
              <Text style={styles.badgeText}>{t.engineBadge}</Text>
            </View>
            <Text style={styles.introTitle}>{t.introTitle}</Text>
            <Text style={styles.introDesc}>{t.introDesc}</Text>
          </View>

          {/* 1. FOCUS SELECTION */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>{t.learningFocusTitle}</Text>

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
                <Text style={styles.focusDesc}>{t.targetBandDesc}</Text>
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
                <Text style={styles.focusDesc}>{t.cefrLevelDesc}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 2. BASELINE vs TARGET LEVEL */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>{t.levelExpectationTitle}</Text>

            <View style={styles.selectorPairRow}>
              <View style={styles.selectorCol}>
                <View style={styles.levelLabelRow}>
                  <Target size={14} color="#cbd5e1" />
                  <Text style={styles.levelLabel}>{t.currentLevelLabel}</Text>
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
                  <Text style={styles.levelLabel}>{t.targetLevelLabel}</Text>
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
            <Text style={styles.sectionLabel}>{t.adjustSkillTitle}</Text>

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
              <Text style={styles.submitBtnText}>{t.generateBtnText}</Text>
              <ChevronRight size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

        </ScrollView>
      )}
    </SafeAreaView>
  )
}
