import { colors } from './colors';

export const lightTheme = {
  colors: {
    ...colors,
    background: colors.light,
    text: colors.textDark,
    cardBackground: colors.white,
    borderColor: '#dee2e6',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  borderRadius: '4px',
};

export const darkTheme = {
  colors: {
    ...colors,
    background: colors.dark,
    text: colors.textLight,
    cardBackground: '#495057',
    borderColor: '#6c757d',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  borderRadius: '4px',
};

export type Theme = typeof lightTheme;