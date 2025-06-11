// ===============================
// MUSCAT BAY DESIGN SYSTEM
// ===============================

/**
 * Muscat Bay Brand Color Palette
 * Based on the official logo colors and brand guidelines
 */

export const MUSCAT_BAY_COLORS = {
  // Primary Brand Colors
  primary: {
    DEFAULT: '#4E4456',      // Main brand color - Deep purple-gray
    light: '#7E708A',        // Lighter variant for hover states
    dark: '#3B3241',         // Darker variant for active states
    50: '#F8F7F8',
    100: '#F1EEF2',
    200: '#E3DCE5',
    300: '#D5CAD8',
    400: '#B69BB5',
    500: '#4E4456',
    600: '#463D4D',
    700: '#3B3241',
    800: '#302833',
    900: '#251E26',
  },

  // Secondary Colors
  secondary: {
    DEFAULT: '#A8D5E3',      // Soft teal for highlights
    light: '#C3FBF4',        // Very light teal
    dark: '#7BB3C7',         // Darker teal
    50: '#F0F9FB',
    100: '#E1F3F7',
    200: '#C3E7EF',
    300: '#A8D5E3',
    400: '#7BB3C7',
    500: '#5491AB',
    600: '#3D6F8F',
    700: '#2A4D73',
    800: '#1A2B57',
    900: '#0D093B',
  },

  // Accent Colors
  accent: {
    DEFAULT: '#BFA181',      // Muted gold for warnings/accents
    light: '#F2F0EA',        // Light cream
    dark: '#A68B5B',         // Darker gold
    50: '#FDFCFA',
    100: '#F9F7F2',
    200: '#F2F0EA',
    300: '#E5E0D5',
    400: '#D1C7B0',
    500: '#BFA181',
    600: '#A68B5B',
    700: '#8D7540',
    800: '#745F28',
    900: '#5B4913',
  },

  // Status Colors
  success: {
    DEFAULT: '#10B981',      // Green for positive metrics
    light: '#6EE7B7',
    dark: '#047857',
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  warning: {
    DEFAULT: '#F59E0B',      // Amber for warnings
    light: '#FCD34D',
    dark: '#D97706',
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  info: {
    DEFAULT: '#0A1828',      // Deep classic blue for information
    light: '#3B82F6',
    dark: '#1E40AF',
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#0A1828',
  },

  error: {
    DEFAULT: '#EF4444',      // Red for errors
    light: '#F87171',
    dark: '#DC2626',
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Extended Muscat Bay Palette
  muscat: {
    purple: '#5f5168',       // Original logo purple
    teal: '#A8D5E3',        // Logo teal accent
    gold: '#BFA181',        // Warm gold
    cream: '#F2F0EA',       // Light cream
    navy: '#0A1828',        // Deep navy
    white: '#ffffff',       // Pure white
  },

  // Neutral Colors
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
};

/**
 * Chart Color Palettes
 * Consistent color schemes for data visualization
 */
export const CHART_COLORS = {
  // Primary chart colors - Muscat Bay themed
  primary: [
    '#4E4456', '#A8D5E3', '#BFA181', '#0A1828', '#5f5168', 
    '#C3FBF4', '#F2F0EA', '#10B981', '#EF4444', '#6A5ACD'
  ],

  // Alternative palettes for different chart types
  categorical: [
    '#4E4456', // Primary purple
    '#A8D5E3', // Secondary teal
    '#BFA181', // Accent gold
    '#10B981', // Success green
    '#F59E0B', // Warning amber
    '#3B82F6', // Info blue
    '#EF4444', // Error red
    '#8B5CF6', // Purple variant
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ],

  // Sequential palettes for heatmaps and gradients
  sequential: {
    purple: ['#F8F7F8', '#E3DCE5', '#B69BB5', '#7E708A', '#4E4456', '#3B3241'],
    teal: ['#F0F9FB', '#C3E7EF', '#A8D5E3', '#7BB3C7', '#5491AB', '#3D6F8F'],
    gold: ['#FDFCFA', '#F2F0EA', '#D1C7B0', '#BFA181', '#A68B5B', '#8D7540'],
  },

  // Diverging palettes for comparison data
  diverging: {
    purpleTeal: ['#4E4456', '#7E708A', '#E3DCE5', '#C3E7EF', '#A8D5E3', '#7BB3C7'],
    goldBlue: ['#BFA181', '#D1C7B0', '#F2F0EA', '#DBEAFE', '#93C5FD', '#3B82F6'],
  },
};

/**
 * Component Style Variants
 * Consistent styling for common UI components
 */
export const COMPONENT_STYLES = {
  // Button variants
  button: {
    primary: {
      base: 'bg-primary hover:bg-primary-dark text-white',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
      ghost: 'text-primary hover:bg-primary-light hover:text-white',
    },
    secondary: {
      base: 'bg-secondary hover:bg-secondary-dark text-slate-800',
      outline: 'border-2 border-secondary text-secondary-dark hover:bg-secondary hover:text-slate-800',
      ghost: 'text-secondary-dark hover:bg-secondary-light',
    },
    accent: {
      base: 'bg-accent hover:bg-accent-dark text-slate-800',
      outline: 'border-2 border-accent text-accent-dark hover:bg-accent hover:text-slate-800',
      ghost: 'text-accent-dark hover:bg-accent-light',
    },
  },

  // Badge/Tag variants
  badge: {
    primary: 'bg-primary-100 text-primary-800 border border-primary-200',
    secondary: 'bg-secondary-100 text-secondary-800 border border-secondary-200',
    accent: 'bg-accent-100 text-accent-800 border border-accent-200',
    success: 'bg-success-100 text-success-800 border border-success-200',
    warning: 'bg-warning-100 text-warning-800 border border-warning-200',
    error: 'bg-error-100 text-error-800 border border-error-200',
    info: 'bg-info-100 text-info-800 border border-info-200',
  },

  // Alert variants
  alert: {
    success: 'bg-success-50 border-success-200 text-success-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    error: 'bg-error-50 border-error-200 text-error-800',
    info: 'bg-info-50 border-info-200 text-info-800',
  },
};

/**
 * Typography Scale
 * Consistent text sizing and styling
 */
export const TYPOGRAPHY = {
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },
  
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
};

/**
 * Spacing Scale
 * Consistent spacing values
 */
export const SPACING = {
  0: '0px',
  px: '1px',
  0.5: '0.125rem',    // 2px
  1: '0.25rem',       // 4px
  1.5: '0.375rem',    // 6px
  2: '0.5rem',        // 8px
  2.5: '0.625rem',    // 10px
  3: '0.75rem',       // 12px
  3.5: '0.875rem',    // 14px
  4: '1rem',          // 16px
  5: '1.25rem',       // 20px
  6: '1.5rem',        // 24px
  7: '1.75rem',       // 28px
  8: '2rem',          // 32px
  9: '2.25rem',       // 36px
  10: '2.5rem',       // 40px
  11: '2.75rem',      // 44px
  12: '3rem',         // 48px
  14: '3.5rem',       // 56px
  16: '4rem',         // 64px
  20: '5rem',         // 80px
  24: '6rem',         // 96px
  28: '7rem',         // 112px
  32: '8rem',         // 128px
  36: '9rem',         // 144px
  40: '10rem',        // 160px
  44: '11rem',        // 176px
  48: '12rem',        // 192px
  52: '13rem',        // 208px
  56: '14rem',        // 224px
  60: '15rem',        // 240px
  64: '16rem',        // 256px
  72: '18rem',        // 288px
  80: '20rem',        // 320px
  96: '24rem',        // 384px
};

/**
 * Border Radius Scale
 */
export const BORDER_RADIUS = {
  none: '0px',
  sm: '0.125rem',     // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',     // 6px
  lg: '0.5rem',       // 8px
  xl: '0.75rem',      // 12px
  '2xl': '1rem',      // 16px
  '3xl': '1.5rem',    // 24px
  full: '9999px',
};

/**
 * Shadow Scale
 */
export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
};

/**
 * Utility Functions
 */

/**
 * Get a color value from the palette
 * @param {string} colorPath - Dot notation path to color (e.g., 'primary.500', 'success.DEFAULT')
 * @returns {string} - Hex color value
 */
export function getColor(colorPath) {
  const keys = colorPath.split('.');
  let value = MUSCAT_BAY_COLORS;
  
  for (const key of keys) {
    value = value[key];
    if (!value) break;
  }
  
  return value || '#000000';
}

/**
 * Get chart colors for a specific number of data points
 * @param {number} count - Number of colors needed
 * @param {string} palette - Palette type ('primary', 'categorical', etc.)
 * @returns {string[]} - Array of hex color values
 */
export function getChartColors(count, palette = 'primary') {
  const colors = CHART_COLORS[palette] || CHART_COLORS.primary;
  const result = [];
  
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  
  return result;
}

/**
 * Generate CSS custom properties for the color system
 * @returns {object} - CSS custom properties object
 */
export function generateCSSCustomProperties() {
  const cssVars = {};
  
  // Generate CSS custom properties for each color
  Object.entries(MUSCAT_BAY_COLORS).forEach(([colorName, colorValue]) => {
    if (typeof colorValue === 'string') {
      cssVars[`--color-${colorName}`] = colorValue;
    } else if (typeof colorValue === 'object') {
      Object.entries(colorValue).forEach(([shade, hex]) => {
        cssVars[`--color-${colorName}-${shade}`] = hex;
      });
    }
  });
  
  return cssVars;
}

/**
 * Category color mapping for consistent UI elements
 */
export const CATEGORY_COLORS = {
  'Pumping Station': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: '#3B82F6',
  },
  'Lifting Station': {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    icon: '#10B981',
  },
  'Irrigation Tank': {
    bg: 'bg-cyan-100',
    text: 'text-cyan-800',
    border: 'border-cyan-200',
    icon: '#06B6D4',
  },
  'Actuator DB': {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    icon: '#6366F1',
  },
  'Street Light': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: '#F59E0B',
  },
  'Apartment': {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
    icon: '#8B5CF6',
  },
  'Central Park': {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: '#10B981',
  },
  'Beachwell': {
    bg: 'bg-sky-100',
    text: 'text-sky-800',
    border: 'border-sky-200',
    icon: '#0EA5E9',
  },
  'Village Square': {
    bg: 'bg-rose-100',
    text: 'text-rose-800',
    border: 'border-rose-200',
    icon: '#F43F5E',
  },
  'Security Building': {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: '#EF4444',
  },
  'CIF Kitchen': {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    icon: '#F97316',
  },
  'Bank Muscat': {
    bg: 'bg-teal-100',
    text: 'text-teal-800',
    border: 'border-teal-200',
    icon: '#14B8A6',
  },
  'Other': {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    icon: '#6B7280',
  },
};

// Export default theme object
export default {
  colors: MUSCAT_BAY_COLORS,
  chartColors: CHART_COLORS,
  components: COMPONENT_STYLES,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  categoryColors: CATEGORY_COLORS,
  utils: {
    getColor,
    getChartColors,
    generateCSSCustomProperties,
  },
};
