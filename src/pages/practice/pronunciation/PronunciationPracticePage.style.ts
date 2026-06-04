import { StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get("window")

export const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: theme.text,
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
    flex: 1,
  },
  headerRight: {
    padding: 4,
  },
  listLoaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  pageIntro: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.text,
    marginBottom: 6,
  },
  pageDesc: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  topicCard: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  topicCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 12,
  },
  topicIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.primary + "12",
    justifyContent: "center",
    alignItems: "center",
  },
  topicTitleCol: {
    flex: 1,
  },
  topicCardTitle: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  topicCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  topicCardBadge: {
    fontSize: 12,
    color: theme.textSecondary,
    fontWeight: "600",
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: "center",
    marginTop: 12,
  },
  
  // Detail page styles
  videoCard: {
    backgroundColor: "#000000",
    height: 220,
    width: "100%",
    position: "relative",
  },
  webview: {
    flex: 1,
  },
  // Custom Controls Overlay & Buttons
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  controlsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  controlBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.backgroundAlt,
  },
  controlBtnActive: {
    backgroundColor: theme.primary + "15",
    borderColor: theme.primary,
  },
  controlBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.text,
  },
  controlBtnTextActive: {
    color: theme.primary,
    fontWeight: "700",
  },
  speedGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  speedLabel: {
    fontSize: 11,
    color: theme.textSecondary,
    marginRight: 2,
    fontWeight: "600",
  },
  speedBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: theme.backgroundAlt,
    borderWidth: 1,
    borderColor: theme.border,
  },
  speedBtnActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  speedBtnText: {
    fontSize: 10,
    color: theme.textSecondary,
    fontWeight: "600",
  },
  speedBtnTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  timerText: {
    fontSize: 11,
    color: theme.textSecondary,
    fontWeight: "600",
    alignSelf: "center",
    marginRight: 4,
  },
  
  // Segmented Workspace Tabs
  workspaceTabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.background,
    gap: 8,
  },
  workspaceTabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: theme.backgroundAlt,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },
  workspaceTabBtnActive: {
    backgroundColor: theme.secondary + "15",
    borderColor: theme.secondary,
  },
  workspaceTabBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.textSecondary,
  },
  workspaceTabBtnTextActive: {
    color: theme.secondary,
    fontWeight: "700",
  },

  // Shadowing list
  shadowingList: {
    padding: 16,
  },
  sentenceRow: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  sentenceRowActive: {
    borderColor: theme.primary,
    backgroundColor: theme.primary + "06",
  },
  sentenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sentenceTime: {
    fontSize: 12,
    color: theme.primary,
    fontWeight: "600",
  },
  translateBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: theme.backgroundAlt,
    borderWidth: 1,
    borderColor: theme.border,
  },
  translateBtnText: {
    fontSize: 10,
    color: theme.textSecondary,
    fontWeight: "600",
  },
  clickableWordsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  wordPressable: {
    paddingVertical: 2,
  },
  wordText: {
    fontSize: 15,
    color: theme.text,
    lineHeight: 22,
  },
  sentenceTranslation: {
    marginTop: 8,
    fontSize: 13,
    color: theme.textSecondary,
    fontStyle: "italic",
    borderTopWidth: 0.5,
    borderTopColor: theme.border,
    paddingTop: 6,
  },

  // Vocabulary tab list
  vocabList: {
    padding: 16,
  },
  vocabCard: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  vocabCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  vocabWordCol: {
    flex: 1,
  },
  vocabWord: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.text,
  },
  vocabIpa: {
    fontSize: 13,
    color: theme.primary,
    fontWeight: "600",
    marginTop: 2,
  },
  vocabActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  vocabAudioBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: theme.primary + "12",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  vocabAudioBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.primary,
  },
  vocabSaveBtn: {
    padding: 6,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 12,
  },
  vocabFieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.textSecondary,
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  vocabMeaning: {
    fontSize: 14,
    color: theme.text,
    lineHeight: 20,
    marginBottom: 10,
  },
  vocabExample: {
    fontSize: 13,
    color: theme.textSecondary,
    fontStyle: "italic",
    lineHeight: 18,
  },
  vocabTranslation: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },

  // Dictionary modal sheet
  dictModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  dictModalContent: {
    backgroundColor: theme.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },
  dictModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dictModalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.text,
  },
  dictModalSaveBtn: {
    padding: 6,
  },
  dictModalBody: {
    paddingBottom: 24,
  },
  dictPhonetics: {
    fontSize: 14,
    color: theme.primary,
    fontWeight: "600",
    marginBottom: 12,
  },
  dictLoadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  dictLoadingText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 12,
  },
  dictSection: {
    marginBottom: 14,
  },
  dictSectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.textSecondary,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  dictText: {
    fontSize: 14,
    color: theme.text,
    lineHeight: 20,
  },
  dictExampleText: {
    fontSize: 13,
    color: theme.textSecondary,
    fontStyle: "italic",
    lineHeight: 18,
  },
  dictTranslateText: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
  closeModalBtn: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  closeModalBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
})
