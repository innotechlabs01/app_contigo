import { colors } from './colors';
import { typography } from './typography';
import { spacing, radius, shadow, motion } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadow,
  motion,
} as const;

export type Theme = typeof theme;

export { colors } from './colors';
export { typography } from './typography';
export { spacing, radius, shadow, motion } from './spacing';
export { statusColors, statusLabels } from './status';
