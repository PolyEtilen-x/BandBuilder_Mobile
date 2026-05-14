import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    paddingBottom: 100,
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.text,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 16,
    color: theme.textSecondary,
    marginTop: 4,
  },
  // Roadmap Node Styles
  nodeContainer: {
    width: width,
    alignItems: 'center',
    marginVertical: 15,
  },
  nodeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  nodeInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeLabel: {
    position: 'absolute',
    top: 90,
    width: 120,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: theme.text,
  },
  // Connection line
  line: {
    position: 'absolute',
    width: 4,
    height: 40,
    backgroundColor: theme.border,
    zIndex: -1,
  },
  // Status specific
  activeNode: {
    borderColor: '#f59e0b',
    backgroundColor: '#fbbf24',
  },
  completedNode: {
    borderColor: '#10b981',
    backgroundColor: '#34d399',
  },
  lockedNode: {
    borderColor: theme.border,
    backgroundColor: theme.backgroundAlt,
  },
});
