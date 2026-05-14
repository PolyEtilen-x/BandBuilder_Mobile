import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useThemeStore } from '@/services/theme/theme.store';

export function useThemeColor() {
  const systemColorScheme = useColorScheme() ?? 'light';
  const { mode } = useThemeStore();

  const activeTheme = mode === 'system' ? systemColorScheme : mode;

  return Colors[activeTheme as 'light' | 'dark'];
}
