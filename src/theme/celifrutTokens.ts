/**
 * Tokens de marca Celifrut (port del design system a React Native).
 * RN no tiene CSS :root, así que exponemos los colores como objeto reutilizable.
 * Valores tomados de handoff/login (colors_and_type.css / CLAUDE-CODE-PROMPT.md).
 */
export const celifrut = {
  brown: '#6E3A14',
  brownDark: '#4E2810',
  brownSoft: '#8C5A30',
  green: '#7DBE2A',
  greenDark: '#5E9A1C',
  greenSoft: '#A6D75C',
  yellow: '#F5C42B',
  orange: '#F39521',
  orangeDark: '#D87A0A',
  cream: '#FFF9F0',
  paper: '#FFFFFF',
  sand50: '#FAF3E6',
  sand100: '#F2E7D2',
  stone300: '#C9B894',
  stone400: '#9C8A6A',
  stone500: '#6B5C44',
  stone700: '#3F3526',
  borderSoft: '#EFE3CC',
  borderMedium: '#E0CFAC',
  borderStrong: '#C9B894',
  // alias semánticos
  fg2: '#3F3526',
  fg3: '#6B5C44',
  fg4: '#9C8A6A',
} as const;
