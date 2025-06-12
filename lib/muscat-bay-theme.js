/**
 * Muscat Bay Design System Utilities
 * Complete color scheme and styling utilities for the Muscat Bay Operations Management System
 */

// ===============================
// MUSCAT BAY BRAND COLORS
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
  
  // Secondary - Soft Teal
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
  
  // Accent - Muted Gold
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
  ]
};

// ===============================
// COMPONENT STYLE UTILITIES
// ===============================

export const MUSCAT_BAY_STYLES = {
  // Card styles
  card: {
    base: 'bg-white rounded-xl border border-slate-100 transition-all duration-300',
    shadow: 'shadow-muscat hover:shadow-muscat-lg',
    interactive: 'hover:-translate-y-1 transform',
  },
  
  // Button styles
  button: {
    primary: 'bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-muscat hover:shadow-muscat-lg transform hover:scale-105',
    secondary: 'bg-secondary hover:bg-secondary-dark text-slate-800 font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-muscat hover:shadow-muscat-lg',
    accent: 'bg-accent hover:bg-accent-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-muscat hover:shadow-muscat-lg',
    ghost: 'text-primary hover:bg-primary/10 hover:text-primary-dark font-medium py-2 px-3 rounded-lg transition-all duration-200',
  },
  
  // Input styles
  input: {
    base: 'w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-light focus:border-primary-light focus:outline-none bg-white text-slate-700 transition-all duration-200',
    error: 'border-error focus:ring-error focus:border-error',
    success: 'border-success focus:ring-success focus:border-success',
  },
  
  // Badge styles
  badge: {
    primary: 'bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20',
    secondary: 'bg-secondary/10 text-secondary-800 px-3 py-1 rounded-full text-xs font-medium border border-secondary/20',
    success: 'bg-success/10 text-success px-3 py-1 rounded-full text-xs font-medium border border-success/20',
    warning: 'bg-warning/10 text-warning px-3 py-1 rounded-full text-xs font-medium border border-warning/20',
    error: 'bg-error/10 text-error px-3 py-1 rounded-full text-xs font-medium border border-error/20',
  },
  
  // Navigation styles
  nav: {
    item: 'flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ease-in-out group hover:text-white',
    active: 'bg-primary text-white shadow-muscat',
    inactive: 'text-white hover:bg-primary-light',
  },
  
  // Table styles
  table: {
    container: 'bg-white rounded-xl shadow-muscat-lg border border-slate-100 overflow-hidden',
    header: 'bg-gradient-to-r from-primary via-primary-light to-secondary text-white',
    row: 'hover:bg-slate-50/50 transition-colors group',
    cell: 'p-4 text-slate-700',
    stickyColumn: 'sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-100',
  },
  
  // Modal styles
  modal: {
    overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4',
    container: 'bg-white p-6 rounded-2xl shadow-muscat-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto',
    header: 'flex justify-between items-center mb-6',
    title: 'text-2xl font-bold text-primary flex items-center gap-3',
  },
};

// ===============================
// CATEGORY COLOR MAPPING
// ===============================

export const CATEGORY_COLORS = {
  'Pumping Station': 'bg-blue-50 text-blue-700 border border-blue-200',
  'Lifting Station': 'bg-green-50 text-green-700 border border-green-200', 
  'Apartment': 'bg-purple-50 text-purple-700 border border-purple-200',
  'Street Light': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  'Beachwell': 'bg-cyan-50 text-cyan-700 border border-cyan-200',
  'Central Park': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'CIF Kitchen': 'bg-orange-50 text-orange-700 border border-orange-200',
  'Security Building': 'bg-red-50 text-red-700 border border-red-200',
  'Village Square': 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  'Irrigation Tank': 'bg-teal-50 text-teal-700 border border-teal-200',
  'Actuator DB': 'bg-pink-50 text-pink-700 border border-pink-200',
  'Guard House': 'bg-slate-50 text-slate-700 border border-slate-200',
  'ROP Building': 'bg-violet-50 text-violet-700 border border-violet-200',
  'Zone Light': 'bg-amber-50 text-amber-700 border border-amber-200',
  'Bank Muscat': 'bg-lime-50 text-lime-700 border border-lime-200',
  'Helipad': 'bg-rose-50 text-rose-700 border border-rose-200',
  'Other': 'bg-gray-50 text-gray-700 border border-gray-200',
};

// ===============================
// UTILITY FUNCTIONS
// ===============================

export const muscatBayUtils = {
  /**
   * Get category color class
   */
  getCategoryColor: (category) => {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS['Other'];
  },
  
  /**
   * Get rank badge styling based on position
   */
  getRankBadge: (index) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg ring-2 ring-yellow-300';
    if (index === 1) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-md ring-2 ring-gray-200';
    if (index === 2) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-md ring-2 ring-orange-300';
    return 'bg-gradient-to-r from-primary to-primary-dark text-white';
  },
  
  /**
   * Format large numbers with appropriate units
   */
  formatNumber: (num, decimals = 0) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(decimals) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(decimals) + 'K';
    }
    return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
  },
  
  /**
   * Get status color based on performance
   */
  getStatusColor: (value, thresholds = { good: 80, average: 60 }) => {
    if (value >= thresholds.good) return 'text-success';
    if (value >= thresholds.average) return 'text-warning';
    return 'text-error';
  },
  
  /**
   * Generate consistent chart colors
   */
  getChartColor: (index) => {
    return MUSCAT_BAY_COLORS.chart[index % MUSCAT_BAY_COLORS.chart.length];
  },
  
  /**
   * Get appropriate text contrast for background
   */
  getTextContrast: (backgroundColor) => {
    // Simple contrast check - in production, you might want a more sophisticated algorithm
    const lightColors = ['#A8D5E3', '#BFA181', '#F2F0EA', '#C3FBF4'];
    return lightColors.includes(backgroundColor) ? 'text-slate-800' : 'text-white';
  },
};

// ===============================
// RESPONSIVE BREAKPOINTS
// ===============================

export const MUSCAT_BAY_BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ===============================
// ANIMATION CONFIGURATIONS
// ===============================

export const MUSCAT_BAY_ANIMATIONS = {
  // Hover animations
  hover: {
    scale: 'hover:scale-105 transition-transform duration-200',
    lift: 'hover:-translate-y-1 transition-transform duration-300',
    glow: 'hover:shadow-muscat-lg transition-shadow duration-300',
  },
  
  // Loading animations
  loading: {
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    spin: 'animate-spin',
  },
  
  // Page transitions
  page: {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
  },
};

// ===============================
// COMMON COMPONENT CONFIGURATIONS
// ===============================

export const MUSCAT_BAY_COMPONENTS = {
  // Summary Card configuration
  summaryCard: {
    baseClass: 'bg-white p-6 rounded-xl shadow-muscat hover:shadow-muscat-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-slate-100 group',
    iconContainer: 'p-3 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-200',
    title: 'text-slate-500 font-semibold text-sm',
    value: 'text-2xl sm:text-3xl font-bold text-slate-800 mb-1.5',
    unit: 'text-base font-medium text-slate-500',
    trend: 'text-xs sm:text-sm font-medium',
  },
  
  // Chart wrapper configuration
  chartWrapper: {
    baseClass: 'bg-white p-6 rounded-xl shadow-muscat hover:shadow-muscat-xl transition-shadow border border-slate-100',
    title: 'text-xl font-semibold text-slate-700',
    subtitle: 'text-sm text-slate-500 mt-1',
    container: 'mt-4',
    height: '350px',
  },
  
  // Table configuration
  table: {
    container: 'bg-white rounded-xl shadow-muscat-lg border border-slate-100 overflow-hidden',
    scrollContainer: 'overflow-x-auto',
    minWidth: 'min-w-[900px]',
    header: 'bg-slate-100 border-b border-slate-200',
    headerCell: 'text-left p-4 font-semibold text-slate-700',
    row: 'hover:bg-slate-50/50 transition-colors group',
    cell: 'p-4',
    stickyColumn: 'sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-100',
  },
};

// Export all utilities as default
export default {
  colors: MUSCAT_BAY_COLORS,
  styles: MUSCAT_BAY_STYLES,
  categoryColors: CATEGORY_COLORS,
  utils: muscatBayUtils,
  breakpoints: MUSCAT_BAY_BREAKPOINTS,
  animations: MUSCAT_BAY_ANIMATIONS,
  components: MUSCAT_BAY_COMPONENTS,
};
