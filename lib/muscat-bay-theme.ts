// ===============================
// MUSCAT BAY THEME UTILITIES
// ===============================

/**
 * Complete Muscat Bay Design System
 * This file provides consistent theming utilities for the entire application
 */

export const MUSCAT_BAY_COLORS = {
  // Primary Brand Colors (Deep Purple-Gray)
  primary: {
    DEFAULT: '#4E4456',        // Main brand color
    50: '#F8F7F8',            // Ultra light
    100: '#F1EEF2',           // Very light
    200: '#E3DCE5',           // Light
    300: '#D5CAD8',           // Medium light
    400: '#B69BB5',           // Medium
    500: '#4E4456',           // Default
    600: '#463D4D',           // Dark
    700: '#3B3241',           // Darker
    800: '#302833',           // Very dark
    900: '#251E26',           // Darkest
    light: '#7E708A',         // Lighter variant for hover states
    dark: '#3B3241',          // Darker variant for active states
  },
  
  // Secondary Colors (Soft Teal)
  secondary: {
    DEFAULT: '#A8D5E3',        // Soft teal for highlights
    50: '#F0F9FB',            // Ultra light teal
    100: '#E1F3F7',           // Very light teal
    200: '#C3E7EF',           // Light teal
    300: '#A8D5E3',           // Default soft teal
    400: '#7BB3C7',           // Medium teal
    500: '#5491AB',           // Darker teal
    600: '#3D6F8F',           // Deep teal
    700: '#2A4D73',           // Very deep teal
    800: '#1A2B57',           // Darkest teal
    900: '#0D093B',           // Ultra dark
    light: '#C3FBF4',         // Very light teal
    dark: '#7BB3C7',          // Darker teal
  },
  
  // Accent Colors (Muted Gold)
  accent: {
    DEFAULT: '#BFA181',        // Muted gold for warnings/accents
    50: '#FDFCFA',            // Ultra light gold
    100: '#F9F7F2',           // Very light gold
    200: '#F2F0EA',           // Light gold/cream
    300: '#E5E0D5',           // Medium light gold
    400: '#D1C7B0',           // Medium gold
    500: '#BFA181',           // Default muted gold
    600: '#A68B5B',           // Darker gold
    700: '#8D7540',           // Deep gold
    800: '#745F28',           // Very deep gold
    900: '#5B4913',           // Darkest gold
    light: '#F2F0EA',         // Light cream
    dark: '#A68B5B',          // Darker gold
  },
  
  // Status Colors
  status: {
    success: '#10B981',        // Green for positive metrics
    successLight: '#6EE7B7',
    successDark: '#047857',
    warning: '#F59E0B',        // Amber for warnings
    warningLight: '#FCD34D',
    warningDark: '#D97706',
    info: '#0A1828',          // Deep navy for information
    infoLight: '#3B82F6',
    infoDark: '#1E40AF',
    error: '#EF4444',         // Red for errors
    errorLight: '#F87171',
    errorDark: '#DC2626',
  },
  
  // Extended Brand Palette
  brand: {
    logoPurple: '#5f5168',     // Original logo purple
    logoTeal: '#A8D5E3',       // Logo teal accent
    logoGold: '#BFA181',       // Warm gold
    logoCream: '#F2F0EA',      // Light cream
    logoNavy: '#0A1828',       // Deep navy
    logoWhite: '#ffffff',      // Pure white
  },
  
  // Chart Colors - Muscat Bay themed
  chart: [
    '#4E4456', // Primary purple
    '#A8D5E3', // Teal
    '#BFA181', // Gold
    '#0A1828', // Navy
    '#5f5168', // Logo purple
    '#C3FBF4', // Light teal
    '#F2F0EA', // Cream
    '#10B981', // Success green
    '#EF4444', // Error red
    '#6A5ACD', // Accent purple
  ],
};

// CSS Class Utilities
export const MUSCAT_BAY_CLASSES = {
  // Card styles
  card: 'bg-white rounded-xl shadow-muscat hover:shadow-muscat-lg transition-all duration-300 border border-slate-100',
  cardHover: 'transform hover:-translate-y-1',
  
  // Button styles
  buttonPrimary: 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 shadow-muscat hover:shadow-muscat-lg transform hover:scale-105',
  buttonSecondary: 'bg-gradient-to-r from-secondary-400 to-secondary-500 hover:from-secondary-500 hover:to-secondary-600 text-slate-800 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 shadow-muscat hover:shadow-muscat-lg transform hover:scale-105',
  buttonAccent: 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-slate-800 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 shadow-muscat hover:shadow-muscat-lg transform hover:scale-105',
  
  // Input styles
  input: 'border-2 border-slate-300 bg-white text-slate-900 rounded-lg px-4 py-2.5 transition-all duration-200 outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/30',
  
  // Badge styles
  badgePrimary: 'bg-primary-100 text-primary-800 border-primary-200 px-3 py-1 rounded-full text-xs font-medium border',
  badgeSecondary: 'bg-secondary-100 text-secondary-800 border-secondary-200 px-3 py-1 rounded-full text-xs font-medium border',
  badgeSuccess: 'bg-green-100 text-green-800 border-green-200 px-3 py-1 rounded-full text-xs font-medium border',
  badgeWarning: 'bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1 rounded-full text-xs font-medium border',
  badgeError: 'bg-red-100 text-red-800 border-red-200 px-3 py-1 rounded-full text-xs font-medium border',
  
  // Text styles
  textPrimary: 'text-primary-600',
  textSecondary: 'text-secondary-600',
  textAccent: 'text-accent-600',
  
  // Background styles
  bgPrimary: 'bg-primary-500',
  bgSecondary: 'bg-secondary-400',
  bgAccent: 'bg-accent-500',
  
  // Gradient styles
  gradientPrimary: 'bg-gradient-to-r from-primary-500 to-primary-600',
  gradientSecondary: 'bg-gradient-to-r from-secondary-400 to-secondary-500',
  gradientAccent: 'bg-gradient-to-r from-accent-500 to-accent-600',
};

// Theme utilities
export const getMuscatBayTheme = () => ({
  colors: MUSCAT_BAY_COLORS,
  classes: MUSCAT_BAY_CLASSES,
});

// Category badge color mapping
export const getCategoryBadgeColor = (category) => {
  const categoryColors = {
    'Pumping Station': 'bg-blue-50 text-blue-700 border-blue-200',
    'Lifting Station': 'bg-green-50 text-green-700 border-green-200',
    'Apartment': 'bg-purple-50 text-purple-700 border-purple-200',
    'Street Light': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Beachwell': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Central Park': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'CIF Kitchen': 'bg-orange-50 text-orange-700 border-orange-200',
    'Security Building': 'bg-red-50 text-red-700 border-red-200',
    'Village Square': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Irrigation Tank': 'bg-teal-50 text-teal-700 border-teal-200',
    'Actuator DB': 'bg-pink-50 text-pink-700 border-pink-200',
    'Guard House': 'bg-slate-50 text-slate-700 border-slate-200',
    'ROP Building': 'bg-gray-50 text-gray-700 border-gray-200',
    'Zone Light': 'bg-amber-50 text-amber-700 border-amber-200',
    'Bank Muscat': 'bg-violet-50 text-violet-700 border-violet-200',
    'Helipad': 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return categoryColors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
};

// Status indicator colors
export const getStatusColor = (status) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    pending: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-purple-100 text-purple-800 border-purple-200',
    expired: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return statusColors[status] || statusColors.inactive;
};

// Chart color generator
export const getChartColor = (index) => {
  return MUSCAT_BAY_COLORS.chart[index % MUSCAT_BAY_COLORS.chart.length];
};

// Rank badge helper
export const getRankBadge = (rank) => {
  if (rank === 1) return { 
    icon: '👑', 
    class: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg', 
    label: 'Champion' 
  };
  if (rank === 2) return { 
    icon: '🥈', 
    class: 'bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-md', 
    label: 'Runner-up' 
  };
  if (rank === 3) return { 
    icon: '🥉', 
    class: 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-md', 
    label: 'Third Place' 
  };
  return { 
    icon: '', 
    class: 'bg-gradient-to-r from-slate-400 to-slate-600 text-white', 
    label: `#${rank}` 
  };
};

// Performance score color
export const getPerformanceColor = (score) => {
  if (score >= 90) return 'text-green-600 bg-green-100';
  if (score >= 70) return 'text-blue-600 bg-blue-100';
  if (score >= 50) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
};

// Loading states
export const LOADING_STATES = {
  spinner: 'animate-spin rounded-full border-4 border-slate-200 border-t-primary-500',
  pulse: 'animate-pulse bg-slate-200 rounded',
  shimmer: 'bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer',
};

// Animation utilities
export const ANIMATIONS = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  bounceSubtle: 'animate-bounce-subtle',
  float: 'animate-float',
  glow: 'animate-glow',
};

// Responsive breakpoints
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Shadow utilities
export const SHADOWS = {
  muscat: 'shadow-muscat',
  muscatLg: 'shadow-muscat-lg',
  muscatXl: 'shadow-muscat-xl',
};

// Common component props
export const getCommonProps = (variant = 'default') => {
  const variants = {
    default: {
      className: MUSCAT_BAY_CLASSES.card,
    },
    primary: {
      className: `${MUSCAT_BAY_CLASSES.card} border-primary-200 bg-primary-50`,
    },
    secondary: {
      className: `${MUSCAT_BAY_CLASSES.card} border-secondary-200 bg-secondary-50`,
    },
    accent: {
      className: `${MUSCAT_BAY_CLASSES.card} border-accent-200 bg-accent-50`,
    },
  };
  
  return variants[variant] || variants.default;
};

// Export default theme object
export default {
  colors: MUSCAT_BAY_COLORS,
  classes: MUSCAT_BAY_CLASSES,
  utilities: {
    getCategoryBadgeColor,
    getStatusColor,
    getChartColor,
    getRankBadge,
    getPerformanceColor,
    getCommonProps,
  },
  constants: {
    LOADING_STATES,
    ANIMATIONS,
    BREAKPOINTS,
    SHADOWS,
  },
};