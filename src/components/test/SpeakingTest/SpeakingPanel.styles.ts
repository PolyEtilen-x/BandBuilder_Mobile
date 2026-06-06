import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 48,
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 8,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    flex: 1,
  },
  promptContainer: {
    padding: 20,
  },
  sectionMeta: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  topicTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  scenarioBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  boxTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  boxText: {
    fontSize: 14,
    lineHeight: 22,
  },
  promptsSection: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  promptsList: {
    gap: 10,
    paddingLeft: 4,
  },
  promptItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  promptItemText: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    lineHeight: 20,
  },
  notesSection: {
    marginTop: 10,
  },
  noteClubCard: {
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  clubName: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  clubDetails: {
    fontSize: 12,
    lineHeight: 18,
  },
  supportContainer: {
    padding: 20,
  },
  supportHeading: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  loaderWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  loaderText: {
    fontSize: 13,
  },
  hintsDisplayBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  hintCategoryLabel: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
  },
  hintItemText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  hintGrammarText: {
    fontSize: 13,
    lineHeight: 20,
  },
  emptyHintText: {
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  bandSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  bandBtn: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bandBtnText: {
    fontSize: 13,
  },
  errorBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorBoxText: {
    fontSize: 13,
  },
  sampleAnswerBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  sampleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sampleLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  chargedBadge: {
    fontSize: 11,
    fontWeight: '700',
  },
  sampleAnswerText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  tipContainer: {
    borderTopWidth: 1,
    paddingTop: 10,
  },
  tipLabel: {
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
