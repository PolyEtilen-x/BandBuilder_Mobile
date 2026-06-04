import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    paddingTop: Platform.OS === 'ios' ? 0 : 12,
  },
  headerLeft: {
    flex: 1,
  },
  testTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.text,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  submitButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  // Tabs
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: theme.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  tabTextActive: {
    color: theme.primary,
  },
  // Content Area
  content: {
    flex: 1,
  },
  passageScroll: {
    flex: 1,
    padding: 20,
  },
  passageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 16,
    lineHeight: 30,
  },
  passageText: {
    fontSize: 16,
    lineHeight: 26,
    color: theme.text,
    textAlign: 'justify',
  },
  // Question Area
  questionScroll: {
    flex: 1,
    padding: 20,
  },
  // Question Navigator (Footer)
  footer: {
    backgroundColor: theme.card,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 12,
  },
  navTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.textSecondary,
    marginHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  navScroll: {
    paddingHorizontal: 12,
  },
  navItem: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: theme.background,
  },
  navItemActive: {
    borderColor: theme.primary,
    backgroundColor: theme.primary + '10',
  },
  navItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  navItemTextActive: {
    color: theme.primary,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 16,
    color: theme.textSecondary,
    fontWeight: '600',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorSubmitButton: {
    marginTop: 24,
    marginLeft: 0,
    paddingHorizontal: 32,
  },
  examHeader: {
    backgroundColor: '#1e293b',
    borderBottomWidth: 0,
  },
  examTestTitle: {
    color: '#fff',
  },
  examTimerContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  examTimerText: {
    color: '#fff',
  },
  examSubmitButton: {
    backgroundColor: '#3b82f6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  dictionaryContent: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    height: '70%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: theme.backgroundAlt,
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: 10,
    color: theme.text,
    fontWeight: '600',
  },
  dictScrollView: {
    flex: 1,
    marginTop: 20,
  },
  dictResultWord: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.primary,
  },
  dictResultPhonetic: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  dictResultBox: {
    marginTop: 16,
    padding: 16,
    backgroundColor: theme.backgroundAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  dictResultText: {
    fontSize: 15,
    lineHeight: 24,
    color: theme.text,
  },
  dictResultBoldText: {
    fontWeight: '700',
  },
  dictEmptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  dictEmptyText: {
    marginTop: 16,
    color: theme.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  notesContent: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    height: '60%',
  },
  notesHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notesInput: {
    flex: 1,
    backgroundColor: theme.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    color: theme.text,
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: theme.border,
    lineHeight: 24,
  },
  notesSaveButton: {
    backgroundColor: theme.primary,
    height: 50,
    borderRadius: 12,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  notesSaveButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
