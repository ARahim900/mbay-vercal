// ===============================
// MUSCAT BAY THEME UTILITIES
// Complete theme system for consistent styling
// ===============================

export const MUSCAT_BAY_COLORS = {
  // Primary Brand Colors
  primary: {
    DEFAULT: '#4E4456',
    50: '#F8F7F8',
    100: '#F1EEF2',
    200: '#E3DDE6',
    300: '#D5CCD9',
    400: '#C7BBCC',
    500: '#B9AABF',
    600: '#A598AC',
    700: '#918699',
    800: '#7E708A',
    900: '#6B5E77',
    950: '#3B3241',
    light: '#7E708A',
    dark: '#3B3241',
  },
  
  // Secondary Teal Colors
  secondary: {
    DEFAULT: '#A8D5E3',
    50: '#F7FDFE',
    100: '#EEFBFC',
    200: '#DDF7F9',
    300: '#CCF3F6',
    400: '#BBEFF3',
    500: '#A8D5E3',
    600: '#7BB3C7',
    700: '#5E91AB',
    800: '#416F8F',
    900: '#244D73',
    light: '#C3FBF4',
    dark: '#7BB3C7',
  },
  
  // Accent Gold Colors
  accent: {
    DEFAULT: '#BFA181',
    50: '#FDF9F6',
    100: '#FBF3ED',
    200: '#F7E7DB',
    300: '#F3DBC9',
    400: '#EFCFB7',
    500: '#BFA181',
    600: '#A68B5B',
    700: '#8D7535',
    800: '#745F0F',
    900: '#5B4900',
    light: '#F2F0EA',
    dark: '#A68B5B',
  },
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0A1828',
  
  // Chart Colors
  chart: [
    '#4E4456', '#A8D5E3', '#BFA181', '#0A1828', '#5f5168',
    '#C3FBF4', '#F2F0EA', '#10B981', '#EF4444', '#6A5ACD'
  ]
};

// Component Style Presets
export const MUSCAT_BAY_STYLES = {
  // Button Styles
  buttons: {
    primary: 'bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-muscat hover:shadow-muscat-lg transform hover:scale-105',
    secondary: 'bg-secondary hover:bg-secondary-dark text-slate-800 font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-muscat hover:shadow-muscat-lg',
    accent: 'bg-accent hover:bg-accent-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-muscat hover:shadow-muscat-lg',
    ghost: 'text-primary hover:bg-primary/10 hover:text-primary-dark font-medium py-2 px-3 rounded-lg transition-all duration-200',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200'
  },
  
  // Card Styles
  cards: {
    default: 'bg-white p-6 rounded-xl shadow-muscat hover:shadow-muscat-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-slate-100',
    interactive: 'bg-white p-6 rounded-xl shadow-muscat hover:shadow-muscat-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-slate-100 group cursor-pointer',
    elevated: 'bg-white p-8 rounded-2xl shadow-muscat-xl border border-slate-100',
    minimal: 'bg-white p-4 rounded-lg shadow-muscat border border-slate-100'
  },
  
  // Input Styles
  inputs: {
    default: 'w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-light focus:border-primary-light focus:outline-none bg-white text-slate-700 transition-all duration-200 hover:border-primary-light',
    search: 'w-full p-3 pl-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-light focus:border-primary-light focus:outline-none bg-white text-slate-700 transition-all duration-200',
    select: 'appearance-none w-full p-2.5 pr-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-light focus:border-primary-light focus:outline-none bg-white text-slate-700 transition-all duration-200'
  },
  
  // Badge Styles
  badges: {
    primary: 'bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20',
    secondary: 'bg-secondary/10 text-secondary-800 px-3 py-1 rounded-full text-xs font-medium border border-secondary/20',
    accent: 'bg-accent/10 text-accent-700 px-3 py-1 rounded-full text-xs font-medium border border-accent/20',
    success: 'bg-success/10 text-success px-3 py-1 rounded-full text-xs font-medium border border-success/20',
    warning: 'bg-warning/10 text-warning px-3 py-1 rounded-full text-xs font-medium border border-warning/20',
    error: 'bg-error/10 text-error px-3 py-1 rounded-full text-xs font-medium border border-error/20'
  },
  
  // Table Styles
  tables: {
    container: 'bg-white rounded-xl shadow-muscat-lg border border-slate-100 overflow-hidden',
    header: 'bg-gradient-to-r from-primary via-primary-light to-secondary text-white',
    row: 'hover:bg-slate-50/50 transition-colors group',
    cell: 'p-4 text-slate-700',
    stickyCell: 'sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-100'
  },
  
  // Modal Styles
  modals: {
    overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4',
    container: 'bg-white p-6 rounded-2xl shadow-muscat-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto',
    header: 'flex justify-between items-center mb-6',
    title: 'text-2xl font-bold text-primary flex items-center gap-3'
  },
  
  // Navigation Styles
  navigation: {
    item: 'flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ease-in-out group hover:text-white',
    active: 'bg-primary text-white shadow-muscat',
    inactive: 'text-white hover:bg-primary-light'
  }
};

// Utility Functions
export const muscatBayUtils = {
  // Get color for charts
  getChartColor: (index) => {
    return MUSCAT_BAY_COLORS.chart[index % MUSCAT_BAY_COLORS.chart.length];
  },
  
  // Get category badge style
  getCategoryBadgeStyle: (category) => {
    const styles = {
      'Pumping Station': MUSCAT_BAY_STYLES.badges.primary,
      'Lifting Station': MUSCAT_BAY_STYLES.badges.success,
      'Apartment': MUSCAT_BAY_STYLES.badges.secondary,
      'Street Light': MUSCAT_BAY_STYLES.badges.warning,
      'Beachwell': 'bg-info/10 text-info px-3 py-1 rounded-full text-xs font-medium border border-info/20',
      'Central Park': MUSCAT_BAY_STYLES.badges.success,
      'CIF Kitchen': MUSCAT_BAY_STYLES.badges.accent,
      'Security Building': MUSCAT_BAY_STYLES.badges.error,
      'Village Square': 'bg-muscat-purple/10 text-muscat-purple px-3 py-1 rounded-full text-xs font-medium border border-muscat-purple/20',
    };
    return styles[category] || 'bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200';
  },
  
  // Get rank badge style
  getRankBadgeStyle: (rank) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-lg ring-4 ring-yellow-300/50';
    if (rank === 2) return 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 text-white shadow-lg ring-4 ring-slate-300/50';
    if (rank === 3) return 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-lg ring-4 ring-orange-300/50';
    return 'bg-gradient-to-br from-primary via-primary-light to-primary-dark text-white shadow-muscat';
  },
  
  // Get status color
  getStatusColor: (status) => {
    const statusMap = {
      active: MUSCAT_BAY_COLORS.success,
      inactive: MUSCAT_BAY_COLORS.error,
      pending: MUSCAT_BAY_COLORS.warning,
      completed: MUSCAT_BAY_COLORS.success,
      cancelled: MUSCAT_BAY_COLORS.error
    };
    return statusMap[status.toLowerCase()] || MUSCAT_BAY_COLORS.primary;
  },
  
  // Format numbers with commas
  formatNumber: (num) => {
    return new Intl.NumberFormat().format(num);
  },
  
  // Format currency
  formatCurrency: (amount, currency = 'OMR') => {
    return `${amount.toFixed(2)} ${currency}`;
  },
  
  // Get performance indicator
  getPerformanceIndicator: (value, max) => {
    const percentage = (value / max) * 100;
    if (percentage >= 90) return { color: 'success', label: 'Excellent', icon: '⭐' };
    if (percentage >= 70) return { color: 'warning', label: 'Good', icon: '🟡' };
    if (percentage >= 50) return { color: 'info', label: 'Average', icon: '🔵' };
    return { color: 'error', label: 'Poor', icon: '🔴' };
  }
};

// Animation Classes
export const MUSCAT_BAY_ANIMATIONS = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  bounceSubtle: 'animate-bounce-subtle',
  glow: 'animate-glow',
  float: 'animate-float',
  pulse: 'animate-pulse',
  
  // Hover Effects
  hoverScale: 'transition-transform hover:scale-105',
  hoverLift: 'transition-all hover:-translate-y-1',
  hoverShadow: 'transition-shadow hover:shadow-muscat-lg',
  
  // Combined Effects
  cardHover: 'transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-muscat-lg',
  buttonHover: 'transition-all duration-200 transform hover:scale-105 hover:shadow-muscat'
};

// Responsive Breakpoints
export const MUSCAT_BAY_BREAKPOINTS = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px'
};

// Icon Size Standards
export const MUSCAT_BAY_ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48
};

// Typography Scales
export const MUSCAT_BAY_TYPOGRAPHY = {
  headings: {
    h1: 'text-3xl md:text-4xl font-bold text-slate-800',
    h2: 'text-2xl md:text-3xl font-bold text-slate-800',
    h3: 'text-xl md:text-2xl font-semibold text-slate-700',
    h4: 'text-lg md:text-xl font-semibold text-slate-700',
    h5: 'text-base md:text-lg font-medium text-slate-700',
    h6: 'text-sm md:text-base font-medium text-slate-700'
  },
  
  body: {
    large: 'text-lg text-slate-600',
    default: 'text-base text-slate-600',
    small: 'text-sm text-slate-500',
    xs: 'text-xs text-slate-500'
  },
  
  labels: {
    default: 'text-sm font-medium text-slate-700',
    required: 'text-sm font-medium text-slate-700 after:content-["*"] after:text-error after:ml-1',
    optional: 'text-sm font-medium text-slate-500'
  }
};

// Component Size Variants
export const MUSCAT_BAY_SIZES = {
  buttons: {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2.5 px-4 text-sm',
    lg: 'py-3 px-6 text-base',
    xl: 'py-4 px-8 text-lg'
  },
  
  inputs: {
    sm: 'p-2 text-sm',
    md: 'p-2.5 text-sm',
    lg: 'p-3 text-base',
    xl: 'p-4 text-lg'
  },
  
  cards: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }
};

// Layout Constants
export const MUSCAT_BAY_LAYOUT = {
  sidebar: {
    collapsed: 'w-16',
    expanded: 'w-64',
    transition: 'transition-all duration-300 ease-in-out'
  },
  
  header: {
    height: 'h-16',
    mobile: 'h-14'
  },
  
  content: {
    padding: 'p-6 md:p-8',
    maxWidth: 'max-w-7xl mx-auto'
  }
};

// Export default object with all utilities
export default {
  colors: MUSCAT_BAY_COLORS,
  styles: MUSCAT_BAY_STYLES,
  utils: muscatBayUtils,
  animations: MUSCAT_BAY_ANIMATIONS,
  breakpoints: MUSCAT_BAY_BREAKPOINTS,
  iconSizes: MUSCAT_BAY_ICON_SIZES,
  typography: MUSCAT_BAY_TYPOGRAPHY,
  sizes: MUSCAT_BAY_SIZES,
  layout: MUSCAT_BAY_LAYOUT
};
