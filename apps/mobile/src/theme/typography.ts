const families = {
  heading: 'PlayfairDisplay_700Bold',
  body: 'WorkSans_400Regular',
  bodyMedium: 'WorkSans_500Medium',
  bodySemiBold: 'WorkSans_600SemiBold',
  bodyBold: 'WorkSans_700Bold',
} as const;

const sizes = {
  xs: 12,
  sm: 14,
  md: 16,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

const fontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

export const typography = {
  fontFamilies: families,
  fontSizes: sizes,
  lineHeights,
  fontWeights,
  sizes,
  fonts: {
    ...families,
    regular: families.body,
    medium: families.bodyMedium,
    semiBold: families.bodySemiBold,
    bold: families.bodyBold,
    mono: 'Courier',
  },
} as const;

export type FontFamilyKey = keyof typeof families;
export type FontSizeKey = keyof typeof sizes;
export type LineHeightKey = keyof typeof lineHeights;
export type FontWeightKey = keyof typeof fontWeights;