/**
 * Muscat Bay Color Theme System
 * Complete color palette and utility functions for consistent theming
 */

// ===============================
// CORE MUSCAT BAY COLOR PALETTE
// ===============================

export const MUSCAT_BAY_COLORS = {
  // Primary Brand Colors
  primary: {
    DEFAULT: '#4E4456',        // Main brand color - Deep purple-gray
    50: '#F8F7F8',            // Ultra light
    100: '#F1EEF2',           // Very light
    200: '#E3DDE6',           // Light
    300: '#D5CCD9',           // Medium light
    400: '#C7BBCC',           // Medium
    500: '#B9AABF',           // Medium dark
    600: '#A598AC',           // Dark
    700: '#918699',           // Darker
    800: '#7E708A',           // Lighter variant for hover states
    900: '#6B5E77',           // Deep
    950: '#3B3241',           // Darker variant for active states
    light: '#7E708A',          // Lighter variant for hover states
    dark: '#3B3241',           // Darker variant for active states
  },
  
  // Secondary Colors - Soft Teal
  secondary: {
    DEFAULT: '#A8D5E3',        // Soft teal for highlights
    50: '#F7FDFE',            // Ultra light teal
    100: '#EEFBFC',           // Very light teal
    200: '#DDF7F9',           // Light teal
    300: '#CCF3F6',           // Medium light teal
    400: '#BBEFF3',           // Medium teal
    500: '#A8D5E3',           // Default soft teal
    600: '#7BB3C7',           // Darker teal
    700: '#5E91AB',           // Deep teal
    800: '#416F8F',           // Very deep teal
    900: '#244D73',           // Darkest teal
    light: '#C3FBF4',          // Very light teal
    dark: '#7BB3C7',           // Darker teal
  },
  
  // Accent Colors - Muted Gold
  accent: {
    DEFAULT: '#BFA181',        // Muted gold for warnings/accents
    50: '#FDF9F6',            // Ultra light gold
    100: '#FBF3ED',           // Very light gold
    200: '#F7E7DB',           // Light gold
    300: '#F3DBC9',           // Medium light gold
    400: '#EFCFB7',           // Medium gold
    500: '#BFA181',           // Default muted gold
    600: '#A68B5B',           // Darker gold
    700: '#8D7535',           // Deep gold
    800: '#745F0F',           // Very deep gold
    900: '#5B4900',           // Darkest gold
    light: '#F2F0EA',          // Light cream
    dark: '#A68B5B',           // Darker gold
  },
  
  // Status Colors
  success: {
    DEFAULT: '#10B981',        // Green for positive metrics
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
    light: '#6EE7B7',
    dark: '#047857',
  },
  
  warning: {
    DEFAULT: '#F59E0B',        // Amber for warnings
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
    light: '#FCD34D',
    dark: '#D97706',
  },
  
  info: {
    DEFAULT: '#0A1828',        // Deep classic blue for information
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#0A1828',           // Deep navy
    light: '#3B82F6',
    dark: '#1E40AF',
  },
  
  error: {
    DEFAULT: '#EF4444',        // Red for errors
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
    light: '#F87171',
    dark: '#DC2626',
  },
  
  // Extended Muscat Bay Palette
  muscat: {
    purple: {
      DEFAULT: '#5f5168',       // Original logo purple
      light: '#8A7E92',
      dark: '#4A3F4F',
    },
    teal: {
      DEFAULT: '#A8D5E3',       // Logo teal accent
      light: '#C3FBF4',
      dark: '#7BB3C7',
    },
    gold: {
      DEFAULT: '#BFA181',       // Warm gold
      light: '#F2F0EA',
      dark: '#A68B5B',
    },
    cream: '#F2F0EA',           // Light cream
    navy: '#0A1828',            // Deep navy
    white: '#ffffff',           // Pure white
  },
  
  // Chart Colors - Muscat Bay themed
  chart: {
    1: '#4E4456',               // Primary purple
    2: '#A8D5E3',               // Teal
    3: '#BFA181',               // Gold
    4: '#0A1828',               // Navy
    5: '#5f5168',               // Logo purple
    6: '#C3FBF4',               // Light teal
    7: '#F2F0EA',               // Cream
    8: '#10B981',               // Success green
    9: '#EF4444',               // Error red
    10: '#6A5ACD',              // Accent purple
  },
  
  // Legacy support for JS usage
  primary_: '#4E4456',
  primaryLight: '#7E708A',
  primaryDark: '#3B3241',
  secondary_: '#A8D5E3',
  accent_: '#BFA181',
  success_: '#10B981',
  warning_: '#F59E0B',
  info_: '#0A1828',
  error_: '#EF4444',
};

// ===============================
// CHART COLOR ARRAYS
// ===============================

export const CHART_COLORS = [
  MUSCAT_BAY_COLORS.primary.DEFAULT,
  MUSCAT_BAY_COLORS.secondary.DEFAULT,
  MUSCAT_BAY_COLORS.accent.DEFAULT,
  MUSCAT_BAY_COLORS.info.DEFAULT,
  MUSCAT_BAY_COLORS.muscat.purple.DEFAULT,
  MUSCAT_BAY_COLORS.secondary.light,
  MUSCAT_BAY_COLORS.accent.light,
  MUSCAT_BAY_COLORS.success.DEFAULT,
  MUSCAT_BAY_COLORS.error.DEFAULT,
  '#6A5ACD',
];

export const GRADIENT_COLORS = {
  primary: `linear-gradient(135deg, ${MUSCAT_BAY_COLORS.primary.DEFAULT} 0%, ${MUSCAT_BAY_COLORS.primary.dark} 100%)`,
  secondary: `linear-gradient(135deg, ${MUSCAT_BAY_COLORS.secondary.DEFAULT} 0%, ${MUSCAT_BAY_COLORS.secondary.dark} 100%)`,
  accent: `linear-gradient(135deg, ${MUSCAT_BAY_COLORS.accent.DEFAULT} 0%, ${MUSCAT_BAY_COLORS.accent.dark} 100%)`,
  success: `linear-gradient(135deg, ${MUSCAT_BAY_COLORS.success.DEFAULT} 0%, ${MUSCAT_BAY_COLORS.success.dark} 100%)`,
  warning: `linear-gradient(135deg, ${MUSCAT_BAY_COLORS.warning.DEFAULT} 0%, ${MUSCAT_BAY_COLORS.warning.dark} 100%)`,
  info: `linear-gradient(135deg, ${MUSCAT_BAY_COLORS.info.light} 0%, ${MUSCAT_BAY_COLORS.info.DEFAULT} 100%)`,
  error: `linear-gradient(135deg, ${MUSCAT_BAY_COLORS.error.DEFAULT} 0%, ${MUSCAT_BAY_COLORS.error.dark} 100%)`,
};

// ===============================
// CATEGORY COLOR MAPPINGS
// ===============================

export const CATEGORY_COLORS = {
  'Pumping Station': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    accent: MUSCAT_BAY_COLORS.info.light,
  },
  'Lifting Station': {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    accent: MUSCAT_BAY_COLORS.success.DEFAULT,
  },
  'Apartment': {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
    accent: MUSCAT_BAY_COLORS.primary.light,
  },
  'Street Light': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    accent: MUSCAT_BAY_COLORS.warning.DEFAULT,
  },
  'Beachwell': {
    bg: 'bg-cyan-100',
    text: 'text-cyan-800',
    border: 'border-cyan-200',
    accent: MUSCAT_BAY_COLORS.secondary.DEFAULT,
  },
  'Central Park': {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    accent: MUSCAT_BAY_COLORS.success.light,
  },
  'CIF Kitchen': {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    accent: MUSCAT_BAY_COLORS.accent.DEFAULT,
  },
  'Security Building': {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    accent: MUSCAT_BAY_COLORS.error.DEFAULT,
  },
  'Village Square': {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    accent: MUSCAT_BAY_COLORS.info.DEFAULT,
  },
  'Irrigation Tank': {
    bg: 'bg-teal-100',
    text: 'text-teal-800',
    border: 'border-teal-200',
    accent: MUSCAT_BAY_COLORS.secondary.dark,
  },
  'Actuator DB': {
    bg: 'bg-pink-100',
    text: 'text-pink-800',
    border: 'border-pink-200',
    accent: MUSCAT_BAY_COLORS.accent.light,
  },
  'Zone Light': {
    bg: 'bg-lime-100',
    text: 'text-lime-800',
    border: 'border-lime-200',
    accent: MUSCAT_BAY_COLORS.success.light,
  },
  'Bank Muscat': {
    bg: 'bg-violet-100',
    text: 'text-violet-800',
    border: 'border-violet-200',
    accent: MUSCAT_BAY_COLORS.primary.DEFAULT,
  },
  'Helipad': {
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-200',
    accent: MUSCAT_BAY_COLORS.info.dark,
  },
  'Guard House': {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200',
    accent: MUSCAT_BAY_COLORS.warning.light,
  },
  'ROP Building': {
    bg: 'bg-rose-100',
    text: 'text-rose-800',
    border: 'border-rose-200',
    accent: MUSCAT_BAY_COLORS.error.light,
  },
  'Other': {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    accent: '#6B7280',
  },
};

// ===============================
// UTILITY FUNCTIONS
// ===============================

/**
 * Get category color classes for Tailwind CSS
 * @param {string} category - The category name
 * @returns {object} Object with bg, text, and border classes
 */
export const getCategoryColors = (category) => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS['Other'];
};

/**
 * Get rank badge colors for different positions
 * @param {number} rank - The rank (0-based)
 * @returns {string} Tailwind classes for the rank badge
 */
export const getRankBadgeColors = (rank) => {
  if (rank === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg';
  if (rank === 1) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-md';
  if (rank === 2) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-md';
  return 'bg-gradient-to-r from-slate-400 to-slate-600 text-white';
};

/**
 * Get performance colors based on percentage
 * @param {number} percentage - Performance percentage (0-100)
 * @returns {object} Object with color classes and hex values
 */
export const getPerformanceColors = (percentage) => {
  if (percentage >= 80) {
    return {
      bg: 'bg-green-500',
      text: 'text-green-800',
      border: 'border-green-200',
      hex: MUSCAT_BAY_COLORS.success.DEFAULT,
    };
  }
  if (percentage >= 60) {
    return {
      bg: 'bg-yellow-500',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      hex: MUSCAT_BAY_COLORS.warning.DEFAULT,
    };
  }
  return {
    bg: 'bg-red-500',
    text: 'text-red-800',
    border: 'border-red-200',
    hex: MUSCAT_BAY_COLORS.error.DEFAULT,
  };
};

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color string
 * @returns {object} RGB values
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
};

/**
 * Get RGBA color string
 * @param {string} hex - Hex color
 * @param {number} alpha - Alpha value (0-1)
 * @returns {string} RGBA color string
 */
export const getRgbaColor = (hex, alpha = 1) => {
  const rgb = hexToRgb(hex);
  return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : hex;
};

/**
 * Generate chart colors array with specified length
 * @param {number} length - Number of colors needed
 * @returns {array} Array of color strings
 */
export const generateChartColors = (length) => {
  const colors = [];
  for (let i = 0; i < length; i++) {
    colors.push(CHART_COLORS[i % CHART_COLORS.length]);
  }
  return colors;
};

/**
 * Get status color based on value ranges
 * @param {number} value - The value to evaluate
 * @param {object} thresholds - Object with good, warning, error thresholds
 * @returns {object} Color information
 */
export const getStatusColor = (value, thresholds = { good: 80, warning: 60 }) => {
  if (value >= thresholds.good) {
    return {
      color: MUSCAT_BAY_COLORS.success.DEFAULT,
      bg: 'bg-green-100',
      text: 'text-green-800',
      status: 'good',
    };
  }
  if (value >= thresholds.warning) {
    return {
      color: MUSCAT_BAY_COLORS.warning.DEFAULT,
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      status: 'warning',
    };
  }
  return {
    color: MUSCAT_BAY_COLORS.error.DEFAULT,
    bg: 'bg-red-100',
    text: 'text-red-800',
    status: 'error',
  };
};

/**
 * Generate CSS custom properties for Muscat Bay colors
 * @returns {object} CSS custom properties object
 */
export const generateCSSCustomProperties = () => {
  const properties = {};
  
  Object.entries(MUSCAT_BAY_COLORS).forEach(([key, value]) => {
    if (typeof value === 'string') {
      properties[`--muscat-${key}`] = value;
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (typeof subValue === 'string') {
          properties[`--muscat-${key}-${subKey}`] = subValue;
        }
      });
    }
  });
  
  return properties;
};

// ===============================
// COMPONENT HELPER FUNCTIONS
// ===============================

/**
 * Get button variant styles
 * @param {string} variant - Button variant (primary, secondary, outline, ghost)
 * @param {string} size - Button size (sm, md, lg)
 * @returns {string} Tailwind classes
 */
export const getButtonStyles = (variant = 'primary', size = 'md') => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl',
  };
  
  const variantStyles = {
    primary: `bg-primary hover:bg-primary-dark text-white focus:ring-primary/50 shadow-muscat hover:shadow-muscat-lg`,
    secondary: `bg-secondary hover:bg-secondary-dark text-white focus:ring-secondary/50 shadow-muscat hover:shadow-muscat-lg`,
    outline: `border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50`,
    ghost: `text-primary hover:bg-primary/10 focus:ring-primary/50`,
  };
  
  return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;
};

/**
 * Get card styles with Muscat Bay theming
 * @param {boolean} interactive - Whether the card is interactive
 * @returns {string} Tailwind classes
 */
export const getCardStyles = (interactive = true) => {
  const baseStyles = 'bg-white rounded-xl border border-slate-200';
  const shadowStyles = interactive 
    ? 'shadow-muscat hover:shadow-muscat-lg transition-all duration-300'
    : 'shadow-muscat';
  const interactiveStyles = interactive 
    ? 'hover:-translate-y-1 transform cursor-pointer' 
    : '';
  
  return `${baseStyles} ${shadowStyles} ${interactiveStyles}`;
};

/**
 * Export for backward compatibility
 */
export const COLORS = {
  primary: MUSCAT_BAY_COLORS.primary_,
  primaryLight: MUSCAT_BAY_COLORS.primaryLight,
  primaryDark: MUSCAT_BAY_COLORS.primaryDark,
  secondary: MUSCAT_BAY_COLORS.secondary_,
  accent: MUSCAT_BAY_COLORS.accent_,
  success: MUSCAT_BAY_COLORS.success_,
  warning: MUSCAT_BAY_COLORS.warning_,
  info: MUSCAT_BAY_COLORS.info_,
  error: MUSCAT_BAY_COLORS.error_,
  chart: CHART_COLORS,
};

export default MUSCAT_BAY_COLORS;
