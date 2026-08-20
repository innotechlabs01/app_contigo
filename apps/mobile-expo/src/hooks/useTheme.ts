import { useColorScheme } from 'react-native';
import { colors } from '@/src/theme/colors';

export type ColorTokens = typeof colors.light | typeof colors.dark;

export function useTheme(): ColorTokens {
  const colorScheme = useColorScheme();
  return colors[colorScheme === 'dark' ? 'dark' : 'light'];
}
