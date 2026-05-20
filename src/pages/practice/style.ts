import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.textSecondary,
    marginTop: 2,
  },
  // Skill Tabs - Phong cách Segmented thanh lịch
  skillTabsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  skillTabs: {
    flexDirection: 'row',
    backgroundColor: theme.backgroundAlt,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.border,
  },
  skillTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  skillTabActive: {
    backgroundColor: theme.card,
    // Subtle shadow for the active tab
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skillTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  skillTabTextActive: {
    color: theme.primary,
  },
  // Practice List
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  practiceCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardAccent: {
    width: 4,
    height: '60%',
    borderRadius: 2,
    marginRight: 16,
  },
  cardMainContent: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: theme.backgroundAlt,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  chevronContainer: {
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 15,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  // Top Tabs Styles
  topTabs: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 16,
    backgroundColor: theme.backgroundAlt,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.border,
  },
  topTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  topTabActive: {
    backgroundColor: theme.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  topTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.textSecondary,
  },
  topTabTextActive: {
    color: theme.primary,
  },
  // Mode Cards Selector
  modeCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  modeCard: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: theme.border,
    alignItems: 'flex-start',
  },
  modeCardActive: {
    backgroundColor: theme.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modeCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 4,
    color: theme.text,
  },
  modeCardDesc: {
    fontSize: 11,
    color: theme.textSecondary,
    lineHeight: 14,
  },
  // Material Section Styles
  materialSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  materialBigCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  materialIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  materialTextContent: {
    flex: 1,
    paddingRight: 8,
  },
  materialTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 4,
  },
  materialDesc: {
    fontSize: 12,
    color: theme.textSecondary,
    lineHeight: 16,
  },
});
