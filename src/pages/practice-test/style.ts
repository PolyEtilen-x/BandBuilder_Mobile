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
});
