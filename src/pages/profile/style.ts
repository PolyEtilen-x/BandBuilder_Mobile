import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: theme.primary,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  proBadge: {
    marginTop: 12,
    backgroundColor: '#fbbf24',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  proBadgeText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  // Stats Section
  statsContainer: {
    flexDirection: 'row',
    padding: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: theme.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  // Settings Groups
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 1,
  },
  menuGroup: {
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: theme.text,
  },
  menuValue: {
    fontSize: 14,
    color: theme.textSecondary,
    marginRight: 8,
  },
  logoutButton: {
    marginHorizontal: 24,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: theme.backgroundAlt,
    borderWidth: 1,
    borderColor: '#ef444433',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
  },
});
