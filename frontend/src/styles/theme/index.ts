import { colors } from './colors';

export const lightTheme = {
  colors: {
    ...colors,
    background: colors.light,
    cardBackground: colors.white,
    borderColor: colors.borderColorLight,
    inputBackground: colors.inputBackgroundLight,
    inputText: colors.black,
    text: colors.black, 
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
    text: colors.white,
    cardBackground: '#495057',
    borderColor: colors.borderColorDark,
    inputBackground: colors.inputBackgroundDark,
    inputText: colors.white,
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  borderRadius: '4px',
};

export type Theme = typeof lightTheme;