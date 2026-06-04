import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '700',
    marginLeft: 12,
    flex: 1,
  },
  headerRight: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  // Hero Card
  heroCard: {
    margin: 16,
    padding: 20,
    borderRadius: 24,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.backgroundAlt,
    marginRight: 16,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.text,
  },
  scoreUnit: {
    fontSize: 9,
    fontWeight: '600',
    color: theme.textSecondary,
    marginTop: -1,
  },
  heroMeta: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    color: theme.textSecondary,
    lineHeight: 16,
  },
  // Filter Panel
  filterPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: theme.backgroundAlt,
    padding: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
  },
  filterCount: {
    fontSize: 11,
    color: theme.textSecondary,
    fontWeight: '700',
    marginLeft: 10,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 4,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterTabActive: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
  },
  filterTabActiveCorrect: {
    backgroundColor: theme.success + '15',
    borderWidth: 1,
    borderColor: theme.success,
  },
  filterTabActiveIncorrect: {
    backgroundColor: theme.error + '15',
    borderWidth: 1,
    borderColor: theme.error,
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.textSecondary,
  },
  filterTabTextActive: {
    color: theme.primary,
  },
  filterTabTextActiveCorrect: {
    color: theme.success,
  },
  filterTabTextActiveIncorrect: {
    color: theme.error,
  },
  // Section Advice
  adviceSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: theme.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 16,
  },
  adviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  adviceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.text,
  },
  adviceList: {
    gap: 8,
  },
  adviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  adviceBullet: {
    fontSize: 12,
    color: theme.success,
    fontWeight: '800',
    marginTop: 1,
  },
  adviceText: {
    flex: 1,
    fontSize: 12,
    color: theme.textSecondary,
    lineHeight: 18,
  },
  // Explanation Card
  explainCard: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
  explainCardCorrect: {
    borderColor: theme.success + '40',
  },
  explainCardIncorrect: {
    borderColor: theme.error + '40',
  },
  explainCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: theme.backgroundAlt + '50',
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  explainCardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  numBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numBadgeCorrect: {
    backgroundColor: theme.success,
  },
  numBadgeIncorrect: {
    backgroundColor: theme.error,
  },
  numBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  explainTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.text,
    flex: 1,
  },
  compareBox: {
    flexDirection: 'row',
    gap: 12,
  },
  compareCol: {
    alignItems: 'flex-end',
  },
  compareLabel: {
    fontSize: 10,
    color: theme.textSecondary,
    marginBottom: 2,
  },
  compareVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  compareValCorrect: {
    color: theme.success,
  },
  compareValIncorrect: {
    color: theme.error,
  },
  // Analysis block
  aiAnalysisBlock: {
    padding: 16,
  },
  aiAnalysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  aiAnalysisLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiAnalysisText: {
    fontSize: 13,
    color: theme.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  // Pro Tip block
  proTipBlock: {
    backgroundColor: theme.backgroundAlt,
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.warning,
  },
  proTipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  proTipLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.warning,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  proTipText: {
    fontSize: 12,
    color: theme.textSecondary,
    lineHeight: 18,
  },
  // Loading and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '800',
    color: theme.text,
    textAlign: 'center',
  },
  loadingSubText: {
    marginTop: 6,
    fontSize: 12,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 15,
    color: theme.textSecondary,
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 22,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  btnPrimary: {
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
